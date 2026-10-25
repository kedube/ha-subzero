import { describe, expect, it } from "vitest";
import { familyModel } from "../src/families/index";
import type { Control, Section } from "../src/families/types";
import { beverage, fridge, wine } from "./fixtures/appliances";
import { context, inMinutes, offline, withLocks, withStates, type Fixture } from "./fixtures/hass";

function sections(fixture: Fixture, options: Parameters<typeof context>[1] = {}): Section[] {
  return familyModel(fixture.appliance).sections(context(fixture, options));
}

function control(list: Section[], id: string): Control {
  for (const section of list) {
    const found = section.controls.find((candidate) => candidate.id === id);
    if (found) return found;
  }
  throw new Error(`no control ${id} in ${list.map((section) => section.id).join(", ")}`);
}

function find(list: Section[], id: string): Control | undefined {
  return list.flatMap((section) => section.controls).find((candidate) => candidate.id === id);
}

describe("refrigerator (CL4850SID)", () => {
  const model = familyModel(fridge().appliance);

  it("draws each zone's setpoint, the doors and the ice maker", () => {
    expect(model.drawingState(context(fridge()))).toEqual({
      available: true,
      doors: { ref_door_ajar: false, frz_door_ajar: false },
      readouts: { ref: "38°", frz: "0°", crisp: "36°" },
      sabbath: false,
      ice: { on: true, mode: "on" },
    });
  });

  it("opens a door in the drawing and the pill", () => {
    const open = withStates(fridge(), { frz_door_ajar: { binary_sensor: "on" } });
    expect(model.drawingState(context(open)).doors.frz_door_ajar).toBe(true);
    expect(model.status(context(open))).toEqual({ text: "Door open", tone: "amber" });
  });

  it("shows the ice mode from the binary sensors while the select is locked", () => {
    const locked = withStates(fridge(), {
      ice_maker_mode: { select: "unavailable" },
      max_ice_on: { binary_sensor: "on" },
    });
    expect(model.drawingState(context(locked)).ice).toEqual({ on: true, mode: "max" });
  });

  it("puts the pill in the plan's order", () => {
    const ctx = (fixture: Fixture) => model.status(context(fixture));
    expect(ctx(fridge())).toEqual({ text: "Normal", tone: "neutral" });
    expect(ctx(offline(fridge()))).toEqual({ text: "Offline", tone: "gray" });
    expect(ctx(withStates(fridge(), { service_required: { binary_sensor: "on" } }))).toEqual({ text: "Service", tone: "red" });
    expect(ctx(withStates(fridge(), { active_faults: { sensor: ["1", { faults: [{ code: "E5", severity: "high" }] }] } }))).toEqual({
      text: "Service",
      tone: "red",
    });
    expect(ctx(withStates(fridge(), { sabbath_on: { binary_sensor: "on" } }))).toEqual({ text: "Sabbath", tone: "gray" });
    expect(ctx(withStates(fridge(), { high_use_on: { binary_sensor: "on" } }))).toEqual({ text: "High use", tone: "accent" });
    expect(ctx(withStates(fridge(), { long_vacation_on: { binary_sensor: "on" } }))).toEqual({ text: "Vacation", tone: "neutral" });
    // A door outranks service, and service outranks Sabbath.
    expect(
      ctx(withStates(fridge(), { ref_door_ajar: { binary_sensor: "on" }, service_required: { binary_sensor: "on" } })),
    ).toEqual({ text: "Door open", tone: "amber" });
    expect(
      ctx(withStates(fridge(), { sabbath_on: { binary_sensor: "on" }, service_required: { binary_sensor: "on" } })),
    ).toEqual({ text: "Service", tone: "red" });
  });

  it("lists the setpoints, ice maker and weakest filter", () => {
    expect(model.infoRows(context(fridge()))).toEqual([
      { label: "Set to", value: "Refrigerator 38° · Freezer 0°" },
      { label: "Ice maker", value: "On" },
      { label: "Air filter", value: "56%" },
    ]);
  });

  it("has no display", () => {
    expect(model.display(context(fridge()))).toBeNull();
  });

  it("shows the user's unit as it comes, and translates", () => {
    const celsius = withStates(fridge(), {
      ref_set_temp: { sensor: "3", number: "3" },
      frz_set_temp: { sensor: "-18", number: "-18" },
    });
    expect(model.drawingState(context(celsius, { unit: "°C" })).readouts).toMatchObject({ ref: "3°", frz: "-18°" });
    const setpoint = control(sections(celsius, { unit: "°C" }), "ref_set_temp");
    expect(setpoint).toMatchObject({ kind: "setpoint", value: 3, unit: "°C" });
    expect(model.infoRows(context(fridge(), { language: "de" }))[0]).toEqual({
      label: "Eingestellt",
      value: "Kühlschrank 38° · Gefrierschrank 0°",
    });
  });

  it("orders the sections everyday first and collapses settings and details", () => {
    const list = sections(fridge());
    expect(list.map((section) => section.id)).toEqual(["zones", "ice", "modes", "settings", "filters", "details"]);
    expect(list.find((section) => section.id === "settings")?.collapsed).toBe(true);
    expect(list.find((section) => section.id === "details")?.collapsed).toBe(true);
    expect(list.find((section) => section.id === "zones")?.collapsed).toBeUndefined();
  });

  it("controls each zone through its number entity, limits from the attributes", () => {
    expect(control(sections(fridge()), "ref_set_temp")).toEqual({
      kind: "setpoint",
      id: "ref_set_temp",
      label: "Refrigerator",
      hint: null,
      disabled: false,
      reason: null,
      action: { type: "number", entity_id: "number.fridge_ref_set_temp" },
      value: 38,
      min: 34,
      max: 42,
      step: 1,
      unit: "°F",
    });
  });

  it("explains why the crisper and freezer setpoints wait", () => {
    const automatic = withStates(fridge(), { crisp_set_temp: { number: "unavailable" } });
    // The locked number has no value, so its sensor shows what the crisper is set to.
    expect(control(sections(automatic), "crisp_set_temp")).toMatchObject({
      disabled: true,
      reason: "Set the crisper to Manual to change it.",
      value: 36,
    });
    const maxIce = withStates(fridge(), {
      max_ice_on: { binary_sensor: "on" },
      max_ice_end_time: { sensor: inMinutes(600) },
      frz_set_temp: { number: "unavailable" },
      ice_maker_mode: { select: "Max ice" },
    });
    const list = sections(maxIce);
    expect(control(list, "frz_set_temp")).toMatchObject({
      disabled: true,
      reason: "Turn off Max ice to change the freezer setpoint.",
    });
    expect(control(list, "max_ice_end_time")).toEqual({
      kind: "countdown",
      id: "max_ice_end_time",
      label: "Max ice ends in",
      end: inMinutes(600),
      hint: null,
    });
  });

  it("offers every mode the select offers, translated", () => {
    const mode = control(sections(fridge(), { language: "fr" }), "operating_mode");
    expect(mode).toMatchObject({ kind: "select", value: "Normal", disabled: false });
    expect(mode.kind === "select" && mode.options).toEqual([
      { value: "Normal", label: "Normal" },
      { value: "Sabbath", label: "Sabbat" },
      { value: "High use", label: "Utilisation intensive" },
      { value: "Short vacation", label: "Vacances courtes" },
      { value: "Long vacation", label: "Vacances longues" },
    ]);
  });

  it("disables locked controls with the translated reason", () => {
    const sabbath = withLocks(withStates(fridge(), { sabbath_on: { binary_sensor: "on" } }), {
      ref_set_temp: "sabbath",
      ice_maker_mode: "sabbath",
      air_filter_on: "sabbath",
    });
    const list = sections(sabbath);
    for (const id of ["ref_set_temp", "ice_maker_mode", "air_filter_on"]) {
      expect(control(list, id)).toMatchObject({ disabled: true, reason: "Sabbath mode is on. Turn it off to change this." });
    }
    expect(control(sections(sabbath, { language: "pl" }), "ref_set_temp").reason).toBe(
      "Tryb szabatowy jest włączony. Wyłącz go, aby to zmienić.",
    );
  });

  it("keeps the Mode select usable in Sabbath, as the integration does", () => {
    const sabbath = withLocks(withStates(fridge(), { operating_mode: { select: "Sabbath" } }), { operating_mode: "sabbath" });
    expect(control(sections(sabbath), "operating_mode")).toMatchObject({ disabled: false, value: "Sabbath" });
  });

  it("disables unavailable entities with a reason, and everything while offline", () => {
    const missing = withStates(fridge(), { humidity_control: { select: "unavailable" } });
    expect(control(sections(missing), "humidity_control")).toMatchObject({ disabled: true, reason: "Not available right now." });
    const gone = sections(offline(fridge()));
    expect(control(gone, "ref_set_temp")).toMatchObject({ disabled: true, reason: "The appliance is offline.", value: null });
    expect(control(gone, "air_filter_pct_remaining")).toMatchObject({ kind: "reading", value: "—" });
  });

  it("reads the filters and leaves out what the appliance doesn't have", () => {
    const list = sections(fridge());
    expect(control(list, "air_filter_pct_remaining")).toMatchObject({ kind: "reading", value: "56%", tone: "normal" });
    expect(control(list, "water_filter_pct_remaining")).toMatchObject({ value: "74%" });
    expect(find(list, "reset_air_filter")).toBeUndefined();
    expect(find(list, "water_filter_gal_remaining")).toBeUndefined();
    expect(find(list, "internal_dispenser_enabled")).toBeUndefined();
    const worn = withStates(fridge(), { water_filter_pct_remaining: { sensor: "5" } });
    expect(control(sections(worn), "water_filter_pct_remaining")).toMatchObject({ tone: "warning" });
  });

  it("says no faults in a word that agrees with its label", () => {
    // French "défauts" is masculine, unlike the options the same "None" serves elsewhere.
    const faults = (language: string) => control(sections(fridge(), { language }), "active_faults");
    expect(faults("en")).toMatchObject({ value: "None" });
    expect(faults("fr")).toMatchObject({ label: "Défauts actifs", value: "Aucun" });
  });

  it("says in words on the card when the weakest filter is low or spent, which the full view colors", () => {
    const row = (pct: string, language = "en") =>
      model.infoRows(context(withStates(fridge(), { air_filter_pct_remaining: { sensor: pct } }), { language })).find((part) => part.label.includes("ilter"));
    expect(row("56")).toEqual({ label: "Air filter", value: "56%" });
    expect(row("8")).toEqual({ label: "Air filter", value: "8% · Low" });
    expect(row("0")).toEqual({ label: "Air filter", value: "0% · Replace" });
    expect(row("0", "de")).toEqual({ label: "Luftfilter", value: "0% · Wechseln" });
  });

  it("lists details, opening them for faults with Sub-Zero's title and steps", () => {
    const faulty = withStates(fridge(), {
      active_faults: {
        sensor: [
          "1",
          {
            faults: [
              {
                code: "E15",
                severity: "high",
                title: "Condenser fan not running",
                resolution_steps: "Unplug the unit.\nCall service.",
                created: "2026-10-24T10:00:00Z",
              },
            ],
          },
        ],
      },
    });
    const details = sections(faulty).find((section) => section.id === "details");
    expect(details?.collapsed).toBeUndefined();
    expect(details?.controls).toEqual([
      { kind: "reading", id: "service_required", label: "Service", value: "Not needed", hint: null, tone: "normal" },
      { kind: "reading", id: "active_faults", label: "Active faults", value: "1", hint: null, tone: "alert" },
      {
        kind: "reading",
        id: "fault_0",
        label: "Condenser fan not running",
        value: "High",
        hint: "Code E15\nUnplug the unit.\nCall service.",
        tone: "alert",
      },
      { kind: "reading", id: "ap_rssi", label: "Wi-Fi signal", value: "Excellent · -48 dBm", hint: null },
      { kind: "reading", id: "model", label: "Model", value: "CL4850SID", hint: null },
      { kind: "reading", id: "appliance_type", label: "Appliance type", value: "17.11.3.3", hint: null },
    ]);
  });
});

describe("beverage center (DEU2450BG)", () => {
  const model = familyModel(beverage().appliance);

  it("has one zone and a mode row", () => {
    expect(model.infoRows(context(beverage()))).toEqual([
      { label: "Set to", value: "41°" },
      { label: "Mode", value: "Normal" },
    ]);
    expect(model.drawingState(context(beverage()))).toEqual({
      available: true,
      doors: { ref_door_ajar: false },
      readouts: { ref: "41°" },
      sabbath: false,
    });
  });

  it("offers the accent light levels in the settings", () => {
    const accent = control(sections(beverage()), "accent_light_level");
    expect(accent).toMatchObject({ kind: "select", value: "High", label: "Accent light" });
  });
});

describe("wine storage (DEU2450WDZ)", () => {
  const model = familyModel(wine().appliance);

  it("calls the two zones Upper and Lower", () => {
    expect(model.infoRows(context(wine()))[0]).toEqual({ label: "Set to", value: "Upper 45° · Lower 55°" });
    const list = sections(wine());
    expect(control(list, "wine_set_temp").label).toBe("Upper zone");
    expect(control(list, "wine2_set_temp").label).toBe("Lower zone");
    expect(model.drawingState(context(wine())).readouts).toEqual({ wine: "45°", wine2: "55°" });
  });

  it("raises the temperature alert", () => {
    const alert = withStates(wine(), { wine_temp_alert_on: { binary_sensor: "on" } });
    expect(model.status(context(alert))).toEqual({ text: "Temperature alert", tone: "red" });
    expect(control(sections(alert), "wine_temp_alert_on")).toMatchObject({ value: "Alert", tone: "alert" });
  });

  it("shows a door ajar on the one door it has", () => {
    const open = withStates(wine(), { wine_door_ajar: { binary_sensor: "on" } });
    expect(model.drawingState(context(open)).doors).toEqual({ wine_door_ajar: true });
    expect(control(sections(open), "wine_set_temp").hint).toBe("Door open");
  });
});
