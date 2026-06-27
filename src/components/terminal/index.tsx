import { useState, useRef } from 'react';
import styles from './styles.module.css';

export interface TerminalLine {
  type: 'command' | 'output' | 'success' | 'comment';
  text: string;
}

interface TerminalProps {
  title?: string;
  lines: readonly TerminalLine[];
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

  const lineClass: Record<TerminalLine['type'], string> = {
    command: styles.lineCommand,
    output:  styles.lineOutput,
    success: styles.lineSuccess,
    comment: styles.lineComment,
  };

  return (
    <div className={`${styles.win} ${className}`}>
      {/* Chrome bar */}
      <div className={styles.header}>
        <div className={styles.trafficLights}>
          <span className={`${styles.light} bg-[#ff5f57]`} />
          <span className={`${styles.light} bg-[#febc2e]`} />
          <span className={`${styles.light} bg-[#28c840]`} />
        </div>
        <span className={styles.titleLabel}>{title}</span>
        {copyable && (
          <button onClick={copyAll} className={styles.copyBtn}>
            <span className={`material-symbols-outlined ${styles.copyIcon}`}>
              {copied ? 'check' : 'content_copy'}
            </span>
            {copied ? 'Copied' : 'Copy'}
          </button>
        )}
      </div>

      {/* Content */}
      <pre ref={ref} className={styles.pre}>
        {lines.map((line, i) => (
          <div key={i} className={lineClass[line.type]}>
            {line.type === 'command' ? (
              <>
                <span className={styles.prompt}>$ </span>
                {line.text}
              </>
            ) : (
              line.text
            )}
          </div>
        ))}
        <span className={`${styles.caret} cursor-blink`} aria-hidden />
      </pre>
    </div>
  );
}
