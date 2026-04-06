export function IchimatsuDivider() {
  return (
    <div className="flex items-center justify-center gap-4 px-8 py-2" aria-hidden="true">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-divider to-transparent" />
      <svg width="12" height="12" viewBox="0 0 12 12" className="shrink-0 text-divider">
        <rect
          x="2"
          y="2"
          width="8"
          height="8"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.8"
          transform="rotate(45 6 6)"
        />
      </svg>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-divider to-transparent" />
    </div>
  );
}
