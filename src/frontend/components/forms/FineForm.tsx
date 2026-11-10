import { useState } from 'react'
import { createFine, updateFine } from '../../api'
import type { FineInput } from '../../api'
import { formatCedula, formatMoney, formatVehicleModel } from '../../format'
import { useRegistryData } from '../../hooks/useRegistryData'
import type { Multa } from '../../../lib/types'
import { FormPlaceholder, InlineForm } from './FormFrame'
import { ReadOnlyField, SelectField, TextField } from './FormFields'
import {
  emptyToNull,
  fromDateTimeLocal,
  nowLocalDateTime,
  toDateTimeLocal,
} from './utils'

export function FineForm({
  fine,
  vehicleId,
  ownerId,
  onSaved,
  onCancel,
}: {
  fine?: Multa
  vehicleId?: string
  ownerId?: string
  onSaved: (query?: string) => void
  onCancel: () => void
}) {
  const { registry, error } = useRegistryData()
  const [form, setForm] = useState<FineInput>(() => ({
    lugar_infraccion: fine?.lugar_infraccion ?? '',
    fecha_hora: fine?.fecha_hora
      ? toDateTimeLocal(fine.fecha_hora)
      : nowLocalDateTime(),
    fecha_pago: fine?.fecha_pago ?? null,
    n_boleta: fine?.n_boleta ?? '',
    vehiculo_id: fine?.vehiculo_id ?? vehicleId ?? '',
    infractor_id: fine?.infractor_id ?? ownerId ?? '',
    infraccion_id: fine?.infraccion_id ?? 0,
  }))

  const title = fine != null ? 'Editar multa' : 'Nueva multa'

  if (registry == null) {
    return (
      <FormPlaceholder
        title={title}
        message={error ?? 'Cargando datos del registro…'}
        onCancel={onCancel}
      />
    )
  }

  function set<K extends keyof FineInput>(key: K, value: FineInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const vehicleOptions = registry.vehicles.map((vehicle) => {
    const model = registry.models.find((item) => item.id === vehicle.modelo_id)
    return {
      value: vehicle.id,
      label: `${vehicle.placa} · ${formatVehicleModel(model)}`,
    }
  })

  const ownerOptions = registry.owners.map((owner) => ({
    value: owner.id,
    label: `${owner.nombre_completo} · ${formatCedula(owner)}`,
  }))

  const infractionOptions = registry.catalogue.map((infraction, index) => ({
    value: String(infraction.id ?? index + 1),
    label: `${infraction.cod_articulo} · ${infraction.gravedad} · ${formatMoney(
      infraction.monto,
    )}`,
  }))

  const selectedInfraction = registry.catalogue.find(
    (infraction, index) =>
      (infraction.id ?? index + 1) === form.infraccion_id,
  )
  const monto = selectedInfraction?.monto ?? 0

  async function submit() {
    if (selectedInfraction == null) {
      throw new Error('Selecciona una infracción válida para calcular el monto.')
    }

    const payload: FineInput = {
      ...form,
      fecha_hora: fromDateTimeLocal(form.fecha_hora),
      fecha_pago: emptyToNull(form.fecha_pago ?? ''),
    }

    if (fine != null) {
      await updateFine(fine.id, payload)
      onSaved()
      return
    }

    await createFine(payload)
    onSaved(form.n_boleta)
  }

  return (
    <InlineForm
      title={title}
      submitLabel={fine != null ? 'Guardar cambios' : 'Registrar multa'}
      onCancel={onCancel}
      onSubmit={submit}
    >
      <TextField
        label="Número de boleta"
        value={form.n_boleta}
        onChange={(value) => set('n_boleta', value.toUpperCase())}
        required
        mono
        wide
      />
      <SelectField
        label="Vehículo"
        value={form.vehiculo_id}
        onChange={(value) => set('vehiculo_id', value)}
        options={vehicleOptions}
        placeholder="Selecciona un vehículo"
        required
        wide
      />
      <SelectField
        label="Infractor"
        value={form.infractor_id}
        onChange={(value) => set('infractor_id', value)}
        options={ownerOptions}
        placeholder="Selecciona un propietario"
        required
        wide
      />
      <SelectField
        label="Infracción"
        value={form.infraccion_id === 0 ? '' : String(form.infraccion_id)}
        onChange={(value) => set('infraccion_id', Number(value))}
        options={infractionOptions}
        placeholder="Selecciona una infracción"
        required
        wide
      />
      <ReadOnlyField
        label="Monto"
        value={
          selectedInfraction != null ? formatMoney(monto) : 'Según infracción'
        }
        hint="Se toma de la infracción seleccionada; no se edita manualmente."
        wide
      />
      <TextField
        label="Lugar"
        value={form.lugar_infraccion}
        onChange={(value) => set('lugar_infraccion', value)}
        required
        wide
      />
      <TextField
        label="Fecha y hora"
        type="datetime-local"
        value={form.fecha_hora}
        onChange={(value) => set('fecha_hora', value)}
        required
        mono
      />
      <TextField
        label="Fecha de pago"
        type="date"
        value={form.fecha_pago ?? ''}
        onChange={(value) => set('fecha_pago', emptyToNull(value))}
        hint="Déjala vacía si la multa sigue pendiente."
        mono
      />
    </InlineForm>
  )
}
