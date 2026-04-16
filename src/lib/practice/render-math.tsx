'use client';

import { InlineMath } from 'react-katex';
import React from 'react';

/**
 * Parse text containing $...$ (inline) and $$...$$ (block) LaTeX delimiters,
 * returning React elements with KaTeX-rendered math segments.
 */
export function renderMath(text: string): React.ReactNode[] {
  // Split on $$...$$ (block) and $...$ (inline) while keeping delimiters as capture groups
  const parts = text.split(/(\$\$[\s\S]*?\$\$|\$[^$]*?\$)/g);
  return parts.map((part, i) => {
    if (part.startsWith('$$') && part.endsWith('$$')) {
      const math = part.slice(2, -2).trim();
      return (
        <span key={i} className="block my-2 overflow-x-auto">
          <InlineMath math={math} />
        </span>
      );
    }
    if (part.startsWith('$') && part.endsWith('$')) {
      const math = part.slice(1, -1).trim();
      return <InlineMath key={i} math={math} />;
    }
    // Plain text segment
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}
