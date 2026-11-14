// Draws a wide, fixed sample of the specs the integration can send, in every family, and checks
// each drawing's markup (drawing-markup.ts) without a DOM, which makes thousands of drawings
// cost seconds. The gallery variants are checked on a real DOM in the other drawings-*.test.ts
// files; this is for the combinations no variant shows.
import { describe, expect, it } from "vitest";
import { renderGeneric } from "../src/drawings/generic";
import { renderDrawing } from "../src/drawings/index";
import type { DrawingInput, DrawingState, OvenState } from "../src/drawings/types";
import { makeTranslate } from "../src/i18n";
import type {
  Appearance,
  ApplianceSpec,
  GenericSpec,
  HoodSpec,
  OvenSlot,
  RangeSpec,
  RangetopSurface,
  RefrigerationForm,
  RefrigerationLine,
  RefrigerationSpec,
  WallOvenSpec,
} from "../src/types";
import { problems, serialize } from "./drawing-markup";

/** A small seeded generator (mulberry32), so every run draws the same sample. */
function seeded(seed: number) {
  let state = seed >>> 0;
  const next = () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let z = state;
    z = Math.imul(z ^ (z >>> 15), z | 1);
    z ^= z + Math.imul(z ^ (z >>> 7), z | 61);
    return ((z ^ (z >>> 14)) >>> 0) / 4294967296;
  };
  return { next, pick: <T>(list: readonly T[]): T => list[Math.floor(next() * list.length)] };
}
type Random = ReturnType<typeof seeded>;

const LANGUAGES = ["en", "de", "fr", "zh-Hans"].map((language) => makeTranslate(language));
const HEIGHTS = [undefined, 60, 180, 300, 720];
const PANEL_COLORS = [null, "#f4f2ec", "#ece4d2", "#9aa0a6", "#2f3b52", "#9caf88", "#1f2022", "#5b3a29", "#b08955", "#d2b48c"];

function appearance(random: Random): Appearance {
  return {
    finish: random.pick(["stainless", "panel", "black", "carbon", "white"] as const),
    panel_color: random.pick(PANEL_COLORS),
    knobs: random.pick(["red", "black", "stainless"] as const),
    handle: random.pick(["tubular", "pro", "none"] as const),
    style: random.pick([null, null, "professional", "transitional", "contemporary"] as const),
    form: null,
  };
}

const OFF: OvenState = {
  on: false,
  preheated: false,
  progress: null,
  light: false,
  door_open: false,
  probe: false,
  remote_ready: false,
  self_clean: false,
  temp: null,
  mode: null,
};
const HEATING: OvenState = { ...OFF, on: true, progress: 0.4, temp: "350°", mode: "Convection Roast" };
/** Every kind of state the oven model gives a cavity, and one it shouldn't (self-clean while off). */
const OVEN_STATES: Array<OvenState | undefined> = [
  undefined,
  OFF,
  HEATING,
  { ...HEATING, progress: 0, light: true, probe: true, remote_ready: true },
  { ...HEATING, progress: 1, preheated: true },
  { ...HEATING, progress: null, door_open: true },
  { ...OFF, on: true, self_clean: true, temp: "880°", mode: "Self clean" },
  { ...OFF, self_clean: true },
  { ...OFF, light: true },
  { ...OFF, door_open: true, probe: true },
  { ...OFF, remote_ready: true },
];

function ovens(random: Random): DrawingState["ovens"] {
  const cav = random.pick(OVEN_STATES);
  const cav2 = random.pick(OVEN_STATES);
  return { ...(cav ? { cav } : {}), ...(cav2 ? { cav2 } : {}) };
}

/** The first findings of a sweep, each with the case that gave it, and how many cases it drew. */
function sweep(seed: number, cases: (random: Random) => Iterable<{ label: string; input: Omit<DrawingInput, "uid" | "theme" | "t"> }>) {
  const random = seeded(seed);
  const found: string[] = [];
  let count = 0;
  for (const { label, input } of cases(random)) {
    const uid = `${random.pick(["szc", "szv", "sza"])}${count++ % 50}`;
    const full: DrawingInput = {
      ...input,
      uid,
      theme: random.pick(["light", "dark"] as const),
      t: random.pick(LANGUAGES),
      reducedMotion: random.pick([true, false, undefined]),
      pixelHeight: random.pick(HEIGHTS),
    };
    let markup: string;
    try {
      markup = serialize(renderDrawing(full));
    } catch (error) {
      found.push(`${label}: throws ${String(error)}`);
      continue;
    }
    for (const problem of problems(markup, uid)) found.push(`${label}: ${problem}`);
    if (found.length > 20) break;
  }
  return { found, count };
}

const slot = (prefix: OvenSlot["prefix"], position: OvenSlot["position"], width: number | null): OvenSlot => ({
  prefix,
  position,
  width,
});

describe("drawings over the specs the integration can send", () => {
  // appliance_spec.py: a model gives its line's widths, a type gives the app's width or none, and
  // properties give none. Only Classic and BI models have an external dispenser (the D in
  // CL4850SD), and PRO comes at 36″ and 48″. The Appearance setting can then draw the appliance as
  // any other refrigeration form, keeping the line, width and dispenser, so every form has to
  // draw at every such width. (A side-by-side or French-door form on a 15″ to 27″ unit with an
  // external dispenser or PRO styling would have negative sizes; neither can be sent.)
  const FORMS: RefrigerationForm[] = [
    ...(["side_by_side", "french_door", "over_under", "column_refrigerator", "column_freezer", "column_wine"] as const),
    ...(["tall_refrigerator", "tall_freezer", "tall_over_under", "wine_over_drawers", "undercounter_refrigerator"] as const),
    ...(["undercounter_beverage", "undercounter_wine", "undercounter_drawers", "ice_maker"] as const),
  ];
  const LINES: Array<{ line: RefrigerationLine; widths: Array<number | null>; external: boolean }> = [
    { line: "classic", widths: [null, 30, 36, 42, 48], external: true },
    { line: "built_in", widths: [null, 30, 36, 42, 48], external: true },
    { line: "designer", widths: [null, 15, 18, 24, 27, 30, 36], external: false },
    { line: "integrated", widths: [null, 18, 24, 27, 30, 36], external: false },
    { line: "pro", widths: [null, 36, 48], external: false },
    { line: null, widths: [null, 15], external: false },
  ];
  const DOORS = ["ref_door_ajar", "ref2_door_ajar", "frz_door_ajar", "wine_door_ajar", "wine2_door_ajar", "ice_door_ajar"];
  const READOUTS = { ref: "38°", ref2: "36°", frz: "-2°", crisp: "33°", wine: "55°", wine2: "100°" };

  it("draws every refrigeration form at every line and width", { timeout: 30_000 }, () => {
    const { found, count } = sweep(1, function* (random) {
      for (const form of FORMS) {
        for (const { line, widths, external } of LINES) {
          for (const width of widths) {
            for (const dispenser of external ? (["none", "external", "internal"] as const) : (["none", "internal"] as const)) {
              for (const open of ["shut", "open", "some"] as const) {
                const spec: RefrigerationSpec = {
                  family: "refrigeration",
                  form,
                  line,
                  width,
                  glass: random.next() < 0.4,
                  dispenser,
                  ice: random.next() < 0.6,
                  drawers:
                    form === "undercounter_drawers" || form === "wine_over_drawers"
                      ? random.pick(["refrigerator", "freezer", "combination"] as const)
                      : null,
                  zones: random.pick([0, 1, 2, 3, 4]),
                  outdoor: random.next() < 0.1,
                  generic: line === null,
                };
                const doors = Object.fromEntries(
                  DOORS.filter(() => open === "open" || (open === "some" && random.next() < 0.4)).map((key) => [key, true]),
                );
                const state: DrawingState = {
                  available: random.next() < 0.85,
                  doors,
                  readouts: random.pick<Record<string, string>>([READOUTS, {}, { ref: "3°", frz: "-18°" }, { wine: "12°", wine2: "7°" }]),
                  ice: random.pick([undefined, { on: false, mode: "off" }, { on: true, mode: "on" }, { on: true, mode: "max" }, { on: true, mode: "night" }]),
                  ice_maker: random.pick([undefined, { making: true, paused: false, cleaning: false }, { making: false, paused: true, cleaning: false }, { making: false, paused: false, cleaning: true }]),
                };
                yield { label: `refrigeration ${JSON.stringify({ ...spec, open })}`, input: { spec, appearance: appearance(random), state } };
              }
            }
          }
        }
      }
    });
    expect(found).toEqual([]);
    expect(count).toBeGreaterThan(2500);
  });

  // A model gives 30″ to 60″, its burners as any digit and its surfaces; a type gives a width or
  // none, with two ovens of unknown width when it reports a second cavity.
  const SURFACES: RangetopSurface[][] = [
    [],
    ["charbroiler"],
    ["griddle"],
    ["french_top"],
    ["charbroiler", "griddle"],
    ["charbroiler", "french_top"],
    ["griddle", "french_top"],
    ["double_griddle"],
    ["charbroiler", "charbroiler"],
  ];

  it("draws ranges of every fuel, width, rangetop and oven layout", { timeout: 30_000 }, () => {
    const { found, count } = sweep(2, function* (random) {
      for (const fuel of ["dual_fuel", "induction", "gas"] as const) {
        for (const width of [null, 30, 36, 48, 60]) {
          for (const burners of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]) {
            for (const surfaces of SURFACES) {
              const two = width === 48 || width === 60;
              const layouts: OvenSlot[][] = [
                two
                  ? [slot("cav2", "left", width === 48 ? 18 : 30), slot("cav", "right", 30)]
                  : [slot("cav", "single", width === 30 || width === 36 ? width : null)],
                // A range known only by its type: its cavities say how many ovens, not how wide.
                [slot("cav2", "left", null), slot("cav", "right", null)],
                [slot("cav", "single", null)],
              ];
              const spec: RangeSpec = {
                family: "range",
                form: "range",
                width,
                fuel,
                burners,
                surfaces,
                ovens: random.pick(layouts),
                style: random.pick(["professional", "transitional", null] as const),
                generic: random.next() < 0.3,
              };
              const state: DrawingState = {
                available: random.next() < 0.85,
                doors: {},
                readouts: {},
                ovens: ovens(random),
                display: random.pick([null, null, "4:12", "1:04:12"]),
              };
              yield { label: `range ${JSON.stringify(spec)}`, input: { spec, appearance: appearance(random), state } };
            }
          }
        }
      }
    });
    expect(found).toEqual([]);
    expect(count).toBeGreaterThan(1300);
  });

  // A model gives 24″, 30″ or 36″ with any series and style; the Appearance setting can turn a
  // single into a double (and back) without touching `ovens`, and override the style.
  it("draws wall ovens of every width, series, style and form", { timeout: 30_000 }, () => {
    const { found, count } = sweep(3, function* (random) {
      for (const form of ["single", "double"] as const) {
        for (const width of [null, 24, 30, 36]) {
          for (const series of ["l", "e", "m", null] as const) {
            for (const style of ["professional", "transitional", "contemporary", null] as const) {
              for (const knob of [false, true]) {
                for (const override of [null, "professional", "transitional", "contemporary"] as const) {
                  for (const shape of ["own", "other"] as const) {
                    const double = (form === "double") === (shape === "own");
                    const spec: WallOvenSpec = {
                      family: "wall_oven",
                      form,
                      width,
                      series,
                      style,
                      ovens: double ? [slot("cav", "upper", width), slot("cav2", "lower", width)] : [slot("cav", "single", width)],
                      knob,
                      generic: series === null,
                    };
                    const state: DrawingState = {
                      available: random.next() < 0.85,
                      doors: {},
                      readouts: {},
                      ovens: ovens(random),
                      display: random.pick([null, "12:34"]),
                    };
                    yield {
                      label: `wall oven ${JSON.stringify({ ...spec, override })}`,
                      input: { spec, appearance: { ...appearance(random), style: override }, state },
                    };
                  }
                }
              }
            }
          }
        }
      }
    });
    expect(found).toEqual([]);
    expect(count).toBeGreaterThan(2000);
  });

  // A hood's width is the first two digits of its model, whatever they are.
  it("draws hoods of every form, at any two-digit width", { timeout: 30_000 }, () => {
    const { found, count } = sweep(4, function* (random) {
      for (const form of ["wall", "island", "insert", "hood"] as const) {
        for (const width of [null, 10, 24, 30, 36, 42, 48, 54, 60, 66, 99]) {
          for (let round = 0; round < 24; round++) {
            const spec: HoodSpec = { family: "hood", form, width, generic: form === "hood" };
            const state: DrawingState = {
              available: random.next() < 0.85,
              doors: {},
              readouts: {},
              hood: random.pick([
                undefined,
                {
                  fan: random.pick([0, 1, 2, 3, 4]),
                  light: random.next() < 0.6,
                  brightness: random.pick([0, 1, 55, 100]),
                  kelvin: random.pick([null, 2700, 3500, 5000]),
                  halo: random.next() < 0.5,
                },
              ]),
            };
            yield { label: `hood ${JSON.stringify({ ...spec, hood: state.hood })}`, input: { spec, appearance: appearance(random), state } };
          }
        }
      }
    });
    expect(found).toEqual([]);
    expect(count).toBeGreaterThan(1000);
  });

  it("draws dishwashers in every finish and state", { timeout: 30_000 }, () => {
    const { found, count } = sweep(5, function* (random) {
      for (const width of [null, 24]) {
        for (const status of ["idle", "running", "paused", "canceling", "drying", "done", "delayed", "error"] as const) {
          for (const progress of [null, 0, 0.5, 1]) {
            for (const door_open of [false, true]) {
              for (let round = 0; round < 6; round++) {
                const state: DrawingState = {
                  available: random.next() < 0.85,
                  doors: random.next() < 0.2 ? { door_ajar: true } : {},
                  readouts: {},
                  dishwasher: {
                    status,
                    progress,
                    remote_ready: random.next() < 0.5,
                    door_open,
                    rinse_aid_low: random.next() < 0.5,
                    softener_low: random.next() < 0.5,
                    display: random.pick([null, "1:20"]),
                  },
                };
                yield {
                  label: `dishwasher ${JSON.stringify({ width, ...state.dishwasher })}`,
                  input: { spec: { family: "dishwasher", form: "dishwasher", width, front: null, generic: width === null }, appearance: appearance(random), state },
                };
              }
            }
          }
        }
      }
    });
    expect(found).toEqual([]);
    expect(count).toBeGreaterThan(700);
  });

  it("draws the generic forms, whatever state comes with them", { timeout: 30_000 }, () => {
    const { found, count } = sweep(6, function* (random) {
      for (const form of ["refrigerator", "wine", "ice_maker", "oven", "hood", "dishwasher", "appliance"] as const) {
        for (let round = 0; round < 60; round++) {
          const spec: GenericSpec = { family: "generic", form, width: null, generic: true };
          const state: DrawingState = {
            available: random.next() < 0.85,
            doors: Object.fromEntries([...DOORS, "door_ajar"].filter(() => random.next() < 0.3).map((key) => [key, true])),
            readouts: random.pick<Record<string, string>>([READOUTS, {}, { ref: "38°", frz: "0°" }]),
            ovens: ovens(random),
            display: random.pick([null, "9:59"]),
            hood: { fan: random.pick([0, 2, 4]), light: random.next() < 0.5, brightness: 60, kelvin: 3000, halo: true },
            ice_maker: { making: true, paused: false, cleaning: random.next() < 0.3 },
            dishwasher: random.pick([
              undefined,
              { status: "running", progress: 0.5, remote_ready: true, door_open: false, rinse_aid_low: true, softener_low: false, display: "1:20" } as const,
            ]),
          };
          yield { label: `generic ${form} ${JSON.stringify(state.doors)}`, input: { spec, appearance: appearance(random), state } };
        }
      }
    });
    expect(found).toEqual([]);
    expect(count).toBe(420);
  });
});

describe("the generic drawing of an appliance a detailed module would draw", () => {
  // renderGeneric is what a card falls back on when a detailed drawing fails, so it has to draw
  // every family's specs too.
  const specs: ApplianceSpec[] = [
    ...(["side_by_side", "french_door", "over_under", "column_wine", "undercounter_drawers", "ice_maker", "tall_freezer"] as const).flatMap(
      (form): ApplianceSpec[] =>
        [null, 15, 36, 48].map((width) => ({
          family: "refrigeration",
          form,
          line: null,
          width,
          glass: false,
          dispenser: "none",
          ice: false,
          drawers: null,
          zones: 1,
          outdoor: false,
          generic: true,
        })),
    ),
    ...[null, 30, 48, 60].flatMap((width): ApplianceSpec[] =>
      [[], [slot("cav2", "left", 18), slot("cav", "right", 30)], [slot("cav", "single", null)]].map((list) => ({
        family: "range",
        form: "range",
        width,
        fuel: "dual_fuel",
        burners: width === 48 ? 8 : 0,
        surfaces: [],
        ovens: list,
        style: null,
        generic: true,
      })),
    ),
    ...(["single", "double"] as const).flatMap((form): ApplianceSpec[] =>
      [null, 24, 36].map((width) => ({
        family: "wall_oven",
        form,
        width,
        series: null,
        style: null,
        ovens: form === "double" ? [slot("cav", "upper", width), slot("cav2", "lower", width)] : [],
        knob: false,
        generic: true,
      })),
    ),
    ...(["wall", "island", "insert", "hood"] as const).map((form): ApplianceSpec => ({ family: "hood", form, width: 42, generic: true })),
    { family: "dishwasher", form: "dishwasher", width: 24, front: null, generic: true },
  ];

  it("draws cleanly", () => {
    const random = seeded(7);
    const t = makeTranslate("en");
    const found: string[] = [];
    for (const [index, spec] of specs.entries()) {
      for (const available of [true, false]) {
        const uid = `sza${index}`;
        const state: DrawingState = {
          available,
          doors: random.next() < 0.5 ? { ref_door_ajar: true, frz_door_ajar: true, door_ajar: true } : {},
          readouts: { ref: "38°", frz: "0°", wine: "55°" },
          ovens: ovens(random),
          display: "9:59",
          hood: { fan: 2, light: true, brightness: 60, kelvin: 3000, halo: true },
          dishwasher: { status: "delayed", progress: null, remote_ready: true, door_open: false, rinse_aid_low: false, softener_low: false, display: "2:00" },
        };
        const markup = serialize(renderGeneric({ uid, spec, appearance: appearance(random), state, theme: "light", t }));
        for (const problem of problems(markup, uid)) found.push(`${spec.family} ${spec.form} ${spec.width}: ${problem}`);
      }
    }
    expect(found).toEqual([]);
  });
});

describe("the markup check", () => {
  // The check has to catch what it's for, or a clean sweep means nothing.
  const sound = `<svg viewBox="0 0 10 10"><defs><filter id="u1-blur"></filter></defs><rect width="4" height="4" filter="url(#u1-blur)" /></svg>`;

  it("passes sound markup", () => {
    expect(problems(sound, "u1")).toEqual([]);
  });

  it.each([
    ["NaN", sound.replace('width="4"', 'width="NaN"'), "NaN in the markup"],
    ["an empty number", sound.replace('width="4"', 'width=""'), "an empty width"],
    ["a negative size", sound.replace('height="4"', 'height="-2.5"'), "height of -2.5"],
    ["a repeated id", sound.replace("</defs>", '<filter id="u1-blur"></filter></defs>'), "id u1-blur twice"],
    ["a dangling reference", sound.replace("url(#u1-blur)", "url(#u1-glow)"), "#u1-glow isn't defined"],
    ["an id without the uid", sound.replaceAll("u1-blur", "blur"), "id blur without the uid"],
    ["a broken viewBox", sound.replace("0 0 10 10", "0 0 10"), 'a viewBox of "0 0 10"'],
  ])("finds %s", (_name, markup, finding) => {
    expect(problems(markup, "u1")).toContain(finding);
  });

  it("marks an attribute bound to undefined, which Lit writes as empty", () => {
    const template = { strings: ["<rect width=", " height=", " x=", " />"], values: [undefined, 4, null] };
    const markup = serialize(template);
    expect(problems(`<svg viewBox="0 0 1 1">${markup}</svg>`, "u1")).toContain("‹unset› in the markup");
  });
});
