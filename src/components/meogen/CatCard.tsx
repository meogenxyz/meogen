import { isChimera, parentNames, traits, type Cat } from "@/lib/meogen/genes";
import { CatPortrait } from "@/components/meogen/CatPortrait";
import { GeneStrip } from "@/components/meogen/GeneStrip";
import { cn } from "@/lib/utils";

export function CatCard({
  cat,
  selected,
  role,
  onPick,
  onLine,
  line,
}: {
  cat: Cat;
  selected?: boolean;
  role?: "dam" | "sire" | null;
  onPick?: () => void;
  onLine?: () => void;
  line?: string | null;
}) {
  const chimera = isChimera(cat);
  const t = traits(cat);
  return (
    <article
      className={cn(
        "tape scrap text-left transition-transform duration-150",
        selected ? "rotate-0 bg-elevated" : "hover:-rotate-1",
        cat.mutant ? "outline outline-4 outline-offset-2 outline-accent" : "",
      )}
    >
      <button type="button" onClick={onPick} className="w-full p-3 text-left">
        <CatPortrait cat={cat} className="mx-auto w-full max-w-40" seal />
        <p className="mt-2 font-display text-2xl leading-tight tracking-wide text-balance">{cat.name}</p>
        <p className="mt-0.5 text-xs uppercase tracking-[0.14em] text-muted">
          gen {cat.gen}
          {chimera ? " · chimera" : ""}
          {cat.mutant ? " · mutant" : ""}
          {role ? ` · ${role}` : ""}
        </p>
        {line ? <p className="mt-0.5 text-xs text-subtle">{line}</p> : null}
        <p className="mt-1 text-xs tabular text-subtle">
          n{t.nerve} m{t.mass} l{t.luck}
          {(cat.alleyBest ?? 0) > 0 ? ` · alley ${cat.alleyBest}` : ""}
        </p>
        <div className="mt-2">
          <GeneStrip cat={cat} />
        </div>
      </button>
      {onLine && (
        <div className="border-t-[3px] border-ink px-3 py-2">
          <button
            type="button"
            onClick={onLine}
            className="min-h-11 w-full text-left font-display text-base tracking-wide text-subtle hover:text-fg"
          >
            Line
          </button>
        </div>
      )}
    </article>
  );
}

export function catLine(cat: Cat, cats: Cat[]) {
  return parentNames(cat, cats);
}
