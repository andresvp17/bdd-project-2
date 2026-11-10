import { Text, View } from '@react-pdf/renderer'
import type { Dossier } from '../../api'
import { formatDateTime } from '../../format'
import { styles } from '../theme'

export function PdfFooter({ dossier }: { dossier: Dossier }) {
  return (
    <View style={styles.footer} fixed>
      <Text>
        Documento generado el {formatDateTime(dossier.generatedAt)} · Datos de
        demostración
      </Text>
      <Text
        render={({ pageNumber, totalPages }) =>
          `Página ${pageNumber} de ${totalPages}`
        }
      />
    </View>
  )
}
