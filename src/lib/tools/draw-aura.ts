import { z } from "zod";

import { composeAura } from "~/lib/aura/compose";
import { formatDraw } from "~/lib/aura/format";
import { MAX_LENGTH, MIN_LENGTH } from "~/lib/aura/length";
import { DRAW_AURA_DESCRIPTION } from "~/lib/constants";

const inputSchema = z.object({
  session: z
    .string()
    .min(1)
    .optional()
    .describe("Sitting id. Same sitting, new draw number. Does not carry letters forward."),
  draw: z
    .number()
    .int()
    .min(1)
    .optional()
    .describe("Draw index inside the sitting. Defaults to 1 when session is set and seed is omitted."),
  seed: z
    .string()
    .min(1)
    .optional()
    .describe("Repeat a draw. Omit to let the board pick a seed, or session+draw."),
  length: z
    .number()
    .int()
    .min(MIN_LENGTH)
    .max(MAX_LENGTH)
    .optional()
    .describe("Lock the word length."),
  min_length: z.number().int().min(MIN_LENGTH).max(MAX_LENGTH).optional(),
  max_length: z.number().int().min(MIN_LENGTH).max(MAX_LENGTH).optional(),
  include_grids: z
    .boolean()
    .optional()
    .describe("Print the 12x12 grids next to each letter."),
  include_trace: z
    .boolean()
    .optional()
    .describe("Print how each letter was placed."),
});

export const drawAuraTool = {
  name: "draw_aura",
  description: DRAW_AURA_DESCRIPTION,
  inputSchema,
  execute: async (args: z.infer<typeof inputSchema>): Promise<string[]> => {
    try {
      const draw = composeAura({
        seed: args.seed,
        session: args.session,
        draw: args.draw,
        length: args.length,
        minLength: args.min_length,
        maxLength: args.max_length,
      });
      return [
        formatDraw(draw, {
          includeGrids: args.include_grids ?? false,
          includeTrace: args.include_trace ?? false,
        }),
      ];
    } catch (err) {
      console.error("draw_aura failed:", err);
      return ["Error: the board could not finish a word."];
    }
  },
};
