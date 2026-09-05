import { epithet, isChimera, parentNames, traits, type Cat } from "@/lib/meogen/genes";
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
        "polaroid tape text-left transition-transform duration-150",
        selected ? "polaroid--picked" : "",
      )}
    >
      <button type="button" onClick={onPick} className="w-full text-left">
        <div className="polaroid__shot">
          <CatPortrait cat={cat} className="mx-auto w-full max-w-40" seal />
        </div>
        <p className="plate mx-auto mt-2">{cat.name}</p>
        <p className="mt-1 text-center text-xs uppercase tracking-[0.14em] text-muted">
          {epithet(cat)}
          {role ? ` · ${role}` : ""}
        </p>
        <p className="mt-0.5 text-center text-xs text-subtle">
          gen {cat.gen}
          {chimera ? " · chimera" : ""}
          {cat.mutant ? " · mutant" : ""}
        </p>
        {line ? <p className="mt-0.5 text-center text-xs text-subtle">{line}</p> : null}
        <p className="mt-1 text-center text-xs tabular text-subtle">
          n{t.nerve} m{t.mass} l{t.luck}
          {(cat.alleyBest ?? 0) > 0 ? ` · alley ${cat.alleyBest}` : ""}
        </p>
        <div className="mt-2">
          <GeneStrip cat={cat} />
        </div>
      </button>
      {onLine && (
        <div className="mt-2 border-t-[3px] border-ink px-1 pt-2">
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
