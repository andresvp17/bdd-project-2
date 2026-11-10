import type { Database } from '@lib/types'
import { catalogoInfraccionesContainer } from '@backend/containers/catalogo-infracciones'
import { historialPropiedadContainer } from '@backend/containers/historial-propiedad'
import { modelsContainer } from '@backend/containers/models'
import { multasContainer } from '@backend/containers/multas'
import { ownersContainer } from '@backend/containers/owners'
import { vehiclesContainer } from '@backend/containers/vehicles'

export const createContainers = (db: Database) => ({
  owners: ownersContainer(db),
  vehicles: vehiclesContainer(db),
  models: modelsContainer(db),
  catalogoInfracciones: catalogoInfraccionesContainer(db),
  historialPropiedad: historialPropiedadContainer(db),
  multas: multasContainer(db),
})

export type Containers = ReturnType<typeof createContainers>
