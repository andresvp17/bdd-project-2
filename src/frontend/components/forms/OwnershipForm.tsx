import { useState } from 'react'
import { createOwnership, updateOwnership } from '../../api'
import type { OwnershipInput } from '../../api'
import {
  formatCedula,
  formatVehicleModel,
} from '../../format'
import { useRegistryData } from '../../hooks/useRegistryData'
import type { HistorialPropiedad } from '../../../lib/types'
import { FormPlaceholder, InlineForm } from './FormFrame'
import { SelectField, TextField } from './FormFields'
import { emptyToNull, todayIso } from './utils'

export function OwnershipForm({
  ownership,
  vehicleId,
  ownerId,
  onSaved,
  onCancel,
}: {
  ownership?: HistorialPropiedad
  vehicleId?: string
  ownerId?: string
  onSaved: (query?: string) => void
  onCancel: () => void
}) {
  const { registry, error } = useRegistryData()
  const [form, setForm] = useState<OwnershipInput>(() => ({
    nro_documento_titulo: ownership?.nro_documento_titulo ?? '',
    fecha_inicio: ownership?.fecha_inicio ?? todayIso(),
    fecha_fin: ownership?.fecha_fin ?? null,
    propietario_id: ownership?.propietario_id ?? ownerId ?? '',
    vehiculo_id: ownership?.vehiculo_id ?? vehicleId ?? '',
  }))

  const title =
    ownership != null ? 'Editar titularidad' : 'Nueva titularidad'

  if (registry == null) {
    return (
      <FormPlaceholder
        title={title}
        message={error ?? 'Cargando propietarios y vehículos…'}
        onCancel={onCancel}
      />
    )
  }

  function set<K extends keyof OwnershipInput>(
    key: K,
    value: OwnershipInput[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const ownerOptions = registry.owners.map((owner) => ({
    value: owner.id,
    label: `${owner.nombre_completo} · ${formatCedula(owner)}`,
  }))

  const vehicleOptions = registry.vehicles.map((vehicle) => {
    const model = registry.models.find((item) => item.id === vehicle.modelo_id)
    return {
      value: vehicle.id,
      label: `${vehicle.placa} · ${formatVehicleModel(model)}`,
    }
  })

  async function submit() {
    const payload: OwnershipInput = {
      ...form,
      fecha_fin: emptyToNull(form.fecha_fin ?? ''),
    }

    if (ownership != null) {
      await updateOwnership(ownership.id, payload)
    } else {
      await createOwnership(payload)
    }

    onSaved()
  }

  return (
    <InlineForm
      title={title}
      description="Un vehículo solo puede tener una titularidad activa a la vez."
      submitLabel={
        ownership != null ? 'Guardar cambios' : 'Registrar titularidad'
      }
      onCancel={onCancel}
      onSubmit={submit}
    >
      <TextField
        label="Documento de título"
        value={form.nro_documento_titulo}
        onChange={(value) => set('nro_documento_titulo', value)}
        required
        mono
        wide
      />
      <SelectField
        label="Propietario"
        value={form.propietario_id}
        onChange={(value) => set('propietario_id', value)}
        options={ownerOptions}
        placeholder="Selecciona un propietario"
        required
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
      <TextField
        label="Fecha de inicio"
        type="date"
        value={form.fecha_inicio}
        onChange={(value) => set('fecha_inicio', value)}
        required
        mono
      />
      <TextField
        label="Fecha de fin"
        type="date"
        value={form.fecha_fin ?? ''}
        onChange={(value) => set('fecha_fin', emptyToNull(value))}
        hint="Déjala vacía mientras la titularidad esté activa."
        mono
      />
    </InlineForm>
  )
}
