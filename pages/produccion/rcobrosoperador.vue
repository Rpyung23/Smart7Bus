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
            <el-select
              v-model="mSelectItemOperadorProduccion"
              style="margin-right: 0.5rem;width:22rem;"
              multiple
    collapse-tags
              placeholder="Operador"
            >
              <el-option
                v-for="item in mListCobradoresAllProduccion"
                :key="item.CodiUsua"
                :label="item.NombApellUsua"
                :value="item.CodiUsua"
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
                v-model="fechaInicialCobrosOperadorProduccion"
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
                v-model="fechaFinalCobrosOperadorProduccion"
              >
              </flat-picker>
            </base-input>
          </div>

          <div class="cardSelectRubrosEstadosPagosVehiculoProduccionContainer">
            <base-button
              icon
              type="primary"
              @click="readAllCobrosRealizadosOperadorProduccion()"
            >
              <span class="btn-inner--icon"
                ><i class="el-icon-search"></i
              ></span>
              <span class="btn-inner--text">Buscar</span>
            </base-button>
            <download-excel
              class="btn btn-outline-success"
              outline
              :header="headerExcelRCobrosOperadorProduccion"
              :data="tableDatosCobrosOperadorProduccion"
              :fields="json_fields_ExcelRCobrosOperadorProduccion"
              :worksheet="WorksheetExcelRCobrosOperadorProduccion"
              :name="FileNameExcelRCobrosOperadorProduccion"
            >
              <span class="btn-inner--icon"
                ><i class="ni ni-collection"></i
              ></span>
              <span class="btn-inner--text"> Exportar Excel</span>
            </download-excel>
            <!--<base-button outline type="danger">
              <span class="btn-inner--icon"
                ><i class="el-icon-document"></i
              ></span>
              <span class="btn-inner--text"> Exportar PDF</span>
            </base-button>-->
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
              >Recaudado : {{ mPagadosOperadorProduccion }} $</strong
            >
            <strong style="color: red"
              >Anulado : {{ mAnuladoOperadorProduccion }} $</strong
            >
          </div>
        </card>

        <card
          class="no-border-card"
          style="margin-bottom: 0rem"
          body-classes="card-bodyRCobrosOperadorProduccion px-0 pb-1"
          footer-classes="pb-2"
        >
          <div>
            <el-table
              v-loading="loadingCobrosOperadorProduccion"
              element-loading-text="Cargando Datos..."
              element-loading-spinner="el-icon-loading"
              :data="tableDatosCobrosOperadorProduccion"
              :height="tableDatosCobrosOperadorProduccion.length > 0 ? 455 : 150" 
              row-key="id"
              class="tablePanelControlProduccion"
              header-row-class-name="thead-dark"
              :row-class-name="tableRowClassCobrosOperadorProduccion"
            >
              <el-table-column prop="numero_cobro" label="Recibo N°" minWidth="110">
              </el-table-column>

              <!--<el-table-column prop="unidad" label="Unidad" minWidth="110">
              </el-table-column>-->

              <el-table-column
                prop="fecha_cobro"
                label="Fecha Cobro"
                minWidth="180"
                sortable="true"
              >
              </el-table-column>

              <el-table-column
                prop="NombApellUsua"
                label="Operador"
                minWidth="250"
                sortable="true"
              >
              </el-table-column>

              <el-table-column prop="total_cobro" label="Monto Cobrado" minWidth="190">
              </el-table-column>

              <el-table-column
                prop="estado"
                label="Estado"
                minWidth="130"
                sortable="true"
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
      mListaUnidadesPagosVehiculoProduccion: [],
      tableDatosCobrosOperadorProduccion: [],
      radioEstadoRPagosVehiculo: "*",
      mListCobradoresAllProduccion: [],
      mSelectItemOperadorProduccion: [],
      token: this.$cookies.get("token"),
      fechaInicialCobrosOperadorProduccion: "",
      fechaFinalCobrosOperadorProduccion: "",
      loadingCobrosOperadorProduccion: false,
      mPagadosOperadorProduccion: "0.00",
      mAnuladoOperadorProduccion: "0.00",
      WorksheetExcelRCobrosOperadorProduccion:"",
      FileNameExcelRCobrosOperadorProduccion:"",
      headerExcelRCobrosOperadorProduccion:[],
      json_fields_ExcelRCobrosOperadorProduccion: {
        "Recibo N°": "numero_cobro",
        "Fecha Cobro": "fecha_cobro",
        "Atención": "NombApellUsua",
        "Monto Cobrado": "total_cobro",
        "Estado": "estado",
      },
    };
  },
  methods: {
    tableRowClassCobrosOperadorProduccion({ row, rowIndex }) {
      if (row.estado == 0) {
        row.estado = "ANULADO";
        return "warning-row-panelControlProduccion";
      } else {
        row.estado = "PAGADO";
        return "success-row-panelControlProduccion";
      }
    },
    initFechaActualCobrosOperadorProduccion() {
      var fecha = new Date();
      var mes = fecha.getMonth() + 1;
      var day = fecha.getDate();
      var format =
        fecha.getFullYear() +
        "-" +
        (mes < 10 ? "0" + mes : mes) +
        "-" +
        (day < 10 ? "0" + day : day);

      this.fechaInicialCobrosOperadorProduccion = format;
      this.fechaFinalCobrosOperadorProduccion = format;
    },
    async readAllCobradoresProduccion() {
      var datos = await this.$axios.post(
        process.env.baseUrl + "/readallCobradores",
        {
          token: this.token,
        }
      );
      if (datos.data.status_code == 200) {
        this.mListCobradoresAllProduccion.push(...datos.data.data);
      }
    },
    async readAllCobrosRealizadosOperadorProduccion() 
    {
      this.WorksheetExcelRCobrosOperadorProduccion = "RCO_W_"+this.mSelectItemOperadorProduccion+"_"+Date.now()
      this.FileNameExcelRCobrosOperadorProduccion = "RCO_"+this.mSelectItemOperadorProduccion+"_"+Date.now()+".xls"
      

      this.mPagadosOperadorProduccion = "0.00";
      this.mAnuladoOperadorProduccion = "0.00";

      if (this.loadingCobrosOperadorProduccion) {
        Notification.warning({
          title: "Reporte Cobros por Operador",
          message: "Por favor espere un momento.",
          duration: 3500,
        });
      } else {
        try {
          this.loadingCobrosOperadorProduccion = true;
          this.tableDatosCobrosOperadorProduccion = [];
          var body = {
            token: this.token,
            operador: this.mSelectItemOperadorProduccion.length <= 0 ? "*" : this.mSelectItemOperadorProduccion,
            fechaI: this.fechaInicialCobrosOperadorProduccion,
            fechaF: this.fechaFinalCobrosOperadorProduccion,
          };
          var datos = await this.$axios.post(
            process.env.baseUrl + "/ProduccionCobrosPorOperador",
            body
          );

          if (datos.data.status_code == 200) {
            Notification.success({
              title: "Reporte Cobros por Operador",
              message: "Datos consultados con éxito.",
              duration: 2500,
            });
            var anulado = 0;
            var pagado = 0;

            this.tableDatosCobrosOperadorProduccion.push(...datos.data.datos);

            for (var i = 0; i < datos.data.datos.length; i++) {
              pagado = pagado + parseFloat(datos.data.datos[i].total_cobro);
            }

            this.mPagadosOperadorProduccion = Number(pagado).toFixed(2);
            this.mAnuladoOperadorProduccion = Number(anulado).toFixed(2);

            this.loadingCobrosOperadorProduccion = false;
          } else if (datos.data.status_code == 300) {
            this.loadingCobrosOperadorProduccion = false;
            Notification.info({
              title: "Reporte Cobros por Operador",
              message: "No existen datos disponibles",
              duration: 2500,
            });
          } else {
            Notification.error({
              title: "API ERROR Reporte Cobros por Operador",
              message: datos.data.msm,
              duration: 2500,
            });
          }
        } catch (error) {
          Notification.error({
            title: "ERROR CATCH Reporte Cobros por Operador",
            message: error.toString(),
            duration: 2500,
          });
        }
        this.headerExcelRCobrosOperadorProduccion = [
              "Reporte Cobros Operador : "+(this.mSelectItemOperadorProduccion == "*" ? "TODAS LOS OPERADORES" : 
              this.mSelectItemOperadorProduccion),
              "Fechas : "+this.fechaInicialCobrosOperadorProduccion +" hasta "+this.fechaFinalCobrosOperadorProduccion,
              "Dinero Recaudado : "+this.mPagadosOperadorProduccion,
              "Dinero Anulado : "+this.mAnuladoOperadorProduccion
            ]
        this.loadingCobrosOperadorProduccion = false;
      }
    },
  },
  mounted() {
    this.initFechaActualCobrosOperadorProduccion();
    this.readAllCobradoresProduccion();
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
.card-bodyRCobrosOperadorProduccion {
  padding: 0rem !important;
  height: calc(100vh - 12rem);
  overflow: auto;
}

.card-bodyTopOpcionesRPagosVehiculoPRoduccion {
  padding-top: 0.25rem !important;
}
</style>
