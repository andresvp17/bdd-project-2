# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Administrative staff of a municipal traffic authority in Venezuela. They work at a desk or service counter, registering owners and vehicles, maintaining ownership transfers, issuing fines, and looking up records on behalf of the authority. The confirmed scope is a single staff role, not a role-separated or public-facing service.

## Product Purpose

A unified registry for vehicle ownership and traffic fines. It connects owners, vehicle models, vehicles, ownership history, the infraction catalog, and issued fines in one consistent record. Success means end-to-end lookup: any placa, cédula, VIN, or n_boleta resolves to a complete, trustworthy record without leaving the system.

## Positioning

One data model spans the whole chain — owner identity, vehicle identity, the time-bounded ownership history, the legal infraction catalog, and the fines issued against a vehicle and its infractor — so lookups work end to end by plate, cédula, VIN, or boleta rather than through separate registries.

## Operating Context

Staff work in Spanish with Venezuelan vehicle-administration terminology: cédula, placa, serial de motor, VIN, boleta, número de documento de título, catálogo de infracciones. Records are keyed by UUIDs, with human-facing lookup keys for day-to-day work. The system is a REST API backed by a local SQLite database seeded from illustrative sample data; the React frontend is currently the Create React App starter and is not yet a working interface.

## Capabilities and Constraints

- CRUD for propietarios, vehículos, modelos, catálogo de infracciones, historial de propiedad, and multas, exposed under `/api/*`.
- Lookup endpoints by cédula, placa, VIN, and n_boleta in addition to ID.
- Zod request validation; UUID v4 identifiers for owners, vehicles, ownership records, and fines; ISO date/datetime fields.
- Uniqueness enforced on cédula, correo, placa, VIN, nro_documento_titulo, and n_boleta.
- A partial unique index allows at most one active ownership record (`fecha_fin IS NULL`) per vehicle.
- Confirmed as a single staff role; role-based permissions and authentication are not part of the current scope.
- The frontend UI has not been built yet.
- Open decisions: payment/collection tracking beyond `fecha_pago`, reporting, and deployment target are undecided.

## Evidence on Hand

`sample.json` contains illustrative seed data only — fictional owners, vehicles, and fines. There are no real records, municipal logos, brand assets, testimonials, press, or official documents in the repository. Future work must not present seeded records as real, fabricate customers or benchmarks, or claim the infraction catalog amounts map to actual Venezuelan traffic law unless that is verified and supplied.

## Product Principles

1. Resolve end to end — every plausible identifier (placa, cédula, VIN, boleta) should lead to the full linked record without leaving the system.
2. Preserve the ownership chain — ownership history is time-bounded and first-class; past transfers are never overwritten.
3. Keep the Venezuelan domain language intact — Spanish terms, cédula, placa, and boleta are product vocabulary, not decoration.
4. Treat sample data as demo only — never pass seeded records off as real people, vehicles, or fines.
5. Keep the API contract honest — validated, typed request shapes and stable REST routes are part of the product surface.
