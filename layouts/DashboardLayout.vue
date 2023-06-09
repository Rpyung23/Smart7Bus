<template>
  <div class="wrapper">
    <notifications></notifications>
    <side-bar>
      <template slot-scope="props" slot="links">

        <sidebar-item translate="no" v-if="permisos != null  && permisos.monitoreo != null && permisos.monitoreo.active != null && permisos.monitoreo.active" :link="{
          name: 'Monitoreo',
          icon: 'ni ni-world text-success',
          path: './monitoreo',
        }">
        </sidebar-item>

        <sidebar-item translate="no" v-if="permisos != null && permisos.flota_vehicular != null && permisos.flota_vehicular.active != null && permisos.flota_vehicular.active" :link="{
          name: 'Flota Vehicular',
          icon: 'ni ni-bus-front-12 text-primary',
          path: './flotavehicular',
        }">
        </sidebar-item>

        <sidebar-item translate="no" v-if="permisos != null && permisos.despacho != null && permisos.despacho.active != null && permisos.despacho.active" :link="{
          name: 'Despacho',
          icon: 'ni ni-calendar-grid-58 text-dark',
          path: (permisos != null && permisos.despacho != null && permisos.despacho.active != null && permisos.despacho.active && permisos.despacho.panelDespacho != null && permisos.despacho.panelDespacho.active != null && permisos.despacho.panelDespacho.active ? '/despacho/panelDespacho' : '/despacho/panelDespachoBusqueda' ),
        }">
        </sidebar-item>

        <!--<sidebar-item
          translate="no"
          :link="{
            name: 'Rol Programado',
            icon: 'ni ni-archive-2 text-danger',
            path: './despacho_automatico/CalendarioDespachoAutomatico',
          }"
        >
        </sidebar-item>-->

        <sidebar-item translate="no" v-if="permisos != null && permisos.editor_rutas != null && permisos.editor_rutas.active != null && permisos.editor_rutas.active" :link="{
          name: 'Editor de Rutas',
          icon: 'ni ni-vector text-danger',
          path: './rutas/controles',
        }">
        </sidebar-item>

        
        <sidebar-item translate="no" v-if="permisos != null && permisos.Mantenimiento != null && permisos.Mantenimiento.active != null && permisos.Mantenimiento.active" :link="{
          name: 'Mantenimiento',
          icon: 'ni ni-settings text-primary',
          path: './mantenimiento/tablero',
              }">
        </sidebar-item>

        <sidebar-item translate="no" v-if="permisos != null && permisos.cajaComun != null && permisos.cajaComun.active != null && permisos.cajaComun.active" :link="{
          name: 'Caja Común',
          icon: 'ni ni-lock-circle-open text-green',
          path: './produccion/tablero',
              }">
        </sidebar-item>


        <sidebar-item translate="no" v-if="permisos != null && permisos.produccion != null && permisos.produccion.active != null && permisos.produccion.active" :link="{
          name: 'Producción',
          icon: 'ni ni-money-coins text-green',
          path: pathProduccionTablero,
        }">
        </sidebar-item>
        

        <sidebar-item translate="no" v-if="permisos != null && permisos.liquidacion != null && permisos.liquidacion.active != null && permisos.liquidacion.active" :link="{
          name: 'Liquidación',
          icon: 'ni ni-money-coins text-green',
          path: './produccion/tablero',
        }">
        </sidebar-item>

        <sidebar-item translate="no" v-if="permisos != null  && permisos.recaudo != null && permisos.recaudo.active != null && permisos.recaudo.active && permisos.recaudo.reportes.active != null && permisos.recaudo.reportes.active" :link="{
          name: 'Recaudo',
          icon: 'ni ni-single-02 text-orange',
          path: './recaudo/rcontador',
        }">
        </sidebar-item>

        <sidebar-item
          translate="no"
          v-if="permisos != null  && permisos.recaudo != null && permisos.recaudo.active != null && permisos.recaudo.active  && permisos.recaudo.isGadAmbatoM != null && permisos.recaudo.isGadAmbatoM" 
          :link="{
            name: 'Recaudo GAD (M)',
            icon: 'ni ni-single-02 text-danger',
            path: './rcontadorGadAmbatoMes',
          }"
        />

        <sidebar-item
          translate="no"
          v-if="permisos != null  && permisos.recaudo != null && permisos.recaudo.active != null && permisos.recaudo.active  && permisos.recaudo.isGadAmbatoD != null && permisos.recaudo.isGadAmbatoD" 
          :link="{
            name: 'Recaudo GAD (D)',
            icon: 'ni ni-single-02 text-danger',
            path: './rcontadorGadAmbato',
          }"
        />

        <sidebar-item translate="no" v-if="permisos != null  && permisos.reportes != null && permisos.reportes.active != null && permisos.reportes.active" :link="{
          name: 'Reportes',
          icon: 'ni ni-ungroup text-orange',
        }">

          <sidebar-item :link="{ name: 'R. Kilometros', path: './rdistancia' }" translate="no"/>
          <sidebar-item :link="{ name: 'Velocidades', path: './rvelocidades' }" translate="no"/>
          <sidebar-item :link="{ name: 'ANT', path: './rant' }" />
          <sidebar-item :link="{ name: 'R. Gasolineras', path: './rGasolinera' }" translate="no"/>
          <sidebar-item :link="{ name: 'R. Puertas', path: './rPuertas' }" translate="no"/>
          <sidebar-item :link="{ name: 'R. Tipos Eventos', path: './rTiposEventos' }" translate="no"/>
          <sidebar-item :link="{ name: 'R. Fuera de Ruta', path: './rFueraRuta' }" translate="no"/>
          
          
        </sidebar-item>


        <sidebar-item translate="no" v-if="permisos != null && permisos.historial != null && permisos.historial.active != null && permisos.historial.active" :link="{
          name: 'Historial',
          icon: 'ni ni-pin-3 text-info',
          path: './historial/recorrido',
        }">
        </sidebar-item>

        
        <sidebar-item translate="no" v-if="permisos != null && permisos.movilidad != null && permisos.movilidad.active != null && permisos.movilidad.active" 
              :link="{ name: 'Movilidad',icon: 'ni ni-building text-dark', path: './movilidad/rIcanlidadMovilidad' }" />


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
      pathProduccionTablero: './produccion/tablero'
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
  mounted() 
  {
    this.oPermisosWebProduccionPanelJSON = this.$cookies.get("WebProduccion")
    this.pathProduccionTablero = (this.oPermisosWebProduccionPanelJSON != null &&  
                               this.oPermisosWebProduccionPanelJSON.produccionVueltas != null && 
                               this.oPermisosWebProduccionPanelJSON.produccionVueltas == 1) ? 
                               './produccion/tableroVueltas' :  './produccion/tablero'

    this.decodedPermisos()
    this.initScrollbar()
  },
};
</script>
<style lang="scss">
</style>
