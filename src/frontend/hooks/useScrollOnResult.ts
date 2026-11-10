import { useCallback, useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../lookup'
import type { ViewState } from '../lookup'

export function useScrollOnResult(status: ViewState['status']) {
  const resultsRef = useRef<HTMLDivElement>(null)
  const shouldScrollRef = useRef(false)

  const requestScroll = useCallback(() => {
    shouldScrollRef.current = true
  }, [])

  useEffect(() => {
    if (!shouldScrollRef.current) return
    if (status === 'idle' || status === 'loading') return

    shouldScrollRef.current = false
    const node = resultsRef.current
    if (node == null || window.scrollY < 120) return

    node.scrollIntoView({
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      block: 'start',
    })
  }, [status])

  return { resultsRef, requestScroll }
}
