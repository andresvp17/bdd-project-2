import { Icon } from '../icons'
import { KIND_LABEL } from '../lookup'
import type { RecentLookup } from '../recent'

export function StartState({
  recent,
  onPick,
  onClearRecent,
}: {
  recent: RecentLookup[]
  onPick: (query: string) => void
  onClearRecent: () => void
}) {
  return (
    <section className="start" aria-labelledby="start-title">
      <div className="start__intro">
        <h1 id="start-title">Un identificador, todo el expediente.</h1>
        <p>
          Consulte por placa, cédula, VIN o número de boleta. El registro reúne
          el vehículo, la cadena de propiedad y las multas en una sola lectura.
        </p>
      </div>

      <div className="start__types">
        <h2>Qué puede consultar</h2>
        <dl className="type-list">
          <div>
            <dt>Placa</dt>
            <dd>El vehículo, su titular actual y las multas asociadas.</dd>
          </div>
          <div>
            <dt>Cédula</dt>
            <dd>Los vehículos y las multas vinculados a un propietario.</dd>
          </div>
          <div>
            <dt>VIN</dt>
            <dd>La ficha del vehículo a partir de su identificación única.</dd>
          </div>
          <div>
            <dt>Boleta</dt>
            <dd>El detalle de una multa, su vehículo y su infractor.</dd>
          </div>
        </dl>
      </div>

      {recent.length > 0 && (
        <div className="recent">
          <div className="recent__head">
            <h2>Consultas recientes</h2>
            <button
              className="text-button"
              type="button"
              onClick={onClearRecent}
            >
              Borrar
            </button>
          </div>
          <ul className="recent__list">
            {recent.map((item) => (
              <li key={item.query}>
                <button
                  className="recent__item"
                  type="button"
                  onClick={() => onPick(item.query)}
                >
                  <span className="recent__kind">{KIND_LABEL[item.kind]}</span>
                  <span className="recent__query">{item.query}</span>
                  <span className="recent__label">{item.label}</span>
                  <Icon name="arrow" size={16} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
