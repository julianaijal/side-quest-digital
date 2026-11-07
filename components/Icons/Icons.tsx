// Decorative inline SVG icons. All paths come from the design files.
// Every icon is aria-hidden: the surrounding text carries the meaning.

type IconProps = { size?: number; className?: string };

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

export function LogoMark({ size = 22, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" aria-hidden="true" className={className}>
      <path d="M11 1 L21 11 L11 21 L1 11 Z" fill="none" stroke="var(--theme-accent)" strokeWidth="1.75" />
      <path d="M11 7 L15 11 L11 15 L7 11 Z" fill="var(--theme-action)" />
    </svg>
  );
}

/** Small solid sand diamond, used in the hero badge. */
export function Diamond({ size = 10, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" aria-hidden="true" className={className}>
      <path d="M5 0 L10 5 L5 10 L0 5 Z" fill="var(--theme-action)" />
    </svg>
  );
}

/** Small solid mint diamond, used in the footer. */
export function DiamondSolid({ size = 10, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" aria-hidden="true" className={className}>
      <path d="M5 0 L10 5 L5 10 L0 5 Z" fill="var(--theme-accent)" />
    </svg>
  );
}

export function SearchIcon({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" strokeWidth="1.75" aria-hidden="true" className={className} {...stroke}>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-4-4" />
      <path d="M8.5 11h5" />
    </svg>
  );
}

export function SparkleIcon({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" strokeWidth="1.75" aria-hidden="true" className={className} {...stroke}>
      <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" />
      <path d="M19 17v4M17 19h4" />
    </svg>
  );
}

export function GaugeIcon({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" strokeWidth="1.75" aria-hidden="true" className={className} {...stroke}>
      <path d="M4 17a8 8 0 1 1 16 0" />
      <path d="M12 17l4-5" />
      <path d="M12 17h.01" />
    </svg>
  );
}

export function CodeIcon({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" strokeWidth="1.75" aria-hidden="true" className={className} {...stroke}>
      <path d="M8 7l-5 5 5 5" />
      <path d="M16 7l5 5-5 5" />
      <path d="M13.5 4l-3 16" />
    </svg>
  );
}

export function ChartIcon({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" strokeWidth="1.75" aria-hidden="true" className={className} {...stroke}>
      <path d="M3 20h18" />
      <path d="M6 16v-5" />
      <path d="M11 16V6" />
      <path d="M16 16v-8" />
    </svg>
  );
}

export function LinkIcon({ size = 12, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" strokeWidth="2" aria-hidden="true" className={className} {...stroke}>
      <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" />
      <path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
    </svg>
  );
}

export function CopyIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" strokeWidth="2" aria-hidden="true" className={className} {...stroke}>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V6a2 2 0 0 1 2-2h8" />
    </svg>
  );
}

export function CheckIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" strokeWidth="2.25" aria-hidden="true" className={className} {...stroke}>
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

export function ClockIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" strokeWidth="1.75" aria-hidden="true" className={className} {...stroke}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function LinkedInIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" strokeWidth="1.75" aria-hidden="true" className={className} {...stroke}>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7" />
    </svg>
  );
}

export function MenuIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" strokeWidth="1.75" aria-hidden="true" className={className} {...stroke}>
      <path d="M4 8h16M4 16h16" />
    </svg>
  );
}

export function CloseIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" strokeWidth="1.75" aria-hidden="true" className={className} {...stroke}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
