<template>
  <div class="content">
    <base-header>
      <div class="align-items-center py-3">
        <card
          class="no-border-card col"
          style="margin-bottom: 0.5rem"
          body-classes="px-0 pb-1 card-bodyTopOpcionesRPagosVehiculoPRoduccion cardSelectRubrosEstadosPagosVehiculoProduccionContainer"
          footer-classes="pb-2"
        >
          <div class="cardTextoRPagosVehiculoProduccion">
            <el-autocomplete
              class="inline-input"
              v-model="itemUnidadProduccionRPagoVehiculo"
              :fetch-suggestions="querySearchUnidadProduccionRPagoVehiculo"
              style="margin-right: 0.5rem"
              placeholder="Unidad"
              prefix-icon="ni ni-bus-front-12"
              :trigger-on-focus="false"
              @select="handleSelectUnidadProduccionRPagoVehiculo"
            ></el-autocomplete>

            <base-input addon-left-icon="ni ni-calendar-grid-58" style="margin-right: 0.5rem">
              <flat-picker
                slot-scope="{ focus, blur }"
                @on-open="focus"
                @on-close="blur"
                :config="{ allowInput: true }"
                class="form-controlPersonal datepicker"
                v-model="fechaInicialRPagosVehiculoProduccion"
              >
              </flat-picker>
            </base-input>

            <base-input addon-left-icon="ni ni-calendar-grid-58">
              <flat-picker
                slot-scope="{ focus, blur }"
                @on-open="focus"
                @on-close="blur"
                :config="{ allowInput: true }"
                class="form-controlPersonal datepicker"
                v-model="fechaFinalRPagosVehiculoProduccion"
              >
              </flat-picker>
            </base-input>

          </div>

          <div class="cardSelectRubrosEstadosPagosVehiculoProduccionContainer">
            <base-button
              icon
              type="primary"
              @click="readAllRPagosVehiculoProduccion()"
            >
              <span class="btn-inner--icon"><i class="el-icon-search"></i></span>
              <span class="btn-inner--text">Buscar</span>
            </base-button>
            <base-button outline type="success">
              <span class="btn-inner--icon"
                ><i class="ni ni-collection"></i
              ></span>
              <span class="btn-inner--text"> Exportar Excel</span>
            </base-button>
          </div>
        </card>

        <card
          class="no-border-card col"
          style="margin-bottom: 0.5rem"
          body-classes="px-0 pb-1 card-bodyTopOpcionesRPagosVehiculoPRoduccion cardSelectRubrosEstadosPagosVehiculoProduccionContainer"
          footer-classes="pb-2"
        >
          <div class="cardSelectRubrosEstadosRPagosVehiculoProduccion">
            <el-select
              v-model="mSelectRubroValuePagosVehiculo"
              multiple
              collapse-tags
              placeholder="Rubros"
            >
              <el-option
                v-for="item in mListRubrosRPagosVehiculo"
                :key="item.id"
                :label="item.descripcion"
                :value="item.id"
              >
              </el-option>
            </el-select>

            <el-radio v-model="radioEstadoRPagosVehiculo" label="*"
              >TODOS</el-radio
            >
            <el-radio v-model="radioEstadoRPagosVehiculo" label="2"
              >PAGADOS</el-radio
            >
            <el-radio v-model="radioEstadoRPagosVehiculo" label="1"
              >PENDIENTES</el-radio
            >
          </div>

          <div class="cardTextoRPagosVehiculoProduccion">
            <strong style="color: green; margin-right: 0.5rem"
              >Recaudado : 0.00 $</strong
            >
            <strong style="color: blue; margin-right: 0.5rem"
              >Pendiente : 0.00 $</strong
            >
            <strong style="color: drak">Total : 0.00 $</strong>
          </div>
        </card>

        <card
          class="no-border-card"
          style="margin-bottom: 0rem"
          body-classes="card-bodyRPagosVehiculoProduccion px-0 pb-1"
          footer-classes="pb-2"
        >
          <div>
            <el-table
              v-loading="loadingRPagosVehiculo"
              element-loading-text="Cargando Datos..."
              element-loading-spinner="el-icon-loading"
              :data="tableDataRPagosVEhiculoProduccion"
              row-key="id"
              class="tablePanelControlProduccion"
              header-row-class-name="thead-dark"
              :row-class-name="tableRowClassNameRPagosVehiculoProduccion"
            >
              <el-table-column
                prop="vehiculo_codigo"
                label="Unidad"
                minWidth="110"
              >
              </el-table-column>

              <el-table-column
                prop="salida_id"
                label="Salida"
                minWidth="130"
                sortable="true"
              >
              </el-table-column>

              <el-table-column
                prop="DescRutaSali_m"
                label="Ruta - Linea"
                minWidth="200"
              >
              </el-table-column>
              <el-table-column
                prop="HoraSaliProgSali_m"
                label="F. Salida"
                minWidth="180"
                sortable="true"
              >
              </el-table-column>

              <el-table-column
                prop="fecha_creacion"
                label="F. Creación"
                minWidth="190"
                sortable="true"
              >
              </el-table-column>

              <el-table-column
                prop="fecha_pago"
                label="F. Pago"
                minWidth="180"
                sortable="true"
              >
              </el-table-column>

              <el-table-column
                prop="montoControles"
                label="Minutos"
                minWidth="150"
              >
              </el-table-column>
              <el-table-column
                prop="montoControlesDesc"
                label="Minutos Desc"
                minWidth="150"
              >
              </el-table-column>
              <el-table-column
                prop="descripcion_rubro"
                label="C. Rubro"
                minWidth="200"
              >
              </el-table-column>

              <el-table-column prop="montoMultas" label="Rubros" minWidth="150">
              </el-table-column>
              <el-table-column
                prop="montoMultasDesc"
                label="Rubros Desc"
                minWidth="150"
              >
              </el-table-column>

              <el-table-column prop="monto_pagado" label="Total" minWidth="120">
              </el-table-column>

              <el-table-column prop="estado" label="Estado" minWidth="130" sortable="true">
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
  Notification
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
    BasePagination,
    flatPicker,
    RouteBreadCrumb,
    [DatePicker.name]: DatePicker,
    [Select.name]: Select,
    [Option.name]: Option,
    [Table.name]: Table,
    [Notification.name]:Notification,
    [Autocomplete.name]: Autocomplete,
    [TableColumn.name]: TableColumn,
    [RadioButton.name]: RadioButton,
    [Radio.name]: Radio,
  },
  data() {
    return {
      mListaUnidadesPagosVehiculoProduccion: [],
      tableDataRPagosVEhiculoProduccion: [],
      radioEstadoRPagosVehiculo: "*",
      mListRubrosRPagosVehiculo: [],
      mSelectRubroValuePagosVehiculo: [],
      itemUnidadProduccionRPagoVehiculo: "*",
      token: this.$cookies.get("token"),
      fechaInicialRPagosVehiculoProduccion: "",
      fechaFinalRPagosVehiculoProduccion: "",
      loadingRPagosVehiculo: false,
    };
  },
  methods: {
    querySearchUnidadProduccionRPagoVehiculo(queryString, cb) {
      var results = queryString
        ? this.mListaUnidadesPagosVehiculoProduccion.filter(
            this.createFilterUnidadProduccionRPagoVehiculo(queryString)
          )
        : this.mListaUnidadesPagosVehiculoProduccion;
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
    handleSelectUnidadProduccionRPagoVehiculo(item) {
      console.log(item);
    },
    tableRowClassNameRPagosVehiculoProduccion({ row, rowIndex }) {
      if (row.fecha_pago == null) {
        row.estado = "PENDIENTE";
        return "warning-row-panelControlProduccion";
      } else {
        row.estado = "PAGADO";
        return "success-row-panelControlProduccion";
      }
    },
    initFechaActualProduccionRPAgosVehiculo() {
      var fecha = new Date();
      var mes = fecha.getMonth() + 1;
      var day = fecha.getDate();
      var format =
        fecha.getFullYear() +
        "-" +
        (mes < 10 ? "0" + mes : mes) +
        "-" +
        (day < 10 ? "0" + day : day);

      this.fechaInicialRPagosVehiculoProduccion = format;
      this.fechaFinalRPagosVehiculoProduccion = format;
    },
    async readAllUnidadesPagosVehiculoProduccion() {
      var datos = await this.$axios.post(process.env.baseUrl + "/unidades", {
        token: this.token,
      });

      console.log(datos.data);

      if (datos.data.status_code == 200) {
        for (var i = 0; i < datos.data.data.length; i++) {
          this.mListaUnidadesPagosVehiculoProduccion[i] = datos.data.data[i];
          this.mListaUnidadesPagosVehiculoProduccion[i].value =
            datos.data.data[i].CodiVehi;
        }
      }
    },
    async readAllRubrosPagosVehiculoProduccion() {
      var datos = await this.$axios.post(
        process.env.baseUrl + "/rubros-activos",
        {
          token: this.token,
        }
      );

      if (datos.data.status_code == 200) {
        this.mListRubrosRPagosVehiculo.push(...datos.data.datos);
      }
    },
    async readAllRPagosVehiculoProduccion() {
    
    if(this.loadingRPagosVehiculo)
    {
Notification.warning({
                title:"Reporte Pagos Vehiculo",
                message:"Por favor espere un momento.",
                duration:3500
            })
    }else{
              try {
        this.loadingRPagosVehiculo = true;
        this.tableDataRPagosVEhiculoProduccion = [];
        var body = {
          token: this.token,
          unidad: this.itemUnidadProduccionRPagoVehiculo,
          inicio: this.fechaInicialRPagosVehiculoProduccion,
          final: this.fechaInicialRPagosVehiculoProduccion,
          tipo: this.radioEstadoRPagosVehiculo,
          rubro: this.mSelectRubroValuePagosVehiculo.length == 0 ? "*" : this.mSelectRubroValuePagosVehiculo,
        };
        console.log(body);
        var datos = await this.$axios.post(
          process.env.baseUrl + "/reporte_produccion_pagos_vehiculo_general",
          body
        );

        if (datos.data.status_code == 200) 
        {
            Notification.success({
                title:"Reporte Pagos Vehiculo",
                message:"Datos consultados con éxito.",
                duration:2500
            })
          this.tableDataRPagosVEhiculoProduccion.push(...datos.data.datos);
          this.loadingRPagosVehiculo = false;
        }else if(datos.data.status_code == 300){
            this.loadingRPagosVehiculo = false
            Notification.info({
                title:"Reporte Pagos Vehiculo",
                message:"No existen datos disponibles",
                duration:2500
            })
        }else{
            Notification.error({
                title:"API ERROR Reporte Pagos Vehiculo",
                message:datos.data.msm,
                duration:2500
            })
        }
      } catch (error) {
        Notification.error({
                title:"ERROR CATCH Reporte Pagos Vehiculo",
                message:error.toString(),
                duration:2500
            })
      }
    }


    },
  },
  mounted() {
    this.readAllUnidadesPagosVehiculoProduccion();
    this.initFechaActualProduccionRPAgosVehiculo();
    this.readAllRubrosPagosVehiculoProduccion();
  },
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
