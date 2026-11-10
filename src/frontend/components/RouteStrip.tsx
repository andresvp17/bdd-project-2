import type { CSSProperties } from 'react'
import { Icon } from '../icons'
import type { RouteModel } from '../lookup'

export function RouteStrip({ route }: { route: RouteModel }) {
  const longOrigin = route.origin.value.length > 13

  return (
    <nav className="route" aria-label="Ruta del expediente">
      <div className="route__origin">
        <span className="route__origin-label">{route.origin.label}</span>
        <strong
          className={`route__origin-value${
            longOrigin ? ' route__origin-value--long' : ''
          }`}
        >
          {route.origin.value}
        </strong>
        <span className="route__origin-meta">{route.origin.meta}</span>
      </div>

      <ol className="route__track">
        {route.stops.map((stop, index) => (
          <li
            className="route__stop"
            key={stop.label}
            style={{ '--stop': index } as CSSProperties}
          >
            <a className="route__stop-link" href={`#${stop.target}`}>
              <span className="route__stop-icon">
                <Icon name={stop.icon} size={18} />
              </span>
              <span className="route__stop-label">{stop.label}</span>
              <strong className="route__stop-value" title={stop.value}>
                {stop.value}
              </strong>
              <span className="route__stop-meta" title={stop.meta}>
                {stop.meta}
              </span>
            </a>
          </li>
        ))}
      </ol>

      <div className={`route__status route__status--${route.status.tone}`}>
        <span className="route__status-label">Estado</span>
        <strong className="route__status-value">{route.status.label}</strong>
        <span className="route__status-meta">{route.status.meta}</span>
      </div>
    </nav>
  )
}
