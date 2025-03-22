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
  simulateMatches,
  testPromptGeneration
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
import { Loader2, PlusCircle, Trash2 } from 'lucide-react'
import {
  EMBEDDING_TEMPLATE,
  KEY_INSIGHTS_TEMPLATE,
  COLLABORATION_TEMPLATE,
  processUserMatchesSystemPrompt
} from '@/lib/data/processors/prompts'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { v4 as uuidv4 } from 'uuid'
import { AvailableVariables, VariableType } from './AvailableVariables'
import { LuciaUserType } from '@/schemas/userSchema'

type SimulationResult = {
  searchString: string
  processedPrompt: string
  matchUsers: (LuciaUserType | null)[]
}

type CustomPrompt = {
  id: string
  label: string
  prompt: string
}

type PromptResult = {
  id: string
  label: string
  processedPrompt: string
  output: string
}

export default function Simulator({ params }: { params: { eventId: string } }) {
  const [users, setUsers] = useState<LuciaUserType[]>([])
  const [selectedUser, setSelectedUser] = useState<string>('')
  const [customPrompt, setCustomPrompt] = useState(EMBEDDING_TEMPLATE)
  const [selectedUserDetail, setSelectedUserDetail] =
    useState<LuciaUserType | null>(null)
  const [isLoadingUsers, setIsLoadingUsers] = useState(true)
  const [isRunningSimulation, setIsRunningSimulation] = useState(false)
  const [simulationResult, setSimulationResult] =
    useState<SimulationResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Prompt testing states
  const [keyInsightsPrompt, setKeyInsightsPrompt] = useState(
    KEY_INSIGHTS_TEMPLATE
  )
  const [collaborationPrompt, setCollaborationPrompt] = useState(
    COLLABORATION_TEMPLATE
  )
  const [systemPrompt, setSystemPrompt] = useState(
    processUserMatchesSystemPrompt
  )
  const [additionalPrompts, setAdditionalPrompts] = useState<CustomPrompt[]>([])
  const [selectedMatchId, setSelectedMatchId] = useState<string>('')
  const [isTestingPrompts, setIsTestingPrompts] = useState(false)
  const [promptResults, setPromptResults] = useState<PromptResult[]>([])

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
    setSelectedMatchId('')
    setPromptResults([])

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

  const handleAddPrompt = () => {
    setAdditionalPrompts([
      ...additionalPrompts,
      { id: uuidv4(), label: '', prompt: '' }
    ])
  }

  const handleRemovePrompt = (id: string) => {
    setAdditionalPrompts(additionalPrompts.filter(p => p.id !== id))
  }

  const handlePromptLabelChange = (id: string, label: string) => {
    setAdditionalPrompts(
      additionalPrompts.map(p => (p.id === id ? { ...p, label } : p))
    )
  }

  const handlePromptTextChange = (id: string, prompt: string) => {
    setAdditionalPrompts(
      additionalPrompts.map(p => (p.id === id ? { ...p, prompt } : p))
    )
  }

  const handleTestPrompts = async () => {
    if (!selectedUser || !selectedMatchId) {
      setError('Please select a user and a match first')
      return
    }

    setError(null)
    setIsTestingPrompts(true)
    setPromptResults([])

    try {
      // Prepare all prompts for testing
      const prompts = [
        {
          id: 'key-insights',
          label: 'Key Insights',
          prompt: keyInsightsPrompt
        },
        {
          id: 'collaboration',
          label: 'Collaboration Opportunities',
          prompt: collaborationPrompt
        },
        ...additionalPrompts.filter(
          p => p.label.trim() !== '' && p.prompt.trim() !== ''
        )
      ]

      const results = await testPromptGeneration({
        userId: selectedUser,
        matchId: selectedMatchId,
        prompts,
        systemPrompt
      })

      setPromptResults(results)
    } catch (err) {
      console.error('Error testing prompts:', err)
      setError('Error testing prompts. Please try again.')
    } finally {
      setIsTestingPrompts(false)
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
              <div className="p-4 rounded-md mt-2 max-h-96 overflow-auto border">
                <p className="whitespace-pre-wrap">
                  {selectedUserDetail.userDetailedProfile}
                </p>
              </div>
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
              placeholder="Enter your custom prompt here."
              value={customPrompt}
              onChange={e => setCustomPrompt(e.target.value)}
            />
            <div className="mt-3">
              <AvailableVariables type={VariableType.USER} />
            </div>
            <div className="mt-2">
              <AvailableVariables type={VariableType.EVENT} />
            </div>
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
          <div className="p-4 border border-red-200 rounded-md text-red-500">
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
                <div className="p-4 rounded-md">
                  <p className="whitespace-pre-wrap">
                    {simulationResult.searchString}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Processed Prompt:</h3>
                <div className="p-4 rounded-md border">
                  <p className="whitespace-pre-wrap text-sm">
                    {simulationResult.processedPrompt}
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
                        <div
                          key={match.id}
                          className="border rounded-lg overflow-hidden"
                        >
                          <div className="flex items-center justify-between p-4">
                            <div className="flex items-center">
                              <span className="font-medium mr-2">
                                {index + 1}. {match.name}
                              </span>
                              <span className="text-slate-500">
                                ({match.email})
                              </span>
                            </div>
                            <Button
                              variant={
                                selectedMatchId === match.id
                                  ? 'default'
                                  : 'outline'
                              }
                              size="sm"
                              onClick={() => setSelectedMatchId(match.id)}
                              className="ml-auto"
                            >
                              {selectedMatchId === match.id
                                ? 'Selected'
                                : 'Select for Testing'}
                            </Button>
                          </div>
                          <Accordion type="single" collapsible>
                            <AccordionItem
                              value={`match-${index}`}
                              className="border-0"
                            >
                              <AccordionTrigger className="px-4 py-2 hover:no-underline">
                                <span className="text-sm font-medium">
                                  View Profile Details
                                </span>
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="p-4 rounded-md mt-2 max-h-96 overflow-auto border">
                                  <p className="whitespace-pre-wrap">
                                    {match.userDetailedProfile}
                                  </p>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </div>
                      )
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Prompt Testing Section */}
        {simulationResult && simulationResult.matchUsers.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Step 3: Test Match Prompts</CardTitle>
              <CardDescription>
                Customize and test prompts for key insights and collaboration
                opportunities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* System Prompt */}
                <div>
                  <Label className="text-base font-medium">System Prompt</Label>
                  <p className="text-sm text-slate-500 mb-2">
                    This prompt provides context to the AI model for all prompt
                    testing
                  </p>
                  <Textarea
                    className="h-48 mt-2"
                    defaultValue={systemPrompt}
                    onChange={e => setSystemPrompt(e.target.value)}
                  />
                </div>

                {/* Key Insights Prompt */}
                <div>
                  <Label className="text-base font-medium">Key Insights</Label>
                  <Textarea
                    className="h-48 mt-2"
                    defaultValue={keyInsightsPrompt}
                    onChange={e => setKeyInsightsPrompt(e.target.value)}
                  />
                </div>

                {/* Collaboration Prompt */}
                <div>
                  <Label className="text-base font-medium">
                    Collaboration Opportunities
                  </Label>
                  <Textarea
                    className="h-48 mt-2"
                    defaultValue={collaborationPrompt}
                    onChange={e => setCollaborationPrompt(e.target.value)}
                  />
                </div>

                {/* Additional Custom Prompts */}
                {additionalPrompts.map(prompt => (
                  <div key={prompt.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Input
                        placeholder="Prompt Label"
                        value={prompt.label}
                        onChange={e =>
                          handlePromptLabelChange(prompt.id, e.target.value)
                        }
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemovePrompt(prompt.id)}
                      >
                        <Trash2 className="h-5 w-5 text-red-500" />
                      </Button>
                    </div>
                    <Textarea
                      className="h-48"
                      placeholder="Custom prompt content"
                      value={prompt.prompt}
                      onChange={e =>
                        handlePromptTextChange(prompt.id, e.target.value)
                      }
                    />
                  </div>
                ))}

                {/* Add New Prompt Button */}
                <Button
                  variant="outline"
                  onClick={handleAddPrompt}
                  className="w-full"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Custom Prompt
                </Button>

                <div className="pt-4 space-y-3">
                  <AvailableVariables type={VariableType.USER} />
                  <AvailableVariables type={VariableType.MATCH_USER} />

                  <Button
                    onClick={handleTestPrompts}
                    disabled={isTestingPrompts || !selectedMatchId}
                    className="w-full mt-4"
                  >
                    {isTestingPrompts ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Testing Prompts...
                      </>
                    ) : (
                      'Test Prompts'
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Prompt Testing Results */}
        {promptResults.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Prompt Test Results</CardTitle>
              <CardDescription>
                Output from each prompt for the selected match
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {promptResults.map(result => (
                  <div key={result.id} className="border rounded-md p-4">
                    <h3 className="text-lg font-medium mb-2">{result.label}</h3>

                    {/* Show processed prompt */}
                    <Accordion type="single" collapsible className="mb-3">
                      <AccordionItem
                        value="processed-prompt"
                        className="border rounded-md"
                      >
                        <AccordionTrigger className="px-4 py-2 hover:no-underline">
                          <span className="text-sm font-medium">
                            View Processed Prompt
                          </span>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="p-4 rounded-md mt-2 border">
                            <p className="whitespace-pre-wrap text-sm">
                              {result.processedPrompt}
                            </p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>

                    {/* Output */}
                    <div className="p-4 rounded-md border">
                      <p className="whitespace-pre-wrap">{result.output}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
