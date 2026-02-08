# Guide de Débogage - Boucle Infinie Dashboard

## Symptôme
Le dashboard se recharge en boucle (logs `GET /dashboard 200` répétés toutes les 50-150ms)

## Corrections Appliquées

### 1. Appels `cookies()` optimisés
**Problème :** `cookies()` appelé 2 fois dans layout + 1 fois dans page = 3 appels
**Solution :** 1 seul appel dans le layout, page simplifiée

### 2. `router.refresh()` supprimé
**Problème :** Appelé après `router.push()` causait des rechargements
**Solution :** Supprimé de tous les fichiers

### 3. `auth.api.getSession()` optimisé
**Problème :** Appelé dans layout ET page
**Solution :** Appelé uniquement dans layout

## Tests à Faire

### Test 1 : Nouveau Build
```bash
rm -rf .next
npm run dev
```

### Test 2 : Layout Minimal
Si le problème persiste, testez avec le layout minimal :

```bash
cd app/dashboard
mv layout.tsx layout.backup.tsx
mv layout-minimal.tsx.example layout.tsx
npm run dev
```

**Si ça ne boucle plus**, le problème vient de `SidebarProvider` ou composants Sidebar

## Solutions Selon le Diagnostic

### Si c'est la Sidebar

**Solution rapide** : Layout simple sans sidebar

```tsx
// app/dashboard/layout.tsx
import { redirect } from "next/navigation"
import { cookies } from "next/headers"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  if (!cookieStore.get('better-auth.session_token')) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen">
      <nav className="border-b p-4">
        <a href="/" className="text-lg font-bold">{{PROJECT_NAME}}</a>
      </nav>
      <main className="p-8">{children}</main>
    </div>
  )
}
```

### Si c'est l'Auth

Vérifiez que Better Auth est bien configuré :
```bash
npm run db:studio  # Vérifier que les tables existent
```

### Si c'est le Proxy

Désactivez temporairement le proxy :
```bash
mv proxy.ts proxy.ts.backup
npm run dev
```

## Composants Suspects

1. **SidebarProvider** - États et effets multiples
2. **useIsMobile** - Hook avec state qui change
3. **AppSidebar** - Composant client avec navigation
4. **NavUser** - Dropdown avec états

## Next Steps

Si aucune solution ne fonctionne, simplifiez progressivement :
1. Layout sans sidebar ✅
2. Layout sans auth check (juste render children)
3. Page vide (juste `<div>Test</div>`)

L'objectif est d'isoler le composant ou la logique qui cause la boucle.
