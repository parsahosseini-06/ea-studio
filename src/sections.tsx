import { useEffect, useRef, useState } from 'react'
import { approach, contact, cta, hero, nav, nava, projects, ribbon, services, studio } from './content'
import { Fill, Pic, Roll, st, useActiveSection, type OpenLb } from './lib'

const navIds = nav.map((n) => n.id)

function SectionHead({ n, title, aside }: { n?: string; title: string; aside?: string }) {
  return (
    <div className="shead rv">
      <h2>
        {n && <span className="num">{n}</span>}
        {title}
      </h2>
      {aside && <p className="lead">{aside}</p>}
    </div>
  )
}

export function Header() {
  const [solid, setSolid] = useState(false)
  const [hide, setHide] = useState(false)
  const [pill, setPill] = useState(false)
  const menu = useRef<HTMLDialogElement>(null)
  const active = useActiveSection(navIds)

  useEffect(() => {
    let last = scrollY
    const onScroll = () => {
      const y = scrollY
      setSolid(y > 80)
      setHide(y > 320 && y > last)
      const c = document.getElementById('contact')
      setPill(y > innerHeight * 0.8 && (!c || c.getBoundingClientRect().top > innerHeight))
      last = y
    }
    onScroll()
    addEventListener('scroll', onScroll, { passive: true })
    return () => removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header className={`header${solid ? ' solid' : ''}${hide ? ' hide' : ''}`}>
        <div className="wrap header-in">
          <a className="wordmark" href="#top" aria-label="EA STUDIO, back to top">EA STUDIO</a>
          <nav className="nav" aria-label="Primary">
            {nav.map((n) => (
              <a key={n.id} href={`#${n.id}`} aria-current={active === n.id ? 'true' : undefined}>
                {n.label}
              </a>
            ))}
          </nav>
          <a className="btn header-cta" href="#contact"><Roll text="Start a project" /></a>
          <button className="tool menu-btn" aria-haspopup="dialog" onClick={() => menu.current?.showModal()}>
            Menu
          </button>
        </div>
      </header>

      <dialog ref={menu} className="menu dark" aria-label="Menu" onClick={(e) => e.target === menu.current && menu.current?.close()}>
        <div className="wrap menu-in">
          <div className="menu-top">
            <span className="wordmark">EA STUDIO</span>
            <button className="tool" onClick={() => menu.current?.close()}>Close</button>
          </div>
          <nav aria-label="Menu">
            {nav.map((n) => (
              <a key={n.id} href={`#${n.id}`} onClick={() => menu.current?.close()}>
                {n.label}
              </a>
            ))}
          </nav>
          <ul className="menu-contact">
            <li><a href={contact.phone.href}>Call {contact.phone.label}</a></li>
            <li><a href={contact.whatsapp.href}>WhatsApp</a></li>
            <li><a href={contact.email.href}>{contact.email.label}</a></li>
            <li><a href={contact.instagram.href}>Instagram {contact.instagram.label}</a></li>
          </ul>
        </div>
      </dialog>

      <a className={`pill btn${pill ? ' show' : ''}`} href="#contact" tabIndex={pill ? 0 : -1}><Roll text="Contact" /></a>
    </>
  )
}

export function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-copy">
        <p className="label rise" style={st(0)}>{hero.eyebrow}</p>
        <h1 className="rise" style={st(1)}>{hero.title}</h1>
        <p className="lead rise" style={st(2)}>{hero.sub}</p>
        <p className="hero-cta rise" style={st(3)}>
          <a className="btn" href="#work"><Roll text="View selected work" /></a>
          <a className="textlink" href="#contact">Start a project</a>
        </p>
      </div>
      <figure className="hero-img">
        <Pic img={hero.image} eager high sizes="(min-width: 1024px) 58vw, 100vw" />
      </figure>
    </section>
  )
}

export function Ribbon() {
  return (
    <section className="ribbon" aria-label="Selected images">
      <div className="ribbon-track">
        {[0, 1].map((copy) => (
          <ul className="ribbon-set" key={copy} aria-hidden={copy === 1 ? true : undefined}>
            {ribbon.map((r, i) => (
              <li key={i}>
                <Pic img={copy === 1 ? { ...r.fig, alt: '' } : r.fig} sizes="(min-width: 1024px) 400px, 300px" />
                <span className="label">{r.cap}</span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  )
}

export function Work({ open }: { open: OpenLb }) {
  return (
    <section className="section" id="work">
      <div className="wrap">
        <SectionHead n="01" title="Selected work" aside="Houses and interiors shaped around light, privacy and the way a family lives." />
        {projects.map((p) => (
          <article className="project" key={p.id}>
            <button className="project-fig rf" onClick={() => open(p.gallery, 0)} aria-label={`Open ${p.title} gallery`}>
              <Pic img={p.lead} eager sizes="(min-width: 1024px) 50vw, 100vw" />
            </button>
            <div className="project-info rv">
              <h3>{p.title}</h3>
              <dl className="tb">
                {p.meta.map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
              <button className="textlink" onClick={() => open(p.gallery, 0)}>
                View gallery · {p.gallery.length} images
              </button>
            </div>
            <ul className="collage">
              {p.gallery.slice(1).map((g, i) => (
                <li key={g.src} className={`rf c${i + 1}`}>
                  <button onClick={() => open(p.gallery, i + 1)} aria-label={`Open image ${i + 2} of ${p.title}`}>
                    <Pic img={g} eager sizes="(min-width: 1024px) 25vw, 50vw" />
                  </button>
                  <span className="label">Fig. 0{i + 2} — {p.title.split(' · ')[0]}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}

export function Nava({ open }: { open: OpenLb }) {
  const [active, setActive] = useState(0)
  const steps = useRef<(HTMLElement | null)[]>([])
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(Number((e.target as HTMLElement).dataset.i))),
      { rootMargin: '-45% 0px -45% 0px' },
    )
    steps.current.forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [])
  const figs = nava.steps.map((s) => s.fig)

  return (
    <section className="section dark nava" id="nava-house">
      <div className="wrap">
        <SectionHead n="02" title="Featured project" />
        <div className="nava-head rv">
          <h3>{nava.title}</h3>
          <p className="label">{nava.sub}</p>
          <p className="lead">{nava.intro}</p>
          <dl className="tb tb--grid">
            {nava.spec.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="story">
          <div className="steps">
            {nava.steps.map((s, i) => (
              <article key={s.word} className="step" data-i={i} ref={(el) => { steps.current[i] = el }}>
                <p className="label"><span className="num">0{i + 1}</span> {s.word} · {s.kicker}</p>
                <h4>{s.heading}</h4>
                <p>{s.body}</p>
                <button className="step-fig" onClick={() => open(figs, i)} aria-label={`Enlarge drawing ${i + 1}`}>
                  <Pic img={s.fig} sizes="100vw" />
                </button>
              </article>
            ))}
          </div>
          <div className="stage" aria-label="Drawings of Nava House">
            <ol className="stage-words">
              {nava.steps.map((s, i) => (
                <li key={s.word} className={i <= active ? 'on' : ''}>{s.word}</li>
              ))}
            </ol>
            <div className="stage-figs">
              {nava.steps.map((s, i) => (
                <button
                  key={s.word}
                  className={`stage-fig${i <= active ? ' on' : ''}`}
                  style={{ zIndex: i }}
                  onClick={() => open(figs, i)}
                  tabIndex={i === active ? 0 : -1}
                  aria-hidden={i !== active}
                  aria-label={`Enlarge drawing ${i + 1}`}
                >
                  <Pic img={s.fig} eager sizes="50vw" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="nava-end rv">
          <a className="textlink" href="#contact">Discuss a similar house</a>
        </p>
      </div>
    </section>
  )
}

export function Approach() {
  return (
    <section className="section" id="approach">
      <div className="wrap approach">
        <div className="approach-side">
          <SectionHead n="03" title="Our approach" aside={approach.intro} />
        </div>
        <div className="approach-items">
          {approach.items.map((it) => (
            <article className="a-item" key={it.n}>
              <p className="label rv"><span className="num">{it.n}</span> {it.title}</p>
              <h3 className="rv">{it.sub}</h3>
              <p className="rv">{it.body}</p>
              {'fig' in it && it.fig && (
                <figure className="rf"><Pic img={it.fig} eager sizes="(min-width: 1024px) 50vw, 100vw" /></figure>
              )}
              {'swatches' in it && it.swatches && (
                <ul className="swatches">
                  {it.swatches.map((s, i) => (
                    <li className="rf" key={s.src}>
                      <Pic img={s} eager sizes="(min-width: 1024px) 24vw, 50vw" />
                      <span className="label">{it.swatchNames?.[i]}</span>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      </div>

      <SketchStack />
    </section>
  )
}

function SketchStack() {
  const [i, setI] = useState(0)
  const n = approach.sketches.length
  return (
    <div className="wrap sketches">
      <h3 className="rv">{approach.sketchTitle}</h3>
      <div className="sk">
        <div
          className="sk-stack"
          onPointerMove={(e) => {
            if (e.pointerType !== 'mouse') return
            const r = e.currentTarget.getBoundingClientRect()
            setI(Math.min(n - 1, Math.max(0, Math.floor(((e.clientX - r.left) / r.width) * n))))
          }}
          onClick={() => setI((i + 1) % n)}
        >
          {approach.sketches.map((s, k) => (
            <Pic key={s.cap} img={s.fig} eager className={k <= i ? 'on' : ''} sizes="(min-width: 1024px) 40vw, 90vw" />
          ))}
          {approach.sketches.slice(1).map((s, k) => (
            <span key={s.cap} className="sk-line" style={{ left: `${((k + 1) / n) * 100}%` }} aria-hidden="true" />
          ))}
        </div>
        <div className="sk-side">
          <ol className="sk-list">
            {approach.sketches.map((s, k) => (
              <li key={s.cap}>
                <button aria-pressed={k === i} onClick={() => setI(k)} onMouseEnter={() => setI(k)} onFocus={() => setI(k)}>
                  <span className="num">0{k + 1}</span> {s.cap}
                </button>
              </li>
            ))}
          </ol>
          <p className="label sk-hint">Move across the image, or tap, to develop the sketch.</p>
        </div>
      </div>
    </div>
  )
}

export function Services() {
  return (
    <section className="section services" aria-labelledby="services-h">
      <div className="wrap">
        <div className="shead rv">
          <h2 id="services-h">Services</h2>
        </div>
        <ul className="svc">
          {services.map((s) => (
            <li key={s.name} className="rv">
              <h3>/ {s.name}</h3>
              <p>{s.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function Studio() {
  return (
    <section className="section" id="studio">
      <div className="wrap studio">
        <figure className="studio-portrait rf">
          <Pic img={studio.portrait} eager sizes="(min-width: 1024px) 40vw, 100vw" />
        </figure>
        <div className="studio-copy">
          <SectionHead n="04" title="Studio" />
          <p className="label rv">{studio.name} — {studio.role}</p>
          <p className="lead rv">{studio.bio}</p>
          <Fill text={studio.manifesto} />
          <dl className="values">
            {studio.values.map(([k, v], i) => (
              <div className="rv" key={k}>
                <dt><span className="num">0{i + 1}</span> {k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <div className="wrap">
        <dl className="stats">
          {studio.stats.map(([n, l]) => (
            <div className="rv" key={l}>
              <dt>{l}</dt>
              <dd>{n}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

export function Contact() {
  return (
    <section className="section dark contact" id="contact">
      <div className="wrap contact-in">
        <div>
          <h2 className="rv">{cta.title}</h2>
          <p className="lead rv">{cta.body}</p>
        </div>
        <ul className="actions rv">
          <li><a className="btn" href={contact.phone.href}><Roll text={`Call ${contact.phone.label}`} /></a></li>
          <li><a href={contact.whatsapp.href}><span>WhatsApp</span> Message us</a></li>
          <li><a href={contact.email.href}><span>Email</span> {contact.email.label}</a></li>
          <li><a href={contact.instagram.href}><span>Instagram</span> {contact.instagram.label}</a></li>
        </ul>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="footer dark">
      <div className="wrap">
        <div className="footer-grid">
          <p>EA STUDIO<br />Residential architecture, interiors & landscape. Tehran.</p>
          <nav aria-label="Footer">
            {nav.map((n) => (
              <a key={n.id} href={`#${n.id}`}>{n.label}</a>
            ))}
          </nav>
          <p>
            <a href={contact.email.href}>{contact.email.label}</a>
            <br />
            <a href={contact.phone.href}>{contact.phone.label}</a>
          </p>
        </div>
        <p className="footer-mark" aria-hidden="true">EA STUDIO</p>
        <p className="label">© 2026 EA STUDIO. All rights reserved.</p>
      </div>
    </footer>
  )
}
