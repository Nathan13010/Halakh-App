import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Custom plugin to watch public directory JSON files
const watchDataPlugin = () => ({
  name: 'watch-data',
  configureServer(server) {
    server.watcher.add('public/data/**/*.json')
    server.watcher.on('change', (file) => {
      if (file.includes('public') && file.endsWith('.json')) {
        server.ws.send({ type: 'full-reload' })
      }
    })
  }
})

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), watchDataPlugin()],
})
