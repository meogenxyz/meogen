import { createFileRoute, Link } from "@tanstack/react-router";
import { CatParty } from "@/components/meogen/CatParty";
import { CatPortrait } from "@/components/meogen/CatPortrait";
import { Button } from "@/components/ui/button";
import {
  FOUNDER_NOTE,
  FOUNDERS,
  isLabNote,
  LAB_MUTANTS,
  PARTY,
  traits,
  type Cat,
} from "@/lib/meogen/genes";
import { useCattery, useCatteryReady } from "@/lib/meogen/store";

export const Route = createFileRoute("/")({
  component: Home,
});

function mutantWall(born: Cat[]): Cat[] {
  const wall = [...born.slice(0, 6)];
  for (const extra of LAB_MUTANTS) {
    if (wall.length >= 6) break;
    wall.push(extra);
  }
  return wall;
}

function Home() {
  const ready = useCatteryReady();
  const cats = useCattery((s) => s.cats);
  const born = ready ? Math.max(0, cats.length - FOUNDERS.length) : 0;
  const ranked = ready
    ? [...cats].filter((c) => (c.alleyBest ?? 0) > 0).sort((a, b) => b.alleyBest - a.alleyBest)
    : [];
  const mutants = ready ? cats.filter((c) => c.mutant) : [];
  const wall = mutantWall(mutants);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <p className="seal">Lab</p>
      <p className="banner mt-4 font-display text-5xl tracking-wide sm:text-6xl">Meogen</p>
      <p className="mt-3 max-w-lg text-pretty text-muted">
        Not Mewgenics. Original organs. Head, body, tail, legs. Mix until one comes out wrong.
      </p>
      <div className="mt-8">
        <CatParty cats={PARTY} line="Let’s mix!!!" />
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button variant="accent" size="lg" asChild>
          <Link to="/cattery">Mix a kit</Link>
        </Button>
        <Button variant="outline" size="lg" asChild>
          <Link to="/alley">Send one out</Link>
        </Button>
      </div>
      {ready && (
        <p className="mt-5 text-sm tabular text-muted">
          {cats.length} in the clowder
          {born > 0 ? ` · ${born} born here` : ""}
          {mutants.length ? ` · ${mutants.length} mutant` : ""}
          {ranked[0] ? ` · alley ${ranked[0].name} ${ranked[0].alleyBest}` : ""}
        </p>
      )}

      <section className="mt-14">
        <p className="banner font-display text-2xl tracking-wide">Mutants</p>
        <p className="mt-3 max-w-lg text-sm text-pretty text-muted">
          Six percent per organ. A gilt, or a coat the parents never wore. Keep it.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {wall.map((cat) => (
            <Link
              key={cat.id}
              to="/cattery"
              search={isLabNote(cat) ? {} : { dam: cat.id }}
              className="tape scrap p-2 hover:-rotate-1"
            >
              <CatPortrait cat={cat} seal />
              <p className="mt-1 text-center font-display text-xl tracking-wide">{cat.name}</p>
              <p className="mt-0.5 text-center text-xs text-subtle">
                {isLabNote(cat) ? "lab note" : `gen ${cat.gen}`}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <p className="banner font-display text-2xl tracking-wide">Founders</p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {FOUNDERS.map((cat) => {
            const t = traits(cat);
            return (
              <Link
                key={cat.id}
                to="/cattery"
                search={{ dam: cat.id }}
                className="tape scrap p-2 hover:-rotate-1"
              >
                <CatPortrait cat={cat} />
                <p className="mt-1 text-center font-display text-xl tracking-wide">{cat.name}</p>
                <p className="mt-0.5 text-center text-xs text-pretty text-subtle">
                  {FOUNDER_NOTE[cat.id]}
                </p>
                <p className="mt-1 text-center text-xs tabular text-subtle">
                  n{t.nerve} m{t.mass} l{t.luck}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <ol className="mt-14 grid gap-4 sm:grid-cols-3">
        {[
          { n: "01", t: "Mix gene", d: "Dam and sire. Each organ rolls fifty-fifty." },
          { n: "02", t: "Kit", d: "Six percent mutant. Chimera if the pelt splits." },
          { n: "03", t: "Alley", d: "Forty-five seconds. Nerve leaps. Mass lives." },
        ].map((step) => (
          <li key={step.n} className="scrap p-4">
            <p className="seal">{step.n}</p>
            <h2 className="mt-2 font-display text-3xl tracking-wide">{step.t}</h2>
            <p className="mt-1 text-sm text-pretty text-muted">{step.d}</p>
          </li>
        ))}
      </ol>
      {ranked.length > 0 && (
        <section className="mt-14">
          <p className="banner font-display text-2xl tracking-wide">Alley marks</p>
          <ol className="mt-4 space-y-2">
            {ranked.slice(0, 5).map((c, i) => (
              <li key={c.id}>
                <Link
                  to="/alley"
                  search={{ cat: c.id }}
                  className="flex items-center justify-between scrap px-4 py-3 hover:bg-elevated"
                >
                  <span className="font-display text-xl tracking-wide">
                    {i + 1}. {c.name}
                  </span>
                  <span className="tabular text-muted">{c.alleyBest}</span>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}
