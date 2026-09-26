import { scoreAnomaly, type AnomalyResult } from "./anomaly";
import { makeGrid, type Grid } from "./grid";
import { sampleLength } from "./length";
import { placeLetters, type PlaceResult } from "./placer";
import { channelSeed, freshSeed, rngFromSeed } from "./rng";
import { readGrid, type SeerReading } from "./seer";

export type DrawOptions = {
  seed?: string;
  length?: number;
  minLength?: number;
  maxLength?: number;
};

export type AuraDraw = {
  word: string;
  length: number;
  seed: string;
  grids: Grid[];
  readings: SeerReading[];
  place: PlaceResult;
  anomaly: AnomalyResult;
};

export function composeAura(opts: DrawOptions = {}): AuraDraw {
  const seed = opts.seed && opts.seed.trim().length > 0 ? opts.seed.trim() : freshSeed();
  const lengthRand = rngFromSeed(channelSeed(seed, "length"));
  const length = sampleLength(lengthRand, {
    length: opts.length,
    minLength: opts.minLength,
    maxLength: opts.maxLength,
  });

  const grids: Grid[] = [];
  const readings: SeerReading[] = [];
  const glyphs: string[] = [];

  for (let i = 0; i < length; i += 1) {
    const gridRand = rngFromSeed(channelSeed(seed, `grid:${i}`));
    const grid = makeGrid(gridRand);
    const seerRand = rngFromSeed(channelSeed(seed, `seer:${i}`));
    const reading = readGrid(grid, seerRand);
    grids.push(grid);
    readings.push(reading);
    glyphs.push(reading.glyph);
  }

  const placeRand = rngFromSeed(channelSeed(seed, "place"));
  const place = placeLetters(length, glyphs, placeRand);
  const anomaly = scoreAnomaly(place.word, place, readings);

  return { word: place.word, length, seed, grids, readings, place, anomaly };
}
