export const GRID_SIZE = 12;
export const GRID_CELLS = GRID_SIZE * GRID_SIZE;
export const MARK_P = 0.28;

export type Grid = number[];

export function makeGrid(rand: () => number, p = MARK_P): Grid {
  const cells = new Array<number>(GRID_CELLS);
  for (let i = 0; i < GRID_CELLS; i += 1) {
    cells[i] = rand() < p ? 1 : 0;
  }
  return cells;
}

export function parseGrid(input: number[] | string): Grid {
  if (Array.isArray(input)) {
    if (input.length !== GRID_CELLS) {
      throw new Error(`grid must have ${GRID_CELLS} cells`);
    }
    return input.map((n) => (n ? 1 : 0));
  }
  const bits = input.replace(/[^01]/g, "");
  if (bits.length !== GRID_CELLS) {
    throw new Error(`grid string must contain ${GRID_CELLS} bits`);
  }
  return [...bits].map((c) => (c === "1" ? 1 : 0));
}

export function renderGrid(grid: Grid): string {
  const lines: string[] = [];
  for (let r = 0; r < GRID_SIZE; r += 1) {
    const row = grid.slice(r * GRID_SIZE, (r + 1) * GRID_SIZE);
    lines.push(row.map((c) => (c ? "█" : "·")).join(""));
  }
  return lines.join("\n");
}

export function markedSet(grid: Grid): Set<number> {
  const set = new Set<number>();
  for (let i = 0; i < grid.length; i += 1) {
    if (grid[i]) set.add(i);
  }
  return set;
}

export function jaccard(a: Grid, b: Grid): number {
  let inter = 0;
  let union = 0;
  for (let i = 0; i < GRID_CELLS; i += 1) {
    const on = (a[i] ? 1 : 0) | (b[i] ? 1 : 0);
    if (on) union += 1;
    if (a[i] && b[i]) inter += 1;
  }
  if (union === 0) return 0;
  return inter / union;
}
