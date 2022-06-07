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
              v-model="itemUnidadSalidasPanelBusqueda"
              multiple
              filterable
              style="margin-right: 0.5rem"
              remote
              placeholder="Ingrese unidad"
              :remote-method="remoteMethodUnidadesSalidasPanelBusqueda"
              :loading="loadingTableUnidadesSalidasPanelBusquedaloading"
            >
              <el-option
                v-for="item in optionsUnidadesSalidasPanelBusqueda"
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
                v-model="fechaInicialSalidasPanelBusqueda"
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
                v-model="fechaFinalSalidasPanelBusqueda"
              >
              </flat-picker>
            </base-input>
          </div>

          <div class="cardSelectRubrosEstadosPagosVehiculoProduccionContainer">
            <base-button
              icon
              type="primary"
              @click="readSalidasPanelBusqueda()"
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
              :data="mListaSalidasPanelBusqueda"
              :fields="json_fields_excelRPagosVehiculoProduccion"
              :worksheet="WorksheetExcelRPagosVehiculoProduccion"
              :name="FileNameExcelRPagosVehiculoProduccion"
            >
              <span class="btn-inner--icon"
                ><i class="ni ni-collection"></i
              ></span>
              <span class="btn-inner--text"> Excel</span>
            </download-excel>
            <base-button outline type="danger">
              <span class="btn-inner--icon"><i class="ni ni-ungroup"></i></span>
              <span class="btn-inner--text"> PDF</span>
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
              v-model="mSelectRutaSalidaPanelBusqueda"
              multiple
              collapse-tags
              placeholder="Lineas"
            >
              <el-option
                v-for="item in mListLineasSalidasPanelBusqueda"
                :key="item.LetrRuta"
                :label="item.DescRuta"
                :value="item.LetrRuta"
              >
              </el-option>
            </el-select>
            <el-radio style="margin-left: 0.5rem" v-model="radioEstadoRSalidasPanelBusqueda" 
            label="*" @change="readSalidasPanelBusqueda()">TODOS</el-radio>
            <el-radio v-model="radioEstadoRSalidasPanelBusqueda" label="2"
              @change="readSalidasPanelBusqueda()">EN RUTA</el-radio
            >
            <el-radio v-model="radioEstadoRSalidasPanelBusqueda" label="4"
              @change="readSalidasPanelBusqueda()">ANULADOS</el-radio
            >
            <el-radio v-model="radioEstadoRSalidasPanelBusqueda" label="3"
              @change="readSalidasPanelBusqueda()">FINALIZADOS</el-radio
            >
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
              v-loading="loadingTableUnidadesSalidasPanelBusqueda"
              element-loading-text="Cargando Datos..."
              element-loading-spinner="el-icon-loading"
              :data="mListaSalidasPanelBusqueda"
              row-key="id"
              class="tablePanelControlProduccion"
              header-row-class-name="thead-dark"
            >
              <el-table-column
                v-for="column in tableColumnsUnidadesFlotaVehicular"
                :key="column.label"
                v-bind="column"
                :row-class-name="tableRowClassNameSalidasPanelBusqueda"
              >
              </el-table-column>

              <el-table-column
                label="Estado"
                min-width="150px"
                prop="EstaSali_m"
              >
                <template v-slot="{ row }">
                  <badge class="badge-dot mr-4" type="">
                    <i
                      :class="`bg-${
                        row.EstaSali_m == 4
                          ? 'danger'
                          : row.EstaSali_m == 2
                          ? 'warning'
                          : 'success'
                      }`"
                    ></i>
                    <span class="status"
                      ><strong>{{
                        row.EstaSali_m == 4
                          ? "ANULADO"
                          : row.EstaSali_m == 2
                          ? "EN RUTA"
                          : "FINALIZADO"
                      }}</strong></span
                    >
                  </badge>
                </template>
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
  layout: "DespachoDashboardLayout",
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
      mListaUnidadesSalidasPanelBusqueda: [],
      mListLineasSalidasPanelBusqueda: [],
      loadingTableUnidadesSalidasPanelBusquedaloading: false,
      loadingTableUnidadesSalidasPanelBusqueda: false,
      mSelectRutaSalidaPanelBusqueda: [],
      itemUnidadSalidasPanelBusqueda: [],
      token: this.$cookies.get("token"),
      fechaInicialSalidasPanelBusqueda: "",
      fechaFinalSalidasPanelBusqueda: "",
      radioEstadoRSalidasPanelBusqueda :"*",
      WorksheetExcelRPagosVehiculoProduccion: "",
      FileNameExcelRPagosVehiculoProduccion: "",
      headerExcelRPagosVehiculoProduccion: [],
      optionsUnidadesSalidasPanelBusqueda: [],
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
      tableColumnsUnidadesFlotaVehicular: [
        {
          prop: "CodiVehiSali_m",
          label: "Unidad",
          minWidth: 130,
          sortable: true,
        },
        {
          prop: "idSali_m",
          label: "Salida",
          minWidth: 140,
        },
        {
          prop: "NumeVuelSali_m",
          label: "N° Vuelta",
          minWidth: 160,
        },
        {
          prop: "HoraSaliProgSali_m",
          label: "Hora Salida",
          minWidth: 150,
        },
        {
          prop: "HoraLlegProgSali_m",
          label: "Hora Llegada",
          minWidth: 160,
        },
        {
          prop: "atrasoTime",
          label: "Min Atraso",
          minWidth: 150,
        },
        {
          prop: "adelantoTime",
          label: "Min Adelantos",
          minWidth: 170,
        },
        {
          prop: "VeloMaxiSali_m",
          label: "Velocidad",
          minWidth: 160,
        },
        {
          prop: "NumeTarjSali_m",
          label: "N° Tarjeta",
          minWidth: 160,
        },
        {
          prop: "DescRutaSali_m",
          label: "Ruta",
          minWidth: 200,
        },
        {
          prop: "DescFrec",
          label: "Frecuencia",
          minWidth: 200,
        },
        {
          prop: "PenaCtrlSali_d",
          label: "PEN ($)",
          minWidth: 160,
        },
      ],
      mListaSalidasPanelBusqueda: [],
    };
  },
  methods: {
    remoteMethodUnidadesSalidasPanelBusqueda(query) {
      if (query !== "") {
        this.loadingTableUnidadesSalidasPanelBusquedaloading = true;
        setTimeout(() => {
          this.loadingTableUnidadesSalidasPanelBusquedaloading = false;
          this.optionsUnidadesSalidasPanelBusqueda =
            this.mListaUnidadesSalidasPanelBusqueda.filter((item) => {
              return (
                item.CodiVehi.toLowerCase().indexOf(query.toLowerCase()) > -1
              );
            });
        }, 200);
      } else {
        this.optionsUnidadesSalidasPanelBusqueda = [];
      }
    },
    initFechaActualSalidaBusquedaPanel() {
      var fecha = new Date();
      var mes = fecha.getMonth() + 1;
      var day = fecha.getDate();
      var format =
        fecha.getFullYear() +
        "-" +
        (mes < 10 ? "0" + mes : mes) +
        "-" +
        (day < 10 ? "0" + day : day);

      this.fechaInicialSalidasPanelBusqueda = format;
      this.fechaFinalSalidasPanelBusqueda = format;
    },
    async readAllUnidadesSalidasPanelBusqueda() {
      var datos = await this.$axios.post(process.env.baseUrl + "/unidades", {
        token: this.token,
      });

      if (datos.data.status_code == 200) {
        for (var i = 0; i < datos.data.data.length; i++) {
          var obj = datos.data.data[i];
          obj.value = obj.CodiVehi;
          this.mListaUnidadesSalidasPanelBusqueda.push(obj);
        }
      }
    },
    async readAllLineasContadorSalidasPanelBusqueda() {
      var datos = await this.$axios.post(process.env.baseUrl + "/rutes", {
        token: this.token,
      });
      if (datos.data.status_code == 200) {
        this.mListLineasSalidasPanelBusqueda.push(...datos.data.data);
      }
    },
    async readSalidasPanelBusqueda() {
      this.mListaSalidasPanelBusqueda = [];

      if (!this.loadingTableUnidadesSalidasPanelBusqueda) {
        this.loadingTableUnidadesSalidasPanelBusqueda = true;
        try {
          var datos = await this.$axios.post(
            process.env.baseUrl + "/readSalidasPanel",
            {
              token: this.token,
              unidades:
                this.itemUnidadSalidasPanelBusqueda.length <= 0
                  ? "*"
                  : this.itemUnidadSalidasPanelBusqueda,
              rutas:
                this.mSelectRutaSalidaPanelBusqueda.length <= 0
                  ? "*"
                  : this.mSelectRutaSalidaPanelBusqueda,
              fechaI: this.fechaInicialSalidasPanelBusqueda,
              fechaF: this.fechaFinalSalidasPanelBusqueda,
              tipo :this.radioEstadoRSalidasPanelBusqueda
            }
          );

          if (datos.data.status_code == 200) {
            Notification.success({
              title: "Panel Salidas",
              message: "Datos consultados con éxito",
            });
            this.mListaSalidasPanelBusqueda.push(...datos.data.datos);
          } else if (datos.data.status_code == 300) {
            Notification.info({
              title: "Panel Salidas",
              message: "ANo existen datos disponibles.",
            });
          } else {
            Notification.error({
              title: "Panel Salidas",
              message: datos.data.msm,
            });
          }
        } catch (error) {
          console.log(error);
          Notification.info({
            title: "TryCatch Panel Salidas",
            message: error.toString(),
          });
        }
      } else {
        Notification.warning({
          title: "Panel Salidas",
          message:
            "Actualmente ya existe una busqueda, porfavor espere un momento",
        });
      }
      this.loadingTableUnidadesSalidasPanelBusqueda = false;
    },
    tableRowClassNameSalidasPanelBusqueda({ row, rowIndex }) 
    {
      if (row.EstaSali_m == 4) {
        //row.estado = "ANULADO";
        return "warning-row-panelControlProduccion";
      } else if(row.EstaSali_m == 2) {
        //row.estado = "PAGADO";
        return "success-row-panelControlProduccion";
      }
    },
  },
  mounted() {
    this.readAllUnidadesSalidasPanelBusqueda();
    this.initFechaActualSalidaBusquedaPanel();
    this.readAllLineasContadorSalidasPanelBusqueda();
    this.readSalidasPanelBusqueda();
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
  background: hsla(61, 100%, 66%, 0.479) !important;
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
