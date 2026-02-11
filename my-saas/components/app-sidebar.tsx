"use client"

import * as React from "react"
import Link from "next/link"
import {
  LayoutDashboard,
  Settings,
  User,
  CreditCard,
  DollarSign,
  Info,
  Home,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
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

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Paramètres",
      url: "/dashboard/settings",
      icon: Settings,
    },
    {
      title: "Compte",
      url: "/dashboard/account",
      icon: User,
    },
    // {
    //   title: "Facturation",
    //   url: "/dashboard/billing",
    //   icon: CreditCard,
    // },
  ],
  navSecondary: [
    {
      title: "Accueil",
      url: "/",
      icon: Home,
    },
    {
      title: "Tarifs",
      url: "/pricing",
      icon: DollarSign,
    },
    {
      title: "À propos",
      url: "/about",
      icon: Info,
    },
  ],
}

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user: {
    name: string | null
    email: string
    image: string | null
  }
}) {
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
                <span className="text-base font-semibold">my-saas</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
