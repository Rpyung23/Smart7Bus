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
                class="form-controlPersonal datepicker" v-model="fechaInicialRAnt">
              </flat-picker>
            </base-input>

            <base-input addon-left-icon="ni ni-calendar-grid-58">
              <flat-picker slot-scope="{ focus, blur }" @on-open="focus" @on-close="blur" :config="{ allowInput: true }"
                class="form-controlPersonal datepicker" v-model="fechaFinalRAnt">
              </flat-picker>
            </base-input>
          </div>

          <div class="cardSelectRubrosEstadosPagosVehiculoProduccionContainer">
            <div class="buttonsAdicionalesRContadorVuelta">
              <base-button icon title="BUSCAR" type="primary" @click="readReporteAnt()" size="sm">
                <span class="btn-inner--icon"><i class="el-icon-search"></i></span>
              </base-button>
            <!--<download-excel
              class="btn btn-outline-success"
              outline
              :header="headerExcelRPagosVehiculoProduccion"
              :data="mListaRVelocidades"
              :fields="json_fields_excelRPagosVehiculoProduccion"
              :worksheet="WorksheetExcelRPagosVehiculoProduccion"
              :name="FileNameExcelRPagosVehiculoProduccion"
            >
              <span class="btn-inner--icon"
                ><i class="ni ni-collection"></i
              ></span>
              <span class="btn-inner--text"> Excel</span>
            </download-excel>-->
              <base-button type="danger" @click="exportPdfRANT()" v-if="mListaRAnt.length > 0" title="EXPORTAR A PDF" size="sm">
                <span class="btn-inner--icon"><i class="ni ni-cloud-download-95"></i></span>
              </base-button>
            </div>
          </div>
        </card>

        <card class="no-border-card" style="margin-bottom: 0rem" body-classes="card-bodyRVelocidades px-0 pb-1"
          footer-classes="pb-2">
          <div>
            <el-table v-loading="loadingTableRVelocidadesBusquedaloading" element-loading-text="Cargando Datos..."
              :data="mListaRAnt" row-key="id"
              class="tablePanelControlProduccion" header-row-class-name="thead-dark"
              height="calc(100vh - 9rem)" highlight-current-row>

              <el-table-column v-for="column in tableColumnsRAnt" :key="column.label" v-bind="column">
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
import { getBase64LogoReportes } from "../util/logoReport";
import  pdfMake from 'pdfmake/build/pdfmake.js';
import pdfFonts from 'pdfmake/build/vfs_fonts.js';

pdfMake.vfs = pdfFonts.pdfMake.vfs;


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
      loadingTableRVelocidadesBusquedaloading: false,
      token: this.$cookies.get("token"),
      fechaInicialRAnt: "",
      fechaFinalRAnt: "",
      tableColumnsRAnt: [
        {
          prop: "CodiVehi",
          label: "Unidad",
          minWidth: 110
        },
        {
          prop: "PlacVehi",
          label: "Placa",
          minWidth: 140
        },
        {
          prop: "AliaObse",
          label: "Propietario/Chofer",
          minWidth: 200
        },
        {
          prop: "HoraSaliProgSali_m",
          label: "H. Salida",
          minWidth: 180
        },
        {
          prop: "HoraLlegProgSali_m",
          label: "H. Llegada",
          minWidth: 180
        },
        {
          prop: "DescRuta",
          label: "Ruta",
          minWidth: 270
        },
        {
          prop: "grupo",
          label: "Grupo",
          minWidth: 150
        },
        {
          prop: "NumeVuelSali_m",
          label: "Vuelta",
          minWidth: 120
        },
        {
          prop: "SumaMinuPosiSali_m",
          label: "Faltas",
          minWidth: 120
        }
      ],
      mListaRAnt: []
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

      this.fechaInicialRAnt = format;
      this.fechaFinalRAnt = format;
    },
    async readReporteAnt()
    {
      this.loadingTableRVelocidadesBusquedaloading = true
      this.mListaRAnt = []
      try {
              var datos = await this.$axios.post(process.env.baseUrl+"/RAnt",{
        token:this.token,
        fechaI: this.fechaInicialRAnt,
        fechaF: this.fechaFinalRAnt
      })
      if(datos.data.status_code == 200)
      {
        this.mListaRAnt.push(...datos.data.datos)
      }else if(datos.data.status_code == 300)
      {
          Notification.warning({
            title: "Reporte ANT",
            message: "No existen datos disponibles.",
          });
      }else{
        Notification.error({
            title: "Reporte ANT",
            message: datos.data.msm
          });
      }
      } catch (error) {
        Notification.error({
            title: "Reporte ANT",
            message: error.toString()
          });
      }
      this.loadingTableRVelocidadesBusquedaloading = false
    },
    exportPdfRANT()
    {
      var empresa = [
        {
          text: "Empresa : " + this.$cookies.get("nameEmpresa"),
          fontSize: 9,
          alignment: "left",
        },
      ];
      var unidad = [
        {
          text:
            "Unidad : TODAS LAS UNIDADES",
          fontSize: 9,
          alignment: "left",
        },
      ];
      var ruta = [
        {
          text:
            "Ruta : TODAS LAS RUTAS",
          fontSize: 9,
          alignment: "left",
        },
      ];
      var desde_hasta = [
        {
          text:
            "Fecha Salida : " + this.fechaInicialRAnt +" Hasta " + this.fechaFinalRAnt,
          fontSize: 9,
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
            text: "Placa",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },
          {
            text: "Propietario / Chofer",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },
          {
            text: "H. Salida",
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
            text: "Ruta",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },
          {
            text: "Grupo",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },          {
            text: "Vuelta",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },
          {
            text: "Falta",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          }
        ],
      ]


      for (var i = 0; i < this.mListaRAnt.length; i++) 
      {
        var arrys = [
          {
            text: this.mListaRAnt[i].CodiVehi,
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text: this.mListaRAnt[i].PlacVehi,
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text: this.mListaRAnt[i].AliaObse,
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text: this.mListaRAnt[i].HoraSaliProgSali_m,
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text: this.mListaRAnt[i].HoraLlegProgSali_m,
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text: this.mListaRAnt[i].DescRuta,
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text: this.mListaRAnt[i].grupo,
            fontSize: 8.5,
            alignment: "center",
          },          {
            text: this.mListaRAnt[i].NumeVuelSali_m,
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text: this.mListaRAnt[i].SumaMinuPosiSali_m,
            fontSize: 8.5,
            alignment: "center",
          }
        ]
        resultadoString.push(arrys);
      }

      var docDefinition = {
        pageSize: "A4",
        pageOrientation: 'landscape',
        pageMargins: [30, 80, 40, 30],
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
                      text: "REPORTE ANT",
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
              /*widths: ['*'],
              body: [empresa]*/
              widths: [450, 450, 450, 450],
              body: [empresa, unidad, ruta, desde_hasta],
            },
          },
          {
            table: {
              headerRows: 0,
              widths: [40, 50, 140, 60, 60, 140,90,40,40],
              body: resultadoString,
              //body: [[]],
            },
          }
        ],
      };

      pdfMake.createPdf(docDefinition).download("RANT" + Date.now());
    }
  },
  mounted() {
    //this.readHistorialSalidaPanelBusqueda();
    this.initFechaActualSalidaBusquedaPanel()
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
}

.cardSelectRubrosEstadosPagosVehiculoProduccionContainer {
  display: flex;
  justify-content: space-between;
}

.no-border-card .card-footer {
  border-top: 0;
}

.card-bodyRVelocidades {
  padding: 0rem !important;
  height: calc(100vh - 9rem);
  overflow: auto;
}

.card-bodyTopOpcionesRPagosVehiculoPRoduccion {
  padding-top: 0.25rem !important;
}
</style>
