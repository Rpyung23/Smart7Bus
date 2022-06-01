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
              v-model="itemUnidadProduccionRPagoVehiculoResumido"
              :fetch-suggestions="querySearchUnidadProduccionRPagoVehiculo"
              style="margin-right: 0.5rem"
              placeholder="Unidad"
              prefix-icon="ni ni-bus-front-12"
              :trigger-on-focus="false"
              @select="handleSelectUnidadProduccionRPagoVehiculo"
            ></el-autocomplete>

            <base-input
              addon-left-icon="ni ni-calendar-grid-58"
              style="margin-right: 0.5rem"
            >
              <flat-picker
                slot-scope="{ focus, blur }"
                @on-open="focus"
                @on-close="blur"
                :config="{ allowInput: true }"
                class="form-controlPersonal datepicker"
                v-model="fechaInicialRPagosVehiculoResumidoProduccion"
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
                v-model="fechaFinalRPagosVehiculoResumidoProduccion"
              >
              </flat-picker>
            </base-input>
          </div>

          <div class="cardSelectRubrosEstadosPagosVehiculoProduccionContainer">
            <base-button
              icon
              type="primary"
              @click="readAllRPagosVehiculoProduccionresumido()"
            >
              <span class="btn-inner--icon"
                ><i class="el-icon-search"></i
              ></span>
              <span class="btn-inner--text">Buscar</span>
            </base-button>
            <download-excel
              class="btn btn-outline-success"
              outline
              :header="headerExcelRPagosVehiculoResumidoProduccion"
              :data="tableDataRPagosVEhiculoProduccionResumido"
              :fields="json_fields_ExcelRPagosVehiculoResumidoProduccion"
              :worksheet="WorksheetExcelRPagosVehiculoResumidoProduccion"
              :name="FileNameExcelRPagosVehiculoResumidoProduccion"
            >
              <span class="btn-inner--icon"
                ><i class="ni ni-collection"></i
              ></span>
              <span class="btn-inner--text"> Exportar Excel</span>
            </download-excel>
          </div>
        </card>

        <card
          class="no-border-card col"
          style="margin-bottom: 0.5rem"
          body-classes="px-0 pb-1 card-bodyTopOpcionesRPagosVehiculoPRoduccion cardSelectRubrosEstadosPagosVehiculoProduccionContainer"
          footer-classes="pb-2"
        >
          <div class="cardSelectRubrosEstadosRPagosVehiculoProduccion"></div>

          <div class="cardTextoRPagosVehiculoProduccion">
            <strong style="color: green; margin-right: 0.5rem"
              >Recaudado : {{ mPagadoRPagosVehiculoResumido }} $</strong
            >
            <strong style="color: blue; margin-right: 0.5rem"
              >Pendiente : {{ mPendienteRPagosVehiculoResumido }} $</strong
            >
            <strong style="color: drak"
              >Total : {{ mTotalRPagosVehiculoResumido }} $</strong
            >
          </div>
        </card>

        <card
          class="no-border-card"
          style="margin-bottom: 0rem"
          body-classes="card-bodyRPagosVehiculoResumidoProduccion px-0 pb-1"
          footer-classes="pb-2"
        >
          <div>
            <el-table
              v-loading="loadingRPagosVehiculoResumido"
              element-loading-text="Cargando Datos..."
              element-loading-spinner="el-icon-loading"
              :data="tableDataRPagosVEhiculoProduccionResumido"
              row-key="id"
              class="tablePanelControlProduccion"
              header-row-class-name="thead-dark"
            >
              <el-table-column
                prop="unidad"
                label="Unidad"
                minWidth="110"
                sortable="true"
              >
              </el-table-column>

              <el-table-column
                prop="monto_pendiente_total"
                label="Pendiente ($)"
                minWidth="130"
              >
              </el-table-column>

              <el-table-column prop="pagado" label="Pagado ($)" minWidth="130">
              </el-table-column>

              <el-table-column prop="total" label="Total ($)" minWidth="130">
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
    BasePagination,
    flatPicker,
    RouteBreadCrumb,
    [DatePicker.name]: DatePicker,
    [Select.name]: Select,
    [Option.name]: Option,
    [Table.name]: Table,
    [Notification.name]: Notification,
    [Autocomplete.name]: Autocomplete,
    [TableColumn.name]: TableColumn,
    [RadioButton.name]: RadioButton,
    [Radio.name]: Radio,
  },
  data() {
    return {
      mListaUnidadesPagosVehiculoProduccionResumido: [],
      tableDataRPagosVEhiculoProduccionResumido: [],
      itemUnidadProduccionRPagoVehiculoResumido: "*",
      token: this.$cookies.get("token"),
      fechaInicialRPagosVehiculoResumidoProduccion: "",
      fechaFinalRPagosVehiculoResumidoProduccion: "",
      loadingRPagosVehiculoResumido: false,
      mTotalRPagosVehiculoResumido: "0.00",
      mPagadoRPagosVehiculoResumido: "0.00",
      mPendienteRPagosVehiculoResumido: "0.00",
            WorksheetExcelRPagosVehiculoResumidoProduccion:"",
      FileNameExcelRPagosVehiculoResumidoProduccion:"",
      headerExcelRPagosVehiculoResumidoProduccion:[],
      json_fields_ExcelRPagosVehiculoResumidoProduccion: {
        "Unidad": "unidad",
        "Monto Pendiente ($)": "monto_pendiente_total",
        "Monto Pagado ($)": "pagado",
        "Total ($)": "total"
      },
    };
  },
  methods: {
    querySearchUnidadProduccionRPagoVehiculo(queryString, cb) {
      var results = queryString
        ? this.mListaUnidadesPagosVehiculoProduccionResumido.filter(
            this.createFilterUnidadProduccionRPagoVehiculo(queryString)
          )
        : this.mListaUnidadesPagosVehiculoProduccionResumido;
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
    initFechaActualProduccionRPAgosVehiculoResumido() {
      var fecha = new Date();
      var mes = fecha.getMonth() + 1;
      var day = fecha.getDate();
      var format =
        fecha.getFullYear() +
        "-" +
        (mes < 10 ? "0" + mes : mes) +
        "-" +
        (day < 10 ? "0" + day : day);

      this.fechaInicialRPagosVehiculoResumidoProduccion = format;
      this.fechaFinalRPagosVehiculoResumidoProduccion = format;
    },
    async readAllUnidadesPagosVehiculoProduccionResumido() {
      var datos = await this.$axios.post(process.env.baseUrl + "/unidades", {
        token: this.token,
      });

      console.log(datos.data);

      if (datos.data.status_code == 200) {
        for (var i = 0; i < datos.data.data.length; i++) {
          this.mListaUnidadesPagosVehiculoProduccionResumido[i] =
            datos.data.data[i];
          this.mListaUnidadesPagosVehiculoProduccionResumido[i].value =
            datos.data.data[i].CodiVehi;
        }
      }
    },
    async readAllRPagosVehiculoProduccionresumido() 
    {
      this.WorksheetExcelRPagosVehiculoResumidoProduccion = "RPV_W_R_"+this.itemUnidadProduccionRPagoVehiculoResumido+"_"+Date.now()
      this.FileNameExcelRPagosVehiculoResumidoProduccion = "RPV_R_"+this.itemUnidadProduccionRPagoVehiculoResumido+"_"+Date.now()+".xls"
      

      if (this.loadingRPagosVehiculoResumido) {
        Notification.warning({
          title: "Reporte Pagos Vehiculo",
          message: "Por favor espere un momento.",
          duration: 3500,
        });
      } else {
        try {
          this.loadingRPagosVehiculoResumido = true;
          this.tableDataRPagosVEhiculoProduccionResumido = [];
          var body = {
            token: this.token,
            unidad: this.itemUnidadProduccionRPagoVehiculoResumido,
            inicio: this.fechaInicialRPagosVehiculoResumidoProduccion,
            final: this.fechaInicialRPagosVehiculoResumidoProduccion,
          };
          console.log(body);
          var datos = await this.$axios.post(
            process.env.baseUrl + "/reporte_pagos_vehiculo_resumido_produccion",
            body
          );

          if (datos.data.status_code == 200) {
            Notification.success({
              title: "Reporte Pagos Vehiculo",
              message: "Datos consultados con éxito.",
              duration: 2500,
            });
            var total = 0;
            var pendiente = 0;
            var pagado = 0;

            this.tableDataRPagosVEhiculoProduccionResumido.push(
              ...datos.data.datos[0]
            );
            for (var i = 0; i < datos.data.datos[0].length; i++) {
              var auxpagado =
                datos.data.datos[0][i].pagado == null
                  ? "0.00"
                  : datos.data.datos[0][i].pagado;
              var auxpendiente =
                parseFloat(datos.data.datos[0][i].monto_pendiente) -
                parseFloat(datos.data.datos[0][i].monto_pendiente_descuento);
              pagado = pagado + parseFloat(auxpagado);
              pendiente = pendiente + auxpendiente;

              this.tableDataRPagosVEhiculoProduccionResumido[i].pagado =
                auxpagado;
              this.tableDataRPagosVEhiculoProduccionResumido[
                i
              ].monto_pendiente_total = Number(auxpendiente).toFixed(2);
              this.tableDataRPagosVEhiculoProduccionResumido[i].total = Number(
                auxpendiente + parseFloat(auxpagado)
              ).toFixed(2);
            }

            this.mPagadoRPagosVehiculoResumido = Number(pagado).toFixed(2);
            this.mPendienteRPagosVehiculoResumido =
              Number(pendiente).toFixed(2);
            this.mTotalRPagosVehiculoResumido = Number(
              pendiente + pagado
            ).toFixed(2);

            this.loadingRPagosVehiculoResumido = false;
          } else if (datos.data.status_code == 300) {
            this.loadingRPagosVehiculoResumido = false;
            Notification.info({
              title: "Reporte Pagos Vehiculo",
              message: "No existen datos disponibles",
              duration: 2500,
            });
          } else {
            Notification.error({
              title: "API ERROR Reporte Pagos Vehiculo",
              message: datos.data.msm,
              duration: 2500,
            });
          }
        } catch (error) {
          Notification.error({
            title: "ERROR CATCH Reporte Pagos Vehiculo",
            message: error.toString(),
            duration: 2500,
          });
        }
        this.loadingRPagosVehiculoResumido = false;
      }

                  this.headerExcelRPagosVehiculoResumidoProduccion = [
              "Reporte Pagos Resumido: "+(this.itemUnidadProduccionRPagoVehiculoResumido == "*" ? "TODAS LAS UNIDADES" : 
              this.itemUnidadProduccionRPagoVehiculoResumido),
              "Fechas : "+this.fechaInicialRPagosVehiculoResumidoProduccion +" hasta "+this.fechaFinalRPagosVehiculoResumidoProduccion,
              "Dinero Recaudado : "+this.mPagadoRPagosVehiculoResumido,
              "Dinero Pendiente : "+this.mPendienteRPagosVehiculoResumido,
              "Total : "+this.mTotalRPagosVehiculoResumido,
            ]

    },
  },
  mounted() {
    this.readAllUnidadesPagosVehiculoProduccionResumido();
    this.initFechaActualProduccionRPAgosVehiculoResumido();
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
.card-bodyRPagosVehiculoResumidoProduccion {
  padding: 0rem !important;
  height: calc(100vh - 12rem);
  overflow: auto;
}

.card-bodyTopOpcionesRPagosVehiculoPRoduccion {
  padding-top: 0.25rem !important;
}
</style>
