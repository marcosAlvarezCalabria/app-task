import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { Tarea, TareaInput, FiltrosTareas, Prioridad, Estado } from '../types'
import { filtrarTareas } from '../lib/utils'

export function useTareas(filtros: FiltrosTareas) {
  return useQuery({
    queryKey: ['tareas'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No autenticado')

      const { data, error } = await supabase
        .from('tareas')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw new Error(error.message)
      return data as Tarea[]
    },
    select: (data) => filtrarTareas(data, filtros)
  })
}

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
        } as any)
        .select()
        .single()

      if (error) throw new Error(error.message)
      return data as Tarea
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tareas'] })
    }
  })
}

export function useActualizarTarea() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, update }: { id: string, update: Partial<TareaInput> }) => {
      const { data, error } = await supabase
        .from('tareas')
        .update({
          ...update,
          updated_at: new Date().toISOString(),
        } as any)
        .eq('id', id)
        .select()
        .single()

      if (error) throw new Error(error.message)
      return data as Tarea
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tareas'] })
    }
  })
}

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
      queryClient.invalidateQueries({ queryKey: ['tareas'] })
    }
  })
}

export function useToggleEstado() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, estadoActual }: { id: string, estadoActual: Estado }) => {
      const nuevoEstado: Estado = estadoActual === 'pendiente' ? 'completada' : 'pendiente'
      
      const { data, error } = await supabase
        .from('tareas')
        .update({ estado: nuevoEstado, updated_at: new Date().toISOString() } as any)
        .eq('id', id)
        .select()
        .single()

      if (error) throw new Error(error.message)
      return data as Tarea
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tareas'] })
    }
  })
}

export function useTagsDisponibles() {
  const { data: tareas } = useQuery({
    queryKey: ['tareas'],
    queryFn: async () => []
  })
  return []
}
