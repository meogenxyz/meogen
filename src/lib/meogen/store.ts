import { create } from "zustand";
import { persist } from "zustand/middleware";
import { FOUNDERS, mix, type Cat } from "@/lib/meogen/genes";

type Bench = { damId: string | null; sireId: string | null };

type State = {
  cats: Cat[];
  bench: Bench;
  lastBorn: string | null;
  mixing: boolean;
  pick: (id: string) => void;
  clearBench: () => void;
  breed: () => Cat | null;
  setMixing: (v: boolean) => void;
  recordAlley: (id: string, score: number) => void;
  reset: () => void;
};

export const useCattery = create<State>()(
  persist(
    (set, get) => ({
      cats: FOUNDERS,
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
          cats: FOUNDERS,
          bench: { damId: null, sireId: null },
          lastBorn: null,
          mixing: false,
        }),
    }),
    { name: "meogen-cattery-v1" },
  ),
);
