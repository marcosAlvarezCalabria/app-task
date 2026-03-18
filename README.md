# ✅ Tareas App

Aplicación de gestión de tareas construida con React 18, Vite, TypeScript y Supabase.

## 🛠️ Tech Stack

- **Frontend:** React 18 + Vite + TypeScript (modo estricto)
- **Estilos:** Tailwind CSS (responsive móvil + desktop)
- **Backend/DB:** Supabase (PostgreSQL con RLS)
- **Auth:** Supabase Magic Link (sin contraseña)
- **Estado del servidor:** TanStack Query (React Query v5)
- **Validación:** Zod
- **Testing:** Vitest

## ✨ Funcionalidades

- 🔐 Autenticación con enlace mágico (sin contraseña)
- ✅ CRUD completo de tareas
- 🎯 Prioridades: Alta, Media, Baja
- 🏷️ Etiquetas múltiples por tarea
- 📅 Fecha de vencimiento con alertas visuales
- 🔍 Filtros por estado, prioridad y etiqueta
- 🔎 Búsqueda de texto libre
- 📱 Responsive (móvil + escritorio)
- 🔒 Row Level Security: cada usuario solo ve sus datos

## 🚀 Inicio Rápido

### 1. Prerrequisitos

- Node.js 18+
- Cuenta en [Supabase](https://supabase.com) (gratuita)

### 2. Clonar e instalar

```bash
git clone <repo>
cd tareas-app
npm install
```

### 3. Configurar Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com)
2. Ve a **SQL Editor** y ejecuta el archivo:
   ```
   supabase/migrations/001_initial.sql
   ```
3. Ve a **Settings → API** y copia:
   - `Project URL`
   - `anon public` key

### 4. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita `.env` con tus valores de Supabase:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

> ⚠️ **Nunca** subas el archivo `.env` a Git. Ya está en `.gitignore`.

### 5. Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173)

## 📦 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run preview      # Preview del build
npm run test         # Tests en modo watch
npm run test:run     # Tests (una sola ejecución)
npm run type-check   # Verificar tipos TypeScript
npm run lint         # ESLint
```

## 🧪 Tests

Los tests cubren:
- **Validaciones Zod:** schemas de login, tarea, tag y filtros
- **Lógica de filtros:** combinación de múltiples filtros, búsqueda de texto, edge cases

```bash
npm run test:run
```

## 🗂️ Estructura del Proyecto

```
tareas-app/
├── src/
│   ├── __tests__/          # Tests con Vitest
│   │   ├── setup.ts
│   │   ├── validations.test.ts
│   │   └── filtros.test.ts
│   ├── components/         # Componentes reutilizables
│   │   ├── FiltrosTareas.tsx
│   │   ├── LoginForm.tsx
│   │   ├── Modal.tsx
│   │   ├── Navbar.tsx
│   │   ├── TareaCard.tsx
│   │   └── TareaForm.tsx
│   ├── hooks/              # Custom hooks (lógica de negocio)
│   │   ├── useAuth.ts
│   │   └── useTareas.ts
│   ├── lib/                # Configuración de librerías
│   │   ├── database.types.ts
│   │   ├── supabase.ts
│   │   └── validations.ts  # Schemas Zod
│   ├── pages/              # Páginas/vistas
│   │   ├── LoginPage.tsx
│   │   └── TareasPage.tsx
│   ├── types/              # Tipos TypeScript globales
│   │   └── index.ts
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── supabase/
│   └── migrations/
│       └── 001_initial.sql  # Schema PostgreSQL + RLS
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── vitest.config.ts
└── vite.config.ts
```

## 🔒 Seguridad

- **Tokens:** Gestionados por Supabase JS client (no `localStorage` manual)
- **RLS activado:** Políticas de base de datos que garantizan aislamiento por usuario
- **Variables de entorno:** Solo `VITE_SUPABASE_ANON_KEY` (clave pública segura)
- **Validación:** Zod valida todos los inputs antes de enviar a la BD
- **CORS:** Gestionado por Supabase (configurar dominios permitidos en el dashboard)

## 📋 Configurar Auth en Supabase

1. En tu proyecto de Supabase, ve a **Authentication → Settings**
2. En **Site URL**, agrega la URL de tu app (ej: `http://localhost:5173` para desarrollo)
3. En **Redirect URLs**, agrega la misma URL
4. El magic link está habilitado por defecto ✅

## 🚀 Deploy

### Vercel (recomendado)

```bash
npm run build
# Sube la carpeta dist/ a Vercel
```

Variables de entorno en Vercel:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Recuerda actualizar la **Site URL** en Supabase con tu dominio de producción.

---

Creado el 2026-03-18 con ❤️
