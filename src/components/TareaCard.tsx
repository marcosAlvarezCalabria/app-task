import { useState } from 'react'
import type { Tarea } from '@/types'

interface TareaCardProps {
  tarea: Tarea
  onToggle: (id: string, estadoActual: string) => void
  onEditar: (tarea: Tarea) => void
  onEliminar: (id: string) => void
}

const PRIORIDAD_CONFIG = {
  alta: { label: 'Alta', color: 'bg-red-100 text-red-700', dot: '🔴' },
  media: { label: 'Media', color: 'bg-yellow-100 text-yellow-700', dot: '🟡' },
  baja: { label: 'Baja', color: 'bg-green-100 text-green-700', dot: '🟢' },
}

function formatearFecha(fecha: string): string {
  const date = new Date(fecha + 'T00:00:00')
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  const diff = date.getTime() - hoy.getTime()
  const dias = Math.round(diff / (1000 * 60 * 60 * 24))

  if (dias < 0) return `Venció hace ${Math.abs(dias)} día${Math.abs(dias) !== 1 ? 's' : ''}`
  if (dias === 0) return 'Vence hoy'
  if (dias === 1) return 'Vence mañana'
  return `Vence en ${dias} días`
}

function esFechaVencida(fecha: string): boolean {
  const date = new Date(fecha + 'T00:00:00')
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  return date < hoy
}

export function TareaCard({ tarea, onToggle, onEditar, onEliminar }: TareaCardProps) {
  const [confirmandoEliminar, setConfirmandoEliminar] = useState(false)
  const prioridad = PRIORIDAD_CONFIG[tarea.prioridad]
  const completada = tarea.estado === 'completada'
  const vencida = tarea.fecha_vencimiento && !completada && esFechaVencida(tarea.fecha_vencimiento)

  return (
    <div
      className={`bg-white rounded-xl border transition-all hover:shadow-md ${
        completada ? 'border-gray-100 opacity-75' : vencida ? 'border-red-200' : 'border-gray-200'
      }`}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <button
            onClick={() => onToggle(tarea.id, tarea.estado)}
            className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              completada
                ? 'bg-green-500 border-green-500 text-white'
                : 'border-gray-300 hover:border-blue-400'
            }`}
            aria-label={completada ? 'Marcar como pendiente' : 'Marcar como completada'}
          >
            {completada && (
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>

          {/* Contenido */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3
                className={`font-medium text-gray-900 leading-snug break-words ${
                  completada ? 'line-through text-gray-400' : ''
                }`}
              >
                {tarea.titulo}
              </h3>

              {/* Acciones */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => onEditar(tarea)}
                  className="p-1 text-gray-400 hover:text-blue-600 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Editar tarea"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>

                {confirmandoEliminar ? (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEliminar(tarea.id)}
                      className="px-2 py-0.5 bg-red-600 text-white text-xs rounded transition-colors"
                    >
                      Sí
                    </button>
                    <button
                      onClick={() => setConfirmandoEliminar(false)}
                      className="px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded transition-colors"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmandoEliminar(true)}
                    className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                    aria-label="Eliminar tarea"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Descripción */}
            {tarea.descripcion && (
              <p className="text-sm text-gray-500 mt-1 break-words">{tarea.descripcion}</p>
            )}

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {/* Prioridad */}
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${prioridad.color}`}>
                {prioridad.dot} {prioridad.label}
              </span>

              {/* Fecha */}
              {tarea.fecha_vencimiento && (
                <span
                  className={`text-xs font-medium ${
                    vencida ? 'text-red-600' : completada ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  📅 {formatearFecha(tarea.fecha_vencimiento)}
                </span>
              )}
            </div>

            {/* Tags */}
            {tarea.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {tarea.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
