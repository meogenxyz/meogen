export type Organ = "head" | "body" | "tail" | "legs";

export const ORGANS: Organ[] = ["head", "body", "tail", "legs"];

export type Coat = {
  id: number;
  name: string;
  hex: string;
};

export const COATS: Coat[] = [
  { id: 0, name: "Ink", hex: "#171210" },
  { id: 1, name: "Clay", hex: "#d4563a" },
  { id: 2, name: "Paper", hex: "#f6ecdc" },
  { id: 3, name: "Moss", hex: "#4d6a52" },
  { id: 4, name: "Dusk", hex: "#6a4a58" },
  { id: 5, name: "Sky", hex: "#3a4e68" },
  { id: 6, name: "Fawn", hex: "#e8c9a0" },
  { id: 7, name: "Calico", hex: "#c47a3a" },
  { id: 8, name: "Sage", hex: "#6f8f74" },
  { id: 9, name: "Coal", hex: "#2a2320" },
  { id: 10, name: "Snow", hex: "#fff6ee" },
  { id: 11, name: "Gilt", hex: "#c9a06a" },
];

export const GILT_ID = 11;
export const MUTANT_BPS = 600; // 6% per organ

export type OrganOrigin = "dam" | "sire" | "mutant" | "founder";

export type MixTrace = {
  organ: Organ;
  from: OrganOrigin;
  coatId: number;
};

export type Cat = {
  id: string;
  name: string;
  gen: number;
  damId: string | null;
  sireId: string | null;
  coat: Record<Organ, number>;
  mutant: boolean;
  bornAt: number;
  alleyBest: number;
  trace: MixTrace[];
  art?: string;
};

export type Traits = {
  nerve: number;
  mass: number;
  luck: number;
};

export function traits(cat: Cat): Traits {
  const nerve = 10 + cat.coat.head + cat.coat.tail;
  const mass = 10 + cat.coat.body + cat.coat.legs;
  const luck = (cat.mutant ? 10 : 0) + (isChimera(cat) ? 6 : 2);
  return { nerve, mass, luck };
}

const PREFIX = ["Mei", "Pal", "Orr", "Nok", "Su", "Vic", "Loa", "Kin", "Azu", "Ren"];
const SUFFIX = ["gen", "meo", "lin", "kith", "row", "nome", "pel", "dam", "sire", "ow"];

export function coatById(id: number): Coat {
  return COATS[id] ?? COATS[0]!;
}

export function catColors(cat: Cat): string[] {
  return ORGANS.map((o) => coatById(cat.coat[o]).hex);
}

export function isChimera(cat: Cat) {
  const ids = ORGANS.map((o) => cat.coat[o]);
  return new Set(ids).size > 1;
}

export function isFounder(cat: Cat) {
  return cat.gen === 0;
}

function rng() {
  return Math.random();
}

function uid() {
  return `m_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`;
}

export function nameKitten(dam: Cat, sire: Cat, mutant: boolean) {
  const a =
    dam.name.replace(/[^A-Za-z]/g, "").slice(0, 3) || PREFIX[Math.floor(rng() * PREFIX.length)]!;
  const b =
    sire.name.replace(/[^A-Za-z]/g, "").slice(-3) || SUFFIX[Math.floor(rng() * SUFFIX.length)]!;
  const base = `${a}${b}`.replace(/^\w/, (c) => c.toUpperCase());
  return mutant ? `${base}*` : base;
}

export function mix(dam: Cat, sire: Cat): Cat {
  const coat = {} as Record<Organ, number>;
  const trace: MixTrace[] = [];
  let mutant = false;
  for (const organ of ORGANS) {
    let from: OrganOrigin = rng() < 0.5 ? "dam" : "sire";
    let id = from === "dam" ? dam.coat[organ] : sire.coat[organ];
    if (Math.floor(rng() * 10_000) < MUTANT_BPS) {
      mutant = true;
      from = "mutant";
      id = rng() < 0.45 ? GILT_ID : Math.floor(rng() * (COATS.length - 1));
    }
    coat[organ] = id;
    trace.push({ organ, from, coatId: id });
  }
  return {
    id: uid(),
    name: nameKitten(dam, sire, mutant),
    gen: Math.max(dam.gen, sire.gen) + 1,
    damId: dam.id,
    sireId: sire.id,
    coat,
    mutant,
    bornAt: Date.now(),
    alleyBest: 0,
    trace,
  };
}

export function founder(name: string, coat: Record<Organ, number>, seed: number): Cat {
  return {
    id: `f_${seed}`,
    name,
    gen: 0,
    damId: null,
    sireId: null,
    coat,
    mutant: false,
    bornAt: 0,
    alleyBest: 0,
    trace: ORGANS.map((organ) => ({ organ, from: "founder" as const, coatId: coat[organ] })),
  };
}

export const FOUNDERS: Cat[] = [
  founder("Mei", { head: 1, body: 1, tail: 1, legs: 1 }, 1),
  founder("Orrin", { head: 0, body: 0, tail: 0, legs: 0 }, 2),
  founder("Suki", { head: 2, body: 6, tail: 2, legs: 6 }, 3),
  founder("Nok", { head: 3, body: 8, tail: 3, legs: 8 }, 4),
  founder("Pal", { head: 5, body: 5, tail: 4, legs: 5 }, 5),
  founder("Vic", { head: 7, body: 0, tail: 7, legs: 9 }, 6),
];

export const FOUNDER_NOTE: Record<string, string> = {
  f_1: "Even clay. First queen.",
  f_2: "All ink. First tom.",
  f_3: "Paper over fawn.",
  f_4: "Moss with sage legs.",
  f_5: "Sky head, dusk tail.",
  f_6: "Calico face, coal body.",
};

export function labMutant(
  name: string,
  coat: Record<Organ, number>,
  seed: number,
  art: string,
): Cat {
  return {
    id: `lab_${seed}`,
    name,
    gen: 1,
    damId: null,
    sireId: null,
    coat,
    mutant: true,
    bornAt: 0,
    alleyBest: 0,
    art,
    trace: ORGANS.map((organ) => ({ organ, from: "mutant" as const, coatId: coat[organ] })),
  };
}

export const EPITHET: Record<string, string> = {
  f_1: "Clay Queen",
  f_2: "Ink Tom",
  f_3: "Paper Fawn",
  f_4: "Moss Legs",
  f_5: "Sky Dusk",
  f_6: "Calico Coal",
  lab_201: "The Alchemist Calico",
  lab_202: "The Two-Headed Siamese",
  lab_203: "The Cyber-Cat",
  lab_204: "The Winged Cat-Demon",
  lab_205: "The Rune-Cat",
  lab_206: "The Patchwork Scavenger",
};

export const PARTY_LINE: Record<string, string> = {
  f_1: "Even clay. Mix me.",
  f_2: "Let’s mix!!!",
  f_6: "Send me to the alley.",
  lab_201: "I mixed the vial. Keep it.",
  lab_202: "Two heads. One kit.",
  lab_203: "Circuit in the pelt.",
  lab_204: "Wings. Not a collar.",
  lab_205: "The runes came out.",
  lab_206: "Stitched. Still a cat.",
};

export function epithet(cat: Cat): string {
  if (EPITHET[cat.id]) return EPITHET[cat.id]!;
  if (cat.mutant && isChimera(cat)) return "Split Mutant";
  if (cat.mutant) return "Mutant Kit";
  if (isChimera(cat)) return "Chimera Kit";
  return `${coatById(cat.coat.head).name} Kit`;
}

export function partyLine(cat: Cat): string {
  return PARTY_LINE[cat.id] ?? (cat.mutant ? "It came out wrong. Keep it." : "Let’s mix!!!");
}

/** Named mutants. Illustrated cards — not the old organ sprites. Mixable. */
export const LAB_MUTANTS: Cat[] = [
  labMutant("Calix*", { head: 7, body: 1, tail: 6, legs: 7 }, 201, "/mutants/calix.jpg"),
  labMutant("Duet*", { head: 2, body: 9, tail: 2, legs: 9 }, 202, "/mutants/duet.jpg"),
  labMutant("Volt*", { head: 5, body: 9, tail: 5, legs: 9 }, 203, "/mutants/volt.jpg"),
  labMutant("Gale*", { head: 7, body: 0, tail: 7, legs: 0 }, 204, "/mutants/gale.jpg"),
  labMutant("Sigil*", { head: 1, body: 1, tail: 4, legs: 1 }, 205, "/mutants/sigil.jpg"),
  labMutant("Patch*", { head: 7, body: 9, tail: 11, legs: 2 }, 206, "/mutants/patch.jpg"),
];

export function isLabNote(cat: Cat) {
  return cat.id.startsWith("lab_");
}

export const PARTY: Cat[] = LAB_MUTANTS;
export function byId(cats: Cat[], id: string | null | undefined): Cat | undefined {
  if (!id) return undefined;
  return cats.find((c) => c.id === id);
}

export type OrganForecast = {
  organ: Organ;
  dam: Coat;
  sire: Coat;
  split: boolean;
};

export type PairForecast = {
  organs: OrganForecast[];
  chimeraLikely: boolean;
  nerve: [number, number];
  mass: [number, number];
};

/** Pairing odds before the 6% mutant roll. */
export function pairForecast(dam: Cat, sire: Cat): PairForecast {
  const organs = ORGANS.map((organ) => {
    const d = coatById(dam.coat[organ]);
    const s = coatById(sire.coat[organ]);
    return { organ, dam: d, sire: s, split: d.id !== s.id };
  });
  const nMin = 10 + Math.min(dam.coat.head, sire.coat.head) + Math.min(dam.coat.tail, sire.coat.tail);
  const nMax = 10 + Math.max(dam.coat.head, sire.coat.head) + Math.max(dam.coat.tail, sire.coat.tail);
  const mMin = 10 + Math.min(dam.coat.body, sire.coat.body) + Math.min(dam.coat.legs, sire.coat.legs);
  const mMax = 10 + Math.max(dam.coat.body, sire.coat.body) + Math.max(dam.coat.legs, sire.coat.legs);
  return {
    organs,
    chimeraLikely: organs.some((o) => o.split),
    nerve: [nMin, nMax],
    mass: [mMin, mMax],
  };
}

/** Packed genome. Matches MeogenNursery.sol
 *  bits 0-7 head, 8-15 body, 16-23 tail, 24-31 legs,
 *  32-39 generation, 40 mutant, 41 chimera, 48-111 entropy.
 */
export function packGenome(cat: Cat): bigint {
  let g = 0n;
  g |= BigInt(cat.coat.head & 0xff);
  g |= BigInt(cat.coat.body & 0xff) << 8n;
  g |= BigInt(cat.coat.tail & 0xff) << 16n;
  g |= BigInt(cat.coat.legs & 0xff) << 24n;
  g |= BigInt(Math.min(255, cat.gen) & 0xff) << 32n;
  if (cat.mutant) g |= 1n << 40n;
  if (isChimera(cat)) g |= 1n << 41n;
  let entropy = 0n;
  for (let i = 0; i < cat.id.length; i++) {
    entropy = (entropy * 31n + BigInt(cat.id.charCodeAt(i))) & 0xffff_ffff_ffff_ffffn;
  }
  g |= entropy << 48n;
  return g;
}

export function genomeHex(cat: Cat): string {
  return `0x${packGenome(cat).toString(16).padStart(28, "0")}`;
}

export function parentNames(cat: Cat, cats: Cat[]): string | null {
  if (!cat.damId || !cat.sireId) return null;
  const dam = cats.find((c) => c.id === cat.damId);
  const sire = cats.find((c) => c.id === cat.sireId);
  if (!dam || !sire) return "unknown line";
  return `${dam.name} × ${sire.name}`;
}

export function normalizeCat(raw: Cat): Cat {
  return {
    ...raw,
    alleyBest: raw.alleyBest ?? 0,
    trace:
      raw.trace ??
      ORGANS.map((organ) => ({
        organ,
        from: raw.gen === 0 ? ("founder" as const) : ("dam" as const),
        coatId: raw.coat[organ],
      })),
  };
}
