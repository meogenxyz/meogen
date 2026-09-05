import { createFileRoute, Link } from "@tanstack/react-router";
import { COATS, FOUNDER_NOTE, FOUNDERS, MUTANT_BPS, traits } from "@/lib/meogen/genes";

export const Route = createFileRoute("/docs")({
  component: Codex,
});

function Codex() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <p className="seal text-muted">Codex</p>
      <h1 className="mt-2 font-display text-4xl italic text-balance">How the mix works</h1>
      <div className="mt-8 space-y-8 text-pretty text-muted">
        <section>
          <h2 className="font-display text-2xl italic text-fg">Four organs</h2>
          <p className="mt-2">
            Head, body, tail, legs. Original cat parts that spill their frame. Each organ carries
            its own coat.
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
            {MUTANT_BPS / 100}% per organ. Gilt, or a wild coat the parents never wore. Marked with
            a red seal.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl italic text-fg">Traits</h2>
          <p className="mt-2">
            Nerve = 10 + head + tail. Lifts the leap. Mass = 10 + body + legs. Twenty-four or more
            buys a second life. Luck = 2, plus 6 if chimera, plus 10 if mutant. Luck sometimes
            slips a crate.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl italic text-fg">Alley</h2>
          <p className="mt-2">
            Leap to go. Forty-five seconds. Tap or space. Best score writes onto the cat as a mark.
            The clock does not start until the first leap.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl italic text-fg">Genome</h2>
          <p className="mt-2">
            Packed into a uint256. The site draws the original parts. The contract later mints a
            seal of the same genome.
          </p>
          <pre className="mt-3 overflow-x-auto rounded-lg border border-border bg-ink/50 p-3 font-mono text-xs text-fg">
            {`byte  0     1     2     3     4      5       6–13
      head  body  tail  legs  gen    flags   entropy
flags bit 0 mutant · bit 1 chimera`}
          </pre>
        </section>
        <section>
          <h2 className="font-display text-2xl italic text-fg">Founders</h2>
          <ul className="mt-3 space-y-2">
            {FOUNDERS.map((c) => {
              const t = traits(c);
              return (
                <li key={c.id} className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="text-fg">
                    <span className="font-display italic">{c.name}</span>
                    <span className="text-subtle"> — {FOUNDER_NOTE[c.id]}</span>
                  </span>
                  <span className="shrink-0 tabular text-subtle">
                    n{t.nerve} m{t.mass} l{t.luck}
                  </span>
                </li>
              );
            })}
          </ul>
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
            Remix file ready: MeogenNursery.sol. Mix fee goes to a vat contract, never a wallet.
            One-hour sleep. Founder cap 500. Not live. Cats on this page stay on this device.
          </p>
          <p className="mt-2">
            <a
              href="/contracts/MeogenNursery.sol"
              className="text-accent underline-offset-4 hover:underline"
            >
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
            Vat on Robinhood Chain. Token after kittens travel. No merkle on day one. Not Mewgenics.
          </p>
        </section>
      </div>
      <p className="mt-10 flex gap-4">
        <Link to="/cattery" className="text-accent underline-offset-4 hover:underline">
          Mix a kit
        </Link>
        <Link to="/alley" className="text-accent underline-offset-4 hover:underline">
          Run the alley
        </Link>
      </p>
    </div>
  );
}
