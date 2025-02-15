import MainLandingNav from '@/components/mainLanding/mainNav'
import { getUser } from '@/lib/auth/lucia'
import { redirect } from 'next/navigation'
import { MatchesList } from './_temp/tempcomp'
import { getNetworkingMatchesByEventUser } from '@/services/actions/networking/getNetworkingMatchesByEventUser'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function Page({
  params
}: {
  params: { eventId: string }
}) {
  const user = await getUser()
  if (!user) {
    redirect('/auth')
  }

  const { matches, errors } = await getNetworkingMatchesByEventUser(
    user.id,
    params.eventId
  )

  // Common layout elements
  const Layout = ({ children }: { children: React.ReactNode }) => (
    <>
      <div className="fixed inset-0 h-screen w-screen -z-10 bg-black"></div>
      <MainLandingNav user={user!} />
      <div className="lg:max-w-[80%] max-w-[90%] mx-auto pt-20">{children}</div>
    </>
  )

  // Handle error states
  if (!errors.registeredForEvent) {
    return (
      <Layout>
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold">
            No estás registrado para este evento
          </h2>
          <p className="text-gray-400">
            Necesitas registrarte primero para ver tus matches
          </p>
          <Button variant="outline" asChild>
            <Link href={`/${params.eventId}`}>Registrarme al evento</Link>
          </Button>
        </div>
      </Layout>
    )
  }

  if (!errors.missingProfile) {
    return (
      <Layout>
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold">
            Necesitamos más información sobre ti
          </h2>
          <p className="text-gray-400">
            Para poder encontrar matches, necesitamos que completes tu perfil
          </p>
          <Button variant="outline" asChild>
            <Link href="/user/networking-settings">Completar mi perfil</Link>
          </Button>
        </div>
      </Layout>
    )
  }

  // Handle job status states
  if (errors.matchesJobStatus) {
    switch (errors.matchesJobStatus) {
      case 'PENDING':
      case 'PROCESSING':
        return (
          <Layout>
            <div className="text-center space-y-4">
              <Loader2 className="w-8 h-8 animate-spin mx-auto" />
              <h2 className="text-2xl font-semibold">
                Estamos generando tus matches
              </h2>
              <p className="text-gray-400">
                Este proceso puede tomar unos minutos...
              </p>
            </div>
          </Layout>
        )
      case 'FAILED':
        return (
          <Layout>
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-semibold">
                Hubo un problema al generar tus matches
              </h2>
              <p className="text-gray-400">
                Por favor contacta al organizador del evento
              </p>
            </div>
          </Layout>
        )
      case null:
        return (
          <Layout>
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-semibold">
                No encontramos el proceso de matches
              </h2>
              <p className="text-gray-400">
                Por favor contacta al organizador del evento para que revisen
                qué sucedió
              </p>
            </div>
          </Layout>
        )
    }
  }

  // Show matches if everything is OK
  return (
    <Layout>
      {matches.length > 0 ? (
        <MatchesList matches={matches} />
      ) : (
        <p className="text-xl">No hay matches para ti en este momento</p>
      )}
    </Layout>
  )
}
