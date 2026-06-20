# Tanqo

**Waterproofing ITPs, photos and variations — sorted from site.**

Tanqo is a simple, Trello-style field app for waterproofing contractors. It
keeps the part the crew already likes — a board of job cards they move along,
comment on and drop photos onto — and adds the things a whiteboard and a group
chat can't: a proper **ITP** (Inspection Test Plan) on every job, a
**variations** log for extra work, and an **activity feed** so you always know
what's happening, where and when.

> **Why "Tanqo"?** It comes from *tanking* — the trade's own word for
> waterproofing a wet area. Tank it, log it, prove it. A job that's passed all
> its hold points is **watertight**, and ready to hand over.

## What it does

- **Job board** — columns for *Scheduled → On site → Awaiting inspection →
  Complete*. Tap a card to open it; drag between columns on desktop, or change
  the stage inside the card on a phone.
- **Bottom tab bar** — Board · Search · Add · Activity · Menu, all thumb-reachable.
- **ITP, made simple** — five hold points drawn straight from the standard
  waterproofing inspection checklist (Material selection · Substrate ·
  Documentation · Membrane installation · Final flood test). Tap to tick, mark
  Pass/Fail/N/A, add photos, sign off with a name and timestamp.
- **The "can't sneak it through" rule** — a job warns you before it slips into
  *Complete* with an unfinished ITP. Good intentions become an enforced record.
- **Variations** — log extra work with a description, photos and a cost, mark it
  pending or approved, see the running total. This feeds the invoice.
- **Comments & activity** — a feed on every job (and a global Activity view).
  Sign-offs, stage moves and variations log automatically; the crew adds
  comments. Attributed and timestamped — your "who did what, where, when".
- **Labels** — colored bars on card fronts (Urgent, Domestic, Commercial,
  External, Warranty, Awaiting trade).
- **Photos everywhere** — on the job, on each hold point, on each variation.
  Captured from the phone camera, auto-timestamped.

The ITP template references **AS 3740-2021**, **AS 4654.1-2012** and
**AS 4654.2-2012**.

## Rev 5

This revision rebrands the app from its working name (Prymd) to **Tanqo**:
new wordmark, logo mark, and watertight language throughout. Feature set
carries over from Rev 4 (bottom nav, comments/activity, labels, search,
richer card fronts) unchanged.

## Run it

Requires [Node.js](https://nodejs.org) 18+.

```bash
npm install
npm run dev      # start the dev server (Vite prints a local URL)
npm run build    # production build into /dist
npm run preview  # preview the production build
```

Open the printed URL on your phone (same network) to feel the on-site
experience. For GitHub Pages under `username.github.io/tanqo/`, set
`base: '/tanqo/'` in `vite.config.js` and deploy the `/dist` folder.

> Prefer zero setup? `tanqo-standalone.html` is the whole app in one file —
> double-click to open, no Node required. Great for showing someone on the spot.

## Tech

- **React 18 + Vite** — no UI framework, no icon library, plain CSS.
- **No backend yet.** The whole board (including photos, as downscaled JPEG
  data URLs) is saved to the browser's `localStorage` — per-device, capped at a
  few MB of photos. Moving to a real backend means replacing one file:
  [`src/lib/storage.js`](src/lib/storage.js).

## Project structure

```
src/
  App.jsx                 # state, persistence, views, completion guard, activity log
  styles.css              # palette + all styling
  lib/
    storage.js            # localStorage load/save (swap for an API later)
    user.js               # current-user name (attributes comments & sign-offs)
    id.js                 # id generator
  data/
    itpTemplate.js        # the 5 waterproofing hold points + AS references
    labels.js             # job label catalog
    seed.js               # default columns, demo job + activity
  components/
    Logo.jsx              # droplet + tick mark
    Board.jsx Column.jsx JobCard.jsx     # the kanban board
    JobModal.jsx          # Details / ITP / Variations / Activity tabs
    ItpPanel.jsx HoldPoint.jsx           # the ITP
    VariationsPanel.jsx                  # extra works for invoicing
    ActivityPanel.jsx ActivityView.jsx   # per-job + global feeds
    SearchView.jsx MenuView.jsx          # search + settings
    BottomNav.jsx LabelPicker.jsx PhotoStrip.jsx Icons.jsx
```

## Roadmap (suggested next steps)

1. **Backend + accounts** — multi-device sync so the whole crew shares one board.
2. **PDF handover pack** — one tap to export a job's ITP + photos + variations
   as a branded PDF for the builder. The feature builders will rate.
3. **Photo storage** — move photos off `localStorage` to object storage.
4. **Offline-first** — site work happens with no signal; queue and sync.
5. **GPS + time stamps on photos** — strengthens the "where and when" evidence.
6. **Editable ITP templates** — tiling, firestopping, coatings; grow beyond
   waterproofing.

---

Prototype scaffold. Not legal or compliance advice — confirm current standards
and your own QA requirements before relying on generated records.
