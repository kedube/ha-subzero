import { nothing, svg, type SVGTemplateResult } from "lit";
import type { RangeLayout } from "./layout";
import { floorShadow, type Ids } from "./materials";

/*
 * The range's body around the doors: feet and floor shadow, the recessed toe-kick panel and the
 * kick plate, the induction storage drawer, and the band above the doors (control panel and
 * front rail, or the induction front trim). The gaps between parts are dark reveals with thin
 * lit edges.
 */

/** A stainless band: base gradient, its shading, the brushed grain and a lit top edge. */
function band(
  ids: Ids,
  x: number,
  y: number,
  w: number,
  h: number,
  fill: string,
  shade: string,
  edge = 0.5,
): SVGTemplateResult {
  return svg`
    <rect x=${x} y=${y} width=${w} height=${h} fill=${ids.url(fill)} />
    <rect x=${x} y=${y} width=${w} height=${h} fill=${ids.url(shade)} />
    <rect x=${x} y=${y} width=${w} height=${h} fill=${ids.url("grain")} />
    ${edge ? svg`<line x1=${x} y1=${y + 0.35} x2=${x + w} y2=${y + 0.35} stroke="#fff" stroke-opacity=${edge} stroke-width="0.7" />` : nothing}
  `;
}

/** A dark reveal between parts, with the recessed frame strip and the door hinges seen in it. */
function reveal(ids: Ids, w: number, top: number, bottom: number, hinges: number[]): SVGTemplateResult {
  const h = bottom - top;
  const cy = top + h * 0.38;
  const arm = Math.min(0.85, h * 0.19);
  return svg`
    <rect x="0" y=${top} width=${w} height=${h} fill=${ids.url("ss-dim")} />
    <rect x="0" y=${top} width=${w} height=${h} fill=${ids.url("reveal")} />
    ${hinges.map(
      // Each hinge shows as its pivot and the crossed arms below it.
      (x) => svg`<g fill="none" stroke="#2a2b2c" stroke-width="0.3">
        <circle cx=${x} cy=${cy} r="0.65" />
        <path d=${`M${x - arm} ${cy + 1.1}l${2 * arm} ${2 * arm}m0 ${-2 * arm}l${-2 * arm} ${2 * arm}`} />
      </g>`,
    )}
  `;
}

export function floorAndFeet(layout: RangeLayout, ids: Ids, theme: "light" | "dark"): SVGTemplateResult {
  const w = layout.width;
  const floor = layout.floorY;
  const top = floor - layout.levels.feet;
  const shadow = floorShadow(theme);
  // The toe-kick panel is recessed behind the feet and stops a little above the floor; it has a
  // vent slot under each oven, just below the kick plate.
  const panelBottom = floor - 3.5;
  return svg`
    <ellipse cx=${w / 2} cy=${floor + 0.6} rx=${w / 2 + 5} ry="4.8" fill="#000" opacity=${shadow} filter=${ids.url("floor")} />
    <rect x="13" y=${top} width=${w - 26} height=${panelBottom - top} fill=${ids.url("ss-toe")} />
    <rect x="13" y=${top} width=${w - 26} height=${panelBottom - top} fill=${ids.url("lower")} />
    <rect x="13" y=${top} width=${w - 26} height=${panelBottom - top} fill=${ids.url("toe-shade")} />
    ${layout.doors.map((door) => {
      const center = (door.x0 + door.x1) / 2;
      const half = (door.x1 - door.x0) * 0.17;
      return svg`
        <rect x=${center - half} y=${top + 0.6} width=${2 * half} height="1.2" rx="0.6" fill="#1d1e20" opacity="0.85" />
        <line x1=${center - half + 0.6} y1=${top + 2.1} x2=${center + half - 0.6} y2=${top + 2.1} stroke="#fff"
          stroke-opacity="0.35" stroke-width="0.4" />
      `;
    })}
    ${layout.feet.map((foot) => {
      const slant = 8.5;
      const points =
        foot.taper === "right"
          ? `${foot.x0},${top} ${foot.x1},${top} ${foot.x1 - slant},${floor} ${foot.x0},${floor}`
          : foot.taper === "left"
            ? `${foot.x0},${top} ${foot.x1},${top} ${foot.x1},${floor} ${foot.x0 + slant},${floor}`
            : `${foot.x0},${top} ${foot.x1},${top} ${foot.x1},${floor} ${foot.x0},${floor}`;
      // The lit left edge follows the foot's outline, slanted on the right-hand corner foot.
      const edgeBottom = foot.x0 + (foot.taper === "left" ? slant : 0) + 0.3;
      // The middle foot stands further out of the corners' shade: about 178 in both photos.
      const shade = foot.taper === null ? 0.55 : 1;
      return svg`
        <ellipse cx=${(foot.x0 + foot.x1) / 2} cy=${floor + 0.2} rx=${(foot.x1 - foot.x0) / 2 + 3} ry="1.6" fill="#000"
          opacity=${Math.min(0.85, shadow * 1.5)} filter=${ids.url("soft")} />
        <polygon points=${points} fill=${ids.url("ss")} />
        <polygon points=${points} fill=${ids.url("foot")} opacity=${shade} />
        <polygon points=${points} fill=${ids.url("grain")} />
        <line x1=${foot.x0 + 0.3} y1=${top} x2=${edgeBottom} y2=${floor} stroke="#fff" stroke-opacity="0.35" stroke-width="0.5" />
      `;
    })}
  `;
}

/** The kick plate, the reveal under the doors and, on induction ranges, the storage drawer. */
export function lowerBody(layout: RangeLayout, ids: Ids): SVGTemplateResult {
  const w = layout.width;
  const y = (h: number) => layout.floorY - h;
  const { feet, plinth, drawer, doorBottom } = layout.levels;
  // Hinges about an inch in from each door's sides, and one in the middle.
  const hinges = layout.doors.flatMap((door) => [door.x0 + 9.5, (door.x0 + door.x1) / 2, door.x1 - 9.5]);
  const { doorTop } = layout.levels;
  return svg`
    <rect x="0" y=${y(doorTop)} width=${w} height=${doorTop - doorBottom} fill="#4b4c4e" />
    ${layout.doors.slice(1).map((door, index) => {
      // The stile between two ovens shows in the gap between their doors.
      const x = (layout.doors[index].x1 + door.x0) / 2;
      return svg`<line x1=${x} y1=${y(doorTop)} x2=${x} y2=${y(doorBottom)} stroke="#b9bbbd" stroke-width="1.3" />`;
    })}
    ${band(ids, 0, y(plinth), w, plinth - feet, "ss", "shade-plinth", 0.55)}
    ${
      // The induction range's kick plate reads as a bright band in its photo, lighter even at
      // the sides; the dual fuel ranges' is leveled off like the doors' lower part.
      drawer === null
        ? svg`<rect x="0" y=${y(plinth)} width=${w} height=${plinth - feet} fill=${ids.url("lower")} />`
        : svg`<rect x="0" y=${y(plinth)} width=${w} height=${plinth - feet} fill="#fff" opacity="0.35" />`
    }
    <line x1="0" y1=${y(feet) - 0.35} x2=${w} y2=${y(feet) - 0.35} stroke="#fff" stroke-opacity="0.55" stroke-width="0.7" />
    <line x1="0" y1=${y(feet) + 0.3} x2=${w} y2=${y(feet) + 0.3} stroke="#000" stroke-opacity="0.25" stroke-width="0.6" />
    ${
      drawer === null
        ? reveal(ids, w, y(doorBottom), y(plinth), hinges)
        : svg`
          ${band(ids, 0, y(drawer), w, drawer - plinth, "ss", "shade-door", 0.6)}
          <rect x="0" y=${y(drawer)} width=${w} height=${drawer - plinth} fill=${ids.url("lower")} />
          <line x1="0" y1=${y(plinth) - 0.3} x2=${w} y2=${y(plinth) - 0.3} stroke="#000" stroke-opacity="0.4" stroke-width="0.7" />
          ${reveal(ids, w, y(doorBottom), y(drawer), hinges)}
        `
    }
  `;
}

/** Above the doors: the control panel under the front rail, or the induction front trim. */
export function upperBand(layout: RangeLayout, ids: Ids): SVGTemplateResult {
  const w = layout.width;
  const y = (h: number) => layout.floorY - h;
  const { doorTop, bandBottom, railBottom, rim } = layout.levels;
  if (railBottom === null) {
    return svg`
      ${reveal(ids, w, y(bandBottom), y(doorTop), [])}
      ${band(ids, 0, y(rim), w, rim - bandBottom, "ss-rail", "shade-rail", 0)}
      <line x1="0" y1=${y(bandBottom) - 0.35} x2=${w} y2=${y(bandBottom) - 0.35} stroke="#000" stroke-opacity="0.3" stroke-width="0.7" />
    `;
  }
  return svg`
    ${reveal(ids, w, y(bandBottom), y(doorTop), [])}
    ${band(ids, 0, y(railBottom), w, railBottom - bandBottom, "ss-panel", "shade-panel", 0)}
    <line x1="0" y1=${y(bandBottom) - 0.35} x2=${w} y2=${y(bandBottom) - 0.35} stroke="#fff" stroke-opacity="0.3" stroke-width="0.6" />
    ${band(ids, 0, y(rim), w, rim - railBottom, "ss-rail", "shade-rail", 0)}
    <line x1="0" y1=${y(railBottom) + 0.3} x2=${w} y2=${y(railBottom) + 0.3} stroke="#2e2f31" stroke-width="0.6" />
    <line x1="0" y1=${y(railBottom) + 1} x2=${w} y2=${y(railBottom) + 1} stroke="#000" stroke-opacity="0.18" stroke-width="1.2" />
  `;
}
