// Waterproofing ITP template.
//
// Derived from the uploaded "Project Team Inspection Checklist — Trade
// Activity: Waterproofing (High Risk)", which references:
//   AS 3740-2021    Waterproofing of domestic wet areas
//   AS 4654.1-2012  External above-ground membranes — materials
//   AS 4654.2-2012  External above-ground membranes — design & installation
//
// The five hold points below mirror the inspection summary in that document.
// Wording is plainer and shorter so a worker can tick it on a phone, on site,
// with one hand. Edit freely — this is just the default template.

export const STANDARDS = [
  { code: 'AS 3740-2021', title: 'Waterproofing of domestic wet areas' },
  { code: 'AS 4654.1-2012', title: 'External above-ground membranes — materials' },
  { code: 'AS 4654.2-2012', title: 'External above-ground membranes — design & installation' },
]

export const ITP_TEMPLATE = [
  {
    key: 'material',
    title: 'Material selection',
    blurb: 'Right membrane for the job, signed off before anything goes down.',
    items: [
      'Membrane suits the expected movement of the structure',
      'Membrane compatible with the substrate, glues and applied finishes',
      'Selection matches the spec, manufacturer and Australian Standards',
      'Any alternative material approved by the client',
    ],
  },
  {
    key: 'substrate',
    title: 'Substrate suitability',
    blurb: 'Background prepped by others — do not start until it passes.',
    items: [
      'Substrate clean and free of dust and contaminants',
      'Curing compounds compatible with the membrane',
      'Shower stepdowns are an adequate depth',
      'Wet-area sheeting fixed per manufacturer recommendations',
      'Hob / hobless construction is correct',
      'Moisture content OK to receive membrane (sealer used if too high)',
    ],
  },
  {
    key: 'documentation',
    title: 'Documentation on site',
    blurb: 'The paperwork the installer needs is actually on site.',
    items: [
      'Specification available on site',
      'Relevant Australian Standard available on site',
      "Manufacturer's installation manuals available on site",
    ],
  },
  {
    key: 'installation',
    title: 'Membrane installation',
    blurb: 'The membrane itself — coats, junctions, terminations, penetrations.',
    items: [
      'Membrane compatible with the surface it is applied to',
      'Correct number of coats / layers applied',
      'Vertical membrane min 150mm above finished tile level (or 25mm above retained — whichever is greater)',
      'Bond breakers at wall/floor, hob/wall junctions and movement joints',
      'Junctions, lap joints, seams and cold joints treated correctly',
      'Edges sealed or flashed; sheet membrane secured at top',
      'Penetrations, posts and drainage overflows sealed',
      'Water stops installed correctly',
      'Membrane to external openings done before frames are fitted',
      'Membrane fully cured and surfaces protected',
      'Photographic records of the installation captured',
    ],
  },
  {
    key: 'final',
    title: 'Final inspection & flood test',
    blurb: 'The money shot — proof it holds water.',
    items: [
      'Installation matches the spec and manufacturer recommendations',
      'No holes or tears in the membrane',
      'Flood test completed (minimum 24 hrs, after the curing period)',
    ],
  },
]

// Build a fresh, empty ITP (array of hold points) from the template.
export function newItp() {
  return ITP_TEMPLATE.map((hp) => ({
    key: hp.key,
    title: hp.title,
    blurb: hp.blurb,
    items: hp.items.map((text, i) => ({ id: `${hp.key}-${i}`, text, checked: false, na: false })),
    result: 'pending', // pending | pass | fail | na
    notes: '',
    photos: [], // { id, dataUrl, ts }
    signedBy: '',
    signedAt: '',
  }))
}

export function itpProgress(itp) {
  if (!itp || !itp.length) return { signed: 0, total: 0, complete: false }
  const total = itp.length
  const signed = itp.filter((hp) => hp.signedAt && hp.result !== 'pending').length
  return { signed, total, complete: signed === total }
}
