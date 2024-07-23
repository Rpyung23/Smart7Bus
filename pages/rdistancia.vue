<template>
  <div class="content">
    <base-header>
      <div class="align-items-center py-3">
        <card class="no-border-card col" style="margin-bottom: 0.5rem"
          body-classes="px-0 pb-1 card-bodyTopOpcionesRPagosVehiculoPRoduccion cardSelectRubrosEstadosPagosVehiculoProduccionContainer"
          footer-classes="pb-2">
          <div class="cardTextoRPagosVehiculoProduccion">
            <el-select v-model="itemUnidadSalidasPanelBusqueda" multiple filterable style="margin-right: 0.5rem" remote
              placeholder="Ingrese unidad" :remote-method="remoteMethodUnidadesSalidasPanelBusqueda"
              :loading="loadingTableUnidadesSalidasPanelBusquedaloading">
              <el-option v-for="item in optionsUnidadesSalidasPanelBusqueda" :key="item.CodiVehi" :label="item.CodiVehi"
                :value="item.CodiVehi">
              </el-option>
            </el-select>

            <base-input addon-left-icon="ni ni-calendar-grid-58" style="margin-right: 0.5rem">
              <flat-picker slot-scope="{ focus, blur }" @on-open="focus" @on-close="blur" :config="{ allowInput: true }"
                class="form-controlPersonal datepicker" v-model="fechaInicialSalidasPanelBusqueda">
              </flat-picker>
            </base-input>

            <base-input addon-left-icon="ni ni-calendar-grid-58">
              <flat-picker slot-scope="{ focus, blur }" @on-open="focus" @on-close="blur" :config="{ allowInput: true }"
                class="form-controlPersonal datepicker" v-model="fechaFinalSalidasPanelBusqueda">
              </flat-picker>
            </base-input>
          </div>

          <div class="cardSelectRubrosEstadosPagosVehiculoProduccionContainer" size="sm">
            <div class="buttonsAdicionalesRContadorVuelta">
              <base-button icon type="primary" size="sm" @click="readRDistancias()">
                <span class="btn-inner--icon"><i class="el-icon-search"></i></span>
              </base-button>
            <download-excel
              class="btn btn-icon btn-fab btn-success btn-sm"
              v-if="mListaRVelocidades.length > 0"
              :header="headerExcelRPagosVehiculoResumidoProduccion"
              :data="mListaRVelocidades"
              :fields="json_fields_ExcelRPagosVehiculoResumidoProduccion"
              :worksheet="WorksheetExcelRPagosVehiculoResumidoProduccion"
              :name="FileNameExcelRPagosVehiculoResumidoProduccion"
              title="EXPORTAR A EXCEL"
            >
              <span class="btn-inner--icon"
                ><i class="ni ni-collection"></i
              ></span>
            </download-excel>
            <!--<base-button type="danger" size="sm">
              <span class="btn-inner--icon"><i class="ni ni-cloud-download-95"></i></span>
            </base-button>-->
          </div>
          </div>
        </card>

        <!--<card class="no-border-card col" style="margin-bottom: 0.5rem"
          body-classes="px-0 pb-1 card-bodyTopOpcionesRPagosVehiculoPRoduccion cardSelectRubrosEstadosPagosVehiculoProduccionContainer"
          footer-classes="pb-2">
          <div class="cardTextoRPagosVehiculoProduccion">

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

          </div>
        </card>-->

        <card class="no-border-card" style="margin-bottom: 0rem" body-classes="card-bodyRDistancias px-0 pb-1"
          footer-classes="pb-2">
          <div>
            <el-table v-loading="loadingTableRVelocidadesBusquedaloading" 
              element-loading-text="Cargando Datos..."
              :data="mListaRVelocidades" row-key="id"
              class="tablePanelRDistancia" header-row-class-name="thead-dark"
              height="calc(100vh - 10rem)" highlight-current-row>

              <el-table-column v-for="column in tableColumnsUnidadesFlotaVehicular" :key="column.label" v-bind="column">
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
import { getFecha_dd_mm_yyyy,validaRangoFechaNoMas30Dias } from "../util/fechas";

export default {
  mixins: [clientPaginationMixin],
  layout: "DashboardLayout",
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
      loadingTableRVelocidadesBusquedaloading: false,
      itemUnidadSalidasPanelBusqueda: [],
      token: this.$cookies.get("token"),
      fechaInicialSalidasPanelBusqueda: "",
      fechaFinalSalidasPanelBusqueda: "",
      optionsUnidadesSalidasPanelBusqueda: [],
      tableColumnsUnidadesFlotaVehicular: [
        {
          prop: "CodiVehiHistEven",
          label: "Unidad",
          sortable: true,
          minWidth: 140,
        },
        {
          prop: "FechHistEven",
          label: "Fecha",
          minWidth: 160,
        },
        {
          prop: "DescRutaSali_m",
          label: "Ruta",
          minWidth: 250,
        },
        {
          prop: "odometroTrabajado",
          label: "KM TRABAJADO.",
          minWidth: 240,
          
        },
        {
          prop: "odometroMuerto",
          label: "KM MUERTO.",
          minWidth: 160,
        },{
          prop: "odometroTotal",
          label: "KM TOTAL.",
          minWidth: 160,
        }
      ],
      mListaRVelocidades: [],
      mListLineasSalidasPanelBusqueda: [],
      mSelectRutaSalidaPanelBusqueda: [],
      loadingTableUnidadesSalidasPanelBusquedaloading:false,
      WorksheetExcelRPagosVehiculoResumidoProduccion:"",
      FileNameExcelRPagosVehiculoResumidoProduccion:"",
      headerExcelRPagosVehiculoResumidoProduccion:[],
      json_fields_ExcelRPagosVehiculoResumidoProduccion: {
        "Unidad": "CodiVehiHistEven",
        "Fecha": "FechHistEven",
        "Ruta": "DescRutaSali_m",
        "KM TRABAJADOS": "odometroTrabajado",
        "KM MUERTOS": "odometroMuerto",
        "KM TOTALES": "odometroTotal"
      },
    };
  },
  methods: {
    async readAllLineasContadorSalidasPanelBusqueda() {
      var datos = await this.$axios.post(process.env.baseUrl + "/rutes", {
        token: this.token,
        tipo: 3,
      });
      if (datos.data.status_code == 200) {
        this.mListLineasSalidasPanelBusqueda.push(...datos.data.data);
      }
    },
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
    async readRDistancias() {
      this.mListaRVelocidades = []
      this.WorksheetExcelRPagosVehiculoResumidoProduccion = "RPV_W_RD_"+this.itemUnidadSalidasPanelBusqueda+"_"+Date.now()
      this.FileNameExcelRPagosVehiculoResumidoProduccion = "RPV_RD_"+this.itemUnidadSalidasPanelBusqueda+"_"+Date.now()+".xls"

      if(!validaRangoFechaNoMas30Dias(getFecha_dd_mm_yyyy(this.fechaInicialIndicadorCalidad),
      getFecha_dd_mm_yyyy(this.fechaFinalIndicadorCalidad)))
      {
        Notification.warning({
          title: "RAGO MAXIMO 31 DIAS",
          message: 'SOLO SE PERMITE UN MAXIMO DE 31 DIAS',
          duration: 2000,
        });
        return
      }

      this.headerExcelRPagosVehiculoResumidoProduccion = [
              "Reporte Kilometros Recorridos: "+(this.itemUnidadSalidasPanelBusqueda.length == 0  ? "TODAS LAS UNIDADES" : 
              this.itemUnidadSalidasPanelBusqueda),
              "Fechas : "+this.fechaInicialSalidasPanelBusqueda +" hasta "+this.fechaFinalSalidasPanelBusqueda
            ]

      
      console.log(this.mSelectRutaSalidaPanelBusqueda)
      try {
        this.loadingTableRVelocidadesBusquedaloading = true
        var datos = await this.$axios.post(process.env.baseUrl + "/Rdistancias", {
          token: this.token,
          "unidades": this.itemUnidadSalidasPanelBusqueda.length > 0 ? this.itemUnidadSalidasPanelBusqueda : "*",
          fechaI: this.fechaInicialSalidasPanelBusqueda,
          fechaF: this.fechaFinalSalidasPanelBusqueda,
          rutas: this.mSelectRutaSalidaPanelBusqueda.length > 0 ? this.mSelectRutaSalidaPanelBusqueda : "*"
        }, {
          timeout: 600000,
        });

        if (datos.data.status_code == 200) {
          this.mListaRVelocidades.push(...datos.data.datos)
        } else {
          Notification.warning({
            title: "Reporte Recorrido",
            message: datos.data.msm,
          });
        }
      } catch (e) {
        console.log(e)
        Notification.error({
          title: "Reporte Recorrido",
          message: e.toString(),
        });
      }
      this.loadingTableRVelocidadesBusquedaloading = false
    }
  },
  mounted() {
    //this.readHistorialSalidaPanelBusqueda();
    this.initFechaActualSalidaBusquedaPanel()
    this.readAllUnidadesSalidasPanelBusqueda()
    this.readAllLineasContadorSalidasPanelBusqueda()
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

.cardTextoRPagosVehiculoProduccion {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.cardSelectRubrosEstadosPagosVehiculoProduccionContainer {
  display: flex;
  justify-content: space-between;
}

.no-border-card .card-footer {
  border-top: 0;
}

.card-bodyRDistancias {
  padding: 0rem !important;
  height: calc(100vh - 9.5rem);
  overflow: auto;
}


.card-bodyTopOpcionesRPagosVehiculoPRoduccion {
  padding-top: 0.25rem !important;
}
</style>
