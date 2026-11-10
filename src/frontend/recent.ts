import type { LookupKind } from './api'

export const RECENT_KEY = 'bbd.recentLookups.v1'
export const RECENT_LIMIT = 5

export interface RecentLookup {
  query: string
  kind: LookupKind
  label: string
  at: number
}

export function isRecentLookup(value: unknown): value is RecentLookup {
  if (value == null || typeof value !== 'object') return false
  const item = value as Record<string, unknown>
  return (
    typeof item.query === 'string' &&
    typeof item.label === 'string' &&
    typeof item.at === 'number' &&
    (item.kind === 'placa' ||
      item.kind === 'cedula' ||
      item.kind === 'vin' ||
      item.kind === 'boleta')
  )
}

export function readRecent(): RecentLookup[] {
  if (typeof window === 'undefined') return []

  try {
    const raw = window.localStorage.getItem(RECENT_KEY)
    if (raw == null) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isRecentLookup).slice(0, RECENT_LIMIT)
  } catch {
    return []
  }
}

export function addRecent(
  current: RecentLookup[],
  item: RecentLookup,
): RecentLookup[] {
  const next = [
    item,
    ...current.filter((entry) => entry.query !== item.query),
  ].slice(0, RECENT_LIMIT)

  try {
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(next))
  } catch {
    // The lookup still works when storage is unavailable.
  }

  return next
}

export function clearRecentStorage(): void {
  try {
    window.localStorage.removeItem(RECENT_KEY)
  } catch {
    // Nothing to clear when storage is unavailable.
  }
}
