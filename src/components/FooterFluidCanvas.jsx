import React, { useEffect, useRef } from 'react';

/**
 * 14islands Footer Fluid Paint Effect:
 * As the user moves the cursor around the footer, vibrant watercolor
 * ribbons are painted in real-time and gracefully dissolve/fade away
 * over ~2.5 seconds, keeping the canvas interactive and fresh.
 */
export default function FooterFluidCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement.offsetWidth);
    let height = (canvas.height = canvas.parentElement.offsetHeight);

    const onResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    };

    window.addEventListener('resize', onResize);

    // List of active fluid brush points with finite lifespan
    const points = [];
    let hue = 300;
    let lastPos = null;

    const handlePointerMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Only record points if cursor is inside or near the footer
      if (x >= -40 && x <= width + 40 && y >= -40 && y <= height + 40) {
        const now = performance.now();

        if (!lastPos) {
          lastPos = { x, y };
          return;
        }

        const dx = x - lastPos.x;
        const dy = y - lastPos.y;
        const distance = Math.hypot(dx, dy);

        // Sub-step interpolation for continuous unbroken ribbons
        const steps = Math.max(Math.floor(distance / 2.5), 1);
        for (let i = 0; i <= steps; i++) {
          const interpX = lastPos.x + (dx * i) / steps;
          const interpY = lastPos.y + (dy * i) / steps;
          const brushRadius = Math.min(Math.max(distance * 0.85, 30), 54);

          points.push({
            x: interpX,
            y: interpY,
            radius: brushRadius,
            hue: hue,
            createdAt: now,
            duration: 2500, // 2.5 seconds lifespan before completely dissolving
          });

          // Shift hue smoothly for rainbow spectrum
          hue = (hue + 0.5) % 360;
        }

        // Limit buffer length for maximum performance
        if (points.length > 700) {
          points.splice(0, points.length - 700);
        }

        lastPos = { x, y };
      } else {
        lastPos = null;
      }
    };

    window.addEventListener('pointermove', handlePointerMove);

    // Render loop with real-time decay and fading
    let animId;
    const render = () => {
      const now = performance.now();
      ctx.clearRect(0, 0, width, height);

      // Filter out points that exceeded their lifetime
      let i = points.length;
      while (i--) {
        const p = points[i];
        const age = now - p.createdAt;
        if (age >= p.duration) {
          points.splice(i, 1);
          continue;
        }

        const progress = age / p.duration; // 0 (birth) -> 1 (death)
        // Smooth exponential fade-out
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
