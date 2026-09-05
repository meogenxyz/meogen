import { useEffect, useRef, useState } from "react";
import { drawStandingCat, preloadCats } from "@/lib/game/cats";
import { catColors, coatById, traits, type Cat } from "@/lib/meogen/genes";
import { Button } from "@/components/ui/button";

type Obstacle = { x: number; w: number; h: number; live: boolean };

const RUN_MS = 45_000;
const GRAVITY = 2400;
const GROUND = 0.78;

export function AlleyRun({
  cat,
  onDone,
  onRetry,
}: {
  cat: Cat;
  onDone: (score: number) => void;
  onRetry: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hudRef = useRef<HTMLParagraphElement>(null);
  const [over, setOver] = useState<{ score: number; lives: number } | null>(null);
  const doneRef = useRef(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let cancelled = false;
    const t = traits(cat);
    const jumpV = -720 - t.nerve * 8;
    const baseSpeed = 260 + t.nerve * 6;
    const maxSpeed = 520;
    const lives0 = t.mass >= 24 ? 2 : 1;
    const luckSkip = t.luck / 100;
    const coats = {
      head: coatById(cat.coat.head).hex,
      body: coatById(cat.coat.body).hex,
      tail: coatById(cat.coat.tail).hex,
      legs: coatById(cat.coat.legs).hex,
    };

    let wantJump = false;
    let jumpBuf = 0;
    let coyote = 0;

    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW") {
        e.preventDefault();
        if (e.type === "keydown") wantJump = true;
      }
    };
    const onPtr = (e: PointerEvent) => {
      if (e.type === "pointerdown") {
        wantJump = true;
        e.preventDefault();
      }
    };
    const onPounce = () => {
      wantJump = true;
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKey);
    window.addEventListener("meogen-pounce", onPounce);
    canvas.addEventListener("pointerdown", onPtr);

    let w = 0;
    let h = 0;
    const fit = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.max(320, r.width);
      h = Math.max(220, r.height);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(canvas);

    const pool: Obstacle[] = Array.from({ length: 12 }, () => ({ x: 0, w: 36, h: 36, live: false }));
    let py = 0;
    let pvy = 0;
    let grounded = true;
    let dist = 0;
    let speed = baseSpeed;
    let spawnIn = 1.1;
    let lives = lives0;
    let invuln = 0;
    let elapsed = 0;
    let last = performance.now();
    let raf = 0;
    let finished = false;
    doneRef.current = false;
    let hudAcc = 0;

    const groundY = () => h * GROUND;

    const spawn = () => {
      const o = pool.find((p) => !p.live);
      if (!o) return;
      o.live = true;
      o.w = 28 + Math.random() * 22;
      o.h = 28 + Math.random() * 38;
      o.x = w + 40;
    };

    const end = (score: number) => {
      if (doneRef.current) return;
      doneRef.current = true;
      finished = true;
      setOver({ score, lives });
      onDoneRef.current(score);
    };

    const writeHud = (score: number, left: number) => {
      const el = hudRef.current;
      if (!el) return;
      el.textContent = `${score} · ${left}s · ${lives} life`;
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      let dt = (now - last) / 1000;
      last = now;
      if (dt > 0.1) dt = 0.1;
      if (finished) return;

      elapsed += dt * 1000;
      const left = Math.max(0, RUN_MS - elapsed);
      speed = Math.min(maxSpeed, baseSpeed + dist * 0.02);
      dist += speed * dt;

      jumpBuf = wantJump ? 0.12 : Math.max(0, jumpBuf - dt);
      wantJump = false;
      if (grounded) coyote = 0.09;
      else coyote = Math.max(0, coyote - dt);

      const gy = groundY();
      const pH = 52;
      const pW = 56;
      const pX = w * 0.18;

      if (jumpBuf > 0 && coyote > 0) {
        pvy = jumpV;
        grounded = false;
        jumpBuf = 0;
        coyote = 0;
      }
      pvy += GRAVITY * dt;
      py += pvy * dt;
      if (py >= gy - pH) {
        py = gy - pH;
        pvy = 0;
        grounded = true;
      } else grounded = false;

      spawnIn -= dt;
      const minGap = Math.max(0.85, (180 + speed * 0.35) / speed);
      if (spawnIn <= 0) {
        spawn();
        spawnIn = minGap + Math.random() * 0.35;
      }

      invuln = Math.max(0, invuln - dt);
      const pTop = py;
      const pBot = py + pH;
      const pL = pX;
      const pR = pX + pW;

      for (const o of pool) {
        if (!o.live) continue;
        o.x -= speed * dt;
        if (o.x + o.w < -20) {
          o.live = false;
          continue;
        }
        const oTop = gy - o.h;
        const hit = pR > o.x && pL < o.x + o.w && pBot > oTop && pTop < gy;
        if (hit && invuln <= 0) {
          if (Math.random() < luckSkip) {
            invuln = 0.4;
            continue;
          }
          lives -= 1;
          invuln = 0.9;
          if (lives <= 0) {
            end(Math.floor(dist / 10));
            return;
          }
        }
      }

      if (left <= 0) {
        end(Math.floor(dist / 10) + 80);
        return;
      }

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#1a1620";
      ctx.fillRect(0, 0, w, h);
      const sky = ctx.createLinearGradient(0, 0, 0, gy);
      sky.addColorStop(0, "#3a4e68");
      sky.addColorStop(1, "#1a1620");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, gy);
      ctx.fillStyle = "#e2c9a0";
      ctx.beginPath();
      ctx.arc(w * 0.82, h * 0.14, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#4d6a52";
      ctx.fillRect(0, gy, w, h - gy);
      ctx.fillStyle = "#2a2320";
      ctx.fillRect(0, gy, w, 4);

      const scroll = (dist * 0.4) % 48;
      ctx.fillStyle = "#6f8f74";
      for (let x = -scroll; x < w; x += 48) {
        ctx.fillRect(x, gy + 10, 18, 3);
      }

      for (const o of pool) {
        if (!o.live) continue;
        ctx.fillStyle = "#6a4a58";
        ctx.fillRect(o.x, gy - o.h, o.w, o.h);
        ctx.strokeStyle = "#171210";
        ctx.lineWidth = 2;
        ctx.strokeRect(o.x, gy - o.h, o.w, o.h);
        ctx.fillStyle = "#c9a06a";
        ctx.fillRect(o.x, gy - o.h, o.w, 4);
      }

      const bob = grounded ? Math.sin(dist / 18) * 2 : 0;
      const flash = invuln > 0 && Math.floor(now / 80) % 2 === 0;
      const size = 78;
      drawStandingCat(ctx, coats, pX + pW * 0.45, gy + bob, size, flash ? 0.45 : 1);

      hudAcc += dt;
      if (hudAcc > 0.2) {
        hudAcc = 0;
        writeHud(Math.floor(dist / 10), Math.ceil(left / 1000));
      }
    };

    void preloadCats(catColors(cat)).then(() => {
      if (cancelled) return;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKey);
      window.removeEventListener("meogen-pounce", onPounce);
      canvas.removeEventListener("pointerdown", onPtr);
      ro.disconnect();
    };
  }, [cat]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className="h-[52vh] min-h-56 w-full touch-none rounded-xl border border-border bg-ink"
      />
      <div className="pointer-events-none absolute inset-x-3 top-3 flex items-start justify-between text-sm">
        <p className="rounded-sm bg-ink/70 px-2 py-1 font-display italic">{cat.name}</p>
        <p ref={hudRef} className="rounded-sm bg-ink/70 px-2 py-1 tabular">
          0 · 45s · {traits(cat).mass >= 24 ? 2 : 1} life
        </p>
      </div>
      {over && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl bg-ink/70">
          <p className="font-display text-3xl italic tabular">{over.score}</p>
          <p className="text-sm text-muted">Wrote to the bloodline.</p>
          <Button variant="accent" onClick={onRetry}>
            Run again
          </Button>
        </div>
      )}
      <div className="mt-3 flex flex-col items-center gap-2 sm:hidden">
        <Button
          variant="accent"
          size="lg"
          className="min-h-12 w-full max-w-xs"
          onPointerDown={() => {
            window.dispatchEvent(new Event("meogen-pounce"));
          }}
        >
          Pounce
        </Button>
      </div>
      <p className="mt-3 text-center text-sm text-muted">
        Tap or space to pounce. Forty-five seconds in the alley.
      </p>
    </div>
  );
}
