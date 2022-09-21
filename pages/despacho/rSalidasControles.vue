<template>
  <div class="content">
    <base-header>
      <div class="align-items-center py-3">
        <card
          class="no-border-card col"
          style="margin-bottom: 0.5rem"
          body-classes="px-0 pb-1 card-bodyTopOpcionesRPagosVehiculoPRoduccionPanelDespachoBusqueda cardSelectRubrosEstadosPagosVehiculoProduccionContainerPanelDespachoBusqueda"
          footer-classes="pb-2"
        >
          <div class="cardTextoRPagosVehiculoProduccionPanelDespachoBusqueda">
            <el-select
              v-model="itemUnidadSalidasPanelBusqueda"
              multiple
              filterable
              style="margin-right: 0.5rem"
              remote
              placeholder="Ingrese unidad"
              :remote-method="remoteMethodUnidadesSalidasControles"
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

          <div
            class="cardSelectRubrosEstadosPagosVehiculoProduccionContainerPanelDespachoBusqueda"
          >
            <div class="buttonCenterEndDerecha">
              <base-button
                icon
                type="primary"
                size="sm"
                @click="readReporteSalidasControles()"
              >
                <span class="btn-inner--icon"
                  ><i class="el-icon-search"></i
                ></span>
              </base-button>
              <download-excel
                class="btn btn-icon btn-fab btn-success btn-sm"
                title="Excel"
                v-if="
                  mListSalidasFrecuenciasControles.length > 0 ? true : false
                "
                :header="oHeaderRSalidasFrecuenciasControles"
                :data="mListSalidasFrecuenciasControles"
                :fields="oJSONFieldsRSalidasFrecuenciasControles"
                :worksheet="oWorkSheetRSalidasFrecuenciasControles"
                :name="oFileNameRSalidasFrecuenciasControles"
              >
                <span class="btn-inner--icon"
                  ><i class="ni ni-collection"></i
                ></span>
              </download-excel>
            </div>
          </div>
        </card>

        <card
          class="no-border-card col"
          style="margin-bottom: 0.5rem"
          body-classes="px-0 pb-1 card-bodyTopOpcionesRPagosVehiculoPRoduccionPanelDespachoBusqueda cardSelectRubrosEstadosPagosVehiculoProduccionContainerPanelDespachoBusqueda"
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
                v-for="item in mListLineasFecuenciasControles"
                :key="item.LetrRuta"
                :label="item.DescRuta"
                :value="item.LetrRuta"
              >
              </el-option>
            </el-select>
          </div>

          <div
            class="cardTextoRPagosVehiculoProduccionPanelDespachoBusqueda"
          ></div>
        </card>

        <card
          class="no-border-card"
          style="margin-bottom: 0rem"
          body-classes="card-bodyRPagosVehiculoProduccion px-0 pb-1"
          footer-classes="pb-2"
        >
          <div>
            <el-table
              v-loading="loadingTableRSalidasFrecuenciasControles"
              element-loading-text="Cargando Datos..."
              :data="mListSalidasFrecuenciasControles"
              row-key="id"
              class="tablePanelControlProduccion"
              header-row-class-name="thead-dark"
              height="calc(100vh - 13rem)"
            >
              <el-table-column
                v-for="column in tableColumnsUnidadesFlotaVehicular"
                :key="column.label"
                v-bind="column"
              >
              </el-table-column>

              <el-table-column
                label="PEN ($)"
                min-width="170"
                prop="PenaCtrlSali_d"
              >
                <template slot-scope="scope">
                  <strong style="color: black;">{{ scope.row.PenaCtrlSali_d }}</strong>
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
  Checkbox,
  CheckboxButton,
  CheckboxGroup,
  Popover,
  Button,
  Loading,
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
    [Checkbox.name]: Checkbox,
    [CheckboxButton.name]: CheckboxButton,
    [CheckboxGroup.name]: CheckboxGroup,
    [Popover.name]: Popover,
    [Button.name]: Button,
  },
  data() {
    return {
      mListaUnidadesSalidasPanelBusqueda: [],
      mListLineasFecuenciasControles: [],
      loadingTableUnidadesSalidasPanelBusquedaloading: false,
      loadingTableRSalidasFrecuenciasControles: false,
      mSelectRutaSalidaPanelBusqueda: [],
      itemUnidadSalidasPanelBusqueda: [],
      token: this.$cookies.get("token"),
      fechaInicialSalidasPanelBusqueda: "",
      fechaFinalSalidasPanelBusqueda: "",
      optionsUnidadesSalidasPanelBusqueda: [],
      tableColumnsUnidadesFlotaVehicular: [
        {
          prop: "CodiVehiSali_m",
          label: "Unidad",
          minWidth: 120,
        },
        {
          prop: "PlacVehi",
          label: "Placa",
          minWidth: 140,
        },
        {
          prop: "idSali_m",
          label: "Salida",
          minWidth: 140,
        },
        {
          prop: "NumeVuelSali_m",
          label: "N° Vuelta",
          minWidth: 140,
        },
        {
          prop: "HoraSaliProgSali_m",
          label: "H. Salida",
          minWidth: 220,
        },
        {
          prop: "HoraLlegProgSali_m",
          label: "H. Llegada",
          minWidth: 140,
        },
        {
          prop: "DescRuta",
          label: "Ruta",
          minWidth: 350,
        },
        {
          prop: "DescFrec",
          label: "Frecuencia",
          minWidth: 350,
        },
        {
          prop: "DescCtrl",
          label: "Control",
          minWidth: 350,
        },
        {
          prop: "HoraProgSali_d",
          label: "H. Programada",
          minWidth: 170,
        },
        {
          prop: "HoraMarcSali_d",
          label: "H. Marcada",
          minWidth: 170,
        },
        {
          prop: "atraso",
          label: "T. Atrasos",
          minWidth: 170,
        },
        {
          prop: "adelanto",
          label: "T. Adelantos",
          minWidth: 170,
        },
        {
          prop: "atrasoFaltas",
          label: "F. Atrasos",
          minWidth: 170,
        },
        {
          prop: "adelantoFaltas",
          label: "F. Adelantos",
          minWidth: 170,
        },
      ],
      mListSalidasFrecuenciasControles: [],
      oHeaderRSalidasFrecuenciasControles: [],
      oWorkSheetRSalidasFrecuenciasControles: "",
      oFileNameRSalidasFrecuenciasControles: "",
      oJSONFieldsRSalidasFrecuenciasControles: {
        Unidad: "CodiVehiSali_m",
        Placa: "PlacVehi",
        Salida: "idSali_m",
        "N° Vuelta": "NumeVuelSali_m",
        "Detalle Ruta": "DescRuta",
        "Detalle Frecuecnia": "DescFrec",
        "Fecha Hora Salida": "HoraSaliProgSali_m",
        "Hora Llegada": "HoraLlegProgSali_m",
        "Detalle Control": "DescCtrl",
        "Hora Programada": "HoraProgSali_d",
        "Hora Marcación": "HoraMarcSali_d",
        "Tiempo Atraso": "atraso",
        "Tiempo Adelanto": "adelanto",
        "Faltas Atrasos": "atrasoFaltas",
        "Faltas Adelantos": "adelantoFaltas",
        "PENALIDAD $": "PenaCtrlSali_d",
      },
    };
  },
  methods: {
    remoteMethodUnidadesSalidasControles(query) {
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
    initFechaActualSalidasControles() {
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
    async readAllUnidadesSalidasControles() {
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
    async readLineasRSalidasFrecuenciasControles() {
      this.mListLineasFecuenciasControles = [];
      var datos = await this.$axios.post(process.env.baseUrl + "/rutes", {
        token: this.token,
        tipo: 3,
      });
      if (datos.data.status_code == 200) {
        this.mListLineasFecuenciasControles.push(...datos.data.data);
      } else {
        console.log(datos.data);
      }
    },
    getNombresRutasRSalidasFrecuenciasControles() {
      var mlist = [];
      for (var j = 0; j < this.mSelectRutaSalidaPanelBusqueda.length; j++) {
        for (var i = 0; i < this.mListLineasFecuenciasControles.length; i++) {
          if (
            this.mSelectRutaSalidaPanelBusqueda[j] ==
            this.mListLineasFecuenciasControles[i].LetrRuta
          ) {
            mlist.push(this.mListLineasFecuenciasControles[i].DescRuta);
          }
        }
      }
      return mlist;
    },
    async readReporteSalidasControles() {
      this.loadingTableRSalidasFrecuenciasControles = true;
      this.mListSalidasFrecuenciasControles = [];
      this.oWorkSheetRSalidasFrecuenciasControles = "RSFC_W_" + Date.now();
      this.oFileNameRSalidasFrecuenciasControles =
        "RSFC_" + Date.now() + ".xls";

      try {
        var datos = await this.$axios.post(
          process.env.baseUrl + "/rSalidasFrecuenciasControles",
          {
            token: this.token,
            unidades:
              this.itemUnidadSalidasPanelBusqueda.length > 0
                ? this.itemUnidadSalidasPanelBusqueda
                : "*",
            rutas:
              this.mSelectRutaSalidaPanelBusqueda.length > 0
                ? this.mSelectRutaSalidaPanelBusqueda
                : "*",
            fechaI: this.fechaInicialSalidasPanelBusqueda,
            fechaF: this.fechaFinalSalidasPanelBusqueda,
          }
        );

        if (datos.data.status_code == 200) {
          this.mListSalidasFrecuenciasControles.push(...datos.data.datos);

          this.oHeaderRSalidasFrecuenciasControles = [
            "REPORTE DE CUMPLIMIENTO DE SALIDAS, RUTAS Y FRECUENCIAS ",
            "Fechas : " +
              this.fechaInicialSalidasPanelBusqueda +
              " hasta " +
              this.fechaFinalSalidasPanelBusqueda,
            "Unidades : " +
              (this.itemUnidadSalidasPanelBusqueda.length <= 0
                ? "TODAS LAS UNIDADES"
                : this.itemUnidadSalidasPanelBusqueda),
            "Rutas : " +
              (this.mSelectRutaSalidaPanelBusqueda.length <= 0
                ? "TODAS LAS RUTAS"
                : this.getNombresRutasRSalidasFrecuenciasControles(
                    this.mSelectRutaSalidaPanelBusqueda
                  )),
          ];
        } else {
          this.$notify({
            title: "Reporte Salidas Frecuencia Controles",
            message: datos.data.msm,
            type: "default",
          });
        }
      } catch (error) {
        this.$notify({
          title: "Reporte Salidas Frecuencia Controles",
          message: error.toString(),
          type: "danger",
        });
      }
      this.loadingTableRSalidasFrecuenciasControles = false;
    },
  },
  mounted() {
    this.initFechaActualSalidasControles();
    this.readAllUnidadesSalidasControles();
    this.readLineasRSalidasFrecuenciasControles();
    this.readReporteSalidasControles();
  },
};
</script>
<style>
.containerModalRecorridoPanelDespacho {
  display: flex;
}
.cardControlesMarc {
  height: calc(80vh);
  width: 18rem;
}
.current-row {
  background-color: rgba(0, 0, 0, 0.178);
}

.el-table__body tr.current-row > td.el-table__cell {
  background-color: rgba(0, 0, 0, 0.178) !important;
}

.mapa {
  width: 100%;
  height: calc(80vh);
}

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

.cardTextoRPagosVehiculoProduccionPanelDespachoBusqueda {
  display: flex;
  align-items: center;
}

.cardSelectRubrosEstadosPagosVehiculoProduccionContainerPanelDespachoBusqueda {
  display: flex;
  justify-content: space-between;
}
.no-border-card .card-footer {
  border-top: 0;
}

.card-bodyRPagosVehiculoProduccion {
  padding: 0rem !important;
  height: calc(100vh - 13.2rem);
  overflow: none;
}

.card-bodyTopOpcionesRPagosVehiculoPRoduccionPanelDespachoBusqueda {
  padding-top: 0.25rem !important;
}
</style>
