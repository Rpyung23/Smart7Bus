<template>
  <div class="content">
    <base-header>
      <div class="align-items-center py-3">
        <card
          class="no-border-card col"
          style="margin-bottom: 0.5rem"
          body-classes="px-0 pb-1 card-bodyTopOpcionesRPagosVehiculoPRoduccionPanelDespachoBusqueda cardSelectRubrosEstadosPagosVehiculoProduccionContainerPanelDespachoBusqueda"
          footer-classes="pb-2"
        >
          <div class="cardTextoRPagosVehiculoProduccionPanelDespachoBusqueda">
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

            <base-input addon-left-icon="ni ni-calendar-grid-58">
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

          <div
            class="cardSelectRubrosEstadosPagosVehiculoProduccionContainerPanelDespachoBusqueda"
          >
            <div class="buttonCenterEndDerecha">
              <base-button
                icon
                type="primary"
                size="sm"
                @click="readSalidasPanelBusqueda()"
              >
                <span class="btn-inner--icon"
                  ><i class="el-icon-search"></i
                ></span>
              </base-button>
              <!--<download-excel
              class="btn btn-outline-success"
              outline
              :header="headerExcelRPagosVehiculoProduccion"
              :data="mListaSalidasPanelBusqueda"
              :fields="json_fields_excelRPagosVehiculoProduccion"
              :worksheet="WorksheetExcelRPagosVehiculoProduccion"
              :name="FileNameExcelRPagosVehiculoProduccion"
            >
              <span class="btn-inner--icon"
                ><i class="ni ni-collection"></i
              ></span>
              <span class="btn-inner--text"> Excel</span>
            </download-excel>-->
              <base-button
                type="danger"
                size="sm"
                v-if="mListaSalidasPanelBusqueda.length > 0"
                @click="exportPdfSalidasPanelBusqueda()"
                title="Exportar PDF"
              >
                <span class="btn-inner--icon"
                  ><i class="ni ni-single-copy-04"></i
                ></span>
              </base-button>
            </div>
          </div>
        </card>

        <card
          class="no-border-card col"
          style="margin-bottom: 0.5rem"
          body-classes="px-0 pb-1 card-bodyTopOpcionesRPagosVehiculoPRoduccionPanelDespachoBusqueda cardSelectRubrosEstadosPagosVehiculoProduccionContainerPanelDespachoBusqueda"
          footer-classes="pb-2"
        >
          <div class="cardSelectRubrosEstadosRPagosVehiculoProduccion">
            <el-select
              v-model="mSelectRutaSalidaPanelBusqueda"
              multiple
              collapse-tags
              placeholder="Lineas"
            >
              <el-option
                v-for="item in mListLineasSalidasPanelBusqueda"
                :key="item.LetrRuta"
                :label="item.DescRuta"
                :value="item.LetrRuta"
              >
              </el-option>
            </el-select>
          </div>

          <div class="cardTextoRPagosVehiculoProduccionPanelDespachoBusqueda">
            <el-checkbox-group v-model="radioEstadoRSalidasPanelBusqueda">
              <el-checkbox
                label="2"
                style="background-color: hsla(226, 88%, 61%, 0.301)"
                >EN RUTA</el-checkbox
              >
              <el-checkbox
                label="0,1"
                style="background-color: hsla(115, 100%, 59%, 0.301)"
                >SALIDAS DIFERIDAS
              </el-checkbox>
              <el-checkbox label="5">FINALIZADOS</el-checkbox>
              <el-checkbox
                label="3"
                style="background-color: hsla(34, 93%, 61%, 0.479)"
                >PENALIZADAS</el-checkbox
              >
              <el-checkbox
                label="4"
                style="background-color: rgba(252, 143, 143, 0.692)"
                >ANULADOS</el-checkbox
              >
              <!--<el-checkbox
                label="31"
                disabled="false"
                style="background-color: hsla(34, 93%, 61%, 0.479)"
                >PENALIZADAS</el-checkbox
              >-->
            </el-checkbox-group>
          </div>
        </card>

        <card
          class="no-border-card"
          style="margin-bottom: 0rem"
          body-classes="card-bodyRPagosVehiculoProduccion px-0 pb-1"
          footer-classes="pb-2"
        >
          <div>
            <el-table
              v-loading="loadingTableUnidadesSalidasPanelBusqueda"
              element-loading-text="Cargando Datos..."
              element-loading-spinner="el-icon-loading"
              :data="mListaSalidasPanelBusqueda"
              row-key="id"
              class="tablePanelControlProduccion"
              :row-class-name="tableRowClassNameSalidasPanelBusqueda"
              header-row-class-name="thead-dark"
              height="calc(100vh - 13rem)"
            >
              <el-table-column label="Actions" width="170">
                <template slot-scope="scope">
                  <base-button
                    size="sm"
                    title="Tarjeta"
                    @click="showTarjetaSalidasPanelBusqueda(scope.row)"
                    type="primary"
                    ><i class="ni ni-ungroup"></i
                  ></base-button>
                  <base-button
                    size="sm"
                    title="Recorrido"
                    @click="showRecorridoSalidasPanelBusqueda(scope.row)"
                    type="success"
                    ><i class="ni ni-world"></i
                  ></base-button>
                </template>
              </el-table-column>

              <el-table-column prop="CodiVehiSali_m" label="Unidad" width="130">
              </el-table-column>

              <el-table-column prop="idSali_m" label="Salida" width="140">
              </el-table-column>

              <el-table-column
                v-for="column in tableColumnsUnidadesFlotaVehicular"
                :key="column.label"
                v-bind="column"
              >
              </el-table-column>

              <el-table-column
                label="Estado"
                min-width="270px"
                prop="EstaSali_m"
              >
                <template v-slot="{ row }">
                  <badge class="badge-dot mr-4" type="">
                    <!--<i
                      :class="`bg-${
                        row.EstaSali_m == 4
                          ? 'danger'
                          : row.EstaSali_m == 2
                          ? 'warning'
                          : 'success'
                      }`"
                    ></i>-->
                    <span class="status"
                      ><strong>{{
                        row.EstaSali_m == 1
                          ? "DIFERIDA"
                          : row.EstaSali_m == 4
                          ? "ANULADO"
                          : row.EstaSali_m == 2
                          ? "EN RUTA"
                          : row.EstaSali_m == 3 &&
                            parseFloat(row.PenaCtrlSali_d) > 0
                          ? "FINALIZADO CON PENALIDAD"
                          : "FINALIZADA SIN PENALIDAD"
                      }}</strong></span
                    >
                  </badge>
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
      :show.sync="modalSalidasPanelDespachoBusqueda"
      size="xl"
      body-classes="p-0"
    >
      <div class="containerModalRecorridoPanelDespacho">
        <div class="cardControlesMarc">
          <el-table
            height="calc(80vh)"
            style="width: 100%"
            :data="mListControlesSalidaPanelBusquedaDespacho"
          >
            <el-table-column prop="CodiCtrl" label="CTRL" width="100">
            </el-table-column>
            <el-table-column prop="horaMarc" label="H. PROG" width="70">
            </el-table-column>
            <el-table-column prop="horaProg" label="H. MARC" width="70">
            </el-table-column>
          </el-table>
        </div>

        <GmapMap
          map-type-id="roadmap"
          class="mapa"
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
          <GmapMarker
            v-for="marker in mListPosicionesHistorialSalidasPanelBusqueda"
            :key="marker.idHistEve"
            :position="{
              lat: parseFloat(marker.LatiHistEven),
              lng: parseFloat(marker.LongHistEven),
            }"
            :icon="marker.icono"
            :clickable="false"
            :draggable="false"
            :optimized="true"
          />

          <!--MARCADORES CON MARCACION-->
          <GmapMarker
            v-for="marker in mListPosicionesHistorialMarcSalidasPanelBusqueda"
            :key="marker.idHistEve"
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
                text:
                  'RUTA : ' +
                  marker.DescRutaSali_m +
                  '\nPROG : ' +
                  marker.HoraProgSali_d +
                  ' MARC : ' +
                  marker.HoraMarcSali_d,
                color: '#055eb1',
                className: 'paddingLabelControlMarc',
              },
            }"
          />

          <!--TODOS LOS MARCADORES-->

          <GmapPolygon
            v-for="control in mListControlesSalidaPanelBusquedaDespacho"
            :key="control.CodiCtrl"
            :options="{
              strokeColor: 'rgb(3, 3, 3)',
              fillColor: 'rgba(3, 3, 3, 0.178)',
              strokeOpacity: 1.0,
              strokeWeight: 2,
            }"
            :strokeOpacity="0.5"
            :strokeWeight="1"
            :paths="control.calculator.coordinates"
          />

          <GmapMarker
            v-for="(
              control, index
            ) in mListControlesSalidaPanelBusquedaDespacho"
            :key="control.DescCtrl + index"
            :position="{
              lat: parseFloat(control.Lati1Ctrl),
              lng: parseFloat(control.Long1Ctrl),
            }"
            :optimized="true"
            icon="static/img/control/control.png"
            :options="{
              label: {
                text: control.DescCtrl,
                color: 'rgb(3, 3, 3)',
                className: 'paddingLabelControl',
              },
            }"
          />
        </GmapMap>

        <div
          class="loadingRecorridoSalidaBusquedaPanel"
          v-if="isLoadingRecorridoSalidaPanelBusqueda"
        >
          <div class="circleProgress"></div>
        </div>
      </div>
    </modal>

    <!--Form modal TICKET SALIDA-->
    <modal
      :show.sync="modalSalidasTarjetaPanelDespachoBusqueda"
      size="sm"
      body-classes="p-0"
    >
      <card
        type="secondary"
        header-classes="bg-transparent pb-5"
        class="border-0 mb-0"
      >
        <iframe
          :src="baseURlPDFPanelDespachoTarjeta"
          style="width: 100%; height: 33rem"
        ></iframe>
      </card>
    </modal>
  </div>
</template>
<script>
import flatPicker from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
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
import { FechaStringToHour } from "../../util/fechas";

export default {
  mixins: [clientPaginationMixin],
  layout: "DespachoDashboardLayout",
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
      baseURlPDFPanelDespachoTarjeta: "",
      mListaUnidadesSalidasPanelBusqueda: [],
      mListLineasSalidasPanelBusqueda: [],
      loadingTableUnidadesSalidasPanelBusquedaloading: false,
      loadingTableUnidadesSalidasPanelBusqueda: false,
      mSelectRutaSalidaPanelBusqueda: [],
      itemUnidadSalidasPanelBusqueda: [],
      token: this.$cookies.get("token"),
      fechaInicialSalidasPanelBusqueda: "",
      fechaFinalSalidasPanelBusqueda: "",
      radioEstadoRSalidasPanelBusqueda: [],
      optionsUnidadesSalidasPanelBusqueda: [],
      modalSalidasPanelDespachoBusqueda: false,
      tableColumnsUnidadesFlotaVehicular: [
        {
          prop: "DescRutaSali_m",
          label: "Ruta",
          minWidth: 200,
        },
        {
          prop: "DescFrec",
          label: "Frecuencia",
          minWidth: 300,
        },
        {
          prop: "NumeVuelSali_m",
          label: "N° Vuelta",
          minWidth: 130,
        },
        {
          prop: "HoraSaliProgSali_m",
          label: "Hora Salida",
          minWidth: 170,
          sortable: true,
        },
        {
          prop: "HoraLlegProgSali_m",
          label: "Hora Llegada",
          minWidth: 160,
        },
        {
          prop: "atrasoTime",
          label: "Min Atraso",
          minWidth: 150,
        },
        {
          prop: "adelantoTime",
          label: "Min Adelantos",
          minWidth: 170,
        },
        {
          prop: "VeloMaxiSali_m",
          label: "Velocidad",
          minWidth: 160,
        },
        {
          prop: "NumeTarjSali_m",
          label: "N° Tarjeta",
          minWidth: 160,
        },
        {
          prop: "PenaCtrlSali_d",
          label: "PEN ($)",
          minWidth: 160,
          sortable: true,
        },
      ],
      mListaSalidasPanelBusqueda: [],
      oCenter: { lat: -1.249546, lng: -78.585376 },
      oZoom: 7,
      mListPosicionesHistorialSalidasPanelBusqueda: [],
      mListPosicionesHistorialMarcSalidasPanelBusqueda: [],
      isVisibleRecorrido: false,
      filaSelectionCurrentSalidaPanelBusqueda: null,
      isLoadingRecorridoSalidaPanelBusqueda: false,
      modalSalidasTarjetaPanelDespachoBusqueda: false,
      mListControlesSalidaPanelBusquedaDespacho: [],
    };
  },
  methods: {
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
    async readAllLineasContadorSalidasPanelBusqueda() {
      var datos = await this.$axios.post(process.env.baseUrl + "/rutes", {
        token: this.token,
        tipo: 3,
      });
      if (datos.data.status_code == 200) {
        this.mListLineasSalidasPanelBusqueda.push(...datos.data.data);
      }
    },
    async readSalidasPanelBusqueda() {
      this.mListaSalidasPanelBusqueda = [];

      if (!this.loadingTableUnidadesSalidasPanelBusqueda) {
        this.loadingTableUnidadesSalidasPanelBusqueda = true;
        try {
          var datos = await this.$axios.post(
            process.env.baseUrl + "/readSalidasPanel",
            {
              token: this.token,
              unidades:
                this.itemUnidadSalidasPanelBusqueda.length <= 0
                  ? "*"
                  : this.itemUnidadSalidasPanelBusqueda,
              rutas:
                this.mSelectRutaSalidaPanelBusqueda.length <= 0
                  ? "*"
                  : this.mSelectRutaSalidaPanelBusqueda,
              fechaI: this.fechaInicialSalidasPanelBusqueda,
              fechaF: this.fechaFinalSalidasPanelBusqueda,
              tipo:
                this.radioEstadoRSalidasPanelBusqueda.length <= 0
                  ? "*"
                  : this.radioEstadoRSalidasPanelBusqueda,
            }
          );

          if (datos.data.status_code == 200) {
            /*Notification.success({
              title: "Panel Salidas",
              message: "Datos consultados con éxito",
            });*/
            this.mListaSalidasPanelBusqueda.push(...datos.data.datos);
          } else if (datos.data.status_code == 300) {
            Notification.info({
              title: "Panel Salidas",
              message: "ANo existen datos disponibles.",
            });
          } else {
            Notification.error({
              title: "Panel Salidas",
              message: datos.data.msm,
            });
          }
        } catch (error) {
          console.log(error);
          Notification.info({
            title: "TryCatch Panel Salidas",
            message: error.toString(),
          });
        }
      } else {
        Notification.warning({
          title: "Panel Salidas",
          message:
            "Actualmente ya existe una busqueda, porfavor espere un momento",
        });
      }
      this.loadingTableUnidadesSalidasPanelBusqueda = false;
    },
    tableRowClassNameSalidasPanelBusqueda({ row, rowIndex }) {
      if (row.EstaSali_m == 4) {
        return "warning-row-panelControlProduccion";
      } else if (row.EstaSali_m == 2) {
        return "diferido-row-panelControlProduccion";
      } else if (row.EstaSali_m <= 1) {
        return "finalizado-row-panelControlProduccion";
      } else if (row.EstaSali_m == 3 && parseFloat(row.PenaCtrlSali_d) > 0) {
        return "success-row-panelControlProduccion";
      } else {
        return "";
      }
    },
    showRecorridoSalidasPanelBusqueda(item) {
      this.modalSalidasPanelDespachoBusqueda = true;
      this.readHistorialSalidaPanelBusqueda(item);
    },
    showTarjetaSalidasPanelBusqueda(salida) {
      this.modalSalidasTarjetaPanelDespachoBusqueda = true;
      this.readDetalleSalidaDPanelBusqueda(salida);
    },
    async readHistorialSalidaPanelBusqueda(item) {
      this.isLoadingRecorridoSalidaPanelBusqueda = true;
      this.mListPosicionesHistorialSalidasPanelBusqueda = [];
      this.mListPosicionesHistorialMarcSalidasPanelBusqueda = [];
      console.log(this.filaSelectionCurrentSalidaPanelBusqueda);

      try {
        console.log("INICIAR HISTORIAL RECORRIDO");
        var datos = await this.$axios.post(
          process.env.baseUrl + "/historialUnidadSalida",
          {
            token: this.token,
            unidad: item.CodiVehiSali_m,
            salida: item.idSali_m,
            fechaI: item.HoraSaliProgSali_mF,
          }
        );
        console.log("RECORRIDO SALIDA");
        console.log(datos);

        this.panelMarcaciones(datos.data.datos);

        for (var i = 0; i < datos.data.datos.length; i++) {
          var obj = datos.data.datos[i];

          obj.icono = {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            fillColor:
              obj.HoraMarcSali_d != null && obj.HoraProgSali_d != null
                ? "#055eb1"
                : obj.EvenExceVeloHistEven == 1
                ? "yellow"
                : obj.OutRoutHistEven == 1
                ? "red"
                : "green",
            fillOpacity: 1,
            strokeWeight: 0,
            rotation: obj.RumbHistEven,
            scale: 3,
            anchor: new google.maps.Point(0, 0),
          };

          this.mListPosicionesHistorialSalidasPanelBusqueda.push(obj);

          if (
            datos.data.datos[i].HoraMarcSali_d != null &&
            datos.data.datos[i].HoraProgSali_d != null
          ) {
            this.mListPosicionesHistorialMarcSalidasPanelBusqueda.push(
              datos.data.datos[i]
            );
          }

          if (i == 0) {
            this.oCenter.lat = parseFloat(
              this.mListPosicionesHistorialSalidasPanelBusqueda[0].LatiHistEven
            );
            this.oCenter.lng = parseFloat(
              this.mListPosicionesHistorialSalidasPanelBusqueda[0].LongHistEven
            );
            this.oZoom = 17;
          }
        }
      } catch (error) {
        console.log(error);
        Notification.error({
          title: "Error TRYCTACH",
          msm: error.toString(),
        });
      }
      this.isLoadingRecorridoSalidaPanelBusqueda = false;
    },
    async panelMarcaciones(datos) {
      for (var i = 0;i < this.mListControlesSalidaPanelBusquedaDespacho.length;i++) 
      {
        for(var j = 0;j<datos.length;j++)
        {
          console.log(datos[j].CodiCtrlHistEven +" == "+this.mListControlesSalidaPanelBusquedaDespacho[i].CodiCtrl)
          if(datos[j].CodiCtrlHistEven == this.mListControlesSalidaPanelBusquedaDespacho[i].CodiCtrl)
          {
            console.log("AQUI")

            this.mListControlesSalidaPanelBusquedaDespacho[i].horaMarc = datos[j].HORAMARC
            this.mListControlesSalidaPanelBusquedaDespacho[i].horaProg = datos[j].HORAPROG
          }
        }
      }
    },
    async initControlesSalidasPanelBusqueda() {
      console.log("INICIANDO CONTROLES");
      try {
        var datos = await this.$axios.post(
          process.env.baseUrlPanel + "/AllControles",
          {
            token: this.token,
          }
        );
        if (datos.data.status_code == 200) {
          this.mListControlesSalidaPanelBusquedaDespacho = [];
          for (var i = 0; i < datos.data.data.length; i++) {
            var dato = datos.data.data[i];
            dato.horaMarc = "";
            dato.horaProg = "";

            this.mListControlesSalidaPanelBusquedaDespacho[i] = dato;

            console.log(this.mListControlesSalidaPanelBusquedaDespacho[i])

            //this.mListControlesMonitoreoAux[i] = datos.data.data[i];
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    async readDetalleSalidaDPanelBusqueda(salida) {
      var datos = await this.$axios.post(
        process.env.baseUrl + "/detalleSalida",
        {
          token: this.token,
          idsalida: salida.idSali_m,
        }
      );

      this.mListSalidasTarjeta = [];
      this.mListSalidasTarjeta.push(...datos.data.data);
      console.log(salida);

      var empresa = [
        {
          text: this.$cookies.get("nameEmpresa").substring(0, 30),
          fontSize: 12,
          bold: true,
          alignment: "center",
        },
      ]

      var resultadoString = [
        [
          { text: "RELOJ", fontSize: 8.5, bold: true, alignment: "center" },
          { text: "PROG", fontSize: 8.5, bold: true, alignment: "center" },
          { text: "MARC", fontSize: 8.5, bold: true, alignment: "center" },
          { text: "FALT", fontSize: 8.5, bold: true, alignment: "center" },
          { text: "PEN", fontSize: 8.5, bold: true, alignment: "center" },
        ],
      ];

      for (var i = 0; i < this.mListSalidasTarjeta.length; i++) {
        var arrys = [
          {
            text: this.mListSalidasTarjeta[i].DescCtrlSali_d.substring(0, 9),
            fontSize: 8.5,
          },
          {
            text: this.mListSalidasTarjeta[i].HoraProgSali_d.substring(0, 5),
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text:
              this.mListSalidasTarjeta[i].HoraMarcSali_d == "00:00:00"
                ? ""
                : this.mListSalidasTarjeta[i].HoraMarcSali_d,
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text:
              this.mListSalidasTarjeta[i].FaltSali_d == "0"
                ? ""
                : this.mListSalidasTarjeta[i].FaltSali_d,
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text:
              this.mListSalidasTarjeta[i].PenaCtrlSali_d == "0.00"
                ? ""
                : this.mListSalidasTarjeta[i].PenaCtrlSali_d,
            fontSize: 8.5,
            alignment: "center",
          },
        ];
        resultadoString.push(arrys);
      }

      var heightAux = 9.7;
      var sumFalt = 0;
      var penFalt = 0;
      for (var i = 0; i < datos.data.data.length; i++) {
        heightAux = heightAux + 1;
        if (
          datos.data.data[i].FaltSali_d > 0 &&
          datos.data.data[i].isCtrlRefeSali_d == 0
        ) {
          sumFalt = sumFalt + datos.data.data[i].FaltSali_d;
        }

        if (datos.data.data[i].isCtrlRefeSali_d == 0) {
          var pen = parseFloat(datos.data.data[i].PenaCtrlSali_d);
          penFalt = penFalt + pen;
        }
      }

      var docDefinition = {
        // a string or { width: 190, height: number }
        pageSize: { width: 220, height: "auto" },
        pageMargins: [15, 15, 15, 15],
        compress: true,
        // header: [empresa],

        content: [
          {
            headerRows: 0,
            fontSize: 12,
            bold: true,
            layout: "noBorders", // optional
            table: {
              widths: ["*"],
              body: [empresa],
            },
          },
          {
            bold: true,
            fontSize: 9,
            alignment: "center",
            layout: "noBorders", // optional
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              headerRows: 0,
              widths: [35, 75, 25, 22],
              body: [["Unidad", "Salida #" + salida.idSali_m, "Ruta", "Vue"]],
            },
          },

          {
            //bold: true,
            fontSize: 9,
            alignment: "center",

            layout: "noBorders", // optional
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              headerRows: 0,
              widths: [35, 75, 25, 22],
              body: [
                [
                  salida.CodiVehiSali_m,
                  salida.HoraSaliProgSali_mF.substring(0, 10),
                  { text: salida.LetraRutaSali_m, bold: true },
                  salida.NumeVuelSali_m,
                ],
              ],
            },
          },

          {
            fontSize: 10,
            layout: "noBorders", // optional
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              widths: ["*"],
              body: [["FREC: " + salida.DescFrec.substring(0, 25)]],
            },
          },

          { text: "---------------------------------------------------------" },
          {
            fontSize: 8.5,
            layout: "noBorders",
            // optional
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              headerRows: 0,
              widths: [55, 23, 33, 19, 17],

              body: resultadoString,
            },
          },

          { text: "---------------------------------------------------------" },
          { text: "Chofer: ", fontSize: 8 },
          { text: "Cobrador: ", fontSize: 8 },
          {
            text:
              "Adelanto: " +
              (salida.adelantoTime == null ? "00:00:00" : salida.adelantoTime),
            fontSize: 8,
            fontSize: 8,
          },
          {
            text:
              "Atrasos: " +
              (salida.atrasoTime == null ? "00:00:00" : salida.atrasoTime),
            fontSize: 8,
          },

          {
            fontSize: 10,
            bold: true,
            layout: "noBorders", // optional
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers

              body: [
                ["TOTAL Faltas : +" + sumFalt],
                ["TOTAL Dinero : " + Number(penFalt).toFixed(2)],
              ],
            },
          },
        ],
      };

      var pdfDocGenerator = pdfMake.createPdf(docDefinition);

      pdfDocGenerator.getDataUrl((dataUrl) => {
        this.baseURlPDFPanelDespachoTarjeta = dataUrl;
      });

      // const pdfDoc = await PDFDocument.create()
      // const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)
      // const TimesRomanBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold)

      // const page = pdfDoc.addPage()
      // page.setWidth(230)
      // const { width, height } = page.getSize()
      // const fontSize = 10

      // page.drawText("     " + this.$cookies.get("nameEmpresa").toUpperCase().substring(0, 28), {
      //   x: 20,
      //   y: height - 2 * fontSize,
      //   size: fontSize,
      //   font: TimesRomanBold,
      //   color: rgb(0, 0, 0),
      // })

      // page.drawText("Unidad       " + "Salida #" + salida.idSali_m + "         Ruta     Vue.", {
      //   x: 20,
      //   y: height - 3.5 * fontSize,
      //   size: fontSize,
      //   font: TimesRomanBold,
      //   color: rgb(0, 0, 0),
      // })

      // page.drawText("    " + salida.CodiVehiSali_m + "          "
      //   + FechaStringToHour(salida.HoraSaliProgSali_mF) + "         "
      //   + (salida.LetraRutaSali_m.length > 2 ? salida.LetraRutaSali_m : "  " + salida.LetraRutaSali_m) + "           " + salida.NumeVuelSali_m, {
      //   x: 20,
      //   y: height - 4.5 * fontSize,
      //   size: fontSize,
      //   font: timesRomanFont,
      //   color: rgb(0, 0, 0),
      // })

      // page.drawText('FREC : ' + salida.DescFrec.substring(0, 26), {
      //   x: 20,
      //   y: height - 5.6 * fontSize,
      //   size: fontSize,
      //   font: timesRomanFont,
      //   color: rgb(0, 0, 0),
      // })

      // page.drawText("---------------------------------------------------------", {
      //   x: 20,
      //   y: height - 6.6 * fontSize,
      //   size: fontSize,
      //   font: timesRomanFont,
      //   color: rgb(0, 0, 0),
      // })

      // page.drawText("RELOJ             PROG   MARC  FALT  PEN", {
      //   x: 20,
      //   y: height - 7.6 * fontSize,
      //   size: fontSize,
      //   font: timesRomanFont,
      //   color: rgb(0, 0, 0),
      // })

      // page.drawText("---------------------------------------------------------", {
      //   x: 20,
      //   y: height - 8.6 * fontSize,
      //   size: fontSize,
      //   font: timesRomanFont,
      //   color: rgb(0, 0, 0),
      // })
      // var heightAux = 9.7
      // var sumFalt = 0
      // var penFalt = 0
      // for (var i = 0; i < datos.data.data.length; i++) {

      //   heightAux = heightAux + 1
      //   if (datos.data.data[i].FaltSali_d > 0) {
      //     sumFalt = sumFalt + datos.data.data[i].FaltSali_d
      //   }

      //   if (datos.data.data[i].isCtrlRefeSali_d == 0) {
      //     var pen = parseFloat(datos.data.data[i].PenaCtrlSali_d)
      //     penFalt = penFalt + pen
      //   }

      //   var space = "                       "
      //   /**datos.data.data[i].DescCtrlSali_d.substring(0, 9)**/

      //   var texto = space + "  " + datos.data.data[i].HoraProgSali_d.substring(0, 5) + "   "
      //     + (datos.data.data[i].HoraMarcSali_d == '00:00:00' ? '              ' : datos.data.data[i].HoraMarcSali_d) + "    " + (datos.data.data[i].HoraMarcSali_d == '00:00:00' ? '    ' : datos.data.data[i].FaltSali_d) + "        "
      //     + (datos.data.data[i].isCtrlRefeSali_d == 1 ? "REF" : datos.data.data[i].PenaCtrlSali_d == '0.00' ? '      ' : datos.data.data[i].PenaCtrlSali_d)

      //   page.drawText(texto, {
      //     x: 20,
      //     y: height - heightAux * 9,
      //     size: 9,
      //     color: rgb(0, 0, 0),
      //   })

      //   page.drawText(datos.data.data[i].DescCtrlSali_d.substring(0, 8), {
      //     x: 20,
      //     y: height - (heightAux) * 9,
      //     size: 9,
      //     color: rgb(0, 0, 0),
      //   })

      // }
      // heightAux = heightAux - 0.5

      // page.drawText("---------------------------------------------------------", {
      //   x: 20,
      //   y: height - (heightAux - 0.2) * fontSize,
      //   size: fontSize,
      //   color: rgb(0, 0, 0),
      // })

      // page.drawText("Chofer : ", {
      //   x: 20,
      //   y: height - (heightAux + 1) * fontSize,
      //   size: 8.5,
      //   color: rgb(0, 0, 0),
      // })

      // page.drawText("Cobrador : ", {
      //   x: 20,
      //   y: height - (heightAux + 2) * fontSize,
      //   size: 8.5,
      //   color: rgb(0, 0, 0),
      // })

      // page.drawText("Adelanto : " + (salida.adelantoTime == null ? '00:00:00' : salida.adelantoTime), {
      //   x: 20,
      //   y: height - (heightAux + 3) * fontSize,
      //   size: 8.5,
      //   color: rgb(0, 0, 0),
      // })

      // page.drawText("Atrasos : " + (salida.atrasoTime == null ? '00:00:00' : salida.atrasoTime), {
      //   x: 20,
      //   y: height - (heightAux + 4) * fontSize,
      //   size: 8.5,
      //   color: rgb(0, 0, 0),
      // })

      // let bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

      // page.drawText("TOTAL Faltas  : +" + sumFalt, {
      //   x: 20,
      //   y: height - (heightAux + 5) * fontSize,
      //   size: 10,
      //   font: bold,
      //   color: rgb(0, 0, 0),
      // })

      // page.drawText("TOTAL Dinero  : " + Number(penFalt).toFixed(2), {
      //   x: 20,
      //   y: height - (heightAux + 6) * fontSize,
      //   size: 10,
      //   font: bold,
      //   color: rgb(0, 0, 0),
      // })

      this.baseURlPDFPanelDespachoTarjeta = await pdfDoc.saveAsBase64({
        dataUri: true,
      });
    },
    exportPdfSalidasPanelBusqueda() {
      var empresa = [
        {
          text: "Empresa : " + this.$cookies.get("nameEmpresa"),
          fontSize: 8.5,
          bold: true,
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
          fontSize: 8.5,
          bold: true,
          alignment: "left",
        },
      ];
      var ruta = [
        { text: "Rutas : ", fontSize: 8.5, bold: true, alignment: "left" },
      ];
      var desde_hasta = [
        {
          text:
            "Fecha : " +
            this.fechaInicialSalidasPanelBusqueda +
            " hasta " +
            this.fechaFinalSalidasPanelBusqueda,
          fontSize: 8.5,
          bold: true,
          alignment: "left",
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
            text: "Salida",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },
          {
            text: "Ruta",
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
            text: "H.Salida",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },
          {
            text: "H. Llegada",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },
          {
            text: "T. Atraso",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },
          {
            text: "T. Adelanto",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },
          {
            text: "V. Max",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },
          {
            text: "PEN ($)",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },
          {
            text: "ESTADO",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },
        ],
      ];

      for (var i = 0; i < this.mListaSalidasPanelBusqueda.length; i++) {
        var estado =
          this.mListaSalidasPanelBusqueda[i].EstaSali_m <= 1
            ? "DIFERIDA"
            : this.mListaSalidasPanelBusqueda[i].EstaSali_m == 4
            ? "ANULADO"
            : this.mListaSalidasPanelBusqueda[i].EstaSali_m == 2
            ? "EN RUTA"
            : this.mListaSalidasPanelBusqueda[i].EstaSali_m == 3 &&
              parseFloat(this.mListaSalidasPanelBusqueda[i].PenaCtrlSali_d) > 0
            ? "FINALIZADO CON PENALIDAD"
            : "FINALIZADA SIN PENALIDAD";
        var arrys = [
          {
            text: this.mListaSalidasPanelBusqueda[i].CodiVehiSali_m,
            fontSize: 8.5,
          },
          { text: this.mListaSalidasPanelBusqueda[i].idSali_m, fontSize: 8.5 },
          {
            text: this.mListaSalidasPanelBusqueda[i].DescRutaSali_m,
            fontSize: 8.5,
          },
          {
            text: this.mListaSalidasPanelBusqueda[i].NumeVuelSali_m,
            fontSize: 8.5,
          },
          {
            text: this.mListaSalidasPanelBusqueda[i].HoraSaliProgSali_mF,
            fontSize: 8.5,
          },
          {
            text: this.mListaSalidasPanelBusqueda[i].HoraLlegProgSali_m,
            fontSize: 8.5,
          },
          {
            text: this.mListaSalidasPanelBusqueda[i].atrasoTime,
            fontSize: 8.5,
          },
          {
            text: this.mListaSalidasPanelBusqueda[i].adelantoTime,
            fontSize: 8.5,
          },
          {
            text: this.mListaSalidasPanelBusqueda[i].VeloMaxiSali_m,
            fontSize: 8.5,
          },
          {
            text: this.mListaSalidasPanelBusqueda[i].PenaCtrlSali_d,
            fontSize: 8.5,
          },
          { text: estado, fontSize: 8.5 },
        ];
        resultadoString.push(arrys);
      }

      var docDefinition = {
        pageOrientation: "landscape",
        pageSize: "A4",
        content: [
          {
            layout: "noBorders",
            table: {
              headerRows: 0,
              widths: [450, 450, 450, 450],
              body: [empresa, unidad, ruta, desde_hasta],
            },
          },
          {
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              headerRows: 0,
              widths: [30, 40, 100, 40, 90, 50, 60, 60, 35, 35, 90],
              body: resultadoString,
            },
          },
        ],
      };
      var win = window.open("", "_blank");
      pdfMake.createPdf(docDefinition).open({}, win);
    },
  },
  mounted() {
    //this.readHistorialSalidaPanelBusqueda();
    this.readAllUnidadesSalidasPanelBusqueda();
    this.initControlesSalidasPanelBusqueda();
    this.initFechaActualSalidaBusquedaPanel();
    this.readAllLineasContadorSalidasPanelBusqueda();
    this.readSalidasPanelBusqueda();
  },
};
</script>
<style>
.containerModalRecorridoPanelDespacho {
  display: flex;
}
.cardControlesMarc {
  height: calc(80vh);
  width: 18rem;
}
.current-row {
  background-color: rgba(0, 0, 0, 0.178);
}

.el-table__body tr.current-row > td.el-table__cell {
  background-color: rgba(0, 0, 0, 0.178) !important;
}

.mapa {
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

.el-loading-text {
  color: black !important;
}

.el-icon-loading {
  color: black !important;
}

.cardTextoRPagosVehiculoProduccionPanelDespachoBusqueda {
  display: flex;
  align-items: center;
}

.cardSelectRubrosEstadosPagosVehiculoProduccionContainerPanelDespachoBusqueda {
  display: flex;
  justify-content: space-between;
}

.el-table .warning-row-panelControlProduccion {
  background: rgba(252, 143, 143, 0.692) !important;
}

.el-table .success-row-panelControlProduccion {
  background: hsla(34, 93%, 61%, 0.479) !important;
}

.el-table .finalizado-row-panelControlProduccion {
  background: hsla(115, 100%, 59%, 0.301) !important;
}

.el-table .diferido-row-panelControlProduccion {
  background: hsla(226, 88%, 61%, 0.301) !important;
}

.no-border-card .card-footer {
  border-top: 0;
}

.card-bodyRPagosVehiculoProduccion {
  padding: 0rem !important;
  height: calc(100vh - 13rem);
  overflow: none;
}

.card-bodyTopOpcionesRPagosVehiculoPRoduccionPanelDespachoBusqueda {
  padding-top: 0.25rem !important;
}
</style>
