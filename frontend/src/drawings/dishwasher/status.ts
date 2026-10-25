import type { Translate } from "../../i18n";
import type { ChipIcon, LabelSpec } from "../generic/overlay";
import type { DrawingState } from "../types";

/** How a dishwasher's live state reads in a drawing: Cove's floor light, chips and words. */

type Dishwasher = NonNullable<DrawingState["dishwasher"]>;
type Status = Dishwasher["status"];

/**
 * Cove's floor status light (quick start guide): red once a cycle starts, green when it's
 * complete, blue for a delayed start, and off while the door is open.
 */
export const FLOOR_LIGHT: Partial<Record<Status, string>> = {
  running: "#ff3b30",
  drying: "#ff3b30",
  canceling: "#ff3b30",
  delayed: "#3d8bff",
  done: "#2fe06f",
};

export function doorOpen(state: DrawingState): boolean {
  return !!(state.dishwasher?.door_open || state.doors.door_ajar);
}

/**
 * The frosted progress ring and indicator chips for the current state. Time left stays on the
 * card's display (every dishwasher card has one), so the door carries no text.
 */
export function dishwasherOverlay(state: DrawingState): { label: LabelSpec | null; chips: ChipIcon[] } {
  const dw = state.dishwasher;
  if (!dw || !state.available) return { label: null, chips: [] };
  const chips: ChipIcon[] = [];
  let label: LabelSpec | null = null;
  switch (dw.status) {
    case "running":
    case "drying":
    case "canceling":
      if (dw.progress != null) label = { progress: dw.progress };
      break;
    case "delayed":
      label = { icon: "clock" };
      break;
    case "paused":
      label = { icon: "pause" };
      break;
    case "done":
      chips.push("check");
      break;
    case "error":
      chips.push("error");
      break;
    case "idle":
      break;
  }
  if (dw.remote_ready) chips.push("remote");
  if (dw.rinse_aid_low) chips.push("rinse");
  if (dw.softener_low) chips.push("salt");
  return { label, chips };
}

/** What the dishwasher is doing, for the aria-label after its name; nothing while it's offline. */
export function dishwasherWords(t: Translate, state: DrawingState): string[] {
  if (!state.available) return [];
  const words: string[] = [];
  if (doorOpen(state)) words.push(t("drawing.state.door_open"));
  const dw = state.dishwasher;
  if (!dw) return words;
  if (dw.status !== "idle") words.push(t(`drawing.wash.${dw.status}`));
  if (dw.display && (dw.status === "running" || dw.status === "drying")) words.push(t("drawing.time_left", { time: dw.display }));
  if (dw.display && dw.status === "delayed") words.push(t("drawing.starts_in", { time: dw.display }));
  if (dw.remote_ready) words.push(t("drawing.state.remote_ready"));
  if (dw.rinse_aid_low) words.push(t("drawing.rinse_aid_low"));
  if (dw.softener_low) words.push(t("drawing.softener_low"));
  return words;
}
