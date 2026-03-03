"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminSettingsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      // TODO: Mettre à jour les paramètres utilisateur
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      console.error("Settings update error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6">

        <div>
          <h1 className="text-2xl font-semibold">Paramètres</h1>
          <p className="text-muted-foreground text-sm">
            Gérez vos préférences et paramètres de compte
          </p>
        </div>

        <div className="grid gap-4 md:gap-6">
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

          <Card id="notifications">
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Gérez vos préférences de notifications administrateur
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Nouvelle inscription utilisateur</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir un email à chaque nouvelle inscription sur la plateforme
                  </p>
                </div>
                <Button variant="outline" size="sm" className="text-green-600 border-green-600/40 bg-green-50 dark:bg-green-950/20">Activé</Button>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}
