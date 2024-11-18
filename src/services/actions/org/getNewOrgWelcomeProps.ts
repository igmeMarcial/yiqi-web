'use server'

import prisma from '@/lib/prisma'

export async function getNewOrgWelcomeProps(organizationId: string) {
  const [org, contacts, hasEvents, hasNotifications] = await Promise.all([
    prisma.organization.findUnique({
      where: { id: organizationId },
      select: { stripeAccountId: true }
    }),
    prisma.organizationContact.findFirst({
      where: { organizationId }
    }),
    prisma.event.findFirst({
      where: { organizationId }
    }),
    prisma.notification.findFirst({
      where: { organizationId }
    })
  ])

  return {
    hasContacts: !!contacts,
    hasEvents: !!hasEvents,
    hasNotifications: !!hasNotifications,
    isStripeSetup: !!org?.stripeAccountId
  }
}
