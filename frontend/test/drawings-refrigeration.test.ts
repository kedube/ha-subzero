// @vitest-environment happy-dom
import { nothing, render } from "lit";
import { describe, expect, it } from "vitest";
import { variants } from "../gallery/variants/refrigeration";
import { renderDrawing } from "../src/drawings/index";
import { makeTranslate } from "../src/i18n";
import { checkVariants } from "./drawing-check";

describe("refrigeration drawings", () => checkVariants("rf", variants));

describe("refrigeration drawing words", () => {
  it("name the appliance and what's open in the panel's language", () => {
    const label = (id: string, language: string, available = true) => {
      const variant = variants.find((candidate) => candidate.id === id)!;
      const host = document.createElement("div");
      const state = { ...variant.input.state, available };
      render(renderDrawing({ ...variant.input, state, uid: `w${language}`, theme: "light", t: makeTranslate(language) }), host);
      const text = host.querySelector("svg")!.getAttribute("aria-label");
      render(nothing, host);
      return text;
    };
    expect(label("cl4850sid-both-open", "en")).toBe("Side-by-side refrigerator, freezer door open, refrigerator door open");
    expect(label("cl4850sid-both-open", "fr")).toBe(
      "Réfrigérateur américain, porte du congélateur ouverte, porte du réfrigérateur ouverte",
    );
    expect(label("cl4850sid", "sv", false)).toBe("Amerikanskt kylskåp, offline");
  });
});
