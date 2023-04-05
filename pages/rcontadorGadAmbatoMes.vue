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
          <div class="cardTextoConteoGadAmbato">
            <!--<el-select
              v-model="itemUnidadContadorPasajeroVuetas"
              multiple
              filterable
              style="margin-right: 0.5rem"
              remote
              placeholder="Ingrese unidad"
              :remote-method="remoteMethodUnidadesContadorPasajeros"
              :loading="loadingUnidadesContadorPasajeros"
            >
              <el-option
                v-for="item in optionsUnidadesSelectContadorPasajero"
                :key="item.CodiVehi"
                :label="item.CodiVehi"
                :value="item.CodiVehi"
              >
              </el-option>
            </el-select>-->

            <el-date-picker
              type="month"
              placeholder="Select date and time"
              style="margin-right: 0.5rem"
              v-model="fechaInicialConteoPasajerosVueltas"
            >
            </el-date-picker>
          </div>

          <div class="buttonsAdicionalesRContadorVuelta">
            <base-button
              icon
              size="sm"
              title="Buscar"
              type="primary"
              @click="readConteoPasajeros()"
            >
              <span class="btn-inner--icon"
                ><i class="el-icon-search"></i
              ></span>
            </base-button>
          </div>
        </card>

        <!--<card
          class="no-border-card col"
          style="margin-bottom: 0.5rem"
          body-classes="px-0 pb-1 card-bodyTopOpcionesRPagosVehiculoPRoduccion cardSelectRubrosEstadosPagosVehiculoProduccionContainer"
          footer-classes="pb-2"
        >
          <div class="cardSelectRubrosEstadosRPagosVehiculoProduccion">
            <el-select
              v-model="mSelectRutaContadorPasajeroVueltas"
              multiple
              collapse-tags
              placeholder="Lineas"
            >
              <el-option
                v-for="item in mListLineasContadorPasajeros"
                :key="item.LetrRuta"
                :label="item.DescRuta"
                :value="item.LetrRuta"
              >
              </el-option>
            </el-select>
          </div>

          <div class="cardTextoConteoGadAmbato">
            <el-switch
              v-model="switchTipoAgrupacionConteoGadAmbato"
              active-text="AGRUPAR DIA"
              inactive-text="AGRUPAR MES"
            >
            </el-switch>
          </div>
        </card>-->

        <card
          class="no-border-card"
          style="margin-bottom: 0rem"
          body-classes="card-bodyRContadorGadAmbato px-0 pb-1"
          footer-classes="pb-2"
        >
          <embed
            id="iframeContainerGADAMBATO"
            type="application/pdf"
            :src="Base64ReporteGAD"
            width="100%"
            height="98.7%"
          />
        </card>
      </div>
    </base-header>
  </div>
</template>
<script>
import flatPicker from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import pdfMake from "pdfmake/build/pdfmake.js";
import pdfFonts from "pdfmake/build/vfs_fonts.js";

import { getFecha_dd_mm_yyyy, FechaStringToHour } from "../util/fechas";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

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
  Switch,
} from "element-ui";

import RouteBreadCrumb from "@/components/argon-core/Breadcrumb/RouteBreadcrumb";
import { BasePagination } from "@/components/argon-core";
import clientPaginationMixin from "~/components/tables/PaginatedTables/clientPaginationMixin";
import swal from "sweetalert2";
import Tabs from "@/components/argon-core/Tabs/Tabs";
import TabPane from "@/components/argon-core/Tabs/Tab";
import { getBase64LogoReportes } from "../util/logoReport";

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
    [Switch.name]: Switch,
  },
  data() {
    return {
      mListaUnidadesContadorPasajeros: [],
      mListLineasContadorPasajeros: [],
      loadingUnidadesContadorPasajeros: false,
      loadingUnidadesContadorPasajerosPasajerosVueltas: false,
      mSelectRutaContadorPasajeroVueltas: [],
      itemUnidadContadorPasajeroVuetas: [],
      token: this.$cookies.get("token"),
      fechaInicialConteoPasajerosVueltas: "",
      fechaFinalConteoPasajerosVueltas: "",
      optionsUnidadesSelectContadorPasajero: [],
      switchTipoAgrupacionConteoGadAmbato: true,
      tableDataConteoGADAMBATO: [],
      Base64ReporteGAD:""
    };
  },
  methods: {
    remoteMethodUnidadesContadorPasajeros(query) {
      if (query !== "") {
        this.loadingUnidadesContadorPasajeros = true;
        setTimeout(() => {
          this.loadingUnidadesContadorPasajeros = false;
          this.optionsUnidadesSelectContadorPasajero =
            this.mListaUnidadesContadorPasajeros.filter((item) => {
              return (
                item.CodiVehi.toLowerCase().indexOf(query.toLowerCase()) > -1
              );
            });
        }, 200);
      } else {
        this.optionsUnidadesSelectContadorPasajero = [];
      }
    },
    getNombresRutasRConteoPasajerosVueltas() {
      var mlist = [];
      for (var j = 0; j < this.mSelectRutaContadorPasajeroVueltas.length; j++) {
        for (var i = 0; i < this.mListLineasContadorPasajeros.length; i++) {
          if (
            this.mSelectRutaContadorPasajeroVueltas[j] ==
            this.mListLineasContadorPasajeros[i].LetrRuta
          ) {
            mlist.push(this.mListLineasContadorPasajeros[i].DescRuta);
          }
        }
      }
      return mlist;
    },
    initFechaActualContadorPasajerosVueltas() {
      var fecha = new Date();
      var mes = fecha.getMonth() + 1;
      var day = fecha.getDate();
      var format =
        fecha.getFullYear() +
        "-" +
        (mes < 10 ? "0" + mes : mes) +
        "-" +
        (day < 10 ? "0" + day : day);

      this.fechaInicialConteoPasajerosVueltas = format + " ";
      this.fechaFinalConteoPasajerosVueltas = format + " ";
    },
    async readAllUnidadesContadorPasajerosVueltas() {
      var datos = await this.$axios.post(process.env.baseUrl + "/unidades", {
        token: this.token,
      });

      if (datos.data.status_code == 200) {
        for (var i = 0; i < datos.data.data.length; i++) {
          var obj = datos.data.data[i];
          obj.value = obj.CodiVehi;
          this.mListaUnidadesContadorPasajeros.push(obj);
        }
      }
    },
    async readAllLineasContadorPasajerosVueltas() {
      var datos = await this.$axios.post(process.env.baseUrl + "/rutes", {
        token: this.token,
        tipo: 1,
      });
      if (datos.data.status_code == 200) {
        this.mListLineasContadorPasajeros.push(...datos.data.data);
      }
    },
    async readConteoPasajeros() 
    {
      this.Base64ReporteGAD = ""
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

      this.tableDataConteoGADAMBATO = [];
      try {
        var body = {
          token: this.token,
          unidades:
            this.itemUnidadContadorPasajeroVuetas.length == 0
              ? "*"
              : this.itemUnidadContadorPasajeroVuetas,
          rutas:
            this.mSelectRutaContadorPasajeroVueltas.length == 0
              ? "*"
              : this.mSelectRutaContadorPasajeroVueltas,
          fechaI: getFecha_dd_mm_yyyy(this.fechaInicialConteoPasajerosVueltas),
          fechaF: getFecha_dd_mm_yyyy(this.fechaInicialConteoPasajerosVueltas),
        };

        var datos = await this.$axios.post(
          process.env.baseUrl + "/contadorPasajerosGadAmbatoMes",
          body,
          {
            timeout: 600000,
          }
        );

        if (datos.data.status_code == 200) {
          this.tableDataConteoGADAMBATO.push(...datos.data.datos);
          this.createPDFGADAMBATO();
        } else if (datos.data.status_code == 300) {
          Notification.info({
            title: "Conteo de Pasajeros",
            message: "No existen datos disponibles.",
          });
        } else {
          Notification.error({
            title: "Conteo de Pasajeros",
            message: datos.data.msm,
          });
        }
      } catch (error) {
        console.log(error);
        Notification.error({
          title: "TRYCTACH Conteo de Pasajeros",
          message: error.toString(),
        });
      }

      swal.close();

    },
    createPDFGADAMBATO() {
      const color1 = "#008080";
      const color2 = "#FFFFFF";
      const fontSize1 = 10;
      const fontSize2 = 7;
      var listReporte = [];

      var StringFecha = ""

if(this.tableDataConteoGADAMBATO.length > 0){
  const date = new Date(this.tableDataConteoGADAMBATO[0].datos.fechaConteo );
const options = { month: 'long', year: 'numeric' };
StringFecha = new Intl.DateTimeFormat('es-ES', options).format(date);
}

      listReporte.push({
          table: {
            headerRows: 1,
            widths: [150, "*"],
            body: [
              [
                {
                  text: "FORMULARIO N° 3",
                  fillColor: color1,
                  color: color2,
                  fontSize: fontSize1,
                },
                {
                  text: "INFORMACION DIARIA DE PASAJEROS TRANSPORTADOS",
                  alignment: "center",
                },
              ],
              [
                {
                  text: "Operadora",
                  fillColor: color1,
                  color: color2,
                  fontSize: fontSize1,
                },
                {
                  text: this.$cookies.get("nameEmpresa").toUpperCase(),
                  alignment: "center",
                },
              ],
              [
                {
                  text: "Fecha",
                  fillColor: color1,
                  color: color2,
                  fontSize: fontSize1,
                },
                {
                  text: StringFecha.toUpperCase(),
                  alignment: "center",
                },
              ],
              [
                {
                  text: "Valor de Tarifa Integral",
                  fillColor: color1,
                  color: color2,
                  fontSize: fontSize1,
                },
                { text: "0.30", alignment: "center" },
              ],
              [
                {
                  text: "Valor de Tarifa Reducida",
                  fillColor: color1,
                  color: color2,
                  fontSize: fontSize1,
                },
                { text: "0.15", alignment: "center" },
              ],
            ],
          },
        });

        listReporte.push({ text: ".", color: color2 });
        listReporte.push({
          table: {
            headerRows: 1,
            widths: ["*"],
            body: [
              [
                {
                  text: "PASAJEROS TRANSPORTADOS AL DIA",
                  bold: true,
                  fillColor: color1,
                  color: color2,
                  fontSize: fontSize1,
                  alignment: "center",
                },
              ],
            ],
          },
        });

        listReporte.push({ text: ".", color: color2 });

      for (var i = 0; i < this.tableDataConteoGADAMBATO.length; i++) 
      {

        

        listReporte.push({
          table: {
            widths: [150, "*"],
            body: [
              [
                {
                  text: "Linea",
                  fontSize: fontSize1,
                  bold: true,
                },
                {
                  text: this.tableDataConteoGADAMBATO[i].DescRutaSali_m,
                  fontSize: fontSize1,
                  alignment: "center",
                },
              ],
              [
                {
                  text: "N° Pasajeros Tarifia Integral",
                  fontSize: fontSize1,
                  bold: true,
                },
                {
                  text: this.tableDataConteoGADAMBATO[i].datos.tarifaIntegral,
                  fontSize: fontSize1,
                  alignment: "center",
                },
              ],
              [
                {
                  text: "N° Pasajeros Tarifia Reducida",
                  fontSize: fontSize1,
                  bold: true,
                },
                {
                  text: this.tableDataConteoGADAMBATO[i].datos.tarifaReducida,
                  fontSize: fontSize1,
                  alignment: "center",
                },
              ],
              [
                {
                  text: "TOTAL AL MES",
                  fontSize: fontSize1,
                  bold: true,
                },
                {
                  text: this.tableDataConteoGADAMBATO[i].datos.totalSubidas,
                  fontSize: fontSize1,
                  alignment: "center",
                },
              ],
            ],
          },
        });

        listReporte.push({ text: ".", color: color2 });

      }

      var docDefinition = {
        pageSize: "A4",
        pageMargins: [40, 80, 40, 110],
        header: {
          margin: 15,
          columns: [
            {
              image: getBase64LogoReportes("GADAMBATOH"),
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
                      text: "GOBIERNO AUTÓNOMO DESCENTRALIZADO MUNICIPALIDAD DE AMBATO",
                      alignment: "center",
                      fontSize: 10,
                      bold: true,
                    },
                  ],
                  [
                    {
                      text: "DIRECCIÓN DE TRÁNSITO, TRANSPORTE Y MOVILIDAD",
                      alignment: "center",
                      fontSize: 9,
                      bold: true,
                    },
                  ],
                ],
              },
            },
          ],
        },

        footer: {
          margin: 40,
          columns: [
            {
              layout: "noBorders",
              table: {
                widths: [100],
                body: [
                  [
                    {
                      text: "Dirección: Bolivar y 5 de Junio\nTelfax: (03) 2425588 - Tel: (03)2 24233440\nwww.ambato.gob.ec",
                      fontSize: fontSize2,
                    },
                  ],
                ],
              },
            },
            {
              image: getBase64LogoReportes("GADAMBATOF"),
              width: 150,
              height: 50,
              margin: [0, 0, 0, 0],
            },
          ],
        },

        content: listReporte,
      };

      var pdfDocGenerator = pdfMake.createPdf(docDefinition);

      pdfDocGenerator.getBlob((blob) => {
        this.Base64ReporteGAD = URL.createObjectURL(blob);
      });
    },
  },
  mounted() {
  
    this.readAllUnidadesContadorPasajerosVueltas();
    this.initFechaActualContadorPasajerosVueltas();
    this.readAllLineasContadorPasajerosVueltas();
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
.cardTextoConteoGadAmbato {
  display: flex;
  align-items: center;
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
.card-bodyRContadorGadAmbato {
  padding: 0rem !important;
  height: calc(100vh - 9.2rem);
  overflow: auto;
}

.card-bodyTopOpcionesRPagosVehiculoPRoduccion {
  padding-top: 0.25rem !important;
}
</style>
