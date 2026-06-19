import { STANDARDS, itpProgress } from '../data/itpTemplate.js'

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function fmtDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' })
}

function fmtDateTime(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleString('en-AU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function money(n) {
  const v = Number(n) || 0
  return v.toLocaleString('en-AU', { style: 'currency', currency: 'AUD' })
}

function resultLabel(result) {
  if (result === 'pass') return 'Pass'
  if (result === 'fail') return 'Fail'
  if (result === 'na') return 'N/A'
  return 'Pending'
}

function photoGrid(photos = []) {
  const safe = Array.isArray(photos) ? photos.filter((p) => p?.dataUrl) : []
  if (!safe.length) return '<div class="empty">No photos attached.</div>'
  return `<div class="photos">${safe
    .map(
      (p) => `
        <figure>
          <img src="${escapeHtml(p.dataUrl)}" alt="" />
          <figcaption>${escapeHtml(fmtDateTime(p.ts))}</figcaption>
        </figure>
      `
    )
    .join('')}</div>`
}

function timeSummary(timeLog = []) {
  const safe = Array.isArray(timeLog) ? timeLog : []
  if (!safe.length) return '<div class="empty">No time entries recorded.</div>'
  return `
    <table>
      <thead><tr><th>Worker</th><th>Check in</th><th>Check out</th></tr></thead>
      <tbody>
        ${safe
          .map(
            (entry) => `
              <tr>
                <td>${escapeHtml(entry.worker || '—')}</td>
                <td>${escapeHtml(fmtDateTime(entry.checkInAt))}</td>
                <td>${escapeHtml(entry.checkOutAt ? fmtDateTime(entry.checkOutAt) : 'Still on site')}</td>
              </tr>
            `
          )
          .join('')}
      </tbody>
    </table>
  `
}

function variationSummary(variations = []) {
  const safe = Array.isArray(variations) ? variations : []
  if (!safe.length) return '<div class="empty">No variations recorded against this job.</div>'
  const total = safe.reduce((sum, variation) => sum + (Number(variation.cost) || 0), 0)
  return `
    <table>
      <thead><tr><th>Date</th><th>Description</th><th>Status</th><th class="right">Value</th></tr></thead>
      <tbody>
        ${safe
          .map(
            (variation) => `
              <tr>
                <td>${escapeHtml(fmtDate(variation.date))}</td>
                <td>${escapeHtml(variation.description)}</td>
                <td><span class="status ${variation.status === 'approved' ? 'pass' : 'pending'}">${variation.status === 'approved' ? 'Approved' : 'Pending'}</span></td>
                <td class="right">${escapeHtml(money(variation.cost))}</td>
              </tr>
            `
          )
          .join('')}
        <tr class="total"><td colspan="3">Total logged variations</td><td class="right">${escapeHtml(money(total))}</td></tr>
      </tbody>
    </table>
  `
}

function holdPointSection(hp, index) {
  const checked = hp.items.filter((item) => item.checked).length
  return `
    <section class="holdpoint-report">
      <div class="holdpoint-head">
        <div>
          <div class="eyebrow">Hold point ${index + 1}</div>
          <h3>${escapeHtml(hp.title)}</h3>
          <p>${escapeHtml(hp.blurb || '')}</p>
        </div>
        <span class="status ${escapeHtml(hp.result || 'pending')}">${escapeHtml(resultLabel(hp.result))}</span>
      </div>
      <div class="signoff-grid">
        <div><strong>Signed by</strong><span>${escapeHtml(hp.signedBy || '—')}</span></div>
        <div><strong>Signed at</strong><span>${escapeHtml(fmtDateTime(hp.signedAt))}</span></div>
        <div><strong>Checklist</strong><span>${checked}/${hp.items.length} ticked</span></div>
      </div>
      <ul class="report-checklist">
        ${hp.items
          .map((item) => `<li class="${item.checked ? 'checked' : ''}"><span>${item.checked ? '✓' : '—'}</span>${escapeHtml(item.text)}</li>`)
          .join('')}
      </ul>
      ${hp.notes ? `<div class="notes"><strong>Notes</strong><p>${escapeHtml(hp.notes)}</p></div>` : ''}
      ${photoGrid(hp.photos)}
    </section>
  `
}

export function buildItpReportHtml(card) {
  const itp = Array.isArray(card.itp) ? card.itp : []
  const { signed, total } = itpProgress(itp)
  const issuedAt = new Date()
  const passCount = itp.filter((hp) => hp.result === 'pass').length
  const failCount = itp.filter((hp) => hp.result === 'fail').length
  const naCount = itp.filter((hp) => hp.result === 'na').length

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Prymd ITP Report — ${escapeHtml(card.title || 'Waterproofing Job')}</title>
  <style>
    @page { size: A4; margin: 14mm; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      color: #061B2D;
      background: #eef2f5;
      font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      line-height: 1.45;
    }
    .page {
      max-width: 980px;
      margin: 24px auto;
      background: #fff;
      box-shadow: 0 18px 50px rgba(6, 27, 45, 0.14);
    }
    .actions {
      position: sticky;
      top: 0;
      z-index: 5;
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      padding: 12px 18px;
      background: rgba(255,255,255,0.94);
      border-bottom: 1px solid #D7DFE6;
    }
    .actions button {
      border: 0;
      border-radius: 10px;
      padding: 10px 14px;
      font-weight: 700;
      background: #061B2D;
      color: #fff;
      cursor: pointer;
    }
    .actions button.secondary { background: #0EA5A8; }
    .cover {
      padding: 38px 42px 32px;
      color: #fff;
      background: radial-gradient(circle at 85% 10%, rgba(14,165,168,0.36), transparent 30%), linear-gradient(135deg, #061B2D 0%, #0f3149 100%);
    }
    .brand { display: flex; align-items: center; gap: 13px; margin-bottom: 42px; }
    .mark {
      width: 42px; height: 42px; border: 2px solid #fff; border-radius: 13px;
      display: grid; place-items: center; color: #fff; font-weight: 900;
      background: rgba(255,255,255,0.08);
    }
    .brand-title { font-size: 28px; font-weight: 800; letter-spacing: -0.04em; }
    .tagline { color: #BFEDEE; font-size: 12px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; }
    .cover h1 { margin: 0; font-size: 42px; line-height: 1; letter-spacing: -0.05em; max-width: 650px; }
    .cover h1 span { color: #7EE2E4; display: block; }
    .cover-meta { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-top: 28px; }
    .cover-card { border: 1px solid rgba(255,255,255,0.17); border-radius: 14px; padding: 12px; background: rgba(255,255,255,0.06); }
    .cover-card strong { display: block; color: #BFEDEE; font-size: 10px; text-transform: uppercase; letter-spacing: 0.09em; margin-bottom: 5px; }
    .cover-card span { font-weight: 700; font-size: 13px; }
    .content { padding: 30px 42px 42px; }
    .summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
    .metric { border: 1px solid #D7DFE6; border-radius: 14px; padding: 14px; background: #F8FAFC; }
    .metric span { color: #67768A; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; }
    .metric strong { display: block; margin-top: 6px; font-size: 26px; letter-spacing: -0.04em; }
    h2 { margin: 32px 0 12px; font-size: 20px; letter-spacing: -0.03em; }
    h3 { margin: 0; font-size: 17px; letter-spacing: -0.02em; }
    p { margin: 6px 0 0; color: #67768A; }
    .eyebrow { color: #0EA5A8; font-size: 10px; text-transform: uppercase; letter-spacing: 0.12em; font-weight: 800; margin-bottom: 4px; }
    .holdpoint-report { break-inside: avoid; border: 1px solid #D7DFE6; border-radius: 18px; padding: 18px; margin: 14px 0; }
    .holdpoint-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 14px; }
    .status { display: inline-flex; align-items: center; border-radius: 999px; padding: 5px 10px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; white-space: nowrap; }
    .status.pass { color: #1d6e49; background: #DCF2E8; }
    .status.fail { color: #9c2c3a; background: #FADFE3; }
    .status.na { color: #67768A; background: #E6EBEA; }
    .status.pending { color: #97701c; background: #FBF0DA; }
    .signoff-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin: 15px 0; }
    .signoff-grid div { border-radius: 12px; background: #F8FAFC; padding: 10px; border: 1px solid #E7EEF3; }
    .signoff-grid strong { display: block; color: #67768A; font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; }
    .signoff-grid span { font-weight: 700; font-size: 12px; }
    .report-checklist { list-style: none; padding: 0; margin: 0; display: grid; gap: 6px; }
    .report-checklist li { display: flex; gap: 8px; color: #465566; font-size: 13px; }
    .report-checklist li span { flex: 0 0 18px; color: #A7B4C0; font-weight: 900; }
    .report-checklist li.checked { color: #061B2D; }
    .report-checklist li.checked span { color: #2E9E6B; }
    .notes { margin: 13px 0; padding: 12px; background: #F8FAFC; border-radius: 12px; border: 1px solid #E7EEF3; }
    .notes strong { font-size: 11px; text-transform: uppercase; color: #67768A; letter-spacing: 0.08em; }
    .photos { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 14px; }
    figure { margin: 0; border: 1px solid #D7DFE6; border-radius: 14px; overflow: hidden; background: #F8FAFC; }
    figure img { width: 100%; height: 150px; object-fit: cover; display: block; }
    figcaption { padding: 7px 9px; font-size: 10.5px; color: #67768A; }
    .empty { color: #97A4B3; font-size: 13px; padding: 9px 0; }
    table { width: 100%; border-collapse: collapse; border: 1px solid #D7DFE6; border-radius: 14px; overflow: hidden; }
    th, td { padding: 10px 12px; border-bottom: 1px solid #E7EEF3; text-align: left; font-size: 12.5px; vertical-align: top; }
    th { background: #F8FAFC; color: #67768A; text-transform: uppercase; letter-spacing: 0.08em; font-size: 10.5px; }
    tr:last-child td { border-bottom: 0; }
    .right { text-align: right; }
    .total td { font-weight: 800; background: #F8FAFC; }
    .footer { margin-top: 34px; padding-top: 15px; border-top: 1px solid #D7DFE6; display: flex; justify-content: space-between; color: #67768A; font-size: 11px; }
    @media print {
      body { background: #fff; }
      .page { box-shadow: none; margin: 0; max-width: none; }
      .actions { display: none; }
      .cover { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
      .holdpoint-report { break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="actions">
      <button onclick="window.print()">Save / Print PDF</button>
      <button class="secondary" onclick="window.close()">Close</button>
    </div>
    <section class="cover">
      <div class="brand">
        <div class="mark">✓</div>
        <div>
          <div class="brand-title">Prymd</div>
          <div class="tagline">Prep. Prime. Prove.</div>
        </div>
      </div>
      <h1>Waterproofing ITP <span>completion report</span></h1>
      <div class="cover-meta">
        <div class="cover-card"><strong>Job</strong><span>${escapeHtml(card.title || 'Untitled job')}</span></div>
        <div class="cover-card"><strong>Client / Builder</strong><span>${escapeHtml(card.client || '—')}</span></div>
        <div class="cover-card"><strong>Area</strong><span>${escapeHtml(card.area || '—')}</span></div>
        <div class="cover-card"><strong>Issued</strong><span>${escapeHtml(fmtDateTime(issuedAt.toISOString()))}</span></div>
      </div>
    </section>

    <main class="content">
      <div class="summary">
        <div class="metric"><span>Hold points signed</span><strong>${signed}/${total}</strong></div>
        <div class="metric"><span>Passed</span><strong>${passCount}</strong></div>
        <div class="metric"><span>Failed</span><strong>${failCount}</strong></div>
        <div class="metric"><span>N/A</span><strong>${naCount}</strong></div>
      </div>

      <h2>Job details</h2>
      <table>
        <tbody>
          <tr><th>Assigned to</th><td>${escapeHtml(card.assignee || '—')}</td></tr>
          <tr><th>Scheduled date</th><td>${escapeHtml(fmtDate(card.scheduledDate))}</td></tr>
          <tr><th>Description</th><td>${escapeHtml(card.description || '—')}</td></tr>
        </tbody>
      </table>

      <h2>Site photos</h2>
      ${photoGrid(card.photos)}

      <h2>ITP hold points</h2>
      ${itp.map((hp, index) => holdPointSection(hp, index)).join('')}

      <h2>Referenced standards</h2>
      <table>
        <tbody>
          ${STANDARDS.map((s) => `<tr><th>${escapeHtml(s.code)}</th><td>${escapeHtml(s.title)}</td></tr>`).join('')}
        </tbody>
      </table>

      <h2>Variations register</h2>
      ${variationSummary(card.variations)}

      <h2>Time log</h2>
      ${timeSummary(card.timeLog)}

      <div class="footer">
        <span>Generated by Prymd — waterproofing ITPs, QA & variations.</span>
        <span>This report is a site record only. Confirm project-specific compliance requirements.</span>
      </div>
    </main>
  </div>
</body>
</html>`
}

export function openItpPdf(card, { autoPrint = false } = {}) {
  const { complete } = itpProgress(card.itp)
  if (!complete) {
    alert('Complete and sign every ITP hold point before exporting the PDF.')
    return
  }

  const win = window.open('', '_blank')
  if (!win) {
    alert('The PDF report was blocked by your browser. Allow pop-ups for Prymd, then try again.')
    return
  }

  win.document.open()
  win.document.write(buildItpReportHtml(card))
  win.document.close()
  win.focus()

  if (autoPrint) {
    setTimeout(() => win.print(), 450)
  }
}

export function issueItpToClient(card) {
  const { complete, signed, total } = itpProgress(card.itp)
  if (!complete) {
    alert('Complete and sign every ITP hold point before issuing to the client.')
    return
  }

  openItpPdf(card, { autoPrint: false })

  const subject = `Prymd ITP completion report — ${card.title || 'Waterproofing job'}`
  const body = [
    `Hi,`,
    '',
    `Please find the waterproofing ITP completion report for ${card.title || 'the waterproofing works'}.`,
    '',
    `Project / area: ${card.area || '—'}`,
    `Hold points signed: ${signed}/${total}`,
    `Result: ITP complete`,
    '',
    `I have opened the Prymd report in a separate tab so it can be saved as a PDF and attached to this email.`,
    '',
    `Regards,`,
  ].join('\n')

  const email = card.clientEmail || ''
  window.location.href = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
