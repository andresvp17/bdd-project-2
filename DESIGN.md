---
name: Registro de Tránsito
description: Consulta de expedientes para un registro municipal de vehículos, propietarios y multas.
colors:
  highway-yellow: "#F2C200"
  highway-yellow-deep: "#D6A800"
  asphalt-950: "#14171B"
  asphalt-900: "#1B1F24"
  asphalt-800: "#20242A"
  asphalt-700: "#2A2F36"
  asphalt-600: "#3A414A"
  enamel-50: "#FBF9F3"
  enamel-100: "#F5F2E9"
  enamel-200: "#E9E4D7"
  enamel-300: "#D8D2C2"
  ink: "#20242A"
  ink-soft: "#4D535C"
  registry-green: "#1F7A4D"
  registry-green-soft: "#DFF0E6"
  warning-red: "#C1272D"
  warning-red-soft: "#F7E2E2"
  route-blue: "#1C5AA3"
  route-blue-soft: "#E1EBF7"
  warning-amber-soft: "#F6E8C9"
  warning-amber-ink: "#5B3B00"
typography:
  display:
    fontFamily: "Overpass, Helvetica Neue, Arial, sans-serif"
    fontSize: "4.1rem"
    fontWeight: 800
    lineHeight: 0.99
    letterSpacing: "-0.038em"
  record-title:
    fontFamily: "Overpass, Helvetica Neue, Arial, sans-serif"
    fontSize: "3.25rem"
    fontWeight: 800
    lineHeight: 1.01
    letterSpacing: "-0.038em"
  headline:
    fontFamily: "Overpass, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.27rem"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Overpass, Helvetica Neue, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Overpass Mono, SFMono-Regular, Consolas, monospace"
    fontSize: "0.61rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.14em"
  data:
    fontFamily: "Overpass Mono, SFMono-Regular, Consolas, monospace"
    fontSize: "0.88rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.01em"
rounded:
  hairline: "1px"
  plate: "2px"
  panel: "4px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "18px"
  xl: "24px"
  2xl: "32px"
  3xl: "42px"
components:
  search-gantry:
    backgroundColor: "{colors.enamel-100}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    height: "70px"
  search-tab:
    backgroundColor: "{colors.highway-yellow}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
  search-submit:
    backgroundColor: "{colors.asphalt-800}"
    textColor: "{colors.enamel-100}"
    rounded: "{rounded.plate}"
    padding: "0 18px"
    height: "56px"
  route-status-active:
    backgroundColor: "{colors.registry-green}"
    textColor: "{colors.enamel-50}"
    rounded: "{rounded.plate}"
    padding: "12px 10px"
  route-status-pending:
    backgroundColor: "{colors.warning-red}"
    textColor: "{colors.enamel-50}"
    rounded: "{rounded.plate}"
    padding: "12px 10px"
  tag-active:
    backgroundColor: "{colors.registry-green-soft}"
    textColor: "#155C39"
    rounded: "{rounded.plate}"
    padding: "3px 7px"
  button:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.plate}"
    height: "40px"
    padding: "0 15px"
  recent-item:
    backgroundColor: "transparent"
    textColor: "{colors.enamel-100}"
    rounded: "{rounded.plate}"
    padding: "10px 12px"
---

# Design System: Registro de Tránsito

## Overview

**Creative North Star: "Ruta del Expediente"**

The interface treats a lookup as a route rather than a form result. A single identifier resolves into a sequence of stops — vehicle, owner or infractor, fines — and each stop is a signpost back into the same dossier. The road-sign world is carried by enamel plates, highway yellow, state plates, and a dashed route line, not by decorative roadside imagery.

The system is built for a service counter: dense enough for staff to scan, quiet enough to read for several minutes, and explicit about state. Cream panels sit on a flat asphalt field; ink rules divide facts; yellow marks the query and the resolved identifier; green, red, and neutral plates carry the answer. Overpass gives the display and body voice a blunt, legible character, while Overpass Mono handles plates, identifiers, dates, and amounts.

**Key Characteristics:**
- Flat asphalt ground with enamel-cream reading surfaces.
- Rectangular sign plates, 2px ink borders, and hairline tonal rules.
- A continuous route strip as the signature first-viewport shape.
- State carried by compact green, red, and neutral plates.
- Authored SVG icons, no photographic or illustrative rasters.

## Colors

The palette is a road-sign system: warm enamel on asphalt, with saturated signal colors reserved for state.

### Primary
- **Highway Yellow** (#F2C200): The query tab, the resolved plate origin, focus accents, and the current ownership marker. It is the one color allowed to command attention.
- **Highway Yellow Deep** (#D6A800): Hover and deep-accent use where yellow needs to recede slightly.

### Secondary
- **Registry Green** (#1F7A4D): Active vehicle and ownership states; positive status plates.
- **Warning Red** (#C1272D): Pending or unpaid fines, error state icons, and warning plates.
- **Route Blue** (#1C5AA3): Links, caret, match icon, and quiet secondary actions.

### Neutral
- **Asphalt 800** (#20242A): The page field; every surface floats on it.
- **Asphalt 900/950** (#1B1F24 / #14171B): Deeper shell tones for contrast and secondary depth.
- **Asphalt 700/600** (#2A2F36 / #3A414A): Hover fills and scrollbars.
- **Enamel 100** (#F5F2E9): The primary reading surface for the gantry, route strip, dossier, and state panels.
- **Enamel 50** (#FBF9F3): Text on green and red plates.
- **Enamel 200/300** (#E9E4D7 / #D8D2C2): Secondary panels, neutral plates, and disabled surfaces.
- **Ink** (#20242A): Text and borders on enamel.
- **Ink Soft** (#4D535C): Labels, metadata, and secondary copy on enamel.
- **Warning Amber Soft** (#F6E8C9) / **Warning Amber Ink** (#5B3B00): Notice surfaces that need caution without the alarm of red.

### Named Rules
**The Signal Rarity Rule.** Yellow is a signal, not a surface wash: use it for the query tab, the resolved identifier, and current-state markers, never as a generic section background.
**The Two-Plate Rule.** A state is either a vehicle record state or a fine state. Do not blend green and red into a single decorative accent.

## Typography

**Display Font:** Overpass (with Helvetica Neue, Arial, sans-serif)
**Body Font:** Overpass
**Label/Mono Font:** Overpass Mono (with SFMono-Regular, Consolas, monospace)

**Character:** Overpass is blunt, wide, and legible at counter distance; Overpass Mono makes plates, IDs, dates, and amounts read as registry data rather than prose. The pairing is institutional without feeling bureaucratic.

### Hierarchy
- **Display** (800, clamp 2.35–4.1rem, 0.99): Start-state headline and other first-viewport statements. Tracking floor is -0.038em.
- **Record title** (800, clamp 2–3.25rem, 1.01): The resolved vehicle or boleta heading. Tracking floor is -0.038em.
- **Headline** (800, 1.27rem, 1.2): Section titles inside the dossier.
- **Body** (400, 1rem, 1.5): Prose and explanatory copy. Measures stay under 67ch.
- **Data** (500, 0.88rem, 1.4, 0.01em mono): Plates, VINs, cédulas, money, dates, and table amounts.
- **Label** (700, 0.61rem, 1.2, 0.14em uppercase mono): Fact labels, route stop labels, status labels, and table headers.

### Named Rules
**The Data Is Mono Rule.** Any value a clerk might copy — placa, cédula, VIN, boleta, monto, fecha — is set in Overpass Mono. Narrative copy stays in Overpass.
**The Tracking Floor Rule.** Display tracking never goes below -0.04em. The built system uses -0.038em for its largest headings.

## Layout

The page is a 1240px maximum-width shell centered on asphalt, with 24px gutters at desktop and 14px at phone widths. The primary reading sequence is one column; on wide screens the dossier splits into a main column and a 318px rail, then collapses the rail below the main column at 960px. The rail becomes a two-column band at tablet width and a single column at 760px.

The search gantry is a three-part grid: 112px yellow tab, a flexible mono input, and an auto-width dark submit key. At 760px it stacks into a single column. The route strip is a three-part grid — origin plate, three-stop track, status plate — and becomes a single stacked strip at 860px. Fact grids run three columns at desktop, two at tablet, and one at phone widths. Data tables have a 620px minimum width inside an `overflow-x: auto` wrapper so the page itself never scrolls horizontally.

Spacing follows an 8px-adjacent rhythm: 4, 8, 12, 18, 24, 32, and 42px. Sections are divided by 1px tonal rules, not cards inside cards.

## Elevation & Depth

The system is flat by default. The asphalt field and enamel panels are separated by tone, not by shadow. Two floating objects carry a soft lift: the search gantry (`0 22px 54px rgba(0,0,0,0.34)`) and the dossier/state panels (`0 32px 80px rgba(0,0,0,0.34)`). Small status dots use an offset soft blur (`0 1px 3px rgba(0,0,0,0.35)`), never a zero-offset colored halo.

Depth inside the dossier comes from hairline rules, 2px sign borders, and the route strip’s dashed track. There are no bevels, embossing, glass sheen, or faux-metal effects.

### Named Rules
**The Soft-Lift Rule.** Only floating search and record surfaces get a shadow. Interior sections stay flat and are separated by tone and rules.
**The No-Halo Rule.** A colored glow with zero offset is decoration. Status dots get an offset, blurred neutral shadow instead.

## Shapes

The form language is rectangular and sign-like. Panels use a 4px corner radius; plates, tags, buttons, and inputs use 2px; hairlines and inner counters use 1px. Circular geometry is reserved for route stop icons, timeline markers, and status dots. Borders are 2px ink on major plates and 1px tonal rules inside the dossier.

There is no clipping, no organic masks, and no diagonal geometry. The only repeating ornament is the dashed route line.

## Components

### Route Strip
The signature component. A full-width enamel strip divided into a yellow origin plate, three linked stops, and a status plate. The dashed track animates from left to right once; stops light in sequence; each stop is an anchor back to its section. At 860px the strip stacks vertically and the track stays three across.

### Search Gantry
A flat enamel bar with a yellow `CONSULTA` tab, mono input, and dark `BUSCAR` key. The input is uppercase and mono; the placeholder is sentence-case sans. The gantry carries the only prominent soft shadow above the dossier.

### Status Plates
Rectangular state signs with 2px ink borders. Green means active/vigente, red means pending, neutral cream means inactive or unlinked. The plate carries a mono value, a small uppercase label, and a short meta line.

### Dossier Panels
Cream reading surfaces with 4px corners, 2px ink top borders, and hairline section rules. The dossier header uses a large display title, a match line with a blue route icon, and a mono timestamp stamp.

### Fact Grids
Three-column definition grids with no outer card. Labels are uppercase mono; values are sans except for data fields. Rows are separated by 1px tonal rules.

### Ownership Timeline
A vertical dashed track with circular markers. The current stage uses a yellow marker; closed stages use cream with an ink border. Dates are mono and uppercase.

### Data Tables
Ink-ruled table headers, mono numeric columns, hover row tint, and a minimum width that triggers horizontal scroll on phones. Status is shown with compact tags, not colored row fills.

### Buttons and Links
- **Primary submit:** dark asphalt fill, cream text, 2px radius, hover to asphalt 700.
- **Quiet button:** transparent with ink border; hover inverts to ink fill.
- **Blue link button:** underlined mono text for in-record actions.
- **Text button:** underlined inherited text for “Borrar” and sample actions.

### States
Idle, loading, missing, and error states share the dossier panel geometry. Loading uses a skeleton route strip; missing and error use a circular icon seal and a short recovery action. No empty state is a bare blank panel.

## Do's and Don'ts

### Do:
- **Do** keep the asphalt field flat at `#20242A` and let enamel panels provide the reading surface.
- **Do** use 2px ink borders on sign plates and 1px tonal rules inside the dossier.
- **Do** set identifiers, money, dates, and plate values in Overpass Mono.
- **Do** keep the route strip as the dominant first-viewport shape and preserve its sequential lighting.
- **Do** allow data tables to scroll horizontally inside their wrapper rather than forcing page-level overflow.
- **Do** respect `prefers-reduced-motion` by collapsing route, stop, record, and skeleton animation.

### Don't:
- **Don't** add an eyebrow or kicker above a heading.
- **Don't** use hard offset shadows, colored zero-offset halos, or faux bevels; this is a flat enamel system.
- **Don't** use gradient text, glyph-icon fonts, or system display faces.
- **Don't** use colored left or right side stripes to carry state; use status plates and tags.
- **Don't** warm the asphalt toward blue-black slate or lighten the enamel into white.
- **Don't** replace the route strip with a generic search-results table.
