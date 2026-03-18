import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { tareaSchema, tagSchema, type TareaFormInput } from '@/lib/validations'
import type { Tarea } from '@/types'

interface TareaFormProps {
  tarea?: Tarea
  onSubmit: (data: TareaFormInput) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function TareaForm({ tarea, onSubmit, onCancel, isLoading }: TareaFormProps) {
  const [tagInput, setTagInput] = useState('')
  const [tagError, setTagError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TareaFormInput>({
    resolver: zodResolver(tareaSchema),
    defaultValues: {
      titulo: tarea?.titulo ?? '',
      descripcion: tarea?.descripcion ?? '',
      fecha_vencimiento: tarea?.fecha_vencimiento ?? '',
      prioridad: tarea?.prioridad ?? 'media',
      tags: tarea?.tags ?? [],
      estado: tarea?.estado ?? 'pendiente',
    },
  })

  const tags = watch('tags')

  const agregarTag = () => {
    const resultado = tagSchema.safeParse(tagInput)
    if (!resultado.success) {
      setTagError(resultado.error.errors[0].message)
      return
    }
    const tag = tagInput.trim().toLowerCase()
    if (tags.includes(tag)) {
      setTagError('Esta etiqueta ya existe')
      return
    }
    if (tags.length >= 10) {
      setTagError('Máximo 10 etiquetas')
      return
    }
    setValue('tags', [...tags, tag])
    setTagInput('')
    setTagError(null)
  }

  const eliminarTag = (tagToRemove: string) => {
    setValue('tags', tags.filter((t) => t !== tagToRemove))
  }

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      agregarTag()
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {/* Título */}
      <div>
        <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-1">
          Título <span className="text-red-500">*</span>
        </label>
        <input
          id="titulo"
          type="text"
          placeholder="¿Qué necesitas hacer?"
          {...register('titulo')}
          className={`w-full px-3 py-2 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.titulo ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-300'
          }`}
        />
        {errors.titulo && (
          <p className="mt-1 text-xs text-red-600">{errors.titulo.message}</p>
        )}
      </div>

      {/* Descripción */}
      <div>
        <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
          Descripción
        </label>
        <textarea
          id="descripcion"
          rows={3}
          placeholder="Detalles adicionales (opcional)"
          {...register('descripcion')}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
        {errors.descripcion && (
          <p className="mt-1 text-xs text-red-600">{errors.descripcion.message}</p>
        )}
      </div>

      {/* Fila: Prioridad + Estado */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="prioridad" className="block text-sm font-medium text-gray-700 mb-1">
            Prioridad
          </label>
          <select
            id="prioridad"
            {...register('prioridad')}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="alta">🔴 Alta</option>
            <option value="media">🟡 Media</option>
            <option value="baja">🟢 Baja</option>
          </select>
        </div>

        <div>
          <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">
            Estado
          </label>
          <select
            id="estado"
            {...register('estado')}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="pendiente">⏳ Pendiente</option>
            <option value="completada">✅ Completada</option>
          </select>
        </div>
      </div>

      {/* Fecha de vencimiento */}
      <div>
        <label htmlFor="fecha_vencimiento" className="block text-sm font-medium text-gray-700 mb-1">
          Fecha de vencimiento
        </label>
        <input
          id="fecha_vencimiento"
          type="date"
          {...register('fecha_vencimiento')}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {errors.fecha_vencimiento && (
          <p className="mt-1 text-xs text-red-600">{errors.fecha_vencimiento.message}</p>
        )}
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Etiquetas</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => {
              setTagInput(e.target.value)
              setTagError(null)
            }}
            onKeyDown={handleTagKeyDown}
            placeholder="ej: trabajo, urgente"
            className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="button"
            onClick={agregarTag}
            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
          >
            + Agregar
          </button>
        </div>
        {tagError && <p className="mb-2 text-xs text-red-600">{tagError}</p>}
        <Controller
          name="tags"
          control={control}
          render={() => (
            <div className="flex flex-wrap gap-1">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => eliminarTag(tag)}
                    className="hover:text-red-600 ml-0.5"
                    aria-label={`Eliminar etiqueta ${tag}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        />
      </div>

      {/* Botones */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2 px-4 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {isLoading ? 'Guardando...' : tarea ? 'Actualizar' : 'Crear tarea'}
        </button>
      </div>
    </form>
  )
}
