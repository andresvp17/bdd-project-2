import { useState } from 'react'
import type { FormEvent, ReactNode } from 'react'

export function InlineForm({
  title,
  description,
  submitLabel,
  busyLabel = 'Guardando…',
  onCancel,
  onSubmit,
  children,
}: {
  title: string
  description?: string
  submitLabel: string
  busyLabel?: string
  onCancel: () => void
  onSubmit: () => Promise<void>
  children: ReactNode
}) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy) return

    setBusy(true)
    setError(null)

    try {
      await onSubmit()
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : 'No se pudo guardar el registro.',
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="inline-form" onSubmit={handleSubmit}>
      <div className="inline-form__head">
        <h3 className="inline-form__title">{title}</h3>
        {description != null && (
          <p className="inline-form__note">{description}</p>
        )}
      </div>
      <div className="inline-form__grid">{children}</div>
      {error != null && (
        <p className="inline-form__error" role="alert">
          {error}
        </p>
      )}
      <div className="inline-form__actions">
        <button className="button" type="submit" disabled={busy}>
          {busy ? busyLabel : submitLabel}
        </button>
        <button
          className="text-button"
          type="button"
          onClick={onCancel}
          disabled={busy}
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}

export function FormPlaceholder({
  title,
  message,
  onCancel,
}: {
  title: string
  message: string
  onCancel: () => void
}) {
  return (
    <div className="inline-form">
      <div className="inline-form__head">
        <h3 className="inline-form__title">{title}</h3>
        <p className="inline-form__note">{message}</p>
      </div>
      <div className="inline-form__actions">
        <button className="text-button" type="button" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </div>
  )
}

export function DeleteAction({
  label,
  confirmLabel = 'Confirmar',
  onDelete,
}: {
  label: string
  confirmLabel?: string
  onDelete: () => Promise<void>
}) {
  const [confirming, setConfirming] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleDelete() {
    if (busy) return

    setBusy(true)
    setError(null)

    try {
      await onDelete()
      setBusy(false)
      setConfirming(false)
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : 'No se pudo eliminar el registro.',
      )
      setBusy(false)
    }
  }

  if (!confirming) {
    return (
      <button
        className="button button--danger"
        type="button"
        onClick={() => setConfirming(true)}
      >
        {label}
      </button>
    )
  }

  return (
    <span className="delete-confirm">
      <span className="delete-confirm__text">¿Eliminar?</span>
      <button
        className="button button--danger"
        type="button"
        onClick={() => void handleDelete()}
        disabled={busy}
      >
        {busy ? 'Eliminando…' : confirmLabel}
      </button>
      <button
        className="text-button"
        type="button"
        onClick={() => setConfirming(false)}
        disabled={busy}
      >
        Cancelar
      </button>
      {error != null && (
        <span className="delete-confirm__error" role="alert">
          {error}
        </span>
      )}
    </span>
  )
}
