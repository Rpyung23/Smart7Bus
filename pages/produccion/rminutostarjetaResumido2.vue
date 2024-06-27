<template>
  <div class="content">
    <base-header>
      <div class="align-items-center py-3">
        <card
          class="no-border-card col"
          style="margin-bottom: 0.5rem"
          body-classes="px-0 pb-1 card-bodyTopOpcionesRPagosVehiculoPRoduccion cardSelectMinutosTarjetasResumido"
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
                :config="config_flatpicker"
                class="form-controlPersonal datepicker"
                v-model="fechaInicialReporteMinutosTarjetas"
              >
              </flat-picker>
            </base-input>

            <base-input
              style="margin-right: 0.5rem"
              addon-left-icon="ni ni-calendar-grid-58"
            >
              <flat-picker
                slot-scope="{ focus, blur }"
                @on-open="focus"
                @on-close="blur"
                :config="config_flatpicker"
                class="form-controlPersonal datepicker"
                v-model="fechaFinalReporteMinutosTarjetas"
              >
              </flat-picker>
            </base-input>
          </div>

          <div class="cardSelectMinutosTarjetasResumido">
            <div class="buttonsAdicionalesRMinutosTarjeta">
              <base-button
                icon
                type="primary"
                @click="createPDFMinutosTarjetas()"
                size="sm"
              >
                <span class="btn-inner--icon"
                  ><i class="el-icon-search"></i
                ></span>
              </base-button>
            </div>
          </div>
        </card>

        <card
          class="no-border-card"
          style="margin-bottom: 0rem"
          body-classes="cardMinutosTarjetasResumido card-bodyRPagosVehiculoProduccionPC px-0 pb-1"
          footer-classes="pb-2"
        >
          <div>
            <iframe
              :src="baseURlPDFPanelProduccionMinutosTarjetas2"
              style="width: 100%; height: 39rem"
            ></iframe>
          </div>
        </card>
      </div>
    </base-header>
  </div>
</template>
<script>
import { getBase64LogoReportes } from "../../util/logoReport";
import pdfMake from "pdfmake/build/pdfmake.js";
import pdfFonts from "pdfmake/build/vfs_fonts.js";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
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
  Switch,
} from "element-ui";
import { Spanish } from "flatpickr/dist/l10n/es.js";
import RouteBreadCrumb from "@/components/argon-core/Breadcrumb/RouteBreadcrumb";
import { BasePagination } from "@/components/argon-core";
import clientPaginationMixin from "~/components/tables/PaginatedTables/clientPaginationMixin";
import swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";
import Tabs from "@/components/argon-core/Tabs/Tabs";
import TabPane from "@/components/argon-core/Tabs/Tab";
import { text } from "d3";

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
    [Switch.name]: Switch,
  },
  data() {
    return {
      tipoOrdenamiento: false,
      config_flatpicker: { allowInput: true, locale: Spanish },
      token: this.$cookies.get("token"),
      fechaInicialReporteMinutosTarjetas: "",
      fechaFinalReporteMinutosTarjetas: "",
      mListaUnidadesPanelProduccion: [],
      optionsUnidadesPanelProduccion: [],
      itemUnidadPanelProduccion: [],
      baseURlPDFPanelProduccionMinutosTarjetas2: "",
      loadingTableUnidadesPanelProduccoionLoading: false,
      optionsUnidadesPanelProduccion: [],
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

      this.fechaInicialReporteMinutosTarjetas = format;
      this.fechaFinalReporteMinutosTarjetas = format;
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
    async createPDFMinutosTarjetas() 
    {

      var total_minutos = 0
      var total_minutos_j = 0

      var empresa = [
        {
          text: "Empresa : " + this.$cookies.get("nameEmpresa"),
          fontSize: 9,
          alignment: "left",
        },
      ];

      var desde_hasta = [
        {
          text:
            "Fecha : " +
            this.fechaInicialReporteMinutosTarjetas +
            " Hasta " +
            this.fechaFinalReporteMinutosTarjetas,
          fontSize: 9,
          alignment: "left",
        },
      ];

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

      try {
        var datos = await this.$axios.post(
          process.env.baseUrl + "/ProduccionMinutosTarjetaResumido2",
          {
            token: this.token,
            fechaI: this.fechaInicialReporteMinutosTarjetas,
            fechaF: this.fechaFinalReporteMinutosTarjetas,
            unidades:
              this.itemUnidadPanelProduccion.length == 0
                ? "*"
                : this.itemUnidadPanelProduccion,
          }
        );

        console.log(datos.data.msm);

        if (datos.data.status_code != 200) {
          Notification.warning({
            title: datos.data.msm,
          });
        }

        var resultadoString = [
          [
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
              text: "T. MINUTOS",
              fontSize: 8.5,
              bold: true,
              fillColor: "#039BC4",
              color: "white",
              alignment: "center",
            },
            {
              text: "J. MINUTOS",
              fontSize: 8.5,
              bold: true,
              fillColor: "#039BC4",
              color: "white",
              alignment: "center",
            },

            {
              text: "T. RESTANTE",
              fontSize: 8.5,
              bold: true,
              fillColor: "#039BC4",
              color: "white",
              alignment: "center",
            },
          ],
        ];

        for (var i = 0; i < datos.data.datos.length; i++) 
        {
          total_minutos = total_minutos + parseInt(datos.data.datos[i].AtrasoFTiempo)
          total_minutos_j = total_minutos_j + parseInt(datos.data.datos[i].AtrasoJTiempo)

          resultadoString.push([
            {
              text: datos.data.datos[i].Unidad,
              fontSize: 8.5,
              color: "black",
              alignment: "center",
            },
            {
              text: datos.data.datos[i].FechaMin,
              fontSize: 8.5,
              color: "black",
              alignment: "center",
            },
            {
              text: datos.data.datos[i].FechaMax,
              fontSize: 8.5,
              color: "black",
              alignment: "center",
            },
            {
              text: datos.data.datos[i].AtrasoFTiempo,
              fontSize: 8.5,
              color: "black",
              alignment: "center",
            },
            {
              text: datos.data.datos[i].AtrasoJTiempo,
              fontSize: 8.5,
              color: "black",
              alignment: "center",
            },

            {
              text: datos.data.datos[i].AtrasoRTiempo,
              fontSize: 8.5,
              color: "black",
              alignment: "center",
            },
          ]);
        }

        var docDefinition = {
          //pageOrientation: "landscape",
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
                        text: "REPORTE DE MINUTOS JUSTIFICADOS",
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
                headerRows: 0,
                widths: [40, 60, 60, 50, 100, 100, 100],
                body: resultadoString,
              },
            },
            {text:".",fontSize: 8.5,},
            {
              table: {
                headerRows: 0,
                widths: [60, 60, 60],
                body: [
                  [
                    {
                      text: "T. MINUTOS",
                      fontSize: 8.5,
                      bold: true,
                      fillColor: "#039BC4",
                      color: "white",
                      alignment: "center",
                    },
                    {
                      text: "J. MINUTOS",
                      fontSize: 8.5,
                      bold: true,
                      fillColor: "#039BC4",
                      color: "white",
                      alignment: "center",
                    },
                    {
                      text: "T. RESTANTE",
                      fontSize: 8.5,
                      bold: true,
                      fillColor: "#039BC4",
                      color: "white",
                      alignment: "center",
                    },
                  ],
                  [
                    {
                      text: total_minutos,
                      fontSize: 11,
                      color: "black",
                      alignment: "center",
                    },
                    {
                      text: total_minutos_j,
                      fontSize: 11,
                      color: "black",
                      alignment: "center",
                    },
                    {
                      text: (total_minutos-total_minutos_j),
                      fontSize: 11,
                      color: "black",
                      alignment: "center",
                    },
                  ],
                ],
              },
            },
          ],
        };

        var pdfDocGenerator = pdfMake.createPdf(docDefinition);

        pdfDocGenerator.getDataUrl((dataUrl) => {
          this.baseURlPDFPanelProduccionMinutosTarjetas2 = dataUrl;
        });
      } catch (error) {
        console.log(error);
        this.baseURlPDFPanelProduccionMinutosTarjetas2 = "";
      }

      swal.close();

      /*var pdfDoc = await PDFDocument.create()
      var timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)
      var TimesRomanBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold)

      var page = pdfDoc.addPage(PageSizes.A4)
      
      var { width, height } = page.getSize()
      var fontSize = 10
      var _x = 35

      page.drawText("                                          "+this.$cookies.get("nameEmpresa").toUpperCase().substring(0, 28), {
        x: _x,
        y: height - 4 * fontSize,
        size: 15,
        font: TimesRomanBold,
        color: rgb(0, 0, 0),
      })

      page.drawText("REPORTE DE MINUTOS Y TARJETAS", {
        x: _x,
        y: height - 5.5 * fontSize,
        size: 13,
        font: TimesRomanBold,
        color: rgb(0, 0, 0)
      })
      
      var descuento = 11.4

      for(var i = 0;i<10;i++)
      {
        await this.createHeaderPDFMinutosTarjeta(page, _x, height, pdfDoc)
        var descuentoAux = await this.createBodyPDFMinutosTarjeta(page, _x, height, pdfDoc,descuento)
        descuento = descuentoAux
        if(descuento >= 89.80){
          page = pdfDoc.addPage(PageSizes.A4)
          descuento = 11.4
        }
      }

      console.log("HEIGTH A4 : "+descuentoAux)



      this.baseURlPDFPanelProduccionMinutosTarjetas = await pdfDoc.saveAsBase64({ dataUri: true });*/
    },
  },
  mounted() {
    this.readUnidadesTableroProduccion();
    this.initFechaActualProduccionMinutosTarjetas();
  },
};
</script>
<style>
.cardMinutosTarjetasResumido::-webkit-scrollbar {
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

.cardTextoRPagosVehiculoProduccion {
  display: flex;
  align-items: center;
}

.cardSelectMinutosTarjetasResumido {
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
