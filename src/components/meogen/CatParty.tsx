import { CatPortrait } from "@/components/meogen/CatPortrait";
import { epithet, partyLine, type Cat } from "@/lib/meogen/genes";
import { cn } from "@/lib/utils";

export function CatParty({
  cats,
  pickedId,
  onPick,
}: {
  cats: Cat[];
  pickedId: string;
  onPick: (id: string) => void;
}) {
  const lineup = cats.slice(0, 6);
  const picked = lineup.find((c) => c.id === pickedId) ?? lineup[0]!;
  return (
    <div>
      <div className="mutant-row">
        {lineup.map((cat) => {
          const selected = cat.id === pickedId;
          return (
            <button
              key={cat.id}
              type="button"
              className={cn("tarot", selected && "is-picked")}
              onClick={() => onPick(cat.id)}
              aria-pressed={selected}
              aria-label={`${cat.name}, ${epithet(cat)}`}
            >
              <CatPortrait cat={cat} />
              <span className="plate mt-2">{cat.name}</span>
              <span className="mt-1 text-center text-xs text-pretty text-muted">{epithet(cat)}</span>
            </button>
          );
        })}
      </div>
      <p className="bubble mx-auto mt-5 max-w-md text-center font-display text-2xl tracking-wide sm:text-3xl">
        {partyLine(picked)}
      </p>
    </div>
  );
}
