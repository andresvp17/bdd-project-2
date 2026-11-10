import { Text, View } from '@react-pdf/renderer'
import type { Cell } from '../theme'
import { styles, toneStyle } from '../theme'

export function PdfTable({
  head,
  widths,
  rows,
}: {
  head: string[]
  widths: number[]
  rows: Cell[][]
}) {
  return (
    <View style={styles.table}>
      <View style={styles.tableHeadRow}>
        {head.map((label, index) => (
          <Text
            key={label}
            style={[styles.tableHeadCell, { width: `${widths[index]}%` }]}
          >
            {label}
          </Text>
        ))}
      </View>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.tableRow} wrap={false}>
          {row.map((cell, cellIndex) => {
            const value = typeof cell === 'string' ? { text: cell } : cell
            return (
              <Text
                key={cellIndex}
                style={[
                  styles.tableCell,
                  styles.tableStrong,
                  { width: `${widths[cellIndex]}%` },
                  toneStyle(value.tone),
                ]}
              >
                {value.text}
              </Text>
            )
          })}
        </View>
      ))}
    </View>
  )
}
