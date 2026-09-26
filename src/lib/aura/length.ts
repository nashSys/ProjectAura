import { pickWeighted } from "./rng";

export const MIN_LENGTH = 3;
export const MAX_LENGTH = 12;

const LENGTHS = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;
const WEIGHTS = [8, 18, 22, 20, 14, 9, 5, 3, 1, 1];

export function sampleLength(
  rand: () => number,
  opts?: { length?: number; minLength?: number; maxLength?: number },
): number {
  if (opts?.length !== undefined) {
    return clampLength(opts.length);
  }
  const min = clampLength(opts?.minLength ?? MIN_LENGTH);
  const max = clampLength(opts?.maxLength ?? MAX_LENGTH);
  const lo = Math.min(min, max);
  const hi = Math.max(min, max);
  const items: number[] = [];
  const weights: number[] = [];
  for (let i = 0; i < LENGTHS.length; i += 1) {
    const n = LENGTHS[i]!;
    if (n >= lo && n <= hi) {
      items.push(n);
      weights.push(WEIGHTS[i]!);
    }
  }
  if (items.length === 0) return lo;
  return pickWeighted(rand, items, weights);
}

export function clampLength(n: number): number {
  return Math.max(MIN_LENGTH, Math.min(MAX_LENGTH, Math.trunc(n)));
}
