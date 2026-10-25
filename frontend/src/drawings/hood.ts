import { html, nothing, svg } from "lit";
import {
  BAND,
  CANOPY,
  EDGE,
  LIP,
  UNDER,
  bandBase,
  canopyBase,
  canopyDetails,
  chimney,
  fanVapor,
  frontDetails,
  halo,
  hoodDefs,
  hoodIds,
  lightPositions,
  lightSpill,
  surround,
  whiteLight,
  type HoodLook,
} from "./hood/parts";
import type { Translate } from "../i18n";
import type { DrawingRenderer } from "./types";
import { HOOD_LIGHT, clamp, materialDefs, materialIds, round, url } from "./wall-oven/materials";
import { spoken } from "./words";

/** The island hood's chimney shows this much above the canopy, fading out over its upper part. */
const CHIMNEY = 90;
/** A liner's custom surround, as tall as Wolf's VL rendering shows it. */
const SURROUND = 150;
/** Room under the hood for the light it casts. */
const SPILL = 58;
const MARGIN = 10;

/**
 * Wolf Pro Ventilation hoods: the wall chimney hood (also drawn for a hood whose form isn't
 * known), the island hood with its chimney, and the liner in a custom wood surround. Widths come
 * from the spec, 30″ to 66″, 36″ when unknown. The task light casts its brightness and white
 * temperature below, the halo glows along the underside, the fan draws vapor up into the baffles
 * at its speed, and the knobs turn with their settings.
 */
export const renderHood: DrawingRenderer = (input) => {
  const spec = input.spec;
  if (spec.family !== "hood") return null;
  const form = spec.form === "island" || spec.form === "insert" ? spec.form : "wall";
  const width = clamp(spec.width ?? 36, 30, 66) * 10;
  const state = input.state.hood;
  const look: HoodLook = {
    light: state?.light ? clamp(state.brightness / 100, 0.05, 1) : 0,
    lightColor: whiteLight(state?.kelvin ?? null),
    halo: state?.halo ?? false,
    fan: state?.fan ?? 0,
  };
  const m = materialIds(input.uid);
  const ids = hoodIds(input.uid);
  // The liner sits a little inside its surround; the other hoods' fronts span their full width.
  const inset = form === "insert" ? 8 : 0;
  // A liner's band hides in its surround, so its rolled edge sits right under the wood.
  const bandTop = form === "insert" ? SURROUND : CANOPY;
  const edge = form === "insert" ? SURROUND : CANOPY + BAND + LIP;
  const bottom = edge + EDGE + UNDER;
  const top = form === "island" ? -CHIMNEY : 0;
  const lights = lightPositions(width - inset * 2).map((x) => x + inset);
  const viewBox = [
    -MARGIN,
    top - MARGIN / 2,
    width + MARGIN * 2,
    round(bottom - top + MARGIN / 2 + SPILL),
  ].join(" ");
  // A soft shadow on the wall below; the task light, when on, washes most of it out.
  const shadow = (input.theme === "dark" ? 0.5 : 0.18) * (1 - 0.8 * look.light);

  const label = ariaLabel(input.t, form, look, input.state.available);
  return html`<svg viewBox=${viewBox} role="img" aria-label=${label}>
    ${svg`
      <defs>
        ${materialDefs(m, {
          finish: "stainless",
          knobs: input.appearance.knobs,
          x: 0,
          y: top,
          width,
          height: bottom - top,
          light: HOOD_LIGHT,
          parts: { knob: true, wideBlur: look.light > 0, offline: !input.state.available },
        })}
        ${hoodDefs(ids, look, input.theme)}
        <radialGradient id=${`${m.uid}-wall-shadow`}>
          <stop offset="0" stop-color="#000" stop-opacity=${shadow} />
          <stop offset="1" stop-color="#000" stop-opacity="0" />
        </radialGradient>
      </defs>
      ${form === "island"
        ? nothing
        : svg`<ellipse cx=${width / 2} cy=${bottom + 6} rx=${width * 0.52} ry="12"
            fill=${url(`${m.uid}-wall-shadow`)} />`}
      <g filter=${input.state.available ? nothing : url(m.offline)}>
        ${lightSpill(m, ids, lights, bottom, look, SPILL, input.theme)}
        ${form === "island" ? chimney(m, ids, width, 0, CHIMNEY) : nothing}
        ${form === "insert" ? surround(m, ids, width, SURROUND) : nothing}
        ${form === "insert"
          ? nothing
          : svg`
            <g filter=${url(m.grain)}>${canopyBase(m, ids, width, 0)}${bandBase(m, 0, width, bandTop)}</g>
            ${canopyDetails(width, 0)}`}
        ${frontDetails(m, ids, inset, width - inset, bandTop, look, form !== "insert")}
        ${look.halo ? halo(m, inset, width - inset, edge, form !== "insert") : nothing}
        ${input.state.available
          ? fanVapor(m, ids, inset, width - inset, edge + EDGE, bottom, look.fan, input.theme, input.reducedMotion ?? false)
          : nothing}
      </g>
    `}
  </svg>`;
};

/** What the drawing shows, for screen readers, e.g. "Wall hood, fan speed 2, light 80%". */
function ariaLabel(t: Translate, form: "wall" | "island" | "insert", look: HoodLook, available: boolean): string {
  const phrases = [t(`drawing.hood.${form}`)];
  if (look.fan > 0) phrases.push(t("drawing.fan_speed", { speed: look.fan }));
  if (look.light > 0) phrases.push(t("drawing.light_level", { percent: Math.round(look.light * 100) }));
  if (look.halo) phrases.push(t("drawing.halo_on"));
  if (!available) phrases.push(t("drawing.offline"));
  return spoken(t, phrases);
}
