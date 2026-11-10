import type { Dossier } from '../api'
import { formatDateTime } from '../format'
import { Icon } from '../icons'
import { KIND_LABEL, recordTitle } from '../lookup'
import { DownloadPdfButton } from './DownloadPdfButton'

export function RecordHeader({ dossier }: { dossier: Dossier }) {
  const copy = recordTitle(dossier)

  return (
    <header className="record-head">
      <div className="record-head__copy">
        <h1 className="record-head__title" id="record-title">
          {copy.title}
        </h1>
        <p className="record-head__subtitle">{copy.subtitle}</p>
        <p className="record-head__match">
          <Icon name="route" size={15} />
          Coincidencia por {KIND_LABEL[dossier.kind].toLowerCase()}:{' '}
          <span className="mono">{dossier.query}</span>
        </p>
      </div>

      <div className="record-head__aside">
        <DownloadPdfButton dossier={dossier} />
        <div className="record-head__stamp">
          <span>Consulta</span>
          <time dateTime={dossier.generatedAt}>
            {formatDateTime(dossier.generatedAt)}
          </time>
          <span>Solo lectura</span>
        </div>
      </div>
    </header>
  )
}
