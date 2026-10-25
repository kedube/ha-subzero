import { nothing, svg, type SVGTemplateResult } from "lit";
import type { KnobColor } from "../../types";
import type { OvenState } from "../types";
import { KNOB_ROW, type DoorSlot, type RangeLayout } from "./layout";
import { fade, KNOB_PALETTE, type Ids } from "./materials";

/*
 * The control panel as Wolf builds it: knobs in polished bezels (the bezels light up while in
 * use), and between the two oven knobs a stainless panel you press to tilt out the touchscreen.
 * The oven knobs show the temperature on a small display in the knob face.
 */

const FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif";
const round = (value: number) => Math.round(value * 100) / 100;

const KNOB_R = 11.6;
const BEZEL_R = 13.4;

export type Ovens = Partial<Record<"cav" | "cav2", OvenState>>;

function knob(
  ids: Ids,
  x: number,
  y: number,
  color: KnobColor,
  kind: "burner" | "surface" | "oven",
  oven: OvenState | null,
  reducedMotion: boolean,
): SVGTemplateResult {
  const palette = KNOB_PALETTE[color] ?? KNOB_PALETTE.red;
  const lit = !!oven?.on;
  // Wolf's knob face: a groove on the left and the fin's shaded edge right of center.
  const groove = KNOB_R * 0.58;
  const fin = KNOB_R * 0.44;
  const span = (offset: number) => Math.sqrt(KNOB_R * KNOB_R - offset * offset) - 0.35;
  const grooveHalf = span(groove);
  const half = span(fin);
  const crescent = 1.7;
  const cx = Math.sqrt(KNOB_R * KNOB_R - (crescent / 2) ** 2);
  const digits = (oven?.temp ?? "").replace(/[^0-9]/g, "") || "- - -";
  const arc = (r: number, from: number, to: number) => {
    const p = (deg: number) => [x + r * Math.cos((deg * Math.PI) / 180), y + r * Math.sin((deg * Math.PI) / 180)];
    const [x0, y0] = p(from);
    const [x1, y1] = p(to);
    return `M${round(x0)} ${round(y0)}A${r} ${r} 0 0 1 ${round(x1)} ${round(y1)}`;
  };
  const right = x + fin;
  return svg`
    <g>
      <circle cx=${x + 0.2} cy=${y + 0.6} r=${BEZEL_R + 0.2} fill="#000" opacity="0.06" filter=${ids.url("soft")} />
      ${
        kind === "oven"
          ? svg`<circle cx=${x} cy=${y} r=${BEZEL_R + 0.8} fill="none" stroke="#fff4df" stroke-width="2"
              filter=${ids.url("halo")} style=${fade(lit ? 0.95 : 0, reducedMotion)} />`
          : nothing
      }
      <circle cx=${x} cy=${y} r=${BEZEL_R} fill="#6f7173" />
      <circle cx=${x} cy=${y} r=${BEZEL_R - 0.4} fill=${ids.url("bezel")} />
      <circle cx=${x} cy=${y} r=${BEZEL_R - 0.95} fill=${ids.url("bezel-in")} />
      <path d=${arc(BEZEL_R - 0.65, 250, 290)} fill="none" stroke="#fff" stroke-opacity="0.5" stroke-width="0.4" stroke-linecap="round" />
      <circle cx=${x} cy=${y} r=${KNOB_R + 0.45} fill="#1b1617" />
      <circle cx=${x} cy=${y} r=${KNOB_R} fill=${ids.url("knob")} />
      <path d=${`M${round(x - cx)} ${round(y + crescent / 2)}A${KNOB_R} ${KNOB_R} 0 1 1 ${round(x + cx)} ${round(y + crescent / 2)}A${KNOB_R} ${KNOB_R} 0 0 0 ${round(x - cx)} ${round(y + crescent / 2)}Z`}
        fill=${palette.rim} opacity=${palette.rimOpacity} />
      <path d=${`M${round(x - groove)} ${round(y - grooveHalf)}Q${round(x - groove - 0.9)} ${y} ${round(x - groove)} ${round(y + grooveHalf)}`}
        fill="none" stroke=${palette.dark} stroke-width="0.6" stroke-opacity="0.85" />
      <path d=${`M${round(right - 0.4)} ${round(y - half)}Q${round(right + 0.5)} ${y} ${round(right - 0.4)} ${round(y + half)}L${round(right + 1.3)} ${round(y + half - 0.5)}Q${round(right + 2.2)} ${y} ${round(right + 1.3)} ${round(y - half + 0.5)}Z`}
        fill=${palette.edge} opacity="0.85" />
      <path d=${`M${round(right + 1.7)} ${round(y - half + 1)}Q${round(right + 2.6)} ${y} ${round(right + 1.7)} ${round(y + half - 1)}`}
        fill="none" stroke=${palette.light} stroke-width="0.7" stroke-opacity="0.45" />
      <ellipse cx=${x - 4} cy=${y - 5.6} rx="4.4" ry="2.1" transform=${`rotate(-30 ${x - 4} ${y - 5.6})`}
        fill="#fff" opacity=${palette.sheen} filter=${ids.url("halo")} />
      <circle cx=${x} cy=${y} r=${BEZEL_R} fill=${ids.url("falloff-knob")} />
      ${
        kind === "oven"
          ? svg`<g style=${fade(lit ? 1 : 0, reducedMotion)}>
              <rect x=${x - 5.6} y=${y - 8.6} width="11.2" height="4.6" rx="1" fill="#150607" opacity="0.92" />
              <text x=${x} y=${y - 4.95} text-anchor="middle" font-family=${FONT} font-size="3.6" font-weight="700"
                letter-spacing="0.2" fill="#ff5a3c" filter=${ids.url("halo")}>${digits}</text>
              <text x=${x} y=${y - 4.95} text-anchor="middle" font-family=${FONT} font-size="3.6" font-weight="700"
                letter-spacing="0.2" fill="#ff8a66">${digits}</text>
            </g>`
          : nothing
      }
      <circle cx=${x} cy=${y - 17} r="0.65" fill="#2d2e2f" />
      ${
        kind === "oven"
          ? nothing
          : // The burner's status light: an empty mark over a filled one, in a small frame.
            svg`<rect x=${x + 12.3} y=${y + 14.1} width="2.1" height="3.6" rx="0.45" fill="none" stroke="#5c5f62" stroke-width="0.32" />
              <circle cx=${x + 13.35} cy=${y + 15.05} r="0.42" fill="none" stroke="#55585b" stroke-width="0.25" />
              <circle cx=${x + 13.35} cy=${y + 16.75} r="0.45" fill="#484b4e" />`
      }
    </g>
  `;
}

const UPPER = (text: string, max: number) => {
  const value = text.toUpperCase();
  return value.length > max ? `${value.slice(0, max - 1)}…` : value;
};

interface Block {
  slot: DoorSlot;
  state: OvenState | null;
}

/** One cavity's status on the touchscreen: mode, temperature, preheat, probe, Remote Ready. */
function statusBlock(ids: Ids, block: Block, bx: number, bw: number, y0: number, h: number): SVGTemplateResult {
  const state = block.state;
  const active = !!state && (state.on || state.self_clean);
  if (!active) {
    return svg`
      <text x=${bx} y=${y0 + h * 0.56} text-anchor="middle" font-family=${FONT} font-size="3" fill="#6f777f"
        letter-spacing="0.3">OFF</text>
      ${state?.remote_ready ? remoteIcon(bx, y0 + h * 0.3, "#9fb3c8") : nothing}
    `;
  }
  const preheating = !state.self_clean && !state.preheated && state.progress !== null;
  const status = state.self_clean
    ? "SELF CLEAN"
    : state.preheated
      ? "PREHEATED"
      : preheating
        ? `PREHEATING ${Math.round((state.progress ?? 0) * 100)}%`
        : "HEATING";
  const icons: SVGTemplateResult[] = [];
  if (state.probe) icons.push(probeIcon(0, 0));
  if (state.remote_ready) icons.push(remoteIcon(0, 0, "#ffffff"));
  if (state.self_clean) icons.push(lockIcon(0, 0));
  const spacing = 4.2;
  const iconsX = bx - ((icons.length - 1) * spacing) / 2;
  const track = Math.min(bw * 0.62, 20);
  return svg`
    <rect x=${bx - bw / 2} y=${y0 + h * 0.31} width=${bw} height=${h * 0.36} fill=${ids.url("band")} opacity="0.62" />
    ${icons.map(
      (icon, index) => svg`<g transform=${`translate(${round(iconsX + index * spacing)} ${round(y0 + h * 0.24)})`}>${icon}</g>`,
    )}
    <text x=${bx} y=${y0 + h * 0.43} text-anchor="middle" font-family=${FONT} font-size="2.9" font-weight="600"
      letter-spacing="0.25" fill="#ffffff">${UPPER(state.self_clean ? "Clean" : (state.mode ?? ""), 12)}</text>
    <text x=${bx} y=${y0 + h * 0.63} text-anchor="middle" font-family=${FONT} font-size="5.4" font-weight="300"
      fill="#ffffff">${state.temp ?? ""}</text>
    <text x=${bx} y=${y0 + h * 0.75} text-anchor="middle" font-family=${FONT} font-size="1.85" letter-spacing="0.2"
      fill=${state.preheated ? "#ff6b6b" : "#c9ced3"}>${status}</text>
    ${
      preheating
        ? svg`<rect x=${bx - track / 2} y=${y0 + h * 0.79} width=${track} height="0.7" rx="0.35" fill="#30353b" />
            <rect x=${bx - track / 2} y=${y0 + h * 0.79} width=${round(track * Math.min(1, Math.max(0, state.progress ?? 0)))}
              height="0.7" rx="0.35" fill="#e3343d" />`
        : nothing
    }
  `;
}

function probeIcon(x: number, y: number): SVGTemplateResult {
  return svg`<g transform=${`translate(${x} ${y})`}>
    <line x1="-1.2" y1="1.2" x2="1" y2="-1" stroke="#ffffff" stroke-width="0.45" stroke-linecap="round" />
    <circle cx="-1.3" cy="1.3" r="0.6" fill="#ffffff" />
  </g>`;
}

function remoteIcon(x: number, y: number, color: string): SVGTemplateResult {
  return svg`<g transform=${`translate(${x} ${y})`} fill="none" stroke=${color} stroke-width="0.35" stroke-linecap="round">
    <path d="M-1.9 -0.4A2.7 2.7 0 0 1 1.9 -0.4" />
    <path d="M-1.15 0.35A1.6 1.6 0 0 1 1.15 0.35" />
    <circle cx="0" cy="1.1" r="0.35" fill=${color} stroke="none" />
  </g>`;
}

function lockIcon(x: number, y: number): SVGTemplateResult {
  return svg`<g transform=${`translate(${x} ${y})`}>
    <path d="M-0.8 -0.2V-0.9A0.8 0.8 0 0 1 0.8 -0.9V-0.2" fill="none" stroke="#ffffff" stroke-width="0.35" />
    <rect x="-1.2" y="-0.3" width="2.4" height="1.8" rx="0.3" fill="#ffffff" />
  </g>`;
}

/** The touchscreen's home screen while something is going on. */
function screenUi(
  ids: Ids,
  doors: DoorSlot[],
  ovens: Ovens,
  display: string | null,
  x0: number,
  y0: number,
  w: number,
  h: number,
): SVGTemplateResult {
  const blocks: Block[] = doors.map((slot) => ({ slot, state: ovens[slot.slot.prefix] ?? null }));
  const bw = w / blocks.length;
  const keys = blocks.length > 1 ? ["TIMER 1", "LIGHT", "LIGHT", "TIMER 2"] : ["TIMER 1", "LIGHT", "TIMER 2"];
  const lightOn = (index: number) => {
    const block = blocks.length > 1 ? blocks[index - 1] : blocks[0];
    return !!block?.state?.light;
  };
  return svg`
    <text x=${x0 + w * 0.07} y=${y0 + h * 0.15} font-family=${FONT} font-size="1.9" letter-spacing="0.2" fill="#8c949c">LOCK</text>
    <text x=${x0 + w * 0.93} y=${y0 + h * 0.15} text-anchor="end" font-family=${FONT} font-size="1.9" letter-spacing="0.2"
      fill="#8c949c">SETTINGS</text>
    ${
      display
        ? svg`<circle cx=${x0 + w / 2 - 5.2} cy=${y0 + h * 0.13 - 0.55} r="1.05" fill="none" stroke="#ffffff" stroke-width="0.32" />
            <path d=${`M${x0 + w / 2 - 5.2} ${y0 + h * 0.13 - 1.2}V${y0 + h * 0.13 - 0.55}H${x0 + w / 2 - 4.7}`}
              fill="none" stroke="#ffffff" stroke-width="0.28" />
            <text x=${x0 + w / 2 + 0.8} y=${y0 + h * 0.15} text-anchor="middle" font-family=${FONT} font-size="2.6"
              font-weight="600" fill="#ffffff">${display}</text>`
        : nothing
    }
    ${blocks.map((block, index) => statusBlock(ids, block, x0 + bw * (index + 0.5), bw * 0.92, y0, h))}
    ${keys.map((key, index) => {
      const kx = x0 + (w * (index + 0.5)) / keys.length;
      const timer = index === 0 && !!display;
      const bright = timer || (key === "LIGHT" && lightOn(index));
      return svg`
        <text x=${kx} y=${y0 + h * 0.93} text-anchor="middle" font-family=${FONT} font-size="1.8" letter-spacing="0.15"
          fill=${bright ? "#ffffff" : "#8c949c"}>${timer ? display : key}</text>
        ${timer ? svg`<rect x=${kx - 3.2} y=${y0 + h * 0.95} width="6.4" height="0.45" fill="#e3343d" />` : nothing}
      `;
    })}
  `;
}

/** Whether the touchscreen is out: while a cavity is on, a timer runs, or a feature is active. */
export function screenActive(ovens: Ovens, display: string | null): boolean {
  if (display) return true;
  return Object.values(ovens).some(
    (oven) => !!oven && (oven.on || oven.self_clean || oven.probe || oven.remote_ready),
  );
}

function touchscreen(
  layout: RangeLayout,
  ids: Ids,
  x: number,
  y: number,
  open: boolean,
  ovens: Ovens,
  display: string | null,
): SVGTemplateResult {
  const ow = 59;
  const oh = 38.5;
  const fx0 = x - ow / 2;
  const fy0 = y - oh / 2;
  const fx1 = x + ow / 2;
  const fy1 = y + oh / 2;
  const b = 2.6;
  const ix0 = fx0 + b;
  const iy0 = fy0 + b;
  const ix1 = fx1 - b;
  const iy1 = fy1 - b;
  // The frame's bevels as both photos show them: the top and bottom catch the light, the sides
  // mirror the dark room.
  const frame = svg`
    <path d=${`M${fx0} ${fy0}H${fx1}L${ix1} ${iy0}H${ix0}Z`} fill="#b4b5b6" />
    <path d=${`M${fx0} ${fy0}L${ix0} ${iy0}V${iy1}L${fx0} ${fy1}Z`} fill="#7e7f80" />
    <path d=${`M${fx1} ${fy0}V${fy1}L${ix1} ${iy1}V${iy0}Z`} fill="#87888a" />
    <path d=${`M${fx0} ${fy1}H${fx1}L${ix1} ${iy1}H${ix0}Z`} fill="#cfd0d1" />
    <rect x=${fx0} y=${fy0} width=${ow} height=${oh} fill="none" stroke="#f2f3f4" stroke-opacity="0.8" stroke-width="0.4" />
  `;
  if (!open) {
    return svg`
      ${frame}
      <rect x=${ix0} y=${iy0} width=${ix1 - ix0} height=${iy1 - iy0} fill="#1c1d1e" />
      <rect x=${ix0 + 0.8} y=${iy0 + 0.8} width=${ix1 - ix0 - 1.6} height=${iy1 - iy0 - 1.6} fill=${ids.url("ss-cover")} />
      <rect x=${ix0 + 0.8} y=${iy0 + 0.8} width=${ix1 - ix0 - 1.6} height=${iy1 - iy0 - 1.6} fill=${ids.url("shade-door")} />
      <rect x=${ix0 + 0.8} y=${iy0 + 0.8} width=${ix1 - ix0 - 1.6} height=${iy1 - iy0 - 1.6} fill=${ids.url("grain")} opacity="0.6" />
      <path transform=${`translate(${x} ${iy0 + 5.6}) scale(0.42)`} fill="#888b8e" opacity="0.85"
        d="M-0.9 -4.6a0.9 0.9 0 0 1 1.8 0V-0.7l2.3 0.5a1 1 0 0 1 0.8 1.1l-0.5 3.3a1.2 1.2 0 0 1-1.2 1H-1.1a1.2 1.2 0 0 1-1.1-0.7l-1.7-3.1a0.8 0.8 0 0 1 1.2-1l0.8 0.8Z" />
    `;
  }
  // Tilted out: the screen's lower edge comes forward, so it reads a little wider at the
  // bottom and overlaps the frame, with a shadow on the panel below it.
  const sx0 = ix0 + 1.4;
  const sx1 = ix1 - 1.4;
  const sy0 = iy0 + 1.6;
  const sy1 = iy1 + 2.6;
  const screen = `M${sx0} ${sy0}H${sx1}L${sx1 + 1.8} ${sy1}H${sx0 - 1.8}Z`;
  const clip = ids.id("screen-clip");
  return svg`
    ${frame}
    <rect x=${ix0} y=${iy0} width=${ix1 - ix0} height=${iy1 - iy0} fill="#08090a" />
    <ellipse cx=${x} cy=${sy1 + 2.6} rx=${(sx1 - sx0) / 2 + 2} ry="2.2" fill="#000" opacity="0.35" filter=${ids.url("soft")} />
    <path d=${`M${sx0 - 1.8} ${sy1}H${sx1 + 1.8}L${sx1 + 1.6} ${sy1 + 1.2}H${sx0 - 1.6}Z`} fill="#c3c5c7" />
    <clipPath id=${clip}><path d=${screen} /></clipPath>
    <path d=${screen} fill=${ids.url("screen")} />
    <g clip-path=${`url(#${clip})`}>
      ${screenUi(ids, layout.doors, ovens, display, sx0, sy0, sx1 - sx0, sy1 - sy0)}
      <path d=${screen} fill=${ids.url("sheen")} />
    </g>
    <path d=${screen} fill="none" stroke="#3a3d41" stroke-width="0.35" />
  `;
}

/** The knob row and, on dual fuel ranges, the touchscreen panel. */
export function controlPanel(
  layout: RangeLayout,
  ids: Ids,
  color: KnobColor,
  ovens: Ovens,
  display: string | null,
  reducedMotion: boolean,
): SVGTemplateResult {
  const y = layout.floorY - KNOB_ROW;
  return svg`
    ${
      layout.panelX === null
        ? nothing
        : touchscreen(layout, ids, layout.panelX, y, screenActive(ovens, display), ovens, display)
    }
    ${layout.knobs.map((slot) =>
      knob(ids, slot.x, y, color, slot.kind, slot.oven ? (ovens[slot.oven] ?? null) : null, reducedMotion),
    )}
  `;
}
