import { describe, expect, it } from "vitest";
import { applianceName, familyRank, groupByArea, relevantChange } from "../src/data/appliances";
import type { HassDevice } from "../src/hass";
import type { PanelAppliance } from "../src/types";
import { SPECS, entity, makeAppliance, makeHass } from "./shell-fixtures";

function device(id: string, name: string | null, area_id: string | null, name_by_user: string | null = null): HassDevice {
  return { id, name, name_by_user, area_id };
}

function names(groups: ReturnType<typeof groupByArea>) {
  return groups.map((group) => [group.name, group.appliances.map((entry) => entry.name)]);
}

describe("applianceName", () => {
  const appliance = makeAppliance("fridge", SPECS.sideBySide, { name: "Integration name" });

  it("prefers the name the user gave the device", () => {
    const hass = makeHass({ devices: { "dev-fridge": device("dev-fridge", "Registry name", null, "My fridge") } });
    expect(applianceName(appliance, hass)).toBe("My fridge");
  });

  it("then the device registry's name, then the integration's", () => {
    expect(applianceName(appliance, makeHass({ devices: { "dev-fridge": device("dev-fridge", "Registry name", null) } }))).toBe(
      "Registry name",
    );
    expect(applianceName(appliance, makeHass({ devices: { "dev-fridge": device("dev-fridge", null, null, "") } }))).toBe(
      "Integration name",
    );
    expect(applianceName(appliance, undefined)).toBe("Integration name");
  });
});

describe("familyRank", () => {
  it("orders refrigeration, wine and beverage, ice, ranges, wall ovens, hoods, dishwashers", () => {
    const ranks = [
      SPECS.sideBySide,
      SPECS.undercounterWine,
      SPECS.iceMaker,
      SPECS.range,
      SPECS.wallOven,
      SPECS.hood,
      SPECS.dishwasher,
    ].map(familyRank);
    expect(ranks).toEqual([...ranks].sort((a, b) => a - b));
    expect(new Set(ranks).size).toBe(ranks.length);
  });

  it("sorts an appliance of unknown family with its kind, and an unknown kind last", () => {
    expect(familyRank(SPECS.genericFridge)).toBe(familyRank(SPECS.sideBySide));
    expect(familyRank(SPECS.genericAppliance)).toBeGreaterThan(familyRank(SPECS.dishwasher));
  });
});

describe("groupByArea", () => {
  const fridge = makeAppliance("fridge", SPECS.sideBySide);
  const wine = makeAppliance("wine", SPECS.undercounterWine);
  const range = makeAppliance("range", SPECS.range);
  const dishwasher = makeAppliance("dishwasher", SPECS.dishwasher);
  const ice = makeAppliance("ice", SPECS.iceMaker);
  const hood = makeAppliance("hood", SPECS.hood);
  const areas = {
    kitchen: { area_id: "kitchen", name: "Kitchen" },
    bar: { area_id: "bar", name: "bar" },
    pantry: { area_id: "pantry", name: "Pantry" },
  };

  it("makes a section per area, in Home Assistant's area order, with no area last", () => {
    const hass = makeHass({
      areas,
      devices: {
        "dev-fridge": device("dev-fridge", "Fridge", "kitchen"),
        "dev-wine": device("dev-wine", "Wine", "bar"),
        "dev-range": device("dev-range", "Range", "kitchen"),
        "dev-ice": device("dev-ice", "Ice", null),
        "dev-hood": device("dev-hood", "Hood", "pantry"),
      },
    });
    const groups = groupByArea([dishwasher, ice, range, wine, fridge, hood], hass);
    expect(names(groups)).toEqual([
      ["Kitchen", ["Fridge", "Range"]],
      ["bar", ["Wine"]],
      ["Pantry", ["Hood"]],
      [null, ["Ice", "dishwasher"]],
    ]);
    expect(groups.map((group) => group.areaId)).toEqual(["kitchen", "bar", "pantry", null]);
  });

  it("keeps the areas on a floor together, floors in the order they first come", () => {
    const hass = makeHass({
      areas: {
        kitchen: { area_id: "kitchen", name: "Kitchen", floor_id: "ground" },
        office: { area_id: "office", name: "Office", floor_id: "upstairs" },
        garage: { area_id: "garage", name: "Garage", floor_id: null },
        bar: { area_id: "bar", name: "Bar", floor_id: "ground" },
      },
      devices: {
        "dev-fridge": device("dev-fridge", "Fridge", "garage"),
        "dev-wine": device("dev-wine", "Wine", "bar"),
        "dev-range": device("dev-range", "Range", "kitchen"),
        "dev-hood": device("dev-hood", "Hood", "office"),
      },
    });
    const groups = groupByArea([fridge, wine, range, hood], hass);
    expect(groups.map((group) => group.areaId)).toEqual(["kitchen", "bar", "office", "garage"]);
  });

  it("orders appliances in an area by family, then by name", () => {
    const fridge2 = makeAppliance("fridge2", SPECS.frenchDoor);
    const hass = makeHass({
      areas,
      devices: Object.fromEntries(
        [
          ["dev-dishwasher", "A dishwasher"],
          ["dev-hood", "A hood"],
          ["dev-range", "A range"],
          ["dev-ice", "An ice maker"],
          ["dev-wine", "A wine fridge"],
          ["dev-fridge", "Fridge 10"],
          ["dev-fridge2", "Fridge 2"],
        ].map(([id, name]) => [id, device(id, name, "kitchen")]),
      ),
    });
    const groups = groupByArea([dishwasher, hood, range, ice, wine, fridge, fridge2], hass);
    expect(names(groups)).toEqual([
      ["Kitchen", ["Fridge 2", "Fridge 10", "A wine fridge", "An ice maker", "A range", "A hood", "A dishwasher"]],
    ]);
  });

  it("counts a device in an area that no longer exists as in no area", () => {
    const hass = makeHass({ areas, devices: { "dev-fridge": device("dev-fridge", "Fridge", "garage") } });
    expect(groupByArea([fridge], hass)).toEqual([
      { areaId: null, name: null, appliances: [{ appliance: fridge, name: "Fridge" }] },
    ]);
  });

  it("sorts names in the user's language", () => {
    const fridge2 = makeAppliance("fridge2", SPECS.frenchDoor);
    const hass = makeHass({
      language: "sv",
      locale: { language: "sv" },
      devices: {
        "dev-fridge": device("dev-fridge", "Övervåning", null),
        "dev-fridge2": device("dev-fridge2", "Zon", null),
      },
    });
    // Swedish sorts Ö after Z.
    expect(names(groupByArea([fridge, fridge2], hass))).toEqual([[null, ["Zon", "Övervåning"]]]);
  });

  it("returns nothing for no appliances", () => {
    expect(groupByArea([], makeHass())).toEqual([]);
  });
});

describe("relevantChange", () => {
  const appliance: PanelAppliance = makeAppliance("fridge", SPECS.sideBySide, {
    entities: {
      ref_set_temp: { number: "number.fridge_setpoint", climate: "climate.fridge" },
      ref_door_ajar: { binary_sensor: "binary_sensor.fridge_door" },
    },
  });
  const states = {
    "number.fridge_setpoint": entity("number.fridge_setpoint", "38"),
    "climate.fridge": entity("climate.fridge", "cool"),
    "binary_sensor.fridge_door": entity("binary_sensor.fridge_door", "off"),
    "sensor.outdoor": entity("sensor.outdoor", "61"),
  };
  const before = makeHass({ states, devices: { "dev-fridge": device("dev-fridge", "Fridge", null) } });

  it("is true for the first hass", () => {
    expect(relevantChange(undefined, before, appliance)).toBe(true);
  });

  it("ignores state changes elsewhere in the house", () => {
    const after = { ...before, states: { ...states, "sensor.outdoor": entity("sensor.outdoor", "62") } };
    expect(relevantChange(before, after, appliance)).toBe(false);
  });

  it("notices the appliance's own entities", () => {
    const after = { ...before, states: { ...states, "binary_sensor.fridge_door": entity("binary_sensor.fridge_door", "on") } };
    expect(relevantChange(before, after, appliance)).toBe(true);
  });

  it("notices a rename, and a new language or theme", () => {
    expect(
      relevantChange(before, { ...before, devices: { "dev-fridge": device("dev-fridge", "Fridge", null, "Big fridge") } }, appliance),
    ).toBe(true);
    expect(relevantChange(before, { ...before, language: "de" }, appliance)).toBe(true);
    expect(relevantChange(before, { ...before, themes: { darkMode: true } }, appliance)).toBe(true);
  });
});
