import { describe, it, expect } from 'vitest'
import { filtrarTareas } from '@/lib/utils'
import type { Tarea } from '@/types'

// Datos de prueba
const tareasMock: Tarea[] = [
  {
    id: '1',
    user_id: 'user-1',
    titulo: 'Revisar informes de ventas',
    descripcion: 'Análisis trimestral',
    fecha_vencimiento: '2027-01-15',
    prioridad: 'alta',
    tags: ['trabajo', 'urgente'],
    estado: 'pendiente',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    user_id: 'user-1',
    titulo: 'Comprar víveres',
    descripcion: null,
    fecha_vencimiento: null,
    prioridad: 'baja',
    tags: ['personal', 'casa'],
    estado: 'pendiente',
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
  },
  {
    id: '3',
    user_id: 'user-1',
    titulo: 'Enviar propuesta al cliente',
    descripcion: 'Propuesta para el proyecto ABC',
    fecha_vencimiento: '2027-02-01',
    prioridad: 'alta',
    tags: ['trabajo', 'cliente'],
    estado: 'completada',
    created_at: '2024-01-03T00:00:00Z',
    updated_at: '2024-01-03T00:00:00Z',
  },
  {
    id: '4',
    user_id: 'user-1',
    titulo: 'Leer libro de TypeScript',
    descripcion: 'Capítulos 5-8',
    fecha_vencimiento: null,
    prioridad: 'media',
    tags: ['personal', 'aprendizaje'],
    estado: 'pendiente',
    created_at: '2024-01-04T00:00:00Z',
    updated_at: '2024-01-04T00:00:00Z',
  },
]

describe('filtrarTareas', () => {
  it('devuelve todas las tareas sin filtros activos', () => {
    const resultado = filtrarTareas(tareasMock, {})
    expect(resultado).toHaveLength(4)
  })

  it('filtra por estado "pendiente"', () => {
    const resultado = filtrarTareas(tareasMock, { estado: 'pendiente' })
    expect(resultado).toHaveLength(3)
    resultado.forEach((t) => expect(t.estado).toBe('pendiente'))
  })

  it('filtra por estado "completada"', () => {
    const resultado = filtrarTareas(tareasMock, { estado: 'completada' })
    expect(resultado).toHaveLength(1)
    expect(resultado[0].id).toBe('3')
  })

  it('filtra por estado "todas" devuelve todo', () => {
    const resultado = filtrarTareas(tareasMock, { estado: 'todas' })
    expect(resultado).toHaveLength(4)
  })

  it('filtra por prioridad "alta"', () => {
    const resultado = filtrarTareas(tareasMock, { prioridad: 'alta' })
    expect(resultado).toHaveLength(2)
    resultado.forEach((t) => expect(t.prioridad).toBe('alta'))
  })

  it('filtra por prioridad "media"', () => {
    const resultado = filtrarTareas(tareasMock, { prioridad: 'media' })
    expect(resultado).toHaveLength(1)
    expect(resultado[0].id).toBe('4')
  })

  it('filtra por prioridad "baja"', () => {
    const resultado = filtrarTareas(tareasMock, { prioridad: 'baja' })
    expect(resultado).toHaveLength(1)
    expect(resultado[0].id).toBe('2')
  })

  it('filtra por tag específico', () => {
    const resultado = filtrarTareas(tareasMock, { tag: 'trabajo' })
    expect(resultado).toHaveLength(2)
    resultado.forEach((t) => expect(t.tags).toContain('trabajo'))
  })

  it('filtra por tag "personal"', () => {
    const resultado = filtrarTareas(tareasMock, { tag: 'personal' })
    expect(resultado).toHaveLength(2)
  })

  it('devuelve vacío para tag que no existe', () => {
    const resultado = filtrarTareas(tareasMock, { tag: 'tag-inexistente' })
    expect(resultado).toHaveLength(0)
  })

  it('busca por texto en título', () => {
    const resultado = filtrarTareas(tareasMock, { busqueda: 'informes' })
    expect(resultado).toHaveLength(1)
    expect(resultado[0].id).toBe('1')
  })

  it('búsqueda es case-insensitive', () => {
    const resultado = filtrarTareas(tareasMock, { busqueda: 'LIBRO' })
    expect(resultado).toHaveLength(1)
    expect(resultado[0].id).toBe('4')
  })

  it('busca en descripción también', () => {
    const resultado = filtrarTareas(tareasMock, { busqueda: 'trimestral' })
    expect(resultado).toHaveLength(1)
    expect(resultado[0].id).toBe('1')
  })

  it('busca en tags también', () => {
    const resultado = filtrarTareas(tareasMock, { busqueda: 'aprendizaje' })
    expect(resultado).toHaveLength(1)
    expect(resultado[0].id).toBe('4')
  })

  it('combina filtros de estado y prioridad', () => {
    const resultado = filtrarTareas(tareasMock, {
      estado: 'pendiente',
      prioridad: 'alta',
    })
    expect(resultado).toHaveLength(1)
    expect(resultado[0].id).toBe('1')
  })

  it('combina filtros de estado, prioridad y tag', () => {
    const resultado = filtrarTareas(tareasMock, {
      estado: 'pendiente',
      prioridad: 'alta',
      tag: 'urgente',
    })
    expect(resultado).toHaveLength(1)
    expect(resultado[0].titulo).toBe('Revisar informes de ventas')
  })

  it('devuelve vacío cuando los filtros combinados no coinciden', () => {
    const resultado = filtrarTareas(tareasMock, {
      estado: 'completada',
      prioridad: 'baja',
    })
    expect(resultado).toHaveLength(0)
  })

  it('maneja array vacío de tareas', () => {
    const resultado = filtrarTareas([], { estado: 'pendiente', prioridad: 'alta' })
    expect(resultado).toHaveLength(0)
  })

  it('ignora búsqueda vacía o de solo espacios', () => {
    const resultado1 = filtrarTareas(tareasMock, { busqueda: '' })
    expect(resultado1).toHaveLength(4)

    const resultado2 = filtrarTareas(tareasMock, { busqueda: '   ' })
    expect(resultado2).toHaveLength(4)
  })
})
