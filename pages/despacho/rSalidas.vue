<template>
  <div class="content">
    <base-header>
      <div class="align-items-center py-3">
        <card class="no-border-card col" style="margin-bottom: 0.5rem"
          body-classes="px-0 pb-1 card-bodyTopOpcionesRPagosVehiculoPRoduccion cardSelectRubrosEstadosPagosVehiculoProduccionContainer"
          footer-classes="pb-2">
          <div class="cardTextoRPagosVehiculoProduccion">
            <base-input addon-left-icon="ni ni-calendar-grid-58" style="margin-right: 0.5rem">
              <flat-picker slot-scope="{ focus, blur }" @on-open="focus" @on-close="blur" :config="{ allowInput: true }"
                class="form-controlPersonal datepicker" v-model="fechaInicialSalidasPanelBusqueda">
              </flat-picker>
            </base-input>

            <el-select v-model="mSelectRutaSalidaPanelBusqueda" multiple collapse-tags placeholder="Lineas">
              <el-option v-for="item in mListLineasSalidasPanelBusqueda" :key="item.LetrRuta" :label="item.DescRuta"
                :value="item.LetrRuta">
              </el-option>
            </el-select>

          </div>

          <div class="cardSelectRubrosEstadosPagosVehiculoProduccionContainer">
            <div class="buttonCenterEndDerecha">
            <base-button icon type="primary" title="Buscar" size="sm" @click="readRSalidasDespacho()">
              <span class="btn-inner--icon"><i class="el-icon-search"></i></span>
            </base-button>
            <!--<download-excel
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
            </download-excel>-->
            <base-button title="PDF" type="danger" size = "sm">
              <span class="btn-inner--icon"><i class="ni ni-cloud-download-95"></i></span>
            </base-button>

          </div>
          </div>





        </card>

        <card class="no-border-card" style="margin-bottom: 0rem"
          body-classes="card-bodyRPagosVehiculoProduccionRSalidas px-0 pb-1" footer-classes="pb-2">
          <div>
            <el-table v-loading="loadingTableUnidadesSalidasPanelBusqueda" element-loading-text="Cargando Datos..."
              :data="mListRSalidas" row-key="id"
              :row-class-name="tableRowClassNameSalidasPanelBusqueda"
              header-row-class-name="thead-dark" height="calc(100vh - 10rem)"
              >
              <el-table-column v-for="column in tableRSalidasDespachos" :key="column.label" v-bind="column">
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
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
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
import { FechaStringToHour } from "../../util/fechas"
import isThisHour from 'date-fns/esm/isThisHour';

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
      baseURlPDFPanelDespachoTarjeta: "",
      mListLineasSalidasPanelBusqueda: [],
      mListRSalidas : [],
      loadingTableUnidadesSalidasPanelBusqueda: false,
      mSelectRutaSalidaPanelBusqueda: [],
      token: this.$cookies.get("token"),
      fechaInicialSalidasPanelBusqueda: "",
      fechaFinalSalidasPanelBusqueda: "",
      tableRSalidasDespachos: [
        {
          prop: "idSali_m",
          label: "Salida",
          minWidth: 120,
        },
        {
          prop: "CodiVehiSali_m",
          label: "Unidad",
          minWidth: 120,
        },
        {
          prop: "HoraSaliProgSali_m",
          label: "H. Salida",
          minWidth: 130,
        },
        {
          prop: "DescRuta",
          label: "Ruta",
          minWidth: 350,
        },
        {
          prop: "NumeVuelSali_m",
          label: "Vuelta",
          minWidth: 110,
        },
        {
          prop: "DescFrec",
          label: "Frecuencia",
          minWidth: 350,
        },
        {
          prop: "atencion",
          label: "Atención",
          minWidth: 300,
        },
        {
          prop: "MontInfrUnidSali_m",
          label: "Multa ($)",
          minWidth: 120,
        },
        {
          prop: "recaudo",
          label: "Recaudo ($)",
          minWidth: 150
        },
      ],
      mListaSalidasPanelBusqueda: [],
      oCenter: { lat: -1.249546, lng: -78.585376 },
      oZoom: 7
    };
  },
  methods: {
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
    async readAllLineasContadorSalidasPanelBusqueda() {
      var datos = await this.$axios.post(process.env.baseUrl + "/rutes", {
        token: this.token,
        tipo:3
      });
      if (datos.data.status_code == 200) {
        this.mListLineasSalidasPanelBusqueda.push(...datos.data.data);
      }
    },
    async readRSalidasDespacho()
    {
      this.mListRSalidas = []
      this.loadingTableUnidadesSalidasPanelBusqueda = true
      var datos = await this.$axios.post(process.env.baseUrl+"/RSalidas",{
        token : this.token,
        fecha : this.fechaInicialSalidasPanelBusqueda,
        rutas : this.mSelectRutaSalidaPanelBusqueda.length > 0 ? this.mSelectRutaSalidaPanelBusqueda : "*"
      })
      this.mListRSalidas.push(...datos.data.datos)
      this.loadingTableUnidadesSalidasPanelBusqueda = false
    }
  },
  mounted() {
    this.initFechaActualSalidaBusquedaPanel()
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

.card-bodyRPagosVehiculoProduccionRSalidas {
  padding: 0rem;
  padding-top: 00.25rem;
  padding-bottom: 00.5rem;
  height: calc(100vh - 9.5rem);
  overflow: auto;
}

.card-bodyTopOpcionesRPagosVehiculoPRoduccion {
  padding-top: 0.25rem !important;
}
</style>
