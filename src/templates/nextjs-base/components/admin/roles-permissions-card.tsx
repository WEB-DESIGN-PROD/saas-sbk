"use client"

import { useState } from "react"
import { Check, Minus, ChevronDown } from "lucide-react"

const PERMISSIONS = [
  { label: "Voir la liste des utilisateurs",             admin: true,  coAdmin: true,  editor: false, contributor: false, member: false },
  { label: "Modifier rôles / plan / crédits",            admin: true,  coAdmin: false, editor: false, contributor: false, member: false },
  { label: "Inviter de nouveaux membres",                admin: true,  coAdmin: false, editor: false, contributor: false, member: false },
  { label: "Supprimer des comptes",                      admin: true,  coAdmin: false, editor: false, contributor: false, member: false },
  { label: "Se connecter en tant qu'un utilisateur",     admin: true,  coAdmin: true,  editor: false, contributor: false, member: false },
  { label: "Valider / publier des articles",             admin: true,  coAdmin: true,  editor: true,  contributor: false, member: false },
  { label: "Modifier tous les articles",                 admin: true,  coAdmin: true,  editor: true,  contributor: false, member: false },
  { label: "Modifier ses propres articles",              admin: true,  coAdmin: true,  editor: true,  contributor: true,  member: false },
  { label: "Supprimer n'importe quel article",           admin: true,  coAdmin: true,  editor: false, contributor: false, member: false },
  { label: "Supprimer ses propres articles",             admin: true,  coAdmin: true,  editor: true,  contributor: false, member: false },
  { label: "Créer des catégories d'articles",            admin: true,  coAdmin: true,  editor: true,  contributor: false, member: false },
  { label: "Gérer les médias",                           admin: true,  coAdmin: true,  editor: true,  contributor: false, member: false },
]

export function RolesPermissionsCard() {
  const [open, setOpen] = useState(false)

  return (
    <div className="rounded-xl border bg-card">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <p className="text-sm font-semibold">Rôles & permissions</p>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-5 pb-5 overflow-x-auto">
          <table className="w-full text-xs border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="text-left pr-4 pb-2 font-medium text-muted-foreground whitespace-nowrap">Permission</th>
                <th className="text-center px-3 pb-2 font-medium whitespace-nowrap">
                  <span className="inline-block px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400">Super Admin</span>
                </th>
                <th className="text-center px-3 pb-2 font-medium whitespace-nowrap">
                  <span className="inline-block px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">Co-Admin</span>
                </th>
                <th className="text-center px-3 pb-2 font-medium whitespace-nowrap">
                  <span className="inline-block px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">Éditeur</span>
                </th>
                <th className="text-center px-3 pb-2 font-medium whitespace-nowrap">
                  <span className="inline-block px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400">Contributeur</span>
                </th>
                <th className="text-center px-3 pb-2 font-medium whitespace-nowrap">
                  <span className="inline-block px-2 py-0.5 rounded-full bg-muted text-muted-foreground">Membre</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {PERMISSIONS.map(({ label, admin, coAdmin, editor, contributor, member }) => (
                <tr key={label} className="hover:bg-muted/30">
                  <td className="py-1.5 pr-4 text-muted-foreground whitespace-nowrap">{label}</td>
                  {[admin, coAdmin, editor, contributor, member].map((allowed, i) => (
                    <td key={i} className="text-center py-1.5 px-3">
                      {allowed
                        ? <Check className="h-3.5 w-3.5 text-green-500 mx-auto" />
                        : <Minus className="h-3 w-3 text-muted-foreground/30 mx-auto" />}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
