<template>
  <div class="wrapper">
    <notifications></notifications>
    <side-bar>
      <template slot="links">

        <sidebar-item
          :link="{
            name: 'Controles',
            icon: 'ni ni-ungroup text-success',
            path: './controles'
          }">
        </sidebar-item>

        <sidebar-item
          :link="{
            name: 'Tramos EX. Velocidad',
            icon: 'ni ni-vector text-danger',
            path: './tramos'
          }">
        </sidebar-item>


        <sidebar-item
          :link="{
            name: 'Rutas y Frecuencias',
            icon: 'ni ni-bus-front-12 text-primary',
            path: './rutasfrecuencias'
          }">
        </sidebar-item>



      </template>

    </side-bar>
    <div class="main-content">
      <dashboard-navbar :type="$route.name === 'alternative' ? 'light': 'default'"></dashboard-navbar>

      <div @click="$sidebar.displaySidebar(false)">
        <nuxt></nuxt>
      </div>
    </div>
  </div>
</template>
<script>
  /* eslint-disable no-new */
  import PerfectScrollbar from 'perfect-scrollbar';
  import 'perfect-scrollbar/css/perfect-scrollbar.css';

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

  import DashboardNavbar from '~/components/layouts/argon/DashboardNavbar.vue';
  import DashboardContent from '~/components/layouts/argon/Content.vue';

  export default {
    components: {
      DashboardNavbar,
      DashboardContent
    },
    methods: {
      initScrollbar() {
        let isWindows = navigator.platform.startsWith('Win');
        if (isWindows) {
          initScrollbar('navbar-inner');
          initScrollbar('main-content');
          initScrollbar('sidenav');
        }
      }
    },
    mounted() {
      this.initScrollbar()
    }
  };
</script>
<style lang="scss">
</style>
