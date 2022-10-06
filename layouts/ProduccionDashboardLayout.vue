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
            path: ( oPermisosWebProduccionPanelJSON != null && oPermisosWebProduccionPanelJSON.produccionVueltas == 1) ? './tableroVueltas' :  './tablero',
          }"
        >
        </sidebar-item>

      <sidebar-item
      translate="no"
          :link="{
            name: 'Tablero Cobros',
            icon: 'ni ni-money-coins text-success',
            path: './tableroCobros',
          }"
        >
        </sidebar-item>

        <sidebar-item
        translate="no"
          :link="{
            name: 'Recibos',
            icon: 'ni ni-single-copy-04 text-primary',
          }"
        >
          <sidebar-item
          translate="no"
            :link="{ name: 'Recibos Pagos Vehiculo', path: './recibopagosvehiculo' }"
          />
          <!--<sidebar-item
            :link="{ name: 'Recibos Lineas', path: '#' }"
          />-->
        </sidebar-item>

        <sidebar-item
        translate="no"
          :link="{
            name: 'Reportes',
            icon: 'ni ni-book-bookmark text-blank',
          }"
        >
          <sidebar-item
          translate="no"
            :link="{ name: 'Minutos y Tarjetas', path: './rminutostarjeta' }"
          />
          <sidebar-item
          translate="no"
            :link="{ name: 'Minutos y Tarjetas (RESUMIDO)', path: './rminutostarjetaResumido' }"
          />
          <sidebar-item translate="no" :link="{ name: 'Cobros por Rubros', path: './rcobrosRubros' }" />
          <sidebar-item translate="no" :link="{ name: 'Resumidos Vehiculo', path: './resumidovehiculo' }" />
          
          <!--<sidebar-item
            :link="{ name: 'Pagos Vehiculo Resumido', path: './rpagosvehiculoresumido' }"
          />-->

        </sidebar-item>

        <sidebar-item
      translate="no"
          :link="{
            name: 'Estadistico Controles',
            icon: 'ni ni-chart-bar-32 text-success',
            path: './estadistico',
          }"
        >
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
      oPermisosWebProduccionPanelJSON:null
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
    this.initScrollbar();
  },
};
</script>
<style lang="scss">
</style>
