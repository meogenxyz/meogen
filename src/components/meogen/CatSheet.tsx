import { CatPortrait } from "@/components/meogen/CatPortrait";
import { GeneStrip } from "@/components/meogen/GeneStrip";
import { Button } from "@/components/ui/button";
import { epithet, isChimera, traits, type Cat } from "@/lib/meogen/genes";

export function CatSheet({
  cat,
  role,
  onDam,
  onSire,
  onLine,
}: {
  cat: Cat;
  role?: "dam" | "sire" | null;
  onDam?: () => void;
  onSire?: () => void;
  onLine?: () => void;
}) {
  const t = traits(cat);
  const chimera = isChimera(cat);
  return (
    <aside className="sheet scrap p-4">
      <p className="banner font-display text-xl tracking-wide">{cat.name}</p>
      <p className="mt-2 text-sm text-muted">
        {epithet(cat)}
        {role ? ` · ${role}` : ""}
      </p>
      <p className="mt-0.5 text-xs text-subtle">
        gen {cat.gen}
        {chimera ? " · chimera" : ""}
        {cat.mutant ? " · mutant" : ""}
        {(cat.alleyBest ?? 0) > 0 ? ` · alley ${cat.alleyBest}` : ""}
      </p>
      <CatPortrait cat={cat} className="mx-auto mt-3 max-w-40" seal />
      <ul className="stat-row mt-3">
        <li>
          <span>N</span>
          {t.nerve}
        </li>
        <li>
          <span>M</span>
          {t.mass}
        </li>
        <li>
          <span>L</span>
          {t.luck}
        </li>
      </ul>
      <div className="mt-3">
        <GeneStrip cat={cat} />
      </div>
      {(onDam || onSire || onLine) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {onDam && (
            <Button variant="outline" size="sm" onClick={onDam}>
              Dam
            </Button>
          )}
          {onSire && (
            <Button variant="outline" size="sm" onClick={onSire}>
              Sire
            </Button>
          )}
          {onLine && (
            <Button variant="ghost" size="sm" onClick={onLine}>
              Line
            </Button>
          )}
        </div>
      )}
    </aside>
  );
}
