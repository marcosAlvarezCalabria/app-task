import type { FiltrosTareas } from '@/types'

interface FiltrosTareasProps {
  filtros: FiltrosTareas
  onChange: (filtros: FiltrosTareas) => void
  tagsDisponibles: string[]
  totalTareas: number
  tareasFiltradas: number
}

export function FiltrosTareasPanel({
  filtros,
  onChange,
  tagsDisponibles,
  totalTareas,
  tareasFiltradas,
}: FiltrosTareasProps) {
  const hayFiltrosActivos =
    (filtros.estado && filtros.estado !== 'todas') ||
    (filtros.prioridad && filtros.prioridad !== 'todas') ||
    filtros.tag ||
    filtros.busqueda

  const limpiarFiltros = () => {
    onChange({ estado: 'todas', prioridad: 'todas', tag: '', busqueda: '' })
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
      {/* Búsqueda */}
      <div>
        <input
          type="search"
          placeholder="Buscar tareas..."
          value={filtros.busqueda ?? ''}
          onChange={(e) => onChange({ ...filtros, busqueda: e.target.value })}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Filtros en fila */}
      <div className="flex flex-wrap gap-2">
        {/* Estado */}
        <select
          value={filtros.estado ?? 'todas'}
          onChange={(e) => onChange({ ...filtros, estado: e.target.value as FiltrosTareas['estado'] })}
          className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Filtrar por estado"
        >
          <option value="todas">📋 Todos los estados</option>
          <option value="pendiente">⏳ Pendientes</option>
          <option value="completada">✅ Completadas</option>
        </select>

        {/* Prioridad */}
        <select
          value={filtros.prioridad ?? 'todas'}
          onChange={(e) => onChange({ ...filtros, prioridad: e.target.value as FiltrosTareas['prioridad'] })}
          className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Filtrar por prioridad"
        >
          <option value="todas">🎯 Todas las prioridades</option>
          <option value="alta">🔴 Alta</option>
          <option value="media">🟡 Media</option>
          <option value="baja">🟢 Baja</option>
        </select>

        {/* Tags */}
        {tagsDisponibles.length > 0 && (
          <select
            value={filtros.tag ?? ''}
            onChange={(e) => onChange({ ...filtros, tag: e.target.value })}
            className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Filtrar por etiqueta"
          >
            <option value="">🏷️ Todas las etiquetas</option>
            {tagsDisponibles.map((tag) => (
              <option key={tag} value={tag}>
                #{tag}
              </option>
            ))}
          </select>
        )}

        {/* Botón limpiar */}
        {hayFiltrosActivos && (
          <button
            onClick={limpiarFiltros}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-sm font-medium transition-colors"
          >
            ✕ Limpiar
          </button>
        )}
      </div>

      {/* Contador */}
      {hayFiltrosActivos && (
        <p className="text-xs text-gray-500">
          Mostrando {tareasFiltradas} de {totalTareas} tarea{totalTareas !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  )
}
