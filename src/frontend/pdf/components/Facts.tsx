import { Text, View } from '@react-pdf/renderer'
import type { FactItem } from '../data'
import { styles } from '../theme'

export function PdfFacts({ items }: { items: FactItem[] }) {
  return (
    <View style={styles.facts}>
      {items.map((item) => (
        <View
          key={item.label}
          style={[styles.fact, item.wide ? styles.factWide : {}]}
        >
          <Text style={styles.factLabel}>{item.label}</Text>
          <Text style={styles.factValue}>{item.value}</Text>
        </View>
      ))}
    </View>
  )
}
