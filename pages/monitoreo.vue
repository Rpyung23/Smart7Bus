<template>
  <div id="rezizeArea">
    <GmapMap
      :center="oCenter"
      :zoom="oZoom"
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
        v-for="(unidad, index) in mListUnidades"
        :key="unidad.CodiVehiMoni"
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
    </GmapMap>

    <div id="element2" class="container_unidades_monitoreo" v-if="false">
      <div id="resizerXY"></div>
      <div class="searchInput">
        <i class="bx bx-search"></i>
        <input
          type="text"
          class="inputSearchTexto"
          name=""
          id=""
          placeholder="Unidad"
        />
      </div>
      <div class="ListadoUnidades">
        <div
          class="itemMonitoreoUnidad"
          :key="unidad.CodiVehiMoni"
          v-for="unidad in mListUnidades"
          @click="ubicarUnidad(unidad)"
        >
          <div class="itemContainerMonitoreo">
            <div class="imagenitem">
              <img :src="unidad.icono.imagenLista" />
            </div>
            <div class="detalle">
              <strong>Unidad : </strong>{{ unidad.CodiVehiMoni }} ({{
                unidad.PlacVehiMoni
              }})<br />
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
                  unidad.AlarEnceChapMoni == 1 ? 'color:green;' : 'color:dark;'
                "
              ></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container_unidades_monitoreo">
      <div class="searchInput">
        <i class="bx bx-search"></i>
        <input
          type="text"
          class="inputSearchTexto"
          name=""
          id=""
          placeholder="Unidad"
        />
      </div>
      <div class="cardRuta"  v-for="(ruta) in mListRutas" :key="ruta.LetrRuta">
        <div><input type="checkbox" name="" id="" />{{ruta.DescRuta}}</div>
        <div><i class="bx bx-time"></i>{{ruta.controles}} <i class="bx bx-git-merge"></i></div>
      </div>
    </div>

    <div id="tabOptionsMonitoreo" class="tabOptionsMonitoreo">
      <div
        id="itemMonitoreo"
        class="itemOptionMonitoreo itemOptionMonitoreoActive"
      >
        <i class="bx bx-bus"></i>
      </div>
      <div id="itemControles" class="itemOptionMonitoreo">
        <i class="bx bx-time-five"></i>
      </div>
      <div id="itemRutas" class="itemOptionMonitoreo">
        <i class="bx bx-git-repo-forked"></i>
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
.cardRuta {
  width: 100%;
  background-color: #172b4d;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.1rem;
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
  height: 2.5rem;
  width: 15rem;
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
  height: calc(100vh - 3.56rem);
}
.tabOptionsMonitoreo {
  height: 3.3rem;
  width: 11rem;
  margin-right: 1rem;
  margin-top: 0.5rem;
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
#resizerXY {
  height: 97%;
  width: 0.4rem;
  background-color: #32325d;
  position: absolute;
  left: 0;
}

.container_unidades_monitoreo {
  position: absolute;
  height: calc(100vh - 9em);
  min-width: 17rem !important;
  max-width: 85vw;
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
import axios from "@nuxtjs/axios";
import { th } from "date-fns/locale";
export default {
  layout: "DashboardLayout",
  components: {
    BaseCheckbox,
  },
  data() {
    return {
      token: this.$cookies.get("token"),
      oCenter: { lat: -1.249546, lng: -78.585376 },
      oZoom: 7,
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
      infoOptions: {
        pixelOffset: {
          width: 0,
          height: -35,
        },
      },
    };
  },
  methods: {
    async initRastreo() {
      try {
        var datos = await this.$axios.post(
          process.env.baseUrlPanel + "/monitoring",
          {
            token: this.token,
          }
        );

        if (datos.data.status_code == 200) {
          if (this.mListUnidades.length == 0) {
            for (var i = 0; i < datos.data.data.length; i++) {
              this.mListUnidades[i] = datos.data.data[i];
              this.mListUnidades[i].icono = this.getIcono(
                this.mListUnidades[i]
              );
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
            var mListUnidadesAux = datos.data.data;
            this.updatemListaUnidades(mListUnidadesAux);
          }
          //this.girarMarcador()
        }
      } catch (error) {
        console.log(error);
      }
    },
    async initRutas() {
      try {
        var datos = await this.$axios.post(
          process.env.baseUrlPanel + "/readRutasMonitoreo",
          {
            token: this.token,
          }
        );
        console.log(datos.data)
        if (datos.data.status_code == 200) 
        {
          for(var i=0;i<datos.data.datos.length;i++)
          {
            this.mListRutas[i] = datos.data.datos[i]
          }
          
        }
      } catch (error) {
        console.log(error);
      }
    },
    getIcono(unidad) {
      var date_ulti = new Date(unidad.fechaUltiMoni);
      var fecha_ulti_moni_milisegundos = date_ulti.getTime();
      var date_now = new Date();
      var fecha_now_milisegundos = date_now.getTime();
      var diferencia_time =
        fecha_now_milisegundos - fecha_ulti_moni_milisegundos;
      var convert_diferencia_from_minutes = Math.floor(
        (diferencia_time / 1000 / 60) << 0
      );

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

      if (
        convert_diferencia_from_minutes >= -1000 &&
        convert_diferencia_from_minutes <= 5
      ) {
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
              ? "img/monitoreo/online_sin_ruta_stop.png#" + unidad.CodiVehiMoni
              : "img/monitoreo/online_sin_ruta.png#" + unidad.CodiVehiMoni;
          imagenLista = "img/monitoreo/online_sin_ruta_lista.png";

          detalle = "EN LINEA SIN DESPACHO";

          return { imagen, color, imagenLista, detalle };
        }
      } else if (
        convert_diferencia_from_minutes > 5 &&
        convert_diferencia_from_minutes < 15
      ) {
        color = "#565656";
        imagen =
          "img/monitoreo/sin_gps_now.png#" +
          unidad.CodiVehiMoni; /**recientemente dejo de transmitir**/
        imagenLista = "img/monitoreo/sin_gps_now_lista.png";

        detalle = "SIN TRANSMISION GPS RECIENTE";
      } else {
        color = "#9B9999";
        imagen =
          "img/monitoreo/sin_gps_full.png#" +
          unidad.CodiVehiMoni; /** no  atransmitiendo en mucho tiempo**/
        imagenLista = "img/monitoreo/sin_gps_full_lista.png";
        detalle = "SIN TRANSMISION GPS";
      }

      return { imagen, color, imagenLista, detalle };
    },
    async getInfoWindowContent(unidad) {
      var dir = await this.$axios.get(
        "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
          parseFloat(unidad.UltiLatiMoni) +
          "," +
          parseFloat(unidad.UltiLongMoni) +
          "&key=AIzaSyDOAdi7ZLdoctlCRA3_gYTeeIAjEHsTTY4"
      );
      var result = dir.data.results;
      return `<div style="width:250px;padding:0.5rem">
              <strong class="strongLetrasInfoWindows">RUTA : </strong> ${
                unidad.DescRuta == null || unidad.DescRuta == ""
                  ? "SIN RUTA"
                  : unidad.DescRuta.substring(0, 25)
              }<br>
              <strong class="strongLetrasInfoWindows">FECHA MONI : </strong> ${
                unidad.UltiFechMoni
              }<br>
              <strong class="strongLetrasInfoWindows">VELOCIDAD : </strong> ${
                unidad.UltiVeloMoni
              } <strong>KM/H</strong><br>
              <strong class="strongLetrasInfoWindows">DIR : </strong> ${
                result.length > 0 ? result[0].formatted_address : "SIN NOMBRES"
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
              mListUnidadesAux(j, 0);
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
    updateInformationMarker(position, oUnidadAux) {
      console.log("UPDATE INFO MARKER");
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
  },
  mounted() {
    this.initRutas()
    this.initRastreo();
    setInterval(() => {
      this.initRastreo();
    }, 10000);

    /*setInterval(() => {
      this.girarMarcador();
    }, 5000);*/

    /*let i = 0;
    setInterval(() => {
      $('img[src*="img/monitoreo/online.png#14"]')
        .parent()
        .css("transform", "rotate(" + i + "deg)");
      i += 15;
    }, 5000);*/
  },
};
</script>

