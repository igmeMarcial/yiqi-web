import { AuthText } from '@/components/auth/auth'

export default async function Page() {
  return (
    <main className="flex min-h-[calc(100vh-176px)] items-center justify-center p-4 bg-gradient-to-b from-background/50 to-background">
      <AuthText />
    </main>
  )
}
