import express from 'express'
import { z } from 'zod'
import { vehicleService } from '@backend/service/vehicles-service'
import { vehicleCreateSchema, vehicleUpdateSchema } from '@backend/schemas'

export const createVehiclesRouter = (
  service: ReturnType<typeof vehicleService>,
) => {
  const router = express.Router()

  router.get('/', async (_req, res) => {
    res.json(await service.list())
  })

  router.get('/placa/:placa', async (req, res) => {
    const placa = z.string().nonempty().parse(req.params.placa)
    res.json(await service.getByPlaca(placa))
  })

  router.get('/vin/:vin_serial', async (req, res) => {
    const vinSerial = z.string().nonempty().parse(req.params.vin_serial)
    res.json(await service.getByVinSerial(vinSerial))
  })

  router.get('/:id', async (req, res) => {
    const id = z.uuidv4().parse(req.params.id)
    res.json(await service.getByID(id))
  })

  router.post('/', async (req, res) => {
    const input = vehicleCreateSchema.parse(req.body)
    res.status(201).json(await service.create(input))
  })

  router.patch('/:id', async (req, res) => {
    const id = z.uuidv4().parse(req.params.id)
    const changes = vehicleUpdateSchema.parse(req.body)
    res.json(await service.update(id, changes))
  })

  router.delete('/:id', async (req, res) => {
    const id = z.uuidv4().parse(req.params.id)
    await service.remove(id)
    res.status(204).end()
  })

  return router
}
