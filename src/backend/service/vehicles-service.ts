import { insertStatements } from '@lib/consts'
import { NotFound } from '@lib/errors'
import type { Database, Repository, Vehiculo } from '@lib/types'
import { applyChanges } from '@lib/utils'

interface VehiclesRepo extends Repository<Vehiculo, string> {
  findByPlaca(placa: string): Promise<Vehiculo | null>
  findByVinSerial(vinSerial: string): Promise<Vehiculo | null>
}

export const vehiclesRepo = (db: Database): VehiclesRepo => ({
  findAll: async () => await db.all('SELECT * FROM vehiculos'),
  findByID: async (id) =>
    await db.get<Vehiculo>('SELECT * FROM vehiculos WHERE id = ?', [id]),
  findByPlaca: async (placa) =>
    await db.get<Vehiculo>('SELECT * FROM vehiculos WHERE placa = ?', [placa]),
  findByVinSerial: async (vinSerial) =>
    await db.get<Vehiculo>('SELECT * FROM vehiculos WHERE vin_serial = ?', [
      vinSerial,
    ]),
  save: async (entity) => {
    await db.run(insertStatements.vehiculos, [...Object.values(entity)])
  },
  update: async (id, entity) => {
    const vehicle = await db.get<Vehiculo>(
      'SELECT * FROM vehiculos WHERE id = ?',
      [id],
    )
    if (vehicle == null) return

    const {
      placa,
      serial_motor,
      vin_serial,
      color,
      estado_registro,
      fecha_registro,
      modelo_id,
    } = applyChanges(vehicle, entity)
    await db.run(
      `
    UPDATE vehiculos
    SET placa = ?,
        serial_motor = ?,
        vin_serial = ?,
        color = ?,
        estado_registro = ?,
        fecha_registro = ?,
        modelo_id = ?
    WHERE id = ?
`,
      [
        placa,
        serial_motor,
        vin_serial,
        color,
        estado_registro,
        fecha_registro,
        modelo_id,
        id,
      ],
    )
  },
  delete: async (id) => {
    await db.run('DELETE FROM vehiculos WHERE id = ?', [id])
  },
})

export const vehicleService = (repo: ReturnType<typeof vehiclesRepo>) => ({
  list: async () => await repo.findAll(),
  getByID: async (id: string) => {
    const vehicle = await repo.findByID(id)
    if (vehicle == null) {
      throw new NotFound(`vehículo con ID ${id} no fue encontrado`)
    }
    return vehicle
  },
  getByPlaca: async (placa: string) => {
    const vehicle = await repo.findByPlaca(placa)
    if (vehicle == null) {
      throw new NotFound(`vehículo con placa ${placa} no fue encontrado`)
    }
    return vehicle
  },
  getByVinSerial: async (vinSerial: string) => {
    const vehicle = await repo.findByVinSerial(vinSerial)
    if (vehicle == null) {
      throw new NotFound(
        `vehículo con serial VIN ${vinSerial} no fue encontrado`,
      )
    }
    return vehicle
  },
  create: async (entity: Vehiculo) => await repo.save(entity),
  update: async (id: string, entity: Partial<Vehiculo>) => {
    const vehicle = await repo.findByID(id)
    if (vehicle == null) {
      throw new NotFound(`vehículo con ID ${id} no fue encontrado`)
    }

    await repo.update(id, entity)
  },
  remove: async (id: string) => {
    const vehicle = await repo.findByID(id)
    if (vehicle == null) {
      throw new NotFound(`vehículo con ID ${id} no fue encontrado`)
    }

    await repo.delete(id)
  },
})
