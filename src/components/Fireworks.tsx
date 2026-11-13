import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
};
// A deliberately low-resolution canvas keeps every spark square, with a small particle cap.
export function Fireworks({
  active,
  burst,
}: {
  active: boolean;
  burst: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context || !active) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const colors = ["#ffe8a3", "#e5b95d", "#d4b5ff", "#ff9bba", "#a6d6ff"];
    let particles: Particle[] = [],
      frame = 0,
      previous = 0,
      elapsed = 0,
      nextBurst = 0;
    const animate = (time: number) => {
      const delta = Math.min((time - previous) / 1000 || 0.016, 0.04);
      previous = time;
      if (!document.hidden) {
        elapsed += delta;
        context.clearRect(0, 0, canvas.width, canvas.height);
        if (elapsed >= nextBurst && particles.length < 180) {
          nextBurst = elapsed + (reduced ? 3.5 : 1.1);
          const x = 35 + Math.random() * 410,
            y = 20 + Math.random() * 100;
          const color = colors[Math.floor(Math.random() * colors.length)];
          for (let i = 0; i < (reduced ? 12 : 32); i++) {
            const angle = (i / (reduced ? 12 : 32)) * Math.PI * 2;
            const speed = reduced ? 10 : 22 + Math.random() * 22;
            particles.push({
              x,
              y,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              life: 1.6,
              maxLife: 1.6,
              color,
            });
          }
        }
        particles = particles.filter((p) => p.life > 0);
        for (const p of particles) {
          p.life -= delta;
          p.x += p.vx * delta;
          p.y += p.vy * delta;
          p.vy += 13 * delta;
          context.globalAlpha = Math.max(0, p.life / p.maxLife);
          context.fillStyle = p.color;
          context.fillRect(Math.round(p.x), Math.round(p.y), 2, 2);
        }
        context.globalAlpha = 1;
      }
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(frame);
      context.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [active, burst]);
  return (
    <canvas
      ref={ref}
      width="480"
      height="270"
      className="fireworks"
      aria-hidden="true"
    />
  );
}
