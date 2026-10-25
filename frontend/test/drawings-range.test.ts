// @vitest-environment happy-dom
import { nothing, render } from "lit";
import { describe, expect, it } from "vitest";
import { variants } from "../gallery/variants/range";
import { renderDrawing } from "../src/drawings/index";
import { makeTranslate } from "../src/i18n";
import { checkVariants } from "./drawing-check";

describe("range drawings", () => checkVariants("rg", variants));

describe("range drawing words", () => {
  // Left oven preheated at 325°, right oven 30% of the way to 400°, touchscreen out.
  const variant = variants.find((candidate) => candidate.id === "df48850sp-both-on")!;

  function words(language: string): { label: string | null; screen: string[] } {
    const host = document.createElement("div");
    render(renderDrawing({ ...variant.input, uid: `w${language}`, theme: "light", t: makeTranslate(language) }), host);
    const svg = host.querySelector("svg")!;
    const result = {
      label: svg.getAttribute("aria-label"),
      screen: [...svg.querySelectorAll("text")].map((text) => text.textContent?.trim() ?? ""),
    };
    render(nothing, host);
    return result;
  }

  it("speak the panel's language on the touchscreen and to screen readers", () => {
    const german = words("de");
    expect(german.label).toBe("Standherd, linker Backofen: vorgeheizt 325°, rechter Backofen: heizt 400°");
    for (const word of ["SPERRE", "EINSTELLUNGEN", "VORGEHEIZT", "HEIZT VOR 30 %", "TIMER 1", "LICHT"]) {
      expect(german.screen).toContain(word);
    }
    const chinese = words("zh-Hans");
    expect(chinese.label).toBe("一体式炉灶，左烤箱：已预热 325°，右烤箱：加热中 400°");
    expect(chinese.screen).toContain("预热中 30%");
  });

  it("say English when the panel is in English", () => {
    const english = words("en");
    expect(english.label).toBe("Range, left oven: preheated 325°, right oven: heating 400°");
    for (const word of ["LOCK", "SETTINGS", "PREHEATED", "PREHEATING 30%", "TIMER 1", "LIGHT", "TIMER 2"]) {
      expect(english.screen).toContain(word);
    }
  });
});
