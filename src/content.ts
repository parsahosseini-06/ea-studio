import dims from './images.json'

export type Img = { name: string; src: string; w: number; h: number; widths: number[]; alt: string }

const d = dims as unknown as Record<string, [number, number, number[]]>
const img = (name: string, alt: string): Img => ({ name, src: `/images/${name}.jpg`, w: d[name][0], h: d[name][1], widths: d[name][2], alt })

// TODO(owner): phone, email and Instagram carried over from the Framer site; confirm they are real.
export const contact = {
  phone: { label: '+98 912 123 4567', href: 'tel:+989121234567' },
  whatsapp: { label: 'WhatsApp', href: 'https://wa.me/989121234567' },
  email: { label: 'hello@eastudio.com', href: 'mailto:hello@eastudio.com' },
  instagram: { label: '@eastudio.tehran', href: 'https://instagram.com/eastudio.tehran' },
}

export const nav = [
  { id: 'work', n: '01', label: 'Work' },
  { id: 'nava-house', n: '02', label: 'Nava House' },
  { id: 'approach', n: '03', label: 'Approach' },
  { id: 'studio', n: '04', label: 'Studio' },
]

export const hero = {
  eyebrow: 'EA STUDIO — Tehran',
  title: 'Architecture shaped through space, light & context',
  sub: 'Residential architecture, interiors & landscape.',
  image: img('hero', 'Contemporary white villa with a flat roof, a green wall and concrete steps across the lawn'),
}

export type Project = {
  id: string
  title: string
  meta: [string, string][]
  lead: Img
  gallery: Img[]
}

export const projects: Project[] = [
  {
    id: 'dezashib',
    title: 'Dezashib · Residential',
    meta: [
      ['Location', 'Dezashib, Tehran'],
      ['Years', '2023–2024'],
      ['Area', '130 m²'],
      ['Principal architect', 'Elias Arvand'],
      ['Design team', 'Mina Farrokhi, Darya Vaziri, Kasra Beheshti'],
    ],
    lead: img('dez-3', 'Double-height living space with a sunken seating area and a tall glazed wall'),
    gallery: [
      img('dez-3', 'Double-height living space with a sunken seating area and a tall glazed wall'),
      img('dez-1', 'Living room with a green sofa, a timber coffee table and plants against a timber wall'),
      img('dez-2', 'Street facade in black steel, timber and concrete with a planted wall'),
    ],
  },
]

// Three images repeated so one set of the looping strip is wider than the viewport.
export const ribbon = [0, 1, 2, 0, 1, 2].map((i) => ({ fig: projects[0].gallery[i], cap: 'Dezashib · 2023–2024' }))

export const nava = {
  title: 'Nava House',
  sub: 'Private residence · Niavaran, Tehran · 2026',
  intro:
    'A contemporary residence designed around light, privacy and a continuous connection between interior and garden.',
  spec: [
    ['Location', 'Niavaran, Tehran'],
    ['Year', '2026'],
    ['Type', 'Residential'],
    ['Site area', '310 m²'],
    ['Built area', '520 m²'],
    ['Status', 'Completed'],
  ] as [string, string][],
  steps: [
    {
      word: 'Solid',
      kicker: 'Context',
      heading: 'Responding to the city.',
      body: 'Located in a dense residential neighborhood in northern Tehran, the project is surrounded by neighboring buildings and limited street views. The design therefore turns inward, using the garden as an internal landscape and creating controlled openings toward the surrounding city.',
      fig: img('plan-site', 'Nava House site plan, drawing 01'),
    },
    {
      word: 'Threshold',
      kicker: 'Concept',
      heading: 'A house within a garden.',
      body: 'Nava House explores the relationship between private living and the open landscape. Rather than turning toward the street, the house is organized around a central garden that becomes the primary source of light, air and visual connection.',
      fig: img('plan-ground', 'Nava House ground floor plan arranged around a central garden, drawing 02'),
    },
    {
      word: 'Void',
      kicker: 'Concept',
      heading: 'A sequence of solid and void.',
      body: 'A compact outer volume protects the house from the surrounding urban environment, while a series of internal openings gradually reveals light, vegetation and sky. The spatial sequence moves from more enclosed spaces toward increasingly open areas.',
      fig: img('plan-section', 'Nava House section, drawing 03'),
    },
    {
      word: 'Garden',
      kicker: 'Material',
      heading: 'A restrained material palette.',
      body: 'Warm travertine, exposed concrete and natural oak. Dark metal elements are used selectively to frame openings and create contrast between the heavier architectural surfaces and the softer interior elements.',
      fig: img('plan-axon', 'Nava House exploded axonometric, drawing 04'),
    },
  ],
}

export const approach = {
  intro: 'Every project begins with understanding its context, and ends with a material language that carries the idea.',
  items: [
    {
      n: '01',
      title: 'Context',
      sub: 'Understanding the place',
      body: 'We study the site, its surroundings, climate, orientation and the way people experience the space.',
      fig: img('site-analysis', 'Site analysis diagram: existing plants, topography, access, wind, sun and noise'),
    },
    {
      n: '02',
      title: 'Concept',
      sub: 'Turning context into an idea',
      body: 'The concept transforms observations into a clear architectural direction. We explore spatial relationships, proportions, light and movement to create an idea that gives the project its identity and purpose.',
      fig: img('massing', 'Massing study diagrams'),
    },
    {
      n: '03',
      title: 'Material',
      sub: 'Giving the idea a physical language',
      body: 'Materiality brings the concept into the physical world. We consider texture, color, light and construction to create a palette that supports the atmosphere and character of the space.',
      swatches: [
        img('mat-concrete', 'Concrete sample'),
        img('mat-timber', 'Timber sample'),
        img('mat-marble', 'Green marble sample'),
        img('mat-metal', 'Metal sample'),
      ],
      swatchNames: ['Concrete', 'Timber', 'Marble', 'Metal'],
    },
  ],
  sketchTitle: 'From sketch to building',
  sketches: [
    { fig: img('sketch-1', 'Pencil line study of a stacked concrete and timber volume'), cap: 'Line study' },
    { fig: img('sketch-2', 'Ink and wash perspective of the same volume on a city street'), cap: 'Ink & wash' },
    { fig: img('sketch-3', 'Watercolor perspective of the volume at dusk'), cap: 'Watercolor' },
    { fig: img('sketch-4', 'Rendered watercolor of the finished volume with planting'), cap: 'Rendered' },
  ],
}

export const services = [
  { name: 'Architecture', body: 'Spatial concepts, design & development.' },
  { name: 'Interior design', body: 'Material, light & spatial experience.' },
  { name: 'Landscape', body: 'Architecture and natural environment.' },
  { name: 'Development', body: 'From concept to construction.' },
]

export const studio = {
  portrait: img('portrait', 'Portrait of Elias Arvand, founder and principal architect'),
  name: 'Elias Arvand',
  role: 'Founder & Principal Architect',
  bio: 'We believe architecture is not simply about creating objects, but about shaping the way people experience space. Our work explores the relationship between light, material, proportion and context to create spaces that feel both intentional and timeless.',
  manifesto: 'We design spaces where architecture, material and human experience come together.',
  values: [
    ['Simplicity', 'Removing the unnecessary to reveal what matters.'],
    ['Materiality', 'Using materials with honesty, texture and purpose.'],
    ['Light & space', 'Creating atmosphere through proportion, light and movement.'],
  ],
  stats: [
    ['12+', 'Selected projects'],
    ['8', 'Years of experience'],
    ['3', 'Core disciplines'],
  ],
}

export const cta = {
  title: 'Let’s create something meaningful.',
  body: 'Tell us about your site, your family and your timeline. We reply personally.',
}
