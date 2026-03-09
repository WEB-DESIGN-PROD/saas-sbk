"use client"

import { useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

// Blur scrub uniquement aux bords du viewport (ne touche pas opacity/y)
function addEdgeBlur(el: HTMLElement, blur = 5) {
  gsap.fromTo(el,
    { filter: `blur(${blur}px)` },
    { filter: "blur(0px)", ease: "none",
      scrollTrigger: { trigger: el, start: "top 100%", end: "top 93%", scrub: 0.6 } }
  )
  gsap.fromTo(el,
    { filter: "blur(0px)" },
    { filter: `blur(${blur}px)`, ease: "none",
      scrollTrigger: { trigger: el, start: "bottom 7%", end: "bottom 0%", scrub: 0.6 } }
  )
}

export function ScrollAnimations() {
  useEffect(() => {
    const ctx = gsap.context(() => {

      // Badges
      gsap.utils.toArray<HTMLElement>("[data-gsap='badge']").forEach((el) => {
        gsap.fromTo(el,
          { opacity: 0, scale: 0.88 },
          { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(1.7)",
            scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none reverse" } }
        )
        addEdgeBlur(el, 3)
      })

      // Titres
      gsap.utils.toArray<HTMLElement>("[data-gsap='title']").forEach((el) => {
        gsap.fromTo(el,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none reverse" } }
        )
        addEdgeBlur(el, 8)
      })

      // Sous-titres
      gsap.utils.toArray<HTMLElement>("[data-gsap='subtitle']").forEach((el) => {
        gsap.fromTo(el,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none reverse" } }
        )
        addEdgeBlur(el, 3)
      })

      // Cards : stagger one-time + blur d'arête séparé
      gsap.utils.toArray<HTMLElement>("[data-gsap='stagger']").forEach((container) => {
        const cards = Array.from(container.querySelectorAll<HTMLElement>("[data-gsap='card']"))

        // Stagger entrée (opacity + y)
        gsap.fromTo(cards,
          { opacity: 0, y: 44 },
          {
            opacity: 1, y: 0,
            duration: 0.55, ease: "power2.out",
            stagger: 0.09,
            scrollTrigger: { trigger: container, start: "top 82%", toggleActions: "play none none reverse" },
          }
        )

        // Blur aux bords pour chaque card (filter uniquement)
        cards.forEach((card) => addEdgeBlur(card, 5))
      })

    })

    return () => ctx.revert()
  }, [])

  return null
}
