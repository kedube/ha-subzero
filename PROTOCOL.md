# Sub-Zero Group cloud protocol

A reference for the cloud service behind the Sub-Zero Group Owner's App, as used by this Home Assistant integration (`custom_components/subzero/`). Sub-Zero doesn't document the service. Everything here comes from the integration's code and tests, the decompiled Android app, and traffic and diagnostics from real appliances. Last updated 2026-10-22.

**Contents:** [About this document](#about-this-document) · [1. Architecture](#1-architecture) · [2. Sign-in](#2-sign-in) · [3. REST API](#3-rest-api) · [4. Direct methods](#4-direct-methods) · [5. Live updates](#5-live-updates) · [6. Firebase alerts](#6-firebase-alerts) · [7. Appliance state](#7-appliance-state) · [8. Events](#8-events) · [9. Enumerations](#9-enumerations) · [10. Writes](#10-writes) · [11. Faults](#11-faults) · [12. Errors and rate limits](#12-errors-and-rate-limits) · [13. Keeping state current](#13-keeping-state-current) · [14. Observations](#14-observations) · [15. Other app features](#15-other-app-features) · [16. Open questions](#16-open-questions) · [Source map](#source-map)

## About this document

### Sources

Each statement carries one or more tags:

| Tag | Source |
| --- | --- |
| **[I]** | The integration's code. A reference such as `api.py: parse_notification` names the file and symbol. |
| **[A]** | The decompiled Sub-Zero Group Owner's App, Android 4.6.0, in `.research/blutter-4.6.0/` (not committed). |
| **[O]** | Seen on real appliances, in live traffic, or in diagnostics downloads. Dated where it matters. |
| **[?]** | Inferred, partial, or unconfirmed. Treat it as a hypothesis. |

About the app sources:
- 4.6.0 was decompiled from its arm64 build with blutter. Function names, string constants, and call targets survive; local variable names don't.
- 4.6.2 was available only as a 32-bit ARM build, which blutter can't read. Its push-related strings match 4.6.0's, but a string comparison can't show code changes. [A]
- The iOS build is App Store–encrypted and holds the same Dart code, so it adds nothing. [A]

The real appliances behind most [O] statements are a Sub-Zero CL4850SID refrigerator, DEU2450BG beverage center, and DEU2450WDZ dual-zone wine unit, a Wolf DF48850SP range, and a Cove DW2450 dishwasher, on one account in the America/New_York time zone.

### Conventions

- Secrets appear only by constant name: `SUBSCRIPTION_KEY` (`app_config.py`), `CLIENT_ID` (`auth.py`), and the Firebase configuration (`app_config.py: FIREBASE_CONFIG`). Never paste their values into issues, logs, or this document.
- IDs, serials, tokens, and times in examples are synthetic. Examples leave out network identifiers.
- Property names are spelled as on the wire, including misspellings such as `auto_sensivity` and `decomissionDevice`.
- Integration references describe the code as of this document's date, without line numbers.

## 1. Architecture

### 1.1 Services

| Service | Address | Role | Integration |
| --- | --- | --- | --- |
| Azure AD B2C, custom policy `B2C_1A_SIGNUP_SIGNIN` | `https://login.subzero-wolf.com/SubZeroB2CPrd.onmicrosoft.com/...` (`auth.py: POLICY_BASE`) | Account sign-in and OAuth tokens | yes [I][A] |
| Azure API Management (APIM) | `https://prod.iot.subzero.com` (`api.py: API_BASE`) | REST API: appliance list, faults, push negotiation, direct methods | yes [I][A] |
| IoT Hub direct methods, through APIM | `POST /consumerapp/device/{id}/directmethod/executeAPICmd` | Commands to an appliance, such as `get` and `set` | yes [I][A] |
| Azure SignalR Service, hub `connectedappliances` | `https://<signalr-host>/client/?hub=connectedappliances` (`api.py: SIGNALR_ORIGIN`) | Live state and events from appliances | yes [I][A] |
| Firebase Cloud Messaging | Google | Phone alerts, such as a door left open | optional [I][A] |
| Bluetooth LE | n/a | Setup, Wi-Fi provisioning, local control | no [A] |

Non-production app builds use `https://dev.iot.subzero.com` and `https://test.iot.subzero.com`. The app's build flavors are `stag`, `prod`, `test`, and `dev`; only `prod` matters here. [A]

### 1.2 From sign-in to live state

1. **Sign in** with B2C's authorization code flow and PKCE, which returns an ID token, access token, and refresh token (§2). [I]
2. **List appliances**: `GET /consumerapp/user/devices` returns each appliance's ID, name, and temperature unit (§3.3). [I][A]
3. **Open the live connection**: `POST /signal-r/negotiateUser` returns a SignalR address and token; then SignalR's own negotiate, the WebSocket, and the handshake (§5). [I][A]
4. **Open each appliance's channel**: the direct method `open_cloud_async`. The appliance pushes its full state, then each change. [I][A][O]
5. **Read what's missing**: an appliance that hasn't pushed its state within 16 s is read with the `get` direct method (`coordinator.py: INITIAL_STATE_TIMEOUT`). [I]
6. **Write**: the direct method `set`, one property at a time, each confirmed from the appliance's reported state (§10.4). [I]
7. **Keep it current**: renew the connection at least every 50 minutes, check channels after events and while a door is open (§13), refresh faults every 30 minutes (§11), and optionally receive Firebase alerts (§6). [I]

## 2. Sign-in

### 2.1 Constants (`auth.py`)

| Constant | Value | Source |
| --- | --- | --- |
| `LOGIN_ORIGIN` | `https://login.subzero-wolf.com` | [I][A] |
| `POLICY_BASE` | `LOGIN_ORIGIN + "/SubZeroB2CPrd.onmicrosoft.com/B2C_1A_SIGNUP_SIGNIN"` | [I][A] |
| `AUTHORIZE_URL` | `POLICY_BASE + "/oauth2/v2.0/authorize"` | [I][A] |
| `TOKEN_URL` | `POLICY_BASE + "/oauth2/v2.0/token"` | [I][A] |
| `CLIENT_ID` | The app's production public client ID; there is no client secret | [I][A] |
| `REDIRECT_URI` | `com.szg.szgdigitalproductexperience://oauth/redirect` | [I][A] |
| `SCOPES` | `"openid offline_access " + CLIENT_ID` | [I] |

The app signs in with AppAuth in an external browser. It requests `openid`, `offline_access`, `profile`, and an API scope of the form `https://SubZeroB2CPrd.onmicrosoft.com/<...>/read`, whose middle segment is unknown [A][?]. The integration doesn't request the API scope, because it sends the ID token as the bearer (§2.7). [I] The app also has `B2C_1A_SIGNUP`, `B2C_1A_FORGOTPASSWORD`, and `.../oauth2/v2.0/logout`, which the integration doesn't use. [A]

### 2.2 Authorization code flow (`auth.py: SubZeroLogin.login`)

The integration walks B2C's web pages the way a browser does. [I]

1. Make `state` and `nonce` with `secrets.token_urlsafe(32)`, and a PKCE verifier with `token_urlsafe(48)`. The challenge is the base64url SHA-256 of the verifier, without padding.
2. `GET AUTHORIZE_URL?client_id=…&redirect_uri=…&response_type=code&scope=…&state=…&nonce=…&code_challenge=…&code_challenge_method=S256`.
3. Follow redirects by hand, at most 10, staying on `LOGIN_ORIGIN`. On a page that returns 200, parse the inline `var SETTINGS = {...}` object. `SETTINGS.api` must be `CombinedSigninAndSignup`.
4. Post the credentials (§2.3).
5. `GET {tenant}/api/{api}/confirmed?rememberMe=false&csrf_token={csrf}&tx={transId}&p={policy}`. The result is either:
   - a redirect to `REDIRECT_URI?code=…&state=…`. `state` is compared in constant time. An `error` parameter, or no `code`, means the sign-in failed (`InvalidAuth`); or
   - another page whose `SETTINGS.api` is `Phonefactor`: multi-factor verification (§2.5).
6. Exchange the code for tokens (§2.6).

The integration reads these `SETTINGS` fields: `csrf`, `transId`, `hosts.tenant`, `hosts.policy`, `api`, `pageViewId`, `isPageViewIdSentWithHeader`, and `config.enableCaptchaChallenge`, `config.retryLimit`, `config.pollIntervalInMilliseconds`, `config.pollLimit`. [I]

Session handling [I]:
- Sign-in pages share a cookie jar created with `quote_cookie=False`, since B2C rejects the quoted cookie values that a browser would send unquoted.
- Token requests use a separate HTTP session without those cookies.
- Sign-in pages are fetched with a browser's headers (`app_config.py: LOGIN_HEADERS`), token requests with an Android HTTP client's (`AUTH_HEADERS`). Both are representative, not captured from the app.

### 2.3 Form posts

B2C's background requests go to `LOGIN_ORIGIN + {hosts.tenant} + <path>?tx={transId}&p={hosts.policy}` with these headers, and answer with JSON containing a string `status`. [I]

| Header | Value |
| --- | --- |
| `X-CSRF-TOKEN` | `SETTINGS.csrf` |
| `X-Requested-With` | `XMLHttpRequest` |
| `Referer` | The last page loaded |
| `Accept` | `application/json, text/javascript, */*; q=0.01` |
| `Origin` | `LOGIN_ORIGIN`, except on GET |
| `x-ms-cpim-pageviewid` | `SETTINGS.pageViewId`, only when `isPageViewIdSentWithHeader` is true |

Credentials: `POST /SelfAsserted` with the form `request_type=RESPONSE&signInName=<email>&password=<password>`. `{"status":"200"}` means accepted; anything else, wrong credentials. [I]

### 2.4 CAPTCHA

The verification page may require a CAPTCHA before a code is sent: when `config.enableCaptchaChallenge` is `"true"`. [I]

| Step | Request | Success |
| --- | --- | --- |
| Get a challenge | `GET /SelfAsserted/DisplayControlAction/vbeta/captchaControlChallengeCode/GetChallenge?tx=…&p=…&challengeType=Visual` | `{"status":"200","challengeId":"…","challengeString":"<base64 PNG or data: URI>","azureRegion":"…"}` |
| Answer it | `POST …/captchaControlChallengeCode/VerifyChallenge?tx=…&p=…`, form `challengeId`, `captchaEntered`, `challengeType=Visual`, `azureRegion` | `status` `"200"`, `reason` `"Solved"` (any case), `isCaptchaSolved` `"true"`, and the same `challengeId`. `reason` `"UserMessageIfBypass"` also counts as solved. |

A `reason` of `WrongAnswer` or `NoChallengeSession`, or `status` `400`, means the answer was wrong. `azureRegion` is sent back as received, or empty; B2C's own script sends it empty (`get_captcha_challenge`). [I]

### 2.5 Multi-factor verification (Phonefactor)

The verification page defines `var UV_PHONE = {"PhoneNumbers":[{"Id":1,"MaskedNumber":"XXX-XXX-1234"}, ...]}`; the integration keeps the entries that have an `Id`. Requests go to `POST /Phonefactor/verify?tx=…&p=…`, where the path segment is `SETTINGS.api`. [I]

| Purpose | Form | `status` |
| --- | --- | --- |
| Send a text or call | `request_type=VERIFICATION_REQUEST&auth_type=onewaysms` (text) or `dialphone` (call)`&id=<PhoneNumbers[0].Id>` | `200` sent, `429` too many requests, `448` phone unreachable |
| Check a texted code | `request_type=VALIDATION_REQUEST&verification_code=123456` | `200` accepted, `449` wrong code, `429` too many requests |
| Poll a call | `request_type=VALIDATION_REQUEST`, without a code | `200` answered, `449` still pending, `448` unreachable |

- After a `449` for a code, the code counts as expired once `config.retryLimit` attempts are used (default 3), or once `pollIntervalInMilliseconds × pollLimit` has passed (default 5000 ms × 20; `pollLimit` is capped at 20). [I]
- A call is polled every `pollIntervalInMilliseconds`, up to `pollLimit` times. [I]
- After a `200`, `confirmed` is requested again without `rememberMe`, and the code it returns is exchanged. [I]

### 2.6 Tokens

**Code exchange**: `POST TOKEN_URL` with the form `grant_type=authorization_code&client_id=…&redirect_uri=…&code=…&code_verifier=…&scope=…`. HTTP 400, 401, or 403 means the sign-in failed. The answer must contain `access_token` and `refresh_token`; B2C also returns `id_token`, which the integration prefers (§2.7). [I]

**Refresh**: `POST TOKEN_URL` with the form `grant_type=refresh_token&client_id=…&refresh_token=…&scope=…` (`api.py: SubZeroClient.refresh`). [I]
- It runs before any request once the stored expiry is less than 300 s away. The expiry is `expires_at` in the stored state, or the bearer token's `exp` claim.
- It also runs once after an API 401 or 403, and the request is retried with the new token.
- A 400, 401, or 403 from the token endpoint, or a refresh that returns a different user ID, asks the user to sign in again.
- A rotated refresh token is saved; an answer without one keeps the old one.
- A saved sign-in without an ID token is refreshed once at startup to get one.

### 2.7 Bearer token and user ID

| Item | Integration | App |
| --- | --- | --- |
| Bearer | The ID token, or the access token if there is none (`api.py: _api_token`) [I] | Stores and sends the B2C ID token (`idToken`; its error text is "Id Token is null") [A]. Which field the header builder reads isn't fully traced [?] |
| User ID | The `mergedId` claim, or `sub`, from the bearer token (`api.py: token_state`) [I] | `IdToken` decodes `sub`, `mergedId`, `email`, `extension_accountType`, `extension_isMfaEnrolled`, and more [A]. Its `userId` header is `azureObjectId ?? sitecoreUserId ?? "unavailable"` on most requests, and `sitecoreUserId ?? azureObjectId ?? "unknown"` for `negotiateUser` (§5.1); how those map to the claims is unconfirmed [?] |
| Letter case | Lowercase `user_id` for push negotiation; original-case `api_user_id` for the `Userid` header elsewhere [I] | n/a |

The appliance list also returns `mySubZeroUniqueUserId`; the integration only logs a debug message when it differs from the user ID. [I]

## 3. REST API

### 3.1 Headers and timeouts

Every APIM request carries these headers. Header names are case-insensitive.

| Header | Value | Integration | App |
| --- | --- | --- | --- |
| `Authorization` | `Bearer <ID token>` | yes [I] | yes [A] |
| `Ocp-Apim-Subscription-Key` | `SUBSCRIPTION_KEY`, the same for every app install | yes [I] | yes; it differs per build flavor [A] |
| `Userid` | The account's user ID | yes [I] | as `userId` [A] |
| `Accept` | `application/json` | yes [I] | yes [A] |
| `Content-Type` | `application/json` on JSON bodies | yes [I] | yes [A] |
| `User-Agent` | `Dart/3.11 (dart:io)` | yes (`APP_HEADERS`) [I] | Dart's default [A?] |
| `Accept-Encoding` | `gzip` | yes [I] | Dart's default [?] |
| `app_version`, `app_platform` | For example `android` | no [I] | yes [A] |

The integration allows 40 s per request and doesn't retry on its own. [I] The app allows 30 s and retries an exception up to 4 times with exponential backoff (200 ms factor, 25 % jitter, 30 s at most). [A] Nothing in the app reads `Retry-After` [A?].

### 3.2 Endpoints the integration uses

Paths are relative to `API_BASE`; path and query values are URL-encoded. [I][A]

| Method | Path | Purpose | Answer |
| --- | --- | --- | --- |
| GET | `/consumerapp/user/devices` | The account's appliances (§3.3) | `{"mySubZeroUniqueUserId": str, "devices": [...]}` |
| POST | `/consumerapp/device/{deviceId}/directmethod/executeAPICmd` | A command to an appliance (§4) | §4.2 |
| POST | `/signal-r/negotiateUser` | The SignalR address and token (§5.1) | `{"url": str, "accessToken": str}` |
| GET | `/fault-notifications/v1/notifications/device/{deviceId}` | Fault records (§11) | A JSON list; 404 means none |
| GET | `/faults-meta-data/v1/Search?code={code}&appliesTo={series}` | A fault's title and resolution steps (§11) | A JSON list |
| POST, PUT, GET, DELETE | `/consumerapp/api/notification/...` | Firebase alert registration and subscriptions (§6) | §6 |

The app's `test` flavor negotiates at `/api-signalr/negotiateUser` instead; production uses `/signal-r/negotiateUser`. [A]

### 3.3 Appliance list

```json
{
  "mySubZeroUniqueUserId": "11111111-2222-4333-8444-555555555555",
  "devices": [
    {"id": "dev-0001", "name": "Kitchen refrigerator", "temperatureUnitForAppliance": "F"},
    {"id": "dev-0002", "name": "Wall oven", "temperatureUnitForAppliance": "C"}
  ]
}
```

A missing or empty `name` becomes `Sub-Zero`, and a `devices` that isn't a list is an error. [I] The app also reads each appliance's `bda` (Bluetooth address) and `order`. [A]

### 3.4 Endpoints only the app uses

| Method | Path | Purpose | Source |
| --- | --- | --- | --- |
| POST | `/consumerapp/api/consumer/device/upgrade/{deviceId}/timesettings` | Set the appliance's time zone: `{"timezone_id_name": "Eastern Standard Time", "dst_observed": true, "is_new_registration": false}`. The name is a Windows time zone ID derived from the phone's zone | [A] |
| GET | `/devices/v3/devices/{deviceId}/twin/property/{name}` | One device-twin property, as `{"Value": ...}`. The app reads `time_settings` and, for dedicated ice makers, `winterize_on` | [A] |
| GET, PUT | `/fault-notifications/v1/notifications/{id}` | Read or dismiss one fault. The PUT body has `fault`, `corporateSeverity`, `active`, `description`, `createdTime`, `userId`, `deviceId`, `notificationDismissal`, `notificationDate`, `eTag` | [A] |
| POST | `/consumerapp/device/user` | Add a newly set-up appliance to the account | [A] |
| GET | `/consumerapp/user/decomissionDevice/{deviceId}` | Remove an appliance from the account | [A] |
| POST | `/consumerapp/user/devices/{deviceId}` | Rename an appliance (`namePrefix`); the exact path is unconfirmed | [A][?] |
| GET, POST | `/consumerapp/user/devices/{deviceId}/pin` | Store and read the Bluetooth pairing PIN (`devicePin`) | [A] |
| GET, PATCH | `/users/v1/users/{userId}[/serialNumber]` | The account's appliance-user document and serial numbers | [A][?] |
| GET, POST, DELETE | `/deviceusersmetadata/...`, `/deviceusersmetadata/V2/...` | Firmware and metadata documents | [A] |
| various | `/api-user-fcm/v2/...` | Fault alert subscriptions (§6.4) | [A] |
| POST | `/consumerapp/logs/add`, `/consumerapp/offline/logs` | App logs | [A] |

## 4. Direct methods

### 4.1 Request

```text
POST /consumerapp/device/{deviceId}/directmethod/executeAPICmd
```

```json
{"req_id": "6f1c2d3e-4b5a-4c6d-8e7f-0a1b2c3d4e5f", "pload": {"cmd": "set", "params": {"ref_set_temp": 37}}}
```

- `req_id` is a new UUID v4 for every call. [I][A]
- `params` is left out for a command without parameters. [I]
- The body carries nothing that identifies the caller's live connection, and the app sends no extra headers with it. [A]
- The integration writes one property per `set`, except for an ice maker's delay (§10.3). The app can send several at once (`ApplianceProperties.sendBatch`). [I][A]

### 4.2 Response handling

Both the HTTP status and the body matter (`api.py: SubZeroClient._json` with `appliance_command=True`). [I]

| HTTP | Body | Result |
| --- | --- | --- |
| 2xx | empty, `OK`, or `"OK"` | Success, no data |
| 2xx | A JSON object, possibly encoded as a string one or more times | Parsed, then checked (§4.3) |
| 500 | `{"Message":"OK"}` or `{"message":"OK"}` | Success, no data. Whether the cloud really sends this is open (§16) |
| 500 | Anything else, such as `{"Message":"Device offline"}` | Error |
| 401, 403 | n/a | Refresh the token and retry once, then ask to sign in again |
| 429 | n/a | Rate limited (§12) |
| other | n/a | Error |

String layers are decoded until an object remains; a string that isn't valid JSON is tried once more as an escaped string literal (`api.py: _object`). [I] The app instead strips backslashes and replaces `"{` and `}"` with `{` and `}` before one decode. [A]

Shapes seen or accepted:

```json
{"status": 0, "resp": {"appliance_model": "MODEL-X", "ref_set_temp": 37}}
```
```json
{"resp": {"status": 0}}
```
```json
{"status": 0, "pload": {"status": 0}}
```

The first is what `get` returns; the app's demo data for a dedicated ice maker has the same shape. [I][A]

### 4.3 Rejections

The integration (`api.py: _rejected`, `_check_control_response`) [I]:
- An object is rejected when it, or the `pload` one or two levels below it, has a `status` that isn't the integer `0`. `true` and `3` reject; `null` doesn't.
- `set` and `reset_air_filter` are rejected when the top level is rejected, or when `resp` (or the top level) is. The check then follows `pload` down at most twice to an object with a `status`. A non-empty object without one is rejected, such as `{"resp": {"error": "..."}}`, and so is `{"resp": null}`.
- `get` is rejected by the same rule, and its `resp` (or top level) must contain a string `appliance_model` to count as a full state.
- `open_cloud_async` is rejected when the top level or `resp` is.
- `exit_delay` is rejected by the same rule; its `resp` holds properties.

The app (`DirectMethodsExtension.sendDirectMethod`) treats any status outside 200–299 as a failure, and otherwise succeeds when `body.pload.pload.status` is `0` or missing. [A] The integration has seen `resp`-wrapped answers instead, so the real `set` acknowledgement is open (§16).

### 4.4 Commands

| `cmd` | Parameters | Purpose | Integration | Source |
| --- | --- | --- | --- | --- |
| `get` | none | The full state, in `resp` | `state` | [I][A] |
| `set` | `{property: value, ...}` | Write properties | `set_property`, `set_ice_delay` | [I][A] |
| `open_cloud_async` | none | Push this appliance's state and changes to the live connection (§5.7) | `open_channel` | [I][A] |
| `reset_air_filter` | none | Reset a refrigerator's air filter life. The app sends it only to series 22 (`ngix`) and shows other series how to reset at the appliance | series 22 only (`AIR_FILTER_RESET_SERIES`) | [I][A] |
| `exit_delay` | none | End a dedicated ice maker's current delay; the answer carries properties | `exit_ice_delay` | [I][A] |
| `reset_filter` | none | Reset a hood's filter counter. In 4.6.0 only the Bluetooth path sends it (`ConnectedAppliance.sendResetFilterCmd`); a cloud path is unconfirmed | no | [A][?] |
| `get_async`, `set_time`, `display_pin`, `wifi_scan`, `connect_wifi`, `unlock_channel_*`, `open_async_channel_*` | various | Bluetooth only (§15) | no | [A] |

`api.py: SubZeroClient._command` refuses any command but `get`, `open_cloud_async`, `set`, `reset_air_filter`, and `exit_delay`. [I] `start_immediately` appears in 4.6.0 only as a toggle in the ice maker's delay screen and an analytics tag; the delay itself is saved with `set`. It isn't known to be a command [A][?].

## 5. Live updates

Live state comes from Azure SignalR. The account opens one connection, and each appliance's channel on it delivers that appliance's state and events.

### 5.1 negotiateUser

`POST {API_BASE}/signal-r/negotiateUser`, with the headers of §3.1 and `Userid` set to the lowercase user ID, and no body. [I] The app sends `userId` as `sitecoreUserId ?? azureObjectId ?? "unknown"`, before any connection exists. [A]

```json
{"url": "https://<signalr-host>/client/?hub=connectedappliances", "accessToken": "<SignalR JWT>"}
```

The integration requires the address's origin to equal `SIGNALR_ORIGIN` and `accessToken` to be a string. [I]

### 5.2 SignalR negotiate

`POST https://<signalr-host>/client/negotiate?hub=connectedappliances&negotiateVersion=1` [I]

| Header | Value |
| --- | --- |
| `Authorization` | `Bearer <accessToken>` |
| `X-Requested-With` | `FlutterHttpClient` |
| `Content-Type` | `text/plain;charset=UTF-8` |
| `User-Agent`, `Accept-Encoding` | `APP_HEADERS` |

No `Userid` or subscription key is sent. The answer must be JSON with HTTP 200; the integration uses `connectionToken`, or `connectionId` without one. [I] The app uses the `signalr_netcore` package (`HubConnectionBuilder.withUrl`, then `build` and `start`). [A]

### 5.3 WebSocket and handshake

1. Connect to `wss://<signalr-host>/client/?hub=connectedappliances&id=<connectionToken>` with `Authorization: Bearer <accessToken>` and `APP_HEADERS`. Messages can be up to 262144 bytes. [I]
2. Send `{"protocol":"json","version":1}` followed by the record separator `\x1e`. [I]
3. The first text frame must arrive within 20 s and contain `\x1e`, and the record before it must be exactly `{}`. Anything after it is kept as further messages. [I]

### 5.4 Framing

A frame holds one or more JSON records, each ending in `\x1e`, and a record can span frames. The integration buffers them and drops the connection if more than 262144 characters are pending. [I]

| `type` | Meaning | Integration |
| --- | --- | --- |
| 1 | Invocation. Only `target` `ConnectedApplianceMessage` matters | Parsed (§5.5) |
| 6 | Ping | Sent every 15 s as `{"type":6}\x1e` (`PING_INTERVAL`). Received pings count as traffic |
| 7 | Close | Treated as an error; reconnect |
| other | n/a | Ignored |

A record that can't be decoded is counted as invalid and skipped. [I]

The app never invokes a hub method. It registers `on("ConnectedApplianceMessage")` and otherwise calls only `start`, `stop`, and `off`; it logs its connection ID but sends it nowhere. [A]

### 5.5 ConnectedApplianceMessage

Two argument forms have been seen, and both are handled. [I][O]

| Form | `arguments` | Handling |
| --- | --- | --- |
| Current | `["<envelope>"]` | The envelope is `arguments[0]`; the app reads only this form [A] |
| Legacy | `["<user ID>", "<envelope>"]` | `arguments[0]` must equal the account's user ID, in any case, or the message is ignored [I] |

Each layer can be an object or a JSON-encoded string:

```text
record    {"type":1, "target":"ConnectedApplianceMessage", "arguments":["<envelope>"]}
envelope  {"DeviceId":"dev-0001", "Payload":"<payload>"}
payload   {"api.async_channel":"<message>", "timezone_id_name":"Eastern Standard Time"}
message   {"type":2, "pload": <pload>}         // may also have "device_id"
pload     {"props": {...}} | {"resp": {...}} | {...properties at the root...}
```

On the wire, every layer under the record is a string:

```json
{"type":1,"target":"ConnectedApplianceMessage","arguments":["{\"DeviceId\":\"dev-0001\",\"Payload\":\"{\\\"api.async_channel\\\":...}\"}"]}
```

Rules (`api.py: parse_notification`) [I]:
- A missing or empty `DeviceId` is invalid, and one that isn't a selected appliance is ignored.
- A payload without `api.async_channel` is ignored. The app's message model also reads `Payload.timezone_id_name`. [A]
- A `message.device_id` that differs from `DeviceId` is ignored.
- `message.type` is logged but not used; the tests use 1 for a full state and 2 for a change. A full state is recognized by its content (§5.6). [I][?]

### 5.6 Full states and changes

| Wrapper | Meaning | Full state? |
| --- | --- | --- |
| `pload.resp`, when not null | The answer to a command such as `open_cloud_async` or `get` | Yes, when it contains a non-empty string `appliance_model` |
| `pload.props`, when not null | A change | Never, even when the root also has `appliance_model` |
| Neither | Properties at the root of `pload` | Yes, when it contains a non-empty string `appliance_model`. A root without any recognized property (`const.py: STATE_KEYS`) is ignored |

- `resp` wins over `props`. The app's `_extractEventBody` uses the same order: `resp`, then `props`, then the root. [I][A]
- A `resp` or root whose `appliance_model` is `null` is a change. [I]
- A message without state, such as `{"status": 0}`, still shows the channel is delivering; the integration counts it as ignored but records its time (`last_messages`). [I]

How the integration applies them (`coordinator.py: apply_update`) [I]:
- A full state replaces the stored state when the appliance was unavailable or its `appliance_model` changed, and is merged otherwise. It also makes an unavailable appliance available again.
- A change is merged. Changes are dropped while the appliance is unavailable; a status read restores it.
- An `appliance_type` that can't be parsed never replaces a known one, as in the app. [A]
- Properties the app discards for the appliance type are discarded (§7.8).

### 5.7 Appliance channels

- `open_cloud_async` takes no parameters, such as a duration. [I][A] The appliance answers on the live connection with a `resp` full state, then pushes changes. [O]
- After the handshake, the integration opens every selected appliance's channel. A failed open makes that appliance unavailable and is retried after 30 s, doubling to 900 s, plus 0–5 s of jitter. A 429 ends the connection (§12). [I]
- Any state from an appliance also counts as its channel being open. [I]
- An idle appliance sends nothing on its channel, not even a heartbeat (§14). So silence alone can't tell a quiet appliance from a stopped channel. [O]

### 5.8 Routing

Messages reach every live connection on the account. [O]
- The REST call that opens a channel carries no connection identifier (§4.1), negotiation happens before the connection exists, and the app never calls the hub (§5.4). So the cloud can route channel messages only by account. [A]
- The app's 55-minute refresh moves it to a new connection without reopening its channels, which works only if routing isn't tied to the connection that opened a channel. [A]
- On 2026-10-22, with the app's appliance list open while the integration was connected, one door change reached both. So opening the app doesn't take updates away from the integration, and another client's reopen is likely answered on every connection [O][?].

### 5.9 Keepalive and renewal

| Item | Integration | App |
| --- | --- | --- |
| Client ping | `{"type":6}` every 15 s [I] | `signalr_netcore` defaults [A?] |
| Silence timeout | Reconnect after 60 s without any frame [I] | The library's default [?] |
| Renewal | At `min(3000 s, exp(accessToken) − now − 60 s)`, at least 1 s, or 3000 s when `exp` can't be read; or within one ping interval of a request (§13). Renewal starts over from `negotiateUser` and reopens every channel [I] | A new connection 55 minutes after the last (`Future.delayed`, then "Refreshing SignalR connection"), without reopening channels [A] |
| Reconnect after an error | 30 s, doubling to 900 s, plus 0–5 s of jitter, and at least `Retry-After`. The delay starts over after a connection that lasted 120 s or more [I] | 3 connection attempts, then up to 5 automatic reconnects [A] |

The 50-minute cap is the integration's own, below the app's 55. The SignalR token's real lifetime, and any limit on the service side, are unknown [?]; integration diagnostics record each connection's `renews_after_seconds`, which reveals the token's lifetime whenever it's under 3060 s. [I]

### 5.10 How the app uses channels

The app opens channels [A]:
- when an appliance's card loads. If the hub isn't connected yet, a one-time listener opens the channel on the first `Connected` state;
- each time it returns to the foreground (`AppLifecycleState.resumed`). The appliance list, its home screen, closes the connection, creates a new one, and reopens every channel; the appliance dashboard reopens its own;
- on recipe screens, which send `get` and then open the channel.

Other behavior [A]:
- If no properties arrive within 16 s of opening a channel (`TimeoutDuration.propertiesReceiptTimeout`), it sends one `get` ("Sending fallback GetAll command for appliance lacking properties").
- Pull-to-refresh on the appliance list sends `get` to every appliance, then waits 10 s before allowing another.
- In the background (`paused`), it only removes its local message listener (`closeSignalRChannel`); nothing is sent.
- It never polls; its only timers are on-screen countdowns. It never keeps a channel open longer than one visit, so its behavior doesn't show how long a channel lasts.

## 6. Firebase alerts

Sub-Zero sends phone alerts through Firebase Cloud Messaging (FCM), separately from the live connection (`services/notifications/push_notifications_service.dart`). [A]

### 6.1 Registration

- Each phone registers under its own `psid`, the Android ID kept in the app's preferences, so phones don't replace each other's registrations. [A]
- Register for an appliance: `POST /consumerapp/api/notification/registrations` with `{"id": <new UUID>, "fcmToken", "deviceId": <appliance ID>, "psid", "mobile_name"}`. Change it with `PUT`. [A]
- Read it: `GET .../registrations/devices/{psid}/appliances/{deviceId}`. The app decodes a list and takes the entry whose `deviceId` matches (`getNotificationRegistration`); the integration does the same and also accepts a single record (`api.py: alert_registration`). [A][I]
- Registration answers HTTP 200 with the record's ID as a JSON string. [O] The integration treats an HTTP 500 as success when reading the record back shows the token was stored. [I]
- Nothing deletes a registration, so a client should keep reusing its `psid`. [O]

### 6.2 Subscriptions

- Choose alerts: `POST /consumerapp/api/notification/devices/{psid}/events` with the header `uuid: <psid>` and a list of `{"deviceId", "mutable_content": false, "valueType": <code>, "body_loc_key", "sound": null, "clickAction": null}`. `body_loc_key` is an app text key (`NotificationKeyToLocalizable`), such as `fridge_refrigerator_door_open` for 101. The app sends the codes that apply to the appliance (`ConnectedAppliance._getNotificationTypes`). [A] The answer is a list of IDs. [O]
- Read them: `GET .../devices/{psid}/appliances/{deviceId}/events`. Stored entries come back with `valueType` as a string and `title_loc_key` filled in by the server. [A][O]
- Remove them: `DELETE .../devices/{psid}/events/type` with the header `uuid: <psid>` and `{"valueTypes": ["101", ...], "deviceId"}`. The answer is `true`. [A][O]

### 6.3 Message format

Alerts arrive about 1 s after the event. [O] An example from a range's kitchen timer:

```json
{"from": "<sender ID>", "priority": "normal", "fcmMessageId": "<uuid>",
 "notification": {"title": "Sub-Zero, Wolf, and Cove"},
 "data": {"deviceId": "<appliance ID>", "value": "209", "notifSeq": "46", "seq": "2823",
          "event_time": "1791475976000", "timestamp": "10/08/2026 16:12:56",
          "mutable_content": "False", "data": "null"}}
```

- `value` is the event code (§8.3) and `notifSeq` the appliance's sequence number, both as strings. [O]
- `event_time` is in epoch milliseconds, with whole seconds; `timestamp` is the same moment in UTC as `MM/dd/yyyy HH:mm:ss`. [O]
- `seq`'s meaning is unknown [?].
- The message has no alert text; the text keys apply only to the phone's notification. [O]
- The app reads `deviceId`, `bodyLocKey`, `value`, `title`, `clickAction`, `documentId`, and `url` from `data`. [A]

### 6.4 Fault alerts

Fault (400) alerts use a separate store per user: `/api-user-fcm/v2/user-fcms`, keyed by `user/{userId}/psid/{psid}` with `{userId, fcm, psid, createdDate}`, and `/api-user-fcm/v2/subscriptions` with `{userId, psid, valueType, titleLocKey, bodyLocKey, sound, clickAction, createdDate}`. [A] The integration doesn't use it. [I]

### 6.5 A client besides the app

- The APK carries the Firebase project configuration and is signed with its Play Store key. The `firebase-messaging` Python library, which Home Assistant's Ring integration also uses, registers under that project as a Chrome web-push client, without Android certificate headers. [O]
- Tested end to end on 2026-10-08 with five appliances and a random 16-digit hex `psid`: registration, subscriptions, delivery, and removal all worked. [O]

How the integration uses it (`fcm.py: FcmAlerts`) [I]:
- Alerts are off until the user turns them on. The client's credentials and `psid` are saved in the config entry and reused.
- It checks the Firebase client every 60 s, and syncs registrations and subscriptions every hour, or every 5 minutes after a failure.
- It subscribes to the codes for each appliance's kind: 1xx for refrigeration, wine, and ice makers, 2xx for ovens, 3xx for dishwashers, and none for hoods, which have no alerts in the app. Ranges with two ovens get the app's right- and left-oven text keys, and a dual-oven range's alerts arrived with them on 2026-10-22. [I][A][O]
- Codes without a text key in the app's table (105, 217, 305) and the separately stored codes (400, 401) aren't subscribed. [I]
- Turning alerts off, or removing the integration, removes its subscriptions (`fcm.py: async_remove_alert_subscriptions`, `__init__.py: async_remove_entry`).
- Each alert is delivered as an event (§8) and starts a check (§13).

## 7. Appliance state

### 7.1 `appliance_type`

`<module>.<series>.<category>.<version>`, such as `17.2.6.1`. A three-part value is `<series>.<category>.<version>` with module 0. The app's `ApplianceType.fromString` adds the `0` and parses four integers; its per-type metadata files are named `s<series>_c<category>_v<version>`. [I][A]

| Module | App name |
| --- | --- |
| 0 | unknown |
| 1 | puma |
| 17 | saber |
| 33 | wrover |
| 49 | calico |

Module names come from the app's `ModuleVersion`. [A] The integration keys behavior on series, category, and version (`controls.py: appliance_type`, `excluded_properties`). [I]

### 7.2 Series

Codes and names come from the app's `ApplianceSeries`; the names are also the fault-metadata `appliesTo` values (`const.py: FAULT_METADATA_APPLIES_TO_BY_SERIES`). [A][I]

| Series | Name | What the integration does with it |
| --- | --- | --- |
| 0 | unknown | n/a |
| 1 | bi | Legacy accent light values, On and Off only; refrigerator up to 45 °F |
| 2 | ngi | Refrigerator up to 45 °F |
| 3 | eSeries | Oven; starts with the power write alone; its own temperature ranges |
| 4 | mSeries | Oven; starts with the power write alone |
| 5 | wine | Legacy accent light values |
| 6 | cove | Dishwasher |
| 7 | pro | Legacy accent light values |
| 8 | range | Oven; two cavities named right and left |
| 9 | specialty | n/a |
| 11 | bi5 | n/a |
| 12 | bi5Wine | n/a |
| 13 | deu | Refrigerator 34–55 °F for categories 3 and 6 |
| 14 | deuWine | n/a |
| 15 | nge | Oven |
| 16 | hybridM | n/a |
| 17 | ds3 | n/a |
| 18 | ds3Wine | n/a |
| 20 | cove2 | n/a |
| 21 | dice | Dedicated ice maker (`is_ice_maker`) |
| 22 | ngix | Air filter reset; refrigerator up to 45 °F |
| 23 | pvii | Hood (`is_hood`) |

Otherwise an appliance's kind follows from what it reports: setpoint keys mean a refrigerator or wine unit, and `cav_` or `kitchen_timer` keys an oven (`controls.py: is_fridge`, `is_oven`, ...). [I]

### 7.3 Property names

| Pattern | Meaning | Examples |
| --- | --- | --- |
| `cav_`, `cav2_` | Oven cavities 1 and 2: upper and lower, or right and left on a range | `cav_temp`, `cav2_cook_mode` |
| `ref_`, `ref2_`, `frz_`, `crisp_`, `wine_`, `wine2_` | Refrigerator zones, freezer, crisper drawer, wine zones | `ref_set_temp`, `wine2_door_ajar` |
| `kitchen_timer`, `kitchen_timer2` | Oven kitchen timers | `kitchen_timer_duration`, `kitchen_timer2_end_time` |
| `*_on` | A state or switch | `ice_maker_on`, `sabbath_on`, `cav_unit_on` |
| `*_ajar` | A door is open | `ref_door_ajar`, `door_ajar` |
| `*_set_temp` | A setpoint | `frz_set_temp`, `cav_probe_set_temp` |
| `*_display_temp` | The temperature the appliance displays | `ref_display_temp` |
| `*_time` | A time, ISO 8601 | `wash_cycle_end_time`, `next_clean_time` |
| `*_active`, `*_complete`, `*_within_1min`, `*_at_set_temp`, `*_within_10deg` | Status flags | `cav_cook_timer_complete` |

The app's property list (`AppliancePropertiesEnum`, 152 names) lacks several names that its own demo data contains and the integration reads: `time`, `ap_rssi`, `ipv4_addr`, `unit_on`, `cav*_cook_timer_*`, `kitchen_timer*_start_time`, `kitchen_timer*_within_1min`, `cav*_probe_within_10deg`, `water_filter_gal_remaining`, `max_ice_*_time`, `high_use_*_time`, `wine_temp_alert_on`, and `delay_start_timer_start_time` [A]. Its property model seems not to track them [?]. The integration recognizes them (`const.py: STATE_KEYS`). [I]

### 7.4 Types and units

| Property | Type | Unit or meaning | Source |
| --- | --- | --- | --- |
| Temperatures (`*_temp`, `*_set_temp`, `*_display_temp`) | int | °F, whatever the account's display unit | [I]; the app converts its limits to °F [A]; Celsius appliances unconfirmed [?] |
| `*_pct_remaining` | int | percent | [I] |
| `water_filter_gal_remaining` | int | gallons; negative past the filter's capacity | [I] |
| `kitchen_timer*_duration` | int | minutes, 0–719 | [I] |
| `delay_duration`, `delay_start_offset` | int | seconds (ice maker delay) | [I] |
| `next_clean_cycles` | int | ice cycles until the next cleaning | [I] |
| `next_clean_reminder` | int | seconds; 1209600 (14 days) in demo data; unused | [A] |
| `delay_start_timer_duration` | int | hours, 0–12 (dishwasher) | [I] |
| `delay_off_duration` | int | milliseconds, in whole minutes up to 719 (hood) | [I] |
| `filter_count`, `filter_max_count` | int | read as seconds of hood filter use and allowance | [I][?] |
| `door_ajar_timeout` | int | minutes (§9.11) | [I] |
| `ap_rssi` | int | dBm | [I] |
| `uptime` | string | `H:MM:SS`, cut short (§7.6) | [I][A][O] |
| `version` | object | `fw`, `rtapp`, `bleapp`, `api`, `appliance`, `architecture`, `os`; `fw` is the software version | [I][A] |
| `notifs` | list | Event history (§8) | [I][A] |
| `active_faults` | list of strings | Such as `"10 C 00"` in demo data; neither the app nor the integration uses it | [A] |
| `diagnostic_status` | string | Codes per subsystem (§7.7) | [A] |

Values that mean no reading [I]:
- An oven value (`cav*_temp`, `cav*_set_temp`, probe values) of `0`.
- A probe temperature of `0` or `1`. The app's probe tile also treats −18, which is 0 °F shown in °C, as none (`probe_tile_controller.dart`). [A]
- Probe values count only while `cav*_probe_on` is true.

Oven temperatures while off:
- The app shows Off instead of `cav*_temp` unless that cavity's `unit_on` is true, and Clean during self clean (`oven_temperature_tile_controller.dart`). The integration shows the reported value either way. [A][I]
- `cav*_temp` stops updating when the cavity turns off and keeps its last value. The same range read 403 on 2026-10-07 and 402 on 2026-10-09, off both times, so such a reading is stale, not residual heat. This was confirmed through an ESPHome Bluetooth gateway ([kedube/esphome-subzero-ble](https://github.com/kedube/esphome-subzero-ble)). [O]

### 7.5 Times

- A time without an offset is local wall time. The app parses it with `DateTime.parse` and only converts it with `toUtc` or `toLocal`, and it sets the appliance clock from the phone's local time over Bluetooth (`set_time`). [A]
- **Only a pushed `time` carries the appliance's offset.** Pushes reported `"2026-10-05T15:29:24-04:00"` while `get` answers reported `"2026-10-08T02:53:29+00:00"`, and both were correct instants: the push arrived 8 s after its `time`, and the `get` value was 14 s before the download. So the appliance clock was within about 15 s. [O]
- The app never reads `time` except to set the clock over Bluetooth. [A]
- The integration reads a time without an offset in the zone of the appliance's last pushed `time`, or Home Assistant's zone until one arrives. When the pushed offset matches Home Assistant's zone, it uses that zone, which follows daylight saving time. Explicit offsets are kept (`controls.py: clock_zone`, `appliance_datetime`). `time` is left out of change detection (`UNCOMPARED_READ_KEYS`). [I]
- The time zone itself is set through the time settings endpoint (§3.4), and live messages may carry `timezone_id_name`. [A]

### 7.6 `uptime`

`H:MM:SS` cut to eight characters. From 100 hours the last digit is lost, so `"387:52:1"` means 387:52:1x; from 1,000 hours the seconds are lost. [O][I] The app splits it on `:` and never shows it. [A] The integration fills the missing digits with zeros (`sensor.py: uptime_seconds`). [I]

### 7.7 Diagnostic and private properties

- `diagnostic_status` has one character per subsystem: `1` good, `3` error, `0` unknown. The app uses it only during setup and in logs. Demo data shows `"0x"` and then 1s, and the app's default is 13 zeros, so its exact length and prefix are unclear [A][?].
- `smart_grid_on`, `showroom_on`, `service_mode`, and `pin_window_open` appear only in the app's demo data, which nothing reads. [A]
- `ipv4_addr`, `device_wlan_id` (the MAC address), and `appliance_serial` are private; the integration keeps them out of logs and diagnostics (`PRIVATE_KEYS`). [I]

### 7.8 Properties discarded by type

The app drops some properties for specific types ("Received excluded property", `ConnectedAppliance._filterValidProperties`, from per-type metadata). [A] The integration copies these lists (`const.py: EXCLUDED_PROPERTIES`) and also hides the entities that depend on them (`DEPENDENT_ENTITY_KEYS`). [I] The lists come from the integration and weren't re-derived from the app [?].

| Discarded | Types (`series.category.version`) |
| --- | --- |
| `accent_light_level` | 1.1.{0,2,4,12}, 1.2.{0,3,4}, 1.3.{0,4}, 1.4.0, 2.1.{0,1,3}, 2.2.{1,3}, 2.3.0, 2.4.{1,3}, 2.5.0, 2.6.0, 2.7.{1,2}, 2.8.0, 2.9.0, 11.1.3, 13.{1..5}.0 |
| `accent_light_level`, `ice_maker_on` | 2.6.1, 2.8.1, 2.9.1 |
| `kitchen_timer2_active` | 3.1.1, 3.1.2, 3.2.2 |
| `cav2_probe_on`, `kitchen_timer2_active` | 3.2.1 |
| `high_use_on`, `short_vacation_on`, `long_vacation_on` | 5.1.0, 12.1.0, 14.{1,2,3}.0, 18.1.0, 18.3.0 |
| `air_filter_pct_remaining` | 5.4.0 |
| `air_filter_pct_remaining` and the three modes above | 18.4.0 |
| `softener_low` | 6.1.0 |
| `cav2_probe_on` | 15.2.4, 15.2.5 |

### 7.9 Example state

A synthetic refrigerator's full state:

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

## 8. Events

### 8.1 Forms

An appliance reports an event in two ways:
- **Inline**, in a change or full state: `notif_seq` (int), `notif_type` (int), and `timestamp` (string) sit among the properties. [I][A]
- **History**, in full states and `get`: `"notifs": [{"notif_seq": 41, "notif_type": 101, "timestamp": "2026-10-07T22:14:05"}, ...]`. [I][A]

The same events also arrive as Firebase alerts, when subscribed (§6).

What real appliances report [O]:
- Times with milliseconds and an offset, such as `"2026-10-09T14:30:33.872-04:00"`. Firebase's `event_time` has whole seconds, so the two copies of one event never share a time exactly.
- Sequence numbers that count up per appliance: the range's went from 51 to 80 over two weeks, and the refrigerator's door alerts used 0 on 2026-10-08 and 1 on 2026-10-21.
- The dishwasher reported 9–13 in early October and 0–4 after it restarted around 2026-10-17, so the counter likely starts over when an appliance restarts [?].
- A limited history: on 2026-10-22 the range's full state held its 16 latest events (65–80), and the older ones were gone. The limit may be 16 [?].

The app appends each inline event to its `notifs` list (`_processNotification`). [A]

### 8.2 Recognizing new events

The integration (`coordinator.py: async_receive_event`, `_process_events`; `api.py: notification_records`) [I]:
- turns an inline event into `notifs: [event]` and drops records with the wrong types;
- identifies an event by its time, sequence, and code, and remembers up to 256 (`MAX_EVENT_HISTORY`), so a counter that starts over doesn't hide new events;
- ignores events from before it started, and treats its first full state or read as a baseline that fires nothing;
- fires each event once, whichever source reports it first. A Firebase alert and a live or history copy of it match when they share code and sequence and their times are within 5 minutes. Sequence 0 doesn't tell events apart, so a live copy with sequence 0 matches an earlier alert only within 5 s;
- checks the appliance after each new event from Firebase or the live connection, but not after one found in a history (§13).

### 8.3 Codes

Codes are confirmed in both the app (`NotificationType`) and the integration (`const.py: NOTIFICATION_TYPES`). [A][I]

| Code | App name | Integration event type |
| --- | --- | --- |
| 0 | unknown | `unknown` |
| 101 / 102 / 103 | refDoorAjar / frzDoorAjar / wineDoorAjar | `refrigerator_door_ajar` / `freezer_door_ajar` / `wine_door_ajar` |
| 104 | wineSetTempChanged | `wine_setpoint_changed` |
| 105 | refFrzServiceRequired | `refrigerator_service_required` |
| 106 / 107 | refSetTempChanged / frzSetTempChanged | `refrigerator_setpoint_changed` / `freezer_setpoint_changed` |
| 108 / 109 | waterFilterExpired / airFilterExpired | `water_filter_expired` / `air_filter_expired` |
| 112 | wineTempAlert | `wine_temperature_alert` |
| 113 | iceDoorAjar | `ice_maker_door_ajar` |
| 114–119 | iceCleanRequired, iceCleanSoon, iceCleanAddDescale, iceCleanAddSanitizer, iceCleanCancelled, iceCleanComplete | `ice_cleaning_required`, `ice_cleaning_due_soon`, `ice_cleaning_add_descaler`, `ice_cleaning_add_sanitizer`, `ice_cleaning_cancelled`, `ice_cleaning_complete` |
| 201 / 202 | cavAtSetTemp / cav2AtSetTemp | `oven_preheated` / `lower_oven_preheated` |
| 203 / 204 | cavProbeOn / cav2ProbeOn | `oven_probe_connected` / `lower_oven_probe_connected` |
| 205 / 206 | cavProbeAtSetTemp / cav2ProbeAtSetTemp | `oven_probe_target_reached` / `lower_oven_probe_target_reached` |
| 207 / 208 | kitchenTimerComplete / kitchenTimer2Complete | `kitchen_timer_complete` / `kitchen_timer_2_complete` |
| 209 / 210 | kitchenTimerWithin1Min / kitchenTimer2Within1Min | `kitchen_timer_under_one_minute` / `kitchen_timer_2_under_one_minute` |
| 211 / 212 | cavCookTimerComplete / cav2CookTimerComplete | `oven_cooking_timer_complete` / `lower_oven_cooking_timer_complete` |
| 213 / 214 | cavCookTimerWithin1Min / cav2CookTimerWithin1Min | `oven_cooking_timer_under_one_minute` / `lower_oven_cooking_timer_under_one_minute` |
| 215 / 216 | cavProbeWithin10Deg / cav2ProbeWithin10Deg | `oven_probe_within_ten_degrees` / `lower_oven_probe_within_ten_degrees` |
| 217 | ovenServiceRequired | `oven_service_required` |
| 218 / 219 | cavDoorAjar / cav2DoorAjar | `oven_door_ajar` / `lower_oven_door_ajar` |
| 220 / 221 | cavSelfCleanComplete / cav2SelfCleanComplete | `oven_self_clean_complete` / `lower_oven_self_clean_complete` |
| 301 / 302 | washCycleOn / washCycleComplete | `dishwasher_started` / `dishwasher_complete` |
| 303 / 304 | softenerLow / rinseAidLow | `softener_salt_low` / `rinse_aid_low` |
| 305 | dishwasherServiceRequired | `dishwasher_service_required` |
| 306 / 307 | washCyclePaused / washCycleCanceled | `dishwasher_paused` / `dishwasher_cancelled` |
| 400 / 401 | faultNotification / feedbackNotification | `fault_notification` / `feedback_notification` |

## 9. Enumerations

### 9.1 `wash_status` (dishwasher)

| Code | App name | App shows | Integration shows |
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

[A][I] An idle DW2450 reports 1. [O]

### 9.2 `wash_cycle`

| Code | App name | Integration shows |
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

### 9.3 Dishwasher `mode`

`0` off, `1` child lock, `2` Sabbath (the app's `SpecialMode`). `2` counts as Sabbath for the lock in §10.2. [A][I]

### 9.4 Cooking modes (`cav_cook_mode`, `cav2_cook_mode`)

| Code | App name | Shown as | Start at the oven only |
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

Only these 13 modes have wire values; the app's other modes, such as steam and microwave, have none. [A] The start-at-the-oven set is `const.py: MANUAL_COOK_MODES`; a Gourmet program (`cav*_gourmet_mode_on`) must also be started at the oven. [I]

Modes offered by series and cavity (`controls.py: cook_mode_offered`) [I]:
- 5 only on series 3, upper cavity.
- 12 on every series but 3.
- For `cav2`: not 6, 8, or 10 on series 3 or types 15.2.4 and 15.2.5; not 4 on 15.2.4, 15.2.5, or 8.2.0.

While broiling (mode 3), the app shows a broil level from the setpoint: below 400 °F Low, below 500 °F Medium, otherwise High (`broil_level.dart: BroilLevel.fromTemperature`; `const.py: BROIL_LEVELS`). [A][I]

### 9.5 Oven setpoint ranges (°F)

| Series | Modes 1, 2, 4, 6 | 5 Convection bake | 8 Convection | 9 Proof | 10 Dehydrate | 12 Warm |
| --- | --- | --- | --- | --- | --- | --- |
| 3 (eSeries) | 170–550 | 170–550 | 120–550 | 85–110 | 110–160 | not offered |
| 4, 8, 15 | 200–550 | not offered | 200–550 | 85–110 | 110–170 | 140–200 |
| unknown | 85–550 | 85–550 | 85–550 | 85–550 | 85–550 | 85–550 |

- Modes 0, 3, 7, and 11 have no adjustable setpoint, and a mode missing from a known series' row can't have its setpoint written. [I]
- Probe target: 120–210 °F, in 5 °F steps in the app.
- Source: `const.py: OVEN_TEMPERATURE_RANGES`, `controls.py: temperature_range`. [I] The constant's comment says the series 4, 8, and 15 row follows Wolf's manuals, and that the app files series 4 Convection under Convection bake. The app keys its ranges by series alone, for both cavities, and its table matches the 4, 8, 15 row (`screens/overlays/oven_temperature_overlay/models/oven_temperature_ranges.dart`) [A]; the other rows weren't checked against it [?].

### 9.6 Gourmet programs (`cav*_gourmet_recipe`)

`0` none, then 79 named programs in this order: beef (1–24), pork (25–30), poultry (31–40), lamb (41–43), vegetables and potatoes (44–46), fish (47–49), cakes and cookies (50–61), pies, breads, and rolls (62–69), pizza and calzone (70–72), and casseroles, quiche, and lasagna (73–79). The full list is `const.py: GOURMET_RECIPES`. [I] The app has a matching `GourmetRecipe` model [A]; the one-to-one order wasn't rechecked [?]. The app shows the program only while `cav*_gourmet_mode_on` is true. [I]

### 9.7 Ice maker cleaning (`ice_maker_clean_stage`)

| Code | App name | Code | App name |
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

[A][I] The app derives a dedicated ice maker's status in this order: `failsafe_on` means Disabled, `delay_active` Delayed, `winterize_on` Off, and otherwise `ice_maker_on` decides On or Off. [I] It reads `winterize_on` from the device twin (§3.4). [A]

### 9.8 Refrigerator values

| Property | Values | Writable |
| --- | --- | --- |
| `humidity_control` | 0 disabled, 1 normal, 2 enhanced, 3 low | 1, 2 |
| `crisp_temp_mode` | 0 manual, 1 automatic | 0, 1 |
| `night_mode` | 0 disabled, 1 enabled | 0, 1 |

Values from the app [A]; writable values from the integration [I].

### 9.9 Accent light (`accent_light_level`)

| Level | Value | Legacy value (series 1, 5, 7) |
| --- | --- | --- |
| Off | 0 | 0 |
| On | 100 | 100 |
| Low | 110 | 30 |
| Medium | 120 | 50 |
| High | 130 | 70 |

From the app's `accentLightLevelToInt` and `legacyAccentLightLevelToInt`; the legacy values apply to series 1 (bi), 5 (wine), and 7 (pro) (`LEGACY_ACCENT_LIGHT_SERIES`). [A][I] Series 1 offers Off and On; every other series offers Off, Low, Medium, and High, and shows On (100) without offering it. [I]

### 9.10 Hood values

| Property | Values |
| --- | --- |
| `fan_speed` | 0–4: off, low, medium, high, max [A][I] |
| `light_percent` | 5–100 [I] |
| `color_level` | 0–100; the integration maps it to 2700 + 23 × level kelvin [I][?] |
| `halo_max_percent` | 0 or 30; any nonzero value counts as on [I] |
| `auto_sensivity` | −1 off, 0 low, 1 medium, 2 high [I]; the app's names are off, low, medium, high [A] |
| `delay_off_duration` | 0–719 minutes, in milliseconds [I] |

### 9.11 `door_ajar_timeout`

`0` off, or `1`, `2`, `5`, or `10` minutes before an open door raises an alert. [I]

### 9.12 Fault severity (`corporateSeverity`)

`0` undefined, `1` low, `2` medium, `3` high, `4` critical, `5` urgent. [A][I] A missing or non-integer value becomes `1`, and an unknown integer shows as `unknown`. [I]

## 10. Writes

### 10.1 Writable properties

The integration writes one property per `set` and checks it against `WRITABLE_BOOLEAN_KEYS` or `WRITABLE_INTEGER_KEYS` and its type (`api.py: set_property`). [I]

| Appliance | Boolean | Integer (range) |
| --- | --- | --- |
| Refrigerator, wine | `sabbath_on`, `high_use_on`, `short_vacation_on`, `long_vacation_on`, `ice_maker_on`, `max_ice_on`, `night_ice_on`, `air_filter_on`, `internal_dispenser_enabled` | `ref_set_temp`, `ref2_set_temp` (34–42; 34–45 for series 1, 2, 22, and 5.2; 34–55 for 13.3 and 13.6), `frz_set_temp` (−5–5), `crisp_set_temp`, `wine_set_temp`, `wine2_set_temp` (40–65), `crisp_temp_mode`, `humidity_control`, `night_mode`, `accent_light_level`, `door_ajar_timeout` |
| Dedicated ice maker | `ice_maker_on` | `door_ajar_timeout`; the delay (§10.3) |
| Oven | `cav_unit_on`, `cav2_unit_on`, `cav_light_on`, `cav2_light_on` | `cav*_cook_mode`, `cav*_set_temp`, `cav*_probe_set_temp` (120–210), `kitchen_timer_duration`, `kitchen_timer2_duration` (0–719 minutes) |
| Dishwasher | `wash_cycle_on`, `heated_dry_on`, `extended_dry_on`, `high_temp_wash_on`, `sani_rinse_on`, `top_rack_only_on` | `wash_cycle` (1–12), `mode` (0–2), `delay_start_timer_duration` (0–12 hours) |
| Hood | `fan_on`, `light_on`, `delay_enabled`, `key_tone_on`, `user_lock_on` | `fan_speed`, `light_percent`, `color_level`, `halo_max_percent`, `auto_sensivity`, `delay_off_duration` (§9.10) |

Without an `appliance_type`, the refrigerator's upper limit follows the model: 45 °F for an `appliance_model` starting with BI, IT, IC, or ID, otherwise 42 °F. [I]

### 10.2 Interlocks

| Rule | Source |
| --- | --- |
| In Sabbath mode (`sabbath_on`, or dishwasher `mode` 2), the app disables every control, even turning Sabbath off. The integration allows only writes that turn modes off: `false` for a refrigerator's mode keys, or dishwasher `mode` 0. It refuses the rest, as the appliance does | [A][I] (`controls.py: sabbath_allows`, `control_lock`; `coordinator.py: _command`) |
| While either cavity's mode is 11 (self clean), the only write allowed is `cav*_unit_on: false`, for both cavities | [A][I] (`control_lock`) |
| `cav*_light_on` is locked while that cavity is on in Proof (mode 9) | [A][I] |
| `cav*_set_temp` and `cav*_cook_mode` need `cav*_unit_on` or `cav*_remote_ready` | [I] |
| A mode change on a knob oven (`KNOB_OVEN_TYPES`) needs `cav*_mode_change_enabled` | [I], attributed to the app in a code comment |
| A start-at-the-oven mode can't be chosen remotely unless it's already selected, and modes not offered for the series or cavity are refused | [I] |
| `cav*_probe_set_temp` needs `cav*_probe_on` | [I] |
| `frz_set_temp` is refused while `max_ice_on` is true | [I] |
| `crisp_set_temp` needs `crisp_temp_mode` 0, within max(34, refrigerator − 2) to min(refrigerator limit, refrigerator + 2) | [I] |
| A dishwasher's `wash_cycle`, `mode`, and options only while `wash_status` is 0 or 1 | [I] |
| Options by cycle: Rinse and hold (9) has none; `heated_dry_on` not for 8 or 11; `extended_dry_on` not for 4; `high_temp_wash_on` and `sani_rinse_on` not for 4, 8, 11, or 12; `top_rack_only_on` not for 5, 6, 10, or 11 | [A][I] (`cycle_options_overlay_controller.dart: _setOptions`; `DISHWASHER_OPTION_EXCLUDED_CYCLES`) |
| `delay_start_timer_duration` only while `wash_status` is 0, 1, or 7, and not for cycles 4 or 9. The app also skips the delay write for cycle 9 when starting | [A][I] (`delayed_start_tile_controller.dart: setEnabled`) |
| `reset_air_filter` only for series 22 | [A][I] |

### 10.3 Writes in order

Each step is a separate `set`, awaited and confirmed before the next.

**Oven start** (`controls.py: start_properties`, `coordinator.py: async_start`) [A][I]. It needs `cav*_remote_ready`, a closed door, a mode the app can start (not 0, not start-at-the-oven, not Gourmet), and a setpoint above 0 within range. [I]
1. `cav_cook_mode`: the current mode
2. `cav_unit_on: true`
3. `cav_set_temp`: the target

- All three are sent even when the appliance already reports the value. [I]
- Series 3 and 4 get the setpoint, only if one was requested, and then `cav*_unit_on: true`; the code comment says "E series and M series start with a power write alone". [I][?]
- A cavity that's already on gets only the setpoint and `unit_on`, and only where they differ. [I]
- Turning off is `cav_unit_on: false`; choosing the Off mode sends it. [I]

**Dishwasher start.** The app sends the cycle, then the delay (not for cycle 9), then each option, but only those changed in its start dialog, and finally `wash_cycle_on: true`. [A] The integration writes the cycle, delay, and options whenever they're changed, and its Start button sends only `wash_cycle_on: true`, even if already reported. It needs `remote_ready`, a closed door, and `mode` other than 2. [I]

**Dishwasher cancel**: `wash_cycle_on: false`, sent even if already reported.
- The app enables cancel only while `wash_status` is 2, 5, or 7, shows Start or Make remote ready for 0 and 1, and never reads `delay_start_timer_active` (`dishwasher_header_controller.dart: updateActionButtonText`, `actionButtonEnabled`). [A]
- A delayed start set remotely didn't report status 7, so neither the app nor the integration offered cancel. [O]
- The integration offers cancel while `wash_status` is 2, 5, or 7, or while `delay_start_timer_active` is true. During a delay, only `delay_start_timer_active` turning false confirms it. [I]
- Whether `wash_cycle_on: false` ends a remote delayed start is unconfirmed [?].

**Ice modes** (refrigerator, `controls.py: ice_mode_properties`). [I] The order is meant to match the app's; it wasn't rechecked in the decompile [?].

| Target | Writes, in order |
| --- | --- |
| Off | `max_ice_on: false`, `night_ice_on: false`, `ice_maker_on: false`, each where the appliance has it |
| On | `max_ice_on: false` and `night_ice_on: false`, each only if true, then `ice_maker_on: true` |
| Max ice | `night_ice_on: false` if true, then `max_ice_on: true` |
| Night ice | `max_ice_on: false` where supported, then `night_ice_on: true` |

**Refrigerator mode**: `false` for each other reported mode, then `true` for the chosen one; Normal sends only the `false` values. [I]

**Ice maker delay** (`api.py: set_ice_delay`): one `set` with several keys; the app also saves it as one batch. [I][A]

```json
{"cmd": "set", "params": {"delay_start_offset": 1800, "delay_duration": 7200, "delay_recurring": true}}
```

- `delay_duration` is a multiple of 3600 from 0 to 43200 s. `delay_start_offset` is 0–86399 s, left out when 0.
- `{"delay_duration": 0}` cancels the schedule; the `exit_delay` command ends the current delay but keeps the schedule.
- Each change is followed by a `get`.

**Kitchen timers** [I]:
- `kitchen_timer_duration` from 1 to 719 minutes starts or restarts the timer; `0` cancels a running timer or clears a finished one (the app's Tap to Dismiss).
- A start is confirmed once `kitchen_timer_active` is true with a duration of N minutes (end minus start) and an end time within 65 s of the request time plus N minutes. Times without an offset are read in the appliance clock's zone (§7.5), which has been within about 15 s of real time. [O] A cancel is confirmed once `*_active` is false (`controls.py: control_matches`).

**Hood** [I]:
- Fan on: `fan_speed` (`ceil(percent / 25)`), then `fan_on: true`.
- Light on: `light_percent`, then `color_level`, then `light_on: true`.
- Halo on or off: `halo_max_percent` 30 or 0.

### 10.4 Confirmation

The integration doesn't take an acknowledgement as proof; it confirms every write from the appliance's state (`coordinator.py: _async_set_property`). [I]
- Writes to one appliance run one at a time. If a cancelled write left its outcome unknown, the next write reads the state first.
- Each property gets up to 3 attempts. An attempt allows 8 s (`CONTROL_CONFIRM_TIMEOUT`) for the request and an update showing the value (`CONTROL_PUSH_TIMEOUT`, 5 s). Without that update, a `get` follows, which the deadline doesn't cut short.
- A 429 or a sign-in error stops at once. Each retry checks the interlocks again.
- Resending a value the appliance already reports succeeds only when the cloud acknowledges it.
- The ice maker delay and `reset_air_filter` are followed by a `get`.

## 11. Faults

**List**: `GET /fault-notifications/v1/notifications/device/{deviceId}`, every 30 minutes; 404 means none. [I] The app also treats 404 as none. [A]

```json
[
  {"id": "f-0001", "fault": "ICE01", "corporateSeverity": 3, "active": "true",
   "description": "Ice maker", "createdTime": "2026-03-01T12:00:00+00:00", "deviceId": "dev-0001"}
]
```

| Field | Type | Integration |
| --- | --- | --- |
| `id` | string | Not used [I]; the app uses it to update a fault [A] |
| `fault` | string | The fault code; anything else becomes null |
| `corporateSeverity` | int | §9.12; 1 when missing |
| `active` | `"true"`, `"false"`, or a boolean | Only `"true"` and `true` count |
| `description` | string | Optional |
| `createdTime` | ISO 8601 | Required; a record without a readable one is dropped |
| `deviceId` | string | Not used |

Active faults come from this endpoint, not from the `active_faults` property, which the app ignores too. [I][A]

**Details**: `GET /faults-meta-data/v1/Search?code={fault}&appliesTo={series name}`, where `appliesTo` is a series name from §7.2, such as `nge` or `dice`. [I][A] It answers with a list of `{title, resolutionSteps, cause, serviceNotes, articleLink, appliesTo}`. [A] The integration uses the last item's `title` and `resolutionSteps` (a string, or a list joined with line breaks), fetches details only for active faults, caches them by code and series, and ignores errors. [I]

## 12. Errors and rate limits

| Condition | Integration | Source |
| --- | --- | --- |
| HTTP 429 | Reads `Retry-After` as seconds or an HTTP date (at least 1 s; 600 s if missing or unreadable). Until then, every request from that account fails at once with `RateLimited` | [I] (`retry_delay`, `_json`) |
| 429 during a check's read | The read is skipped and the appliance keeps its state; updates continue | [I] |
| 429 during setup | Setup is retried later (`ConfigEntryNotReady`) | [I] |
| 429 while opening channels | The connection ends; the reconnect waits at least `Retry-After` | [I] |
| 401 or 403 from APIM | Refresh the token and retry once, then ask to sign in again | [I] |
| 400, 401, or 403 from `TOKEN_URL` | Ask to sign in again | [I] |
| 404 for the fault list | No faults | [I][A] |
| Fault details fail | Ignored | [I] |
| Direct method HTTP 500 | Success only for `{"Message":"OK"}`; otherwise an error (§4.2) | [I] |
| Network error or timeout | An error; reads to recover retry after 30 s, doubling to 900 s | [I] |

Sub-Zero publishes no quota. §13.4 covers what the integration's checks cost.

## 13. Keeping state current

This section describes the integration's own design, built on the facts above.

### 13.1 Why checks are needed

The live connection sometimes stops delivering for every appliance at once while it stays open, and an idle appliance sends nothing that would reveal it (§5.7, §14). During such a spell, a change such as a door closing never arrives, so Home Assistant could show a door open long after it closed. The app avoids this by reopening every channel each time it opens. The integration checks at the moments a missed change matters most.

### 13.2 A check

(`coordinator.py: _async_check_and_read`, `_async_check_channel`) [I]
1. Send `open_cloud_async` and wait up to 16 s (`SNAPSHOT_TIMEOUT`) for the full state, which serves as the check's read. Before merging it, compare it with the stored state to count changes that updates hadn't reported (`unpushed_changes`, and `missed_updates` for doors).
2. If no full state arrives (`silent_channels`), or the open fails, read with `get`, as the app does after 16 s.
3. If the open got no answer but `get` succeeded without a rate limit, renew the connection (§5.9), which reopens every channel (`connection_renewals`). Each appliance does this once per silent spell, until it answers an open again or pushes a change, in case it never answers opens.

A full state that arrives on the same connection after a check stopped waiting is recorded as `late_snapshot_seconds`, which separates slow delivery from stopped delivery. A full state on a renewed connection answers that connection's own opens instead.

### 13.3 When checks run

(`coordinator.py: _schedule_alert_check`, `_check_delay`, `async_check_now`; `SubZeroAccount._start_connection_check`) [I]

| Check | When |
| --- | --- |
| Alert | 2 s after a new event from Firebase or the live connection (`ALERT_CHECK_DELAY`), at most one per appliance per minute (`ALERT_CHECK_INTERVAL`). A check that started after the event covers it. An event found in a history starts none |
| Watch | The **Follow-up checks** option, on by default. For 10 minutes after an event (`ALERT_WATCH`), and for up to 15 minutes while a door property (`*door_ajar`) is true (`DOOR_WATCH`): the follow-up check interval after the last pushed change, 2 minutes by default, 1–10 in the options |
| Connection | Optional. Whenever the whole connection goes its interval without any `ConnectedApplianceMessage`: 3 minutes by default, 1–60 in the options. It checks the available appliance checked least recently, and skips a round while another check runs. It relies on silence hitting every appliance at once (§14) |
| Manual | The `subzero.refresh` action, which joins a check already running |

- There are no periodic checks; versions up to 0.8.7 also checked each appliance 10 minutes after its last pushed change.
- A status read made for another reason, such as confirming a write, shows nothing about the live connection, so it doesn't delay a check.
- Home Assistant's **Enable polling for changes** option, when off, stops the watch and connection checks, and the 30-minute fault refresh. Alert and manual checks still run. Turning off **Follow-up checks** stops only the watch checks.
- Without the connection check, a silent spell with no events lasts until the next renewal, at most 50 minutes later.

### 13.4 Cost

Each check is one `open_cloud_async`, plus a `get` when it goes unanswered; each renewal is one `negotiateUser` plus one `open_cloud_async` per appliance. With nothing happening, the integration makes no checks. An event or an open door adds at most one check per follow-up check interval (2 minutes by default) for 10 or 15 minutes, and none while the appliance keeps pushing changes or with follow-up checks off. The connection check adds at most one per interval, and only while the connection is quiet. [I]

### 13.5 Diagnostics

Per appliance (`diagnostics.py: appliance_diagnostics`) [I]:

| Field | Meaning |
| --- | --- |
| `snapshots`, `updates`, `last_received` | Full states and changes applied, and when the last arrived |
| `last_channel_message` | When the last message of any kind arrived for the appliance |
| `channel_reopens` | Checks of every kind |
| `alert_checks`, `watch_checks`, `connection_checks`, `manual_checks` | Checks by kind |
| `silent_channels`, `recent_silent_channels` | Unanswered opens, and the times of the last 10 |
| `connection_renewals`, `recent_connection_renewals` | Renewals they caused, and the times of the last 10 |
| `check_reads`, `skipped_reads` | Checks that compared state, and reads skipped for a rate limit |
| `missed_updates`, `unpushed_changes` | Door changes, and changes per property, that a check found before an update |
| `recent_checks` | The last 20 checks: `time`, `reason`, `result` (`answered`, `silent`, `failed`), `snapshot_seconds`, `renewed`, `late_snapshot_seconds` |
| `clock_zone` | The zone used for times without an offset |
| `unrecognized_state_keys` | Property names the integration doesn't know, without values |

Per account (`async_get_config_entry_diagnostics`) [I]:
- `notifications`: `received`, `ignored` (which includes messages without state), `invalid`, and `last_received`;
- `connections`: the last 10, each with `started`, `ended`, `end` (`lifetime`, `renewal`, `closed`, or the error), and `renews_after_seconds`;
- the Firebase client's state, last sync, and alert count;
- `push_connected`, `shared_connection_check`, `shared_connection_check_minutes`, and `polling_disabled`.

## 14. Observations

Measurements from real appliances, oldest first. [O]

| Date | What was seen |
| --- | --- |
| 2026-10-05 to 10-08 | Pushes carry `time` with the appliance's offset and `get` answers carry UTC; both were correct to within about 15 s (§7.5). `uptime` is cut to eight characters (§7.6). |
| 2026-10-07 | Thirty minutes after a full state, every idle appliance's last message was still that full state: idle appliances send no heartbeat. |
| 2026-10-07, 10-09 | A range that was off reported 403 and 402 °F: a stale value, not heat (§7.4). |
| 2026-10-08 | A Firebase client outside the app registered, subscribed, received alerts about 1 s after each event, and unsubscribed for five appliances (§6). |
| 2026-10-09 | About 5 hours of 10-minute checks: each appliance had 4–6 unanswered opens while `get` still worked, and every renewal restored updates. The counts were nearly equal across appliances. During one dishwasher cycle, reads found two `wash_cycle_on` changes and one `wash_status` change before updates reported them, among 41 updates. No door change was missed. |
| 2026-10-10 | Overnight, about 10 hours of checks: one silent spell. The range and the wine unit, whose checks were in step, both went unanswered within a second, while the other appliances' checks at other times were answered. A renewal fixed it at once. |
| 2026-10-22 | With the app's appliance list open while the integration was connected, one door change reached both (§5.8). |
| 2026-10-22 | About 5 hours of 10-minute checks on five appliances: 142 checks, 6 unanswered. The dishwasher went silent alone at 22:02:34Z. The beverage center, range, and wine unit, whose checks ran together, all went silent within 6 s at 23:33:14–20Z. The refrigerator went silent at 23:36:13Z, about 2.5 minutes after the renewal that caused, and the dishwasher again at 23:53:31Z. Nothing went silent for about 3 hours before 22:02, or in the 90 minutes between 22:02 and 23:33. All 778 live messages were readable (759 with state, 19 without), every one of the 11 Firebase alerts matched an event in the appliances' histories, and no door change was missed. |

Together:
- Silence comes in episodes that hit every appliance at once.
- It doesn't follow a fixed connection or channel lifetime, and one renewal doesn't always end an episode.
- No silent spell has made the connection time out, so frames such as the service's pings kept arriving.
- The range sometimes reports `version.appliance` as an empty string instead of its component list (`"uim: 2.2; gui: 2.0; ..."`), which shows up as a `version` change.

## 15. Other app features

- **Bluetooth**: GATT services with an open channel, an encrypted channel, and an unlock handshake (`unlock_channel_encrypted1`, `2`). Commands are JSON with a `cmd`: `set` with `params`, `get_async`, `wifi_scan`, `connect_wifi` with an SSID and password, `display_pin`, `set_time` with `{"time": "yyyy-MM-dd'T'HH:mm"}` in the phone's local time, `reset_air_filter`, `reset_filter`, and `open_async_channel_open` or `open_async_channel_encrypted`. [A]
- **Time zone**: set with the time settings endpoint and read from the device twin's `time_settings.timezone_id_name` (§3.4). [A]
- **Device twin**: `GET /devices/v3/devices/{id}/twin/property/{name}`, used for `time_settings` and a dedicated ice maker's `winterize_on`. [A]
- **Account and setup**: adding, removing, and renaming appliances, the pairing PIN, and firmware metadata (§3.4). [A]
- **Demo mode**: canned states per type (`services/demo/properties/t<series>_<category>_<version>.dart`), the only place `smart_grid_on`, `showroom_on`, `service_mode`, and `pin_window_open` appear. Useful for shapes; the values aren't real. [A]
- **Appliance setup screens**: `FallbackDoorStates` and the PIN fallback screens belong to Bluetooth setup, not to live updates. [A]

## 16. Open questions

1. **`set` acknowledgement.** The app reads `pload.pload.status`, while the integration has seen `resp`-wrapped answers. Which does the cloud return, and does `{"Message":"OK"}` with HTTP 500 really happen?
2. **`message.type`.** What do its values mean, and could it replace recognizing full states by content?
3. **Connection lifetime.** What is the SignalR token's lifetime, and does the service ever close connections? The connection diagnostics (§13.5) can answer the first.
4. **Silent spells.** What on Sub-Zero's side stops delivery to every appliance at once, and is delivery lost or only late? `late_snapshot_seconds` and the connection history are meant to show which. Another client isn't the cause (§5.8).
5. **User ID header.** Which ID token claims do the app's `azureObjectId` and `sitecoreUserId` hold, and does the service care which is sent?
6. **API scope.** What is the middle segment of `https://SubZeroB2CPrd.onmicrosoft.com/<...>/read`, and does its access token work as the bearer?
7. **Celsius appliances.** Do they report °F on the wire, as the integration assumes?
8. **`diagnostic_status`.** Its exact length and prefix: 12 or 13 characters, and `0x` or not.
9. **Hood units.** Are `filter_count` and `filter_max_count` in seconds, and is the 2700–5000 K mapping of `color_level` right?
10. **Hood filter reset and `start_immediately`.** Is there a cloud path for `reset_filter`, which 4.6.0 sends only over Bluetooth, and is `start_immediately` ever a command?
11. **`winterize_on`.** Does it ever appear in `get` or updates for a dedicated ice maker, or only in the device twin?
12. **Which properties are pushed.** Temperatures sometimes change only between reads, and dishwasher states once arrived late (§14).
13. **Legacy messages.** When is the two-argument form (`[userId, envelope]`) still sent?
14. **Oven start on series 3 and 4.** Does the app start them with the power write alone, and what are their full setpoint ranges?
15. **Remote delayed start.** What do `wash_status`, `wash_cycle_on`, and `delay_start_timer_active` report while a remote delay counts down, and does `wash_cycle_on: false` cancel it?

## Source map

| Topic | Integration | App 4.6.0 (`asm/szg_digital_product_experience/`) |
| --- | --- | --- |
| Sign-in, multi-factor, CAPTCHA | `auth.py: SubZeroLogin` | `services/authentication/` |
| Tokens, headers, REST | `api.py: token_state`, `SubZeroClient._request`, `_json` | `services/azure_apim/azure_apim_service.dart` |
| Direct methods | `api.py: _command`, `_rejected`, `_check_control_response` | `services/direct_methods/direct_methods_extension.dart`, `devices/azure_appliance_connection_interface.dart`, `devices/azure_appliance_commands.dart` |
| Live connection | `api.py: _watch_connection`, `parse_notification` | `services/signalr/signalr_service.dart`, `services/signalr/models/signalr_message.dart` |
| When the app opens channels | n/a | `screens/appliance_list/appliance_list_controller.dart` (`didChangeAppLifecycleState`), `screens/setup/setup_controller.dart` (`_performApplianceListSetup`), `screens/dashboard/dashboard_controller.dart` |
| State, reads, checks, events | `coordinator.py: SubZeroCoordinator`, `SubZeroAccount` | `devices/connected_appliance.dart` (`processProperties`, `_extractEventBody`, `_processNotification`) |
| Firebase alerts | `fcm.py: FcmAlerts`, `api.py: alert_registration`, `subscribe_alerts` | `services/notifications/push_notifications_service.dart` |
| Types, interlocks, ranges, write order | `controls.py` | `devices/models/appliance_type.dart`, `devices/models/*` |
| Property lists, enums, exclusions | `const.py` | `objs.txt` (`AppliancePropertiesEnum`, `NotificationType`, `WashStatus`, ...) |
| Faults | `api.py: appliance_faults`, `fault_metadata`; `coordinator.py: SubZeroFaultsCoordinator` | `services/appliance_faults/` |
| Device twin, time settings | n/a | `services/device_twin/`, `services/appliance_management/appliance_management_service.dart` |
| Bluetooth | n/a | `devices/ble_appliance_connection_interface.dart` |
| Diagnostics | `diagnostics.py` | n/a |
