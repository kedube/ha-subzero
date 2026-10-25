import { describe, expect, it } from "vitest";
import { dishwasher as dishwasherModel } from "../src/families/dishwasher";
import { generic } from "../src/families/generic";
import { hood as hoodModel } from "../src/families/hood";
import { iceMaker as iceModel } from "../src/families/ice-maker";
import { familyModel } from "../src/families/index";
import { oven } from "../src/families/oven";
import { refrigeration } from "../src/families/refrigeration";
import type { ApplianceSpec } from "../src/types";
import { dishwasher, fridge, hood, iceMaker, range, wallOven, wine } from "./fixtures/appliances";
import { context, makeFixture, type Fixture } from "./fixtures/hass";

function asGeneric(fixture: Fixture, form: Extract<ApplianceSpec, { family: "generic" }>["form"]): Fixture {
  return { ...fixture, appliance: { ...fixture.appliance, spec: { family: "generic", form, width: null, generic: true } } };
}

describe("familyModel", () => {
  it("dispatches on the family and form", () => {
    expect(familyModel(fridge().appliance)).toBe(refrigeration);
    expect(familyModel(wine().appliance)).toBe(refrigeration);
    expect(familyModel(iceMaker().appliance)).toBe(iceModel);
    expect(familyModel(range().appliance)).toBe(oven);
    expect(familyModel(wallOven().appliance)).toBe(oven);
    expect(familyModel(dishwasher().appliance)).toBe(dishwasherModel);
    expect(familyModel(hood().appliance)).toBe(hoodModel);
  });

  it("gives a generic spec its kind's controls when detection knows the kind", () => {
    expect(familyModel(asGeneric(fridge(), "refrigerator").appliance)).toBe(refrigeration);
    expect(familyModel(asGeneric(wine(), "wine").appliance)).toBe(refrigeration);
    expect(familyModel(asGeneric(iceMaker(), "ice_maker").appliance)).toBe(iceModel);
    expect(familyModel(asGeneric(range(), "oven").appliance)).toBe(oven);
    expect(familyModel(asGeneric(hood(), "hood").appliance)).toBe(hoodModel);
    expect(familyModel(asGeneric(dishwasher(), "dishwasher").appliance)).toBe(dishwasherModel);
    expect(familyModel(asGeneric(fridge(), "appliance").appliance)).toBe(generic);
  });

  it("names a generic range's cavities from its series", () => {
    const unknown = asGeneric(range(), "oven");
    expect(oven.infoRows(context(unknown)).map((row) => row.label)).toEqual(["Left oven", "Right oven"]);
    const wall = asGeneric(wallOven(), "oven");
    expect(oven.infoRows(context(wall)).map((row) => row.label)).toEqual(["Upper oven", "Lower oven"]);
  });
});

describe("generic model", () => {
  it("uses the one family its entities fit", () => {
    const unknown = asGeneric(fridge(), "appliance");
    const ctx = context(unknown);
    expect(generic.status(ctx)).toEqual(refrigeration.status(context(fridge())));
    expect(generic.infoRows(ctx)).toEqual(refrigeration.infoRows(context(fridge())));
    expect(generic.sections(ctx).map((part) => part.id)).toEqual(["zones", "ice", "modes", "settings", "filters", "details"]);
    expect(generic.drawingState(ctx).readouts).toEqual({ ref: "38°", frz: "0°", crisp: "36°" });
  });

  it("shows only the details for an appliance nothing fits", () => {
    const bare = makeFixture({
      id: "mystery",
      name: "Appliance",
      brand: "Sub-Zero",
      model: "XYZ123",
      type: "17.99.1.0",
      spec: { family: "generic", form: "appliance", width: null, generic: true },
      entities: {
        ap_rssi: { sensor: "-75" },
        service_required: { binary_sensor: "off" },
        active_faults: { sensor: ["0", { faults: [] }] },
      },
    });
    const ctx = context(bare);
    expect(generic.status(ctx)).toEqual({ text: "Normal", tone: "neutral" });
    expect(generic.infoRows(ctx)).toEqual([{ label: "Model", value: "XYZ123" }]);
    expect(generic.display(ctx)).toBeNull();
    expect(generic.sections(ctx).map((part) => part.id)).toEqual(["details"]);
    expect(generic.sections(ctx)[0].controls.find((part) => part.id === "ap_rssi")).toMatchObject({ value: "Weak · -75 dBm" });
    expect(generic.drawingState(ctx)).toEqual({ available: true, doors: {}, readouts: {} });
  });
});
