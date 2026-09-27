export const SERVER_INSTRUCTIONS = `ProjectAura is a ouija board, not a prophet.

The host does not invent the word. Call draw_aura. Print the word and presence first. Presence 0 is the old raw 70. 100 is unchanged. High presence means the letters sat. Low presence means the glass barely cleared the floor. Do not moralize. Do not turn the word into counsel, dates, diagnoses, or a living person's name unless the letters already spell one.

For a sitting, pass the same session and increment draw. Session salts the RNG. It does not carry letters from the last word and it does not read the question. To repeat one draw, pass session and seed together.

If they ask why the board feels off, read the presence parts. If they ask to see the planchette grids, call again with include_grids true, or pass session and seed to aura_replay.

There is no daily cap. The glass stays clear.

Do not rewrite the word.`;

export const DRAW_AURA_DESCRIPTION =
  "Draw the board. Returns a word spelled from 12x12 binary grids, plus a presence score. Pass session to keep a sitting. Pass seed to repeat a draw. This is a ouija, not a prophecy.";

export const AURA_STATUS_DESCRIPTION =
  "Report lexicon size by length, prior checksum, and glyph bank version. Does not draw.";

export const AURA_INSPECT_DESCRIPTION =
  "Read one 12x12 grid through the seer and return the posterior over letters. Not a full draw.";

export const AURA_REPLAY_DESCRIPTION =
  "Replay a previous draw from its seed and session. Same pair always yields the same word.";

export const AURA_SKILL_BODY = `---
name: aura
description: Draw a word from the board. 12x12 grids become letters. The lexicon keeps the spelling close to what the other side would try to say.
---

# Aura

The board binds. The host reads. No cap.

## Process

1. Call draw_aura. Pass session for a sitting. Increment draw for the next word. Pass seed only to repeat one draw.
2. Print word and presence first.
3. Do not invent a second word. Do not add counsel, dates, diagnoses, or living names the letters did not spell.
4. If they ask why it feels wrong, read the presence parts. Low presence is a slip, not a warning.
`;
