"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // TODO: Mettre à jour les paramètres utilisateur
      console.log("Update settings:", { name, email })

      await new Promise(resolve => setTimeout(resolve, 1000))

      alert("Paramètres mis à jour avec succès")
    } catch (error) {
      console.error("Settings update error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
        <p className="text-muted-foreground">
          Gérez vos préférences et paramètres de compte
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations personnelles</CardTitle>
            <CardDescription>
              Mettez à jour vos informations de profil
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Jean Dupont"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Adresse email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nom@exemple.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Enregistrement..." : "Enregistrer les modifications"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Préférences</CardTitle>
            <CardDescription>
              Personnalisez votre expérience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Notifications par email</Label>
                <p className="text-sm text-muted-foreground">
                  Recevoir des notifications par email
                </p>
              </div>
              <Button variant="outline" size="sm">
                Activé
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Newsletter</Label>
                <p className="text-sm text-muted-foreground">
                  Recevoir les actualités et mises à jour
                </p>
              </div>
              <Button variant="outline" size="sm">
                Désactivé
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
