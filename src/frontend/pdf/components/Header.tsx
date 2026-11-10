import { Text, View } from '@react-pdf/renderer'
import type { Dossier } from '../../api'
import { formatDateTime } from '../../format'
import { KIND_LABEL, recordTitle } from '../../lookup'
import { styles } from '../theme'

export function PdfHeader({ dossier }: { dossier: Dossier }) {
  const copy = recordTitle(dossier)

  return (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View>
          <Text style={styles.brand}>Registro de Tránsito</Text>
          <Text style={styles.brandSub}>Consulta de expedientes</Text>
        </View>
        <View style={styles.stamp}>
          <Text style={styles.stampLabel}>Consulta</Text>
          <Text style={styles.stampValue}>
            {formatDateTime(dossier.generatedAt)}
          </Text>
          <Text style={[styles.stampLabel, { marginTop: 5 }]}>
            Solo lectura
          </Text>
        </View>
      </View>

      <Text style={styles.title}>{copy.title}</Text>
      <Text style={styles.subtitle}>{copy.subtitle}</Text>
      <Text style={styles.match}>
        Coincidencia por {KIND_LABEL[dossier.kind].toLowerCase()}:{' '}
        <Text style={styles.matchValue}>{dossier.query}</Text>
      </Text>
    </View>
  )
}
