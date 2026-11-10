import { pdf } from '@react-pdf/renderer'
import type { Dossier } from '../api'
import { RegistryDocument } from './RegistryDocument'

function fileSlug(dossier: Dossier): string {
  if (dossier.anchor === 'owner' && dossier.owner != null) {
    return `propietario-${dossier.owner.owner.cedula}`
  }

  if (dossier.anchor === 'fine' && dossier.fine != null) {
    return `multa-${dossier.fine.fine.n_boleta}`
  }

  if (dossier.vehicle != null) {
    return `vehiculo-${dossier.vehicle.vehicle.placa}`
  }

  return 'expediente'
}

function safeFileName(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
}

export async function downloadDossierPdf(dossier: Dossier): Promise<void> {
  const blob = await pdf(<RegistryDocument dossier={dossier} />).toBlob()
  const url = URL.createObjectURL(blob)

  try {
    const link = document.createElement('a')
    link.href = url
    link.download = `${safeFileName(fileSlug(dossier))}.pdf`
    document.body.appendChild(link)
    link.click()
    link.remove()
  } finally {
    setTimeout(() => URL.revokeObjectURL(url), 0)
  }
}
