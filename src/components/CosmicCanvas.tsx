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
      pulseSpeed: number;
      pulseOffset: number;
    }> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      const count = Math.min(60, Math.floor((canvas.width * canvas.height) / 12000));
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
          size: Math.random() * 2 + 0.4,
          speedX: (Math.random() - 0.5) * 0.12,
          speedY: (Math.random() - 0.5) * 0.12,
          opacity: 0.1 + Math.random() * 0.2,
          hue: config.hueMin + Math.random() * (config.hueMax - config.hueMin),
          pulseSpeed: 0.002 + Math.random() * 0.006,
          pulseOffset: Math.random() * Math.PI * 2,
        });
      }
    };

    const animate = (time: number) => {
      ctx.fillStyle = '#060614';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        const pulse = Math.sin(time * p.pulseSpeed + p.pulseOffset) * 0.4 + 0.6;
        const currentOpacity = p.opacity * pulse;

        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.y > canvas.height + 10) p.y = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
        glow.addColorStop(0, `hsla(${p.hue}, 70%, 70%, ${currentOpacity})`);
        glow.addColorStop(0.5, `hsla(${p.hue}, 70%, 70%, ${currentOpacity * 0.2})`);
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 85%, ${currentOpacity * 1.2})`;
        ctx.fill();
      }

      animationId = requestAnimationFrame(animate);
    };

    resize();
    createParticles();
    animate(0);

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