import { html, nothing, svg, type SVGTemplateResult } from "lit";
import type { OvenSlot, WallOvenSpec } from "../types";
import type { DrawingInput, DrawingRenderer, OvenState } from "./types";
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
  VENT_OPENINGS,
  WIDTH,
  doorDesign,
  ovenLayout,
  type OvenLayout,
  type OvenSeries,
  type OvenStyle,
} from "./wall-oven/layout";
import {
  clamp,
  contactShadow,
  materialDefs,
  materialIds,
  round,
  url,
  type Materials,
  type MetalFinish,
} from "./wall-oven/materials";
import { panelDetails, type ScreenCavity } from "./wall-oven/panel";
import { labelScale, ovenReadout, readout, type Zone } from "./wall-oven/readouts";

/** An open door drops almost flat, as in Wolf's open-door photos, so the whole cavity shows. */
const OPEN_ANGLE = (88 * Math.PI) / 180;
const MARGIN = { x: 8, top: 4, bottom: 16 };

/**
 * Wolf 30″ built-in ovens, single and double: M Series Professional (knobs either side of the
 * touchscreen, Professional handle, beveled window), Transitional (black glass in a stainless
 * frame, slim handle) and Contemporary (black glass, stainless pull strip), and E Series
 * Professional and Transitional (touch legends beside the screen). The L Series is drawn as an E.
 */
export const renderWallOven: DrawingRenderer = (input) => {
  const spec = input.spec;
  if (spec.family !== "wall_oven") return null;
  const double = spec.form === "double";
  const style: OvenStyle = input.appearance.style ?? spec.style ?? "professional";
  const series: OvenSeries = spec.series === "m" || spec.series === null ? "m" : "e";
  const finish = metalFinish(input.appearance.finish);
  const layout = ovenLayout(double);
  const slots = ovenSlots(spec, double);
  const m = materialIds(input.uid);
  const design = doorDesign(style, series);
  const reducedMotion = input.reducedMotion ?? false;

  const cavities: ScreenCavity[] = slots.map((slot) => ({
    position: slot.position === "lower" ? "lower" : slot.position === "upper" ? "upper" : "single",
    oven: input.state.ovens?.[slot.prefix] ?? OFF,
  }));
  const doors = layout.doors.map((span, index) => {
    const oven = cavities[index]?.oven ?? OFF;
    const options: DoorOptions = {
      m,
      map: oven.door_open
        ? openDoor(0, span.top, span.height, OPEN_ANGLE, doorCamera(span.top))
        : shutDoor(0, span.top),
      design,
      style,
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
  const viewBox = [-MARGIN.x, -MARGIN.top, round(WIDTH + MARGIN.x * 2), viewHeight].join(" ");
  const available = input.state.available;
  const label = ariaLabel(double, cavities, available);
  const knobs = style === "professional" && (series === "m" || spec.knob);
  const scale = labelScale(viewHeight, input.pixelHeight);
  const readouts = available
    ? doors.flatMap((door, index) => {
        const content = ovenReadout(cavities[index]?.oven ?? OFF);
        return content ? [readout(m, readoutZone(door), content, scale, reducedMotion)] : [];
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
        width: WIDTH,
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
      ${contactShadow(m, WIDTH / 2, bottom + 3, WIDTH * 0.56, 8, input.theme)}
      <g filter=${available ? nothing : url(m.offline)}>
        <g filter=${url(m.grain)}>
          <rect x="0" y="0" width=${WIDTH} height=${PANEL_HEIGHT} fill=${url(m.metal)} />
          <rect x="0" y="0" width=${WIDTH} height=${PANEL_HEIGHT} fill=${url(m.sheen)} />
          ${doors.filter((door) => door.map.shut).map((door) => doorBase(door))}
          <rect x="0" y=${round(layout.vent.top)} width=${WIDTH} height=${round(layout.vent.height)}
            fill=${url(m.metal)} />
        </g>
        ${reveals(layout)}
        ${panelDetails({
          m,
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
        ${open.map((door) => openCavity(m, door.top, door.height, door.look, door.key))}
        ${open.map((door) => droppedDoor(door))}
      </g>
      ${readouts}
    `}
  </svg>`;
};

/** A cavity's readout sits over its window, or over the opening while its door is down. */
function readoutZone(door: DoorOptions): Zone {
  if (!door.map.shut) return openingRect(door.top, door.height);
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
function doorCamera(doorTop: number): Camera {
  return { cx: WIDTH / 2, cy: doorTop - 110, d: 2200 };
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

/**
 * The window glows from inside while the cavity heats, warmer as preheating nears the setpoint,
 * and shows the lit interior when the light is on. Wolf lights the cavity when its door opens.
 */
function cavityLook(oven: OvenState): CavityLook {
  let heat = 0;
  if (oven.on) {
    if (oven.self_clean || oven.preheated) heat = 1;
    else if (oven.progress === null) heat = 0.6;
    else heat = 0.25 + 0.75 * clamp(oven.progress);
  }
  return {
    lamp: oven.light || oven.door_open ? 1 : 0,
    heat,
    selfClean: oven.on && oven.self_clean,
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
      <rect x="0" y=${round(gap.top)} width=${WIDTH} height=${round(Math.max(gap.height, PANEL_GAP))}
        fill="#161718" />
      <line x1="0" y1=${round(gap.top - 0.3)} x2=${WIDTH} y2=${round(gap.top - 0.3)} stroke="#000"
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
  const [[a0, a1], [b0, b1]] = VENT_OPENINGS;
  const rows: Array<[number, number]> = [
    [lip + 0.6, 2.7],
    [lip + 3.9, 2.9],
  ];
  const block = (x0: number, x1: number, y: number, height: number, fill: string) =>
    svg`<rect x=${round(x0)} y=${round(y)} width=${round(x1 - x0)} height=${round(height)} fill=${fill} />`;
  return svg`
    ${block(8, WIDTH - 8, top, 2, "#0b0b0c")}
    ${block(0, 8, top, 2, "#8e9092")}
    ${block(WIDTH - 8, WIDTH, top, 2, "#8e9092")}
    <rect x="0" y=${round(lip)} width=${WIDTH} height="0.6" fill="#f2f2f2" opacity="0.85" />
    ${block(0, a0 + 2, lip + 0.6, 6.2, "#8e9092")}
    ${block(b1 - 2, WIDTH, lip + 0.6, 6.2, "#8e9092")}
    ${block(a1 - 2, b0 + 2, lip + 0.6, 3.1, "#a3a5a7")}
    ${block(a1 - 2, b0 + 2, lip + 3.7, 3.1, "#8b8d8f")}
    ${VENT_OPENINGS.map(([x0, x1]) =>
      rows.map(
        ([y, height]) => svg`<rect x=${x0} y=${round(y)} width=${round(x1 - x0)} height=${height}
          rx=${height / 2} fill="#0b0b0c" />`,
      ),
    )}
    <rect x="0" y=${round(lip + 3.3)} width=${WIDTH} height="0.6" fill="#f4f4f4" opacity="0.9" />
    <line x1="0" y1=${round(lip + 7)} x2=${WIDTH} y2=${round(lip + 7)} stroke="#fff" stroke-width="0.5"
      opacity="0.5" />
    <rect x="0" y=${round(lip + 6.8)} width=${WIDTH} height=${round(bottom - lip - 6.8)} fill=${url(m.chrome)}
      opacity="0.35" />
    <line x1="0" y1=${round(bottom - 0.4)} x2=${WIDTH} y2=${round(bottom - 0.4)} stroke="#000"
      stroke-width="0.8" opacity="0.4" />
  `;
}

function ariaLabel(double: boolean, cavities: ScreenCavity[], available: boolean): string {
  const parts = [double ? "Double wall oven" : "Wall oven"];
  for (const { position, oven } of cavities) {
    const name = position === "single" ? "" : `${position} oven `;
    if (oven.on && oven.self_clean) parts.push(`${name}self-cleaning`);
    else if (oven.on && oven.preheated) parts.push(`${name}preheated`);
    else if (oven.on && oven.progress !== null && oven.progress < 1) parts.push(`${name}preheating`);
    else if (oven.on) parts.push(`${name}on`);
    if (oven.door_open) parts.push(`${name}door open`);
    else if (oven.light) parts.push(`${name}light on`);
  }
  if (!available) parts.push("offline");
  return parts.join(", ");
}
