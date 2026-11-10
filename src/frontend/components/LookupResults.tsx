import type { RefObject } from 'react'
import type { ViewState } from '../lookup'
import type { RecentLookup } from '../recent'
import { DossierView } from './DossierView'
import { ErrorState } from './ErrorState'
import { LoadingState } from './LoadingState'
import { MissingState } from './MissingState'
import { StartState } from './StartState'

interface LookupResultsProps {
  state: ViewState
  resultsRef: RefObject<HTMLDivElement | null>
  recent: RecentLookup[]
  onSearch: (query: string) => void
  onClearRecent: () => void
  onClear: () => void
  onRetry: () => void
  onChanged: () => void
}

export function LookupResults({
  state,
  resultsRef,
  recent,
  onSearch,
  onClearRecent,
  onClear,
  onRetry,
  onChanged,
}: LookupResultsProps) {
  return (
    <div className="results" ref={resultsRef}>
      {state.status === 'idle' && (
        <StartState
          recent={recent}
          onPick={onSearch}
          onClearRecent={onClearRecent}
        />
      )}

      {state.status === 'loading' && <LoadingState query={state.query} />}

      {state.status === 'ready' && (
        <DossierView
          key={state.dossier.generatedAt}
          dossier={state.dossier}
          onOpenQuery={onSearch}
          onChanged={onChanged}
        />
      )}

      {state.status === 'missing' && (
        <MissingState
          query={state.query}
          onPick={onSearch}
          onClear={onClear}
        />
      )}

      {state.status === 'error' && (
        <ErrorState
          query={state.query}
          message={state.message}
          onRetry={onRetry}
          onClear={onClear}
        />
      )}
    </div>
  )
}
