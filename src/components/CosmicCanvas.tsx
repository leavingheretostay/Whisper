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
      targetOpacity: number;
      hue: number;
      pulseSpeed: number;
      pulseOffset: number;
    }> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      const count = Math.min(50, Math.floor((canvas.width * canvas.height) / 15000));
      particles = [];

      const themes = {
        cosmic: { hueMin: 220, hueMax: 280, opacityMin: 0.15, opacityMax: 0.4 },
        aurora: { hueMin: 140, hueMax: 220, opacityMin: 0.2, opacityMax: 0.5 },
        nebula: { hueMin: 260, hueMax: 340, opacityMin: 0.15, opacityMax: 0.45 },
        celestial: { hueMin: 30, hueMax: 60, opacityMin: 0.2, opacityMax: 0.5 },
      };

      const config = themes[theme] || themes.cosmic;

      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          speedX: (Math.random() - 0.5) * 0.15,
          speedY: (Math.random() - 0.5) * 0.15,
          opacity: Math.random() * 0.3,
          targetOpacity: config.opacityMin + Math.random() * (config.opacityMax - config.opacityMin),
          hue: config.hueMin + Math.random() * (config.hueMax - config.hueMin),
          pulseSpeed: 0.003 + Math.random() * 0.007,
          pulseOffset: Math.random() * Math.PI * 2,
        });
      }
    };

    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Ultra-subtle gradient background
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width * 0.7
      );

      const themesGradient = {
        cosmic: ['rgba(20, 20, 60, 0.3)', 'rgba(6, 6, 20, 0)'],
        aurora: ['rgba(20, 50, 40, 0.3)', 'rgba(6, 6, 20, 0)'],
        nebula: ['rgba(40, 20, 50, 0.3)', 'rgba(6, 6, 20, 0)'],
        celestial: ['rgba(40, 30, 20, 0.3)', 'rgba(6, 6, 20, 0)'],
      };

      const [color1, color2] = themesGradient[theme] || themesGradient.cosmic;
      gradient.addColorStop(0, color1);
      gradient.addColorStop(1, color2);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Smooth, non-flashing particles
      for (const p of particles) {
        // Gentle pulsing - NEVER drops below 30% of target
        const pulse = Math.sin(time * p.pulseSpeed + p.pulseOffset) * 0.3 + 0.7;
        const currentOpacity = p.targetOpacity * pulse;

        // Smooth movement
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around edges smoothly
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.y > canvas.height + 10) p.y = -10;

        // Draw with soft glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

        // Outer glow
        const glowGradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
        glowGradient.addColorStop(0, `hsla(${p.hue}, 70%, 70%, ${currentOpacity})`);
        glowGradient.addColorStop(0.5, `hsla(${p.hue}, 70%, 70%, ${currentOpacity * 0.3})`);
        glowGradient.addColorStop(1, 'transparent');
        ctx.fillStyle = glowGradient;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 85%, ${currentOpacity * 1.3})`;
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
        background: '#060614',
      }}
    />
  );
}