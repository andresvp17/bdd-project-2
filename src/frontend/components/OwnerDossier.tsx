import { useState } from 'react'
import { deleteOwner } from '../api'
import type { DossierProps } from '../lookup'
import { pluralize } from '../format'
import { FinesSection } from './FinesSection'
import { DeleteAction } from './forms/FormFrame'
import { OwnerForm } from './forms/OwnerForm'
import { OwnerFacts } from './facts'
import { OwnerVehiclesSection } from './OwnerVehiclesSection'
import { OwnershipSection } from './OwnershipSection'
import { Section } from './ui'

export function OwnerDossier({
  dossier,
  onOpenQuery,
  onChanged,
}: DossierProps) {
  const [editing, setEditing] = useState(false)
  const view = dossier.owner
  if (view == null) return null

  const owner = view.owner

  return (
    <>
      <Section
        id="titular"
        title="Propietario"
        note={`${view.owner.tipo} · ${
          view.currentVehicles.length > 0
            ? 'Con titularidad vigente'
            : 'Sin titularidad vigente'
        }`}
        actions={
          <>
            <button
              className="button button--quiet"
              type="button"
              onClick={() => setEditing((prev) => !prev)}
            >
              {editing ? 'Cerrar edición' : 'Editar propietario'}
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
        }
      >
        {editing ? (
          <OwnerForm
            owner={owner}
            onSaved={() => {
              setEditing(false)
              onChanged()
            }}
            onCancel={() => setEditing(false)}
          />
        ) : (
          <OwnerFacts owner={view.owner} />
        )}
      </Section>

      <OwnerVehiclesSection
        vehicles={view.vehicles}
        onOpenQuery={onOpenQuery}
        onChanged={onChanged}
      />

      <OwnershipSection
        stages={dossier.history}
        title="Titularidades registradas"
        note={pluralize(dossier.history.length, 'registro', 'registros')}
        mode="owner"
        onChanged={onChanged}
      />

      <FinesSection
        fines={view.fines}
        onOpenQuery={onOpenQuery}
        showVehicle
        emptyMessage="Sin multas registradas a nombre de este propietario."
        onChanged={onChanged}
      />
    </>
  )
}
