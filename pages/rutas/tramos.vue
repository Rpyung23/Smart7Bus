<template>
  <div class="content">
    <base-header class="pb-6">
      <div class="row align-items-center py-4">
        <div class="col">
          <br />
          <card class="no-border-card" body-classes="px-0 pb-1" footer-classes="pb-2">
            <div>
              <el-table :data="tableDataTramosExVelocidad" row-key="id" header-row-class-name="thead-dark">
                <el-table-column v-for="column in tableColumnsTramosExVelocidad" :key="column.label" v-bind="column">
                </el-table-column>

                <el-table-column label="Estado" min-width="150px" prop="estado" sortable>
                  <template v-slot="{ row }">
                    <badge class="badge-dot mr-4" type="">
                      <i :class="`bg-${row.estado == 0 ? 'danger' : 'success'}`"></i>
                      <span class="status">{{
                          row.estado == 0 ? "Inactivo" : "Activo"
                      }}</span>
                    </badge>
                  </template>
                </el-table-column>

                <el-table-column min-width="180px" align="right" label="Actions">
                  <div slot-scope="{ $index, row }" class="d-flex">
                    <base-button @click.native="handleViewMapaExVelocidad($index, row)" class="edit" type="default"
                      size="sm" icon>
                      <i class="text-white ni ni-world"></i>
                    </base-button>
                    <base-button @click.native="handleDelete($index, row)" class="remove btn-link" type="danger"
                      size="sm" icon>
                      <i class="text-white ni ni-fat-remove"></i>
                    </base-button>
                  </div>
                </el-table-column>
              </el-table>
            </div>
            <div slot="footer" class="
                col-12
                d-flex
                justify-content-center justify-content-sm-between
                flex-wrap
              "></div>
          </card>
        </div>
      </div>
    </base-header>

    <!--Form modal-->
    <modal :show.sync="modalTramosExVelocidad" size="xl" body-classes="p-0">
      <card type="secondary" header-classes="bg-transparent pb-5" class="border-0 mb-0">
        <GmapMap map-type-id="roadmap" class="mapaTramas" :center="oCenter" :zoom="oZoom" :options="{
          zoomControl: false,
          scaleControl: false,
          mapTypeControl: false,
          streetViewControl: false,
          rotateControl: false,
          fullscreenControl: false,
          disableDefaultUi: true,
        }">
          <GmapPolygon :options="{
            strokeColor: '#F71313',
            fillColor: '#F7131380',
            strokeOpacity: 1.0,
            strokeWeight: 2,
          }" :editable="true" :strokeOpacity="0.5" :strokeWeight="1" :paths="mTrazadoTramaExVelocidad" />

          <GmapPolygon v-for="control in mListControlesMonitoreoAux" :key="control.CodiCtrl" :options="{
            strokeColor: '#172b4d',
            fillColor: '#172b4d80',
            strokeOpacity: 1.0,
            strokeWeight: 2,
          }" :strokeOpacity="0.5" :strokeWeight="1" :paths="control.calculator.coordinates" />

          <GmapMarker v-for="(control, index) in mListControlesMonitoreoAux" :key="control.DescCtrl + index" :position="{
            lat: parseFloat(control.Lati1Ctrl),
            lng: parseFloat(control.Long1Ctrl),
          }" :optimized="true" icon="static/img/control/control.png" :options="{
  label: {
    text: control.DescCtrl,
    color: '#172b4d',
    className: 'paddingLabelControl',
  },
}" />




        </GmapMap>

        <!--<div class="botonesMapaTramas">
          <el-row>
            <el-button type="info" icon="el-icon-plus" circle></el-button>
            <el-button type="primary" icon="el-icon-edit" circle></el-button>
            <el-button type="success" icon="el-icon-check" circle></el-button>
            <el-button type="danger" icon="el-icon-delete" circle></el-button>
          </el-row>
        </div>-->
      </card>
    </modal>
  </div>
</template>
<style>
::-webkit-scrollbar {
  display: none;
}

.mapaTramas {
  width: 100%;
  height: calc(100vh - 7rem);
}

.botonesMapaTramas {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
}
</style>
<script>
import { Table, TableColumn, Row, Button } from "element-ui";
export default {
  layout: "EditRutasDashboardLayout",
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Row.name]: Row,
    [Button.name]: Button,
  },
  data() {
    return {
      oCenter: { lat: -1.249546, lng: -78.585376 },
      oZoom: 7,
      modalTramosExVelocidad: false,
      tableColumnsTramosExVelocidad: [
        {
          prop: "id_trama_m",
          label: "Id",
          minWidth: 80,
        },
        {
          prop: "detalle_trama",
          label: "Detalle Trama",
          minWidth: 200,
        },
        {
          prop: "ex_velocidad",
          label: "Velo. Max",
          minWidth: 130,
        },
        {
          prop: "descripcionProduccionItem",
          label: "Item",
          minWidth: 140,
        },
        {
          prop: "detalle_valores",
          label: "Detalle Valores",
          minWidth: 180,
        },
        {
          prop: "fechaCreacion",
          label: "Fecha Creación",
          minWidth: 180,
        },
      ],
      tableDataTramosExVelocidad: [],
      selectedRows: [],
      token: this.$cookies.get("token"),
      mTrazadoTramaExVelocidad: null,
    };
  },
  methods: {
    async handleViewMapaExVelocidad(index, row) {
      this.modalTramosExVelocidad = true;
      this.readTrazadoTramaExVelocidad(row.id_trama_m);
    },
    async readTramosExVelocidad() {
      try {
        var datos = await this.$axios.post(
          process.env.baseUrl + "/readTramosExVelocidad",
          {
            token: this.token,
          }
        );
        if (datos.data.status_code != 400) {
          this.tableDataTramosExVelocidad.push(...datos.data.datos);
        } else {
          console.log(datos.data.msm);
        }
      } catch (error) {
        console.log(error);
      }
    },
    async readTrazadoTramaExVelocidad(tramo) {
      var body = {
        token: this.token,
        tramo: tramo,
      }

      var datos = await this.$axios.post(
        process.env.baseUrl + "/readTrazadoTramosExVelocidad",
        body
      );
      console.log(datos.data)
      var mList = []

      for (var i = 0; i < datos.data.datos.length; i++) {
        var obj = { lat: datos.data.datos[i].latitud, lng: datos.data.datos[i].longitud }
        if (i == 0) {
          this.oCenter = obj
          this.oZoom = 16
        }
        mList.push(obj)
      }
      console.log(mList)
      this.mTrazadoTramaExVelocidad = mList
    },
  },
  mounted() {
    this.readTramosExVelocidad();
  },
};
</script>

