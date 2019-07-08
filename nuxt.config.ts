import NuxtConfiguration from '@nuxt/config'
import pkg from './package.json'

const config: NuxtConfiguration = {
  mode: 'universal',
  srcDir: 'src/',

  /*
   ** Headers of the page
   */
  head: {
    title: 'Yukimy',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'メルクストーリア（メルスト）の非公式ツール集です。' }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  manifest: {
    name: pkg.name,
    lang: 'ja',
    start_url: '.',
    description: pkg.description
  },
  workbox: {
    runtimeCaching: [
      {
        urlPattern: 'https://script.google.com/.*',
        handler: 'staleWhileRevalidate',
        options: {
          cacheExpiration: {
            maxAgeSeconds: 1 * 60 * 60
          }
        }
      }
    ]
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },

  /*
   ** Global CSS
   */
  css: ['~/assets/css/buefy.scss'],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [],

  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // Doc: https://buefy.github.io/#/documentation
    ['nuxt-buefy', { css: false }],
    '@nuxtjs/pwa'
  ],
  /*
   ** Axios module configuration
   */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },

  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        if (!config.module) return

        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
export default config
