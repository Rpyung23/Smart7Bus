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
            <!--<el-autocomplete class="inline-input" v-model="itemUnidadCobrosPorRubros" []ltiple
                collapse-tags :fetch-suggestions="
                  querySearchUnidadProduccionRPagoVehiculoRecibo
                " style="margin-right: 0.5rem" placeholder="Unidad" prefix-icon="ni ni-bus-front-12"
                :trigger-on-focus="false" @select="handleSelectUnidadProduccionRPagoVehiculoRecibo"></el-autocomplete>-->

            <!--<el-select v-model="itemUnidadCobrosPorRubros" multiple filterable remote placeholder="Unidades"
              prefix-icon="ni ni-bus-front-12" style="margin-right: 0.5rem"
              :remote-method="remoteMethodUnidadesCobrosPorOperador"
              :loading="loadingTableUnidadesRecibosVehiculoProduccion">
              <el-option v-for="item in optionsUnidadesCobrosPorOperador" :key="item.CodiVehi" :label="item.CodiVehi"
                :value="item.CodiVehi">
              </el-option>
            </el-select>-->

            <!--<el-select v-model="itemRubroCobrosPorRubros" multiple filterable remote
                placeholder="Operador" prefix-icon="ni ni-bus-front-12" style="margin-right: 0.5rem"
                :remote-method="remoteMethodUnidadesCobrosPorOperador"
                :loading="loadingTableUnidadesRecibosVehiculoProduccion">
                <el-option v-for="item in optionsCobradoresProduccionPagosVehiculo" :key="item.CodiVehi"
                  :label="item.CodiVehi" :value="item.CodiVehi">
                </el-option>
              </el-select>-->

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
                v-model="fechaInicialRPagosVehiculoProduccionRecibo"
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
                :config="{ allowInput: true }"
                class="form-controlPersonal datepicker"
                v-model="fechaFinalRPagosVehiculoProduccionRecibo"
              >
              </flat-picker>
            </base-input>
          </div>

          <div class="cardSelectRubrosEstadosPagosVehiculoProduccionContainer">
            <div class="buttonCenterEndDerecha">
              <base-button icon type="primary" size="sm" @click="generatePdf()">
                <span class="btn-inner--icon"
                  ><i class="el-icon-search"></i
                ></span>
              </base-button>

              <!--download-excel v-if="tableDataRPagosVEhiculoProduccionRecibo.length > 0 ? true : false" 
                class="btn btn-icon btn-fab btn-success btn-sm" outline :header="RecibosheaderExcelRPagosVehiculoProduccion"
                :data="tableDataRPagosVEhiculoProduccionRecibo" :fields="json_fields_excelRecibosPagosVehiculoProduccion"
                :worksheet="RecibosWorksheetExcelRPagosVehiculoProduccion"
                :name="RecibosFileNameExcelRPagosVehiculoProduccion">
                <span class="btn-inner--icon"><i class="ni ni-collection"></i></span>
              </download-excel-->
            </div>
          </div>
        </card>

        <!--<card class="no-border-card col" style="margin-bottom: 0.5rem"
          body-classes="px-0 pb-1 card-bodyTopOpcionesRPagosVehiculoPRoduccion cardSelectRubrosEstadosPagosVehiculoProduccionContainer"
          footer-classes="pb-2">
          <div class="cardSelectRubrosEstadosRPagosVehiculoProduccion">

            <el-select style="margin-right: 0.5rem;" collapse-tags v-model="itemLineaCobrosPorRubros" multiple
              placeholder="Todas las Lineas">
              <el-option v-for="item in mListaLineasActivosCobrosRubros" :key="item.LetrRuta" :label="item.DescRuta"
                :value="item.idRuta">
              </el-option>
            </el-select>

            <el-select style="margin-right: 0.5rem" collapse-tags
              v-if="mListaGruposPenalidadesSemanales.length > 0 ? true : false" v-model="itemGruposPenalidadesSemanales"
              multiple placeholder="Grupos">
              <el-option v-for="item in mListaGruposPenalidadesSemanales" :key="item.id" :label="item.descripcion"
                :value="item.id">
              </el-option>
            </el-select>

          </div>

        </card>-->

        <card
          class="no-border-card"
          style="margin-bottom: 0rem; height: calc(100vh - 23vh)"
          body-classes="body0 px-0 pb-1"
          footer-classes="pb-2"
        >
          <embed
            id="iframeContainerrMinutosTarjetas"
            type="application/pdf"
            width="100%"
            height="100%"
          />
        </card>
      </div>
    </base-header>

    <!--Form modal-->
    <modal :show.sync="modalsReciboProduccion" size="sm" body-classes="p-0">
      <card
        type="secondary"
        header-classes="bg-transparent pb-5"
        class="border-0 mb-0"
      >
        <iframe
          :src="baseURlPDFPanelDetalleRecibo"
          style="width: 100%; height: 33rem"
        ></iframe>
      </card>
    </modal>
  </div>
</template>
<script>
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
  Switch,
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
import { getFecha_dd_mm_yyyy, FechaStringToHour } from "../../util/fechas";

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
    [Button.name]: Button,
    [Switch.name]: Switch,
  },
  data() {
    return {
      mListaUnidadesPagosVehiculoProduccionRecibo: [],
      mListaRubrosActivosCobrosRubros: [],
      mListaLineasActivosCobrosRubros: [],
      tableDataRPagosVEhiculoProduccionRecibo: [],
      radioEstadoRPagosVehiculoRecibo: "*",
      itemUnidadCobrosPorRubros: [],
      itemRubroCobrosPorRubros: [],
      itemLineaCobrosPorRubros: [],
      token: this.$cookies.get("token"),
      fechaInicialRPagosVehiculoProduccionRecibo: "",
      fechaFinalRPagosVehiculoProduccionRecibo: "",
      loadingRPagosVehiculoRecibo: false,
      Base64PdfRECIBOPDFPRODUCCION: "",
      mPagadoRPagosVehiculoRecibo: "0.00",
      mPendienteRPagosVehiculoRecibo: "0.00",
      modalsReciboProduccion: false,
      oSwitchOrdenarCobrosRubrosFechas: true,
      tableDataDetalleReciboPAgoVehiculoProduccion: [],
      itemModalIdReciboPagoVehiculoProduccion: "",
      itemModalUnidadReciboPagoVehiculoProduccion: "",
      itemModalTotalReciboPagoVehiculoProduccion: "",
      optionsUnidadesCobrosPorOperador: [],
      optionsCobradoresProduccionPagosVehiculo: [],
      loadingTableUnidadesRecibosVehiculoProduccion: false,
      loadingTableCobradoresRecibosVehiculoProduccion: false,
      baseURlPDFPanelDetalleRecibo: "",
      RecibosWorksheetExcelRPagosVehiculoProduccion: "",
      RecibosFileNameExcelRPagosVehiculoProduccion: "",
      mListaGruposPenalidadesSemanales: [],
      nameUsuario:"S/N"
    };
  },
  methods: {
    remoteMethodUnidadesCobrosPorOperador(query) {
      if (query !== "") {
        this.loadingTableUnidadesRecibosVehiculoProduccion = true;
        setTimeout(() => {
          this.loadingTableUnidadesRecibosVehiculoProduccion = false;
          this.optionsUnidadesCobrosPorOperador =
            this.mListaUnidadesPagosVehiculoProduccionRecibo.filter((item) => {
              return (
                item.CodiVehi.toLowerCase().indexOf(query.toLowerCase()) > -1
              );
            });
        }, 200);
      } else {
        this.optionsUnidadesCobrosPorOperador = [];
      }
    },
    initFechaActualProduccionRPAgosVehiculoRecibo() {
      var fecha = new Date();
      var mes = fecha.getMonth() + 1;
      var day = fecha.getDate();
      var hora =
        fecha.getHours() < 10 ? "0" + fecha.getHours() : fecha.getHours();
      var minutes =
        fecha.getMinutes() < 10 ? "0" + fecha.getMinutes() : fecha.getMinutes();
      var format =
        fecha.getFullYear() +
        "-" +
        (mes < 10 ? "0" + mes : mes) +
        "-" +
        (day < 10 ? "0" + day : day);

      console.log(format);

      this.fechaInicialRPagosVehiculoProduccionRecibo = format;
      this.fechaFinalRPagosVehiculoProduccionRecibo = format;
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
    async readAllLineasActivosCobrosRubros() {
      this.mListaLineasActivosCobrosRubros = [];

      var datos = await this.$axios.post(process.env.baseUrl + "/rutes", {
        token: this.token,
        tipo: 1,
      });

      if (datos.data.status_code == 200) {
        this.mListaLineasActivosCobrosRubros.push(...datos.data.data);
      }
    },

    async generatePdf() {
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

      var DatoApi = [];
      var oMultas = "0.00";
      var oTarjeta = "0.00";
      var oSuspension = "0.00";
      var oTotal = "0.00";

      document.getElementById("iframeContainerrMinutosTarjetas").src = "";

      try {
        var response = await this.$axios.post(
          process.env.baseUrl + "/MinutoSancionConsorcio",
          {
            token: this.token,
            fechaI: this.fechaInicialRPagosVehiculoProduccionRecibo,
            fechaF: this.fechaFinalRPagosVehiculoProduccionRecibo
          }
        );

        DatoApi.push(...response.data.datos);
        console.log(response.data.datos)

        for (var i = 0; i < DatoApi.length; i++) 
        {
          console.log(DatoApi[i].AtrasoPenalidad)
          oMultas =
            parseFloat(DatoApi[i].AtrasoPenalidad) + parseFloat(oMultas);
          oTarjeta =
            parseFloat(DatoApi[i].TarjetaDiaria) + parseFloat(oTarjeta);
          oSuspension =
            parseFloat(DatoApi[i].RubroPenalidad) + parseFloat(oSuspension);
          oTotal = oSuspension + oTarjeta + oMultas;
        }
      } catch (error) {
        console.log(error);
      }

      const componenteTabla = (titulo, id_) => {
        const table = {
          headerRows: 0,
          widths: ["auto", "auto", "auto", "auto"],
          body: [
            [{ text: titulo, colSpan: 4, alignment: "center" }, {}, {}, {}],
            [
              { text: "Unidad", bold: true },
              { text: "Multas", alignment: "center", bold: true },
              { text: "Tarjetas", alignment: "center", bold: true },
              { text: "Suspensión", alignment: "center", bold: true },
            ],
          ],
        };

        for (let index = 0; index < DatoApi.length; index++) {
          if (id_ == DatoApi[index].id_descripcion) {
            table.body.push([
              { text: DatoApi[index].CodiVehiSali_m },
              { text: DatoApi[index].AtrasoPenalidad, alignment: "center" },
              { text: DatoApi[index].TarjetaDiaria, alignment: "center" },
              { text: DatoApi[index].RubroPenalidad, alignment: "center" },
            ]);
          }
        }
        //table.body.push([{ text: '', border: [false, true, false, true] }, { text: '10', border: [false, true, false, true] }, { text: '60', border: [false, true, false, true] }, { text: '50', border: [false, true, false, true] },])
        return {
          table,
        };
      };

      const componenteTotal = () => {
        const table = {
          headerRows: 0,
          widths: [80, 100],

          body: [
            [
              {
                text: "Multas",
                border: [false, false, false, false],
                margin: [0, 20, 0, 0],
              },
              {
                text: Number(oMultas).toFixed(2),
                border: [false, false, false, false],
                margin: [0, 20, 0, 0],
              },
            ],
            [
              { text: "Tarjetas", border: [false, false, false, false] },
              {
                text: Number(oTarjeta).toFixed(2),
                border: [false, false, false, false],
              },
            ],
            [
              { text: "Suspensión", border: [false, false, false, false] },
              {
                text: Number(oSuspension).toFixed(2),
                border: [false, false, false, true],
              },
            ],
            [
              { text: "Total", border: [false, false, false, false] },
              {
                text: Number(oTotal).toFixed(2),
                bold: true,
                border: [false, false, false, false],
              },
            ],
          ],
        };
        return { table };
      };

      const componentePdf = (datos) => {
        const contenido = [];
        const columns = [];
        contenido.push({
                      text: ("USUARIO : "+this.nameUsuario ),
                      fontSize: 12,
                    },{
                      text: ".",
                      color:"#FFFFFF",
                      fontSize: 6,
                    })
        columns.push(componenteTabla("Expreso Milagro", 3));
        columns.push(componenteTabla("Ruta Milagreña", 1));
        columns.push(componenteTabla("Ejecutivo Express", 2));
        contenido.push({ columns });
        contenido.push(componenteTotal());
        return contenido;
      };

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
              margin: [120, 0, 0, 0],
              table: {
                widths: ["400"],
                body: [
                  [
                    {
                      text: "REPORTE MINUTOS SANCION CONSORCIO",
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
                  [
                    {
                      text:
                        "(FECHA COBRO) Detalles cobrados del dia " +
                        this.fechaInicialRPagosVehiculoProduccionRecibo +
                        " hasta " +
                        this.fechaFinalRPagosVehiculoProduccionRecibo,
                      alignment: "center",
                      fontSize: 12,
                    },
                  ]
                ],
              },
            },
          ],
        },
        content: componentePdf([]),
      };

      var pdfDocGenerator = pdfMake.createPdf(docDefinition);
      pdfDocGenerator.getBlob((blob) => {
        var pdfUrl = URL.createObjectURL(blob);
        let iframe = document.getElementById("iframeContainerrMinutosTarjetas");
        iframe.src = pdfUrl;
      });

      swal.close();
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
  },
  mounted() {
    this.nameUsuario = this.$cookies.get("namesUsuario")
    this.readGruposActivosPenalidadesSemanales();
    this.readAllLineasActivosCobrosRubros();
    this.readAllUnidadesPagosVehiculoProduccionRecibo();
    this.initFechaActualProduccionRPAgosVehiculoRecibo();
  },
};
</script>
<style>
.form-group {
  margin-bottom: 0rem;
}

.body0 {
  padding-right: 0.2rem;
  padding-left: 0.2rem;
  padding-top: 0.2rem;
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
  flex-wrap: wrap;
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
