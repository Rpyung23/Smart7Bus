<template>
  <div class="content">
    <base-header>
      <div class="align-items-center py-3">

        <card class="no-border-card col" style="margin-bottom: 0.5rem"
          body-classes="px-0 pb-1 card-bodyTopOpcionesRPagosVehiculoPRoduccion cardSelectRubrosEstadosPagosVehiculoProduccionContainer"
          footer-classes="pb-2">
          <div class="cardTextoRPagosVehiculoProduccion">

            <!--<el-autocomplete class="inline-input" v-model="itemUnidadPanelProduccion"
              :fetch-suggestions="querySearchUnidadProduccionRPagoVehiculo" style="margin-right: 0.5rem"
              placeholder="Unidad" prefix-icon="ni ni-bus-front-12" :trigger-on-focus="false"></el-autocomplete>-->

            <el-select v-model="itemUnidadPanelProduccion" multiple filterable style="margin-right: 0.5rem" remote
              placeholder="Ingrese unidad" :remote-method="remoteMethodUnidadesPanelProduccionJustificacion"
              :loading="loadingTableUnidadesPanelProduccoionLoading">
              <el-option v-for="item in optionsUnidadesPanelProduccion" :key="item.CodiVehi" :label="item.CodiVehi"
                :value="item.CodiVehi">
              </el-option>
            </el-select>



            <el-select v-model="mSelectLineasValueTablero" style="margin-right: 0.5rem" multiple collapse-tags
              placeholder="Rutas">
              <el-option v-for="item in mListLineasTableroProduccion" :key="item.LetrRuta" :label="item.DescRuta"
                :value="item.idRuta">
              </el-option>
            </el-select>


            <base-input addon-left-icon="ni ni-calendar-grid-58">
              <flat-picker slot-scope="{ focus, blur }" :max="{ fechaInicialTableroProduccion }" @on-open="focus"
                @on-close="blur" :config="{ allowInput: true }" class="form-controlPersonal datepicker"
                v-model="fechaInicialTableroProduccion">
              </flat-picker>
            </base-input>
          </div>

          <div class="cardSelectRubrosEstadosPagosVehiculoProduccionContainer">
            <base-button icon type="primary" @click="readlPanelTableroProduccion()">
              <span class="btn-inner--icon"><i class="el-icon-search"></i></span>
              <span class="btn-inner--text">Buscar</span>
            </base-button>
          </div>
        </card>

        <card class="no-border-card col" style="margin-bottom: 0.5rem"
          body-classes="px-0 pb-1 card-bodyTopOpcionesRPagosVehiculoPRoduccion cardSelectRubrosEstadosPagosVehiculoProduccionContainer"
          footer-classes="pb-2">
          <div class="cardSelectRubrosEstadosRPagosVehiculoProduccion">
            <!--<el-select v-model="mSelectRubroValueTablero" multiple collapse-tags placeholder="Rubros">
              <el-option v-for="item in mListRubrosTableroProduccion" :key="item.id" :label="item.descripcion"
                :value="item.id">
              </el-option>
            </el-select>-->
          </div>

          <div class="cardTextoRPagosVehiculoProduccion">
            <strong style="color: dark; margin-right: 0.5rem">Recaudados : {{ mPagadoRPagosVehiculo }} $</strong>
            <strong style="color: lightseagreen; margin-right: 0.5rem">Descuentos : {{ mPendienteRPagosVehiculo }}
              $</strong>
            <strong style="color: green">Total : {{ mTotalRPagosVehiculo }} $</strong>
          </div>
        </card>

        <card class="no-border-card" style="margin-bottom: 0rem"
          body-classes="card-bodyRPagosVehiculoProduccionPCTablero px-0 pb-1" footer-classes="pb-2">
          <div>
            <el-table v-loading="loadingRTableroProduccion" element-loading-text="Cargando Datos..."
              element-loading-spinner="el-icon-loading" :data="tableDataPanelControlProduccion" row-key="id"
              class="tablePanelControlProduccion" header-row-class-name="thead-dark"
              :height="tableDataPanelControlProduccion.length > 0 ? 455 : 150" style="width: 100%">



              <el-table-column label="Acciones" minWidth="120">

                <template slot-scope="scope">
                  <!--<base-button size="sm" title="Recorrido Salida" type="success"><i class="ni ni-world"></i></base-button>-->
                  <base-button size="sm" @click="showVisibleModalTableroProduccion(scope.row)" title="Justificar Unidad"
                    type="primary"><i class="ni ni-like-2"></i></base-button>
                </template>
              </el-table-column>


              <el-table-column prop="Unidad" label="Unidad" minWidth="110">
              </el-table-column>
              <!--<el-table-column prop="idSali_m" label="Salida" minWidth="130">
              </el-table-column>-->
              <el-table-column prop="DescRuta" label="Ruta - Linea" minWidth="200">
              </el-table-column>
              <el-table-column prop="DeudaTotal" label="Total($)" minWidth="120">
                <template slot-scope="scope">
                  <strong style="color:black;">{{ scope.row.DeudaTotal }}</strong>
                </template>
              </el-table-column>
              <!--<el-table-column prop="HoraSalida" label="F. Salida" minWidth="180">
              </el-table-column>-->
              <el-table-column prop="AdelantoTiempo" label="Min. Adelantos" minWidth="160">
              </el-table-column>
              <el-table-column prop="AtrasoTiempo" label="Min. Atrasos" minWidth="150">
              </el-table-column>
              <el-table-column prop="AdelantoPenalidad" label="Adelantos ($)" minWidth="150">
              </el-table-column>
              <el-table-column prop="AtrasoPenalidad" label="Atrasos ($)" minWidth="140">
              </el-table-column>
              <el-table-column prop="TarjetaDiaria" label="Tarjeta ($)" minWidth="130">
              </el-table-column>
              <el-table-column prop="VelocidadPenalidad" label="Ex. Velocidad ($)" minWidth="170">
              </el-table-column>
              <el-table-column prop="RubroPenalidad" label="Rubros ($)" minWidth="150">
              </el-table-column>

              <div slot="empty"></div>
            </el-table>
          </div>
        </card>



        <!--Classic modal-->
        <modal :show.sync="isObservacionesTableroProduccion" size="xl">
          <h6 slot="header" class="modal-title">JUSTIFICACION</h6>

          <JqxGrid ref="myGridDespachoPanel" @cellbeginedit="cellBeginEditEventTablero($event)" :height="'100%'"
            @cellendedit="cellEndEditEventTablero($event)" :columns="columnsInfo" :source="dataAdapter" :editable="true"
            :enabletooltips="true" :width="getWidth">
          </JqxGrid>


          <template slot="footer">
            <base-button type="primary">Guardar Cambios</base-button>
            <base-button type="link" class="ml-auto" @click="modals.classic = false">Cancelar</base-button>
          </template>

        </modal>



      </div>
    </base-header>
  </div>
</template>
<script>

import flatPicker from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import JqxGrid from "jqwidgets-scripts/jqwidgets-vue/vue_jqxgrid.vue";
import JqxSlider from "jqwidgets-scripts/jqwidgets-vue/vue_jqxslider.vue";
import JqxDateTimeInput from "jqwidgets-scripts/jqwidgets-vue/vue_jqxdatetimeinput.vue";

import {
  Table,
  TableColumn,
  Select,
  Option,
  Autocomplete,
  DatePicker,
  RadioButton,
  Radio,
  Notification,
  Button
} from "element-ui";

import RouteBreadCrumb from "@/components/argon-core/Breadcrumb/RouteBreadcrumb";
import { BasePagination } from "@/components/argon-core";
import clientPaginationMixin from "~/components/tables/PaginatedTables/clientPaginationMixin";
import swal from "sweetalert2";
import Tabs from "@/components/argon-core/Tabs/Tabs";
import TabPane from "@/components/argon-core/Tabs/Tab";

export default {
  mixins: [clientPaginationMixin],
  layout: "ProduccionDashboardLayout",
  components: {
    Tabs,
    TabPane,
    [Button.name]: Button,
    flatPicker,
    BasePagination,
    RouteBreadCrumb,
    JqxGrid,
    JqxSlider,
    JqxDateTimeInput,
    [Select.name]: Select,
    [Option.name]: Option,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [DatePicker.name]: DatePicker,
    [Notification.name]: Notification,
    [Autocomplete.name]: Autocomplete,
    [RadioButton.name]: RadioButton,
    [Radio.name]: Radio,
  },
  data() {
    return {
      tableDataPanelControlProduccion: [],
      selectedRows: [],
      token: this.$cookies.get("token"),
      fechaInicialTableroProduccion: "",
      mTotalRPagosVehiculo: "0.00",
      mPagadoRPagosVehiculo: "0.00",
      mPendienteRPagosVehiculo: "0.00",
      loadingRTableroProduccion: false,
      mListRubrosTableroProduccion: [],
      mSelectRubroValueTablero: [],
      mListLineasTableroProduccion: [],
      mSelectLineasValueTablero: [],
      mListaUnidadesPanelProduccion: [],
      loadingTableUnidadesPanelProduccoionLoading: false,
      optionsUnidadesPanelProduccion: [],
      itemUnidadPanelProduccion: [],
      isObservacionesTableroProduccion: false,
      dataAdapter: new jqx.dataAdapter([]),
      getWidth: "100%",
      columnsInfo: [{ text: 'Control', datafield: 'DescripcionControl', width: 200 },
      { text: 'PROG', datafield: 'Programado', width: 90 },
      { text: 'MARC', datafield: 'Marcado', width: 90 },
      { text: 'Atraso Tiempo', datafield: 'AtrasoFTiempo', width: 110 },
      { text: 'Adelanto Tiempo', datafield: 'AdelantoFTiempo', width: 120 },
      {
        text: 'Atraso Jus.', datafield: 'AtrasoJTiempo', width: 150, columntype: 'custom',
        createeditor: (row, cellvalue, editor, cellText, width, height) => {
          editor.jqxDateTimeInput({ width: "250", height: "25", formatString: "T", showTimeButton: true, showCalendarButton: false })
        },
        initeditor: (row, cellvalue, editor, celltext, pressedkey) => {
          editor.jqxDateTimeInput({ width: "250", height: "25", formatString: "T", showTimeButton: true, showCalendarButton: false })
        },
        geteditorvalue: (row, cellvalue, editor) => {
          // return the editor's value.
          return editor.val();
        }
      },
      {
        text: 'Adelanto Jus.', datafield: 'AdelantoJTiempo', width: 150, columntype: 'custom',
        createeditor: (row, cellvalue, editor, cellText, width, height) => {
          editor.jqxDateTimeInput({ width: "250", height: "25", formatString: "T", showTimeButton: true, showCalendarButton: false })
        },
        initeditor: (row, cellvalue, editor, celltext, pressedkey) => {
          editor.jqxDateTimeInput({ width: "250", height: "25", formatString: "T", showTimeButton: true, showCalendarButton: false })
        },
        geteditorvalue: (row, cellvalue, editor) => {
          // return the editor's value.
          return editor.val();
        }
      },
      { text: 'Rubros', datafield: 'RubroFalta', width: 60 },
      { text: 'Rubros Jus.', datafield: 'RubroJustificacion', width: 100 },
      { text: 'Velo', datafield: 'VelocidadFalta', width: 70 },
      { text: 'Velo Jus.', datafield: 'VelocidadJustificacion', width: 70 },
      { text: 'Tarjeta', datafield: 'TarjetaTrabajo', width: 70 },
      { text: 'Usuario Justificador', datafield: 'NombApellUsua', width: 250 },
      { text: 'Motivo', datafield: 'Motivo', width: 250 },
      { text: 'Notas', datafield: 'Notas', width: 250 }]
    };
  },
  methods: {

    cellBeginEditEventTablero: function (event) {
      let args = event.args;
      //this.$refs.beginEdit.innerHTML = 'Event Type: cellbeginedit, Column: ' + args.datafield + ', Row: ' + (1 + args.rowindex) + ', Value: ' + args.value;
    },
    cellEndEditEventTablero: function (event) {
      let args = event.args;
      //this.$refs.endEdit.innerHTML = 'Event Type: cellendedit, Column: ' + args.datafield + ', Row: ' + (1 + args.rowindex) + ', Value: ' + args.value;
    },

    remoteMethodUnidadesPanelProduccionJustificacion(query) {
      if (query !== "") {
        this.loadingTableUnidadesPanelProduccoionLoading = true;
        setTimeout(() => {
          this.loadingTableUnidadesPanelProduccoionLoading = false;
          this.optionsUnidadesPanelProduccion =
            this.mListaUnidadesPanelProduccion.filter((item) => {
              return (
                item.CodiVehi.toLowerCase().indexOf(query.toLowerCase()) > -1
              );
            });
        }, 200);
      } else {
        this.optionsUnidadesPanelProduccion = [];
      }
    },

    tableRowClassNamePanelControlProduccion({ row, rowIndex }) {
      if (row.item_id == 32) {
        return 'warning-row-panelControlProduccion';
      } else if (row.item_id == 64) {
        return 'success-row-panelControlProduccion';
      }
      return '';
    },
    initFechaActualProduccionPanelControl() {
      const today = new Date()
      const fecha = new Date(today)
      fecha.setDate(fecha.getDate() - 1)
      var mes = fecha.getMonth() + 1;
      var day = fecha.getDate();
      var format =
        fecha.getFullYear() +
        "-" +
        (mes < 10 ? "0" + mes : mes) +
        "-" +
        (day < 10 ? "0" + day : day);

      this.fechaInicialTableroProduccion = format;
    },
    selectionChange(selectedRows) {
      this.selectedRows = selectedRows;
    },
    async readlPanelTableroProduccion() {
      console.log(this.itemUnidadPanelProduccion)
      this.loadingRTableroProduccion = true
      this.tableDataPanelControlProduccion = []
      var datos = await this.$axios.post(process.env.baseUrl + "/ProduccionPanelControl", {
        token: this.token,
        fecha: this.fechaInicialTableroProduccion,
        rutas: this.mSelectLineasValueTablero.length <= 0 ? '*' : this.mSelectLineasValueTablero,
        unidades: this.itemUnidadPanelProduccion.length <= 0 ? '*' : this.itemUnidadPanelProduccion
      })

      //console.log(datos.data)

      if (datos.data.status_code == 200) {
        this.tableDataPanelControlProduccion.push(...datos.data.datos)
      }

      this.loadingRTableroProduccion = false
    },
    async readRubrosTableroProduccion() {
      this.mListRubrosTableroProduccion = []
      try {
        var datos = await this.$axios.post(process.env.baseUrl + "/rubros-activos", {
          token: this.token
        })

        if (datos.data.status_code == 200) {
          this.mListRubrosTableroProduccion.push(...datos.data.datos)
        }
      } catch (error) {
        console.log(error)
      }
    },
    async readLineasTableroProduccion() {
      this.mListLineasTableroProduccion = []
      try {
        var datos = await this.$axios.post(process.env.baseUrl + "/rutes", {
          token: this.token
        })

        if (datos.data.status_code == 200) {
          this.mListLineasTableroProduccion.push(...datos.data.data)
        }
      } catch (error) {
        console.log(error)
      }
    },
    async readUnidadesTableroProduccion() {
      this.mListaUnidadesPanelProduccion = []
      try {
        var datos = await this.$axios.post(process.env.baseUrl + "/unidades", {
          token: this.token
        })

        if (datos.data.status_code == 200) {

          for (var i = 0; i < datos.data.data.length; i++) {
            var obj = datos.data.data[i];
            obj.value = obj.CodiVehi;
            this.mListaUnidadesPanelProduccion.push(obj);
          }
        }
      } catch (error) {
        console.log(error)
      }
    },
    async showVisibleModalTableroProduccion(item) {
      this.isObservacionesTableroProduccion = this.isObservacionesTableroProduccion == true ? false : true
      await this.readDetalleTableroProduccion(item)
    },
    async readDetalleTableroProduccion(item) {

      console.log(item)

      var datos = await this.$axios.post(process.env.baseUrl + "/ProduccionDetallePanelControl", {
        token: this.token,
        codigoPanel: item.Codigo
      }
      )





      var obj = {
        localdata: datos.data.datos,
        datatype: 'array',
        datafields: [
          { name: 'DescripcionControl', type: 'string' },
          { name: 'Programado', type: 'string' },
          { name: 'Marcado', type: 'string' },
          { name: 'AtrasoFTiempo', type: 'datetime' },
          { name: 'AdelantoFTiempo', type: 'datetime' },
          { name: 'AtrasoJTiempo', type: 'datetime' },
          { name: 'AdelantoJTiempo', type: 'datetime' },
          { name: 'RubroFalta', type: 'string' },
          { name: 'RubroJustificacion', type: 'string' },
          { name: 'VelocidadFalta', type: 'string' },
          { name: 'VelocidadJustificacion', type: 'string' },
          { name: 'TarjetaTrabajo', type: 'string' },
          { name: 'NombApellUsua', type: 'string' },
          { name: 'Motivo', type: 'string' },
          { name: 'Notas', type: 'string' }

        ]
      }

      this.$refs.myGridDespachoPanel.setOptions
        ({
          source: obj,
          columns: this.columnsInfo
        });
      this.isLoadingDespachoSalidaPanelBusqueda = false
      this.$refs.myGridDespachoPanel.endupdate();
    },
  }, mounted() {
    this.readUnidadesTableroProduccion()
    this.readLineasTableroProduccion()
    this.readRubrosTableroProduccion()
    this.initFechaActualProduccionPanelControl()
    this.readlPanelTableroProduccion()
  }
};
</script>
<style>
.form-group {
  margin-bottom: 0rem;
}

.form-controlPersonal {
  display: block;
  width: 100%;
  /* height: calc(1.5em + 1.25rem + 2px); */
  padding: 0.625rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  color: #8898aa;
  background-color: #fff;
  background-clip: padding-box;
  outline: none;
  border: 1px solid #dee2e6;
  border-radius: 0.25rem;
  margin-bottom: 0rem;
  box-shadow: 0 3px 2px rgba(233, 236, 239, 0.05);
  transition: all 0.15s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.el-loading-text {
  color: black !important;
}

.el-icon-loading {
  color: black !important;
}

.cardTextoRPagosVehiculoProduccion {
  display: flex;
  align-items: center;
}

.cardSelectRubrosEstadosPagosVehiculoProduccionContainer {
  display: flex;
  justify-content: space-between;
}


.no-border-card .card-footer {
  border-top: 0;
}

.card-bodyRPagosVehiculoProduccionPCTablero {
  padding: 0rem !important;
  height: calc(100vh - 12em);
  overflow: auto;
}

.card-bodyTopOpcionesRPagosVehiculoPRoduccion {
  padding-top: 0.25rem !important;
}
</style>
