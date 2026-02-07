"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function BillingPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Facturation</h1>
        <p className="text-muted-foreground">
          Gérez votre abonnement et vos paiements
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Plan actuel</CardTitle>
            <CardDescription>
              Vous êtes actuellement sur le plan Gratuit
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Plan Gratuit</p>
                <p className="text-sm text-muted-foreground">
                  0€ / mois
                </p>
              </div>
              <Button>Améliorer</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Méthode de paiement</CardTitle>
            <CardDescription>
              Gérez vos moyens de paiement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Aucune méthode de paiement enregistrée
            </p>
            <Button className="mt-4" variant="outline">
              Ajouter une carte
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Historique de facturation</CardTitle>
            <CardDescription>
              Consultez vos factures passées
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Aucune facture pour le moment
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
