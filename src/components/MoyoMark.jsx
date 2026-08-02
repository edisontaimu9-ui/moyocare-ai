/* ---------------------------------------------------------------------
   LOGO MARK: heart formed from two leaves, cross negative-space,
   neural nodes tracing the veins
--------------------------------------------------------------------- */
export function MoyoMark({ size = 30, c }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <path
        d="M24 40C24 40 6 29.2 6 17.6C6 11.2 11 6.4 17 6.4C20.2 6.4 22.8 8 24 10.4C25.2 8 27.8 6.4 31 6.4C37 6.4 42 11.2 42 17.6C42 29.2 24 40 24 40Z"
        fill={c.primary}
      />
      <path
        d="M24 10.4C24 10.4 24 22 24 40"
        stroke={c.bg}
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.55"
      />
      <rect x="21.1" y="17.4" width="5.8" height="1.7" rx="0.85" fill={c.bg} opacity="0.9" />
      <rect x="23.15" y="15.3" width="1.7" height="5.9" rx="0.85" fill={c.bg} opacity="0.9" />
      <circle cx="15.5" cy="18" r="1.6" fill={c.gold} />
      <circle cx="24" cy="27" r="1.6" fill={c.gold} />
      <circle cx="32.5" cy="18" r="1.6" fill={c.gold} />
      <path d="M15.5 18L24 27L32.5 18" stroke={c.gold} strokeWidth="1" opacity="0.8" />
    </svg>
  );
}
