import { AURA_SKILL_BODY } from "~/lib/constants";
import { glyphsText } from "./glyphs";
import { lexiconIndexText } from "./lexicon";
import { priorTableText } from "./priors";

export const AURA_SKILL_URI = "skill://aura/SKILL.md";
export const AURA_PRIORS_URI = "aura://priors";
export const AURA_GLYPHS_URI = "aura://glyphs";
export const AURA_LEXICON_URI = "aura://lexicon/index";

export function resolveAuraUri(uri: string): { text: string; mimeType: string } | null {
  const normalized = uri.trim();
  if (normalized === AURA_SKILL_URI) {
    return { text: AURA_SKILL_BODY, mimeType: "text/markdown" };
  }
  if (normalized === AURA_PRIORS_URI) {
    return { text: priorTableText(), mimeType: "text/markdown" };
  }
  if (normalized === AURA_GLYPHS_URI) {
    return { text: glyphsText(), mimeType: "text/plain" };
  }
  if (normalized === AURA_LEXICON_URI) {
    return { text: lexiconIndexText(), mimeType: "text/markdown" };
  }
  return null;
}
