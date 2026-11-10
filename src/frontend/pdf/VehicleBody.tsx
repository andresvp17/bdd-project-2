import { Text, View } from '@react-pdf/renderer'
import type { VehicleView } from '../api'
import { formatDate, pluralize } from '../format'
import { PdfFacts } from './components/Facts'
import { PdfFinesTable } from './components/FinesTable'
import { PdfOwnershipTable } from './components/OwnershipTable'
import { PdfSection } from './components/Section'
import { ownerFacts, vehicleFacts } from './data'
import { styles } from './theme'

export function VehicleBody({ view }: { view: VehicleView }) {
  const current = view.current
  const last = view.ownership[0]

  return (
    <>
      <PdfSection
        title="Identificación del vehículo"
        note={`Registro ${view.vehicle.placa}`}
      >
        <PdfFacts items={vehicleFacts(view)} />
      </PdfSection>

      <PdfSection
        title="Titular actual"
        note={
          current != null
            ? `Documento ${current.entry.nro_documento_titulo}`
            : 'Sin titularidad vigente'
        }
      >
        {current != null ? (
          <PdfFacts items={ownerFacts(current.owner)} />
        ) : (
          <View style={styles.notice}>
            <Text style={styles.noticeText}>
              {last != null
                ? `Este vehículo no tiene una titularidad vigente. El último titular registrado fue ${last.owner.nombre_completo}, con cierre el ${formatDate(
                    last.entry.fecha_fin,
                  )}.`
                : 'Este vehículo no tiene propietarios vinculados en el historial.'}
            </Text>
          </View>
        )}
      </PdfSection>

      <PdfSection
        title="Cadena de propiedad"
        note={pluralize(
          view.ownership.length,
          'titularidad registrada',
          'titularidades registradas',
        )}
      >
        {view.ownership.length === 0 ? (
          <Text style={styles.empty}>
            No hay historial de propiedad registrado.
          </Text>
        ) : (
          <PdfOwnershipTable stages={view.ownership} mode="vehicle" />
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
            Sin multas registradas para esta placa.
          </Text>
        ) : (
          <PdfFinesTable fines={view.fines} showVehicle={false} />
        )}
      </PdfSection>
    </>
  )
}
