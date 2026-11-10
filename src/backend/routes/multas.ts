import express from 'express'
import { z } from 'zod'
import { multaService } from '@backend/service/multas-service'
import { multaCreateSchema, multaUpdateSchema } from '@backend/schemas'

export const createMultasRouter = (
  service: ReturnType<typeof multaService>,
) => {
  const router = express.Router()

  router.get('/', async (_req, res) => {
    res.json(await service.list())
  })

  router.get('/boleta/:n_boleta', async (req, res) => {
    const nBoleta = z.string().nonempty().parse(req.params.n_boleta)
    res.json(await service.getByBoleta(nBoleta))
  })

  router.get('/:id', async (req, res) => {
    const id = z.uuidv4().parse(req.params.id)
    res.json(await service.getByID(id))
  })

  router.post('/', async (req, res) => {
    const input = multaCreateSchema.parse(req.body)
    res.status(201).json(await service.create(input))
  })

  router.patch('/:id', async (req, res) => {
    const id = z.uuidv4().parse(req.params.id)
    const changes = multaUpdateSchema.parse(req.body)
    res.json(await service.update(id, changes))
  })

  router.delete('/:id', async (req, res) => {
    const id = z.uuidv4().parse(req.params.id)
    await service.remove(id)
    res.status(204).end()
  })

  return router
}
