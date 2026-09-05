import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CatParty } from "@/components/meogen/CatParty";
import { CatPortrait } from "@/components/meogen/CatPortrait";
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
      <p className="banner grotto__banner font-display tracking-wide">Meogen Cattery — New Mutants</p>
      <div className="cave-stage mt-6">
        <CatParty cats={PARTY} pickedId={pickedId} onPick={setPickedId} />
      </div>
      <div className="realms">
        <Link to="/cattery" search={{ dam: picked.id }} className="realm realm--vat">
          <span className="banner font-display tracking-wide">The Vat</span>
          <span className="realm__hint">Mix {picked.name} into a kit</span>
        </Link>
        <Link to="/alley" search={{ cat: picked.id }} className="realm realm--rift">
          <span className="banner font-display tracking-wide">The Alley</span>
          <span className="realm__hint">Send {picked.name} out</span>
        </Link>
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
