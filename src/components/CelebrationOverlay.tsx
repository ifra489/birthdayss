import React, { useEffect, useRef, memo } from 'react';

interface ConfettiPiece {
  x: number;
  y: number;
  size: number;
  color: string;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  shape: 'rect' | 'circle';
  opacity: number;
}

interface CelebrationOverlayProps {
  active: boolean;
}

export const CelebrationOverlay = memo(function CelebrationOverlay({ active }: CelebrationOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const piecesRef = useRef<ConfettiPiece[]>([]);

  useEffect(() => {
    if (!active) {
      piecesRef.current = [];
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let isRunning = true;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let width = window.innerWidth;
    let height = window.innerHeight;

    const setupCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    const handleResize = () => {
      setupCanvas();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        isRunning = false;
        cancelAnimationFrame(animationFrameId);
      } else {
        if (!isRunning) {
          isRunning = true;
          render();
        }
      }
    };

    window.addEventListener('resize', handleResize, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange, { passive: true });
    setupCanvas();

    const colors = ['#22D3EE', '#3B82F6', '#60A5FA', '#F8FAFC', '#93C5FD', '#FDE047', '#C084FC'];
    const shapes: ('rect' | 'circle')[] = ['rect', 'circle', 'rect'];

    // Spawn initial confetti
    const isMobile = width < 768;
    const initialCount = isMobile ? 40 : 65;
    for (let i = 0; i < initialCount; i++) {
      piecesRef.current.push({
        x: Math.random() * width,
        y: Math.random() * height * 0.8,
        size: 5 + Math.random() * 7,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedY: 1.5 + Math.random() * 2.2,
        speedX: (Math.random() - 0.5) * 1.5,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 3.5,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        opacity: 0.7 + Math.random() * 0.3,
      });
    }

    const maxCount = isMobile ? 50 : 80;

    const render = () => {
      if (!isRunning) return;
      ctx.clearRect(0, 0, width, height);

      // Keep spawning new gentle confetti
      if (piecesRef.current.length < maxCount && Math.random() < 0.25) {
        piecesRef.current.push({
          x: Math.random() * width,
          y: -15,
          size: 5 + Math.random() * 7,
          color: colors[Math.floor(Math.random() * colors.length)],
          speedY: 1.5 + Math.random() * 2.2,
          speedX: (Math.random() - 0.5) * 1.5,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 3.5,
          shape: shapes[Math.floor(Math.random() * shapes.length)],
          opacity: 0.7 + Math.random() * 0.3,
        });
      }

      for (let i = piecesRef.current.length - 1; i >= 0; i--) {
        const p = piecesRef.current[i];
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.y * 0.02) * 0.4;
        p.rotation += p.rotationSpeed;

        if (p.y > height + 20) {
          piecesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.6);
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      isRunning = false;
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(animationFrameId);
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-30 w-full h-full will-change-transform"
      style={{ transform: 'translateZ(0)' }}
    />
  );
});
