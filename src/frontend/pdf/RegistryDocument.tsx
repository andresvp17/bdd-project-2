import { Document, Page, View } from '@react-pdf/renderer'
import type { Dossier } from '../api'
import { recordTitle } from '../lookup'
import { PdfFooter } from './components/Footer'
import { PdfHeader } from './components/Header'
import { FineBody } from './FineBody'
import { OwnerBody } from './OwnerBody'
import { styles } from './theme'
import { VehicleBody } from './VehicleBody'

function Body({ dossier }: { dossier: Dossier }) {
  if (dossier.anchor === 'owner' && dossier.owner != null) {
    return <OwnerBody view={dossier.owner} history={dossier.history} />
  }

  if (dossier.anchor === 'fine' && dossier.fine != null) {
    return <FineBody dossier={dossier} />
  }

  if (dossier.vehicle != null) {
    return <VehicleBody view={dossier.vehicle} />
  }

  return null
}

export function RegistryDocument({ dossier }: { dossier: Dossier }) {
  const copy = recordTitle(dossier)

  return (
    <Document
      title={copy.title}
      author="Registro de Tránsito"
      subject={`Expediente ${dossier.query}`}
      creator="Registro de Tránsito"
      producer="Registro de Tránsito"
    >
      <Page size="A4" style={styles.page} wrap>
        <PdfHeader dossier={dossier} />
        <View style={styles.body}>
          <Body dossier={dossier} />
        </View>
        <PdfFooter dossier={dossier} />
      </Page>
    </Document>
  )
}
