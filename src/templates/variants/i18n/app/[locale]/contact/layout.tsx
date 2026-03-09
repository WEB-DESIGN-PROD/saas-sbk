import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ScrollAnimations } from "@/components/scroll-animations"

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip">

      {/* Gradient orbs */}
      <div className="pointer-events-none absolute inset-0 h-screen overflow-hidden" aria-hidden>
        <div className="absolute top-1/3 left-1/4 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-[160px] animate-pulse" />
        <div className="absolute top-1/2 right-1/4 h-[400px] w-[400px] rounded-full bg-violet-500/10 blur-[130px] animate-pulse [animation-delay:2s]" />
      </div>

      <Navbar />
      <ScrollAnimations />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
