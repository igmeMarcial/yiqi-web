'use client'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import {
  Building2,
  Mail,
  Phone,
  User,
  Briefcase,
  Linkedin,
  Instagram,
  Globe,
  FileText,
  BellOff,
  Shield,
  Loader2,
  Save,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { updateUserProfile } from '@/services/actions/userActions'
import { UploadToS3 } from '@/lib/uploadToS3'
import ProfilePictureUpload from './UpdatePictureUpload'
import DeleteAccountDialog from './DeleteAccountDialog'
import { Input } from '../ui/input'
import {
  profileWithPrivacySchema,
  ProfileWithPrivacy
} from '@/schemas/userSchema'
import { translations } from '@/lib/translations/translations'

function UpdateProfileForm({ user }: { user: ProfileWithPrivacy }) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<ProfileWithPrivacy>({
    resolver: zodResolver(profileWithPrivacySchema),
    defaultValues: {
      ...user,
      name: user.name ?? '',
      email: user.email ?? '',
      phoneNumber: user.phoneNumber ?? '',
      company: user.company ?? '',
      position: user.position ?? '',
      shortDescription: user.shortDescription ?? '',
      linkedin: user.linkedin ?? '',
      x: user.x ?? '',
      instagram: user.instagram ?? '',
      website: user.website ?? '',
      stopCommunication: user.stopCommunication ?? false,
      picture: null
    }
  })

  async function onSubmit(data: ProfileWithPrivacy) {
    setIsLoading(true)
    try {
      let imageUrl: string | null = null
      if (data.picture instanceof File) {
        try {
          imageUrl = await UploadToS3(data.picture)
        } catch (error) {
          console.log(error)
          setIsLoading(false)
          return
        }
      }
      const profileData: ProfileWithPrivacy = {
        ...data,
        picture: imageUrl ?? user.picture,
        id: user.id
      }

      const result = await updateUserProfile(profileData)
      if (result.success) {
        router.refresh()
        toast({
          description: translations.es.profileUpdated,
          variant: 'default'
        })
      } else {
        toast({
          title: translations.es.error,
          description: translations.es.updateFailed,
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.log(error)
      toast({
        title: translations.es.error,
        description: translations.es.somethingWentWrong,
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const renderPrivacySwitch = (
    field: keyof ProfileWithPrivacy['privacySettings'],
    label: string
  ) => (
    <div className="flex items-center justify-between">
      <FormLabel>{label}</FormLabel>
      <div className="flex items-center justify-between gap-2">
        <FormLabel>Set to Public</FormLabel>
        <Switch
          checked={form.watch(`privacySettings.${field}`)}
          onCheckedChange={checked =>
            form.setValue(`privacySettings.${field}`, checked, {
              shouldDirty: true
            })
          }
        />
      </div>
    </div>
  )

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const handleProfilePictureChange = useCallback(
    (file: File) => {
      form.setValue('picture', file, { shouldDirty: true })
    },
    [form]
  )
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container max-w-4xl pb-10 mx-auto"
    >
      <Card className="bg-transparent border-none">
        <CardHeader>
          <CardTitle className="text-2xl">
            {translations.es.profileSettings}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <ProfilePictureUpload
                currentValue={form.watch('picture')}
                onChange={handleProfilePictureChange}
                name={form.watch('name')}
                userPicture={user.picture ?? ''}
              />

              <Separator />

              {/* Basic Information */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid gap-6 md:grid-cols-2"
              >
                {/* {FORM_SECTIONS.basic.map(renderFormField)} */}
                <div>
                  <FormField
                    control={form.control}
                    name={'name'}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{translations.es.name}</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="text"
                              className="pl-9 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                              placeholder={translations.es.enterYourName}
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name={'email'}
                    render={({ field }) => (
                      <FormItem>
                        {renderPrivacySwitch('email', translations.es.email)}
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="text"
                              className="pl-9 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                              placeholder={translations.es.enterYourEmail}
                              disabled
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name={'phoneNumber'}
                    render={({ field }) => (
                      <FormItem>
                        {renderPrivacySwitch(
                          'phoneNumber',
                          translations.es.phoneNumber
                        )}
                        <FormControl>
                          <div className="relative">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="text"
                              className="pl-9 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                              placeholder="+1234567890"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name={'company'}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{translations.es.company}</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="text"
                              className="pl-9 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                              placeholder={translations.es.enterCompany}
                              {...field}
                              value={field.value ?? ''}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </motion.div>

              <Separator />

              {/* Professional Information */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-6"
              >
                <div>
                  <FormField
                    control={form.control}
                    name={'position'}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{translations.es.position}</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="text"
                              className="pl-9 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                              placeholder={translations.es.enterPosition}
                              {...field}
                              value={field.value ?? ''}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <FormLabel>{translations.es.bio}</FormLabel>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Textarea
                      {...form.register('shortDescription')}
                      className="min-h-[100px] pl-9 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                      placeholder={translations.es.tellUsAboutYourself}
                      value={form.watch('shortDescription') ?? ''}
                    />
                  </div>
                </div>
              </motion.div>

              <Separator />

              {/* Social Links */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid gap-6 md:grid-cols-2"
              >
                <div>
                  <FormField
                    control={form.control}
                    name={'x'}
                    render={({ field }) => (
                      <FormItem>
                        {renderPrivacySwitch('x', 'X')}
                        <FormControl>
                          <div className="relative">
                            <X className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="text"
                              className="pl-9 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                              placeholder={translations.es.enterYourX}
                              {...field}
                              value={field.value ?? ''}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name={'linkedin'}
                    render={({ field }) => (
                      <FormItem>
                        {renderPrivacySwitch('linkedin', 'Linkedin')}
                        <FormControl>
                          <div className="relative">
                            <Linkedin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="text"
                              className="pl-9 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                              placeholder={translations.es.enterLinkedinURL}
                              {...field}
                              value={field.value ?? ''}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name={'instagram'}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instagram</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Instagram className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="text"
                              className="pl-9 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                              placeholder={translations.es.enterInstagramURL}
                              {...field}
                              value={field.value ?? ''}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name={'website'}
                    render={({ field }) => (
                      <FormItem>
                        {renderPrivacySwitch(
                          'website',
                          translations.es.website
                        )}
                        <FormControl>
                          <div className="relative">
                            <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="text"
                              className="pl-9 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                              placeholder={translations.es.enterWebsiteURL}
                              {...field}
                              value={field.value ?? ''}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </motion.div>

              <Separator />

              {/* Preferences */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-6"
              >
                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <div className="text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <BellOff className="h-4 w-4" />
                        {translations.es.stopCommunications}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {translations.es.disableCommunications}
                    </div>
                  </div>
                  <Switch
                    checked={form.watch('stopCommunication')}
                    onCheckedChange={checked =>
                      form.setValue('stopCommunication', checked, {
                        shouldDirty: true
                      })
                    }
                  />
                </div>

                <div className="flex items-center gap-2 rounded-lg border p-4">
                  <Shield className="h-4 w-4" />
                  <div className="flex-1">{translations.es.role}</div>
                  <Badge>User</Badge>
                </div>
              </motion.div>

              <div className="flex items-center justify-between">
                <DeleteAccountDialog />
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>{translations.es.saving}</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>{translations.es.saveChanges}</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default UpdateProfileForm
