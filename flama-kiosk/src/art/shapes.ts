// Small deliberate (non-random) path helpers for building layered food
// illustrations: a scalloped/ruffled edge (lettuce, bacon) and a
// melted-drip edge (cheese), plus a couple of gradient-friendly bun domes.

export function scallopEdge(leftX: number, rightX: number, baseY: number, bumps: number, amp: number): string {
  const step = (rightX - leftX) / bumps;
  let d = "";
  for (let i = 0; i < bumps; i++) {
    const x0 = leftX + i * step;
    const x1 = x0 + step;
    const midX = (x0 + x1) / 2;
    const dir = i % 2 === 0 ? -1 : 1;
    d += ` Q ${midX.toFixed(1)} ${(baseY + dir * amp).toFixed(1)} ${x1.toFixed(1)} ${baseY.toFixed(1)}`;
  }
  return d;
}

export function dripEdge(rightX: number, leftX: number, baseY: number, drips: number, dripLen: number): string {
  const step = (rightX - leftX) / drips;
  let d = "";
  for (let i = drips - 1; i >= 0; i--) {
    const x0 = leftX + i * step;
    const x1 = x0 + step;
    const dripX = (x0 + x1) / 2;
    d += ` L ${x1.toFixed(1)} ${baseY.toFixed(1)} Q ${dripX.toFixed(1)} ${(baseY + dripLen).toFixed(1)} ${x0.toFixed(1)} ${baseY.toFixed(1)}`;
  }
  return d;
}

export function crinkleStrip(x0: number, x1: number, yTop: number, yBottom: number, bumps: number, amp: number): string {
  return (
    `M ${x0} ${yTop}` +
    scallopEdge(x0, x1, yTop, bumps, amp) +
    ` L ${x1} ${yBottom}` +
    scallopEdge(x1, x0, yBottom, bumps, amp) +
    ` Z`
  );
}

export function domePath(cx: number, baseY: number, halfWidth: number, height: number, cornerRatio = 0.18): string {
  const left = cx - halfWidth;
  const right = cx + halfWidth;
  const topY = baseY - height;
  const cornerY = baseY - height * cornerRatio;
  return `M ${left} ${baseY} L ${left} ${cornerY} Q ${left} ${topY} ${cx} ${topY} Q ${right} ${topY} ${right} ${cornerY} L ${right} ${baseY} Z`;
}
