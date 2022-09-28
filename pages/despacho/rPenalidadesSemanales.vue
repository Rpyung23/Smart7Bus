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
            <base-input
              addon-left-icon="ni ni-calendar-grid-58"
              style="margin-right: 0.5rem"
            >
              <flat-picker
                slot-scope="{ focus, blur }"
                @on-open="focus"
                @on-close="blur"
                :config="{ allowInput: true }"
                format="yyyy/MM/dd"
                class="form-controlPersonal datepicker"
                v-model="fechaDia1SalidasPanelBusqueda"
              >
              </flat-picker>
            </base-input>

            <p style="margin: auto">
              <strong style="margin-right: 0.5rem">Hasta</strong>
            </p>

            <base-input
              addon-left-icon="ni ni-calendar-grid-58"
              style="margin-right: 0.5rem"
              disabled
            >
              <flat-picker
                slot-scope="{ focus, blur }"
                @on-open="focus"
                @on-close="blur"
                :config="{ allowInput: true }"
                format="yyyy/MM/dd"
                class="form-controlPersonal datepicker"
                v-model="fechaDia2SalidasPanelBusqueda"
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
                @click="readApiPenalidades()"
              >
                <span class="btn-inner--icon"
                  ><i class="el-icon-search"></i
                ></span>
              </base-button>

              <base-button
                type="danger"
                size="sm"
                v-if="mListDatosPenalidades.length > 0 ? true : false"
                @click="exportPdfRPenalidadesSemanales()"
                title="Exportar PDF"
              >
                <span class="btn-inner--icon"
                  ><i class="ni ni-single-copy-04"></i
                ></span>
              </base-button>
            </div>
          </div>
        </card>

        <card
          class="no-border-card"
          style="margin-bottom: 0rem"
          body-classes="card-bodyRPenalidadesSemanales px-0 pb-1"
          footer-classes="pb-2"
        >
          <div>
            <el-table
              element-loading-text="Cargando Datos..."
              row-key="id"
              v-loading="loadingPenalidadesSemanales"
              :data="mListDatosPenalidades"
              class="tablePanelControlProduccion"
              header-row-class-name="thead-dark"
              height="calc(100vh - 9.5rem)"
            >
              <el-table-column prop="CodiVehiSali_m" label="Unidad" width="150">
              </el-table-column>

              <el-table-column
                prop="HoraSaliProgSali_m"
                label="F. Inicio"
                width="170"
              >
              </el-table-column>

              <el-table-column
                prop="HoraLlegProgSali_m"
                label="F. Final"
                width="170"
              >
              </el-table-column>

              <el-table-column
                prop="totalSalidas"
                label="Total Salidas"
                width="150"
              >
              </el-table-column>

              <el-table-column
                prop="FaltSali_dAdelanto"
                label="F. Adelanto"
                width="150"
              >
              </el-table-column>

              <el-table-column
                prop="FaltSali_dAtraso"
                label="F. Atraso"
                width="150"
              >
              </el-table-column>

              <el-table-column
                prop="EstadoFaltasSumatoria"
                label="Estado"
                width="325"
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
import moment from "moment";
import { getFechatoDDMM, getFecha_dd_mm_yyyy } from "../../util/fechas";
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
import { getBase64LogoReportes } from "../../util/logoReport";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import RouteBreadCrumb from "@/components/argon-core/Breadcrumb/RouteBreadcrumb";
import { BasePagination } from "@/components/argon-core";
import clientPaginationMixin from "~/components/tables/PaginatedTables/clientPaginationMixin";
import swal from "sweetalert2";
import Tabs from "@/components/argon-core/Tabs/Tabs";
import TabPane from "@/components/argon-core/Tabs/Tab";
import { FechaStringToHour } from "../../util/fechas";

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
      token: this.$cookies.get("token"),
      fechaDia1SalidasPanelBusqueda: "",
      fechaDia2SalidasPanelBusqueda: "",
      modalSalidasTarjetaPanelDespachoBusqueda: false,
      tableColumnPenalidades: [],
      mListDatosPenalidades: [],
      loadingPenalidadesSemanales: false,
    };
  },
  methods: {
    initPrimerDiaSemanaActualSalidaBusquedaPanel() {
      var fecha = new Date();
      var mes = fecha.getMonth() + 1;
      var day = fecha.getDate();
      var format =
        fecha.getFullYear() +
        "-" +
        (mes < 10 ? "0" + mes : mes) +
        "-" +
        (day < 10 ? "0" + day : day);

      this.fechaDia1SalidasPanelBusqueda = format;
      this.fechaDia2SalidasPanelBusqueda = format;
    },
    async readApiPenalidades() {
      this.mListDatosPenalidades = [];
      this.loadingPenalidadesSemanales = true;

      try {
        var obj = {
          token: this.token,
          fechaI: this.fechaDia1SalidasPanelBusqueda,
          fechaF: this.fechaDia2SalidasPanelBusqueda,
        };

        console.log(obj);

        var datos = await this.$axios.post(
          process.env.baseUrl + "/readPenalidadesSemanales",
          obj
        );

        console.log(datos.data);
        this.mListDatosPenalidades.push(...datos.data.datos);
      } catch (error) {
        console.log(error);
      }

      this.loadingPenalidadesSemanales = false;
    },
    exportPdfRPenalidadesSemanales() 
    {

      var empresa = [
        {
          text: "Empresa : " + this.$cookies.get("nameEmpresa"),
          fontSize: 11,
          alignment: "left",
        },
      ];

      var desde_hasta = [
        {
          text:
            "Fecha : " +
            this.fechaDia1SalidasPanelBusqueda +
            " hasta " +
            this.fechaDia2SalidasPanelBusqueda,
          fontSize: 11,
          alignment: "left",
        },
      ];

      var mList = [];
      mList.push([
        {
          text: "UNIDAD",
          fontSize: 8.5,
          bold: true,
          fillColor: "#039BC4",
          color: "white",
          alignment: "center",
        },
        {
          text: "F. INICIO",
          fontSize: 8.5,
          bold: true,
          fillColor: "#039BC4",
          color: "white",
          alignment: "center",
        },
        {
          text: "F. FINAL",
          fontSize: 8.5,
          bold: true,
          fillColor: "#039BC4",
          color: "white",
          alignment: "center",
        },
        {
          text: "T. SALIDAS",
          fontSize: 8.5,
          bold: true,
          fillColor: "#039BC4",
          color: "white",
          alignment: "center",
        },
        {
          text: "F. ADELANTO",
          fontSize: 8.5,
          bold: true,
          fillColor: "#039BC4",
          color: "white",
          alignment: "center",
        },
        {
          text: "F. ATRASO",
          fontSize: 8.5,
          bold: true,
          fillColor: "#039BC4",
          color: "white",
          alignment: "center",
        },
        {
          text: "ESTADO",
          fontSize: 8.5,
          bold: true,
          fillColor: "#039BC4",
          color: "white",
          alignment: "center",
        },
      ]);

      for (var i = 0; i < this.mListDatosPenalidades.length; i++) {
        var obj = [
          { text: this.mListDatosPenalidades[i].CodiVehiSali_m, fontSize: 8.5, alignment: "center",color: this.mListDatosPenalidades[i].EstadoFaltasSumatoria == '' ? "black" : "red" },
          { text: this.mListDatosPenalidades[i].HoraSaliProgSali_m, fontSize: 8.5, alignment: "center",color: this.mListDatosPenalidades[i].EstadoFaltasSumatoria == '' ? "black" : "red" },
          { text: this.mListDatosPenalidades[i].HoraLlegProgSali_m, fontSize: 8.5, alignment: "center",color: this.mListDatosPenalidades[i].EstadoFaltasSumatoria == '' ? "black" : "red" },
          { text: this.mListDatosPenalidades[i].totalSalidas, fontSize: 8.5, alignment: "center",color: this.mListDatosPenalidades[i].EstadoFaltasSumatoria == '' ? "black" : "red" },
          { text: this.mListDatosPenalidades[i].FaltSali_dAdelanto, fontSize: 8.5, alignment: "center",color: this.mListDatosPenalidades[i].EstadoFaltasSumatoria == '' ? "black" : "red" },
          { text: this.mListDatosPenalidades[i].FaltSali_dAtraso, fontSize: 8.5, alignment: "center",color: this.mListDatosPenalidades[i].EstadoFaltasSumatoria == '' ? "black" : "red" },
         {
            text: this.mListDatosPenalidades[i].EstadoFaltasSumatoria,
            fontSize: 8.5,
            color: this.mListDatosPenalidades[i].EstadoFaltasSumatoria == '' ? "black" : "red",
            alignment: "left",
          },
        ];
        mList.push(obj);
      }

      var docDefinition = {
        pageSize: "A4",
        pageMargins: [40, 80, 40, 60],
        header: {
          margin: 15,
          columns: [
            {
              image: getBase64LogoReportes(this.$cookies.get("empresa")),
              width: 100,
              height: 50,
              margin: [30, 0, 0, 0],
            },
            {
              layout: "noBorders",
              table: {
                widths: ["*"],
                body: [
                  [
                    {
                      text: "REPORTE PENALIDADES SEMANALES",
                      alignment: "center",
                      fontSize: 16,
                      bold: true,
                    },
                  ],
                  [
                    {
                      text: "Dir : Av Chasquis y Rio Guayllabamba (Ambato) Email : vigitracklatam@gmail.com",
                      alignment: "center",
                      fontSize: 8,
                    },
                  ],
                  [
                    {
                      text: "Tel : 0995737084 - 032421698 Sitio Web : www.vigitrackecuador.com",
                      alignment: "center",
                      fontSize: 8,
                    },
                  ],
                ],
              },
            },
          ],
        },
        content: [
          {
            layout: "noBorders",
            table: {
              headerRows: 0,
              widths: [450, 450],
              body: [empresa, desde_hasta],
            },
          },
          {
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              headerRows: 0,
              widths: [30, 40, 100, 40, 90, 50, 60, 60, 35, 35, 90],
              body: [[]],
            },
          },
          {
            table: {
              headerRows: 0,
              widths: [40, 60, 60, 45, 70, 50, 130],
              body: mList,
            },
          },
        ],
      };
      
      pdfMake.createPdf(docDefinition).download("RPS_" + Date.now());
    },
  },
  mounted() {
    this.initPrimerDiaSemanaActualSalidaBusquedaPanel();
    //this.readApiPenalidades();
  },
};
</script>
<style>
.containerModalRecorridoPanelDespacho {
  display: flex;
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

.card-bodyRPenalidadesSemanales {
  padding: 0rem !important;
  height: calc(100vh - 9.5rem);
  overflow: none;
}

.card-bodyTopOpcionesRPagosVehiculoPRoduccionPanelDespachoBusqueda {
  padding-top: 0.25rem !important;
}
</style>
