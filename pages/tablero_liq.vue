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
              v-model="itemUnidadLiqui"
              multiple
              filterable
              style="margin-right: 0.5rem"
              remote
              placeholder="Ingrese unidad"
              :remote-method="remoteMethodUnidadesTableroLiq"
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
                :max="{ fechaInicioLiq }"
                @on-open="focus"
                @on-close="blur"
                :config="config_flatpicker"
                class="form-controlPersonal datepicker"
                v-model="fechaInicioLiq"
              >
              </flat-picker>
            </base-input>
          </div>

          <div class="cardSelectRubrosEstadosPagosVehiculoProduccionContainer">
            <div class="buttonCenterEndDerecha">
              <base-button
                icon
                type="primary"
                size="sm"
                v-if="!loadingTableroLiq"
                @click="readLiquidacion()"
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
          body-classes="card-bodyRLiquidacion px-0 pb-1"
          footer-classes="pb-2"
        >
          <div>
            <el-table
              v-loading="loadingTableroLiq"
              element-loading-text="Cargando Datos..."
              :data="tableDataTableroLiq"
              row-key="id"
              class="tablePanelControlProduccion"
              header-row-class-name="thead-dark"
              height="calc(100vh - 10rem)"
              style="width: 100%"
            >
              <el-table-column label="Acciones" minWidth="150">
                <template slot-scope="scope">
                  <base-button
                    size="sm"
                    v-if="scope.row.estado == 1"
                    @click="showModalLiquidarUnidad(scope.row)"
                    title="EDITAR"
                    type="danger"
                    ><i class="ni ni-ruler-pencil"></i
                  ></base-button>

                  <base-button
                    size="sm"
                    v-if="scope.row.estado == 2"
                    @click="showModalReportePDF(scope.row)"
                    title="VER RECIBO A4"
                    type="default"
                    ><i class="ni ni-collection"></i
                  ></base-button>

                  <base-button
                    size="sm"
                    v-if="scope.row.estado == 2"
                    @click="showModalReportePDFTICKET(scope.row)"
                    title="VER RECIBO TICKET"
                    type="success"
                    ><i class="ni ni-single-copy-04"></i
                  ></base-button>

                </template>
              </el-table-column>

              <el-table-column prop="unidad" label="UNIDAD" minWidth="110">
              </el-table-column>

              <el-table-column prop="num_vuelta" label="N° VUELTA" minWidth="155">
              </el-table-column>

              <el-table-column
                prop="fecha_consulta"
                label="FECHA"
                minWidth="150"
              >
              </el-table-column>

              <el-table-column
                prop="conteo_pasajero"
                label="PASAJEROS"
                minWidth="160"
              ></el-table-column>

              <el-table-column
                prop="media_ponderada"
                label="M. CENTRAL"
                minWidth="150"
              ></el-table-column>

              <el-table-column
                prop="total_conteo"
                label="T. PASAJERO ($)"
                minWidth="155"
              >
              </el-table-column>

              <el-table-column
                prop="total_recibir"
                label="T. RECIBIR ($)"
                minWidth="160"
              >
                <template slot-scope="scope">
                  <strong style="color: black">{{
                    scope.row.total_recibir
                  }}</strong>
                </template>
              </el-table-column>

              <el-table-column
                prop="observacion"
                label="OBSERVACIONES"
                minWidth="550"
              >
              </el-table-column>

              <!--<el-table-column
                prop="total_gasto"
                label="- T. GASTO ($)"
                minWidth="150"
              >
              </el-table-column>

              <el-table-column
                prop="total_beneficio"
                label="+ T. BENEFICIO ($)"
                minWidth="170"
              >
              </el-table-column>-->

              <div slot="empty"></div>
            </el-table>
          </div>
        </card>

        <!--Classic modal-->
        <modal :show.sync="isShowModalLiquidar" size="xl">
          <template slot="header" style="background-color: #2dce89"> </template>

          <div class="barraResumen">
            <strong style="color: white; font-size: 1.2rem"
              >UNIDAD N°
              {{ objSelectLiq == null ? "0000" : objSelectLiq.unidad }}</strong
            >

            <strong style="color: white; font-size: 1.7rem"
              >{{
                objSelectLiq == null ? "0.00" : objSelectLiq.total_recibir
              }}
              $</strong
            >
          </div>

          <form>
            <div class="row">
              <div class="col-sm">
                <div class="form-group">
                  <base-input
                    type="number"
                    disabled
                    placeholder="0.00"
                    v-model="v_conteo_pasaje_liq"
                    label="Valores Pasaje"
                  ></base-input>
                </div>
              </div>

              <div class="col-sm">
                <div class="form-group">
                  <base-input
                    type="number"
                    placeholder="0.00"
                    v-model="v_compensacion_liq"
                    disabled
                    label="(-) V. Compensación"
                  ></base-input>
                </div>
              </div>

              <div class="col-sm">
                <div class="form-group">
                  <base-input
                    type="number"
                    placeholder="0.00"
                    disabled
                    label="Pasaje - Compensación"
                    v-model="v_pasaje_compensacion_liq"
                  ></base-input>
                </div>
              </div>

              <div class="col-sm">
                <div class="form-group">
                  <base-input
                    type="number"
                    placeholder="0.00"
                    label="(+) Desvío Cobrado"
                    v-model="v_desvio_cobrado_liq"
                    @keyup="updateDetalleLiquidacion()"
                  ></base-input>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-sm">
                <div class="form-group">
                  <base-input
                    type="number"
                    placeholder="0.00"
                    label="(-) Desvío Pagado"
                    v-model="v_desvio_pagado_liq"
                    @keyup="updateDetalleLiquidacion()"
                  ></base-input>
                </div>
              </div>

              <div class="col-sm">
                <div class="form-group">
                  <base-input
                    type="number"
                    placeholder="0.00"
                    disabled
                    v-model="v_pasaje_compensacion_desvio_liq"
                    label="Pasaje - Compensación y Desvíos"
                  ></base-input>
                </div>
              </div>

              <div class="col-sm">
                <div class="form-group">
                  <base-input
                    type="number"
                    placeholder="0.00"
                    disabled
                    label="(-) V. Chofer"
                    v-model="v_chofer_liq"
                  ></base-input>
                </div>
              </div>

              <div class="col-sm">
                <div class="form-group">
                  <base-input
                    type="number"
                    placeholder="0.00"
                    label="(-) Otros"
                    v-model="v_otros_liq"
                    @keyup="updateDetalleLiquidacion()"
                  ></base-input>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-sm">
                <div class="form-group">
                  <base-input
                    type="number"
                    placeholder="0.00"
                    label="(-) Garaje"
                    v-model="v_garaje_liq"
                    @keyup="updateDetalleLiquidacion()"
                  ></base-input>
                </div>
              </div>

              <div class="col-sm">
                <div class="form-group">
                  <base-input
                    type="number"
                    placeholder="0.00"
                    label="(-) Deuda"
                    v-model="v_deuda_liq"
                    @keyup="updateDetalleLiquidacion()"
                  ></base-input>
                </div>
              </div>

              <div class="col-sm">
                <div class="form-group">
                  <base-input
                    type="number"
                    placeholder="0.00"
                    label="(-) Alimentación"
                    v-model="v_alimentacion_liq"
                    @keyup="updateDetalleLiquidacion()"
                  ></base-input>
                </div>
              </div>

              <div class="col-sm">
                <div class="form-group">
                  <base-input
                    type="number"
                    placeholder="0.00"
                    label="(-) Peajes"
                    v-model="v_peaje_liq"
                    @keyup="updateDetalleLiquidacion()"
                  ></base-input>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-sm">
                <div class="form-group">
                  <base-input
                    type="number"
                    placeholder="0.00"
                    label="(-) Combustible"
                    v-model="v_combustible_liq"
                    @keyup="updateDetalleLiquidacion()"
                  ></base-input>
                </div>
              </div>

              <div class="col-sm">
                <div class="form-group">
                  <base-input
                    type="number"
                    placeholder="0.00"
                    label="(-) Cooperativa"
                    v-model="v_cooperativa_liq"
                    @keyup="updateDetalleLiquidacion()"
                  ></base-input>
                </div>
              </div>

              <div class="col-sm">
                <div class="form-group">
                  <base-input
                    type="number"
                    placeholder="0.00"
                    disabled
                    label="(-) Desvios"
                    v-model="v_desvios_liq"
                  ></base-input>
                </div>
              </div>

              <div class="col-sm">
                <div class="form-group">
                  <base-input
                    type="number"
                    disabled
                    placeholder="0.00"
                    disabled
                    label="GASTOS TOTALES"
                    v-model="v_gastos_totales"
                  ></base-input>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-sm">
                <div class="form-group">
                  <base-input
                    type="number"
                    placeholder="0.00"
                    disabled
                    label="TOTAL A RECIBIR"
                    v-model="v_total_recibir"
                  ></base-input>
                </div>
              </div>

              <div class="col-sm">
                <div class="form-group">
                  <base-input
                    type="text"
                    placeholder="...."
                    label="Observación"
                    v-model="observacion_liq"
                  ></base-input>
                </div>
              </div>
            </div>
          </form>

          <template slot="footer">
            <base-button type="default" @click="insertDetalleLiquidacion()"
              >Liquidar Unidad</base-button
            >
          </template>
        </modal>

        <!-- REPORTE LIQUIDACION-->
        <modal :show.sync="isShowModalPDFLiquidar" size="xl">
          <iframe
            :src="baseURlPDFPanelLiquidacionTarjeta"
            style="width: 100%; height: 33rem"
          ></iframe>
        </modal>
      </div>
    </base-header>
  </div>
</template>
<script>
import flatPicker from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import { Spanish } from "flatpickr/dist/l10n/es.js";

import { getBase64LogoReportes } from "../util/logoReport";
import pdfMake from "pdfmake/build/pdfmake.js";
import pdfFonts from "pdfmake/build/vfs_fonts.js";
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
  Button,
  DropdownMenu,
  DropdownItem,
  Dropdown,
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
    [Dropdown.name]: Dropdown,
    [DropdownItem.name]: DropdownItem,
    [DropdownMenu.name]: DropdownMenu,
  },
  data() {
    return {
      config_flatpicker: { allowInput: true, locale: Spanish },
      tableDataTableroLiq: [],
      selectedRows: [],
      token: this.$cookies.get("token"),
      fechaInicioLiq: "",
      mPagadoRPagosVehiculo: "0.00",
      mJustificadoRPagosVehiculo: "0.00",
      loadingTableroLiq: false,
      mListaUnidadesTableroLiq: [],
      loadingTableUnidadesPanelProduccoionLoading: false,
      optionsUnidadesPanelProduccion: [],
      itemUnidadLiqui: [],
      getWidth: "100%",
      oEmpresa: null,
      isShowModalLiquidar: false,
      objSelectLiq: null,
      isShowModalPDFLiquidar: false,

      v_conteo_pasaje_liq: 0,
      v_desvio_cobrado_liq: 0,
      v_desvio_pagado_liq: 0,
      v_compensacion_liq: 0,
      v_pasaje_compensacion_liq: 0,
      v_pasaje_compensacion_desvio_liq: 0,
      v_desvios_liq: 0,
      v_gastos_totales: 0,
      v_chofer_liq: 0,
      v_otros_liq: 0,
      v_garaje_liq: 0,
      v_deuda_liq: 0,
      v_alimentacion_liq: 0,
      v_peaje_liq: 0,
      v_combustible_liq: 0,
      v_cooperativa_liq: 0,
      v_total_recibir: 0,
      observacion_liq: "",

      baseURlPDFPanelLiquidacionTarjeta: "",
      mListaDetalleTableroLiq: [],
    };
  },
  methods: {
    remoteMethodUnidadesTableroLiq(query) {
      if (query !== "") {
        this.loadingTableUnidadesPanelProduccoionLoading = true;
        setTimeout(() => {
          this.loadingTableUnidadesPanelProduccoionLoading = false;
          this.optionsUnidadesPanelProduccion =
            this.mListaUnidadesTableroLiq.filter((item) => {
              return (
                item.CodiVehi.toLowerCase().indexOf(query.toLowerCase()) > -1
              );
            });
        }, 200);
      } else {
        this.optionsUnidadesPanelProduccion = [];
      }
    },
    updateDesvioPagadoLiq() {
      console.log("UPDATE...... " + this.v_desvio_pagado_liq);

      this.v_pasaje_compensacion_desvio_liq = (
        parseFloat(this.v_conteo_pasaje_liq) -
        parseFloat(this.v_compensacion_liq) -
        parseFloat(this.v_desvio_pagado_liq)
      ).toFixed(2);

      this.v_chofer_liq = (
        parseFloat(this.v_pasaje_compensacion_desvio_liq) * 0.16
      ).toFixed(2);
    },
    initFechaActualLiqui() {
      const today = new Date();
      const fecha = new Date(today);
      //fecha.setDate(fecha.getDate() - 1);
      var mes = fecha.getMonth() + 1;
      var day = fecha.getDate();
      var format =
        fecha.getFullYear() +
        "-" +
        (mes < 10 ? "0" + mes : mes) +
        "-" +
        (day < 10 ? "0" + day : day);

      this.fechaInicioLiq = format;
    },
    async readUnidadesLiqui() {
      this.mListaUnidadesTableroLiq = [];
      try {
        var datos = await this.$axios.post(process.env.baseUrl + "/unidades", {
          token: this.token,
        });

        if (datos.data.status_code == 200) {
          for (var i = 0; i < datos.data.data.length; i++) {
            var obj = datos.data.data[i];
            obj.value = obj.CodiVehi;
            this.mListaUnidadesTableroLiq.push(obj);
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    async readLiquidacion() {
      this.loadingTableroLiq = true;
      this.tableDataTableroLiq = [];

      try {
        var response = await this.$axios.post(
          process.env.baseUrl + "/readLiquidacion",
          {
            token: this.token,
            fecha: this.fechaInicioLiq,
            unidades:
              this.itemUnidadLiqui.length <= 0 ? "*" : this.itemUnidadLiqui,
          }
        );

        this.tableDataTableroLiq = response.data.datos;

        if (this.tableDataTableroLiq.length <= 0) {
          // this.notifyVue("danger","NO EXISTEN DATOS DISPONIBLES", "ni ni-check-bold", 3000);

          this.$notify({
            title: "TABLERO LIQUIDACION",
            message: "NO EXISTEN DATOS DISPONIBLES",
            type: "warning",
          });
        }
      } catch (error) {
        console.log(error);

        //this.notifyVue("danger", error.toString(), "ni ni-check-bold", 3000);
        this.$notify({
          title: "ERROR TRY CATCH",
          message: error.toString(),
          type: "danger",
        });
      }

      this.loadingTableroLiq = false;
    },
    showModalLiquidarUnidad(item) {
      this.clearDetalleLiquidacion();

      this.isShowModalLiquidar = true;
      this.objSelectLiq = item;

      if (this.objSelectLiq != null) {
        this.v_conteo_pasaje_liq = this.objSelectLiq.total_conteo;
        this.v_compensacion_liq = Math.round(
          parseFloat(this.objSelectLiq.total_conteo) * 0.07,
          2
        ).toFixed(2);
        this.v_pasaje_compensacion_liq = (
          parseFloat(this.v_conteo_pasaje_liq) -
          parseFloat(this.v_compensacion_liq)
        ).toFixed(2);

        this.updateDetalleLiquidacion();
      }
    },
    clearDetalleLiquidacion() {
      this.objSelectLiq = null;

      this.v_conteo_pasaje_liq = 0;
      this.v_desvio_cobrado_liq = 0;
      this.v_desvio_pagado_liq = 0;
      this.v_compensacion_liq = 0;
      this.v_pasaje_compensacion_liq = 0;
      this.v_pasaje_compensacion_desvio_liq = 0;
      this.v_desvios_liq = 0;
      this.v_gastos_totales = 0;
      this.v_chofer_liq = 0;
      this.v_otros_liq = 0;
      this.v_garaje_liq = 0;
      this.v_deuda_liq = 0;
      this.v_alimentacion_liq = 0;
      this.v_peaje_liq = 0;
      this.v_combustible_liq = 0;
      this.v_cooperativa_liq = 0;
      this.v_total_recibir = 0;
      this.observacion_liq = "";
    },
    updateDetalleLiquidacion() {
      //this.resetValoresLiquidacion()
      //this.v_total_recibir = ()

      this.v_pasaje_compensacion_desvio_liq = (
        parseFloat(this.v_pasaje_compensacion_liq) -
        parseFloat(this.v_desvio_pagado_liq)
      ).toFixed(2);

      this.v_chofer_liq = (
        parseFloat(this.v_pasaje_compensacion_desvio_liq) * 0.16
      ).toFixed(2);

      this.v_gastos_totales = (
        parseFloat(this.v_compensacion_liq) +
        parseFloat(this.v_desvio_pagado_liq) +
        parseFloat(this.v_chofer_liq) +
        parseFloat(this.v_otros_liq) +
        parseFloat(this.v_garaje_liq) +
        parseFloat(this.v_deuda_liq) +
        parseFloat(this.v_alimentacion_liq) +
        parseFloat(this.v_peaje_liq) +
        parseFloat(this.v_combustible_liq) +
        parseFloat(this.v_cooperativa_liq)
      ).toFixed(2);

      this.v_total_recibir = (
        parseFloat(this.v_conteo_pasaje_liq) +
        parseFloat(this.v_desvio_cobrado_liq) -
        parseFloat(this.v_gastos_totales)
      ).toFixed(2);
    },
    resetValoresLiquidacion() {
      if (
        this.v_total_recibir == "" ||
        this.v_total_recibir == undefined ||
        this.v_total_recibir == null ||
        isNaN(this.v_total_recibir)
      ) {
        return true;
      }

      return false;
      /*this.v_conteo_pasaje_liq =
        this.v_conteo_pasaje_liq == "" ||
        this.v_conteo_pasaje_liq == undefined ||
        this.v_conteo_pasaje_liq == null
          ? 0
          : this.v_conteo_pasaje_liq;

      this.v_desvio_cobrado_liq =
        this.v_desvio_cobrado_liq == "" ||
        this.v_desvio_cobrado_liq == undefined ||
        this.v_desvio_cobrado_liq == null
          ? 0
          : this.v_desvio_cobrado_liq;

      this.v_desvio_pagado_liq =
        this.v_desvio_pagado_liq == "" ||
        this.v_desvio_pagado_liq == undefined ||
        this.v_desvio_pagado_liq == null
          ? 0
          : this.v_desvio_pagado_liq;

      this.v_compensacion_liq =
        this.v_compensacion_liq == "" ||
        this.v_compensacion_liq == undefined ||
        this.v_compensacion_liq == null
          ? 0
          : this.v_compensacion_liq;

      this.v_pasaje_compensacion_liq =
        this.v_pasaje_compensacion_liq == "" ||
        this.v_pasaje_compensacion_liq == undefined ||
        this.v_pasaje_compensacion_liq == null
          ? 0
          : this.v_pasaje_compensacion_liq;

      this.v_pasaje_compensacion_desvio_liq =
        this.v_pasaje_compensacion_desvio_liq == "" ||
        this.v_pasaje_compensacion_desvio_liq == undefined ||
        this.v_pasaje_compensacion_desvio_liq == null
          ? 0
          : this.v_pasaje_compensacion_desvio_liq;

      this.v_desvios_liq =
        this.v_desvios_liq == "" ||
        this.v_desvios_liq == undefined ||
        this.v_desvios_liq == null
          ? 0
          : this.v_desvios_liq;

      this.v_gastos_totales =
        this.v_gastos_totales == "" ||
        this.v_gastos_totales == undefined ||
        this.v_gastos_totales == null
          ? 0
          : this.v_gastos_totales;

      this.v_chofer_liq =
        this.v_chofer_liq == "" ||
        this.v_chofer_liq == undefined ||
        this.v_chofer_liq == null
          ? 0
          : this.v_chofer_liq;

      this.v_otros_liq =
        this.v_otros_liq == "" ||
        this.v_otros_liq == undefined ||
        this.v_otros_liq == null
          ? 0
          : this.v_otros_liq;

      this.v_garaje_liq =
        this.v_garaje_liq == "" ||
        this.v_garaje_liq == undefined ||
        this.v_garaje_liq == null
          ? 0
          : this.v_garaje_liq;

      this.v_deuda_liq =
        this.v_deuda_liq == "" ||
        this.v_deuda_liq == undefined ||
        this.v_deuda_liq == null
          ? 0
          : this.v_deuda_liq;

      this.v_alimentacion_liq =
        this.v_alimentacion_liq == "" ||
        this.v_alimentacion_liq == undefined ||
        this.v_alimentacion_liq == null
          ? 0
          : this.v_alimentacion_liq;

      this.v_peaje_liq =
        this.v_peaje_liq == "" ||
        this.v_peaje_liq == undefined ||
        this.v_peaje_liq == null
          ? 0
          : this.v_peaje_liq;

      this.v_combustible_liq =
        this.v_combustible_liq == "" ||
        this.v_combustible_liq == undefined ||
        this.v_combustible_liq == null
          ? 0
          : this.v_combustible_liq;

      this.v_cooperativa_liq =
        this.v_cooperativa_liq == "" ||
        this.v_cooperativa_liq == undefined ||
        this.v_cooperativa_liq == null
          ? 0
          : this.v_cooperativa_liq;

      this.v_total_recibir =
        this.v_total_recibir == "" ||
        this.v_total_recibir == undefined ||
        this.v_total_recibir == null
          ? 0
          : this.v_total_recibir;*/
    },
    async insertDetalleLiquidacion() {
      if (this.resetValoresLiquidacion()) {
        this.$notify({
          title: "ESPACIOS VACIOS",
          message: "PORFAVOR LLENAR LOS ESPACIOS EN BLANCOS CON 0 (CERO)",
          type: "warning",
        });
      } else {
        try {
          var response = await this.$axios.post(
            process.env.baseUrl + "/insertLiquidacionD",
            {
              token: this.token,
              liquidacion_m: parseFloat(this.objSelectLiq.id_liquidacion_m),
              alimentacion_: parseFloat(this.v_alimentacion_liq),
              conbustible_: parseFloat(this.v_combustible_liq),
              garaje_: parseFloat(this.v_garaje_liq),
              cooperativa_: parseFloat(this.v_cooperativa_liq),
              deuda_: parseFloat(this.v_deuda_liq),
              chofer_: parseFloat(this.v_chofer_liq),
              compensacion_: parseFloat(this.v_compensacion_liq),
              desvio_cobrado_: parseFloat(this.v_desvio_cobrado_liq),
              desvio_pagado_: parseFloat(this.v_desvio_pagado_liq),
              peaje_: parseFloat(this.v_peaje_liq),
              otros_gastos_: parseFloat(this.v_otros_liq),
              detalle_:
                this.observacion_liq == null ||
                this.observacion_liq == undefined
                  ? ""
                  : this.observacion_liq,
            }
          );

          if (response.data.status_code == 200) {
            this.isShowModalLiquidar = false;
            this.$notify({
              title: "LIQUIDACION CREADA CON EXITO",
              message: response.data.msm,
              type: "success",
            });

            this.readLiquidacion();
          } else {
            this.$notify({
              title: "LIQUIDACION ERROR SERVER",
              message: response.data.msm,
              type: "danger",
            });
          }
        } catch (error) {
          this.$notify({
            title: "TRY CATCH",
            message: error.toString(),
            type: "danger",
          });
        }
      }
    },
    async showModalReportePDF(item) {
      this.isShowModalPDFLiquidar = true;
      this.baseURlPDFPanelLiquidacionTarjeta = "";

      var datos = await this.$axios.post(
        process.env.baseUrl + "/readDetalleLiquidacion",
        {
          token: this.token,
          liquidacion_m: item.id_liquidacion_m,
          unidad: item.unidad,
          estado: item.estado,
        }
      );

      this.mListaDetalleTableroLiq = [];
      this.mListaDetalleTableroLiq.push(...datos.data.datos);

      var empresa = [
        {
          text: "Empresa : " + this.$cookies.get("nameEmpresa"),
          fontSize: 9,
          alignment: "left",
        },
      ];

      var unidad = [
        {
          text: "Unidad : " + item.unidad,
          fontSize: 9,
          alignment: "left",
        },
      ];

      var desde_hasta = [
        {
          text: "N° Vuelta : " + item.num_vuelta,
          fontSize: 9,
          alignment: "left",
        },
      ];

      /*var vueltaSalida = [
        {
          text: 
            "N° Vuelta : " + salida.NumeVuelSali_m,
          fontSize: 9,
          alignment: "left",
        },
      ]*/

      var resultadoGasto = [];

      var resultadoString = [
        [
          {
            text: "CONTEO PASAJEROS",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },
          {
            text: "INGRESO CONTEO PASAJEROS",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },
        ],
      ];

      var resultadoStringTotales = [
        [
          {
            text: "TOTAL DE GASTOS",
            fontSize: 8.5,
            bold: true,
            fillColor: "#008000",
            color: "white",
            alignment: "center",
          },
          {
            text: "TOTAL A RECIBIR",
            fontSize: 8.5,
            bold: true,
            fillColor: "#008000",
            color: "white",
            alignment: "center",
          },
        ],
      ];

      var resultadoObservacionString = [
        [
          {
            text: "OBSERVACIONES",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },
        ],
      ];

      for (var i = 0; i < this.mListaDetalleTableroLiq.length; i++) 
      {
        var fecha_consulta = [
        {
          text: "Fecha : " + this.mListaDetalleTableroLiq[i].fecha_liquidacion,
          fontSize: 9,
          alignment: "left",
        },
      ]

        var arrys = [
          {
            text: this.mListaDetalleTableroLiq[i].conteo_pasajero,
            fontSize: 9.5,
            alignment: "center",
            color: "#000000",
          },
          {
            text: this.mListaDetalleTableroLiq[i].total_conteo,
            fontSize: 9.5,
            alignment: "center",
            color: "#000000",
          },
        ];
        resultadoString.push(arrys);
        resultadoStringTotales.push([
          {
            text: this.mListaDetalleTableroLiq[i].total_gasto,
            fontSize: 11.5,
            color: "#000000",
            alignment: "center",
          },
          {
            text: this.mListaDetalleTableroLiq[i].total_recibir,
            fontSize: 11.5,
            color: "#000000",
            alignment: "center",
          },
        ]);

        resultadoGasto = [
          [
            {
              text: "GASTO CHOFER",
              fontSize: 8.5,
              alignment: "center",
              bold: true,
              fillColor: "#FF0000",
              color: "white",
              alignment: "center",
            },
            {
              text: "DESVIO COBRADO",
              fontSize: 8.5,
              alignment: "center",
              bold: true,
              fillColor: "#FF0000",
              color: "white",
              alignment: "center",
            },
          ],

          [
            {
              text: this.mListaDetalleTableroLiq[i].chofer,
              fontSize: 10,
              color: "#000000",
              alignment: "center",
            },
            {
              text: this.mListaDetalleTableroLiq[i].desvio_cobrado,
              fontSize: 10,
              color: "#000000",
              alignment: "center",
            },
          ],

          [
            {
              text: "GASTO GARAJE",
              fontSize: 8.5,
              alignment: "center",
              bold: true,
              fillColor: "#FF0000",
              color: "white",
              alignment: "center",
            },
            {
              text: "GASTO OTROS",
              fontSize: 8.5,
              alignment: "center",
              bold: true,
              fillColor: "#FF0000",
              color: "white",
              alignment: "center",
            },
          ],

          [
            {
              text: this.mListaDetalleTableroLiq[i].garaje,
              fontSize: 10,
              color: "#000000",
              alignment: "center",
            },
            {
              text: this.mListaDetalleTableroLiq[i].otros_gastos,
              fontSize: 10,
              color: "#000000",
              alignment: "center",
            },
          ],

          [
            {
              text: "GASTO COMBUSTIBLE",
              fontSize: 8.5,
              alignment: "center",
              bold: true,
              fillColor: "#FF0000",
              color: "white",
              alignment: "center",
            },
            {
              text: "DESVIOS COBRADOS",
              fontSize: 8.5,
              alignment: "center",
              bold: true,
              fillColor: "#FF0000",
              color: "white",
              alignment: "center",
            },
          ],

          [
            {
              text: this.mListaDetalleTableroLiq[i].conbustible,
              fontSize: 10,
              color: "#000000",
              alignment: "center",
            },
            {
              text: this.mListaDetalleTableroLiq[i].desvio_cobrado,
              fontSize: 10,
              color: "#000000",
              alignment: "center",
            },
          ],

          [
            {
              text: "GASTO COOPERATIVA",
              fontSize: 8.5,
              alignment: "center",
              bold: true,
              fillColor: "#FF0000",
              color: "white",
              alignment: "center",
            },
            {
              text: "ALIMENTACION",
              fontSize: 8.5,
              alignment: "center",
              bold: true,
              fillColor: "#FF0000",
              color: "white",
              alignment: "center",
            },
          ],

          [
            {
              text: this.mListaDetalleTableroLiq[i].cooperativa,
              fontSize: 10,
              color: "#000000",
              alignment: "center",
            },
            {
              text: this.mListaDetalleTableroLiq[i].alimentacion,
              fontSize: 10,
              color: "#000000",
              alignment: "center",
            },
          ],
        ];

        resultadoObservacionString.push([
          {
            text: this.mListaDetalleTableroLiq[i].observacion == "" || this.mListaDetalleTableroLiq[i].observacion == null ? "S/N" : this.mListaDetalleTableroLiq[i].observacion,
            fontSize: 8.5,
            color: "#000000",
            alignment: "left"
          },
        ]);
      }

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
                      text: "REPORTE DETALLE LIQUIDACIÓN",
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
              /*widths: ['*'],
              body: [empresa]*/
              widths: [450, 450, 450 , 450/*, 450*/],
              body: [
                empresa,
                unidad,
                desde_hasta,fecha_consulta /*,vueltaSalida,FrecuenciaSalida*/,
              ],
            },
          },
          {
            table: {
              headerRows: 0,
              widths: ["*", "*"],
              body: resultadoString,
              //body: [[]],
            },
          },

          {
            text: ".",
            fontSize: 6,
          },

          {
            table: {
              headerRows: 0,
              widths: ["*", "*"],
              body: resultadoGasto,
              //body: [[]],
            },
          },

          {
            text: ".",
            fontSize: 6,
          },

          {
            table: {
              headerRows: 0,
              widths: ["*"],
              body: resultadoObservacionString
            },
          },

          {
            text: ".",
            fontSize: 6,
          },

          {
            table: {
              headerRows: 0,
              widths: ["*", "*"],
              body: resultadoStringTotales,
              //body: [[]],
            },
          },


        ],
      };

      //pdfMake.createPdf(docDefinition).download("RSD_" + Date.now());
      var pdfDocGenerator = pdfMake.createPdf(docDefinition);
      pdfDocGenerator.getDataUrl((dataUrl) => {
        this.baseURlPDFPanelLiquidacionTarjeta = dataUrl;
      });
    },
    async showModalReportePDFTICKET(item) {
      this.isShowModalPDFLiquidar = true;
      this.baseURlPDFPanelLiquidacionTarjeta = "";

      var datos = await this.$axios.post(
        process.env.baseUrl + "/readDetalleLiquidacion",
        {
          token: this.token,
          liquidacion_m: item.id_liquidacion_m,
          unidad: item.unidad,
          estado: item.estado,
        }
      );

      this.mListaDetalleTableroLiq = [];
      this.mListaDetalleTableroLiq.push(...datos.data.datos);

      var empresa = [
        {
          text: "Empresa : " + this.$cookies.get("nameEmpresa"),
          fontSize: 9,
          alignment: "left",
        },
      ];

      var unidad = [
        {
          text: "Unidad : " + item.unidad,
          fontSize: 9,
          alignment: "left",
        },
      ];
      
      var desde_hasta = [
        {
          text: "N° Vuelta : " + item.num_vuelta,
          fontSize: 9,
          alignment: "left",
        },
      ];

      /*var vueltaSalida = [
        {
          text: 
            "N° Vuelta : " + salida.NumeVuelSali_m,
          fontSize: 9,
          alignment: "left",
        },
      ]*/

      var resultadoGasto = [];

      var resultadoString = [
        [
          {
            text: "CONTEO PASAJEROS",
            fontSize: 8.5,
            bold: true,
            alignment: "center",
          },
          {
            text: "INGRESO CONTEO PASAJEROS",
            fontSize: 8.5,
            bold: true,
            alignment: "center",
          },
        ],
      ];

      var resultadoStringTotales = [
        [
          {
            text: "TOTAL DE GASTOS",
            fontSize: 8.5,
            bold: true,
            alignment: "center",
          },
          {
            text: "TOTAL A RECIBIR",
            fontSize: 8.5,
            bold: true,
            alignment: "center",
          },
        ],
      ];

      var resultadoObservacionString = [
        [
          {
            text: "OBSERVACIONES",
            fontSize: 8.5,
            bold: true,
            alignment: "center",
          },
        ],
      ];

      for (var i = 0; i < this.mListaDetalleTableroLiq.length; i++) 
      {
        var fecha_consulta = [
        {
          text: "Fecha : " + this.mListaDetalleTableroLiq[i].fecha_liquidacion,
          fontSize: 9,
          alignment: "left",
        },
      ]
      
        var arrys = [
          {
            text: this.mListaDetalleTableroLiq[i].conteo_pasajero,
            fontSize: 9.5,
            alignment: "center",
            color: "#000000",
          },
          {
            text: this.mListaDetalleTableroLiq[i].total_conteo,
            fontSize: 9.5,
            alignment: "center",
            color: "#000000",
          },
        ];
        resultadoString.push(arrys);
        resultadoStringTotales.push([
          {
            text: this.mListaDetalleTableroLiq[i].total_gasto,
            fontSize: 11.5,
            color: "#000000",
            alignment: "center",
          },
          {
            text: this.mListaDetalleTableroLiq[i].total_recibir,
            fontSize: 11.5,
            color: "#000000",
            alignment: "center",
          },
        ]);

        resultadoGasto = [
          [
            {
              text: "GASTO CHOFER",
              fontSize: 8.5,
              alignment: "center",
              bold: true,
              alignment: "center",
            },
            {
              text: "DESVIO COBRADO",
              fontSize: 8.5,
              alignment: "center",
              bold: true,
              alignment: "center",
            },
          ],

          [
            {
              text: this.mListaDetalleTableroLiq[i].chofer,
              fontSize: 10,
              color: "#000000",
              alignment: "center",
            },
            {
              text: this.mListaDetalleTableroLiq[i].desvio_cobrado,
              fontSize: 10,
              color: "#000000",
              alignment: "center",
            },
          ],

          [
            {
              text: "GASTO GARAJE",
              fontSize: 8.5,
              alignment: "center",
              bold: true,
              alignment: "center",
            },
            {
              text: "GASTO OTROS",
              fontSize: 8.5,
              alignment: "center",
              bold: true,
              alignment: "center",
            },
          ],

          [
            {
              text: this.mListaDetalleTableroLiq[i].garaje,
              fontSize: 10,
              color: "#000000",
              alignment: "center",
            },
            {
              text: this.mListaDetalleTableroLiq[i].otros_gastos,
              fontSize: 10,
              color: "#000000",
              alignment: "center",
            },
          ],

          [
            {
              text: "GASTO COMBUSTIBLE",
              fontSize: 8.5,
              alignment: "center",
              bold: true,
              alignment: "center",
            },
            {
              text: "DESVIOS COBRADOS",
              fontSize: 8.5,
              alignment: "center",
              bold: true,
              alignment: "center",
            },
          ],

          [
            {
              text: this.mListaDetalleTableroLiq[i].conbustible,
              fontSize: 10,
              color: "#000000",
              alignment: "center",
            },
            {
              text: this.mListaDetalleTableroLiq[i].desvio_cobrado,
              fontSize: 10,
              color: "#000000",
              alignment: "center",
            },
          ],

          [
            {
              text: "GASTO COOPERATIVA",
              fontSize: 8.5,
              alignment: "center",
              bold: true,
              alignment: "center",
            },
            {
              text: "ALIMENTACION",
              fontSize: 8.5,
              alignment: "center",
              bold: true,
              alignment: "center",
            },
          ],

          [
            {
              text: this.mListaDetalleTableroLiq[i].cooperativa,
              fontSize: 10,
              color: "#000000",
              alignment: "center",
            },
            {
              text: this.mListaDetalleTableroLiq[i].alimentacion,
              fontSize: 10,
              color: "#000000",
              alignment: "center",
            },
          ],
        ];

        resultadoObservacionString.push([
          {
            text: this.mListaDetalleTableroLiq[i].observacion == "" || this.mListaDetalleTableroLiq[i].observacion == null ? "S/N" : this.mListaDetalleTableroLiq[i].observacion,
            fontSize: 8.5,
            color: "#000000",
            alignment: "left"
          },
        ]);
      }

      var docDefinition = {
        pageSize: { width: 220, height: "auto" },
        pageMargins: [15, 15, 15, 15],
        /*header: {
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
                      text: "REPORTE DETALLE LIQUIDACIÓN",
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
        },*/
        content: [
          {
            layout: "noBorders",
            table: {
              headerRows: 0,
              /*widths: ['*'],
              body: [empresa]*/
              widths: [450, 450, 450 , 450/*, 450*/],
              body: [
                empresa,
                unidad,
                desde_hasta /*,vueltaSalida,FrecuenciaSalida*/,
                fecha_consulta
              ],
            },
          },
          {
            table: {
              headerRows: 0,
              widths: ["*", "*"],
              body: resultadoString,
              //body: [[]],
            },
          },

          {
            text: ".",
            fontSize: 6,
          },

          {
            table: {
              headerRows: 0,
              widths: ["*", "*"],
              body: resultadoGasto,
              //body: [[]],
            },
          },

          {
            text: ".",
            fontSize: 6,
          },

          {
            table: {
              headerRows: 0,
              widths: ["*"],
              body: resultadoObservacionString
            },
          },

          {
            text: ".",
            fontSize: 6,
          },

          {
            table: {
              headerRows: 0,
              widths: ["*", "*"],
              body: resultadoStringTotales,
              //body: [[]],
            },
          },

          {
            fontSize: 6,
            layout: "noBorders", // optional
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers

              body: [["."]],
            },
          },


        ],
      };

      //pdfMake.createPdf(docDefinition).download("RSD_" + Date.now());
      var pdfDocGenerator = pdfMake.createPdf(docDefinition);
      pdfDocGenerator.getDataUrl((dataUrl) => {
        this.baseURlPDFPanelLiquidacionTarjeta = dataUrl;
      });
    },
  },
  mounted() {
    this.initFechaActualLiqui();
    this.readUnidadesLiqui();
    this.readLiquidacion();
  },
};
</script>
<style>
.inputTimer {
  width: 1.8rem !important;
  background-color: white;
  color: black;
  border-width: 0rem;
  padding-right: 5px !important;
  padding-left: 5px !important;
  border-radius: 0.5rem;
}

.barraResumen {
  width: 100%;
  height: 3rem;
  background-color: #2dce89;
  border-radius: 0.5rem;
  border-style: solid;
  border-width: 0rem;
  margin-bottom: 00.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 10px;
  padding-left: 10px;
}

.textWhite {
  color: white;
}

.containerRigthTopNavbarModal {
  display: flex;
  background-color: #2dce89;
  padding: 10px;
  width: 75%;
  align-items: center;
}

.containerLeftTopNavbarModal {
  display: flex;
  flex-direction: column;
  width: 25%;
  margin-right: 2rem;
  justify-content: center;
}

.navbarModal {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
}

.danger {
  background-color: #f5365c !important;
}

.topModalJustificaciones {
  display: flex;
  flex-direction: row;
  margin-bottom: 0.5rem;
  max-height: 5rem;
}

.form-group {
  margin-bottom: 0rem;
}

.form-control {
  color: black;
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
}

.cardSelectRubrosEstadosPagosVehiculoProduccionContainer {
  display: flex;
  justify-content: space-between;
}

.no-border-card .card-footer {
  border-top: 0;
}

.card-bodyRLiquidacion {
  padding: 0rem !important;
  height: calc(100vh - 9.5rem);
  overflow: auto;
}

.el-table__body tr.current-row > td {
  background-color: rgb(220, 220, 220) !important;
  color: #000;
}

.card-bodyTopOpcionesRPagosVehiculoPRoduccion {
  padding-top: 0.25rem !important;
}

.el-table .estadoJustificado {
  background: rgba(140, 248, 126, 0.384) !important;
}
</style>
