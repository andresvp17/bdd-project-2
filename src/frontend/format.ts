import type { Modelo, Propietario } from '../lib/types'

const DATE_FORMAT = new Intl.DateTimeFormat('es-VE', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
})

const DATE_TIME_FORMAT = new Intl.DateTimeFormat('es-VE', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

const DECIMAL_FORMAT = new Intl.NumberFormat('es-VE', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

function parseDate(value: string): Date {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Date(`${value}T12:00:00Z`)
  }
  return new Date(value)
}

export function formatDate(value: string | null | undefined): string {
  if (value == null || value.length === 0) return '—'
  return DATE_FORMAT.format(parseDate(value))
}

export function formatDateTime(value: string | null | undefined): string {
  if (value == null || value.length === 0) return '—'
  return DATE_TIME_FORMAT.format(parseDate(value))
}

export function formatMoney(value: number): string {
  return `Bs. ${DECIMAL_FORMAT.format(value)}`
}

export function formatCedula(
  owner: Pick<Propietario, 'cedula' | 'tipo'>,
): string {
  const prefix = owner.tipo === 'Jurídico' ? 'J' : 'V'
  return `${prefix}-${owner.cedula.toLocaleString('es-VE')}`
}

export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '')
  if (digits.length !== 11) return value
  return `${digits.slice(0, 4)}-${digits.slice(4, 7)}.${digits.slice(
    7,
    9,
  )}.${digits.slice(9)}`
}

export function formatVehicleModel(model: Modelo | undefined): string {
  if (model == null) return 'Modelo no registrado'
  const label = [model.marca, model.modelo].filter(Boolean).join(' ').trim()
  return label.length > 0 ? label : 'Modelo no registrado'
}

export function formatVehicleYear(model: Modelo | undefined): string {
  if (model == null || model.version == null) return 'Año no registrado'
  return String(model.version)
}

export function pluralize(
  count: number,
  singular: string,
  plural: string,
): string {
  return `${count} ${count === 1 ? singular : plural}`
}

export function formatCount(
  count: number,
  singular: string,
  plural: string,
): string {
  return pluralize(count, singular, plural)
}
