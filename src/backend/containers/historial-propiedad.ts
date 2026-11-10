import { createHistorialPropiedadRouter } from '@backend/routes/historial-propiedad'
import {
  historialPropiedadRepo,
  historialPropiedadService,
} from '@backend/service/historial-propiedad-service'
import type { Database } from '@lib/types'

export const historialPropiedadContainer = (db: Database) => {
  const repository = historialPropiedadRepo(db)
  const service = historialPropiedadService(repository)
  const router = createHistorialPropiedadRouter(service)

  return { repository, service, router }
}
