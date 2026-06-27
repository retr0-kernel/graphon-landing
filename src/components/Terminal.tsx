import { useState, useRef } from 'react';

interface Line {
  type: 'command' | 'output' | 'success' | 'comment';
  text: string;
}

interface TerminalProps {
  title?: string;
  lines: Line[];
  copyable?: boolean;
  className?: string;
}

export default function Terminal({ title = 'terminal', lines, copyable = false, className = '' }: TerminalProps) {
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLPreElement>(null);

  const copyAll = () => {
    const text = lines
      .filter(l => l.type === 'command')
      .map(l => l.text.replace(/^\$\s*/, ''))
      .join('\n');
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  return (
    <div className={`terminal-win ${className}`}>
      {/* Chrome bar */}
      <div className="flex items-center justify-between terminal-header">
        <div className="flex items-center gap-1.5">
          <span className="traffic-light bg-[#ff5f57]" />
          <span className="traffic-light bg-[#febc2e]" />
          <span className="traffic-light bg-[#28c840]" />
        </div>
        <span className="text-label-caps text-on-surface-variant uppercase mx-auto">{title}</span>
        {copyable && (
          <button
            onClick={copyAll}
            className="flex items-center gap-1 text-label-caps uppercase text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[14px]">
              {copied ? 'check' : 'content_copy'}
            </span>
            {copied ? 'Copied' : 'Copy'}
          </button>
        )}
      </div>

      {/* Content */}
      <pre ref={ref} className="font-mono text-code-md p-4 overflow-x-auto leading-relaxed">
        {lines.map((line, i) => (
          <div key={i} className={lineClass(line.type)}>
            {line.type === 'command' && (
              <>
                <span className="text-tertiary select-none">$ </span>
                {line.text}
              </>
            )}
            {line.type !== 'command' && line.text}
          </div>
        ))}
        <span className="inline-block w-2 h-4 bg-primary/80 cursor-blink ml-0.5" aria-hidden />
      </pre>
    </div>
  );
}

function lineClass(type: Line['type']): string {
  switch (type) {
    case 'command': return 'text-on-surface';
    case 'output':  return 'text-on-surface-variant';
    case 'success': return 'text-tertiary';
    case 'comment': return 'text-on-surface-variant/60';
    default:        return 'text-on-surface';
  }
}
