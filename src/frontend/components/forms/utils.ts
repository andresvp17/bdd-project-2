export function toE164(value: string): string {
  const digits = value.replace(/\D/g, '')
  if (digits.length === 0) return value.trim()
  if (digits.startsWith('58')) return `+${digits}`
  if (digits.startsWith('0')) return `+58${digits.slice(1)}`
  if (digits.length === 10) return `+58${digits}`
  return `+${digits}`
}

export function toDateTimeLocal(value: string): string {
  return value.length >= 16 ? value.slice(0, 16) : value
}

export function fromDateTimeLocal(value: string): string {
  if (value.length === 16) return `${value}:00`
  return value
}

export function emptyToNull(value: string): string | null {
  return value.trim().length === 0 ? null : value
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10)
}

export function nowLocalDateTime(): string {
  const now = new Date()
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
    now.getDate(),
  )}T${pad(now.getHours())}:${pad(now.getMinutes())}`
}
