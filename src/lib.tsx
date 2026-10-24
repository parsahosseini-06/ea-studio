import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { animate, stagger } from 'animejs'
import type { Img } from './content'

export const st = (i: number) => ({ '--i': i }) as CSSProperties

const srcSet = (img: Img, ext: string) => img.widths.map((w) => `/images/${img.name}-${w}.${ext} ${w}w`).join(', ')

/** `eager`: load now. Needed for images hidden by a clip-path reveal (.rf, sketches, stage): lazy loading treats a fully clipped image as off-screen and only fetches it after the reveal starts. `high`: fetch priority, hero only. */
export const Pic = ({ img, className, sizes, eager, high }: { img: Img; className?: string; sizes?: string; eager?: boolean; high?: boolean }) => (
  <picture>
    <source type="image/avif" srcSet={srcSet(img, 'avif')} sizes={sizes} />
    <source type="image/webp" srcSet={srcSet(img, 'webp')} sizes={sizes} />
    <img
      src={img.src}
      width={img.w}
      height={img.h}
      alt={img.alt}
      className={className}
      loading={eager ? 'eager' : 'lazy'}
      fetchPriority={high ? 'high' : undefined}
      decoding="async"
    />
  </picture>
)

/** Button label: letters roll up one after another on hover/focus; the copy rolling in is identical, so it reads as one smooth wave. */
export const Roll = ({ text }: { text: string }) => {
  let i = 0
  return (
    <>
      <span className="sr-only">{text}</span>
      <span className="roll" aria-hidden="true">
        {text.split(' ').map((word, w) => (
          <span key={w}>
            {w > 0 && ' '}
            <span className="rw">
              {[...word].map((c) => (
                <span key={i} className="rl" style={st(i++)}>
                  <span>{c}</span>
                  <span>{c}</span>
                </span>
              ))}
            </span>
          </span>
        ))}
      </span>
    </>
  )
}

/** Id of the section currently crossing the middle of the viewport. */
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState('')
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-40% 0px -55% 0px' },
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [ids])
  return active
}

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Lenis smooth scroll. In-page links are handled here, not by Lenis' `anchors` option: that option leaves the browser's own jump running,
 * the two fight and Lenis stays stuck "scrolling" (Home/End and scrollbar drags are then ignored until the next wheel event).
 * Here the browser jump is cancelled and the page scrolls to a whole-pixel target below the fixed header over a fixed duration, so it always finishes.
 * Lenis itself drops smoothing for reduced motion. Dialogs opt out with data-lenis-prevent.
 */
export function useSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({ autoRaf: true })
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element).closest?.('a[href^="#"]') as HTMLAnchorElement | null
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const el = document.getElementById(decodeURIComponent(a.hash.slice(1)))
      if (!el) return
      e.preventDefault()
      const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0
      lenis.scrollTo(Math.max(0, Math.round(el.getBoundingClientRect().top + lenis.scroll - margin)), { duration: 1.2 })
      history.pushState(null, '', a.hash)
    }
    document.addEventListener('click', onClick)
    return () => {
      document.removeEventListener('click', onClick)
      lenis.destroy()
    }
  }, [])
}

/**
 * anime.js scroll reveals: .rv blocks rise and fade in, .rf images wipe open from the top.
 * Targets are hidden inline before first paint (no flash) and unhidden for reduced motion or when JS is off.
 */
export function useReveal() {
  useLayoutEffect(() => {
    if (reduced()) return
    const els = [...document.querySelectorAll<HTMLElement>('.rv, .rf')]
    const isImg = (el: HTMLElement) => el.classList.contains('rf')
    const target = (el: HTMLElement) => (isImg(el) ? el.querySelector<HTMLElement>('img')! : el)
    els.forEach((el) => {
      const t = target(el)
      if (isImg(el)) t.style.clipPath = 'inset(0 0 100% 0)'
      else Object.assign(t.style, { opacity: '0', transform: 'translateY(20px)' })
    })
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (!e.isIntersecting) return
          io.unobserve(e.target)
          const el = e.target as HTMLElement
          const t = target(el)
          const done = () => ['clip-path', 'opacity', 'transform'].forEach((k) => t.style.removeProperty(k))
          animate(
            t,
            isImg(el)
              ? { clipPath: ['inset(0 0 100% 0)', 'inset(0 0 0% 0)'], duration: 700, ease: 'outExpo', onComplete: done }
              : { opacity: [0, 1], translateY: [20, 0], duration: 700, ease: 'outExpo', onComplete: done },
          )
        }),
      { threshold: 0, rootMargin: '0px 0px 5% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

/** Hero entrance: copy rises in one line after another while the image wipes open from the right. */
export function useHeroIntro() {
  useLayoutEffect(() => {
    if (reduced()) return
    const copy = [...document.querySelectorAll<HTMLElement>('.hero .rise')]
    const fig = document.querySelector<HTMLElement>('.hero-img')!
    copy.forEach((el) => Object.assign(el.style, { opacity: '0', transform: 'translateY(16px)' }))
    fig.style.clipPath = 'inset(0 0 0 100%)'
    const a = animate(copy, {
      opacity: [0, 1],
      translateY: [16, 0],
      delay: stagger(90, { start: 250 }),
      duration: 800,
      ease: 'outExpo',
      onComplete: () => copy.forEach((el) => (el.style.opacity = el.style.transform = '')),
    })
    const b = animate(fig, {
      clipPath: ['inset(0 0 0 100%)', 'inset(0 0 0 0%)'],
      duration: 1100,
      ease: 'outExpo',
      onComplete: () => fig.style.removeProperty('clip-path'),
    })
    return () => {
      a.revert()
      b.revert()
    }
  }, [])
}

export type Lb = { items: Img[]; i: number } | null
export type OpenLb = (items: Img[], i: number) => void

export function Lightbox({ lb, set }: { lb: Lb; set: (v: Lb) => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const d = ref.current!
    if (lb && !d.open) d.showModal()
    if (!lb && d.open) d.close()
  }, [lb])
  const go = (n: number) => lb && set({ items: lb.items, i: (lb.i + n + lb.items.length) % lb.items.length })
  const cur = lb?.items[lb.i]
  return (
    <dialog
      ref={ref}
      className="lightbox dark"
      data-lenis-prevent
      aria-label="Image viewer"
      onClose={() => set(null)}
      onClick={(e) => e.target === ref.current && set(null)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(1)
        if (e.key === 'ArrowLeft') go(-1)
      }}
    >
      {cur && lb && (
        <>
          <Pic img={cur} sizes="100vw" />
          <div className="lb-bar">
            <span className="label" aria-live="polite">
              {lb.i + 1} / {lb.items.length}
            </span>
            {lb.items.length > 1 && (
              <>
                <button className="tool" onClick={() => go(-1)}>Prev</button>
                <button className="tool" onClick={() => go(1)}>Next</button>
              </>
            )}
            <button className="tool" onClick={() => set(null)}>Close</button>
          </div>
        </>
      )}
    </dialog>
  )
}

/** Manifesto whose words darken one by one while it scrolls through the viewport. */
export function Fill({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const words = text.split(' ')
  useEffect(() => {
    const el = ref.current!
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    el.dataset.fill = ''
    const spans = [...el.children]
    let raf = 0
    const update = () => {
      const p = Math.min(1, Math.max(0, (innerHeight * 0.85 - el.getBoundingClientRect().top) / (innerHeight * 0.45)))
      spans.forEach((s, i) => s.classList.toggle('on', i < p * spans.length))
    }
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }
    update()
    addEventListener('scroll', onScroll, { passive: true })
    return () => {
      removeEventListener('scroll', onScroll)
      delete el.dataset.fill
    }
  }, [])
  return (
    <p ref={ref} className="manifesto">
      {words.map((w, i) => (
        <span key={i}>{w} </span>
      ))}
    </p>
  )
}
