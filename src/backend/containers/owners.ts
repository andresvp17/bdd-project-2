import { createOwnersRouter } from '@backend/routes/owners'
import { ownerService, ownersRepo } from '@backend/service/owners-service'
import { Database } from '@lib/types'

export const ownersContainer = (db: Database) => {
  const repository = ownersRepo(db)
  const service = ownerService(repository)
  const router = createOwnersRouter(service)

  return { repository, service, router }
}
