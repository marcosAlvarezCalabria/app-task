import { useAuth } from '@/hooks/useAuth'
import { LoginPage } from '@/pages/LoginPage'
import { TareasPage } from '@/pages/TareasPage'

export default function App() {
  const { user, loading } = useAuth()

  // Pantalla de carga inicial
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3">✅</div>
          <div className="text-gray-500 text-sm animate-pulse">Cargando...</div>
        </div>
      </div>
    )
  }

  // Si no hay sesión, mostrar login
  if (!user) {
    return <LoginPage />
  }

  // Usuario autenticado
  return <TareasPage user={user} />
}
