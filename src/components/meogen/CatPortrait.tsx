import { useMemo } from "react";
import { CAT_PARTS } from "@/lib/game/cats";
import { coatById, ORGANS, type Cat, type Organ } from "@/lib/meogen/genes";
import { cn } from "@/lib/utils";

function tint(svg: string, color: string) {
  return svg.replace("<svg", `<svg fill="${color}"`);
}

function src(svg: string) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

const SLOT: Record<Organ, string> = {
  head: "left-[18%] top-0 z-30 w-[64%]",
  body: "left-[22%] top-[28%] z-20 w-[56%]",
  tail: "right-0 top-[18%] z-10 w-[48%]",
  legs: "left-[16%] bottom-0 z-20 w-[68%]",
};

export function CatPortrait({
  cat,
  className,
  seal,
}: {
  cat: Cat;
  className?: string;
  seal?: boolean;
}) {
  const parts = useMemo(
    () =>
      ORGANS.map((organ) => ({
        organ,
        src: src(tint(CAT_PARTS[organ], coatById(cat.coat[organ]).hex)),
      })),
    [cat],
  );

  return (
    <div className={cn("relative aspect-square overflow-hidden", className)}>
      {parts.map((p) => (
        <img
          key={p.organ}
          alt=""
          src={p.src}
          className={cn("pointer-events-none absolute", SLOT[p.organ])}
        />
      ))}
      {seal && cat.mutant && (
        <span className="absolute right-2 top-2 rounded-sm bg-accent px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-accent-fg">
          mutant
        </span>
      )}
    </div>
  );
}
