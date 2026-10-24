import { useEffect, useRef, useState, type CSSProperties } from 'react'
import type { Img } from './content'

export const st = (i: number) => ({ '--i': i }) as CSSProperties

const srcSet = (img: Img, ext: string) => img.widths.map((w) => `/images/${img.name}-${w}.${ext} ${w}w`).join(', ')

export const Pic = ({ img, className, sizes, eager }: { img: Img; className?: string; sizes?: string; eager?: boolean }) => (
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
      fetchPriority={eager ? 'high' : undefined}
      decoding="async"
    />
  </picture>
)

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

/** Adds `.in` once to every .rv / .rf element when it scrolls into view. */
export function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        }),
      { threshold: 0.12 },
    )
    document.querySelectorAll('.rv, .rf').forEach((el) => io.observe(el))
    return () => io.disconnect()
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
