import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Emit a real /flowers/index.html as well as the main app. This makes the
    // unlinked page work on static hosts that do not rewrite every URL to /.
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        flowers: resolve(import.meta.dirname, 'flowers/index.html'),
      },
    },
  },
  resolve: {
    // @gsap/react takes React as a peer dep and ships untranspiled source.
    // Without this, dep pre-bundling can hand it a second React instance and
    // every hook call throws "Invalid hook call".
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    // Pre-bundle up front so Vite doesn't discover these mid-session and
    // re-optimize, which leaves an already-loaded page on a stale React.
    include: [
      'gsap',
      'gsap/ScrollTrigger',
      'gsap/SplitText',
      '@gsap/react',
      'react',
      'react-dom',
    ],
  },
  server: {
    // Honour PORT when a host assigns one, otherwise use Vite's default.
    port: globalThis.process?.env?.PORT
      ? Number(globalThis.process.env.PORT)
      : undefined,
  },
})
