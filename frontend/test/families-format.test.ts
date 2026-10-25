import { describe, expect, it, vi } from "vitest";
import {
  formatClock,
  formatCountdown,
  formatDateTime,
  formatDuration,
  formatNumber,
  formatTemperature,
  wifiQuality,
  withUnit,
} from "../src/families/common";
import { eventName, eventsFrom, ovenNames } from "../src/families/events";
import type { HomeAssistant } from "../src/hass";
import { makeTranslate } from "../src/i18n";
import { range, wallOven } from "./fixtures/appliances";
import { NOW, context, makeHass } from "./fixtures/hass";

const t = makeTranslate("en");

describe("countdowns", () => {
  it("counts like a timer, rounding up so 0:00 means done", () => {
    expect(formatCountdown(0)).toBe("0:00");
    expect(formatCountdown(-5000)).toBe("0:00");
    expect(formatCountdown(1)).toBe("0:01");
    expect(formatCountdown(59_000)).toBe("0:59");
    expect(formatCountdown(59_001)).toBe("1:00");
    expect(formatCountdown(252_000)).toBe("4:12");
    expect(formatCountdown(3_600_000)).toBe("1:00:00");
    expect(formatCountdown(3_661_000)).toBe("1:01:01");
    expect(formatCountdown(2_973_000, true)).toBe("0:49:33");
    expect(formatCountdown(0, true)).toBe("0:00:00");
  });

  it("says a length of time in words", () => {
    expect(formatDuration(t, 45 * 60)).toBe("45 min");
    expect(formatDuration(t, 2 * 3600)).toBe("2 h");
    expect(formatDuration(t, 2 * 3600 + 5 * 60)).toBe("2 h 5 min");
    expect(formatDuration(t, 76 * 3600)).toBe("3 d 4 h");
    expect(formatDuration(t, 72 * 3600)).toBe("3 d");
    expect(formatDuration(makeTranslate("de"), 2 * 3600 + 5 * 60)).toBe("2 Std. 5 Min.");
  });
});

describe("readouts", () => {
  it("shows whole degrees", () => {
    expect(formatTemperature(null)).toBe("—");
    expect(formatTemperature(37.6)).toBe("38°");
    expect(formatTemperature(-0.4)).toBe("0°");
    expect(formatTemperature(-18)).toBe("-18°");
  });

  it("rates Wi-Fi", () => {
    expect([-40, -55, -65, -80].map(wifiQuality)).toEqual(["excellent", "good", "fair", "weak"]);
  });

  it("writes decimals in the user's number format, as Home Assistant does", () => {
    const hass = (language: string, number_format?: string) => ({ language, locale: { language, number_format } });
    expect(formatNumber(hass("en"), 454.25, 1)).toBe("454.3");
    expect(formatNumber(hass("de"), 454.25, 1)).toBe("454,3");
    expect(formatNumber(hass("en", "decimal_comma"), 3.5, 1, 1)).toBe("3,5");
    expect(formatNumber(hass("de", "comma_decimal"), 1234.5, 1)).toBe("1,234.5");
    expect(formatNumber(hass("en", "space_comma"), 1234.5, 1).replace(/\s/g, " ")).toBe("1 234,5");
    expect(formatNumber(hass("de", "none"), 1234.5, 1)).toBe("1234.5");
    expect(formatNumber(hass("fr"), 454, 1)).toBe("454");
  });

  it("shows a sensor with its unit, as the frontend formats it when it can", () => {
    const filter = { entity_id: "sensor.capacity", state: "454.249", attributes: { unit_of_measurement: "L" }, last_changed: "", last_updated: "" };
    const german = makeHass({}, { language: "de" });
    expect(withUnit(german, filter)).toBe("454,2 L");
    const formatting: HomeAssistant = { ...german, formatEntityState: () => "454,25 L" };
    expect(withUnit(formatting, filter)).toBe("454,25 L");
    expect(withUnit(german, { ...filter, state: "unavailable" })).toBe("—");
  });

  it("uses the browser's own 12 or 24 hours for the system time format", () => {
    const hass = makeHass({});
    const at = (hour12: boolean | undefined, format: string) => {
      const resolved = vi.spyOn(Intl.DateTimeFormat.prototype, "resolvedOptions").mockReturnValue({ hour12 } as Intl.ResolvedDateTimeFormatOptions);
      const text = formatClock({ ...hass, locale: { ...hass.locale, time_format: format } }, NOW);
      resolved.mockRestore();
      return text;
    };
    expect(at(true, "system")).toBe("2:00 PM");
    expect(at(false, "system")).toBe("14:00");
    // "language" follows the language, English here: 12 hours whatever the browser does.
    expect(at(false, "language")).toBe("2:00 PM");
  });

  it("shows today's times alone and other days with the date", () => {
    const hass = makeHass({});
    expect(formatDateTime(hass, NOW - 3600_000, NOW)).toBe("13:00");
    expect(formatDateTime(hass, NOW - 3 * 86_400_000, NOW)).toBe("Oct 21, 14:00");
  });
});

describe("events", () => {
  const since = NOW - 7 * 86_400_000;

  it("reads history rows, newest first, at the appliance's own time", () => {
    const rows = [
      { s: "unknown", a: {}, lu: since / 1000 - 10 },
      { s: "2026-10-22T10:00:01.000+00:00", a: { event_type: "dishwasher_started", appliance_timestamp: "2026-10-22T10:00:00+00:00" }, lu: 1 },
      { s: "2026-10-23T08:30:00.000+00:00", a: { event_type: "dishwasher_complete" }, lu: 2 },
      // A copy of the same event, and one from before the window.
      { s: "2026-10-23T08:30:00.000+00:00", a: { event_type: "dishwasher_complete" }, lu: 3 },
      { s: "2026-10-10T08:30:00.000+00:00", a: { event_type: "dishwasher_complete" }, lu: 4 },
    ];
    expect(eventsFrom(rows, since)).toEqual([
      { type: "dishwasher_complete", time: Date.parse("2026-10-23T08:30:00Z") },
      { type: "dishwasher_started", time: Date.parse("2026-10-22T10:00:00Z") },
    ]);
    expect(eventsFrom(undefined, since)).toEqual([]);
  });

  it("names events in the user's language", () => {
    expect(eventName(t, "oven_preheated")).toBe("Oven preheat complete");
    expect(eventName(makeTranslate("de"), "kitchen_timer_complete")).toBe("Küchentimer abgelaufen");
    expect(eventName(t, "something_new")).toBe("something_new");
  });

  it("names a range's ovens Right and Left, as the rest of the panel does", () => {
    // The integration's "Oven" is the first cavity (cav), its "Lower oven" the second (cav2).
    const ovens = ovenNames(context(range()));
    expect(ovens).toEqual({ cav: "Right oven", cav2: "Left oven" });
    expect(eventName(t, "oven_preheated", ovens)).toBe("Right oven · Preheat complete");
    expect(eventName(t, "lower_oven_door_ajar", ovens)).toBe("Left oven · Door open");
    expect(eventName(makeTranslate("de"), "lower_oven_probe_connected", { cav2: "Linker Backofen" })).toBe(
      "Linker Backofen · Kerntemperaturfühler in Verwendung",
    );
    // A double wall oven's are Upper and Lower.
    const double = wallOven();
    expect(ovenNames(context(double))).toEqual({ cav: "Upper oven", cav2: "Lower oven" });
    // Not an oven's own event, or an appliance with one oven: the integration's name.
    expect(eventName(t, "oven_service_required", ovens)).toBe("Oven service required");
    const spec = double.appliance.spec;
    if (spec.family !== "wall_oven") throw new Error("not a wall oven");
    const single = {
      ...double,
      appliance: { ...double.appliance, spec: { ...spec, form: "single" as const, ovens: [{ prefix: "cav" as const, position: "single" as const, width: 30 }] } },
    };
    expect(ovenNames(context(single))).toEqual({});
    expect(eventName(t, "oven_door_ajar", {})).toBe("Oven door open");
  });
});
