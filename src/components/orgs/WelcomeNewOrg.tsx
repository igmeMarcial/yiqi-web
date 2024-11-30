'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { Import, CreditCard, Calendar, Bell } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

type Props = {
  importedContacts: boolean
  paymentsIsSetup: boolean
  eventCreated: boolean
  notificationsSent: boolean
  orgId: string
}

export default function WelcomeScreen({
  importedContacts,
  paymentsIsSetup,
  eventCreated,
  notificationsSent,
  orgId
}: Props) {
  const t = useTranslations('WelcomeNewOrg')
  const [tasks] = useState([
    {
      id: 1,
      title: `${t('welcomeScreenTasksImportContacts')}`,
      description: `${t('welcomeScreenTasksImportDescription')}`,
      icon: Import,
      completed: importedContacts,
      link: `/admin/organizations/${orgId}/contacts`
    },
    {
      id: 2,
      title: `${t('welcomeScreenTasksSetupPayments')}`,
      description: `${t('welcomeScreenTasksPaymentDescription')}`,
      icon: CreditCard,
      completed: paymentsIsSetup,
      link: `/admin/organizations/${orgId}/billing`
    },
    {
      id: 3,
      title: `${t('welcomeScreenTasksCreateEvents')}`,
      description: `${t('welcomeScreenTasksEventDescription')}`,
      icon: Calendar,
      completed: eventCreated,
      link: `/admin/organizations/${orgId}/events`
    },
    {
      id: 4,
      title: `${t('welcomeScreenTasksSendNotifications')}`,
      description: `${t('welcomeScreenTasksNotificationDescription')}`,
      icon: Bell,
      completed: notificationsSent,
      link: `/admin/organizations/${orgId}/chat`
    }
  ])

  const completedTasks = tasks.filter(task => task.completed).length
  const progress = (completedTasks / tasks.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 p-8">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-purple-800">
            {t('welcomeScreenTitle')}
          </CardTitle>
          <CardDescription className="text-center text-lg mt-2">
            {t('welcomeScreenDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Progress bar section */}
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-2">
              {t('welcomeScreenProgressTitle')}
            </p>
            <Progress value={progress} className="w-full h-2" />
            <p className="text-right text-sm text-gray-600 mt-1">
              {completedTasks} {t('welcomeOf')} {tasks.length}{' '}
              {t('welcomeScreenTasks')}
            </p>
          </div>
          {/* Task Cards */}
          <div className="grid gap-6 md:grid-cols-2">
            {tasks.map(task => (
              <Link href={task.link} key={task.id}>
                <Card
                  className={`transition-all duration-300 ease-in-out ${task.completed ? 'bg-green-50 border-green-200' : 'hover:shadow-md'}`}
                >
                  <CardContent className="p-6 flex items-start space-x-4">
                    <div
                      className={`p-2 rounded-full ${task.completed ? 'bg-green-100 text-green-600' : 'bg-purple-100 text-purple-600'}`}
                    >
                      <task.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-semibold text-lg mb-1">
                        {task.title}
                      </h3>
                      <p className="text-gray-600">{task.description}</p>
                    </div>
                    <Checkbox
                      checked={task.completed}
                      className="mt-1"
                      disabled={true}
                    />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
