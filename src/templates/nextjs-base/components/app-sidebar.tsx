"use client"

import * as React from "react"
import Link from "next/link"
import { LayoutDashboard, Home, Zap } from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import type { AccountType } from "@/types"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
  ],
}

export function AppSidebar({
  user,
  accountType,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user: {
    name: string | null
    email: string
    image: string | null
  }
  accountType: AccountType
}) {
  const showUpgradeCard = accountType !== "Paid"

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/dashboard">
                <Home className="!size-5" />
                <span className="text-base font-semibold">{{PROJECT_NAME}}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        {showUpgradeCard && (
          <div className="mx-2 mb-2 rounded-xl border border-primary/25 bg-gradient-to-b from-primary/10 to-primary/5 p-4">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15">
                <Zap className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold leading-tight">Passez à Pro</p>
                <p className="text-xs text-muted-foreground leading-tight">Accès complet</p>
              </div>
            </div>
            <ul className="mb-4 space-y-1.5">
              <li className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="text-primary">✓</span> Fonctionnalités illimitées
              </li>
              <li className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="text-primary">✓</span> Support prioritaire
              </li>
              <li className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="text-primary">✓</span> Crédits mensuels inclus
              </li>
            </ul>
            <Link
              href="/dashboard/billing"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Zap className="h-3.5 w-3.5" />
              Upgrade maintenant
            </Link>
          </div>
        )}
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
