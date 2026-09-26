import { z } from "zod";

import { composeAura } from "~/lib/aura/compose";
import { formatDraw } from "~/lib/aura/format";
import { AURA_REPLAY_DESCRIPTION } from "~/lib/constants";

const inputSchema = z.object({
  seed: z.string().min(1).describe("Seed from a previous draw_aura result."),
  include_grids: z.boolean().optional(),
  include_trace: z.boolean().optional(),
});

export const auraReplayTool = {
  name: "aura_replay",
  description: AURA_REPLAY_DESCRIPTION,
  inputSchema,
  execute: async (args: z.infer<typeof inputSchema>): Promise<string[]> => {
    try {
      const draw = composeAura({ seed: args.seed });
      return [formatDraw(draw, { includeGrids: args.include_grids ?? false, includeTrace: args.include_trace ?? false })];
    } catch (err) {
      console.error("aura_replay failed:", err);
      return ["Error: could not replay that seed."];
    }
  },
};
