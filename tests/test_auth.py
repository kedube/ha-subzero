"""Exercise B2C's form journey and browser-compatible cookies."""

import hashlib
import json
from base64 import urlsafe_b64encode
from urllib.parse import urlencode

import aiohttp
import pytest
from aiohttp import web
from homeassistant.helpers.aiohttp_client import async_create_clientsession, async_get_clientsession

from custom_components.subzero import auth


@pytest.fixture
async def login_client():
    async with (
        aiohttp.ClientSession(
            cookie_jar=aiohttp.CookieJar(quote_cookie=False, unsafe=True)
        ) as session,
        aiohttp.ClientSession() as token_session,
    ):
        yield auth.SubZeroLogin(session, token_session)


@pytest.fixture
async def login_server(aiohttp_server, monkeypatch, socket_enabled):
    journey = {
        "failure": None,
        "form_accepted": False,
        "exchanged": False,
        "requests": [],
        "captcha_required": True,
        "call_polls": 0,
        "call_poll_statuses": ["449", "200"],
    }

    @web.middleware
    async def record_headers(request, handler):
        journey["requests"].append((request.path, request.headers.copy()))
        if journey.get("response_path") == request.path:
            return web.Response(text=journey["response_body"], status=journey["response_status"])
        return await handler(request)

    async def start(request):
        raise web.HTTPFound("/authorize?" + request.query_string)

    async def authorize(request):
        journey.update(request.query)
        journey["authorize_url"] = str(request.url)
        settings = {
            "api": "CombinedSigninAndSignup",
            "hosts": {"tenant": "/policy", "policy": "test-policy"},
            "csrf": "test-csrf",
            "transId": "test-transaction",
        }
        response = web.Response(text="SETTINGS = " + json.dumps(settings) + ";")
        response.headers.add("Set-Cookie", "x-ms-cpim-csrf=abc==; Path=/")
        return response

    async def form(request):
        assert request.headers["X-CSRF-TOKEN"] == "test-csrf"
        assert request.headers["Referer"] == journey["authorize_url"]
        assert "x-ms-cpim-csrf=abc==" in request.headers["Cookie"]
        assert 'x-ms-cpim-csrf="' not in request.headers["Cookie"]
        assert request.query == {"tx": "test-transaction", "p": "test-policy"}
        data = await request.post()
        assert data["signInName"] == "owner@example.test"
        assert data["password"] == "test-only-password"
        journey["form_accepted"] = True
        status = "400" if journey["failure"] == "password" else "200"
        return web.Response(text=json.dumps({"status": status}), content_type="text/json")

    async def confirmed(request):
        assert journey["form_accepted"]
        if journey["failure"] == "mfa":
            return web.Response(text='SETTINGS = {"api":"SelfAsserted"};')
        if journey["failure"] == "phonefactor":
            settings = {
                "api": "Phonefactor",
                "hosts": {"tenant": "/policy", "policy": "test-policy"},
                "csrf": "mfa-csrf",
                "transId": "mfa-transaction",
                "config": {
                    "enableCaptchaChallenge": str(journey["captcha_required"]).lower(),
                    "pollIntervalInMilliseconds": "0",
                    "pollLimit": "2",
                },
            }
            uv_phone = {"PhoneNumbers": [{"Id": 1, "MaskedNumber": "XXX-XXX-4550"}]}
            return web.Response(
                text=f"SETTINGS = {json.dumps(settings)}; UV_PHONE = {json.dumps(uv_phone)};"
            )
        state = "wrong-state" if journey["failure"] == "state" else journey["state"]
        raise web.HTTPFound(auth.REDIRECT_URI + "?" + urlencode({"state": state, "code": "code"}))

    async def get_captcha(request):
        assert request.headers["X-CSRF-TOKEN"] == "mfa-csrf"
        assert "Origin" not in request.headers
        assert request.query == {
            "tx": "mfa-transaction",
            "p": "test-policy",
            "challengeType": "Visual",
        }
        return web.json_response(
            {
                "status": "200",
                "challengeId": "challenge-1",
                "challengeString": "data:image/png;base64,iVBORw0KGgo=",
                "azureregion": "SouthCentralUS",
            }
        )

    async def verify_captcha(request):
        assert request.headers["X-CSRF-TOKEN"] == "mfa-csrf"
        assert request.headers["Origin"] == auth.LOGIN_ORIGIN
        assert request.query == {"tx": "mfa-transaction", "p": "test-policy"}
        data = await request.post()
        assert data["challengeId"] == "challenge-1"
        assert data["challengeType"] == "Visual"
        solved = data["captchaEntered"] == "ABCD"
        return web.json_response(
            {
                "status": "200",
                "challengeId": "challenge-1",
                "isCaptchaSolved": "True" if solved else "False",
                "reason": "Solved" if solved else "WrongAnswer",
            }
        )

    async def phonefactor_verify(request):
        assert request.headers["X-CSRF-TOKEN"] == "mfa-csrf"
        assert request.headers["Origin"] == auth.LOGIN_ORIGIN
        assert request.query == {"tx": "mfa-transaction", "p": "test-policy"}
        data = await request.post()
        if data["request_type"] == "VERIFICATION_REQUEST":
            assert data["id"] == "1"
            assert data["auth_type"] in ("onewaysms", "dialphone")
            journey["mfa_requested"] = data["auth_type"]
            return web.json_response({"status": journey.get("verify_request_status", "200")})
        assert data["request_type"] == "VALIDATION_REQUEST"
        if "verification_code" in data:
            if data["verification_code"] != "123456":
                return web.json_response({"status": "449"})
            journey["mfa_validated"] = True
            return web.json_response({"status": "200"})
        polls = journey["call_polls"] + 1
        journey["call_polls"] = polls
        statuses = journey["call_poll_statuses"]
        status = statuses[min(polls - 1, len(statuses) - 1)]
        if status == "200":
            journey["mfa_validated"] = True
        return web.json_response({"status": status})

    async def phonefactor_confirmed(request):
        assert journey.get("mfa_validated")
        assert request.query == {
            "csrf_token": "mfa-csrf",
            "tx": "mfa-transaction",
            "p": "test-policy",
        }
        raise web.HTTPFound(
            auth.REDIRECT_URI + "?" + urlencode({"state": journey["state"], "code": "code"})
        )

    async def token(request):
        data = await request.post()
        challenge = (
            urlsafe_b64encode(hashlib.sha256(data["code_verifier"].encode()).digest())
            .decode()
            .rstrip("=")
        )
        assert journey["code_challenge"] == challenge
        assert journey["code_challenge_method"] == "S256"
        assert data["redirect_uri"] == auth.REDIRECT_URI
        journey["exchanged"] = True
        return web.json_response(
            {"id_token": "test-id", "access_token": "test-access", "refresh_token": "test-refresh"}
        )

    app = web.Application(middlewares=[record_headers])
    app.router.add_get("/start", start)
    app.router.add_get("/authorize", authorize)
    app.router.add_post("/policy/SelfAsserted", form)
    app.router.add_get("/policy/api/CombinedSigninAndSignup/confirmed", confirmed)
    app.router.add_get(
        "/policy/SelfAsserted/DisplayControlAction/vbeta/"
        "captchaControlChallengeCode/GetChallenge",
        get_captcha,
    )
    app.router.add_post(
        "/policy/SelfAsserted/DisplayControlAction/vbeta/"
        "captchaControlChallengeCode/VerifyChallenge",
        verify_captcha,
    )
    app.router.add_post("/policy/Phonefactor/verify", phonefactor_verify)
    app.router.add_get("/policy/api/Phonefactor/confirmed", phonefactor_confirmed)
    app.router.add_post("/token", token)
    server = await aiohttp_server(app)
    origin = str(server.make_url("/")).rstrip("/")
    monkeypatch.setattr(auth, "LOGIN_ORIGIN", origin)
    monkeypatch.setattr(auth, "AUTHORIZE_URL", origin + "/authorize")
    monkeypatch.setattr(auth, "TOKEN_URL", origin + "/token")
    return journey


async def test_password_login_through_the_b2c_form(login_server, login_client):
    tokens = await login_client.login("owner@example.test", "test-only-password")
    assert tokens["refresh_token"] == "test-refresh"
    assert login_server["exchanged"]
    assert "password" not in tokens


async def test_login_headers_override_home_assistant_through_redirects(
    hass, login_server, monkeypatch
):
    monkeypatch.setattr(auth, "AUTHORIZE_URL", auth.LOGIN_ORIGIN + "/start")
    session = async_create_clientsession(
        hass, cookie_jar=aiohttp.CookieJar(quote_cookie=False, unsafe=True)
    )
    token_session = async_get_clientsession(hass)
    original_headers = dict(session.headers)
    original_token_headers = dict(token_session.headers)
    await auth.SubZeroLogin(session, token_session).login(
        "owner@example.test", "test-only-password"
    )
    assert dict(session.headers) == original_headers
    assert dict(token_session.headers) == original_token_headers
    browser_paths = [
        "/start",
        "/authorize",
        "/policy/SelfAsserted",
        "/policy/api/CombinedSigninAndSignup/confirmed",
    ]
    assert [path for path, _ in login_server["requests"]] == [*browser_paths, "/token"]
    for path, headers in login_server["requests"]:
        if path in browser_paths:
            assert headers.getall("User-Agent") == [
                "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 "
                "(KHTML, like Gecko) Chrome/153.0.0.0 Mobile Safari/537.36"
            ]
            assert headers["Accept-Language"] == "en-US,en;q=0.9"
        else:
            assert headers.getall("User-Agent") == [
                "Dalvik/2.1.0 (Linux; U; Android 16; Pixel 9 Build/BP2A.250605.031.A2)"
            ]
            assert headers["Accept"] == "application/json"
            assert headers["Accept-Encoding"] == "gzip"
            assert "Cookie" not in headers
            assert "X-CSRF-TOKEN" not in headers
        assert not {"Authorization", "Userid", "Ocp-Apim-Subscription-Key"} & headers.keys()


@pytest.mark.parametrize(
    ("failure", "exception"),
    [
        ("password", auth.InvalidAuth),
        ("mfa", auth.LoginChallenge),
        ("state", auth.LoginError),
    ],
)
async def test_rejects_failed_login(login_server, login_client, failure, exception):
    login_server["failure"] = failure
    with pytest.raises(exception):
        await login_client.login("owner@example.test", "test-only-password")
    assert login_server["form_accepted"]
    assert not login_server["exchanged"]


async def test_rejects_external_redirect_without_requesting_it(login_client):
    with pytest.raises(auth.LoginError, match="unsupported sign-in provider"):
        await login_client._navigate("https://unexpected.example.test/login")


@pytest.mark.parametrize(
    ("path", "body", "status"),
    [
        ("/authorize", 'SETTINGS = {"api":"CombinedSigninAndSignup"};', 200),
        ("/token", "<html>Temporarily unavailable</html>", 200),
        ("/token", "Service unavailable", 503),
    ],
)
async def test_bad_login_responses_report_connection_failure(
    login_server, login_client, path, body, status
):
    login_server.update(response_path=path, response_body=body, response_status=status)
    with pytest.raises(auth.LoginError) as error:
        await login_client.login("owner@example.test", "test-only-password")
    assert type(error.value) is auth.LoginError


async def test_phonefactor_sms_login_with_captcha(login_server, login_client):
    login_server["failure"] = "phonefactor"
    with pytest.raises(auth.LoginChallenge):
        await login_client.login("owner@example.test", "test-only-password")
    assert login_client.is_phonefactor_challenge
    assert login_client.masked_phone == "XXX-XXX-4550"
    assert login_client.captcha_required
    assert not login_client.captcha_solved

    image = await login_client.get_captcha_challenge()
    assert image == "data:image/png;base64,iVBORw0KGgo="

    with pytest.raises(auth.InvalidCaptcha):
        await login_client.request_mfa_verification("onewaysms", "WRONG")
    assert not login_client.captcha_solved

    await login_client.request_mfa_verification("onewaysms", "ABCD")
    assert not login_client.captcha_solved
    assert login_client.captcha_image == ""
    assert login_server["mfa_requested"] == "onewaysms"

    with pytest.raises(auth.InvalidVerificationCode):
        await login_client.verify_mfa_code("000000")
    with pytest.raises(auth.InvalidVerificationCode):
        await login_client.verify_mfa_code("000000")
    with pytest.raises(auth.MfaCallTimeout):
        await login_client.verify_mfa_code("000000")
    assert not login_server["exchanged"]

    await login_client.get_captcha_challenge()
    await login_client.request_mfa_verification("onewaysms", "ABCD")
    login_client.mfa_requested_at -= 200
    with pytest.raises(auth.MfaCallTimeout):
        await login_client.verify_mfa_code("000000")

    await login_client.get_captcha_challenge()
    await login_client.request_mfa_verification("onewaysms", "ABCD")
    tokens = await login_client.verify_mfa_code("123456")
    assert tokens["refresh_token"] == "test-refresh"
    assert login_server["exchanged"]


async def test_phonefactor_call_login_and_timeout(login_server, login_client):
    login_server["failure"] = "phonefactor"
    login_server["captcha_required"] = False
    with pytest.raises(auth.LoginChallenge):
        await login_client.login("owner@example.test", "test-only-password")
    assert login_client.is_phonefactor_challenge
    assert not login_client.captcha_required
    assert login_client.captcha_solved

    await login_client.request_mfa_verification("dialphone")
    assert login_server["mfa_requested"] == "dialphone"

    login_server["call_poll_statuses"] = ["449", "449"]
    with pytest.raises(auth.MfaCallTimeout):
        await login_client.poll_mfa_call()
    assert login_server["call_polls"] == 2
    assert not login_server["exchanged"]

    login_server["call_polls"] = 0
    login_server["call_poll_statuses"] = ["449", "200"]
    tokens = await login_client.poll_mfa_call()
    assert login_server["call_polls"] == 2
    assert tokens["refresh_token"] == "test-refresh"
    assert login_server["exchanged"]
