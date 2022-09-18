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
              v-model="itemUnidadContadorPasajeroVuetas"
              :fetch-suggestions="querySearchUnidadProduccionRPagoVehiculo"
              style="margin-right: 0.5rem"
              placeholder="Unidad"
              prefix-icon="ni ni-bus-front-12"
              :trigger-on-focus="false"
              @select="handleSelectUnidadProduccionRPagoVehiculo"
            ></el-autocomplete>-->

            <el-select
              v-model="itemUnidadContadorPasajeroVuetas"
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
                v-model="fechaInicialConteoPasajerosVueltas"
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
                v-model="fechaFinalConteoPasajerosVueltas"
              >
              </flat-picker>
            </base-input>
          </div>


          <div class="buttonsAdicionalesDespacho">
            <base-button icon size="sm" title="Buscar" type="primary" @click="readConteoPasajeros()">
              <span class="btn-inner--icon"
                ><i class="el-icon-search"></i
              ></span>
            </base-button>
            <download-excel
             class="btn btn-sm btn-success"
              v-if="tableDataRecaudoContadorPasajerosVueltas.length > 0 ? true : false"
              outline
              :header="headerExcelRPagosVehiculoProduccion"
              :data="tableDataRecaudoContadorPasajerosVueltas"
              :fields="json_fields_excelRPagosVehiculoProduccion"
              :worksheet="WorksheetExcelRPagosVehiculoProduccion"
              :name="FileNameExcelRPagosVehiculoProduccion"
              title="Excel"
            >
              <span class="btn-inner--icon"
                ><i class="ni ni-collection"></i
              ></span>
            </download-excel>
            <base-button type="danger" v-if="tableDataRecaudoContadorPasajerosVueltas.length > 0 ? true : false" title="PDF" size="sm">
              <span class="btn-inner--icon"><i class="ni ni-ungroup"></i></span>
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
              v-model="mSelectRutaContadorPasajeroVueltas"
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

          <div class="cardTextoRPagosVehiculoProduccion"></div>
        </card>

        <card
          class="no-border-card"
          style="margin-bottom: 0rem"
          body-classes="card-bodyRPagosVehiculoProduccion px-0 pb-1"
          footer-classes="pb-2"
        >
          <div>
            <el-table
              v-loading="loadingUnidadesContadorPasajerosPasajerosVueltas"
              element-loading-text="Cargando Datos..."
              :data="tableDataRecaudoContadorPasajerosVueltas"
              row-key="id"
              height="calc(100vh - 13rem)"
              style="width: 100%"
              class="tablePanelControlProduccion"
              header-row-class-name="thead-dark"
            >
              <el-table-column prop="unidad" label="Unidad" minWidth="110">
              </el-table-column>

              <el-table-column prop="salida_m_id" label="N° Salida" minWidth="140">
              </el-table-column>

              <el-table-column
                prop="DescRutaSali_m"
                label="Ruta - Linea"
                minWidth="200"
              >
              </el-table-column>

              <el-table-column
                prop="subida1"
                label="Puerta 1 (S)"
                minWidth="160"
              >
              </el-table-column>
              <el-table-column
                prop="subida2"
                label="Puerta 2 (S)"
                minWidth="160"
              >
              </el-table-column>
              <el-table-column
                prop="subida3"
                label="Puerta 3 (S)"
                minWidth="160"
              >
              </el-table-column>
              <el-table-column
                prop="bajada1"
                label="Puerta 1 (B)"
                minWidth="160"
              >
              </el-table-column>
              <el-table-column
                prop="bajada2"
                label="Puerta 2 (B)"
                minWidth="160"
              >
              </el-table-column>
              <el-table-column
                prop="bajada3"
                label="Puerta 3 (B)"
                minWidth="160"
              >
              </el-table-column>
              <el-table-column
                prop="totalSubidas"
                label="Total Subidas"
                minWidth="180"
              >
              </el-table-column>

              <el-table-column
                prop="totalBajadas"
                label="Total Bajadas"
                minWidth="180"
              >
              </el-table-column>

              <!--<el-table-column prop="error" label="% Error" minWidth="140">
              </el-table-column>-->

              <el-table-column
                prop="dinero"
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
      mListaUnidadesContadorPasajeros: [],
      tableDataRecaudoContadorPasajerosVueltas: [],
      mListLineasContadorPasajeros: [],
      loadingUnidadesContadorPasajeros: false,
      loadingUnidadesContadorPasajerosPasajerosVueltas: false,
      mSelectRutaContadorPasajeroVueltas: [],
      itemUnidadContadorPasajeroVuetas: [],
      token: this.$cookies.get("token"),
      fechaInicialConteoPasajerosVueltas: "",
      fechaFinalConteoPasajerosVueltas: "",
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
            this.mListaUnidadesContadorPasajeros.filter((item) => {
              return (
                item.CodiVehi.toLowerCase().indexOf(query.toLowerCase()) > -1
              );
            });
        }, 200);
      } else {
        this.optionsUnidadesSelectContadorPasajero = [];
      }
    },

    initFechaActualContadorPasajerosVueltas() {
      var fecha = new Date();
      var mes = fecha.getMonth() + 1;
      var day = fecha.getDate();
      var format =
        fecha.getFullYear() +
        "-" +
        (mes < 10 ? "0" + mes : mes) +
        "-" +
        (day < 10 ? "0" + day : day);

      this.fechaInicialConteoPasajerosVueltas = format;
      this.fechaFinalConteoPasajerosVueltas = format;
    },
    async readAllUnidadesContadorPasajerosVueltas() {
      var datos = await this.$axios.post(process.env.baseUrl + "/unidades", {
        token: this.token,
      });

      if (datos.data.status_code == 200) {
        for (var i = 0; i < datos.data.data.length; i++) {
          var obj = datos.data.data[i];
          obj.value = obj.CodiVehi;
          this.mListaUnidadesContadorPasajeros.push(obj);
        }
      }
    },
    async readAllLineasContadorPasajerosVueltas() {
      var datos = await this.$axios.post(process.env.baseUrl + "/rutes", {
        token: this.token,
        tipo:1
      });
      if (datos.data.status_code == 200) {
        this.mListLineasContadorPasajeros.push(...datos.data.data);
      }
    },
    async readConteoPasajeros() {
      if (this.loadingUnidadesContadorPasajerosPasajerosVueltas) {
        Notification.info({
          title: "Conteo de Pasajeros",
          message: "Por favor espere un momento, consulta en proceso.",
        });
      } else {
        this.loadingUnidadesContadorPasajerosPasajerosVueltas = true;
        this.tableDataRecaudoContadorPasajerosVueltas = [];
        try {
          /*console.log(this.itemUnidadContadorPasajeroVuetas)
          console.log(this.mSelectRutaContadorPasajeroVueltas)*/
          var body = {
            token: this.token,
            unidades:
              this.itemUnidadContadorPasajeroVuetas.length == 0
                ? "*"
                : this.itemUnidadContadorPasajeroVuetas,
            rutas:
              this.mSelectRutaContadorPasajeroVueltas.length == 0
                ? "*"
                : this.mSelectRutaContadorPasajeroVueltas,
            fechaI: this.fechaInicialConteoPasajerosVueltas + " 01:00:00",
            fechaF: this.fechaFinalConteoPasajerosVueltas + " 23:59:59",
          };
          //console.log(body)
          var datos = await this.$axios.post(
            process.env.baseUrl + "/contadorPasajerosFechaVueltas",
            body,
            {
              timeout: 600000,
            }
          );
  
          if (datos.data.status_code == 200) 
          {
            this.tableDataRecaudoContadorPasajerosVueltas.push(...datos.data.datos);
          } else if (datos.data.status_code == 300) {
            Notification.info({
              title: "Conteo de Pasajeros",
              message: "No existen datos disponibles.",
            });
          } else {
            Notification.error({
              title: "Conteo de Pasajeros",
              message: datos.data.msm,
            });
          }
        } catch (error) {
          console.log(error);
          Notification.error({
              title: "TRYCTACH Conteo de Pasajeros",
              message: error.toString(),
            });
        }
        this.loadingUnidadesContadorPasajerosPasajerosVueltas = false;
      }
    },
  },
  mounted() {
    this.readAllUnidadesContadorPasajerosVueltas();
    this.initFechaActualContadorPasajerosVueltas();
    this.readAllLineasContadorPasajerosVueltas();
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
