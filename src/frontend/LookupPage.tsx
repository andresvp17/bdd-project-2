import { LookupResults } from './components/LookupResults'
import { SearchForm } from './components/SearchForm'
import { SiteFooter } from './components/SiteFooter'
import { SiteHeader } from './components/SiteHeader'
import { useLookup } from './hooks/useLookup'
import './lookup.css'

export default function LookupPage() {
  const {
    input,
    setInput,
    state,
    busy,
    inputRef,
    resultsRef,
    performLookup,
    submit,
    clear,
    retry,
    refresh,
    recent,
  } = useLookup()

  return (
    <div className="page" id="top">
      <a className="skip-link" href="#consulta">
        Saltar a la consulta
      </a>

      <SiteHeader />

      <main className="main" id="consulta">
        <div className="shell">
          <SearchForm
            input={input}
            busy={busy}
            inputRef={inputRef}
            onInputChange={setInput}
            onSubmit={submit}
            onSample={(query) => void performLookup(query)}
          />

          <LookupResults
            state={state}
            resultsRef={resultsRef}
            recent={recent.items}
            onSearch={(query) => void performLookup(query)}
            onClearRecent={recent.clear}
            onClear={clear}
            onRetry={retry}
            onChanged={refresh}
          />
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
