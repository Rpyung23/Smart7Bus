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
            path: pathTableroVueltas,
          }"
        >
        </sidebar-item>

        <sidebar-item
          translate="no"
          v-if="TableroPerjudicado"
          :link="{
            name: 'Perjudicado',
            icon: 'ni ni-bus-front-12 text-warning',
            path: '/produccion/tableroPerjudicaVueltas',
          }"
        >
        </sidebar-item>

        <sidebar-item
          translate="no"
          :link="{
            name: 'Tablero Cobros',
            icon: 'ni ni-money-coins text-success',
            path: pathTableroVueltasCobros,
          }"
        >
        </sidebar-item>

        <sidebar-item
          translate="no"
          v-if="tableroCobroTarjeta"
          :link="{
            name: 'Tablero Cobro Tarjeta',
            icon: 'ni ni-single-copy-04 text-danger',
            path: '/produccion/tableroCobrosTarjeta',
          }"
        >
        </sidebar-item>

        <sidebar-item
          translate="no"
          v-if="rminutossancionconsorcio"
          :link="{
            name: 'Minutos Sanción C.',
            icon: 'ni ni-single-02 text-default',
            path: '/produccion/rminutosSancionConsorcio',
          }"
        >
        </sidebar-item>

        <sidebar-item
          translate="no"
          v-if="pathRecibopagosvehiculo != null"
          :link="{
            name: 'Recibos',
            icon: 'ni ni-single-copy-04 text-primary',
            path: pathRecibopagosvehiculo,
          }"
        >
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
            :link="{
              name: 'Valores Acumuladas',
              path: '/produccion/rdeudasacumuladas',
            }"
          />

          <sidebar-item
            translate="no"
            :link="{ name: 'Minutos y Tarjetas', path: pathRminutostarjeta }"
          />

          <sidebar-item
            translate="no"
            v-if="rminutosjustificadosvuelta"
            :link="{
              name: 'Minutos Justificados',
              path: '/produccion/rMinutosJustificadosVuelta',
            }"
          ></sidebar-item>

          <sidebar-item
            translate="no"
            v-if="rminutosjustificados"
            :link="{
              name: 'Minutos Justificados',
              path: '/produccion/rMinutosJustificados',
            }"
          ></sidebar-item>

          <sidebar-item
            translate="no"
            :link="{
              name: 'Minutos y Tarjetas (RESUMIDO)',
              path: pathRminutostarjetaResumidoVueltas,
            }"
          />
          <sidebar-item
            translate="no"
            :link="{
              name: 'Cobros por Rubros',
              path: '/produccion/rcobrosRubros',
            }"
          />
          <sidebar-item
            translate="no"
            :link="{ name: 'Resumidos Vehiculo', path: pathResumidoVehiculo }"
          />

          <sidebar-item
            translate="no"
            :link="{
              name: 'Reporte Perjudicado',
              path: '/produccion/rPerjudicado',
            }"
          />

          <!--<sidebar-item
            :link="{ name: 'Pagos Vehiculo Resumido', path: '/rpagosvehiculoresumido' }"
          />-->
        </sidebar-item>

        <sidebar-item
          translate="no"
          v-if="rEstadisticoControles"
          :link="{
            name: 'Estadistico Controles',
            icon: 'ni ni-chart-bar-32 text-success',
            path: '/produccion/estadistico',
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
  data() {
    return {
      oPermisosWebProduccionPanelJSON: null,
      pathTableroVueltas: "/produccion/tablero",
      pathTableroVueltasCobros: "/produccion/tableroCobros",
      pathRecibopagosvehiculo: "/produccion/recibopagosvehiculo",
      pathRminutostarjetaResumidoVueltas: "/produccion/rminutostarjetaResumido",
      pathRminutostarjeta: "/produccion/rminutostarjeta",
      pathResumidoVehiculo: "/produccion/resumidovehiculo",
      rminutosjustificadosvuelta: false,
      rminutosjustificados: false,
      rPerjudicado: false,
      rminutossancionconsorcio: false,
      TableroPerjudicado: false,
      tableroCobroTarjeta: false,
      rEstadisticoControles: false,
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
    this.oPermisosWebProduccionPanelJSON = this.$cookies.get("WebProduccion");

    var permisos = this.$cookies.get("permisos");

    this.tableroCobroTarjeta =
      permisos.produccion != null &&
      permisos.produccion.tableroCobroTarjeta != null &&
      permisos.produccion.tableroCobroTarjeta
        ? true
        : false;

    this.TableroPerjudicado =
      permisos.produccion != null &&
      permisos.produccion.TableroPerjudicado != null &&
      permisos.produccion.TableroPerjudicado
        ? true
        : false;

    this.rEstadisticoControles =
      permisos.produccion != null &&
      permisos.produccion.rEstadisticoControles != null &&
      permisos.produccion.rEstadisticoControles
        ? true
        : false;

    this.rminutossancionconsorcio =
      permisos.produccion != null &&
      permisos.produccion.reportes != null &&
      permisos.produccion.reportes.rminutossancionconsorcio != null &&
      permisos.produccion.reportes.rminutossancionconsorcio
        ? true
        : false;

    this.rminutosjustificadosvuelta =
      permisos.produccion != null &&
      permisos.produccion.reportes != null &&
      permisos.produccion.reportes.RMinutosJustificadosVuelta != null &&
      permisos.produccion.reportes.RMinutosJustificadosVuelta
        ? true
        : false;

    this.rPerjudicado =
      permisos.produccion != null &&
      permisos.produccion.reportes != null &&
      permisos.produccion.reportes.rPerjudicado != null &&
      permisos.produccion.reportes.rPerjudicado == 1
        ? true
        : false;

    this.rminutosjustificados =
      permisos.produccion != null &&
      permisos.produccion.reportes != null &&
      permisos.produccion.reportes.RMinutosJustificados != null &&
      permisos.produccion.reportes.RMinutosJustificados
        ? true
        : false;

    this.pathTableroVueltas =
      this.oPermisosWebProduccionPanelJSON != null &&
      this.oPermisosWebProduccionPanelJSON.produccionVueltas != null &&
      this.oPermisosWebProduccionPanelJSON.produccionVueltas == 1
        ? "/produccion/tableroVueltas"
        : "/produccion/tablero";

    this.pathTableroVueltasCobros =
      this.oPermisosWebProduccionPanelJSON != null &&
      this.oPermisosWebProduccionPanelJSON.produccionVueltas != null &&
      this.oPermisosWebProduccionPanelJSON.produccionVueltas == 1
        ? "/produccion/tableroCobrosVueltas"
        : "/produccion/tableroCobros";

    this.pathRecibopagosvehiculo =
      this.oPermisosWebProduccionPanelJSON != null &&
      this.oPermisosWebProduccionPanelJSON.produccionVueltas != null &&
      this.oPermisosWebProduccionPanelJSON.produccionVueltas == 1
        ? (this.oPermisosWebProduccionPanelJSON.reciboPagoVehiculoVuelta != null 
        && this.oPermisosWebProduccionPanelJSON.reciboPagoVehiculoVuelta != false ? "/produccion/recibopagosvehiculoVueltas" : null)
        : (this.oPermisosWebProduccionPanelJSON.reciboPagoVehiculo != null 
        && this.oPermisosWebProduccionPanelJSON.reciboPagoVehiculo != false ? "/produccion/recibopagosvehiculo" : null)

    this.pathRminutostarjetaResumidoVueltas =
      this.oPermisosWebProduccionPanelJSON != null &&
      this.oPermisosWebProduccionPanelJSON.produccionVueltas != null &&
      this.oPermisosWebProduccionPanelJSON.produccionVueltas == 1
        ? "/produccion/rminutostarjetaResumidoVueltas"
        : "/produccion/rminutostarjetaResumido";

    this.pathRminutostarjeta =
      this.oPermisosWebProduccionPanelJSON != null &&
      this.oPermisosWebProduccionPanelJSON.produccionVueltas != null &&
      this.oPermisosWebProduccionPanelJSON.produccionVueltas == 1
        ? "/produccion/rminutostarjetaVueltas"
        : "/produccion/rminutostarjeta";

    this.pathResumidoVehiculo =
      this.oPermisosWebProduccionPanelJSON != null &&
      this.oPermisosWebProduccionPanelJSON.produccionVueltas != null &&
      this.oPermisosWebProduccionPanelJSON.produccionVueltas == 1
        ? "/produccion/resumidovehiculoVueltas"
        : "/produccion/resumidovehiculo";

    this.initScrollbar();
  },
};
</script>
<style lang="scss"></style>
