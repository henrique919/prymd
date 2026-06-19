# Prymd Rev 4

**Prep. Prime. Prove.**

Prymd is a simple waterproofing management tool for contractors. It keeps the clean Trello-style planner as the centre of the app, then rolls each job/site/project card into location-specific ITPs, QA records, photos, comments, variations and clean PDF reports.

## Rev 4 updates

- Added a Trello-style workspace task bar:
  - Planner
  - Scheduled jobs
  - In Progress
  - Jobboard
  - Completed folder
- Changed the planning structure:
  - Scheduled Jobs = upcoming work
  - In Progress = live work, including first coat / second coat style sequencing
  - Awaiting Inspection = an additional tag on an In Progress job, not a separate column
  - Completed = recently completed jobs
  - Completed Job Folder = archived completed jobs after roughly two weeks
- Added an inspection tag toggle on each job/project file.
- Added a simple planner view showing jobs by planned date and time.
- Kept the existing project → locations → location-specific ITP workflow.
- Added Bayset material selection inside the Material Selection ITP hold point.
- The Bayset material selection is a multi-select dropdown-style control, not a tick-box.
- Updated ITP sign-off logic so normal checklist items require Tick or N/A, while the material-selection item requires at least one product selection.
- Slimmed down the PDF report header so Prymd branding is less excessive and **Inspection Test Plan Report** is more prominent.

## Bayset products currently included

- WPA 560
- WPA SB
- WPA FC
- WPA 992
- WPA 992 Root Inhibitor Additive
- WPA Drainage Cell
- WPA 460
- WPA SPUR
- WPA MS
- WPA 230UV
- TPA Screed
- WPA 160
- WPA 400
- TPA Lite
- TPA Tru Colour Grout
- TPA Tru Colour Sanitary Silicone
- Tile Edge Balcony Trim
- Coreflute Protection Board
- WPA Elastoband
- WPA 200

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm start
```

## Render static site settings

- Build command: `npm install && npm run build`
- Publish directory: `dist`
- Node version: `22`
- Rewrite: `/*` to `/index.html`

