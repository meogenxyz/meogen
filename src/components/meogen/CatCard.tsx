import { coatById, isChimera, ORGANS, traits, type Cat } from "@/lib/meogen/genes";
import { CatPortrait } from "@/components/meogen/CatPortrait";
import { cn } from "@/lib/utils";

export function CatCard({
  cat,
  selected,
  role,
  onPick,
}: {
  cat: Cat;
  selected?: boolean;
  role?: "dam" | "sire" | null;
  onPick?: () => void;
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
      <p className="mt-2 font-display text-lg italic leading-tight">{cat.name}</p>
      <p className="mt-0.5 text-xs uppercase tracking-[0.18em] text-muted">
        gen {cat.gen}
        {chimera ? " · chimera" : ""}
        {role ? ` · ${role}` : ""}
      </p>
      <p className="mt-1 text-xs text-subtle">
        n{t.nerve} m{t.mass} l{t.luck}
        {(cat.alleyBest ?? 0) > 0 ? ` · alley ${cat.alleyBest}` : ""}
      </p>
      <div className="mt-2 flex flex-wrap gap-1">
        {ORGANS.map((o) => (
          <span
            key={o}
            title={`${o} ${coatById(cat.coat[o]).name}`}
            className="size-3 rounded-full border border-border"
            style={{ background: coatById(cat.coat[o]).hex }}
          />
        ))}
      </div>
    </button>
  );
}
