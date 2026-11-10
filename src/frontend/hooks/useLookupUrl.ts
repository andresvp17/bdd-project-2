import { useCallback, useEffect, useRef } from 'react'

const QUERY_PARAM = 'q'

function readQueryParam(): string | null {
  if (typeof window === 'undefined') return null
  const value = new URLSearchParams(window.location.search).get(QUERY_PARAM)
  return value != null && value.trim().length > 0 ? value : null
}

export function useLookupUrl(onNavigate: (query: string | null) => void) {
  const onNavigateRef = useRef(onNavigate)
  onNavigateRef.current = onNavigate

  const initialQuery = useRef(readQueryParam()).current

  useEffect(() => {
    const onPopState = () => onNavigateRef.current(readQueryParam())
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const push = useCallback((query: string) => {
    const url = new URL(window.location.href)
    url.searchParams.set(QUERY_PARAM, query)
    window.history.pushState({ [QUERY_PARAM]: query }, '', url)
  }, [])

  const clear = useCallback(() => {
    const url = new URL(window.location.href)
    url.searchParams.delete(QUERY_PARAM)
    window.history.replaceState({}, '', url)
  }, [])

  return { initialQuery, push, clear }
}
