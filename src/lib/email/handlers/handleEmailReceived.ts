import createMessageRecord from '@/lib/communications/createMessageRecord'
import prisma from '@/lib/prisma'
import { MessageThreadType } from '@prisma/client'

export type HandleEmailReceivedType = {
  fromEmail: string
  toEmail: string
  content: string
  subject: string
}

export async function handleEmailReceived({
  fromEmail,
  toEmail,
  content
}: HandleEmailReceivedType) {
  const fromUser = await prisma.user.findFirstOrThrow({
    where: {
      email: fromEmail
    }
  })

  // the orgId will always be the user of the yiqi.lat domain (j092j190jd09ja09jds09@yiqi.lat -> orgId: j092j190jd09ja09jds09)
  const orgId = toEmail.split('@')[0]

  const organization = await prisma.organization.findFirstOrThrow({
    where: {
      id: orgId
    }
  })

  const thread = await prisma.messageThread.findFirstOrThrow({
    where: {
      organizationId: organization.id,
      type: MessageThreadType.email,
      contextUserId: fromUser.id
    },
    include: {
      contextUser: true
    }
  })

  const user = thread.contextUser

  if (!user.email) {
    throw ' user doesnt have an email'
  }

  return createMessageRecord({
    content,
    attachement: undefined,
    messageThreadId: thread.id,
    senderUserId: user.id
  })
}
