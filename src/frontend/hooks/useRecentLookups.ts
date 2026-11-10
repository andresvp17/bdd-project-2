import { useCallback, useState } from 'react'
import type { Dossier } from '../api'
import { dossierLabel } from '../lookup'
import { addRecent, clearRecentStorage, readRecent } from '../recent'
import type { RecentLookup } from '../recent'

export function useRecentLookups() {
  const [items, setItems] = useState<RecentLookup[]>(readRecent)

  const remember = useCallback((dossier: Dossier) => {
    const item: RecentLookup = {
      query: dossier.query,
      kind: dossier.kind,
      label: dossierLabel(dossier),
      at: Date.now(),
    }

    setItems((current) => addRecent(current, item))
  }, [])

  const clear = useCallback(() => {
    setItems([])
    clearRecentStorage()
  }, [])

  return { items, remember, clear }
}
