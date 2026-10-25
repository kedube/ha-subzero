import { describe, expect, it } from "vitest";
import { familyModel } from "../src/families/index";
import type { Control, Section } from "../src/families/types";
import { hood, iceMaker } from "./fixtures/appliances";
import { context, inMinutes, offline, withLocks, withStates, type Fixture } from "./fixtures/hass";

function sections(fixture: Fixture, options: Parameters<typeof context>[1] = {}): Section[] {
  return familyModel(fixture.appliance).sections(context(fixture, options));
}

function control(list: Section[], id: string): Control | undefined {
  return list.flatMap((part) => part.controls).find((candidate) => candidate.id === id);
}

describe("hood", () => {
  const model = familyModel(hood().appliance);

  it("draws the fan speed and the light's level and white", () => {
    expect(model.drawingState(context(hood()))).toEqual({
      available: true,
      doors: {},
      readouts: {},
      hood: { fan: 2, light: true, brightness: 80, kelvin: 3850, halo: false },
    });
    const dark = withStates(hood(), { fan_on: { fan: ["off", { percentage: 0 }] }, light_on: { light: ["off", { brightness: null, color_temp_kelvin: null }] } });
    expect(model.drawingState(context(dark)).hood).toEqual({ fan: 0, light: false, brightness: 0, kelvin: 3850, halo: false });
  });

  it("puts the fan first in the pill, then the light", () => {
    expect(model.status(context(hood()))).toEqual({ text: "Fan 2", tone: "accent" });
    const lightOnly = withStates(hood(), { fan_on: { fan: ["off", { percentage: 0 }] } });
    expect(model.status(context(lightOnly))).toEqual({ text: "Light on", tone: "neutral" });
    const off = withStates(lightOnly, { light_on: { light: "off" } });
    expect(model.status(context(off))).toEqual({ text: "Off", tone: "neutral" });
    expect(model.status(context(withStates(off, { delay_enabled: { switch: "on" } })))).toEqual({ text: "Delayed shutoff", tone: "neutral" });
  });

  it("lists the fan, light and filter", () => {
    expect(model.infoRows(context(hood()))).toEqual([
      { label: "Fan", value: "Speed 2" },
      { label: "Light", value: "80% · 3850 K" },
      { label: "Filter", value: "40% used" },
    ]);
    expect(model.display(context(hood()))).toBeNull();
    // A used-up filter says so in words on the uncolored card.
    const spent = withStates(hood(), { filter_count: { sensor: "1100000" } });
    expect(model.infoRows(context(spent))[2]).toEqual({ label: "Filter", value: "100% used · Replace" });
  });

  it("controls the fan in four speeds and the light's brightness and white", () => {
    const list = sections(hood());
    expect(list.map((part) => part.id)).toEqual(["fan_light", "delayed_shutoff", "settings", "filters", "details"]);
    expect(control(list, "fan_on")).toEqual({
      kind: "fan",
      id: "fan_on",
      label: "Fan",
      hint: null,
      disabled: false,
      reason: null,
      action: { type: "fan", entity_id: "fan.hood_fan_on", speeds: 4 },
      value: 2,
      speeds: 4,
    });
    expect(control(list, "light_on")).toEqual({
      kind: "light",
      id: "light_on",
      label: "Task light",
      hint: null,
      disabled: false,
      reason: null,
      action: { type: "light", entity_id: "light.hood_light_on" },
      on: true,
      brightness: 80,
      kelvin: 3850,
      min_kelvin: 2700,
      max_kelvin: 5000,
    });
    expect(control(list, "halo_max_percent")).toMatchObject({ kind: "toggle", value: false, label: "Halo light" });
    expect(control(list, "delay_off_duration")).toMatchObject({ kind: "duration", value: 5, presets: [1, 3, 5, 10, 15] });
    expect(control(list, "auto_sensivity")).toMatchObject({ kind: "select", value: "Medium" });
    expect(control(list, "filter_count")).toMatchObject({ value: "120 h", hint: "40% used" });
    expect(control(list, "filter_max_count")).toMatchObject({ value: "300 h" });
  });

  it("disables what's unavailable", () => {
    const gone = offline(hood());
    expect(control(sections(gone), "fan_on")).toMatchObject({ disabled: true, reason: "The appliance is offline.", value: 0 });
    expect(model.status(context(gone))).toEqual({ text: "Offline", tone: "gray" });
  });
});

describe("dedicated ice maker", () => {
  const model = familyModel(iceMaker().appliance);

  it("makes ice, pauses, cleans and stops", () => {
    expect(model.drawingState(context(iceMaker()))).toEqual({
      available: true,
      doors: { ice_door_ajar: false },
      readouts: {},
      sabbath: false,
      ice_maker: { making: true, paused: false, cleaning: false },
    });
    expect(model.status(context(iceMaker()))).toEqual({ text: "Making ice", tone: "accent" });

    const paused = withStates(iceMaker(), {
      delay_active: { binary_sensor: "on" },
      delay_end_time: { sensor: inMinutes(300) },
      ice_maker_status: { sensor: "Delayed" },
      end_ice_delay: { button: "unknown" },
    });
    expect(model.drawingState(context(paused)).ice_maker).toEqual({ making: false, paused: true, cleaning: false });
    expect(model.status(context(paused))).toEqual({ text: "Paused", tone: "neutral" });

    const cleaning = withStates(iceMaker(), { ice_maker_clean_on: { binary_sensor: "on" }, ice_maker_clean_stage: { sensor: "Descale fill" } });
    expect(model.drawingState(context(cleaning)).ice_maker).toEqual({ making: false, paused: false, cleaning: true });
    expect(model.status(context(cleaning))).toEqual({ text: "Cleaning", tone: "accent" });
    expect(model.infoRows(context(cleaning))[1]).toEqual({ label: "Cleaning", value: "Descale fill" });

    const off = withStates(iceMaker(), { ice_maker_on: { binary_sensor: "off" }, ice_maker_mode: { select: "Off" } });
    expect(model.status(context(off))).toEqual({ text: "Off", tone: "neutral" });
    const open = withStates(iceMaker(), { ice_door_ajar: { binary_sensor: "on" } });
    expect(model.status(context(open))).toEqual({ text: "Door open", tone: "amber" });
    expect(model.drawingState(context(open)).doors).toEqual({ ice_door_ajar: true });
  });

  it("lists the status, the delay and the next cleaning", () => {
    expect(model.infoRows(context(iceMaker()))).toEqual([
      { label: "Status", value: "On" },
      { label: "Next cleaning", value: "Nov 20, 09:00" },
    ]);
    const paused = withStates(iceMaker(), { delay_active: { binary_sensor: "on" }, delay_end_time: { sensor: inMinutes(300) } });
    expect(model.infoRows(context(paused))[1]).toEqual({ label: "Ice delay", value: "Until 19:00" });
    const daily = withStates(iceMaker(), {
      delay_duration: { sensor: "28800" },
      delay_start_time: { sensor: "2026-10-25T02:00:00+00:00" },
      delay_recurring: { binary_sensor: "on" },
      cancel_ice_delay: { button: "unknown" },
    });
    expect(model.infoRows(context(daily))[1]).toEqual({ label: "Ice delay", value: "Daily from 22:00 for 8 h" });
    expect(control(sections(daily), "delay_schedule")).toMatchObject({ value: "Daily from 22:00 for 8 h" });
    expect(control(sections(daily), "cancel_ice_delay")).toMatchObject({ kind: "action", confirm: null, button: "Cancel" });
  });

  it("offers ice on or off, the delay form and its buttons", () => {
    const list = sections(iceMaker());
    expect(list.map((part) => part.id)).toEqual(["ice", "ice_delay", "cleaning", "filters", "settings", "details"]);
    const ice = control(list, "ice_maker_mode");
    expect(ice?.kind === "select" && ice.options).toEqual([
      { value: "Off", label: "Off" },
      { value: "On", label: "On" },
    ]);
    expect(control(list, "schedule_ice_delay")).toEqual({
      kind: "ice_delay",
      id: "schedule_ice_delay",
      label: "New ice delay",
      device_id: "device_ice",
      disabled: false,
      reason: null,
    });
    // End and Cancel appear only while there's a delay or a schedule.
    expect(control(list, "end_ice_delay")).toBeUndefined();
    expect(control(list, "cancel_ice_delay")).toBeUndefined();
    const paused = withStates(iceMaker(), {
      delay_active: { binary_sensor: "on" },
      delay_end_time: { sensor: inMinutes(300) },
      end_ice_delay: { button: "unknown" },
    });
    expect(control(sections(paused), "end_ice_delay")).toMatchObject({ kind: "action", button: "End", confirm: null });
    expect(control(sections(paused), "delay_end_time")).toMatchObject({ kind: "countdown", label: "Delay ends in" });
  });

  it("reads cleaning and the filter", () => {
    const list = sections(withStates(iceMaker(), { clean_soon_on: { binary_sensor: "on" } }));
    expect(control(list, "ice_maker_clean_stage")).toMatchObject({ value: "Not cleaning" });
    expect(control(list, "clean_due")).toMatchObject({ value: "Soon", tone: "warning" });
    expect(control(list, "next_clean_cycles")).toMatchObject({ value: "1200" });
    expect(control(list, "water_filter_inserted")).toMatchObject({ value: "Inserted" });
    expect(control(sections(iceMaker(), { language: "de" }), "ice_maker_clean_stage")).toMatchObject({ value: "Keine Reinigung" });
  });

  it("locks the form in Sabbath and the select by its lock", () => {
    const sabbath = withLocks(withStates(iceMaker(), { sabbath_on: { binary_sensor: "on" } }), { ice_maker_mode: "sabbath" });
    const list = sections(sabbath);
    expect(control(list, "schedule_ice_delay")).toMatchObject({ disabled: true, reason: "Sabbath mode is on. Turn it off to change this." });
    expect(control(list, "ice_maker_mode")).toMatchObject({ disabled: true });
    expect(model.status(context(sabbath))).toEqual({ text: "Sabbath", tone: "gray" });
  });
});
