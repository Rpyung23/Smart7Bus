<template>
  <div id="rezizeArea">
    <GmapMap :center="oCenter" :zoom="oZoom" map-type-id="roadmap" class="mapa" :options="{
      zoomControl: false,
      scaleControl: false,
      mapTypeControl: false,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false,
      disableDefaultUi: false
    }">



      <GmapPolygon v-for="control in mListRutasEditControles" :key="control.CodiCtrl" :editable="control.editable"
        :options="{
          strokeColor: control.EstaCtrl == 1 ? '#172b4d' : '#F71313',
          fillColor: control.EstaCtrl == 1 ? '#172b4d' : '#F7131380',
          strokeOpacity: 1.0,
          strokeWeight: 2,
        }" :strokeOpacity="0.5" :strokeWeight="1" :paths="control.calculator.coordinates" />

      <GmapPolyline v-for="control in mListRutasEditControles" :key="'PL' + control.CodiCtrl"
        :path="[{ lat: parseFloat(control.Lati1Ctrl), lng: parseFloat(control.Long1Ctrl) }, { lat: parseFloat(control.Lati2Ctrl), lng: parseFloat(control.Long2Ctrl) }]"
        :options="{
          geodesic: true,
          strokeColor: control.EstaCtrl == 1 ? '#172b4d' : '#FF0000',
          fillColor: control.EstaCtrl == 1 ? '#172b4d' : '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 2
        }">
      </GmapPolyline>

      <GmapMarker v-for="(control, index) in mListRutasEditControles" :key="control.DescCtrl + index" :position="{
        lat: parseFloat(control.Lati1Ctrl),
        lng: parseFloat(control.Long1Ctrl),
      }" :optimized="true" icon="static/img/control/control.png" :options="{
  label: {
    text: control.DescCtrl,
    color: control.EstaCtrl == 1 ? '#172b4d' : '#F71313',
    className: 'paddingLabelControl',
  },
}" />

    </GmapMap>


    <el-drawer title="Controles" :visible.sync="isVisibleControlesEdit" direction="rtl">
      <div class="containerDrawer">
        <base-button block type="primary">Crear nuevo control</base-button><br>
        <el-table :data="mListRutasEditControles" style="width: 100%">
          <el-table-column prop="DescCtrl" label="Nombre" width="235">
          </el-table-column>
          <el-table-column label="Actions">
            <template slot-scope="scope">
              <base-button v-if="scope.row.EstaCtrl == 1 ? true : false" @click="centrarControlEdit(scope.row)"
                class="btnActionsDrawerControl" icon size="sm" type="default">
                <span class="btn-inner--icon"><i class="ni ni-ruler-pencil"></i></span>
              </base-button>
              <base-button v-if="scope.row.EstaCtrl == 0 ? true : false" class="btnActionsDrawerControl" icon size="sm"
                type="success">
                <span class="btn-inner--icon"><i class="ni ni-check-bold"></i></span>
              </base-button>
              <base-button class="btnActionsDrawerControl" icon size="sm" type="primary"
                @click="centrarControlEdit(scope.row)">
                <span class="btn-inner--icon"><i class="ni ni-world"></i></span>
              </base-button>
              <base-button v-if="scope.row.EstaCtrl == 0 ? false : true" @click="deleteControlEdit(scope.row)" class="btnActionsDrawerControl" icon size="sm"
                type="danger">
                <span class="btn-inner--icon"><i class="ni ni-scissors"></i></span>
              </base-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-drawer>

    <div class="topButtonControl">
      <base-button icon type="default" @click="showControlesDrawer()">
        <span class="btn-inner--icon"><i class="ni ni-ungroup"></i></span>
        <span class="btn-inner--text">CONTROLES</span>
      </base-button>
    </div>


  </div>
</template>
<style>
.btnActionsDrawerControl:not(:last-child) {
  margin-right: 0rem !important;
}



.containerDrawer {
  margin-right: 1rem;
  margin-left: 1rem;
}

.topButtonControl {
  position: absolute;
  top: 0;
  right: 0;
  margin-right: 1rem;
  margin-top: 1rem;
}

#rezizeArea {
  width: 100%;
  overflow: auto;
  position: relative;
}


::-webkit-scrollbar {
  display: none;
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

.mapa {
  width: 100%;
  height: calc(100vh - 3.56rem);
}
</style>
<script>
import { Drawer, Table, TableColumn, Button } from "element-ui";
// ES6 Modules or TypeScript
import Swal from 'sweetalert2'
export default {
  layout: "EditRutasDashboardLayout",
  components: {
    [Drawer.name]: Drawer,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Button.name]: Button
  },
  data() {
    return {
      token: this.$cookies.get("token"),
      mListRutasEditControles: [],
      oCenter: { lat: -1.249546, lng: -78.585376 },
      oZoom: 7,
      isVisibleControlesEdit: false
    }
  },
  methods: {
    showControlesDrawer() {
      this.isVisibleControlesEdit = this.isVisibleControlesEdit ? false : true
    },
    async initControles() {
      try {
        var datos = await this.$axios.post(
          process.env.baseUrlPanel + "/AllControles",
          {
            token: this.token,
          }
        );
        if (datos.data.status_code == 200) {
          this.mListRutasEditControles.push(...datos.data.data)
          this.oCenter = { lat: parseFloat(this.mListRutasEditControles[0].Lati1Ctrl), lng: parseFloat(this.mListRutasEditControles[0].Long1Ctrl) }
          this.oZoom = 16
        }
        console.log(this.mListRutasEditControles)
      } catch (error) {
        console.log(error);
      }
    },
    centrarControlEdit(control) {
      this.oCenter = { lat: parseFloat(control.Lati1Ctrl), lng: parseFloat(control.Long1Ctrl) }
      this.oZoom = 19
    },
    deleteControlEdit(control) {
      this.oCenter = { lat: parseFloat(control.Lati1Ctrl), lng: parseFloat(control.Long1Ctrl) }
      this.oZoom = 19
      Swal.fire({
        title: 'Error!',
        text: 'Do you want to continue',
        icon: 'error',
        confirmButtonText: 'Cool'
      })
    },
  },
  mounted() {
    this.initControles()
  },
};
</script>

