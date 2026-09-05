import type { Organ } from "@/lib/meogen/genes";

export type Role = Organ;

export const CAT_PARTS: Record<Role, string> = {
  head: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><path d="M272 303q-4 1-10 10c-9 13-8 14 41 67l37 39v71c0 75 0 75-21 75q-6 1-7 3 1 3 14 2l14-2v35l-24 11s-22 11-22 17c-2 12 47-17 47-16v22c0 4-30 12-24 21 3 5 26-9 26-4v5h321v-6c1-4 11 1 11-1q-1-4-6-6c-7-2-9-33-3-33l18 6q14 6 20 5 2-2-19-11l-22-9v-35h15q23 1-4-5l-11-3V408l36-38c37-41 43-54 27-63-6-3-20 0-67 14l-59 18H392l-58-18z" style="fill:#171210;stroke-width:15.0386"/><path d="m304 346 18 9 53 29c40 22 47 24 47 8l2-20c3-9 4-9 72-9h69l2 20c2 11 4 21 6 22s26-12 56-28c29-17 54-29 54-29 1 1-12 16-28 33-29 32-35 42-24 42 5 0 6 10 6 68v68l-23-3c-26-3-21 3 6 8 16 2 17 4 17 14q1 20-24 6-12-6-17-5c-3 1 6 6 18 12 19 9 23 12 23 20 0 13-2 13-21 0-22-15-23-9-1 7q16 12 18 16c0 2-59 3-131 3q-130 0-132-4 1-4 16-15l16-13c0-4-23 7-26 12-5 8-14 5-14-6 0-8 4-11 23-20q21-10 18-12-5-1-17 5-26 14-24-6c0-10 2-12 15-14 27-5 33-10 8-8l-23 3v-74l1-74-21-23-30-32zm116 157-9 1c-18 2-19 4-12 16 8 12 27 14 37 4q17-19-16-21m148 4c-5 2-14 1-4 14 7 11 26 12 35 3 8-8 8-17 0-17zm-69 15q-35-1-15 21 13 15-14 26-15 6-16 9c0 10 38-4 42-14q1-9 13 4c12 10 36 18 36 10q-1-4-9-6c-5-2-14-7-19-12l-8-10 8-10q8-10 6-14-4-5-24-4" style="fill-opacity:1;stroke-width:15.0386"/><path d="M424 509q9 0 10 3c0 5-9 8-15 6-9-3-6-9 5-9m169 4q-2 4-8 5c-14 1-9-8-3-8 4 0 11 0 11 3" style="fill:#fff;stroke-width:15.0386"/></svg>`,
  body: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><rect width="300" height="300" x="350" y="350" ry="18" style="fill-opacity:1;stroke:#171210;stroke-width:30;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1"/></svg>`,
  tail: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><path d="M744 318q-16-2-26 11c-20 22 2 44-10 92-7 24-27 42-48 53-6 2-12 0-10 8l-1 76c23-6 47-12 67-26 39-24 66-66 72-112q6-38-6-75c-5-15-19-27-35-27h-1z" style="fill:#171210;stroke-width:12.526"/><path d="M650 497c31-10 61-32 73-63q10-31 6-64c-4-11-5-25 5-32 9-7 22-4 27 6q12 26 11 54c-2 55-37 108-88 129-9 3-19 9-29 8l-6-2m0 0v-1zm1-36q-1 0 0 0" style="stroke-width:12.526"/><rect width="300" height="300" x="350" y="350" ry="18" style="fill-opacity:1;stroke:#171210;stroke-width:30;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1"/></svg>`,
  legs: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><path d="M342 342c-10 20-4 42-5 64 0 57 4 114 3 171-5 15-32 11-38 28-6 13-14 38 0 47q53 4 105 4l253 3-1-230 1-70-24-24c-91 1-184-3-275 1-7 1-16 0-19 6" style="fill:#171210;stroke-width:15.3751"/><path d="M365 362h273v202c1 10-2 29-10 11-21-28-52-51-87-54-8-4-36-1-18 8 16 4 32 3 46 12 36 17 65 51 69 92q5 11-7 9H309c-1-15 0-33 15-40 34-15 73-4 108-12 7-5-10-12 0-20 5-19-16 4-22 7-16 6-32 3-48 4l3-216z" style="stroke-width:15.3751"/></svg>`,
};

const cache = new Map<string, HTMLImageElement>();

/** Coat the original ink (#171210) so organs keep the line art. */
export function tintSvg(svg: string, color: string) {
  return svg.replace(/#171210/g, color).replace("<svg", `<svg fill="${color}"`);
}

function toSrc(svg: string) {
  if (typeof URL !== "undefined" && typeof Blob !== "undefined") {
    return URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));
  }
  return `data:image/svg+xml;charset=utf-8;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
}

export function tintedPartSrc(role: Role, color: string) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(tintSvg(CAT_PARTS[role], color))}`;
}

export function preloadCats(colors: string[]) {
  if (typeof Image === "undefined") return Promise.resolve();
  const roles: Role[] = ["head", "body", "tail", "legs"];
  const jobs: Promise<void>[] = [];
  for (const color of colors) {
    for (const role of roles) {
      const key = `${color}-${role}`;
      if (cache.has(key)) continue;
      jobs.push(
        new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            cache.set(key, img);
            resolve();
          };
          img.onerror = () => resolve();
          img.src = toSrc(tintSvg(CAT_PARTS[role], color));
        }),
      );
    }
  }
  return Promise.all(jobs).then(() => undefined);
}

export function catSprite(color: string, role: Role) {
  return cache.get(`${color}-${role}`) ?? null;
}

/** Standing cat from four original organs. `cy` is the ground line (feet). */
export function drawStandingCat(
  ctx: CanvasRenderingContext2D,
  coats: { head: string; body: string; tail: string; legs: string },
  cx: number,
  cy: number,
  size: number,
  alpha = 1,
) {
  ctx.save();
  ctx.globalAlpha = alpha;
  const draw = (role: Role, color: string, dx: number, dy: number, s: number) => {
    const img = catSprite(color, role);
    const x = cx + dx * size - s / 2;
    const y = cy + dy * size - s / 2;
    if (img) ctx.drawImage(img, x, y, s, s);
    else {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(x + s * 0.22, y + s * 0.22, s * 0.56, s * 0.56, 8);
      ctx.fill();
    }
  };
  draw("tail", coats.tail, 0.42, -0.62, size * 0.95);
  draw("legs", coats.legs, 0, -0.4, size);
  draw("body", coats.body, -0.02, -0.58, size * 0.88);
  draw("head", coats.head, -0.04, -0.95, size * 0.98);
  ctx.restore();
}
