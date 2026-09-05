import { createFileRoute, Link } from "@tanstack/react-router";
import { COATS, MUTANT_BPS } from "@/lib/meogen/genes";

export const Route = createFileRoute("/docs")({
  component: Manual,
});

function Manual() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <p className="seal text-muted">Manual</p>
      <h1 className="mt-2 font-display text-4xl italic text-balance">How the mix works</h1>
      <div className="mt-8 space-y-8 text-pretty text-muted">
        <section>
          <h2 className="font-display text-2xl italic text-fg">Four organs</h2>
          <p className="mt-2">
            Head, body, tail, legs. The same original sprites that overflow a cell. Each organ
            carries its own coat.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl italic text-fg">Fifty-fifty</h2>
          <p className="mt-2">
            Dam and sire. Every organ rolls. Half the queen, half the tom. If coats disagree, the
            kitten is a chimera — split face, split pelt.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl italic text-fg">Mutant</h2>
          <p className="mt-2">
            {MUTANT_BPS / 100}% per organ. Gilt gold, or a wild coat the parents never wore. Marked
            with a vermilion seal.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl italic text-fg">Alley</h2>
          <p className="mt-2">
            Forty-five seconds. Tap to pounce. Head and tail make nerve (jump). Body and legs make
            mass (a second life if heavy). Mutants and chimeras slip crates. Best score writes onto
            the cat.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl italic text-fg">Genome</h2>
          <p className="mt-2">
            Packed into a uint256. Bytes: head, body, tail, legs, generation, flags, entropy. The
            site draws overflowing parts. The contract later mints a seal of the same genome.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl italic text-fg">Coats</h2>
          <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {COATS.map((c) => (
              <li key={c.id} className="flex items-center gap-2 text-sm text-fg">
                <span
                  className="size-3 rounded-full border border-border"
                  style={{ background: c.hex }}
                />
                {c.name}
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="font-display text-2xl italic text-fg">Nursery</h2>
          <p className="mt-2">
            Remix file ready: MeogenNursery.sol. Mix fee goes to a bowl contract, never a wallet.
            One-hour cooldown. Founder cap 500. Not live. Cats on this page stay on this device.
          </p>
          <p className="mt-2">
            <a href="/contracts/MeogenNursery.sol" className="text-accent underline-offset-4 hover:underline">
              Download MeogenNursery.sol
            </a>
            <span className="text-subtle"> · </span>
            <a href="/contracts/README.md" className="text-accent underline-offset-4 hover:underline">
              Remix notes
            </a>
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl italic text-fg">Later</h2>
          <p className="mt-2">
            Bowl on Robinhood Chain. Token after kittens travel. No merkle on day one. Not
            Mewgenics.
          </p>
        </section>
      </div>
      <p className="mt-10 flex gap-4">
        <Link to="/cattery" className="text-accent underline-offset-4 hover:underline">
          Mix a litter
        </Link>
        <Link to="/alley" className="text-accent underline-offset-4 hover:underline">
          Run the alley
        </Link>
      </p>
    </div>
  );
}
