import { useRef, useState } from 'react'
import { uid } from '../lib/id.js'
import { CameraIcon, TrashIcon } from './Icons.jsx'

// Reads a File into a downscaled JPEG data URL so localStorage doesn't fill
// up after a handful of photos. Max edge ~1280px, quality 0.7.
function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type?.startsWith('image/')) {
      reject(new Error('Selected file is not an image.'))
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        const max = 1280
        let { width, height } = img
        if (!width || !height) {
          reject(new Error('Image dimensions could not be read.'))
          return
        }

        if (width > max || height > max) {
          const scale = max / Math.max(width, height)
          width = Math.round(width * scale)
          height = Math.round(height * scale)
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Canvas is not available in this browser.'))
          return
        }

        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', 0.7))
      }
      img.onerror = () => reject(new Error('Image failed to load.'))
      img.src = reader.result
    }
    reader.onerror = () => reject(new Error('Photo failed to read.'))
    reader.readAsDataURL(file)
  })
}

export default function PhotoStrip({ photos = [], onChange, label = 'Add photo' }) {
  const inputRef = useRef(null)
  const [viewer, setViewer] = useState(null)
  const [busy, setBusy] = useState(false)
  const safePhotos = Array.isArray(photos) ? photos : []

  async function handleFiles(e) {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setBusy(true)
    try {
      const added = []
      for (const file of files) {
        const dataUrl = await fileToDataUrl(file)
        added.push({ id: uid('ph'), dataUrl, ts: new Date().toISOString() })
      }
      onChange([...safePhotos, ...added])
    } catch (err) {
      console.error('Photo failed to load', err)
      alert("That photo couldn't be read. Try another image.")
    } finally {
      setBusy(false)
      e.target.value = '' // allow re-selecting the same file
    }
  }

  function remove(id) {
    onChange(safePhotos.filter((p) => p.id !== id))
  }

  return (
    <div className="photostrip">
      <div className="photostrip__row">
        {safePhotos.map((p) => (
          <div key={p.id} className="thumb">
            <img src={p.dataUrl} alt="" onClick={() => setViewer(p)} />
            <button
              className="thumb__del"
              onClick={() => remove(p.id)}
              aria-label="Remove photo"
            >
              <TrashIcon />
            </button>
          </div>
        ))}
        <button
          className="thumb thumb--add"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          type="button"
        >
          <CameraIcon />
          <span>{busy ? 'Adding…' : label}</span>
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        hidden
        onChange={handleFiles}
      />

      {viewer && (
        <div className="lightbox" onClick={() => setViewer(null)}>
          <img src={viewer.dataUrl} alt="" />
          <div className="lightbox__meta">
            {new Date(viewer.ts).toLocaleString()}
          </div>
        </div>
      )}
    </div>
  )
}
