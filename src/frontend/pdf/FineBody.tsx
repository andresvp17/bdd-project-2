import { Text, View } from '@react-pdf/renderer'
import type { Dossier } from '../api'
import { formatCedula, pluralize } from '../format'
import { PdfFacts } from './components/Facts'
import { PdfOwnershipTable } from './components/OwnershipTable'
import { PdfSection } from './components/Section'
import { fineFacts, ownerFacts, vehicleFacts } from './data'
import { styles } from './theme'

export function FineBody({ dossier }: { dossier: Dossier }) {
  const fine = dossier.fine
  if (fine == null) return null

  const vehicle = dossier.vehicle
  const infractor = dossier.owner
  const currentOwner = vehicle?.current?.owner
  const ownerMismatch =
    currentOwner != null &&
    infractor != null &&
    currentOwner.id !== infractor.owner.id

  return (
    <>
      <PdfSection
        title="Detalle de la multa"
        note={fine.isPaid ? 'Pago registrado' : 'Pago pendiente'}
      >
        <PdfFacts items={fineFacts(fine)} />
      </PdfSection>

      {ownerMismatch && currentOwner != null && infractor != null && (
        <View style={styles.notice}>
          <Text style={styles.noticeText}>
            El infractor no es el titular actual del vehículo. La multa fue
            registrada a nombre de {infractor.owner.nombre_completo}. El titular
            vigente es {currentOwner.nombre_completo}.
          </Text>
        </View>
      )}

      {vehicle != null && (
        <>
          <PdfSection
            title="Vehículo de la multa"
            note={`Registro ${vehicle.vehicle.placa}`}
          >
            <PdfFacts items={vehicleFacts(vehicle)} />
          </PdfSection>

          <PdfSection
            title="Cadena de propiedad"
            note={pluralize(
              vehicle.ownership.length,
              'titularidad registrada',
              'titularidades registradas',
            )}
          >
            {vehicle.ownership.length === 0 ? (
              <Text style={styles.empty}>
                No hay historial de propiedad registrado.
              </Text>
            ) : (
              <PdfOwnershipTable stages={vehicle.ownership} mode="vehicle" />
            )}
          </PdfSection>
        </>
      )}

      {infractor != null && (
        <PdfSection
          title="Infractor"
          note={`${infractor.owner.tipo} · ${formatCedula(infractor.owner)}`}
        >
          <PdfFacts items={ownerFacts(infractor.owner)} />
        </PdfSection>
      )}
    </>
  )
}
