export function IchimatsuDivider() {
  return (
    <div
      className="h-1 w-full"
      style={{
        backgroundImage: `repeating-conic-gradient(
          rgba(194, 24, 91, 0.05) 0% 25%,
          transparent 0% 50%
        )`,
        backgroundSize: "8px 8px",
      }}
      aria-hidden="true"
    />
  );
}
