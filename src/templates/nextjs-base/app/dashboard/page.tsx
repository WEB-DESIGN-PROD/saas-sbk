import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Page dashboard simple SANS appels auth
export default async function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bienvenue !</h1>
        <p className="text-muted-foreground">
          Voici votre tableau de bord personnel
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Projets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Aucun projet pour le moment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Activité
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Actions cette semaine
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Statut
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Actif</div>
            <p className="text-xs text-muted-foreground">
              Compte en règle
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Démarrage rapide</CardTitle>
          <CardDescription>
            Commencez par configurer votre espace
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border bg-background">
              1
            </div>
            <div className="flex-1">
              <h3 className="font-medium">Complétez votre profil</h3>
              <p className="text-sm text-muted-foreground">
                Ajoutez vos informations dans les paramètres
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border bg-background">
              2
            </div>
            <div className="flex-1">
              <h3 className="font-medium">Créez votre premier projet</h3>
              <p className="text-sm text-muted-foreground">
                Commencez à utiliser la plateforme
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border bg-background">
              3
            </div>
            <div className="flex-1">
              <h3 className="font-medium">Explorez les fonctionnalités</h3>
              <p className="text-sm text-muted-foreground">
                Découvrez tout ce que vous pouvez faire
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
