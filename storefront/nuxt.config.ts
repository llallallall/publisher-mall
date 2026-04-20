import { defineNuxtConfig } from 'nuxt/config'
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  ssr: true,
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

  build: {
    transpile: ['@supabase/ssr'],
  },

  vite: {
    plugins: [
      tailwindcss(),
    ],
    optimizeDeps: {
      include: ['cookie', 'graphql-tag'],
    },
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
      title: '서담 - 프리미엄 학습자료 아카이브',
      meta: [
        { name: 'description', content: '한 차원 높은 학습 경험, 서담에서 제공하는 프리미엄 교육 자료를 만나보세요.' }
      ]
    }
  }
})
