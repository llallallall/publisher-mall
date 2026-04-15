import { defineNuxtConfig } from 'nuxt/config'
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  // Nuxt 4 Compatibility Mode
  ssr: false, // 디버깅을 위해 일시적으로 SSR 비활성화
  future: {
    compatibilityVersion: 4,
  },

  compatibilityDate: '2025-07-15',

  // Directory naming convention: Nuxt 4 uses 'app' as srcDir by default
  // srcDir: 'app', // This is default when compatibilityVersion: 4 is set

  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      apiTarget: process.env.API_URL || 'http://localhost:3002',
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY,
    },
  },

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  modules: [
    '@nuxt/image',
    '@nuxt/icon', // Only use icon module for efficiency
  ],

  // Theme configuration (Basalt Navy/Gold)
  app: {
    head: {
      title: 'Publisher Mall - Academic Authority',
      meta: [
        { name: 'description', content: 'Premium Education Publisher Mall' }
      ]
    }
  }
})
