import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.tif', '**/*.tiff'],
  server: {
    fs: {
      allow: [
        'public',
        './',
        'C:/iwmi_web_dashboard'
      ]
    }
  }
})
