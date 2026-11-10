import type { Dossier, FineView, LookupKind } from './api'
import {
  formatCedula,
  formatDate,
  formatDateTime,
  formatMoney,
  formatVehicleModel,
  formatVehicleYear,
  pluralize,
} from './format'
import type { IconName } from './icons'

export const KIND_LABEL: Record<LookupKind | 'unknown', string> = {
  placa: 'Placa',
  cedula: 'Cédula',
  vin: 'VIN',
  boleta: 'Boleta',
  unknown: 'Consulta',
}

export const SAMPLES: Array<{ query: string; kind: LookupKind }> = [
  { query: 'A123BC', kind: 'placa' },
  { query: 'V-12.345.678', kind: 'cedula' },
  { query: 'BOL-2024-0002', kind: 'boleta' },
  { query: 'VIN-00000000000000001', kind: 'vin' },
]

export type Tone = 'active' | 'pending' | 'neutral'
export type FineFilter = 'all' | 'pending' | 'paid'
export type FineSort = 'date' | 'amount'

export type ViewState =
  | { status: 'idle' }
  | { status: 'loading'; query: string }
  | { status: 'ready'; dossier: Dossier }
  | { status: 'missing'; query: string }
  | { status: 'error'; query: string; message: string }

export interface DossierProps {
  dossier: Dossier
  onOpenQuery: (query: string) => void
  onChanged: () => void
}

export interface RouteOrigin {
  label: string
  value: string
  meta: string
}

export interface RouteStop {
  label: string
  value: string
  meta: string
  icon: IconName
  target: string
}

export interface RouteStatus {
  label: string
  meta: string
  tone: Tone
}

export interface RouteModel {
  origin: RouteOrigin
  stops: RouteStop[]
  status: RouteStatus
}

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

export function dossierLabel(dossier: Dossier): string {
  if (dossier.anchor === 'owner' && dossier.owner != null) {
    return dossier.owner.owner.nombre_completo
  }

  if (dossier.anchor === 'fine' && dossier.fine != null) {
    return `${dossier.fine.fine.n_boleta} · ${
      dossier.fine.vehicle?.placa ?? 'Multa'
    }`
  }

  if (dossier.vehicle != null) {
    return `${dossier.vehicle.vehicle.placa} · ${formatVehicleModel(
      dossier.vehicle.model,
    )}`
  }

  return dossier.query
}

export function vehicleTone(status: string): Tone {
  const normalized = status.toLowerCase()
  if (normalized === 'activo') return 'active'
  if (normalized === 'suspendido') return 'pending'
  return 'neutral'
}

export function fineTone(fine: FineView): Tone {
  return fine.isPaid ? 'active' : 'pending'
}

export function pendingTotal(fines: FineView[]): number {
  return fines
    .filter((fine) => !fine.isPaid)
    .reduce((total, fine) => total + fine.fine.monto, 0)
}

export function buildRoute(dossier: Dossier): RouteModel {
  const pending = dossier.fines.filter((fine) => !fine.isPaid)
  const pendingAmount = pendingTotal(dossier.fines)

  if (dossier.anchor === 'owner' && dossier.owner != null) {
    const view = dossier.owner
    const hasCurrent = view.currentVehicles.length > 0

    return {
      origin: {
        label: 'Cédula',
        value: formatCedula(view.owner),
        meta: 'Coincidencia por cédula',
      },
      stops: [
        {
          label: 'Vehículos',
          value: pluralize(view.vehicles.length, 'vehículo', 'vehículos'),
          meta: `${view.currentVehicles.length} con titularidad vigente`,
          icon: 'car',
          target: 'vehiculos',
        },
        {
          label: 'Titular',
          value: view.owner.nombre_completo,
          meta: `Propietario ${view.owner.tipo.toLowerCase()}`,
          icon: 'user',
          target: 'titular',
        },
        {
          label: 'Multas',
          value: pluralize(dossier.fines.length, 'multa', 'multas'),
          meta: `${pending.length} pendientes · ${formatMoney(pendingAmount)}`,
          icon: 'receipt',
          target: 'multas',
        },
      ],
      status: hasCurrent
        ? {
            label: 'Con vigencia',
            meta: 'Titularidad registrada',
            tone: 'active',
          }
        : {
            label: 'Sin vigencia',
            meta: 'Sin vehículos activos',
            tone: 'neutral',
          },
    }
  }

  if (dossier.anchor === 'fine' && dossier.fine != null) {
    const view = dossier.fine
    const vehicle = view.vehicle
    const vehicleModel = dossier.vehicle?.model
    const owner = view.owner

    return {
      origin: {
        label: 'Boleta',
        value: view.fine.n_boleta,
        meta: 'Coincidencia por boleta',
      },
      stops: [
        {
          label: 'Vehículo',
          value: vehicle?.placa ?? 'Sin vehículo',
          meta: vehicle
            ? `${formatVehicleModel(vehicleModel)} · ${formatVehicleYear(
                vehicleModel,
              )}`
            : 'No vinculado',
          icon: 'car',
          target: 'vehiculo',
        },
        {
          label: 'Infractor',
          value: owner?.nombre_completo ?? 'Sin infractor',
          meta: owner != null ? formatCedula(owner) : 'No vinculado',
          icon: 'user',
          target: 'titular',
        },
        {
          label: 'Multa',
          value: formatMoney(view.fine.monto),
          meta: formatDateTime(view.fine.fecha_hora),
          icon: 'receipt',
          target: 'multa',
        },
      ],
      status: view.isPaid
        ? {
            label: 'Pagada',
            meta: `Pago registrado el ${formatDate(view.fine.fecha_pago)}`,
            tone: 'active',
          }
        : {
            label: 'Pendiente',
            meta: 'Pago no registrado',
            tone: 'pending',
          },
    }
  }

  const view = dossier.vehicle
  if (view == null) {
    return {
      origin: { label: 'Consulta', value: dossier.query, meta: 'Registro' },
      stops: [],
      status: { label: 'Sin datos', meta: 'Sin registro', tone: 'neutral' },
    }
  }

  const current = view.current

  return {
    origin: {
      label: KIND_LABEL[dossier.kind],
      value:
        dossier.kind === 'vin' ? view.vehicle.vin_serial : view.vehicle.placa,
      meta: `Coincidencia por ${KIND_LABEL[dossier.kind].toLowerCase()}`,
    },
    stops: [
      {
        label: 'Vehículo',
        value: formatVehicleModel(view.model),
        meta: `${formatVehicleYear(view.model)} · ${view.vehicle.placa}`,
        icon: 'car',
        target: 'vehiculo',
      },
      {
        label: 'Titular',
        value: current?.owner.nombre_completo ?? 'Sin titular activo',
        meta:
          current != null
            ? formatCedula(current.owner)
            : 'Sin registro vigente',
        icon: 'user',
        target: 'titular',
      },
      {
        label: 'Multas',
        value: pluralize(dossier.fines.length, 'multa', 'multas'),
        meta: `${pending.length} pendientes · ${formatMoney(pendingAmount)}`,
        icon: 'receipt',
        target: 'multas',
      },
    ],
    status: {
      label: view.vehicle.estado_registro,
      meta: 'Estado del vehículo',
      tone: vehicleTone(view.vehicle.estado_registro),
    },
  }
}

export function recordTitle(dossier: Dossier): {
  title: string
  subtitle: string
} {
  if (dossier.anchor === 'owner' && dossier.owner != null) {
    const owner = dossier.owner.owner
    return {
      title: owner.nombre_completo,
      subtitle: `${formatCedula(owner)} · Propietario ${owner.tipo.toLowerCase()}`,
    }
  }

  if (dossier.anchor === 'fine' && dossier.fine != null) {
    const fine = dossier.fine
    return {
      title: `Boleta ${fine.fine.n_boleta}`,
      subtitle: `${fine.infraction?.cod_articulo ?? 'Infracción'} · ${
        fine.infraction?.gravedad ?? 'Gravedad no registrada'
      } · ${fine.vehicle?.placa ?? 'Vehículo no vinculado'}`,
    }
  }

  if (dossier.vehicle != null) {
    const view = dossier.vehicle
    return {
      title: formatVehicleModel(view.model),
      subtitle: `${formatVehicleYear(view.model)} · ${
        view.model?.tipo ?? 'Tipo no registrado'
      } · Placa ${view.vehicle.placa}`,
    }
  }

  return { title: dossier.query, subtitle: 'Consulta del registro' }
}
