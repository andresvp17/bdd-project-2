import { useState } from 'react'
import { deleteOwnership } from '../api'
import type { VehicleView } from '../api'
import {
  formatCedula,
  formatDate,
  formatVehicleModel,
} from '../format'
import { DeleteAction } from './forms/FormFrame'
import { OwnershipForm } from './forms/OwnershipForm'
import { Section, StatusTag } from './ui'

export function OwnershipSection({
  stages,
  title,
  note,
  mode = 'vehicle',
  onChanged,
}: {
  stages: VehicleView['ownership']
  title: string
  note?: string
  mode?: 'vehicle' | 'owner'
  onChanged: () => void
}) {
  const [editingId, setEditingId] = useState<string | null>(null)

  return (
    <Section id="historial" title={title} note={note}>
      {stages.length === 0 ? (
        <p className="empty">No hay historial de propiedad registrado.</p>
      ) : (
        <ol className="timeline">
          {stages.map((stage) => (
            <li
              className={`timeline__item${stage.isCurrent ? ' is-current' : ''}`}
              key={stage.entry.id}
            >
              <span className="timeline__marker" aria-hidden="true" />
              <div className="timeline__content">
                <p className="timeline__dates">
                  {formatDate(stage.entry.fecha_inicio)} —{' '}
                  {stage.entry.fecha_fin != null
                    ? formatDate(stage.entry.fecha_fin)
                    : 'Vigente'}
                </p>
                <p className="timeline__primary">
                  {mode === 'vehicle'
                    ? stage.owner.nombre_completo
                    : `${formatVehicleModel(stage.model)} · ${stage.vehicle.placa}`}
                </p>
                <p className="timeline__meta">
                  {mode === 'vehicle' && (
                    <span>{formatCedula(stage.owner)}</span>
                  )}
                  <span className="mono">
                    {stage.entry.nro_documento_titulo}
                  </span>
                  {stage.isCurrent && (
                    <StatusTag label="Vigente" tone="active" />
                  )}
                </p>

                {editingId === stage.entry.id ? (
                  <OwnershipForm
                    ownership={stage.entry}
                    onSaved={() => {
                      setEditingId(null)
                      onChanged()
                    }}
                    onCancel={() => setEditingId(null)}
                  />
                ) : (
                  <div className="timeline__actions">
                    <button
                      className="text-button"
                      type="button"
                      onClick={() => setEditingId(stage.entry.id)}
                    >
                      Editar
                    </button>
                    <DeleteAction
                      label="Eliminar"
                      confirmLabel="Eliminar"
                      onDelete={async () => {
                        await deleteOwnership(stage.entry.id)
                        onChanged()
                      }}
                    />
                  </div>
                )}
              </div>
            </li>
          ))}
        </ol>
      )}
    </Section>
  )
}
