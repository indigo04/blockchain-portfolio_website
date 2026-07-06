export function BackgroundGlow() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="absolute -left-140 top-1/2 h-280 w-280 -translate-y-1/2"
        style={{
          background:
            "radial-gradient(circle, rgba(139,92,246,.18) 0%, rgba(139,92,246,.08) 40%, transparent 75%)",
        }}
      />

      <div
        className="absolute -right-140 -top-1/4 h-300 w-300"
        style={{
          background:
            "radial-gradient(circle, rgba(139,92,246,.14) 0%, rgba(139,92,246,.05) 40%, transparent 75%)",
        }}
      />
    </div>
  );
}
