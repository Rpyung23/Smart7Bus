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

      <!--GEOCIUDAD-->

      
      <GmapPolygon
      v-if="checkedGeoCercaCiudad"
        :options="{
          strokeColor: '#172b4d',
          fillColor: '#172b4d80',
          strokeOpacity: 1.0,
          strokeWeight: 2,
        }"
        :strokeOpacity="0.5"
        :strokeWeight="1"
        :paths="mListGeociudad"
      />


      

      <!-- FIN GEOCIUDAD-->
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
      <GmapPolyline 
        :path="mListRutaSubida"
        :options="{
          strokeColor: '#A52714',
          fillColor: '#A52714',
          strokeOpacity: 0.6,
          strokeWeight: 4
        }">
      </GmapPolyline>
      <GmapPolyline
        :path="mListRutaBajada"
        :options="{
          strokeColor: '#01579B',
          fillColor: '#01579B',
          strokeOpacity: 0.6,
          strokeWeight: 4
        }">
      </GmapPolyline>
      <GmapMarker
        v-if="mListRutaBajada.length > 0"
        :position="{
          lat: parseFloat(mListRutaBajada[0].lat),
          lng: parseFloat(mListRutaBajada[0].lng),
        }"
        :optimized="true"
        :icon= '"img/monitoreo/start_route.png"'
      />
      <GmapMarker
        v-if="mListRutaSubida.length > 0"
        :position="{
          lat: parseFloat(mListRutaSubida[0].lat),
          lng: parseFloat(mListRutaSubida[0].lng),
        }"
        :optimized="true"
        :icon= '"img/monitoreo/end_route.png"'
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
          @keydown="initRastreo()"
        />
      </div>
      <div>
        <el-select
          v-model="checkedMonitoreoEstado"
          multiple
          collapse-tags
          style="margin-bottom: 10px; width: 15.5rem;"
          @change="initRastreo()"
          placeholder="Opciones Monitoreo">
          <el-option
              v-for="item in opcionesMonitoreo"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
       </div>
       <div></div>
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
              @change="changeRutaSeleccionada()"
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

        <el-checkbox v-model="checkedGeoCercaCiudad" border>Mostrar GeoCerca</el-checkbox>



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
import { Radio, RadioButton, Select,Option,Checkbox } from "element-ui";
export default {
  layout: "DashboardLayout",
  components: {
    BaseCheckbox,
    [Radio.name]: Radio,
    [RadioButton.name]: RadioButton,
    [Select.name]: Select,
    [Option.name]: Option,
    [Checkbox.name]:Checkbox
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
      mListGeociudad:[],
      banderaCenter: true,
      banderaUnidad : false,
      mListUnidades: [],
      mListRutas: [],
      unidadInputRuta:'',
      checkedGeoCercaCiudad:true,
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
      mListRutaSubida:[],
      mListRutaBajada:[],
      anchoPanelMonitoreoClickMinMax: "width: 17rem",
      checkedMonitoreoEstado:[],
      fechaActual:'',
      opcionesMonitoreo: [{
          value: 'HOY',
          label: 'Hoy'
        }, {
          value: 'FR',
          label: 'Fuera de Línea'
        }, {
          value: 'GPS',
          label: 'GPS'
        }, {
          value: 'CR',
          label: 'Corte Ruta'
        }],
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
        if (this.checkedMonitoreoEstado == 'GPS') {
          this.mListUnidades = []
          if (this.mListUnidades.length == 0) {
            for (var i = 0; i < datos.data.data.length; i++) {
              if (datos.data.data[i].AlarAnteGPSDescMoni == 1) {
                this.mListUnidades[i] = datos.data.data[i];
                this.mListUnidades[i].isvisible = true;
                this.mListUnidades[i].icono = this.getIcono(this.mListUnidades[i]);
              } else {
                this.mListUnidades[i] = datos.data.data[i];
                this.mListUnidades[i].isvisible = false;
                this.mListUnidades[i].icono = this.getIcono(this.mListUnidades[i]);
              }
            }
          } else {
            this.updatemListaUnidades(datos.data.data);
          }
        }
        else if (this.checkedMonitoreoEstado == 'FR') {
          this.mListUnidades = []
          if (this.mListUnidades.length == 0) {
            for (var i = 0; i < datos.data.data.length; i++) {
              if (datos.data.data[i].AlarAnteGPSDescMoni == 0 && datos.data.data[i].SINGPSDAY > 0 ) {
                this.mListUnidades[i] = datos.data.data[i];
                this.mListUnidades[i].isvisible = true;
                this.mListUnidades[i].icono = this.getIcono(this.mListUnidades[i]);
              } else {
                this.mListUnidades[i] = datos.data.data[i];
                this.mListUnidades[i].isvisible = false;
                this.mListUnidades[i].icono = this.getIcono(this.mListUnidades[i]);
              }
            }
          } else {
            this.updatemListaUnidades(datos.data.data);
          }
        } 
        else if (this.checkedMonitoreoEstado == 'HOY') {
          this.mListUnidades = []
          if (this.mListUnidades.length == 0) {
            for (var i = 0; i < datos.data.data.length; i++) {
              if (datos.data.data[i].UltiFechMoni.substring(0,10) ==  this.fechaActual.substring(0,10)) {
                this.mListUnidades[i] = datos.data.data[i];
                this.mListUnidades[i].isvisible = true;
                this.mListUnidades[i].icono = this.getIcono(this.mListUnidades[i]);
                this.oCenter = {
                  lat: parseFloat(this.mListUnidades[i].UltiLatiMoni),
                  lng: parseFloat(this.mListUnidades[i].UltiLongMoni),
                };
                this.oZoom = 18;
                this.banderaCenter = false;
              } else {
                this.mListUnidades[i] = datos.data.data[i];
                this.mListUnidades[i].isvisible = false;
                this.mListUnidades[i].icono = this.getIcono(this.mListUnidades[i]);
              }
            }
          } else {
            this.updatemListaUnidades(datos.data.data);
          }
        }        
        else if (this.unidadInput != '' && this.mListRutasMonitoreo.length == 0) {
          this.banderaUnidad = true
          this.mListUnidades = []
          if (this.mListUnidades.length == 0) {
            for (var i = 0; i < datos.data.data.length; i++) {
              if (datos.data.data[i].CodiVehiMoni == this.unidadInput) {
                this.mListUnidades[i] = datos.data.data[i];
                this.mListUnidades[i].isvisible = true;
                this.mListUnidades[i].icono = this.getIcono(this.mListUnidades[i]);
              } else {
                this.mListUnidades[i] = datos.data.data[i];
                this.mListUnidades[i].isvisible = false;
                this.mListUnidades[i].icono = this.getIcono(this.mListUnidades[i]);
              }
            }
          } else {
            this.updatemListaUnidades(datos.data.data);
          }
        } else if(this.unidadInput == '' && this.mListRutasMonitoreo.length == 0){
          this.mListUnidades = []
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
        }else if(this.unidadInput == '' && this.mListControlesMonitoreo.length > 0 && this.banderaUnidad == true){
          this.banderaUnidad = false
        }
        else if (this.unidadInput == '' && this.mListControlesMonitoreo.length > 0) {
          this.banderaUnidad = false
          //this.selectedRutaMonitoreo()
        }
        else if (this.unidadInput != '' && this.mListControlesMonitoreo.length > 0 && this.banderaUnidad == false) {
          this.banderaUnidad = true
          this.mListUnidades = []
          if (this.mListUnidades.length == 0) {
            for (var i = 0; i < datos.data.data.length; i++) {
              if (datos.data.data[i].CodiVehiMoni == this.unidadInput) {
                this.mListUnidades[i] = datos.data.data[i];
                this.mListUnidades[i].isvisible = true;
                this.mListUnidades[i].icono = this.getIcono(this.mListUnidades[i]);
                this.oCenter = {
                  lat: parseFloat(this.mListUnidades[i].UltiLatiMoni),
                  lng: parseFloat(this.mListUnidades[i].UltiLongMoni),
                };
                this.oZoom = 18;
                this.banderaCenter = false;
              } else {
                this.mListUnidades[i] = datos.data.data[i];
                this.mListUnidades[i].isvisible = false;
                this.mListUnidades[i].icono = this.getIcono(this.mListUnidades[i]);
              }
            }
          } else {
            this.updatemListaUnidades(datos.data.data);
          }
        }  
        else {
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
        }
        this.girarMarcador()
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
          console.log(datos.data)
        this.procedimientoMonitoreo(datos);
      } catch (error) {
        console.log(error);
      }
    },
    changeRutaSeleccionada(){
      this.selectedRutaMonitoreo()
      this.readRutaByLetraRuta()
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
        this.unidadInputRuta = ''
        for (var k = 0; k < this.mListUnidades.length; k++) {
          if (this.mListUnidades[k].isvisible == true) {
            if (this.mListUnidades[k].CodiVehiMoni == this.unidadInput) {
              this.unidadInputRuta = this.mListUnidades[k].CodiVehiMoni
            }
          }
        }
        this.unidadInput = this.unidadInputRuta == '' ? '' : this.unidadInputRuta
      } else {
        this.initControles()
        this.initRastreo()
      }
    },
    async readRutaByLetraRuta(){
      try{
        this.mListRutaBajada = []
        this.mListRutaSubida = []
        var datos = await this.$axios.post(
          process.env.baseUrlPanel + "/readRutasMongoAllByLetraRuta",
          {
            token: this.token,
            ruta:this.mListRutasMonitoreo[0]
          }
        );
        if (datos.data.status_code == 200) {
          console.log("TRAZANDO RUTA..........")
          for (var i = 0; i < datos.data.datos.polilineasRutaSubida.length; i++) {
            this.mListRutaSubida.push(datos.data.datos.polilineasRutaSubida[i])
          }
          for (var j = 0; j < datos.data.datos.polilineasRutaBajada.length; j++) {
            this.mListRutaBajada.push(datos.data.datos.polilineasRutaBajada[j])
          }
          
        }
      } catch (error) {
        console.log(error);
      }
    },
    initIntervalMonitoreoGeneral: function () {
      this.intervaloMonitoreoGeneral = setInterval(() => {
        this.initRastreo();
      }, 5000);
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
      console.log("INICIANDO CONTROLES POR RUTA");
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
      var imagen = "img/monitoreo/online.png#" + unidad.CodiVehiMoni;
      var imagenLista = "img/monitoreo/online_lista.png";
      var color = "";
      var detalle = "";

      if (unidad.AlarAnteGPSDescMoni == 1) 
      {
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
    async initGeociudad(){
      try {
        var datos = await this.$axios.post(
          process.env.baseUrlPanel + "/geoCiudad",
          {
            token: this.token,
          }
        );

        if (datos.data.status_code == 200) 
        {
          for(var i = 0;i < datos.data.datos.length ;i++)
          {
            this.mListGeociudad.push({lat:parseFloat(datos.data.datos[i].latitud),
              lng:parseFloat(datos.data.datos[i].longitud)});
          }
        }
      } catch (error) {
        console.log(error);
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
      for (var i = 0; i < this.mListUnidades.length; i++) 
      {
        var rotation = this.mListUnidades[i].UltiRumbMoni + 180

        $('img[src*="' + this.mListUnidades[i].icono.imagen + '"]').css({
          transform: "rotate(" + rotation + "deg)",
        });
      }
    },
    girarMarcadorUnitario(unidad) 
    {

      var rotation = unidad.UltiRumbMoni + 180
    *$(`img[src='"${unidad.icono.imagen}"']`).css({
        "-webkit-transform": "rotate(" + rotation + "deg)",
        "-moz-transform": "rotate(" + rotation + "deg)",
        "-ms-transform": "rotate(" + rotation + "deg)",
        transform: "rotate(" + rotation + "deg)",
      })

      $('img[src*="' + unidad.icono.imagen + '"]')
        .parent()
        .css("transform", "rotate(" +rotation + "deg)");
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
    initFechaActualMonitoreo() {
      var fecha = new Date();
      var mes = fecha.getMonth() + 1;
      var day = fecha.getDate();
      var hora = fecha.getHours() < 10 ? '0' + fecha.getHours() : fecha.getHours()
      var minutes = fecha.getMinutes() < 10 ? '0' + fecha.getMinutes() : fecha.getMinutes()
      var format =
        fecha.getFullYear() +
        "-" +
        (mes < 10 ? "0" + mes : mes) +
        "-" +
        (day < 10 ? "0" + day : day);
      console.log(format)
      this.fechaActual = format + " " + hora + ":" + minutes + ":00";
    },
  },
  mounted() {
    this.initGeociudad()
    this.initRutas();
    this.initControles();
    this.initRastreo();
    this.initIntervalMonitoreoGeneral();
    this.initFechaActualMonitoreo();
  },
  destroyed() {
    clearInterval(this.initIntervalMonitoreoGeneral);
  },
};
</script>

{
  "IdCiudad": {
    "$oid": "6336f97311fab8d1a15b1765"
  },
  "codeRuta": "PG",
  "colorBajada": "#01579B",
  "colorSubida": "#A52714",
  "detalleRuta": "TERMINAL GUAMANI-PAQUILLA",
  "tiempoRecorrido": "45 mins",
  "polilineasRutaSubida": [
        {
      "lng":-78.5491447,"lat":-0.3386389},
        {
      "lng":-78.5491313,"lat":-0.3388025},
        {
      "lng":-78.5491018,"lat":-0.3389661},
        {
      "lng":-78.5490723,"lat":-0.3391324},
        {
      "lng":-78.5490428,"lat":-0.3393148},
        {
      "lng":-78.5489892,"lat":-0.3395455},
        {
      "lng":-78.5489436,"lat":-0.3398056},
        {
      "lng":-78.5489446,"lat":-0.3398928},
        {
      "lng":-78.5489513,"lat":-0.3399652},
        {
      "lng":-78.5489601,"lat":-0.3400021},
        {
      "lng":-78.5489896,"lat":-0.3400356},
        {
      "lng":-78.5490264,"lat":-0.3400792},
        {
      "lng":-78.549054,"lat":-0.3401007},
        {
      "lng":-78.5490888,"lat":-0.3401248},
        {
      "lng":-78.549129,"lat":-0.3401402},
        {
      "lng":-78.549233,"lat":-0.3401697},
        {
      "lng":-78.5492779,"lat":-0.3401785},
        {
      "lng":-78.5493336,"lat":-0.3401852},
        {
      "lng":-78.549294,"lat":-0.3403991},
        {
      "lng":-78.5492578,"lat":-0.3405721},
        {
      "lng":-78.549188,"lat":-0.34091},
        {
      "lng":-78.549129,"lat":-0.3412145},
        {
      "lng":-78.5491009,"lat":-0.3413311},
        {
      "lng":-78.5490955,"lat":-0.341417},
        {
      "lng":-78.5490687,"lat":-0.3415001},
        {
      "lng":-78.5490338,"lat":-0.3417804},
        {
      "lng":-78.549007,"lat":-0.3420446},
        {
      "lng":-78.5492873,"lat":-0.3421076},
        {
      "lng":-78.5494952,"lat":-0.3421492},
        {
      "lng":-78.5498358,"lat":-0.3422095},
        {
      "lng":-78.550028,"lat":-0.3422331},
        {
      "lng":-78.5508478,"lat":-0.3423586},
        {
      "lng":-78.5515198,"lat":-0.3424734},
        {
      "lng":-78.5521917,"lat":-0.3425989},
        {
      "lng":-78.5523562,"lat":-0.3426293},
        {
      "lng":-78.5526311,"lat":-0.3426742},
        {
      "lng":-78.5529637,"lat":-0.3427285},
        {
      "lng":-78.5532447,"lat":-0.3427762},
        {
      "lng":-78.5533164,"lat":-0.3427882},
        {
      "lng":-78.5533995,"lat":-0.342809},
        {
      "lng":-78.5536805,"lat":-0.342866},
        {
      "lng":-78.5536671,"lat":-0.3429666},
        {
      "lng":-78.5536403,"lat":-0.3432019},
        {
      "lng":-78.5536322,"lat":-0.3432737},
        {
      "lng":-78.5536161,"lat":-0.3434272},
        {
      "lng":-78.5535868,"lat":-0.3437251},
        {
      "lng":-78.5535868,"lat":-0.343933},
        {
      "lng":-78.5536056,"lat":-0.3442227},
        {
      "lng":-78.5536351,"lat":-0.3446626},
        {
      "lng":-78.5536552,"lat":-0.3448262},
        {
      "lng":-78.5536753,"lat":-0.3450193},
        {
      "lng":-78.5537129,"lat":-0.3450837},
        {
      "lng":-78.5537638,"lat":-0.3451681},
        {
      "lng":-78.5538282,"lat":-0.3452191},
        {
      "lng":-78.5539194,"lat":-0.3452875},
        {
      "lng":-78.5540159,"lat":-0.3453438},
        {
      "lng":-78.5541246,"lat":-0.3454015},
        {
      "lng":-78.554205,"lat":-0.3454605},
        {
      "lng":-78.554264,"lat":-0.3455141},
        {
      "lng":-78.5543311,"lat":-0.3456214},
        {
      "lng":-78.5544397,"lat":-0.3458373},
        {
      "lng":-78.554484,"lat":-0.3459594},
        {
      "lng":-78.554488,"lat":-0.3459916},
        {
      "lng":-78.5545671,"lat":-0.3459634},
        {
      "lng":-78.5548275,"lat":-0.3458895},
        {
      "lng":-78.5550689,"lat":-0.3458238},
        {
      "lng":-78.5552312,"lat":-0.3457768},
        {
      "lng":-78.5553754,"lat":-0.3457446},
        {
      "lng":-78.5556261,"lat":-0.3456762},
        {
      "lng":-78.55594,"lat":-0.3455911},
        {
      "lng":-78.5563282,"lat":-0.3454892},
        {
      "lng":-78.5565944,"lat":-0.3454141},
        {
      "lng":-78.5569183,"lat":-0.345337},
        {
      "lng":-78.5571624,"lat":-0.3452679},
        {
      "lng":-78.5575211,"lat":-0.3451794},
        {
      "lng":-78.5576016,"lat":-0.3451619},
        {
      "lng":-78.5578484,"lat":-0.3450895},
        {
      "lng":-78.5581541,"lat":-0.3450037},
        {
      "lng":-78.5583392,"lat":-0.3449534},
        {
      "lng":-78.5585021,"lat":-0.3449098},
        {
      "lng":-78.5589642,"lat":-0.3447871},
        {
      "lng":-78.5592458,"lat":-0.3447147},
        {
      "lng":-78.5593531,"lat":-0.3446852},
        {
      "lng":-78.5594583,"lat":-0.3446637},
        {
      "lng":-78.5595764,"lat":-0.3446369},
        {
      "lng":-78.5596233,"lat":-0.3446262},
        {
      "lng":-78.5596354,"lat":-0.3446155},
        {
      "lng":-78.5596401,"lat":-0.3445075},
        {
      "lng":-78.5596575,"lat":-0.3443057},
        {
      "lng":-78.5596756,"lat":-0.3440502},
        {
      "lng":-78.5597111,"lat":-0.3438068},
        {
      "lng":-78.5597353,"lat":-0.3435486},
        {
      "lng":-78.5597494,"lat":-0.3434024},
        {
      "lng":-78.5600639,"lat":-0.3434273},
        {
      "lng":-78.5603099,"lat":-0.3434447},
        {
      "lng":-78.5606285,"lat":-0.3434635},
        {
      "lng":-78.5607901,"lat":-0.3434796},
        {
      "lng":-78.5610355,"lat":-0.343503},
        {
      "lng":-78.5613252,"lat":-0.3435205},
        {
      "lng":-78.5614405,"lat":-0.3435258},
        {
      "lng":-78.5614908,"lat":-0.3435265},
        {
      "lng":-78.5615719,"lat":-0.3435366},
        {
      "lng":-78.5616638,"lat":-0.3435446},
        {
      "lng":-78.5619018,"lat":-0.3435754},
        {
      "lng":-78.5619944,"lat":-0.3435754},
        {
      "lng":-78.5621828,"lat":-0.3435808},
        {
      "lng":-78.5622941,"lat":-0.3435674},
        {
      "lng":-78.5623692,"lat":-0.3435526},
        {
      "lng":-78.5626086,"lat":-0.3435084},
        {
      "lng":-78.5627005,"lat":-0.3434843},
        {
      "lng":-78.5627836,"lat":-0.3434655},
        {
      "lng":-78.5631437,"lat":-0.3433817},
        {
      "lng":-78.5632208,"lat":-0.3433595},
        {
      "lng":-78.5633294,"lat":-0.343322},
        {
      "lng":-78.5636486,"lat":-0.3432234},
        {
      "lng":-78.5637459,"lat":-0.3431892},
        {
      "lng":-78.5639383,"lat":-0.3431369},
        {
      "lng":-78.5640382,"lat":-0.3431101},
        {
      "lng":-78.5641609,"lat":-0.3430759},
        {
      "lng":-78.5644573,"lat":-0.3429948},
        {
      "lng":-78.564855,"lat":-0.3428841},
        {
      "lng":-78.5649643,"lat":-0.3428519},
        {
      "lng":-78.5650668,"lat":-0.3428197},
        {
      "lng":-78.5652492,"lat":-0.3427701},
        {
      "lng":-78.5654967,"lat":-0.3427111},
        {
      "lng":-78.5656308,"lat":-0.3426789},
        {
      "lng":-78.5657146,"lat":-0.3426588},
        {
      "lng":-78.5660948,"lat":-0.3425462},
        {
      "lng":-78.5661518,"lat":-0.3425334},
        {
      "lng":-78.5662115,"lat":-0.342512},
        {
      "lng":-78.5666058,"lat":-0.3424054},
        {
      "lng":-78.5669129,"lat":-0.3423222},
        {
      "lng":-78.5669886,"lat":-0.3422974},
        {
      "lng":-78.5674299,"lat":-0.3421774},
        {
      "lng":-78.5678014,"lat":-0.3420775},
        {
      "lng":-78.5681098,"lat":-0.3419809},
        {
      "lng":-78.5681755,"lat":-0.3419594},
        {
      "lng":-78.5685745,"lat":-0.3418736},
        {
      "lng":-78.56861,"lat":-0.3418689},
        {
      "lng":-78.568657,"lat":-0.341879},
        {
      "lng":-78.5687126,"lat":-0.3418951},
        {
      "lng":-78.568775,"lat":-0.3419165},
        {
      "lng":-78.5688528,"lat":-0.341936},
        {
      "lng":-78.5691136,"lat":-0.3419682},
        {
      "lng":-78.569117,"lat":-0.3418884},
        {
      "lng":-78.5691317,"lat":-0.3416476}
  
  ],
  "polilineasRutaBajada": [

{
      "lng":    -78.5691317,"lat":-0.3416476},
{
      "lng":    -78.5691594,"lat":-0.3415998},
{
      "lng":    -78.5691661,"lat":-0.3413853},
{
      "lng":    -78.5691822,"lat":-0.3410393},
{
      "lng":    -78.5691876,"lat":-0.3409011},
{
      "lng":    -78.569209,"lat":-0.3407831},
{
      "lng":    -78.5693606,"lat":-0.3404747},
{
      "lng":    -78.5694263,"lat":-0.340354},
{
      "lng":    -78.5694907,"lat":-0.3401153},
{
      "lng":    -78.569555,"lat":-0.3399275},
{
      "lng":    -78.5697347,"lat":-0.3395601},
{
      "lng":    -78.5697964,"lat":-0.3394581},
{
      "lng":    -78.5698514,"lat":-0.3393616},
{
      "lng":    -78.569323,"lat":-0.3390142},
{
      "lng":    -78.5690749,"lat":-0.3388721},
{
      "lng":    -78.5689837,"lat":-0.3388305},
{
      "lng":    -78.5688939,"lat":-0.3388037},
{
      "lng":    -78.5688121,"lat":-0.3387474},
{
      "lng":    -78.5687155,"lat":-0.3386924},
{
      "lng":    -78.5686136,"lat":-0.338632},
{
      "lng":    -78.5681428,"lat":-0.3383772},
{
      "lng":    -78.5680302,"lat":-0.3383088},
{
      "lng":    -78.5673248,"lat":-0.3379052},
{
      "lng":    -78.5672564,"lat":-0.3378569},
{
      "lng":    -78.5671746,"lat":-0.3377818},
{
      "lng":    -78.5670954,"lat":-0.3376785},
{
      "lng":    -78.5668312,"lat":-0.3373969},
{
      "lng":    -78.5664303,"lat":-0.3369101},
{
      "lng":    -78.5663283,"lat":-0.3368269},
{
      "lng":    -78.5661902,"lat":-0.3367438},
{
      "lng":    -78.5660547,"lat":-0.336658},
{
      "lng":    -78.5658402,"lat":-0.3365359},
{
      "lng":    -78.565808,"lat":-0.3366264},
{
      "lng":    -78.5657376,"lat":-0.3368578},
{
      "lng":    -78.5657054,"lat":-0.336955},
{
      "lng":    -78.5656826,"lat":-0.3370475},
{
      "lng":    -78.5656021,"lat":-0.3372796},
{
      "lng":    -78.5655317,"lat":-0.3374593},
{
      "lng":    -78.5654425,"lat":-0.3377094},
{
      "lng":    -78.565413,"lat":-0.3378408},
{
      "lng":    -78.5653916,"lat":-0.3379521},
{
      "lng":    -78.5653989,"lat":-0.3379923},
{
      "lng":    -78.5654057,"lat":-0.3380842},
{
      "lng":    -78.5654425,"lat":-0.3383953},
{
      "lng":    -78.5654794,"lat":-0.3386367},
{
      "lng":    -78.5655384,"lat":-0.3389666},
{
      "lng":    -78.5655994,"lat":-0.3393743},
{
      "lng":    -78.5656591,"lat":-0.3397357},
{
      "lng":    -78.5657034,"lat":-0.3401173},
{
      "lng":    -78.5657396,"lat":-0.3403902},
{
      "lng":    -78.5657523,"lat":-0.3404707},
{
      "lng":    -78.5658053,"lat":-0.3408723},
{
      "lng":    -78.5658201,"lat":-0.3409809},
{
      "lng":    -78.5658368,"lat":-0.3410272},
{
      "lng":    -78.5659481,"lat":-0.3409736},
{
      "lng":    -78.5660387,"lat":-0.3409333},
{
      "lng":    -78.5661285,"lat":-0.3409032},
{
      "lng":    -78.5662271,"lat":-0.3408743},
{
      "lng":    -78.5663196,"lat":-0.3408401},
{
      "lng":    -78.5664464,"lat":-0.3408066},
{
      "lng":    -78.5665054,"lat":-0.3407922},
{
      "lng":    -78.5667293,"lat":-0.3407399},
{
      "lng":    -78.5667736,"lat":-0.3407305},
{
      "lng":    -78.5668316,"lat":-0.3407208},
{
      "lng":    -78.5669452,"lat":-0.34071},
{
      "lng":    -78.5669815,"lat":-0.3407057},
{
      "lng":    -78.5670002,"lat":-0.3407037},
{
      "lng":    -78.5670425,"lat":-0.3408341},
{
      "lng":    -78.567077,"lat":-0.3409437},
{
      "lng":    -78.567138,"lat":-0.3411439},
{
      "lng":    -78.5672017,"lat":-0.3413628},
{
      "lng":    -78.5672128,"lat":-0.3414165},
{
      "lng":    -78.5672343,"lat":-0.341515},
{
      "lng":    -78.5672651,"lat":-0.3416786},
{
      "lng":    -78.5673013,"lat":-0.3418349},
{
      "lng":    -78.5673288,"lat":-0.3420018},
{
      "lng":    -78.5673731,"lat":-0.3422124},
{
      "lng":    -78.5672165,"lat":-0.3422566},
{
      "lng":    -78.5669493,"lat":-0.3423277},
{
      "lng":    -78.5667857,"lat":-0.3423787},
{
      "lng":    -78.5664578,"lat":-0.3424679},
{
      "lng":    -78.5661969,"lat":-0.3425389},
{
      "lng":    -78.5659716,"lat":-0.3426026},
{
      "lng":    -78.5657201,"lat":-0.3426791},
{
      "lng":    -78.5653037,"lat":-0.3427777},
{
      "lng":    -78.5651348,"lat":-0.3428246},
{
      "lng":    -78.5648276,"lat":-0.3429124},
{
      "lng":    -78.5644689,"lat":-0.3430117},
{
      "lng":    -78.5639465,"lat":-0.3431572},
{
      "lng":    -78.5635858,"lat":-0.3432611},
{
      "lng":    -78.5632096,"lat":-0.3433832},
{
      "lng":    -78.5631902,"lat":-0.3433919},
{
      "lng":    -78.5631694,"lat":-0.3433972},
{
      "lng":    -78.5631492,"lat":-0.3434013},
{
      "lng":    -78.562769,"lat":-0.3434911},
{
      "lng":    -78.5624968,"lat":-0.3435541},
{
      "lng":    -78.5623164,"lat":-0.343587},
{
      "lng":    -78.5621702,"lat":-0.3436017},
{
      "lng":    -78.5620683,"lat":-0.3435991},
{
      "lng":    -78.561906,"lat":-0.3435964},
{
      "lng":    -78.5615225,"lat":-0.3435528},
{
      "lng":    -78.5611658,"lat":-0.3435334},
{
      "lng":    -78.5608714,"lat":-0.3435092},
{
      "lng":    -78.5606246,"lat":-0.3434831},
{
      "lng":    -78.560174,"lat":-0.3434562},
{
      "lng":    -78.559769,"lat":-0.343422},
{
      "lng":    -78.5597556,"lat":-0.3435823},
{
      "lng":    -78.5597321,"lat":-0.343813},
{
      "lng":    -78.5597133,"lat":-0.3439424},
{
      "lng":    -78.5596905,"lat":-0.3441274},
{
      "lng":    -78.5596758,"lat":-0.3443326},
{
      "lng":    -78.5596597,"lat":-0.3445452},
{
      "lng":    -78.559653,"lat":-0.3446377},
{
      "lng":    -78.559423,"lat":-0.344692},
{
      "lng":    -78.5592916,"lat":-0.3447215},
{
      "lng":    -78.5591722,"lat":-0.3447564},
{
      "lng":    -78.5590066,"lat":-0.3448},
{
      "lng":    -78.5587746,"lat":-0.344863},
{
      "lng":    -78.5584661,"lat":-0.3449448},
{
      "lng":    -78.5583682,"lat":-0.344967},
{
      "lng":    -78.558167,"lat":-0.345024},
{
      "lng":    -78.5579163,"lat":-0.3450903},
{
      "lng":    -78.5576467,"lat":-0.3451722},
{
      "lng":    -78.5574858,"lat":-0.3452084},
{
      "lng":    -78.5571766,"lat":-0.3452875},
{
      "lng":    -78.5568662,"lat":-0.3453713},
{
      "lng":    -78.5566516,"lat":-0.3454203},
{
      "lng":    -78.5564276,"lat":-0.3454806},
{
      "lng":    -78.5561815,"lat":-0.3455523},
{
      "lng":    -78.5558396,"lat":-0.3456382},
{
      "lng":    -78.5555016,"lat":-0.3457374},
{
      "lng":    -78.5553769,"lat":-0.3457656},
{
      "lng":    -78.5551502,"lat":-0.3458206},
{
      "lng":    -78.5547559,"lat":-0.3459339},
{
      "lng":    -78.5544884,"lat":-0.346011},
{
      "lng":    -78.5544616,"lat":-0.346013},
{
      "lng":    -78.5544461,"lat":-0.3459661},
{
      "lng":    -78.5543865,"lat":-0.3458152},
{
      "lng":    -78.5543127,"lat":-0.3456556},
{
      "lng":    -78.5542275,"lat":-0.3455349},
{
      "lng":    -78.5541759,"lat":-0.3454813},
{
      "lng":    -78.5541223,"lat":-0.3454451},
{
      "lng":    -78.5540351,"lat":-0.3453968},
{
      "lng":    -78.55396,"lat":-0.3453498},
{
      "lng":    -78.5538031,"lat":-0.3452338},
{
      "lng":    -78.5537199,"lat":-0.3451433},
{
      "lng":    -78.5536757,"lat":-0.3450595},
{
      "lng":    -78.5536576,"lat":-0.3450092},
{
      "lng":    -78.5536469,"lat":-0.3449529},
{
      "lng":    -78.553622,"lat":-0.3448221},
{
      "lng":    -78.5536013,"lat":-0.3446143},
{
      "lng":    -78.5535771,"lat":-0.3443259},
{
      "lng":    -78.5535557,"lat":-0.344102},
{
      "lng":    -78.553553,"lat":-0.343874},
{
      "lng":    -78.5535483,"lat":-0.3437392},
{
      "lng":    -78.5535798,"lat":-0.3435468},
{
      "lng":    -78.5536013,"lat":-0.3433409},
{
      "lng":    -78.55362,"lat":-0.3431076},
{
      "lng":    -78.5536495,"lat":-0.3428796},
{
      "lng":    -78.5534061,"lat":-0.3428313},
{
      "lng":    -78.5532962,"lat":-0.3428018},
{
      "lng":    -78.5529495,"lat":-0.3427455},
{
      "lng":    -78.5525994,"lat":-0.3426885},
{
      "lng":    -78.5523748,"lat":-0.3426543},
{
      "lng":    -78.5521348,"lat":-0.3426114},
{
      "lng":    -78.5518075,"lat":-0.3425524},
{
      "lng":    -78.5516335,"lat":-0.3425155},
{
      "lng":    -78.5512956,"lat":-0.3424525},
{
      "lng":    -78.551077,"lat":-0.3424122},
{
      "lng":    -78.5508584,"lat":-0.3423854},
{
      "lng":    -78.5508141,"lat":-0.342376},
{
      "lng":    -78.5508825,"lat":-0.3420622},
{
      "lng":    -78.5509361,"lat":-0.3417148},
{
      "lng":    -78.5509925,"lat":-0.3413903},
{
      "lng":    -78.5510863,"lat":-0.3408498},
{
      "lng":    -78.55114,"lat":-0.3405266},
{
      "lng":    -78.5505231,"lat":-0.3404287},
{
      "lng":    -78.5499571,"lat":-0.3403174},
{
      "lng":    -78.5494341,"lat":-0.3402222},
{
      "lng":    -78.5492946,"lat":-0.3401981},
{
      "lng":    -78.5491806,"lat":-0.3401753},
{
      "lng":    -78.5490889,"lat":-0.3401399},
{
      "lng":    -78.5490503,"lat":-0.3401198},
{
      "lng":    -78.5490131,"lat":-0.3400929},
{
      "lng":    -78.5489715,"lat":-0.3400379},
{
      "lng":    -78.548942,"lat":-0.3400084},
{
      "lng":    -78.5489125,"lat":-0.3400004},
{
      "lng":    -78.5488797,"lat":-0.3400044},
{
      "lng":    -78.5488562,"lat":-0.3399414},
{
      "lng":    -78.5487294,"lat":-0.3397395},
{
      "lng":    -78.5486952,"lat":-0.3396658},
{
      "lng":    -78.5486617,"lat":-0.3395618},
{
      "lng":    -78.5486356,"lat":-0.3394827},
{
      "lng":    -78.5486188,"lat":-0.3393506},
{
      "lng":    -78.5486268,"lat":-0.3392956},
{
      "lng":    -78.5486403,"lat":-0.3392366},
{
      "lng":    -78.5486751,"lat":-0.3391153},
{
      "lng":    -78.5487033,"lat":-0.3389677},
{
      "lng":    -78.5487402,"lat":-0.3387673},
{
      "lng":    -78.548773,"lat":-0.3386506},
{
      "lng":    -78.5488468,"lat":-0.3385279},
{
      "lng":    -78.5489071,"lat":-0.338499},
{
      "lng":    -78.5489796,"lat":-0.3384622},
{
      "lng":    -78.5491687,"lat":-0.3383435},
{
      "lng":    -78.5491982,"lat":-0.3383093},
{
      "lng":    -78.5492773,"lat":-0.3383079},
{
      "lng":    -78.5492826,"lat":-0.338326},
{
      "lng":    -78.5492692,"lat":-0.3383643},
{
      "lng":    -78.5492049,"lat":-0.3385111},
{
      "lng":    -78.549166,"lat":-0.3385808},
{
      "lng":    -78.5491447,"lat":-0.3386389}


  ]
}