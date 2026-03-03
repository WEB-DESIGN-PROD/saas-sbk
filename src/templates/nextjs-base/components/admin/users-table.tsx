"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth/client"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogIn, ShieldCheck, CheckCircle2, XCircle, Trash2, Search, Mail, Clock } from "lucide-react"

// Valeurs combinées plan = accountType + subscriptionPlan
const PLAN_OPTIONS = [
  { value: "Free",       label: "Free",       accountType: "Free",     subscriptionPlan: null },
  { value: "Freemium",   label: "Freemium",   accountType: "Freemium", subscriptionPlan: null },
  { value: "Pro",        label: "Pro",        accountType: "Paid",     subscriptionPlan: "Pro" },
  { value: "Team",       label: "Team",       accountType: "Paid",     subscriptionPlan: "Team" },
  { value: "Enterprise", label: "Enterprise", accountType: "Paid",     subscriptionPlan: "Enterprise" },
]

function getPlanValue(accountType: string, subscriptionPlan: string | null): string {
  if (accountType === "Paid" && subscriptionPlan) return subscriptionPlan
  return accountType
}

interface UserRow {
  id: string
  name: string | null
  email: string
  image: string | null
  emailVerified: boolean
  role: string
  accountType: string
  subscriptionPlan: string | null
  extraCredits: number
  createdAt: string
  sessions: Array<{ updatedAt: string }>
}

interface InvitationRow {
  id: string
  email: string
  role: string
  expiresAt: string
  createdAt: string
}

function getInitials(name: string | null, email: string) {
  if (name) return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
  return email.slice(0, 2).toUpperCase()
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })
}

async function patchUser(id: string, data: Record<string, unknown>) {
  const res = await fetch(`/api/admin/users/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Erreur lors de la mise à jour")
}

async function deleteUser(id: string) {
  const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" })
  if (!res.ok) throw new Error("Erreur lors de la suppression")
}

async function cancelInvitation(id: string) {
  const res = await fetch(`/api/admin/invitations/${id}`, { method: "DELETE" })
  if (!res.ok) throw new Error("Erreur lors de l'annulation")
}

// ── Badge rôle ───────────────────────────────────────────────────────────────
function RoleBadge({ role }: { role: string }) {
  switch (role) {
    case "admin":
      return (
        <Badge className="gap-1 bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20">
          <ShieldCheck className="h-3 w-3" /> Admin
        </Badge>
      )
    case "co-admin":
      return (
        <Badge className="gap-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20">
          Co-Admin
        </Badge>
      )
    case "editor":
      return (
        <Badge className="gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">
          Éditeur
        </Badge>
      )
    case "contributor":
      return (
        <Badge className="gap-1 bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20">
          Contributeur
        </Badge>
      )
    default:
      return <Badge variant="outline" className="text-xs">Membre</Badge>
  }
}

const isStaff = (role: string) => ["admin", "co-admin", "editor", "contributor"].includes(role)

const ROLE_OPTIONS = [
  { value: "co-admin",    label: "Co-Admin" },
  { value: "editor",      label: "Éditeur" },
  { value: "contributor", label: "Contributeur" },
  { value: "member",      label: "Membre" },
]

export function UsersTable({
  users: initialUsers,
  invitations: initialInvitations = [],
  currentUserId = "",
  currentUserRole = "admin",
}: {
  users: UserRow[]
  invitations?: InvitationRow[]
  currentUserId?: string
  currentUserRole?: string
}) {
  const router = useRouter()
  const [users, setUsers] = useState(initialUsers)
  const [invitations, setInvitations] = useState(initialInvitations)

  // Synchroniser le state quand le serveur rafraîchit les données (router.refresh())
  useEffect(() => { setUsers(initialUsers) }, [initialUsers])
  useEffect(() => { setInvitations(initialInvitations) }, [initialInvitations])
  const [search, setSearch] = useState("")
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<UserRow | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // ── Filtrage recherche ───────────────────────────────────────────────────────
  const filtered = search.trim()
    ? users.filter(
        (u) =>
          u.email.toLowerCase().includes(search.toLowerCase()) ||
          (u.name ?? "").toLowerCase().includes(search.toLowerCase())
      )
    : users

  // ── Plan select ──────────────────────────────────────────────────────────────
  const handlePlanChange = async (userId: string, planValue: string) => {
    const option = PLAN_OPTIONS.find((o) => o.value === planValue)
    if (!option) return
    try {
      await patchUser(userId, {
        accountType: option.accountType,
        subscriptionPlan: option.subscriptionPlan,
      })
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? { ...u, accountType: option.accountType, subscriptionPlan: option.subscriptionPlan }
            : u
        )
      )
      toast.success("Plan mis à jour")
    } catch {
      toast.error("Impossible de mettre à jour le plan")
    }
  }

  // ── Role select ──────────────────────────────────────────────────────────────
  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await patchUser(userId, { role: newRole })
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role: newRole } : u))
      toast.success("Rôle mis à jour")
    } catch {
      toast.error("Impossible de mettre à jour le rôle")
    }
  }

  // ── Credits input ────────────────────────────────────────────────────────────
  const handleCreditsBlur = async (userId: string, value: string) => {
    const credits = parseInt(value, 10)
    if (isNaN(credits) || credits < 0) return
    const user = users.find((u) => u.id === userId)
    if (!user || user.extraCredits === credits) return

    // Auto-upgrade Free → Freemium si crédits > 0
    const shouldUpgrade = credits > 0 && user.accountType === "Free"
    const patch: Record<string, unknown> = { extraCredits: credits }
    if (shouldUpgrade) {
      patch.accountType = "Freemium"
      patch.subscriptionPlan = null
    }

    try {
      await patchUser(userId, patch)
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? { ...u, extraCredits: credits, ...(shouldUpgrade ? { accountType: "Freemium", subscriptionPlan: null } : {}) }
            : u
        )
      )
      toast.success(shouldUpgrade ? "Crédits mis à jour — plan passé à Freemium" : "Crédits mis à jour")
    } catch {
      toast.error("Impossible de mettre à jour les crédits")
    }
  }

  // ── Impersonation ────────────────────────────────────────────────────────────
  const handleImpersonate = async (userId: string, userName: string | null, email: string) => {
    setLoadingId(userId)
    try {
      const result = await (authClient as any).admin.impersonateUser({ userId })
      if (result?.error) {
        toast.error("Impossible de se connecter en tant que cet utilisateur")
        return
      }
      toast.success(`Connecté en tant que ${userName || email}`)
      router.push("/dashboard")
      router.refresh()
    } catch {
      toast.error("Erreur lors de l'impersonation")
    } finally {
      setLoadingId(null)
    }
  }

  // ── Suppression utilisateur ──────────────────────────────────────────────────
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      await deleteUser(deleteTarget.id)
      setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id))
      toast.success(`${deleteTarget.name || deleteTarget.email} a été supprimé`)
      setDeleteTarget(null)
      router.refresh()
    } catch {
      toast.error("Impossible de supprimer cet utilisateur")
    } finally {
      setIsDeleting(false)
    }
  }

  // ── Annuler invitation ───────────────────────────────────────────────────────
  const handleCancelInvitation = async (id: string, email: string) => {
    try {
      await cancelInvitation(id)
      setInvitations((prev) => prev.filter((inv) => inv.id !== id))
      toast.success(`Invitation annulée pour ${email}`)
    } catch {
      toast.error("Impossible d'annuler l'invitation")
    }
  }

  return (
    <>
      {/* Barre de recherche */}
      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher par nom ou email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8 h-9 text-sm"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <p className="text-sm">
            {search ? "Aucun utilisateur ne correspond à cette recherche." : "Aucun utilisateur pour le moment."}
          </p>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Crédits</TableHead>
                <TableHead>Email vérifié</TableHead>
                <TableHead>Inscrit le</TableHead>
                <TableHead>Dernière activité</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((user) => (
                <TableRow key={user.id}>
                  {/* Utilisateur */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.image ?? undefined} />
                        <AvatarFallback className="text-xs">
                          {getInitials(user.name, user.email)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium leading-tight">{user.name || "—"}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Rôle */}
                  <TableCell>
                    {currentUserRole === "admin" && user.role !== "admin" && user.id !== currentUserId ? (
                      <Select value={user.role} onValueChange={(val) => handleRoleChange(user.id, val)}>
                        <SelectTrigger className="h-7 w-36 text-xs px-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ROLE_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value} className="text-xs">
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <RoleBadge role={user.role} />
                    )}
                  </TableCell>

                  {/* Plan — select inline */}
                  <TableCell>
                    {isStaff(user.role) ? (
                      <span className="text-xs text-muted-foreground">—</span>
                    ) : (
                      <Select
                        value={getPlanValue(user.accountType, user.subscriptionPlan)}
                        onValueChange={(val) => handlePlanChange(user.id, val)}
                      >
                        <SelectTrigger className="h-7 w-32 text-xs px-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {PLAN_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value} className="text-xs">
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </TableCell>

                  {/* Crédits — input inline */}
                  <TableCell>
                    {isStaff(user.role) ? (
                      <span className="text-xs text-muted-foreground">—</span>
                    ) : (
                      <Input
                        type="number"
                        min={0}
                        defaultValue={user.extraCredits}
                        onBlur={(e) => handleCreditsBlur(user.id, e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") e.currentTarget.blur() }}
                        className="h-7 w-20 text-xs px-2 tabular-nums"
                      />
                    )}
                  </TableCell>

                  {/* Email vérifié */}
                  <TableCell>
                    {user.emailVerified ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-muted-foreground/50" />
                    )}
                  </TableCell>

                  {/* Inscrit le */}
                  <TableCell>
                    <span className="text-xs text-muted-foreground">{formatDate(user.createdAt)}</span>
                  </TableCell>

                  {/* Dernière activité */}
                  <TableCell>
                    <span className="text-xs text-muted-foreground">
                      {user.sessions[0] ? formatDate(user.sessions[0].updatedAt) : "—"}
                    </span>
                  </TableCell>

                  {/* Actions */}
                  <TableCell>
                    <div className="flex items-center justify-end gap-1.5">
                      {user.role !== "admin" && user.id !== currentUserId && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleImpersonate(user.id, user.name, user.email)}
                          disabled={loadingId === user.id}
                          className="gap-1.5 text-xs h-7 px-2"
                        >
                          <LogIn className="h-3.5 w-3.5" />
                          {loadingId === user.id ? "…" : "Voir en tant que"}
                        </Button>
                      )}
                      {user.role !== "admin" && user.id !== currentUserId && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteTarget(user)}
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* ── Invitations en attente ──────────────────────────────────────────── */}
      {invitations.length > 0 && (
        <div className="mt-8">
          <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            Invitations en attente
            <Badge variant="secondary" className="text-xs">{invitations.length}</Badge>
          </h2>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Expire le</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invitations.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground/50" />
                        <span className="text-sm">{inv.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <RoleBadge role={inv.role} />
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-muted-foreground">{formatDate(inv.expiresAt)}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleCancelInvitation(inv.id, inv.email)}
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          title="Annuler l'invitation"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Dialog de confirmation suppression */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer l'utilisateur</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer{" "}
              <strong>{deleteTarget?.name || deleteTarget?.email}</strong> ?
              <br />
              Cette action est irréversible — toutes ses données seront perdues.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={isDeleting}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} disabled={isDeleting}>
              {isDeleting ? "Suppression…" : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
