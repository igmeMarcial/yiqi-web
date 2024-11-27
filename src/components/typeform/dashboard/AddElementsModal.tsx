import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  choiceElements,
  contactInformationElements,
  textInputsElements
} from '../data/fields'
import { FormElement, FormElementType } from '../types/yiqiFormTypes'
import { translations } from '@/lib/translations/translations'

interface FormElementItemProps {
  element: FormElement
  onSelect: (elementType: string) => void
}

export function FormElementItem({ element, onSelect }: FormElementItemProps) {
  return (
    <CommandItem
      key={element.elementType}
      onSelect={() => onSelect(element.elementType)}
      className="flex items-center gap-2 p-2 cursor-pointer data-[selected=true]:bg-secondary/40 hover:bg-secondary/40 rounded-md"
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <element.icon className="h-4 w-4" />
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="font-medium text-sm">{element.label}</span>
        <span className="text-xs text-muted-foreground">
          {element.description}
        </span>
      </div>
    </CommandItem>
  )
}

interface AddElementsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onElementSelect: (elementType: FormElementType) => void
}

export function AddElementsModal({
  open,
  onOpenChange,
  onElementSelect
}: AddElementsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:max-w-[700px] bg-gradient-to-br from-secondary/50 to-background border-secondary/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-tight">
            {translations.es.addElementsTitle}
          </DialogTitle>
        </DialogHeader>

        <Command className="rounded-lg border border-secondary/20 bg-secondary/30 ">
          <CommandInput
            placeholder={translations.es.searchPlaceholder}
            className="border-secondary/20"
          />

          <ScrollArea className="h-full rounded-md p-4">
            <CommandList>
              <CommandEmpty>{translations.es.noElementsFound}</CommandEmpty>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <CommandGroup
                    heading={translations.es.textGroup}
                    className="space-y-2"
                  >
                    {textInputsElements.map(element => (
                      <FormElementItem
                        key={element.elementType}
                        element={element}
                        onSelect={() => onElementSelect(element.elementType)}
                      />
                    ))}
                  </CommandGroup>

                  <CommandGroup
                    heading={translations.es.choiceGroup}
                    className="space-y-2"
                  >
                    {choiceElements.map(element => (
                      <FormElementItem
                        key={element.elementType}
                        element={element}
                        onSelect={() => onElementSelect(element.elementType)}
                      />
                    ))}
                  </CommandGroup>
                </div>
                <div className="space-y-6">
                  {' '}
                  <CommandGroup
                    heading={translations.es.contactInfoGroup}
                    className="space-y-2"
                  >
                    {contactInformationElements.map(element => (
                      <FormElementItem
                        key={element.elementType}
                        element={element}
                        onSelect={() => onElementSelect(element.elementType)}
                      />
                    ))}
                  </CommandGroup>
                </div>
              </div>
            </CommandList>
          </ScrollArea>
        </Command>
      </DialogContent>
    </Dialog>
  )
}
