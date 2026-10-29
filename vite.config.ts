import { defineConfig } from 'vitest/config'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({ plugins: [tailwindcss()], base: process.env.VITE_BASE_PATH || '/', test: { environment: 'jsdom' } })
