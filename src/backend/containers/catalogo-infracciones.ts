import { createCatalogoInfraccionesRouter } from '@backend/routes/catalogo-infracciones'
import {
  catalogoInfraccionService,
  catalogoInfraccionesRepo,
} from '@backend/service/catalogo-infracciones-service'
import type { Database } from '@lib/types'

export const catalogoInfraccionesContainer = (db: Database) => {
  const repository = catalogoInfraccionesRepo(db)
  const service = catalogoInfraccionService(repository)
  const router = createCatalogoInfraccionesRouter(service)

  return { repository, service, router }
}
