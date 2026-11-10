import { createModelsRouter } from '@backend/routes/models'
import { modelService, modelsRepo } from '@backend/service/models-service'
import type { Database } from '@lib/types'

export const modelsContainer = (db: Database) => {
  const repository = modelsRepo(db)
  const service = modelService(repository)
  const router = createModelsRouter(service)

  return { repository, service, router }
}
