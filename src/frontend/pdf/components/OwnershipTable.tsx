import type { OwnershipStage } from '../../api'
import {
  formatCedula,
  formatDate,
  formatVehicleModel,
  formatVehicleYear,
} from '../../format'
import type { Cell } from '../theme'
import { PdfTable } from './Table'

export function PdfOwnershipTable({
  stages,
  mode,
}: {
  stages: OwnershipStage[]
  mode: 'vehicle' | 'owner'
}) {
  const rows: Cell[][] = stages.map((stage) => {
    const base =
      mode === 'vehicle'
        ? [
            stage.owner.nombre_completo,
            formatCedula(stage.owner),
            stage.entry.nro_documento_titulo,
          ]
        : [
            `${formatVehicleModel(stage.model)} · ${formatVehicleYear(
              stage.model,
            )}`,
            stage.vehicle.placa,
            stage.entry.nro_documento_titulo,
          ]

    return [
      ...base,
      formatDate(stage.entry.fecha_inicio),
      stage.entry.fecha_fin != null
        ? formatDate(stage.entry.fecha_fin)
        : { text: 'Vigente', tone: 'active' as const },
    ]
  })

  return (
    <PdfTable
      head={
        mode === 'vehicle'
          ? ['Titular', 'Cédula', 'Documento', 'Inicio', 'Fin']
          : ['Vehículo', 'Placa', 'Documento', 'Inicio', 'Fin']
      }
      widths={mode === 'vehicle' ? [28, 14, 24, 17, 17] : [34, 14, 20, 16, 16]}
      rows={rows}
    />
  )
}
