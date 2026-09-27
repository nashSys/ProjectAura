# ProjectAura

Ouija MCP. RNG 12x12 grids become a word. The word is pulled toward a Wordnik-cut lexicon of things said across a table: wait, stay, sorry, careful, home. Not a prophecy. No daily cap.

Same shape as `nashSys/ResuMaxx` and `nashSys/experimental`: Next 16, pnpm, `mcp-handler`, tools under `src/lib/tools`.

## Tools

- `draw_aura` `{ session?, draw?, seed?, length?, min_length?, max_length?, include_grids?, include_trace? }`
- `aura_replay` `{ seed, session?, draw?, include_grids?, include_trace? }`
- `aura_inspect_grid` `{ grid, seed? }`
- `aura_status`

Output leads with `word` and `presence`. High presence means the letters sat like ordinary speech. Low presence means the glass slipped. `session` salts a sitting. It does not carry letters forward and it does not read the question.

## Lexicon

Wordnik wordlist, length 3-12, cut to a board voice. Costume-shop stems (ghost, zombie, halloween, ouija, and the rest of that pile) are out. Reassurances and warnings stay.

## Run

```
pnpm install
pnpm dev
```

MCP URL: `http://localhost:3000/api/mcp`

Skill resource: `skill://aura/SKILL.md`

SEP-2640 `skills/list` / `skills/get` are not declared. `@modelcontextprotocol/server` 2.x and `mcp-handler` 2.1.1 do not ship those methods yet. The skill is a resource, same as seeing-well.
