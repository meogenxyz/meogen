import type { Organ } from "@/lib/meogen/genes";

export type Role = Organ;

const INK = "#14110e";

export type CoatSet = { head: string; body: string; tail: string; legs: string };

/** Original sitting cat. Not the old overflowing organ sprites. */
export function drawSittingCat(
  ctx: CanvasRenderingContext2D,
  coats: CoatSet,
  cx: number,
  cy: number,
  size: number,
  alpha = 1,
) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(cx, cy);
  const s = size / 240;
  ctx.scale(s, s);
  ctx.translate(-100, -230);
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.lineWidth = 5;
  ctx.strokeStyle = INK;

  const blob = (fill: string, draw: () => void) => {
    ctx.beginPath();
    draw();
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.stroke();
  };

  blob(coats.tail, () => {
    ctx.moveTo(128, 150);
    ctx.bezierCurveTo(175, 140, 188, 90, 158, 58);
    ctx.bezierCurveTo(148, 48, 138, 62, 142, 78);
    ctx.bezierCurveTo(148, 108, 138, 138, 118, 150);
  });

  blob(coats.legs, () => {
    ctx.ellipse(72, 198, 20, 26, -0.15, 0, Math.PI * 2);
  });
  blob(coats.legs, () => {
    ctx.ellipse(122, 198, 20, 26, 0.15, 0, Math.PI * 2);
  });

  blob(coats.body, () => {
    ctx.ellipse(98, 150, 50, 44, 0, 0, Math.PI * 2);
  });

  blob(coats.legs, () => {
    ctx.roundRect(74, 168, 16, 42, 8);
  });
  blob(coats.legs, () => {
    ctx.roundRect(110, 168, 16, 42, 8);
  });

  blob(coats.head, () => {
    ctx.moveTo(68, 62);
    ctx.lineTo(76, 24);
    ctx.lineTo(94, 58);
  });
  blob(coats.head, () => {
    ctx.moveTo(132, 62);
    ctx.lineTo(124, 24);
    ctx.lineTo(106, 58);
  });

  blob(coats.head, () => {
    ctx.arc(100, 78, 38, 0, Math.PI * 2);
  });

  ctx.fillStyle = INK;
  ctx.beginPath();
  ctx.ellipse(88, 78, 5, 6.5, 0, 0, Math.PI * 2);
  ctx.ellipse(112, 78, 5, 6.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#faf3e6";
  ctx.beginPath();
  ctx.arc(90, 76, 1.6, 0, Math.PI * 2);
  ctx.arc(114, 76, 1.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = INK;
  ctx.beginPath();
  ctx.moveTo(100, 88);
  ctx.lineTo(95, 95);
  ctx.lineTo(105, 95);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

export function preloadCats(_colors: string[]) {
  return Promise.resolve();
}

export function sittingCatSvg(
  coats: CoatSet,
  visible: Organ[] = ["head", "body", "tail", "legs"],
) {
  const on = (o: Organ) => visible.includes(o);
  const sw = `stroke="${INK}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"`;
  const tail = on("tail")
    ? `<path d="M128 150 C175 140 188 90 158 58 C148 48 138 62 142 78 C148 108 138 138 118 150Z" fill="${coats.tail}" ${sw}/>`
    : "";
  const legs = on("legs")
    ? `<ellipse cx="72" cy="198" rx="20" ry="26" transform="rotate(-8 72 198)" fill="${coats.legs}" ${sw}/>
       <ellipse cx="122" cy="198" rx="20" ry="26" transform="rotate(8 122 198)" fill="${coats.legs}" ${sw}/>
       <rect x="74" y="168" width="16" height="42" rx="8" fill="${coats.legs}" ${sw}/>
       <rect x="110" y="168" width="16" height="42" rx="8" fill="${coats.legs}" ${sw}/>`
    : "";
  const body = on("body")
    ? `<ellipse cx="98" cy="150" rx="50" ry="44" fill="${coats.body}" ${sw}/>`
    : "";
  const head = on("head")
    ? `<path d="M68 62 L76 24 L94 58Z" fill="${coats.head}" ${sw}/>
       <path d="M132 62 L124 24 L106 58Z" fill="${coats.head}" ${sw}/>
       <circle cx="100" cy="78" r="38" fill="${coats.head}" ${sw}/>
       <ellipse cx="88" cy="78" rx="5" ry="6.5" fill="${INK}"/>
       <ellipse cx="112" cy="78" rx="5" ry="6.5" fill="${INK}"/>
       <circle cx="90" cy="76" r="1.6" fill="#faf3e6"/>
       <circle cx="114" cy="76" r="1.6" fill="#faf3e6"/>
       <path d="M100 88 L95 95 L105 95Z" fill="${INK}"/>`
    : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 240" overflow="visible">${tail}${legs}${body}${head}</svg>`;
}
