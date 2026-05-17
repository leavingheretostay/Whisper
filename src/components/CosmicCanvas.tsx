import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  pulse: number;
  pulseSpeed: number;
}

interface CosmicCanvasProps {
  theme?: 'cosmic' | 'aurora' | 'nebula' | 'celestial';
}

const THEME_COLORS = {
  cosmic: ['#4f8ef7', '#a78bfa', '#60a5fa', '#818cf8', '#c4b5fd', '#e0e7ff'],
  aurora: ['#34d399', '#6ee7b7', '#a7f3d0', '#10b981', '#059669', '#34d399'],
  nebula: ['#f472b6', '#ec4899', '#fb7185', '#f9a8d4', '#fda4af', '#fce7f3'],
  celestial: ['#fbbf24', '#f59e0b', '#fcd34d', '#fde68a', '#fff3cd', '#fffbeb'],
};

export default function CosmicCanvas({ theme = 'cosmic' }: CosmicCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const colors = THEME_COLORS[theme];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMouseMove);

    // Reduce particle count on mobile
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 60 : 120;

    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 2.5 + 0.5,
      opacity: Math.random() * 0.7 + 0.1,
      color: colors[Math.floor(Math.random() * colors.length)],
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.02 + 0.005,
    }));

    let frame = 0;
    const animate = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Subtle moving gradient bg
      const grd = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width * 0.8
      );
      grd.addColorStop(0, 'rgba(15, 10, 40, 0)');
      grd.addColorStop(1, 'rgba(5, 3, 20, 0)');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw soft nebula orbs (very infrequent update)
      if (frame % 3 === 0) {
        for (let i = 0; i < 3; i++) {
          const x = canvas.width * (0.2 + i * 0.3);
          const y = canvas.height * 0.5 + Math.sin(frame * 0.003 + i) * 80;
          const r = canvas.width * (isMobile ? 0.15 : 0.25);
          const orb = ctx.createRadialGradient(x, y, 0, x, y, r);
          const c = colors[i % colors.length];
          orb.addColorStop(0, c + '18');
          orb.addColorStop(0.5, c + '08');
          orb.addColorStop(1, 'transparent');
          ctx.fillStyle = orb;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      }

      // Draw and update particles
      for (const p of particlesRef.current) {
        p.pulse += p.pulseSpeed;
        const currentOpacity = p.opacity * (0.6 + 0.4 * Math.sin(p.pulse));

        // Subtle mouse attraction
        const mx = mouseRef.current.x;
        const my = mouseRef.current.y;
        const dx = mx - p.x;
        const dy = my - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          p.vx += (dx / dist) * 0.003;
          p.vy += (dy / dist) * 0.003;
        }

        // Dampen velocity
        p.vx *= 0.995;
        p.vy *= 0.995;

        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.y > canvas.height + 10) p.y = -10;

        // Glow effect
        ctx.shadowBlur = p.size * 4;
        ctx.shadowColor = p.color;
        ctx.globalAlpha = currentOpacity;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}
