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
              @click="readRPuertaEventos()"
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
              :data="mListaREventosDispositivos"
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


              <el-table-column
      prop="tot"
      label="TOTAL ($)"
      width="230">
      <template slot-scope="scope">
        <strong style="font-size: 1rem;color:black;">{{scope.row.tot}}</strong>
      </template>
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
      <div class="MapaFueraRutaModal">
        <div class="switch_RutaActiveFueraRuta">
          <el-switch
            v-model="showMostarRuta_FueraRuta"
            active-text=""
            inactive-text="Mostrar Ruta"
            @change="changeMostrarRuta_FueraRuta()"
          >
          </el-switch>
        </div>

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
          <GmapPolyline
            :path="mListRutaSubidaFueraRuta"
            :options="{
              strokeColor: '#A52714',
              fillColor: '#A52714',
              strokeOpacity: 0.6,
              strokeWeight: 4,
            }"
          >
          </GmapPolyline>
          <GmapPolyline
            :path="mListRutaBajadaFueraRuta"
            :options="{
              strokeColor: '#01579B',
              fillColor: '#01579B',
              strokeOpacity: 0.6,
              strokeWeight: 4,
            }"
          >
          </GmapPolyline>


          <GmapMarker
        v-if="mListRutaBajadaFueraRuta.length > 0"
        :position="{
          lat: parseFloat(mListRutaBajadaFueraRuta[0].lat),
          lng: parseFloat(mListRutaBajadaFueraRuta[0].lng),
        }"
        :optimized="true"
        :icon= '"img/monitoreo/start_route.png"'
      />
      <GmapMarker
        v-if="mListRutaSubidaFueraRuta.length > 0"
        :position="{
          lat: parseFloat(mListRutaSubidaFueraRuta[0].lat),
          lng: parseFloat(mListRutaSubidaFueraRuta[0].lng),
        }"
        :optimized="true"
        :icon= '"img/monitoreo/end_route.png"'
      />


          <GmapMarker
            v-for="(marker, index) in mListaHistorialEventosMapa"
            :key="index"
            :position="{
              lat: parseFloat(marker.LatiHistEven),
              lng: parseFloat(marker.LongHistEven),
            }"
            :icon="marker.icono"
            @mouseover="showInfoWindowsRecorrido(marker, index)"
            @mouseout="closeInfoWindowsRecorrido()"
            :draggable="false"
            :optimized="true"
          />

          <GmapInfoWindow
            :options="infoOptions"
            :position="infoWindowPos"
            :opened="infoWinOpen"
            @closeclick="infoWinOpen = false"
          >
            <div v-html="infoContent"></div>
          </GmapInfoWindow>

          <!--<GmapMarker v-for="(marker,index) in mListaHistorialEventosMapa" :key="index"
          :position="{
            lat: parseFloat(marker.LatiHistEven),
            lng: parseFloat(marker.LongHistEven),
          }"
          icon="static/img/control/control.png"
          :clickable="false"
          :draggable="false"
          :optimized="true"
          :options="{
            label: {
              text: marker.DescRutaSali_m +' VELO : '+marker.VeloHistEven +' \n VUE: ' + marker.NumeVuelSali_m+ ' \n ('+ marker.FechHistEven+')',
              color: 'red',
              className: 'paddingLabelEventosDispositivos',
            },
          }"
        />-->
        </GmapMap>
      </div>
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
    [Switch.name]: Switch,
  },
  data() {
    return {
      infoContent: "",
      infoWindowPos: {
        lat: 0,
        lng: 0,
      },
      infoOptions: {
        pixelOffset: {
          width: 0,
          height: -17,
        },
      },
      infoWinOpen: false,
      currentMidx: null,
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
          prop: "unidad",
          label: "Unidad",
          minWidth: 110,
        },{
          prop: "descripcion",
          label: "Grupo",
          minWidth: 140,
        },{
          prop: "NumeVuelSali_m",
          label: "N° Vuelta",
          minWidth: 150,
        },
        {
          prop: "HoraDispEven",
          label: "F. Evento",
          minWidth: 185,
        },
        {
          prop: "RangoPermitido",
          label: "F. Tolerancia",
          minWidth: 200,
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
        },
      ],
      mListaPosicionesFueraRuta: [],
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
      showMostarRuta_FueraRuta: false,
      LetrRutaFueraRuta: "",
      mListRutaSubidaFueraRuta: [],
      mListRutaBajadaFueraRuta: [],
    };
  },

  methods: {
    async showMapaFueraRutas(item) {
      this.showMostarRuta_FueraRuta = false
      this.modalUbicacionEventoDispositivo = true;
      console.log(item)
      this.LetrRutaFueraRuta = item.LetraRutaSali_m;
      await this.readPosicionesFueraRuta(item);
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
    async readRPuertaEventos() {
      this.mListaREventosDispositivos = [];
      this.loadingTableRVelocidadesBusquedaloading = true;
      try {
        var datos = await this.$axios.post(
          process.env.baseUrl + "/RPuertas",
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
    async readRPuertaEventosTramos() {
      
      
      try {
        var datos = await this.$axios.post(
          process.env.baseUrl + "/RPuertasTramos",
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
    async readPosicionesFueraRuta(item) {
      console.log(item);
      try {
        var datos = await this.$axios.post(
          process.env.baseUrl + "/historialFueraRutaSalida",
          {
            token: this.token,
            unidad: item.CodiVehiHistEven,
            fechaI: item.fechaIHE,
            fechaF: item.fechaFHE,
            salida: item.idSali_mHistEven,
          },
          {
            timeout: 600000,
          }
        );

        for (var i = 0; i < datos.data.datos.length; i++) {
          var obj = datos.data.datos[i];
          if (i == 0) {
            this.oCenter = {
              lat: parseFloat(obj.LatiHistEven),
              lng: parseFloat(obj.LongHistEven),
            };
            this.oZoom = 17;
          }
          obj.icono = {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            fillColor: "red",
            fillOpacity: 1,
            strokeWeight: 0,
            rotation: obj.RumbHistEven,
            scale: 3,
            anchor: new google.maps.Point(0, 0),
          };
          this.mListaHistorialEventosMapa.push(obj);
        }
      } catch (error) {
        console.log(error.toString());
      }
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

      for (var i = 0; i < this.mListaREventosDispositivos.length; i++) {
        var arrys = [
          {
            text: this.mListaREventosDispositivos[i].unidad,
            alignment: "center",
            fontSize: 8.5,
          },
          {
            text: this.mListaREventosDispositivos[i].descripcion,
            fontSize: 8.5,
            alignment: "center",
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
            text: this.mListaREventosDispositivos[i].HoraDispEven,
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text: this.mListaREventosDispositivos[i].RangoPermitido,
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text: this.mListaREventosDispositivos[i].tot,
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
    },
    async getInfoWindowContentRecorrido(unidad) {
      return `<div style="width:300px;padding:0.50rem">
              <strong class="strongLetrasInfoWindows">FECHA MONI : </strong> ${unidad.FechHistEven}<br>
              <strong class="strongLetrasInfoWindows">VELOCIDAD : </strong> ${unidad.VeloHistEven} <strong>KM/H</strong><br>
              <strong class="strongLetrasInfoWindows">SATELITES : </strong> ${unidad.SateHistEven}<br>
              <strong class="strongLetrasInfoWindows">RUTA : </strong> ${unidad.DescRutaSali_m}
            </div>`;
    },
    async closeInfoWindowsRecorrido() {
      this.infoWinOpen = false;
    },
    async showInfoWindowsRecorrido(unidad, idx) {
      this.infoWindowPos = {
        lat: parseFloat(unidad.LatiHistEven),
        lng: parseFloat(unidad.LongHistEven),
      };
      this.infoContent = await this.getInfoWindowContentRecorrido(unidad);

      //check if its the same marker that was selected if yes toggle
      if (this.currentMidx == idx) {
        this.infoWinOpen = !this.infoWinOpen;
      }
      //if different marker set infowindow to open and reset current marker index
      else {
        this.infoWinOpen = true;
        this.currentMidx = idx;
      }
    },
    async changeMostrarRuta_FueraRuta() {
      console.log("MOSTRANDO RUTA........")
      try {
        this.mListRutaBajadaFueraRuta = [];
        this.mListRutaSubidaFueraRuta = [];
        var datos = await this.$axios.post(
          process.env.baseUrlPanel + "/readRutasMongoAllByLetraRuta",
          {
            token: this.token,
            ruta: this.LetrRutaFueraRuta,
          }
        );
        if (datos.data.status_code == 200) {
          for (
            var i = 0;
            i < datos.data.datos.polilineasRutaSubida.length;
            i++
          ) {
            this.mListRutaSubidaFueraRuta.push(
              datos.data.datos.polilineasRutaSubida[i]
            );
          }
          for (
            var j = 0;
            j < datos.data.datos.polilineasRutaBajada.length;
            j++
          ) {
            this.mListRutaBajadaFueraRuta.push(
              datos.data.datos.polilineasRutaBajada[j]
            );
          }
        }else{
          console.log("NO POLILINEA")
          console.log(datos.data.msm)
        }
      } catch (error) {
        console.log(error);
      }
    },
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
