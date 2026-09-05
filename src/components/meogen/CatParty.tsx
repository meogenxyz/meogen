import { Link } from "@tanstack/react-router";
import { CatPortrait } from "@/components/meogen/CatPortrait";
import { isLabNote, type Cat } from "@/lib/meogen/genes";

export function CatParty({ cats, line }: { cats: Cat[]; line: string }) {
  return (
    <div className="party">
      {cats.slice(0, 5).map((cat) => (
        <Link
          key={cat.id}
          to="/cattery"
          search={isLabNote(cat) ? {} : { dam: cat.id }}
          className="party__cat"
          aria-label={cat.name}
        >
          <CatPortrait cat={cat} seal />
        </Link>
      ))}
      <p className="bubble bubble--right font-display text-2xl tracking-wide sm:text-3xl">{line}</p>
    </div>
  );
}
