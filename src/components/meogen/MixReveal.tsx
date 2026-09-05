import { Link } from "@tanstack/react-router";
import { CatPortrait } from "@/components/meogen/CatPortrait";
import { GeneStrip } from "@/components/meogen/GeneStrip";
import { Button } from "@/components/ui/button";
import { coatById, genomeHex, isChimera, traits, type Cat } from "@/lib/meogen/genes";
import { downloadCatSvg } from "@/lib/meogen/svg";

export function MixReveal({
  cat,
  dam,
  sire,
  onClose,
}: {
  cat: Cat;
  dam?: Cat;
  sire?: Cat;
  onClose: () => void;
}) {
  const t = traits(cat);
  const chimera = isChimera(cat);
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/70 p-4 sm:items-center"
      onClick={onClose}
    >
      <div
        className="max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-surface p-5 pt-8 shadow-soft"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="seal">Kitten</p>
        <h2 className="mt-1 font-display text-3xl italic text-balance">{cat.name}</h2>
        <p className="mt-1 text-sm text-muted">
          Gen {cat.gen}
          {chimera ? " · chimera" : ""}
          {cat.mutant ? " · mutant" : ""}
          {dam && sire ? ` · ${dam.name} × ${sire.name}` : ""}
        </p>
        <CatPortrait cat={cat} className="mx-auto mt-6 max-w-56 py-8" seal />
        <div className="mt-4 space-y-2">
          {cat.trace.map((row) => {
            const coat = coatById(row.coatId);
            return (
              <div
                key={row.organ}
                className="flex items-center justify-between rounded-md border border-border bg-elevated/60 px-3 py-2 text-sm"
              >
                <span className="uppercase tracking-[0.16em] text-muted">{row.organ}</span>
                <span className="flex items-center gap-2">
                  <span
                    className="size-3 rounded-full border border-border"
                    style={{ background: coat.hex }}
                  />
                  <span>{coat.name}</span>
                  <span className={row.from === "mutant" ? "text-accent" : "text-subtle"}>
                    {row.from}
                  </span>
                </span>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-xs tabular text-subtle">
          nerve {t.nerve} · mass {t.mass} · luck {t.luck}
        </p>
        <p className="mt-1 break-all font-mono text-[10px] text-subtle">{genomeHex(cat)}</p>
        <div className="mt-4">
          <GeneStrip cat={cat} showFrom />
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          <Button variant="accent" asChild>
            <Link to="/alley" search={{ cat: cat.id }}>
              Send to alley
            </Link>
          </Button>
          <Button variant="outline" onClick={() => downloadCatSvg(cat)}>
            Save SVG
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Mix again
          </Button>
        </div>
      </div>
    </div>
  );
}
