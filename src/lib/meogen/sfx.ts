let ac: AudioContext | null = null;

function ctx() {
  if (typeof window === "undefined") return null;
  const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!ac) ac = new Ctor();
  if (ac.state === "suspended") void ac.resume();
  return ac;
}

export type SfxKind = "leap" | "land" | "hit" | "mix" | "mark";

const TONE: Record<SfxKind, { f: number; d: number; type: OscillatorType; g: number }> = {
  leap: { f: 520, d: 0.09, type: "triangle", g: 0.05 },
  land: { f: 180, d: 0.08, type: "sine", g: 0.045 },
  hit: { f: 90, d: 0.14, type: "square", g: 0.04 },
  mix: { f: 330, d: 0.16, type: "triangle", g: 0.05 },
  mark: { f: 660, d: 0.22, type: "sine", g: 0.05 },
};

/** Tiny lab chirps. Unlock on a user gesture. */
export function tapSfx(kind: SfxKind) {
  const c = ctx();
  if (!c) return;
  const now = c.currentTime;
  const spec = TONE[kind];
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = spec.type;
  o.frequency.setValueAtTime(spec.f, now);
  if (kind === "leap") o.frequency.exponentialRampToValueAtTime(spec.f * 1.4, now + spec.d);
  if (kind === "land") o.frequency.exponentialRampToValueAtTime(90, now + spec.d);
  if (kind === "hit") o.frequency.exponentialRampToValueAtTime(50, now + spec.d);
  if (kind === "mix") o.frequency.exponentialRampToValueAtTime(520, now + spec.d);
  if (kind === "mark") o.frequency.exponentialRampToValueAtTime(880, now + spec.d);
  g.gain.setValueAtTime(spec.g, now);
  g.gain.exponentialRampToValueAtTime(0.0001, now + spec.d);
  o.connect(g);
  g.connect(c.destination);
  o.start(now);
  o.stop(now + spec.d + 0.02);
}
