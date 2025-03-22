'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'

export enum VariableType {
  USER = 'user',
  MATCH_USER = 'matchUser',
  EVENT = 'event'
}

type VariablesProps = {
  type: VariableType
}

export function AvailableVariables({ type }: VariablesProps) {
  const getTypeName = () => {
    switch (type) {
      case VariableType.USER:
        return 'User Variables'
      case VariableType.MATCH_USER:
        return 'Match User Variables'
      case VariableType.EVENT:
        return 'Event Variables'
      default:
        return 'Variables'
    }
  }

  const getTypeDescription = () => {
    switch (type) {
      case VariableType.USER:
        return 'Variables for the current user'
      case VariableType.MATCH_USER:
        return 'Variables for the matched user'
      case VariableType.EVENT:
        return 'Variables for the event'
      default:
        return ''
    }
  }

  const renderUserVariables = () => (
    <div className="space-y-2">
      <h3 className="font-medium">User Variables</h3>
      <p className="text-sm text-slate-500 mb-1">Basic user properties:</p>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 pl-5 list-disc text-sm">
        <li>
          <code>{'{{user.id}}'}</code> - User ID
        </li>
        <li>
          <code>{'{{user.name}}'}</code> - User name
        </li>
        <li>
          <code>{'{{user.email}}'}</code> - User email
        </li>
        <li>
          <code>{'{{user.picture}}'}</code> - User profile picture URL
        </li>
        <li>
          <code>{'{{user.userDetailedProfile}}'}</code> - User detailed profile
        </li>
        <li>
          <code>{'{{user.userEmbeddableProfile}}'}</code> - User embeddable
          profile
        </li>
        <li>
          <code>{'{{user.userContentPreferences}}'}</code> - User content
          preferences
        </li>
        <li>
          <code>{'{{user.role}}'}</code> - User role (USER, ADMIN, etc.)
        </li>
      </ul>

      <p className="text-sm text-slate-500 mb-1 mt-4">
        Collected data properties (use{' '}
        <code>{'{{user.dataCollected.propertyName}}'}</code>):
      </p>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 pl-5 list-disc text-sm">
        <li>
          <code>{'.company'}</code> - User&apos;s company
        </li>
        <li>
          <code>{'.position'}</code> - User&apos;s position
        </li>
        <li>
          <code>{'.shortDescription'}</code> - Short bio
        </li>
        <li>
          <code>{'.linkedin'}</code> - LinkedIn URL
        </li>
        <li>
          <code>{'.x'}</code> - X/Twitter URL
        </li>
        <li>
          <code>{'.instagram'}</code> - Instagram URL
        </li>
        <li>
          <code>{'.website'}</code> - Personal website URL
        </li>
        <li>
          <code>{'.professionalMotivations'}</code> - Professional motivations
        </li>
        <li>
          <code>{'.communicationStyle'}</code> - Communication style
        </li>
        <li>
          <code>{'.professionalValues'}</code> - Professional values
        </li>
        <li>
          <code>{'.careerAspirations'}</code> - Career aspirations
        </li>
        <li>
          <code>{'.significantChallenge'}</code> - Significant challenge
        </li>
        <li>
          <code>{'.resumeText'}</code> - Resume text
        </li>
      </ul>
    </div>
  )

  const renderMatchUserVariables = () => (
    <div className="space-y-2">
      <h3 className="font-medium">Match User Variables</h3>
      <p className="text-sm text-slate-500 mb-1">
        Basic match user properties:
      </p>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 pl-5 list-disc text-sm">
        <li>
          <code>{'{{matchUser.id}}'}</code> - Match user ID
        </li>
        <li>
          <code>{'{{matchUser.name}}'}</code> - Match user name
        </li>
        <li>
          <code>{'{{matchUser.email}}'}</code> - Match user email
        </li>
        <li>
          <code>{'{{matchUser.picture}}'}</code> - Match user profile picture
          URL
        </li>
        <li>
          <code>{'{{matchUser.userDetailedProfile}}'}</code> - Match user
          detailed profile
        </li>
        <li>
          <code>{'{{matchUser.userEmbeddableProfile}}'}</code> - Match user
          embeddable profile
        </li>
        <li>
          <code>{'{{matchUser.userContentPreferences}}'}</code> - Match user
          content preferences
        </li>
        <li>
          <code>{'{{matchUser.role}}'}</code> - Match user role
        </li>
      </ul>

      <p className="text-sm text-slate-500 mb-1 mt-4">
        Collected data properties (use{' '}
        <code>{'{{matchUser.dataCollected.propertyName}}'}</code>):
      </p>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 pl-5 list-disc text-sm">
        <li>
          <code>{'.company'}</code> - Match user&apos;s company
        </li>
        <li>
          <code>{'.position'}</code> - Match user&apos;s position
        </li>
        <li>
          <code>{'.shortDescription'}</code> - Short bio
        </li>
        <li>
          <code>{'.linkedin'}</code> - LinkedIn URL
        </li>
        <li>
          <code>{'.x'}</code> - X/Twitter URL
        </li>
        <li>
          <code>{'.instagram'}</code> - Instagram URL
        </li>
        <li>
          <code>{'.website'}</code> - Personal website URL
        </li>
        <li>
          <code>{'.professionalMotivations'}</code> - Professional motivations
        </li>
        <li>
          <code>{'.communicationStyle'}</code> - Communication style
        </li>
        <li>
          <code>{'.professionalValues'}</code> - Professional values
        </li>
        <li>
          <code>{'.careerAspirations'}</code> - Career aspirations
        </li>
        <li>
          <code>{'.significantChallenge'}</code> - Significant challenge
        </li>
        <li>
          <code>{'.resumeText'}</code> - Resume text
        </li>
      </ul>
    </div>
  )

  const renderEventVariables = () => (
    <div className="space-y-2">
      <h3 className="font-medium">Event Variables</h3>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 pl-5 list-disc text-sm">
        <li>
          <code>{'{{event.id}}'}</code> - Event ID
        </li>
        <li>
          <code>{'{{event.title}}'}</code> - Event title
        </li>
        <li>
          <code>{'{{event.subtitle}}'}</code> - Event subtitle
        </li>
        <li>
          <code>{'{{event.description}}'}</code> - Event description
        </li>
        <li>
          <code>{'{{event.startDate}}'}</code> - Event start date
        </li>
        <li>
          <code>{'{{event.endDate}}'}</code> - Event end date
        </li>
        <li>
          <code>{'{{event.location}}'}</code> - Event location
        </li>
        <li>
          <code>{'{{event.city}}'}</code> - Event city
        </li>
        <li>
          <code>{'{{event.state}}'}</code> - Event state
        </li>
        <li>
          <code>{'{{event.country}}'}</code> - Event country
        </li>
        <li>
          <code>{'{{event.virtualLink}}'}</code> - Event virtual link
        </li>
      </ul>
    </div>
  )

  const content = () => {
    switch (type) {
      case VariableType.USER:
        return renderUserVariables()
      case VariableType.MATCH_USER:
        return renderMatchUserVariables()
      case VariableType.EVENT:
        return renderEventVariables()
      default:
        return null
    }
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="variables">
        <AccordionTrigger>
          <div className="flex flex-col items-start text-left">
            <span className="text-sm font-medium">{getTypeName()}</span>
            <span className="text-xs text-slate-500">
              {getTypeDescription()}
            </span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="p-4 border rounded-md text-sm">
            {content()}
            <div className="mt-4 pt-4 border-t text-xs text-slate-500">
              <p>
                Use these variables in your prompts with the syntax shown above
                to dynamically insert values.
              </p>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
