import { insertStatements } from '@lib/consts'
import { NotFound } from '@lib/errors'
import type { Database, Modelo, Repository } from '@lib/types'
import { applyChanges } from '@lib/utils'

interface ModelsRepo extends Repository<Modelo, number> {}

export const modelsRepo = (db: Database): ModelsRepo => ({
  findAll: async () => await db.all('SELECT * FROM modelos'),
  findByID: async (id) =>
    await db.get<Modelo>('SELECT * FROM modelos WHERE id = ?', [id]),
  save: async (entity) => {
    await db.run(insertStatements.modelos, [
      entity.tipo,
      entity.version,
      entity.modelo,
      entity.marca,
    ])
  },
  update: async (id, entity) => {
    const model = await db.get<Modelo>('SELECT * FROM modelos WHERE id = ?', [
      id,
    ])
    if (model == null) return

    const { tipo, version, modelo, marca } = applyChanges(model, entity)
    await db.run(
      `
    UPDATE modelos
    SET tipo = ?,
        version = ?,
        modelo = ?,
        marca = ?
    WHERE id = ?
`,
      [tipo, version, modelo, marca, id],
    )
  },
  delete: async (id) => {
    await db.run('DELETE FROM modelos WHERE id = ?', [id])
  },
})

export const modelService = (repo: ReturnType<typeof modelsRepo>) => ({
  list: async () => await repo.findAll(),
  getByID: async (id: number) => {
    const model = await repo.findByID(id)
    if (model == null) {
      throw new NotFound(`modelo con ID ${id} no fue encontrado`)
    }
    return model
  },
  create: async (entity: Modelo) => await repo.save(entity),
  update: async (id: number, entity: Partial<Modelo>) => {
    const model = await repo.findByID(id)
    if (model == null) {
      throw new NotFound(`modelo con ID ${id} no fue encontrado`)
    }

    await repo.update(id, entity)
  },
  remove: async (id: number) => {
    const model = await repo.findByID(id)
    if (model == null) {
      throw new NotFound(`modelo con ID ${id} no fue encontrado`)
    }

    await repo.delete(id)
  },
})
