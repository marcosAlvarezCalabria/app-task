-- ============================================================
-- Tareas App - Migración inicial
-- ============================================================
-- Habilitar extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TIPOS ENUM
-- ============================================================
CREATE TYPE prioridad_enum AS ENUM ('alta', 'media', 'baja');
CREATE TYPE estado_enum AS ENUM ('pendiente', 'completada');

-- ============================================================
-- TABLA: tareas
-- ============================================================
CREATE TABLE IF NOT EXISTS public.tareas (
  id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  titulo          TEXT NOT NULL CHECK (char_length(titulo) BETWEEN 3 AND 200),
  descripcion     TEXT CHECK (descripcion IS NULL OR char_length(descripcion) <= 2000),
  fecha_vencimiento DATE,
  prioridad       prioridad_enum NOT NULL DEFAULT 'media',
  tags            TEXT[] NOT NULL DEFAULT '{}',
  estado          estado_enum NOT NULL DEFAULT 'pendiente',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ÍNDICES para performance
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_tareas_user_id ON public.tareas(user_id);
CREATE INDEX IF NOT EXISTS idx_tareas_estado ON public.tareas(estado);
CREATE INDEX IF NOT EXISTS idx_tareas_prioridad ON public.tareas(prioridad);
CREATE INDEX IF NOT EXISTS idx_tareas_created_at ON public.tareas(created_at DESC);
-- Índice GIN para búsquedas en arrays de tags
CREATE INDEX IF NOT EXISTS idx_tareas_tags ON public.tareas USING GIN(tags);

-- ============================================================
-- TRIGGER: actualizar updated_at automáticamente
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tareas_updated_at
  BEFORE UPDATE ON public.tareas
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
-- Habilitar RLS en la tabla
ALTER TABLE public.tareas ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios solo pueden ver sus propias tareas
CREATE POLICY "usuarios_ven_sus_tareas"
  ON public.tareas
  FOR SELECT
  USING (auth.uid() = user_id);

-- Política: Los usuarios solo pueden crear tareas para sí mismos
CREATE POLICY "usuarios_crean_sus_tareas"
  ON public.tareas
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Política: Los usuarios solo pueden actualizar sus propias tareas
CREATE POLICY "usuarios_actualizan_sus_tareas"
  ON public.tareas
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Política: Los usuarios solo pueden eliminar sus propias tareas
CREATE POLICY "usuarios_eliminan_sus_tareas"
  ON public.tareas
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- COMENTARIOS para documentación
-- ============================================================
COMMENT ON TABLE public.tareas IS 'Tareas del usuario con soporte RLS';
COMMENT ON COLUMN public.tareas.user_id IS 'FK a auth.users - El propietario de la tarea';
COMMENT ON COLUMN public.tareas.tags IS 'Array de etiquetas para clasificar la tarea';
COMMENT ON COLUMN public.tareas.fecha_vencimiento IS 'Fecha límite de la tarea (sin hora)';
