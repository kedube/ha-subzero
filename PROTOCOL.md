# Sub-Zero Group Cloud API: Protocol Reference

Last updated 2026-10-08. This describes the cloud protocol used by the Sub-Zero Group Owner's app and by the `subzero` Home Assistant integration (`custom_components/subzero/`). The protocol is undocumented. Everything here comes from the integration's code and tests, the decompiled Android app 4.6.0, and behavior seen on real appliances.

## 0. Conventions

Every claim carries one or more source tags:

| Tag | Meaning |
| --- | --- |
| **[I]** | Implemented in the integration. File and symbol are given where useful (`api.py: parse_notification`). |
| **[A]** | Confirmed in the decompiled Sub-Zero Group Owner's app 4.6.0 (`.research/blutter-4.6.0/`). |
| **[O]** | Observed on real appliances or in live cloud traffic. |
| **[?]** | Uncertain, inferred, or not confirmed. Treat as a hypothesis. |

- Integration references describe the code as of October 2026. Line numbers are left out because the files change often.
- Secrets are referred to by constant name only: `SUBSCRIPTION_KEY` (`app_config.py`), `CLIENT_ID` (`auth.py`). Do not paste them into issues or logs.
- All IDs, serials, tokens and timestamps in the examples are synthetic. Network identifiers (MAC, IP, SSID) are left out of the examples.
- JSON property names are shown exactly as they appear on the wire, including misspellings such as `auto_sensivity` and `decomissionDevice`.

---

## 1. Overview

### 1.1 Components

| Component | Endpoint | Role | Integration |
| --- | --- | --- | --- |
| Azure AD B2C, custom policy `B2C_1A_SIGNUP_SIGNIN` | `https://login.subzero-wolf.com/SubZeroB2CPrd.onmicrosoft.com/...` (`auth.py: POLICY_BASE`) | Account sign-in and OAuth tokens | yes [I][A] |
| Azure API Management (APIM) | `https://prod.iot.subzero.com` (`api.py: API_BASE`) | REST API for appliance lists, faults, SignalR negotiation and direct methods | yes [I][A] |
| IoT Hub direct methods, called through APIM | `POST /consumerapp/device/{id}/directmethod/executeAPICmd` | Commands to the appliance (`get`, `set`, ...) | yes [I][A] |
| Azure SignalR Service, hub `connectedappliances` | `https://<signalr-host>/client/?hub=connectedappliances` (`api.py: SIGNALR_ORIGIN`) | Push of appliance state and notifications | yes [I][A] |
| Bluetooth LE | n/a | Setup, Wi-Fi provisioning, local control | no [A] |

The app also contains `https://dev.iot.subzero.com` and `https://test.iot.subzero.com` for non-production builds. [A]

### 1.2 From sign-in to live state

1. **Sign in** with B2C authorization code + PKCE. This returns `id_token`, `access_token` and `refresh_token` (§2). [I]
2. **List appliances** with `GET /consumerapp/user/devices`. Gives each appliance's `id`, `name` and `temperatureUnitForAppliance`. [I][A]
3. **Negotiate push** with `POST /signal-r/negotiateUser`, which returns a SignalR client URL and access token. Then run the SignalR `negotiate`, open the WebSocket and complete the handshake (§5). [I][A]
4. **Open each appliance's channel**: direct method `open_cloud_async`. The appliance then pushes a full state snapshot followed by incremental updates. [I][A][O]
5. **Fallback read**: if an appliance has not pushed a snapshot within 16 s, read it with the `get` direct method (`coordinator.py: INITIAL_STATE_TIMEOUT`). [I]
6. **Writes**: direct method `set` with one property per call. Each write is confirmed by reading state back, from push or `get` (§8.4). [I]
7. **Maintenance**: renew the SignalR connection and reopen every channel at least every 50 minutes. Read state every 10 minutes when push is silent (configurable). Poll faults every 30 minutes. [I]

---

## 2. Authentication

### 2.1 Endpoints and constants (`auth.py`)

| Constant | Value / meaning | Source |
| --- | --- | --- |
| `LOGIN_ORIGIN` | `https://login.subzero-wolf.com` | [I][A] |
| `POLICY_BASE` | `LOGIN_ORIGIN + "/SubZeroB2CPrd.onmicrosoft.com/B2C_1A_SIGNUP_SIGNIN"` | [I][A] |
| `AUTHORIZE_URL` | `POLICY_BASE + "/oauth2/v2.0/authorize"` | [I][A] |
| `TOKEN_URL` | `POLICY_BASE + "/oauth2/v2.0/token"` | [I][A] |
| `CLIENT_ID` | The app's production public client ID (no client secret) | [I][A] |
| `REDIRECT_URI` | `com.szg.szgdigitalproductexperience://oauth/redirect` | [I][A] |
| `SCOPES` | `"openid offline_access " + CLIENT_ID` | [I] |

The app uses AppAuth with an external browser. It requests `openid`, `offline_access`, `profile` and an API scope of the form `https://SubZeroB2CPrd.onmicrosoft.com/<...>/read` [A]; the middle segment is not confirmed [?]. The integration does not request the API scope because it uses the ID token as the bearer (§2.6). [I] The app also has `B2C_1A_SIGNUP`, `B2C_1A_FORGOTPASSWORD` and `.../oauth2/v2.0/logout` endpoints, which the integration does not use. [A]

### 2.2 Authorization code flow with PKCE (`auth.py: SubZeroLogin.login`)

The integration drives the B2C web pages directly, the way a browser would. [I]

1. Generate `state` and `nonce` (`secrets.token_urlsafe(32)`) and a PKCE `verifier` (`token_urlsafe(48)`). `code_challenge = base64url(sha256(verifier))` with the padding removed. [I]
2. `GET AUTHORIZE_URL?client_id=…&redirect_uri=…&response_type=code&scope=…&state=…&nonce=…&code_challenge=…&code_challenge_method=S256`. [I]
3. Follow redirects by hand (at most 10 hops; only `LOGIN_ORIGIN` is allowed). When a page returns 200, parse its inline `var SETTINGS = {...}` JSON. `SETTINGS.api` must be `CombinedSigninAndSignup`. [I]
4. Post the credentials (§2.3).
5. Confirm with `GET {tenant}/api/{api}/confirmed?rememberMe=false&csrf_token={csrf}&tx={transId}&p={policy}`. This leads to one of two outcomes: [I]
   - a redirect to `REDIRECT_URI?code=…&state=…`. The integration checks `state` with a constant-time comparison; an `error` parameter, or a missing `code`, means `InvalidAuth`.
   - another page, the MFA step (`SETTINGS.api == "Phonefactor"`, §2.4).
6. Exchange the code at `TOKEN_URL` (§2.5).

`SETTINGS` fields the integration uses: `csrf`, `transId`, `hosts.tenant`, `hosts.policy`, `api`, `pageViewId`, `isPageViewIdSentWithHeader`, and `config.{enableCaptchaChallenge, retryLimit, pollIntervalInMilliseconds, pollLimit}`. [I]

Session rules [I]:
- Login pages use a cookie jar with `quote_cookie=False`. B2C rejects quoted cookie values that browsers send unquoted.
- Token requests use a separate HTTP session that does not carry the login cookies.
- Login pages are fetched with a browser profile (`app_config.py: LOGIN_HEADERS`). Token requests use an Android HTTP client profile (`AUTH_HEADERS`). Both are representative profiles, not captures of real app traffic.

### 2.3 Self-asserted form posts

All B2C AJAX calls go to `LOGIN_ORIGIN + {hosts.tenant} + <path>` with query `tx={transId}&p={hosts.policy}`. They send the headers below and return JSON with a string `status`. [I]

| Header | Value |
| --- | --- |
| `X-CSRF-TOKEN` | `SETTINGS.csrf` |
| `X-Requested-With` | `XMLHttpRequest` |
| `Referer` | URL of the last page loaded |
| `Accept` | `application/json, text/javascript, */*; q=0.01` |
| `Origin` | `LOGIN_ORIGIN` (not sent on GET) |
| `x-ms-cpim-pageviewid` | `SETTINGS.pageViewId`, only when `isPageViewIdSentWithHeader` is true |

Sign-in: `POST /SelfAsserted`, form body `request_type=RESPONSE&signInName=<email>&password=<password>`. Success is `{"status":"200"}`; anything else means invalid credentials. [I]

### 2.4 MFA (Phonefactor) and CAPTCHA

When `confirmed` returns a page whose `SETTINGS.api` is `Phonefactor`, the page also defines `var UV_PHONE = {"PhoneNumbers":[{"Id":1,"MaskedNumber":"XXX-XXX-1234"}, ...]}`. The integration keeps the entries that have an `Id`. A CAPTCHA is required when `config.enableCaptchaChallenge` is `"true"`. [I]

**CAPTCHA** (when required, before MFA verification is requested) [I]:

| Step | Request | Success |
| --- | --- | --- |
| Get challenge | `GET /SelfAsserted/DisplayControlAction/vbeta/captchaControlChallengeCode/GetChallenge?tx=…&p=…&challengeType=Visual` | `{"status":"200","challengeId":"…","challengeString":"<base64 PNG or data: URI>","azureRegion":"…"}` |
| Verify | `POST …/captchaControlChallengeCode/VerifyChallenge?tx=…&p=…`, form `challengeId`, `captchaEntered`, `challengeType=Visual`, `azureRegion` | `status=="200"`, `reason=="Solved"` (case-insensitive), `isCaptchaSolved=="true"`, matching `challengeId`. `reason=="UserMessageIfBypass"` also counts as solved. |

A `reason` of `WrongAnswer` or `NoChallengeSession`, or `status` `400`, means a wrong CAPTCHA. The integration sends `azureRegion` back as it was received, or an empty string. The comment in `get_captcha_challenge` explains that B2C's own script sends an empty value. [I]

**Phonefactor verification**: `POST /Phonefactor/verify?tx=…&p=…` (the path segment is `SETTINGS.api`). [I]

| Purpose | Form body | Status values |
| --- | --- | --- |
| Request SMS or call | `request_type=VERIFICATION_REQUEST&auth_type=onewaysms` (SMS) or `dialphone` (voice call)`&id=<PhoneNumbers[0].Id>` | `200` sent, `429` rate-limited, `448` phone unreachable |
| Validate SMS code | `request_type=VALIDATION_REQUEST&verification_code=123456` | `200` accepted, `449` wrong code, `429` rate-limited |
| Poll call result | `request_type=VALIDATION_REQUEST` (no code) | `200` done, `449` still pending, `448` unreachable |

- After a `449` on code validation, the code is treated as expired once `config.retryLimit` attempts (default 3) are used up, or once `pollIntervalInMilliseconds × pollLimit` has passed (defaults 5000 ms × 20, with `pollLimit` capped at 20). [I]
- Voice calls are polled every `pollIntervalInMilliseconds` up to `pollLimit` times. [I]
- After a `200`, the integration calls `confirmed` again without `rememberMe` and exchanges the returned code. [I]

### 2.5 Token exchange and refresh

Code exchange: `POST TOKEN_URL`, form body `grant_type=authorization_code&client_id=…&redirect_uri=…&code=…&code_verifier=…&scope=…`. [I]

- HTTP 400, 401 or 403 means `InvalidAuth`.
- The response must contain `access_token` and `refresh_token`. B2C also returns `id_token`, which the integration prefers (§2.6). [I]

Refresh: `POST TOKEN_URL`, form body `grant_type=refresh_token&client_id=…&refresh_token=…&scope=…`. [I] (`api.py: SubZeroClient.refresh`)

- Runs before any API request when the stored expiry is less than 300 s away. Expiry comes from `expires_at` in stored state, otherwise from the bearer token's `exp` claim.
- Also runs once after an API 401/403. The request is then retried with the new token.
- 400, 401 or 403 from the token endpoint triggers re-authentication, as does a refresh that returns a different user ID.
- Rotated refresh tokens are saved. If a response has no `refresh_token`, the previous one is kept.
- Stored logins that lack an `id_token` are refreshed once at startup to get one.

### 2.6 Bearer token and user ID

| Item | Integration | App |
| --- | --- | --- |
| Bearer | `id_token`, falling back to `access_token` (`api.py: _api_token`) [I] | Stores and sends the B2C ID token (`idToken`; the error string is "Id Token is null") [A]. Which field the header builder reads is not fully traced [?] |
| User ID | Claim `mergedId`, falling back to `sub`, from the bearer JWT (`api.py: token_state`) [I] | `IdToken` decodes `sub`, `mergedId`, `email`, `extension_accountType`, `extension_isMfaEnrolled` and others [A]. Header value is `azureObjectId ?? sitecoreUserId ?? "unavailable"`; how these map to `sub` and `mergedId` is not confirmed [?] |
| Case | `user_id` (lowercase) for SignalR. `api_user_id` (original case) for the `Userid` header on other REST calls [I] | n/a |

`GET /consumerapp/user/devices` returns `mySubZeroUniqueUserId`. The integration only logs a debug message when it differs from the sign-in user ID. [I]

### 2.7 Headers on APIM requests

| Header | Value | Integration | App |
| --- | --- | --- | --- |
| `Authorization` | `Bearer <id token>` | yes [I] | yes [A] |
| `Ocp-Apim-Subscription-Key` | `SUBSCRIPTION_KEY` (`app_config.py`), shared by all app installs | yes [I] | yes; keys differ per build flavor [A] |
| `Userid` / `userId` | Account user ID (header names are case-insensitive) | `Userid` [I] | `userId` [A] |
| `Accept` | `application/json` | yes [I] | yes [A] |
| `Content-Type` | `application/json` (JSON bodies) | set by aiohttp for `json=` [I] | `content-type: application/json` [A] |
| `User-Agent` | `Dart/3.11 (dart:io)` | yes (`APP_HEADERS`) [I] | Dart default [A?] |
| `Accept-Encoding` | `gzip` | yes [I] | Dart default [?] |
| `app_version`, `app_platform` | for example `android` | not sent [I] | sent [A] |

Timeouts: the integration allows 40 s per request and does not retry automatically [I]. The app allows 30 s and retries exceptions up to 4 attempts, with exponential backoff (200 ms factor, 25 % jitter, 30 s maximum) [A].

---

## 3. REST endpoints

Paths are relative to `API_BASE`. Every request carries the headers in §2.7.

### 3.1 Used by the integration

| Method | Path | Purpose | Request | Response | Source |
| --- | --- | --- | --- | --- | --- |
| GET | `/consumerapp/user/devices` | Appliances on the account | none | `{"mySubZeroUniqueUserId": str, "devices": [{"id": str, "name": str, "temperatureUnitForAppliance": "F"\|"C", ...}]}` | [I][A] |
| POST | `/consumerapp/device/{deviceId}/directmethod/executeAPICmd` | Direct method to the appliance (§4) | `{"req_id": uuid, "pload": {"cmd": str, "params"?: obj}}` | see §4.2 | [I][A] |
| POST | `/signal-r/negotiateUser` | SignalR client URL and token | no body; `Userid` = lowercase user ID | `{"url": str, "accessToken": jwt}` | [I][A] |
| GET | `/fault-notifications/v1/notifications/device/{deviceId}` | Fault records (§9) | none | JSON list; 404 means none | [I][A] |
| GET | `/faults-meta-data/v1/Search?code={code}&appliesTo={series}` | Fault title and resolution steps (§9) | none | JSON list | [I][A] |

`deviceId`, `code` and `appliesTo` are URL-encoded. [I][A] The app's `test` build flavor negotiates at `/api-signalr/negotiateUser`; all other flavors, production included, use `/signal-r/negotiateUser`. [A]

Example appliance list (synthetic):

```json
{
  "mySubZeroUniqueUserId": "11111111-2222-4333-8444-555555555555",
  "devices": [
    {"id": "dev-0001", "name": "Kitchen refrigerator", "temperatureUnitForAppliance": "F"},
    {"id": "dev-0002", "name": "Wall oven", "temperatureUnitForAppliance": "C"}
  ]
}
```

Missing or empty `name` becomes `"Sub-Zero"`. A non-list `devices` is an error. [I] The app also reads `bda` (Bluetooth address) and `order` from each device. [A]

### 3.2 App-only endpoints (not used by the integration)

| Method | Path | Purpose | Source |
| --- | --- | --- | --- |
| POST | `/consumerapp/api/consumer/device/upgrade/{deviceId}/timesettings` | Set the appliance time zone, body `{"timezone_id_name": "Eastern Standard Time", "dst_observed": true, "is_new_registration": false}`. The zone name is a Windows (.NET) ID derived from the phone's zone | [A] |
| GET | `/devices/v3/devices/{deviceId}/twin/property/{name}` | Read one device-twin property; response `{"Value": ...}`. The app reads `time_settings` (for `timezone_id_name`) and, for DICE ice makers, `winterize_on` | [A] |
| GET | `/fault-notifications/v1/notifications/{id}` | One fault notification | [A] |
| PUT | `/fault-notifications/v1/notifications/{id}` | Update a fault notification (dismissal); body fields `fault, corporateSeverity, active, description, createdTime, userId, deviceId, notificationDismissal, notificationDate, eTag` | [A] |
| POST | `/consumerapp/device/user` | Associate a provisioned appliance with the account | [A] |
| GET | `/consumerapp/user/decomissionDevice/{deviceId}` | Remove an appliance from the account | [A] |
| POST | `/consumerapp/user/devices/{deviceId}` | Rename (`namePrefix`); exact path composition [?] | [A] |
| GET, POST | `/consumerapp/user/devices/{deviceId}/pin` | Store and retrieve the BLE pairing PIN (`devicePin`) | [A] |
| GET, PATCH | `/users/v1/users/{userId}[/serialNumber]` | DeviceUsers document, appliance serial | [A][?] |
| GET, POST, DELETE | `/deviceusersmetadata/...`, `/deviceusersmetadata/V2/...` | Firmware and metadata documents | [A] |
| various | `/consumerapp/api/notification/...`, `/api-user-fcm/v2/...` | Phone push-notification registration and event subscriptions | [A] |
| POST | `/consumerapp/logs/add`, `/consumerapp/offline/logs` | App logs | [A] |

---

## 4. Direct methods

### 4.1 Request

`POST /consumerapp/device/{deviceId}/directmethod/executeAPICmd`

```json
{"req_id": "6f1c2d3e-4b5a-4c6d-8e7f-0a1b2c3d4e5f", "pload": {"cmd": "set", "params": {"ref_set_temp": 37}}}
```

- `req_id` is a fresh UUID v4 for every call. [I][A]
- `params` is left out for commands that take no parameters. [I]
- The integration sends exactly one property per `set` call, except for the ice delay (§8.3). [I]
- The app also batches several properties into one `set` (`ApplianceProperties.sendBatch`). [A]

### 4.2 Response handling

The HTTP status and the body are both significant. [I] (`api.py: SubZeroClient._json` with `appliance_command=True`)

| HTTP | Body | Integration result |
| --- | --- | --- |
| 2xx | empty, `OK` or `"OK"` | Success, no data |
| 2xx | JSON object, possibly JSON-encoded as a string one or more times | Parsed and checked (below) |
| 500 | `{"Message":"OK"}` or `{"message":"OK"}` | Success, no data (integration handling; whether the cloud really sends this is §12) |
| 500 | anything else, such as `{"Message":"Device offline"}` | `ApiError` (HTTP 500) |
| 401/403 | n/a | Refresh the token, retry once, then re-authenticate |
| 429 | n/a | `RateLimited` (§10) |
| other | n/a | `ApiError` with the status |

String layers are decoded repeatedly. A string that fails JSON decoding is retried once as an escaped string literal (`api.py: _object`). [I] The app strips backslashes and replaces `"{` with `{` and `}"` with `}` before a single `jsonDecode`. [A]

Body shapes seen or accepted:

```json
{"status": 0, "resp": {"appliance_model": "MODEL-X", "ref_set_temp": 37}}
```
```json
{"resp": {"status": 0}}
```
```json
{"status": 0, "pload": {"status": 0}}
```

The first form is what `get` returns. The app's demo data for a DICE ice maker has the same `{"status": 0, "resp": {...}}` shape. [I][A]

### 4.3 Rejection rules

Integration (`api.py: _rejected`, `_check_control_response`) [I]:

- `_rejected(obj)`: looks at `status` on the object, and up to two more levels down through `pload`. Any present `status` that is not the integer `0` means rejection. A `status` of `true` or `3` rejects; a `status` of `null` does not.
- `set` and `reset_air_filter`:
  1. Reject if the top level is rejected.
  2. Take `resp` (or the top level) and reject if that is rejected.
  3. Descend through `pload` up to twice, until reaching an object that has `status`.
  4. If the resulting object is non-empty and has no `status`, reject. For example, `{"resp": {"error": "..."}}` and `{"resp": null}` are rejected.
- `get`: reject per `_rejected`. The `resp` object (or the top level) must contain a string `appliance_model`, otherwise it is not a snapshot.
- `open_cloud_async`: reject if the top level or `resp` is rejected.
- `exit_delay`: reject per `_rejected`. The returned `resp` holds properties.

App (`DirectMethodsExtension.sendDirectMethod`) [A]:
- Treats any HTTP status outside 200–299 as failure.
- On a 2xx response, reads `body.pload.pload.status`. Success means that value is `0` or missing.

The nesting the app expects for `set` acknowledgements differs from the `resp` form the integration has seen. The real `set` response shape is not confirmed [?].

### 4.4 Commands

| `cmd` | Params | Purpose | Cloud | Integration | Source |
| --- | --- | --- | --- | --- | --- |
| `get` | none | Full state snapshot in `resp` | yes | yes (`state`) | [I][A] |
| `set` | `{prop: value, ...}` | Write properties | yes | yes (`set_property`, `set_ice_delay`) | [I][A] |
| `open_cloud_async` | none | Start pushing this appliance's state to SignalR | yes | yes (`open_channel`) | [I][A] |
| `reset_air_filter` | none | Reset the refrigerator air-purification cartridge life | yes (app sends it only for series 22 `ngix`; other series get reset instructions) | yes, series 22 only (`AIR_FILTER_RESET_SERIES`) | [I][A] |
| `exit_delay` | none | End the current DICE ice-making delay; the response carries properties | yes | yes (`exit_ice_delay`) | [I][A] |
| `reset_filter` | none | Reset the hood filter counter | In 4.6.0, `ConnectedAppliance.sendResetFilterCmd` calls only the BLE interface [A]; a cloud path is unconfirmed [?] | no | [A] |
| `get_async`, `set_time`, `display_pin`, `wifi_scan`, `connect_wifi`, `unlock_channel_*`, `open_async_channel_*` | various | BLE only (§11) | no | no | [A] |

`api.py: SubZeroClient._command` refuses any command other than `get`, `open_cloud_async`, `set`, `reset_air_filter` and `exit_delay`. [I] The confirmed findings also list `start_immediately` for DICE ice makers. In 4.6.0 that string appears only as a DICE delay-overlay toggle and analytics tag, and the overlay saves the delay with a `set` batch [A]. Whether `start_immediately` is ever a command is unconfirmed [?].

---

## 5. Push (SignalR)

### 5.1 negotiateUser

`POST {API_BASE}/signal-r/negotiateUser` with the §2.7 headers and `Userid` set to the lowercase user ID. [I] The app sends `userId` = `sitecoreUserId ?? azureObjectId ?? "unknown"`. [A]

```json
{"url": "https://<signalr-host>/client/?hub=connectedappliances", "accessToken": "<SignalR JWT>"}
```

The integration requires the URL's origin to equal `SIGNALR_ORIGIN` and `accessToken` to be a string. [I]

### 5.2 SignalR negotiate

`POST https://<signalr-host>/client/negotiate?hub=connectedappliances&negotiateVersion=1` [I]

| Header | Value |
| --- | --- |
| `Authorization` | `Bearer <accessToken from negotiateUser>` |
| `X-Requested-With` | `FlutterHttpClient` |
| `Content-Type` | `text/plain;charset=UTF-8` |
| `User-Agent`, `Accept-Encoding` | `APP_HEADERS` |

No `Userid` or subscription key is sent. The response must be JSON with HTTP 200. The integration uses `connectionToken`, falling back to `connectionId`. [I] The app uses the `signalr_netcore` package (`HubConnectionBuilder.withUrl`). [A]

### 5.3 WebSocket and handshake

1. Connect to `wss://<signalr-host>/client/?hub=connectedappliances&id=<connectionToken>`, sending `Authorization: Bearer <accessToken>` and `APP_HEADERS`. The maximum message size is 262144 bytes. [I]
2. Send `{"protocol":"json","version":1}` followed by the record separator `\x1e`. [I]
3. The first text frame must arrive within 20 s and contain `\x1e`. The record before the separator must be exactly `{}`. Anything after it is buffered as further messages. [I]

### 5.4 Framing and message types

Each frame holds one or more JSON records, each ending with `\x1e`. Records may also be split across frames. The integration buffers them, and fails the connection if more than 262144 characters are pending. [I]

| `type` | Meaning | Integration |
| --- | --- | --- |
| 1 | Invocation. Only `target == "ConnectedApplianceMessage"` is used | Parsed (§5.5) |
| 6 | Ping | Sent every 15 s as `{"type":6}\x1e` (`PING_INTERVAL`). Received pings count as traffic |
| 7 | Close | Treated as an error; reconnect |
| other | n/a | Ignored |

A record that cannot be decoded is counted as invalid and skipped. [I]

### 5.5 ConnectedApplianceMessage

Two argument forms have been seen. Both are handled. [I][O]

| Form | `arguments` | Handling |
| --- | --- | --- |
| Current | `["<envelope JSON string>"]` | Envelope is `arguments[0]` (the app reads only this) [A] |
| Legacy | `["<user id>", "<envelope JSON string>"]` | `arguments[0]` must equal the account user ID, compared case-insensitively; otherwise the message is ignored [I] |

The layers, each of which may be a JSON string or an object:

```text
record       {"type":1, "target":"ConnectedApplianceMessage", "arguments":["<envelope>"]}
envelope     {"DeviceId":"dev-0001", "Payload":"<payload>"}
payload      {"api.async_channel":"<message>", "timezone_id_name":"Eastern Standard Time"}
message      {"type":2, "pload": <pload>}            // may also include "device_id"
pload        {"props": {...}} | {"resp": {...}} | {...root properties...}
```

On the wire, every layer below the record is JSON-encoded inside a string. Example, two layers deep:

```json
{"type":1,"target":"ConnectedApplianceMessage","arguments":["{\"DeviceId\":\"dev-0001\",\"Payload\":\"{\\\"api.async_channel\\\":...}\"}"]}
```

Rules (`api.py: parse_notification`) [I]:
- A missing or empty `DeviceId` is invalid. A `DeviceId` that is not a selected appliance is ignored.
- A payload without `api.async_channel` is ignored. The app's message model also reads `Payload.timezone_id_name`. [A]
- If `message.device_id` is present and differs from `DeviceId`, the message is ignored.
- `message.type` is logged but not used. Tests use 1 for snapshots and 2 for updates. Snapshots are recognized by content (§5.6), not by type. [I][?]

### 5.6 pload wrappers and snapshot detection

| Wrapper | Meaning | `full` (snapshot) |
| --- | --- | --- |
| `pload.resp` (non-null) | Command response, e.g. after `open_cloud_async` or `get` | yes, if it contains a non-empty string `appliance_model` |
| `pload.props` (non-null) | Property change | never, even when sibling root keys include `appliance_model` |
| neither (root) | Properties at the root of `pload` | yes, if it contains a non-empty string `appliance_model`. A root with no recognized property (`const.py: STATE_KEYS`) is ignored |

- `resp` wins over `props` when both are present. The app's `_extractEventBody` uses the same order: `resp`, then `props`, then the root. [I][A]
- A root or `resp` whose `appliance_model` is `null` is an update, not a snapshot. [I]
- A message with no state (for example `{"status": 0}`) still shows that the appliance's channel is delivering. The integration records it in `last_messages`. [I]

Coordinator handling (`coordinator.py: apply_update`) [I]:
- **Snapshot**: replaces state when the appliance was unavailable or `appliance_model` changed; otherwise merges. A snapshot also makes an unavailable appliance available again.
- **Update**: merged into current state. Updates are dropped while the appliance is unavailable; recovery reads restore it.
- An `appliance_type` that cannot be parsed never replaces a known one. The app behaves the same way. [I][A]
- Properties excluded for the appliance type are discarded (§6.8).

### 5.7 Appliance channels (`open_cloud_async`)

- After the handshake, the integration sends `open_cloud_async` to every selected appliance. [I]
- The request is `{"cmd":"open_cloud_async"}`, with no duration or other parameters. [I][A] The appliance answers with a `resp` snapshot on the channel. [O] The app relies on that snapshot for initial state. [A]
- When the app opens channels [A]:
  - when an appliance card loads; if the hub is not connected yet, a one-shot listener opens the channel on the first `Connected` state and then cancels itself;
  - each time the app returns to the foreground (`AppLifecycleState.resumed`). The appliance list closes the SignalR connection, creates a new one, and reopens every channel; the dashboard also reopens its appliance;
  - on recipe screens, which send `get` and then open the channel.
- If no properties arrive within 16 s of opening (`TimeoutDuration.propertiesReceiptTimeout`), the app sends one fallback `get` ("Sending fallback GetAll command for appliance lacking properties"). [A]
- Pull-to-refresh on the appliance list sends `get` to every appliance, then waits a 10 s cooldown. [A]
- When the app goes to the background (`paused`), it only removes its local message listener (`closeSignalRChannel`). Nothing is sent to the cloud. [A]
- The app never polls: its only periodic timers are on-screen countdowns. [A] Its 55-minute SignalR refresh and its automatic reconnections do not reopen channels. [A] So the app never keeps a channel open longer than one foreground session, and its behavior does not show how long a channel lasts. [A]
- Phone alerts, such as a door left open, reach the app through Firebase Cloud Messaging (`/consumerapp/api/notification/...`, `/api-user-fcm/v2/...`), not through the channel. [A]
- Failed opens are reported per appliance (the appliance becomes unavailable). They are retried with backoff: 30 s, doubling to at most 900 s, plus 0–5 s jitter. A 429 aborts the connection (§10). [I]
- A state update from an appliance also marks its channel as open. [I]
- Push for one appliance can stop while the shared connection stays up, which can leave a door shown as open. [O] (README)
- The periodic check reopens each channel, like the app on each return to the foreground. It runs by default every 10 min without a state change; the options are 1, 2, 5 or 10 min, or push only. [I] (`coordinator.py: _handle_refresh_interval`, `_async_check_channel`)
  1. Send `open_cloud_async`, then wait up to 16 s for a pushed snapshot. The snapshot is the check's status read. It is compared with current state before the merge, to count changes push had not reported (`unpushed_changes`, `missed_updates`).
  2. If no snapshot arrives (`silent_channels`), or the reopen fails, fall back to `get`, as the app does.
  3. After a silent reopen whose fallback `get` succeeds without a rate limit, request a connection renewal (§5.8), which reopens every channel (`connection_renewals`). Only once until that appliance answers a reopen again, in case it never answers one.

### 5.8 Keepalive, timeouts and renewal

| Item | Integration | App |
| --- | --- | --- |
| Client ping | `{"type":6}` every 15 s [I] | `signalr_netcore` defaults [A?] |
| Silence timeout | 60 s without any received frame causes a reconnect [I] | library default [?] |
| Connection renewal | At `min(3000 s, exp(accessToken) − now − 60 s)`, minimum 1 s; 3000 s if `exp` is unreadable; or within one ping interval of a request after a silent channel (§5.7). Starts again from `negotiateUser` and reopens all channels [I] | Recreates the connection 55 min after it starts (`Future.delayed`, then "Refreshing SignalR connection") [A] |
| Reconnect after error | 30 s doubling to 900 s, plus 0–5 s jitter; reset after a connection that lasted ≥120 s; at least `Retry-After` [I] | 3 connect attempts; up to 5 automatic reconnections [A] |

The 50-minute cap is the integration's own choice, below the app's 55 minutes. The SignalR token's real lifetime and any server-side limit are not confirmed [?].

---

## 6. State model

### 6.1 `appliance_type`

Format: `<module>.<series>.<category>.<version>`, for example `17.2.6.1`. A three-part value is `<series>.<category>.<version>` with the module taken as `0`. [I][A] The app's `ApplianceType.fromString` splits on `.`, inserts `"0"` in front of a three-part value, and parses the four integers. Its per-type metadata files are named `s<series>_c<category>_v<version>`. [A]

| Module ID | App name |
| --- | --- |
| 0 | unknown |
| 1 | puma |
| 17 | saber |
| 33 | wrover |
| 49 | calico |

(Module names from the app's `ModuleVersion` enum. [A] The confirmed findings write the format as `17.<series>...` because 17 (saber) is the common case; tests also use module 1. [I])

The integration keys type-specific behavior on `(series, category, version)` (`controls.py: appliance_type`, `excluded_properties`). [I]

### 6.2 Series

Codes and names come from the app's `ApplianceSeries` enum. [A] The same names are the fault-metadata `appliesTo` values (`const.py: FAULT_METADATA_APPLIES_TO_BY_SERIES`). [I]

| Series | Name | Integration use |
| --- | --- | --- |
| 0 | unknown | n/a |
| 1 | bi | legacy accent light values; On and Off only; refrigerator max 45 °F |
| 2 | ngi | refrigerator max 45 °F |
| 3 | eSeries | oven; start with power write; own temperature ranges |
| 4 | mSeries | oven; start with power write |
| 5 | wine | legacy accent light values |
| 6 | cove | dishwasher |
| 7 | pro | legacy accent light values |
| 8 | range | oven; two cavities named right and left |
| 9 | specialty | n/a |
| 11 | bi5 | n/a |
| 12 | bi5Wine | n/a |
| 13 | deu | refrigerator 34–55 °F for categories 3 and 6 |
| 14 | deuWine | n/a |
| 15 | nge | oven |
| 16 | hybridM | n/a |
| 17 | ds3 | n/a |
| 18 | ds3Wine | n/a |
| 20 | cove2 | n/a |
| 21 | dice | dedicated ice maker (`is_ice_maker`) |
| 22 | ngix | air-filter reset allowed; refrigerator max 45 °F |
| 23 | pvii | hood (`is_hood`) |

Other categories are detected by the properties an appliance reports: setpoint keys mean refrigerator or wine, and `cav_`/`kitchen_timer` keys mean oven (`controls.py: is_fridge`, `is_oven`, ...). [I]

### 6.3 Property naming conventions

| Pattern | Meaning | Examples |
| --- | --- | --- |
| `cav_`, `cav2_` | Oven cavity 1 and 2 (upper/lower; right/left on ranges) | `cav_temp`, `cav2_cook_mode` |
| `ref_`, `ref2_`, `frz_`, `crisp_`, `wine_`, `wine2_` | Refrigerator zones, freezer, crisper drawer, wine zones | `ref_set_temp`, `wine2_door_ajar` |
| `kitchen_timer`, `kitchen_timer2` | Oven kitchen timers | `kitchen_timer_duration`, `kitchen_timer2_end_time` |
| `*_on` | Boolean state or switch | `ice_maker_on`, `sabbath_on`, `cav_unit_on` |
| `*_ajar` | Door open (bool) | `ref_door_ajar`, `door_ajar` |
| `*_set_temp` | Setpoint (int °F) | `frz_set_temp`, `cav_probe_set_temp` |
| `*_display_temp` | Temperature shown on the appliance (int °F) | `ref_display_temp` |
| `*_time` | Timestamp (ISO 8601 string) | `wash_cycle_end_time`, `next_clean_time` |
| `*_active`, `*_complete`, `*_within_1min`, `*_at_set_temp`, `*_within_10deg` | Status booleans | `cav_cook_timer_complete` |

The app's property enum (`AppliancePropertiesEnum`, 152 names) does not include several names that the integration reads and that appear in the app's demo snapshots: `time`, `ap_rssi`, `ipv4_addr`, `unit_on`, `cav*_cook_timer_*`, `kitchen_timer*_start_time`, `kitchen_timer*_within_1min`, `cav*_probe_within_10deg`, `water_filter_gal_remaining`, `max_ice_*_time`, `high_use_*_time`, `wine_temp_alert_on`, `delay_start_timer_start_time`. [A] The app's property model does not appear to track them [?]. The integration recognizes them (`const.py: STATE_KEYS`). [I]

### 6.4 Value types and units

| Property | Type | Unit / meaning | Source |
| --- | --- | --- | --- |
| Temperatures (`*_temp`, `*_set_temp`, `*_display_temp`) | int | °F, whatever the account's display unit | [I]; the app converts its bounds to °F [A]; Celsius appliances unconfirmed [?] |
| `*_pct_remaining` | int | percent | [I] |
| `water_filter_gal_remaining` | int | gallons; can be negative past capacity | [I] |
| `kitchen_timer*_duration` | int | minutes, 0–719 | [I] |
| `delay_duration`, `delay_start_offset` | int | seconds (DICE delay) | [I] |
| `next_clean_cycles` | int | ice cycles until cleaning | [I] |
| `next_clean_reminder` | int | seconds (demo data 1209600 = 14 days); not used by the integration | [A] |
| `delay_start_timer_duration` | int | hours, 0–12 (dishwasher) | [I] |
| `delay_off_duration` | int | milliseconds, whole minutes up to 719 (hood) | [I] |
| `filter_count`, `filter_max_count` | int | treated as seconds (hood filter usage and allowance) | [I][?] |
| `door_ajar_timeout` | int | minutes (§7.10) | [I] |
| `ap_rssi` | int | dBm | [I] |
| `uptime` | string | `H:MM:SS`, truncated (§6.6) | [I][A][O] |
| `version` | object | `{"fw","rtapp","bleapp","api","appliance","architecture","os"}`; the integration uses `fw` as the software version | [I][A] |
| `notifs` | list | notification history (§6.9) | [I][A] |
| `active_faults` | list of strings | e.g. `"10 C 00"` in demo data; unused by the app and the integration | [A] |
| `diagnostic_status` | string | per-subsystem codes (§6.7) | [A] |

No-reading values [I]:
- An oven cavity value (`cav*_temp`, `cav*_set_temp`, probe values) of `0` means no reading.
- `cav*_probe_temp` of `0` or `1` means no reading; the app's probe tile also treats −18 (0 °F shown in °C) as none (`probe_tile_controller.dart`). [A][I]
- Probe values count only while `cav*_probe_on` is true.
- The app shows Off instead of `cav*_temp` unless that cavity's `unit_on` is true, and Clean during self clean (`oven_temperature_tile_controller.dart`). The integration shows no reading in both cases. [A][I]

### 6.5 Timestamps

- A timestamp without an offset is local wall time. The app parses with `DateTime.parse` and only converts with `toUtc`/`toLocal`. It sets the appliance clock from the phone's local time over BLE (`set_time`). [A]
- The integration reads offset-less timestamps in Home Assistant's time zone and keeps any explicit offset (`controls.py: appliance_datetime`). [I]
- App demo data uses offset-less values such as `"next_clean_time": "2025-10-07T11:03:37"`. [A]
- **`time` is not a reliable offset source.** Push snapshots have reported `"time": "2026-10-05T15:29:24-04:00"` while `get` responses reported `"2026-10-08T02:53:29+00:00"`. [O] The app never reads `time` except to set the clock over BLE. [A] The integration ignores it and leaves it out of change detection (`UNCOMPARED_READ_KEYS`). [I]
- The time zone is set separately through the time-settings endpoint (§3.2). SignalR payloads may carry `timezone_id_name`. [A]

### 6.6 `uptime`

`H:MM:SS` cut to 8 characters. From 100 hours the last digit is lost, so `"387:52:1"` means 387:52:1x. From 1000 hours the seconds are lost entirely. [O][I] The app splits it on `:` and never displays it. [A] The integration pads missing digits with zeros (`sensor.py: uptime_seconds`). [I]

### 6.7 Other diagnostic properties

- `diagnostic_status`: per-subsystem characters, `1` good, `3` error, `0` unknown. Used only during setup and in logs. [A] The confirmed findings say 12 characters. Demo data shows `"0x"` followed by 1s, and the app's default is 13 zeros, so the exact length and prefix handling are uncertain [?].
- `smart_grid_on`, `showroom_on`, `service_mode` and `pin_window_open` appear only in the app's demo data. The app ignores them. [A]
- `ipv4_addr`, `device_wlan_id` (MAC) and `appliance_serial` are private. The integration keeps them out of logs and diagnostics (`PRIVATE_KEYS`). [I]

### 6.8 Properties discarded by appliance type

The app drops some properties for specific types ("Received excluded property", `ConnectedAppliance._filterValidProperties`, using per-type metadata). [A] The integration mirrors the lists in `const.py: EXCLUDED_PROPERTIES` and also hides dependent entities (`DEPENDENT_ENTITY_KEYS`). [I] The individual lists were taken from the integration and not re-derived here [?].

| Discarded | Types (`series.category.version`) |
| --- | --- |
| `accent_light_level` | 1.1.{0,2,4,12}, 1.2.{0,3,4}, 1.3.{0,4}, 1.4.0, 2.1.{0,1,3}, 2.2.{1,3}, 2.3.0, 2.4.{1,3}, 2.5.0, 2.6.0, 2.7.{1,2}, 2.8.0, 2.9.0, 11.1.3, 13.{1..5}.0 |
| `accent_light_level`, `ice_maker_on` | 2.6.1, 2.8.1, 2.9.1 |
| `kitchen_timer2_active` | 3.1.1, 3.1.2, 3.2.2 |
| `cav2_probe_on`, `kitchen_timer2_active` | 3.2.1 |
| `high_use_on`, `short_vacation_on`, `long_vacation_on` | 5.1.0, 12.1.0, 14.{1,2,3}.0, 18.1.0, 18.3.0 |
| `air_filter_pct_remaining` | 5.4.0 |
| `air_filter_pct_remaining` and the three wine modes | 18.4.0 |
| `softener_low` | 6.1.0 |
| `cav2_probe_on` | 15.2.4, 15.2.5 |

### 6.9 Notifications

An appliance reports events in two forms:

- **Inline**, in a push update or snapshot: the keys `notif_seq` (int), `notif_type` (int) and `timestamp` (string) sit directly among the state properties. [I][A]
- **History**, in snapshots and `get`: `"notifs": [{"notif_seq": 41, "notif_type": 101, "timestamp": "2026-10-07T22:14:05"}, ...]`. [I][A]

The app appends inline records to its `notifs` list (`_processNotification`). [A] The integration does the same:
- It converts an inline record to `notifs: [record]` and drops records with the wrong types (`api.py: notification_records`).
- Each event is identified by `(timestamp, notif_seq, notif_type)`. Up to 256 identities are retained.
- Events dated before the integration loaded are ignored.
- The first snapshot or read only sets a baseline, without firing events.
- This identity check removes duplicates even when the appliance resets its sequence counter. [I]

| Code | App enum | Integration event type |
| --- | --- | --- |
| 0 | unknown | `unknown` |
| 101 / 102 / 103 | refDoorAjar / frzDoorAjar / wineDoorAjar | `refrigerator_door_ajar` / `freezer_door_ajar` / `wine_door_ajar` |
| 104 | wineSetTempChanged | `wine_setpoint_changed` |
| 105 | refFrzServiceRequired | `refrigerator_service_required` |
| 106 / 107 | refSetTempChanged / frzSetTempChanged | `refrigerator_setpoint_changed` / `freezer_setpoint_changed` |
| 108 / 109 | waterFilterExpired / airFilterExpired | `water_filter_expired` / `air_filter_expired` |
| 112 | wineTempAlert | `wine_temperature_alert` |
| 113 | iceDoorAjar | `ice_maker_door_ajar` |
| 114–119 | iceCleanRequired, iceCleanSoon, iceCleanAddDescale, iceCleanAddSanitizer, iceCleanCancelled, iceCleanComplete | `ice_cleaning_required`, `_due_soon`, `_add_descaler`, `_add_sanitizer`, `_cancelled`, `_complete` |
| 201 / 202 | cavAtSetTemp / cav2AtSetTemp | `oven_preheated` / `lower_oven_preheated` |
| 203 / 204 | cavProbeOn / cav2ProbeOn | `oven_probe_connected` / `lower_oven_probe_connected` |
| 205 / 206 | cavProbeAtSetTemp / cav2ProbeAtSetTemp | `oven_probe_target_reached` / `lower_…` |
| 207 / 208 | kitchenTimerComplete / kitchenTimer2Complete | `kitchen_timer_complete` / `kitchen_timer_2_complete` |
| 209 / 210 | kitchenTimerWithin1Min / kitchenTimer2Within1Min | `kitchen_timer_under_one_minute` / `kitchen_timer_2_…` |
| 211 / 212 | cavCookTimerComplete / cav2CookTimerComplete | `oven_cooking_timer_complete` / `lower_…` |
| 213 / 214 | cavCookTimerWithin1Min / cav2CookTimerWithin1Min | `oven_cooking_timer_under_one_minute` / `lower_…` |
| 215 / 216 | cavProbeWithin10Deg / cav2ProbeWithin10Deg | `oven_probe_within_ten_degrees` / `lower_…` |
| 217 | ovenServiceRequired | `oven_service_required` |
| 218 / 219 | cavDoorAjar / cav2DoorAjar | `oven_door_ajar` / `lower_oven_door_ajar` |
| 220 / 221 | cavSelfCleanComplete / cav2SelfCleanComplete | `oven_self_clean_complete` / `lower_…` |
| 301 / 302 | washCycleOn / washCycleComplete | `dishwasher_started` / `dishwasher_complete` |
| 303 / 304 | softenerLow / rinseAidLow | `softener_salt_low` / `rinse_aid_low` |
| 305 | dishwasherServiceRequired | `dishwasher_service_required` |
| 306 / 307 | washCyclePaused / washCycleCanceled | `dishwasher_paused` / `dishwasher_cancelled` |
| 400 / 401 | faultNotification / feedbackNotification | `fault_notification` / `feedback_notification` |

Codes are confirmed in both the app (`NotificationType`) and the integration (`const.py: NOTIFICATION_TYPES`). [A][I]

### 6.10 Example snapshot (synthetic, refrigerator)

```json
{
  "appliance_model": "MODEL-X",
  "appliance_type": "17.2.6.1",
  "appliance_serial": "SERIAL-PLACEHOLDER",
  "version": {"fw": "2.27", "rtapp": "2.27", "bleapp": "3.0", "api": "5.5"},
  "time": "2026-10-08T02:53:29+00:00",
  "uptime": "387:52:1",
  "ref_set_temp": 37, "ref_door_ajar": false,
  "frz_set_temp": 0, "frz_door_ajar": false,
  "ice_maker_on": true, "max_ice_on": false, "night_ice_on": false,
  "air_filter_on": true, "air_filter_pct_remaining": 73, "water_filter_pct_remaining": 73,
  "sabbath_on": false, "service_required": false, "door_ajar_timeout": 5,
  "notifs": [{"notif_seq": 41, "notif_type": 101, "timestamp": "2026-10-07T22:14:05"}]
}
```

---

## 7. Enumerations

### 7.1 `wash_status` (dishwasher)

| Code | App enum | App display | Integration label |
| --- | --- | --- | --- |
| 0 | idle | Idle | Idle |
| 1 | startPending | Idle | Idle |
| 2 | running | Running | Running |
| 3 | restartPending | Paused | Paused |
| 4 | cancelPending | Canceling | Canceling |
| 5 | drying | Drying | Drying |
| 6 | complete | Done | Done |
| 7 | delayed | Delayed | Delayed |
| 8 | error | Error | Error |

[A][I] An idle DW2450 reported `1`. [O]

### 7.2 `wash_cycle`

| Code | App enum | Integration label |
| --- | --- | --- |
| 0 | idle | None (not writable) |
| 1 | auto | Auto |
| 2 | normal | Normal |
| 3 | heavy | Heavy |
| 4 | quick | Quick |
| 5 | potsAndPans | Pots and pans |
| 6 | soakAndScrub | Soak and scrub |
| 7 | light | Light |
| 8 | crystalChina | Crystal and china |
| 9 | rinseAndHold | Rinse and hold |
| 10 | plastics | Plastics |
| 11 | energy | Energy |
| 12 | extraQuiet | Extra quiet |

[A][I]

### 7.3 Dishwasher `mode`

App `SpecialMode`: `0` off, `1` childLock, `2` sabbath. [A][I] `mode == 2` counts as Sabbath for the global lock (§8.2).

### 7.4 Cook modes (`cav_cook_mode`, `cav2_cook_mode`)

| Code | App enum | Label | Manual-only (start at the oven) |
| --- | --- | --- | --- |
| 0 | off | Off | n/a |
| 1 | bake | Bake | |
| 2 | roast | Roast | |
| 3 | broil | Broil | yes |
| 4 | stone | Bake stone | |
| 5 | convectionBake | Convection bake | |
| 6 | convectionRoast | Convection roast | |
| 7 | convectionBroil | Convection broil | yes |
| 8 | convection | Convection | |
| 9 | proof | Proof | yes |
| 10 | dehydrate | Dehydrate | |
| 11 | selfClean | Self clean | yes |
| 12 | warm | Warm | |

Codes are confirmed in the app; only these 13 modes have wire values. The app's other modes (steam, microwave, gourmet, ...) have none. [A] The manual-only set is `const.py: MANUAL_COOK_MODES`. A Gourmet program (`cav*_gourmet_mode_on`) must also be started at the oven. [I]

Modes offered per series and cavity (`controls.py: cook_mode_offered`) [I]:
- 5 only on series 3, upper cavity.
- 12 on every series except 3.
- For `cav2`: 6, 8 and 10 are not offered on series 3 or types 15.2.4 and 15.2.5; 4 is not offered on 15.2.4, 15.2.5 or 8.2.0.

Broil level shown by the app while broiling (mode 3): setpoint < 400 °F Low, < 500 °F Medium, otherwise High (`broil_level.dart: BroilLevel.fromTemperature`; `const.py: BROIL_LEVELS`). [A][I]

### 7.5 Oven setpoint ranges (°F, by series and mode)

| Series | 1, 2, 4, 6 | 5 Conv. bake | 8 Convection | 9 Proof | 10 Dehydrate | 12 Warm |
| --- | --- | --- | --- | --- | --- | --- |
| 3 (eSeries) | 170–550 | 170–550 | 120–550 | 85–110 | 110–160 | not offered |
| 4, 8, 15 | 200–550 | not offered | 200–550 | 85–110 | 110–170 | 140–200 |
| unknown series | 85–550 | 85–550 | 85–550 | 85–550 | 85–550 | 85–550 |

- Modes 0, 3, 7 and 11 have no adjustable setpoint. A mode missing from a known series' table has no range, so its setpoint cannot be written. [I]
- Probe target: 120–210 °F, in 5 °F steps in the UI.

Source: `const.py: OVEN_TEMPERATURE_RANGES`, `controls.py: temperature_range`. [I] The constant's comment says the series 4/8/15 values follow Wolf's manuals and that the app files series 4 Convection under Convection bake. The app keys its ranges by series only, for both cavities, and its range-series table matches row 4, 8, 15 (`screens/overlays/oven_temperature_overlay/models/oven_temperature_ranges.dart`) [A]; the other rows are not re-derived [?].

### 7.6 Gourmet recipes (`cav*_gourmet_recipe`)

`0` None, `1–79` named programs in this order: beef (1–24), pork (25–30), poultry (31–40), lamb (41–43), vegetables and potatoes (44–46), fish (47–49), cakes and cookies (50–61), pies, breads and rolls (62–69), pizza and calzone (70–72), casseroles, quiche and lasagna (73–79). The full list is in `const.py: GOURMET_RECIPES`. [I] The app has a matching `GourmetRecipe` model [A]; the one-to-one order is not re-verified [?]. The app shows the program only while `cav*_gourmet_mode_on` is true. [I]

### 7.7 Ice maker clean stage (`ice_maker_clean_stage`)

| Code | App enum | Code | App enum |
| --- | --- | --- | --- |
| 0 | off | 63 | descaleRinse |
| 50 | notCleaning | 64 | sanitizeFill |
| 51 | emptyBin | 65 | sanitizeAddCleaner ("Add sanitizer") |
| 52 | manuallyClean | 66 | sanitizeClean |
| 53 | addDescaler | 67 | sanitizeFlush |
| 60 | descaleFill | 68 | sanitizeRinse |
| 61 | descaleClean | 73 | cleanResetFlush |
| 62 | descaleFlush | 74 | cleanResetRinse |
| | | 80 | cleanComplete |

[A][I]

Ice maker status as the app orders it: `failsafe_on` means Disabled, `delay_active` means Delayed, `winterize_on` means Off, otherwise `ice_maker_on` decides On or Off. [I] The app reads `winterize_on` for DICE from the device twin (§3.2). [A]

### 7.8 Refrigerator enums

| Property | Values | Writable values |
| --- | --- | --- |
| `humidity_control` | 0 disabled, 1 normal, 2 enhanced, 3 low | 1, 2 [I] |
| `crisp_temp_mode` | 0 manual, 1 automatic | 0, 1 |
| `night_mode` | 0 disabled, 1 enabled | 0, 1 |

Values from the app's enums [A]; writable values from the integration [I].

### 7.9 Accent light (`accent_light_level`)

| Level | Standard value | Legacy value (series 1, 5, 7) |
| --- | --- | --- |
| Off | 0 | 0 |
| On | 100 | 100 |
| Low | 110 | 30 |
| Medium | 120 | 50 |
| High | 130 | 70 |

The value tables come from the app's `accentLightLevelToInt` and `legacyAccentLightLevelToInt`. The legacy table is used for series 1 (bi), 5 (wine) and 7 (pro). [A][I] (`LEGACY_ACCENT_LIGHT_SERIES`) Selectable levels [I]:
- series 1: Off and On only;
- every other series: Off, Low, Medium and High. On (100) is displayed but not offered.

### 7.10 `door_ajar_timeout`

`0` off, `1`, `2`, `5`, `10` (minutes before an open door raises a notification). [I]

### 7.11 Hood values

| Property | Range / values |
| --- | --- |
| `fan_speed` | 0–4 (app enum off, low, medium, high, max) [A][I] |
| `light_percent` | 5–100 [I] |
| `color_level` | 0–100; the integration maps it to 2700 + 23 × level K [I][?] |
| `halo_max_percent` | 0 or 30; any nonzero value counts as on [I] |
| `auto_sensivity` | −1 off, 0 low, 1 medium, 2 high [I]; the app enum is off, low, medium, high [A] |
| `delay_off_duration` | 0–719 minutes, in ms [I] |

### 7.12 Fault severity (`corporateSeverity`)

`0` undefined, `1` low, `2` medium, `3` high, `4` critical, `5` urgent. [A][I] Missing or non-integer values become `1`. Unknown integers are labeled `unknown`. [I]

---

## 8. Writes

### 8.1 Settable properties

Writes go through `set`, one property per call (`api.py: set_property` checks the key against `WRITABLE_BOOLEAN_KEYS` / `WRITABLE_INTEGER_KEYS` and the type: `bool` for booleans, `int` for integers). [I]

| Appliance | Boolean | Integer (range) |
| --- | --- | --- |
| Refrigerator / wine | `sabbath_on`, `high_use_on`, `short_vacation_on`, `long_vacation_on`, `ice_maker_on`, `max_ice_on`, `night_ice_on`, `air_filter_on`, `internal_dispenser_enabled` | `ref_set_temp`, `ref2_set_temp` (34–42; 34–45 for series 1, 2, 22 and 5.2; 34–55 for 13.3 and 13.6), `frz_set_temp` (−5–5), `crisp_set_temp`, `wine_set_temp`, `wine2_set_temp` (40–65), `crisp_temp_mode`, `humidity_control`, `night_mode`, `accent_light_level`, `door_ajar_timeout` |
| Ice maker (DICE) | `ice_maker_on` | `door_ajar_timeout`; the delay (§8.3) |
| Oven | `cav_unit_on`, `cav2_unit_on`, `cav_light_on`, `cav2_light_on` | `cav*_cook_mode`, `cav*_set_temp`, `cav*_probe_set_temp` (120–210), `kitchen_timer_duration`, `kitchen_timer2_duration` (0–719 min) |
| Dishwasher | `wash_cycle_on`, `heated_dry_on`, `extended_dry_on`, `high_temp_wash_on`, `sani_rinse_on`, `top_rack_only_on` | `wash_cycle` (1–12), `mode` (0–2), `delay_start_timer_duration` (0–12 h) |
| Hood | `fan_on`, `light_on`, `delay_enabled`, `key_tone_on`, `user_lock_on` | `fan_speed`, `light_percent`, `color_level`, `halo_max_percent`, `auto_sensivity`, `delay_off_duration` (§7.11) |

When no `appliance_type` is reported, the refrigerator maximum falls back to the model: 45 °F for `appliance_model` starting with BI, IT, IC or ID, otherwise 42 °F. [I]

### 8.2 Interlocks

| Rule | Source |
| --- | --- |
| Sabbath (`sabbath_on` true, or `mode == 2`) disables every app control, including turning Sabbath off | [A][I] (`controls.py: sabbath_enabled`, `coordinator.py: _command`) |
| While either cavity's `cook_mode` is 11 (self clean), only `cav*_unit_on = false` is allowed, for both cavities | [A][I] (`control_lock`) |
| `cav*_light_on` is locked while that cavity is on in Proof (mode 9) | [A][I] |
| `cav*_set_temp` and `cav*_cook_mode` writes require `cav*_unit_on` or `cav*_remote_ready` | [I] |
| A cook-mode change on knob ovens (`KNOB_OVEN_TYPES`) requires `cav*_mode_change_enabled` | [I] (comment attributes this to the app) |
| A manual-only mode cannot be selected remotely unless it is already selected; modes not offered for the series or cavity are refused | [I] |
| `cav*_probe_set_temp` requires `cav*_probe_on` | [I] |
| `frz_set_temp` is refused while `max_ice_on` is true | [I] |
| `crisp_set_temp` requires `crisp_temp_mode == 0`. Range: max(34, ref − 2) to min(ref max, ref + 2) | [I] |
| Dishwasher `wash_cycle`, `mode` and options only while `wash_status` ∈ {0, 1} | [I] |
| Options hidden per cycle: Rinse and hold (9) has none; `heated_dry_on` not for 8, 11; `extended_dry_on` not for 4; `high_temp_wash_on` and `sani_rinse_on` not for 4, 8, 11, 12; `top_rack_only_on` not for 5, 6, 10, 11 | [A][I] (`cycle_options_overlay_controller.dart: _setOptions`; `DISHWASHER_OPTION_EXCLUDED_CYCLES`) |
| `delay_start_timer_duration` only while `wash_status` ∈ {0, 1, 7}, and not for cycles 4 or 9 | [A][I] (`delayed_start_tile_controller.dart: setEnabled`); the app also skips the delay write for cycle 9 at start |
| `reset_air_filter` only for series 22 | [A][I] |

### 8.3 Ordered multi-write sequences

Each step is a separate `set` that is awaited, and confirmed in the integration, before the next is sent.

**Oven remote start** [A][I] (`controls.py: start_properties`, `coordinator.py: async_start`)

Preconditions [I]: `cav*_remote_ready` true, door closed, a supported cook mode (not 0, not manual-only, not Gourmet), and a setpoint > 0 within range.

1. `set {"cav_cook_mode": <current mode>}`
2. `set {"cav_unit_on": true}`
3. `set {"cav_set_temp": <target>}`

- All three are sent even when the appliance already reports the value ("forced"). [I]
- Series 3 (eSeries) and 4 (mSeries): the integration sends `cav*_set_temp` (only if a temperature was requested) and then `cav*_unit_on: true`; per its comment, "E series and M series start with a power write alone". [I][?]
- If the cavity is already on, only the setpoint and `unit_on` are written, without forcing. [I]
- **Off**: `set {"cav_unit_on": false}`. Selecting cook mode Off writes this. [I]

**Dishwasher start** [A]: the app sends
1. `wash_cycle` (if changed in its start dialog),
2. `delay_start_timer_duration` (if changed; not for cycle 9),
3. each option (if changed),
4. `wash_cycle_on: true`.

The integration writes cycle, delay and options whenever the user changes them, and its Start button sends only a forced `wash_cycle_on: true`. Preconditions: `remote_ready` true, `door_ajar` false, `mode != 2`. [I]

**Dishwasher cancel**: a forced `set {"wash_cycle_on": false}`, available while `wash_status` ∈ {2, 5, 7}. It is sent even when `wash_cycle_on` already reads false, which happens during a delayed start. [I]

**Ice modes** (refrigerator, `controls.py: ice_mode_properties`) [I]; the README attributes the order to the app:

| Target | Writes, in order |
| --- | --- |
| Off | `max_ice_on: false`, `night_ice_on: false`, `ice_maker_on: false` (each key the appliance supports) |
| On | `max_ice_on: false` and `night_ice_on: false` (only if currently true), then `ice_maker_on: true` |
| Max ice | `night_ice_on: false` (if currently true), then `max_ice_on: true` |
| Night ice | `max_ice_on: false` (if supported), then `night_ice_on: true` |

**Refrigerator operating mode**: `false` for each other reported mode key, then `true` for the selected one. Normal writes only the `false` values. [I]

**DICE ice delay** (`api.py: set_ice_delay`, one `set` with several keys) [I]; the app saves the delay with a batch as well [A]:

```json
{"cmd": "set", "params": {"delay_start_offset": 1800, "delay_duration": 7200, "delay_recurring": true}}
```

- `delay_duration` is a multiple of 3600 from 0 to 43200 s. `delay_start_offset` is 0–86399 s and is omitted when 0.
- Cancel the schedule: `{"delay_duration": 0}`.
- End the current delay without removing the schedule: command `exit_delay`.
- Each change is followed by a `get`.

**Kitchen timers** [I]:
- `set {"kitchen_timer_duration": N}` with N = 1–719 minutes starts or restarts the timer.
- `0` cancels a running timer, or dismisses a completed one (the app's "Tap to Dismiss").
- A write is confirmed when `kitchen_timer_active` is true with a duration of N minutes (end − start) and the timer restarted: it was not running before the write, or its end time changed. Start and end are on the appliance's clock, which can differ from Home Assistant's. A timer whose end time did not change confirms only when it is within ±65 s of request time + N minutes, such as a restart within the same second. A cancel is confirmed when `*_active` is false. (`controls.py: control_matches`)

**Hood** [I]:
- Fan on: `fan_speed` (`ceil(percent / 25)`), then `fan_on: true`.
- Light on: `light_percent`, then `color_level`, then `light_on: true`.
- Halo on or off: `halo_max_percent` 30 or 0.

### 8.4 Confirmation

`set` acknowledgements are not trusted as proof of a change. The integration confirms every write from appliance state. [I] (`coordinator.py: _async_set_property`)

- Writes to one appliance are serialized. If a cancelled command left the outcome unknown, the next write first reads state.
- Each property gets up to 3 attempts. One attempt has 8 s (`CONTROL_CONFIRM_TIMEOUT`) for the request plus a push update matching the value (`CONTROL_PUSH_TIMEOUT` 5 s). If no push confirms it, a `get` follows; that read is not cut short by the deadline.
- 429 and auth errors abort at once. Each retry rechecks the interlocks.
- A forced re-send of a value the appliance already reports succeeds only if the cloud acknowledges it.
- The ice delay and `reset_air_filter` are followed by a `get`.

---

## 9. Faults

**List**: `GET /fault-notifications/v1/notifications/device/{deviceId}`, polled every 30 minutes. HTTP 404 means no faults. [I] The app also special-cases 404. [A]

```json
[
  {"id": "f-0001", "fault": "ICE01", "corporateSeverity": 3, "active": "true",
   "description": "Ice maker", "createdTime": "2026-03-01T12:00:00+00:00", "deviceId": "dev-0001"}
]
```

| Field | Type | Integration handling |
| --- | --- | --- |
| `id` | string | Not used [I]; used by the app for updates [A] |
| `fault` | string | Fault code; anything else becomes null |
| `corporateSeverity` | int | §7.12; default 1 |
| `active` | `"true"`/`"false"` or bool | Only `"true"` or `true` count as active |
| `description` | string | Optional |
| `createdTime` | ISO 8601 | Required; records without a parseable value are dropped |
| `deviceId` | string | Not used |

The active-fault count and details come from this endpoint, not from the `active_faults` property, which the app also ignores. [I][A]

**Metadata**: `GET /faults-meta-data/v1/Search?code={fault}&appliesTo={series name}`. `appliesTo` is the series name from §6.2, for example `nge` or `dice`. [I][A] The response is a list of `{title, resolutionSteps, cause, serviceNotes, articleLink, appliesTo}`. [A]

The integration [I]:
- uses the **last** item;
- keeps `title`, and `resolutionSteps` (a string, or a list of strings joined with newlines);
- fetches metadata only for active faults, caches it per `(code, series)`, and ignores errors.

---

## 10. Rate limits and errors

| Condition | Integration behavior | Source |
| --- | --- | --- |
| HTTP 429 | `Retry-After` is read as seconds or an HTTP date (minimum 1 s; 600 s if missing or invalid). All further requests from that client fail locally with `RateLimited` until then | [I] (`retry_delay`, `_json`) |
| 429 during a periodic read | That read is skipped; push continues | [I] |
| 429 during setup | Setup is retried later (`ConfigEntryNotReady`) | [I] |
| 429 while opening channels | The connection is dropped; reconnect waits at least `Retry-After` | [I] |
| 401/403 on APIM | Refresh the token, retry once, then re-authenticate | [I] |
| 400/401/403 from `TOKEN_URL` | Re-authenticate | [I] |
| 404 on fault list | No faults | [I][A] |
| Fault metadata error | Ignored | [I] |
| Direct method HTTP 500 | Success only for `{"Message":"OK"}`; otherwise an error (§4.2) | [I] |
| Transport error or timeout | `ApiError`; recovery reads retry with backoff 30–900 s | [I] |

Sub-Zero publishes no quota. At the default 10-minute check, an appliance whose push is otherwise silent costs up to 144 `open_cloud_async` calls a day, plus a `get` for each reopen that goes unanswered. [I] No `Retry-After` handling was found in the app's request wrapper [A?].

---

## 11. Additional app features and protocols

- **Time settings**: `POST /consumerapp/api/consumer/device/upgrade/{id}/timesettings` with `{"timezone_id_name", "dst_observed", "is_new_registration"}`. The current zone is read from device-twin property `time_settings.timezone_id_name`. [A]
- **Device twin**: `GET /devices/v3/devices/{id}/twin/property/{name}` returns `{"Value": ...}`. Used for `time_settings` and, on DICE, `winterize_on`. [A]
- **BLE**: GATT services with an open channel, an encrypted channel and an unlock handshake (`unlock_channel_encrypted1/2`). [A] Commands are JSON with a `cmd` field:
  - `{"cmd":"set","params":{...}}`
  - `{"cmd":"get_async"}`
  - `wifi_scan`, `connect_wifi` (ssid and password)
  - `display_pin`
  - `set_time` with `{"time": "yyyy-MM-dd'T'HH:mm"}` in phone local time
  - `reset_air_filter`, `reset_filter`
  - `open_async_channel_open` / `open_async_channel_encrypted`
- **Account and setup**: appliance association, decommission, rename, PIN storage, firmware metadata, phone push registration (§3.2). [A]
- **Phone alerts (Firebase Cloud Messaging)**: Sub-Zero's cloud sends alerts such as a door left open as FCM messages, independent of the §5.7 channels. [A] (`services/notifications/push_notifications_service.dart`)
  - The alert types are the 48 `notif_type` codes the integration already turns into events (`const.py: NOTIFICATION_TYPES`): 1xx refrigeration and ice, 2xx cooking, 3xx dishwasher, 400 faults, 401 feedback. [A]
  - Each phone registers under its own `psid`, the Android ID cached in shared preferences. Records are per `psid`, so each phone keeps its own registration. [A]
  - Register, per appliance: `POST /consumerapp/api/notification/registrations` with `{"id": <new UUID>, "fcmToken", "deviceId": <appliance>, "psid", "mobile_name"}`. Updates use `PUT`. The current record is at `GET .../registrations/devices/{psid}/appliances/{deviceId}`. [A]
  - Choose alerts: `POST /consumerapp/api/notification/devices/{psid}/events` with header `uuid: <psid>` and a JSON list of `{"deviceId", "mutable_content": false, "valueType": <code>, "body_loc_key", "sound": null, "clickAction": null}`. `body_loc_key` is an app localization key (`NotificationKeyToLocalizable`, for example `fridge_refrigerator_door_open` for 101). Setup sends the alert codes applicable to the appliance (`ConnectedAppliance._getNotificationTypes`). The integration chooses cavity-specific right/left keys for dual-cavity ranges; those names are present in the APK resources, though live delivery has only been verified for the earlier prototype subscriptions. `GET .../devices/{psid}/appliances/{deviceId}/events` returns the current list. [A][O]
  - Remove alerts: `DELETE .../devices/{psid}/events/type` with header `uuid: <psid>` and `{"valueTypes": ["101", ...], "deviceId"}`. [A]
  - Faults (400) use a second, per-user store: `/api-user-fcm/v2/user-fcms`, keyed by `user/{userId}/psid/{psid}` with `{userId, fcm, psid, createdDate}`, and `/api-user-fcm/v2/subscriptions` with `{userId, psid, valueType, titleLocKey, bodyLocKey, sound, clickAction, createdDate}`. [A]
  - The app reads alert fields from the message's data block: `deviceId`, `bodyLocKey`, `value`, `title`, `clickAction`, `documentId`, `url`. [A]
  - The APK carries the Firebase project configuration and is signed with its Google Play key. The `firebase-messaging` library, which Home Assistant's Ring integration uses, registers under that project as a Chrome web-push client. [O]
  - Tested end to end on 2026-10-08 with five appliances and a random 16-hex `psid` [O]:
    - Registration returns HTTP 200 with the record ID as a JSON string.
    - Choosing alerts returns a list of IDs. Reading back returns the stored entries, with `valueType` as a string and `title_loc_key` filled in by the server.
    - Removing alerts returns `true`.
    - No call removes the registration itself, so a client should reuse its `psid`.
  - Alerts arrive about 1 s after the event. Example from four range kitchen-timer alerts (209, 210, 207, 208) [O]:

    ```json
    {"from": "<sender id>", "priority": "normal", "fcmMessageId": "<uuid>",
     "notification": {"title": "Sub-Zero, Wolf, and Cove"},
     "data": {"deviceId": "<appliance id>", "value": "209", "notifSeq": "46", "seq": "2823",
              "event_time": "1791475976000", "timestamp": "10/08/2026 16:12:56",
              "mutable_content": "False", "data": "null"}}
    ```

    - `value` is the `notif_type` code and `notifSeq` the appliance's `notif_seq`, both as strings.
    - `event_time` is epoch milliseconds. `timestamp` is the same instant in UTC, as `MM/dd/yyyy HH:mm:ss`.
    - The message carries no alert text: the localization keys apply only to phone notifications.
- **Demo mode**: canned snapshots per type (`services/demo/properties/t<series>_<category>_<version>.dart`). They are the only place `smart_grid_on`, `showroom_on`, `service_mode` and `pin_window_open` appear. Useful as shape references; the values are not real. [A]

---

## 12. Open questions

1. **`set` acknowledgement shape.** The app reads `pload.pload.status`; the integration has seen `resp`-wrapped bodies. Which does the cloud actually return for `set`, and does `{"Message":"OK"}` with HTTP 500 really occur?
2. **`message.type` in `api.async_channel`.** What do the values mean (tests use 1 and 2)? Can it replace content-based snapshot detection?
3. **Connection lifetime.** What is the SignalR access-token lifetime, and does the service close connections? The app renews after 55 min and the integration after at most 50 min.
4. **Why one appliance's push stops** while the shared connection stays up, and whether `open_cloud_async` channels expire on a timer. The app gives no answer: it reopens every channel on each return to the foreground and never keeps one open longer than a session (§5.7).
5. **`userId` header mapping.** Which ID token claim do the app's `azureObjectId` and `sitecoreUserId` hold, and does the APIM backend care which one is sent?
6. **App API scope.** The middle segment of `https://SubZeroB2CPrd.onmicrosoft.com/<...>/read` is unknown. Does the access token from that scope work as the bearer?
7. **Celsius appliances.** Do they report °F on the wire? The integration assumes so.
8. **`diagnostic_status`.** Exact length and prefix (12 vs 13 characters, `0x`).
9. **Hood units.** Are `filter_count` and `filter_max_count` in seconds? Is the 2700–5000 K mapping of `color_level` correct?
10. **`reset_filter` and `start_immediately`.** In 4.6.0, `reset_filter` reaches the hood only over BLE and `start_immediately` is a UI toggle. A cloud path for either is unconfirmed.
11. **`winterize_on`.** Does it ever appear in `get` or push for DICE, or only in the device twin?
12. **Pushed properties.** Which properties are pushed on change? Temperatures sometimes change only between reads; door changes are expected to be pushed.
13. **Legacy argument form.** When is the two-argument SignalR form (`[userId, envelope]`) still sent?
14. **Oven start on series 3/4.** Confirm the power-only start in the app, and the full per-series setpoint ranges.

---

## Appendix: where things live

| Topic | Integration | App 4.6.0 (`asm/szg_digital_product_experience/`) |
| --- | --- | --- |
| B2C sign-in, MFA, CAPTCHA | `auth.py: SubZeroLogin` | `services/authentication/` |
| Tokens, headers, REST | `api.py: token_state`, `SubZeroClient._request`, `_json` | `services/azure_apim/azure_apim_service.dart` |
| Direct methods | `api.py: _command`, `_rejected`, `_check_control_response` | `services/direct_methods/direct_methods_extension.dart`, `devices/azure_appliance_connection_interface.dart` |
| SignalR | `api.py: _watch_connection`, `parse_notification` | `services/signalr/signalr_service.dart`, `models/signalr_message.dart` |
| State merge, reads, reopen, events | `coordinator.py: SubZeroCoordinator` | `devices/connected_appliance.dart` (`processProperties`, `_extractEventBody`, `_processNotification`) |
| Type parsing, interlocks, ranges, write order | `controls.py` | `devices/models/appliance_type.dart`, `devices/models/*` |
| Property sets, enums, exclusions | `const.py` | `objs.txt` (`AppliancePropertiesEnum`, `NotificationType`, `WashStatus`, ...) |
| Faults | `api.py: appliance_faults`, `fault_metadata`; `coordinator.py: SubZeroFaultsCoordinator` | `services/appliance_faults/` |
| Device twin, time settings | n/a | `services/device_twin/`, `services/appliance_management/appliance_management_service.dart` |
| BLE | n/a | `devices/ble_appliance_connection_interface.dart` |
