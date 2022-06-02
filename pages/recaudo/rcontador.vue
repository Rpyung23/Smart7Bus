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
            <!--<el-autocomplete
              class="inline-input"
              v-model="itemUnidadContadorPasajero"
              :fetch-suggestions="querySearchUnidadProduccionRPagoVehiculo"
              style="margin-right: 0.5rem"
              placeholder="Unidad"
              prefix-icon="ni ni-bus-front-12"
              :trigger-on-focus="false"
              @select="handleSelectUnidadProduccionRPagoVehiculo"
            ></el-autocomplete>-->

            <el-select
              v-model="itemUnidadContadorPasajero"
              multiple
              filterable
              style="margin-right: 0.5rem"
              remote
              placeholder="Ingrese unidad"
              :remote-method="remoteMethodUnidadesContadorPasajeros"
              :loading="loadingUnidadesContadorPasajeros"
            >
              <el-option
                v-for="item in optionsUnidadesSelectContadorPasajero"
                :key="item.CodiVehi"
                :label="item.CodiVehi"
                :value="item.CodiVehi"
              >
              </el-option>
            </el-select>

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
              <span class="btn-inner--icon"
                ><i class="el-icon-search"></i
              ></span>
              <span class="btn-inner--text">Buscar</span>
            </base-button>
            <download-excel
              class="btn btn-outline-success"
              outline
              :header="headerExcelRPagosVehiculoProduccion"
              :data="tableDataRPagosVEhiculoProduccion"
              :fields="json_fields_excelRPagosVehiculoProduccion"
              :worksheet="WorksheetExcelRPagosVehiculoProduccion"
              :name="FileNameExcelRPagosVehiculoProduccion"
            >
              <span class="btn-inner--icon"
                ><i class="ni ni-collection"></i
              ></span>
              <span class="btn-inner--text"> Exportar Excel</span>
            </download-excel>
            <base-button outline type="danger">
              <span class="btn-inner--icon"><i class="ni ni-ungroup"></i></span>
              <span class="btn-inner--text"> Exportar PDF</span>
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
              v-model="mSelectRutaContadorPasajero"
              multiple
              collapse-tags
              placeholder="Lineas"
            >
              <el-option
                v-for="item in mListLineasContadorPasajeros"
                :key="item.LetrRuta"
                :label="item.DescRuta"
                :value="item.LetrRuta"
              >
              </el-option>
            </el-select>
          </div>

          <div class="cardTextoRPagosVehiculoProduccion">
            <strong style="color: blue; margin-right: 0.5rem"
              >Subida : {{ mTotalPasajerosSubidaContador }}</strong
            >
            <strong style="color: read; margin-right: 0.5rem"
              >Bajada : {{ mTotalPasajerosBajadaContador }}</strong
            >
            <strong style="color: black; margin-right: 0.5rem"
              >Total : {{ mTotalPasajerosContador }}</strong
            >
            <strong style="color: green"
              >Dinero Recaudado : {{ mTotalDineroPasajerosContador }} $</strong
            >
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
                prop="DescRutaSali_m"
                label="Ruta - Linea"
                minWidth="200"
              >
              </el-table-column>

              <el-table-column
                prop="fecha_creacion"
                label="Puerta 1 (S)"
                minWidth="160"
              >
              </el-table-column>
              <el-table-column
                prop="fecha_pago"
                label="Puerta 2 (S)"
                minWidth="160"
              >
              </el-table-column>
              <el-table-column
                prop="montoControles"
                label="Puerta 3 (S)"
                minWidth="160"
              >
              </el-table-column>
              <el-table-column
                prop="montoControlesDesc"
                label="Puerta 1 (B)"
                minWidth="160"
              >
              </el-table-column>
              <el-table-column
                prop="descripcion_rubro"
                label="Puerta 2 (B)"
                minWidth="160"
              >
              </el-table-column>
              <el-table-column
                prop="montoMultas"
                label="Puerta 3 (B)"
                minWidth="160"
              >
              </el-table-column>
              <el-table-column
                prop="montoMultas"
                label="Total Subidas"
                minWidth="180"
              >
              </el-table-column>

              <el-table-column
                prop="montoMultas"
                label="Total Bajadas"
                minWidth="180"
              >
              </el-table-column>

              <el-table-column prop="montoMultas" label="Total" minWidth="150">
              </el-table-column>

              <el-table-column
                prop="montoMultas"
                label="D. Recaudado ($)"
                minWidth="180"
              >
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
  layout: "RecaudoDashboardLayout",
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
      mListaUnidadesPagosVehiculoProduccion: [],
      tableDataRPagosVEhiculoProduccion: [],
      mListLineasContadorPasajeros: [],
      loadingUnidadesContadorPasajeros: false,
      mSelectRutaContadorPasajero: ["*"],
      itemUnidadContadorPasajero: ["*"],
      token: this.$cookies.get("token"),
      fechaInicialRPagosVehiculoProduccion: "",
      fechaFinalRPagosVehiculoProduccion: "",
      loadingRPagosVehiculo: false,
      mTotalPasajerosContador: "0",
      mTotalPasajerosSubidaContador: "0",
      mTotalPasajerosBajadaContador: "0",
      mTotalDineroPasajerosContador: "0.00",
      WorksheetExcelRPagosVehiculoProduccion: "",
      FileNameExcelRPagosVehiculoProduccion: "",
      headerExcelRPagosVehiculoProduccion: [],
      optionsUnidadesSelectContadorPasajero: [],
      json_fields_excelRPagosVehiculoProduccion: {
        Unidad: "vehiculo_codigo",
        Salida: "salida_id",
        "Linea - Ruta": "DescRutaSali_m",
        "Fecha Salida": "HoraSaliProgSali_m",
        "Fecha Creación": "fecha_creacion",
        "Fecha Pago": "fecha_pago",
        "Minutos ($)": "montoControles",
        "Minutos Just($)": "montoControlesDesc",
        "Detalle Rubro": "descripcion_rubro",
        "Rubros ($)": "montoMultas",
        "Rubros Jus ($)": "montoMultasDesc",
        "Monto Pagado": "monto_pagado",
        Estado: "estado",
      },
    };
  },
  methods: {
    remoteMethodUnidadesContadorPasajeros(query) {
      if (query !== "") {
        this.loadingUnidadesContadorPasajeros = true;
        setTimeout(() => {
          this.loadingUnidadesContadorPasajeros = false;
          this.optionsUnidadesSelectContadorPasajero =
            this.mListaUnidadesPagosVehiculoProduccion.filter((item) => {
              return (
                item.CodiVehi.toLowerCase().indexOf(query.toLowerCase()) > -1
              );
            });
        }, 200);
      } else {
        this.optionsUnidadesSelectContadorPasajero = [];
      }
    },

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

      if (datos.data.status_code == 200) 
      {
        this.mListaUnidadesPagosVehiculoProduccion.push({
          CodiVehi:"*",
          value:"*"
        })
        for (var i = 0; i < datos.data.data.length; i++) 
        {
          var obj = datos.data.data[i]
          obj.value = obj.CodiVehi
          this.mListaUnidadesPagosVehiculoProduccion.push(obj)
        }
      }
    },
    async readAllLineasContadorPasajeros() {
      var datos = await this.$axios.post(process.env.baseUrl + "/rutes", {
        token: this.token,
      });
      this.mListLineasContadorPasajeros.push({
        DescRuta: "Todas las Rutas",
        LetrRuta: "*",
      });
      if (datos.data.status_code == 200) {
        this.mListLineasContadorPasajeros.push(...datos.data.data);
      }
    },
    async readConteoPasajeros(){
      var body = {
        fechaI:'',
        fechaF:'',
        unidad:'',
        ruta:''
      }
    }
  },
  mounted() {
    this.readAllUnidadesPagosVehiculoProduccion();
    this.initFechaActualProduccionRPAgosVehiculo();
    this.readAllLineasContadorPasajeros();
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
