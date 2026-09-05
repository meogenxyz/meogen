import { sittingCatSvg } from "@/lib/game/cats";
import { coatById, ORGANS, type Cat, type Organ } from "@/lib/meogen/genes";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

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
  const coats = useMemo(
    () => ({
      head: coatById(cat.coat.head).hex,
      body: coatById(cat.coat.body).hex,
      tail: coatById(cat.coat.tail).hex,
      legs: coatById(cat.coat.legs).hex,
    }),
    [cat],
  );
  const src = useMemo(() => {
    if (cat.art && visible.length >= ORGANS.length) return cat.art;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(sittingCatSvg(coats, visible))}`;
  }, [cat.art, coats, visible]);

  const framed = Boolean(cat.art && visible.length >= ORGANS.length);

  return (
    <div className={cn("relative overflow-hidden", framed ? "aspect-[3/4]" : "aspect-square", className)}>
      <img alt="" src={src} className="pointer-events-none mx-auto block h-full w-full object-cover organ-land" />
      {seal && cat.mutant && !framed && visible.length >= ORGANS.length && (
        <span className="absolute right-0 top-0 z-40 border-[3px] border-ink bg-accent px-1.5 py-0 font-display text-sm tracking-wide text-accent-fg">
          mutant
        </span>
      )}
    </div>
  );
}
