import type { IconKind } from '../../types/portfolio'

export default function Icon({ kind, size = 32 }: { kind: IconKind; size?: number }) {
  if (kind === 'terminal') {
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="10" fill="#2d0922" />
        <rect x="2" y="2" width="44" height="44" rx="8" stroke="#E95420" strokeWidth="2" />
        <path d="M12 16L22 24L12 32" stroke="#4af626" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M24 32H36" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      </svg>
    )
  }
  if (kind === 'bash') {
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="10" fill="#1e1e1e" />
        <rect x="2" y="2" width="44" height="44" rx="8" stroke="#555" strokeWidth="2" />
        <path d="M12 16L20 22L12 28" stroke="#E95420" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M22 28H34" stroke="#4af626" strokeWidth="3" strokeLinecap="round" />
      </svg>
    )
  }
  if (kind === 'browser') {
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="21" fill="#1b3a6b" />
        <circle cx="24" cy="24" r="19" stroke="#E95420" strokeWidth="3" />
        <ellipse cx="24" cy="24" rx="9" ry="19" stroke="#60a5fa" strokeWidth="2" />
        <path d="M5 24H43" stroke="#60a5fa" strokeWidth="2" />
        <path d="M9 15H39M9 33H39" stroke="#60a5fa" strokeWidth="1.5" opacity="0.7" />
      </svg>
    )
  }
  if (kind === 'calculator') {
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="10" fill="#2d2d2d" />
        <rect x="9" y="8" width="30" height="10" rx="3" fill="#141414" />
        <circle cx="14" cy="25" r="3" fill="#bbb" />
        <circle cx="24" cy="25" r="3" fill="#bbb" />
        <circle cx="34" cy="25" r="3" fill="#bbb" />
        <circle cx="14" cy="35" r="3" fill="#bbb" />
        <circle cx="24" cy="35" r="3" fill="#bbb" />
        <rect x="30" y="32" width="8" height="6" rx="3" fill="#E95420" />
      </svg>
    )
  }
  if (kind === 'settings') {
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="10" fill="#3b3b3b" />
        <path
          d="M24 17a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm0-6 2.2 3.3 3.9-.6.9 3.8 3.6 1.5-1.3 3.7 2.2 3.3-2.9 2.6.4 3.9-3.8.9-1.5 3.6-3.7-1.3-3.7 1.3-1.5-3.6-3.8-.9.4-3.9-2.9-2.6 2.2-3.3-1.3-3.7 3.6-1.5.9-3.8 3.9.6L24 11Z"
          stroke="#e5e5e5"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
  if (kind === 'note') {
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="10" fill="#333333" />
        <path d="M14 10H34L38 14V38H14V10Z" fill="#fff" />
        <path d="M18 18H30M18 24H30M18 30H26" stroke="#555" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  }
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <path
        d="M6 12C6 9.79086 7.79086 8 10 8H20L24 12H38C40.2091 12 42 13.7909 42 16V36C42 38.2091 40.2091 40 38 40H10C7.79086 40 6 38.2091 6 36V12Z"
        fill="#E95420"
      />
      <path
        d="M6 18H42V36C42 38.2091 40.2091 40 38 40H10C7.79086 40 6 38.2091 6 36V18Z"
        fill="#FF7F4A"
      />
    </svg>
  )
}

