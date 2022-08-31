<template>
  <base-nav container-classes="container-fluid" class="navbar-top border-bottom navbar-expand"
    :class="{ 'bg-success navbar-dark': type === 'default' }">
    <div id="titleGestionInteligente" class="col barraTitle">
      <span class="titleNavbar text-white mb-0 font-weight-bold">Gestión Inteligente de Transporte Urbano
      </span>
    </div>
    <!-- Navbar links -->
    <ul class="navbar-nav align-items-center ml-md-auto">
      <li class="nav-item d-xl-none">
        <!-- Sidenav toggler -->
        <div class="pr-3 sidenav-toggler" :class="{
          active: $sidebar.showSidebar,
          'sidenav-toggler-dark': type === 'default',
          'sidenav-toggler-light': type === 'light',
        }" @click="toggleSidebar">
          <div class="sidenav-toggler-inner">
            <i class="sidenav-toggler-line"></i>
            <i class="sidenav-toggler-line"></i>
            <i class="sidenav-toggler-line"></i>
          </div>
        </div>
      </li>

      <!--<li class="nav-item d-sm-none">
        <a class="nav-link" href="#" data-action="search-show" data-target="#navbar-search-main">
          <i class="ni ni-zoom-split-in"></i>
        </a>
      </li>-->

      <iframe id="reloj" src="https://free.timeanddate.com/clock/i8cxjbwb/n4622/fn8/fs18/fcfff/tc2a8d62/pa6/th1/ta1"
        frameborder="0" width="142" height="32"></iframe>


      <!--<span class="reloj">{{ hora }}</span>-->
      <div class="espacio" v-if="oEspacio" style="margin-right:0.8rem;">

      </div>

      <base-dropdown class="nav-item" tag="li" title-classes="nav-link" title-tag="a" icon="ni ni-bell-55"
        :visibleBadge="visibleBadgeNotification" :hasToggle="false"
        menu-classes="dropdown-menu-xl dropdown-menu-right py-0 overflow-hidden"
        v-if="permisos != null && permisos.notification != null && permisos.notification.active != null && permisos.notification.active">
        <template>
          <!-- Dropdown header -->
          <div class="px-3 py-3">
            <h6 class="text-sm text-muted m-0">
              Tu tienes
              <strong class="text-primary">{{
                  mListaAlertasDispositivosNotificaciones.length
              }}</strong>
              notificaciones de dispositivos.
            </h6>
          </div>
          <!-- List group -->
          <div class="
              list-group list-group-flush
              container-list-Notificaiones-Alerta
            ">
            <a href="#!" class="list-group-item list-group-item-action"
              v-for="alerta in mListaAlertasDispositivosNotificaciones" :key="alerta.idDispEven">
              <div class="row align-items-center">
                <div class="col-auto">
                  <img alt="Image placeholder" src="img/monitoreo/alerta_lista_big.png" class="avatar rounded-circle" />
                </div>
                <div class="col ml--2">
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <h4 class="mb-0 text-sm">
                        Unidad N°{{ alerta.CodiVehiDispEven }} Dispositivo N°
                        {{ alerta.CodiDispDispEven }}
                      </h4>
                    </div>
                    <div class="text-right text-muted">
                      <small>{{ alerta.HoraDispEven }}</small>
                    </div>
                  </div>
                  <p class="text-sm mb-0">
                    {{ alerta.DescDispEvenList }}
                    {{ alerta.DescCtrl != null ? alerta.DescCtrl : "" }}
                  </p>
                </div>
              </div>
            </a>
          </div>
          <!-- View all -->
          <a href="#!" class="dropdown-item text-center text-primary font-weight-bold py-3">Ver todo</a>
        </template>
      </base-dropdown>

      <base-button size="sm" v-if="permisos != null && permisos.ajustes != null && permisos.ajustes.active != null && permisos.ajustes.active" type="secondary" @click="showAjustes()" style="margin-right: 0rem; color:#172b4d">
        <span class="btn-inner--icon"><i class="ni ni-settings-gear-65" style="font-size: 1rem;"></i></span>
      </base-button>


      <base-dropdown menu-classes="dropdown-menu-lg dropdown-menu-dark bg-default dropdown-menu-right" class="nav-item"
        tag="li" title-tag="a" title-classes="nav-link" icon="ni ni-ungroup">
        <template>
          <div class="row shortcuts px-4">
            <a href="./despacho/panelDespacho" class="col-4 shortcut-item"
              v-if="permisos != null && permisos.despacho != null && permisos.despacho.active != null && permisos.despacho.active">
              <span class="shortcut-media avatar rounded-circle bg-gradient-red">
                <i class="ni ni-calendar-grid-58"></i>
              </span>
              <small>Despacho</small>
            </a>
            <a href="./monitoreo" class="col-4 shortcut-item" v-if="permisos != null && permisos.monitoreo != null && permisos.monitoreo.active != null && permisos.monitoreo.active">
              <span class="shortcut-media avatar rounded-circle bg-gradient-orange">
                <i class="ni ni-bus-front-12"></i>
              </span>
              <small>Monitoreo</small>
            </a>
            <a href="./produccion/tablero" class="col-4 shortcut-item"
              v-if="permisos != null && permisos.produccion != null && permisos.produccion.active != null && permisos.produccion.active">
              <span class="shortcut-media avatar rounded-circle bg-gradient-info">
                <i class="ni ni-credit-card"></i>
              </span>
              <small>Producción</small>
            </a>
            <a href="#!" class="col-4 shortcut-item" v-if="permisos != null && permisos.liquidacion != null && permisos.liquidacion.active != null && permisos.liquidacion.active">
              <span class="shortcut-media avatar rounded-circle bg-gradient-green">
                <i class="ni ni-money-coins"></i>
              </span>
              <small>Liquidación</small>
            </a>
            <a href="./historial/recorrido" class="col-4 shortcut-item"
              v-if="permisos != null && permisos.historial != null && permisos.historial.active != null && permisos.historial.active">
              <span class="shortcut-media avatar rounded-circle bg-gradient-purple">
                <i class="ni ni-pin-3"></i>
              </span>
              <small>Historial</small>
            </a>
            <a href="./recaudo/rcontador" class="col-4 shortcut-item"
              v-if="permisos != null && permisos.recaudo != null && permisos.recaudo.active != null && permisos.recaudo.active">
              <span class="shortcut-media avatar rounded-circle bg-gradient-yellow">
                <i class="ni ni-single-02"></i>
              </span>
              <small>Recaudo</small>
            </a>
          </div>
        </template>
      </base-dropdown>

    </ul>
    <ul class="navbar-nav align-items-center ml-auto ml-md-0">
      <base-dropdown menu-on-right class="nav-item" tag="li" title-tag="a" title-classes="nav-link pr-0">
        <a href="#" class="nav-link pr-0" @click.prevent slot="title-container">
          <div class="media align-items-center">
            <span class="avatar avatar-sm rounded-circle">
              <img alt="Image placeholder" :src="logo" />
            </span>
            <div class="media-body ml-2 d-none d-lg-block">
              <span class="mb-0 text-sm font-weight-bold"></span>
            </div>
          </div>
        </a>

        <template>
          <!--<div class="dropdown-header noti-title">
            <h6 class="text-overflow m-0">Welcome!</h6>
          </div>
          <a href="#!" class="dropdown-item">
            <i class="ni ni-single-02"></i>
            <span>My profile</span>
          </a>
          <a href="#!" class="dropdown-item">
            <i class="ni ni-settings-gear-65"></i>
            <span>Settings</span>
          </a>
          <a href="#!" class="dropdown-item">
            <i class="ni ni-calendar-grid-58"></i>
            <span>Activity</span>
          </a>-->
          <li class="dropdown-item">
            <i class="ni ni-circle-08"></i>
            <span>{{
                  nameUsuario
              }}</span>
          </li>
          <div class="dropdown-divider"></div>
          <a :href="hrefLogOut" class="dropdown-item" @click="cerrarSession()">
            <i class="ni ni-user-run"></i>
            <span>Cerrar Sesión</span>
          </a>
        </template>
      </base-dropdown>
    </ul>


    <!--Classic modal-->
    <modal :show.sync="ModalClasicAjustes">
      <h6 slot="header" class="modal-title">Type your modal title</h6>

      <p>Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the
        blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language
        ocean.</p>
      <p>A small river named Duden flows by their place and supplies it with the necessary regelialia. It is a
        paradisematic country, in which roasted parts of sentences fly into your mouth.</p>


      <template slot="footer">
        <base-button type="primary">Save changes</base-button>
        <base-button type="link" class="ml-auto" @click="ModalClasicAjustes = false">Close</base-button>
      </template>

    </modal>


  </base-nav>
</template>
<script>
import { CollapseTransition } from "vue2-transitions";
import { Modal, BaseAlert } from '@/components/argon-core';
import BaseNav from "@/components/argon-core/Navbar/BaseNav.vue";
import { Badge } from "element-ui";
import jwt_decode from "jwt-decode";

export default {
  components: {
    CollapseTransition,
    BaseNav,
    Modal,
    BaseAlert,
    [Badge.name]: Badge,
  },
  props: {
    type: {
      type: String,
      default: "default", // default|light
      description:
        "Look of the dashboard navbar. Default (Green) or light (gray)",
    },
  },
  computed: {
    routeName() {
      const { name } = this.$route;
      return this.capitalizeFirstLetter(name);
    },
  },
  data() {
    return {
      ModalClasicAjustes:false,
      hora: "00:00:00",
      nameUsuario: "SIN NOMBRE",
      mListaAlertasDispositivosNotificaciones: [],
      mListaAlertasDispositivosNotificacionesAux: [],
      logo: this.$cookies.get("logo"),
      activeNotifications: false,
      showMenu: false,
      searchModalVisible: false,
      visibleBadgeNotification: false,
      hrefLogOut:"./",
      searchQuery: "",
      permisos: null,
      oEspacio:false
    };
  },
  methods: {
    showAjustes() {
      this.ModalClasicAjustes = true
    },
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    toggleNotificationDropDown() {
      this.activeNotifications = !this.activeNotifications;
    },
    cerrarSession() {
      this.$cookies.set("token", null)
      this.$cookies.set("logo", null)
      this.$cookies.set("namesUsuario", null)
      this.$router.push({ path: "/" + this.$cookies.get("empresa"), replace: true });
    },
    /*mueveReloj() {
      var momentoActual = new Date();
      var hora = momentoActual.getHours();
      var minuto = momentoActual.getMinutes();
      var segundo = momentoActual.getSeconds();

      hora = hora < 1 ? 24 : hora;
      console.log("hora : " + hora);

      this.hora =
        (hora < 10 ? "0" + hora : hora) +
        " : " +
        (minuto < 10 ? "0" + minuto : minuto) +
        " : " +
        (segundo < 10 ? "0" + segundo : segundo) +
        (hora < 13 ? " AM " : " PM ");
    },*/
    closeDropDown() {
      this.activeNotifications = false;
    },
    toggleSidebar() {
      this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
    },
    hideSidebar() {
      this.$sidebar.displaySidebar(false);
    },

    reproducirSonido() {
      var encontrado = false
      if (this.mListaAlertasDispositivosNotificacionesAux.length > 0) {
        for (var contador = 0; contador < this.mListaAlertasDispositivosNotificacionesAux.length; contador++) {
          if (
            this.mListaAlertasDispositivosNotificacionesAux[contador].idDispEven !=
            this.mListaAlertasDispositivosNotificaciones[contador].idDispEven
          ) {
            console.log("NUEVO EVENTO")
            var audio = new Audio("mp3/alerta.mp3");
            this.visibleBadgeNotification = true;
            audio.play();
            contador = 9999999999999999999999999999;
            encontrado = true
          }
        }
      }

      if (!encontrado) {
        this.visibleBadgeNotification = false
      }
    },
    readNotificacionesAlertaDipositivos: async function () {
      var datos = await this.$axios.post(
        process.env.baseUrl + "/readAllAlertasDispotivos",
        {
          token: this.$cookies.get("token"),
        }
      );

      this.mListaAlertasDispositivosNotificaciones = [];

      if (datos.data.status_code == 200) {
        this.mListaAlertasDispositivosNotificaciones.push(...datos.data.datos);
        this.reproducirSonido();
        this.mListaAlertasDispositivosNotificacionesAux = []
        this.mListaAlertasDispositivosNotificacionesAux.push(
          ...this.mListaAlertasDispositivosNotificaciones
        );
      }
    },
    decodedPermisosNavBar() {
      /*var decodeBase64 = window.atob(this.$cookies.get("token"))*/
      this.permisos = this.$cookies.get("permisos")
      this.oEspacio = (this.permisos != null && this.permisos.notification != null && this.permisos.notification.active != null && this.permisos.notification.active) ? false : true
      /*if(this.permisos!=null && this.permisos.notification.active){
            this.readNotificacionesAlertaDipositivos();
    setInterval(() => {
      this.readNotificacionesAlertaDipositivos();
    }, 10000);
      }*/
    }
  },
  mounted() {
    this.decodedPermisosNavBar()

    /*this.mueveReloj();*/
    this.nameUsuario = this.$cookies.get("namesUsuario")
    this.hrefLogOut = "./"+this.$cookies.get("empresa");
    /*setInterval(() => {
      this.mueveReloj();
    }, 1000);*/

  },
};
</script>
<style>
@font-face {
  font-family: "digital-7";
  src: url("assets/css/nucleo/fonts/digital-7.ttf") format("truetype");
}

.container-list-Notificaiones-Alerta {
  height: 20rem !important;
  overflow: auto;
}

.barraTitle {
  display: flex;
  justify-content: center;
  align-content: center;
}

.titleNavbar {
  font-weight: 700;
  font-size: 1.45rem;
}


#t1 {
  color: white !important;
  /*background-color: #172b4d;*/
  background-color: #2a8d62 !important;
  width: 8.5rem !important;
  font-size: 1.5rem !important;
  font-family: "digital-7" !important;
  text-align: center !important;
  border-radius: 10px !important;
}

@media only screen and (max-width: 70em) {
  #titleGestionInteligente {
    display: none;
  }
}
</style>
