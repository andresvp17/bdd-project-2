import { insertStatements } from '@lib/consts'
import { NotFound } from '@lib/errors'
import type { CatalogoInfraccion, Database, Repository } from '@lib/types'
import { applyChanges } from '@lib/utils'

interface CatalogoInfraccionesRepo
  extends Repository<CatalogoInfraccion, number> {}

export const catalogoInfraccionesRepo = (
  db: Database,
): CatalogoInfraccionesRepo => ({
  findAll: async () => await db.all('SELECT * FROM catalogo_infracciones'),
  findByID: async (id) =>
    await db.get<CatalogoInfraccion>(
      'SELECT * FROM catalogo_infracciones WHERE id = ?',
      [id],
    ),
  save: async (entity) => {
    await db.run(insertStatements.catalogo_infracciones, [
      entity.necesita_retencion,
      entity.monto,
      entity.gravedad,
      entity.cod_articulo,
    ])
  },
  update: async (id, entity) => {
    const infraccion = await db.get<CatalogoInfraccion>(
      'SELECT * FROM catalogo_infracciones WHERE id = ?',
      [id],
    )
    if (infraccion == null) return

    const { necesita_retencion, monto, gravedad, cod_articulo } = applyChanges(
      infraccion,
      entity,
    )
    await db.run(
      `
    UPDATE catalogo_infracciones
    SET necesita_retencion = ?,
        monto = ?,
        gravedad = ?,
        cod_articulo = ?
    WHERE id = ?
`,
      [necesita_retencion, monto, gravedad, cod_articulo, id],
    )
  },
  delete: async (id) => {
    await db.run('DELETE FROM catalogo_infracciones WHERE id = ?', [id])
  },
})

export const catalogoInfraccionService = (
  repo: ReturnType<typeof catalogoInfraccionesRepo>,
) => ({
  list: async () => await repo.findAll(),
  getByID: async (id: number) => {
    const infraccion = await repo.findByID(id)
    if (infraccion == null) {
      throw new NotFound(`infracción con ID ${id} no fue encontrada`)
    }
    return infraccion
  },
  create: async (entity: CatalogoInfraccion) => await repo.save(entity),
  update: async (id: number, entity: Partial<CatalogoInfraccion>) => {
    const infraccion = await repo.findByID(id)
    if (infraccion == null) {
      throw new NotFound(`infracción con ID ${id} no fue encontrada`)
    }

    await repo.update(id, entity)
  },
  remove: async (id: number) => {
    const infraccion = await repo.findByID(id)
    if (infraccion == null) {
      throw new NotFound(`infracción con ID ${id} no fue encontrada`)
    }

    await repo.delete(id)
  },
})
