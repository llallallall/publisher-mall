import { defineNuxtConfig } from 'nuxt/config'
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  ssr: true, // Re-enabled after fixing imports
  future: {
    compatibilityVersion: 4,
  },

  compatibilityDate: '2025-07-15',

  devtools: { enabled: true },
  
  devServer: {
    port: 3001,
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      apiTarget: process.env.NUXT_PUBLIC_API_URL || 'http://localhost:4000',
      url: `${process.env.NUXT_PUBLIC_API_URL || 'http://localhost:4000'}/shop-api`,

      supabaseUrl: process.env.SUPABASE_URL || 'https://tafnisicdywxbmwlyumd.supabase.co',
      supabaseKey: process.env.SUPABASE_KEY || 'sb_publishable_El3aut-x-LsA_2eUZDmIaw_NI-h1cuE',
      storefrontUrl: process.env.NUXT_PUBLIC_STOREFRONT_URL || 'http://localhost:3001',
    },
  },

  vite: {
    plugins: [
      tailwindcss(),
    ],
    // Stability fix: Increase build timeout
    build: {
      chunkSizeWarningLimit: 1000,
    }
  },

  modules: [
    '@nuxt/image',
    '@nuxt/icon',
    '@nuxtjs/supabase',
  ],

  supabase: {
    redirect: false,
    url: process.env.SUPABASE_URL || 'https://tafnisicdywxbmwlyumd.supabase.co',
    key: process.env.SUPABASE_KEY || 'sb_publishable_El3aut-x-LsA_2eUZDmIaw_NI-h1cuE',
  },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
    head: {
      title: 'Archive. - Academic Integrity',
      meta: [
        { name: 'description', content: 'Premium Education Publisher Mall' }
      ]
    }
  }
})
