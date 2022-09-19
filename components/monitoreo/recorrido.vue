<template>
  <div class="containerModalRecorridoPanelDespacho">
    <div class="cardControlesMarc">
      <el-table
        height="calc(80vh)"
        style="width: 100%"
        :data="mListControlesMarcSalidaRecorrido"
        @current-change="handleCurrentChangeControlMarc"
      >
        <el-table-column prop="CodiCtrlSali_d" label="CONTROL" width="145">
          <template slot-scope="scope">
            <span :style="scope.row.isCtrlRefeSali_d == 1 ? 'color:red;' : ''">{{  scope.row.isCtrlRefeSali_d == 0 ? scope.row.DescCtrl : scope.row.DescCtrl+' (REF)' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="HoraProgSali_d" label="H. PROG" width="70">
          <template slot-scope="scope">
            <span :style="scope.row.isCtrlRefeSali_d == 1 ? 'color:red;' : ''">{{scope.row.HoraProgSali_d}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="HoraMarcSali_d" label="H. MARC" width="70">
          <template slot-scope="scope">
            <span :style="scope.row.isCtrlRefeSali_d == 1 ? 'color:red;' : ''">{{scope.row.HoraMarcSali_d}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <GmapMap
      map-type-id="roadmap"
      class="mapa"
      :center="oCenter"
      :zoom="oZoom"
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
        v-for="marker in mListPosicionesHistorialSalidasPanelBusqueda"
        :key="marker.idHistEve"
        :position="{
          lat: parseFloat(marker.LatiHistEven),
          lng: parseFloat(marker.LongHistEven),
        }"
        :icon="marker.icono"
        :clickable="false"
        :draggable="false"
        :optimized="true"
      />

      <GmapMarker
        v-for="marker in mListPosicionesHistorialMarcSalidasPanelBusqueda"
        :key="marker.idHistEve"
        :position="{
          lat: parseFloat(marker.LatiHistEven),
          lng: parseFloat(marker.LongHistEven),
        }"
        icon="static/img/control/control.png"
        :clickable="false"
        :draggable="false"
        :optimized="true"
        :options="{
          label: {
            text:
              'RUTA : ' +
              marker.DescRutaSali_m +
              '\nPROG : ' +
              marker.HoraProgSali_d +
              ' MARC : ' +
              marker.HoraMarcSali_d,
            color: '#055eb1',
            className: 'paddingLabelControlMarc',
          },
        }"
      />
      <GmapPolygon
        v-for="control in mListControlesSalidaPanelBusquedaDespacho"
        :key="control.CodiCtrl"
        :options="{
          strokeColor: 'rgb(3, 3, 3)',
          fillColor: 'rgba(3, 3, 3, 0.178)',
          strokeOpacity: 1.0,
          strokeWeight: 2,
        }"
        :strokeOpacity="0.5"
        :strokeWeight="1"
        :paths="control.calculator.coordinates"
      />

      <GmapMarker
        v-for="(control, index) in mListControlesSalidaPanelBusquedaDespacho"
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
            color: 'rgb(3, 3, 3)',
            className: 'paddingLabelControl',
          },
        }"
      />
    </GmapMap>

    <div
      class="loadingRecorridoSalidaBusquedaPanel"
      v-if="isLoadingRecorridoSalidaPanelBusqueda"
    >
      <div class="circleProgress"></div>
    </div>
  </div>
</template>

<style>

.cardControlesMarc {
  height: calc(80vh);
  width: 25rem;
}

.mapa {
  width: 100%;
  height: calc(80vh);
}

.containerModalRecorridoPanelDespacho {
  display: flex;
}
</style>

<script>
import { Table, TableColumn, Notification } from "element-ui";

export default {
  components: {
    [TableColumn.name]: TableColumn,
    [Table.name]: Table,
    [Notification.name]: Notification,
  },
  data() {
    return {
      token: this.$cookies.get("token"),
      oCenter: { lat: -1.249546, lng: -78.585376 },
      oZoom: 7,
      mListPosicionesHistorialSalidasPanelBusqueda: [],
      mListPosicionesHistorialMarcSalidasPanelBusqueda: [],
      mListControlesSalidaPanelBusquedaDespacho: [],
      mListControlesMarcSalidaRecorrido: [],
      isLoadingRecorridoSalidaPanelBusqueda: false,
    };
  },
  methods: {
    async readHistorialSalidaPanelBusqueda(item) {
      this.isLoadingRecorridoSalidaPanelBusqueda = true;
      this.mListPosicionesHistorialSalidasPanelBusqueda = [];
      this.mListPosicionesHistorialMarcSalidasPanelBusqueda = [];
      this.mListControlesMarcSalidaRecorrido = [];
      //console.log(this.filaSelectionCurrentSalidaPanelBusqueda);

      try {
        //console.log("INICIAR HISTORIAL RECORRIDO");

        await this.readControlRuta(item);
        await this.readControlesMarcRuta(item);

        var datos = await this.$axios.post(
          process.env.baseUrl + "/historialUnidadSalida",
          {
            token: this.token,
            unidad: item.CodiVehiSali_m,
            salida: item.idSali_m,
            fechaI: item.HoraSaliProgSali_mF,
          }
        );

        for (var i = 0; i < datos.data.datos.length; i++) {
          var obj = datos.data.datos[i];

          obj.icono = {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            fillColor:
              obj.HoraMarcSali_d != null && obj.HoraProgSali_d != null
                ? "#055eb1"
                : obj.EvenExceVeloHistEven == 1
                ? "yellow"
                : obj.OutRoutHistEven == 1
                ? "red"
                : "green",
            fillOpacity: 1,
            strokeWeight: 0,
            rotation: obj.RumbHistEven,
            scale: 3,
            anchor: new google.maps.Point(0, 0),
          };

          this.mListPosicionesHistorialSalidasPanelBusqueda.push(obj);

          if (
            datos.data.datos[i].HoraMarcSali_d != null &&
            datos.data.datos[i].HoraProgSali_d != null
          ) {
            this.mListPosicionesHistorialMarcSalidasPanelBusqueda.push(
              datos.data.datos[i]
            );
          }

          if (i == 0) {
            this.oCenter.lat = parseFloat(
              this.mListPosicionesHistorialSalidasPanelBusqueda[0].LatiHistEven
            );
            this.oCenter.lng = parseFloat(
              this.mListPosicionesHistorialSalidasPanelBusqueda[0].LongHistEven
            );
            this.oZoom = 17;
          }
        }
      } catch (error) {
        console.log(error);
        Notification.error({
          title: "Error TRYCTACH",
          msm: error.toString(),
        });
      }
      this.isLoadingRecorridoSalidaPanelBusqueda = false;
    },
    async readControlRuta(item) {
      //console.log(item)
      this.mListControlesSalidaPanelBusquedaDespacho = [];
      var body = {
        token: this.token,
        rutas: [item.LetraRutaSali_m],
      };
      try {
        var datos = await this.$axios.post(
          process.env.baseUrl + "/AllControlesPorRuta",
          body
        );
        this.mListControlesSalidaPanelBusquedaDespacho.push(...datos.data.data);
      } catch (error) {
        console.log(error);
      }
    },
    async readControlesMarcRuta(item) 
    {
      try {
        var datos = await this.$axios.post(
        process.env.baseUrl + "/controlesMarcadosSalida",
        {
          token: this.token,
          salida: item.idSali_m,
        }
      );

      this.mListControlesMarcSalidaRecorrido.push(...datos.data.datos);
      } catch (error) {
        console.log(error)
      }
    },
    handleCurrentChangeControlMarc(item) {
      this.oZoom = 17;
      this.oCenter = {
        lat: parseFloat(item.Lati1Ctrl),
        lng: parseFloat(item.Long1Ctrl),
      };
    },
  },
  mounted() {},
};
</script>
