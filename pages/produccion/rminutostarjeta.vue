<template>
  <div class="content">
    <base-header>
      <div class="align-items-center py-3">
        <card class="no-border-card col" style="margin-bottom: 0.5rem"
          body-classes="px-0 pb-1 card-bodyTopOpcionesRPagosVehiculoPRoduccion cardSelecMinutosTarjetas"
          footer-classes="pb-2">
          <div class="cardTextoRPagosMinutosTarjetas">
            <el-select v-model="itemUnidadPanelProduccion" multiple filterable style="margin-right: 0.5rem" remote
              placeholder="Ingrese unidad" :remote-method="remoteMethodUnidadesPanelProduccionJustificacion"
              :loading="loadingTableUnidadesPanelProduccoionLoading">
              <el-option v-for="item in optionsUnidadesPanelProduccion" :key="item.CodiVehi" :label="item.CodiVehi"
                :value="item.CodiVehi">
              </el-option>
            </el-select>

            <el-date-picker type="date" placeholder="Select date and time" style="margin-right: 0.5rem"
              v-model="fechaInicialReporteMinutosTarjetas">
            </el-date-picker>

            <el-date-picker type="date" placeholder="Select date and time" style="margin-right: 0.5rem"
              v-model="fechaFinalReporteMinutosTarjetas">
            </el-date-picker>

            <el-checkbox style="margin-bottom: 0 !important" v-model="checkedPEN">PENDIENTE</el-checkbox>
            <el-checkbox style="margin-bottom: 0 !important" v-model="checkedPAG">PAGADOS</el-checkbox>
          </div>

          <div class="cardSelecMinutosTarjetas">
            <div class="buttonsAdicionalesRMinutosTarjeta">
              <base-button icon type="primary" size="sm" @click="readMinutosTarjetas()">
                <span class="btn-inner--icon"><i class="el-icon-search"></i></span>
              </base-button>
            </div>
          </div>
        </card>

        <!--<card class="no-border-card col" style="margin-bottom: 0.5rem"
          body-classes="px-0 pb-1 card-bodyTopOpcionesRPagosVehiculoPRoduccion cardSelecMinutosTarjetas"
          footer-classes="pb-2">
          <div class="cardSelectRubrosEstadosRPagosVehiculoProduccion">
            
          </div>

          <div class="cardTextoRPagosMinutosTarjetas">
            <strong style="color: dark; margin-right: 0.5rem">Recaudados : {{ mPagadoRPagosVehiculo }} $</strong>
            <strong style="color: lightseagreen; margin-right: 0.5rem">Descuentos : {{ mPendienteRPagosVehiculo }}
              $</strong>
            <strong style="color: green">Total : {{ mTotalRPagosVehiculo }} $</strong>
          </div>
        </card>-->

        <card class="no-border-card" style="margin-bottom: 0rem"
          body-classes="cardMinutosTarjetas card-bodyRPagosVehiculoProduccionPC px-0 pb-1" footer-classes="pb-2">
          <embed id="iframeContainerrMinutosTarjetas" type="application/pdf" width="100%" height="100%" />
        </card>
      </div>
    </base-header>
  </div>
</template>
<script>
import flatPicker from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import { PDFDocument, StandardFonts, rgb, PageSizes } from "pdf-lib";
import { getFecha_dd_mm_yyyy, FechaStringToHour } from "../../util/fechas";

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
      fechaInicialReporteMinutosTarjetas: "",
      fechaFinalReporteMinutosTarjetas: "",
      mListaUnidadesPanelProduccion: [],
      optionsUnidadesPanelProduccion: [],
      itemUnidadPanelProduccion: [],
      baseURlPDFPanelProduccionMinutosTarjetas: "",
      loadingTableUnidadesPanelProduccoionLoading: false,
      checkedPEN: false,
      checkedPAG: false,
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

    initFechaActualProduccionMinutosTarjetas() {
      var fecha = new Date();
      var mes = fecha.getMonth() + 1;
      var day = fecha.getDate();
      var format =
        fecha.getFullYear() +
        "-" +
        (mes < 10 ? "0" + mes : mes) +
        "-" +
        (day < 10 ? "0" + day : day);

      this.fechaInicialReporteMinutosTarjetas = format + " ";
      this.fechaFinalReporteMinutosTarjetas = format + " ";
    },
    selectionChange(selectedRows) {
      this.selectedRows = selectedRows;
    },
    async readUnidadesTableroProduccion() {
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
    async readMinutosTarjetas() {
      let iframe = document.getElementById("iframeContainerrMinutosTarjetas");
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
          process.env.baseUrl + "/ProduccionMinutosTarjetas",
          {
            token: this.token,
            fechaI: getFecha_dd_mm_yyyy(
              this.fechaInicialReporteMinutosTarjetas
            ),
            fechaF: getFecha_dd_mm_yyyy(this.fechaFinalReporteMinutosTarjetas),
            unidades:
              this.itemUnidadPanelProduccion.length > 0
                ? this.itemUnidadPanelProduccion
                : "*",
            nameEmpresa: this.$cookies.get("nameEmpresa"),
            tipo:
              this.checkedPEN && this.checkedPAG
                ? 3
                : !this.checkedPEN && !this.checkedPAG
                  ? 3
                  : this.checkedPAG
                    ? 1
                    : this.checkedPEN
                      ? 0
                      : 0,
          },
          {
            "Content-Type": "application/json",
          }
        );

        console.log("Datos .==================..", datos);

        if (datos.data.status_code == 200) {
          console.log(datos.data.datos);
          console.log("Agrego Reportes de Minutos Tarjetas  .........");
          //this.baseURlPDFPanelProduccionMinutosTarjetas = "data:application/pdf;base64," + datos.data.datos
          this.generatePdf(datos.data.datos);
        } else {
          Notification.info({
            title: "MINUTOS Y TARJETAS",
            message: datos.data.msm,
            duration: 2500,
          });
        }
      } catch (error) {
        console.log(error);
        Notification.error({
          title: "ERROR",
          message: error.toString(),
          duration: 2500,
        });
      }

      swal.close();
    },

    generatePdf(datos) {
      const convertSecondtoTimeString = (seconds) => {
        var hour = Math.floor(seconds / 3600);
        hour = hour < 10 ? "0" + hour : hour;
        var minute = Math.floor((seconds / 60) % 60);
        minute = minute < 10 ? "0" + minute : minute;
        var second = seconds % 60;
        second = second < 10 ? "0" + second : second;
        return hour + ":" + minute + ":" + second;
      };

      const componenteHeader = (uni, fechas, linea, sali) => {
        var unidad = {
          text: [{ text: `UNIDAD N: ${uni}`, fontSize: 10 }],
        };
        var periodo = {
          text: [{ text: fechas, fontSize: 10 }],
          colSpan: 2,
        };
        var desRuta = {
          text: [{ text: linea, fontSize: 10 }],
        };
        var salida = {
          text: [{ text: `Salida # ${sali}`, fontSize: 10 }],
        };
        return {
          layout: "noBorders",
          table: {
            headerRows: 0,
            widths: ["*", "*", "*", "*", "*"],
            body: [[unidad, periodo, {}, desRuta, salida]],
          },
        };
      };
      const componenteFilaUnidad = (minutos) => {
        const fila = [];
        minutos.forEach((min) => {
          fila.push([
            {
              text: min.DescripcionControl,
              alignment: "center",
              style: "tableRow",
            },
            {
              text: min.HoraProgSali_d,
              alignment: "center",
              style: "tableRow",
            },
            {
              text: min.HoraMarcSali_d,
              alignment: "center",
              style: "tableRow",
            },
            {
              text: min.AtrasoFTiempo === "00:00:00" ? "" : min.AtrasoFTiempo,
              alignment: "center",
              style: "tableRow",
            },
            {
              text:
                min.AdelantoFTiempo === "00:00:00" ? "" : min.AdelantoFTiempo,
              alignment: "center",
              style: "tableRow",
            },
            {
              text: min.AtrasoJTiempo === "00:00:00" ? "" : min.AtrasoJTiempo,
              alignment: "center",
              style: "tableRow",
            },
            {
              text:
                min.AdelantoJTiempo === "00:00:00" ? "" : min.AdelantoJTiempo,
              alignment: "center",
              style: "tableRow",
            },
            {
              text: min.RubroPenalidad === "0.00" ? "" : min.RubroPenalidad,
              alignment: "center",
              style: "tableRow",
            },
            {
              text:
                min.VelocidadPenalidad === "0.00" ? "" : min.VelocidadPenalidad,
              alignment: "center",
              style: "tableRow",
            },
          ]);
        });
        return fila;
      };

      const componenteTablaUnidad = (salida) => {
        const body = [];
        //Cabecera linea 1
        body.push([
          {
            text: "Descipcion Control",
            style: "tableHeader",
            alignment: "center",
            rowSpan: 2,
          },
          {
            text: "Control",
            style: "tableHeader",
            colSpan: 2,
            alignment: "center",
          },
          {},
          {
            text: "Faltas",
            style: "tableHeader",
            colSpan: 2,
            alignment: "center",
          },
          {},
          { text: "Justificaciones", style: "tableHeader", colSpan: 2 },
          {},
          {
            text: "Rubros",
            style: "tableHeader",
            alignment: "center",
            rowSpan: 2,
          },
          {
            text: "Veloc",
            style: "tableHeader",
            alignment: "center",
            rowSpan: 2,
          },
        ]);
        //Cabecera linea 2
        body.push([
          "",
          { text: "Timbrar", style: "tableHeader", alignment: "center" },
          { text: "Llegó", style: "tableHeader", alignment: "center" },
          { text: "Atraso", style: "tableHeader", alignment: "center" },
          { text: "Adelanto", style: "tableHeader", alignment: "center" },
          { text: "Atraso", style: "tableHeader", alignment: "center" },
          { text: "Adelanto", style: "tableHeader", alignment: "center" },
          "",
          "",
        ]);
        //Datos
        body.push(...componenteFilaUnidad(salida.minutos));

        return {
          table: {
            headerRows: 2,
            widths: [
              "*",
              "auto",
              "auto",
              "auto",
              "auto",
              "auto",
              "auto",
              "auto",
              "auto",
            ],
            body: body,
          },
          margin: [0, 0, 0, 10],
        };
      };

      const componenteSeparadorTabla = () => {
        return {
          text: ".".repeat(166),
          margin: [0, 10, 0, 10],
        };
      };

      const componenteAnotaciones = (anotaciones) => {
        const listaAnotaciones = [];
        const titulo = {
          text:
            anotaciones.length > 0
              ? "ANOTACIONES : "
              : "NO EXISTEN ANOTACIONES.",
          style: "TableHeader",
          bold: true,
          margin: [0, 10, 0, 10],
        };
        listaAnotaciones.push(titulo);
        anotaciones.forEach((anotacion) => {
          listaAnotaciones.push({
            text: anotacion,
            style: "tableRow",
            margin: [0, 0, 0, 5],
          });
        });
        return listaAnotaciones;
      };

      const componenteDatosCabezera = (
        atraso,
        adelanto,
        atrasoj,
        adelantoj,
        rubrosd,
        velofd,
        tarjetad,
        atrasod,
        adelantosd,
        totald
      ) => {
        var Atraso = {
          text: [{ text: `ATRASO : ${atraso}`, fontSize: 9 }],
          colSpan: 2,
        };
        var Adelanto = {
          text: [{ text: `ADELANTO : ${adelanto}`, fontSize: 9 }],
          colSpan: 2,
        };
        var AtrasosJustificado = {
          text: [{ text: `ATRASO JUSTI : ${atrasoj}`, fontSize: 9 }],
          colSpan: 2,
        };
        var AdelantoJustificado = {
          text: [{ text: `ADELANTO JUSTI : ${adelantoj}`, fontSize: 9 }],
          colSpan: 2,
        };
        var Rubros = {
          text: [{ text: `RUBROS ($) : ${rubrosd}`, fontSize: 9 }],
          colSpan: 2,
        };
        var VelocidadFD = {
          text: [{ text: `F.VELOCIDAD ($) : ${velofd}`, fontSize: 9 }],
          colSpan: 2,
        };
        var Tarjeta = {
          text: [{ text: `TARJETA ($) : ${tarjetad}`, fontSize: 9 }],
          colSpan: 2,
        };
        var AtrasoD = {
          text: [{ text: `ATRASOS ($) : ${atrasod}`, fontSize: 9 }],
          colSpan: 2,
        };
        var AdelantoD = {
          text: [{ text: `ADELANTOS ($) : ${adelantosd}`, fontSize: 9 }],
          colSpan: 2,
        };
        var TotalD = {
          text: [{ text: `TOTAL ($) : ${totald}`, fontSize: 16, bold: true }],
          colSpan: 2,
          margin: [0, 0, 0, 20],
        };
        return {
          layout: "noBorders",
          table: {
            headerRows: 0,
            widths: ["*", "*", "*", "*", "*", "*", "*", "*"],
            body: [
              [
                Atraso,
                {},
                Adelanto,
                {},
                AtrasosJustificado,
                {},
                AdelantoJustificado,
                {},
              ],
              [Rubros, {}, VelocidadFD, {}, Tarjeta, {}, AtrasoD, {}],
              [AdelantoD, {}, {}, {}, {}, {}, {}, {}],
              [{}, {}, {}, {}, TotalD, {}, {}, {}],
            ],
            margin: [0, 20, 0, 0],
          },
        };
      };

      const componenteTablaFinal = (datos, deudas) => {
        const header = [];
        header.push([
          {
            text: "Descipcion Ruta",
            style: "tableHeader",
            alignment: "center",
            colSpan: 2,
          },
          {},
          { text: "Fecha", style: "tableHeader", alignment: "center" },
          {
            text: "Min. Generados ",
            style: "tableHeader",
            alignment: "center",
          },
          { text: "Min. Justificados", style: "tableHeader" },
          { text: "Deuda Total", style: "tableHeader" },
        ]);
        datos.forEach((dato) => {
          header.push([
            {
              text: dato.linea,
              alignment: "center",
              style: "tableRow",
              colSpan: 2,
            },
            {},
            { text: dato.fecha, alignment: "center", style: "tableRow" },
            { text: dato.minG, alignment: "center", style: "tableRow" },
            { text: dato.minJ, alignment: "center", style: "tableRow" },
            { text: dato.deuda, alignment: "center", style: "tableRow" },
          ]);
        });
        header.push([
          { text: "", border: [false, true, false, false] },
          { text: "", border: [false, true, false, false] },
          { text: "", border: [false, true, false, false] },
          { text: "", border: [false, true, true, false] },
          { text: "TOTAL", alignment: "center", style: "tableFinal" },
          { text: deudas, alignment: "center", style: "tableFinal" },
        ]);
        return {
          table: {
            widths: ["*", "*", "*", "*", "*", "*"],
            body: header,
          },
        };
      };

      const componenteContenido = (datos) => {
        const contenido = [];
        datos.forEach((unidad) => {
          const tablaFinal = {};
          var listaanotaciones = [];
          unidad.salidas.forEach((salida, index) => {
            contenido.push(
              componenteHeader(
                unidad.unidad,
                salida.fechas,
                salida.linea,
                salida.salida
              )
            );
            contenido.push(componenteTablaUnidad(salida));
            //Key == PAGUCHI-2023-07-03
            const clave = `${salida.linea}-${salida.fechas.substring(0, 10)}`;
            if (!tablaFinal[clave]) {
              tablaFinal[clave] = {
                linea: salida.linea,
                fecha: salida.fechas.substring(0, 10),
                minG: convertSecondtoTimeString(salida.AtrasoFTiempoCabezera),
                minJ: convertSecondtoTimeString(salida.AtrasoJTiempoCabezera),
                deuda: salida.DeudaTotal,
              };
            }
            if (salida.anotaciones.length > 0) {
              listaanotaciones.push(...salida.anotaciones);
            }
          });

          contenido.push(...componenteAnotaciones(listaanotaciones));
          contenido.push(
            componenteDatosCabezera(
              unidad.AtrasoFTiempoCabezera,
              unidad.AdelantoFTiempoCabezera,
              unidad.AtrasoJTiempoCabezera,
              unidad.AdelantoJTiempoCabezera,
              unidad.RubroPenalidadCabezera,
              unidad.VelocidadPenalidadCabezera,
              unidad.TarjetaDiariaCabezera,
              unidad.AtrasoPenalidadCabezera,
              unidad.AdelantoPenalidadCabezera,
              unidad.DeudaTotalCabezera
            )
          );
          contenido.push(
            componenteTablaFinal(
              Object.values(tablaFinal),
              unidad.DeudaTotalCabezera
            )
          );
          contenido.push(componenteSeparadorTabla());
        });
        return contenido;
      };

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
                      text: "REPORTE MINUTOS TARJETAS DIARIOS",
                      alignment: "center",
                      fontSize: 16,
                      bold: true,
                    },
                  ],
                  [
                    {
                      text: this.$cookies.get("nameEmpresa"),
                      alignment: "center",
                      fontSize: 16,
                      bold: true,
                    },
                  ],
                ],
              },
            },
          ],
        },
        content: componenteContenido(datos),
        styles: {
          tableHeader: {
            bold: true,
            fontSize: 10,
            color: "black",
          },
          tableRow: {
            fontSize: 9,
            color: "black",
          },
          tableFinal: {
            fontSize: 16,
            color: "green",
            bold: true,
          },
        },
      };

      var pdfDocGenerator = pdfMake.createPdf(docDefinition);
      pdfDocGenerator.getBlob((blob) => {
        var pdfUrl = URL.createObjectURL(blob);
        let iframe = document.getElementById("iframeContainerrMinutosTarjetas");
        iframe.src = pdfUrl;
      });
    },
  },
  mounted() {
    this.readUnidadesTableroProduccion();
    this.initFechaActualProduccionMinutosTarjetas();
  },
};
</script>
<style>
.cardMinutosTarjetas::-webkit-scrollbar {
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

.cardTextoRPagosMinutosTarjetas {
  display: flex;
  align-items: center;
  width: 60%;
}

.cardSelecMinutosTarjetas {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.no-border-card .card-footer {
  border-top: 0;
}

.card-bodyRPagosVehiculoProduccionPC {
  padding: 0rem !important;
  height: calc(100vh - 9.5rem);
  overflow: auto;
}

.card-bodyTopOpcionesRPagosVehiculoPRoduccion {
  padding-top: 0.25rem !important;
}
</style>
