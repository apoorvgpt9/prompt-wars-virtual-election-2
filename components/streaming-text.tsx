'use client';

import React, { useState, useEffect } from 'react';

interface StreamingTextProps {
  text: string;
  speed?: number;
}

/**
 * Renders text with a typewriting effect and a blinking cursor.
 * @param text The full text to display.
 * @param speed The speed of typing in milliseconds per character.
 */
export const StreamingText: React.FC<StreamingTextProps> = ({ text, speed = 20 }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let i = 0;
    setDisplayedText('');
    const timer = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(timer);
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return (
    <span className="inline-block">
      {displayedText}
      <span className="inline-block w-2 h-5 bg-primary ml-1 animate-pulse" aria-hidden="true" />
    </span>
  );
};
