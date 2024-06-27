<template>
  <div class="wrapper">
    <notifications></notifications>
    <side-bar>
      <template slot="links">
        <sidebar-item
          translate="no"
          v-if="TableroJusti"
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
          v-if="Recibopagosvehiculo"
          :link="{
            name: 'Recibo Minutos',
            icon: 'ni ni-single-copy-04 text-primary',
            path: '/produccion/recibopagosvehiculo',
          }"
        >
        </sidebar-item>

        <sidebar-item
          translate="no"
          v-if="RecibopagosvehiculoV"
          :link="{
            name: 'Recibo Minutos',
            icon: 'ni ni-single-copy-04 text-primary',
            path: '/produccion/recibopagosvehiculoVueltas',
          }"
        >
        </sidebar-item>

        <sidebar-item
          translate="no"
          v-if="ReciboTarjetapagosvehiculoV"
          :link="{
            name: 'Recibo Tarjeta',
            icon: 'ni ni-single-copy-04 text-info',
            path: '/produccion/recibotarjetavehiculo',
          }"
        >
        </sidebar-item>

        <sidebar-item
          translate="no"
          v-if="ReporteProduccion"
          :link="{
            name: 'Reportes',
            icon: 'ni ni-book-bookmark text-blank',
          }"
        >
          <sidebar-item
            translate="no"
            :link="{
              name: 'Cobros por Rubros',
              path: '/produccion/rcobrosRubros',
            }"
          />

          <sidebar-item
            translate="no"
            v-if="rdeudasacumuladas"
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
          v-if="ResumidoVehiculoDia2"
            translate="no"
            :link="{
              name: 'Minutos Unidad (RESUMIDO)',
              path: '/produccion/rminutostarjetaResumido2',
            }"
          />

          <sidebar-item
            translate="no"
            v-if="rminutosSancionConsorcioGeneral"
            :link="{
              name: 'Minutos Sancion C. General',
              path: '/produccion/rminutosSancionConsorcioGeneral',
            }"
          />
          <sidebar-item
            translate="no"
            :link="{ name: 'Resumidos Vehiculo', path: pathResumidoVehiculo }"
          />

          <sidebar-item
            v-if="rPerjudicado"
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
      Tablero: false,
      TableroPerjudicado: false,
      tableroCobroTarjeta: false,
      rEstadisticoControles: false,
      ReporteProduccion: false,
      Recibopagosvehiculo: false,
      RecibopagosvehiculoV: false,
      ResumidoVehiculoDia2: false,
      rminutosSancionConsorcioGeneral: false,
      rdeudasacumuladas: false,
      ReciboTarjetapagosvehiculoV: false,
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
    console.log(permisos);
    console.log("REPORTE PERMISOS");
    console.log(permisos.produccion.reportes.active);
    console.log("permisos.produccion.tablero \n");
    console.log(permisos.produccion.tablero.active);
    console.log(this.Tablero);

    this.ReporteProduccion =
      permisos.produccion != null &&
      permisos.produccion.reportes != null &&
      permisos.produccion.reportes.active != null
        ? permisos.produccion.reportes.active
        : false;

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

    this.rdeudasacumuladas =
      permisos.produccion != null &&
      permisos.produccion.rdeudasacumuladas != null &&
      permisos.produccion.rdeudasacumuladas
        ? true
        : false;

    this.rminutosSancionConsorcioGeneral =
      permisos.produccion != null &&
      permisos.produccion.reportes != null &&
      permisos.produccion.reportes.rminutosSancionConsorcioGeneral != null &&
      permisos.produccion.reportes.rminutosSancionConsorcioGeneral
        ? true
        : false;

    this.ResumidoVehiculoDia2 =
      permisos.produccion != null &&
      permisos.produccion.reportes != null &&
      permisos.produccion.reportes.ResumidoVehiculoDia2 != null &&
      permisos.produccion.reportes.ResumidoVehiculoDia2
        ? true
        : false;

    this.Tablero =
      permisos.produccion != null &&
      permisos.produccion.tablero.active != null &&
      permisos.produccion.tablero.active
        ? true
        : false;

    this.Tablero =
      permisos.produccion != null &&
      permisos.produccion.active != null &&
      permisos.produccion.tablero.active != null &&
      permisos.produccion.tablero.active
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
      permisos.produccion.reportes.rPerjudicado
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
      this.oPermisosWebProduccionPanelJSON.produccionVueltas
        ? "/produccion/tableroVueltas"
        : "/produccion/tablero";

    this.TableroJusti =
      permisos != null &&
      permisos.produccion != null &&
      permisos.produccion.active != null &&
      permisos.produccion.active &&
      permisos.produccion.tablero != null &&
      permisos.produccion.tablero.active != null &&
      permisos.produccion.tablero.active;

    this.pathTableroVueltasCobros =
      this.oPermisosWebProduccionPanelJSON != null &&
      this.oPermisosWebProduccionPanelJSON.produccionVueltas != null &&
      this.oPermisosWebProduccionPanelJSON.produccionVueltas
        ? "/produccion/tableroCobrosVueltas"
        : "/produccion/tableroCobros";

    this.Recibopagosvehiculo =
      permisos.produccion != null &&
      permisos.produccion.Recibopagosvehiculo != null;
    permisos.produccion.Recibopagosvehiculo ? true : false;

    this.ReciboTarjetapagosvehiculoV =
      permisos.produccion != null &&
      permisos.produccion.ReciboTarjetapagosvehiculoV != null;
    permisos.produccion.ReciboTarjetapagosvehiculoV ? true : false;

    this.RecibopagosvehiculoV =
      permisos.produccion != null &&
      permisos.produccion.RecibopagosvehiculoV != null;
    permisos.produccion.RecibopagosvehiculoV ? true : false;

    this.pathRminutostarjetaResumidoVueltas =
      this.oPermisosWebProduccionPanelJSON != null &&
      this.oPermisosWebProduccionPanelJSON.produccionVueltas != null &&
      this.oPermisosWebProduccionPanelJSON.produccionVueltas
        ? "/produccion/rminutostarjetaResumidoVueltas"
        : "/produccion/rminutostarjetaResumido";

    this.pathRminutostarjeta =
      this.oPermisosWebProduccionPanelJSON != null &&
      this.oPermisosWebProduccionPanelJSON.produccionVueltas != null &&
      this.oPermisosWebProduccionPanelJSON.produccionVueltas
        ? "/produccion/rminutostarjetaVueltas"
        : "/produccion/rminutostarjeta";

    this.pathResumidoVehiculo =
      this.oPermisosWebProduccionPanelJSON != null &&
      this.oPermisosWebProduccionPanelJSON.produccionVueltas != null &&
      this.oPermisosWebProduccionPanelJSON.produccionVueltas
        ? "/produccion/resumidovehiculoVueltas"
        : "/produccion/resumidovehiculo";

    this.initScrollbar();
  },
};
</script>

<style lang="scss"></style>
