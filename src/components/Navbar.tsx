import type { User } from '@supabase/supabase-js'
import { signOut } from '@/hooks/useAuth'

interface NavbarProps {
  user: User
}

export function Navbar({ user }: NavbarProps) {
  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">✅</span>
          <span className="font-bold text-gray-900">Tareas App</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 hidden sm:block truncate max-w-[200px]">
            {user.email}
          </span>
          <button
            onClick={handleSignOut}
            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Salir
          </button>
        </div>
      </div>
    </header>
  )
}
