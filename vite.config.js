import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Honour PORT when a host assigns one, otherwise use Vite's default.
    port: globalThis.process?.env?.PORT
      ? Number(globalThis.process.env.PORT)
      : undefined,
  },
})
