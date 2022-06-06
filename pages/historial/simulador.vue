<template>
  <div>
    <GmapMap
      :center="oCenter"
      :zoom="oZoom"
      ref="MapaSimulador"
      map-type-id="roadmap"
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
        v-for="(marker, index) in mListUnidadesSimuladorSimulador"
        :key="marker.CodiVehi"
        :draggable="false"
        :optimized="true"
        @click="showInfoWindowsSimulador(marker, index)"
        :position="{lat:parseFloat(marker.LatiHistEven),lng:parseFloat(marker.LongHistEven)}"
      />

      <GmapInfoWindow
        :options="infoOptionsSimulador"
        :position="infoWindowSimulador"
        :opened="infoWinOpenSimulador"
        @closeclick="infoWinOpenSimulador = false"
      >
        <div v-html="infoContentSimulador"></div>
      </GmapInfoWindow>
    </GmapMap>

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
  </div>
</template>
<style>
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

.bx {
  font-size: 1.2rem;
}

/***SOLO PARA EL AUTOCOMPLETE**/
.form-group {
  margin-bottom: 0%;
}

/********************************* */

.mapa {
  width: 100%;
  height: calc(100vh - 3.56rem);
}
/****/
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
</style>


<script>
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

export default {
  layout: "HistorialDashboardLayout",
  components: {
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
  data() {
    return {
      token: this.$cookies.get("token"),
      infoWindowSimulador: {
        lat: 0,
        lng: 0,
      },
      infoContentSimulador: null,
      fechaActualSimulador: null,
      infoWinOpenSimulador: false,
      infoOptionsSimulador: {
        pixelOffset: {
          width: 0,
          height: -35,
        },
      },
      currentMinxRecorrido: null,
      googleMap: null,
      itemUnidadSelectSimulador: [],
      mListUnidadesSimulador: [],
      mListUnidadesSimuladorSimulador: [],
      mListPosicionesSimulador: [],
      loadingUnidadSimulador: false,
      RangeHorasSimulador: [
        new Date(2016, 9, 10, 9, 0),
        new Date(2016, 9, 23, 59, 59),
      ],
      dialogFormVisibleSimulador: false,
      oCenter: { lat: -1.249546, lng: -78.585376 },
      oZoom: 7,
      optionsUnidadesSimulador: [],
    };
  },
  methods: {
    async showInfoWindowsSimulador(unidad, idx) {
      this.infoWindowSimulador = {
        lat: parseFloat(unidad.LatiHistEven),
        lng: parseFloat(unidad.LongHistEven),
      };
      this.infoContentSimulador = await this.getInfoWindowContentRecorrido(
        unidad
      );

      //check if its the same marker that was selected if yes toggle
      if (this.currentMinxRecorrido == idx) {
        this.infoWinOpenSimulador = !this.infoWinOpenSimulador;
      }
      //if different marker set infowindow to open and reset current marker index
      else {
        this.infoWinOpenSimulador = true;
        this.currentMinxRecorrido = idx;
      }
    },
    async getInfoWindowContentRecorrido(unidad) {
      var dir = await this.$axios.get(
        "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
          parseFloat(unidad.LatiHistEven) +
          "," +
          parseFloat(unidad.LongHistEven) +
          "&key=AIzaSyDOAdi7ZLdoctlCRA3_gYTeeIAjEHsTTY4"
      );
      var result = dir.data.results;
      return `<div style="width:250px;padding:0.5rem">
              <strong class="strongLetrasInfoWindows">FECHA MONI : </strong> ${
                unidad.FechHistEven
              }<br>
              <strong class="strongLetrasInfoWindows">EVENTO : </strong> ${
                unidad.OutRoutHistEven == 1 ? "FUERA DE RUTA" : "EN RUTA"
              } <strong>KM/H</strong><br>
              <strong class="strongLetrasInfoWindows">VELOCIDAD : </strong> ${
                unidad.VeloHistEven
              } <strong>KM/H</strong><br>
              <strong class="strongLetrasInfoWindows">DIR : </strong> ${
                result.length > 0 ? result[0].formatted_address : "SIN NOMBRES"
              }
            </div>`;
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
    showToast(type, msm) {
      var Toast = swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", swal.stopTimer);
          toast.addEventListener("mouseleave", swal.resumeTimer);
        },
      });

      Toast.fire({
        icon: type,
        title: msm,
      });
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
    getIconoRecorrido(unidad) {
      var pathExVelocidad = "img/recorrido/recorrido_ex_velocidad.png#";
      var pathFRuta = "img/recorrido/recorrido_f_ruta.png#";
      var pathTrazado = "img/recorrido/recorrido_trazado.png#";
      var imagen = "";
      if (unidad.EvenExceVeloHistEven == 1) {
        imagen = pathExVelocidad + unidad.idHistEve;
      } else if (unidad.OutRoutHistEven == 1) {
        imagen = pathFRuta + unidad.idHistEve;
      } else {
        imagen = pathTrazado + unidad.idHistEve;
      }
      return imagen;
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

        if (datos.data.status_code == 200) 
        {

          Notification.success({
            title: "Recorrido",
            message: "Datos consultados con éxito.",
          });

          this.mListPosicionesSimulador.push(...datos.data.datos);

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
  },
  mounted() {
    this.initFechaActual();
    this.readUnidadAllRecorrido();
  },
};
</script>

