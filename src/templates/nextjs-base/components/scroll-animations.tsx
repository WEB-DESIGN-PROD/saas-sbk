"use client"

import { useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

function addViewportFade(
  el: HTMLElement,
  opts: { y?: number; blur?: number; entryStart?: string; entryEnd?: string; exitStart?: string; exitEnd?: string } = {}
) {
  const { y = 16, blur = 6, entryStart = "top 102%", entryEnd = "top 88%", exitStart = "bottom 12%", exitEnd = "bottom -2%" } = opts

  // Entrée depuis le bas : fade + unblur + remontée
  gsap.fromTo(el,
    { opacity: 0, filter: `blur(${blur}px)`, y },
    {
      opacity: 1, filter: "blur(0px)", y: 0,
      ease: "none",
      scrollTrigger: { trigger: el, start: entryStart, end: entryEnd, scrub: 0.8 },
    }
  )

  // Sortie vers le haut : fade + blur
  gsap.fromTo(el,
    { opacity: 1, filter: "blur(0px)" },
    {
      opacity: 0, filter: `blur(${blur * 0.6}px)`,
      ease: "none",
      scrollTrigger: { trigger: el, start: exitStart, end: exitEnd, scrub: 0.8 },
    }
  )
}

export function ScrollAnimations() {
  useEffect(() => {
    const ctx = gsap.context(() => {

      // Badges
      gsap.utils.toArray<HTMLElement>("[data-gsap='badge']").forEach((el) => {
        addViewportFade(el, { y: 8, blur: 4 })
      })

      // Titres
      gsap.utils.toArray<HTMLElement>("[data-gsap='title']").forEach((el) => {
        addViewportFade(el, { y: 20, blur: 8 })
      })

      // Sous-titres
      gsap.utils.toArray<HTMLElement>("[data-gsap='subtitle']").forEach((el) => {
        addViewportFade(el, { y: 10, blur: 4 })
      })

      // Cards : stagger léger via décalage du trigger
      gsap.utils.toArray<HTMLElement>("[data-gsap='stagger']").forEach((container) => {
        const cards = Array.from(container.querySelectorAll<HTMLElement>("[data-gsap='card']"))
        cards.forEach((card, i) => {
          const offset = i * 12
          addViewportFade(card, {
            y: 18,
            blur: 5,
            entryStart: `top+=${offset} 102%`,
            entryEnd:   `top+=${offset} 88%`,
            exitStart:  "bottom 12%",
            exitEnd:    "bottom -2%",
          })
        })
      })

    })

    return () => ctx.revert()
  }, [])

  return null
}
