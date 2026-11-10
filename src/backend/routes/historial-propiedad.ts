import express from 'express'
import { z } from 'zod'
import { historialPropiedadService } from '@backend/service/historial-propiedad-service'
import {
  historialPropiedadCreateSchema,
  historialPropiedadUpdateSchema,
} from '@backend/schemas'

export const createHistorialPropiedadRouter = (
  service: ReturnType<typeof historialPropiedadService>,
) => {
  const router = express.Router()

  router.get('/', async (_req, res) => {
    res.json(await service.list())
  })

  router.get('/:id', async (req, res) => {
    const id = z.uuidv4().parse(req.params.id)
    res.json(await service.getByID(id))
  })

  router.post('/', async (req, res) => {
    const input = historialPropiedadCreateSchema.parse(req.body)
    res.status(201).json(await service.create(input))
  })

  router.patch('/:id', async (req, res) => {
    const id = z.uuidv4().parse(req.params.id)
    const changes = historialPropiedadUpdateSchema.parse(req.body)
    res.json(await service.update(id, changes))
  })

  router.delete('/:id', async (req, res) => {
    const id = z.uuidv4().parse(req.params.id)
    await service.remove(id)
    res.status(204).end()
  })

  return router
}
