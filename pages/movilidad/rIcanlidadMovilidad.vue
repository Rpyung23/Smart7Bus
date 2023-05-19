<template>
  <div class="content">
    <base-header>
      <div class="align-items-center py-3">
        <card class="no-border-card col" style="margin-bottom: 0.5rem"
          body-classes="px-0 pb-1 card-bodyTopOpcionesRPagosVehiculoPRoduccion cardSelectRubrosEstadosPagosVehiculoProduccionContainer"
          footer-classes="pb-2">
          <div class="cardTextoRPagosVehiculoProduccion">


            <!--<el-autocomplete class="inline-input" v-model="itemUnidadProduccionRPagoVehiculorecibo" []ltiple
              collapse-tags :fetch-suggestions="
                querySearchUnidadProduccionRPagoVehiculoRecibo
              " style="margin-right: 0.5rem" placeholder="Unidad" prefix-icon="ni ni-bus-front-12"
              :trigger-on-focus="false" @select="handleSelectUnidadProduccionRPagoVehiculoRecibo"></el-autocomplete>-->

            <el-select v-model="itemUnidadProduccionRPagoVehiculorecibo" multiple filterable remote placeholder="Unidades"
              prefix-icon="ni ni-bus-front-12" style="margin-right: 0.5rem"
              :remote-method="remoteMethodUnidadesRecibosProduccion"
              :loading="loadingTableUnidadesRecibosVehiculoProduccion">
              <el-option v-for="item in optionsUnidadesProduccionPagosVehiculo" :key="item.CodiVehi"
                :label="item.CodiVehi" :value="item.CodiVehi">
              </el-option>
            </el-select>

            <!--<el-select v-model="itemRutasIndicadoresCalidad" multiple filterable remote
              placeholder="Operador" prefix-icon="ni ni-bus-front-12" style="margin-right: 0.5rem"
              :remote-method="remoteMethodUnidadesRecibosProduccion"
              :loading="loadingTableUnidadesRecibosVehiculoProduccion">
              <el-option v-for="item in optionsCobradoresProduccionPagosVehiculo" :key="item.CodiVehi"
                :label="item.CodiVehi" :value="item.CodiVehi">
              </el-option>
            </el-select>-->




            <el-date-picker type="date" placeholder="Select date and time" style="margin-right: 0.5rem;"
              v-model="fechaInicialIndicadorCalidad">
            </el-date-picker>

            <el-date-picker type="date" placeholder="Select date and time" style="margin-right: 0.5rem;"
              v-model="fechaFinalIndicadorCalidad">
            </el-date-picker>

            <!-- DOWNLOAD EXCEL-->



          </div>

          <div class="cardSelectRubrosEstadosPagosVehiculoProduccionContainer">
            <base-button icon type="primary" @click="readAllIndicadoresCalidad" size="sm">
              <span class="btn-inner--icon"><i class="el-icon-search"></i></span>
            </base-button>

          </div>
        </card>

        <card class="no-border-card col" style="margin-bottom: 0.5rem"
          body-classes="px-0 pb-1 card-bodyTopOpcionesRPagosVehiculoPRoduccion cardSelectRubrosEstadosPagosVehiculoProduccionContainer"
          footer-classes="pb-2">
          <div class="cardSelectRubrosEstadosRPagosVehiculoProduccion">
            <!--<el-radio v-model="radioEstadoRPagosVehiculoRecibo" label="*"
              >TODOS</el-radio
            >
            <el-radio v-model="radioEstadoRPagosVehiculoRecibo" label="2"
              >PAGADOS</el-radio
            >
            <el-radio v-model="radioEstadoRPagosVehiculoRecibo" label="1"
              >ANULADOS</el-radio
            >-->

            <el-select style="margin-right: 0.5rem;" collapse-tags v-model="itemRutasIndicadoresCalidad" multiple
              placeholder="Rutas">
              <el-option v-for="item in mListaRutasIndicadoresCalidad" :key="item.LetrRuta" :label="item.DescRuta"
                :value="item.idRuta">
              </el-option>
            </el-select>

          </div>

          <div class="cardTextoRPagosVehiculoProduccion">

          </div>
        </card>


        <!--  <card class="no-border-card" style="margin-bottom: 0rem"
          body-classes="card-bodyRPagosVehiculoReciboProduccion px-0 pb-1" footer-classes="pb-2">
          <div>
            <iframe :src="oBase64IndicadoresCalidad" style="width: 100%; height: 35.5rem"></iframe>
          </div>
        </card> -->

        <card class="no-border-card" style="margin-bottom: 0px; width: 100%; height: calc(100vh - 13rem)">
          <embed id="iframeContainerIndicadoresCalidad" :src="oBase64IndicadoresCalidad" type="application/pdf"
            width="100%" height="100%" />
        </card>

      </div>
    </base-header>

  </div>
</template>
<script>
import flatPicker from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import { getFecha_dd_mm_yyyy, FechaStringToHour } from '../../util/fechas'

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
} from "element-ui";

import RouteBreadCrumb from "@/components/argon-core/Breadcrumb/RouteBreadcrumb";
import { BasePagination } from "@/components/argon-core";
import clientPaginationMixin from "~/components/tables/PaginatedTables/clientPaginationMixin";
import swal from "sweetalert2";
import Tabs from "@/components/argon-core/Tabs/Tabs";
import TabPane from "@/components/argon-core/Tabs/Tab";
import { getBase64LogoReportes } from "../../util/logoReport";
import *  as pdfMake from "pdfmake/build/pdfmake";
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
  },
  data() {
    return {
      mListaUnidadesPagosVehiculoProduccionRecibo: [],
      tableDataRPagosVEhiculoProduccionRecibo: [],
      itemUnidadProduccionRPagoVehiculorecibo: [],
      itemRutasIndicadoresCalidad: [],
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
      baseURlPDFPanelDetalleRecibo: '',
      oBase64IndicadoresCalidad: "",
      mListaRutasIndicadoresCalidad: [],

    }
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
    async readAllUnidadesPagosVehiculoProduccionRecibo() {
      var datos = await this.$axios.post(process.env.baseUrl + "/unidades", {
        token: this.token,
      });

      console.log(datos.data);

      if (datos.data.status_code == 200) {
        for (var i = 0; i < datos.data.data.length; i++) {
          var obj = datos.data.data[i];
          obj.value = obj.CodiVehi;
          this.mListaUnidadesPagosVehiculoProduccionRecibo.push(obj);
        }
      }
    },
    async readAllRutasIndicadoresCalidad() {
      this.mListaRutasIndicadoresCalidad = []

      var datos = await this.$axios.post(process.env.baseUrl + "/rutes", {
        token: this.token,
        tipo: 1
      });

      if (datos.data.status_code == 200) {
        this.mListaRutasIndicadoresCalidad.push(...datos.data.data)
      }
    },
    async readAllIndicadoresCalidad() {
      this.mListaRutasIndicadoresCalidad = []

      let iframe = document.getElementById('iframeContainerIndicadoresCalidad');
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
                  `
      });

      this.oBase64IndicadoresCalidad = ""

      try {
        var rutasString = []
        if (this.itemRutasIndicadoresCalidad.length <= 0) {
          rutasString.push("Todas las rutas")
        } else {
          for (var j = 0; j < this.itemRutasIndicadoresCalidad.length; j++) {
            for (var i = 0; i < this.mListaRutasIndicadoresCalidad.length; i++) {
              if (this.mListaRutasIndicadoresCalidad[i].idRuta == this.itemRutasIndicadoresCalidad[j]) {
                rutasString.push(this.mListaRutasIndicadoresCalidad[i].DescRuta)
              }
            }
          }
        }

        var datos = await this.$axios.post(process.env.baseUrl + "/IndicadoresCalidad", {
          token: this.token,
          unidades: this.itemUnidadProduccionRPagoVehiculorecibo.length <= 0 ? "*" : this.itemUnidadProduccionRPagoVehiculorecibo,
          rutas: this.itemRutasIndicadoresCalidad.length <= 0 ? "*" : this.itemRutasIndicadoresCalidad,
          fechaI: getFecha_dd_mm_yyyy(this.fechaInicialIndicadorCalidad),
          fechaF: getFecha_dd_mm_yyyy(this.fechaFinalIndicadorCalidad),
          rutasString: rutasString,
          nameEmpresa: this.$cookies.get("nameEmpresa"),
          usuarioName: this.$cookies.get("namesUsuario")
        }, {
          'Content-Type': 'application/json'
        })

        console.log('Datos .==================..', datos)

        if (datos.data.status_code == 200) {
          //this.oBase64IndicadoresCalidad = "data:application/pdf;base64," + datos.data.datos
          console.log('Agrego indicadores Calidad .........');
          this.genratePdf(datos.data.datos);
        }
      } catch (error) {
        console.log(error)
        Notification.error({
          title: "ERROR",
          message: error.toString(),
          duration: 2500,
        });
      }

      swal.close()

    },
    genratePdf(datos) {
      const componenteResultado = (acu, acuNo) => {
        const porce = (100 * acu / (acu + acuNo));
        return [[" ", "", { text: "Total viajes considerados", colSpan: 2, alignment: "right" }, {}, { text: acu + acuNo, alignment: "right", bold: true }],
        ["", "", { text: "Número que no cumplen", colSpan: 2, alignment: "right" }, {}, { text: acuNo, alignment: "right", bold: true }],
        ["", "", { text: "Número que cumplen ", colSpan: 2, alignment: "right" }, {}, { text: acu, alignment: "right", bold: true }],
        ["", "", {}, " ", { text: "Total: " + porce.toFixed(2) + " %", style: [porce.toFixed(2) === 100 ? 'textFond' : 'textFondN'], bold: true, alignment: "center" }],
        ["", "", {}, " ", { text: "CUMPLE", style: [porce.toFixed(2) === 100 ? 'textFond' : 'textFondN'], bold: true, alignment: 'center' }]];
      }
      const componenteHeader = (titulo) => {
        var tipoInfomer =
        {
          text: titulo,
          fontSize: 14,
          alignment: 'center',
          bold: true,
          colSpan: 4,
        };
        var empresa =
        {
          text: this.$cookies.get("nameEmpresa"),
          fontSize: 12,
          alignment: 'center',
          colSpan: 2,
          bold: true,
        };
        var ruta =
        {
          text: [
            { text: "RUTA : ", fontSize: 12, bold: true },
            {
              text: (this.itemRutasIndicadoresCalidad.length == 0
                ? "TODAS LAS RUTAS"
                : this.itemRutasIndicadoresCalidad.toString())
            },
          ], colSpan: 2,
        };
        var periodo =
        {
          text: [
            { text: "PERIODO : ", fontSize: 12, bold: true, },
            this.fechaInicialIndicadorCalidad,
            " Hasta ",
            this.fechaFinalIndicadorCalidad,

          ], colSpan: 2,

        };
        var impresion =
        {
          text: [{ text: 'IMPRESION: ', fontSize: 12, bold: true }, this.fechaInicialIndicadorCalidad]
          , colSpan: 2,
        };
        return {
          headerRows: 0,
          widths: ["*", "*", "*", "*"],
          body: [[tipoInfomer, {}, {}, {}],
          ["", empresa, {}, ""],
          [periodo, {}, impresion, {}],
          [ruta, {}, " ", " "]],
          //body: [[ 'First', 'Second', 'Third', 'The last one' ]],
        }
      };
      const componenteHeaderTable = (arrayTitulos) => {
        return arrayTitulos.map((titulo) => ({
          text: titulo,
          fontSize: 8.5,
          bold: true,
          fillColor: "#039BC4",
          color: "white",
          alignment: "center",
        }))
      }

      // tabla tvhp
      var resultadoString = [];
      var acuCumple = 0;
      var acuNoCumple = 0;
      for (var i = 0; i < datos.tvhp.length; i++) {
        var arrys = [
          {
            text: datos.tvhp[i].Unidad,
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text: datos.tvhp[i].Fecha,
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text: datos.tvhp[i].Programado,
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text: datos.tvhp[i].Ejecutado,
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text: datos.tvhp[i].Indicador,
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text: datos.tvhp[i].Estado,
            fontSize: 10,
            alignment: "center",
            style: [datos.tvhp[i].Estado === "Cumple" ? 'textGreen' : 'textRed']
          },

        ];
        if (datos.tvhp[i].Estado === "Cumple") {
          acuCumple = acuCumple + 1;
        } else {
          acuNoCumple = acuNoCumple + 1;
        }


        resultadoString.push(arrys);
      }
      // tabla tvhv
      var resultadoStringtvhv = [];
      var acuCumpletvhv = 0;
      var acuNoCumpletvhv = 0;
      for (var i = 0; i < datos.tvhv.length; i++) {
        var arrys = [
          {
            text: datos.tvhv[i].Unidad,
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text: datos.tvhv[i].Fecha,
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text: datos.tvhv[i].Programado,
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text: datos.tvhv[i].Ejecutado,
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text: datos.tvhv[i].Indicador,
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text: datos.tvhv[i].Estado,
            fontSize: 8.5,
            alignment: "center",
          },

        ];
        if (datos.tvhv[i].Estado === "Cumple") {
          acuCumpletvhv = acuCumpletvhv + 1;
        } else {
          acuNoCumpletvhv = acuNoCumpletvhv + 1;
        }
        resultadoStringtvhv.push(arrys);
      }
      // tabla ihp
      var resultadoStringihp = [];
      var acuCumpleihp = 1;
      var acuNoCumpleihp = 0;
      var contEICIHP = 0
      var contEI2CIHP = 1
      for (var i = 0; i < datos.cihp.length; i++) {
        var arrys = [
          {
            text: datos.cihp[i].Unidad,
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text: datos.cihp[i].NumeroTarjeta,
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text: datos.cihp[i].Salida,
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text: datos.cihp[i].Llegada,
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text: datos.cihp[i].Programado,
            fontSize: 8.5,
            alignment: "center",
          },

        ];
        if (i == 0) {
          arrys.push({
            text: "0",
            fontSize: 8.5,
            alignment: "center",
          });
          arrys.push({
            text: "0",
            fontSize: 8.5,
            alignment: "center",
          });
          arrys.push({
            text: "Cumple",
            fontSize: 8.5,
            alignment: "center",
            bold: true,
            style: ['textGreen']
          });

        }
        else {
          var hora1 = datos.cihp[contEICIHP].Llegada.split(":")
          var hora2 = datos.cihp[contEI2CIHP].Llegada.split(":")
          var t1 = new Date()
          var t2 = new Date()
          t1.setHours(hora1[0], hora1[1], hora1[2]);
          t2.setHours(hora2[0], hora2[1], hora2[2]);
          var ejecutado = ((t2 - t1) / 60) / 1000;
          var estado = '';
          var indicador = 0;
          if (contEICIHP < datos.cihp.length) {
            contEICIHP = contEICIHP + 1
          }
          if (contEI2CIHP <= datos.cihp.length) {
            contEI2CIHP = contEI2CIHP + 1
          }
          if ((ejecutado - datos.cihp[i].Programado) < 2) {
            estado = 'Cumple'
            acuCumpleihp = acuCumpleihp + 1;
          } else {
            estado = 'No Cumple'
            acuNoCumpleihp = acuNoCumpleihp + 1;
          }
          indicador = ((ejecutado - datos.cihp[i].Programado) / datos.cihp[i].Programado) * 100;

          arrys.push({
            text: ejecutado.toFixed(0),
            fontSize: 8.5,
            alignment: "center",
          });
          arrys.push({
            text: indicador.toFixed(2),
            fontSize: 8.5,
            alignment: "center",
          });
          arrys.push({
            text: estado,
            fontSize: 8.5,
            alignment: "center",
            bold: true,
            style: [estado === "Cumple" ? 'textGreen' : 'textRed']
          });


        }

        resultadoStringihp.push(arrys);
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
                      text: "REPORTE INDICADORES DE CALIDAD",
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
                  [
                    {
                      text: "TIEMPO DE VIAJE HORA PICO (TVHP)",
                      alignment: "center",
                      fontSize: 16,
                      bold: true,
                    },
                  ],
                  [
                    {
                      text: "TIEMPO DE VIAJE HORA PICO (TVHP)",
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
            table: componenteHeader("TIEMPO DE VIAJE HORA PICO (TVHP)"),
          },
          ,
          {
            table: {
              headerRows: 0,
              widths: [80, 80, 80, 80, 80, 80],
              body: [componenteHeaderTable(["Unidad", "Fecha", "Programado", "Ejecutado", "Indicador", "Estado"]), ...resultadoString],
            },

          },
          {
            layout: "noBorders",
            table: {
              headerRows: 0,
              widths: ["*", "*", "*", "*", "*"],
              body: componenteResultado(acuCumple, acuNoCumple),
            }, margin: [0, 10, 0, 0]
          },

          { text: '', pageBreak: 'before' },
          {
            layout: "noBorders",
            table: componenteHeader("TIEMPO DE VIAJE HORA VALLE Y COLATERAL (TVHV)"),
          },
          {
            table: {
              headerRows: 0,
              widths: [80, 80, 80, 80, 80, 80],
              body: [componenteHeaderTable(["Unidad", "Fecha", "Programado", "Ejecutado", "Indicador", "Estado"]), ...resultadoStringtvhv],
            },
          },
          {
            layout: "noBorders",
            table: {
              headerRows: 0,
              widths: ["*", "*", "*", "*", "*"],
              body: componenteResultado(acuCumpletvhv, acuNoCumpletvhv),
            }, margin: [0, 10, 0, 0]
          },

          { text: '', pageBreak: 'before' },
          {
            layout: "noBorders",
            table: componenteHeader("CUMPLIMIENTO DE INTERVALO EN HORA PICO (IHP)"),
          },
          {
            table: {
              headerRows: 0,
              widths: [60, 60, 60, 60, 60, 60, 60, 60],
              body: [componenteHeaderTable(["Unidad", "Tarjeta", "Salida", "Llegada", "Programado", "Ejecutado", "Indicador", "Estado"]), ...resultadoStringihp],
            },
          },
          {
            layout: "noBorders",
            table: {
              headerRows: 0,
              widths: ["*", "*", "*", "*", "*"],
              body: componenteResultado(acuCumpleihp, acuNoCumpleihp),
            }, margin: [0, 10, 0, 0]
          },
        ], styles: {
          textRed: { color: '#ff0000', bold: true }, textGreen: { color: '#008000', bold: true }, textFond: { color: '#fafafa', fillColor: 'green' },
          textFondN: { color: '#fafafa', fillColor: 'red' }
        }
      };

      var pdfDocGenerator = pdfMake.createPdf(docDefinition)
      pdfDocGenerator.getBlob((blob) => {
        var pdfUrl = URL.createObjectURL(blob)
        let iframe = document.getElementById('iframeContainerIndicadoresCalidad');
        iframe.src = pdfUrl;
      });

    }

  },
  mounted() {
    this.readAllRutasIndicadoresCalidad()
    this.readAllUnidadesPagosVehiculoProduccionRecibo();
    this.initFechaActualProduccionRPAgosVehiculoRecibo();
  },
};
</script>
<style>
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
