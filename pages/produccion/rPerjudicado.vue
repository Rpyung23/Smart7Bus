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
              v-model="itemUnidadPanelProduccion"
              multiple
              filterable
              style="margin-right: 0.5rem"
              remote
              placeholder="Ingrese unidad"
              :remote-method="remoteMethodUnidadesPanelProduccionJustificacion"
              :loading="loadingTableUnidadesPanelProduccoionLoading"
            >
              <el-option
                v-for="item in optionsUnidadesPanelProduccion"
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
                v-model="fechaInicialReportePerjudicado"
              >
              </flat-picker>
            </base-input>
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
                v-model="fechaFinalReportePerjudicado"
              >
              </flat-picker>
            </base-input>
          </div>

          <div class="cardSelecMinutosTarjetas">
            <div class="buttonsAdicionalesRMinutosTarjeta">
              <base-button
                icon
                type="primary"
                size="sm"
                @click="readPerjudicado()"
              >
                <span class="btn-inner--icon"
                  ><i class="el-icon-search"></i
                ></span>
              </base-button>

              <base-button
                size="sm"
                title="EXPORTAR PDF"
                v-if="mListaRPerjudicado.length > 0 ? true : false"
                type="danger"
                @click="generatePdf()"
              >
                <span class="btn-inner--icon"
                  ><i class="ni ni-cloud-download-95"></i
                ></span>
              </base-button>
            </div>
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
              v-loading="loadingTableRPerjudicadoBusquedaloading"
              element-loading-text="Cargando Datos..."
              :data="mListaRPerjudicado"
              row-key="id"
              class="tablePanelControlProduccion"
              header-row-class-name="thead-dark"
              height="calc(100vh - 13rem)"
              width="100%"
            >

            <el-table-column
                prop="CodiVehiSali_m"
                label="Unidad"
                minWidth="120"
              >
              </el-table-column>

              <el-table-column
                prop="HoraProgSali_d"
                label="Hora"
                minWidth="180"
              >
              </el-table-column>

              <el-table-column
                prop="CodiVehi_p"
                label="U. Afectada"
                minWidth="170"
              >
              </el-table-column>

              <el-table-column
                prop="FechaPago"
                label="F. Pago"
                minWidth="180"
              >
              </el-table-column>

              <el-table-column
                prop="FechaDevolucion"
                label="F. Devuelto"
                minWidth="180"
              >
              </el-table-column>


              <el-table-column
                prop="AtrasoPenalidad"
                label="Total"
                minWidth="150"
              >
              </el-table-column>

              <el-table-column
                prop="descripcion"
                label="Empresa"
                minWidth="190"
              >
              </el-table-column>

              <el-table-column
                prop="NombApellUsua"
                label="Usuario"
                minWidth="190"
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
  Button,
  Checkbox,
} from "element-ui";

import RouteBreadCrumb from "@/components/argon-core/Breadcrumb/RouteBreadcrumb";
import { BasePagination } from "@/components/argon-core";
import clientPaginationMixin from "~/components/tables/PaginatedTables/clientPaginationMixin";
import swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";
import Tabs from "@/components/argon-core/Tabs/Tabs";
import TabPane from "@/components/argon-core/Tabs/Tab";
import { getBase64LogoReportes } from "../../util/logoReport";
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { text } from "d3";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export default {
  mixins: [clientPaginationMixin],
  layout: "ProduccionDashboardLayout",
  components: {
    Tabs,
    TabPane,
    [Button.name]: Button,
    flatPicker,
    BasePagination,
    RouteBreadCrumb,
    [Select.name]: Select,
    [Option.name]: Option,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [DatePicker.name]: DatePicker,
    [Notification.name]: Notification,
    [Autocomplete.name]: Autocomplete,
    [RadioButton.name]: RadioButton,
    [Radio.name]: Radio,
    [Checkbox.name]: Checkbox,
  },
  data() {
    return {
      token: this.$cookies.get("token"),
      fechaInicialReportePerjudicado: "",
      fechaFinalReportePerjudicado: "",
      mListaUnidadesPanelProduccion: [],
      optionsUnidadesPanelProduccion: [],
      itemUnidadPanelProduccion: [],
      base64PDFRPERJUDICADO: "",
      loadingTableUnidadesPanelProduccoionLoading: false,
      modelTiposEvento: [],
      loadingTableUnidadesSalidasPanelBusquedaloading: false,
      mListaRutasSalidasSemanales: [],
      mListaUnidadesSalidasPanelBusqueda: [],
      optionsUnidadesSalidasPanelBusqueda: [],
      mListaGruposPenalidadesSemanales: [],
      itemGruposPenalidadesSemanales: [],
      loadingTableRPerjudicadoBusquedaloading: false,
      mListaRPerjudicado: [],
    };
  },
  methods: {
    remoteMethodUnidadesPanelProduccionJustificacion(query) {
      if (query !== "") {
        this.loadingTableUnidadesPanelProduccoionLoading = true;
        setTimeout(() => {
          this.loadingTableUnidadesPanelProduccoionLoading = false;
          this.optionsUnidadesPanelProduccion =
            this.mListaUnidadesPanelProduccion.filter((item) => {
              return (
                item.CodiVehi.toLowerCase().indexOf(query.toLowerCase()) > -1
              );
            });
        }, 200);
      } else {
        this.optionsUnidadesPanelProduccion = [];
      }
    },
    initFechaActualProduccionPerjudicado() {
      var fecha = new Date();
      var mes = fecha.getMonth() + 1;
      var day = fecha.getDate();
      var format =
        fecha.getFullYear() +
        "-" +
        (mes < 10 ? "0" + mes : mes) +
        "-" +
        (day < 10 ? "0" + day : day);

      this.fechaInicialReportePerjudicado = format;
      this.fechaFinalReportePerjudicado = format;
    },
    async readUnidadesTableroProduccionPerjudicado() {
      this.mListaUnidadesPanelProduccion = [];
      try {
        var datos = await this.$axios.post(process.env.baseUrl + "/unidades", {
          token: this.token,
        });

        if (datos.data.status_code == 200) {
          for (var i = 0; i < datos.data.data.length; i++) {
            var obj = datos.data.data[i];
            obj.value = obj.CodiVehi;
            this.mListaUnidadesPanelProduccion.push(obj);
          }
        }
      } catch (error) {
        console.log(error);
      }
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
    },
    async readPerjudicado() {
      this.mListaRPerjudicado = [];
      this.loadingTableRPerjudicadoBusquedaloading = true;
      try {
        var datos = await this.$axios.post(
          process.env.baseUrl + "/ProduccionReportePerjudicadosDevueltos",
          {
            token: this.token,
            unidades:
              this.itemUnidadPanelProduccion.length > 0
                ? this.itemUnidadPanelProduccion
                : "*",
            fechaI: this.fechaInicialReportePerjudicado,
            fechaF: this.fechaFinalReportePerjudicado,
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

        console.log("Aca datos todos ......", datos.data.datos);
        console.log(
          "Aca datos Unidades ......",
          this.itemUnidadPanelProduccion
        );
        console.log("Aca datos Rutasssss ......", this.modelTiposEvento);
        console.log(
          "Aca datos Grupossss ......",
          this.itemGruposPenalidadesSemanales
        );
        this.loadingTableRPerjudicadoBusquedaloading = false;
        if (datos.data.status_code == 200) {
          this.mListaRPerjudicado.push(...datos.data.datos);
        } else {
          Notification.info({
            title: "Reporte Perjudicados Devueltos",
            message: datos.data.msm,
          });
        }
      } catch (error) {
        Notification.error({
          title: "Reporte Perjudicados Devueltos",
          message: error.toString(),
        });
        console.log(error);
      }
      this.loadingTableRPerjudicadoBusquedaloading = false;
    },
    generatePdf() {
      var empresa = [
        {
          text: "Empresa : " + this.$cookies.get("nameEmpresa"),
          fontSize: 12,
          alignment: "left",
          bold: true,
        },
      ];
      var tipoReporte = [
        {
          text:
            "REPORTE DE LA RUTA : " +
            (this.modelTiposEvento.length === 0
              ? "TODAS LAS RUTAS"
              : this.modelTiposEvento.toString()),
          fontSize: 12,
          alignment: "left",
          bold: true,
        },
      ];
      var desde_hasta = [
        {
          text:
            "Del : " +
            this.fechaInicialReportePerjudicado +
            " Hasta " +
            this.fechaFinalReportePerjudicado,
          fontSize: 12,
          alignment: "left",
          bold: true,
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
            text: "Hora",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },
          {
            text: "U. Afectada",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },
          {
            text: "Fecha pago",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },
          {
            text: "Fecha Devolucion",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },
          {
            text: "Monto",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },
          {
            text: "Empresa",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },
          {
            text: "Usuario",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },
        ],
      ];

      for (var i = 0; i < this.mListaRPerjudicado.length; i++) {
        var arrys = [
          {
            text: this.mListaRPerjudicado[i].CodiVehiSali_m,
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text: this.mListaRPerjudicado[i].HoraProgSali_d,
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text: this.mListaRPerjudicado[i].CodiVehi_p,
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text: this.mListaRPerjudicado[i].FechaPago,
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text: this.mListaRPerjudicado[i].FechaDevolucion,
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text: this.mListaRPerjudicado[i].AtrasoPenalidad,
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text: this.mListaRPerjudicado[i].descripcion,
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text: this.mListaRPerjudicado[i].NombApellUsua,
            fontSize: 8.5,
            alignment: "center",
          },
        ];
        resultadoString.push(arrys);
      }
      var docDefinition = {
        pageSize: "A4",
        pageOrientation: "landscape",
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
                      text: "REPORTE PERJUDICADOS COBRADOS",
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
              widths: [450, 450, 450],
              body: [empresa, tipoReporte, desde_hasta],
            },
          },
          {
            table: {
              headerRows: 0,
              widths: [40, 80, 60, 80, 80, 50, 90, 60],
              body: resultadoString,
            },
          },
        ],
      };

      pdfMake.createPdf(docDefinition).download("RPD_" + Date.now());
    },
  },
  mounted() {
    this.readGruposActivosPenalidadesSemanales();
    this.readEventosListaReporte();
    this.readUnidadesTableroProduccionPerjudicado();
    this.initFechaActualProduccionPerjudicado();
  },
};
</script>

<style>
.buttonCircleModalClose {
  height: 40px;
  width: 40px;
  background-color: #172b4d;
  position: absolute;
  top: -1rem;
  right: -1rem;
  float: left;
  z-index: 99;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  cursor: pointer;
  font-weight: 900;
}

.mapa {
  width: 100%;
  height: calc(80vh);
}

.inputTimer {
  width: 1.8rem !important;
  background-color: white;
  color: black;
  border-width: 0rem;
  padding-right: 5px !important;
  padding-left: 5px !important;
  border-radius: 0.5rem;
}

.barraResumen {
  width: 100%;
  height: 3rem;
  background-color: #2dce89;
  border-radius: 0.5rem;
  border-style: solid;
  border-width: 0rem;
  margin-bottom: 00.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 10px;
  padding-left: 10px;
}

.textAreaCustom {
  resize: none;
  width: 100%;
  margin-right: 00.5rem;
  outline: none;
}

.textWhite {
  color: white;
}

.containerRigthTopNavbarModal {
  display: flex;
  background-color: #2dce89;
  padding: 10px;
  width: 75%;
  align-items: center;
}

.containerLeftTopNavbarModal {
  display: flex;
  flex-direction: column;
  width: 25%;
  margin-right: 2rem;
  justify-content: center;
}

.navbarModal {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
}

.danger {
  background-color: #f5365c !important;
}

.containerButtonMasMenos {
  background-color: #ffffff;
  padding-left: 6px;
  padding-right: 6px;
  padding-top: 4px;
  padding-bottom: 4px;
  border-radius: 0.5rem;
}

.circleButtonMasMenos {
  color: white;
  background-color: #5e72e4;
  height: 1.5rem;
  width: 1.5rem;
  padding-left: 4px;
  border-radius: 100%;
  border-width: 0rem;
  border-style: solid;
}

.topModalJustificaciones {
  display: flex;
  flex-direction: row;
  margin-bottom: 0.5rem;
  max-height: 5rem;
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

.card-bodyRPagosVehiculoProduccionPCTablero {
  padding: 0rem !important;
  height: calc(100vh - 12rem);
  overflow: auto;
}

.el-table__body tr.current-row > td {
  background-color: rgb(220, 220, 220) !important;
  color: #000;
}

.card-bodyTopOpcionesRPagosVehiculoPRoduccion {
  padding-top: 0.25rem !important;
}

.el-table .estadoJustificado {
  background: rgba(140, 248, 126, 0.384) !important;
}
</style>
