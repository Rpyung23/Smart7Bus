<template>
  <div class="wrapper">
    <notifications></notifications>
    <side-bar>
      <template slot="links">
        <sidebar-item
          translate="no"
          v-if="
            permisos != null &&
            permisos.despacho.panelDespacho != null &&
            permisos.despacho.panelDespacho.active
          "
          :link="{
            name: 'Despacho',
            icon: 'ni ni-calendar-grid-58 text-success',
            path: '/despacho/panelDespacho',
          }"
        >
        </sidebar-item>

        <sidebar-item
        translate="no"
          :link="{
            name: 'Rol Programado',
            icon: 'ni ni-calendar-grid-58 text-default',
            path: '/despacho/rol_programado'
          }">
        </sidebar-item>

        <sidebar-item
          translate="no"
          :link="{
            name: 'Despacho Busqueda',
            icon: 'ni ni-collection text-primary',
            path: '/despacho/panelDespachoBusqueda',
          }"
        >
        </sidebar-item>



        <sidebar-item
          translate="no"
          :link="{
            name: 'Reportes',
            icon: 'ni ni-ungroup text-blank',
          }"
        >
          <sidebar-item
            translate="no"
            :link="{ name: 'R. Salidas', path: '/despacho/rSalidas' }"
          />

          <sidebar-item
            translate="no"
            :link="{ name: 'R. Salidas Semanales', path: '/despacho/rPenalidadesSemanales' }"
          />

          <sidebar-item
            translate="no"
            :link="{ name: 'R. Salidas Semanales (Resumido)', path: '/despacho/rPenalidadesSemanalesResumido' }"
          />

          <sidebar-item
            translate="no"
            :link="{ name: 'R. Cumplimiento de Salidas', path: '/despacho/rCumplimientoSalidas' }"
          />

          <sidebar-item
            translate="no"
            v-if="
              permisos != null &&
              permisos.despacho.reportes.despachoGenerados != null &&
              permisos.despacho.reportes.despachoGenerados
            "
            :link="{
              name: 'Despachos Generados',
              path: '/despacho/rDespachosGenerados',
            }"
          />

          <sidebar-item
            translate="no"
            v-if="
              this.permisos != null &&
              this.permisos.despacho.reportes.despachoGeneradosSimplificado !=
                null &&
              this.permisos.despacho.reportes.despachoGeneradosSimplificado
            "
            :link="{
              name: 'Despachos Generados S/P',
              path: '/despacho/rDespachosGeneradosSim',
            }"
          />

          <sidebar-item
            translate="no"
            v-if="
              permisos != null &&
              permisos.despacho.reportes.reporteSalidasFrecuenciasControles !=
                null &&
              permisos.despacho.reportes.reporteSalidasFrecuenciasControles
            "
            :link="{
              name: 'R. Salidas F. Controles',
              path: '/despacho/rSalidasControles',
            }"
          />

          <sidebar-item
            translate="no"
            v-if="
              permisos != null &&
              permisos.despacho.reportes.reporteSalidasFrecuenciasControles1 !=
                null &&
              permisos.despacho.reportes.reporteSalidasFrecuenciasControles1
            "
            :link="{
              name: 'R. Salidas Controles (ESPECIFICOS)',
              path: '/despacho/rSalidasControles1',
            }"
          />

          <sidebar-item
            translate="no"
            v-if="
              permisos != null &&
              permisos.despacho.reportes.reporteSalidasFrecuenciasControles2 !=
                null &&
              permisos.despacho.reportes.reporteSalidasFrecuenciasControles2
            "
            :link="{
              name: 'R. Salidas Controles (OTROS)',
              path: '/despacho/rSalidasControles2',
            }"
          />


          <sidebar-item
            translate="no"
            v-if="
              permisos != null &&
              permisos.despacho.reportes.reporteSalidasFrecuenciasControles3 !=
                null &&
              permisos.despacho.reportes.reporteSalidasFrecuenciasControles3
            "
            :link="{
              name: 'R. Salidas Controles',
              path: '/despacho/rSalidasControles3',
            }"
          />

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
  },
  mounted() {
    this.permisos = this.$cookies.get("permisos");

    this.initScrollbar();
  },
};
</script>
<style lang="scss"></style>
