<template>
  <div class="content">
    <base-header>
      <div class="align-items-center py-3">

        <card class="no-border-card col" style="margin-bottom: 0.5rem"
          body-classes="px-0 pb-1 card-bodyTopOpcionesRPagosVehiculoPRoduccion cardSelectRubrosEstadosPagosVehiculoProduccionContainer"
          footer-classes="pb-2">
          <div class="cardTextoRPagosVehiculoProduccion">
            <el-autocomplete class="inline-input" v-model="itemUnidadPanelProduccion"
              :fetch-suggestions="querySearchUnidadProduccionRPagoVehiculo" style="margin-right: 0.5rem"
              placeholder="Unidad" prefix-icon="ni ni-bus-front-12" :trigger-on-focus="false"></el-autocomplete>



            <el-select v-model="mSelectLineasValueTablero" style="margin-right: 0.5rem" multiple collapse-tags
              placeholder="Rutas">
              <el-option v-for="item in mListLineasTableroProduccion" :key="item.LetrRuta" :label="item.DescRuta"
                :value="item.idRuta">
              </el-option>
            </el-select>


            <base-input addon-left-icon="ni ni-calendar-grid-58">
              <flat-picker slot-scope="{ focus, blur }" @on-open="focus" @on-close="blur" :config="{ allowInput: true }"
                class="form-controlPersonal datepicker" v-model="fechaInicialTableroProduccion">
              </flat-picker>
            </base-input>
          </div>

          <div class="cardSelectRubrosEstadosPagosVehiculoProduccionContainer">
            <base-button icon type="primary" @click="readAllRPagosVehiculoProduccion()">
              <span class="btn-inner--icon"><i class="el-icon-search"></i></span>
              <span class="btn-inner--text">Buscar</span>
            </base-button>
            <download-excel class="btn btn-outline-success" outline :header="headerExcelRPagosVehiculoProduccion"
              :data="tableDataRPagosVEhiculoProduccion" :fields="json_fields_excelRPagosVehiculoProduccion"
              :worksheet="WorksheetExcelRPagosVehiculoProduccion" :name="FileNameExcelRPagosVehiculoProduccion">
              <span class="btn-inner--icon"><i class="ni ni-collection"></i></span>
              <span class="btn-inner--text"> Exportar Excel</span>
            </download-excel>
            <!--<base-button outline type="success">
              <span class="btn-inner--icon"
                ><i class="ni ni-collection"></i
              ></span>
              <span class="btn-inner--text"> Exportar Excel</span>
            </base-button>-->
          </div>
        </card>

        <card class="no-border-card col" style="margin-bottom: 0.5rem"
          body-classes="px-0 pb-1 card-bodyTopOpcionesRPagosVehiculoPRoduccion cardSelectRubrosEstadosPagosVehiculoProduccionContainer"
          footer-classes="pb-2">
          <div class="cardSelectRubrosEstadosRPagosVehiculoProduccion">
            <el-select v-model="mSelectRubroValueTablero" multiple collapse-tags placeholder="Rubros">
              <el-option v-for="item in mListRubrosTableroProduccion" :key="item.id" :label="item.descripcion"
                :value="item.id">
              </el-option>
            </el-select>
          </div>

          <div class="cardTextoRPagosVehiculoProduccion">
            <strong style="color: green; margin-right: 0.5rem">Recaudado : {{ mPagadoRPagosVehiculo }} $</strong>
            <strong style="color: blue; margin-right: 0.5rem">Pendiente : {{ mPendienteRPagosVehiculo }} $</strong>
            <strong style="color: drak">Total : {{ mTotalRPagosVehiculo }} $</strong>
          </div>
        </card>

        <card class="no-border-card" style="margin-bottom: 0rem"
          body-classes="card-bodyRPagosVehiculoProduccion px-0 pb-1" footer-classes="pb-2">
          <div>
            <el-table v-loading="loadingRTableroProduccion" element-loading-text="Cargando Datos..."
              element-loading-spinner="el-icon-loading" :data="tableDataPanelControlProduccion" row-key="id"
              class="tablePanelControlProduccion" header-row-class-name="thead-dark"
              :height="tableDataPanelControlProduccion.length > 0 ? 900 : 150" style="width: 100%"
              :row-class-name="tableRowClassNameRPagosVehiculoProduccion">
              <el-table-column prop="Unidad" label="Unidad" minWidth="110">
              </el-table-column>
              <el-table-column prop="idSali_m" label="Salida" minWidth="130" sortable="true">
              </el-table-column>
              <el-table-column prop="DescRuta" label="Ruta - Linea" minWidth="200">
              </el-table-column>
              <el-table-column prop="DeudaTotal" label="Total($)" minWidth="120">
              </el-table-column>
              <el-table-column prop="HoraSalida" label="F. Salida" minWidth="180">
              </el-table-column>
              <el-table-column prop="AdelantoTiempo" label="Min. Adelantos" minWidth="190">
              </el-table-column>
              <el-table-column prop="AtrasoTiempo" label="Min. Atrasos" minWidth="150">
              </el-table-column>
              <el-table-column prop="SumatoriaAdelanto" label="Adelantos ($)" minWidth="190">
              </el-table-column>
              <el-table-column prop="SumatoriaAtrasos" label="Atrasos ($)" minWidth="150">
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

      </div>
    </base-header>
  </div>
</template>
<script>

import flatPicker from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";

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
    flatPicker,
    BasePagination,
    RouteBreadCrumb,
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
      itemUnidadPanelProduccion: []
    };
  },
  methods: {


    querySearchUnidadProduccionRPagoVehiculo(queryString, cb) {
      var results = queryString
        ? this.mListaUnidadesPanelProduccion.filter(
          this.createFilterUnidadProduccionRPagoVehiculo(queryString)
        )
        : this.mListaUnidadesPanelProduccion;
      // call callback function to return suggestions
      cb(results);
    },
    createFilterUnidadProduccionRPagoVehiculo(queryString) {
      return (unidad) => {
        return (
          unidad.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
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
      var fecha = new Date();
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
      this.loadingRTableroProduccion = true
      var datos = await this.$axios.post(process.env.baseUrl + "/ProduccionPanelControl", {
        token: this.token,
        fechaI: this.fechaInicialTableroProduccion,
        fechaF: 10
      })

      console.log(datos.data)

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
          this.mListaUnidadesPanelProduccion.push(...datos.data.data)
        }
      } catch (error) {
        console.log(error)
      }
    }
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

.el-table .warning-row-panelControlProduccion {
  background: rgba(252, 143, 143, 0.692) !important;
}

.el-table .success-row-panelControlProduccion {
  background: #8fed8fbb !important;
}

.no-border-card .card-footer {
  border-top: 0;
}

.card-bodyRPagosVehiculoProduccion {
  padding: 0rem !important;
  height: calc(100vh - 13rem);
  overflow: auto;
}

.card-bodyTopOpcionesRPagosVehiculoPRoduccion {
  padding-top: 0.25rem !important;
}
</style>
