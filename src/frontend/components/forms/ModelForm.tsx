import { useState } from 'react'
import { createModel, updateModel } from '../../api'
import type { ModelInput } from '../../api'
import type { Modelo } from '../../../lib/types'
import { InlineForm } from './FormFrame'
import { NumberField, SelectField, TextField } from './FormFields'

const TIPOS = [
  { value: 'Sedán', label: 'Sedán' },
  { value: 'SUV', label: 'SUV' },
  { value: 'Camioneta', label: 'Camioneta' },
  { value: 'Moto', label: 'Moto' },
  { value: 'Camión', label: 'Camión' },
]

export function ModelForm({
  model,
  onSaved,
  onCancel,
}: {
  model?: Modelo
  onSaved: (query?: string) => void
  onCancel: () => void
}) {
  const [form, setForm] = useState<ModelInput>(() => ({
    tipo: model?.tipo ?? 'Sedán',
    version: model?.version ?? new Date().getFullYear(),
    modelo: model?.modelo ?? '',
    marca: model?.marca ?? '',
  }))

  function set<K extends keyof ModelInput>(key: K, value: ModelInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function submit() {
    if (model?.id != null) {
      await updateModel(model.id, form)
    } else {
      await createModel(form)
    }

    onSaved()
  }

  return (
    <InlineForm
      title={model?.id != null ? 'Editar modelo' : 'Nuevo modelo'}
      submitLabel={model?.id != null ? 'Guardar cambios' : 'Registrar modelo'}
      onCancel={onCancel}
      onSubmit={submit}
    >
      <TextField
        label="Marca"
        value={form.marca}
        onChange={(value) => set('marca', value)}
        required
      />
      <TextField
        label="Modelo"
        value={form.modelo}
        onChange={(value) => set('modelo', value)}
        required
      />
      <SelectField
        label="Tipo"
        value={form.tipo}
        onChange={(value) => set('tipo', value)}
        options={TIPOS}
        required
      />
      <NumberField
        label="Año"
        value={form.version}
        onChange={(value) => set('version', value)}
        min={1900}
        hint="Año del modelo, desde 1900."
        required
      />
    </InlineForm>
  )
}
