---
version: 1
slug: "src-app-tsx"
primary_target: "src/App.tsx"
related_targets: ["src/frontend/LookupPage.tsx"]
---

# Vehicle & owner lookup

Scope: first surface for the municipal traffic registry (Operate, web). Audience: administrative staff at a service counter. Job: resolve any placa, cédula, VIN, or boleta to one complete record. Action: search once, read the dossier; read-only in v1. Proof: linked vehicle, active owner, time-bounded ownership history, and fines. Constraints: Spanish (Venezuela), UUID-backed API, sample data is demonstration only. Memorable moment: the route strip resolves and each stop lights in sequence.

## Direction contract

THESIS: A lookup resolves like a route, not a form result: identifier → vehicle → owner → fines, with state carried by road-sign plates. It refuses the generic search-results table.

OWN-WORLD: Asphalt shell (#20242A), enamel sign panels (#F5F2E9), highway yellow (#F2C200), state green (#1F7A4D), warning red (#C1272D), route blue (#1C5AA3). Overpass and Overpass Mono, self-hosted. Rectangular enamel plates, hairline rules, 2px sign borders, and a dashed route line as the only ornament.

STORY: Staff type one identifier and immediately see whether the registry is active, who owns the vehicle now, how the chain of title runs, and what is owed. Every stop is a link back to the same record.

FIRST VIEWPORT: Top command bar with the registry name and counter status. A full-width enamel search gantry: yellow CONSULTA tab, mono input, dark BUSCAR key. Below, the continuous route strip: a large placa plate, vehicle stop, active-owner stop, fines stop, and a green ACTIVO status plate. The dossier begins under it; the signature route strip is the dominant shape.

FORM: Grounded direction 7 of 7 (road signage), Operate mode. seed:bcfa7bbff666812b

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
