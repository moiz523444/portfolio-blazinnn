import React, { useEffect, useRef, useState } from 'react';
import './CustomCursor.css';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [cursorState, setCursorState] = useState({
    active: false,
    text: '',
    variant: 'default', // 'default' | 'link' | 'project'
  });

  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const isVisible = useRef(false);

  useEffect(() => {
    const onMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible.current) {
        isVisible.current = true;
        if (dotRef.current) dotRef.current.style.opacity = '1';
        if (ringRef.current) ringRef.current.style.opacity = '1';
      }
    };

    const onMouseLeave = () => {
      isVisible.current = false;
      if (dotRef.current) dotRef.current.style.opacity = '0';
      if (ringRef.current) ringRef.current.style.opacity = '0';
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);

    // Smooth Lerp loop for ring follower
    let animationFrameId;
    const updatePosition = () => {
      const lerp = 0.15;
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * lerp;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * lerp;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0)`;
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(updatePosition);
    };

    animationFrameId = requestAnimationFrame(updatePosition);

    // Dynamic hover detection for interactive elements
    const handleElementHover = (e) => {
      const target = e.target.closest('[data-cursor]');
      if (target) {
        const type = target.getAttribute('data-cursor');
        const text = target.getAttribute('data-cursor-text') || '';
        setCursorState({ active: true, variant: type, text });
      } else {
        const interactive = e.target.closest('a, button, input');
        if (interactive) {
          setCursorState({ active: true, variant: 'link', text: '' });
        } else {
          setCursorState({ active: false, variant: 'default', text: '' });
        }
      }
    };

    document.addEventListener('mouseover', handleElementHover);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseover', handleElementHover);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      {/* Precision inner dot */}
      <div
        ref={dotRef}
        className={`custom-cursor-dot ${cursorState.active ? 'active' : ''}`}
      />

      {/* Fluid trailing follower */}
      <div
        ref={ringRef}
        className={`custom-cursor-ring variant-${cursorState.variant} ${
          cursorState.active ? 'is-hovering' : ''
        }`}
      >
        {cursorState.text && (
          <span className="custom-cursor-text">{cursorState.text}</span>
        )}
      </div>
    </>
  );
}
