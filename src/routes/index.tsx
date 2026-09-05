import { createFileRoute, Link } from "@tanstack/react-router";
import { CatPortrait } from "@/components/meogen/CatPortrait";
import { Button } from "@/components/ui/button";
import { FOUNDERS } from "@/lib/meogen/genes";
import { useCattery, useCatteryReady } from "@/lib/meogen/store";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const ready = useCatteryReady();
  const cats = useCattery((s) => s.cats);
  const born = ready ? Math.max(0, cats.length - FOUNDERS.length) : 0;
  const best = ready ? cats.reduce((m, c) => Math.max(m, c.alleyBest ?? 0), 0) : 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <p className="seal text-muted">Nursery</p>
      <h1 className="mt-3 max-w-xl font-display text-5xl italic leading-[1.05] text-balance sm:text-6xl">
        Meogen
      </h1>
      <p className="mt-4 max-w-lg text-lg text-pretty text-muted">
        The gene that mews. Mix two cats. Send the kitten down the alley.
      </p>
      <p className="mt-2 max-w-lg text-sm text-pretty text-subtle">
        Not Mewgenics. Not Tetris. A cattery first. Chain later.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button variant="accent" size="lg" asChild>
          <Link to="/cattery">Open the cattery</Link>
        </Button>
        <Button variant="outline" size="lg" asChild>
          <Link to="/alley">Run the alley</Link>
        </Button>
      </div>
      {ready && (born > 0 || best > 0) && (
        <p className="mt-6 text-sm tabular text-muted">
          {cats.length} in the clowder
          {born > 0 ? ` · ${born} born here` : ""}
          {best > 0 ? ` · alley ${best}` : ""}
        </p>
      )}
      <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {FOUNDERS.map((cat) => (
          <div key={cat.id} className="rounded-xl border border-border bg-surface/70 p-2">
            <CatPortrait cat={cat} />
            <p className="mt-1 text-center font-display italic">{cat.name}</p>
          </div>
        ))}
      </div>
      <ol className="mt-14 grid gap-4 sm:grid-cols-3">
        {[
          { n: "01", t: "Mix gene", d: "Dam and sire. Each organ rolls fifty-fifty." },
          { n: "02", t: "Kitten", d: "Six percent mutant. Chimera if the pelt splits." },
          { n: "03", t: "Alley", d: "Forty-five seconds. Nerve jumps. Mass lives." },
        ].map((step) => (
          <li key={step.n} className="rounded-xl border border-border bg-surface/60 p-4">
            <p className="seal text-accent">{step.n}</p>
            <h2 className="mt-2 font-display text-2xl italic">{step.t}</h2>
            <p className="mt-1 text-sm text-pretty text-muted">{step.d}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
