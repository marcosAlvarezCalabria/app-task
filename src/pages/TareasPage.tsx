import { useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { Navbar } from '@/components/Navbar'
import { TareaCard } from '@/components/TareaCard'
import { TareaForm } from '@/components/TareaForm'
import { Modal } from '@/components/Modal'
import { FiltrosTareasPanel } from '@/components/FiltrosTareas'
import {
  useTareas,
  useCrearTarea,
  useActualizarTarea,
  useEliminarTarea,
  useToggleEstado,
  useTagsDisponibles,
} from '@/hooks/useTareas'
import type { Tarea, FiltrosTareas } from '@/types'
import type { TareaFormInput } from '@/lib/validations'

interface TareasPageProps {
  user: User
}

export function TareasPage({ user }: TareasPageProps) {
  const [filtros, setFiltros] = useState<FiltrosTareas>({
    estado: 'todas',
    prioridad: 'todas',
    tag: '',
    busqueda: '',
  })
  const [modalAbierto, setModalAbierto] = useState(false)
  const [tareaEditando, setTareaEditando] = useState<Tarea | undefined>()

  const { data: tareas, isLoading, error, total } = useTareas(filtros)
  const crearTarea = useCrearTarea()
  const actualizarTarea = useActualizarTarea()
  const eliminarTarea = useEliminarTarea()
  const toggleEstado = useToggleEstado()

  // Tareas sin filtrar para extraer tags disponibles
  const { data: todasLasTareas } = useTareas()
  const tagsDisponibles = useTagsDisponibles(todasLasTareas ?? [])

  const abrirModalCrear = () => {
    setTareaEditando(undefined)
    setModalAbierto(true)
  }

  const abrirModalEditar = (tarea: Tarea) => {
    setTareaEditando(tarea)
    setModalAbierto(true)
  }

  const cerrarModal = () => {
    setModalAbierto(false)
    setTareaEditando(undefined)
  }

  const handleSubmit = async (data: TareaFormInput) => {
    if (tareaEditando) {
      await actualizarTarea.mutateAsync({ id: tareaEditando.id, ...data })
    } else {
      await crearTarea.mutateAsync(data)
    }
    cerrarModal()
  }

  const handleToggle = (id: string, estadoActual: string) => {
    toggleEstado.mutate({ id, estadoActual })
  }

  const handleEliminar = (id: string) => {
    eliminarTarea.mutate(id)
  }

  const pendientes = (todasLasTareas ?? []).filter((t) => t.estado === 'pendiente').length
  const completadas = (todasLasTareas ?? []).filter((t) => t.estado === 'completada').length

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl border border-gray-200 p-3 text-center">
            <div className="text-2xl font-bold text-gray-900">{total}</div>
            <div className="text-xs text-gray-500 mt-0.5">Total</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-3 text-center">
            <div className="text-2xl font-bold text-orange-500">{pendientes}</div>
            <div className="text-xs text-gray-500 mt-0.5">Pendientes</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-3 text-center">
            <div className="text-2xl font-bold text-green-500">{completadas}</div>
            <div className="text-xs text-gray-500 mt-0.5">Completadas</div>
          </div>
        </div>

        {/* Filtros */}
        <FiltrosTareasPanel
          filtros={filtros}
          onChange={setFiltros}
          tagsDisponibles={tagsDisponibles}
          totalTareas={total}
          tareasFiltradas={tareas.length}
        />

        {/* Lista de tareas */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-900">
              Tareas
              {tareas.length > 0 && (
                <span className="ml-2 text-sm font-normal text-gray-500">({tareas.length})</span>
              )}
            </h2>
            <button
              onClick={abrirModalCrear}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nueva tarea
            </button>
          </div>

          {/* Estado de carga */}
          {isLoading && (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
              Error al cargar las tareas. Intenta recargar la página.
            </div>
          )}

          {/* Sin tareas */}
          {!isLoading && !error && tareas.length === 0 && (
            <div className="bg-white rounded-xl border border-dashed border-gray-300 p-8 text-center">
              <div className="text-4xl mb-3">📝</div>
              <p className="text-gray-500 text-sm">
                {total === 0
                  ? 'No tienes tareas aún. ¡Crea tu primera tarea!'
                  : 'No hay tareas que coincidan con los filtros.'}
              </p>
              {total === 0 && (
                <button
                  onClick={abrirModalCrear}
                  className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors"
                >
                  Crear primera tarea
                </button>
              )}
            </div>
          )}

          {/* Lista */}
          {!isLoading && tareas.length > 0 && (
            <div className="space-y-2">
              {tareas.map((tarea) => (
                <TareaCard
                  key={tarea.id}
                  tarea={tarea}
                  onToggle={handleToggle}
                  onEditar={abrirModalEditar}
                  onEliminar={handleEliminar}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal crear/editar */}
      {modalAbierto && (
        <Modal
          titulo={tareaEditando ? 'Editar tarea' : 'Nueva tarea'}
          onClose={cerrarModal}
        >
          <TareaForm
            tarea={tareaEditando}
            onSubmit={handleSubmit}
            onCancel={cerrarModal}
            isLoading={crearTarea.isPending || actualizarTarea.isPending}
          />
        </Modal>
      )}
    </div>
  )
}
