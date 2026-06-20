// Builds every deck listed in decks.json into dist/<slug>/ (each with its own
// base path so assets resolve under GitHub Pages), then writes a landing page
// at dist/index.html linking to them.
//
// Served at https://sofer.github.io/slides/ ; each deck at /slides/<slug>/.
import { execSync } from 'node:child_process'
import { readFileSync, writeFileSync, rmSync } from 'node:fs'

const SITE_BASE = '/slides'
const decks = JSON.parse(readFileSync(new URL('./decks.json', import.meta.url)))

// Number of leading path segments that form a deck's base, e.g. /slides/<slug>/
// is 2. GitHub Pages serves only the site-root 404.html for unknown paths, so a
// deep link like /slides/<slug>/3 or /slides/<slug>/presenter/1 would otherwise
// hit GitHub's generic 404. The pair of snippets below (rafgraph's
// spa-github-pages technique) redirects such a path to the deck's index with the
// route encoded in the query, then restores it client-side before the router
// boots, so history-mode deep links and refreshes recover.
const SEGMENTS_TO_KEEP = SITE_BASE.split('/').filter(Boolean).length + 1

rmSync('dist', { recursive: true, force: true })

for (const deck of decks) {
  const base = `${SITE_BASE}/${deck.slug}/`
  console.log(`\n=== building ${deck.slug} (base ${base}) ===`)
  execSync(
    `pnpm exec slidev build ${deck.file} --base ${base} --out dist/${deck.slug}`,
    { stdio: 'inherit' },
  )
  injectSpaRestore(`dist/${deck.slug}/index.html`)
}

// Root 404.html: GitHub serves this for any unknown path under the site.
writeFileSync('dist/404.html', `<!doctype html>
<html><head><meta charset="utf-8"><title>Redirecting…</title><script>
  // Encode /slides/<slug>/<route> as /slides/<slug>/?/<route> and redirect, so
  // the deck SPA (served at /slides/<slug>/) can restore the route on load.
  var segmentsToKeep = ${SEGMENTS_TO_KEEP}, l = location
  l.replace(
    l.protocol + '//' + l.host +
    l.pathname.split('/').slice(0, 1 + segmentsToKeep).join('/') + '/?/' +
    l.pathname.split('/').slice(1 + segmentsToKeep).join('/').replace(/&/g, '~and~') +
    (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') + l.hash
  )
</script></head><body></body></html>
`)

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

// Insert a synchronous script at the top of <head> that turns the
// /?/<route> query (set by the root 404.html) back into a real path via
// replaceState, before Slidev's router reads location.
function injectSpaRestore(htmlPath) {
  const restore = `<script>
  (function () {
    var l = location
    if (l.search[1] === '/') {
      var decoded = l.search.slice(1).split('&').map(function (s) {
        return s.replace(/~and~/g, '&')
      }).join('?')
      history.replaceState(null, null, l.pathname.slice(0, -1) + decoded + l.hash)
    }
  })()
</script>`
  const html = readFileSync(htmlPath, 'utf8')
  writeFileSync(htmlPath, html.replace('<head>', `<head>${restore}`))
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]),
  )
}
