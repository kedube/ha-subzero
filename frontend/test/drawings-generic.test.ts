// @vitest-environment happy-dom
import { nothing, render } from "lit";
import { describe, expect, it } from "vitest";
import { variants } from "../gallery/variants/generic";
import { variants as refrigeration } from "../gallery/variants/refrigeration";
import { renderDrawing } from "../src/drawings/index";
import type { GenericSpec } from "../src/types";
import { checkDrawing, checkVariants } from "./drawing-check";

const FORMS: GenericSpec["form"][] = ["refrigerator", "wine", "ice_maker", "oven", "hood", "dishwasher", "appliance"];

describe("generic drawings", () => checkVariants("gn", variants));

describe("generic fallback", () => {
  const appearance = variants[0].input.appearance;
  for (const form of FORMS) {
    for (const width of [null, 15, 30, 48]) {
      it(`draws a ${form} at width ${width}`, () => {
        const spec: GenericSpec = { family: "generic", form, width, generic: true };
        checkDrawing({
          uid: `gf${form}${width}`,
          spec,
          appearance,
          theme: "dark",
          state: { available: width !== 30, doors: {}, readouts: {} },
        });
      });
    }
  }
});

describe("shared shadow root", () => {
  it("draws two copies of one drawing side by side without id clashes", () => {
    const [first] = refrigeration;
    const host = document.createElement("div");
    const a = document.createElement("div");
    const b = document.createElement("div");
    host.append(a, b);
    render(renderDrawing({ ...first.input, uid: "dup1", theme: "light" }), a);
    render(renderDrawing({ ...first.input, uid: "dup2", theme: "light" }), b);
    const ids = [...host.querySelectorAll("[id]")].map((element) => element.id);
    expect(new Set(ids).size).toBe(ids.length);
    render(nothing, a);
    render(nothing, b);
  });
});
