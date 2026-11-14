import { html, nothing, svg, type SVGTemplateResult } from "lit";
import type { OvenSlot, WallOvenSpec } from "../types";
import { Ids, round } from "./materials-core";
import { isSelfCleaning, ovenHeat, ovenReadout, ovenWords, type HeatScale } from "./oven-state";
import { labelScale, zoneReadout, type Zone } from "./overlay";
import type { DrawingInput, DrawingRenderer, OvenState } from "./types";
import { spoken } from "./words";
import {
  doorBase,
  doorDetails,
  droppedDoor,
  droppedExtent,
  openCavity,
  openDoor,
  openingRect,
  shutDoor,
  type Camera,
  type CavityLook,
  type DoorOptions,
} from "./wall-oven/door";
import {
  PANEL_GAP,
  PANEL_HEIGHT,
  doorDesign,
  hasKnobs,
  ovenLayout,
  ovenStyle,
  ovenWidth,
  ventOpenings,
  type OvenLayout,
  type OvenSeries,
  type OvenStyle,
} from "./wall-oven/layout";
import {
  contactShadow,
  materialDefs,
  materialIds,
  url,
  type Materials,
  type MetalFinish,
} from "./wall-oven/materials";
import { panelDetails, type ScreenCavity } from "./wall-oven/panel";

/** An open door drops almost flat, as in Wolf's open-door photos, so the whole cavity shows. */
const OPEN_ANGLE = (88 * Math.PI) / 180;
const MARGIN = { x: 8, top: 4, bottom: 16 };

/**
 * Wolf built-in ovens, single and double: M Series Professional (knobs either side of the
 * touchscreen, Professional handle, beveled window), Transitional (black glass in a stainless
 * frame, slim handle) and Contemporary (black glass, stainless pull strip), and E Series
 * Professional and Transitional (touch legends beside the screen). The L Series is drawn as an E.
 * They're measured on the 30″ ovens; a 24″ or 36″ one (a steam or speed oven, the 36″ L Series)
 * is drawn that much narrower or wider.
 */
export const renderWallOven: DrawingRenderer = (input) => {
  const spec = input.spec;
  if (spec.family !== "wall_oven") return null;
  const double = spec.form === "double";
  const style: OvenStyle = ovenStyle(spec, input.appearance);
  const series: OvenSeries = spec.series === "m" || spec.series === null ? "m" : "e";
  const finish = metalFinish(input.appearance.finish);
  const slots = ovenSlots(spec, double);
  const width = ovenWidth(spec.width ?? slots[0].width);
  const layout = ovenLayout(double, width);
  const m = materialIds(new Ids(input.uid));
  const design = doorDesign(style, series, width);
  const reducedMotion = input.reducedMotion ?? false;

  const cavities: ScreenCavity[] = slots.map((slot) => ({
    position: cavityPosition(slot),
    oven: input.state.ovens?.[slot.prefix] ?? OFF,
  }));
  const doors = layout.doors.map((span, index) => {
    const oven = cavities[index]?.oven ?? OFF;
    const options: DoorOptions = {
      m,
      map: oven.door_open
        ? openDoor(0, span.top, span.height, OPEN_ANGLE, doorCamera(span.top, width))
        : shutDoor(0, span.top),
      design,
      style,
      width,
      height: span.height,
      look: cavityLook(oven),
      top: span.top,
      key: String(index),
    };
    return options;
  });
  const open = doors.filter((door) => !door.map.shut);

  // A dropped door's handle hangs below the oven; the drawing grows to hold it, as the
  // refrigerators' do for a swung door.
  const bottom = Math.max(layout.height, ...open.map(droppedExtent));
  const viewHeight = round(bottom + MARGIN.top + MARGIN.bottom);
  const viewBox = [-MARGIN.x, -MARGIN.top, round(width + MARGIN.x * 2), viewHeight].join(" ");
  const available = input.state.available;
  const label = ariaLabel(input, double, slots);
  const knobs = hasKnobs(spec, input.appearance);
  const scale = labelScale(viewHeight, input.pixelHeight);
  // The wall ovens round what they write, their readouts' places included.
  const pills = { shadow: url(m.pillShadow), fix: round };
  const readouts = available
    ? doors.flatMap((door, index) => {
        const content = ovenReadout(cavities[index]?.oven ?? OFF);
        return content ? [zoneReadout(pills, readoutZone(door), content, scale, reducedMotion)] : [];
      })
    : [];

  return html`<svg
    viewBox=${viewBox}
    role="img"
    aria-label=${label}
    style="overflow: visible"
  >
    ${svg`
      <defs>${materialDefs(m, {
        finish,
        knobs: input.appearance.knobs,
        x: 0,
        y: 0,
        width,
        height: layout.height,
        parts: {
          // The charcoal glass fills a Professional's window and sits behind every framed screen.
          glass: style === "professional" || (style === "transitional" && series === "e"),
          blackGlass: style !== "professional",
          caps: design.handle.kind === "pro",
          knob: knobs,
          bezel: knobs,
          bevel: design.bevel > 0,
          recess: design.recess > 0,
          dropShadow: design.handle.kind === "pro" || open.length > 0,
          fineBlur: design.handle.kind === "slim",
          pills: readouts.length > 0,
          offline: !available,
        },
      })}</defs>
      ${contactShadow(m, width / 2, bottom + 3, width * 0.56, 8, input.theme)}
      <g filter=${available ? nothing : url(m.offline)}>
        <g filter=${url(m.grain)}>
          <rect x="0" y="0" width=${width} height=${PANEL_HEIGHT} fill=${url(m.metal)} />
          <rect x="0" y="0" width=${width} height=${PANEL_HEIGHT} fill=${url(m.sheen)} />
          ${doors.filter((door) => door.map.shut).map((door) => doorBase(door))}
          <rect x="0" y=${round(layout.vent.top)} width=${width} height=${round(layout.vent.height)}
            fill=${url(m.metal)} />
        </g>
        ${reveals(layout)}
        ${panelDetails({
          m,
          width,
          darkFinish: finish !== "stainless",
          style,
          series,
          double,
          knobs,
          cavities,
          display: input.state.display ?? null,
          reducedMotion,
          unitsPerPixel: input.pixelHeight ? viewHeight / input.pixelHeight : null,
        })}
        ${doors.map((door) => (door.map.shut ? doorDetails(door) : nothing))}
        ${vent(m, layout)}
        ${open.map((door) => openCavity(door))}
        ${open.map((door) => droppedDoor(door))}
      </g>
      ${readouts}
    `}
  </svg>`;
};

/** A wall oven's cavities are upper and lower, or the only one. */
function cavityPosition(slot: OvenSlot): ScreenCavity["position"] {
  return slot.position === "lower" ? "lower" : slot.position === "upper" ? "upper" : "single";
}

/** A cavity's readout sits over its window, or over the opening while its door is down. */
function readoutZone(door: DoorOptions): Zone {
  if (!door.map.shut) return openingRect(door.top, door.height, door.width);
  const w = door.design.window;
  return { x0: w.u0, y0: door.top + w.v0, x1: w.u1, y1: door.top + w.v1 };
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

/**
 * A dropped door is seen from a little above the oven, far enough back that it doesn't sprawl
 * past the oven's sides, and high enough that its inner glass shows, as in the photos.
 */
function doorCamera(doorTop: number, width: number): Camera {
  return { cx: width / 2, cy: doorTop - 110, d: 2200 };
}

function metalFinish(finish: DrawingInput["appearance"]["finish"]): MetalFinish {
  return finish === "black" || finish === "carbon" ? finish : "stainless";
}

/** The cavities top to bottom, from the spec, or the usual one or two when it has none. */
function ovenSlots(spec: WallOvenSpec, double: boolean): OvenSlot[] {
  if (spec.ovens.length === (double ? 2 : 1)) return spec.ovens;
  return double
    ? [
        { prefix: "cav", position: "upper", width: null },
        { prefix: "cav2", position: "lower", width: null },
      ]
    : [{ prefix: "cav", position: "single", width: null }];
}

/** The window's glow: warmer as preheating nears the setpoint, full once there and in self-clean. */
const HEAT: HeatScale = { clean: 1, preheated: 1, start: 0.25, span: 0.75, unknown: 0.6 };

/**
 * The window glows from inside while the cavity heats, and shows the lit interior when the light
 * is on. Wolf lights the cavity when its door opens.
 */
function cavityLook(oven: OvenState): CavityLook {
  return {
    lamp: oven.light || oven.door_open ? 1 : 0,
    heat: ovenHeat(oven, HEAT),
    selfClean: isSelfCleaning(oven),
    probe: oven.probe,
  };
}

/** The dark reveals between the panel and the doors, each with the lower edge's highlight. */
function reveals(layout: OvenLayout): SVGTemplateResult {
  const gaps = layout.doors.map((door, index) => {
    const above = layout.doors[index - 1];
    const top = above ? above.top + above.height : PANEL_HEIGHT;
    return { top, height: door.top - top };
  });
  return svg`${gaps.map(
    (gap) => svg`
      <rect x="0" y=${round(gap.top)} width=${layout.width} height=${round(Math.max(gap.height, PANEL_GAP))}
        fill="#161718" />
      <line x1="0" y1=${round(gap.top - 0.3)} x2=${layout.width} y2=${round(gap.top - 0.3)} stroke="#000"
        stroke-width="0.6" opacity="0.25" />`,
  )}`;
}

/**
 * The bottom vent, as the photos show it: a dark reveal under the door, a polished lip, then two
 * louvered openings either side of a shaped center divider, each a pair of round-ended slots split
 * by a bright bar. The divider and the end pieces sit back in shadow.
 */
function vent(m: Materials, layout: OvenLayout): SVGTemplateResult {
  const top = layout.vent.top;
  const bottom = layout.height;
  const lip = top + 2;
  const width = layout.width;
  const openings = ventOpenings(width);
  const [[a0, a1], [b0, b1]] = openings;
  const rows: Array<[number, number]> = [
    [lip + 0.6, 2.7],
    [lip + 3.9, 2.9],
  ];
  const block = (x0: number, x1: number, y: number, height: number, fill: string) =>
    svg`<rect x=${round(x0)} y=${round(y)} width=${round(x1 - x0)} height=${round(height)} fill=${fill} />`;
  return svg`
    ${block(8, width - 8, top, 2, "#0b0b0c")}
    ${block(0, 8, top, 2, "#8e9092")}
    ${block(width - 8, width, top, 2, "#8e9092")}
    <rect x="0" y=${round(lip)} width=${width} height="0.6" fill="#f2f2f2" opacity="0.85" />
    ${block(0, a0 + 2, lip + 0.6, 6.2, "#8e9092")}
    ${block(b1 - 2, width, lip + 0.6, 6.2, "#8e9092")}
    ${block(a1 - 2, b0 + 2, lip + 0.6, 3.1, "#a3a5a7")}
    ${block(a1 - 2, b0 + 2, lip + 3.7, 3.1, "#8b8d8f")}
    ${openings.map(([x0, x1]) =>
      rows.map(
        ([y, height]) => svg`<rect x=${round(x0)} y=${round(y)} width=${round(x1 - x0)} height=${height}
          rx=${height / 2} fill="#0b0b0c" />`,
      ),
    )}
    <rect x="0" y=${round(lip + 3.3)} width=${width} height="0.6" fill="#f4f4f4" opacity="0.9" />
    <line x1="0" y1=${round(lip + 7)} x2=${width} y2=${round(lip + 7)} stroke="#fff" stroke-width="0.5"
      opacity="0.5" />
    <rect x="0" y=${round(lip + 6.8)} width=${width} height=${round(bottom - lip - 6.8)} fill=${url(m.chrome)}
      opacity="0.35" />
    <line x1="0" y1=${round(bottom - 0.4)} x2=${width} y2=${round(bottom - 0.4)} stroke="#000"
      stroke-width="0.8" opacity="0.4" />
  `;
}

/**
 * What the drawing shows, for screen readers, in the range's words, e.g. "Double wall oven,
 * upper oven: preheated 350°, lower oven: off".
 */
function ariaLabel(input: DrawingInput, double: boolean, slots: OvenSlot[]): string {
  const { t, state } = input;
  const ovens = slots.map((slot) => ({ position: cavityPosition(slot), state: state.ovens?.[slot.prefix] }));
  return spoken(t, [
    t(double ? "drawing.wall_oven_double" : "drawing.wall_oven"),
    state.available ? null : t("drawing.offline"),
    ...ovenWords(t, ovens, state.display),
  ]);
}
