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
                disabled
                format="yyyy/MM/dd"
                class="form-controlPersonal datepicker"
                v-model="fechaDia7SalidasPanelBusqueda"
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
                @click="readSalidasPanelBusqueda()"
              >
                <span class="btn-inner--icon"
                  ><i class="el-icon-search"></i
                ></span>
              </base-button>

              <base-button
                type="danger"
                size="sm"
                @click="exportPdfSalidasPanelBusqueda()"
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
              <el-table-column prop="CodiVehi" label="Unidad" width="150">
              </el-table-column>

              <el-table-column
                v-for="column in tableColumnPenalidades"
                :key="column.label"
                v-bind="column"
              >
              </el-table-column>

              <el-table-column prop="Total" label="Total" width="145">
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
import {getFechatoDDMM,getFecha_dd_mm_yyyy} from "../../util/fechas"
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
      fechaDia3SalidasPanelBusqueda: "",
      fechaDia4SalidasPanelBusqueda: "",
      fechaDia5SalidasPanelBusqueda: "",
      fechaDia6SalidasPanelBusqueda: "",
      fechaDia7SalidasPanelBusqueda: "",
      modalSalidasTarjetaPanelDespachoBusqueda: false,
      tableColumnPenalidades: [],
      mListDatosPenalidades:[],
      loadingPenalidadesSemanales:false
    };
  },
  methods: {
    initPrimerDiaSemanaActualSalidaBusquedaPanel() {
      this.fechaDia1SalidasPanelBusqueda = moment().startOf("week").toDate();
      this.fechaDia2SalidasPanelBusqueda = moment().startOf("week").toDate();
      this.fechaDia3SalidasPanelBusqueda = moment().startOf("week").toDate();
      this.fechaDia4SalidasPanelBusqueda = moment().startOf("week").toDate();
      this.fechaDia5SalidasPanelBusqueda = moment().startOf("week").toDate();
      this.fechaDia6SalidasPanelBusqueda = moment().startOf("week").toDate();
      this.fechaDia7SalidasPanelBusqueda = moment().startOf("week").toDate();

      this.fechaDia1SalidasPanelBusqueda.setDate(
        this.fechaDia1SalidasPanelBusqueda.getDate() + 1
      );
      this.fechaDia2SalidasPanelBusqueda.setDate(
        this.fechaDia1SalidasPanelBusqueda.getDate() + 1
      );
      this.fechaDia3SalidasPanelBusqueda.setDate(
        this.fechaDia2SalidasPanelBusqueda.getDate() + 1
      );
      this.fechaDia4SalidasPanelBusqueda.setDate(
        this.fechaDia3SalidasPanelBusqueda.getDate() + 1
      );
      this.fechaDia5SalidasPanelBusqueda.setDate(
        this.fechaDia4SalidasPanelBusqueda.getDate() + 1
      );
      this.fechaDia6SalidasPanelBusqueda.setDate(
        this.fechaDia5SalidasPanelBusqueda.getDate() + 1
      );
      this.fechaDia7SalidasPanelBusqueda.setDate(
        this.fechaDia6SalidasPanelBusqueda.getDate() + 1
      );

      this.tableColumnPenalidades.push({
        prop: "Dia1",
        label: getFechatoDDMM(this.fechaDia1SalidasPanelBusqueda),
        minWidth: 140,
      });

      this.tableColumnPenalidades.push({
        prop: "Dia2",
        label: getFechatoDDMM(this.fechaDia2SalidasPanelBusqueda),
        minWidth: 140,
      });

      this.tableColumnPenalidades.push({
        prop: "Dia3",
        label: getFechatoDDMM(this.fechaDia3SalidasPanelBusqueda),
        minWidth: 140,
      });

      this.tableColumnPenalidades.push({
        prop: "Dia4",
        label: getFechatoDDMM(this.fechaDia4SalidasPanelBusqueda),
        minWidth: 140,
      });

      this.tableColumnPenalidades.push({
        prop: "Dia5",
        label: getFechatoDDMM(this.fechaDia5SalidasPanelBusqueda),
        minWidth: 140,
      });

      this.tableColumnPenalidades.push({
        prop: "Dia6",
        label: getFechatoDDMM(this.fechaDia6SalidasPanelBusqueda),
        minWidth: 140,
      });

      this.tableColumnPenalidades.push({
        prop: "Dia7",
        label: getFechatoDDMM(this.fechaDia7SalidasPanelBusqueda),
        minWidth: 140,
      });
    },
    async readApiPenalidades() 
    {
      this.loadingPenalidadesSemanales = true

      try {
        var obj = {
          token: this.token,
          fecha1: getFecha_dd_mm_yyyy(this.fechaDia1SalidasPanelBusqueda)+" 00:00:00",
          fecha1F: getFecha_dd_mm_yyyy(this.fechaDia1SalidasPanelBusqueda)+" 23:59:59",
          fecha2: getFecha_dd_mm_yyyy(this.fechaDia2SalidasPanelBusqueda)+" 00:00:00",
          fecha2F: getFecha_dd_mm_yyyy(this.fechaDia2SalidasPanelBusqueda)+" 23:59:59",
          fecha3: getFecha_dd_mm_yyyy(this.fechaDia3SalidasPanelBusqueda)+" 00:00:00",
          fecha3F: getFecha_dd_mm_yyyy(this.fechaDia3SalidasPanelBusqueda)+" 23:59:59",
          fecha4: getFecha_dd_mm_yyyy(this.fechaDia4SalidasPanelBusqueda)+" 00:00:00",
          fecha4F: getFecha_dd_mm_yyyy(this.fechaDia4SalidasPanelBusqueda)+" 23:59:59",
          fecha5: getFecha_dd_mm_yyyy(this.fechaDia5SalidasPanelBusqueda)+" 00:00:00",
          fecha5F: getFecha_dd_mm_yyyy(this.fechaDia5SalidasPanelBusqueda)+" 23:59:59",
          fecha6: getFecha_dd_mm_yyyy(this.fechaDia6SalidasPanelBusqueda)+" 00:00:00",
          fecha6F: getFecha_dd_mm_yyyy(this.fechaDi61SalidasPanelBusqueda)+" 23:59:59",
          fecha7: getFecha_dd_mm_yyyy(this.fechaDia7SalidasPanelBusqueda)+" 00:00:00",
          fecha7F: getFecha_dd_mm_yyyy(this.fechaDia7SalidasPanelBusqueda)+" 23:59:59"
        }
      
        console.log(obj)
      
      var datos = await this.$axios.post(
        process.env.baseUrl + "/readPenalidadesSemanales",
        obj
      );

      console.log(datos.data)
      this.mListDatosPenalidades.push(...datos.data.datos)
      } catch (error) {
        console.log(error)
      }

      this.loadingPenalidadesSemanales = false

    },
    exportPdfSalidasPanelBusqueda() {
      var empresa = [
        {
          text: "Empresa : " + this.$cookies.get("nameEmpresa"),
          fontSize: 8.5,
          bold: true,
          alignment: "left",
        },
      ];
      var unidad = [
        {
          text:
            "Flota Vehicular : " +
            (this.itemUnidadSalidasPanelBusqueda.length > 0
              ? this.itemUnidadSalidasPanelBusqueda.toString()
              : "Toda la flota"),
          fontSize: 8.5,
          bold: true,
          alignment: "left",
        },
      ];
      var ruta = [
        { text: "Rutas : ", fontSize: 8.5, bold: true, alignment: "left" },
      ];
      var desde_hasta = [
        {
          text:
            "Fecha : " +
            this.fechaInicialSalidasPanelBusqueda +
            " hasta " +
            this.fechaFinalSalidasPanelBusqueda,
          fontSize: 8.5,
          bold: true,
          alignment: "left",
        },
      ];

      var resultadoString = [
        [
          {
            text: "Unidad",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },
          {
            text: "Salida",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },
          {
            text: "Ruta",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },
          {
            text: "N° Vuelta",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },
          {
            text: "H.Salida",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },
          {
            text: "H. Llegada",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },
          {
            text: "T. Atraso",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },
          {
            text: "T. Adelanto",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },
          {
            text: "V. Max",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },
          {
            text: "PEN ($)",
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
        ],
      ];

      for (var i = 0; i < this.mListaSalidasPanelBusqueda.length; i++) {
        var estado =
          this.mListaSalidasPanelBusqueda[i].EstaSali_m <= 1
            ? "DIFERIDA"
            : this.mListaSalidasPanelBusqueda[i].EstaSali_m == 4
            ? "ANULADO"
            : this.mListaSalidasPanelBusqueda[i].EstaSali_m == 2
            ? "EN RUTA"
            : this.mListaSalidasPanelBusqueda[i].EstaSali_m == 3 &&
              parseFloat(this.mListaSalidasPanelBusqueda[i].PenaCtrlSali_d) > 0
            ? "FINALIZADO CON PENALIDAD"
            : "FINALIZADA SIN PENALIDAD";
        var arrys = [
          {
            text: this.mListaSalidasPanelBusqueda[i].CodiVehiSali_m,
            fontSize: 8.5,
          },
          { text: this.mListaSalidasPanelBusqueda[i].idSali_m, fontSize: 8.5 },
          {
            text: this.mListaSalidasPanelBusqueda[i].DescRutaSali_m,
            fontSize: 8.5,
          },
          {
            text: this.mListaSalidasPanelBusqueda[i].NumeVuelSali_m,
            fontSize: 8.5,
          },
          {
            text: this.mListaSalidasPanelBusqueda[i].HoraSaliProgSali_mF,
            fontSize: 8.5,
          },
          {
            text: this.mListaSalidasPanelBusqueda[i].HoraLlegProgSali_m,
            fontSize: 8.5,
          },
          {
            text: this.mListaSalidasPanelBusqueda[i].atrasoTime,
            fontSize: 8.5,
          },
          {
            text: this.mListaSalidasPanelBusqueda[i].adelantoTime,
            fontSize: 8.5,
          },
          {
            text: this.mListaSalidasPanelBusqueda[i].VeloMaxiSali_m,
            fontSize: 8.5,
          },
          {
            text: this.mListaSalidasPanelBusqueda[i].PenaCtrlSali_d,
            fontSize: 8.5,
          },
          { text: estado, fontSize: 8.5 },
        ];
        resultadoString.push(arrys);
      }

      var docDefinition = {
        pageOrientation: "landscape",
        pageSize: "A4",
        content: [
          {
            layout: "noBorders",
            table: {
              headerRows: 0,
              widths: [450, 450, 450, 450],
              body: [empresa, unidad, ruta, desde_hasta],
            },
          },
          {
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              headerRows: 0,
              widths: [30, 40, 100, 40, 90, 50, 60, 60, 35, 35, 90],
              body: resultadoString,
            },
          },
        ],
      };
      var win = window.open("", "_blank");
      pdfMake.createPdf(docDefinition).open({}, win);
    },
  },
  mounted() {
    this.initPrimerDiaSemanaActualSalidaBusquedaPanel()
    this.readApiPenalidades()
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
