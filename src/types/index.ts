export type Prioridad = 'alta' | 'media' | 'baja'
export type Estado = 'pendiente' | 'completada'

export interface Tarea {
  id: string
  user_id: string
  titulo: string
  descripcion: string | null
  fecha_vencimiento: string | null
  prioridad: Prioridad
  tags: string[]
  estado: Estado
  created_at: string
  updated_at: string
}

export type TareaInput = Omit<Tarea, 'id' | 'user_id' | 'created_at' | 'updated_at'>
export type TareaUpdate = Partial<TareaInput>

export interface FiltrosTareas {
  estado?: Estado | 'todas'
  prioridad?: Prioridad | 'todas'
  tag?: string
  busqueda?: string
}

export interface Usuario {
  id: string
  email: string
}
