"use client"

import { useState } from "react"
import { Coins, Zap, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const CREDIT_PACKS = [
  {
    credits: 100,
    price: 9,
    pricePerCredit: 0.09,
    label: "Starter",
    discount: null,
    popular: false,
  },
  {
    credits: 500,
    price: 39,
    pricePerCredit: 0.078,
    label: "Growth",
    discount: "-13%",
    popular: false,
  },
  {
    credits: 1000,
    price: 69,
    pricePerCredit: 0.069,
    label: "Pro",
    discount: "-23%",
    popular: true,
  },
  {
    credits: 2000,
    price: 119,
    pricePerCredit: 0.0595,
    label: "Max",
    discount: "-34%",
    popular: false,
  },
]

export function BuyCreditsDialog() {
  const [selected, setSelected] = useState<number>(1000)
  const [isLoading, setIsLoading] = useState(false)

  const selectedPack = CREDIT_PACKS.find((p) => p.credits === selected)!

  const handleBuy = async () => {
    setIsLoading(true)
    try {
      // TODO: Intégrer Stripe Checkout pour l'achat de crédits
      // Exemple : await fetch('/api/billing/buy-credits', { method: 'POST', body: JSON.stringify({ credits: selected }) })
      console.log(`Achat de ${selected} crédits pour ${selectedPack.price}€`)
    } catch (err) {
      console.error("Erreur lors de l'achat :", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">
          <Coins className="mr-2 h-4 w-4" />
          Acheter des crédits
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[540px]">
        <DialogHeader>
          <DialogTitle>Acheter des crédits</DialogTitle>
          <DialogDescription>
            Les crédits ne expirent jamais et s'ajoutent à votre solde existant.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3 py-4">
          {CREDIT_PACKS.map((pack) => (
            <button
              key={pack.credits}
              type="button"
              onClick={() => setSelected(pack.credits)}
              className={cn(
                "relative flex flex-col gap-1.5 rounded-xl border-2 p-4 text-left transition-all hover:border-primary/60",
                selected === pack.credits
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card"
              )}
            >
              {pack.popular && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                  <Badge className="gap-1 bg-primary text-primary-foreground px-2 py-0.5 text-xs">
                    <Star className="h-3 w-3 fill-current" />
                    Populaire
                  </Badge>
                </span>
              )}

              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {pack.label}
                </span>
                {pack.discount && (
                  <Badge variant="secondary" className="text-xs text-green-600 dark:text-green-400">
                    {pack.discount}
                  </Badge>
                )}
              </div>

              <div className="flex items-baseline gap-1">
                <Coins className="h-4 w-4 text-primary" />
                <span className="text-2xl font-bold">{pack.credits.toLocaleString()}</span>
                <span className="text-sm text-muted-foreground">crédits</span>
              </div>

              <div className="flex items-baseline justify-between">
                <span className="text-lg font-semibold">{pack.price}€</span>
                <span className="text-xs text-muted-foreground">
                  {(pack.pricePerCredit * 100).toFixed(1)}c / crédit
                </span>
              </div>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between rounded-lg border bg-muted/40 px-4 py-3">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">
              {selected.toLocaleString()} crédits
            </span>
          </div>
          <span className="text-lg font-bold">{selectedPack.price}€</span>
        </div>

        <Button
          className="w-full"
          size="lg"
          onClick={handleBuy}
          disabled={isLoading}
        >
          {isLoading ? "Redirection..." : `Acheter ${selected.toLocaleString()} crédits — ${selectedPack.price}€`}
        </Button>
      </DialogContent>
    </Dialog>
  )
}
