/**
 * Tiny bridge between the agent console (DOM) and the hero graph (WebGL).
 * The console says which nodes the agent touched; the graph reads it every
 * frame. A module-level store keeps React out of the render loop.
 */
let busy = false;
const lit = new Map<string, number>(); // node label → time it stops glowing

export const agentActivity = {
  setBusy(value: boolean) {
    busy = value;
  },
  isBusy() {
    return busy;
  },
  /** Light the given graph nodes for a few seconds. */
  fire(labels: string[], ms = 6000) {
    const until = performance.now() + ms;
    for (const label of labels) lit.set(label, until);
  },
  /** 0 → idle, 1 → just fired; eases out toward the end of the glow. */
  level(label: string) {
    const until = lit.get(label);
    if (!until) return 0;
    const left = until - performance.now();
    if (left <= 0) {
      lit.delete(label);
      return 0;
    }
    return Math.min(1, left / 1500);
  },
};
