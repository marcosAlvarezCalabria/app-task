import { z } from 'zod'

// Schema para login con magic link
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Ingresa un email válido')
    .max(254, 'El email es demasiado largo'),
})

export type LoginInput = z.infer<typeof loginSchema>

// Schema para crear/editar una tarea
export const tareaSchema = z.object({
  titulo: z
    .string()
    .min(1, 'El título es requerido')
    .min(3, 'El título debe tener al menos 3 caracteres')
    .max(200, 'El título no puede superar 200 caracteres')
    .trim(),

  descripcion: z
    .string()
    .max(2000, 'La descripción no puede superar 2000 caracteres')
    .trim()
    .optional()
    .or(z.literal('')),

  fecha_vencimiento: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val === '') return true
        const date = new Date(val)
        return !isNaN(date.getTime())
      },
      { message: 'Fecha de vencimiento inválida' }
    ),

  prioridad: z.enum(['alta', 'media', 'baja'], {
    errorMap: () => ({ message: 'Prioridad debe ser: alta, media o baja' }),
  }),

  tags: z
    .array(
      z.string().min(1).max(50).trim()
    )
    .max(10, 'Máximo 10 etiquetas permitidas')
    .default([]),

  estado: z.enum(['pendiente', 'completada'], {
    errorMap: () => ({ message: 'Estado debe ser: pendiente o completada' }),
  }),
})

export type TareaFormInput = z.infer<typeof tareaSchema>

// Schema para los filtros
export const filtrosSchema = z.object({
  estado: z.enum(['todas', 'pendiente', 'completada']).default('todas'),
  prioridad: z.enum(['todas', 'alta', 'media', 'baja']).default('todas'),
  tag: z.string().optional(),
  busqueda: z.string().max(200).optional(),
})

export type FiltrosInput = z.infer<typeof filtrosSchema>

// Schema para un tag individual (para el input de tags)
export const tagSchema = z
  .string()
  .min(1, 'La etiqueta no puede estar vacía')
  .max(50, 'La etiqueta no puede superar 50 caracteres')
  .trim()
  .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\-_\s]+$/, 'La etiqueta solo puede contener letras, números, guiones y espacios')
