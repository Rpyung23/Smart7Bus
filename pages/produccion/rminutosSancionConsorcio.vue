<template>
  <div class="content">
    <base-header>
      <div class="align-items-center py-3">
        <card class="no-border-card col" style="margin-bottom: 0.5rem"
          body-classes="px-0 pb-1 card-bodyTopOpcionesRPagosVehiculoPRoduccion cardSelectRubrosEstadosPagosVehiculoProduccionContainer"
          footer-classes="pb-2">
          <div class="cardTextoRPagosVehiculoProduccion">


            <!--<el-autocomplete class="inline-input" v-model="itemUnidadCobrosPorRubros" []ltiple
                collapse-tags :fetch-suggestions="
                  querySearchUnidadProduccionRPagoVehiculoRecibo
                " style="margin-right: 0.5rem" placeholder="Unidad" prefix-icon="ni ni-bus-front-12"
                :trigger-on-focus="false" @select="handleSelectUnidadProduccionRPagoVehiculoRecibo"></el-autocomplete>-->

            <el-select v-model="itemUnidadCobrosPorRubros" multiple filterable remote placeholder="Unidades"
              prefix-icon="ni ni-bus-front-12" style="margin-right: 0.5rem"
              :remote-method="remoteMethodUnidadesCobrosPorOperador"
              :loading="loadingTableUnidadesRecibosVehiculoProduccion">
              <el-option v-for="item in optionsUnidadesCobrosPorOperador" :key="item.CodiVehi" :label="item.CodiVehi"
                :value="item.CodiVehi">
              </el-option>
            </el-select>

            <!--<el-select v-model="itemRubroCobrosPorRubros" multiple filterable remote
                placeholder="Operador" prefix-icon="ni ni-bus-front-12" style="margin-right: 0.5rem"
                :remote-method="remoteMethodUnidadesCobrosPorOperador"
                :loading="loadingTableUnidadesRecibosVehiculoProduccion">
                <el-option v-for="item in optionsCobradoresProduccionPagosVehiculo" :key="item.CodiVehi"
                  :label="item.CodiVehi" :value="item.CodiVehi">
                </el-option>
              </el-select>-->

            <base-input addon-left-icon="ni ni-calendar-grid-58" style="margin-right: 0.5rem">
              <flat-picker slot-scope="{ focus, blur }" @on-open="focus" @on-close="blur" :config="{ allowInput: true }"
                class="form-controlPersonal datepicker" v-model="fechaInicialRPagosVehiculoProduccionRecibo">
              </flat-picker>
            </base-input>

            <base-input style="margin-right: 0.5rem" addon-left-icon="ni ni-calendar-grid-58">
              <flat-picker slot-scope="{ focus, blur }" @on-open="focus" @on-close="blur" :config="{ allowInput: true }"
                class="form-controlPersonal datepicker" v-model="fechaFinalRPagosVehiculoProduccionRecibo">
              </flat-picker>
            </base-input>


          </div>

          <div class="cardSelectRubrosEstadosPagosVehiculoProduccionContainer">


            <div class="buttonCenterEndDerecha">
              <base-button icon type="primary" size="sm" @click="readAllRPagosVehiculoProduccionRecibos()">
                <span class="btn-inner--icon"><i class="el-icon-search"></i></span>
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

        <card class="no-border-card col" style="margin-bottom: 0.5rem"
          body-classes="px-0 pb-1 card-bodyTopOpcionesRPagosVehiculoPRoduccion cardSelectRubrosEstadosPagosVehiculoProduccionContainer"
          footer-classes="pb-2">
          <div class="cardSelectRubrosEstadosRPagosVehiculoProduccion">

            <el-select style="margin-right: 0.5rem;" collapse-tags v-model="itemLineaCobrosPorRubros" multiple
              placeholder="Todas las Lineas">
              <el-option v-for="item in mListaLineasActivosCobrosRubros" :key="item.LetrRuta" :label="item.DescRuta"
                :value="item.idRuta">
              </el-option>
            </el-select>

            <el-select style="margin-right: 0.5rem" collapse-tags v-model="itemRubroCobrosPorRubros" multiple
              placeholder="Todos los Rubros">
              <el-option v-for="item in mListaRubrosActivosCobrosRubros" :key="item.id" :label="item.descripcion"
                :value="item.id">
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

        </card>

        <card class="no-border-card" style="margin-bottom: 0rem; height: 72vh;"
          body-classes="cardMinutosTarjetas card-bodyRPagosVehiculoProduccionPC px-0 pb-1" footer-classes="pb-2">
          <embed id="iframeContainerrMinutosTarjetas" type="application/pdf" width="100%" height="100%" />
        </card>


      </div>
    </base-header>

    <!--Form modal-->
    <modal :show.sync="modalsReciboProduccion" size="sm" body-classes="p-0">
      <card type="secondary" header-classes="bg-transparent pb-5" class="border-0 mb-0">
        <iframe :src="baseURlPDFPanelDetalleRecibo" style="width: 100%; height: 33rem"></iframe>
      </card>
    </modal>


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
    [Switch.name]: Switch
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
      baseURlPDFPanelDetalleRecibo: '',
      RecibosWorksheetExcelRPagosVehiculoProduccion: "",
      RecibosFileNameExcelRPagosVehiculoProduccion: "",
      mListaGruposPenalidadesSemanales: [],
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
    tableRowClassNameRPagosVehiculoProduccionRecibo({ row, rowIndex }) {
      if (row.EstadoCobro == 0) {
        //row.estado = "ANULADO";
        return "warning-row-panelControlProduccion";
      } else if (row.EstadoCobro == 1) {
        //row.estado = "PAGADO";
        return "success-row-panelControlProduccion";
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
    async readAllRubrosActivosCobrosRubros() {
      this.mListaRubrosActivosCobrosRubros = []

      var datos = await this.$axios.post(process.env.baseUrl + "/rubros-activos", {
        token: this.token,
      });

      if (datos.data.status_code == 200) {
        this.mListaRubrosActivosCobrosRubros.push(...datos.data.datos)
      }
    },
    async readAllLineasActivosCobrosRubros() {
      this.mListaLineasActivosCobrosRubros = []

      var datos = await this.$axios.post(process.env.baseUrl + "/rutes", {
        token: this.token,
        tipo: 1
      });

      if (datos.data.status_code == 200) {
        this.mListaLineasActivosCobrosRubros.push(...datos.data.data)
      }
    },
    async readAllRPagosVehiculoProduccionRecibos() {

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


      this.generatePdf();
      swal.close();
    },

    generatePdf() {

      const componenteTabla = (titulo) => {
        const table = {
          headerRows: 1,
          widths: ['auto', 'auto', 'auto', 'auto'],
          body: [
            [{ text: titulo, colSpan: 4, alignment: 'center' }, {}, {}, {}],
            [{ text: 'Unidad' }, { text: 'Multas' }, { text: 'Tarjetas' }, { text: 'Suspensión' }]],
        }
        for (let index = 0; index < 10; index++) {
          table.body.push([{ text: '1' }, { text: '6.00' }, { text: '5.00' }, { text: '-' }])

        }
        table.body.push([{ text: '', border: [false, true, false, true] }, { text: '10', border: [false, true, false, true] }, { text: '60', border: [false, true, false, true] }, { text: '50', border: [false, true, false, true] },])
        return ({
          table
        })
      }
      const componenteTotal = () => {
        const table = {
          headerRows: 0,
          widths: [80, 100],
          
          body: [
            [{ text: 'Multas', border: [false, false, false, false],margin: [ 0, 20, 0, 0 ] }, { text: '40', border: [false, false, false, false], margin: [ 0, 20, 0, 0 ] }],
            [{ text: 'Tarjetas', border: [false, false, false, false] }, { text: '40', border: [false, false, false, false] }],
            [{ text: 'Suspensión', border: [false, false, false, false] }, { text: '40', border: [false, false, false, true] }],
            [{ text: 'Total', border: [false, false, false, false] }, { text: '40', border: [false, false, false, false] }],

          ],

        }
        return ({ table })
      }

      const componentePdf = (datos) => {
        const contenido = [];
        const columns = [];
        columns.push(componenteTabla('Expreso Milagro'));
        columns.push(componenteTabla('Ruta Milagreña'));
        columns.push(componenteTabla('Ejecutivo Expres'));
        contenido.push({ columns })
        contenido.push(componenteTotal())
        return contenido;
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
                      text: "Detalles cobrados del dia " + this.fechaInicialRPagosVehiculoProduccionRecibo + " hasta " + this.fechaFinalRPagosVehiculoProduccionRecibo,
                      alignment: "center",
                      fontSize: 12,

                    },
                  ],
                ],
              },
            },
          ],
        },
        content: componentePdf([])
      };


      var pdfDocGenerator = pdfMake.createPdf(docDefinition);
      pdfDocGenerator.getBlob((blob) => {
        var pdfUrl = URL.createObjectURL(blob);
        let iframe = document.getElementById("iframeContainerrMinutosTarjetas");
        iframe.src = pdfUrl;
      });
    },

    async readAllDetalleReciboPagosVehiculoProduccion(index, item) {
      this.modalsReciboProduccion = true;
      try {
        var datos = await this.$axios.post(
          process.env.baseUrl + "/ProduccionDetalleRecibosPagosVehiculo",
          {
            token: this.token,
            recibo: item.numero_cobro,
            nameEmpresa: this.$cookies.get('nameEmpresa'),
            unidad: item.Unidad,
            fechaPago: item.fecha_cobro,
          }
        );

        this.baseURlPDFPanelDetalleRecibo = "data:application/pdf;base64," + datos.data.datos
      } catch (error) {
        Notification.error({
          title: "ERROR CATCH Reporte Pagos Vehiculo",
          message: error.toString(),
          duration: 2500,
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
  },
  mounted() {
    this.readAllRubrosActivosCobrosRubros()
    this.readGruposActivosPenalidadesSemanales();
    this.readAllLineasActivosCobrosRubros()
    this.readAllUnidadesPagosVehiculoProduccionRecibo()
    this.initFechaActualProduccionRPAgosVehiculoRecibo()
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
  