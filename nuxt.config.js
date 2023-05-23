const pkg = require('./package')
    //console.log('ENV', process.env.NODE_ENV)

module.exports = {
    ssr: false,
    
    router: {
        base: '/',
        linkExactActiveClass: 'active',
        middleware: ['redirect']
    },
    /*
     ** Headers of the page
     */
    head: {
        title: 'Smart7Bus',
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: 'Smart7Bus rastreo satelital de transporte urbano.' }
        ],
        script: [{
            src: "https://rawgit.com/anhr/resizer/master/Common.js"
        }, {
            src: "https://rawgit.com/anhr/resizer/master/resizer.js"
        }, {
            src: "https://code.jquery.com/jquery-3.6.0.js"
        }, {
            src: "https://unpkg.com/boxicons@2.1.2/dist/boxicons.js"
        }, {
            src: "https://raw.githubusercontent.com/wilq32/jqueryrotate/master/jQueryRotate.js"
        }],
        link: [
            { rel: 'icon', type: 'image/png', href: 'favicon.png' },
            { rel: 'stylesheet', href: 'https://unpkg.com/boxicons@2.1.2/css/boxicons.min.css' },
            { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700' },
        ]
    },

    /*
     ** Customize the progress-bar color
     */


    /*
     ** Global CSS
     */

    css: [
        'assets/css/nucleo/css/nucleo.css',
        'assets/sass/argon.scss'
    ],
    vendor: ["vue-google-maps"],
    /*
     ** Plugins to load before mounting the App
     */
    plugins: [
        '~/plugins/dashboard/dashboard-plugin',
        '~/plugins/excel/vue-json-excel',
        { src: '~/plugins/dashboard/full-calendar', ssr: false },
        { src: '~/plugins/dashboard/world-map', ssr: false },
        { src: '~/plugins/map/vue2-google-maps.js', ssr: false },
    ],

    loading: false,
    /*
     ** Nuxt.js modules
     */
    modules: [
        // Doc: https://axios.nuxtjs.org/usage
        '@nuxtjs/axios',
        '@nuxtjs/pwa',
        '@nuxtjs/moment',
        'cookie-universal-nuxt'
    ],
    /*
     ** Axios module configuration
     */
    axios: {
        // See https://github.com/nuxt-community/axios-module#options
        headers: {
            common: {
              'Content-Type': 'application/json'
            }
          }
    },

    /*
     ** Build configuration
     */
    build: {
        analyze: false,
        transpile: [
            'vee-validate/dist/rules'
        ],
        maxChunkSize: 800000,
        /*
         ** You can extend webpack config here
         */
        extend(config, ctx) {

        },
        extractCSS: process.env.NODE_ENV === 'production',
        babel: {
            plugins: [
                [
                    "component",
                    {
                        "libraryName": "element-ui",
                        "styleLibraryName": "theme-chalk"
                    }
                ]
            ]
        }
    },
    env: {
        baseUrl: process.env.baseUrl || 'http://localhost:3001',
        baseUrlPanel: process.env.baseUrlPanel || 'http://localhost:3001',
        mapaCredencial: process.env.mapaCredencial || 'AIzaSyCMR83z2AyaiNJTfUHKechVpGh_MjLQvHA'
    }
}