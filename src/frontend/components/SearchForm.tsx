import type { FormEvent, RefObject } from 'react'
import { Icon } from '../icons'
import { SAMPLES } from '../lookup'

export function SearchForm({
  input,
  busy,
  inputRef,
  onInputChange,
  onSubmit,
  onSample,
}: {
  input: string
  busy: boolean
  inputRef: RefObject<HTMLInputElement | null>
  onInputChange: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onSample: (query: string) => void
}) {
  return (
    <form
      className="search"
      onSubmit={onSubmit}
      role="search"
      aria-label="Consultar el registro"
      aria-busy={busy}
    >
      <div className="search-gantry">
        <span className="search-tab">Consulta</span>
        <label className="sr-only" htmlFor="lookup-input">
          Placa, cédula, VIN o número de boleta
        </label>
        <input
          id="lookup-input"
          ref={inputRef}
          className="search-input"
          type="text"
          value={input}
          onChange={(event) => onInputChange(event.target.value)}
          placeholder="Placa, cédula, VIN o N.º de boleta"
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          aria-describedby="search-hint"
        />
        <button
          className="search-submit"
          type="submit"
          disabled={busy || input.trim().length === 0}
        >
          <Icon name="search" size={18} />
          <span>{busy ? 'Buscando' : 'Buscar'}</span>
          <kbd>Enter</kbd>
        </button>
      </div>

      <div className="search-footer">
        <p className="search-examples">
          <span>Pruebe:</span>
          {SAMPLES.map((sample) => (
            <button
              key={sample.query}
              type="button"
              onClick={() => onSample(sample.query)}
            >
              {sample.query}
            </button>
          ))}
        </p>
        <p className="search-hint" id="search-hint">
          Búsqueda exacta · Sin distinción de mayúsculas
        </p>
      </div>
    </form>
  )
}
