import { useLayoutEffect, useRef } from 'react'

const DURATION_MS = 560
const EASE_OUT_EXPO = 'cubic-bezier(0.16, 1, 0.3, 1)'

/**
 * Slides list items to their new position when the order changes, instead of letting
 * them jump (the FLIP technique). Returns a ref callback to attach to each item.
 */
export function useFlip(order: string) {
  const elements = useRef(new Map<string, HTMLElement>())
  const lastTops = useRef(new Map<string, number>())

  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    elements.current.forEach((element, key) => {
      const top = element.getBoundingClientRect().top
      const lastTop = lastTops.current.get(key)
      lastTops.current.set(key, top)
      if (reduceMotion || lastTop === undefined || lastTop === top) return
      element.animate([{ transform: `translateY(${lastTop - top}px)` }, { transform: 'translateY(0)' }], {
        duration: DURATION_MS,
        easing: EASE_OUT_EXPO,
      })
    })
  }, [order])

  return (key: string) => (element: HTMLElement | null) => {
    if (element) elements.current.set(key, element)
    else elements.current.delete(key)
  }
}
