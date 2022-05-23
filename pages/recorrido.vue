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
      <GmapPolygon
        v-for="control in mListControles"
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
        v-for="(control,index) in mListControles"
        :key="control.DescCtrl+index"
        :position="{
          lat: parseFloat(control.Lati1Ctrl),
          lng: parseFloat(control.Long1Ctrl),
        }"
        :optimized="true"
        icon="static/img/control/control.png"
        :options="{
          label: {
            text: control.DescCtrl,
            color: '#F71313',
            className: 'paddingLabelControl',
          },
        }"
      />
    </GmapMap>

  </div>
</template>
<style>
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
  background-color: #32325d;
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
      mListControles: [],
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
    async initControles() {
      try {
        var datos = await this.$axios.post(
          process.env.baseUrlPanel + "/checkpoints",
          {
            token: this.token,
          }
        );
        console.log(datos.data)
        if (datos.data.status_code == 200) 
        {
          this.mListControles.push(...datos.data.data);
        }
      } catch (error) 
      {
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
  },
  mounted() {
    this.initControles();
  },
};
</script>

