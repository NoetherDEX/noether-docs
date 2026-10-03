export function Wordmark({ pill = 'Docs' }: { pill?: string | null }) {
  return (
    <span className="inline-flex items-center gap-2">
      {/* Static SVG wordmark shared with the app (public/wordmark.svg). */}
      <img src="/wordmark.svg" alt="Noether" className="h-[15px] w-auto" draggable={false} />
      {pill ? <span className="noe-pill">{pill}</span> : null}
    </span>
  );
}
