import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginInput } from '@/lib/validations'
import { signInWithMagicLink } from '@/hooks/useAuth'

export function LoginForm() {
  const [enviado, setEnviado] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginInput) => {
    setErrorMsg(null)
    const { error } = await signInWithMagicLink(data.email)

    if (error) {
      setErrorMsg('Error al enviar el email. Inténtalo de nuevo.')
      return
    }

    setEnviado(true)
  }

  if (enviado) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-md text-center">
          <div className="text-5xl mb-4">📬</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Revisa tu email!</h2>
          <p className="text-gray-600 mb-4">
            Enviamos un enlace mágico a{' '}
            <span className="font-medium text-blue-600">{getValues('email')}</span>
          </p>
          <p className="text-sm text-gray-500">
            Haz clic en el enlace del email para iniciar sesión. El enlace expira en 1 hora.
          </p>
          <button
            onClick={() => setEnviado(false)}
            className="mt-6 text-blue-600 hover:text-blue-700 text-sm underline"
          >
            Usar otro email
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">✅</div>
          <h1 className="text-3xl font-bold text-gray-900">Tareas App</h1>
          <p className="text-gray-500 mt-2">Gestiona tus tareas de forma eficiente</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="tu@email.com"
              {...register('email')}
              className={`w-full px-4 py-3 rounded-xl border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.email
                  ? 'border-red-400 bg-red-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isSubmitting ? 'Enviando...' : 'Enviar enlace mágico ✨'}
          </button>

          <p className="text-center text-sm text-gray-500 mt-4">
            No requiere contraseña. Te enviamos un enlace seguro.
          </p>
        </form>
      </div>
    </div>
  )
}
