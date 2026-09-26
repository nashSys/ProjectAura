import { createHash, randomBytes } from "node:crypto";

export function rngFromSeed(seed: string): () => number {
  const hex = createHash("sha256").update(seed).digest("hex").slice(0, 8);
  let a = Number.parseInt(hex, 16) >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pick<T>(rand: () => number, items: readonly T[]): T {
  if (items.length === 0) {
    throw new Error("pick() on empty list");
  }
  return items[Math.floor(rand() * items.length)]!;
}

export function pickWeighted<T>(
  rand: () => number,
  items: readonly T[],
  weights: readonly number[],
): T {
  if (items.length === 0 || items.length !== weights.length) {
    throw new Error("pickWeighted() length mismatch");
  }
  let total = 0;
  for (const w of weights) total += w;
  let x = rand() * total;
  for (let i = 0; i < items.length; i += 1) {
    x -= weights[i]!;
    if (x <= 0) return items[i]!;
  }
  return items[items.length - 1]!;
}

export function freshSeed(): string {
  return randomBytes(16).toString("hex");
}

export function hashKey(parts: string[]): string {
  return createHash("sha256").update(parts.join("|")).digest("hex");
}

export function utcDay(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

export function channelSeed(root: string, channel: string): string {
  return hashKey(["aura", root, channel]);
}
