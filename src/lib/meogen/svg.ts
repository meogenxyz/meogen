import { CAT_PARTS, tintSvg } from "@/lib/game/cats";
import {
  coatById,
  genomeHex,
  isChimera,
  ORGANS,
  traits,
  type Cat,
  type Organ,
} from "@/lib/meogen/genes";

const SLOT: Record<Organ, { x: number; y: number; s: number }> = {
  tail: { x: 210, y: 70, s: 220 },
  legs: { x: 40, y: 150, s: 280 },
  body: { x: 70, y: 90, s: 240 },
  head: { x: 55, y: 8, s: 250 },
};

/** Shareable SVG of the original organ parts. Not the on-chain seal. */
export function catPortraitSvg(cat: Cat): string {
  const chimera = isChimera(cat);
  const t = traits(cat);
  const parts = ORGANS.map((organ) => {
    const hex = coatById(cat.coat[organ]).hex;
    const inner = tintSvg(CAT_PARTS[organ], hex)
      .replace(/xmlns="http:\/\/www.w3.org\/2000\/svg"/, "")
      .replace("<svg", "<svg overflow='visible'");
    const sl = SLOT[organ];
    return `<g transform="translate(${sl.x} ${sl.y}) scale(${sl.s / 1000})">${inner}</g>`;
  }).join("");

  const seals = [
    chimera ? `<text x="24" y="36" fill="#f6ecdc" font-size="14" font-family="Georgia,serif" font-style="italic">chimera</text>` : "",
    cat.mutant ? `<text x="24" y="54" fill="#d4563a" font-size="12" font-family="sans-serif" letter-spacing="2">MUTANT</text>` : "",
  ].join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 460" width="420" height="460">
  <rect width="420" height="460" fill="#12101a"/>
  <rect x="18" y="18" width="384" height="424" rx="18" fill="#1e1a1c" stroke="#d4563a" stroke-width="3"/>
  ${parts}
  ${seals}
  <text x="210" y="400" text-anchor="middle" fill="#f6ecdc" font-size="28" font-family="Georgia,serif" font-style="italic">${escapeXml(cat.name)}</text>
  <text x="210" y="424" text-anchor="middle" fill="#b39a86" font-size="11" font-family="sans-serif" letter-spacing="2">GEN ${cat.gen}  N${t.nerve} M${t.mass} L${t.luck}</text>
  <text x="210" y="442" text-anchor="middle" fill="#7d6a5c" font-size="9" font-family="monospace">${genomeHex(cat)}</text>
</svg>`;
}

export function downloadCatSvg(cat: Cat) {
  const blob = new Blob([catPortraitSvg(cat)], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${cat.name.replace(/[^\w-]+/g, "_")}.svg`;
  a.click();
  URL.revokeObjectURL(url);
}

function escapeXml(s: string) {
  return s
    .replace(/&/g, "&" + "amp;")
    .replace(/</g, "&" + "lt;")
    .replace(/>/g, "&" + "gt;")
    .replace(/"/g, "&" + "quot;")
    .replace(/'/g, "&" + "apos;");
}
