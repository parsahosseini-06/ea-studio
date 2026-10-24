// Regenerates responsive AVIF/WebP variants and src/images.json from public/images/*.jpg.
// Usage: npm run images   (re-run after adding or replacing a JPG; the JPG stays as the fallback and lightbox source)
import { readdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const dir = fileURLToPath(new URL('../public/images/', import.meta.url))
const ladder = [480, 800, 1200, 1800]
const manifest = {}

for (const file of (await readdir(dir)).filter((f) => f.endsWith('.jpg')).sort()) {
  const name = file.slice(0, -4)
  const { width, height } = await sharp(dir + file).metadata()
  const widths = [...ladder.filter((w) => w < width), width]
  for (const w of widths) {
    const img = sharp(dir + file).resize({ width: w })
    await img.clone().avif({ quality: 50, effort: 4 }).toFile(`${dir}${name}-${w}.avif`)
    await img.clone().webp({ quality: 75 }).toFile(`${dir}${name}-${w}.webp`)
  }
  manifest[name] = [width, height, widths]
}

await writeFile(fileURLToPath(new URL('../src/images.json', import.meta.url)), JSON.stringify(manifest))
console.log(`${Object.keys(manifest).length} images processed`)
