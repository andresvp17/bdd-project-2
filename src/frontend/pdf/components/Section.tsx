import type { ReactNode } from 'react'
import { Text, View } from '@react-pdf/renderer'
import { styles } from '../theme'

export function PdfSection({
  title,
  note,
  children,
}: {
  title: string
  note?: string
  children: ReactNode
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHead}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {note != null && <Text style={styles.sectionNote}>{note}</Text>}
      </View>
      {children}
    </View>
  )
}
