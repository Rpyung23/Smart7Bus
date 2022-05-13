<template>
  <div>
    <GmapMap
      :center="oCenter"
      :zoom="oZoom"
      map-type-id="roadmap"
      style="width: 100%; height: 100vh"
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
      <GmapMarker
        v-for="(unidad) in mListUnidades"
        :key="unidad.CodiVehiMoni"
        :position="{lat:parseFloat(unidad.UltiLatiMoni),lng:parseFloat(unidad.UltiLongMoni)}"
        :clickable="false"
        :draggable="false"
        icon="./img/monitoreo/online.png"
        :options="{
            label:{
            text:''+unidad.CodiVehiMoni,
            className:'label_marker',
            color:'#ffffff'
          }
        }"
      />
    </GmapMap>

    <!--<div class="container_unidades_monitoreo">
      <div id="resizerXY">
      </div>
    </div>-->
  </div>
</template>
<style>
#resizerXY {
  height: 50%;
  width: 0.4rem;
  background-color: #32325d;
}

.container_unidades_monitoreo {
  position: absolute;
  height: 100%;
  width: 20rem;
  right: 0px;
  top: 0px;
  background-color: white;
  display: flex;
  align-items: center;
  border-top-left-radius: 0.5rem;
  border-bottom-left-radius: 0.5rem;
}
</style>
<script>
import Tabs from "@/components/argon-core/Tabs/Tabs";
import TabPane from "@/components/argon-core/Tabs/Tab";
import axios from "@nuxtjs/axios";
export default {
  layout: "DashboardLayout",
  components: {
    Tabs,
    TabPane,
  },
  data() {
    return {
      token:
        "ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmpiMlJsWDJOdlpHbGpiR2xsZFhOMVlTSTZJblZoYldKaGRHVnVZU0lzSW1OdlpHVWlPaUpCUkUxSlRqRXlNelFpTENKamIyUnBaMjhpT2lKMmFXZHBkSEpoWTJzaUxDSmpiMlJwWjI5ZlpXMXdjbVZ6WVNJNkluVmhiV0poZEdWdVlTSXNJbVY0ZEhKaElqb2lNam8xT1NCUVRTSXNJbWxoZENJNk1UWTFNalEzTVRrM01Td2laWGh3SWpveE5qVXlOVFU0TXpjeGZRLlA4cUNTV3ZtcXh6NHk5TDlTR0UzNTNRZFk1UE9RWnZBWFBLbFJVbW00dzQ=",
      oCenter: { lat: -1.249546, lng: -78.585376 },
      oZoom: 7,
      mListUnidades:[]
    };
  },
  methods: {
    async initRastreo() {
      var datos = await this.$axios.post(
        process.env.baseUrlPanel + "/monitoring",
        {
          token: this.token,
        }
      );
      console.log(datos.data);
      this.mListUnidades = []
      this.mListUnidades.push(...datos.data.data)

    },
  },
  mounted() {
    this.initRastreo();
    setInterval(() => {
      this.initRastreo();
    },10000);
  },
};
</script>

