<template>
  <div class="wrapper">
    <notifications></notifications>
    <side-bar>
      <template slot="links">
        <sidebar-item
          :link="{
            name: 'Tablero',
            icon: 'ni ni-collection text-success',
            path: './tablero',
          }"
        >
        </sidebar-item>

        <sidebar-item
          :link="{
            name: 'Recibos',
            icon: 'ni ni-single-copy-04 text-primary',
          }"
        >
          <sidebar-item
            :link="{ name: 'Recibos Vehiculos', path: './recibopagosvehiculo' }"
          />
          <sidebar-item
            :link="{ name: 'Recibos Lineas', path: '#' }"
          />
        </sidebar-item>

        <sidebar-item
          :link="{
            name: 'Reportes',
            icon: 'ni ni-book-bookmark text-blank',
          }"
        >
          <sidebar-item
            :link="{ name: 'Minutos y Tarjetas', path: '/forms/elements' }"
          />
          <sidebar-item :link="{ name: 'Rubros', path: '/forms/components' }" />
          <sidebar-item :link="{ name: 'Pagos Vehiculo', path: './rpagosvehiculo' }" />
          <sidebar-item
            :link="{ name: 'Resumido Vehiculos', path: '/forms/elements' }"
          />
          <sidebar-item
            :link="{ name: 'Cobros Operador', path: '/forms/components' }"
          />
          <sidebar-item
            :link="{ name: 'Otros Rubros', path: '/forms/validation' }"
          />
        </sidebar-item>

        <sidebar-item
          :link="{
            name: 'Trabajando',
            icon: 'ni ni-calendar-grid-58 text-red',
            path: '/calendar',
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
    this.initScrollbar();
  },
};
</script>
<style lang="scss">
</style>
