import { z } from "zod";

import { formatInspect } from "~/lib/aura/format";
import { parseGrid, renderGrid } from "~/lib/aura/grid";
import { rngFromSeed } from "~/lib/aura/rng";
import { readGrid } from "~/lib/aura/seer";
import { AURA_INSPECT_DESCRIPTION } from "~/lib/constants";

const inputSchema = z.object({
  grid: z.string().min(1).describe("144 bits as 0/1, optionally with newlines. 1 is a mark."),
  seed: z.string().min(1).optional().describe("Optional seer seed. Omit for a fresh sample."),
});

export const auraInspectGridTool = {
  name: "aura_inspect_grid",
  description: AURA_INSPECT_DESCRIPTION,
  inputSchema,
  execute: async (args: z.infer<typeof inputSchema>): Promise<string[]> => {
    try {
      const grid = parseGrid(args.grid);
      const rand = rngFromSeed(args.seed ?? `inspect|${args.grid}`);
      const reading = readGrid(grid, rand);
      return [formatInspect(renderGrid(grid), reading)];
    } catch (err) {
      console.error("aura_inspect_grid failed:", err);
      return ["Error: could not read that grid."];
    }
  },
};
