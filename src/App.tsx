import { useState } from 'react'
import { Lightbox, useReveal, type Lb, type OpenLb } from './lib'
import { Header, Hero, Ribbon, Work, Nava, Approach, Services, Studio, Contact, Footer } from './sections'

export default function App() {
  const [lb, setLb] = useState<Lb>(null)
  const open: OpenLb = (items, i) => setLb({ items, i })
  useReveal()
  return (
    <>
      <a className="skip" href="#work">Skip to content</a>
      <Header />
      <main>
        <Hero />
        <Ribbon />
        <Work open={open} />
        <Nava open={open} />
        <Approach />
        <Services />
        <Studio />
        <Contact />
      </main>
      <Footer />
      <Lightbox lb={lb} set={setLb} />
    </>
  )
}
