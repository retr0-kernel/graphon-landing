interface GraphonLogoProps {
  size?: number;
  className?: string;
}

export default function GraphonLogo({ size = 24, className }: GraphonLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={className}
    >
      <circle
        cx="12" cy="12" r="10"
        className="fill-surface-container-high stroke-outline-variant"
        strokeWidth="1"
      />
      <circle cx="12" cy="6"  r="2.5" className="fill-primary" />
      <circle cx="6"  cy="15" r="2"   className="fill-secondary" />
      <circle cx="18" cy="15" r="2"   className="fill-tertiary" />
      <line x1="12" y1="8.5"  x2="6"  y2="13" className="stroke-outline" strokeWidth="1" />
      <line x1="12" y1="8.5"  x2="18" y2="13" className="stroke-outline" strokeWidth="1" />
      <line x1="6"  y1="15"   x2="18" y2="15" className="stroke-outline" strokeWidth="1" />
    </svg>
  );
}
