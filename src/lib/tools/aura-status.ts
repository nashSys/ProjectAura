import { z } from "zod";

import { GLYPH_BANK_VERSION } from "~/lib/aura/glyphs";
import { lexiconChecksum, lexiconCounts, loadLexicon } from "~/lib/aura/lexicon";
import { priorChecksum } from "~/lib/aura/priors";
import { AURA_STATUS_DESCRIPTION } from "~/lib/constants";

const inputSchema = z.object({});

export const auraStatusTool = {
  name: "aura_status",
  description: AURA_STATUS_DESCRIPTION,
  inputSchema,
  execute: async (): Promise<string[]> => {
    const lex = loadLexicon();
    const counts = lexiconCounts();
    const countLines = Object.keys(counts)
      .sort((a, b) => Number(a) - Number(b))
      .map((n) => `  ${n}: ${counts[n]}`);
    return [[
      "board: clear",
      "cap: none",
      `lexicon_size: ${lex.size}`,
      `lexicon_checksum: ${lexiconChecksum()}`,
      `prior_checksum: ${priorChecksum().slice(0, 24)}`,
      `glyph_bank: ${GLYPH_BANK_VERSION}`,
      "counts:",
      ...countLines,
    ].join("\n")];
  },
};
