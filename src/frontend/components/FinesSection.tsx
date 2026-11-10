import { useMemo, useState } from 'react'
import { deleteFine } from '../api'
import type { FineView } from '../api'
import { formatDateTime, formatMoney, pluralize } from '../format'
import type { FineFilter, FineSort } from '../lookup'
import { fineTone } from '../lookup'
import { DeleteAction } from './forms/FormFrame'
import { FineForm } from './forms/FineForm'
import { Section, StatusTag } from './ui'

export function FinesSection({
  fines,
  title = 'Multas',
  onOpenQuery,
  showVehicle = false,
  emptyMessage,
  onChanged,
}: {
  fines: FineView[]
  title?: string
  onOpenQuery: (query: string) => void
  showVehicle?: boolean
  emptyMessage: string
  onChanged: () => void
}) {
  const [filter, setFilter] = useState<FineFilter>('all')
  const [sort, setSort] = useState<FineSort>('date')
  const [editingId, setEditingId] = useState<string | null>(null)

  const counts = useMemo(
    () => ({
      all: fines.length,
      pending: fines.filter((fine) => !fine.isPaid).length,
      paid: fines.filter((fine) => fine.isPaid).length,
    }),
    [fines],
  )

  const visible = useMemo(() => {
    const filtered = fines.filter((fine) => {
      if (filter === 'pending') return !fine.isPaid
      if (filter === 'paid') return fine.isPaid
      return true
    })

    return [...filtered].sort((a, b) => {
      if (sort === 'amount') return b.fine.monto - a.fine.monto
      return b.fine.fecha_hora.localeCompare(a.fine.fecha_hora)
    })
  }, [fines, filter, sort])

  const columns = showVehicle ? 8 : 7

  return (
    <Section
      id="multas"
      title={title}
      note={`${pluralize(fines.length, 'multa', 'multas')} · ${
        counts.pending
      } pendientes`}
    >
      {fines.length === 0 ? (
        <p className="empty">{emptyMessage}</p>
      ) : (
        <>
          <div className="table-tools">
            <div className="segmented" role="group" aria-label="Filtrar multas">
              <button
                type="button"
                aria-pressed={filter === 'all'}
                onClick={() => setFilter('all')}
              >
                Todas <span>{counts.all}</span>
              </button>
              <button
                type="button"
                aria-pressed={filter === 'pending'}
                onClick={() => setFilter('pending')}
              >
                Pendientes <span>{counts.pending}</span>
              </button>
              <button
                type="button"
                aria-pressed={filter === 'paid'}
                onClick={() => setFilter('paid')}
              >
                Pagadas <span>{counts.paid}</span>
              </button>
            </div>

            <label className="sort-control">
              <span>Orden</span>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as FineSort)}
              >
                <option value="date">Más recientes</option>
                <option value="amount">Mayor monto</option>
              </select>
            </label>
          </div>

          {visible.length === 0 ? (
            <p className="empty">
              No hay multas {filter === 'pending' ? 'pendientes' : 'pagadas'} en
              este expediente.{' '}
              <button
                className="text-button"
                type="button"
                onClick={() => setFilter('all')}
              >
                Ver todas
              </button>
            </p>
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <caption className="sr-only">
                  Multas vinculadas al expediente
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Boleta</th>
                    <th scope="col">Fecha</th>
                    <th scope="col">Infracción</th>
                    {showVehicle && <th scope="col">Vehículo</th>}
                    <th scope="col" className="num">
                      Monto
                    </th>
                    <th scope="col">Estado</th>
                    <th scope="col">
                      <span className="sr-only">Acciones</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((entry) =>
                    editingId === entry.fine.id ? (
                      <tr key={entry.fine.id}>
                        <td colSpan={columns}>
                          <FineForm
                            fine={entry.fine}
                            onSaved={() => {
                              setEditingId(null)
                              onChanged()
                            }}
                            onCancel={() => setEditingId(null)}
                          />
                        </td>
                      </tr>
                    ) : (
                      <tr key={entry.fine.id}>
                        <td>
                          <button
                            className="link-button"
                            type="button"
                            onClick={() => onOpenQuery(entry.fine.n_boleta)}
                          >
                            {entry.fine.n_boleta}
                          </button>
                        </td>
                        <td>{formatDateTime(entry.fine.fecha_hora)}</td>
                        <td>
                          <span className="cell-strong">
                            {entry.infraction?.cod_articulo ?? 'Sin artículo'}
                          </span>
                          <span className="cell-meta">
                            {entry.infraction?.gravedad ?? 'Sin gravedad'}
                            {entry.infraction?.necesita_retencion
                              ? ' · Retención'
                              : ''}
                          </span>
                        </td>
                        {showVehicle && (
                          <td>
                            {entry.vehicle != null ? (
                              <button
                                className="link-button"
                                type="button"
                                onClick={() =>
                                  onOpenQuery(entry.vehicle!.placa)
                                }
                              >
                                {entry.vehicle.placa}
                              </button>
                            ) : (
                              '—'
                            )}
                          </td>
                        )}
                        <td className="num">
                          {formatMoney(entry.fine.monto)}
                        </td>
                        <td>
                          <StatusTag
                            label={entry.isPaid ? 'Pagada' : 'Pendiente'}
                            tone={fineTone(entry)}
                          />
                        </td>
                        <td className="table__action table__action--actions">
                          <button
                            className="text-button"
                            type="button"
                            onClick={() => setEditingId(entry.fine.id)}
                          >
                            Editar
                          </button>
                          <DeleteAction
                            label="Eliminar"
                            confirmLabel="Eliminar"
                            onDelete={async () => {
                              await deleteFine(entry.fine.id)
                              onChanged()
                            }}
                          />
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </Section>
  )
}
