
/*!

=========================================================
* Nuxt Argon Dashboard PRO - v1.4.0
=========================================================

* Product Page: https://www.creative-tim.com/product/nuxt-argon-dashboard-pro
* Copyright 2019 Creative Tim (https://www.creative-tim.com)

* Coded by www.creative-tim.com

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

const pkg = require('./package')
//console.log('ENV', process.env.NODE_ENV)

module.exports = {
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
    script:[{
      src:"https://rawgit.com/anhr/resizer/master/Common.js"
    },{
      src:"https://rawgit.com/anhr/resizer/master/resizer.js"
    },{
      src:"https://code.jquery.com/jquery-3.6.0.js"
    },{
      src:"https://unpkg.com/boxicons@2.1.2/dist/boxicons.js"
    }]
    ,
    link: [
      { rel: 'icon', type: 'image/png', href: 'favicon.png' },
      { rel:'stylesheet', href: 'https://unpkg.com/boxicons@2.1.2/css/boxicons.min.css'},
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700'},
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
  vendor:["vue-google-maps"],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/dashboard/dashboard-plugin',
    {src: '~/plugins/dashboard/full-calendar', ssr: false },
    {src: '~/plugins/dashboard/world-map', ssr: false },
    {src: '~/plugins/map/vue2-google-maps.js', ssr: false },
  ],

  loading: false,
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    'cookie-universal-nuxt',
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
    transpile: [
      'vee-validate/dist/rules'
    ],
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
    /*baseUrl: 'https://urbanorest.smart7bus.com/v2/',
    baseUrlPanel: 'https://urbanorest.smart7bus.com/v2/system',
    baseUrlPanelRecaudo:'https://urbanorest.smart7bus.com/v2/system/recaudo'*/
    /*baseUrl: 'https://api-flota.herokuapp.com/v2/',
    baseUrlPanel: 'https://api-flota.herokuapp.com/v2/system',
    baseUrlPanelRecaudo:'https://api-flota.herokuapp.com/v2/system/recaudo'*/
    baseUrl: process.env.baseUrl || 'http://localhost:3001',
    baseUrlPanel: process.env.baseUrlPanel || 'http://localhost:3001',
}
}
