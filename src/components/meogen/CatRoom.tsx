import { CatPortrait } from "@/components/meogen/CatPortrait";
import { type Cat } from "@/lib/meogen/genes";
import { cn } from "@/lib/utils";

export function CatRoom({
  cats,
  damId,
  sireId,
  focusId,
  onPick,
}: {
  cats: Cat[];
  damId?: string | null;
  sireId?: string | null;
  focusId?: string | null;
  onPick: (id: string) => void;
}) {
  return (
    <div className="room" role="list">
      <div className="room__wall" aria-hidden>
        <span className="room__hang" />
        <span className="room__hang room__hang--two" />
        <span className="room__plant" />
      </div>
      <div className="room__floor" aria-hidden />
      <div className="room__cats">
        {cats.map((cat) => {
          const role = cat.id === damId ? "dam" : cat.id === sireId ? "sire" : null;
          const focused = cat.id === focusId;
          return (
            <button
              key={cat.id}
              type="button"
              role="listitem"
              className={cn("room__cat", focused && "is-focus", role && "is-picked")}
              onClick={() => onPick(cat.id)}
              aria-pressed={focused}
              aria-label={`${cat.name}${role ? `, ${role}` : ""}`}
            >
              <CatPortrait cat={cat} className="room__face" />
              <span className="plate">{cat.name}</span>
              {role ? <span className="room__role">{role}</span> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
