import express from 'express'
import { z } from 'zod'
import { modelService } from '@backend/service/models-service'
import { modelCreateSchema, modelUpdateSchema } from '@backend/schemas'

export const createModelsRouter = (
  service: ReturnType<typeof modelService>,
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
    const input = modelCreateSchema.parse(req.body)
    res.status(201).json(await service.create(input))
  })

  router.patch('/:id', async (req, res) => {
    const id = z.coerce.number().int().positive().parse(req.params.id)
    const changes = modelUpdateSchema.parse(req.body)
    res.json(await service.update(id, changes))
  })

  router.delete('/:id', async (req, res) => {
    const id = z.coerce.number().int().positive().parse(req.params.id)
    await service.remove(id)
    res.status(204).end()
  })

  return router
}
