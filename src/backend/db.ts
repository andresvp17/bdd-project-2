import sqlite3 from 'sqlite3'
import sampleJson from '../../sample.json'
import { insertStatements, type TableName } from '../lib/consts'
import type { Database, RunResult, SampleData } from '../lib/types'

const sample = sampleJson as SampleData

export const createDatabase = (filename: string): Database => {
  const sqlite = new sqlite3.Database(filename)

  return {
    all: <T>(sql: string, params: unknown[] = []) => {
      return new Promise<T[]>((resolve, reject) => {
        sqlite.all<T>(sql, params, (err, rows) =>
          err ? reject(err) : resolve(rows),
        )
      })
    },
    get: <T>(sql: string, params: unknown[] = []) => {
      return new Promise<T | null>((resolve, reject) => {
        sqlite.get<T>(sql, params, (err, row) =>
          err ? reject(err) : resolve(row ?? null),
        )
      })
    },
    run: (sql: string, params: unknown[] = []) => {
      return new Promise<RunResult>((resolve, reject) => {
        sqlite.run(sql, params, function (err) {
          if (err) {
            reject(err)
            return
          }

          resolve({ lastID: this.lastID, changes: this.changes })
        })
      })
    },
    exec: (sql: string) => {
      return new Promise<void>((resolve, reject) => {
        sqlite.exec(sql, (err) => (err ? reject(err) : resolve()))
      })
    },
    close: () => {
      return new Promise<void>((resolve, reject) => {
        sqlite.close((err) => (err ? reject(err) : resolve()))
      })
    },
  }
}

const orderByInsertion: TableName[] = [
  'modelos',
  'catalogo_infracciones',
  'propietarios',
  'vehiculos',
  'historial_propiedad',
  'multas',
]

export const seed = async (db: Database): Promise<void> => {
  const result = await db.get<{ count: number }>(
    'SELECT COUNT(*) AS count FROM propietarios',
  )

  if (result && result.count > 0) return

  await db.exec('BEGIN')

  try {
    for (const table of orderByInsertion) {
      const rows = sample[table] as unknown as Array<Record<string, unknown>>

      for (const row of rows) {
        await db.run(insertStatements[table], Object.values(row))
      }
    }

    await db.exec('COMMIT')
  } catch (error) {
    await db.exec('ROLLBACK')
    throw error
  }
}
