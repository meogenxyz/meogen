import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { FOUNDERS, LAB_MUTANTS, mix, normalizeCat, type Cat } from "@/lib/meogen/genes";

type Bench = { damId: string | null; sireId: string | null };

type State = {
  cats: Cat[];
  bench: Bench;
  lastBorn: string | null;
  mixing: boolean;
  pick: (id: string) => void;
  assign: (role: "dam" | "sire", id: string) => void;
  clearBench: () => void;
  breed: () => Cat | null;
  setMixing: (v: boolean) => void;
  recordAlley: (id: string, score: number) => void;
  reset: () => void;
};

export const useCattery = create<State>()(
  persist(
    (set, get) => ({
      cats: [...FOUNDERS, ...LAB_MUTANTS],
      bench: { damId: null, sireId: null },
      lastBorn: null,
      mixing: false,
      pick: (id) => {
        const { bench } = get();
        if (bench.damId === id) {
          set({ bench: { ...bench, damId: null } });
          return;
        }
        if (bench.sireId === id) {
          set({ bench: { ...bench, sireId: null } });
          return;
        }
        if (!bench.damId) set({ bench: { ...bench, damId: id } });
        else if (!bench.sireId) set({ bench: { ...bench, sireId: id } });
        else set({ bench: { damId: bench.sireId, sireId: id } });
      },
      assign: (role, id) => {
        const { bench } = get();
        if (role === "dam") set({ bench: { ...bench, damId: id } });
        else set({ bench: { ...bench, sireId: id } });
      },
      clearBench: () => set({ bench: { damId: null, sireId: null } }),
      breed: () => {
        const { cats, bench } = get();
        const dam = cats.find((c) => c.id === bench.damId);
        const sire = cats.find((c) => c.id === bench.sireId);
        if (!dam || !sire || dam.id === sire.id) return null;
        const kitten = mix(dam, sire);
        set({
          cats: [kitten, ...cats],
          lastBorn: kitten.id,
          bench: { damId: null, sireId: null },
        });
        return kitten;
      },
      setMixing: (v) => set({ mixing: v }),
      recordAlley: (id, score) =>
        set({
          cats: get().cats.map((c) =>
            c.id === id ? { ...c, alleyBest: Math.max(c.alleyBest ?? 0, score) } : c,
          ),
        }),
      reset: () =>
        set({
          cats: [...FOUNDERS, ...LAB_MUTANTS],
          bench: { damId: null, sireId: null },
          lastBorn: null,
          mixing: false,
        }),
    }),
    {
      name: "meogen-cattery-v2",
      skipHydration: true,
      version: 3,
      merge: (persisted, current) => {
        const p = persisted as Partial<State> | undefined;
        const raw = (p?.cats ?? [...FOUNDERS, ...LAB_MUTANTS]).map(normalizeCat);
        const have = new Set(raw.map((c) => c.id));
        const cats = [
          ...raw.map((c) => {
            const lab = LAB_MUTANTS.find((m) => m.id === c.id);
            return lab ? { ...c, art: lab.art, name: lab.name, mutant: true } : c;
          }),
          ...LAB_MUTANTS.filter((m) => !have.has(m.id)),
        ];
        return {
          ...current,
          ...p,
          cats,
          mixing: false,
        };
      },
    },
  ),
);

export function useCatteryReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let alive = true;
    void Promise.resolve(useCattery.persist.rehydrate()).then(() => {
      if (alive) setReady(true);
    });
    return () => {
      alive = false;
    };
  }, []);
  return ready;
}
