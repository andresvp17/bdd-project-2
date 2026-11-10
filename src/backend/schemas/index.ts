import * as z from 'zod'

export const ownerSchema = z.object({
  id: z.uuidv4(),
  nombre_completo: z.string().nonempty().nonoptional(),
  cedula: z.number().min(1_000_000).nonoptional(),
  direccion: z.string().nonempty().nonoptional(),
  correo: z.email().nonoptional(),
  telefono: z.e164().nonoptional(),
  tipo: z.enum(['Natural', 'Jurídico']),
})

export const ownerCreateSchema = ownerSchema
export const ownerUpdateSchema = ownerSchema.omit({ id: true }).partial()

export const modelSchema = z.object({
  id: z.number().nonnegative(),
  tipo: z.enum(['Sedán', 'SUV', 'Camioneta', 'Moto', 'Camión']),
  version: z.number().min(1900).nonoptional(),
  modelo: z.string().nonempty().nonempty(),
  marca: z.string().nonempty().nonempty(),
})

export const modelCreateSchema = modelSchema.omit({ id: true })
export const modelUpdateSchema = modelSchema.omit({ id: true }).partial()

export const vehicleSchema = z.object({
  id: z.uuidv4(),
  placa: z.string().min(6).nonempty().nonoptional(),
  serial_motor: z.string().nonempty().nonoptional(),
  vin_serial: z.string().min(17).nonoptional(),
  color: z.string().nonempty().nonoptional(),
  estado_registro: z.enum(['Activo', 'Inactivo', 'Suspendido']),
  fecha_registro: z.iso.date(),
  modelo_id: z.number().nonnegative().nonoptional(),
})

export const vehicleCreateSchema = vehicleSchema
export const vehicleUpdateSchema = vehicleSchema.omit({ id: true }).partial()

export const catalogoInfraccionSchema = z.object({
  id: z.number().nonnegative().optional(),
  necesita_retencion: z.number().int().min(0).max(1),
  monto: z.number().nonnegative(),
  gravedad: z.enum(['Leve', 'Grave', 'Muy Grave']),
  cod_articulo: z.string().nonempty(),
})

export const catalogoInfraccionCreateSchema = catalogoInfraccionSchema.omit({
  id: true,
})
export const catalogoInfraccionUpdateSchema = catalogoInfraccionSchema
  .omit({ id: true })
  .partial()

export const multaSchema = z.object({
  id: z.uuidv4(),
  monto: z.number().nonnegative(),
  lugar_infraccion: z.string().nonempty(),
  fecha_hora: z.iso.datetime({ local: true }),
  fecha_pago: z.iso.date().nullable(),
  n_boleta: z.string().nonempty(),
  vehiculo_id: z.uuidv4(),
  infractor_id: z.uuidv4(),
  infraccion_id: z.number().nonnegative(),
})

export const multaCreateSchema = multaSchema.omit({ monto: true })
export const multaUpdateSchema = multaSchema
  .omit({ id: true, monto: true })
  .partial()

export const historialPropiedadSchema = z.object({
  id: z.uuidv4(),
  nro_documento_titulo: z.string().nonempty(),
  fecha_inicio: z.iso.date(),
  fecha_fin: z.iso.date().nullable(),
  propietario_id: z.uuidv4(),
  vehiculo_id: z.uuidv4(),
})

export const historialPropiedadCreateSchema = historialPropiedadSchema
export const historialPropiedadUpdateSchema = historialPropiedadSchema
  .omit({ id: true })
  .partial()
