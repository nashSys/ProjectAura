import { GRID_CELLS, GRID_SIZE, type Grid } from "./grid";
import { GLYPHS } from "./priors";

function empty(): Grid {
  return new Array<number>(GRID_CELLS).fill(0);
}

function setCell(grid: Grid, r: number, c: number): void {
  if (r < 0 || r >= GRID_SIZE || c < 0 || c >= GRID_SIZE) return;
  grid[r * GRID_SIZE + c] = 1;
}

function hline(grid: Grid, r: number, c0: number, c1: number): void {
  for (let c = c0; c <= c1; c += 1) setCell(grid, r, c);
}

function vline(grid: Grid, c: number, r0: number, r1: number): void {
  for (let r = r0; r <= r1; r += 1) setCell(grid, r, c);
}

type Painter = (g: Grid) => void;

const PAINT: Record<string, Painter> = {
  a: (g) => {
    vline(g, 3, 3, 8);
    vline(g, 8, 3, 8);
    hline(g, 2, 4, 7);
    hline(g, 5, 3, 8);
  },
  b: (g) => {
    vline(g, 3, 2, 8);
    hline(g, 2, 3, 7);
    hline(g, 5, 3, 7);
    hline(g, 8, 3, 7);
    vline(g, 8, 3, 4);
    vline(g, 8, 6, 7);
  },
  c: (g) => {
    hline(g, 2, 4, 8);
    hline(g, 8, 4, 8);
    vline(g, 3, 3, 7);
  },
  d: (g) => {
    vline(g, 3, 2, 8);
    hline(g, 2, 3, 7);
    hline(g, 8, 3, 7);
    vline(g, 8, 3, 7);
  },
  e: (g) => {
    vline(g, 3, 2, 8);
    hline(g, 2, 3, 8);
    hline(g, 5, 3, 7);
    hline(g, 8, 3, 8);
  },
  f: (g) => {
    vline(g, 3, 2, 8);
    hline(g, 2, 3, 8);
    hline(g, 5, 3, 7);
  },
  g: (g) => {
    hline(g, 2, 4, 8);
    hline(g, 8, 4, 8);
    vline(g, 3, 3, 7);
    hline(g, 5, 6, 8);
    vline(g, 8, 5, 7);
  },
  h: (g) => {
    vline(g, 3, 2, 8);
    vline(g, 8, 2, 8);
    hline(g, 5, 3, 8);
  },
  i: (g) => {
    hline(g, 2, 4, 7);
    vline(g, 5, 2, 8);
    hline(g, 8, 4, 7);
  },
  j: (g) => {
    hline(g, 2, 5, 8);
    vline(g, 7, 2, 7);
    hline(g, 8, 4, 7);
    setCell(g, 7, 3);
  },
  k: (g) => {
    vline(g, 3, 2, 8);
    setCell(g, 3, 7);
    setCell(g, 4, 6);
    setCell(g, 5, 5);
    setCell(g, 5, 4);
    setCell(g, 6, 6);
    setCell(g, 7, 7);
    setCell(g, 8, 8);
  },
  l: (g) => {
    vline(g, 3, 2, 8);
    hline(g, 8, 3, 8);
  },
  m: (g) => {
    vline(g, 3, 2, 8);
    vline(g, 8, 2, 8);
    setCell(g, 3, 4);
    setCell(g, 4, 5);
    setCell(g, 3, 6);
    vline(g, 5, 4, 8);
  },
  n: (g) => {
    vline(g, 3, 2, 8);
    vline(g, 8, 2, 8);
    setCell(g, 3, 4);
    setCell(g, 4, 5);
    setCell(g, 5, 6);
    setCell(g, 6, 7);
  },
  o: (g) => {
    hline(g, 2, 4, 7);
    hline(g, 8, 4, 7);
    vline(g, 3, 3, 7);
    vline(g, 8, 3, 7);
  },
  p: (g) => {
    vline(g, 3, 2, 8);
    hline(g, 2, 3, 7);
    hline(g, 5, 3, 7);
    vline(g, 8, 3, 4);
  },
  q: (g) => {
    hline(g, 2, 4, 7);
    hline(g, 8, 4, 6);
    vline(g, 3, 3, 7);
    vline(g, 8, 3, 7);
    setCell(g, 7, 7);
    setCell(g, 8, 8);
  },
  r: (g) => {
    vline(g, 3, 2, 8);
    hline(g, 2, 3, 7);
    hline(g, 5, 3, 7);
    vline(g, 8, 3, 4);
    setCell(g, 6, 6);
    setCell(g, 7, 7);
    setCell(g, 8, 8);
  },
  s: (g) => {
    hline(g, 2, 4, 8);
    vline(g, 3, 3, 4);
    hline(g, 5, 4, 7);
    vline(g, 8, 6, 7);
    hline(g, 8, 3, 7);
  },
  t: (g) => {
    hline(g, 2, 3, 8);
    vline(g, 5, 2, 8);
  },
  u: (g) => {
    vline(g, 3, 2, 7);
    vline(g, 8, 2, 7);
    hline(g, 8, 4, 7);
  },
  v: (g) => {
    vline(g, 3, 2, 5);
    vline(g, 8, 2, 5);
    setCell(g, 6, 4);
    setCell(g, 6, 7);
    setCell(g, 7, 5);
    setCell(g, 8, 6);
    setCell(g, 7, 6);
  },
  w: (g) => {
    vline(g, 3, 2, 8);
    vline(g, 8, 2, 8);
    setCell(g, 6, 5);
    setCell(g, 7, 4);
    setCell(g, 7, 6);
    vline(g, 5, 5, 8);
  },
  x: (g) => {
    setCell(g, 2, 3);
    setCell(g, 3, 4);
    setCell(g, 4, 5);
    setCell(g, 5, 6);
    setCell(g, 6, 7);
    setCell(g, 7, 8);
    setCell(g, 2, 8);
    setCell(g, 3, 7);
    setCell(g, 4, 6);
    setCell(g, 6, 5);
    setCell(g, 7, 4);
    setCell(g, 8, 3);
  },
  y: (g) => {
    setCell(g, 2, 3);
    setCell(g, 3, 4);
    setCell(g, 2, 8);
    setCell(g, 3, 7);
    setCell(g, 4, 6);
    setCell(g, 4, 5);
    vline(g, 5, 4, 8);
  },
  z: (g) => {
    hline(g, 2, 3, 8);
    setCell(g, 3, 7);
    setCell(g, 4, 6);
    setCell(g, 5, 5);
    setCell(g, 6, 4);
    setCell(g, 7, 3);
    hline(g, 8, 3, 8);
  },
  "0": (g) => {
    hline(g, 2, 4, 7);
    hline(g, 8, 4, 7);
    vline(g, 3, 3, 7);
    vline(g, 8, 3, 7);
    setCell(g, 5, 5);
    setCell(g, 6, 6);
  },
  "1": (g) => {
    setCell(g, 3, 4);
    vline(g, 5, 2, 7);
    hline(g, 8, 4, 7);
  },
  "2": (g) => {
    hline(g, 2, 4, 7);
    vline(g, 8, 3, 4);
    hline(g, 5, 4, 7);
    vline(g, 3, 6, 7);
    hline(g, 8, 3, 8);
  },
  "3": (g) => {
    hline(g, 2, 4, 7);
    vline(g, 8, 3, 4);
    hline(g, 5, 5, 7);
    vline(g, 8, 6, 7);
    hline(g, 8, 4, 7);
  },
  "4": (g) => {
    vline(g, 3, 2, 5);
    hline(g, 5, 3, 8);
    vline(g, 7, 2, 8);
  },
  "5": (g) => {
    hline(g, 2, 3, 8);
    vline(g, 3, 2, 4);
    hline(g, 5, 3, 7);
    vline(g, 8, 6, 7);
    hline(g, 8, 3, 7);
  },
  "6": (g) => {
    hline(g, 2, 4, 8);
    vline(g, 3, 3, 7);
    hline(g, 5, 3, 7);
    vline(g, 8, 5, 7);
    hline(g, 8, 4, 7);
  },
  "7": (g) => {
    hline(g, 2, 3, 8);
    setCell(g, 3, 7);
    setCell(g, 4, 6);
    vline(g, 5, 5, 8);
  },
  "8": (g) => {
    hline(g, 2, 4, 7);
    hline(g, 5, 4, 7);
    hline(g, 8, 4, 7);
    vline(g, 3, 3, 4);
    vline(g, 8, 3, 4);
    vline(g, 3, 6, 7);
    vline(g, 8, 6, 7);
  },
  "9": (g) => {
    hline(g, 2, 4, 7);
    vline(g, 3, 3, 4);
    vline(g, 8, 3, 7);
    hline(g, 5, 4, 8);
    hline(g, 8, 4, 7);
  },
};

export const GLYPH_BANK: Record<string, Grid> = Object.fromEntries(
  Object.keys(PAINT).map((k) => {
    const g = empty();
    PAINT[k]!(g);
    return [k, g];
  }),
);

export const GLYPH_BANK_VERSION = "12x12-stroke-v1";

export function glyphArt(glyph: string): string {
  const grid = GLYPH_BANK[glyph];
  if (!grid) return "";
  const lines: string[] = [];
  for (let r = 0; r < GRID_SIZE; r += 1) {
    const row = grid.slice(r * GRID_SIZE, (r + 1) * GRID_SIZE);
    lines.push(row.map((c) => (c ? "#" : ".")).join(""));
  }
  return lines.join("\n");
}

export function glyphsText(): string {
  const parts = [`# Glyph bank ${GLYPH_BANK_VERSION}`, ""];
  for (const g of GLYPHS) {
    parts.push(`## ${g}`, glyphArt(g), "");
  }
  return parts.join("\n");
}

if (Object.keys(GLYPH_BANK).length !== GLYPHS.length) {
  throw new Error("glyph bank missing templates");
}
