import { Icon } from '../icons'
import { SAMPLES } from '../lookup'

export function MissingState({
  query,
  onPick,
  onClear,
}: {
  query: string
  onPick: (query: string) => void
  onClear: () => void
}) {
  return (
    <section className="state" role="status" aria-live="polite">
      <div className="state__icon">
        <Icon name="search" size={25} />
      </div>
      <div className="state__copy">
        <h1>No encontramos ese identificador.</h1>
        <p>
          La búsqueda <code>{query}</code> no coincide con ninguna placa,
          cédula, VIN o boleta del registro. Revise el dato o pruebe con un
          registro de demostración.
        </p>
        <div className="state__samples">
          <span>Probar:</span>
          {SAMPLES.slice(0, 3).map((sample) => (
            <button
              className="text-button"
              key={sample.query}
              type="button"
              onClick={() => onPick(sample.query)}
            >
              {sample.query}
            </button>
          ))}
        </div>
        <div className="state__actions">
          <button className="button" type="button" onClick={onClear}>
            Nueva consulta
          </button>
        </div>
      </div>
    </section>
  )
}
