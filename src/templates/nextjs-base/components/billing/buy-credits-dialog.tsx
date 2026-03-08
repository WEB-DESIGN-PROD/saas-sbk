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

interface CreditPack {
  id: string
  name: string
  credits: number
  price: number // centimes
  currency: string
  description: string
  popular?: boolean
}

interface BuyCreditsDialogProps {
  packs: CreditPack[]
}

export function BuyCreditsDialog({ packs }: BuyCreditsDialogProps) {
  const [selected, setSelected] = useState<string>(packs[0]?.id ?? "")
  const [isLoading, setIsLoading] = useState(false)

  if (packs.length === 0) return null

  // Prix par crédit de base (pack le moins cher à l'unité = premier pack)
  const basePricePerCredit = packs[0].price / packs[0].credits

  const selectedPack = packs.find((p) => p.id === selected) ?? packs[0]

  function getDiscount(pack: CreditPack) {
    const ppc = pack.price / pack.credits
    const discount = Math.round((1 - ppc / basePricePerCredit) * 100)
    return discount > 0 ? `-${discount}%` : null
  }

  function formatPrice(centimes: number) {
    const euros = centimes / 100
    return euros % 1 === 0 ? `${euros}€` : `${euros.toFixed(2)}€`
  }

  function formatPricePerCredit(pack: CreditPack) {
    const ppc = (pack.price / pack.credits / 100) * 100 // en centimes d'euro
    return `${ppc.toFixed(1)}c / crédit`
  }

  const handleBuy = async () => {
    setIsLoading(true)
    try {
      // TODO: Intégrer Stripe Checkout pour l'achat de crédits
      console.log(`Achat de ${selectedPack.credits} crédits pour ${formatPrice(selectedPack.price)}`)
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
            Les crédits ne expirent jamais et s&apos;ajoutent à votre solde existant.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3 py-4">
          {packs.map((pack) => {
            const discount = getDiscount(pack)
            return (
              <button
                key={pack.id}
                type="button"
                onClick={() => setSelected(pack.id)}
                className={cn(
                  "relative flex flex-col gap-1.5 rounded-xl border-2 p-4 text-left transition-all hover:border-primary/60",
                  selected === pack.id
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
                    {pack.name}
                  </span>
                  {discount && (
                    <Badge variant="secondary" className="text-xs text-green-600 dark:text-green-400">
                      {discount}
                    </Badge>
                  )}
                </div>

                <div className="flex items-baseline gap-1">
                  <Coins className="h-4 w-4 text-primary" />
                  <span className="text-2xl font-bold">{pack.credits.toLocaleString()}</span>
                  <span className="text-sm text-muted-foreground">crédits</span>
                </div>

                <div className="flex items-baseline justify-between">
                  <span className="text-lg font-semibold">{formatPrice(pack.price)}</span>
                  <span className="text-xs text-muted-foreground">{formatPricePerCredit(pack)}</span>
                </div>
              </button>
            )
          })}
        </div>

        <div className="flex items-center justify-between rounded-lg border bg-muted/40 px-4 py-3">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">
              {selectedPack.credits.toLocaleString()} crédits
            </span>
          </div>
          <span className="text-lg font-bold">{formatPrice(selectedPack.price)}</span>
        </div>

        <Button
          className="w-full"
          size="lg"
          onClick={handleBuy}
          disabled={isLoading}
        >
          {isLoading
            ? "Redirection..."
            : `Acheter ${selectedPack.credits.toLocaleString()} crédits — ${formatPrice(selectedPack.price)}`}
        </Button>
      </DialogContent>
    </Dialog>
  )
}
