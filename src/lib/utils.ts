import type { Tarea, FiltrosTareas } from '@/types'

/**
 * Filtra un array de tareas según los criterios indicados.
 * Función pura sin dependencias externas — fácil de testear.
 */
export function filtrarTareas(tareas: Tarea[], filtros: FiltrosTareas): Tarea[] {
  return tareas.filter((tarea) => {
    // Filtro por estado
    if (filtros.estado && filtros.estado !== 'todas') {
      if (tarea.estado !== filtros.estado) return false
    }

    // Filtro por prioridad
    if (filtros.prioridad && filtros.prioridad !== 'todas') {
      if (tarea.prioridad !== filtros.prioridad) return false
    }

    // Filtro por tag
    if (filtros.tag && filtros.tag.trim() !== '') {
      if (!(tarea.tags || []).includes(filtros.tag)) return false
    }

    // Filtro por búsqueda de texto libre
    if (filtros.busqueda && filtros.busqueda.trim() !== '') {
      const busqueda = filtros.busqueda.toLowerCase()
      const enTitulo = tarea.titulo.toLowerCase().includes(busqueda)
      const enDescripcion = tarea.descripcion?.toLowerCase().includes(busqueda) ?? false
      const enTags = (tarea.tags || []).some((tag) => tag.toLowerCase().includes(busqueda))
      if (!enTitulo && !enDescripcion && !enTags) return false
    }

    return true
  })
}

/**
 * Extrae todos los tags únicos de un array de tareas, ordenados alfabéticamente.
 */
export function extraerTagsUnicos(tareas: Tarea[]): string[] {
  const tagsSet = new Set<string>()
  tareas.forEach((tarea) => (tarea.tags || []).forEach((tag) => tagsSet.add(tag)))
  return Array.from(tagsSet).sort()
}
