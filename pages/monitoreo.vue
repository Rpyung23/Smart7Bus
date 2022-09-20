<template>
  <!-- eslint-disable vue/no-use-v-if-with-v-for,vue/no-confusing-v-for-v-if -->
  <div id="rezizeArea">
    <GmapMap
      :center="oCenter"
      :zoom="oZoom"
      :map-type-id="radioMapaMonitoreo"
      class="mapa"
      :options="{
        zoomControl: false,
        scaleControl: false,
        mapTypeControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        disableDefaultUi: true,
      }"
    >
      <GmapMarker
        v-for="(unidad, index) in mListUnidades"
        :key="unidad.CodiVehiMoni"
        v-if="unidad.isvisible"
        :position="{
          lat: parseFloat(unidad.UltiLatiMoni),
          lng: parseFloat(unidad.UltiLongMoni),
        }"
        :clickable="true"
        :draggable="false"
        :optimized="true"
        :icon="unidad.icono.imagen"
        @click="showInfoWindows(unidad, index)"
        :options="{
          label: {
            text: unidad.CodiVehiMoni,
            color: unidad.icono.color,
            className: 'paddingLabel',
          },
        }"
      />
      <GmapInfoWindow
        :options="infoOptions"
        :position="infoWindowPos"
        :opened="infoWinOpen"
        @closeclick="infoWinOpen = false"
      >
        <div v-html="infoContent"></div>
      </GmapInfoWindow>

      <GmapPolygon
        v-for="control in mListControlesMonitoreoAux"
        :key="control.CodiCtrl"
        :options="{
          strokeColor: '#172b4d',
          fillColor: '#172b4d80',
          strokeOpacity: 1.0,
          strokeWeight: 2,
        }"
        :strokeOpacity="0.5"
        :strokeWeight="1"
        :paths="control.calculator.coordinates"
      />

      <GmapMarker
        v-for="(control, index) in mListControlesMonitoreoAux"
        :key="control.DescCtrl + index"
        :position="{
          lat: parseFloat(control.Lati1Ctrl),
          lng: parseFloat(control.Long1Ctrl),
        }"
        :optimized="true"
        icon="static/img/control/control.png"
        :options="{
          label: {
            text: control.DescCtrl,
            color: '#172b4d',
            className: 'paddingLabelControl',
          },
        }"
      />
    </GmapMap>

    <div
      id="element2"
      class="container_unidades_monitoreo"
      :style="anchoPanelMonitoreoClickMinMax"
    >
      <div id="resizerXY"></div>
      <div class="min-max">
        <i class="bx-min-max bx bx-checkbox-minus" @click="minPanel()"></i>
        <i class="bx-min-max bx bx-windows" @click="maxPanel()"></i>
      </div>
      <div class="searchInput">
        <i class="bx bx-search"></i>
        <input
          type="text"
          class="inputSearchTexto"
          name=""
          id=""
          v-model="unidadInput"
          placeholder="Unidad"
          @keypress.enter="centrarUnidadInput()"
        />
      </div>
      <div class="ListadoUnidades">
        <div
          class="itemMonitoreoUnidad"
          :key="unidad.CodiVehiMoni"
          v-for="unidad in mListUnidades"
          v-if="unidad.isvisible"
          @click="ubicarUnidad(unidad)"
        >
          <div class="itemContainerMonitoreo">
            <div class="imagenitem">
              <img :src="unidad.icono.imagenLista" />
            </div>
            <div class="detalle">
              <div class="containerUnidadTitulo">
                <div class="unidadTitle">
                  <strong>Unidad : </strong>{{ unidad.CodiVehiMoni }} ({{
                    unidad.PlacVehiMoni
                  }})
                </div>

                <div class="iconosEventos">
                  <i class="bx bx-broadcast" style="color: green"></i>
                  <strong style="color: green">{{
                    unidad.SateContMoni
                  }}</strong>
                </div>
              </div>
              <strong>Ruta : </strong>
              {{
                unidad.DescRuta == null || unidad.DescRuta == ""
                  ? "SIN RUTA"
                  : unidad.DescRuta.substring(0, 23)
              }}<br />
              <strong>Estado : </strong>{{ unidad.icono.detalle }}<br />
              <strong>Fecha : </strong>{{ unidad.UltiFechMoni }}<br />
              <span class="dispositivo"
                >{{ unidad.DescDispTipo }} {{ unidad.VersDispMoni }}</span
              ><br />
            </div>
          </div>

          <div class="detalleIconos">
            <div class="iconosEventos">
              <i class="bx bx-tachometer" style="color: green"></i>
              <strong style="color: green"
                >{{ unidad.UltiVeloMoni }} KM/H</strong
              >
            </div>
            <div class="iconosEventos">
              <i
                class="bx bx-time"
                :style="
                  unidad.CtrlCounMoni >= 0
                    ? 'color:midnightblue;'
                    : 'color:red;'
                "
              ></i>
              <strong
                :style="
                  unidad.CtrlCounMoni >= 0
                    ? 'color:midnightblue;'
                    : 'color:red;'
                "
                >{{
                  unidad.CtrlCounMoni > 0 ? unidad.CtrlCounMoni : "E.C"
                }}</strong
              >
            </div>
            <div class="iconosEventos">
              <i
                class="bx bx-wifi"
                :style="
                  unidad.AlarAnteGPSDescMoni == 1
                    ? 'color:red;'
                    : 'color:green;'
                "
              ></i>
              <strong style="color: red">{{
                unidad.AlarAnteGPSDescMoni == 1 ? "GPS" : ""
              }}</strong>
            </div>
            <div class="iconosEventos">
              <i
                class="bx bxs-car-battery"
                :style="
                  unidad.AlarCortAlimBateExteMoni == 1
                    ? 'color:red;'
                    : 'color:darkblue;'
                "
              ></i>
              <strong style="color: red">{{
                unidad.AlarCortAlimBateExteMoni == 1 ? "BAT" : ""
              }}</strong>
            </div>
            <div class="iconosEventos">
              <i
                class="bx bx-key"
                :style="
                  unidad.AlarEnceChapMoni == 1 ? 'color:yellow;' : 'color:dark;'
                "
              ></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div id="PanelRutas" class="container_otrosPaneles">
      <div class="searchInput">
        <i class="bx bx-search"></i>
        <input
          type="text"
          class="inputSearchTexto"
          name=""
          id=""
          placeholder="Ruta"
        />
      </div>
      <div class="itemsRuta">
        <div class="cardRuta" v-for="ruta in mListRutas" :key="ruta.LetrRuta">
          <div class="checkboxRuta">
            <input
              type="checkbox"
              :value="ruta.LetrRuta"
              v-model="mListRutasMonitoreo"
              @change="selectedRutaMonitoreo()"
            />
          </div>
          <div class="DetalleRuta">
            <div class="titleRuta">
              <span class="spanTitle">{{
                ruta.DescRuta.substring(0, 17)
              }}</span>
              <div class="btn-iconos">
                <i class="bx bx-time" style="color: green"></i>
                <strong
                  ><span
                    style="
                      color: green;
                      margin-right: 0.5rem;
                      font-size: 0.8rem;
                    "
                    >{{ ruta.controles }}</span
                  ></strong
                >
                <i class="bx bx-git-merge"></i>
              </div>
            </div>

            <div class="footerRuta">
              <div>
                <strong class="spanHoras">Hora Inicio : </strong
                ><span class="spanHoras">{{ ruta.HoraInicSaliProgRuta }}</span>
              </div>
              <div>
                <strong class="spanHoras">Hora Final : </strong
                ><span class="spanHoras">{{ ruta.HoraFinaSaliProgRuta }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div id="PanelControles" class="container_otrosPaneles">
      <div class="searchInput" style="margin-bottom: 0.5rem">
        <i class="bx bx-search"></i>
        <input
          type="text"
          class="inputSearchTexto"
          name=""
          id=""
          placeholder="Control"
        />
      </div>
      <div>
        <input
          type="checkbox"
          style="margin-bottom: 0.7rem"
          :checked="false"
          @change="showControles($event)"
        />
        Visualizar Controles (Mapa)
      </div>
      <div class="itemsRuta">
        <div
          class="cardRuta"
          v-for="control in mListControlesMonitoreo"
          :key="control.CodiCtrl"
          @click="centrarControl(control)"
        >
          <div class="DetalleRuta">
            <div class="titleControl">
              <span class="spanTitle"
                >({{ control.CodiCtrl }}) {{ control.DescCtrl }}</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <div id="PanelConfigMapaMonitoreo" class="container_otrosPaneles">
      <div class="RadioTiposMapaMonitoreo">
        <el-radio v-model="radioMapaMonitoreo" label="roadmap" border
          >Mapa Vial</el-radio
        >
        <el-radio v-model="radioMapaMonitoreo" label="satellite" border
          >Mapa Satelital</el-radio
        >
        <el-radio v-model="radioMapaMonitoreo" label="hybrid" border
          >Mapa Hibrido</el-radio
        >
        <el-radio v-model="radioMapaMonitoreo" label="terrain" border
          >Mapa Terrestre</el-radio
        >
      </div>
    </div>

    <div id="tabOptionsMonitoreo" class="tabOptionsMonitoreo">
      <div
        id="itemMonitoreo"
        class="itemOptionMonitoreo itemOptionMonitoreoActive"
      >
        <i class="bx bx-bus"></i>
      </div>
      <div id="itemRutas" class="itemOptionMonitoreo">
        <i class="bx bx-git-repo-forked"></i>
      </div>
      <div id="itemControles" class="itemOptionMonitoreo">
        <i class="bx bx-time-five"></i>
      </div>
      <div id="itemConfig" class="itemOptionMonitoreo">
        <i class="bx bx-cog"></i>
      </div>
    </div>

    <!--<script src="../js/resizerdiv.js"></script>-->
    <script src="../js/tabButtonsMonitoreo.js"></script>
  </div>
</template>
<style>
.containerUnidadTitulo {
  display: flex;
  width: 13rem !important;
  justify-content: space-between;
  align-content: center;
  align-items: center;
}

.RadioTiposMapaMonitoreo {
  display: flex;
  flex-direction: column;
  width: 15.5rem;
}

.is-bordered {
  margin-left: 0px !important;
  width: 15.5rem;
}

.ListadoUnidades::-webkit-scrollbar {
  display: none;
}

.itemsRuta::-webkit-scrollbar {
  display: none;
}

.min-max {
  display: flex;
  width: 100%;
  justify-content: flex-end;
  margin-right: 1.5rem;
  margin-bottom: 00.5rem;
  color: #48494b8f;
}

.bx-min-max:hover {
  cursor: pointer;
  color: #172b4d;
}

.cardRuta {
  width: 15.5rem;
  border-radius: 0.5rem;
  border-style: solid;
  border-width: 1px;
  border-color: black;
  display: flex;
  margin-bottom: 0.5rem;
  cursor: pointer;
}

.checkboxRuta {
  flex-basis: calc(10%);
  display: flex;
  justify-content: center;
  align-items: center;
}

.DetalleRuta {
  flex-basis: calc(90%);
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  display: flex;
  flex-direction: column;
}

.titleRuta {
  display: flex;
  justify-content: space-between;
}

.titleControl {
  display: flex;
  justify-content: space-between;
  padding-right: 0.5rem;
  padding-left: 0.5rem;
}

.spanTitle {
  font-size: 0.8rem;
  font-weight: 600;
  color: black;
}

.spanHoras {
  font-size: 0.77rem;
  color: black;
}

.footerRuta {
  display: flex;
  flex-direction: column;
  line-height: 0.85rem;
}

.btn-iconos {
  display: flex;
  align-items: center;
  align-content: center;
}

.dispositivo {
  color: rgba(56, 54, 54, 0.76);
  font-size: 00.7rem;
  font-family: Arial, Helvetica, sans-serif;
}

.iconosEventos {
  display: flex;
  justify-content: center;
  align-items: center;
}

.itemContainerMonitoreo {
  display: flex;

  align-items: center;
  justify-items: center;
}

.inputSearchTexto {
  border-width: 0rem;
  outline: none;
  border-color: transparent;
  caret-color: #172b4d;
}

.searchInput {
  height: 2.5rem !important;
  min-height: 2.5rem !important;
  width: 15.5rem;
  background-color: white;
  margin-left: 1rem;
  margin-bottom: 0.7rem;
  border-radius: 1rem;
  margin-left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid rgb(117, 111, 111);
}

.ListadoUnidades {
  height: 100%;
  width: calc(100%);
  margin-left: 0.5rem;
  overflow: scroll;
  display: grid;
  grid-template-columns: repeat(auto-fit, 16rem);
  justify-content: center;
}

.itemMonitoreoUnidad {
  border-width: 1px;
  border-style: solid;
  border-color: black;
  color: black;
  height: 6rem;
  font-size: 0.78rem;
  line-height: 1.05;
  width: 15.5rem;
  margin-bottom: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
}

.imagenitem {
  margin-right: 0.2rem;
  margin-left: 0.2rem;
}

#rezizeArea {
  width: 100%;
  overflow: auto;
  position: relative;
}

.bx {
  font-size: 1.2rem;
}

.mapa {
  width: 100%;
  height: calc(100vh - 3.8rem);
}

.tabOptionsMonitoreo {
  height: 3.3rem;
  width: 11rem;
  margin-right: 1rem;
  margin-top: 0.55rem;
  position: absolute;
  top: 0;
  right: 0;
  background-color: white;
  border-radius: 5rem;
  display: flex;
  padding: 0.4rem;
}

.itemOptionMonitoreo {
  color: white;
  flex-basis: calc(33.33%);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4rem;
  color: #212529c4;
  font-size: 1.7rem;
  cursor: pointer;
}

.itemOptionMonitoreoActive {
  background-color: #172b4d;
  color: whitesmoke;
}

.paddingLabel {
  margin-bottom: 2.9rem;
  font-weight: bold;
}

.paddingLabelControl {
  margin-bottom: 2.9rem;
  font-weight: bold;
  border-color: #f71313;
  border-width: 1px;
  background-color: white;
  padding-right: 0.5rem;
  padding-left: 0.5rem;
  border-radius: 1rem;
}

#resizerXY {
  height: 97%;
  width: 0.4rem;
  /*background-color: #32325d;*/
  position: absolute;
  left: 0;
}

.container_otrosPaneles {
  position: absolute;
  height: calc(100vh - 9em);
  min-width: 17rem;
  max-width: 17rem;
  right: 0px;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  top: 0px;
  margin-top: 4.5rem;
  margin-right: 1rem;
  background-color: white;
  display: flex;
  flex-direction: column;
  /*align-items: center;*/
  align-items: center;
  border-radius: 0.5rem;
}

.itemsRuta {
  overflow: auto;
}

.container_unidades_monitoreo {
  position: absolute;
  height: calc(100vh - 9em);
  min-width: 17rem !important;
  max-width: 85vw !important;
  right: 0px;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  top: 0px;
  margin-top: 4.5rem;
  margin-right: 1rem;
  background-color: white;
  display: flex;
  flex-direction: column;
  /*align-items: center;*/
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
}

.strongLetrasInfoWindows {
  font-weight: bold;
  color: black;
}

.bx-search {
  color: #172b4d;
  font-size: 1.5rem;
}

.detalleIconos {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-right: 0.2rem;
  margin-left: 0.2rem;
}
</style>

<script>
import BaseCheckbox from "@/components/argon-core/Inputs/BaseCheckbox";
import { Radio, RadioButton } from "element-ui";
export default {
  layout: "DashboardLayout",
  components: {
    BaseCheckbox,
    [Radio.name]: Radio,
    [RadioButton.name]: RadioButton,
  },
  data() {
    return {
      token: this.$cookies.get("token"),
      oCenter: { lat: -1.249546, lng: -78.585376 },
      oZoom: 7,
      unidadInput: "",
      mListRutasMonitoreo: [],
      mListControlesMonitoreo: [],
      mListControlesMonitoreoAux: [],
      banderaCenter: true,
      mListUnidades: [],
      mListRutas: [],
      infoContent: "",
      infoWindowPos: {
        lat: 0,
        lng: 0,
      },
      infoWinOpen: false,
      currentMidx: null,
      fullscreenControl: false,
      intervaloMonitoreoGeneral: null,
      intervaloMonitoreoRuta: null,
      radioMapaMonitoreo: "roadmap",
      infoOptions: {
        pixelOffset: {
          width: 0,
          height: -35,
        },
      },
      anchoPanelMonitoreoClickMinMax: "width: 17rem",
    };
  },
  methods: {
    minPanel() {
      console.log("MIN");
      this.anchoPanelMonitoreoClickMinMax = "width: 17rem";
    },
    maxPanel() {
      console.log("MAX");
      this.anchoPanelMonitoreoClickMinMax = "width: 85vw";
    },
    procedimientoMonitoreo(datos) {
      if (datos.data.status_code == 200) {
        if (this.mListUnidades.length == 0) {
          for (var i = 0; i < datos.data.data.length; i++) {
            this.mListUnidades[i] = datos.data.data[i];
            this.mListUnidades[i].isvisible = true;
            this.mListUnidades[i].icono = this.getIcono(this.mListUnidades[i]);
            if (i == 0 && this.banderaCenter) {
              this.oCenter = {
                lat: parseFloat(this.mListUnidades[i].UltiLatiMoni),
                lng: parseFloat(this.mListUnidades[i].UltiLongMoni),
              };
              this.oZoom = 12.5;
              this.banderaCenter = false;
            }
          }
        } else {
          this.updatemListaUnidades(datos.data.data);
        }
        //this.girarMarcador()
      }
    },
    async initRastreo() {
      try {
        var datos = null;
        var rutaApi = "/monitoring";
        var bodyApi = {
            token: this.token,
          },
          datos = await this.$axios.post(
            process.env.baseUrlPanel + rutaApi,
            bodyApi
          );
        this.procedimientoMonitoreo(datos);
      } catch (error) {
        console.log(error);
      }
    },
    selectedRutaMonitoreo() {
      if (this.mListRutasMonitoreo.length > 0) {
        this.initControleMonitoreoRutas();
        for (var i = 0; i < this.mListUnidades.length; i++) {
          var bandera = false;
          for (var j = 0; j < this.mListRutasMonitoreo.length; j++) {
            if (
              this.mListUnidades[i].LetrRutaMoni == this.mListRutasMonitoreo[j]
            ) {
              bandera = true;
            }
          }

          this.mListUnidades[i].isvisible = bandera ? true : false;
        }
      } else {
        this.initControles();
        for (var k = 0; k < this.mListUnidades.length; k++) {
          this.mListUnidades[k].isvisible = true;
        }
      }
    },
    initIntervalMonitoreoGeneral: function () {
      this.intervaloMonitoreoGeneral = setInterval(() => {
        this.initRastreo();
      }, 10000);
    },
    async initRutas() {
      try {
        var datos = await this.$axios.post(
          process.env.baseUrlPanel + "/readRutasMonitoreo",
          {
            token: this.token,
          }
        );

        if (datos.data.status_code == 200) {
          this.mListRutas.push(...datos.data.datos);
        }
      } catch (error) {
        console.log(error);
      }
    },
    async initControles() {
      console.log("INICIANDO CONTROLES");
      try {
        var datos = await this.$axios.post(
          process.env.baseUrlPanel + "/AllControles",
          {
            token: this.token,
          }
        );
        if (datos.data.status_code == 200) {
          this.mListControlesMonitoreo = [];
          this.mListControlesMonitoreoAux = [];
          for (var i = 0; i < datos.data.data.length; i++) {
            this.mListControlesMonitoreo[i] = datos.data.data[i];
            //this.mListControlesMonitoreoAux[i] = datos.data.data[i];
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    async initControleMonitoreoRutas() {
      console.log("INICIANDO CONTROLES");
      try {
        var datos = await this.$axios.post(
          process.env.baseUrlPanel + "/AllControlesPorRuta",
          {
            token: this.token,
            rutas: this.mListRutasMonitoreo,
          }
        );

        if (datos.data.status_code == 200) {
          this.mListControlesMonitoreo = [];
          this.mListControlesMonitoreoAux = [];

          for (var i = 0; i < datos.data.data.length; i++) {
            this.mListControlesMonitoreo[i] = datos.data.data[i];
            //this.mListControlesMonitoreoAux[i] = datos.data.data[i];
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    getIcono(unidad) {
      //console.log("minutos trascurridos " + convert_diferencia_from_minutes);
      var imagen = "img/monitoreo/online.png#" + unidad.CodiVehiMoni;
      var imagenLista = "img/monitoreo/online_lista.png";
      var color = "";
      var detalle = "";

      if (unidad.AlarAnteGPSDescMoni == 1) {
        imagen = "img/monitoreo/alerta.png#" + unidad.CodiVehiMoni;
        color = "#D50303";
        imagenLista = "img/monitoreo/alerta_lista.png";
        detalle = "ALERTA GPS";
        return { imagen, color, imagenLista, detalle };
      }

      if (unidad.SINGPSDAY > 0) {
        /**UNIDAD PLOMO CLARO**/
        color = "#9B9999";
        imagen =
          "img/monitoreo/sin_gps_full.png#" +
          unidad.CodiVehiMoni; /** no  atransmitiendo en mucho tiempo**/
        imagenLista = "img/monitoreo/sin_gps_full_lista.png";
        detalle = "SIN TRANSMISION GPS";
      } else {
        if (unidad.MINUTESINGPS > 30) {
          color = "#565656";
          imagen =
            "img/monitoreo/sin_gps_now.png#" +
            unidad.CodiVehiMoni; /**recientemente dejo de transmitir**/
          imagenLista = "img/monitoreo/sin_gps_now_lista.png";

          detalle = "SIN TRANSMISION GPS";
        } else {
          /**esta transmitiendo**/ /**IMAGEN ONLINE CON DESPACHO**/
          if (unidad.LetrRutaMoni != "" && unidad.LetrRutaMoni != null) {
            color = "#157347";
            imagen =
              unidad.UltiVeloMoni == 0
                ? "img/monitoreo/stop_online.png#" + unidad.CodiVehiMoni
                : "img/monitoreo/online.png#" + unidad.CodiVehiMoni;

            detalle = "EN LINEA CON DESPACHO";
            imagenLista = "img/monitoreo/online_lista.png";
            return { imagen, color, imagenLista, detalle };
          } else {
            /**ONLINE SIN DESPACHO**/
            color = "#060C92";
            imagen =
              unidad.UltiVeloMoni == 0
                ? "img/monitoreo/online_sin_ruta_stop.png#" +
                  unidad.CodiVehiMoni
                : "img/monitoreo/online_sin_ruta.png#" + unidad.CodiVehiMoni;
            imagenLista = "img/monitoreo/online_sin_ruta_lista.png";

            detalle = "EN LINEA SIN DESPACHO";

            return { imagen, color, imagenLista, detalle };
          }
        }
      }

      return { imagen, color, imagenLista, detalle };
    },
    showControles(event) {
      if (event.target.checked) {
        this.mListControlesMonitoreoAux = this.mListControlesMonitoreo;
      } else {
        this.mListControlesMonitoreoAux = [];
      }
    },
    async getInfoWindowContent(unidad) {
      var dir = await this.$axios.get(
        "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
          parseFloat(unidad.UltiLatiMoni) +
          "," +
          parseFloat(unidad.UltiLongMoni) +
          "&key=" +
          process.env.mapaCredencial
      );
      var result = dir.data.results;

      if (unidad.SINGPSDAY == 0) 
      {
        if(unidad.MINUTESINGPS > 30){
          return `<div style="width:300px;padding:0.50rem">
              <strong class="strongLetrasInfoWindows">UNIDAD N° : </strong> ${
                unidad.CodiVehiMoni
              }<br>
              <strong class="strongLetrasInfoWindows">FECHA MONI : </strong> ${
                unidad.UltiFechMoni
              }<br>
              <strong class="strongLetrasInfoWindows">MINUTOS SIN TRANSMISION : </strong> ${
                unidad.timeSINGPS
              }<br>
              <strong class="strongLetrasInfoWindows">RUTA : </strong> ${(unidad.LetrRutaMoni =
                !""
                  ? unidad.DescRuta == null
                    ? "SIN RUTA"
                    : unidad.DescRuta
                  : "SIN RUTA")}<br>
              <strong class="strongLetrasInfoWindows">EVENTO : </strong> ${
                unidad.AlarAnteGPSDescMoni == 1
                  ? "ALERTA GPS"
                  : unidad.AlarFuerRutaMoni == null ||
                    unidad.AlarFuerRutaMoni == 1
                  ? "FUERA DE RUTA"
                  : "EN RUTA"
              }<br>
              <strong class="strongLetrasInfoWindows">VELOCIDAD : </strong> ${
                unidad.UltiVeloMoni
              } <strong>KM/H</strong><br>
              <strong class="strongLetrasInfoWindows">DIR : </strong> ${
                result.length > 0 ? result[0].formatted_address : "SIN NOMBRES"
              }<br><strong class="strongLetrasInfoWindows">SATELITES : </strong> ${
          unidad.SateContMoni
        }
            </div>`;
        }
      } else {
        if(unidad.SINGPSDAY > 0)
        {
          return `<div style="width:300px;padding:0.50rem">
              <strong class="strongLetrasInfoWindows">UNIDAD N° : </strong> ${
                unidad.CodiVehiMoni
              }<br>
              <strong class="strongLetrasInfoWindows">FECHA MONI : </strong> ${
                unidad.UltiFechMoni
              }<br>
              <strong class="strongLetrasInfoWindows">DIAS SIN TRANSMISION : </strong> ${
                unidad.SINGPSDAY
              } DIAS<br>
              <strong class="strongLetrasInfoWindows">RUTA : </strong> ${(unidad.LetrRutaMoni =
                !""
                  ? unidad.DescRuta == null
                    ? "SIN RUTA"
                    : unidad.DescRuta
                  : "SIN RUTA")}<br>
              <strong class="strongLetrasInfoWindows">EVENTO : </strong> ${
                unidad.AlarAnteGPSDescMoni == 1
                  ? "ALERTA GPS"
                  : unidad.AlarFuerRutaMoni == null ||
                    unidad.AlarFuerRutaMoni == 1
                  ? "FUERA DE RUTA"
                  : "EN RUTA"
              }<br>
              <strong class="strongLetrasInfoWindows">VELOCIDAD : </strong> ${
                unidad.UltiVeloMoni
              } <strong>KM/H</strong><br>
              <strong class="strongLetrasInfoWindows">DIR : </strong> ${
                result.length > 0 ? result[0].formatted_address : "SIN NOMBRES"
              }<br><strong class="strongLetrasInfoWindows">SATELITES : </strong> ${
          unidad.SateContMoni
        }
            </div>`;
        }
      }

      return `<div style="width:300px;padding:0.50rem">
              <strong class="strongLetrasInfoWindows">UNIDAD N° : </strong> ${
                unidad.CodiVehiMoni
              }<br>
              <strong class="strongLetrasInfoWindows">FECHA MONI : </strong> ${
                unidad.UltiFechMoni
              }<br>
              <strong class="strongLetrasInfoWindows">RUTA : </strong> ${(unidad.LetrRutaMoni =
                !""
                  ? unidad.DescRuta == null
                    ? "SIN RUTA"
                    : unidad.DescRuta
                  : "SIN RUTA")}<br>
              <strong class="strongLetrasInfoWindows">EVENTO : </strong> ${
                unidad.AlarAnteGPSDescMoni == 1
                  ? "ALERTA GPS"
                  : unidad.AlarFuerRutaMoni == null ||
                    unidad.AlarFuerRutaMoni == 1
                  ? "FUERA DE RUTA"
                  : "EN RUTA"
              }<br>
              <strong class="strongLetrasInfoWindows">VELOCIDAD : </strong> ${
                unidad.UltiVeloMoni
              } <strong>KM/H</strong><br>
              <strong class="strongLetrasInfoWindows">DIR : </strong> ${
                result.length > 0 ? result[0].formatted_address : "SIN NOMBRES"
              }<br><strong class="strongLetrasInfoWindows">SATELITES : </strong> ${
        unidad.SateContMoni
      }
            </div>`;
    },
    async showInfoWindows(unidad, idx) {
      this.infoWindowPos = {
        lat: parseFloat(unidad.UltiLatiMoni),
        lng: parseFloat(unidad.UltiLongMoni),
      };
      this.infoContent = await this.getInfoWindowContent(unidad);

      //check if its the same marker that was selected if yes toggle
      if (this.currentMidx == idx) {
        this.infoWinOpen = !this.infoWinOpen;
      }
      //if different marker set infowindow to open and reset current marker index
      else {
        this.infoWinOpen = true;
        this.currentMidx = idx;
      }
    },
    updatemListaUnidades(mListUnidadesAux) {
      if (this.mListUnidades.length > mListUnidadesAux.length) {
        for (var i = 0; i < this.mListUnidades.length; i++) {
          for (var j = 0; j < mListUnidadesAux.length; j++) {
            if (
              this.mListUnidades[i].CodiVehiMoni ==
              mListUnidadesAux[j].CodiVehiMoni
            ) {
              this.updateInformationMarker(i, mListUnidadesAux[j]);
              mListUnidadesAux.splice(j, 0);
            }
          }
        }
      } else if (this.mListUnidades.length < mListUnidadesAux.length) {
        for (var k = 0; k < mListUnidadesAux.length; k++) {
          for (var l = 0; l < this.mListUnidades.length; l++) {
            if (
              mListUnidadesAux[k].CodiVehiMoni ==
              this.mListUnidades[l].CodiVehiMoni
            ) {
              this.updateInformationMarker(l, mListUnidadesAux[k]);
              mListUnidades.splice(k, 0);
            }
          }
        }

        for (var cont = 0; cont < mListUnidades.length; cont++) {
          this.mListUnidades.push(mListUnidades[cont]);
        }
      } else {
        for (var m = 0; m < this.mListUnidades.length; m++) {
          for (var n = 0; n < mListUnidadesAux.length; n++) {
            if (
              this.mListUnidades[m].CodiVehiMoni ==
              mListUnidadesAux[n].CodiVehiMoni
            ) {
              this.updateInformationMarker(m, mListUnidadesAux[n]);
              mListUnidadesAux.splice(n, 0);
            }
          }
        }
      }
    },
    prueba() {
      alert();
    },
    updateInformationMarker(position, oUnidadAux) {
      //console.log("UPDATE INFO MARKER");
      this.mListUnidades[position].EstaSaliMoni = oUnidadAux.EstaSaliMoni;
      this.mListUnidades[position].idSali_mMoni = oUnidadAux.idSali_mMoni;
      this.mListUnidades[position].UltiVeloMoni = oUnidadAux.UltiVeloMoni;
      this.mListUnidades[position].UltiFechMoni = oUnidadAux.UltiFechMoni;
      this.mListUnidades[position].UltiLatiMoni = oUnidadAux.UltiLatiMoni;
      this.mListUnidades[position].UltiLongMoni = oUnidadAux.UltiLongMoni;
      this.mListUnidades[position].UltiRumbMoni = oUnidadAux.UltiRumbMoni;
      this.mListUnidades[position].PlacVehiMoni = oUnidadAux.PlacVehiMoni;
      this.mListUnidades[position].LetrRutaMoni = oUnidadAux.LetrRutaMoni;
      this.mListUnidades[position].EvenAnteGPSConeMoni =
        oUnidadAux.EvenAnteGPSConeMoni;
      this.mListUnidades[position].AlarAnteGPSDescMoni =
        oUnidadAux.AlarAnteGPSDescMoni;
      this.mListUnidades[position].AlarEnceChapMoni =
        oUnidadAux.AlarEnceChapMoni;
      this.mListUnidades[position].AlarFuerRutaMoni =
        oUnidadAux.AlarFuerRutaMoni;
      this.mListUnidades[position].VersDispMoni = oUnidadAux.VersDispMoni;
      this.mListUnidades[position].Odometro = oUnidadAux.Odometro;
      this.mListUnidades[position].DescRuta = oUnidadAux.DescRuta;
      this.girarMarcadorUnitario(this.mListUnidades[position]);
    },
    girarMarcador() {
      for (var i = 0; i < this.mListUnidades.length; i++) {
        $('img[src*="' + this.mListUnidades[i].icono.imagen + '"]').css({
          transform: "rotate(" + this.mListUnidades[i].UltiRumbMoni + "deg)",
        });
      }
    },
    girarMarcadorUnitario(unidad) {
      var rotation = unidad.UltiRumbMoni + 180;
      /*$(`img[src="${unidad.icono.imagen}"]`).css({
        "-webkit-transform": "rotate(" + rotation + "deg)",
        "-moz-transform": "rotate(" + rotation + "deg)",
        "-ms-transform": "rotate(" + rotation + "deg)",
        transform: "rotate(" + rotation + "deg)",
      });*/

      $('img[src*="' + unidad.icono.imagen + '"]').css({
        transform: "rotate(" + rotation + "deg)",
      });

      /*$('img[src*="' + unidad.icono.imagen + '"]')
        .parent()
        .css("transform", "rotate(" + unidad.UltiRumbMoni + "deg)");*/
    },
    ubicarUnidad(unidad) {
      this.oCenter = {
        lat: parseFloat(unidad.UltiLatiMoni),
        lng: parseFloat(unidad.UltiLongMoni),
      };
      this.oZoom = 18;
    },
    centrarControl(control) {
      this.oCenter = {
        lat: parseFloat(control.Lati1Ctrl),
        lng: parseFloat(control.Long1Ctrl),
      };
      this.oZoom = 19;
    },
    centrarUnidadInput() {
      for (var i = 0; i < this.mListUnidades.length; i++) {
        if (this.mListUnidades[i].CodiVehiMoni == this.unidadInput) {
          this.ubicarUnidad(this.mListUnidades[i]);
          return;
        }
      }
    },
  },
  mounted() {
    this.initRutas();
    this.initControles();
    this.initRastreo();
    this.initIntervalMonitoreoGeneral();
  },
  destroyed() {
    clearInterval(this.initIntervalMonitoreoGeneral);
  },
};
</script>
