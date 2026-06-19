import { createReadStream, existsSync, statSync } from 'node:fs'
import { extname, join, normalize, resolve } from 'node:path'
import { createServer } from 'node:http'

const port = Number(process.env.PORT) || 4173
const host = '0.0.0.0'
const root = resolve('dist')

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
}

function sendFile(res, filePath) {
  const ext = extname(filePath)
  res.writeHead(200, {
    'Content-Type': contentTypes[ext] || 'application/octet-stream',
    'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable',
  })
  createReadStream(filePath).pipe(res)
}

function safePath(urlPath) {
  const decodedPath = decodeURIComponent(urlPath.split('?')[0])
  const requested = normalize(decodedPath).replace(/^\.\.(\/|\\|$)/, '')
  return join(root, requested)
}

const server = createServer((req, res) => {
  try {
    const requestPath = req.url === '/' ? '/index.html' : req.url || '/index.html'
    let filePath = safePath(requestPath)

    if (!filePath.startsWith(root)) {
      res.writeHead(403)
      res.end('Forbidden')
      return
    }

    if (existsSync(filePath) && statSync(filePath).isFile()) {
      sendFile(res, filePath)
      return
    }

    // SPA fallback: let React handle client-side routes.
    filePath = join(root, 'index.html')
    if (existsSync(filePath)) {
      sendFile(res, filePath)
      return
    }

    res.writeHead(404)
    res.end('Build output not found. Run npm run build first.')
  } catch (err) {
    console.error(err)
    res.writeHead(500)
    res.end('Server error')
  }
})

server.listen(port, host, () => {
  console.log(`Prymd serving dist on http://${host}:${port}`)
})
