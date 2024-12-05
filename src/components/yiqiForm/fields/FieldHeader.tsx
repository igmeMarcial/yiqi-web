import React, { useCallback, useMemo } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

import { FormProps, InputTypes } from '../yiqiTypes'
import { ExtendedCardProps } from '../FormBuild'
import { cn } from '@/lib/utils'

const FieldHeader = ({
  id,
  isTitle,
  fields,
  typeChange,
  setTitle
}: Pick<
  ExtendedCardProps,
  'id' | 'isTitle' | 'fields' | 'typeChange' | 'setTitle'
>) => {
  const { control, register } = useForm()
  const currentField = useMemo(
    () => fields.find(field => field.id === id) as FormProps,
    [fields, id]
  )

  const isFocused = useMemo(
    () => currentField?.isFocused ?? false,
    [currentField]
  )

  const fieldTitle = useMemo(
    () => currentField?.cardTitle ?? '',
    [currentField]
  )

  const handleCardTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(id, e.target.value)
    },
    [id, setTitle]
  )

  const handleInputTypeChange = useCallback(
    (value: InputTypes) => {
      typeChange(id, value)
    },
    [id, typeChange]
  )

  const inputClasses = useMemo(
    () =>
      cn(
        'border-b rounded-sm  focus-visible:ring-0',
        'w-full',
        'px-2 py-1',
        'dark:bg-transparent dark:text-white',
        'placeholder:text-gray-400',
        isTitle ? 'text-2xl sm:text-3xl font-medium' : 'text-base',
        isFocused ? 'bg-gray-50 dark:bg-gray-800' : 'bg-transparent'
      ),
    [isTitle, isFocused]
  )

  const containerAnimation = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.2 }
  }

  const selectAnimation = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.2 }
  }

  return (
    <div className="flex w-full flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 ">
      <Controller
        name="CardTitle"
        control={control}
        render={() => (
          <motion.div
            {...containerAnimation}
            className={cn('w-full', !isTitle && 'sm:w-[492px]')}
          >
            <Input
              {...register(id)}
              className={inputClasses}
              value={fieldTitle}
              onChange={handleCardTitleChange}
              placeholder={isTitle ? 'Título del formulario' : 'Pregunta'}
            />
          </motion.div>
        )}
      />

      {!isTitle && isFocused && (
        <Controller
          name="inputTypeSelect"
          control={control}
          render={() => (
            <motion.div {...selectAnimation} className="w-full sm:w-[208px]">
              <Select
                defaultValue={InputTypes.RADIO}
                onValueChange={handleInputTypeChange}
              >
                <SelectTrigger
                  className={cn(
                    'h-8 sm:h-10',
                    'border-slate-200 dark:border-slate-700',
                    'bg-white dark:bg-slate-900',
                    'hover:bg-slate-50 dark:hover:bg-slate-800',
                    'focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20',
                    'transition-colors duration-200'
                  )}
                >
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={InputTypes.TEXT}>Texto corto</SelectItem>
                  <SelectItem value={InputTypes.TEXTAREA}>
                    Text Largo
                  </SelectItem>
                  <SelectItem value={InputTypes.RADIO}>
                    Opción múltiple
                  </SelectItem>
                  <SelectItem value={InputTypes.CHECKBOX}>
                    Casilla de verificación
                  </SelectItem>
                  <SelectItem value={InputTypes.SELECT}>
                    Menú desplegable
                  </SelectItem>
                </SelectContent>
              </Select>
            </motion.div>
          )}
        />
      )}
    </div>
  )
}

export default React.memo(FieldHeader)
