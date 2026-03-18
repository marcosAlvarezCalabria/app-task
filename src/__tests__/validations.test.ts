import { describe, it, expect } from 'vitest'
import { tareaSchema, loginSchema, tagSchema, filtrosSchema } from '@/lib/validations'

describe('loginSchema', () => {
  it('acepta un email válido', () => {
    const result = loginSchema.safeParse({ email: 'usuario@ejemplo.com' })
    expect(result.success).toBe(true)
  })

  it('rechaza un email inválido', () => {
    const result = loginSchema.safeParse({ email: 'no-es-un-email' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.errors[0].message).toContain('válido')
    }
  })

  it('rechaza email vacío', () => {
    const result = loginSchema.safeParse({ email: '' })
    expect(result.success).toBe(false)
  })
})

describe('tareaSchema', () => {
  const tareaValida = {
    titulo: 'Mi tarea de prueba',
    descripcion: 'Una descripción opcional',
    fecha_vencimiento: '2027-12-31',
    prioridad: 'alta' as const,
    tags: ['trabajo', 'urgente'],
    estado: 'pendiente' as const,
  }

  it('acepta una tarea válida completa', () => {
    const result = tareaSchema.safeParse(tareaValida)
    expect(result.success).toBe(true)
  })

  it('acepta una tarea con solo los campos requeridos', () => {
    const result = tareaSchema.safeParse({
      titulo: 'Solo título',
      prioridad: 'media',
      estado: 'pendiente',
    })
    expect(result.success).toBe(true)
  })

  it('rechaza título vacío', () => {
    const result = tareaSchema.safeParse({ ...tareaValida, titulo: '' })
    expect(result.success).toBe(false)
    if (!result.success) {
      const tituloError = result.error.errors.find((e) => e.path.includes('titulo'))
      expect(tituloError).toBeDefined()
    }
  })

  it('rechaza título muy corto', () => {
    const result = tareaSchema.safeParse({ ...tareaValida, titulo: 'AB' })
    expect(result.success).toBe(false)
  })

  it('rechaza título demasiado largo', () => {
    const result = tareaSchema.safeParse({ ...tareaValida, titulo: 'A'.repeat(201) })
    expect(result.success).toBe(false)
  })

  it('rechaza prioridad inválida', () => {
    const result = tareaSchema.safeParse({ ...tareaValida, prioridad: 'extrema' })
    expect(result.success).toBe(false)
  })

  it('rechaza estado inválido', () => {
    const result = tareaSchema.safeParse({ ...tareaValida, estado: 'en-progreso' })
    expect(result.success).toBe(false)
  })

  it('rechaza más de 10 tags', () => {
    const result = tareaSchema.safeParse({
      ...tareaValida,
      tags: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k'],
    })
    expect(result.success).toBe(false)
  })

  it('acepta fecha de vencimiento vacía como opcional', () => {
    const result = tareaSchema.safeParse({ ...tareaValida, fecha_vencimiento: '' })
    expect(result.success).toBe(true)
  })

  it('rechaza fecha de vencimiento inválida', () => {
    const result = tareaSchema.safeParse({ ...tareaValida, fecha_vencimiento: 'no-es-fecha' })
    expect(result.success).toBe(false)
  })
})

describe('tagSchema', () => {
  it('acepta tags válidos', () => {
    expect(tagSchema.safeParse('trabajo').success).toBe(true)
    expect(tagSchema.safeParse('mi-proyecto').success).toBe(true)
    expect(tagSchema.safeParse('urgente 2024').success).toBe(true)
  })

  it('rechaza tag vacío', () => {
    expect(tagSchema.safeParse('').success).toBe(false)
  })

  it('rechaza tag con caracteres especiales inválidos', () => {
    expect(tagSchema.safeParse('tag!@#$').success).toBe(false)
  })

  it('rechaza tag demasiado largo', () => {
    expect(tagSchema.safeParse('a'.repeat(51)).success).toBe(false)
  })
})

describe('filtrosSchema', () => {
  it('usa valores por defecto correctamente', () => {
    const result = filtrosSchema.safeParse({})
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.estado).toBe('todas')
      expect(result.data.prioridad).toBe('todas')
    }
  })

  it('acepta todos los estados válidos', () => {
    const estados = ['todas', 'pendiente', 'completada']
    estados.forEach((estado) => {
      const result = filtrosSchema.safeParse({ estado })
      expect(result.success).toBe(true)
    })
  })

  it('acepta todas las prioridades válidas', () => {
    const prioridades = ['todas', 'alta', 'media', 'baja']
    prioridades.forEach((prioridad) => {
      const result = filtrosSchema.safeParse({ prioridad })
      expect(result.success).toBe(true)
    })
  })
})
