import { useEffect, useRef, useState } from "react";
import { coatById, traits, type Cat } from "@/lib/meogen/genes";
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
  const [hud, setHud] = useState({ score: 0, left: RUN_MS / 1000, lives: 1, over: false });
  const doneRef = useRef(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const t = traits(cat);
    const jumpV = -720 - t.nerve * 8;
    const baseSpeed = 260 + t.nerve * 6;
    const maxSpeed = 520;
    const lives0 = t.mass >= 24 ? 2 : 1;
    const luckSkip = t.luck / 100;

    const keys = new Set<string>();
    let jumpBuf = 0;
    let coyote = 0;
    let wantJump = false;

    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        keys.add(e.code);
        if (e.type === "keydown") wantJump = true;
      }
      if (e.type === "keyup") keys.delete(e.code);
    };
    const onPtr = (e: PointerEvent) => {
      if (e.type === "pointerdown") {
        wantJump = true;
        e.preventDefault();
      }
    };
    const clear = () => keys.clear();
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKey);
    window.addEventListener("blur", clear);
    canvas.addEventListener("pointerdown", onPtr);
    canvas.addEventListener("pointercancel", clear);

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
    let over = false;
    doneRef.current = false;

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
      over = true;
      setHud({ score, left: 0, lives, over: true });
      onDoneRef.current(score);
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      let dt = (now - last) / 1000;
      last = now;
      if (dt > 0.1) dt = 0.1;
      if (over) return;

      elapsed += dt * 1000;
      const left = Math.max(0, RUN_MS - elapsed);
      speed = Math.min(maxSpeed, baseSpeed + dist * 0.02);
      dist += speed * dt;

      jumpBuf = wantJump ? 0.12 : Math.max(0, jumpBuf - dt);
      wantJump = false;
      if (grounded) coyote = 0.09;
      else coyote = Math.max(0, coyote - dt);

      const gy = groundY();
      const pH = 44;
      const pW = 52;
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

      // draw
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#1a1620";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#3a4e68";
      ctx.fillRect(0, 0, w, h * 0.42);
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
        ctx.fillStyle = "#d4563a";
        ctx.fillRect(o.x, gy - o.h, o.w, o.h);
        ctx.strokeStyle = "#171210";
        ctx.lineWidth = 2;
        ctx.strokeRect(o.x, gy - o.h, o.w, o.h);
      }

      const bob = grounded ? Math.sin(dist / 18) * 2 : 0;
      const body = coatById(cat.coat.body).hex;
      const head = coatById(cat.coat.head).hex;
      const legs = coatById(cat.coat.legs).hex;
      const tail = coatById(cat.coat.tail).hex;
      const flash = invuln > 0 && Math.floor(now / 80) % 2 === 0;
      ctx.globalAlpha = flash ? 0.45 : 1;
      ctx.fillStyle = tail;
      ctx.beginPath();
      ctx.ellipse(pX + pW + 6, pTop + 18 + bob, 16, 7, -0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = legs;
      ctx.fillRect(pX + 8, pBot - 12 + bob, 8, 12);
      ctx.fillRect(pX + 28, pBot - 12 + bob, 8, 12);
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.roundRect(pX + 4, pTop + 14 + bob, 40, 24, 8);
      ctx.fill();
      ctx.fillStyle = head;
      ctx.beginPath();
      ctx.arc(pX + 38, pTop + 12 + bob, 13, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(pX + 28, pTop + 4 + bob);
      ctx.lineTo(pX + 32, pTop - 8 + bob);
      ctx.lineTo(pX + 38, pTop + 6 + bob);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(pX + 44, pTop + 4 + bob);
      ctx.lineTo(pX + 52, pTop - 8 + bob);
      ctx.lineTo(pX + 48, pTop + 8 + bob);
      ctx.fill();
      ctx.globalAlpha = 1;

      const score = Math.floor(dist / 10);
      setHud({ score, left: Math.ceil(left / 1000), lives, over: false });
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKey);
      window.removeEventListener("blur", clear);
      canvas.removeEventListener("pointerdown", onPtr);
      canvas.removeEventListener("pointercancel", clear);
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
        <p className="rounded-sm bg-ink/70 px-2 py-1 tabular">
          {hud.score} · {hud.left}s · {hud.lives} life
        </p>
      </div>
      {hud.over && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl bg-ink/70">
          <p className="font-display text-3xl italic">{hud.score}</p>
          <p className="text-sm text-muted">Wrote to the bloodline.</p>
          <Button variant="accent" onClick={onRetry}>
            Run again
          </Button>
        </div>
      )}
      <p className="mt-3 text-center text-sm text-muted">Tap or space to pounce. Forty-five seconds in the alley.</p>
    </div>
  );
}
