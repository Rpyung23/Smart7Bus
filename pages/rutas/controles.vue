<template>
  <div>
      <GmapMap
        :center="{ lat: 10, lng: 10 }"
        :zoom="7"
        map-type-id="roadmap"
        class="mapa"
        :options="{zoomControl: false,
        scaleControl: false,
        mapTypeControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        disableDefaultUi: false}"
      >
      </GmapMap>
  </div>
</template>
<style>
::-webkit-scrollbar {
    display: none;
}
.mapa {
  width: 100%;
  height: calc(100vh - 3.56rem);
}

</style>
<script>
export default {
  layout: "EditRutasDashboardLayout",
  async mounted() {},
};
</script>

