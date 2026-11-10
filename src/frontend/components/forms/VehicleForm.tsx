import { useState } from 'react'
import { createVehicle, updateVehicle } from '../../api'
import type { VehicleInput } from '../../api'
import { formatVehicleModel } from '../../format'
import { useRegistryData } from '../../hooks/useRegistryData'
import type { Vehiculo } from '../../../lib/types'
import { FormPlaceholder, InlineForm } from './FormFrame'
import { SelectField, TextField } from './FormFields'
import { todayIso } from './utils'

const ESTADOS = [
  { value: 'Activo', label: 'Activo' },
  { value: 'Inactivo', label: 'Inactivo' },
  { value: 'Suspendido', label: 'Suspendido' },
]

export function VehicleForm({
  vehicle,
  onSaved,
  onCancel,
}: {
  vehicle?: Vehiculo
  onSaved: (query?: string) => void
  onCancel: () => void
}) {
  const { registry, error } = useRegistryData()
  const [form, setForm] = useState<VehicleInput>(() => ({
    placa: vehicle?.placa ?? '',
    serial_motor: vehicle?.serial_motor ?? '',
    vin_serial: vehicle?.vin_serial ?? '',
    color: vehicle?.color ?? '',
    estado_registro: vehicle?.estado_registro ?? 'Activo',
    fecha_registro: vehicle?.fecha_registro ?? todayIso(),
    modelo_id: vehicle?.modelo_id ?? 0,
  }))

  const title = vehicle != null ? 'Editar vehículo' : 'Nuevo vehículo'

  if (registry == null) {
    return (
      <FormPlaceholder
        title={title}
        message={error ?? 'Cargando modelos del registro…'}
        onCancel={onCancel}
      />
    )
  }

  function set<K extends keyof VehicleInput>(key: K, value: VehicleInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const modelOptions = registry.models.map((model, index) => ({
    value: String(model.id ?? index + 1),
    label: `${formatVehicleModel(model)} · ${model.version}`,
  }))

  async function submit() {
    if (vehicle != null) {
      await updateVehicle(vehicle.id, form)
      onSaved()
      return
    }

    await createVehicle(form)
    onSaved(form.placa)
  }

  return (
    <InlineForm
      title={title}
      submitLabel={vehicle != null ? 'Guardar cambios' : 'Registrar vehículo'}
      onCancel={onCancel}
      onSubmit={submit}
    >
      <TextField
        label="Placa"
        value={form.placa}
        onChange={(value) => set('placa', value.toUpperCase())}
        hint="Mínimo 6 caracteres."
        required
        mono
        minLength={6}
      />
      <TextField
        label="VIN / Serial"
        value={form.vin_serial}
        onChange={(value) => set('vin_serial', value.toUpperCase())}
        hint="Mínimo 17 caracteres."
        required
        mono
        minLength={17}
      />
      <TextField
        label="Serial del motor"
        value={form.serial_motor}
        onChange={(value) => set('serial_motor', value.toUpperCase())}
        required
        mono
      />
      <TextField
        label="Color"
        value={form.color}
        onChange={(value) => set('color', value)}
        required
      />
      <SelectField
        label="Estado"
        value={form.estado_registro}
        onChange={(value) => set('estado_registro', value)}
        options={ESTADOS}
        required
      />
      <SelectField
        label="Modelo"
        value={form.modelo_id === 0 ? '' : String(form.modelo_id)}
        onChange={(value) => set('modelo_id', Number(value))}
        options={modelOptions}
        placeholder="Selecciona un modelo"
        hint="Si falta el modelo, créalo primero."
        required
        wide
      />
      <TextField
        label="Fecha de registro"
        type="date"
        value={form.fecha_registro}
        onChange={(value) => set('fecha_registro', value)}
        required
        mono
      />
    </InlineForm>
  )
}
