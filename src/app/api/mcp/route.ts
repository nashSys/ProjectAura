import type { z } from "zod";
import { createMcpHandler } from "mcp-handler";

import { AURA_SKILL_BODY, SERVER_INSTRUCTIONS } from "~/lib/constants";
import {
  AURA_GLYPHS_URI,
  AURA_LEXICON_URI,
  AURA_PRIORS_URI,
  AURA_SKILL_URI,
} from "~/lib/aura/resources";
import { glyphsText } from "~/lib/aura/glyphs";
import { lexiconIndexText } from "~/lib/aura/lexicon";
import { priorTableText } from "~/lib/aura/priors";
import { auraInspectGridTool } from "~/lib/tools/aura-inspect-grid";
import { auraReplayTool } from "~/lib/tools/aura-replay";
import { auraStatusTool } from "~/lib/tools/aura-status";
import { drawAuraTool } from "~/lib/tools/draw-aura";

export const maxDuration = 60;

const handler = createMcpHandler(
  (server) => {
    server.registerResource(
      "aura-skill",
      AURA_SKILL_URI,
      { title: "Aura skill", description: "Process for using the board.", mimeType: "text/markdown" },
      async (uri: URL) => ({ contents: [{ uri: uri.href, mimeType: "text/markdown", text: AURA_SKILL_BODY }] }),
    );

    server.registerResource(
      "aura-priors",
      AURA_PRIORS_URI,
      { title: "Aura priors", description: "Letter and digit prior table.", mimeType: "text/markdown" },
      async (uri: URL) => ({ contents: [{ uri: uri.href, mimeType: "text/markdown", text: priorTableText() }] }),
    );

    server.registerResource(
      "aura-glyphs",
      AURA_GLYPHS_URI,
      { title: "Aura glyphs", description: "12x12 template bank.", mimeType: "text/plain" },
      async (uri: URL) => ({ contents: [{ uri: uri.href, mimeType: "text/plain", text: glyphsText() }] }),
    );

    server.registerResource(
      "aura-lexicon-index",
      AURA_LEXICON_URI,
      { title: "Aura lexicon index", description: "Word counts by length. Not the full list.", mimeType: "text/markdown" },
      async (uri: URL) => ({ contents: [{ uri: uri.href, mimeType: "text/markdown", text: lexiconIndexText() }] }),
    );

    const registerTextTool = (
      tool: { name: string; description: string; inputSchema: z.ZodType },
      run: (args: never) => Promise<string[]>,
    ) => {
      server.registerTool(
        tool.name,
        {
          description: tool.description,
          inputSchema: tool.inputSchema,
          annotations: { readOnlyHint: true, openWorldHint: false, destructiveHint: false },
        },
        async (args: unknown) => {
          const blocks = await run(args as never);
          return { content: blocks.map((text) => ({ type: "text" as const, text })) };
        },
      );
    };

    registerTextTool(drawAuraTool, (args) => drawAuraTool.execute(args));
    registerTextTool(auraReplayTool, (args) => auraReplayTool.execute(args));
    registerTextTool(auraInspectGridTool, (args) => auraInspectGridTool.execute(args));
    registerTextTool(auraStatusTool, () => auraStatusTool.execute());
  },
  {
    instructions: SERVER_INSTRUCTIONS,
    serverInfo: { name: "project-aura", version: "0.1.0" },
  },
);

export { handler as GET, handler as POST, handler as DELETE };
