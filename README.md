# Prymd Rev 2

**Waterproofing ITPs, photos, PDF reports and variations — sorted from site.**

Prymd is a simple, Trello-style field app for waterproofing contractors. It keeps the part the crew already likes — a board of job cards they move along and drop photos onto — and adds the commercial records owners need: a proper **ITP** on every job, a **variations** log for extra work, and a clean **PDF ITP completion report** once the ITP is complete.

> **Why "Prymd"?** It reads as *primed*. A primed surface is prepped and ready to seal — so every job gets *primed*: checked, photographed, signed off, reported and ready to hand over.

## Rev 2 update

Rev 2 keeps the app deliberately simple and adds the key missing handover feature:

- **ITP PDF export** — once all hold points are signed, the ITP tab unlocks **Export / save PDF**.
- **Issue to client** — opens the branded report and starts an email draft to the client contact saved on the job.
- **Client email field** — optional email field on the Job tab.
- **Classy report layout** — professional cover page, job details, ITP summary, signed hold points, photos, standards, variations and time log.
- **No new dependencies** — the PDF path uses the browser print/save-to-PDF flow so the MVP stays lean.

## What it does

- **Job board** — columns for *Scheduled → On site → Awaiting inspection → Complete*. Tap a card to open it; drag between columns on desktop, or change the stage inside the card on a phone.
- **Check in / check out** — one big button. A worker taps **Check in** on arrival and **Check out** when they leave. The job card shows who's on site right now; every job keeps a running log.
- **ITP, made simple** — five hold points based on waterproofing workflows: Material selection · Substrate · Documentation · Membrane installation · Final flood test. Tap to tick, mark Pass/Fail/N/A, add photos, and sign off with a name and timestamp.
- **Completion guard** — the app warns before a job slips into *Complete* with an unfinished ITP.
- **PDF handover report** — when every hold point is signed, export a clean ITP completion report for saving, printing or issuing.
- **Variations** — log extra work with description, photos and cost; mark it pending or approved and see the running total.
- **Photos everywhere** — site photos on the job, evidence photos on each hold point and each variation. Captured from the phone camera, auto-timestamped.

The ITP template references **AS 3740-2021**, **AS 4654.1-2012** and **AS 4654.2-2012** as default record references. Confirm current project-specific requirements before relying on generated records.

## Run it

Requires Node.js 22–24.

```bash
npm install
npm run dev      # start the dev server
npm run build    # production build into /dist
npm run preview  # preview the production build
npm start        # serve the production build with server.js
```

Open the printed URL on your phone, on the same network, to feel the on-site experience.

## How to export a PDF

1. Open a job card.
2. Complete and sign every ITP hold point.
3. Open the **ITP** tab.
4. Click **Export / save PDF**.
5. Use the browser print dialog to save as PDF or print.

## How to issue to a client

1. Add the client email on the **Job** tab.
2. Complete and sign every ITP hold point.
3. Open the **ITP** tab.
4. Click **Issue to client**.
5. Prymd opens the report in a new tab and starts an email draft. Save the report as PDF and attach it.

The MVP does not send attachments directly because there is no backend/email service yet. That is intentional to keep Rev 2 simple.

## Tech

- **React 18 + Vite** — no UI framework, no icon library, plain CSS.
- **No backend yet.** The whole board, including downscaled photo data URLs, is saved to browser `localStorage`.
- **PDF export** uses a printable HTML report generated client-side in `src/lib/itpReport.js`.

## Project structure

```
src/
  App.jsx                 # state, persistence, board + modal, completion guard
  styles.css              # brand palette + styling
  lib/
    storage.js            # localStorage load/save, validates saved data
    itpReport.js          # professional printable ITP report / client issue helper
    id.js                 # id generator
    worker.js             # remembers who is holding the phone
    geo.js                # best-effort browser geolocation
  data/
    itpTemplate.js        # waterproofing hold points + standards references
    seed.js               # default columns and demo job
  components/
    Board.jsx
    Column.jsx
    JobCard.jsx
    JobModal.jsx
    TimePanel.jsx
    ItpPanel.jsx
    HoldPoint.jsx
    VariationsPanel.jsx
    PhotoStrip.jsx
    Icons.jsx

public/
  icon.svg
  logo.svg
```

## Roadmap

1. Backend + accounts for multi-device sync.
2. Real file/object storage for photos.
3. Server-side PDF generation and direct email issuing with attachments.
4. Offline-first queue and sync.
5. Editable ITP templates for different trades.

Prototype scaffold. Not legal or compliance advice — confirm current standards, project specs and your QA requirements before relying on generated records.
