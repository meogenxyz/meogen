import { MUTANT_BPS, pairForecast, traits, type Cat } from "@/lib/meogen/genes";

function span(pair: [number, number]) {
  return pair[0] === pair[1] ? `${pair[0]}` : `${pair[0]}–${pair[1]}`;
}

export function MixForecast({ dam, sire }: { dam: Cat; sire: Cat }) {
  const f = pairForecast(dam, sire);
  const dt = traits(dam);
  const st = traits(sire);
  return (
    <div className="mt-4 w-full max-w-sm scrap bg-elevated p-3 text-left">
      <p className="font-display tracking-wide text-muted">Pairing</p>
      <ul className="mt-2 space-y-1.5">
        {f.organs.map((row) => (
          <li key={row.organ} className="flex items-center justify-between gap-2 text-sm">
            <span className="uppercase tracking-[0.14em] text-subtle">{row.organ}</span>
            <span className="flex items-center gap-2">
              <span
                className="size-3 rounded-full border-2 border-ink"
                style={{ background: row.dam.hex }}
                title={row.dam.name}
              />
              <span className="text-subtle">/</span>
              <span
                className="size-3 rounded-full border-2 border-ink"
                style={{ background: row.sire.hex }}
                title={row.sire.name}
              />
              <span className="w-16 text-right text-xs text-muted">
                {row.split ? "50 / 50" : row.dam.name}
              </span>
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs tabular text-subtle">
        nerve {span(f.nerve)} · mass {span(f.mass)}
        {f.chimeraLikely ? " · chimera likely" : ""}
      </p>
      <p className="mt-1 text-xs text-subtle">
        {MUTANT_BPS / 100}% mutant per organ. Dam n{dt.nerve} m{dt.mass} · sire n{st.nerve} m{st.mass}.
      </p>
    </div>
  );
}
