import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ScrapField } from "@/components/layout/ScrapField";
import { MEOGEN } from "@/lib/meogen/links";
import { useCatteryReady } from "@/lib/meogen/store";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Lab" },
  { to: "/cattery", label: "Cattery" },
  { to: "/alley", label: "Alley" },
  { to: "/docs", label: "Codex" },
] as const;

const SOCIAL = [
  { href: MEOGEN.site, label: "meogen.xyz" },
  { href: MEOGEN.x, label: "X" },
  { href: MEOGEN.telegram, label: "Telegram" },
  { href: MEOGEN.github, label: "GitHub" },
] as const;

export function SiteShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  useCatteryReady();
  return (
    <div className="relative min-h-dvh text-fg">
      <ScrapField />
      <header className="sticky top-0 z-30 border-b-[3px] border-ink bg-surface/95 text-ink">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-baseline gap-2 text-ink">
            <span className="inline-block size-3 rounded-sm border-2 border-ink bg-accent" aria-hidden />
            <span className="font-display text-2xl tracking-wide sm:text-3xl">Meogen</span>
            <span className="hidden seal sm:inline">gene</span>
          </Link>
          <nav className="flex items-center gap-1 overflow-x-auto text-sm">
            {NAV.map((item) => {
              const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "min-h-11 rounded-sm px-2.5 py-1.5 font-display tracking-wide transition-colors duration-150",
                    active
                      ? "bg-ink text-accent-fg"
                      : "text-ink hover:bg-elevated",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main className="relative z-10">{children}</main>
      {pathname !== "/alley" && (
        <footer className="relative z-10 border-t-[3px] border-ink bg-ink/70">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <p className="font-display text-xl tracking-wide text-fg">{MEOGEN.tagline}</p>
              <p className="mt-1">Not Mewgenics. Original mix. Head, body, tail, legs.</p>
            </div>
            <nav className="flex flex-wrap items-center gap-x-4 gap-y-1">
              {SOCIAL.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted underline decoration-ink/30 underline-offset-4 hover:text-fg"
                >
                  {s.label}
                </a>
              ))}
            </nav>
          </div>
        </footer>
      )}
    </div>
  );
}
