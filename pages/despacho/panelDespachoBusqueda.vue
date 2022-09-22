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
                style="background-color: hsla(226, 88%, 61%, 0.274)"
                >EN RUTA</el-checkbox
              >
              <el-checkbox
                label="0,1"
                style="background-color: rgba(140, 248, 126, 0.384)"
                >SALIDAS DIFERIDAS
              </el-checkbox>
              <el-checkbox label="3">FINALIZADOS</el-checkbox>
              <el-checkbox
                label="500"
                style="background-color: hsla(34, 88%, 61%, 0.384)"
                >PENALIZADAS</el-checkbox
              >
              <el-checkbox
                label="4"
                style="background-color: rgba(255, 0, 0, 0.342)"
                >ANULADOS</el-checkbox
              >
              <!--<el-checkbox
                label="31"
                disabled="false"
                style="background-color: hsla(34, 88%, 61%, 0.192)"
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
              :data="mListaSalidasPanelBusqueda"
              row-key="id"
              class="tablePanelControlProduccion"
              :row-class-name="tableRowClassNameSalidasPanelBusqueda"
              header-row-class-name="thead-dark"
              height="calc(100vh - 13rem)"
            >
              <el-table-column label="Actions" width="210">
                <template slot-scope="scope">
                  <base-button
                    size="sm"
                    title="TARJETA PEQUEÑA"
                    @click="showTarjetaSalidasPanelBusqueda(scope.row)"
                    type="primary"
                    ><i class="ni ni-single-copy-04"></i
                  ></base-button>
                  <base-button
                    size="sm"
                    title="TARJETA GRANDE(A4)"
                    @click="showTarjetaSalidasPanelBusqueda(scope.row)"
                    type="danger"
                    ><i class="ni ni-book-bookmark"></i
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

              <!--<el-table-column prop="idSali_m" label="Salida" width="140">
              </el-table-column>-->

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
                        row.EstaSali_m == 1 || row.EstaSali_m == 0
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
      body-classes="p-1"
    >
      <ComponenteRecorrido ref="ComponenteRecorrido"></ComponenteRecorrido>
      <!--<div class="containerModalRecorridoPanelDespacho">
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
      </div>-->
    </modal>

    <!--Form modal TICKET SALIDA-->
    <modal
      :show.sync="modalSalidasTarjetaPanelDespachoBusqueda"
      size="sm"
      body-classes="p-0"
    >
      <ComponenteTarjeta ref="ComponenteTarjeta"></ComponenteTarjeta>
    </modal>
  </div>
</template>
<script>
import recorrido from "../../components/monitoreo/recorrido.vue";
import tarjeta from "../../components/tarjetas/tarjeta.vue";
import flatPicker from "vue-flatpickr-component";
import {getBase64LogoReportes} from '../../util/logoReport'
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
import { FechaStringToHour } from "../../util/fechas";

export default {
  mixins: [clientPaginationMixin],
  layout: "DespachoDashboardLayout",
  components: {
    ComponenteRecorrido: recorrido,
    ComponenteTarjeta: tarjeta,
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
          minWidth: 250,
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
          prop: "atrasoFaltasTime",
          label: "Min Atraso",
          minWidth: 150,
        },
        {
          prop: "adelantoFaltasTime",
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
        },/*

        {
          prop: "atrasoFaltas",
          label: "F. Atrasos",
          minWidth: 160,
        },
        {
          prop: "adelantoFaltas",
          label: "F. Adelantos",
          minWidth: 160,
        },*/
        {
          prop: "PenaCtrlSali_d",
          label: "PEN ($)",
          minWidth: 160,
          sortable: true,
        },
      ],
      mListaSalidasPanelBusqueda: [],
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
      this.$refs.ComponenteRecorrido.readHistorialSalidaPanelBusqueda(item);
    },
    showTarjetaSalidasPanelBusqueda(salida) {
      this.modalSalidasTarjetaPanelDespachoBusqueda = true;
      this.$refs.ComponenteTarjeta.readDetalleSalidaDPanelBusqueda(salida);
    },

    async exportPdfSalidasPanelBusqueda() 
    {
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
      var ruta = [
        {
          text:
            "Rutas : " +
            (this.mSelectRutaSalidaPanelBusqueda.length > 0
              ? this.mSelectRutaSalidaPanelBusqueda.toString()
              : "TODAS LAS LINEAS"),
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
          {
            text: "Unidad",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },
          /*{
            text: "Salida",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },*/
          {
            text: "Ruta",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },
          {
            text: "Vuelta",
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
          },/*

          {
            text: "F. Atraso",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },
          {
            text: "F. Adelanto",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },*/

          {
            text: "PEN ($)",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },
          /*{
            text: "ESTADO",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },*/
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
            alignment: "center",
            fontSize: 8.5,
          }/*,
          {
            text: this.mListaSalidasPanelBusqueda[i].idSali_m,
            alignment: "center",
            fontSize: 8.5,
          }*/,
          {
            text: this.mListaSalidasPanelBusqueda[i].DescRutaSali_m,
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text: this.mListaSalidasPanelBusqueda[i].NumeVuelSali_m,
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text: this.mListaSalidasPanelBusqueda[i].HoraSaliProgSali_mF,
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text: this.mListaSalidasPanelBusqueda[i].HoraLlegProgSali_m,
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text: this.mListaSalidasPanelBusqueda[i].atrasoFaltasTime,
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text: this.mListaSalidasPanelBusqueda[i].adelantoFaltasTime,
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text: this.mListaSalidasPanelBusqueda[i].VeloMaxiSali_m,
            fontSize: 8.5,
            alignment: "center",
          },
          /*{
            text: this.mListaSalidasPanelBusqueda[i].atrasoFaltas,
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text: this.mListaSalidasPanelBusqueda[i].adelantoFaltas,
            fontSize: 8.5,
            alignment: "center",
          },*/
          {
            text: this.mListaSalidasPanelBusqueda[i].PenaCtrlSali_d,
            fontSize: 8.5,
            alignment: "center",
          }/*,
          { text: estado, fontSize: 7.5 },*/
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
        pageOrientation: "landscape",
        pageSize: "A4",
        pageMargins: [40, 80, 40, 60],
        header: {
          margin: 15,
          columns: [
          {
              image: getBase64LogoReportes(this.$cookies.get('empresa')),
                    width: 100,
			              height: 50,
                    margin: [30, 0, 0, 0]
            },  
          {
              layout: "noBorders",
              table: {
                widths: ["*"],
                body: [  
                [
                    {
                      text: "REPORTE SALIDAS DETALLADAS",
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
              widths: [450, 450, 450, 450],
              body: [empresa, unidad, ruta, desde_hasta],
            },
          },
          {
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              headerRows: 0,
              widths: [30, 170, 35, 85, 50, 50, 50, 35, 35],
              body: resultadoString,
            },
          },
        ],
      };
      /*var win = window.open("", "_blank");
      pdfMake.createPdf(docDefinition).open({}, win);*/
      pdfMake.createPdf(docDefinition).download("RSD_" + Date.now());
    },
  },
  mounted() {
    //this.readHistorialSalidaPanelBusqueda();
    this.readAllUnidadesSalidasPanelBusqueda();
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
  background: rgba(255, 0, 0, 0.342) !important;
}

.el-table .success-row-panelControlProduccion {
  background: hsla(34, 88%, 61%, 0.384) !important;
}

.el-table .finalizado-row-panelControlProduccion {
  background: rgba(140, 248, 126, 0.384) !important;
}

.el-table .diferido-row-panelControlProduccion {
  background: hsla(226, 88%, 61%, 0.274) !important;
}

.no-border-card .card-footer {
  border-top: 0;
}

.card-bodyRPagosVehiculoProduccion {
  padding: 0rem !important;
  height: calc(100vh - 13.2rem);
  overflow: none;
}

.card-bodyTopOpcionesRPagosVehiculoPRoduccionPanelDespachoBusqueda {
  padding-top: 0.25rem !important;
}
</style>
