import { useState } from 'react'
import { FineForm } from './forms/FineForm'
import { InfractionForm } from './forms/InfractionForm'
import { ModelForm } from './forms/ModelForm'
import { OwnerForm } from './forms/OwnerForm'
import { OwnershipForm } from './forms/OwnershipForm'
import { VehicleForm } from './forms/VehicleForm'

type AdminKind = 'owner' | 'vehicle' | 'model' | 'infraction' | 'ownership' | 'fine'

const BUTTONS: Array<{ kind: AdminKind; label: string }> = [
  { kind: 'owner', label: 'Nuevo propietario' },
  { kind: 'vehicle', label: 'Nuevo vehículo' },
  { kind: 'model', label: 'Nuevo modelo' },
  { kind: 'infraction', label: 'Nueva infracción' },
  { kind: 'ownership', label: 'Nueva titularidad' },
  { kind: 'fine', label: 'Nueva multa' },
]

export function RecordAdminBar({
  ownerId,
  vehicleId,
  onSaved,
}: {
  ownerId?: string
  vehicleId?: string
  onSaved: (query?: string) => void
}) {
  const [open, setOpen] = useState<AdminKind | null>(null)

  function close() {
    setOpen(null)
  }

  function saved(query?: string) {
    setOpen(null)
    onSaved(query)
  }

  return (
    <section className="admin-bar" aria-label="Altas del registro">
      <div className="admin-bar__head">
        <div className="admin-bar__intro">
          <h2 className="admin-bar__title">Altas del registro</h2>
          <p className="admin-bar__note">
            Crea propietarios, vehículos, modelos, infracciones, titularidades
            y multas sin salir del expediente.
          </p>
        </div>
        <div className="admin-bar__buttons">
          {BUTTONS.map(({ kind, label }) => (
            <button
              key={kind}
              className={`button button--quiet${
                open === kind ? ' is-active' : ''
              }`}
              type="button"
              aria-expanded={open === kind}
              onClick={() => setOpen(open === kind ? null : kind)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {open === 'owner' && <OwnerForm onSaved={saved} onCancel={close} />}
      {open === 'vehicle' && <VehicleForm onSaved={saved} onCancel={close} />}
      {open === 'model' && <ModelForm onSaved={saved} onCancel={close} />}
      {open === 'infraction' && (
        <InfractionForm onSaved={saved} onCancel={close} />
      )}
      {open === 'ownership' && (
        <OwnershipForm
          ownerId={ownerId}
          vehicleId={vehicleId}
          onSaved={saved}
          onCancel={close}
        />
      )}
      {open === 'fine' && (
        <FineForm
          ownerId={ownerId}
          vehicleId={vehicleId}
          onSaved={saved}
          onCancel={close}
        />
      )}
    </section>
  )
}
