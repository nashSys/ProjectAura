import { jaccard, type Grid } from "./grid";
import { GLYPH_BANK } from "./glyphs";
import { GLYPHS, prior } from "./priors";

export const SEER_TEMPERATURE = 0.12;

export type SeerReading = {
  glyph: string;
  kind: "letter" | "digit";
  visualScore: number;
  prior: number;
  posterior: number;
  distribution: { glyph: string; posterior: number; visualScore: number }[];
};

function softmaxScores(grid: Grid): { glyph: string; visual: number; weight: number }[] {
  const rows: { glyph: string; visual: number; weight: number }[] = [];
  for (const glyph of GLYPHS) {
    const template = GLYPH_BANK[glyph]!;
    const visual = jaccard(grid, template);
    const p = prior(glyph);
    const weight = Math.exp(visual / SEER_TEMPERATURE) * p;
    rows.push({ glyph, visual, weight });
  }
  return rows;
}

export function readGrid(grid: Grid, rand: () => number): SeerReading {
  const rows = softmaxScores(grid);
  let total = 0;
  for (const row of rows) total += row.weight;
  const distribution = rows
    .map((row) => ({
      glyph: row.glyph,
      posterior: total === 0 ? 0 : row.weight / total,
      visualScore: row.visual,
    }))
    .sort((a, b) => b.posterior - a.posterior);

  let x = rand();
  let chosen = distribution[distribution.length - 1]!;
  for (const row of distribution) {
    x -= row.posterior;
    if (x <= 0) {
      chosen = row;
      break;
    }
  }

  const kind = chosen.glyph >= "0" && chosen.glyph <= "9" ? "digit" : "letter";
  return {
    glyph: chosen.glyph,
    kind,
    visualScore: chosen.visualScore,
    prior: prior(chosen.glyph),
    posterior: chosen.posterior,
    distribution,
  };
}
