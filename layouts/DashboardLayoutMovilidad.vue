<template>
  <div class="wrapper">
    <notifications></notifications>
    <side-bar>
      <template slot-scope="props" slot="links">

        <sidebar-item translate="no" :link="{
          name: 'Indicadores de Calidad (Diario)',
          icon: 'ni ni-chart-pie-35 text-default',
          path: '/movilidad/rIcanlidadMovilidad',
        }" />

        <sidebar-item
          v-if="permisos != null && permisos.movilidad.active != null && permisos.movilidad.reportes.active != null && permisos.movilidad.reportes.indicadorConsolidado"
          translate="no" :link="{
            name: 'Indicadores de Calidad Consolidado (Mes)',
            icon: 'ni ni-chart-pie-35 text-default',
            path: '/movilidad/rIcalidadMovilidadConsolidado',
          }" />


        <sidebar-item
          v-if="permisos != null && permisos.movilidad.active != null && permisos.movilidad.reportes.active != null && permisos.movilidad.reportes.indicadorConsolidadoTotal"
          translate="no" :link="{
            name: 'Indicadores Consolidado T',
            icon: 'ni ni-chart-pie-35 text-default',
            path: '/movilidad/rIndicadorConsolidado',
          }" />

        <sidebar-item translate="no" :link="{
          name: 'Programación Operatica',
          icon: 'ni ni-archive-2 text-default',
          path: '/movilidad/programacionOperativa',
        }" />


        <sidebar-item translate="no" :link="{
          name: 'Tabla Operacional',
          icon: 'ni ni-bullet-list-67 text-danger',
          path: '/movilidad/tablaOperacional',
        }" />



        <sidebar-item translate="no" :link="{
          name: 'H. Recorridos',
          icon: 'ni ni-sound-wave text-warning',
          path: '/movilidad/rhrecorrido',
        }" />

        <sidebar-item translate="no" v-if="
          permisos != null &&
          permisos.movilidad.active !=
          null &&
          permisos.movilidad.reportes.active != null &&
          permisos.movilidad.reportes.rVelocidadMov"
          :link="{ name: 'R. Velocidad Mov', icon: 'ni ni-collection text-warning', path: '/movilidad/rvelocidadM' }" />

        <sidebar-item translate="no" v-if="
          permisos != null &&
          permisos.movilidad.active !=
          null &&
          permisos.movilidad.reportes.active != null &&
          permisos.movilidad.reportes.rConsolidadoSalidas"
          :link="{ name: 'R. Consolidado Salidas', icon: 'ni ni-bus-front-12 text-warning', path: '/movilidad/rConsolidadoSalidas' }" />

       <!--  <sidebar-item translate="no" v-if="
          permisos != null &&
          permisos.movilidad.active !=
          null &&
          permisos.movilidad.reportes.active != null &&
          permisos.movilidad.reportes.rOdometro" :link="{
            name: 'R. Odómetro',
            icon: 'ni ni-map-big text-default',
            path: '/movilidad/rOdometro',
          }" /> -->


      </template>
    </side-bar>
    <div class="main-content">
      <dashboard-navbar :type="$route.name == 'alternative' ? 'light' : 'default'"></dashboard-navbar>

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
import jwt_decode from "jwt-decode";

export default {
  components: {
    DashboardNavbar,
    DashboardContent,
  },
  data() {
    return {
      permisos: null,
    };
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
    decodedPermisos() {
      var decodeBase64 = window.atob(this.$cookies.get("token"));
      console.log("PERMISOS");
      console.log("PERMISOS");
      console.log("PERMISOS");
      this.permisos = this.$cookies.get("permisos");
      console.log(this.permisos);
    },
  },
  mounted() {
    this.decodedPermisos();
    this.initScrollbar();
  },
};
</script>
<style lang="scss"></style>
