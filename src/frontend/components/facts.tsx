import type { FineView, OwnerView, VehicleView } from '../api'
import {
  formatCedula,
  formatDate,
  formatDateTime,
  formatMoney,
  formatPhone,
  formatVehicleYear,
} from '../format'
import { fineTone, vehicleTone } from '../lookup'
import { Fact, StatusTag } from './ui'

export function VehicleFacts({ view }: { view: VehicleView }) {
  return (
    <dl className="facts">
      <Fact label="Placa" value={view.vehicle.placa} mono />
      <Fact label="Marca" value={view.model?.marca ?? '—'} />
      <Fact label="Modelo" value={view.model?.modelo ?? '—'} />
      <Fact label="Año" value={formatVehicleYear(view.model)} />
      <Fact label="Tipo" value={view.model?.tipo ?? '—'} />
      <Fact label="Color" value={view.vehicle.color || '—'} />
      <Fact
        label="Serial de motor"
        value={view.vehicle.serial_motor || '—'}
        mono
      />
      <Fact label="VIN" value={view.vehicle.vin_serial || '—'} mono wide />
      <Fact
        label="Estado"
        value={
          <StatusTag
            label={view.vehicle.estado_registro}
            tone={vehicleTone(view.vehicle.estado_registro)}
          />
        }
      />
      <Fact
        label="Fecha de registro"
        value={formatDate(view.vehicle.fecha_registro)}
      />
    </dl>
  )
}

export function OwnerFacts({ owner }: { owner: OwnerView['owner'] }) {
  return (
    <dl className="facts">
      <Fact label="Nombre" value={owner.nombre_completo} wide />
      <Fact label="Cédula" value={formatCedula(owner)} mono />
      <Fact label="Tipo" value={owner.tipo} />
      <Fact label="Teléfono" value={formatPhone(owner.telefono)} mono />
      <Fact label="Correo" value={owner.correo} wide />
      <Fact label="Dirección" value={owner.direccion} wide />
    </dl>
  )
}

export function FineFacts({ view }: { view: FineView }) {
  const infraction = view.infraction

  return (
    <dl className="facts">
      <Fact label="Boleta" value={view.fine.n_boleta} mono />
      <Fact
        label="Estado"
        value={
          <StatusTag
            label={view.isPaid ? 'Pagada' : 'Pendiente'}
            tone={fineTone(view)}
          />
        }
      />
      <Fact label="Monto" value={formatMoney(view.fine.monto)} mono />
      <Fact
        label="Fecha de la infracción"
        value={formatDateTime(view.fine.fecha_hora)}
      />
      <Fact label="Lugar" value={view.fine.lugar_infraccion} wide />
      <Fact label="Artículo" value={infraction?.cod_articulo ?? '—'} mono />
      <Fact label="Gravedad" value={infraction?.gravedad ?? '—'} />
      <Fact
        label="Retención"
        value={infraction?.necesita_retencion ? 'Sí' : 'No'}
      />
      <Fact
        label="Fecha de pago"
        value={
          view.fine.fecha_pago != null
            ? formatDate(view.fine.fecha_pago)
            : 'Pendiente'
        }
      />
      <Fact label="Vehículo" value={view.vehicle?.placa ?? '—'} mono />
      <Fact label="Infractor" value={view.owner?.nombre_completo ?? '—'} wide />
    </dl>
  )
}
