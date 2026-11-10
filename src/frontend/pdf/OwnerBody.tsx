import { Text } from '@react-pdf/renderer'
import type { OwnerView, OwnershipStage } from '../api'
import {
  formatDate,
  formatVehicleModel,
  formatVehicleYear,
  pluralize,
} from '../format'
import { PdfFacts } from './components/Facts'
import { PdfFinesTable } from './components/FinesTable'
import { PdfOwnershipTable } from './components/OwnershipTable'
import { PdfSection } from './components/Section'
import { PdfTable } from './components/Table'
import { ownerFacts } from './data'
import { styles } from './theme'

export function OwnerBody({
  view,
  history,
}: {
  view: OwnerView
  history: OwnershipStage[]
}) {
  return (
    <>
      <PdfSection
        title="Propietario"
        note={`${view.owner.tipo} · ${
          view.currentVehicles.length > 0
            ? 'Con titularidad vigente'
            : 'Sin titularidad vigente'
        }`}
      >
        <PdfFacts items={ownerFacts(view.owner)} />
      </PdfSection>

      <PdfSection
        title="Vehículos"
        note={`${pluralize(view.vehicles.length, 'vehículo', 'vehículos')} · ${
          view.currentVehicles.length
        } con titularidad vigente`}
      >
        {view.vehicles.length === 0 ? (
          <Text style={styles.empty}>
            No hay vehículos vinculados a este propietario.
          </Text>
        ) : (
          <PdfTable
            head={['Vehículo', 'Placa', 'Año', 'Titularidad', 'Desde']}
            widths={[36, 16, 12, 18, 18]}
            rows={view.vehicles.map((entry) => [
              formatVehicleModel(entry.model),
              entry.vehicle.placa,
              formatVehicleYear(entry.model),
              {
                text: entry.isCurrent ? 'Vigente' : 'Cerrada',
                tone: entry.isCurrent ? 'active' : 'neutral',
              },
              formatDate(entry.stage.entry.fecha_inicio),
            ])}
          />
        )}
      </PdfSection>

      <PdfSection
        title="Titularidades registradas"
        note={pluralize(history.length, 'registro', 'registros')}
      >
        {history.length === 0 ? (
          <Text style={styles.empty}>
            No hay historial de propiedad registrado.
          </Text>
        ) : (
          <PdfOwnershipTable stages={history} mode="owner" />
        )}
      </PdfSection>

      <PdfSection
        title="Multas"
        note={`${pluralize(view.fines.length, 'multa', 'multas')} · ${
          view.fines.filter((fine) => !fine.isPaid).length
        } pendientes`}
      >
        {view.fines.length === 0 ? (
          <Text style={styles.empty}>
            Sin multas registradas a nombre de este propietario.
          </Text>
        ) : (
          <PdfFinesTable fines={view.fines} showVehicle />
        )}
      </PdfSection>
    </>
  )
}
