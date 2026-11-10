import { useState } from 'react'
import { deleteModel, deleteOwner, deleteVehicle } from '../api'
import type { DossierProps } from '../lookup'
import { formatCedula, formatDate, pluralize } from '../format'
import { Icon } from '../icons'
import { FinesSection } from './FinesSection'
import { DeleteAction } from './forms/FormFrame'
import { ModelForm } from './forms/ModelForm'
import { OwnerForm } from './forms/OwnerForm'
import { VehicleForm } from './forms/VehicleForm'
import { OwnerFacts, VehicleFacts } from './facts'
import { OwnershipSection } from './OwnershipSection'
import { Section } from './ui'

type Editor = 'vehicle' | 'model' | 'owner' | null

export function VehicleDossier({
  dossier,
  onOpenQuery,
  onChanged,
}: DossierProps) {
  const [editor, setEditor] = useState<Editor>(null)
  const view = dossier.vehicle
  if (view == null) return null

  const current = view.current
  const last = view.ownership[0]
  const owner = current?.owner ?? last?.owner ?? null
  const model = view.model
  const modelId = model?.id

  function toggle(next: Exclude<Editor, null>) {
    setEditor((prev) => (prev === next ? null : next))
  }

  return (
    <>
      <Section
        id="vehiculo"
        title="Identificación del vehículo"
        note={`Registro ${view.vehicle.placa}`}
        actions={
          <>
            <button
              className="button button--quiet"
              type="button"
              onClick={() => toggle('vehicle')}
            >
              {editor === 'vehicle' ? 'Cerrar edición' : 'Editar vehículo'}
            </button>
            {modelId != null && (
              <button
                className="button button--quiet"
                type="button"
                onClick={() => toggle('model')}
              >
                {editor === 'model' ? 'Cerrar modelo' : 'Editar modelo'}
              </button>
            )}
            <DeleteAction
              label="Eliminar vehículo"
              confirmLabel="Eliminar vehículo"
              onDelete={async () => {
                await deleteVehicle(view.vehicle.id)
                onChanged()
              }}
            />
            {modelId != null && (
              <DeleteAction
                label="Eliminar modelo"
                confirmLabel="Eliminar modelo"
                onDelete={async () => {
                  await deleteModel(modelId)
                  onChanged()
                }}
              />
            )}
          </>
        }
      >
        {editor === 'vehicle' ? (
          <VehicleForm
            vehicle={view.vehicle}
            onSaved={() => {
              setEditor(null)
              onChanged()
            }}
            onCancel={() => setEditor(null)}
          />
        ) : (
          <VehicleFacts view={view} />
        )}

        {editor === 'model' && modelId != null && (
          <ModelForm
            model={model}
            onSaved={() => {
              setEditor(null)
              onChanged()
            }}
            onCancel={() => setEditor(null)}
          />
        )}
      </Section>

      <Section
        id="titular"
        title="Titular actual"
        note={
          current != null
            ? `Documento ${current.entry.nro_documento_titulo}`
            : 'Sin titularidad vigente'
        }
        actions={
          owner != null ? (
            <>
              <button
                className="button button--quiet"
                type="button"
                onClick={() => toggle('owner')}
              >
                {editor === 'owner' ? 'Cerrar edición' : 'Editar propietario'}
              </button>
              <DeleteAction
                label="Eliminar propietario"
                confirmLabel="Eliminar propietario"
                onDelete={async () => {
                  await deleteOwner(owner.id)
                  onChanged()
                }}
              />
            </>
          ) : undefined
        }
      >
        {editor === 'owner' && owner != null ? (
          <OwnerForm
            owner={owner}
            onSaved={() => {
              setEditor(null)
              onChanged()
            }}
            onCancel={() => setEditor(null)}
          />
        ) : current != null ? (
          <>
            <OwnerFacts owner={current.owner} />
            <div className="section__actions">
              <button
                className="button button--quiet"
                type="button"
                onClick={() => onOpenQuery(formatCedula(current.owner))}
              >
                Abrir expediente del propietario
                <Icon name="arrow" size={16} />
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="notice notice--neutral">
              <Icon name="alert" size={20} />
              <div>
                <strong>Este vehículo no tiene una titularidad vigente.</strong>
                <p>
                  {last != null
                    ? `El último titular registrado fue ${
                        last.owner.nombre_completo
                      }, con cierre el ${formatDate(last.entry.fecha_fin)}.`
                    : 'No hay propietarios vinculados en el historial.'}
                </p>
              </div>
            </div>
            {last != null && <OwnerFacts owner={last.owner} />}
          </>
        )}
      </Section>

      <OwnershipSection
        stages={view.ownership}
        title="Cadena de propiedad"
        note={pluralize(
          view.ownership.length,
          'titularidad registrada',
          'titularidades registradas',
        )}
        onChanged={onChanged}
      />

      <FinesSection
        fines={view.fines}
        onOpenQuery={onOpenQuery}
        emptyMessage="Sin multas registradas para esta placa."
        onChanged={onChanged}
      />
    </>
  )
}
