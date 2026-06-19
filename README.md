# Prymd

**Waterproofing management made simple — projects, locations, ITPs, QA and variations from site.**

Prymd is a simple, Trello-style field app for waterproofing contractors. It keeps the part crews already understand — a board of project/site cards they can move through the programme — and adds location-specific ITPs, photo records, time logs and variation tracking.

> **Why "Prymd"?** It reads as *primed*. A primed surface is prepped and ready to seal — so every job gets *primed*: planned, photographed, signed off, exported and ready to hand over.

## What it does

- **Trello-style planning board** — each card is an overall job/site/project file. Columns are *Scheduled → On site → Awaiting inspection → Complete*.
- **Project file** — store builder/client, client email, site address, assigned crew, planned date/time, comments and project photos.
- **Locations inside each project** — add specific work areas such as *Building 1 · Level 1 · Unit 105 · Bathroom*. Each location has its own comments, photos, assigned crew, planned date/time and ITP set.
- **Location-specific ITPs** — complete the waterproofing ITP against the exact location, not just the overall project.
- **Item-level N/A** — each ITP checklist item can now be ticked or marked **N/A**. This prevents irrelevant items blocking closeout while still forcing the user to answer every line.
- **ITP PDF report** — once a location ITP is fully signed off, export a clean, professional PDF report for saving or issuing to the client.
- **Issue to client** — opens the report and starts an email draft to the client contact.
- **Check in / check out** — one big button. A worker taps **Check in** on arrival and **Check out** when they leave. The app stamps name, time and best-effort location.
- **Variations** — log extra work with description, cost, photos and approval status.
- **Photos everywhere** — project photos, location photos, ITP evidence photos and variation photos.

The default ITP template references **AS 3740-2021**, **AS 4654.1-2012** and **AS 4654.2-2012**.

## Run it

Requires [Node.js](https://nodejs.org) 22–24.

```bash
npm install
npm run dev      # start the dev server
npm run build    # production build into /dist
npm run preview  # preview the production build
npm start        # serve the production build with server.js
```

Open the printed URL on your phone to test the on-site experience.

## Current MVP scope

This is still intentionally simple:

- React 18 + Vite
- no backend yet
- data and photos are saved to browser `localStorage`
- report export uses the browser print/save-to-PDF flow
- issue-to-client uses a mailto email draft

The next production step is moving storage and photos to a real backend so all workers and office users share the same data.

## Data model summary

```txt
board
 ├─ columns: [{ id, title, cardIds[] }]
 └─ cards: {
      [id]: {
        id, title, client, clientEmail, area, assignee,
        scheduledDate, scheduledTime, description,
        photos: [{ id, dataUrl, ts }],
        locations: [{
          id, name, building, level, unit, areaName,
          scheduledDate, scheduledTime, assignee, comments,
          photos: [{ id, dataUrl, ts }],
          itp: [{ key, title, items[{id,text,checked,na}], result,
                 notes, photos[], signedBy, signedAt }]
        }],
        activeLocationId,
        variations: [{ id, description, cost, photos[], date, status }],
        timeLog: [{ id, worker, checkInAt, checkInLoc, checkOutAt, checkOutLoc }],
        createdAt
      }
    }
```

## Important note

Prototype scaffold only. Not legal or compliance advice — confirm current standards, manufacturer requirements and project-specific QA requirements before relying on generated records.
