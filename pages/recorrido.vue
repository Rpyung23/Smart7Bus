<template>
  <div>
    <GmapMap
      :center="oCenter"
      :zoom="oZoom"
      ref="MapaRecorrido"
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
      <GmapPolygon
        v-for="control in mListControlesRecorrido"
        :key="control.CodiCtrl"
        :options="{
          strokeColor: '#F71313',
          fillColor: '#F7131380',
          strokeOpacity: 1.0,
          strokeWeight: 2,
        }"
        :strokeOpacity="0.5"
        :strokeWeight="1"
        :paths="control.calculator.coordinates"
      />

      <GmapMarker
        v-for="(control, index) in mListControlesRecorrido"
        :key="control.DescCtrl + index"
        :position="{
          lat: parseFloat(control.Lati1Ctrl),
          lng: parseFloat(control.Long1Ctrl),
        }"
        :optimized="true"
        icon="static/img/control/control.png"
        :options="{
          label: {
            text: control.CodiCtrl,
            color: '#F71313',
            className: 'paddingLabelControl',
          },
        }"
      />
      <GmapMarker
        v-for="(marker, index) in mListPosicionesRecorrido"
        :key="marker.idHistEve"
        :icon="marker.icono"
        @click="showInfoWindowsRecorrido(marker, index)"
        :position="{
          lat: parseFloat(marker.LatiHistEven),
          lng: parseFloat(marker.LongHistEven),
        }"
      />

      <GmapMarker
        v-for="(control, index) in mListControlesRecorrido"
        :key="control.DescCtrl + index"
        :position="{
          lat: parseFloat(control.Lati1Ctrl),
          lng: parseFloat(control.Long1Ctrl),
        }"
        :optimized="true"
        icon="static/img/control/control.png"
        :options="{
          label: {
            text: control.CodiCtrl,
            color: '#F71313',
            className: 'paddingLabelControl',
          },
        }"
      />

      <GmapInfoWindow
        :options="infoOptionsRecorrido"
        :position="infoWindowPosRecorrido"
        :opened="infoWinOpenRecorrido"
        @closeclick="infoWinOpenRecorrido = false"
      >
        <div v-html="infoContentRecoorrido"></div>
      </GmapInfoWindow>
    </GmapMap>

    <!--<div class="container-item-busqueda">
      <el-autocomplete
        class="inline-input autocomplete-5rem"
        v-model="itemUnidadRecorrido"
        :fetch-suggestions="querySearchUnidadRecorrido"
        placeholder="Unidad"
        :trigger-on-focus="false"
        @select="handleSelectUnidadRecorrido"
      ></el-autocomplete>

      <base-input addon-left-icon="ni ni-calendar-grid-58">
        <flat-picker
          slot-scope="{ focus, blur }"
          @on-open="focus"
          @on-close="blur"
          :config="{ allowInput: true, mode: 'range' }"
          class="form-control datepicker datepicker-ancho"
          v-model="dates.range"
        >
        </flat-picker>
      </base-input>

      <el-date-picker
        v-model="value3"
        type="datetime"
        placeholder="Select date and time"
        default-time="12:00:00"
      >
      </el-date-picker>

      <el-button type="primary" icon="el-icon-search">Search</el-button>
    </div>-->

    <div id="tabOptionsRecorrido" class="tabOptionsRecorrido">
      <div
        id="itemSearchRecorrido"
        class="itemOptionRecorrido"
        @click="dialogFormVisible = true"
      >
        <i class="bx bx-search"></i>
      </div>
      <div id="itemControlesRecorrido" class="itemOptionRecorrido">
        <i class="bx bx-time-five"></i>
      </div>
      <div id="itemExVelocidadRecorrido" class="itemOptionRecorrido">
        <i class="bx bx-tachometer"></i>
      </div>
      <div id="itemFueraRutaRecorrido" class="itemOptionRecorrido">
        <i class="bx bx-trip"></i>
      </div>
    </div>

    <div id="PanelFRutaRecorrido" class="container_Recorrido"></div>

    <div id="PanelExVelocidad" class="container_Recorrido"></div>

    <div id="PanelControlesRecorrido" class="container_Recorrido"></div>

    <el-dialog title="Recorrido Unidad" :visible.sync="dialogFormVisible">
      <el-form>
        <div class="row">
          <el-form-item class="col" label="Unidad">
            <el-autocomplete
              class="inline-input autocomplete-5rem"
              v-model="itemUnidadRecorrido"
              :fetch-suggestions="querySearchUnidadRecorrido"
              placeholder="Unidad"
              :trigger-on-focus="false"
              @select="handleSelectUnidadRecorrido"
            ></el-autocomplete>
          </el-form-item>

          <el-form-item class="col" label="Fecha">
            <el-date-picker
              type="date"
              placeholder="Seleccione la fecha"
              v-model="fechaActualRecorrido"
              :picker-options="{
                selectableRange: '01:00:00 - 23:59:59',
              }"
            >
            </el-date-picker>
          </el-form-item>
        </div>

        <el-form-item label="Horas">
          <el-time-picker
            is-range
            range-separator="Hasta"
            v-model="RangeHorasRecorrido"
            start-placeholder="Hora Inicial"
            end-placeholder="Hora Final"
          >
          </el-time-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancelar</el-button>
        <el-button type="primary" @click="initRecorrido()"
          >Generar Recorrido</el-button
        >
      </span>
    </el-dialog>
    <script src="../js/tabButtonsRecorrido.js"></script>
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

.container_Recorrido {
  position: absolute;
  height: calc(100vh - 9em);
  min-width: 17rem;
  max-width: 17rem;
  right: 0px;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  top: 0px;
  margin-top: 8.3rem;
  margin-right: 1rem;
  background-color: whitesmoke;
  display: flex;
  flex-direction: column;
  /*align-items: center;*/
  align-items: center;
  border-radius: 0.5rem;
}

.tabOptionsRecorrido {
  height: 3.3rem;
  width: 11rem;
  margin-right: 1rem;
  margin-top: 4.5rem;
  position: absolute;
  top: 0;
  right: 0;
  background-color: white;
  border-radius: 5rem;
  display: flex;
  padding: 0.4rem;
}

.itemOptionRecorrido {
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

.itemOptionRecorridoActive {
  background-color: #172b4d;
  color: whitesmoke;
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
} from "element-ui";
import { FechaStringToHour } from "../util/fechas";
import BaseCheckbox from "@/components/argon-core/Inputs/BaseCheckbox";
import flatPicker from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";

export default {
  layout: "DashboardLayout",
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
  },
  data() {
    return {
      token: this.$cookies.get("token"),
      itemUnidadRecorrido: "",
      infoWindowPosRecorrido: {
        lat: 0,
        lng: 0,
      },
      infoContentRecoorrido: null,
      fechaActualRecorrido: null,
      infoWinOpenRecorrido: false,
      infoOptionsRecorrido: {
        pixelOffset: {
          width: 0,
          height: -35,
        },
      },
      currentMinxRecorrido: null,
      googleMap: null,
      mListUnidadesRecorrido: [],
      mListPosicionesRecorrido: [],
      mListPosicionesMarc: [],
      RangeHorasRecorrido: [
        new Date(2016, 9, 10, 9, 0),
        new Date(2016, 9, 23, 59, 59),
      ],
      dialogFormVisible: false,
      oCenter: { lat: -1.249546, lng: -78.585376 },
      oZoom: 7,
      mListControlesRecorrido: [],
    };
  },
  methods: {
    async showInfoWindowsRecorrido(unidad, idx) {
      this.infoWindowPosRecorrido = {
        lat: parseFloat(unidad.LatiHistEven),
        lng: parseFloat(unidad.LongHistEven),
      };
      this.infoContentRecoorrido = await this.getInfoWindowContentRecorrido(
        unidad
      );

      //check if its the same marker that was selected if yes toggle
      if (this.currentMinxRecorrido == idx) {
        this.infoWinOpenRecorrido = !this.infoWinOpenRecorrido;
      }
      //if different marker set infowindow to open and reset current marker index
      else {
        this.infoWinOpenRecorrido = true;
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
    async getPosicionesMarcacionRecorrido(salidas, fechaI, fechaF) 
    {

      var body = {
        token: this.token,
        idsalida: salidas,
        fechaI: fechaI,
        fechaF: fechaF,
      };
      console.log(body);
      try {
        var datos = await this.$axios.post(
          process.env.baseUrlPanel + "/detalleSalidaHoras",
          body
        );

        if (datos.data.status_code == 200) 
        {
          Notification.success({
            title: "Marcaciones",
            message: "Marcaciones consultados con éxito.",
          });

          for(var i = 0;i<datos.data.data.length;i++)
          {
            /*if(datos.data.data[i].){
              this.mListControlesRecorrido[i].coordinates[]
            }*/
          }

        } else if (datos.data.status_code == 300) {
          Notification.info({
            title: "Marcaciones",
            message: "No existen Marcaciones disponibles actualmente.",
          });
        } else {
          Notification.error({
            title: "Marcaciones",
            message: datos.data.sms,
          });
        }
      } catch (error) {
        console.log(error);
        Notification.error({
          title: "Error Api Marcaciones",
          message: error.toString(),
        });
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
      this.fechaActualRecorrido = format;
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
    async initControlesRecorrido() {
      try {
        var datos = await this.$axios.post(
          process.env.baseUrlPanel + "/checkpoints",
          {
            token: this.token,
          }
        );
        console.log(datos.data.data);
        if (datos.data.status_code == 200) {
          this.mListControlesRecorrido.push(...datos.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    },
    async readUnidadAllRecorrido() {
      try {
        var datos = await this.$axios.post(
          process.env.baseUrlPanel + "/unidades-all",
          {
            token: this.token,
          }
        );

        if (datos.data.status_code == 200) {
          for (var i = 0; i < datos.data.data.length; i++) {
            this.mListUnidadesRecorrido[i] = datos.data.data[i];
            this.mListUnidadesRecorrido[i].value = datos.data.data[i].CodiVehi;
          }
        }
      } catch (error) {
        this.showToast("error", error.toString());
      }
    },
    async initRecorrido() {
      this.mListPosicionesRecorrido = [];
      var body = {
        token: this.token,
        unidad: this.itemUnidadRecorrido,
        fechaI:
          this.fechaActualRecorrido +
          " " +
          FechaStringToHour(this.RangeHorasRecorrido[0]),
        fechaF:
          this.fechaActualRecorrido +
          " " +
          FechaStringToHour(this.RangeHorasRecorrido[1]),
      };
      console.log(body);
      try {
        var datos = await this.$axios.post(
          process.env.baseUrlPanel + "/recorridoUnidad",
          body
        );

        if (datos.data.status_code == 200) {
          Notification.success({
            title: "Recorrido",
            message: "Datos consultados con éxito.",
          });

          for (var i = 0; i < datos.data.datos.length; i++) {
            this.mListPosicionesRecorrido[i] = datos.data.datos[i];
            this.mListPosicionesRecorrido[i].icono = this.getIcono(
              this.mListPosicionesRecorrido[i]
            );
            //console.log(this.mListUnidadesRecorrido[i].icono)
            //this.girarMarcadorUnitario(this.mListUnidadesRecorrido[i])
            if (i == 0) {
              this.oZoom = 17;
              this.oCenter = {
                lat: parseFloat(datos.data.datos[i].LatiHistEven),
                lng: parseFloat(datos.data.datos[i].LongHistEven),
              };
            }
          }
          if (datos.data.salidas.length > 0) {
            await this.getPosicionesMarcacionRecorrido(
              datos.data.salidas,
              body.fechaI,
              body.fechaF
            );
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
    getIcono(unidad) {
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

      return {
        path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
        fillColor:
          unidad.EvenExceVeloHistEven == 1
            ? "yellow"
            : unidad.OutRoutHistEven
            ? "red"
            : "green",
        fillOpacity: 1,
        strokeWeight: 0,
        rotation: unidad.RumbHistEven,
        scale: 3,
        anchor: new google.maps.Point(0, 0),
      };
    },
    girarMarcador() {
      for (var i = 0; i < this.mListUnidadesRecorrido.length; i++) {
        $('img[src*="' + this.mListUnidadesRecorrido[i].icono + '"]').css({
          transform:
            "rotate(" + (this.mListUnidades[i].UltiRumbMoni - 90) + "deg)",
        });
      }
    },
    girarMarcadorUnitario(unidad) {
      var rotation = unidad.RumbHistEven - 90;
      /*$(`img[src="${unidad.icono.imagen}"]`).css({
        "-webkit-transform": "rotate(" + rotation + "deg)",
        "-moz-transform": "rotate(" + rotation + "deg)",
        "-ms-transform": "rotate(" + rotation + "deg)",
        transform: "rotate(" + rotation + "deg)",
      });*/
      console.log(unidad.icono);
      console.log(rotation);

      $('img[src*="' + unidad.icono + '"]').css({
        transform: "rotate(" + rotation + "deg)",
      });

      /*$('img[src*="' + unidad.icono.imagen + '"]')
        .parent()
        .css("transform", "rotate(" + unidad.UltiRumbMoni + "deg)");*/
    },
    querySearchUnidadRecorrido(queryString, cb) {
      var unidades = this.mListUnidadesRecorrido;
      var results = queryString
        ? unidades.filter(this.createFilterUnidadRecorrido(queryString))
        : unidades;
      cb(results);
    },
    createFilterUnidadRecorrido(queryString) {
      return (link) => {
        return (
          link.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    handleSelectUnidadRecorrido(item) {
      console.log(item);
    },
  },
  mounted() {
    this.initFechaActual();
    this.readUnidadAllRecorrido();
    this.initControlesRecorrido();
  },
};
</script>

