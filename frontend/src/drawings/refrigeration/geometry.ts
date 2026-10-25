/** Geometry shared by the refrigeration drawings. One drawing unit is 0.1 inch. */

export const IN = 10;

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export type Point = [number, number];

/**
 * The virtual camera in front of the appliance: where the eye is (cx, cy, in drawing units)
 * and how far away. Closed fronts are drawn flat; open doors, pulled drawers and interiors
 * use it so their depth reads the way it does in a product photo.
 */
export interface Camera {
  cx: number;
  cy: number;
  d: number;
}

/** Rounds to 0.1 unit, which keeps the generated markup short without visible error. */
export function n(value: number): number {
  return Math.round(value * 10) / 10;
}

/** Scale of something at depth z (toward the viewer is positive) relative to the front plane. */
export function depthScale(camera: Camera, z: number): number {
  return camera.d / (camera.d - z);
}

/** Projects a point at depth z onto the front plane. */
export function project(camera: Camera, x: number, y: number, z: number): Point {
  const s = depthScale(camera, z);
  return [camera.cx + (x - camera.cx) * s, camera.cy + (y - camera.cy) * s];
}

/** A rect at depth z, projected: flat fronts stay rectangles, only scaled about the eye. */
export function projectRect(camera: Camera, r: Rect, z: number): Rect {
  const [x, y] = project(camera, r.x, r.y, z);
  const s = depthScale(camera, z);
  return { x, y, w: r.w * s, h: r.h * s };
}

export function pathOf(points: Point[]): string {
  return `${points.map(([x, y], i) => `${i ? "L" : "M"}${n(x)} ${n(y)}`).join("")}Z`;
}

export interface Bounds {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

export function include(bounds: Bounds, points: Point[], margin = 0): Bounds {
  let { x0, y0, x1, y1 } = bounds;
  for (const [x, y] of points) {
    x0 = Math.min(x0, x - margin);
    y0 = Math.min(y0, y - margin);
    x1 = Math.max(x1, x + margin);
    y1 = Math.max(y1, y + margin);
  }
  return { x0, y0, x1, y1 };
}

/** A small deterministic generator, so contents are arranged the same way on every render. */
export function random(seed: number): () => number {
  let state = (seed * 2654435761) >>> 0 || 1;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}
