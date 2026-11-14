// What the drawing modules share under their materials and readouts: ids that are safe whatever
// uid a drawing is given, one reading of which panel colors are wood, definitions that are all
// used, and the frosted labels' measures. Without a DOM (see drawing-markup.ts).
import { describe, expect, it } from "vitest";
import type { GalleryVariant } from "../gallery/types";
import { variants as hood } from "../gallery/variants/hood";
import { variants as range } from "../gallery/variants/range";
import { variants as refrigeration } from "../gallery/variants/refrigeration";
import { variants as wallOven } from "../gallery/variants/wall-oven";
import { renderGeneric } from "../src/drawings/generic";
import { renderDrawing } from "../src/drawings/index";
import { Ids, isWood, mix, offlineFilter, parseHex, polyPath, tint, toHex } from "../src/drawings/materials-core";
import { frost, labelScale, labelWidth, statusRow, textWidth, zoneReadout } from "../src/drawings/overlay";
import type { DrawingInput, DrawingState } from "../src/drawings/types";
import { makeTranslate } from "../src/i18n";
import type { Appearance, ApplianceSpec } from "../src/types";
import { problems, serialize } from "./drawing-markup";

const t = makeTranslate("en");
const APPEARANCE: Appearance = { finish: "stainless", panel_color: null, knobs: "red", handle: "tubular", style: null, form: null };
const IDLE: DrawingState = { available: true, doors: {}, readouts: {} };

describe("a drawing's ids", () => {
  it("carry the uids the panel gives unchanged", () => {
    for (const uid of ["szc0", "szv12", "sza3", "rf", "ok-uid_1"]) {
      const ids = new Ids(uid);
      expect(ids.uid).toBe(uid);
      expect(ids.id("blur")).toBe(`${uid}-blur`);
      expect(ids.url("blur")).toBe(`url(#${uid}-blur)`);
    }
  });

  it("are safe in url(#…) and as CSS names whatever the uid", () => {
    expect(new Ids("a b").uid).toBe("a_b");
    expect(new Ids('q"x<y>').uid).toBe("q_x_y_");
    expect(new Ids("ü1.2#3").uid).toBe("d_1_2_3");
    expect(new Ids("9(x)").uid).toBe("d9_x_");
    expect(new Ids("-x").uid).toBe("d-x");
    expect(new Ids("").uid).toBe("d");
  });

  // Every module, each with the parts that make ids of their own (open doors, readouts, lights).
  const ON = { on: true, preheated: false, progress: 0.4, light: true, door_open: true, probe: true, remote_ready: true, self_clean: false, temp: "350°", mode: "Bake" };
  const DRAWINGS: Array<[string, ApplianceSpec, DrawingState]> = [
    [
      "refrigeration",
      { family: "refrigeration", form: "side_by_side", line: "classic", width: 48, glass: true, dispenser: "internal", ice: true, drawers: null, zones: 2, outdoor: false, generic: false },
      { ...IDLE, doors: { ref_door_ajar: true, frz_door_ajar: true }, readouts: { ref: "38°", frz: "0°" }, ice: { on: true, mode: "night" } },
    ],
    [
      "range",
      { family: "range", form: "range", width: 48, fuel: "dual_fuel", burners: 8, surfaces: [], ovens: [{ prefix: "cav2", position: "left", width: 18 }, { prefix: "cav", position: "right", width: 30 }], style: "professional", generic: false },
      { ...IDLE, ovens: { cav: ON, cav2: { ...ON, door_open: false } }, display: "4:12" },
    ],
    [
      "wall oven",
      { family: "wall_oven", form: "double", width: 30, series: "m", style: "professional", ovens: [{ prefix: "cav", position: "upper", width: 30 }, { prefix: "cav2", position: "lower", width: 30 }], knob: true, generic: false },
      { ...IDLE, ovens: { cav: ON, cav2: { ...ON, door_open: false } } },
    ],
    ["hood", { family: "hood", form: "island", width: 42, generic: false }, { ...IDLE, hood: { fan: 3, light: true, brightness: 80, kelvin: 3000, halo: true } }],
    [
      "dishwasher",
      { family: "dishwasher", form: "dishwasher", width: 24, front: null, generic: false },
      { ...IDLE, dishwasher: { status: "running", progress: 0.5, remote_ready: true, door_open: true, rinse_aid_low: true, softener_low: true, display: "1:20" } },
    ],
    ["generic", { family: "generic", form: "refrigerator", width: 36, generic: true }, { ...IDLE, doors: { ref_door_ajar: true, frz_door_ajar: true }, readouts: { ref: "38°" } }],
  ];

  it.each(DRAWINGS)("stay safe in the %s drawing", (_name, spec, state) => {
    for (const uid of ["a b", 'q"x<y>', "ü1.2#3", "9(x)", ""]) {
      for (const available of [true, false]) {
        const input: DrawingInput = { uid, spec, appearance: { ...APPEARANCE, finish: "panel", panel_color: "#5b3a29" }, state: { ...state, available }, theme: "dark", t };
        const markup = serialize(renderDrawing(input));
        const safe = new Ids(uid).uid;
        expect(problems(markup, safe), JSON.stringify(uid)).toEqual([]);
        const ids = [...markup.matchAll(/\sid="([^"]*)"/g)].map((match) => match[1]);
        expect(ids.length).toBeGreaterThan(5);
        for (const id of ids) expect(id).toMatch(/^[A-Za-z][A-Za-z0-9_-]*$/);
        // Names a <style> uses (a class, a keyframes animation) are the same safe ids.
        for (const [, css] of markup.matchAll(/<style>([\s\S]*?)<\/style>/g)) {
          const names = [...css.matchAll(/@keyframes\s+([^\s{]+)\{/g), ...css.matchAll(/^\.([^\s{]+)\{/g)].map((match) => match[1]);
          expect(names.length, css).toBe(1);
          expect(names[0]).toMatch(new RegExp(`^${safe}-[a-z]+$`));
        }
      }
    }
  });
});

describe("a panel color", () => {
  const PRESETS = { white: "#f4f2ec", cream: "#ece4d2", gray: "#9aa0a6", navy: "#2f3b52", sage: "#9caf88", black: "#1f2022", walnut: "#5b3a29", oak: "#b08955" };

  it("is wood for the walnut and oak presets, paint for the others", () => {
    const wood = Object.entries(PRESETS)
      .filter(([, color]) => isWood(parseHex(color)))
      .map(([name]) => name);
    expect(wood).toEqual(["walnut", "oak"]);
    expect(isWood(parseHex("#808080"))).toBe(false);
  });

  it("is the same material on a refrigerator and on a dishwasher", () => {
    const fridge: ApplianceSpec = { family: "refrigeration", form: "column_refrigerator", line: "designer", width: 30, glass: false, dispenser: "none", ice: false, drawers: null, zones: 1, outdoor: false, generic: false };
    const dishwasher: ApplianceSpec = { family: "dishwasher", form: "dishwasher", width: 24, front: null, generic: false };
    const drawn = (spec: ApplianceSpec, color: string) =>
      serialize(renderDrawing({ uid: "szc1", spec, appearance: { ...APPEARANCE, finish: "panel", panel_color: color }, state: IDLE, theme: "light", t }));
    // Tan and burlywood were wood on a refrigerator and flat paint on a dishwasher.
    for (const color of [...Object.values(PRESETS), "#d2b48c", "#deb887", "#c8a27a", "#3c2a1e", "#a0522d"]) {
      const wood = isWood(parseHex(color));
      expect(drawn(fridge, color).includes('id="szc1-grainW"'), `refrigerator ${color}`).toBe(wood);
      expect(drawn(dishwasher, color).includes('id="szc1-panel-wood"'), `dishwasher ${color}`).toBe(wood);
    }
    expect(isWood(parseHex("#d2b48c"))).toBe(true);
  });
});

describe("the drawings' definitions", () => {
  // A gradient or filter nothing refers to is dead weight in every card. Each of these modules
  // makes its own definitions, so across its gallery variants (and offline) every one is used.
  it.each([
    ["refrigeration", refrigeration],
    ["range", range],
    ["wall oven", wallOven],
    ["hood", hood],
  ] as Array<[string, GalleryVariant[]]>)("are all used somewhere in the %s drawings", (_name, variants) => {
    const defined = new Set<string>();
    const used = new Set<string>();
    // Ids made per door, cavity or item count as one.
    const name = (id: string) => id.replace(/^szc1-/, "").replace(/\d+/g, "#").replace(/-(cav#?|upper|lower)$/, "-#");
    for (const variant of variants) {
      for (const available of [true, false]) {
        const input = { ...variant.input, state: { ...variant.input.state, available } };
        const markup = serialize(renderDrawing({ ...input, uid: "szc1", theme: "light", t }));
        for (const match of markup.matchAll(/\sid="([^"]*)"/g)) defined.add(name(match[1]));
        for (const match of markup.matchAll(/url\(\s*['"]?#([^'")\s]+)['"]?\s*\)/g)) used.add(name(match[1]));
        for (const match of markup.matchAll(/href="#([^"]+)"/g)) used.add(name(match[1]));
      }
    }
    expect(defined.size).toBeGreaterThan(10);
    expect([...defined].filter((id) => !used.has(id))).toEqual([]);
  });
});

describe("the shared helpers", () => {
  it("mix and tint colors", () => {
    expect(parseHex("#5b3a29")).toEqual([91, 58, 41]);
    expect(toHex([91, 58, 41])).toBe("#5b3a29");
    expect(toHex([300, -4, 127.6])).toBe("#ff0080");
    expect(tint([100, 100, 100], 0.5)).toBe("#b2b2b2");
    expect(tint([100, 100, 100], -0.5)).toBe("#323232");
    expect(tint([100, 100, 100], 0)).toBe("#646464");
    expect(mix("#000000", "#ffffff", 0.5)).toBe("#808080");
    expect(mix("#102030", "#405060", 2)).toBe("#405060");
  });

  it("write paths to 0.01 unit, or as a module rounds", () => {
    expect(polyPath([[0, 0], [10.004, 0], [10.006, 5.555]])).toBe("M0 0L10 0L10.01 5.56Z");
    expect(polyPath([[0.04, 0.06]], (value) => Math.round(value * 10) / 10)).toBe("M0 0.1Z");
  });

  it("give each family its own offline look from one filter", () => {
    const plain = serialize(offlineFilter("u-offline", { saturation: 0.06, slope: 0.6, lift: 0.24 }));
    expect(plain).toContain('<filter id="u-offline" color-interpolation-filters="sRGB">');
    expect(plain).toContain('<feFuncB type="linear" slope="0.6" intercept="0.24" />');
    const tinted = serialize(offlineFilter("u-offline", { saturation: 0.06, slope: 0.62, lift: [0.17, 0.17, 0.18], margin: 5 }));
    expect(tinted).toContain('x="-5%" y="-5%" width="110%" height="110%"');
    expect(tinted).toContain('<feFuncR type="linear" slope="0.62" intercept="0.17" />');
    expect(tinted).toContain('<feFuncB type="linear" slope="0.62" intercept="0.18" />');
  });
});

describe("frosted labels", () => {
  it("are the same size on screen whatever the drawing's size", () => {
    // 12 px text: a drawing 840 units tall shown 300 px tall needs 2.8 units per pixel.
    expect(labelScale(840, 300)).toBeCloseTo(2.8);
    // Without the shown height, text is 3% of the drawing's height.
    expect(labelScale(400) * 12).toBeCloseTo(12);
    // On a thumbnail a 20 px pill is at most an eighth of the height.
    expect(labelScale(800, 40) * 20).toBeCloseTo(100);
  });

  it("make room for their text, a ring or an icon", () => {
    expect(textWidth("350°")).toBeCloseTo((3 * 0.6 + 0.34) * 12);
    expect(labelWidth({})).toBe(20);
    expect(labelWidth({ progress: 0.4 })).toBe(20);
    expect(labelWidth({ text: "350°" })).toBeCloseTo(7 + 25.68 + 9);
    expect(labelWidth({ text: "350°", progress: 0.4 })).toBeCloseTo(7 + 16 + 25.68 + 9);
    expect(labelWidth({ text: "350°", icon: "lock" })).toBe(labelWidth({ text: "350°", progress: 0 }));
  });

  it("wrap a zone's readout to its width", () => {
    const style = { shadow: "url(#u-blur)" };
    const content = { label: { text: "350°", progress: 0.4 }, chips: ["probe", "remote"] as const };
    const rows = (width: number) => {
      const markup = serialize(zoneReadout(style, { x0: 0, y0: 0, x1: width, y1: 200 }, { ...content, chips: [...content.chips] }, 1, true));
      return new Set([...markup.matchAll(/<rect [^>]*?y="([^"]*)" [^>]*?fill="#000"/g)].map((match) => match[1])).size;
    };
    expect(rows(200)).toBe(1);
    expect(rows(90)).toBe(2);
    expect(rows(40)).toBe(3);
  });

  it("keep the frost as each drawing writes it", () => {
    // One paint, written two ways; a renderer may round them a level apart, so neither changes.
    const pill = serialize(frost("url(#u-blur)", 0, 0, 40));
    expect(pill).toContain('fill="rgba(20, 22, 25, 0.6)"');
    expect(pill).not.toContain("fill-opacity");
    const fridge: ApplianceSpec = { family: "refrigeration", form: "column_refrigerator", line: "designer", width: 30, glass: false, dispenser: "none", ice: false, drawers: null, zones: 1, outdoor: false, generic: false };
    const drawn = serialize(renderDrawing({ uid: "szc1", spec: fridge, appearance: APPEARANCE, state: { ...IDLE, readouts: { ref: "38°" } }, theme: "light", t }));
    expect(drawn).toMatch(/fill="rgb\(20,22,25\)"\s+fill-opacity="0.6" stroke="#fff" stroke-opacity="0.22"/);
  });

  it("draw nothing for an empty status row", () => {
    expect(serialize(statusRow({ shadow: "url(#u-blur)" }, 0, 0, null, []))).toBe("");
    expect(serialize(statusRow({ shadow: "url(#u-blur)" }, 50, 20, { text: "38°" }, ["check"], true, 2))).toContain("scale(2)");
  });
});

describe("the fallback drawing", () => {
  it("keeps its ids safe too", () => {
    const spec: ApplianceSpec = { family: "generic", form: "oven", width: null, generic: true };
    const markup = serialize(renderGeneric({ uid: "x y", spec, appearance: APPEARANCE, state: IDLE, theme: "light", t }));
    expect(problems(markup, "x_y")).toEqual([]);
  });
});
