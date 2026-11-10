import { createVehiclesRouter } from '@backend/routes/vehicles'
import { vehicleService, vehiclesRepo } from '@backend/service/vehicles-service'
import type { Database } from '@lib/types'

export const vehiclesContainer = (db: Database) => {
  const repository = vehiclesRepo(db)
  const service = vehicleService(repository)
  const router = createVehiclesRouter(service)

  return { repository, service, router }
}
