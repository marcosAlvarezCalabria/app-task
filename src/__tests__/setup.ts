import '@testing-library/jest-dom'

// Mock de las variables de entorno para tests
Object.defineProperty(import.meta, 'env', {
  value: {
    VITE_SUPABASE_URL: 'https://test.supabase.co',
    VITE_SUPABASE_ANON_KEY: 'test-anon-key',
    DEV: false,
    PROD: false,
    MODE: 'test',
  },
  writable: true,
})
