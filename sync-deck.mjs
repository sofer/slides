// Sync one deck from the private brain repo into this public repo, copying the
// deck file, style.css, and only the assets that deck (and style.css) reference.
// Then ensure the deck is registered in decks.json.
//
// Usage:
//   node sync-deck.mjs <path-to-deck.slides.md-in-brain> [slug]
//
// Example:
//   node sync-deck.mjs ~/code/brain/slides/perceptrons.slides.md perceptrons
//
// Source of truth is brain; this repo is the publish target. After syncing,
// run `pnpm run build` to verify, then commit and push (CI deploys to Pages).
import { readFileSync, writeFileSync, copyFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, resolve, basename, join } from 'node:path'
import { homedir } from 'node:os'

const expand = (p) => (p.startsWith('~') ? join(homedir(), p.slice(1)) : p)
const [, , rawSrc, rawSlug] = process.argv
if (!rawSrc) {
  console.error('usage: node sync-deck.mjs <brain-deck.slides.md> [slug]')
  process.exit(1)
}

const srcDeck = resolve(expand(rawSrc))
if (!existsSync(srcDeck)) {
  console.error(`deck not found: ${srcDeck}`)
  process.exit(1)
}
const srcDir = dirname(srcDeck)
const repoDir = dirname(new URL(import.meta.url).pathname)
const deckFile = basename(srcDeck)
const slug = rawSlug || deckFile.replace(/\.slides\.md$/, '').replace(/\.md$/, '')

const deckText = readFileSync(srcDeck, 'utf8')

// Warn if the deck lacks hash routing (needed for Pages navigation).
if (!/^\s*routerMode:\s*hash\s*$/m.test(deckText)) {
  console.warn(
    `WARNING: ${deckFile} has no "routerMode: hash" in its headmatter; ` +
      `navigation links may 404 on GitHub Pages.`,
  )
}

// Collect ./assets/... references from the deck, plus url(./assets/...) from any
// style.css it imports.
const refs = new Set()
const assetRe = /\.\/(assets\/[^"')\s]+)/g
for (const m of deckText.matchAll(assetRe)) refs.add(m[1])

const importsStyle = /@import\s+["']\.\/style\.css["']/.test(deckText)
if (importsStyle) {
  const srcStyle = join(srcDir, 'style.css')
  if (existsSync(srcStyle)) {
    const css = readFileSync(srcStyle, 'utf8')
    for (const m of css.matchAll(assetRe)) refs.add(m[1])
  }
}

// Copy deck + style.css + referenced assets, preserving relative paths.
function copyInto(relPath) {
  const from = join(srcDir, relPath)
  const to = join(repoDir, relPath)
  if (!existsSync(from)) {
    console.warn(`  missing source asset, skipped: ${relPath}`)
    return false
  }
  mkdirSync(dirname(to), { recursive: true })
  copyFileSync(from, to)
  return true
}

copyFileSync(srcDeck, join(repoDir, deckFile))
console.log(`deck   ${deckFile}`)
if (importsStyle && existsSync(join(srcDir, 'style.css'))) {
  copyFileSync(join(srcDir, 'style.css'), join(repoDir, 'style.css'))
  console.log('style  style.css')
}
let copied = 0
for (const rel of [...refs].sort()) if (copyInto(rel)) copied++
console.log(`assets ${copied} file(s) copied`)

// Register the deck in decks.json (title from headmatter if present).
const decksPath = join(repoDir, 'decks.json')
const decks = existsSync(decksPath) ? JSON.parse(readFileSync(decksPath, 'utf8')) : []
const titleMatch = deckText.match(/^title:\s*["']?(.+?)["']?\s*$/m)
const title = titleMatch ? titleMatch[1] : slug
const entry = { slug, file: deckFile, title }
const idx = decks.findIndex((d) => d.slug === slug)
if (idx >= 0) decks[idx] = { ...decks[idx], ...entry }
else decks.push(entry)
writeFileSync(decksPath, JSON.stringify(decks, null, 2) + '\n')
console.log(`decks.json: ${idx >= 0 ? 'updated' : 'added'} "${slug}"`)
console.log('\nNext: pnpm run build  (verify)  then commit & push to deploy.')
