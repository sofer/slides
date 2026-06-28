// Builds every deck listed in decks.json into dist/<slug>/ then writes a
// landing page at dist/index.html linking to them.
//
// Each deck is a self-contained Reveal.js HTML file. The build copies the
// HTML as index.html, copies style.css, and copies all ./assets/... files
// referenced by the HTML and the CSS into dist/<slug>/.
//
// Served at https://sofer.github.io/slides/ ; each deck at /slides/<slug>/.
// Reveal.js uses hash routing (#/2, #/3 …) so no SPA fallback is needed —
// GitHub Pages serves index.html for the slug root and the hash is handled
// client-side.
import { readFileSync, writeFileSync, copyFileSync, mkdirSync, rmSync } from 'node:fs'
import { dirname, join } from 'node:path'

const SITE_BASE = '/slides'
const decks = JSON.parse(readFileSync(new URL('./decks.json', import.meta.url)))
const repoDir = dirname(new URL(import.meta.url).pathname)

const assetRe = /\.\/(assets\/[^"')\s]+)/g

function collectAssets(text) {
  const refs = new Set()
  for (const m of text.matchAll(assetRe)) refs.add(m[1])
  return refs
}

function copyInto(rel, destDir) {
  const from = join(repoDir, rel)
  const to = join(destDir, rel)
  try {
    mkdirSync(dirname(to), { recursive: true })
    copyFileSync(from, to)
  } catch {
    console.warn(`  missing asset, skipped: ${rel}`)
  }
}

rmSync('dist', { recursive: true, force: true })

for (const deck of decks) {
  const destDir = join(repoDir, `dist/${deck.slug}`)
  mkdirSync(destDir, { recursive: true })
  console.log(`\n=== building ${deck.slug} ===`)

  const deckText = readFileSync(join(repoDir, deck.file), 'utf8')
  writeFileSync(join(destDir, 'index.html'), deckText)
  console.log(`  copied ${deck.file} → dist/${deck.slug}/index.html`)

  const styleText = readFileSync(join(repoDir, 'style.css'), 'utf8')
  writeFileSync(join(destDir, 'style.css'), styleText)
  console.log(`  copied style.css`)

  const refs = new Set([...collectAssets(deckText), ...collectAssets(styleText)])
  let copied = 0
  for (const rel of [...refs].sort()) {
    copyInto(rel, destDir)
    copied++
  }
  console.log(`  assets: ${copied} file(s)`)
}

const cards = decks
  .map(
    (d) => `      <li>
        <a href="${SITE_BASE}/${d.slug}/">${escapeHtml(d.title)}</a>
        <p>${escapeHtml(d.description ?? '')}</p>
      </li>`,
  )
  .join('\n')

const index = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Founders and Coders slides</title>
    <style>
      :root { color-scheme: light dark; }
      body {
        font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
        max-width: 48rem; margin: 4rem auto; padding: 0 1.5rem; line-height: 1.5;
      }
      h1 { font-size: 1.5rem; }
      ul { list-style: none; padding: 0; }
      li { padding: 1rem 0; border-top: 1px solid #d1d9e0; }
      a { font-size: 1.125rem; font-weight: 600; text-decoration: none; }
      a:hover { text-decoration: underline; }
      p { margin: 0.25rem 0 0; color: #59636e; }
    </style>
  </head>
  <body>
    <h1>Founders and Coders slides</h1>
    <ul>
${cards}
    </ul>
  </body>
</html>
`

writeFileSync('dist/index.html', index)
console.log(`\nWrote dist/index.html with ${decks.length} deck(s).`)

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]),
  )
}
