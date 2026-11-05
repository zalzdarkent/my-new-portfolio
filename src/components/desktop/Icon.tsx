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

