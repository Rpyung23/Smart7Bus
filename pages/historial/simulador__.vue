<template>
  <div>
    <GmapMap
      ref="MapaSimulador"
      :center="centerMap"
      :zoom="zoomMap"
      map-type-id="roadmap"
      class="mapa"
      :options="{
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        disableDefaultUi: false,
      }"
    >
      <GmapMarker
        :key="index + 'b'"
        v-for="(m, index) in markers"
        :position="m.position"
        :clickable="true"
        :draggable="false"
        :icon="m.icon"
      />
      <GmapPolyline
        :key="index"
        v-for="(dp, index) in dataPoints"
        :path="dp"
        :options="{
          strokeColor: markers[index].color,
          strokeWeight: 8,
          strokeOpacity: 0.6,
        }"
      />
      <!--
      <GmapPolyline
        :key="index + 'm'"
        v-for="(dp, index) in dataPointsMoved"
        :path="dp"
        :options="{
          strokeColor: markers[index].color,
          strokeWeight: 10,
          strokeOpacity: 0.3
        }"
      />-->
    </GmapMap>

    <!--<b-sidebar id="sidebar-right" title="Buses" right shadow>
      <div class="px-3 py-2">
        <p class="row">
          <b-button-group block>
            <b-button variant="primary" @click="viewBuses"
              >Historial de Buses</b-button
            >
            <b-button variant="danger" @click="viewHistory">Leyenda</b-button>
          </b-button-group>
        </p>
        <div v-if="viewDataList">
          Seleccionados: <strong>{{ selectedOptions }}</strong>
          <b-col lg="4" class="pb-2">
            <b-button size="sm" @click="showModal">Buscar</b-button></b-col
          >
          <b-form-group
            label="Seleccione los buses:"
            v-slot="{ ariaDescribedby }"
          >
            <b-form-checkbox-group
              id="checkbox-group-1"
              v-model="selectedOptions"
              :options="busesOptions"
              :aria-describedby="ariaDescribedby"
              name="flavour-1"
            ></b-form-checkbox-group>
          </b-form-group>
        </div>
        <div v-else>
          <ul>
            <li
              class="mt-1 p-1"
              v-for="(item, index) in markers"
              :key="index"
              v-bind:style="{
                color: '#000000 !important',
                'background-color': item.out == 1 ? '#ff0000' : '#ffffff',
                'border-radius': '10px'
              }"
            >
              <div
                class="mr-1"
                v-bind:style="{
                  '-webkit-text-stroke-width': '1px',
                  '-webkit-text-stroke-color': '#fff',
                  width: '20px',
                  height: '20px',
                  'background-color': item.color,
                  float: 'left',
                  'border-radius': '50%'
                }"
              ></div>
              {{ item.code }}) {{ item.speed }} km/h
              <div
                v-bind:style="{
                  width: '100px',
                  padding: '0px',
                  'text-align': 'center',
                  'background-color': '#343a40',
                  color: '#ffffff',
                  float: 'right',
                  'border-radius': '10px'
                }"
              >
                {{ item.dateHistory }}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </b-sidebar>-->

    <div class="timeline row justify-content-left ml-3" v-if="showRepro">
      <div class="col-md-7 repro p-3">
        <div class="row">
          <div class="col-md-12 pt-2">
            <b-form-input
              class="col-md-12"
              id="range-1"
              v-model="porcent"
              type="range"
              v-on:click="stop"
              @mousedown="stop"
              step="1"
              min="0"
              max="100"
              variant="danger"
              v-on:change="updateTimeLine"
            ></b-form-input>
            <!--<b-progress :value="porcent" :max="max" class="mb-3" variant="danger" show-progress animated></b-progress>-->
          </div>
        </div>
        <div class="row mt-3 justify-content-center">
          <div class="col-md-7">
            <div class="row controls">
              <div class="col-md-2">
                <img src="/img/slower.png" v-on:click="slower" width="40px" />
              </div>
              <div class="col-md-2">
                <img src="/img/play.png" v-on:click="play" width="40px" />
              </div>
              <div class="col-md-2">
                <img src="/img/pause.png" v-on:click="stop" width="40px" />
              </div>
              <div class="col-md-2">
                <img src="/img/faster.png" v-on:click="faster" width="40px" />
              </div>
              <div class="col-md-3 mt-2 estatusrepro">
                {{ estatusRepro }}
              </div>
            </div>
          </div>

          <div class="col-md-2 ml-1">
            <b-button v-b-toggle.sidebar-right variant="danger">Buses</b-button>
          </div>
        </div>
      </div>
    </div>

    <el-button
      type="info"
      class="btn-search-simulador"
      icon="el-icon-search"
      @click="dialogFormVisibleSimulador = true"
      circle
    >
    </el-button>

    <el-dialog
      title="Simulador Unidades"
      :visible.sync="dialogFormVisibleSimulador"
    >
      <el-form>
        <div class="row">
          <el-form-item class="col" label="Unidad">
            <el-select
              v-model="itemUnidadSelectSimulador"
              multiple
              filterable
              remote
              placeholder="Ingrese la unidad"
              :remote-method="remoteMethodUnidadSimulador"
              :loading="loadingUnidadSimulador"
            >
              <el-option
                v-for="item in optionsUnidadesSimulador"
                :key="item.CodiVehi"
                :label="item.CodiVehi"
                :value="item.CodiVehi"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="col">
            <flat-picker
              slot-scope="{ focus, blur }"
              @on-open="focus"
              @on-close="blur"
              :config="{ allowInput: true }"
              class="form-control datepicker"
              v-model="fechaActualSimulador"
            >
            </flat-picker>
          </el-form-item>
        </div>

        <el-form-item label="Horas">
          <el-time-picker
            is-range
            range-separator="Hasta"
            v-model="RangeHorasSimulador"
            start-placeholder="Hora Inicial"
            end-placeholder="Hora Final"
          >
          </el-time-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleSimulador = false"
          >Cancelar</el-button
        >
        <el-button type="primary" @click="initSimulador()"
          >Generar Recorrido</el-button
        >
      </span>
    </el-dialog>

    <!--<b-modal
      ref="my-modal"
      hide-footer
      title="Seleccione parametros de búsqueda"
    >
      <div class="d-block text-center">
        <b-row>
          <b-col>
            <b-row>
              <label for="example-datepicker">INICIO</label>
              <b-form-datepicker
                id="example-datepicker"
                v-model="toQuery.date1"
                class="mb-2"
              ></b-form-datepicker>
            </b-row>
            <b-row>
              <b-form-timepicker
                v-model="toQuery.time1"
                show-seconds
                locale="es"
              ></b-form-timepicker>
            </b-row>
            <b-row>
              <p>{{ toQuery.date1 }} - {{ toQuery.time1 }}</p>
            </b-row>
          </b-col>
          <b-col>
            <b-row>
              <label for="example-datepicker">FIN</label>
              <b-form-datepicker
                id="example-datepicker2"
                v-model="toQuery.date2"
                class="mb-2"
              ></b-form-datepicker>
            </b-row>
            <b-row>
              <b-form-timepicker
                v-model="toQuery.time2"
                show-seconds
                locale="es"
              ></b-form-timepicker>
            </b-row>
            <b-row>
              <p>{{ toQuery.date2 }} - {{ toQuery.time2 }}</p>
            </b-row>
          </b-col>
        </b-row>
        <b-row>
          <b-button size="sm" @click="getHistory" block>Buscar</b-button>
        </b-row>
      </div>
    </b-modal>-->
  </div>
</template>

<script>
const Swal = require("sweetalert2");
import {
  Autocomplete,
  Button,
  Dialog,
  Form,
  TimePicker,
  DatePicker,
  FormItem,
  Notification,
  Select,
  Option,
} from "element-ui";
import { FechaStringToHour } from "../../util/fechas";
import BaseCheckbox from "@/components/argon-core/Inputs/BaseCheckbox";
import flatPicker from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";

import EstatusBus from "@/components/EstatusBus";
export default {
  components: {
    EstatusBus,
    BaseCheckbox,
    flatPicker,
    [Dialog.name]: Dialog,
    [FormItem.name]: FormItem,
    [TimePicker.name]: TimePicker,
    [DatePicker.name]: DatePicker,
    [Form.name]: Form,
    [Autocomplete.name]: Autocomplete,
    [Button.name]: Button,
    [Notification.name]: Notification,
    [Select.name]: Select,
    [Option.name]: Option,
  },
  layout: "HistorialDashboardLayout",
  data() {
    return {
      centerMap: { lat: -1.260998, lng: -78.628318 },
      dialogFormVisibleSimulador: false,
      traffic: true,
      zoomMap: 7,
      markers: [],
      fechaActualSimulador: null,
      token: this.$cookies.get("token"),
      porcent: 0,
      indexTime: 0,
      timeSpeed: 1000,
      markers: [],
      dataMarkers: [],
      buses: [],
      busesOptions: [],
      RangeHorasSimulador: [
        new Date(2016, 9, 10, 9, 0),
        new Date(2016, 9, 23, 59, 59),
      ],
      selectedOptions: [],
      toQuery: {
        date1: "",
        date2: "",
        time1: "",
        time2: "",
      },
      dataPoints: [],
      dataPointsMoved: [],
      timer: null,
      colors: [],
      sortedHistory: [],
      viewDate: "Esperando",
      viewDataList: true,
      estatusRepro: "Esperando",
      isDrawing: true,
      timeout: null,
      showRepro: false,
      loadingUnidadSimulador: false,
      optionsUnidadesSimulador: [],
      itemUnidadSelectSimulador: [],
      mListUnidadesSimulador: [],
    };
  },
  methods: {
    play() {
      this.estatusRepro = "Reproduciendo";
      if (this.timer == null) {
        this.timer = setInterval(() => {
          if (this.indexTime >= this.sortedHistory.length) {
            this.indexTime = 0;
            this.porcent = 0;
          }
          for (let i = 0; i < this.markers.length; i++) {
            if (
              this.sortedHistory[this.indexTime].CodiVehiHistEven ==
              this.markers[i].code
            ) {
              this.markers[i].position = {
                lat: parseFloat(
                  this.sortedHistory[this.indexTime].LatiHistEven
                ),
                lng: parseFloat(
                  this.sortedHistory[this.indexTime].LongHistEven
                ),
              };
              this.markers[i].speed =
                this.sortedHistory[this.indexTime].VeloHistEven;
              this.markers[i].out =
                this.sortedHistory[this.indexTime].OutRoutHistEven;
              this.markers[i].dateHistory =
                new Date(
                  this.sortedHistory[this.indexTime].FechHistEven
                ).getHours() +
                ":" +
                new Date(
                  this.sortedHistory[this.indexTime].FechHistEven
                ).getMinutes() +
                ":" +
                new Date(
                  this.sortedHistory[this.indexTime].FechHistEven
                ).getSeconds();
            }
          }
          this.viewDate =
            new Date(
              this.sortedHistory[this.indexTime].FechHistEven
            ).getFullYear() +
            "-" +
            (new Date(
              this.sortedHistory[this.indexTime].FechHistEven
            ).getMonth() +
              1) +
            "-" +
            new Date(
              this.sortedHistory[this.indexTime].FechHistEven
            ).getDate() +
            " " +
            new Date(
              this.sortedHistory[this.indexTime].FechHistEven
            ).getHours() +
            ":" +
            new Date(
              this.sortedHistory[this.indexTime].FechHistEven
            ).getMinutes() +
            ":" +
            new Date(
              this.sortedHistory[this.indexTime].FechHistEven
            ).getSeconds();
          this.porcent = this.porcent + 100 / this.sortedHistory.length;
          //indexTime
          this.indexTime++;
          //console.log("porcent", this.porcent);
        }, this.timeSpeed);
      }
    },
    initFechaActual() {
      var fecha = new Date();
      var mes = fecha.getMonth() + 1;
      var day = fecha.getDate();
      var format =
        fecha.getFullYear() +
        "-" +
        (mes < 10 ? "0" + mes : mes) +
        "-" +
        (day < 10 ? "0" + day : day);

      console.log("INITFECHAACTUAL : " + format);
      this.fechaActualSimulador = format;
    },
    async readUnidadAllRecorrido() {
      try {
        var datos = await this.$axios.post(
          process.env.baseUrlPanel + "/unidades",
          {
            token: this.token,
          }
        );

        if (datos.data.status_code == 200) {
          for (var i = 0; i < datos.data.data.length; i++) {
            this.mListUnidadesSimulador[i] = datos.data.data[i];
            this.mListUnidadesSimulador[i].value = datos.data.data[i].CodiVehi;
          }
        }
      } catch (error) {
        this.showToast("error", error.toString());
      }
    },
    remoteMethodUnidadSimulador(query) {
      if (query !== "") {
        this.loadingUnidadSimulador = true;
        setTimeout(() => {
          this.loadingUnidadSimulador = false;
          this.optionsUnidadesSimulador = this.mListUnidadesSimulador.filter(
            (item) => {
              return (
                item.CodiVehi.toLowerCase().indexOf(query.toLowerCase()) > -1
              );
            }
          );
        }, 200);
      } else {
        this.optionsUnidadesSimulador = [];
      }
    },
    move() {
      if (this.indexTime >= this.dataPoints[0].length) this.indexTime = 0;
      markersTemp = new Array();
      for (let i; i < this.markers.length; i++) {
        //console.log("insertar", this.dataPoints[i][this.indexTime]);
        let markerTemp = {
          position: this.dataPoints[i][this.indexTime],
          icon: {
            url: "img/monitoreo/online.png",
          },
        };
        markersTemp.push(markerTemp);
      }
      this.markers = markersTemp;
      //console.log("markers", this.markers);
      this.indexTime++;
    },
    stop() {
      clearInterval(this.timer);
      this.timer = null;
      this.estatusRepro = "Pause";
      console.log("eliminar");
    },
    faster() {
      this.stop();
      if (this.timeSpeed <= 100) {
        this.timeSpeed = 100;
      } else {
        this.timeSpeed -= 100;
      }
      console.log("timeSpeed", this.timeSpeed);
      this.play();
    },
    slower() {
      this.stop();
      this.timeSpeed += 100;
      this.play();
      console.log("timeSpeed", this.timeSpeed);
    },
    generarLetra() {
      var letras = [
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
      ];
      var numero = (Math.random() * 15).toFixed(0);
      return letras[numero];
    },
    colorHEX() {
      var coolor = "";
      for (var i = 0; i < 6; i++) {
        coolor = coolor + this.generarLetra();
      }
      return "#" + coolor;
    },
    generateColors() {
      for (let i = 0; i < this.markers.length; i++) {
        this.colors.push(this.colorHEX());
      }
      console.log("colores", this.colors);
    },
    async initSimulador() {
      this.mListPosicionesSimulador = [];

      var body = {
        token: this.token,
        unidades: this.itemUnidadSelectSimulador,
        fechaI:
          this.fechaActualSimulador +
          " " +
          FechaStringToHour(this.RangeHorasSimulador[0]),
        fechaF:
          this.fechaActualSimulador +
          " " +
          FechaStringToHour(this.RangeHorasSimulador[1]),
      };
      try {
        var datos = await this.$axios.post(
          process.env.baseUrlPanel + "/historialUnidadesFechas",
          body
        );

        if (datos.data.status_code == 200) {
          Notification.success({
            title: "Recorrido",
            message: "Datos consultados con éxito.",
          });

          this.mListPosicionesSimulador.push(...datos.data.datos);

          let cronologyHistory = new Array();
          let toMarkers = new Array();
          let toDataPoints = new Array();

          for (let i = 0; i < this.mListPosicionesSimulador.length; i++) {
            //console.log("response",response);
            toMarkers.push({
              position: {
                lat: parseFloat(this.mListPosicionesSimulador[i].LatiHistEven),
                lng: parseFloat(this.mListPosicionesSimulador[i].LongHistEven),
              },
              icon: {
                url: "img/monitoreo/online",
              },
              color: this.colorHEX(),
              code: this.mListPosicionesSimulador[i].CodiVehiHistEven,
              speed: this.mListPosicionesSimulador[i].VeloHistEven,
              out: this.mListPosicionesSimulador[i].OutRoutHistEven,
              dateHistory: this.mListPosicionesSimulador[i].UltiFechMoni,
            });
            cronologyHistory = cronologyHistory.concat(
              response.data.data[i].data
            );

            let inDataPoints = new Array();
            if (response.data.data[i].data) {
              for (let y = 0; y < response.data.data[i].data.length; y++) {
                inDataPoints.push({
                  lat: parseFloat(response.data.data[i].data[y].LatiHistEven),
                  lng: parseFloat(response.data.data[i].data[y].LongHistEven),
                });
              }
              toDataPoints.push(inDataPoints);
            }
          }

          this.markers = toMarkers;
          this.dataPoints = toDataPoints;
          this.indexTime = 0;
          cronologyHistory.sort((a, b) => {
            if (
              new Date(a.FechHistEven).getTime() >
              new Date(b.FechHistEven).getTime()
            ) {
              return 1;
            }
            if (
              new Date(a.FechHistEven).getTime() <
              new Date(b.FechHistEven).getTime()
            ) {
              return -1;
            }
            return 0;
          });

          this.sortedHistory = cronologyHistory;
          if (this.sortedHistory.length > 0) {
            this.play();
            this.viewHistory();
          }
        } else if (datos.data.status_code == 300) {
          Notification.info({
            title: "Recorrido",
            message: "No existen datos disponibles actualmente.",
          });
        } else {
          Notification.error({
            title: "Recorrido",
            message: datos.data.msm,
          });
        }
      } catch (error) {
        console.log(error);
        Notification.error({
          title: "Error Api Recorrido",
          message: error.toString(),
        });
      }
    },
    viewHistory() {
      this.viewDataList = false;
    },
    viewBuses() {
      this.viewDataList = true;
    },
    updateTimeLine() {
      this.stop();
      this.porcent = parseFloat(this.porcent);
      this.indexTime = Math.round(
        (this.porcent * this.sortedHistory.length) / 100
      );
      this.play();
      console.log("indexTime", this.indexTime);
    },
    mouseStop() {
      this.showRepro = false;
    },
  },
  mounted() {
    this.generateColors();
    this.initFechaActual();
    this.readUnidadAllRecorrido();
    /*this.getBusesTodo();*/
  },
};
</script>
<style>
.el-range-separator {
  width: 4rem !important;
}

.btn-search-simulador {
  position: absolute;
  z-index: 999;
  bottom: 0;
  right: 0;
  margin: 1.5rem;
}

.mapa {
  width: 100%;
  height: calc(100vh - 3.56rem);
}

.timeline {
  width: 100%;
  padding: 5px;
  position: absolute;
  bottom: 0;
}
.timeline .bar {
  z-index: 999;
  border-radius: 10px;
  background-color: #ffffff;
  border: 1px solid;
}
.timeline .repro {
  background-color: #343a40;
  border-radius: 20px;
}
.timeline .bar .controls {
  padding: 3px;
}
.timeline img {
  background-color: #dc3545;
  border-radius: 50%;
}
.timeline input[type="range"] {
  overflow: hidden;
  -webkit-appearance: none;
  background-color: #5c5c5c;
}
.timeline input[type="range"]::-webkit-slider-runnable-track {
  height: 10px;
  -webkit-appearance: none;
  color: #ffffff;
  margin-top: -1px;
}
.timeline input[type="range"]::-webkit-slider-thumb {
  width: 20px;
  -webkit-appearance: none;
  height: 10px;
  cursor: ew-resize;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: -500px 0 0 500px #dc3545;
}
.listView {
  width: 300px;
  height: 550px;
  padding: 5px;
  position: absolute;
  top: 0;
  right: 0;
  margin-top: 70px;
  text-align: center;
  background-color: #ffffff;
  border-bottom-left-radius: 20px;
  border-top-left-radius: 20px;
  border: 1px solid #000000;
}
.listView .header {
  text-align: center;
  border-bottom: 1px solid #a0a0a0;
}
.listView .body {
  height: 500px;
  overflow-y: scroll;
}
.bar {
  font-size: 17px;
  text-align: center;
}
.videoSpeed {
  font-size: 17px;
}
.b-sidebar-header {
  color: #ffffff !important;
}
.b-sidebar-body {
  color: #ffffff !important;
}
.timeline .estatusrepro {
  color: #ffffff;
}
</style>
