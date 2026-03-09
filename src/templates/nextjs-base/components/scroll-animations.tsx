"use client"

import { useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function ScrollAnimations() {
  useEffect(() => {
    const ctx = gsap.context(() => {

      // Badges : scale + fade in
      gsap.utils.toArray<HTMLElement>("[data-gsap='badge']").forEach((el) => {
        gsap.fromTo(el,
          { opacity: 0, scale: 0.85 },
          {
            opacity: 1, scale: 1,
            duration: 0.5, ease: "back.out(1.7)",
            scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none reverse" },
          }
        )
      })

      // Titres de sections : fade up + blur
      gsap.utils.toArray<HTMLElement>("[data-gsap='title']").forEach((el) => {
        gsap.fromTo(el,
          { opacity: 0, y: 40, filter: "blur(8px)" },
          {
            opacity: 1, y: 0, filter: "blur(0px)",
            duration: 0.85, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none reverse" },
          }
        )
      })

      // Sous-titres de sections : fade up léger
      gsap.utils.toArray<HTMLElement>("[data-gsap='subtitle']").forEach((el) => {
        gsap.fromTo(el,
          { opacity: 0, y: 20 },
          {
            opacity: 1, y: 0,
            duration: 0.6, ease: "power2.out",
            delay: 0.1,
            scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none reverse" },
          }
        )
      })

      // Cards en stagger
      gsap.utils.toArray<HTMLElement>("[data-gsap='stagger']").forEach((container) => {
        const cards = container.querySelectorAll<HTMLElement>("[data-gsap='card']")
        if (!cards.length) return
        gsap.fromTo(cards,
          { opacity: 0, y: 50, filter: "blur(4px)" },
          {
            opacity: 1, y: 0, filter: "blur(0px)",
            duration: 0.55, ease: "power2.out",
            stagger: 0.08,
            scrollTrigger: { trigger: container, start: "top 82%", toggleActions: "play none none reverse" },
          }
        )
      })

    })

    return () => ctx.revert()
  }, [])

  return null
}
