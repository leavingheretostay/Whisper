import { useEffect, useRef } from 'react';

interface CosmicCanvasProps {
  theme?: 'cosmic' | 'aurora' | 'nebula' | 'celestial';
}

export default function CosmicCanvas({ theme = 'cosmic' }: CosmicCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      hue: number;
    }> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      const count = Math.min(40, Math.floor((canvas.width * canvas.height) / 20000));
      particles = [];

      const themes = {
        cosmic: { hueMin: 220, hueMax: 280 },
        aurora: { hueMin: 140, hueMax: 200 },
        nebula: { hueMin: 260, hueMax: 320 },
        celestial: { hueMin: 30, hueMax: 55 },
      };

      const config = themes[theme] || themes.cosmic;

      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.5 + 0.3,
          speedX: (Math.random() - 0.5) * 0.08,
          speedY: (Math.random() - 0.5) * 0.08,
          opacity: 0.08 + Math.random() * 0.12,
          hue: config.hueMin + Math.random() * (config.hueMax - config.hueMin),
        });
      }
    };

    const animate = () => {
      // Solid dark background - NO gradient flash
      ctx.fillStyle = '#060614';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Subtle particles only
      for (const p of particles) {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.y > canvas.height + 10) p.y = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 60%, 70%, ${p.opacity})`;
        ctx.fill();
      }

      animationId = requestAnimationFrame(animate);
    };

    resize();
    createParticles();
    animate();

    window.addEventListener('resize', () => {
      resize();
      createParticles();
    });

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
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
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}