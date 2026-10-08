import React from 'react';
import './RollingText.css';

/**
 * Splits text into individual characters and animates each character
 * with a staggered slide-up roll effect on hover.
 */
export default function RollingText({ text, className = '' }) {
  const letters = text.split('');

  return (
    <span className={`rolling-text-wrapper ${className}`}>
      {letters.map((char, index) => {
        if (char === ' ') {
          return <span key={index} className="rolling-space">&nbsp;</span>;
        }

        return (
          <span
            key={index}
            className="rolling-char-box"
            style={{ '--char-index': index }}
          >
            <span className="rolling-char primary">{char}</span>
            <span className="rolling-char secondary" aria-hidden="true">
              {char}
            </span>
          </span>
        );
      })}
    </span>
  );
}
