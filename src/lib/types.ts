export interface Propietario {
  id: string
  nombre_completo: string
  cedula: number
  direccion: string
  correo: string
  telefono: string
  tipo: string
}

export interface Modelo {
  id?: number
  tipo: string
  version: number
  modelo: string
  marca: string
}

export interface Vehiculo {
  id: string
  placa: string
  serial_motor: string
  vin_serial: string
  color: string
  estado_registro: string
  fecha_registro: string
  modelo_id: number
}

export interface CatalogoInfraccion {
  id?: number
  necesita_retencion: number
  monto: number
  gravedad: string
  cod_articulo: string
}

export interface Multa {
  id: string
  monto: number
  lugar_infraccion: string
  fecha_hora: string
  fecha_pago: string | null
  n_boleta: string
  vehiculo_id: string
  infractor_id: string
  infraccion_id: number
}

export interface HistorialPropiedad {
  id: string
  nro_documento_titulo: string
  fecha_inicio: string
  fecha_fin: string | null
  propietario_id: string
  vehiculo_id: string
}

export interface SampleData {
  propietarios: Propietario[]
  modelos: Modelo[]
  vehiculos: Vehiculo[]
  catalogo_infracciones: CatalogoInfraccion[]
  multas: Multa[]
  historial_propiedad: HistorialPropiedad[]
}

export interface RunResult {
  lastID: number
  changes: number
}

export interface Database {
  all<T = unknown>(sql: string, params?: unknown[]): Promise<T[]>
  get<T = unknown>(sql: string, params?: unknown[]): Promise<T | null>
  run(sql: string, params?: unknown[]): Promise<RunResult>
  exec(sql: string): Promise<void>
  close(): Promise<void>
}

export interface Repository<T, ID = number | string> {
  findAll(): Promise<T[]>
  findByID(id: ID): Promise<T | null>
  save(entity: T): Promise<void>
  update(id: ID, entity: Partial<T>): Promise<void>
  delete(id: ID): Promise<void>
}
