'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  getEventUsers,
  simulateMatches
} from '@/services/actions/networking/simulateMatches'
import { Textarea } from '@/components/ui/textarea'
import { useEffect, useState } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { Skeleton } from '@/components/ui/skeleton'
import { Loader2 } from 'lucide-react'
import { DEFAULT_EMBEDDING_PROMPT } from './constants'

type User = {
  id: string
  name: string
  email: string
  userDetailedProfile: string | null
}

type SimulationResult = {
  searchString: string
  matchUsers: (User | null)[]
}

export default function Simulator({ params }: { params: { eventId: string } }) {
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<string>('')
  const [customPrompt, setCustomPrompt] = useState('')
  const [selectedUserDetail, setSelectedUserDetail] = useState<User | null>(
    null
  )
  const [isLoadingUsers, setIsLoadingUsers] = useState(true)
  const [isRunningSimulation, setIsRunningSimulation] = useState(false)
  const [simulationResult, setSimulationResult] =
    useState<SimulationResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const eventUsers = await getEventUsers(params.eventId)
        setUsers(eventUsers)
        setIsLoadingUsers(false)
      } catch (err) {
        console.error('Error loading users:', err)
        setError('Error loading users. Please try again.')
        setIsLoadingUsers(false)
      }
    }

    loadUsers()
  }, [params.eventId])

  useEffect(() => {
    if (selectedUser) {
      const user = users.find(u => u.id === selectedUser)
      setSelectedUserDetail(user || null)
    } else {
      setSelectedUserDetail(null)
    }
  }, [selectedUser, users])

  const handleRunSimulation = async () => {
    if (!selectedUser) {
      setError('Please select a user first')
      return
    }

    setError(null)
    setIsRunningSimulation(true)
    setSimulationResult(null)

    try {
      const result = await simulateMatches({
        userId: selectedUser,
        eventId: params.eventId,
        customPrompt
      })

      setSimulationResult(result)
    } catch (err) {
      console.error('Error running simulation:', err)
      setError('Error running simulation. Please try again.')
    } finally {
      setIsRunningSimulation(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Match-Making Simulator</h1>

      <div className="grid grid-cols-1 gap-8">
        {/* User Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Select User</CardTitle>
            <CardDescription>
              Choose a user to simulate matchmaking for
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingUsers ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a user" />
                </SelectTrigger>
                <SelectContent>
                  {users.map(user => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {selectedUserDetail && (
              <Accordion type="single" collapsible className="mt-4">
                <AccordionItem value="user-details">
                  <AccordionTrigger>User Profile Details</AccordionTrigger>
                  <AccordionContent>
                    <div className="p-4 rounded-md mt-2 max-h-96 overflow-auto">
                      <p className="whitespace-pre-wrap">
                        {selectedUserDetail.userDetailedProfile}
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </CardContent>
        </Card>

        {/* Prompt Customization */}
        <Card>
          <CardHeader>
            <CardTitle>Step 2: Customize Embedding Prompt</CardTitle>
            <CardDescription>
              Modify the prompt used to generate the embedding search string
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              className="h-48"
              placeholder="Enter your custom prompt here. Leave empty to use the default prompt."
              defaultValue={DEFAULT_EMBEDDING_PROMPT}
              onChange={e => setCustomPrompt(e.target.value)}
            />
            <p className="text-sm text-slate-500 mt-2">
              Variables you can use in your prompt:{' '}
              <code>{'${event.description}'}</code> and{' '}
              <code>{'${user.userDetailedProfile}'}</code>
            </p>
          </CardContent>
        </Card>

        {/* Run Simulation */}
        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={handleRunSimulation}
            disabled={isRunningSimulation || !selectedUser}
          >
            {isRunningSimulation ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Running Simulation...
              </>
            ) : (
              'Run Simulation'
            )}
          </Button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-500">
            {error}
          </div>
        )}

        {/* Simulation Results */}
        {simulationResult && (
          <Card>
            <CardHeader>
              <CardTitle>Simulation Results</CardTitle>
              <CardDescription>
                Embedding search string and matching users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">
                  Generated Search String:
                </h3>
                <div className="p-4  rounded-md">
                  <p className="whitespace-pre-wrap">
                    {simulationResult.searchString}
                  </p>
                </div>
              </div>

              <h3 className="text-lg font-medium mb-4">Top Matches:</h3>
              {simulationResult.matchUsers.length === 0 ? (
                <p className="text-slate-500">No matches found.</p>
              ) : (
                <div className="space-y-4">
                  {simulationResult.matchUsers.map(
                    (match, index) =>
                      match && (
                        <Accordion key={match.id} type="single" collapsible>
                          <AccordionItem value={`match-${index}`}>
                            <AccordionTrigger>
                              <div className="flex text-left">
                                <span className="font-medium">
                                  {index + 1}. {match.name}
                                </span>
                                <span className="ml-2 text-slate-500">
                                  ({match.email})
                                </span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="p-4  rounded-md mt-2 max-h-96 overflow-auto">
                                <p className="whitespace-pre-wrap">
                                  {match.userDetailedProfile}
                                </p>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      )
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
