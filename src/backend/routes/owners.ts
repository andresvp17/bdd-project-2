import express from 'express'
import { z } from 'zod'
import { ownerService } from '@backend/service/owners-service'
import { ownerCreateSchema, ownerUpdateSchema } from '@backend/schemas'

export const createOwnersRouter = (
  service: ReturnType<typeof ownerService>,
) => {
  const router = express.Router()

  router.get('/', async (_req, res) => {
    res.json(await service.list())
  })

  router.get('/cedula/:cedula', async (req, res) => {
    const cedula = z.coerce.number().int().positive().parse(req.params.cedula)
    res.json(await service.getByCedula(cedula))
  })

  router.get('/:id', async (req, res) => {
    const id = z.uuidv4().parse(req.params.id)
    res.json(await service.getByID(id))
  })

  router.post('/', async (req, res) => {
    const input = ownerCreateSchema.parse(req.body)
    res.status(201).json(await service.create(input))
  })

  router.patch('/:id', async (req, res) => {
    const id = z.uuidv4().parse(req.params.id)
    const changes = ownerUpdateSchema.parse(req.body)
    res.json(await service.update(id, changes))
  })

  router.delete('/:id', async (req, res) => {
    const id = z.uuidv4().parse(req.params.id)
    await service.remove(id)
    res.status(204).end()
  })

  return router
}
