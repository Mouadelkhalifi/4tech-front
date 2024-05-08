export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
    'shadcn-nuxt',
  ],
  buildModules: ['@nuxt/typescript-build'],
  features: {
    pages: false
  },

  googleFonts: {
    families: {
      Inter: [400, 500, 600, 700],
      Roboto: [400, 700],
    }
  },

  shadcn: {
    prefix: '',
    componentDir: './components/ui'
  },

  axios: {
    baseURL: 'http://localhost:8000/api',
  },

  css: [
    '~/assets/css/tailwind.css'
  ],

  tailwindcss: {
    configPath: 'tailwind.config.js'
  }
});
