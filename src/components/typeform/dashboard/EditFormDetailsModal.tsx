'use client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

import { Textarea } from '@/components/ui/textarea'
import { translations } from '@/lib/translations/translations'
import { Edit2 } from 'lucide-react'
import { useState } from 'react'

interface EditFormDetailsModalProps {
  formName: string
  formDescription: string
  onSave: (name: string, description: string) => void
}
export function EditFormDetailsModal({
  formName,
  formDescription,
  onSave
}: EditFormDetailsModalProps) {
  const [name, setName] = useState(formName)
  const [description, setDescription] = useState(formDescription)
  const [nameError, setNameError] = useState(false)
  const [open, setOpen] = useState(false)

  const handleSave = () => {
    if (!name.trim()) {
      setNameError(true)
      return
    }
    setNameError(false)
    onSave(name, description)
    setOpen(false)
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-auto p-0 group relative text-gray-400 hover:text-gray-100 transition-colors duration-200"
        >
          <span className="text-[12px] font-medium md:text-base md:font-semibold lg:text-lg lg:font-bold truncate max-w-[200px] group-hover:opacity-0 transition-opacity duration-200">
            {formName}
          </span>
          <span className="absolute left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center">
            <span className=" text-[12px] font-medium md:text-base md:font-semibold lg:text-lg lg:font-bold truncate max-w-[200px]">
              {formName}
            </span>
            <Edit2 className="h-3.5 w-3.5 ml-2" />
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] overflow-hidden border border-secondary/20 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/50 to-background  opacity-95 backdrop-blur-sm -z-10" />
        <DialogHeader>
          <DialogTitle className="text-slate-100 text-xl font-semibold">
            {translations.es.editFormDetails}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-5 py-4">
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="text-sm font-medium text-slate-300"
            >
              {translations.es.formName}
              <span className="text-red-400">*</span>
            </label>
            <Input
              id="name"
              value={name}
              onChange={e => {
                setName(e.target.value)
                setNameError(false)
              }}
              className={`bg-[#1a1a1a] border-[#2a2a2a] text-gray-100 
                placeholder:text-gray-500 focus-visible:ring-gray-400 
                focus-visible:border-gray-600 transition-all duration-200
                ${nameError ? 'border-red-400 focus-visible:ring-red-400' : ''}`}
              placeholder={translations.es.formName}
            />
            {nameError && (
              <p className="text-red-400 text-sm mt-1">
                {translations.es.formNameError}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label
              htmlFor="description"
              className="text-sm font-medium text-slate-300"
            >
              {translations.es.descriptionModal}
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="bg-[#1a1a1a] border-[#2a2a2a] text-gray-100 
                placeholder:text-gray-500 focus-visible:ring-gray-400 
                focus-visible:border-gray-600 transition-all duration-200
                min-h-[120px] resize-none"
              placeholder={translations.es.descriptionModal}
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              onClick={() => setOpen(false)}
              className="text-gray-300 hover:bg-[#2a2a2a] hover:text-gray-100 
              transition-colors duration-200"
            >
              {translations.es.cancelModal}
            </Button>
          </DialogTrigger>
          <Button
            onClick={handleSave}
            className="bg-[#2a2a2a] hover:bg-[#3a3a3a] text-gray-100 
              transition-colors duration-200 px-6"
          >
            {translations.es.saveChangesModal}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
