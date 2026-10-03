"""Sub-Zero's Azure B2C login, using the website's form requests."""

import asyncio
import hashlib
import json
import re
import secrets
import time
from base64 import b64decode, urlsafe_b64encode
from urllib.parse import parse_qs, urlencode, urljoin, urlsplit

import aiohttp

from .app_config import AUTH_HEADERS, LOGIN_HEADERS

LOGIN_ORIGIN = "https://login.subzero-wolf.com"
POLICY_BASE = LOGIN_ORIGIN + "/SubZeroB2CPrd.onmicrosoft.com/B2C_1A_SIGNUP_SIGNIN"
AUTHORIZE_URL = POLICY_BASE + "/oauth2/v2.0/authorize"
TOKEN_URL = POLICY_BASE + "/oauth2/v2.0/token"
CLIENT_ID = "6eefabd0-49a3-4b92-b329-81b9f638e940"
REDIRECT_URI = "com.szg.szgdigitalproductexperience://oauth/redirect"
SCOPES = "openid offline_access " + CLIENT_ID


class LoginError(Exception):
    """The sign-in service could not complete the request."""


class InvalidAuth(LoginError):
    """The sign-in service rejected the credentials or verification code."""


class InvalidCaptcha(InvalidAuth):
    """The sign-in service rejected the CAPTCHA challenge response."""


class InvalidVerificationCode(InvalidAuth):
    """The sign-in service rejected the MFA verification code."""


class MfaCallTimeout(LoginError):
    """The MFA verification was not completed in time or exhausted its retries."""


class LoginRateLimited(LoginError):
    """The sign-in service rate-limited verification attempts."""


class LoginChallenge(LoginError):
    """The sign-in journey requires another form step."""


def page_variable(page: str, name: str) -> dict:
    match = re.search(r"\b" + re.escape(name) + r"\s*=\s*", page)
    if not match:
        raise LoginError("The Sub-Zero sign-in page has changed.")
    try:
        value, _ = json.JSONDecoder().raw_decode(page[match.end() :])
    except ValueError:
        raise LoginError("The Sub-Zero sign-in page has changed.") from None
    if not isinstance(value, dict):
        raise LoginError("The Sub-Zero sign-in page has changed.")
    return value


class SubZeroLogin:
    """Keep login state in a session using CookieJar(quote_cookie=False).

    B2C rejects quoted cookie values that browsers send without quotes.
    Token requests use a separate session without the browser's cookies.
    """

    def __init__(self, session: aiohttp.ClientSession, token_session: aiohttp.ClientSession):
        self.session = session
        self.token_session = token_session
        self.settings: dict = {}
        self.last_page = ""
        self.last_url = ""
        self.state = secrets.token_urlsafe(32)
        self.nonce = secrets.token_urlsafe(32)
        self.verifier = secrets.token_urlsafe(48)
        self.phone_numbers: list[dict] = []
        self.captcha_required = False
        self.captcha_solved = False
        self.captcha_challenge_id = ""
        self.captcha_image = ""
        self.captcha_region = ""
        self.mfa_requested_at: float | None = None
        self.mfa_attempts = 0

    @property
    def is_phonefactor_challenge(self) -> bool:
        return self.settings.get("api") == "Phonefactor" and bool(self.phone_numbers)

    @property
    def masked_phone(self) -> str:
        if self.phone_numbers:
            return str(self.phone_numbers[0].get("MaskedNumber") or "your phone")
        return "your phone"

    async def login(self, username: str, password: str) -> dict:
        challenge = (
            urlsafe_b64encode(hashlib.sha256(self.verifier.encode()).digest()).decode().rstrip("=")
        )
        params = {
            "client_id": CLIENT_ID,
            "redirect_uri": REDIRECT_URI,
            "response_type": "code",
            "scope": SCOPES,
            "state": self.state,
            # B2C lists nonce as required; state and PKCE already bind the response.
            "nonce": self.nonce,
            "code_challenge": challenge,
            "code_challenge_method": "S256",
        }
        try:
            await self._navigate(AUTHORIZE_URL + "?" + urlencode(params))
            if self.settings.get("api") != "CombinedSigninAndSignup":
                raise LoginError("Sub-Zero returned an unexpected sign-in step.")
            await self._post_form(
                {"request_type": "RESPONSE", "signInName": username, "password": password}
            )
            return await self._confirm()
        except KeyError, TypeError, ValueError:
            raise LoginError("Sub-Zero returned an invalid sign-in response.") from None

    def _ajax_headers(self, *, include_origin: bool = True) -> dict[str, str]:
        settings = self.settings
        headers = {
            **LOGIN_HEADERS,
            "X-CSRF-TOKEN": settings["csrf"],
            "Referer": self.last_url,
            "X-Requested-With": "XMLHttpRequest",
            "Accept": "application/json, text/javascript, */*; q=0.01",
        }
        if include_origin:
            headers["Origin"] = LOGIN_ORIGIN
        if settings.get("isPageViewIdSentWithHeader"):
            headers["x-ms-cpim-pageviewid"] = settings["pageViewId"]
        return headers

    async def _request_json(
        self,
        method: str,
        path: str,
        *,
        params: dict[str, str],
        data: dict[str, str] | None = None,
    ) -> dict:
        headers = self._ajax_headers(include_origin=(method.upper() != "GET"))
        async with self.session.request(
            method,
            LOGIN_ORIGIN + path,
            params=params,
            headers=headers,
            data=data,
            allow_redirects=False,
        ) as response:
            if response.status != 200:
                raise LoginError(f"Sub-Zero's sign-in form returned HTTP {response.status}.")
            try:
                result = await response.json(content_type=None)
            except ValueError:
                raise LoginError("Sub-Zero returned an invalid sign-in response.") from None
        if not isinstance(result, dict):
            raise LoginError("Sub-Zero returned an invalid sign-in response.")
        return result

    async def _post_form(self, data: dict) -> None:
        settings = self.settings
        path = settings["hosts"]["tenant"] + "/SelfAsserted"
        params = {"tx": settings["transId"], "p": settings["hosts"]["policy"]}
        result = await self._request_json("POST", path, params=params, data=data)
        if str(result.get("status")) != "200":
            raise InvalidAuth("Sub-Zero did not accept the sign-in details.")

    async def get_captcha_challenge(self) -> str:
        self.captcha_challenge_id = ""
        self.captcha_image = ""
        try:
            settings = self.settings
            path = (
                settings["hosts"]["tenant"]
                + "/SelfAsserted/DisplayControlAction/vbeta/"
                + "captchaControlChallengeCode/GetChallenge"
            )
            params = {
                "tx": settings["transId"],
                "p": settings["hosts"]["policy"],
                "challengeType": "Visual",
            }
            result = await self._request_json("GET", path, params=params)
            if str(result.get("status")) != "200":
                raise LoginError("Sub-Zero could not generate a CAPTCHA challenge.")
            challenge_id = result["challengeId"]
            challenge_image = result["challengeString"]
            if not isinstance(challenge_id, str) or not isinstance(challenge_image, str):
                raise LoginError("Sub-Zero returned an invalid CAPTCHA challenge.")
            header, _, encoded = challenge_image.partition(",")
            if not encoded:
                encoded = header
                header = "data:image/png;base64"
            elif not header.startswith("data:image/"):
                raise LoginError("Sub-Zero returned an invalid CAPTCHA challenge.")
            b64decode(encoded, validate=True)
            self.captcha_challenge_id = challenge_id
            self.captcha_image = f"{header},{encoded}"
            # Phonefactor's JS reads t.azureRegion (camelCase), which is undefined when B2C
            # returns lowercase 'azureregion', resulting in an empty string in VerifyChallenge.
            self.captcha_region = str(result.get("azureRegion") or "")
            return self.captcha_image
        except KeyError, TypeError, ValueError:
            raise LoginError("Sub-Zero returned an invalid CAPTCHA response.") from None

    async def verify_captcha(self, captcha_code: str) -> None:
        if self.captcha_solved:
            return
        code = captcha_code.strip()
        if not code or not self.captcha_challenge_id:
            raise InvalidCaptcha("Enter the characters shown in the CAPTCHA image.")
        try:
            settings = self.settings
            path = (
                settings["hosts"]["tenant"]
                + "/SelfAsserted/DisplayControlAction/vbeta/"
                + "captchaControlChallengeCode/VerifyChallenge"
            )
            params = {"tx": settings["transId"], "p": settings["hosts"]["policy"]}
            data = {
                "challengeId": self.captcha_challenge_id,
                "captchaEntered": code,
                "challengeType": "Visual",
                "azureRegion": self.captcha_region,
            }
            result = await self._request_json("POST", path, params=params, data=data)
            status = str(result.get("status", ""))
            reason = str(result.get("reason") or result.get("errorCode") or "").lower()
            if (
                status == "200"
                and reason == "solved"
                and str(result.get("isCaptchaSolved", "")).lower() == "true"
                and result.get("challengeId") == self.captcha_challenge_id
            ):
                self.captcha_solved = True
                return
            if reason == "usermessageifbypass":
                self.captcha_solved = True
                return
            if reason in ("wronganswer", "nochallengesession") or status == "400":
                raise InvalidCaptcha("Sub-Zero did not accept the CAPTCHA characters.")
            raise LoginError("Sub-Zero could not verify the CAPTCHA challenge.")
        except KeyError, TypeError, ValueError:
            raise LoginError(
                "Sub-Zero returned an invalid CAPTCHA verification response."
            ) from None

    async def request_mfa_verification(
        self,
        auth_type: str = "onewaysms",
        captcha_code: str = "",
        phone_id: int | str | None = None,
    ) -> None:
        if self.captcha_required and not self.captcha_solved:
            await self.verify_captcha(captcha_code)
        try:
            settings = self.settings
            if phone_id is None:
                phone_id = self.phone_numbers[0]["Id"] if self.phone_numbers else 1
            path = settings["hosts"]["tenant"] + "/" + settings["api"] + "/verify"
            params = {"tx": settings["transId"], "p": settings["hosts"]["policy"]}
            data = {
                "request_type": "VERIFICATION_REQUEST",
                "auth_type": auth_type,
                "id": str(phone_id),
            }
            result = await self._request_json("POST", path, params=params, data=data)
            status = str(result.get("status", ""))
            if status == "200":
                self.captcha_solved = not self.captcha_required
                self.captcha_challenge_id = ""
                self.captcha_image = ""
                self.mfa_requested_at = time.monotonic()
                self.mfa_attempts = 0
                return
            if status == "429":
                raise LoginRateLimited("Sub-Zero rate-limited MFA verification requests.")
            if status == "448":
                raise LoginError("The phone number on record with Sub-Zero is unreachable.")
            raise LoginError("Sub-Zero could not start phone verification.")
        except KeyError, TypeError, ValueError:
            raise LoginError("Sub-Zero returned an invalid MFA verification response.") from None

    def _mfa_verification_expired(self) -> bool:
        config = (self.settings.get("config") if isinstance(self.settings, dict) else None) or {}
        try:
            retry_limit = max(1, int(config.get("retryLimit", 3)))
        except TypeError, ValueError:
            retry_limit = 3
        if self.mfa_attempts >= retry_limit:
            return True
        if self.mfa_requested_at is None:
            return False
        try:
            poll_interval = max(0.0, int(config.get("pollIntervalInMilliseconds", 5000)) / 1000.0)
            poll_limit = max(1, min(int(config.get("pollLimit", 20)), 20))
            timeout = poll_interval * poll_limit or 100.0
        except TypeError, ValueError:
            timeout = 100.0
        return (time.monotonic() - self.mfa_requested_at) >= timeout

    async def verify_mfa_code(self, verification_code: str) -> dict:
        code = verification_code.strip()
        if not code:
            raise InvalidVerificationCode("Enter the 6-digit verification code.")
        try:
            settings = self.settings
            path = settings["hosts"]["tenant"] + "/" + settings["api"] + "/verify"
            params = {"tx": settings["transId"], "p": settings["hosts"]["policy"]}
            data = {
                "request_type": "VALIDATION_REQUEST",
                "verification_code": code,
            }
            result = await self._request_json("POST", path, params=params, data=data)
            status = str(result.get("status", ""))
            if status == "449":
                self.mfa_attempts += 1
                if self._mfa_verification_expired():
                    raise MfaCallTimeout("The verification code expired. Request a new code.")
                raise InvalidVerificationCode("Sub-Zero did not accept the verification code.")
            if status == "429":
                raise LoginRateLimited("Sub-Zero rate-limited MFA verification requests.")
            if status != "200":
                raise LoginError("Sub-Zero could not validate the verification code.")
            return await self._confirm(remember_me=False)
        except KeyError, TypeError, ValueError:
            raise LoginError("Sub-Zero returned an invalid MFA validation response.") from None

    async def poll_mfa_call(self) -> dict:
        try:
            settings = self.settings
            config = settings.get("config") or {}
            poll_interval = max(0.0, int(config.get("pollIntervalInMilliseconds", 5000)) / 1000.0)
            poll_limit = max(1, min(int(config.get("pollLimit", 20)), 20))
            path = settings["hosts"]["tenant"] + "/" + settings["api"] + "/verify"
            params = {"tx": settings["transId"], "p": settings["hosts"]["policy"]}
            data = {"request_type": "VALIDATION_REQUEST"}
            for _ in range(poll_limit):
                await asyncio.sleep(poll_interval)
                result = await self._request_json("POST", path, params=params, data=data)
                status = str(result.get("status", ""))
                if status == "200":
                    return await self._confirm(remember_me=False)
                if status == "449":
                    continue
                if status == "448":
                    raise MfaCallTimeout("The phone number on record with Sub-Zero is unreachable.")
                raise LoginError("Sub-Zero could not complete phone call verification.")
            raise MfaCallTimeout("The verification phone call was not completed in time.")
        except KeyError, TypeError, ValueError:
            raise LoginError("Sub-Zero returned an invalid MFA poll response.") from None

    async def _confirm(self, *, remember_me: bool = True) -> dict:
        settings = self.settings
        path = settings["hosts"]["tenant"] + "/api/" + settings["api"] + "/confirmed"
        params = {
            **({"rememberMe": "false"} if remember_me else {}),
            "csrf_token": settings["csrf"],
            "tx": settings["transId"],
            "p": settings["hosts"]["policy"],
        }
        code = await self._navigate(LOGIN_ORIGIN + path + "?" + urlencode(params))
        if code is None:
            if self.settings.get("api") == "Phonefactor":
                try:
                    uv_phone = page_variable(self.last_page, "UV_PHONE")
                    phones = uv_phone.get("PhoneNumbers")
                    self.phone_numbers = [
                        phone
                        for phone in (phones if isinstance(phones, list) else [])
                        if isinstance(phone, dict) and phone.get("Id") is not None
                    ]
                except LoginError:
                    self.phone_numbers = []
                config = self.settings.get("config") or {}
                self.captcha_required = (
                    str(config.get("enableCaptchaChallenge", "")).lower() == "true"
                )
                self.captcha_solved = not self.captcha_required
            raise LoginChallenge("Sub-Zero requires another verification step.")
        return await self._exchange_code(code)

    async def _navigate(self, url: str) -> str | None:
        expected = urlsplit(REDIRECT_URI)
        for _ in range(10):
            parsed = urlsplit(url)
            if (parsed.scheme, parsed.netloc, parsed.path) == (
                expected.scheme,
                expected.netloc,
                expected.path,
            ):
                params = parse_qs(parsed.query)
                if not secrets.compare_digest(params.get("state", [""])[0], self.state):
                    raise LoginError("Sub-Zero returned an unexpected OAuth state.")
                if params.get("error") or not params.get("code"):
                    raise InvalidAuth("Sub-Zero did not authorize this sign-in.")
                return params["code"][0]
            origin = urlsplit(LOGIN_ORIGIN)
            if (parsed.scheme, parsed.netloc) != (origin.scheme, origin.netloc):
                raise LoginError("Sub-Zero requested an unsupported sign-in provider.")
            async with self.session.get(
                url, headers=LOGIN_HEADERS, allow_redirects=False
            ) as response:
                if response.status in (301, 302, 303, 307, 308):
                    location = response.headers.get("Location")
                    if not location:
                        raise LoginError("Sub-Zero returned an invalid sign-in redirect.")
                    url = urljoin(url, location)
                    continue
                if response.status != 200:
                    raise LoginError(f"Sub-Zero's sign-in page returned HTTP {response.status}.")
                self.last_page = await response.text()
                self.last_url = str(response.url)
                self.settings = page_variable(self.last_page, "SETTINGS")
                return None
        raise LoginError("Sub-Zero returned too many sign-in redirects.")

    async def _exchange_code(self, code: str) -> dict:
        data = {
            "grant_type": "authorization_code",
            "client_id": CLIENT_ID,
            "redirect_uri": REDIRECT_URI,
            "code": code,
            "code_verifier": self.verifier,
            "scope": SCOPES,
        }
        async with self.token_session.post(
            TOKEN_URL,
            headers=AUTH_HEADERS,
            data=data,
            timeout=self.session.timeout,
            allow_redirects=False,
        ) as response:
            if response.status in (400, 401, 403):
                raise InvalidAuth("Sub-Zero did not accept the authorization code.")
            if response.status != 200:
                raise LoginError(f"Sub-Zero's token service returned HTTP {response.status}.")
            tokens = await response.json(content_type=None)
        if not isinstance(tokens, dict) or not all(
            tokens.get(key) for key in ("access_token", "refresh_token")
        ):
            raise LoginError("Sub-Zero did not return the required login tokens.")
        return tokens
