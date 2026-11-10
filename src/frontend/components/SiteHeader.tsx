import { Icon } from '../icons'
import { useClock } from '../hooks/useClock'

const TIME_FORMAT = new Intl.DateTimeFormat('es-VE', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

export function SiteHeader() {
  const now = useClock()

  return (
    <header className="topbar">
      <div className="shell topbar__inner">
        <div className="brand">
          <span className="brand__mark" aria-hidden="true">
            <Icon name="route" size={22} />
          </span>
          <span className="brand__copy">
            <span className="brand__name">Registro de Tránsito</span>
            <span className="brand__sub">Consulta de expedientes</span>
          </span>
        </div>

        <div className="topbar__meta">
          <time className="counter__time" dateTime={now.toISOString()}>
            {TIME_FORMAT.format(now)}
          </time>
        </div>
      </div>
    </header>
  )
}
