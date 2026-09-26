import { createHash } from "node:crypto";

import byLengthJson from "./data/words-by-length.json";

export type LexiconIndex = {
  byLength: Map<number, string[]>;
  set: Set<string>;
  size: number;
};

let cached: LexiconIndex | null = null;

export function loadLexicon(): LexiconIndex {
  if (cached) return cached;
  const byLength = new Map<number, string[]>();
  const set = new Set<string>();
  for (const [key, words] of Object.entries(byLengthJson as Record<string, string[]>)) {
    const n = Number(key);
    const list = words.map((w) => w.toLowerCase());
    byLength.set(n, list);
    for (const w of list) set.add(w);
  }
  cached = { byLength, set, size: set.size };
  return cached;
}

export function wordsOfLength(n: number): string[] {
  return loadLexicon().byLength.get(n) ?? [];
}

export function inLexicon(word: string): boolean {
  return loadLexicon().set.has(word.toLowerCase());
}

export function matchPattern(length: number, pattern: (string | null)[]): string[] {
  const words = wordsOfLength(length);
  const out: string[] = [];
  outer: for (const word of words) {
    for (let i = 0; i < length; i += 1) {
      const want = pattern[i];
      if (want && word[i] !== want) continue outer;
    }
    out.push(word);
  }
  return out;
}

export function nearestNeighbor(word: string): string | null {
  const words = wordsOfLength(word.length);
  let found: string | null = null;
  for (const other of words) {
    let diff = 0;
    for (let i = 0; i < word.length; i += 1) {
      if (word[i] !== other[i]) {
        diff += 1;
        if (diff > 1) break;
      }
    }
    if (diff === 1) {
      found = other;
      break;
    }
  }
  return found;
}

export function lexiconCounts(): Record<string, number> {
  const out: Record<string, number> = {};
  for (const [n, list] of loadLexicon().byLength) out[String(n)] = list.length;
  return out;
}

export function lexiconChecksum(): string {
  const { set } = loadLexicon();
  const joined = [...set].sort().join("\n");
  return createHash("sha256").update(joined).digest("hex").slice(0, 16);
}

export function lexiconIndexText(): string {
  const counts = lexiconCounts();
  const lines = ["# Aura lexicon", "", `size ${loadLexicon().size}`, "source Wordnik wordlist, board-voice cut", ""];
  for (const n of Object.keys(counts).sort((a, b) => Number(a) - Number(b))) {
    lines.push(`- length ${n}: ${counts[n]}`);
  }
  return lines.join("\n");
}
