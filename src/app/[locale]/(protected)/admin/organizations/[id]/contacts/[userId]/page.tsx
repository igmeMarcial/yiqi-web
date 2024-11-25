import { getOrganization } from '@/services/actions/organizationActions'
import { getContactDetails } from '@/services/actions/contactActions'
import { getUserMessageList } from '@/services/actions/messagesActions'
import * as Tabs from '@radix-ui/react-tabs'
import ConnectedChat from '@/components/chat/connectedChat'
import {
  ContactText1,
  ContactText2,
  ContactText3,
  Link1,
  TabList
} from '@/components/contactText'

export default async function ContactDetailsPage({
  params
}: {
  params: { locale: string; id: string; userId: string }
}) {
  const organization = await getOrganization(params.id)
  const contact = await getContactDetails(params.userId, params.id)
  const messages = await getUserMessageList(params.userId, params.id)

  if (!organization || !contact) {
    return <div>Contact or Organization not found</div>
  }

  return (
    <div className="container mx-auto p-4">
      <ContactText1 name={contact.name} />
      <Tabs.Root defaultValue="messages" className="w-full">
        <TabList />

        <div className="pt-3">
          <Tabs.Content value="messages">
            <div className="h-[600px]">
              <ConnectedChat
                defaultMessages={messages}
                userId={params.userId}
                orgId={params.id}
              />
            </div>
          </Tabs.Content>

          <Tabs.Content value="events">
            {/* <h2 className="text-xl font-bold mt-4 mb-2">Attended Events</h2>
            <ul className="space-y-2">
              {contact.registeredEvents?.map(attendee => (
                <li key={attendee.id} className="border p-2 rounded">
                  <Link
                    href={`/${locale}/admin/organizations/${params.id}/events/${attendee.event.id}`}
                    className="text-blue-500 hover:underline"
                  >
                    {attendee.event.title}
                  </Link>
                  <p>Status: {attendee.status}</p>
                </li>
              ))}
            </ul> */}

            <ContactText3 contact={contact} id={params.id} />
          </Tabs.Content>

          <Tabs.Content value="details">
            <div className="space-y-2">
              <ContactText2
                email={contact.email}
                name={contact.name}
                phoneNumber={contact.phoneNumber}
              />
              {contact.dataCollected && (
                <div className="border p-2 rounded">
                  {Object.entries(contact.dataCollected).map(([key, value]) => (
                    <p key={key}>
                      <strong>{key}:</strong> {JSON.stringify(value)}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </Tabs.Content>
        </div>
      </Tabs.Root>
      <Link1 id={params.id} />
    </div>
  )
}
