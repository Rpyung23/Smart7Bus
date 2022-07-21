<template>
  <div class="wrapper">
    <notifications></notifications>
    <side-bar>
      <template slot-scope="props" slot="links">

        <sidebar-item v-if="permisos == null || permisos.monitoreo.active" :link="{
          name: 'Monitoreo',
          icon: 'ni ni-world text-success',
          path: './monitoreo',
        }">
        </sidebar-item>

        <sidebar-item v-if="permisos == null || permisos.flota_vehicular.active" :link="{
          name: 'Flota Vehicular',
          icon: 'ni ni-bus-front-12 text-primary',
          path: '/flotavehicular',
        }">
        </sidebar-item>

        <sidebar-item v-if="permisos == null || permisos.despacho.active" :link="{
          name: 'Despacho',
          icon: 'ni ni-calendar-grid-58 text-dark',
          path: '/despacho/panelDespacho',
        }">
        </sidebar-item>

        <sidebar-item v-if="permisos == null || permisos.editor_rutas.active" :link="{
          name: 'Editor de Rutas',
          icon: 'ni ni-vector text-danger',
          path: './rutas/controles',
        }">
        </sidebar-item>



        <sidebar-item v-if="permisos == null || permisos.produccion.active" :link="{
          name: 'Producción',
          icon: 'ni ni-money-coins text-green',
          path: './produccion/tablero',
        }">
        </sidebar-item>

        <sidebar-item v-if="permisos == null || permisos.liquidacion.active" :link="{
          name: 'Liquidación',
          icon: 'ni ni-money-coins text-green',
          path: './produccion/tablero',
        }">
        </sidebar-item>

        <sidebar-item v-if="permisos == null || permisos.recaudo.active" :link="{
          name: 'Recaudo',
          icon: 'ni ni-single-02 text-orange',
          path: './recaudo/rcontador',
        }">
        </sidebar-item>

        <sidebar-item v-if="permisos == null || permisos.reportes.active" :link="{
          name: 'Reportes',
          icon: 'ni ni-ungroup text-orange',
        }">
          <sidebar-item :link="{ name: 'Recorrido', path: '/rdistancia' }" />
          <sidebar-item :link="{ name: 'Velocidades', path: './rvelocidades' }" />
          <sidebar-item :link="{ name: 'ANT', path: './rant' }" />
          <sidebar-item :link="{ name: 'Controles - Tiempo', path: './rant' }" />
        </sidebar-item>

        <sidebar-item v-if="permisos == null || permisos.historial.active" :link="{
          name: 'Historial',
          icon: 'ni ni-pin-3 text-info',
          path: './historial/recorrido',
        }">
        </sidebar-item>

        <sidebar-item v-if="permisos == null || permisos.movilidad.active" :link="{
          name: 'Movilidad',
          icon: 'ni ni-building text-default',
          path: './produccion/tablero',
        }">
        </sidebar-item>

      </template>

    </side-bar>
    <div class="main-content">
      <dashboard-navbar :type="$route.name === 'alternative' ? 'light' : 'default'"></dashboard-navbar>

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
      this.permisos = jwt_decode(decodeBase64).PermisosJSON
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
