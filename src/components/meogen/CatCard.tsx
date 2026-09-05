import { isChimera, parentNames, traits, type Cat } from "@/lib/meogen/genes";
import { CatPortrait } from "@/components/meogen/CatPortrait";
import { GeneStrip } from "@/components/meogen/GeneStrip";
import { cn } from "@/lib/utils";

export function CatCard({
  cat,
  selected,
  role,
  onPick,
  line,
}: {
  cat: Cat;
  selected?: boolean;
  role?: "dam" | "sire" | null;
  onPick?: () => void;
  line?: string | null;
}) {
  const chimera = isChimera(cat);
  const t = traits(cat);
  return (
    <button
      type="button"
      onClick={onPick}
      className={cn(
        "w-full rounded-xl border bg-surface p-3 text-left transition-colors duration-150",
        selected ? "border-accent" : "border-border hover:border-border-strong",
      )}
    >
      <CatPortrait cat={cat} className="mx-auto w-full max-w-40" seal />
      <p className="mt-2 font-display text-lg italic leading-tight text-balance">{cat.name}</p>
      <p className="mt-0.5 text-xs uppercase tracking-[0.18em] text-muted">
        gen {cat.gen}
        {chimera ? " · chimera" : ""}
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
  );
}

export function catLine(cat: Cat, cats: Cat[]) {
  return parentNames(cat, cats);
}
