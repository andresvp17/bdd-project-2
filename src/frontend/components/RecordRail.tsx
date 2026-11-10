import {
  formatCedula,
  formatDate,
  formatDateTime,
  formatMoney,
  pluralize,
} from '../format'
import { Icon } from '../icons'
import type { DossierProps } from '../lookup'
import { fineTone, pendingTotal } from '../lookup'
import { DataNote, RailFact, RailSection, StatusTag } from './ui'

export function RecordRail({
  dossier,
  onOpenQuery,
}: Pick<DossierProps, 'dossier' | 'onOpenQuery'>) {
  const pending = dossier.fines.filter((fine) => !fine.isPaid)
  const pendingAmount = pendingTotal(dossier.fines)

  if (dossier.anchor === 'owner' && dossier.owner != null) {
    const view = dossier.owner
    const firstVehicle = view.currentVehicles[0] ?? view.vehicles[0] ?? null

    return (
      <>
        <RailSection title="Resumen">
          <dl className="rail-facts">
            <RailFact
              label="Vehículos"
              value={pluralize(view.vehicles.length, 'vehículo', 'vehículos')}
            />
            <RailFact
              label="Titularidad vigente"
              value={pluralize(
                view.currentVehicles.length,
                'vehículo',
                'vehículos',
              )}
            />
            <RailFact
              label="Multas pendientes"
              value={`${pending.length} de ${dossier.fines.length}`}
            />
            <RailFact
              label="Monto pendiente"
              value={formatMoney(pendingAmount)}
            />
          </dl>
        </RailSection>

        <RailSection title="Accesos">
          <div className="rail-links">
            {firstVehicle != null && (
              <button
                className="rail-link"
                type="button"
                onClick={() => onOpenQuery(firstVehicle.vehicle.placa)}
              >
                <span>Abrir vehículo {firstVehicle.vehicle.placa}</span>
                <Icon name="arrow" size={16} />
              </button>
            )}
            <a className="rail-link" href="#multas">
              <span>Ver multas del propietario</span>
              <Icon name="arrow" size={16} />
            </a>
          </div>
        </RailSection>

        <DataNote />
      </>
    )
  }

  if (dossier.anchor === 'fine' && dossier.fine != null) {
    const view = dossier.fine

    return (
      <>
        <RailSection title="Resumen">
          <dl className="rail-facts">
            <RailFact
              label="Estado"
              value={
                <StatusTag
                  label={view.isPaid ? 'Pagada' : 'Pendiente'}
                  tone={fineTone(view)}
                />
              }
            />
            <RailFact label="Monto" value={formatMoney(view.fine.monto)} />
            <RailFact
              label="Fecha"
              value={formatDateTime(view.fine.fecha_hora)}
            />
            <RailFact label="Vehículo" value={view.vehicle?.placa ?? '—'} />
          </dl>
        </RailSection>

        <RailSection title="Accesos">
          <div className="rail-links">
            {dossier.vehicle != null && (
              <button
                className="rail-link"
                type="button"
                onClick={() => onOpenQuery(dossier.vehicle!.vehicle.placa)}
              >
                <span>Abrir vehículo</span>
                <Icon name="arrow" size={16} />
              </button>
            )}
            {dossier.owner != null && (
              <button
                className="rail-link"
                type="button"
                onClick={() => onOpenQuery(formatCedula(dossier.owner!.owner))}
              >
                <span>Abrir infractor</span>
                <Icon name="arrow" size={16} />
              </button>
            )}
          </div>
        </RailSection>

        <DataNote />
      </>
    )
  }

  const view = dossier.vehicle
  const current = view?.current ?? null

  return (
    <>
      <RailSection title="Resumen">
        <dl className="rail-facts">
          <RailFact
            label="Titularidad"
            value={current != null ? 'Vigente' : 'Sin vigencia'}
          />
          <RailFact
            label="Desde"
            value={
              current != null ? formatDate(current.entry.fecha_inicio) : '—'
            }
          />
          <RailFact
            label="Multas pendientes"
            value={`${pending.length} de ${dossier.fines.length}`}
          />
          <RailFact
            label="Monto pendiente"
            value={formatMoney(pendingAmount)}
          />
        </dl>
      </RailSection>

      <RailSection title="Accesos">
        <div className="rail-links">
          {current != null && (
            <button
              className="rail-link"
              type="button"
              onClick={() => onOpenQuery(formatCedula(current.owner))}
            >
              <span>Abrir titular</span>
              <Icon name="arrow" size={16} />
            </button>
          )}
          <a className="rail-link" href="#multas">
            <span>Ver multas del vehículo</span>
            <Icon name="arrow" size={16} />
          </a>
        </div>
      </RailSection>

      <DataNote />
    </>
  )
}
