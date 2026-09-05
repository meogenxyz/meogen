import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AlleyRun } from "@/components/meogen/AlleyRun";
import { CatCard, catLine } from "@/components/meogen/CatCard";
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
  const ranked = useMemo(
    () => [...cats].sort((a, b) => (b.alleyBest ?? 0) - (a.alleyBest ?? 0)),
    [cats],
  );
  const marks = ranked.filter((c) => (c.alleyBest ?? 0) > 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <p className="banner font-display text-3xl tracking-wide sm:text-4xl">The Alley</p>
      <h1 className="mt-4 font-display text-5xl tracking-wide text-balance">Send a cat out</h1>
      <p className="mt-3 max-w-xl text-pretty text-muted">
        Nerve lifts the leap. Mass buys a second life. Luck sometimes slips a crate. Leap to go —
        the clock waits.
      </p>
      {!cat && (
        <img
          src="/scenes/alley.jpg"
          alt="The alley cave."
          className="mt-6 aspect-[16/7] w-full border-[3px] border-ink object-cover"
        />
      )}
      {!cat && (
        <p className="mt-4 font-display text-xl tracking-wide text-muted">Click to pick a cat</p>
      )}

      {!cat && marks.length > 0 && (
        <section className="mt-8">
          <p className="banner font-display text-xl tracking-wide">Marks</p>
          <ol className="mt-3 space-y-2">
            {marks.slice(0, 6).map((c, i) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => navigate({ search: { cat: c.id } })}
                  className="flex w-full items-center justify-between scrap px-4 py-3 text-left hover:bg-elevated"
                >
                  <span className="font-display text-xl tracking-wide">
                    {i + 1}. {c.name}
                  </span>
                  <span className="tabular text-muted">{c.alleyBest}</span>
                </button>
              </li>
            ))}
          </ol>
        </section>
      )}

      {!cat && (
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {ranked.map((c) => (
            <CatCard
              key={c.id}
              cat={c}
              line={catLine(c, cats)}
              onPick={() => navigate({ search: { cat: c.id } })}
            />
          ))}
        </div>
      )}

      {cat && t && (
        <div className="mt-8 space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="font-display text-3xl tracking-wide">{cat.name}</p>
              <p className="text-sm tabular text-muted">
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
