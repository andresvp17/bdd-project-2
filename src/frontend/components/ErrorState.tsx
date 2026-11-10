import { Icon } from '../icons'

export function ErrorState({
  query,
  message,
  onRetry,
  onClear,
}: {
  query: string
  message: string
  onRetry: () => void
  onClear: () => void
}) {
  return (
    <section className="state state--error" role="alert">
      <div className="state__icon">
        <Icon name="alert" size={25} />
      </div>
      <div className="state__copy">
        <h1>No se pudo consultar el registro.</h1>
        <p>
          {message} La búsqueda <code>{query}</code> no se perdió. Verifique que
          el servidor esté disponible e intente de nuevo.
        </p>
        <div className="state__actions">
          <button className="button" type="button" onClick={onRetry}>
            Reintentar
          </button>
          <button
            className="button button--quiet"
            type="button"
            onClick={onClear}
          >
            Limpiar consulta
          </button>
        </div>
      </div>
    </section>
  )
}
