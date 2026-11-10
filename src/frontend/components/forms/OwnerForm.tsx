import { useState } from 'react'
import { createOwner, updateOwner } from '../../api'
import type { OwnerInput } from '../../api'
import { formatCedula } from '../../format'
import type { Propietario } from '../../../lib/types'
import { InlineForm } from './FormFrame'
import { SelectField, TextField } from './FormFields'
import { toE164 } from './utils'

const TIPOS = [
  { value: 'Natural', label: 'Natural' },
  { value: 'Jurídico', label: 'Jurídico' },
]

export function OwnerForm({
  owner,
  onSaved,
  onCancel,
}: {
  owner?: Propietario
  onSaved: (query?: string) => void
  onCancel: () => void
}) {
  const [form, setForm] = useState<OwnerInput>(() => ({
    nombre_completo: owner?.nombre_completo ?? '',
    cedula: owner?.cedula ?? 0,
    direccion: owner?.direccion ?? '',
    correo: owner?.correo ?? '',
    telefono: owner?.telefono ?? '',
    tipo: owner?.tipo ?? 'Natural',
  }))

  function set<K extends keyof OwnerInput>(key: K, value: OwnerInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function submit() {
    const payload: OwnerInput = {
      ...form,
      telefono: toE164(form.telefono),
    }

    if (owner != null) {
      await updateOwner(owner.id, payload)
      onSaved()
      return
    }

    await createOwner(payload)
    onSaved(formatCedula(payload))
  }

  return (
    <InlineForm
      title={owner != null ? 'Editar propietario' : 'Nuevo propietario'}
      submitLabel={owner != null ? 'Guardar cambios' : 'Registrar propietario'}
      onCancel={onCancel}
      onSubmit={submit}
    >
      <TextField
        label="Nombre completo"
        value={form.nombre_completo}
        onChange={(value) => set('nombre_completo', value)}
        required
        wide
      />
      <TextField
        label="Cédula o RIF"
        type="text"
        value={form.cedula === 0 ? '' : String(form.cedula)}
        onChange={(value) =>
          set('cedula', Number(value.replace(/\D/g, '')) || 0)
        }
        hint="Solo el número, sin letra ni puntos."
        required
        mono
      />
      <SelectField
        label="Tipo"
        value={form.tipo}
        onChange={(value) => set('tipo', value)}
        options={TIPOS}
        required
      />
      <TextField
        label="Correo"
        type="email"
        value={form.correo}
        onChange={(value) => set('correo', value)}
        required
        wide
      />
      <TextField
        label="Teléfono"
        type="tel"
        value={form.telefono}
        onChange={(value) => set('telefono', value)}
        hint="Formato internacional. Ej. +58 414 123 4567."
        required
        mono
      />
      <TextField
        label="Dirección"
        value={form.direccion}
        onChange={(value) => set('direccion', value)}
        required
        wide
      />
    </InlineForm>
  )
}
