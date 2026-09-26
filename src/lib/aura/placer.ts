import { matchPattern } from "./lexicon";

export type PlaceMode = "first-random" | "lexicon" | "fallback-random";

export type PlaceStep = {
  index: number;
  glyph: string;
  slot: number;
  mode: PlaceMode;
  support: number;
};

export type PlaceResult = {
  word: string;
  slots: string[];
  steps: PlaceStep[];
};

export function placeLetters(
  length: number,
  glyphs: string[],
  rand: () => number,
): PlaceResult {
  const slots: (string | null)[] = Array.from({ length }, () => null);
  const steps: PlaceStep[] = [];

  glyphs.forEach((glyph, index) => {
    const empty: number[] = [];
    for (let i = 0; i < length; i += 1) {
      if (slots[i] === null) empty.push(i);
    }
    if (empty.length === 0) return;

    const filled = slots.filter((s) => s !== null).length;
    if (filled === 0) {
      const slot = empty[Math.floor(rand() * empty.length)]!;
      slots[slot] = glyph;
      steps.push({ index, glyph, slot, mode: "first-random", support: 0 });
      return;
    }

    const candidates = matchPattern(length, slots).filter((word) => {
      for (const i of empty) {
        if (word[i] === glyph) return true;
      }
      return false;
    });

    if (candidates.length > 0) {
      const scores = empty.map((i) => {
        let hits = 0;
        for (const word of candidates) {
          if (word[i] === glyph) hits += 1;
        }
        return { i, hits };
      });
      scores.sort((a, b) => b.hits - a.hits || a.i - b.i);
      const best = scores[0]!.hits;
      const tied = scores.filter((s) => s.hits === best && s.hits > 0);
      const pickFrom = tied.length > 0 ? tied : scores;
      const slot = pickFrom[Math.floor(rand() * pickFrom.length)]!.i;
      slots[slot] = glyph;
      steps.push({ index, glyph, slot, mode: "lexicon", support: candidates.length });
      return;
    }

    const slot = empty[Math.floor(rand() * empty.length)]!;
    slots[slot] = glyph;
    steps.push({ index, glyph, slot, mode: "fallback-random", support: 0 });
  });

  const word = slots.map((s) => s ?? "?").join("");
  return { word, slots: slots.map((s) => s ?? "?"), steps };
}
