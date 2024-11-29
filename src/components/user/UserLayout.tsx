'use client'

import Link from 'next/link'
import { User, CreditCard, History, Ticket, Speech } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger
} from '../ui/sidebar'
import { translations } from '@/lib/translations/translations'
import { AccountDropdown } from '../AccountDropdown'

interface UserProps {
  name: string
  email: string
  picture: string
  id: string
}

interface UserLayoutProps {
  children: React.ReactNode
  userProps: UserProps
}

export default function UserLayout({ children, userProps }: UserLayoutProps) {
  const navItems = [
    {
      name: translations.es.profileSettings,
      icon: User,
      href: `/user/profile`
    },
    {
      name: translations.es.payments,
      icon: CreditCard,
      href: `/user/payments`
    },
    {
      name: translations.es.history,
      icon: History,
      href: `/user/history`
    },
    {
      name: translations.es.tickets,
      icon: Ticket,
      href: `/user/tickets`
    },
    {
      name: translations.es.networkingSettings,
      icon: Speech,
      href: `/user/networking-settings`
    }
  ]

  return (
    <SidebarProvider>
      <div className="flex  w-full">
        <Sidebar collapsible="icon">
          <SidebarContent>
            <SidebarGroup>
              <SidebarMenu>
                {navItems.map(item => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild>
                      <Link href={item.href}>
                        <item.icon className="mr-2 h-5 w-5" />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <div className="flex-1 overflow-auto bg-gray-100">
          <header className="flex items-center justify-between bg-white p-4 shadow-md">
            <SidebarTrigger />

            <AccountDropdown user={userProps} />
          </header>
          <div className="p-4">{children}</div>
        </div>
      </div>
    </SidebarProvider>
  )
}
