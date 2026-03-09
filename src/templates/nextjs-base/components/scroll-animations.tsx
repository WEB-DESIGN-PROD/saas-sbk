"use client"

import { useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

function addViewportFade(
  el: HTMLElement,
  opts: { y?: number; blur?: number; entryStart?: string; entryEnd?: string; exitStart?: string; exitEnd?: string } = {}
) {
  const { y = 24, blur = 7, entryStart = "top 96%", entryEnd = "top 68%", exitStart = "bottom 30%", exitEnd = "bottom 2%" } = opts

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
        addViewportFade(el, { y: 12, blur: 5 })
      })

      // Titres : plus de déplacement et de blur
      gsap.utils.toArray<HTMLElement>("[data-gsap='title']").forEach((el) => {
        addViewportFade(el, { y: 44, blur: 12 })
      })

      // Sous-titres
      gsap.utils.toArray<HTMLElement>("[data-gsap='subtitle']").forEach((el) => {
        addViewportFade(el, { y: 18, blur: 5 })
      })

      // Cards : stagger par décalage du start/end de chaque card
      gsap.utils.toArray<HTMLElement>("[data-gsap='stagger']").forEach((container) => {
        const cards = Array.from(container.querySelectorAll<HTMLElement>("[data-gsap='card']"))
        cards.forEach((card, i) => {
          const staggerOffset = i * 18 // px de décalage pour simuler le stagger avec scrub
          addViewportFade(card, {
            y: 36,
            blur: 6,
            entryStart: `top+=${staggerOffset} 96%`,
            entryEnd:   `top+=${staggerOffset} 70%`,
            exitStart:  "bottom 30%",
            exitEnd:    "bottom 2%",
          })
        })
      })

    })

    return () => ctx.revert()
  }, [])

  return null
}
