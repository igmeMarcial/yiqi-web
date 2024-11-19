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
  const [tasks] = useState([
    {
      id: 1,
      title: 'Import your contacts',
      description: 'Get started by importing your contact list',
      icon: Import,
      completed: importedContacts,
      link: `/admin/organizations/${orgId}/contacts`
    },
    {
      id: 2,
      title: 'Setup payments',
      description: 'Configure your payment settings to receive funds',
      icon: CreditCard,
      completed: paymentsIsSetup,
      link: `/admin/organizations/${orgId}/billing`
    },
    {
      id: 3,
      title: 'Create new events',
      description: 'Start planning and creating your first event',
      icon: Calendar,
      completed: eventCreated,
      link: `/admin/organizations/${orgId}/events`
    },
    {
      id: 4,
      title: 'Send notifications',
      description: 'Reach out to your contacts with important updates',
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
            Welcome, New Admin!
          </CardTitle>
          <CardDescription className="text-center text-lg mt-2">
            Let&apos;s get your organization set up and running!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Your progress
            </p>
            <Progress value={progress} className="w-full h-2" />
            <p className="text-right text-sm text-gray-600 mt-1">
              {completedTasks} of {tasks.length} tasks completed
            </p>
          </div>
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
