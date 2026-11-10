import { useState } from 'react'
import {
  deleteFine,
  deleteInfraction,
  deleteModel,
  deleteOwner,
  deleteVehicle,
} from '../api'
import type { DossierProps } from '../lookup'
import { formatCedula, pluralize } from '../format'
import { Icon } from '../icons'
import { FinesSection } from './FinesSection'
import { DeleteAction } from './forms/FormFrame'
import { FineForm } from './forms/FineForm'
import { InfractionForm } from './forms/InfractionForm'
import { ModelForm } from './forms/ModelForm'
import { OwnerForm } from './forms/OwnerForm'
import { VehicleForm } from './forms/VehicleForm'
import { FineFacts, OwnerFacts, VehicleFacts } from './facts'
import { OwnershipSection } from './OwnershipSection'
import { Section } from './ui'

type Editor = 'fine' | 'infraction' | 'vehicle' | 'model' | 'owner' | null

export function FineDossier({
  dossier,
  onOpenQuery,
  onChanged,
}: DossierProps) {
  const [editor, setEditor] = useState<Editor>(null)
  const fine = dossier.fine
  if (fine == null) return null

  const vehicle = dossier.vehicle
  const infractor = dossier.owner
  const currentOwner = vehicle?.current?.owner
  const ownerMismatch =
    currentOwner != null &&
    infractor != null &&
    currentOwner.id !== infractor.owner.id
  const otherFines = dossier.fines.filter(
    (entry) => entry.fine.id !== fine.fine.id,
  )
  const infraction = fine.infraction
  const infractionId = infraction?.id
  const model = vehicle?.model
  const modelId = model?.id

  function toggle(next: Exclude<Editor, null>) {
    setEditor((prev) => (prev === next ? null : next))
  }

  return (
    <>
      <Section
        id="multa"
        title="Detalle de la multa"
        note={fine.isPaid ? 'Pago registrado' : 'Pago pendiente'}
        actions={
          <>
            <button
              className="button button--quiet"
              type="button"
              onClick={() => toggle('fine')}
            >
              {editor === 'fine' ? 'Cerrar edición' : 'Editar multa'}
            </button>
            {infractionId != null && (
              <button
                className="button button--quiet"
                type="button"
                onClick={() => toggle('infraction')}
              >
                {editor === 'infraction'
                  ? 'Cerrar infracción'
                  : 'Editar infracción'}
              </button>
            )}
            <DeleteAction
              label="Eliminar multa"
              confirmLabel="Eliminar multa"
              onDelete={async () => {
                await deleteFine(fine.fine.id)
                onChanged()
              }}
            />
            {infractionId != null && (
              <DeleteAction
                label="Eliminar infracción"
                confirmLabel="Eliminar infracción"
                onDelete={async () => {
                  await deleteInfraction(infractionId)
                  onChanged()
                }}
              />
            )}
          </>
        }
      >
        {editor === 'fine' ? (
          <FineForm
            fine={fine.fine}
            onSaved={() => {
              setEditor(null)
              onChanged()
            }}
            onCancel={() => setEditor(null)}
          />
        ) : (
          <FineFacts view={fine} />
        )}

        {editor === 'infraction' && infractionId != null && (
          <InfractionForm
            infraction={infraction}
            onSaved={() => {
              setEditor(null)
              onChanged()
            }}
            onCancel={() => setEditor(null)}
          />
        )}
      </Section>

      {ownerMismatch && currentOwner != null && infractor != null && (
        <div className="notice notice--warn notice--section">
          <Icon name="alert" size={20} />
          <div>
            <strong>El infractor no es el titular actual del vehículo.</strong>
            <p>
              La multa fue registrada a nombre de{' '}
              {infractor.owner.nombre_completo}. El titular vigente es{' '}
              {currentOwner.nombre_completo}.
            </p>
          </div>
        </div>
      )}

      {vehicle != null && (
        <>
          <Section
            id="vehiculo"
            title="Vehículo de la multa"
            note={`Registro ${vehicle.vehicle.placa}`}
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
                    await deleteVehicle(vehicle.vehicle.id)
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
                vehicle={vehicle.vehicle}
                onSaved={() => {
                  setEditor(null)
                  onChanged()
                }}
                onCancel={() => setEditor(null)}
              />
            ) : (
              <VehicleFacts view={vehicle} />
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

            {editor !== 'vehicle' && (
              <div className="section__actions">
                <button
                  className="button button--quiet"
                  type="button"
                  onClick={() => onOpenQuery(vehicle.vehicle.placa)}
                >
                  Abrir expediente del vehículo
                  <Icon name="arrow" size={16} />
                </button>
              </div>
            )}
          </Section>

          <OwnershipSection
            stages={vehicle.ownership}
            title="Cadena de propiedad"
            note={pluralize(
              vehicle.ownership.length,
              'titularidad registrada',
              'titularidades registradas',
            )}
            onChanged={onChanged}
          />
        </>
      )}

      {infractor != null && (
        <Section
          id="titular"
          title="Infractor"
          note={`${infractor.owner.tipo} · ${formatCedula(infractor.owner)}`}
          actions={
            <>
              <button
                className="button button--quiet"
                type="button"
                onClick={() => toggle('owner')}
              >
                {editor === 'owner'
                  ? 'Cerrar edición'
                  : 'Editar propietario'}
              </button>
              <DeleteAction
                label="Eliminar propietario"
                confirmLabel="Eliminar propietario"
                onDelete={async () => {
                  await deleteOwner(infractor.owner.id)
                  onChanged()
                }}
              />
            </>
          }
        >
          {editor === 'owner' ? (
            <OwnerForm
              owner={infractor.owner}
              onSaved={() => {
                setEditor(null)
                onChanged()
              }}
              onCancel={() => setEditor(null)}
            />
          ) : (
            <>
              <OwnerFacts owner={infractor.owner} />
              <div className="section__actions">
                <button
                  className="button button--quiet"
                  type="button"
                  onClick={() => onOpenQuery(formatCedula(infractor.owner))}
                >
                  Abrir expediente del propietario
                  <Icon name="arrow" size={16} />
                </button>
              </div>
            </>
          )}
        </Section>
      )}

      <FinesSection
        fines={otherFines}
        title="Otras multas del vehículo"
        onOpenQuery={onOpenQuery}
        emptyMessage="No hay otras multas registradas para este vehículo."
        onChanged={onChanged}
      />
    </>
  )
}
