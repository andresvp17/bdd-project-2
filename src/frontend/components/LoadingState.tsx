export function LoadingState({ query }: { query: string }) {
  return (
    <section className="loading" aria-busy="true" aria-live="polite">
      <p className="sr-only">Consultando {query} en el registro…</p>
      <div className="loading__route" aria-hidden="true">
        <div className="skeleton skeleton--origin" />
        <div className="skeleton skeleton--track" />
        <div className="skeleton skeleton--status" />
      </div>
      <div className="loading__body" aria-hidden="true">
        <div className="skeleton skeleton--title" />
        <div className="skeleton skeleton--line" />
        <div className="loading__grid">
          {Array.from({ length: 6 }).map((_, index) => (
            <div className="skeleton skeleton--cell" key={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
