import { createFileRoute, Link } from "@tanstack/react-router";
import { COATS, FOUNDER_NOTE, FOUNDERS, MUTANT_BPS, traits } from "@/lib/meogen/genes";
import { CHAIN, explorerAddress } from "@/lib/meogen/chain";

export const Route = createFileRoute("/docs")({
  component: Codex,
});

function Codex() {
  return (
    <div className="mx-auto max-w-2xl overflow-x-hidden px-4 py-12 sm:px-6">
      <p className="banner font-display text-3xl tracking-wide sm:text-4xl">The Codex</p>
      <p className="mt-4 font-display text-4xl tracking-wide">How the mix works</p>
      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[13rem_minmax(0,1fr)]">
        <img
          src="/scenes/codex.jpg"
          alt="Four organs on a sitting cat — head, body, tail, legs."
          className="w-full border-[3px] border-ink shadow-[3px_4px_0_var(--color-ink)]"
        />
        <div className="scrap space-y-8 bg-surface p-5 text-pretty sm:p-8">
        <section>
          <h2 className="font-display text-2xl tracking-wide text-ink">Four organs</h2>
          <p className="mt-2">
            Head, body, tail, legs. Each organ carries its own coat. Mix two cats; a mutant
            may wear a card of its own.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl tracking-wide text-ink">Fifty-fifty</h2>
          <p className="mt-2">
            Dam and sire. Every organ rolls. Half the queen, half the tom. If coats disagree, the
            kitten is a chimera — split face, split pelt.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl tracking-wide text-ink">Mutant</h2>
          <p className="mt-2">
            {MUTANT_BPS / 100}% per organ. Gilt, or a wild coat the parents never wore. Marked with
            a red seal. Keep it.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl tracking-wide text-ink">Traits</h2>
          <p className="mt-2">
            Nerve = 10 + head + tail. Lifts the leap. Mass = 10 + body + legs. Twenty-four or more
            buys a second life. Luck = 2, plus 6 if chimera, plus 10 if mutant. Luck sometimes
            slips a crate.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl tracking-wide text-ink">Alley</h2>
          <p className="mt-2">
            Leap to go. Forty-five seconds. Tap or space. Best score writes onto the cat as a mark.
            The clock does not start until the first leap.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl tracking-wide text-ink">Genome</h2>
          <p className="mt-2">
            Packed into a uint256. Named mutants keep their illustrated card. Mixed kits draw a
            sitting cat from the genome. The contract later mints a seal of the same genome.
          </p>
          <pre className="mt-3 w-full max-w-full overflow-x-auto border-[3px] border-ink bg-ink p-3 font-mono text-xs text-accent-fg">
            {`byte  0     1     2     3     4      5       6–13
      head  body  tail  legs  gen    flags   entropy
flags bit 0 mutant · bit 1 chimera`}
          </pre>
        </section>
        <section>
          <h2 className="font-display text-2xl tracking-wide text-ink">Founders</h2>
          <ul className="mt-3 space-y-2">
            {FOUNDERS.map((c) => {
              const t = traits(c);
              return (
                <li key={c.id} className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="text-fg">
                    <span className="font-display tracking-wide">{c.name}</span>
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
          <h2 className="font-display text-2xl tracking-wide text-ink">Coats</h2>
          <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {COATS.map((c) => (
              <li key={c.id} className="flex items-center gap-2 text-sm text-ink">
                <span
                  className="size-3 rounded-full border-2 border-ink"
                  style={{ background: c.hex }}
                />
                {c.name}
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="font-display text-2xl tracking-wide text-ink">Nursery</h2>
          <p className="mt-2">
            Live on Robinhood Chain ({CHAIN.id}). Mix fee goes to the vat contract, never a
            wallet. One-hour sleep. Founder cap 500. Symbol KIT — not the Pons ticker. Mix on
            this page still writes to this device until a wallet is wired.
          </p>
          <ul className="mt-3 space-y-1 text-sm">
            <li>
              Vat{" "}
              <a
                href={explorerAddress(CHAIN.vat)}
                className="break-all text-accent underline-offset-4 hover:underline"
              >
                {CHAIN.vat}
              </a>
            </li>
            <li>
              Nursery{" "}
              <a
                href={explorerAddress(CHAIN.nursery)}
                className="break-all text-accent underline-offset-4 hover:underline"
              >
                {CHAIN.nursery}
              </a>
            </li>
          </ul>
          <p className="mt-2">
            <a
              href="/contracts/MeogenVat.sol"
              className="text-accent underline-offset-4 hover:underline"
            >
              Download MeogenVat.sol
            </a>
            <span className="text-subtle"> · </span>
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
          <h2 className="font-display text-2xl tracking-wide text-ink">Later</h2>
          <p className="mt-2">
            Token after kittens travel. No merkle on day one. Not Mewgenics.
          </p>
        </section>
      </div>
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
