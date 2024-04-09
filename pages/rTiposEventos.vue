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
              style="margin-right: 0.5rem"
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
              @click="readRDispositivoEventos()"
            >
              <span class="btn-inner--icon"
                ><i class="el-icon-search"></i
              ></span>
            </base-button>

            <base-button
              size="sm"
              title="EXPORTAR PDF"
              v-if="mListaREventosDispositivos.length > 0 ? true : false"
              type="danger"
              @click="exportPdfRDispositivoEventos()"
            >
              <span class="btn-inner--icon"
                ><i class="ni ni-cloud-download-95"></i
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
          <div class="cardTextoRPagosVehiculoProduccion">
            <el-select
              v-model="modelTiposEvento"
              multiple
              collapse-tags
              style="margin-right: 0.5rem"
              placeholder="Tipos de Eventos"
              :loading="loadingTableUnidadesSalidasPanelBusquedaloading"
            >
              <el-option
                v-for="item in mListaTiposEventos"
                :key="item.idTipoDispEvenList"
                :label="item.DescDispEvenList"
                :value="item.idTipoDispEvenList"
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
              :data="mListaREventosDispositivos"
              row-key="id"
              class="tablePanelControlProduccion"
              header-row-class-name="thead-dark"
              height="calc(100vh - 13rem)"
            >
              <el-table-column label="Actions" width="120">
                <template slot-scope="scope">
                  <base-button
                    size="sm"
                    title="UBICAR EVENTO EN MAPA"
                    @click="showMapaEventoDispositivo(scope.row)"
                    type="success"
                    ><i class="ni ni-world"></i
                  ></base-button>
                </template>
              </el-table-column>

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

    <!--Form modal-->
    <modal
      :show.sync="modalUbicacionEventoDispositivo"
      size="xl"
      body-classes="p-1"
    >
      <GmapMap
        map-type-id="roadmap"
        class="mapaEventosDispositivos"
        :center="oCenter"
        :zoom="oZoom"
        :options="{
          zoomControl: false,
          scaleControl: false,
          mapTypeControl: false,
          streetViewControl: false,
          rotateControl: false,
          fullscreenControl: false,
          disableDefaultUi: true,
        }"
      >
        <GmapMarker v-for="(marker,index) in mListaHistorialEventosMapa" :key="index"
          :position="{
            lat: parseFloat(marker.LatiDispEven),
            lng: parseFloat(marker.LongDispEven),
          }"
          :clickable="false"
          :draggable="false"
          :optimized="true"
        />

        <GmapMarker v-for="(marker,index) in mListaHistorialEventosMapa" :key="index"
          :position="{
            lat: parseFloat(marker.LatiDispEven),
            lng: parseFloat(marker.LongDispEven),
          }"
          icon="static/img/control/control.png"
          :clickable="false"
          :draggable="false"
          :optimized="true"
          :options="{
            label: {
              text: marker.DescRutaSali_m + ' \n VUE: ' + marker.NumeVuelSali_m+ ' \n ('+ marker.HoraDispEven+')',
              color: 'red',
              className: 'paddingLabelEventosDispositivos',
            },
          }"
        />
      </GmapMap>
    </modal>
  </div>
</template>
<script>
import pdfMake from "pdfmake/build/pdfmake.js";
import pdfFonts from "pdfmake/build/vfs_fonts.js";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import { getBase64LogoReportes } from "../util/logoReport";
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
      mListaUnidadesSalidasPanelBusqueda: [],
      mListLineasSalidasPanelBusqueda: [],
      loadingTableRVelocidadesBusquedaloading: false,
      loadingTableUnidadesSalidasPanelBusquedaloading: false,
      itemUnidadSalidasPanelBusqueda: [],
      token: this.$cookies.get("token"),
      fechaInicialSalidasPanelBusqueda: "",
      fechaFinalSalidasPanelBusqueda: "",
      optionsUnidadesSalidasPanelBusqueda: [],
      tableColumnsUnidadesFlotaVehicular: [
        {
          prop: "CodiVehiDispEven",
          label: "Unidad",
          minWidth: 110,
        },
        {
          prop: "HoraDispEven",
          label: "Hora",
          minWidth: 150,
        },
        {
          prop: "NumeVuelSali_m",
          label: "N° Vuelta",
          minWidth: 140,
        },
        {
          prop: "DescRutaSali_m",
          label: "Ruta - Linea",
          minWidth: 200,
        },
        {
          prop: "DescDispEvenList",
          label: "Evento",
          minWidth: 250,
        },
      ],
      mListaREventosDispositivos: [],
      modalUbicacionEventoDispositivo: false,
      LatiDispEven: 0,
      LongDispEven: 0,
      oCenter: { lat: -1.249546, lng: -78.585376 },
      oZoom: 7,
      DescDispEvenList: "",
      HoraDispEvenTime: "",
      mListaTiposEventos: [],
      modelTiposEvento: [],
      mListaHistorialEventosMapa: [],
    };
  },

  methods: {
    async showMapaEventoDispositivo(item) {
      console.log(item);
      this.modalUbicacionEventoDispositivo = true;

      try {
        var datos = await this.$axios.post(
          process.env.baseUrl + "/RDetalleDispositivosEventos",
          {
            token: this.token,
            unidad: item.CodiVehiDispEven,
            evento: item.idTipoEvenDispEven,
            fechaI: item.fdechaIB,
            fechaF: item.fdechaFB,
          }
        );

        if (datos.data.status_code == 200) {
          this.LatiDispEven = datos.data.datos[0].LatiDispEven;
          this.LongDispEven = datos.data.datos[0].LongDispEven;
          this.HoraDispEvenTime = datos.data.datos[0].HoraDispEvenTime;
          this.oZoom = 18;
          this.DescDispEvenList = datos.data.datos[0].DescDispEvenList;
          this.oCenter = {
            lat: parseFloat(datos.data.datos[0].LatiDispEven),
            lng: parseFloat(datos.data.datos[0].LongDispEven),
          };
        }

        this.mListaHistorialEventosMapa.push(...datos.data.datos);
      } catch (error) {
        console.log(error);
      }
    },
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
    async readRDispositivoEventos() {
      this.mListaREventosDispositivos = [];
      this.loadingTableRVelocidadesBusquedaloading = true;
      try {
        var datos = await this.$axios.post(
          process.env.baseUrl + "/RDispositivosEventos",
          {
            token: this.token,
            unidades:
              this.itemUnidadSalidasPanelBusqueda.length > 0
                ? this.itemUnidadSalidasPanelBusqueda
                : "*",
            fechaI: this.fechaInicialSalidasPanelBusqueda,
            fechaF: this.fechaFinalSalidasPanelBusqueda,
            tipos:
              this.modelTiposEvento.length <= 0 ? "*" : this.modelTiposEvento,
          },
          {
            timeout: 600000,
          }
        );

        if (datos.data.status_code == 200) {
          this.mListaREventosDispositivos.push(...datos.data.datos);
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
            text: "Cant Eventos",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },
          {
            text: "Detalle Evento",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },
        ],
      ];

      //CodiVehiDispEven,HoraDispEven,DescRutaSali_m,NumeVuelSali_m,DescFrec,DescDispEvenList,LatiDispEven,LongDispEven

      for (var i = 0; i < this.mListaREventosDispositivos.length; i++) {
        var arrys = [
          {
            text: this.mListaREventosDispositivos[i].CodiVehiDispEven,
            alignment: "center",
            fontSize: 8.5,
          },
          {
            text: this.mListaREventosDispositivos[i].NumeVuelSali_m,
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text: this.mListaREventosDispositivos[i].DescRutaSali_m,
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text: this.mListaREventosDispositivos[i].cantDispEventos,
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text: this.mListaREventosDispositivos[i].DescDispEvenList,
            fontSize: 8.5,
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
                      text: "REPORTE CORTES DE ENERGIA EN RUTA",
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
              widths: [30, 40, 140, 100, 150],
              body: resultadoString,
            },
          },
        ],
      };
      /*var win = window.open("", "_blank");
      pdfMake.createPdf(docDefinition).open({}, win);*/
      pdfMake.createPdf(docDefinition).download("RDECR_" + Date.now());
    },
    async readEventosListaReporte() {
      this.mListaTiposEventos = [];

      try {
        var datos = await this.$axios.post(
          process.env.baseUrl + "/readEventosListaReportes",
          {
            token: this.token,
          }
        );

        if (datos.data.status_code == 200) {
          this.mListaTiposEventos.push(...datos.data.datos);
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
  },
  mounted() {
    //this.readHistorialSalidaPanelBusqueda();
    this.readEventosListaReporte();
    this.initFechaActualSalidaBusquedaPanel();
    this.readAllUnidadesSalidasPanelBusqueda();
  },
};
</script>
<style>
.mapaEventosDispositivos {
  width: 100%;
  height: calc(80vh);
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
