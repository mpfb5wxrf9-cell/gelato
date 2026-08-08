export type Point = [number, number];

export function blobPoints(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  rand: () => number,
  n = 10,
  jitter = 0.14
): Point[] {
  const pts: Point[] = [];
  for (let i = 0; i < n; i++) {
    const angle = (i / n) * Math.PI * 2;
    const r = 1 + (rand() - 0.5) * 2 * jitter;
    pts.push([cx + Math.cos(angle) * rx * r, cy + Math.sin(angle) * ry * r]);
  }
  return pts;
}

export function smoothClosedPath(pts: Point[]): string {
  const n = pts.length;
  const get = (i: number) => pts[((i % n) + n) % n];
  const parts: string[] = [`M ${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)}`];
  for (let i = 0; i < n; i++) {
    const p0 = get(i - 1);
    const p1 = get(i);
    const p2 = get(i + 1);
    const p3 = get(i + 2);
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    parts.push(
      `C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`
    );
  }
  parts.push("Z");
  return parts.join(" ");
}

export function blobPath(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  rand: () => number,
  n = 10,
  jitter = 0.14
): string {
  return smoothClosedPath(blobPoints(cx, cy, rx, ry, rand, n, jitter));
}
