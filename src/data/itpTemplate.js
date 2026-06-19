// Waterproofing ITP template.
//
// The five hold points below keep the field workflow deliberately simple.
// Items can be ordinary tick/N/A checklist rows, or a product-select row for
// selecting the actual waterproofing products used on the location.

export const STANDARDS = [
  { code: 'AS 3740-2021', title: 'Waterproofing of domestic wet areas' },
  { code: 'AS 4654.1-2012', title: 'External above-ground membranes — materials' },
  { code: 'AS 4654.2-2012', title: 'External above-ground membranes — design & installation' },
]

export const BAYSET_PRODUCTS = [
  'WPA 560',
  'WPA SB',
  'WPA FC',
  'WPA 992',
  'WPA 992 Root Inhibitor Additive',
  'WPA Drainage Cell',
  'WPA 460',
  'WPA SPUR',
  'WPA MS',
  'WPA 230UV',
  'TPA Screed',
  'WPA 160',
  'WPA 400',
  'TPA Lite',
  'TPA Tru Colour Grout',
  'TPA Tru Colour Sanitary Silicone',
  'Tile Edge Balcony Trim',
  'Coreflute Protection Board',
  'WPA Elastoband',
  'WPA 200',
]

export const ITP_TEMPLATE = [
  {
    key: 'material',
    title: 'Material selection',
    blurb: 'Right membrane for the job, signed off before anything goes down.',
    items: [
      {
        id: 'material-products',
        text: 'Material Selection',
        type: 'product-select',
        help: 'Select the Bayset product or system components used for this location.',
      },
      'Membrane product complies with AS 4654.2 / AS 3740',
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
    blurb: 'Proof the waterproofing is ready for handover.',
    items: [
      'Installation matches the spec and manufacturer recommendations',
      'No holes or tears in the membrane',
      'Flood test completed (minimum 24 hrs, after the curing period)',
    ],
  },
]

function makeItem(item, hpKey, index) {
  if (typeof item === 'string') {
    return {
      id: `${hpKey}-${index}`,
      text: item,
      type: 'check',
      checked: false,
      na: false,
      selectedProducts: [],
    }
  }

  return {
    id: item.id || `${hpKey}-${index}`,
    text: item.text,
    type: item.type || 'check',
    help: item.help || '',
    checked: false,
    na: false,
    selectedProducts: [],
  }
}

// Build a fresh, empty ITP (array of hold points) from the template.
export function newItp() {
  return ITP_TEMPLATE.map((hp) => ({
    key: hp.key,
    title: hp.title,
    blurb: hp.blurb,
    items: hp.items.map((item, i) => makeItem(item, hp.key, i)),
    result: 'pending', // pending | pass | fail | na
    notes: '',
    photos: [], // { id, dataUrl, ts }
    signedBy: '',
    signedAt: '',
  }))
}

export function isItpItemAnswered(item) {
  if (item.type === 'product-select') {
    return Array.isArray(item.selectedProducts) && item.selectedProducts.length > 0
  }
  return Boolean(item.checked || item.na)
}

export function itpProgress(itp) {
  if (!itp || !itp.length) return { signed: 0, total: 0, complete: false }
  const total = itp.length
  const signed = itp.filter((hp) => hp.signedAt && hp.result !== 'pending').length
  return { signed, total, complete: signed === total }
}
