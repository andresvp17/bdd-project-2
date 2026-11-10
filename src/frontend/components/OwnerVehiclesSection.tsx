import { useState } from 'react'
import { deleteVehicle } from '../api'
import type { OwnerVehicleView } from '../api'
import {
  formatDate,
  formatVehicleModel,
  formatVehicleYear,
  pluralize,
} from '../format'
import { Icon } from '../icons'
import { vehicleTone } from '../lookup'
import { DeleteAction } from './forms/FormFrame'
import { VehicleForm } from './forms/VehicleForm'
import { Section, StatusTag } from './ui'

export function OwnerVehiclesSection({
  vehicles,
  onOpenQuery,
  onChanged,
}: {
  vehicles: OwnerVehicleView[]
  onOpenQuery: (query: string) => void
  onChanged: () => void
}) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const current = vehicles.filter((vehicle) => vehicle.isCurrent).length

  return (
    <Section
      id="vehiculos"
      title="Vehículos del propietario"
      note={`${pluralize(vehicles.length, 'vehículo', 'vehículos')} · ${current} con titularidad vigente`}
    >
      {vehicles.length === 0 ? (
        <p className="empty">
          Este propietario no tiene vehículos vinculados en el historial.
        </p>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <caption className="sr-only">
              Vehículos vinculados al propietario
            </caption>
            <thead>
              <tr>
                <th scope="col">Placa</th>
                <th scope="col">Vehículo</th>
                <th scope="col">Titularidad</th>
                <th scope="col">Desde</th>
                <th scope="col">Estado</th>
                <th scope="col">
                  <span className="sr-only">Abrir</span>
                </th>
                <th scope="col">
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((item) =>
                editingId === item.vehicle.id ? (
                  <tr key={item.vehicle.id}>
                    <td colSpan={7}>
                      <VehicleForm
                        vehicle={item.vehicle}
                        onSaved={() => {
                          setEditingId(null)
                          onChanged()
                        }}
                        onCancel={() => setEditingId(null)}
                      />
                    </td>
                  </tr>
                ) : (
                  <tr key={item.vehicle.id}>
                    <td>
                      <button
                        className="link-button"
                        type="button"
                        onClick={() => onOpenQuery(item.vehicle.placa)}
                      >
                        {item.vehicle.placa}
                      </button>
                    </td>
                    <td>
                      <span className="cell-strong">
                        {formatVehicleModel(item.model)}
                      </span>
                      <span className="cell-meta">
                        {formatVehicleYear(item.model)}
                        {item.model?.tipo ? ` · ${item.model.tipo}` : ''}
                      </span>
                    </td>
                    <td>
                      {item.isCurrent
                        ? 'Vigente'
                        : item.stage.entry.fecha_fin != null
                          ? `Hasta ${formatDate(item.stage.entry.fecha_fin)}`
                          : '—'}
                    </td>
                    <td>{formatDate(item.stage.entry.fecha_inicio)}</td>
                    <td>
                      <StatusTag
                        label={item.vehicle.estado_registro}
                        tone={vehicleTone(item.vehicle.estado_registro)}
                      />
                    </td>
                    <td className="table__action">
                      <button
                        className="icon-button"
                        type="button"
                        aria-label={`Abrir expediente del vehículo ${item.vehicle.placa}`}
                        onClick={() => onOpenQuery(item.vehicle.placa)}
                      >
                        <Icon name="arrow" size={16} />
                      </button>
                    </td>
                    <td className="table__action table__action--actions">
                      <button
                        className="text-button"
                        type="button"
                        onClick={() => setEditingId(item.vehicle.id)}
                      >
                        Editar
                      </button>
                      <DeleteAction
                        label="Eliminar"
                        confirmLabel="Eliminar"
                        onDelete={async () => {
                          await deleteVehicle(item.vehicle.id)
                          onChanged()
                        }}
                      />
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      )}
    </Section>
  )
}
