<template>
    <div class="wrapper">
      <notifications></notifications>
      <side-bar>
        <template slot="links">
          <sidebar-item
          translate="no"
            :link="{
              name: 'Tablero',
              icon: 'ni ni-collection text-default',
              path: '/tablero',
            }"
          >
          </sidebar-item>
    
        <sidebar-item
        translate="no"
            :link="{
              name: 'Reportes',
              icon: 'ni ni-book-bookmark text-blank',
              path: '/tmantenimiento',
            }"
          >
          </sidebar-item>
  
          <sidebar-item
        translate="no"
          :link="{
            name: 'Configuración',
            icon: 'ni ni-settings-gear-65',
          }"
        >
          <sidebar-item
          translate="no"
            :link="{ name: 'Tipos Mantenimiento', path: '/tmantenimiento' }"
          />
          <sidebar-item
          translate="no"
            :link="{ name: 'Asignar Mantenimiento', path: '/amantenimiento' }"
          />
          
          <!--<sidebar-item
            :link="{ name: 'Pagos Vehiculo Resumido', path: '/rpagosvehiculoresumido' }"
          />-->

        </sidebar-item>

  
        </template>
      </side-bar>
      <div class="main-content">
        <dashboard-navbar
          :type="$route.name === 'alternative' ? 'light' : 'default'"
        ></dashboard-navbar>
  
        <div @click="$sidebar.displaySidebar(false)">
          <nuxt></nuxt>
        </div>
      </div>
    </div>
  </template>
  <script>
  /* eslint-disable no-new */
  import PerfectScrollbar from "perfect-scrollbar";
  import "perfect-scrollbar/css/perfect-scrollbar.css";
  
  function hasElement(className) {
    return document.getElementsByClassName(className).length > 0;
  }
  
  function initScrollbar(className) {
    if (hasElement(className)) {
      new PerfectScrollbar(`.${className}`);
    } else {
      // try to init it later in case this component is loaded async
      setTimeout(() => {
        initScrollbar(className);
      }, 100);
    }
  }
  
  import DashboardNavbar from "~/components/layouts/argon/DashboardNavbar.vue";
  import DashboardContent from "~/components/layouts/argon/Content.vue";
  
  export default {
    components: {
      DashboardNavbar,
      DashboardContent,
    },
    data()
    {
      return {
        oPermisosWebProduccionPanelJSON:null,
        pathTableroVueltas:'/tablero',
        pathTableroVueltasCobros:'/tableroCobros',
        pathRecibopagosvehiculo: '/recibopagosvehiculo',
        pathRminutostarjetaResumidoVueltas: '/rminutostarjetaResumido',
        pathRminutostarjeta : '/rminutostarjeta',
        pathResumidoVehiculo : '/resumidovehiculo'
      }
    },
    methods: {
      initScrollbar() {
        let isWindows = navigator.platform.startsWith("Win");
        if (isWindows) {
          initScrollbar("navbar-inner");
          initScrollbar("main-content");
          initScrollbar("sidenav");
        }
      },
    },
    mounted() {
      this.oPermisosWebProduccionPanelJSON = this.$cookies.get("WebProduccion")
      this.pathTableroVueltas = (this.oPermisosWebProduccionPanelJSON != null &&  
                                 this.oPermisosWebProduccionPanelJSON.produccionVueltas != null && 
                                 this.oPermisosWebProduccionPanelJSON.produccionVueltas == 1) ? '/tableroVueltas' :  '/tablero'
      
      this.pathTableroVueltasCobros = (this.oPermisosWebProduccionPanelJSON != null &&  
                                 this.oPermisosWebProduccionPanelJSON.produccionVueltas != null && 
                                 this.oPermisosWebProduccionPanelJSON.produccionVueltas == 1) ? '/tableroCobrosVueltas' :  '/tableroCobros'  
  
      this.pathRecibopagosvehiculo = (this.oPermisosWebProduccionPanelJSON != null &&  
                                 this.oPermisosWebProduccionPanelJSON.produccionVueltas != null && 
                                 this.oPermisosWebProduccionPanelJSON.produccionVueltas == 1) ? '/recibopagosvehiculoVueltas' : '/recibopagosvehiculo'
      
      this.pathRminutostarjetaResumidoVueltas = (this.oPermisosWebProduccionPanelJSON != null &&  
                                 this.oPermisosWebProduccionPanelJSON.produccionVueltas != null && 
                                 this.oPermisosWebProduccionPanelJSON.produccionVueltas == 1) ? '/rminutostarjetaResumidoVueltas' : '/rminutostarjetaResumido'
     
      this.pathRminutostarjeta = (this.oPermisosWebProduccionPanelJSON != null &&  
                                 this.oPermisosWebProduccionPanelJSON.produccionVueltas != null && 
                                 this.oPermisosWebProduccionPanelJSON.produccionVueltas == 1) ? '/rminutostarjetaVueltas' : '/rminutostarjeta'
     
      this.pathResumidoVehiculo = (this.oPermisosWebProduccionPanelJSON != null &&  
                                  this.oPermisosWebProduccionPanelJSON.produccionVueltas != null && 
                                  this.oPermisosWebProduccionPanelJSON.produccionVueltas == 1) ? '/resumidovehiculoVueltas' : '/resumidovehiculo'
     
                                 
      this.initScrollbar();
    },
  };
  </script>
  <style lang="scss">
  </style>
  