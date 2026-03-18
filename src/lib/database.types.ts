export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      tareas: {
        Row: {
          id: string
          user_id: string
          titulo: string
          descripcion: string | null
          fecha_vencimiento: string | null
          prioridad: 'alta' | 'media' | 'baja'
          tags: string[]
          estado: 'pendiente' | 'completada'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          titulo: string
          descripcion?: string | null
          fecha_vencimiento?: string | null
          prioridad?: 'alta' | 'media' | 'baja'
          tags?: string[]
          estado?: 'pendiente' | 'completada'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          titulo?: string
          descripcion?: string | null
          fecha_vencimiento?: string | null
          prioridad?: 'alta' | 'media' | 'baja'
          tags?: string[]
          estado?: 'pendiente' | 'completada'
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      prioridad_enum: 'alta' | 'media' | 'baja'
      estado_enum: 'pendiente' | 'completada'
    }
  }
}
