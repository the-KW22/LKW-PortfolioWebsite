"use client";

import type { RefObject } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

const PERSPECTIVE = 1400;
const ROW_GAP = 62;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (v: number) => {
  const t = clamp01(v);
  return t * t * (3 - 2 * t);
};

/**
 * Desktop 3D ring for the Tech stack (review decision 8). The real tiles stay in the DOM grid, in DOM
 * order; this hook only moves them. Each group is one ring of a cylinder, the section is pinned and
 * scroll spins the cylinder; in the last stretch every tile eases from its ring position to its own
 * grid cell, so the section ends as the plain grid. Positions are projected by hand (one shared
 * vanishing point) and written as inline transforms, so there is no 3D context chain to break.
 *
 * Tiles carry data-row, data-idx and data-n; groups carry data-ring-fade (label fades in at the end).
 */
export function useTechRing(
  pinRef: RefObject<HTMLElement | null>,
  stageRef: RefObject<HTMLElement | null>,
  stRef: RefObject<ScrollTrigger | null>,
  enabled: boolean,
) {
  useGSAP(
    () => {
      const pin = pinRef.current;
      const stage = stageRef.current;
      if (!enabled || !pin || !stage) return;
      const tiles = gsap.utils.toArray<HTMLElement>("[data-tile]", stage);
      const fades = gsap.utils.toArray<HTMLElement>("[data-ring-fade]", stage);
      const info = tiles.map((el) => ({
        el,
        row: Number(el.dataset.row),
        idx: Number(el.dataset.idx),
        n: Number(el.dataset.n),
        cx: 0,
        cy: 0,
      }));
      const rows = Math.max(...info.map((t) => t.row)) + 1;
      let W = 0;
      let H = 0;
      let progress = 0;
      let drift = 0;
      let flat = false;

      // Natural (grid) centre of every tile. offsetLeft/Top ignore transforms, so this is safe mid-animation.
      const measure = () => {
        W = stage.offsetWidth;
        H = stage.offsetHeight;
        info.forEach((t) => {
          t.cx = t.el.offsetLeft + t.el.offsetWidth / 2;
          t.cy = t.el.offsetTop + t.el.offsetHeight / 2;
        });
      };

      const clear = () => {
        tiles.forEach((el) => {
          el.style.transform = "";
          el.style.opacity = "";
          el.style.zIndex = "";
        });
        fades.forEach((el) => (el.style.opacity = ""));
      };

      const render = () => {
        const f = smooth((progress - 0.72) / 0.28);
        if (f >= 1) {
          if (!flat) clear();
          flat = true;
          return;
        }
        flat = false;
        const theta = progress * Math.PI * 1.4 + drift;
        const R = Math.min(W * 0.4, 760);
        for (const t of info) {
          const dir = t.row % 2 ? -1 : 1;
          const a = dir * theta + (t.idx * Math.PI * 2) / t.n + t.row * 0.9;
          const z = R * (Math.cos(a) - 1);
          const s = PERSPECTIVE / (PERSPECTIVE - z);
          const X = R * Math.sin(a) * s;
          const Y = (t.row - (rows - 1) / 2) * ROW_GAP * s;
          const depth = (Math.cos(a) + 1) / 2;
          const tx = (X - (t.cx - W / 2)) * (1 - f);
          const ty = (Y - (t.cy - H / 2)) * (1 - f);
          const sc = s + (1 - s) * f;
          const rot = -Math.sin(a) * 38 * (1 - f);
          const op = 0.18 + 0.82 * depth + (1 - (0.18 + 0.82 * depth)) * f;
          t.el.style.transform = `translate3d(${tx.toFixed(1)}px,${ty.toFixed(1)}px,0) scale(${sc.toFixed(3)}) perspective(700px) rotateY(${rot.toFixed(1)}deg)`;
          t.el.style.opacity = op.toFixed(2);
          t.el.style.zIndex = String(Math.round(depth * 10));
        }
        fades.forEach((el) => (el.style.opacity = f.toFixed(2)));
      };

      measure();
      render();

      // "Slowly rotating": a gentle drift on top of the scroll-driven spin, only while pinned.
      let last = 0;
      const tick = (timeSec: number) => {
        drift += Math.min(timeSec - last, 0.1) * 0.12;
        last = timeSec;
        render();
      };

      const st = ScrollTrigger.create({
        trigger: pin,
        start: "top top",
        end: "+=220%",
        pin: true,
        // Measured before the header ruler triggers, so they see the pin spacer's extra height.
        refreshPriority: 1,
        onUpdate: (self) => {
          progress = self.progress;
          render();
        },
        onRefresh: (self) => {
          progress = self.progress;
          measure();
          render();
        },
        onToggle: (self) => {
          if (self.isActive) {
            last = gsap.ticker.time;
            gsap.ticker.add(tick);
          } else gsap.ticker.remove(tick);
        },
      });
      stRef.current = st;

      return () => {
        gsap.ticker.remove(tick);
        st.kill();
        stRef.current = null;
        clear();
      };
    },
    { dependencies: [enabled], scope: stageRef },
  );
}
