'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  FileText,
  Loader2,
  ArrowRight,
  ArrowLeft,
  Upload,
  Check,
  AlertCircle
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useOnboardingState } from './useOnboardingState'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useEffect, useState } from 'react'
import type { ProfileWithPrivacy } from '@/schemas/userSchema'
import { getUserProfile } from '@/services/actions/userActions'

type OnboardingQuestionnaireProps = {
  userId: string
  userProfile: ProfileWithPrivacy | null
}

export default function OnboardingQuestionnaire({
  userId,
  userProfile
}: OnboardingQuestionnaireProps) {
  const [processedUser, setProcessedUser] = useState<ProfileWithPrivacy | null>(
    userProfile
  )
  const t = useTranslations('Onboarding')

  // Debug translation
  console.log('Translation check:')
  console.log('fileAlreadyUploaded:', t('fileAlreadyUploaded'))
  console.log('uploadNewFilePrompt:', t('uploadNewFilePrompt'))

  const {
    // State
    currentStep,
    isSubmitting,
    formData,
    selectedOptions,
    customResponses,
    isProcessingFile,
    selectedFile,
    processingStatus,
    processingError,
    contentRef,
    steps,
    currentProgress,

    // Handlers
    handleFileChange,
    handleRadioChange,
    handleCheckboxChange,
    handleCustomResponseChange,
    handleNext,
    handlePrevious,
    handleSkip,
    handleComplete
  } = useOnboardingState(userId, userProfile)

  // Fetch processed user data when showing completion step
  useEffect(() => {
    if (steps[currentStep].type === 'complete' && !isSubmitting) {
      getUserProfile(userId)
        .then(userData => {
          if (userData) {
            setProcessedUser(userData)
          }
        })
        .catch(error => {
          console.error('Error fetching processed user data:', error)
        })
    }
  }, [currentStep, isSubmitting, userId, steps])

  // Debug hook for monitoring data
  useEffect(() => {
    console.log('Debug: Form Data:', formData)
    console.log('Debug: Selected Options:', selectedOptions)
    console.log('Debug: User Profile:', userProfile)
  }, [formData, selectedOptions, userProfile])

  // Check if a PDF file is currently being processed
  const isPdfProcessing =
    isProcessingFile && selectedFile?.type === 'application/pdf'

  // Determine if we can proceed with the form despite file processing
  const canProceedWithProcessingPdf =
    isPdfProcessing && formData.resumeUrl && formData.resumeFileName

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col relative">
      {/* Progress bar and step counter */}
      <div className="sticky top-0 left-0 right-0 bg-background z-50 border-b shadow-sm">
        <div className="flex items-center justify-between px-4 py-2 max-w-3xl mx-auto w-full">
          <span className="text-sm font-medium">
            Step {currentStep + 1} of {steps.length}
          </span>
          <span className="text-sm font-medium">
            {Math.round(currentProgress)}%
          </span>
        </div>
        <div className="h-2 bg-gray-200 w-full">
          <div
            className="h-full bg-primary transition-all duration-300 ease-in-out"
            style={{ width: `${currentProgress}%` }}
          />
        </div>
      </div>

      <div
        ref={contentRef}
        className="flex-1 overflow-y-auto py-8 px-4 md:px-8 max-w-3xl mx-auto w-full"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col min-h-[60vh] justify-center"
          >
            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold">
                {steps[currentStep].title}
              </h2>
              <p className="text-muted-foreground">
                {steps[currentStep].description}
              </p>

              {/* PDF background processing alert */}
              {formData.resumeUrl && isPdfProcessing && currentStep > 1 && (
                <Alert className="bg-blue-50 border-blue-200 mt-4">
                  <AlertCircle className="h-4 w-4 text-blue-500" />
                  <AlertDescription className="text-blue-700">
                    {t('pdfBackgroundProcessing')}
                  </AlertDescription>
                </Alert>
              )}

              <div className="mt-8 space-y-6">
                {steps[currentStep].type === 'file' && (
                  <div className="space-y-4">
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-primary transition-colors">
                      <Input
                        type="file"
                        accept=".pdf,.txt,.docx"
                        onChange={handleFileChange}
                        className="hidden"
                        id="resume-upload"
                        disabled={isProcessingFile}
                      />
                      <label
                        htmlFor="resume-upload"
                        className="cursor-pointer text-center"
                      >
                        {isProcessingFile ? (
                          <div className="space-y-3">
                            <Loader2 className="h-8 w-8 mx-auto animate-spin text-primary" />
                            <p>{processingStatus || t('processingFile')}</p>
                            {selectedFile?.type === 'application/pdf' && (
                              <p className="text-sm text-blue-600">
                                {t('pdfProcessingNote')}
                              </p>
                            )}
                            {processingStatus && (
                              <div className="w-full max-w-xs mx-auto bg-gray-200 rounded-full h-1.5 mt-2">
                                <div
                                  className="bg-primary h-1.5 rounded-full animate-pulse"
                                  style={{ width: '100%' }}
                                ></div>
                              </div>
                            )}
                          </div>
                        ) : formData.resumeUrl && !isProcessingFile ? (
                          <div className="space-y-3">
                            <FileText className="h-8 w-8 mx-auto text-primary" />
                            <p className="font-medium">
                              {formData.resumeFileName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {t('fileAlreadyUploaded')}
                            </p>
                            <p className="text-sm text-blue-600">
                              {t('uploadNewFilePrompt')}
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <Upload className="h-8 w-8 mx-auto text-primary" />
                            <p className="font-medium">
                              {t('dragOrClickResume')}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {t('supportedFormats')}
                            </p>
                          </div>
                        )}
                      </label>
                    </div>

                    {processingError && !isProcessingFile && (
                      <div className="text-sm text-red-500 mt-2 p-2 border border-red-200 rounded bg-red-50">
                        <p className="font-medium">Error: {processingError}</p>
                        <p className="mt-1">{t('tryAgainOrDifferentFile')}</p>
                      </div>
                    )}

                    {selectedFile && !isProcessingFile && !processingError && (
                      <div className="flex items-center space-x-2 bg-muted p-3 rounded-md">
                        <FileText className="h-5 w-5 text-primary" />
                        <span className="text-sm font-medium flex-1">
                          {selectedFile.name}
                        </span>
                        <Check className="h-5 w-5 text-green-500" />
                      </div>
                    )}

                    {/* For PDFs that are in progress, show a special status */}
                    {canProceedWithProcessingPdf && (
                      <div className="mt-4">
                        <Alert className="bg-blue-50 border-blue-200">
                          <AlertCircle className="h-4 w-4 text-blue-500" />
                          <AlertDescription className="text-blue-700">
                            {t('pdfUploadedContinue')}
                          </AlertDescription>
                        </Alert>
                      </div>
                    )}
                  </div>
                )}

                {steps[currentStep].type === 'radio' && (
                  <div className="space-y-4">
                    <RadioGroup
                      value={selectedOptions[steps[currentStep].id]?.[0] || ''}
                      onValueChange={value =>
                        handleRadioChange(steps[currentStep].id, value)
                      }
                      className="space-y-3"
                    >
                      {steps[currentStep].options?.map(option => (
                        <div
                          key={option.value}
                          className="flex items-center space-x-2"
                        >
                          <RadioGroupItem
                            value={option.value}
                            id={`${steps[currentStep].id}-${option.value}`}
                          />
                          <Label
                            htmlFor={`${steps[currentStep].id}-${option.value}`}
                            className="text-base cursor-pointer"
                          >
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>

                    {selectedOptions[steps[currentStep].id]?.includes(
                      'other'
                    ) && (
                      <Textarea
                        placeholder={t('specifyOther')}
                        value={customResponses[steps[currentStep].id] || ''}
                        onChange={e =>
                          handleCustomResponseChange(
                            steps[currentStep].id,
                            e.target.value
                          )
                        }
                        className="mt-3"
                      />
                    )}
                  </div>
                )}

                {steps[currentStep].type === 'checkbox' && (
                  <div className="space-y-4">
                    {steps[currentStep].options?.map(option => (
                      <div
                        key={option.value}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`${steps[currentStep].id}-${option.value}`}
                          checked={(
                            selectedOptions[steps[currentStep].id] || []
                          ).includes(option.value)}
                          onCheckedChange={checked =>
                            handleCheckboxChange(
                              steps[currentStep].id,
                              option.value,
                              checked === true
                            )
                          }
                        />
                        <Label
                          htmlFor={`${steps[currentStep].id}-${option.value}`}
                          className="text-base cursor-pointer"
                        >
                          {option.label}
                        </Label>
                      </div>
                    ))}

                    {(selectedOptions[steps[currentStep].id] || []).includes(
                      'other'
                    ) && (
                      <Textarea
                        placeholder={t('specifyOther')}
                        value={customResponses[steps[currentStep].id] || ''}
                        onChange={e =>
                          handleCustomResponseChange(
                            steps[currentStep].id,
                            e.target.value
                          )
                        }
                        className="mt-3"
                      />
                    )}
                  </div>
                )}

                {currentStep === steps.length - 1 && (
                  <div className="space-y-6">
                    <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
                      <h3 className="text-lg font-semibold mb-4">
                        {t('profileSummary')}
                      </h3>
                      <div className="space-y-4">
                        <div className="grid gap-3">
                          {formData.resumeUrl && (
                            <div>
                              <span className="font-medium">
                                {t('resume')}:{' '}
                              </span>
                              <span className="text-muted-foreground">
                                {formData.resumeFileName}
                              </span>
                            </div>
                          )}
                          <div>
                            <span className="font-medium">
                              {t('professionalMotivations')}:{' '}
                            </span>
                            <span className="text-muted-foreground">
                              {selectedOptions.professionalMotivations?.join(
                                ', '
                              )}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">
                              {t('communicationStyle')}:{' '}
                            </span>
                            <span className="text-muted-foreground">
                              {selectedOptions.communicationStyle?.join(', ')}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">
                              {t('professionalValues')}:{' '}
                            </span>
                            <span className="text-muted-foreground">
                              {selectedOptions.professionalValues?.join(', ')}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">
                              {t('careerAspirations')}:{' '}
                            </span>
                            <span className="text-muted-foreground">
                              {selectedOptions.careerAspirations?.join(', ')}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">
                              {t('significantChallenge')}:{' '}
                            </span>
                            <span className="text-muted-foreground">
                              {selectedOptions.significantChallenge?.join(', ')}
                            </span>
                          </div>
                        </div>

                        {isSubmitting && (
                          <div className="mt-6 space-y-4">
                            <div className="flex items-center space-x-3">
                              <Loader2 className="h-5 w-5 animate-spin text-primary" />
                              <p className="text-sm text-muted-foreground">
                                {t('processingProfileData')}
                              </p>
                            </div>
                            <div className="h-1 w-full bg-secondary overflow-hidden rounded-full">
                              <div
                                className="h-full bg-primary transition-all duration-300 ease-in-out animate-pulse"
                                style={{ width: '100%' }}
                              />
                            </div>
                          </div>
                        )}

                        {!isSubmitting &&
                          processedUser?.userDetailedProfile && (
                            <div className="mt-6 space-y-4">
                              <div>
                                <h4 className="font-medium mb-2">
                                  {t('processedProfile')}
                                </h4>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                  {processedUser.userDetailedProfile}
                                </p>
                              </div>
                              {processedUser.userContentPreferences && (
                                <div>
                                  <h4 className="font-medium mb-2">
                                    {t('contentPreferences')}
                                  </h4>
                                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                    {processedUser.userContentPreferences}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="sticky bottom-0 left-0 right-0 p-4 bg-background border-t">
        <div className="flex justify-between max-w-3xl mx-auto w-full">
          <div>
            {currentStep > 0 && (
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={isSubmitting}
                className="flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('previous')}
              </Button>
            )}
          </div>

          <div className="flex space-x-3">
            {/* Skip button (unless we're at the end) */}
            {currentStep < steps.length - 1 && (
              <Button
                variant="ghost"
                onClick={handleSkip}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                {t('skipForNow')}
              </Button>
            )}

            {/* Next or Complete button */}
            {currentStep < steps.length - 1 ? (
              <Button
                onClick={handleNext}
                disabled={
                  isSubmitting ||
                  (steps[currentStep].type === 'file' &&
                    !formData.resumeUrl &&
                    currentStep === 1 &&
                    !isProcessingFile &&
                    !canProceedWithProcessingPdf) ||
                  (steps[currentStep].type === 'radio' &&
                    !selectedOptions[steps[currentStep].id]?.length &&
                    currentStep !== 0) ||
                  (selectedOptions[steps[currentStep].id]?.includes('other') &&
                    !customResponses[steps[currentStep].id] &&
                    currentStep !== 0)
                }
                className="flex items-center"
              >
                {t('next')}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={isSubmitting}
                className="flex items-center"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                {t('completeProfile')}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
