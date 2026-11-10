import { createMultasRouter } from '@backend/routes/multas'
import { catalogoInfraccionesRepo } from '@backend/service/catalogo-infracciones-service'
import { multaService, multasRepo } from '@backend/service/multas-service'
import { Database } from '@lib/types'

export const multasContainer = (db: Database) => {
  const repo = multasRepo(db)
  const catalogo = catalogoInfraccionesRepo(db)
  const service = multaService(repo, catalogo)
  const router = createMultasRouter(service)

  return { repo, service, router }
}
