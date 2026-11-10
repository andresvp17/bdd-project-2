import { useState } from 'react'
import { createInfraction, updateInfraction } from '../../api'
import type { InfractionInput } from '../../api'
import type { CatalogoInfraccion } from '../../../lib/types'
import { InlineForm } from './FormFrame'
import { CheckboxField, NumberField, SelectField, TextField } from './FormFields'

const GRAVEDADES = [
  { value: 'Leve', label: 'Leve' },
  { value: 'Grave', label: 'Grave' },
  { value: 'Muy Grave', label: 'Muy Grave' },
]

export function InfractionForm({
  infraction,
  onSaved,
  onCancel,
}: {
  infraction?: CatalogoInfraccion
  onSaved: (query?: string) => void
  onCancel: () => void
}) {
  const [form, setForm] = useState<InfractionInput>(() => ({
    cod_articulo: infraction?.cod_articulo ?? '',
    monto: infraction?.monto ?? 0,
    gravedad: infraction?.gravedad ?? 'Leve',
    necesita_retencion: infraction?.necesita_retencion ?? 0,
  }))

  function set<K extends keyof InfractionInput>(
    key: K,
    value: InfractionInput[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function submit() {
    if (infraction?.id != null) {
      await updateInfraction(infraction.id, form)
    } else {
      await createInfraction(form)
    }

    onSaved()
  }

  return (
    <InlineForm
      title={
        infraction?.id != null
          ? 'Editar infracción'
          : 'Nueva infracción'
      }
      submitLabel={
        infraction?.id != null ? 'Guardar cambios' : 'Registrar infracción'
      }
      onCancel={onCancel}
      onSubmit={submit}
    >
      <TextField
        label="Código de artículo"
        value={form.cod_articulo}
        onChange={(value) => set('cod_articulo', value)}
        required
        mono
      />
      <SelectField
        label="Gravedad"
        value={form.gravedad}
        onChange={(value) => set('gravedad', value)}
        options={GRAVEDADES}
        required
      />
      <NumberField
        label="Monto"
        value={form.monto}
        onChange={(value) => set('monto', value)}
        min={0}
        step={0.01}
        hint="Monto en bolívares."
        required
      />
      <CheckboxField
        label="Requiere retención"
        checked={form.necesita_retencion === 1}
        onChange={(checked) => set('necesita_retencion', checked ? 1 : 0)}
      />
    </InlineForm>
  )
}
