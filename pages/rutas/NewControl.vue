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
        disableDefaultUi: false,
      }"
    >
      <GmapPolyline
        :path="[
          { lat: latitud_1, lng: longitud_1 },
          { lat: latitud_2, lng: longitud_2 },
        ]"
        :options="{
          geodesic: true,
          strokeColor: '#172b4d',
          fillColor: '#172b4d',
          strokeOpacity: 1.0,
          strokeWeight: 2,
        }"
      >
      </GmapPolyline>

      <GmapPolygon
        v-if="Geofence.length > 0"
        :options="{
          strokeColor: '#172b4d',
          fillColor: '#172b4d',
          strokeOpacity: 1.0,
          strokeWeight: 2,
        }"
        :strokeOpacity="0.5"
        :strokeWeight="1"
        :paths="Geofence"
      />
    </GmapMap>

    <card class="CardNewControl">
      <div class="block">
        <span class="demonstration">Default value</span>
        <el-slider v-model="SliderValue" max="200"></el-slider>
      </div>
    </card>
  </div>
</template>
<style>
.mapa {
  width: 100%;
  height: calc(100vh - 3.56rem);
}

.CardNewControl {
  position: absolute;
  bottom: 0;
  right: 0;
  margin-right: 1rem;
  height: 5rem;
  width: 80%;
  background-color: white;
  z-index: 9999;
}
</style>
<script>
import { Drawer, Table, TableColumn, Button, Slider } from "element-ui";
// ES6 Modules or TypeScript
import Swal from "sweetalert2";
export default {
  layout: "EditRutasDashboardLayout",
  components: {
    [Drawer.name]: Drawer,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Button.name]: Button,
    [Slider.name]: Slider,
  },
  data() {
    return {
      token: this.$cookies.get("token"),
      oCenter: { lat: -1.80457, lng: -79.48464 },
      oZoom: 18,
      SliderValue: 40,
      latitud_1: -1.80457,
      longitud_1: -79.48464,
      latitud_2: -1.80523,
      longitud_2: -79.48375,
      Geofence: [],
    };
  },
  methods: {
    createGeofence(lat1, lon1, lat2, lon2, width) 
    {

      const point1 = { lat: -1.80457, lng: -79.48464 };
const point2 = { lat: -1.80523, lng: -79.48375 };

// Convertir coordenadas de grados decimales a radianes
const toRadians = (degrees) => {
  return degrees * Math.PI / 180;
};

// Convertir coordenadas de radianes a grados decimales
const toDegrees = (radians) => {
  return radians * 180 / Math.PI;
};

// Calcula la distancia en metros entre los dos puntos
const earthRadius = 6378137; // Radio de la Tierra en metros
const dLat = toRadians(point2.lat - point1.lat);
const dLon = toRadians(point2.lng - point1.lng);
const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
  Math.cos(toRadians(point1.lat)) * Math.cos(toRadians(point2.lat)) *
  Math.sin(dLon / 2) * Math.sin(dLon / 2);
const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
const distance = earthRadius * c;

// Calcula el ancho y el largo del rectángulo en grados
const widthInDegrees = (40 / 111111) * 0.00001; // 1 grado de latitud y longitud es aproximadamente 111111 metros
const heightInDegrees = widthInDegrees * (distance / 40);

// Calcula los cuatro puntos del rectángulo
const topLeft = { lat: point1.lat + heightInDegrees / 2, lng: point1.lng - widthInDegrees / 2 };
const topRight = { lat: point1.lat + heightInDegrees / 2, lng: point1.lng + widthInDegrees / 2 };
const bottomLeft = { lat: point1.lat - heightInDegrees / 2, lng: point1.lng - widthInDegrees / 2 };
const bottomRight = { lat: point1.lat - heightInDegrees / 2, lng: point1.lng + widthInDegrees / 2 };

      // Imprime los puntos en la consola
      this.Geofence = [topLeft, topRight, bottomLeft, bottomRight];
      
    },
  },
  mounted() {
    this.createGeofence(
      this.latitud_1,
      this.longitud_1,
      this.latitud_2,
      this.longitud_2,
      this.SliderValue
    );
  },
};
</script>
