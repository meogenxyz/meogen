import { sittingCatSvg } from "@/lib/game/cats";
import { coatById, genomeHex, isChimera, traits, type Cat } from "@/lib/meogen/genes";

/** Shareable SVG of the sitting cat. Not the on-chain seal. */
export function catPortraitSvg(cat: Cat): string {
  const chimera = isChimera(cat);
  const t = traits(cat);
  const coats = {
    head: coatById(cat.coat.head).hex,
    body: coatById(cat.coat.body).hex,
    tail: coatById(cat.coat.tail).hex,
    legs: coatById(cat.coat.legs).hex,
  };
  const inner = sittingCatSvg(coats)
    .replace(/xmlns="http:\/\/www.w3.org\/2000\/svg"/, "")
    .replace("<svg", "<svg overflow='visible'");

  const seals = [
    chimera
      ? `<text x="28" y="40" fill="#14110e" font-size="18" font-family="Bangers, Impact, sans-serif">chimera</text>`
      : "",
    cat.mutant
      ? `<text x="28" y="${chimera ? 64 : 40}" fill="#c44532" font-size="18" font-family="Bangers, Impact, sans-serif">MUTANT</text>`
      : "",
  ].join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 520" width="420" height="520">
  <rect width="420" height="520" fill="#e7decc"/>
  <rect x="14" y="14" width="392" height="492" fill="#f4ead8" stroke="#14110e" stroke-width="4"/>
  <g transform="translate(90 40) scale(1.15)">${inner}</g>
  ${seals}
  <text x="210" y="455" text-anchor="middle" fill="#14110e" font-size="32" font-family="Bangers, Impact, sans-serif">${escapeXml(cat.name)}</text>
  <text x="210" y="482" text-anchor="middle" fill="#5c5348" font-size="12" font-family="Kalam, sans-serif">GEN ${cat.gen}  N${t.nerve} M${t.mass} L${t.luck}</text>
  <text x="210" y="502" text-anchor="middle" fill="#8a7f72" font-size="9" font-family="monospace">${genomeHex(cat)}</text>
</svg>`;
}

export function downloadCatSvg(cat: Cat) {
  if (cat.art) {
    const a = document.createElement("a");
    a.href = cat.art;
    a.download = `${cat.name.replace(/[^\w-]+/g, "_")}.jpg`;
    a.click();
    return;
  }
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
