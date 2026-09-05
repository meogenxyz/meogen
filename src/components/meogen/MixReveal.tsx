import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CatPortrait } from "@/components/meogen/CatPortrait";
import { GeneStrip } from "@/components/meogen/GeneStrip";
import { Button } from "@/components/ui/button";
import { coatById, genomeHex, isChimera, ORGANS, traits, type Cat } from "@/lib/meogen/genes";
import { tapSfx } from "@/lib/meogen/sfx";
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
  const [shown, setShown] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? ORGANS.length
      : 0,
  );
  const reduce =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (reduce) {
      setShown(ORGANS.length);
      return;
    }
    tapSfx("mix");
    setShown(1);
    let i = 1;
    const id = window.setInterval(() => {
      i += 1;
      setShown(i);
      if (i >= ORGANS.length) window.clearInterval(id);
    }, 280);
    return () => window.clearInterval(id);
  }, [cat.id, reduce]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const landed = shown >= ORGANS.length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/70 p-4 sm:items-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="mix-title"
    >
      <div
        className="max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-surface p-5 pt-8 shadow-soft"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="seal">Kitten</p>
        <h2 id="mix-title" className="mt-1 font-display text-3xl italic text-balance">
          {landed ? cat.name : "Organs choosing…"}
        </h2>
        <p className="mt-1 text-sm text-muted">
          Gen {cat.gen}
          {landed && chimera ? " · chimera" : ""}
          {landed && cat.mutant ? " · mutant" : ""}
          {dam && sire ? ` · ${dam.name} × ${sire.name}` : ""}
        </p>
        <CatPortrait
          cat={cat}
          className="mx-auto mt-6 max-w-56 py-8"
          seal={landed}
          showOrgans={ORGANS.slice(0, Math.max(shown, reduce ? 4 : shown))}
        />
        <div className="mt-4 space-y-2">
          {cat.trace.map((row, i) => {
            const coat = coatById(row.coatId);
            const open = i < shown;
            return (
              <div
                key={row.organ}
                className="flex items-center justify-between rounded-md border border-border bg-elevated/60 px-3 py-2 text-sm"
              >
                <span className="uppercase tracking-[0.16em] text-muted">{row.organ}</span>
                {open ? (
                  <span className="flex items-center gap-2 organ-land">
                    <span
                      className="size-3 rounded-full border border-border"
                      style={{ background: coat.hex }}
                    />
                    <span>{coat.name}</span>
                    <span className={row.from === "mutant" ? "text-accent" : "text-subtle"}>
                      {row.from}
                    </span>
                  </span>
                ) : (
                  <span className="text-subtle">…</span>
                )}
              </div>
            );
          })}
        </div>
        {landed && (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}
