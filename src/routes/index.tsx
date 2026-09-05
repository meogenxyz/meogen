import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CatParty } from "@/components/meogen/CatParty";
import { CatPortrait } from "@/components/meogen/CatPortrait";
import { Button } from "@/components/ui/button";
import {
  epithet,
  FOUNDERS,
  PARTY,
  traits,
  type Cat,
} from "@/lib/meogen/genes";
import { useCattery, useCatteryReady } from "@/lib/meogen/store";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const ready = useCatteryReady();
  const cats = useCattery((s) => s.cats);
  const [pickedId, setPickedId] = useState(PARTY[0]!.id);
  const picked = PARTY.find((c) => c.id === pickedId) ?? PARTY[0]!;
  const born = ready ? cats.filter((c) => c.gen > 0 && !c.art) : [];
  const ranked = ready
    ? [...cats].filter((c) => (c.alleyBest ?? 0) > 0).sort((a, b) => b.alleyBest - a.alleyBest)
    : [];
  const mutants = ready ? cats.filter((c) => c.mutant) : [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <p className="banner font-display text-3xl tracking-wide sm:text-5xl">The Lab — New Mutants</p>
      <p className="mt-4 font-display text-xl tracking-wide text-muted">Click to pick a cat</p>
      <p className="mt-1 max-w-lg text-pretty text-sm text-subtle">
        Not Mewgenics. Original mutants. Mix until one comes out wrong.
      </p>
      <p className="bubble mt-4 max-w-lg text-base">
        Six came out of the vat. Keep the wrong ones.
      </p>
      <div className="mt-6">
        <CatParty cats={PARTY} pickedId={pickedId} onPick={setPickedId} />
      </div>
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="plate">{picked.name}</p>
          <p className="mt-2 text-sm text-muted">{epithet(picked)}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="accent" size="lg" asChild>
            <Link to="/cattery" search={{ dam: picked.id }}>
              Mix a kit
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link to="/alley" search={{ cat: picked.id }}>
              Send one out
            </Link>
          </Button>
        </div>
      </div>
      {ready && (
        <p className="mt-5 text-sm tabular text-muted">
          {cats.length} in the clowder
          {born.length > 0 ? ` · ${born.length} born here` : ""}
          {mutants.length ? ` · ${mutants.length} mutant` : ""}
          {ranked[0] ? ` · alley ${ranked[0].name} ${ranked[0].alleyBest}` : ""}
        </p>
      )}

      {born.length > 0 && (
        <section className="mt-14">
          <p className="banner font-display text-2xl tracking-wide">Born here</p>
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {born.slice(0, 6).map((cat: Cat) => (
              <Link
                key={cat.id}
                to="/cattery"
                search={{ dam: cat.id }}
                className="polaroid tape"
              >
                <div className="polaroid__shot">
                  <CatPortrait cat={cat} seal />
                </div>
                <p className="plate mx-auto mt-2">{cat.name}</p>
                <p className="mt-1 text-center text-xs text-subtle">{epithet(cat)}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-14">
        <p className="banner font-display text-2xl tracking-wide">Founders</p>
        <p className="mt-3 max-w-lg text-sm text-pretty text-muted">
          Six wild coats. Mix them with a mutant. Organs still roll fifty-fifty.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {FOUNDERS.map((cat) => {
            const t = traits(cat);
            return (
              <Link
                key={cat.id}
                to="/cattery"
                search={{ dam: cat.id }}
                className="polaroid tape"
              >
                <div className="polaroid__shot">
                  <CatPortrait cat={cat} />
                </div>
                <p className="plate mx-auto mt-2">{cat.name}</p>
                <p className="mt-1 text-center text-xs text-pretty text-subtle">{epithet(cat)}</p>
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
