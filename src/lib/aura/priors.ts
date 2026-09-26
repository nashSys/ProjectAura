export const LETTERS = "abcdefghijklmnopqrstuvwxyz";
export const DIGITS = "0123456789";
export const GLYPHS = LETTERS + DIGITS;

export const LETTER_WEIGHTS: Record<string, number> = {
  a: 8.2, b: 1.5, c: 2.8, d: 4.3, e: 12.7, f: 2.2, g: 2.0, h: 6.1, i: 7.0,
  j: 0.15, k: 0.77, l: 4.0, m: 2.4, n: 6.7, o: 7.5, p: 1.9, q: 0.1, r: 6.0,
  s: 6.3, t: 9.1, u: 2.8, v: 1.0, w: 2.4, x: 0.15, y: 2.0, z: 0.07,
};

export const DIGIT_WEIGHTS: Record<string, number> = {
  "0": 1.2, "1": 1.6, "2": 1.1, "3": 0.9, "4": 0.8,
  "5": 0.8, "6": 0.7, "7": 0.6, "8": 0.6, "9": 0.7,
};

export const LETTER_MASS = 0.94;
export const DIGIT_MASS = 0.06;

export const FIRST_LETTER_WEIGHTS: Record<string, number> = {
  a: 11.7, b: 4.4, c: 5.2, d: 3.2, e: 2.8, f: 4.0, g: 1.6, h: 4.2, i: 7.3,
  j: 0.51, k: 0.86, l: 2.4, m: 3.8, n: 2.3, o: 7.6, p: 4.3, q: 0.22, r: 2.8,
  s: 6.7, t: 16.0, u: 1.2, v: 0.82, w: 5.5, x: 0.05, y: 0.76, z: 0.05,
};

function normalize(map: Record<string, number>): Record<string, number> {
  let total = 0;
  for (const v of Object.values(map)) total += v;
  const out: Record<string, number> = {};
  for (const [k, v] of Object.entries(map)) out[k] = v / total;
  return out;
}

const letterP = normalize(LETTER_WEIGHTS);
const digitP = normalize(DIGIT_WEIGHTS);
const firstP = normalize(FIRST_LETTER_WEIGHTS);

export function prior(glyph: string): number {
  if (glyph >= "0" && glyph <= "9") return DIGIT_MASS * (digitP[glyph] ?? 0);
  return LETTER_MASS * (letterP[glyph] ?? 0);
}

export function positionPrior(glyph: string, index: number, length: number): number {
  if (glyph >= "0" && glyph <= "9") return prior(glyph);
  if (index === 0) return LETTER_MASS * (firstP[glyph] ?? letterP[glyph] ?? 0);
  if (index === length - 1) {
    const lastBoost: Record<string, number> = { e: 1.4, t: 1.15, d: 1.2, s: 1.25, n: 1.1, y: 1.2 };
    return prior(glyph) * (lastBoost[glyph] ?? 0.9);
  }
  return prior(glyph);
}

export function priorTableText(): string {
  const lines = ["# Aura priors", "", `letter mass ${LETTER_MASS}`, `digit mass ${DIGIT_MASS}`, ""];
  for (const g of GLYPHS) lines.push(`- ${g}: ${prior(g).toFixed(5)}`);
  return lines.join("\n");
}

export function priorChecksum(): string {
  return [...GLYPHS].map((g) => `${g}:${prior(g).toFixed(6)}`).join(",");
}
