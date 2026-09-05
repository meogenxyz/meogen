import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CatCard } from "@/components/meogen/CatCard";
import { CatPortrait } from "@/components/meogen/CatPortrait";
import { Button } from "@/components/ui/button";
import { useCattery } from "@/lib/meogen/store";

export const Route = createFileRoute("/cattery")({
  component: CatteryPage,
});

function CatteryPage() {
  const cats = useCattery((s) => s.cats);
  const bench = useCattery((s) => s.bench);
  const lastBorn = useCattery((s) => s.lastBorn);
  const mixing = useCattery((s) => s.mixing);
  const pick = useCattery((s) => s.pick);
  const breed = useCattery((s) => s.breed);
  const setMixing = useCattery((s) => s.setMixing);
  const reset = useCattery((s) => s.reset);
  const navigate = Route.useNavigate();
  const [note, setNote] = useState<string | null>(null);

  const dam = cats.find((c) => c.id === bench.damId) ?? null;
  const sire = cats.find((c) => c.id === bench.sireId) ?? null;
  const born = cats.find((c) => c.id === lastBorn) ?? null;
  const ready = Boolean(dam && sire && dam.id !== sire.id);

  const onMix = () => {
    if (!ready || mixing) return;
    setNote(null);
    setMixing(true);
    window.setTimeout(() => {
      const kitten = breed();
      setMixing(false);
      if (kitten) {
        setNote(
          kitten.mutant
            ? `${kitten.name} arrived. A gilt mutant.`
            : `${kitten.name} arrived. Gen ${kitten.gen}.`,
        );
      }
    }, 900);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <p className="seal text-muted">Cattery</p>
      <h1 className="mt-2 font-display text-4xl italic">Mix a litter</h1>
      <p className="mt-3 max-w-xl text-muted">
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
          <Button variant="accent" size="lg" disabled={!ready || mixing} onClick={onMix}>
            {mixing ? "Mixing…" : "Mix gene"}
          </Button>
          {note && <p className="mt-4 text-center text-sm text-fg">{note}</p>}
          {born && !mixing && (
            <div className="mt-3 flex w-full max-w-40 flex-col items-center gap-2">
              <CatPortrait cat={born} seal />
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate({ to: "/alley", search: { cat: born.id } })}
              >
                Send to alley
              </Button>
            </div>
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
          <h2 className="mt-1 font-display text-2xl italic">{cats.length} cats</h2>
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
            onPick={() => pick(cat.id)}
          />
        ))}
      </div>
    </div>
  );
}
