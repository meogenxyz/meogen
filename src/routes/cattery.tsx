import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CatCard, catLine } from "@/components/meogen/CatCard";
import { CatPortrait } from "@/components/meogen/CatPortrait";
import { MixReveal } from "@/components/meogen/MixReveal";
import { Button } from "@/components/ui/button";
import { useCattery, useCatteryReady } from "@/lib/meogen/store";

export const Route = createFileRoute("/cattery")({
  component: CatteryPage,
});

function CatteryPage() {
  const ready = useCatteryReady();
  const cats = useCattery((s) => s.cats);
  const bench = useCattery((s) => s.bench);
  const lastBorn = useCattery((s) => s.lastBorn);
  const mixing = useCattery((s) => s.mixing);
  const pick = useCattery((s) => s.pick);
  const breed = useCattery((s) => s.breed);
  const setMixing = useCattery((s) => s.setMixing);
  const reset = useCattery((s) => s.reset);
  const [showReveal, setShowReveal] = useState(false);

  const dam = cats.find((c) => c.id === bench.damId) ?? null;
  const sire = cats.find((c) => c.id === bench.sireId) ?? null;
  const born = cats.find((c) => c.id === lastBorn) ?? null;
  const readyMix = Boolean(dam && sire && dam.id !== sire.id);

  const onMix = () => {
    if (!readyMix || mixing) return;
    setShowReveal(false);
    setMixing(true);
    window.setTimeout(() => {
      breed();
      setMixing(false);
      setShowReveal(true);
    }, 900);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <p className="seal text-muted">Cattery</p>
      <h1 className="mt-2 font-display text-4xl italic text-balance">Mix a litter</h1>
      <p className="mt-3 max-w-xl text-pretty text-muted">
        Tap dam, tap sire, mix. Each organ rolls 50/50. Six percent gilt or wild coat.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-surface/80 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-muted">Dam</p>
          {dam ? (
            <CatPortrait cat={dam} className="mx-auto mt-2 max-w-44" />
          ) : (
            <p className="mt-8 text-center text-sm text-subtle">Pick a queen</p>
          )}
          <p className="mt-2 text-center font-display italic">{dam?.name ?? "—"}</p>
        </div>
        <div className="flex flex-col items-center justify-center rounded-xl border border-accent/40 bg-elevated/70 p-4">
          <Button variant="accent" size="lg" disabled={!readyMix || mixing} onClick={onMix}>
            {mixing ? "Mixing…" : "Mix gene"}
          </Button>
          {mixing && (
            <p className="mt-4 text-center text-sm text-muted">Organs choosing a parent.</p>
          )}
        </div>
        <div className="rounded-xl border border-border bg-surface/80 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-muted">Sire</p>
          {sire ? (
            <CatPortrait cat={sire} className="mx-auto mt-2 max-w-44" />
          ) : (
            <p className="mt-8 text-center text-sm text-subtle">Pick a tom</p>
          )}
          <p className="mt-2 text-center font-display italic">{sire?.name ?? "—"}</p>
        </div>
      </div>

      <div className="mt-10 flex items-end justify-between gap-4">
        <div>
          <p className="seal text-muted">Clowder</p>
          <h2 className="mt-1 font-display text-2xl italic">{ready ? cats.length : "—"} cats</h2>
        </div>
        <Button variant="ghost" size="sm" onClick={() => reset()}>
          Reset founders
        </Button>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {cats.map((cat) => (
          <CatCard
            key={cat.id}
            cat={cat}
            selected={cat.id === bench.damId || cat.id === bench.sireId}
            role={cat.id === bench.damId ? "dam" : cat.id === bench.sireId ? "sire" : null}
            line={catLine(cat, cats)}
            onPick={() => pick(cat.id)}
          />
        ))}
      </div>

      {showReveal && born && !mixing && (
        <MixReveal
          cat={born}
          dam={cats.find((c) => c.id === born.damId)}
          sire={cats.find((c) => c.id === born.sireId)}
          onClose={() => setShowReveal(false)}
        />
      )}
    </div>
  );
}
