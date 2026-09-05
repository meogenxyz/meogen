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
    chimera
      ? `<text x="28" y="40" fill="#14110e" font-size="18" font-family="Bangers, Impact, sans-serif">chimera</text>`
      : "",
    cat.mutant
      ? `<text x="28" y="${chimera ? 64 : 40}" fill="#c44532" font-size="18" font-family="Bangers, Impact, sans-serif">MUTANT</text>`
      : "",
  ].join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 460" width="420" height="460">
  <rect width="420" height="460" fill="#e7decc"/>
  <rect x="14" y="14" width="392" height="432" fill="#f4ead8" stroke="#14110e" stroke-width="4"/>
  ${parts}
  ${seals}
  <text x="210" y="400" text-anchor="middle" fill="#14110e" font-size="32" font-family="Bangers, Impact, sans-serif">${escapeXml(cat.name)}</text>
  <text x="210" y="424" text-anchor="middle" fill="#5c5348" font-size="12" font-family="Kalam, sans-serif">GEN ${cat.gen}  N${t.nerve} M${t.mass} L${t.luck}</text>
  <text x="210" y="444" text-anchor="middle" fill="#8a7f72" font-size="9" font-family="monospace">${genomeHex(cat)}</text>
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
