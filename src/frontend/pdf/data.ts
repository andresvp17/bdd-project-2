import type { FineView, VehicleView } from '../api'
import {
  formatCedula,
  formatDate,
  formatDateTime,
  formatMoney,
  formatPhone,
  formatVehicleYear,
} from '../format'
import type { Propietario } from '../../lib/types'

export interface FactItem {
  label: string
  value: string
  wide?: boolean
}

export function ownerFacts(owner: Propietario): FactItem[] {
  return [
    { label: 'Nombre', value: owner.nombre_completo, wide: true },
    { label: 'Cédula', value: formatCedula(owner) },
    { label: 'Tipo', value: owner.tipo },
    { label: 'Teléfono', value: formatPhone(owner.telefono) },
    { label: 'Correo', value: owner.correo, wide: true },
    { label: 'Dirección', value: owner.direccion, wide: true },
  ]
}

export function vehicleFacts(view: VehicleView): FactItem[] {
  return [
    { label: 'Placa', value: view.vehicle.placa },
    { label: 'Marca', value: view.model?.marca ?? '—' },
    { label: 'Modelo', value: view.model?.modelo ?? '—' },
    { label: 'Año', value: formatVehicleYear(view.model) },
    { label: 'Tipo', value: view.model?.tipo ?? '—' },
    { label: 'Color', value: view.vehicle.color || '—' },
    { label: 'Serial de motor', value: view.vehicle.serial_motor || '—' },
    { label: 'VIN', value: view.vehicle.vin_serial || '—', wide: true },
    { label: 'Estado', value: view.vehicle.estado_registro },
    {
      label: 'Fecha de registro',
      value: formatDate(view.vehicle.fecha_registro),
    },
  ]
}

export function fineFacts(view: FineView): FactItem[] {
  const infraction = view.infraction

  return [
    { label: 'Boleta', value: view.fine.n_boleta },
    { label: 'Estado', value: view.isPaid ? 'Pagada' : 'Pendiente' },
    { label: 'Monto', value: formatMoney(view.fine.monto) },
    {
      label: 'Fecha de la infracción',
      value: formatDateTime(view.fine.fecha_hora),
    },
    { label: 'Lugar', value: view.fine.lugar_infraccion, wide: true },
    { label: 'Artículo', value: infraction?.cod_articulo ?? '—' },
    { label: 'Gravedad', value: infraction?.gravedad ?? '—' },
    {
      label: 'Retención',
      value: infraction?.necesita_retencion ? 'Sí' : 'No',
    },
    {
      label: 'Fecha de pago',
      value:
        view.fine.fecha_pago != null
          ? formatDate(view.fine.fecha_pago)
          : 'Pendiente',
    },
    { label: 'Vehículo', value: view.vehicle?.placa ?? '—' },
    {
      label: 'Infractor',
      value: view.owner?.nombre_completo ?? '—',
      wide: true,
    },
  ]
}
