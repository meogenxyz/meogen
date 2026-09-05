import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { CatCard, catLine } from "@/components/meogen/CatCard";
import { CatPortrait } from "@/components/meogen/CatPortrait";
import { LineageSheet } from "@/components/meogen/LineageSheet";
import { MixForecast } from "@/components/meogen/MixForecast";
import { MixReveal } from "@/components/meogen/MixReveal";
import { Button } from "@/components/ui/button";
import { isChimera, isFounder } from "@/lib/meogen/genes";
import { tapSfx } from "@/lib/meogen/sfx";
import { useCattery, useCatteryReady } from "@/lib/meogen/store";
import { cn } from "@/lib/utils";

type Search = { dam?: string; sire?: string };

type Drawer = "all" | "founders" | "kits" | "mutant" | "chimera" | "marks";

const DRAWERS: { id: Drawer; label: string }[] = [
  { id: "all", label: "All" },
  { id: "founders", label: "Founders" },
  { id: "kits", label: "Kits" },
  { id: "mutant", label: "Mutant" },
  { id: "chimera", label: "Chimera" },
  { id: "marks", label: "Marks" },
];

export const Route = createFileRoute("/cattery")({
  validateSearch: (raw: Record<string, unknown>): Search => ({
    dam: typeof raw.dam === "string" ? raw.dam : undefined,
    sire: typeof raw.sire === "string" ? raw.sire : undefined,
  }),
  component: CatteryPage,
});

function CatteryPage() {
  const ready = useCatteryReady();
  const { dam: damQ, sire: sireQ } = Route.useSearch();
  const cats = useCattery((s) => s.cats);
  const bench = useCattery((s) => s.bench);
  const lastBorn = useCattery((s) => s.lastBorn);
  const mixing = useCattery((s) => s.mixing);
  const pick = useCattery((s) => s.pick);
  const assign = useCattery((s) => s.assign);
  const breed = useCattery((s) => s.breed);
  const setMixing = useCattery((s) => s.setMixing);
  const reset = useCattery((s) => s.reset);
  const [showReveal, setShowReveal] = useState(false);
  const [inspectId, setInspectId] = useState<string | null>(null);
  const [drawer, setDrawer] = useState<Drawer>("all");

  useEffect(() => {
    if (!ready) return;
    if (damQ) assign("dam", damQ);
    if (sireQ) assign("sire", sireQ);
  }, [ready, damQ, sireQ, assign]);

  const dam = cats.find((c) => c.id === bench.damId) ?? null;
  const sire = cats.find((c) => c.id === bench.sireId) ?? null;
  const born = cats.find((c) => c.id === lastBorn) ?? null;
  const inspect = cats.find((c) => c.id === inspectId) ?? null;
  const readyMix = Boolean(dam && sire && dam.id !== sire.id);

  const shown = useMemo(() => {
    switch (drawer) {
      case "founders":
        return cats.filter(isFounder);
      case "kits":
        return cats.filter((c) => !isFounder(c));
      case "mutant":
        return cats.filter((c) => c.mutant);
      case "chimera":
        return cats.filter(isChimera);
      case "marks":
        return cats.filter((c) => (c.alleyBest ?? 0) > 0);
      default:
        return cats;
    }
  }, [cats, drawer]);

  const onMix = () => {
    if (!readyMix || mixing) return;
    setShowReveal(false);
    setInspectId(null);
    setMixing(true);
    tapSfx("mix");
    window.setTimeout(() => {
      breed();
      setMixing(false);
      setShowReveal(true);
    }, 420);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <p className="seal text-muted">Cattery</p>
      <h1 className="mt-2 font-display text-4xl italic text-balance">Mix a kit</h1>
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
          {dam && sire && dam.id !== sire.id && <MixForecast dam={dam} sire={sire} />}
          {dam && sire && dam.id === sire.id && (
            <p className="mt-3 text-center text-sm text-muted">Pick two different cats.</p>
          )}
          {mixing && <p className="mt-3 text-center text-sm text-muted">Organs choosing a parent.</p>}
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

      <div className="mt-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="seal text-muted">Clowder</p>
          <h2 className="mt-1 font-display text-2xl italic">{ready ? cats.length : "—"} cats</h2>
        </div>
        <Button variant="ghost" size="sm" onClick={() => reset()}>
          Reset founders
        </Button>
      </div>
      <div className="mt-3 flex flex-wrap gap-1">
        {DRAWERS.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => setDrawer(d.id)}
            className={cn(
              "min-h-11 rounded-sm px-3 text-sm transition-colors duration-150",
              drawer === d.id ? "bg-elevated text-fg" : "text-muted hover:text-fg",
            )}
          >
            {d.label}
          </button>
        ))}
      </div>
      {shown.length === 0 ? (
        <p className="mt-8 text-sm text-muted">None in this drawer.</p>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {shown.map((cat) => (
            <CatCard
              key={cat.id}
              cat={cat}
              selected={cat.id === bench.damId || cat.id === bench.sireId}
              role={cat.id === bench.damId ? "dam" : cat.id === bench.sireId ? "sire" : null}
              line={catLine(cat, cats)}
              onPick={() => pick(cat.id)}
              onLine={() => setInspectId(cat.id)}
            />
          ))}
        </div>
      )}

      {showReveal && born && !mixing && (
        <MixReveal
          cat={born}
          dam={cats.find((c) => c.id === born.damId)}
          sire={cats.find((c) => c.id === born.sireId)}
          onClose={() => setShowReveal(false)}
        />
      )}
      {inspect && !showReveal && (
        <LineageSheet
          cat={inspect}
          cats={cats}
          onClose={() => setInspectId(null)}
          onDam={() => {
            assign("dam", inspect.id);
            setInspectId(null);
          }}
          onSire={() => {
            assign("sire", inspect.id);
            setInspectId(null);
          }}
        />
      )}
    </div>
  );
}
