import { useCallback, useRef, useState } from 'react'
import {
  cleanQuery,
  fetchRegistry,
  resolveDossier,
} from '../api'
import type { Dossier } from '../api'
import type { ViewState } from '../lookup'

export function useDossierLookup() {
  const [state, setState] = useState<ViewState>({ status: 'idle' })
  const requestRef = useRef(0)

  const reset = useCallback(() => {
    requestRef.current += 1
    setState({ status: 'idle' })
  }, [])

  const lookup = useCallback(async (raw: string): Promise<Dossier | null> => {
    const query = cleanQuery(raw)
    if (query.length === 0) return null

    const requestId = requestRef.current + 1
    requestRef.current = requestId
    setState({ status: 'loading', query })

    try {
      const registry = await fetchRegistry()
      if (requestRef.current !== requestId) return null

      const dossier = resolveDossier(registry, query)

      if (dossier == null) {
        setState({ status: 'missing', query })
        return null
      }

      setState({ status: 'ready', dossier })
      return dossier
    } catch (error) {
      if (requestRef.current !== requestId) return null

      const message =
        error instanceof Error
          ? error.message
          : 'Ocurrió un error inesperado al consultar el registro.'
      setState({ status: 'error', query, message })
      return null
    }
  }, [])

  return { state, lookup, reset }
}
