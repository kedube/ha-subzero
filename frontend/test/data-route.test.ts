// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_PREFIX, followLink, navigate, parseRoute, routePath } from "../src/data/route";

describe("parseRoute", () => {
  it.each(["", "/", "//", "?tab=1", "/#top", undefined, null])("reads %j as the overview", (path) => {
    expect(parseRoute(path)).toEqual({ view: "overview" });
  });

  it("reads /<device_id> as that appliance's full view", () => {
    expect(parseRoute("/3f2a9c")).toEqual({ view: "appliance", deviceId: "3f2a9c" });
  });

  it("decodes the device id", () => {
    expect(parseRoute("/a%20b%2Fc")).toEqual({ view: "appliance", deviceId: "a b/c" });
  });

  it("ignores what follows the device id", () => {
    expect(parseRoute("/3f2a9c/extra?x=1#y")).toEqual({ view: "appliance", deviceId: "3f2a9c" });
  });

  it("keeps a malformed escape as typed, so it shows as not found", () => {
    expect(parseRoute("/abc%zz")).toEqual({ view: "appliance", deviceId: "abc%zz" });
  });
});

describe("routePath", () => {
  it("builds the overview and appliance paths under the panel's prefix", () => {
    expect(routePath("/sub-zero", { view: "overview" })).toBe("/sub-zero");
    expect(routePath("/sub-zero/", { view: "appliance", deviceId: "a b" })).toBe("/sub-zero/a%20b");
  });

  it("falls back to the panel's own path without a prefix", () => {
    expect(routePath(undefined, { view: "overview" })).toBe(DEFAULT_PREFIX);
  });

  it("round-trips through parseRoute", () => {
    const route = { view: "appliance", deviceId: "dev/1 é" } as const;
    const path = routePath("/sub-zero", route);
    expect(parseRoute(path.slice("/sub-zero".length))).toEqual(route);
  });
});

describe("navigate", () => {
  afterEach(() => {
    history.replaceState(null, "", "/");
  });

  it("pushes a history entry and tells Home Assistant's router", () => {
    const heard = vi.fn();
    window.addEventListener("location-changed", heard);
    const before = history.length;
    navigate("/sub-zero/dev-1");
    window.removeEventListener("location-changed", heard);
    expect(location.pathname).toBe("/sub-zero/dev-1");
    expect(history.length).toBe(before + 1);
    expect(heard).toHaveBeenCalledOnce();
    expect((heard.mock.calls[0][0] as CustomEvent).detail).toEqual({ replace: false });
  });

  it("replaces the entry when asked", () => {
    const before = history.length;
    navigate("/sub-zero", { replace: true });
    expect(location.pathname).toBe("/sub-zero");
    expect(history.length).toBe(before);
  });
});

describe("followLink", () => {
  function click(init: MouseEventInit = {}) {
    const anchor = document.createElement("a");
    anchor.href = "/config/integrations/integration/subzero";
    anchor.addEventListener("click", followLink);
    document.body.append(anchor);
    const event = new MouseEvent("click", { bubbles: true, cancelable: true, button: 0, ...init });
    anchor.dispatchEvent(event);
    anchor.remove();
    return event;
  }

  afterEach(() => {
    history.replaceState(null, "", "/");
  });

  it("navigates inside Home Assistant on a plain click", () => {
    const event = click();
    expect(event.defaultPrevented).toBe(true);
    expect(location.pathname).toBe("/config/integrations/integration/subzero");
  });

  it("leaves a modified click to the browser", () => {
    const heard = vi.fn();
    window.addEventListener("location-changed", heard);
    const event = click({ ctrlKey: true });
    window.removeEventListener("location-changed", heard);
    expect(event.defaultPrevented).toBe(false);
    expect(heard).not.toHaveBeenCalled();
  });
});
