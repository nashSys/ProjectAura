import { renderGrid } from "./grid";
import type { AuraDraw } from "./compose";

export function formatDraw(
  draw: AuraDraw,
  opts?: { includeGrids?: boolean; includeTrace?: boolean },
): string {
  const { anomaly } = draw;
  const lines = [
    `word: ${draw.word.toUpperCase()}`,
    `length: ${draw.length}`,
    `anomaly_rating: ${anomaly.rating.toFixed(1)}`,
    `seed: ${draw.seed}`,
    `lexicon: ${anomaly.lexicon}`,
  ];
  if (anomaly.neighbor) lines.push(`neighbor: ${anomaly.neighbor}`);
  lines.push(
    "",
    "parts:",
    `  letter_surprise: ${anomaly.parts.letterSurprise.toFixed(2)}`,
    `  position_surprise: ${anomaly.parts.positionSurprise.toFixed(2)}`,
    `  lexicon_miss: ${anomaly.parts.lexiconMiss.toFixed(2)}`,
    `  fallback_rate: ${anomaly.parts.fallbackRate.toFixed(2)}`,
    `  visual_conflict: ${anomaly.parts.visualConflict.toFixed(2)}`,
  );

  if (opts?.includeTrace) {
    lines.push("", "trace:");
    for (const step of draw.place.steps) {
      const support = step.mode === "lexicon" ? ` support=${step.support}` : "";
      lines.push(`  [${step.index}] ${step.glyph.toUpperCase()} -> slot ${step.slot} ${step.mode}${support}`);
    }
  }

  if (opts?.includeGrids) {
    lines.push("", "grids:");
    draw.grids.forEach((grid, i) => {
      const reading = draw.readings[i]!;
      lines.push(`  grid ${i} -> ${reading.glyph.toUpperCase()} (visual ${reading.visualScore.toFixed(2)})`);
      for (const row of renderGrid(grid).split("\n")) lines.push(`  ${row}`);
      lines.push("");
    });
  }

  return lines.join("\n");
}

export function formatInspect(gridArt: string, reading: {
  glyph: string;
  kind: string;
  visualScore: number;
  prior: number;
  posterior: number;
  distribution: { glyph: string; posterior: number; visualScore: number }[];
}): string {
  const top = reading.distribution.slice(0, 8);
  const lines = [
    `chosen: ${reading.glyph.toUpperCase()}`,
    `kind: ${reading.kind}`,
    `visual: ${reading.visualScore.toFixed(3)}`,
    `prior: ${reading.prior.toFixed(5)}`,
    `posterior: ${reading.posterior.toFixed(4)}`,
    "",
    "posterior:",
    ...top.map((row) => `  ${row.glyph}  p=${row.posterior.toFixed(4)}  visual=${row.visualScore.toFixed(3)}`),
    "",
    gridArt,
  ];
  return lines.join("\n");
}
