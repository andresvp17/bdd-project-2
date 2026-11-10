import { insertStatements } from '@lib/consts'
import { NotFound } from '@lib/errors'
import type { Database, HistorialPropiedad, Repository } from '@lib/types'
import { applyChanges } from '@lib/utils'

interface HistorialPropiedadRepo
  extends Repository<HistorialPropiedad, string> {}

export const historialPropiedadRepo = (
  db: Database,
): HistorialPropiedadRepo => ({
  findAll: async () => await db.all('SELECT * FROM historial_propiedad'),
  findByID: async (id) =>
    await db.get<HistorialPropiedad>(
      'SELECT * FROM historial_propiedad WHERE id = ?',
      [id],
    ),
  save: async (entity) => {
    await db.run(insertStatements.historial_propiedad, [
      ...Object.values(entity),
    ])
  },
  update: async (id, entity) => {
    const historial = await db.get<HistorialPropiedad>(
      'SELECT * FROM historial_propiedad WHERE id = ?',
      [id],
    )
    if (historial == null) return

    const {
      nro_documento_titulo,
      fecha_inicio,
      fecha_fin,
      propietario_id,
      vehiculo_id,
    } = applyChanges(historial, entity)
    await db.run(
      `
    UPDATE historial_propiedad
    SET nro_documento_titulo = ?,
        fecha_inicio = ?,
        fecha_fin = ?,
        propietario_id = ?,
        vehiculo_id = ?
    WHERE id = ?
`,
      [
        nro_documento_titulo,
        fecha_inicio,
        fecha_fin,
        propietario_id,
        vehiculo_id,
        id,
      ],
    )
  },
  delete: async (id) => {
    await db.run('DELETE FROM historial_propiedad WHERE id = ?', [id])
  },
})

export const historialPropiedadService = (
  repo: ReturnType<typeof historialPropiedadRepo>,
) => ({
  list: async () => await repo.findAll(),
  getByID: async (id: string) => {
    const historial = await repo.findByID(id)
    if (historial == null) {
      throw new NotFound(`historial con ID ${id} no fue encontrado`)
    }
    return historial
  },
  create: async (entity: HistorialPropiedad) => await repo.save(entity),
  update: async (id: string, entity: Partial<HistorialPropiedad>) => {
    const historial = await repo.findByID(id)
    if (historial == null) {
      throw new NotFound(`historial con ID ${id} no fue encontrado`)
    }

    await repo.update(id, entity)
  },
  remove: async (id: string) => {
    const historial = await repo.findByID(id)
    if (historial == null) {
      throw new NotFound(`historial con ID ${id} no fue encontrado`)
    }

    await repo.delete(id)
  },
})
