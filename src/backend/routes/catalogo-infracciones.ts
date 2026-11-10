import express from 'express'
import { z } from 'zod'
import { catalogoInfraccionService } from '@backend/service/catalogo-infracciones-service'
import {
  catalogoInfraccionCreateSchema,
  catalogoInfraccionUpdateSchema,
} from '@backend/schemas'

export const createCatalogoInfraccionesRouter = (
  service: ReturnType<typeof catalogoInfraccionService>,
) => {
  const router = express.Router()

  router.get('/', async (_req, res) => {
    res.json(await service.list())
  })

  router.get('/:id', async (req, res) => {
    const id = z.coerce.number().int().positive().parse(req.params.id)
    res.json(await service.getByID(id))
  })

  router.post('/', async (req, res) => {
    const input = catalogoInfraccionCreateSchema.parse(req.body)
    res.status(201).json(await service.create(input))
  })

  router.patch('/:id', async (req, res) => {
    const id = z.coerce.number().int().positive().parse(req.params.id)
    const changes = catalogoInfraccionUpdateSchema.parse(req.body)
    res.json(await service.update(id, changes))
  })

  router.delete('/:id', async (req, res) => {
    const id = z.coerce.number().int().positive().parse(req.params.id)
    await service.remove(id)
    res.status(204).end()
  })

  return router
}
