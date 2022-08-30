<template>
  <div class="wrapper">
    <notifications></notifications>
    <side-bar>
      <template slot-scope="props" slot="links">

        <sidebar-item v-if="permisos != null && permisos.movilidad.iCalidadBruto != null && permisos.movilidad.iCalidadBruto != null && permisos.movilidad.iCalidadBruto" 
              :link="{ name: 'Incadores de Calidad',icon: 'ni ni-chart-pie-35 text-default', path: './rIcanlidadMovilidad' }" />


        <sidebar-item v-if="permisos != null && permisos.movilidad.iCalidad != null && permisos.movilidad.iCalidad != null && permisos.movilidad.iCalidad" 
              :link="{ name: 'Incadores de Calidad',icon: 'ni ni-chart-pie-35 text-default', path: './rIcanlidadMovilidad' }" />


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
      permisos: null
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
    decodedPermisos() {
      var decodeBase64 = window.atob(this.$cookies.get("token"))
      console.log("PERMISOS")
      this.permisos = this.$cookies.get("permisos")
    }
  },
  mounted() {
    this.decodedPermisos()
    this.initScrollbar()
  },
};
</script>
<style lang="scss">
</style>
