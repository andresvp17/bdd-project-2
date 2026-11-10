import { clearRegistryCache } from '../api'
import type { DossierProps } from '../lookup'
import { buildRoute } from '../lookup'
import { FineDossier } from './FineDossier'
import { OwnerDossier } from './OwnerDossier'
import { RecordAdminBar } from './RecordAdminBar'
import { RecordHeader } from './RecordHeader'
import { RecordRail } from './RecordRail'
import { RouteStrip } from './RouteStrip'
import { VehicleDossier } from './VehicleDossier'

function DossierMain({ dossier, onOpenQuery, onChanged }: DossierProps) {
  if (dossier.anchor === 'owner' && dossier.owner != null) {
    return (
      <OwnerDossier
        dossier={dossier}
        onOpenQuery={onOpenQuery}
        onChanged={onChanged}
      />
    )
  }

  if (dossier.anchor === 'fine' && dossier.fine != null) {
    return (
      <FineDossier
        dossier={dossier}
        onOpenQuery={onOpenQuery}
        onChanged={onChanged}
      />
    )
  }

  if (dossier.vehicle != null) {
    return (
      <VehicleDossier
        dossier={dossier}
        onOpenQuery={onOpenQuery}
        onChanged={onChanged}
      />
    )
  }

  return null
}

export function DossierView({ dossier, onOpenQuery, onChanged }: DossierProps) {
  const route = buildRoute(dossier)
  const ownerId =
    dossier.owner?.owner.id ??
    dossier.vehicle?.current?.owner.id ??
    dossier.vehicle?.ownership[0]?.owner.id ??
    dossier.fine?.owner?.id
  const vehicleId =
    dossier.vehicle?.vehicle.id ??
    dossier.fine?.vehicle?.id ??
    dossier.owner?.vehicles[0]?.vehicle.id

  function handleSaved(query?: string) {
    if (query == null) {
      onChanged()
      return
    }

    clearRegistryCache()
    onOpenQuery(query)
  }

  return (
    <article className="record" aria-labelledby="record-title">
      <RouteStrip route={route} />

      <div className="record__body">
        <RecordHeader dossier={dossier} />

        <RecordAdminBar
          ownerId={ownerId}
          vehicleId={vehicleId}
          onSaved={handleSaved}
        />

        <div className="record__grid">
          <div className="record__main">
            <DossierMain
              dossier={dossier}
              onOpenQuery={onOpenQuery}
              onChanged={onChanged}
            />
          </div>
          <aside className="record__rail" aria-label="Resumen del expediente">
            <RecordRail dossier={dossier} onOpenQuery={onOpenQuery} />
          </aside>
        </div>
      </div>
    </article>
  )
}
