import React, { useEffect, useRef } from 'react';

/**
 * Interactive Fluid Paint Canvas:
 * When the user moves their cursor over any section containing this canvas,
 * it paints vibrant, soft, watercolor-like rainbow ribbons that blend
 * and gracefully dissolve/fade away over ~2.5 seconds.
 */
export default function FluidPaintCanvas({ className = '' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement ? canvas.parentElement.offsetWidth : window.innerWidth);
    let height = (canvas.height = canvas.parentElement ? canvas.parentElement.offsetHeight : window.innerHeight);

    const onResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    };

    window.addEventListener('resize', onResize);

    const points = [];
    let hue = Math.floor(Math.random() * 360);
    let lastPos = null;

    const handlePointerMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Only draw if cursor is strictly inside this section
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        const now = performance.now();

        if (!lastPos) {
          lastPos = { x, y };
          return;
        }

        const dx = x - lastPos.x;
        const dy = y - lastPos.y;
        const distance = Math.hypot(dx, dy);

        // Sub-pixel interpolation for continuous unbroken ribbons
        const steps = Math.max(Math.floor(distance / 2.5), 1);
        for (let i = 0; i <= steps; i++) {
          const interpX = lastPos.x + (dx * i) / steps;
          const interpY = lastPos.y + (dy * i) / steps;
          const brushRadius = Math.min(Math.max(distance * 0.85, 30), 55);

          points.push({
            x: interpX,
            y: interpY,
            radius: brushRadius,
            hue: hue,
            createdAt: now,
            duration: 2500, // Vanishes completely in 2.5 seconds
          });

          // Continuously cycle hue for rainbow spectrum
          hue = (hue + 0.5) % 360;
        }

        if (points.length > 750) {
          points.splice(0, points.length - 750);
        }

        lastPos = { x, y };
      } else {
        lastPos = null;
      }
    };

    window.addEventListener('pointermove', handlePointerMove);

    let animId;
    const render = () => {
      const now = performance.now();
      ctx.clearRect(0, 0, width, height);

      let i = points.length;
      while (i--) {
        const p = points[i];
        const age = now - p.createdAt;
        if (age >= p.duration) {
          points.splice(i, 1);
          continue;
        }

        const progress = age / p.duration;
        const alpha = Math.max(0, (1 - progress) * 0.65);

        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        gradient.addColorStop(0, `hsla(${p.hue}, 96%, 58%, ${alpha})`);
        gradient.addColorStop(0.5, `hsla(${p.hue}, 94%, 62%, ${alpha * 0.65})`);
        gradient.addColorStop(0.85, `hsla(${p.hue}, 90%, 68%, ${alpha * 0.2})`);
        gradient.addColorStop(1, `hsla(${p.hue}, 90%, 70%, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', handlePointerMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`fluid-paint-canvas ${className}`}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        mixBlendMode: 'multiply',
      }}
    />
  );
}
