import { z } from 'zod'

// Define the form element types
const FormElementSchema = z.enum([
  'longText',
  'shortText',
  'email',
  'phoneNumber',
  'address',
  'website',
  'video',
  'multipleChoice',
  'dropdown',
  'pictureChoice',
  'yesNo',
  'date',
  'number',
  'rating',
  'fileUpload'
])
export type FormElementType = z.infer<typeof FormElementSchema>
// Define a simple option schema
const OptionSchema = z.object({
  label: z.string(),
  value: z.string(),
  image: z.string().optional()
})

export interface FormElement {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  label: string
  description: string
  elementType: FormElementType
}
// Define the condition schema for conditional logic
const ConditionSchema = z.object({
  field: z.string(),
  operator: z.enum(['equals', 'notEquals', 'contains']),
  value: z.string()
})

// Define the full FormField Zod schema
export const FormFieldSchema = z.object({
  id: z.string(),
  elementType: FormElementSchema,
  question: z.string(),
  name: z.string(),
  description: z.string().optional(),
  summary: z.string().optional(),
  required: z.boolean().optional(),
  validation: z
    .enum(['email', 'phone', 'required', 'minLength', 'maxLength'])
    .optional(),
  defaultValue: z.string().optional(),
  placeholder: z.string().optional(),
  minValue: z.string().optional(),
  maxValue: z.string().optional(),
  accept: z.string().optional(),
  maxFileSize: z.string().optional(),
  options: z.array(OptionSchema).optional(),
  rating: z.number().optional(),
  conditionalLogic: z
    .object({
      show: z.boolean().optional(),
      conditions: z.array(ConditionSchema).optional(),
      logicOperator: z.enum(['AND', 'OR']).optional()
    })
    .optional(),
  cssClass: z.string().optional(),
  hint: z.string().optional(),
  multiple: z.boolean().optional(),
  pattern: z.string().optional(),
  dependencyField: z.string().optional(),
  phoneConfig: z
    .object({
      selectedCountryId: z.string().optional(),
      countryList: z
        .array(
          z.object({
            id: z.string(),
            name: z.string(),
            code: z.string(),
            flag: z.string(),
            placeholder: z.string(),
            example: z.string(),
            format: z.string()
          })
        )
        .optional()
    })
    .optional()
})

// Type inference
export type FormField = z.infer<typeof FormFieldSchema>

/**
 * conditionalLogic: Permite mostrar u ocultar un campo según condiciones específicas basadas en otros campos.
 * Incluye:
 *  - show: Indica si el campo debería mostrarse en función de las condiciones.
 *  - conditions: Un array de condiciones que determinan la visibilidad del campo. Cada condición tiene:
 *    - field: El nombre del campo que se evalúa.
 *    - operator: El operador de comparación (`equals`, `notEquals`, etc.) usado para evaluar la condición.
 *    - value: El valor con el que se compara el campo especificado.
 *  - logicOperator: Define cómo se combinan múltiples condiciones (`AND` o `OR`).
 */
/**
 * hint: Es un mensaje breve de ayuda o pista que se muestra al usuario,
 * generalmente en un ícono de información. Útil para aclarar detalles o restricciones del campo.
 */

/**
 * cssClass: Permite asignar clases CSS personalizadas al campo para aplicar estilos específicos,
 * mejorando la presentación visual del formulario.
 */

/**
 * multiple: Indica si se pueden seleccionar múltiples valores en el campo.
 * Generalmente se usa para listas desplegables con opción múltiple o checkboxes.
 */

/**
 * pattern: Define una expresión regular que debe cumplir el valor ingresado en el campo.
 * Sirve para validaciones específicas, como formatos de números o patrones de texto.
 */

/**
 * dependencyField: Indica que el campo depende de la entrada de otro campo en el formulario.
 * Es útil para manejar dependencias y lógicas condicionales complejas entre campos.
 */

/**
 * phoneConfig: Configuración específica para campos de tipo phoneNumber.
 * Incluye la selección de país y otros detalles relevantes para la entrada de un número de teléfono.
 */

export const FormStatus = z.enum(['draft', 'published', 'archived'])

// Schema for Thank You Page Settings
const ThankYouPageSchema = z.object({
  message: z.string(),
  redirectUrl: z.string().optional()
})

// Schema for Form Settings
const FormSettingsSchema = z.object({
  allowMultipleSubmissions: z.boolean().optional(),
  showProgressBar: z.boolean().optional(),
  requiredErrorMessage: z.string().optional(),
  thankYouPage: ThankYouPageSchema.optional()
})

// Form Schema
export const FormSchema = z.object({
  id: z.string(),
  eventId: z.string().nullable().optional(),
  name: z.string(),
  description: z.string().nullable().optional(),
  fields: z.array(FormFieldSchema),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable().optional(),
  // status: FormStatus,
  settings: FormSettingsSchema.optional()
})

// FormModel Schema (extending Form with organizationId)
export const FormModelSchema = FormSchema.extend({
  organizationId: z.string()
})

// Type inference
export type Form = z.infer<typeof FormSchema>
export type FormModel = z.infer<typeof FormModelSchema>
