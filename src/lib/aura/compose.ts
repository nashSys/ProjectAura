import { NEAR_CONVERT_P, scoreAnomaly, type AnomalyResult } from "./anomaly";
import { makeGrid, type Grid } from "./grid";
import { sampleLength } from "./length";
import { placeLetters, type PlaceResult } from "./placer";
import { channelSeed, freshSeed, rngFromSeed, sittingRoot } from "./rng";
import { readGrid, type SeerReading } from "./seer";

export type DrawOptions = {
  seed?: string;
  session?: string;
  draw?: number;
  length?: number;
  minLength?: number;
  maxLength?: number;
};

export type AuraDraw = {
  word: string;
  length: number;
  seed: string;
  session: string | null;
  draw: number | null;
  grids: Grid[];
  readings: SeerReading[];
  place: PlaceResult;
  anomaly: AnomalyResult;
};

export function composeAura(opts: DrawOptions = {}): AuraDraw {
  const session = opts.session?.trim() ? opts.session.trim() : "";
  const drawNo = opts.draw && Number.isFinite(opts.draw) && opts.draw >= 1 ? Math.floor(opts.draw) : 1;
  const seed =
    opts.seed && opts.seed.trim().length > 0
      ? opts.seed.trim()
      : session
        ? `draw:${drawNo}`
        : freshSeed();
  const root = sittingRoot(session || undefined, seed);
  const lengthRand = rngFromSeed(channelSeed(root, "length"));
  const length = sampleLength(lengthRand, {
    length: opts.length,
    minLength: opts.minLength,
    maxLength: opts.maxLength,
  });

  const grids: Grid[] = [];
  const readings: SeerReading[] = [];
  const glyphs: string[] = [];

  for (let i = 0; i < length; i += 1) {
    const gridRand = rngFromSeed(channelSeed(root, `grid:${i}`));
    const grid = makeGrid(gridRand);
    const seerRand = rngFromSeed(channelSeed(root, `seer:${i}`));
    const reading = readGrid(grid, seerRand);
    grids.push(grid);
    readings.push(reading);
    glyphs.push(reading.glyph);
  }

  const placeRand = rngFromSeed(channelSeed(root, "place"));
  let place = placeLetters(length, glyphs, placeRand);
  let anomaly = scoreAnomaly(place.word, place, readings);

  if (anomaly.lexicon === "near" && anomaly.neighbor) {
    const convertRand = rngFromSeed(channelSeed(root, "near-convert"));
    if (convertRand() < NEAR_CONVERT_P) {
      const convertedFrom = place.word;
      const next = anomaly.neighbor;
      place = {
        ...place,
        word: next,
        slots: [...next],
      };
      anomaly = {
        ...scoreAnomaly(place.word, place, readings),
        convertedFrom,
      };
    }
  }

  return {
    word: place.word,
    length,
    seed,
    session: session || null,
    draw: session ? drawNo : null,
    grids,
    readings,
    place,
    anomaly,
  };
}
