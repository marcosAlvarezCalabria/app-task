import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { filtrarTareas, extraerTagsUnicos } from '@/lib/utils'
import type { Tarea, TareaInput, TareaUpdate, FiltrosTareas } from '@/types'

export { filtrarTareas }

const QUERY_KEY = 'tareas'

// Función para obtener tareas del servidor
async function fetchTareas(): Promise<Tarea[]> {
  const { data, error } = await supabase
    .from('tareas')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data as Tarea[]) ?? []
}

// Hook para listar tareas
export function useTareas(filtros?: FiltrosTareas) {
  const query = useQuery({
    queryKey: [QUERY_KEY],
    queryFn: fetchTareas,
  })

  const tareasFiltradas = filtros && query.data
    ? filtrarTareas(query.data, filtros)
    : query.data ?? []

  return {
    ...query,
    data: tareasFiltradas,
    total: query.data?.length ?? 0,
  }
}

// Hook para crear una tarea
export function useCrearTarea() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: TareaInput) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No autenticado')

      const { data, error } = await supabase
        .from('tareas')
        .insert({
          ...input,
          user_id: user.id,
          descripcion: input.descripcion || null,
          fecha_vencimiento: input.fecha_vencimiento || null,
        })
        .select()
        .single()

      if (error) throw new Error(error.message)
      return data as Tarea
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })
}

// Hook para actualizar una tarea
export function useActualizarTarea() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...update }: { id: string } & TareaUpdate) => {
      const { data, error } = await supabase
        .from('tareas')
        .update({
          ...update,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw new Error(error.message)
      return data as Tarea
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })
}

// Hook para eliminar una tarea
export function useEliminarTarea() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('tareas')
        .delete()
        .eq('id', id)

      if (error) throw new Error(error.message)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })
}

// Hook para cambiar estado de una tarea rápidamente
export function useToggleEstado() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, estadoActual }: { id: string; estadoActual: string }) => {
      const nuevoEstado = estadoActual === 'completada' ? 'pendiente' : 'completada'

      const { data, error } = await supabase
        .from('tareas')
        .update({ estado: nuevoEstado, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw new Error(error.message)
      return data as Tarea
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })
}

// Obtener todos los tags únicos de las tareas
export function useTagsDisponibles(tareas: Tarea[]): string[] {
  return extraerTagsUnicos(tareas)
}
