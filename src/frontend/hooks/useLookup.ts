import { useCallback, useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { cleanQuery, clearRegistryCache } from '../api'
import { useDossierLookup } from './useDossierLookup'
import { useLookupUrl } from './useLookupUrl'
import { useRecentLookups } from './useRecentLookups'
import { useScrollOnResult } from './useScrollOnResult'

type LookupOptions = { pushUrl?: boolean; scroll?: boolean }
type PerformLookup = (raw: string, options?: LookupOptions) => Promise<void>

export function useLookup() {
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const { state, lookup, reset } = useDossierLookup()
  const { resultsRef, requestScroll } = useScrollOnResult(state.status)
  const { items, remember, clear: clearRecent } = useRecentLookups()

  const performLookupRef = useRef<PerformLookup>(async () => {})

  const {
    initialQuery,
    push: pushQuery,
    clear: clearQuery,
  } = useLookupUrl((query) => {
    if (query == null) {
      setInput('')
      reset()
      return
    }

    setInput(query)
    void performLookupRef.current(query, { pushUrl: false, scroll: false })
  })

  const performLookup = useCallback<PerformLookup>(
    async (raw, options = {}) => {
      const query = cleanQuery(raw)

      if (query.length === 0) {
        inputRef.current?.focus()
        return
      }

      const { pushUrl = true, scroll = true } = options

      setInput(query)
      if (pushUrl) pushQuery(query)
      if (scroll) requestScroll()

      const dossier = await lookup(query)
      if (dossier != null) remember(dossier)
    },
    [lookup, remember, requestScroll, pushQuery],
  )

  performLookupRef.current = performLookup

  useEffect(() => {
    const query = initialQuery
    if (query == null) return
    setInput(query)
    void performLookup(query, { pushUrl: false, scroll: false })
  }, [performLookup, initialQuery])

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void performLookup(input)
  }

  const clear = useCallback(() => {
    setInput('')
    reset()
    clearQuery()
    inputRef.current?.focus()
  }, [reset, clearQuery])

  const retry = () => {
    if (state.status !== 'error') return
    clearRegistryCache()
    void performLookup(state.query)
  }

  const refresh = useCallback(() => {
    const query =
      state.status === 'ready'
        ? state.dossier.query
        : state.status === 'missing' || state.status === 'error'
          ? state.query
          : null

    if (query == null) return

    clearRegistryCache()
    void performLookup(query, { pushUrl: false, scroll: false })
  }, [performLookup, state])

  return {
    input,
    setInput,
    state,
    busy: state.status === 'loading',
    inputRef,
    resultsRef,
    performLookup,
    submit,
    clear,
    retry,
    refresh,
    recent: { items, clear: clearRecent },
  }
}
