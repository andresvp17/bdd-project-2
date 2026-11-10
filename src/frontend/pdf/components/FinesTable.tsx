import type { FineView } from '../../api'
import { formatDateTime, formatMoney } from '../../format'
import type { Cell } from '../theme'
import { PdfTable } from './Table'

export function PdfFinesTable({
  fines,
  showVehicle,
}: {
  fines: FineView[]
  showVehicle: boolean
}) {
  const head = ['Boleta', 'Fecha', 'Infracción']
  const widths = [20, 18, 30]

  if (showVehicle) {
    head.push('Vehículo')
    widths.push(14)
  }

  head.push('Monto', 'Estado')
  const remaining = 100 - widths.reduce((total, width) => total + width, 0)
  widths.push(remaining * 0.55, remaining * 0.45)

  const rows: Cell[][] = fines.map((entry) => {
    const row: Cell[] = [
      entry.fine.n_boleta,
      formatDateTime(entry.fine.fecha_hora),
      `${entry.infraction?.cod_articulo ?? 'Sin artículo'} · ${
        entry.infraction?.gravedad ?? 'Sin gravedad'
      }`,
    ]

    if (showVehicle) row.push(entry.vehicle?.placa ?? '—')

    row.push(formatMoney(entry.fine.monto))
    row.push({
      text: entry.isPaid ? 'Pagada' : 'Pendiente',
      tone: entry.isPaid ? 'active' : 'pending',
    })

    return row
  })

  return <PdfTable head={head} widths={widths} rows={rows} />
}
