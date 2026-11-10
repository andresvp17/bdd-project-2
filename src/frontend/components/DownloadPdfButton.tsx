import { useState } from 'react'
import type { Dossier } from '../api'
import { Icon } from '../icons'

export function DownloadPdfButton({ dossier }: { dossier: Dossier }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleClick() {
    if (busy) return

    setBusy(true)
    setError(null)

    try {
      const { downloadDossierPdf } = await import('../pdf/download')
      await downloadDossierPdf(dossier)
    } catch {
      setError('No se pudo generar el PDF.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="record-head__download">
      <button
        className="button button--quiet"
        type="button"
        onClick={handleClick}
        disabled={busy}
        aria-busy={busy}
      >
        <Icon name="download" size={15} />
        {busy ? 'Generando PDF…' : 'Descargar PDF'}
      </button>
      {error != null && (
        <p className="record-head__download-error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
