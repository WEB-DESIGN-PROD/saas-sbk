import { TrendingUp, Users, UserCheck, Activity, UserPlus } from "lucide-react"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface AdminStatsProps {
  totalUsers: number
  newToday: number
  activeSessions: number
  verifiedUsers: number
}

export function SectionCardsAdmin({
  totalUsers,
  newToday,
  activeSessions,
  verifiedUsers,
}: AdminStatsProps) {
  const verifiedRate = totalUsers > 0 ? Math.round((verifiedUsers / totalUsers) * 100) : 0

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" /> Total utilisateurs
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalUsers.toLocaleString("fr-FR")}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUp />
              Inscrits
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Comptes créés au total
          </div>
          <div className="text-muted-foreground">Depuis le lancement</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-1.5">
            <UserPlus className="h-3.5 w-3.5" /> Nouveaux aujourd'hui
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {newToday.toLocaleString("fr-FR")}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUp />
              Aujourd'hui
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Inscriptions du jour
          </div>
          <div className="text-muted-foreground">Depuis minuit</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-1.5">
            <Activity className="h-3.5 w-3.5" /> Sessions actives
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {activeSessions.toLocaleString("fr-FR")}
          </CardTitle>
          <CardAction>
            {activeSessions > 0 ? (
              <Badge variant="outline" className="text-green-600 border-green-500/40">
                <span className="mr-1 h-2 w-2 rounded-full bg-green-500 inline-block" />
                En ligne
              </Badge>
            ) : (
              <Badge variant="outline" className="text-red-500 border-red-500/40">
                <span className="mr-1 h-2 w-2 rounded-full bg-red-500 inline-block" />
                Hors ligne
              </Badge>
            )}
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Sessions en cours
          </div>
          <div className="text-muted-foreground">Sessions non expirées</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-1.5">
            <UserCheck className="h-3.5 w-3.5" /> Emails vérifiés
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {verifiedRate}%
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {verifiedUsers.toLocaleString("fr-FR")} / {totalUsers.toLocaleString("fr-FR")}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Taux de vérification
          </div>
          <div className="text-muted-foreground">Comptes avec email confirmé</div>
        </CardFooter>
      </Card>
    </div>
  )
}
