import { Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { CatPortrait } from "@/components/meogen/CatPortrait";
import { GeneStrip } from "@/components/meogen/GeneStrip";
import { Button } from "@/components/ui/button";
import { byId, epithet, FOUNDER_NOTE, genomeHex, isChimera, traits, type Cat } from "@/lib/meogen/genes";
import { downloadCatSvg } from "@/lib/meogen/svg";

function Kin({ cat, label }: { cat?: Cat; label: string }) {
  return (
    <div className="scrap bg-elevated p-3">
      <p className="font-display tracking-wide text-muted">{label}</p>
      {cat ? (
        <>
          <CatPortrait cat={cat} className="mx-auto mt-1 max-w-28" />
          <p className="mt-1 text-center font-display text-lg tracking-wide">{cat.name}</p>
        </>
      ) : (
        <p className="mt-4 text-center text-sm text-subtle">—</p>
      )}
    </div>
  );
}

export function LineageSheet({
  cat,
  cats,
  onClose,
  onDam,
  onSire,
}: {
  cat: Cat;
  cats: Cat[];
  onClose: () => void;
  onDam: () => void;
  onSire: () => void;
}) {
  const dam = byId(cats, cat.damId);
  const sire = byId(cats, cat.sireId);
  const damDam = byId(cats, dam?.damId);
  const damSire = byId(cats, dam?.sireId);
  const sireDam = byId(cats, sire?.damId);
  const sireSire = byId(cats, sire?.sireId);
  const hasGrands = Boolean(damDam || damSire || sireDam || sireSire);
  const t = traits(cat);
  const chimera = isChimera(cat);
  const note = FOUNDER_NOTE[cat.id];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/70 p-4 sm:items-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="line-title"
    >
      <div
        className="max-h-[92dvh] w-full max-w-lg overflow-y-auto scrap bg-surface p-5 pt-8"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="banner font-display text-xl tracking-wide">Line</p>
        <h2 id="line-title" className="mt-3 font-display text-4xl tracking-wide text-balance">
          {cat.name}
        </h2>
        <p className="plate mt-2">{epithet(cat)}</p>
        <p className="mt-1 text-sm text-muted">
          Gen {cat.gen}
          {chimera ? " · chimera" : ""}
          {cat.mutant ? " · mutant" : ""}
          {dam && sire ? ` · ${dam.name} × ${sire.name}` : " · founder"}
        </p>
        {note && <p className="mt-2 text-sm text-pretty text-subtle">{note}</p>}
        <CatPortrait cat={cat} className="mx-auto mt-4 max-w-52 py-8" seal />
        <p className="mt-2 text-center text-xs tabular text-subtle">
          nerve {t.nerve} · mass {t.mass} · luck {t.luck}
          {cat.alleyBest ? ` · alley ${cat.alleyBest}` : ""}
        </p>
        <p className="mt-1 break-all text-center font-mono text-[10px] text-subtle">
          {genomeHex(cat)}
        </p>
        <div className="mt-4">
          <GeneStrip cat={cat} showFrom />
        </div>
        {(dam || sire) && (
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Kin cat={dam} label="Dam" />
            <Kin cat={sire} label="Sire" />
          </div>
        )}
        {hasGrands && (
          <div className="mt-4">
            <p className="text-xs uppercase tracking-[0.16em] text-muted">Prior generation</p>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <Kin cat={damDam} label="Dam’s dam" />
              <Kin cat={damSire} label="Dam’s sire" />
              <Kin cat={sireDam} label="Sire’s dam" />
              <Kin cat={sireSire} label="Sire’s sire" />
            </div>
          </div>
        )}
        <div className="mt-6 flex flex-wrap gap-2">
          <Button variant="accent" asChild>
            <Link to="/alley" search={{ cat: cat.id }}>
              Send to alley
            </Link>
          </Button>
          <Button variant="outline" onClick={onDam}>
            Use as dam
          </Button>
          <Button variant="outline" onClick={onSire}>
            Use as sire
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              void navigator.clipboard?.writeText(genomeHex(cat));
            }}
          >
            Copy genome
          </Button>
          <Button variant="ghost" onClick={() => downloadCatSvg(cat)}>
            Save SVG
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
