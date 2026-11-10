import { insertStatements } from '@lib/consts'
import { NotFound } from '@lib/errors'
import type { Database, Repository, Propietario } from '@lib/types'
import { applyChanges } from '@lib/utils'

interface OwnersRepo extends Repository<Propietario> {
  findByCedula(cedula: number): Promise<Propietario | null>
}

export const ownersRepo = (db: Database): OwnersRepo => ({
  findAll: async () => await db.all('SELECT * FROM propietarios'),
  findByID: async (id) =>
    await db.get('SELECT * FROM propietarios WHERE id = ?', [id]),
  findByCedula: async (cedula) =>
    await db.get('SELECT * FROM propietarios WHERE cedula = ?', [cedula]),
  save: async (entity) => {
    await db.run(insertStatements.propietarios, [...Object.values(entity)])
  },
  update: async (id, entity) => {
    const owner = (await db.get('SELECT * FROM propietarios WHERE id = ?', [
      id,
    ])) as Propietario
    if (owner == null) return

    const { nombre_completo, cedula, direccion, correo, telefono, tipo } =
      applyChanges(owner, entity)
    await db.run(
      ` 
    UPDATE propietarios
    SET nombre_completo = ?,
        cedula = ?,
        direccion = ?,
        correo = ?,
        telefono = ?,
        tipo = ?
    WHERE id = ?
`,
      [nombre_completo, cedula, direccion, correo, telefono, tipo, id],
    )
  },
  delete: async (id) => {
    await db.run('DELETE FROM propietarios WHERE id = ?', [id])
  },
})

export const ownerService = (repo: ReturnType<typeof ownersRepo>) => ({
  list: async () => await repo.findAll(),
  getByID: async (id: string) => {
    const owner = await repo.findByID(id)
    if (owner == null) {
      throw new NotFound(`propietario con ID ${id} no fue encontrado`)
    }
    return owner
  },
  getByCedula: async (cedula: number) => {
    const owner = await repo.findByCedula(cedula)
    if (owner == null) {
      throw new NotFound(`propietario con cedula ${cedula} no fue encontrado`)
    }
    return owner
  },
  create: async (entity: Propietario) => await repo.save(entity),
  update: async (id: string, entity: Partial<Propietario>) => {
    const owner = await repo.findByID(id)
    if (owner == null) {
      throw new NotFound(`propietario con ID ${id} no fue encontrado`)
    }

    await repo.update(id, entity)
  },
  remove: async (id: string) => {
    const owner = await repo.findByID(id)
    if (owner == null) {
      throw new NotFound(`propietario con id ${id} no fue encontrado`)
    }
    await repo.delete(id)
  },
})
