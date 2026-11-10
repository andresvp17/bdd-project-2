import express from 'express'
import { createContainers } from '@backend/containers'
import { createDatabase, seed } from '@backend/db'
import { initDatabase } from '@lib/consts'
import type { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'
import { NotFound } from '@lib/errors'

export const app = express()
app.use(express.json())

export const bootstrap = async (
  filename = process.env.DB_FILE ?? 'database.db',
) => {
  const db = createDatabase(filename)

  await db.exec(initDatabase)
  await seed(db)

  const containers = createContainers(db)

  app.use('/api/propietarios', containers.owners.router)
  app.use('/api/vehiculos', containers.vehicles.router)
  app.use('/api/modelos', containers.models.router)
  app.use('/api/catalogo-infracciones', containers.catalogoInfracciones.router)
  app.use('/api/historial-propiedad', containers.historialPropiedad.router)
  app.use('/api/multas', containers.multas.router)

  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof NotFound) {
      res.status(404).json({ error: err.message })
      return
    }

    if (err instanceof ZodError) {
      res.status(400).json({ error: 'Invalid input', details: err.issues })
      return
    }

    if (
      err instanceof Error &&
      ((err as { code?: string }).code?.startsWith('SQLITE_CONSTRAINT') ||
        /UNIQUE constraint|FOREIGN KEY constraint/.test(err.message))
    ) {
      res.status(409).json({
        error:
          'El registro entra en conflicto con un valor único o una referencia existente.',
        details: err.message,
      })
      return
    }

    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  })

  return { db, containers }
}

const port = Number(process.env.PORT ?? 8555)

bootstrap()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running in port ${port}`)
    })
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
