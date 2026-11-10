import { insertStatements } from '@lib/consts'
import { NotFound } from '@lib/errors'
import type { CatalogoInfraccion, Database, Multa, Repository } from '@lib/types'
import { applyChanges } from '@lib/utils'

interface MultasRepo extends Repository<Multa, string> {
  findByBoleta(nBoleta: string): Promise<Multa | null>
}

interface CatalogoRepo {
  findByID(id: number): Promise<CatalogoInfraccion | null>
}

export const multasRepo = (db: Database): MultasRepo => ({
  findAll: async () => await db.all('SELECT * FROM multas'),
  findByID: async (id) =>
    await db.get<Multa>('SELECT * FROM multas WHERE id = ?', [id]),
  findByBoleta: async (nBoleta) =>
    await db.get<Multa>('SELECT * FROM multas WHERE n_boleta = ?', [nBoleta]),
  save: async (entity) => {
    await db.run(insertStatements.multas, [
      entity.id,
      entity.monto,
      entity.lugar_infraccion,
      entity.fecha_hora,
      entity.fecha_pago,
      entity.n_boleta,
      entity.vehiculo_id,
      entity.infractor_id,
      entity.infraccion_id,
    ])
  },
  update: async (id, entity) => {
    const multa = await db.get<Multa>('SELECT * FROM multas WHERE id = ?', [id])
    if (multa == null) return

    const {
      monto,
      lugar_infraccion,
      fecha_hora,
      fecha_pago,
      n_boleta,
      vehiculo_id,
      infractor_id,
      infraccion_id,
    } = applyChanges(multa, entity)
    await db.run(
      `
    UPDATE multas
    SET monto = ?,
        lugar_infraccion = ?,
        fecha_hora = ?,
        fecha_pago = ?,
        n_boleta = ?,
        vehiculo_id = ?,
        infractor_id = ?,
        infraccion_id = ?
    WHERE id = ?
`,
      [
        monto,
        lugar_infraccion,
        fecha_hora,
        fecha_pago,
        n_boleta,
        vehiculo_id,
        infractor_id,
        infraccion_id,
        id,
      ],
    )
  },
  delete: async (id) => {
    await db.run('DELETE FROM multas WHERE id = ?', [id])
  },
})

export const multaService = (
  repo: ReturnType<typeof multasRepo>,
  catalogo: CatalogoRepo,
) => {
  const resolveMonto = async (infraccionId: number): Promise<number> => {
    const infraccion = await catalogo.findByID(infraccionId)
    if (infraccion == null) {
      throw new NotFound(
        `infracción con ID ${infraccionId} no fue encontrada`,
      )
    }
    return infraccion.monto
  }

  return {
    list: async () => await repo.findAll(),
    getByID: async (id: string) => {
      const multa = await repo.findByID(id)
      if (multa == null) {
        throw new NotFound(`multa con ID ${id} no fue encontrada`)
      }
      return multa
    },
    getByBoleta: async (nBoleta: string) => {
      const multa = await repo.findByBoleta(nBoleta)
      if (multa == null) {
        throw new NotFound(`multa con boleta ${nBoleta} no fue encontrada`)
      }
      return multa
    },
    create: async (entity: Omit<Multa, 'monto'>) => {
      const monto = await resolveMonto(entity.infraccion_id)

      await repo.save({ ...entity, monto })
    },
    update: async (id: string, entity: Partial<Omit<Multa, 'monto'>>) => {
      const multa = await repo.findByID(id)
      if (multa == null) {
        throw new NotFound(`multa con ID ${id} no fue encontrada`)
      }

      const monto = await resolveMonto(
        entity.infraccion_id ?? multa.infraccion_id,
      )

      await repo.update(id, { ...entity, monto })
    },
    remove: async (id: string) => {
      const multa = await repo.findByID(id)
      if (multa == null) {
        throw new NotFound(`multa con ID ${id} no fue encontrada`)
      }

      await repo.delete(id)
    },
  }
}
