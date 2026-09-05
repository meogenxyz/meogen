import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AlleyRun } from "@/components/meogen/AlleyRun";
import { CatCard } from "@/components/meogen/CatCard";
import { Button } from "@/components/ui/button";
import { traits } from "@/lib/meogen/genes";
import { useCattery } from "@/lib/meogen/store";

type Search = { cat?: string };

export const Route = createFileRoute("/alley")({
  validateSearch: (raw: Record<string, unknown>): Search => ({
    cat: typeof raw.cat === "string" ? raw.cat : undefined,
  }),
  component: AlleyPage,
});

function AlleyPage() {
  const { cat: catId } = Route.useSearch();
  const cats = useCattery((s) => s.cats);
  const recordAlley = useCattery((s) => s.recordAlley);
  const navigate = Route.useNavigate();
  const [runKey, setRunKey] = useState(0);
  const cat = useMemo(() => cats.find((c) => c.id === catId) ?? null, [cats, catId]);
  const t = cat ? traits(cat) : null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <p className="seal text-muted">Alley</p>
      <h1 className="mt-2 font-display text-4xl italic">Send a cat out</h1>
      <p className="mt-3 max-w-xl text-muted">
        Nerve lifts the pounce. Mass buys a second life. Luck sometimes slips a crate.
      </p>

      {!cat && (
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {cats.map((c) => (
            <CatCard
              key={c.id}
              cat={c}
              onPick={() => navigate({ search: { cat: c.id } })}
            />
          ))}
        </div>
      )}

      {cat && t && (
        <div className="mt-8 space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="font-display text-2xl italic">{cat.name}</p>
              <p className="text-sm text-muted">
                nerve {t.nerve} · mass {t.mass} · luck {t.luck}
                {cat.alleyBest ? ` · best ${cat.alleyBest}` : ""}
              </p>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/alley" search={{}}>
                Other cat
              </Link>
            </Button>
          </div>
          <AlleyRun
            key={`${cat.id}-${runKey}`}
            cat={cat}
            onDone={(score) => recordAlley(cat.id, score)}
            onRetry={() => setRunKey((n) => n + 1)}
          />
        </div>
      )}
    </div>
  );
}
