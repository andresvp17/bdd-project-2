import type {
  CatalogoInfraccion,
  HistorialPropiedad,
  Modelo,
  Multa,
  Propietario,
  Vehiculo,
} from '../lib/types'

export interface Registry {
  owners: Propietario[]
  vehicles: Vehiculo[]
  models: Modelo[]
  catalogue: CatalogoInfraccion[]
  history: HistorialPropiedad[]
  fines: Multa[]
}

export type LookupKind = 'placa' | 'cedula' | 'vin' | 'boleta'
export type DetectedKind = LookupKind | 'unknown'
export type Anchor = 'vehicle' | 'owner' | 'fine'

export interface OwnershipStage {
  entry: HistorialPropiedad
  owner: Propietario
  vehicle: Vehiculo
  model?: Modelo
  isCurrent: boolean
}

export interface FineView {
  fine: Multa
  infraction?: CatalogoInfraccion
  vehicle?: Vehiculo
  owner?: Propietario
  isPaid: boolean
}

export interface VehicleView {
  vehicle: Vehiculo
  model?: Modelo
  ownership: OwnershipStage[]
  current: OwnershipStage | null
  fines: FineView[]
}

export interface OwnerVehicleView {
  vehicle: Vehiculo
  model?: Modelo
  stage: OwnershipStage
  isCurrent: boolean
}

export interface OwnerView {
  owner: Propietario
  vehicles: OwnerVehicleView[]
  currentVehicles: OwnerVehicleView[]
  fines: FineView[]
}

export interface Dossier {
  query: string
  kind: LookupKind
  anchor: Anchor
  generatedAt: string
  vehicle?: VehicleView
  owner?: OwnerView
  fine?: FineView
  fines: FineView[]
  history: OwnershipStage[]
  vehicles: OwnerVehicleView[]
}

export class RegistryError extends Error {
  status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.name = 'RegistryError'
    this.status = status
  }
}

async function fetchJson<T>(path: string): Promise<T> {
  let response: Response

  try {
    response = await fetch(path, {
      headers: { Accept: 'application/json' },
    })
  } catch {
    throw new RegistryError('No se pudo conectar con el servidor del registro.')
  }

  if (!response.ok) {
    let message = `El registro respondió con el código ${response.status}.`

    try {
      const body = (await response.json()) as { error?: unknown }
      if (typeof body.error === 'string' && body.error.length > 0) {
        message = body.error
      }
    } catch {}

    throw new RegistryError(message, response.status)
  }

  return (await response.json()) as T
}

let registryRequest: Promise<Registry> | null = null

export function clearRegistryCache(): void {
  registryRequest = null
}

export function fetchRegistry(): Promise<Registry> {
  if (registryRequest == null) {
    registryRequest = Promise.all([
      fetchJson<Propietario[]>('/api/propietarios'),
      fetchJson<Vehiculo[]>('/api/vehiculos'),
      fetchJson<Modelo[]>('/api/modelos'),
      fetchJson<CatalogoInfraccion[]>('/api/catalogo-infracciones'),
      fetchJson<HistorialPropiedad[]>('/api/historial-propiedad'),
      fetchJson<Multa[]>('/api/multas'),
    ])
      .then(([owners, vehicles, models, catalogue, history, fines]) => ({
        owners,
        vehicles,
        models,
        catalogue,
        history,
        fines,
      }))
      .catch((error: unknown) => {
        registryRequest = null
        throw error
      })
  }

  return registryRequest
}

type HttpMethod = 'POST' | 'PATCH' | 'DELETE'

async function sendJson(
  path: string,
  method: HttpMethod,
  body?: unknown,
): Promise<void> {
  let response: Response

  try {
    response = await fetch(path, {
      method,
      headers: {
        Accept: 'application/json',
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new RegistryError('No se pudo conectar con el servidor del registro.')
  }

  if (!response.ok) {
    let message = `El registro respondió con el código ${response.status}.`

    try {
      const data = (await response.json()) as {
        error?: unknown
        details?: unknown
      }
      if (typeof data.error === 'string' && data.error.length > 0) {
        message = data.error
      }

      if (Array.isArray(data.details)) {
        const issues = data.details
          .map((detail) => {
            if (typeof detail !== 'object' || detail == null) return ''
            const record = detail as { path?: unknown; message?: unknown }
            const path = Array.isArray(record.path) ? record.path.join('.') : ''
            const text =
              typeof record.message === 'string' ? record.message : ''
            return [path, text].filter((part) => part.length > 0).join(': ')
          })
          .filter((issue) => issue.length > 0)

        if (issues.length > 0) {
          message = `Datos inválidos: ${issues.join('; ')}`
        }
      }
    } catch {}

    throw new RegistryError(message, response.status)
  }
}

export function newId(): string {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID()
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const random = (Math.random() * 16) | 0
    const value = char === 'x' ? random : (random & 0x3) | 0x8
    return value.toString(16)
  })
}

export type OwnerInput = Omit<Propietario, 'id'>
export type VehicleInput = Omit<Vehiculo, 'id'>
export type ModelInput = Omit<Modelo, 'id'>
export type InfractionInput = Omit<CatalogoInfraccion, 'id'>
export type OwnershipInput = Omit<HistorialPropiedad, 'id'>
export type FineInput = Omit<Multa, 'id' | 'monto'>

export async function createOwner(input: OwnerInput): Promise<void> {
  await sendJson('/api/propietarios', 'POST', { id: newId(), ...input })
}

export async function updateOwner(
  id: string,
  input: Partial<OwnerInput>,
): Promise<void> {
  await sendJson(`/api/propietarios/${id}`, 'PATCH', input)
}

export async function deleteOwner(id: string): Promise<void> {
  await sendJson(`/api/propietarios/${id}`, 'DELETE')
}

export async function createVehicle(input: VehicleInput): Promise<void> {
  await sendJson('/api/vehiculos', 'POST', { id: newId(), ...input })
}

export async function updateVehicle(
  id: string,
  input: Partial<VehicleInput>,
): Promise<void> {
  await sendJson(`/api/vehiculos/${id}`, 'PATCH', input)
}

export async function deleteVehicle(id: string): Promise<void> {
  await sendJson(`/api/vehiculos/${id}`, 'DELETE')
}

export async function createModel(input: ModelInput): Promise<void> {
  await sendJson('/api/modelos', 'POST', input)
}

export async function updateModel(
  id: number,
  input: Partial<ModelInput>,
): Promise<void> {
  await sendJson(`/api/modelos/${id}`, 'PATCH', input)
}

export async function deleteModel(id: number): Promise<void> {
  await sendJson(`/api/modelos/${id}`, 'DELETE')
}

export async function createInfraction(input: InfractionInput): Promise<void> {
  await sendJson('/api/catalogo-infracciones', 'POST', input)
}

export async function updateInfraction(
  id: number,
  input: Partial<InfractionInput>,
): Promise<void> {
  await sendJson(`/api/catalogo-infracciones/${id}`, 'PATCH', input)
}

export async function deleteInfraction(id: number): Promise<void> {
  await sendJson(`/api/catalogo-infracciones/${id}`, 'DELETE')
}

export async function createOwnership(input: OwnershipInput): Promise<void> {
  await sendJson('/api/historial-propiedad', 'POST', { id: newId(), ...input })
}

export async function updateOwnership(
  id: string,
  input: Partial<OwnershipInput>,
): Promise<void> {
  await sendJson(`/api/historial-propiedad/${id}`, 'PATCH', input)
}

export async function deleteOwnership(id: string): Promise<void> {
  await sendJson(`/api/historial-propiedad/${id}`, 'DELETE')
}

export async function createFine(input: FineInput): Promise<void> {
  await sendJson('/api/multas', 'POST', { id: newId(), ...input })
}

export async function updateFine(
  id: string,
  input: Partial<FineInput>,
): Promise<void> {
  await sendJson(`/api/multas/${id}`, 'PATCH', input)
}

export async function deleteFine(id: string): Promise<void> {
  await sendJson(`/api/multas/${id}`, 'DELETE')
}

export function cleanQuery(raw: string): string {
  return raw.replace(/\s+/g, ' ').trim()
}

function looseKey(value: string): string {
  return value.replace(/[\s.\-_/]/g, '').toUpperCase()
}

export function detectKind(raw: string): DetectedKind {
  const query = cleanQuery(raw)
  const compact = query.replace(/[\s.\-_/]/g, '').toUpperCase()

  if (/^BOL/.test(compact)) return 'boleta'
  if (/^VIN/.test(compact)) return 'vin'
  if (/^[VEJ]?\d{6,9}$/.test(compact)) return 'cedula'
  if (/^[A-Z]{1,3}\d{2,4}[A-Z]{0,3}$/.test(compact)) return 'placa'
  if (compact.length >= 15 && /[A-Z]/.test(compact) && /\d/.test(compact)) {
    return 'vin'
  }

  return 'unknown'
}

function byDateDesc(a: OwnershipStage, b: OwnershipStage): number {
  if (a.isCurrent !== b.isCurrent) return a.isCurrent ? -1 : 1
  return b.entry.fecha_inicio.localeCompare(a.entry.fecha_inicio)
}

function betterStage(
  candidate: OwnershipStage,
  incumbent: OwnershipStage,
): boolean {
  if (candidate.isCurrent !== incumbent.isCurrent) return candidate.isCurrent
  return candidate.entry.fecha_inicio > incumbent.entry.fecha_inicio
}

function byFineDateDesc(a: FineView, b: FineView): number {
  return b.fine.fecha_hora.localeCompare(a.fine.fecha_hora)
}

export function resolveDossier(
  registry: Registry,
  raw: string,
): Dossier | null {
  const query = cleanQuery(raw)
  const detected = detectKind(query)
  const key = looseKey(query)
  const cedula = Number(query.replace(/\D/g, ''))

  const ownerMap = new Map(registry.owners.map((owner) => [owner.id, owner]))
  const vehicleMap = new Map(
    registry.vehicles.map((vehicle) => [vehicle.id, vehicle]),
  )
  const modelMap = new Map<number, Modelo>()
  const catalogueMap = new Map<number, CatalogoInfraccion>()

  registry.models.forEach((model, index) => {
    modelMap.set(model.id ?? index + 1, model)
  })
  registry.catalogue.forEach((entry, index) => {
    catalogueMap.set(entry.id ?? index + 1, entry)
  })

  const stagesByVehicle = new Map<string, OwnershipStage[]>()
  const stagesByOwner = new Map<string, OwnershipStage[]>()

  for (const entry of registry.history) {
    const entryOwner = ownerMap.get(entry.propietario_id)
    const entryVehicle = vehicleMap.get(entry.vehiculo_id)
    if (entryOwner == null || entryVehicle == null) continue

    const stage: OwnershipStage = {
      entry,
      owner: entryOwner,
      vehicle: entryVehicle,
      model: modelMap.get(entryVehicle.modelo_id),
      isCurrent: entry.fecha_fin == null,
    }

    const vehicleStages = stagesByVehicle.get(entryVehicle.id) ?? []
    vehicleStages.push(stage)
    stagesByVehicle.set(entryVehicle.id, vehicleStages)

    const ownerStages = stagesByOwner.get(entryOwner.id) ?? []
    ownerStages.push(stage)
    stagesByOwner.set(entryOwner.id, ownerStages)
  }

  const buildFineView = (fine: Multa): FineView => ({
    fine,
    infraction: catalogueMap.get(fine.infraccion_id),
    vehicle: vehicleMap.get(fine.vehiculo_id),
    owner: ownerMap.get(fine.infractor_id),
    isPaid: Boolean(fine.fecha_pago),
  })

  const buildVehicleView = (vehicle: Vehiculo): VehicleView => {
    const ownership = [...(stagesByVehicle.get(vehicle.id) ?? [])].sort(
      byDateDesc,
    )
    const fines = registry.fines
      .filter((fine) => fine.vehiculo_id === vehicle.id)
      .map(buildFineView)
      .sort(byFineDateDesc)

    return {
      vehicle,
      model: modelMap.get(vehicle.modelo_id),
      ownership,
      current: ownership.find((stage) => stage.isCurrent) ?? null,
      fines,
    }
  }

  const buildOwnerView = (owner: Propietario): OwnerView => {
    const latestByVehicle = new Map<string, OwnershipStage>()

    for (const stage of stagesByOwner.get(owner.id) ?? []) {
      const incumbent = latestByVehicle.get(stage.vehicle.id)
      if (incumbent == null || betterStage(stage, incumbent)) {
        latestByVehicle.set(stage.vehicle.id, stage)
      }
    }

    const vehicles = Array.from(latestByVehicle.values())
      .map<OwnerVehicleView>((stage) => ({
        vehicle: stage.vehicle,
        model: modelMap.get(stage.vehicle.modelo_id),
        stage,
        isCurrent: stage.isCurrent,
      }))
      .sort((a, b) => {
        if (a.isCurrent !== b.isCurrent) return a.isCurrent ? -1 : 1
        return b.stage.entry.fecha_inicio.localeCompare(
          a.stage.entry.fecha_inicio,
        )
      })

    const fines = registry.fines
      .filter((fine) => fine.infractor_id === owner.id)
      .map(buildFineView)
      .sort(byFineDateDesc)

    return {
      owner,
      vehicles,
      currentVehicles: vehicles.filter((vehicle) => vehicle.isCurrent),
      fines,
    }
  }

  const findFine = (): Multa | undefined =>
    registry.fines.find((fine) => looseKey(fine.n_boleta) === key)
  const findVehicleByPlate = (): Vehiculo | undefined =>
    registry.vehicles.find((vehicle) => looseKey(vehicle.placa) === key)
  const findVehicleByVin = (): Vehiculo | undefined =>
    registry.vehicles.find(
      (vehicle) =>
        looseKey(vehicle.vin_serial) === key ||
        looseKey(vehicle.serial_motor) === key,
    )
  const findOwner = (): Propietario | undefined =>
    Number.isFinite(cedula)
      ? registry.owners.find((owner) => owner.cedula === cedula)
      : undefined

  let fine: Multa | undefined
  let vehicle: Vehiculo | undefined
  let owner: Propietario | undefined

  if (detected === 'boleta') fine = findFine()
  if (detected === 'placa') vehicle = findVehicleByPlate()
  if (detected === 'vin') vehicle = findVehicleByVin()
  if (detected === 'cedula') owner = findOwner()

  if (fine == null && vehicle == null && owner == null) {
    fine = findFine()
    vehicle = vehicle ?? findVehicleByPlate() ?? findVehicleByVin()
    owner = owner ?? findOwner()
  }

  const generatedAt = new Date().toISOString()

  if (fine != null) {
    const fineView = buildFineView(fine)
    const vehicleView = fineView.vehicle
      ? buildVehicleView(fineView.vehicle)
      : undefined
    const ownerView = fineView.owner
      ? buildOwnerView(fineView.owner)
      : undefined

    return {
      query,
      kind: 'boleta',
      anchor: 'fine',
      generatedAt,
      fine: fineView,
      vehicle: vehicleView,
      owner: ownerView,
      fines: vehicleView?.fines ?? [fineView],
      history: vehicleView?.ownership ?? [],
      vehicles: ownerView?.vehicles ?? [],
    }
  }

  if (owner != null) {
    const ownerView = buildOwnerView(owner)

    return {
      query,
      kind: 'cedula',
      anchor: 'owner',
      generatedAt,
      owner: ownerView,
      fines: ownerView.fines,
      history: ownerView.vehicles.map((entry) => entry.stage).sort(byDateDesc),
      vehicles: ownerView.vehicles,
    }
  }

  if (vehicle != null) {
    const vehicleView = buildVehicleView(vehicle)
    const ownerView = vehicleView.current
      ? buildOwnerView(vehicleView.current.owner)
      : undefined
    const kind: LookupKind = key === looseKey(vehicle.placa) ? 'placa' : 'vin'

    return {
      query,
      kind,
      anchor: 'vehicle',
      generatedAt,
      vehicle: vehicleView,
      owner: ownerView,
      fines: vehicleView.fines,
      history: vehicleView.ownership,
      vehicles: ownerView?.vehicles ?? [],
    }
  }

  return null
}
