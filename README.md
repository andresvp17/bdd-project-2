# Registro de Tránsito

Consulta de expedientes para un registro municipal de vehículos, propietarios y multas de tránsito. La interfaz permite resolver una placa, cédula, VIN o número de boleta en una sola ficha de lectura.

## Requisitos

- Node.js y npm
- El proyecto usa Create React App para el frontend y Express + SQLite para la API.

## Ejecutar en desarrollo

Instale las dependencias y levante la API y la interfaz en dos terminales:

```bash
npm install
npm run dev:server
```

```bash
npm start
```

La interfaz queda en `http://localhost:3000` y la API en `http://localhost:8555`. CRA redirige las solicitudes `/api/*` al puerto de la API mediante el proxy configurado en `package.json`.

## Consultas de demostración

- Placa: `A123BC`
- Cédula: `V-12.345.678`
- VIN: `VIN-00000000000000001`
- Boleta: `BOL-2024-0002`

Los datos de `sample.json` son ficticios y se usan únicamente como demostración. No corresponden a personas, vehículos ni multas reales.

## Verificación

```bash
npm run typecheck
npm run build
npm test
```

## Estructura

- `src/backend/`: API Express, servicios, repositorios y esquemas Zod.
- `src/frontend/`: interfaz de consulta, cliente de la API y formato de datos.
- `src/lib/`: tipos compartidos y utilidades de base de datos.
- `database.db`: base SQLite local sembrada al arrancar la API.
- `sample.json`: datos de ejemplo usados por el sembrado.
