import { useEffect, useState } from 'react'
import { fetchRegistry } from '../api'
import type { Registry } from '../api'

export function useRegistryData() {
  const [registry, setRegistry] = useState<Registry | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    fetchRegistry()
      .then((data) => {
        if (active) setRegistry(data)
      })
      .catch((cause: unknown) => {
        if (!active) return
        setError(
          cause instanceof Error
            ? cause.message
            : 'No se pudo cargar el registro.',
        )
      })

    return () => {
      active = false
    }
  }, [])

  return { registry, error }
}
