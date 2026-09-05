import { coatById, ORGANS, type Cat, type OrganOrigin } from "@/lib/meogen/genes";
import { cn } from "@/lib/utils";

const FROM: Record<OrganOrigin, string> = {
  dam: "dam",
  sire: "sire",
  mutant: "mutant",
  founder: "wild",
};

export function GeneStrip({ cat, showFrom }: { cat: Cat; showFrom?: boolean }) {
  return (
    <div className="flex flex-wrap gap-2">
      {ORGANS.map((organ) => {
        const coat = coatById(cat.coat[organ]);
        const trace = cat.trace?.find((t) => t.organ === organ);
        const from = trace?.from ?? "founder";
        return (
          <div key={organ} className="flex items-center gap-1.5">
            <span
              className="size-3 rounded-full border-2 border-ink"
              style={{ background: coat.hex }}
              title={`${organ} ${coat.name}`}
            />
            <span className="text-[11px] uppercase tracking-[0.14em] text-subtle">
              {organ}
            </span>
            {showFrom && (
              <span
                className={cn(
                  "text-[11px] uppercase tracking-[0.12em]",
                  from === "mutant" ? "text-accent" : "text-muted",
                )}
              >
                {FROM[from]}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
