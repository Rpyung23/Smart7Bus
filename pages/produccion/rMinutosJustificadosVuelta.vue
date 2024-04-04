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
              title="Buscar"
              addon-left-icon="ni ni-calendar-grid-58"
              style="margin-right: 0.5rem;margin-bottom: 0rem !important;"
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

            <base-input
              title="Exportar a PDF"
              addon-left-icon="ni ni-calendar-grid-58"
            >
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

          <div class="buttonsAdicionalesRVelocidad">
            <base-button
              icon
              type="primary"
              size="sm"
              @click="readRMinutosJustificadosVuelta()"
            >
              <span class="btn-inner--icon"
                ><i class="el-icon-search"></i
              ></span>
            </base-button>

            <download-excel
                title="EXPORTAR A EXCEL"
                class="btn btn-icon btn-fab btn-success btn-sm"
                :header="headerExcelRPagosVehiculoProduccion"
                :data="mListaRMinutoJustificadoVuelta"
                :fields="json_fields_excelRPagosVehiculoProduccion"
                :worksheet="WorksheetExcelRPagosVehiculoProduccion"
                :name="FileNameExcelRPagosVehiculoProduccion"
                v-if="mListaRMinutoJustificadoVuelta.length > 0 ? true : false"
              >
                <span class="btn-inner--icon"
                  ><i class="ni ni-collection"></i
                ></span>
              </download-excel>
              
          </div>
        </card>

        <card
          class="no-border-card col"
          style="margin-bottom: 0.5rem"
          body-classes="px-0 pb-1 card-bodyTopOpcionesRPagosVehiculoPRoduccion cardSelectRubrosEstadosPagosVehiculoProduccionContainer"
          footer-classes="pb-2"
        >
          <div class="cardTextoRPagosVehiculoProduccion">
            <el-select
              style="margin-right: 0.5rem"
              collapse-tags
              v-if="mListaGruposPenalidadesSemanales.length > 0 ? true : false"
              v-model="itemGruposPenalidadesSemanales"
              multiple
              placeholder="Grupos"
            >
              <el-option
                v-for="item in mListaGruposPenalidadesSemanales"
                :key="item.id"
                :label="item.descripcion"
                :value="item.id"
              >
              </el-option>
            </el-select>

            <el-select
              v-model="modelTiposEvento"
              multiple
              collapse-tags
              style="margin-right: 0.5rem"
              placeholder="Rutas"
              :loading="loadingTableUnidadesSalidasPanelBusquedaloading"
            >
              <el-option
                v-for="item in mListaRutasSalidasSemanales"
                :key="item.LetrRuta"
                :label="item.DescRuta"
                :value="item.LetrRuta"
              >
              </el-option>
            </el-select>
          </div>
        </card>

        <card
          class="no-border-card"
          style="margin-bottom: 0rem"
          body-classes="card-bodyRVelocidades px-0 pb-1"
          footer-classes="pb-2"
        >
          <div>
            <el-table
              v-loading="loadingTableRVelocidadesBusquedaloading"
              element-loading-text="Cargando Datos..."
              :data="mListaRMinutoJustificadoVuelta"
              row-key="id"
              class="tablePanelControlProduccion"
              header-row-class-name="thead-dark"
              height="calc(100vh - 13rem)"
            >
              <!--<el-table-column label="Actions" width="120">
                <template slot-scope="scope">
                  <base-button
                    size="sm"
                    title="UBICAR EVENTO EN MAPA"
                    @click="showMapaFueraRutas(scope.row)"
                    type="success"
                    ><i class="ni ni-world"></i
                  ></base-button>
                </template>
              </el-table-column>-->

              <el-table-column
                v-for="column in tableColumnsUnidadesFlotaVehicular"
                :key="column.label"
                v-bind="column"
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
import pdfMake from "pdfmake/build/pdfmake.js";
import pdfFonts from "pdfmake/build/vfs_fonts.js";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import { getBase64LogoReportes } from "../../util/logoReport";
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
  Switch,
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
    [Checkbox.name]: Checkbox,
    [CheckboxButton.name]: CheckboxButton,
    [CheckboxGroup.name]: CheckboxGroup,
    [Popover.name]: Popover,
    [Button.name]: Button,
    [Switch.name]: Switch,
  },
  data() {
    return {
      mListaUnidadesSalidasPanelBusqueda: [],
      mListLineasSalidasPanelBusqueda: [],
      loadingTableRVelocidadesBusquedaloading: false,
      loadingTableUnidadesSalidasPanelBusquedaloading: false,
      itemUnidadSalidasPanelBusqueda: [],
      token: this.$cookies.get("token"),
      fechaInicialSalidasPanelBusqueda: "",
      mListaGruposPenalidadesSemanales: [],
      itemGruposPenalidadesSemanales: [],
      fechaFinalSalidasPanelBusqueda: "",
      optionsUnidadesSalidasPanelBusqueda: [],
      mListaRutasSalidasSemanales: [],
      tableColumnsUnidadesFlotaVehicular: [
        {
          prop: "CodiVehiSali_m",
          label: "Unidad",
          minWidth: 110,
        },{
          prop: "descripcion_grupo",
          label: "Grupo",
          minWidth: 140,
        },{
          prop: "NumeVuelSali_m",
          label: "N° Vuelta",
          minWidth: 150,
        },
        {
          prop: "DescRutaSali_m",
          label: "Ruta - Linea",
          minWidth: 200,
        },
        {
          prop: "DescFrec",
          label: "Frecuencia",
          minWidth: 250,
        },{
          prop: "DescCtrl",
          label: "Control",
          minWidth: 250,
        },{
          prop: "HoraProgSali_d",
          label: "H. Programación",
          minWidth: 200,
        },{
          prop: "HoraMarcSali_d",
          label: "H. Marcacion",
          minWidth: 150,
        },
        {
          prop: "AtrasoFTiempo",
          label: "Fal. Atrasos",
          minWidth: 140,
        },{
          prop: "AtrasoJTiempo",
          label: "Jus. Atrasos",
          minWidth: 140,
        },{
          prop: "FechaJustifica",
          label: "Fecha Just.",
          minWidth: 200,
        },{
          prop: "NombApellUsua",
          label: "Usuario Just.",
          minWidth: 250,
        },{
          prop: "Motivo",
          label: "Motivo Just.",
          minWidth: 250,
        },
      ],
      mListaPosicionesFueraRuta: [],
      mListaRMinutoJustificadoVuelta: [],
      DescDispEvenList: "",
      HoraDispEvenTime: "",
      mListaTiposEventos: [],
      modelTiposEvento: [],
      LetrRutaFueraRuta: "",
      WorksheetExcelRPagosVehiculoProduccion: "",
      FileNameExcelRPagosVehiculoProduccion: "",
      headerExcelRPagosVehiculoProduccion: [],
      
      json_fields_excelRPagosVehiculoProduccion: {
        Unidad: "CodiVehiSali_m",
        "Grupo": "descripcion_grupo",
        "N° Vuelta": "NumeVuelSali_m",
        "Ruta - Linea": "DescRutaSali_m",
        "Frecuencia": "DescFrec",
        Control: "DescCtrl",
        "H. Programación": "HoraProgSali_d",
        "H. Marcación": "HoraMarcSali_d",
        "Atraso Falta": "AtrasoFTiempo",
        "Atraso Justificado": "AtrasoJTiempo",
        'Fecha Justificación': "FechaJustifica",
        'Usuario': "NombApellUsua",
        Motivo: "Motivo",
      },
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
    async readRMinutosJustificadosVuelta() {
      this.mListaRMinutoJustificadoVuelta = [];
      this.loadingTableRVelocidadesBusquedaloading = true;

      this.WorksheetExcelRPagosVehiculoProduccion =
        "RMJ__" +
        this.itemUnidadSalidasPanelBusqueda +
        "_" +
        Date.now();
      this.FileNameExcelRPagosVehiculoProduccion =
        "RMJ_" +
        this.itemUnidadSalidasPanelBusqueda +
        "_" +
        Date.now() +
        ".xls";

      this.headerExcelRPagosVehiculoProduccion = [
      "Reporte Minutos Justificados",
        "Unidades : " +
          (this.itemUnidadSalidasPanelBusqueda.length <= 0
            ? "TODAS LAS UNIDADES"
            : this.itemUnidadSalidasPanelBusqueda),
        "Rutas : " +
          (this.modelTiposEvento.length <= 0
            ? "TODAS LAS RUTAS"
            : this.modelTiposEvento),    
        "Fechas : " +
          this.fechaInicialSalidasPanelBusqueda +
          " hasta " +
          this.fechaFinalSalidasPanelBusqueda
      ];

      try {
        var datos = await this.$axios.post(
          process.env.baseUrl + "/MinutosJusttificadosVuelta",
          {
            token: this.token,
            unidades:
              this.itemUnidadSalidasPanelBusqueda.length > 0
                ? this.itemUnidadSalidasPanelBusqueda
                : "*",
            fechaI: this.fechaInicialSalidasPanelBusqueda,
            fechaF: this.fechaFinalSalidasPanelBusqueda,
            rutas:
              this.modelTiposEvento.length <= 0 ? "*" : this.modelTiposEvento,
            grupos:
              this.itemGruposPenalidadesSemanales.length <= 0
                ? "*"
                : this.itemGruposPenalidadesSemanales,
          },
          {
            timeout: 600000,
          }
        );

        if (datos.data.status_code == 200) {
          this.mListaRMinutoJustificadoVuelta.push(...datos.data.datos);
        } else {
          Notification.info({
            title: "Reporte Eventos Dispositivos",
            message: datos.data.msm,
          });
        }
      } catch (error) {
        Notification.error({
          title: "Reporte Eventos Dispositivos",
          message: error.toString(),
        });
        console.log(error);
      }
      this.loadingTableRVelocidadesBusquedaloading = false;
    },
    async exportPdfRDispositivoEventos() {
      var empresa = [
        {
          text: "Empresa : " + this.$cookies.get("nameEmpresa"),
          fontSize: 11,
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
          fontSize: 11,
          alignment: "left",
        },
      ];
      var desde_hasta = [
        {
          text:
            "Fecha : " +
            this.fechaInicialSalidasPanelBusqueda +
            " hasta " +
            this.fechaFinalSalidasPanelBusqueda,
          fontSize: 11,
          alignment: "left",
        },
      ];

      var resultadoString = [
        [
          // CodiVehiDispEven,HoraDispEven,DescRutaSali_m,NumeVuelSali_m,DescFrec,DescDispEvenList,LatiDispEven,LongDispEven

          {
            text: "Unidad",
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
            text: "Ruta - Linea",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },
          {
            text: "F. Evento",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },
          {
            text: "F. Tolerancia",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },          {
            text: "TOTAL ($)",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },
        ],
      ];

      //CodiVehiDispEven,HoraDispEven,DescRutaSali_m,NumeVuelSali_m,DescFrec,DescDispEvenList,LatiDispEven,LongDispEven

      for (var i = 0; i < this.mListaRMinutoJustificadoVuelta.length; i++) {
        var arrys = [
          {
            text: this.mListaRMinutoJustificadoVuelta[i].unidad,
            alignment: "center",
            fontSize: 8.5,
          },
          {
            text: this.mListaRMinutoJustificadoVuelta[i].descripcion,
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text: this.mListaRMinutoJustificadoVuelta[i].NumeVuelSali_m,
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text: this.mListaRMinutoJustificadoVuelta[i].DescRutaSali_m,
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text: this.mListaRMinutoJustificadoVuelta[i].HoraDispEven,
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text: this.mListaRMinutoJustificadoVuelta[i].RangoPermitido,
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text: this.mListaRMinutoJustificadoVuelta[i].tot,
            fontSize: 9,
            alignment: "center",
          },
        ];
        resultadoString.push(arrys);
      }

      /**
       * function (currentPage, pageCount, pageSize) {
          //"REPORTE INDICADORES DE CALIDAD \n Dir : Av Chasquis y Rio Guayllabamba (Ambato) Email : vigitracklatam@gmail.com \n Tel : 0995737084 - 032421698 Sitio Web : www.vigitrackecuador.com"
          return [
            {
              text: "REPORTE SALIDAS DETALLADAS",
              alignment: "center",
              fontSize: 16,bold:true
            },
            {
              text: "Dir : Av Chasquis y Rio Guayllabamba (Ambato) Email : vigitracklatam@gmail.com",
              alignment: "center",
              fontSize: 8
            },{
              text: "Tel : 0995737084 - 032421698 Sitio Web : www.vigitrackecuador.com",
              alignment: "center",
              fontSize: 8
            }
          ];
        }
       * ***/
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
                      text: "REPORTE APERTURA DE PUERTAS EN RUTA",
                      alignment: "center",
                      fontSize: 16,
                      bold: true,
                    },
                  ],
                  /*[
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
                  ],*/
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
              widths: [450, 450, 450],
              body: [empresa, unidad, desde_hasta],
            },
          },
          {
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              headerRows: 0,
              widths: [30, 80, 40, 90, 60, 90,60],
              body: resultadoString,
            },
          },
        ],
      };
      /*var win = window.open("", "_blank");
      pdfMake.createPdf(docDefinition).open({}, win);*/
      pdfMake.createPdf(docDefinition).download("REP_" + Date.now());
    },
    async readEventosListaReporte() {
      this.mListaRutasSalidasSemanales = [];

      try {
        var datos = await this.$axios.post(process.env.baseUrl + "/rutes", {
          token: this.token,
          tipo: 1,
        });

        if (datos.data.status_code == 200) {
          console.log(datos.data.data);
          this.mListaRutasSalidasSemanales.push(...datos.data.data);
        } else {
          Notification.info({
            title: "Tipos Eventos Dispositivos",
            message: datos.data.msm,
          });
        }
      } catch (error) {
        Notification.error({
          title: "Tipos Eventos Dispositivos",
          message: error.toString(),
        });
      }
    },
    async readGruposActivosPenalidadesSemanales() {
      this.mListaGruposPenalidadesSemanales = [];

      var datos = await this.$axios.post(
        process.env.baseUrl + "/gruposActivos",
        {
          token: this.token,
        }
      );

      if (datos.data.status_code == 200) {
        this.mListaGruposPenalidadesSemanales.push(...datos.data.data);
      }
    }
  },
  mounted() {
    //this.readHistorialSalidaPanelBusqueda();
    this.readGruposActivosPenalidadesSemanales();
    this.readEventosListaReporte();
    this.initFechaActualSalidaBusquedaPanel();
    this.readAllUnidadesSalidasPanelBusqueda();
  },
};
</script>
<style>
.switch_RutaActiveFueraRuta {
  position: absolute;
  z-index: 100000000;
  background-color: whitesmoke;
  padding: 0.5rem;
  border-radius: 0.5rem;
  right: 0;
  margin-right: 00.5rem;
  margin-top: 00.5rem;
}

.mapaEventosDispositivos {
  width: 100%;
  height: calc(80vh);
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
  height: calc(100vh - 12.95rem);
  overflow: auto;
}

.card-bodyTopOpcionesRPagosVehiculoPRoduccion {
  padding-top: 0.25rem !important;
}
.buttonsAdicionalesRVelocidad {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
