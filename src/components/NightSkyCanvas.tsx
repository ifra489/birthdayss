import React, { useEffect, useRef, memo } from 'react';

interface NightSkyCanvasProps {
  intensity?: 'low' | 'normal' | 'cinematic' | 'finale';
  interactive?: boolean;
  onStarClick?: (x: number, y: number) => void;
}

interface Star {
  x: number;
  y: number;
  size: number;
  baseAlpha: number;
  alpha: number;
  twinkleSpeed: number;
  speedY: number;
  speedX: number;
  color: string;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  active: boolean;
  life: number;
  maxLife: number;
}

interface ClickParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  life: number;
}

export const NightSkyCanvas = memo(function NightSkyCanvas({
  intensity = 'normal',
}: NightSkyCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const starsRef = useRef<Star[]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);
  const clickParticlesRef = useRef<ClickParticle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let isRunning = true;
    let lastTime = performance.now();

    // Cap resolution for fast, lag-free GPU rendering (especially on high-DPI phones)
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let width = window.innerWidth;
    let height = window.innerHeight;

    const setupCanvasSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(1, 0, 0, 1, 0, 0); // reset
      ctx.scale(dpr, dpr);
      initStars();
    };

    const handleResize = () => {
      setupCanvasSize();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = (e.clientX / width - 0.5) * 20;
      mouseRef.current.targetY = (e.clientY / height - 0.5) * 20;
    };

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      // Spawn celestial sparkle burst (lightweight count for instant response)
      const colors = ['#F8FAFC', '#22D3EE', '#3B82F6', '#CBD5E1'];
      for (let i = 0; i < 10; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1 + Math.random() * 3;
        clickParticlesRef.current.push({
          x: clickX,
          y: clickY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 1 + Math.random() * 2,
          alpha: 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          life: 0,
        });
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        isRunning = false;
        cancelAnimationFrame(animationFrameId);
      } else {
        if (!isRunning) {
          isRunning = true;
          lastTime = performance.now();
          render(lastTime);
        }
      }
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('click', handleClick, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange, { passive: true });

    const initStars = () => {
      const isMobile = width < 768;
      const baseCount =
        intensity === 'finale'
          ? isMobile ? 65 : 120
          : intensity === 'cinematic'
          ? isMobile ? 55 : 95
          : intensity === 'low'
          ? isMobile ? 35 : 55
          : isMobile ? 45 : 75;

      const starArray: Star[] = [];
      const colors = ['#F8FAFC', '#E2E8F0', '#93C5FD', '#22D3EE', '#CBD5E1'];

      for (let i = 0; i < baseCount; i++) {
        const size = Math.random() < 0.88 ? Math.random() * 1.2 + 0.4 : Math.random() * 1.8 + 0.9;
        const baseAlpha = 0.3 + Math.random() * 0.6;
        starArray.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size,
          baseAlpha,
          alpha: baseAlpha,
          twinkleSpeed: 0.008 + Math.random() * 0.015,
          speedY: (Math.random() - 0.5) * 0.04,
          speedX: (Math.random() - 0.5) * 0.03,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
      starsRef.current = starArray;
    };

    const maybeSpawnShootingStar = () => {
      if (Math.random() < 0.005 && shootingStarsRef.current.length < 2) {
        const startX = Math.random() * (width * 0.8);
        const startY = Math.random() * (height * 0.35);
        shootingStarsRef.current.push({
          x: startX,
          y: startY,
          length: 70 + Math.random() * 80,
          speed: 7 + Math.random() * 6,
          angle: (Math.PI / 4) + (Math.random() - 0.5) * 0.25,
          opacity: 1,
          active: true,
          life: 0,
          maxLife: 30 + Math.random() * 18,
        });
      }
    };

    setupCanvasSize();

    let step = 0;
    const render = (now: number) => {
      if (!isRunning) return;
      
      const delta = Math.min((now - lastTime) / 16.666, 2.5); // normalize ~60fps
      lastTime = now;
      step += delta;

      // Fast clear
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse parallax
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05 * delta;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05 * delta;

      // Draw stars
      const stars = starsRef.current;
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.alpha = star.baseAlpha + Math.sin(step * star.twinkleSpeed + i) * 0.3;
        star.alpha = Math.max(0.1, Math.min(1, star.alpha));

        // Floating drift
        star.y += star.speedY * delta;
        star.x += star.speedX * delta;
        if (star.y < 0) star.y = height;
        if (star.y > height) star.y = 0;
        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;

        const renderX = star.x + (mouseRef.current.x * star.size * 0.12);
        const renderY = star.y + (mouseRef.current.y * star.size * 0.12);

        ctx.beginPath();
        ctx.arc(renderX, renderY, star.size, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = star.alpha;
        ctx.fill();

        // Subtle glow for large stars
        if (star.size > 1.8) {
          ctx.beginPath();
          ctx.arc(renderX, renderY, star.size * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(34, 211, 238, 0.12)';
          ctx.fill();
        }
      }

      // Draw shooting stars
      maybeSpawnShootingStar();
      const shootingStars = shootingStarsRef.current;
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        ss.life += delta;
        ss.x += Math.cos(ss.angle) * ss.speed * delta;
        ss.y += Math.sin(ss.angle) * ss.speed * delta;
        ss.opacity = 1 - ss.life / ss.maxLife;

        if (ss.life >= ss.maxLife || ss.x > width + 80 || ss.y > height + 80) {
          shootingStars.splice(i, 1);
          continue;
        }

        const tailX = ss.x - Math.cos(ss.angle) * ss.length;
        const tailY = ss.y - Math.sin(ss.angle) * ss.length;

        const grad = ctx.createLinearGradient(ss.x, ss.y, tailX, tailY);
        grad.addColorStop(0, `rgba(248, 250, 252, ${Math.max(0, ss.opacity * 0.9)})`);
        grad.addColorStop(0.3, `rgba(34, 211, 238, ${Math.max(0, ss.opacity * 0.5)})`);
        grad.addColorStop(1, `rgba(37, 99, 235, 0)`);

        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.6;
        ctx.lineCap = 'round';
        ctx.globalAlpha = Math.max(0, ss.opacity);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(ss.x, ss.y, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
      }

      // Draw click sparkles
      const clickParticles = clickParticlesRef.current;
      for (let i = clickParticles.length - 1; i >= 0; i--) {
        const p = clickParticles[i];
        p.life += delta;
        p.x += p.vx * delta;
        p.y += p.vy * delta;
        p.vx *= Math.pow(0.94, delta);
        p.vy *= Math.pow(0.94, delta);
        p.alpha = 1 - p.life / 25;

        if (p.life >= 25) {
          clickParticles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(animationFrameId);
    };
  }, [intensity]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 w-full h-full will-change-transform"
      style={{
        background: 'radial-gradient(ellipse at 50% 30%, #0B1B33 0%, #050A14 75%, #02050D 100%)',
        transform: 'translateZ(0)',
      }}
    />
  );
});
