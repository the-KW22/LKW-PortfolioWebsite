const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/<>_#*";

/** Decode effect: writes random glyphs into `el`, resolving left to right into `text`.
 *  Returns a cancel function. Callers handle reduced motion (set the text directly). */
export function scrambleTo(el: HTMLElement, text: string, framesPerChar = 2): () => void {
  let frame = 0;
  let raf = 0;
  const chars = [...text];
  const step = () => {
    frame += 1;
    const revealed = frame / framesPerChar;
    if (revealed >= chars.length) {
      el.textContent = text;
      return;
    }
    el.textContent = chars
      .map((c, i) => (i < revealed || c === " " ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
      .join("");
    raf = requestAnimationFrame(step);
  };
  step();
  return () => cancelAnimationFrame(raf);
}
