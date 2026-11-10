import type { ReactNode } from 'react'
import type { Tone } from '../lookup'

export function Section({
  id,
  title,
  note,
  actions,
  children,
}: {
  id: string
  title: string
  note?: string
  actions?: ReactNode
  children: ReactNode
}) {
  return (
    <section className="section" id={id} aria-labelledby={`${id}-title`}>
      <div className="section__head">
        <div className="section__heading">
          <h2 id={`${id}-title`}>{title}</h2>
          {note != null && <p className="section__note">{note}</p>}
        </div>
        {actions != null && <div className="section__tools">{actions}</div>}
      </div>
      {children}
    </section>
  )
}

export function Fact({
  label,
  value,
  mono = false,
  wide = false,
}: {
  label: string
  value: ReactNode
  mono?: boolean
  wide?: boolean
}) {
  return (
    <div
      className={`fact${mono ? ' fact--mono' : ''}${wide ? ' fact--wide' : ''}`}
    >
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  )
}

export function StatusTag({ label, tone }: { label: string; tone: Tone }) {
  return <span className={`tag tag--${tone}`}>{label}</span>
}

export function RailSection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="rail-section">
      <h2>{title}</h2>
      {children}
    </section>
  )
}

export function RailFact({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rail-fact">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  )
}

export function DataNote() {
  return (
    <RailSection title="Nota de datos">
      <p className="rail-note">
        Entorno de demostración. Los registros provienen del conjunto de ejemplo
        y no corresponden a personas reales.
      </p>
    </RailSection>
  )
}
