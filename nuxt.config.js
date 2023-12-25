var path = require('path');
import fs from 'fs'
export default {
    ssr: false,
    srcDir: 'resources/nuxt/',
    app: {
        head: {
            title: 'The Murder Scene',
            titleTemplate: 'The Murder Scene',
            meta: [
                {charset: 'utf-8'},
                {name: 'viewport', content: 'width=device-width, initial-scale=1'},
                {hid: 'description', name: 'description', content: "Garry's Mod community home to unique gmod servers and the number one Murder server."},
                {property: 'og:image', content: 'http://murderscene.net/images/logo.png'},
                {property: 'og:image:secure_url', content: 'https://murderscene.net/images/logo.png'},
            ],
            link: [
                {
                rel: 'preconnect',
                href: 'https://fonts.googleapis.com'
                },
                {
                    rel: 'icon',
                    type: 'image/x-icon',
                    href: '/images/favicon.png'
                },
                {
                rel: 'stylesheet',
                href: 'https://fonts.googleapis.com/css?family=Noto+Sans:400,400i,700',
                crossorigin: ''
                }
            ]
        },
    },
    hooks: {},
    
    routeRules: {},
    css: [],
    plugins: [
        //{ src: '~/plugins/vue-stripe.js', ssr: false },
    ],
 
  
    components: true,
    buildModules: [
        '@nuxt/typescript-build',
    ],

    modules: ['@pinia/nuxt', '@element-plus/nuxt'],

 
    build: {
        publicPath: process.env.NODE_ENV === 'production' ? 'assets/' : null,
        extractCSS: true,
    },

    generate: {
        dir: 'nuxt-public',
    },

    server: {
        host: "0.0.0.0",
        port: 3000,
        https: true,
    },
    devServer: {
        host: "0.0.0.0",
        port: 3000,
        https: true,
    },

    vite: {
        /*server: {
            host: "0.0.0.0",
            port: 3000,
            strictPort: true,
            timing: false,

            hmr: {

                clientPort: 3001,
                timing: false,
                protocol: "wss",
                https: {
                    key: fs.readFileSync(path.resolve(__dirname, 'server.key')),
                    cert: fs.readFileSync(path.resolve(__dirname, 'server.crt'))
                },
            },
        }*/
    },

    extends: [
        'nuxt-seo-kit'
    ],

    runtimeConfig: {
        public: {
          siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://murderscene.net',
          siteName: 'The Murder Scene',
          siteDescription: "Garry's Mod community home to unique gmod servers and the number one Murder server.",
          siteImage: 'https://murderscene.net/images/logo.png',
          indexable: true,
          language: 'en', // prefer more explicit language codes like `en-AU` over `en`
          stripekey: process.env.STRIPE_KEY,
          gpPerDollar: process.env.GP_PER_DOLLAR,
        }
      },
    watchers: {
        webpack: {
            aggregateTimeout: 300,
            poll: 500,
        },
    },
}