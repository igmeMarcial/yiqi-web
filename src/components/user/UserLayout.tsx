'use client'

import Link from 'next/link'
import { LogOut, User, CreditCard, History, Ticket } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import SignOutButton from '../auth/sign-out'
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
import { useLanguage } from '@/hooks/useLanguage'

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
  const { t } = useLanguage()

  const navItems = [
    {
      name: t('profileSettings'),
      icon: User,
      href: `/user/profile`
    },
    {
      name: t('payments'),
      icon: CreditCard,
      href: `/user/payments`
    },
    {
      name: t('history'),
      icon: History,
      href: `/user/history`
    },
    {
      name: t('tickets'),
      icon: Ticket,
      href: `/user/tickets`
    }
  ]

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden w-full">
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

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={userProps.picture} alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {userProps.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {userProps.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <SignOutButton>
                    <div className="flex items-center gap-4">
                      <span>{t('logOut')}</span>
                      <LogOut className="h-4 w-4" />
                    </div>
                  </SignOutButton>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <div className="p-4">{children}</div>
        </div>
      </div>
    </SidebarProvider>
  )
}
