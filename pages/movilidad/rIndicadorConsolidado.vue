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
            <el-date-picker
              type="date"
              placeholder="Select date and time"
              style="margin-right: 0.5rem"
              v-model="fechaInicialIndicadorCalidad"
            >
            </el-date-picker>

            <el-date-picker
              type="date"
              placeholder="Select date and time"
              style="margin-right: 0.5rem"
              v-model="fechaFinalIndicadorCalidad"
            >
            </el-date-picker>

            <!-- DOWNLOAD EXCEL-->
          </div>

          <div class="cardSelectRubrosEstadosPagosVehiculoProduccionContainer">
            <base-button
              icon
              type="primary"
              @click="readAllIndicadoresCalidad"
              size="sm"
            >
              <span class="btn-inner--icon"
                ><i class="el-icon-search"></i
              ></span>
            </base-button>
          </div>
        </card>
        <card
          class="no-border-card col"
          style="margin-bottom: 0.5rem"
          body-classes="px-0 pb-1 card-bodyTopOpcionesRPagosVehiculoPRoduccion cardSelectRubrosEstadosPagosVehiculoProduccionContainer"
          footer-classes="pb-2"
        >
          <div class="cardSelectAgrupacionRIcalidad">
            <el-select
              v-model="modelTiposEvento"
              collapse-tags
              :multiple-limit="1"
              style="margin-right: 0.5rem"
              placeholder="Rutas"
              :loading="loadingTableUnidadesSalidasPanelBusquedaloading"
              @change="updateSelectedRouteDescriptions" clearable
            >
              <el-option
                v-for="item in mListaRutasSalidasSemanales"
                :key="item.LetrRuta"
                :label="item.DescRuta"
                :value="item.idRuta"
              >
              </el-option>
            </el-select>
          </div>
        </card>

        <card
          class="no-border-card"
          body-classes="card_body_0_01rem"
          style="margin-bottom: 0px; width: 100%; height: calc(100vh - 13rem)"
        >
          <embed
            id="iframeContainerIndicadoresCalidad"
            :src="oBase64IndicadoresCalidad"
            type="application/pdf"
            width="100%"
            height="100%"
          />
        </card>
      </div>
    </base-header>
  </div>
</template>
<script>
import flatPicker from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import {
  getFecha_dd_mm_yyyy,
  validaRangoFechaNoMas30Dias,
} from "../../util/fechas";

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
  Switch,
} from "element-ui";

import RouteBreadCrumb from "@/components/argon-core/Breadcrumb/RouteBreadcrumb";
import { BasePagination } from "@/components/argon-core";
import clientPaginationMixin from "~/components/tables/PaginatedTables/clientPaginationMixin";
import swal from "sweetalert2";
import Tabs from "@/components/argon-core/Tabs/Tabs";
import TabPane from "@/components/argon-core/Tabs/Tab";
import { getBase64LogoReportes } from "../../util/logoReport";
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export default {
  mixins: [clientPaginationMixin],
  layout: "DashboardLayoutMovilidad",
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
    [Button.name]: Button,
    [Switch.name]: Switch,
  },
  data() {
    return {
      mListaUnidadesPagosVehiculoProduccionRecibo: [],
      tableDataRPagosVEhiculoProduccionRecibo: [],
      itemUnidadProduccionRPagoVehiculorecibo: [],
      modelTiposEvento: [],
      selectedRouteDescriptions: [],
      mListaRutasSalidasSemanales: [],
      token: this.$cookies.get("token"),
      fechaInicialIndicadorCalidad: "",
      fechaFinalIndicadorCalidad: "",
      loadingRPagosVehiculoRecibo: false,
      Base64PdfRECIBOPDFPRODUCCION: "",
      tableDataDetalleReciboPAgoVehiculoProduccion: [],
      optionsUnidadesProduccionPagosVehiculo: [],
      optionsCobradoresProduccionPagosVehiculo: [],
      loadingTableUnidadesRecibosVehiculoProduccion: false,
      loadingTableCobradoresRecibosVehiculoProduccion: false,
      baseURlPDFPanelDetalleRecibo: "",
      oBase64IndicadoresCalidad: "",
      oAgrupacionDM: false,
    };
  },
  methods: {
    remoteMethodUnidadesRecibosProduccion(query) {
      if (query !== "") {
        this.loadingTableUnidadesRecibosVehiculoProduccion = true;
        setTimeout(() => {
          this.loadingTableUnidadesRecibosVehiculoProduccion = false;
          this.optionsUnidadesProduccionPagosVehiculo =
            this.mListaUnidadesPagosVehiculoProduccionRecibo.filter((item) => {
              return (
                item.CodiVehi.toLowerCase().indexOf(query.toLowerCase()) > -1
              );
            });
        }, 200);
      } else {
        this.optionsUnidadesProduccionPagosVehiculo = [];
      }
    },
    initFechaActualProduccionRPAgosVehiculoRecibo() {
      var fecha = new Date();
      var mes = fecha.getMonth() + 1;
      var day = fecha.getDate();
      var format =
        fecha.getFullYear() +
        "-" +
        (mes < 10 ? "0" + mes : mes) +
        "-" +
        (day < 10 ? "0" + day : day);

      this.fechaInicialIndicadorCalidad = format;
      this.fechaFinalIndicadorCalidad = format;
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

    updateSelectedRouteDescriptions(selectedRoute) {
      const route = this.mListaRutasSalidasSemanales.find(route => route.idRuta === selectedRoute);
      this.selectedRouteDescription = route ? route.DescRuta : '';
    },


    async readAllIndicadoresCalidad() {
      if (
        !validaRangoFechaNoMas30Dias(
          getFecha_dd_mm_yyyy(this.fechaInicialIndicadorCalidad),
          getFecha_dd_mm_yyyy(this.fechaFinalIndicadorCalidad)
        )
      ) {
        Notification.warning({
          title: "RAGO MAXIMO 31 DIAS",
          message: "SOLO SE PERMITE UN MAXIMO DE 31 DIAS",
          duration: 2000,
        });
        return;
      }

      this.mListaRutasIndicadoresCalidad = [];

      let iframe = document.getElementById("iframeContainerIndicadoresCalidad");
      iframe.src = "";
      swal.fire({
        title: "Generando Reporte ...",
        width: 600,
        padding: "3em",
        background: "#fff",
        showCancelButton: false,
        showConfirmButton: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        allowOutsideClick: false,
        backdrop: `
                      rgba(0, 0, 0, 0.5)
                      left top
                      no-repeat
                    `,
      });

      this.oBase64IndicadoresCalidad = "";

      try {
        var datos = await this.$axios.post(
          process.env.baseUrl + "/IndicadorConsolidadoTotal",
          {
            token: this.token,
            fechaI: getFecha_dd_mm_yyyy(this.fechaInicialIndicadorCalidad),
            fechaF: getFecha_dd_mm_yyyy(this.fechaFinalIndicadorCalidad),
            rutas:
              this.modelTiposEvento.length <= 0 ? "*" : this.modelTiposEvento,
            nameEmpresa: this.$cookies.get("nameEmpresa"),
            usuarioName: this.$cookies.get("namesUsuario"),
          },
          {
            "Content-Type": "application/json",
          }
        );

        if (datos.data.status_code == 200) {
          console.log("Agrego indicadores Calidad Totales.........");
          this.genratePdf(datos.data.datos);
        }else {
          Notification.info({
            title: "Reporte de Indicadores Consolidado de Calidad (Total)",
            message: datos.data.msm,
          });
        }
      } catch (error) {
        console.log(error);
        Notification.error({
          title: "Reporte de Indicadores Consolidado de Calidad (Total)",
          message: error.toString(),
          duration: 2500,
        });
      }

      swal.close();
    },
    genratePdf(datos) {
      var fechaHora = new Date();
      var dia = fechaHora.getDate();
      var mes = fechaHora.toLocaleString("es-ES", { month: "long" }); // Obtener el nombre del mes en español
      var anio = fechaHora.getFullYear();
      var horas = fechaHora.getHours();
      var minutos = fechaHora.getMinutes();
      var segundos = fechaHora.getSeconds();
      var fechaHoraFormateada =
        dia +
        " de " +
        mes +
        " de " +
        anio +
        " " +
        agregarCeros(horas) +
        ":" +
        agregarCeros(minutos) +
        ":" +
        agregarCeros(segundos);
      function agregarCeros(valor) {
        return valor < 10 ? "0" + valor : valor;
      }
      const componenteHeader = (titulo) => {
        var tipoInfomer = {
          text: titulo,
          fontSize: 14,
          alignment: "center",
          bold: true,
          colSpan: 4,
        };
        var empresa = {
          text: this.$cookies.get("nameEmpresa"),
          fontSize: 12,
          alignment: "center",
          colSpan: 2,
          bold: true,
        };
        var ruta = {
          text: [
            { text: "RUTA : ", fontSize: 12, bold: true },
            {
              text:
                this.modelTiposEvento.length === 0
                  ? "TODAS LAS RUTAS"
                  : this.selectedRouteDescription.toString(),
              fontSize: 11,
              alignment: "left",
              bold: true,
            },
          ],
          colSpan: 3,
        };
        var periodo = {
          text: [
            { text: "PERIODO : ", fontSize: 12, bold: true },
            "Desde ",
            getFecha_dd_mm_yyyy(this.fechaInicialIndicadorCalidad),
            " Hasta ",
            getFecha_dd_mm_yyyy(this.fechaFinalIndicadorCalidad),
          ],
          colSpan: 2,
        };
        var impresion = {
          text: [
            { text: "IMPRESION: ", fontSize: 12, bold: true },
            fechaHoraFormateada,
          ],
          colSpan: 2,
        };
        return {
          headerRows: 0,
          widths: ["*", "*", "*", "*"],
          body: [
            [tipoInfomer, {}, {}, {}],
            ["", empresa, {}, ""],
            [periodo, {}, impresion, {}],
            [ruta, {}, {}, ""],
          ],
          //body: [[ 'First', 'Second', 'Third', 'The last one' ]],
        };
      };
      const componenteHeaderTable = (arrayTitulos) => {
        return arrayTitulos.map((titulo) => ({
          text: titulo,
          fontSize: 9.5,
          bold: true,
          fillColor: "#039BC4",
          color: "white",
          alignment: "center",
        }));
      };

      var marcaDeAgua = {
        absolutePosition: { x: 100, y: 200 }, // Posición absoluta de la marca de agua
        opacity: 0.9, // Opacidad de la marca de agua (valor entre 0 y 1)
        image:
          "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQIAHAAcAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAK/A3cDAREAAhEBAxEB/8QAHAABAAIDAQEBAAAAAAAAAAAAAAMEAQIFBgcJ/8QATBAAAQMCBAIGBwUEBgoCAgMAAQACAwQRBRIhMUFRBhMiYXGBFDKRobHB0SMzQuHwBxVSciRDYoKS8RYlNFNUY5OistJEwheDNUVz/8QAGwEBAAMBAQEBAAAAAAAAAAAAAAECAwQFBgf/xAAtEQEBAAICAwABBQEAAgIDAAMAAQIRAyEEEjFBBRMiMlEUIzNhcUJS8AYVof/aAAwDAQACEQMRAD8A/VNAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBBG+eFnryNHiQpmNvxFsiB+KUUehnafAgq84s7+FbyYz8ozjeHj+tVv2M/8R+7i3Zi9BIbNqG+ZAUXhzn4T+5imFXTEXE8ZHc4KnplPwn2ivJi9FHcdZe3JPWp2gf0ho27XKeptGOk9DezrhPU2nZj+HP3mA8SnrTa1HX0couyojP94KNVO0oljO0jT4FQNrg7FBlAQEBA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AQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQf/2Q==", // Ruta de acceso a la imagen de la marca de agua
      };

      // Tabla
      var resultadoString = [];
      for (var i = 0; i < datos.datos.length; i++) {
        var arrys = [
          {
            text: datos.datos[i].Numero,
            fontSize: 9,
            alignment: "center",
          },
          {
            text: datos.datos[i].Indicador,
            fontSize: 9,
            alignment: "center",
          },
          {
            text: datos.datos[i].DescripcionRuta,
            fontSize: 9,
            alignment: "center",
          },
          {
            text: datos.datos[i].Porcentaje,
            fontSize: 9,
            alignment: "center",
          },
          {
            text: datos.datos[i].Estado,
            fontSize: 10,
            alignment: "center",
            style: [
              datos.datos[i].Estado === "Cumple" ? "textGreen" : "textRed",
            ],
          },
        ];

        resultadoString.push(arrys);
      }

      var docDefinition = {
        pageSize: "A4",
        pageOrientation: "portrait",
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
                      text: "REPORTE INDICADORES DE CALIDAD CONSOLIDADO",
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
                  [
                    {
                      text: "USUARIO : Administrador",
                      alignment: "center",
                      fontSize: 8,
                      bold: true,
                    },
                  ],
                ],
              },
            },
          ],
        },
        content: [
          //Tabla
          {
            layout: "noBorders",
            table: componenteHeader("INDICADOR CONSOLIDADO TOTAL"),
            margin: [0, 20, 0, 0],
          },
          {
            table: {
              headerRows: 0,
              widths: [60, 130, 130, 60, 60],
              body: [
                componenteHeaderTable([
                  "Numero",
                  "Indicador",
                  "Ruta",
                  "Porcentaje",
                  "Estado",
                ]),
                ...resultadoString,
              ],
            },
          },
        ],
        styles: {
          textRed: { color: "#ff0000", bold: true },
          textGreen: { color: "#008000", bold: true },
          textFond: { color: "#fafafa", fillColor: "green" },
          textFondN: { color: "#fafafa", fillColor: "red" },
        },
        background: {
          // Agregar la marca de agua al fondo del documento
          image: marcaDeAgua.image,
          absolutePosition: marcaDeAgua.absolutePosition,
          opacity: marcaDeAgua.opacity,
          fit: [400, 500],
          alignment: "",
        },
      };

      var pdfDocGenerator = pdfMake.createPdf(docDefinition);
      pdfDocGenerator.getBlob((blob) => {
        var pdfUrl = URL.createObjectURL(blob);
        let iframe = document.getElementById(
          "iframeContainerIndicadoresCalidad"
        );
        iframe.src = pdfUrl;
      });
    },
  },
  mounted() {
    this.initFechaActualProduccionRPAgosVehiculoRecibo();
    this.readEventosListaReporte();
  },
};
</script>
<style>
.cardSelectAgrupacionRIcalidad {
  display: flex;
  justify-content: center;
  align-items: center;
}

.card_body_0_01rem {
  padding: 0.5rem !important;
}

.card-bodyRPagosVehiculoReciboProduccion::-webkit-scrollbar {
  display: none;
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
  width: 90%;
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

.card-bodyRPagosVehiculoReciboProduccion {
  padding: 0rem !important;
  height: calc(100vh - 13rem);
  overflow: auto;
}

.card-bodyTopOpcionesRPagosVehiculoPRoduccion {
  padding-top: 0.25rem !important;
}
</style>
