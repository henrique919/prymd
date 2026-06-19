# Prymd

**Waterproofing ITPs, photos and variations — sorted from site.**

Prymd is a simple, Trello-style field app for waterproofing contractors. It
keeps the part the crew already likes — a board of job cards they move along
and drop photos onto — and adds the two things a whiteboard and a group chat
can't give you: a proper **ITP** (Inspection Test Plan) on every job, and a
**variations** log for extra work.

> **Why "Prymd"?** It reads as *primed*. A primed surface is prepped and ready
> to seal — so every job gets *primed*: checked, photographed, signed off, and
> ready to hand over. The name is the workflow.

## What it does

- **Job board** — columns for *Scheduled → On site → Awaiting inspection →
  Complete*. Tap a card to open it; drag between columns on desktop, or change
  the stage inside the card on a phone.
- **ITP, made simple** — five hold points drawn straight from the standard
  waterproofing inspection checklist (Material selection · Substrate ·
  Documentation · Membrane installation · Final flood test). Tap to tick, mark
  Pass/Fail/N/A, add photos, and sign off with a name and timestamp.
- **The "can't sneak it through" rule** — a job warns you before it slips into
  *Complete* with an unfinished ITP. That single guard is the reason to leave
  Trello: good intentions become an enforced record.
- **Variations** — log extra work with a description, photos and a cost, mark
  it pending or approved, and see the running total. This is what feeds the
  invoice.
- **Photos everywhere** — site photos on the job, evidence photos on each hold
  point and each variation. Captured from the phone camera, auto-timestamped.

The ITP template is based on a *Project Team Inspection Checklist — Waterproofing
(High Risk)* and references **AS 3740-2021**, **AS 4654.1-2012** and
**AS 4654.2-2012**.

## Run it

Requires [Node.js](https://nodejs.org) 18+.

```bash
npm install
npm run dev      # start the dev server (Vite prints a local URL)
npm run build    # production build into /dist
npm run preview  # preview the production build
```

Open the printed URL on your phone (same network) to feel the on-site
experience.

## Tech

- **React 18 + Vite** — no UI framework, no icon library, plain CSS. Easy to
  read, easy to change.
- **No backend yet.** The whole board (including photos, as downscaled JPEG
  data URLs) is saved to the browser's `localStorage`. That makes the prototype
  run anywhere with zero setup — but it's per-device and capped at a few MB of
  photos. Moving to a real backend means replacing one file:
  [`src/lib/storage.js`](src/lib/storage.js).

## Project structure

```
src/
  App.jsx                 # state, persistence, board + modal, completion guard
  styles.css              # palette + all styling
  lib/
    storage.js            # localStorage load/save (swap this for an API later)
    id.js                 # id generator
  data/
    itpTemplate.js        # the 5 waterproofing hold points + AS references
    seed.js               # default columns and a demo job
  components/
    Board.jsx             # row of columns; drag state
    Column.jsx            # one stage; add-job; drop target
    JobCard.jsx           # card with ITP "primer" pips and counts
    JobModal.jsx          # Job / ITP / Variations tabs
    ItpPanel.jsx          # ITP progress + standards
    HoldPoint.jsx         # one hold point: checklist, pass/fail, sign-off
    VariationsPanel.jsx   # add/track extra works for invoicing
    PhotoStrip.jsx        # camera capture + thumbnails
    Icons.jsx             # inline SVG icons
```

## Data model

```
board
 ├─ columns: [{ id, title, cardIds[] }]
 └─ cards: {
      [id]: {
        id, title, client, area, assignee, scheduledDate, description,
        photos:     [{ id, dataUrl, ts }],
        itp:        [{ key, title, items[{id,text,checked}], result,
                       notes, photos[], signedBy, signedAt }],
        variations: [{ id, description, cost, photos[], date, status }],
        createdAt
      }
    }
```

## Roadmap (suggested next steps)

1. **Backend + accounts** — multi-device sync, so James and his five workers
   see the same board. Replace `storage.js` with API calls.
2. **PDF handover pack** — one tap to export a job's ITP + photos + variations
   as a branded PDF for the builder. This is the feature builders will rate.
3. **Photo storage** — move photos off `localStorage` to object storage.
4. **Offline-first** — site work happens with no signal; queue and sync.
5. **GPS + time stamps on photos** — strengthens the "where and when" evidence.
6. **Editable ITP templates** — tiling, firestopping, coatings, so the app
   grows beyond waterproofing.

---

Prototype scaffold. Not legal or compliance advice — confirm current standards
and your own QA requirements before relying on generated records.
