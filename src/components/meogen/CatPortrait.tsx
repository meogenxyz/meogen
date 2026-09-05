import { useMemo } from "react";
import { tintedPartSrc } from "@/lib/game/cats";
import { coatById, ORGANS, type Cat, type Organ } from "@/lib/meogen/genes";
import { cn } from "@/lib/utils";

const SLOT: Record<Organ, string> = {
  head: "left-[14%] top-[-8%] z-30 w-[72%]",
  body: "left-[18%] top-[24%] z-20 w-[62%]",
  tail: "right-[-6%] top-[10%] z-10 w-[54%]",
  legs: "left-[10%] bottom-[-6%] z-20 w-[76%]",
};

export function CatPortrait({
  cat,
  className,
  seal,
  showOrgans,
}: {
  cat: Cat;
  className?: string;
  seal?: boolean;
  showOrgans?: Organ[];
}) {
  const visible = showOrgans ?? ORGANS;
  const parts = useMemo(
    () =>
      ORGANS.map((organ) => ({
        organ,
        src: tintedPartSrc(organ, coatById(cat.coat[organ]).hex),
      })),
    [cat],
  );

  return (
    <div className={cn("relative aspect-square overflow-visible", className)}>
      {parts
        .filter((p) => visible.includes(p.organ))
        .map((p) => (
          <img
            key={p.organ}
            alt=""
            src={p.src}
            className={cn("pointer-events-none absolute organ-land", SLOT[p.organ])}
          />
        ))}
      {seal && cat.mutant && visible.length >= ORGANS.length && (
        <span className="absolute right-0 top-0 z-40 border-[3px] border-ink bg-accent px-1.5 py-0 font-display text-sm tracking-wide text-accent-fg">
          mutant
        </span>
      )}
    </div>
  );
}
