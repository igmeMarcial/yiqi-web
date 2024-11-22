import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

console.log(
  'This is a standalone script running in a Next.js TypeScript project.'
)

async function main() {
  const userCount = await prisma.user.count()
  console.log('User count:', userCount)

  await prisma.$disconnect()
}

main()
  .catch(async e => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    process.exit(0)
  })
