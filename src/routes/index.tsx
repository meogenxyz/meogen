import { createFileRoute, Link } from "@tanstack/react-router";
import { CatPortrait } from "@/components/meogen/CatPortrait";
import { Button } from "@/components/ui/button";
import { FOUNDERS } from "@/lib/meogen/genes";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <p className="seal text-muted">Nursery</p>
      <h1 className="mt-3 max-w-xl font-display text-5xl italic leading-[1.05] sm:text-6xl">
        Meogen
      </h1>
      <p className="mt-4 max-w-lg text-lg text-muted">
        The gene that mews. Mix two cats. Send the kitten down the alley.
      </p>
      <p className="mt-2 max-w-lg text-sm text-subtle">
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
      <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {FOUNDERS.map((cat) => (
          <div key={cat.id} className="rounded-xl border border-border bg-surface/70 p-2">
            <CatPortrait cat={cat} />
            <p className="mt-1 text-center font-display italic">{cat.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
