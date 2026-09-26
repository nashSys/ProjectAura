import { inLexicon, nearestNeighbor } from "./lexicon";
import { positionPrior, prior } from "./priors";
import type { PlaceResult } from "./placer";
import type { SeerReading } from "./seer";

export type AnomalyParts = {
  letterSurprise: number;
  positionSurprise: number;
  lexiconMiss: number;
  fallbackRate: number;
  visualConflict: number;
};

export type AnomalyResult = {
  rating: number;
  parts: AnomalyParts;
  lexicon: "hit" | "near" | "miss";
  neighbor: string | null;
};

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

function mean(xs: number[]): number {
  if (xs.length === 0) return 0;
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}

function surpriseUnit(p: number): number {
  const nll = -Math.log(Math.max(p, 1e-9));
  const lo = -Math.log(0.12);
  const hi = -Math.log(0.0004);
  return clamp01((nll - lo) / (hi - lo));
}

export function scoreAnomaly(word: string, place: PlaceResult, readings: SeerReading[]): AnomalyResult {
  const letters = [...word];
  const letterSurprise = mean(letters.map((g) => surpriseUnit(prior(g))));
  const positionSurprise = mean(
    letters.map((g, i) => surpriseUnit(positionPrior(g, i, word.length))),
  );

  const hit = inLexicon(word);
  const neighbor = hit ? null : nearestNeighbor(word);
  const lexiconMiss = hit ? 0 : neighbor ? 0.4 : 1;
  const lexicon: AnomalyResult["lexicon"] = hit ? "hit" : neighbor ? "near" : "miss";

  const later = place.steps.filter((_, i) => i > 0);
  const fallbacks = later.filter((s) => s.mode === "fallback-random").length;
  const fallbackRate = later.length === 0 ? 0 : fallbacks / later.length;

  const visualConflict = mean(readings.map((r) => 1 - r.visualScore));

  const parts: AnomalyParts = {
    letterSurprise,
    positionSurprise,
    lexiconMiss,
    fallbackRate,
    visualConflict,
  };

  const mixed =
    0.3 * parts.letterSurprise +
    0.2 * parts.positionSurprise +
    0.25 * parts.lexiconMiss +
    0.15 * parts.fallbackRate +
    0.1 * parts.visualConflict;

  return {
    rating: Math.round(clamp01(mixed) * 1000) / 10,
    parts,
    lexicon,
    neighbor,
  };
}
