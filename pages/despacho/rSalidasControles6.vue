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
              :remote-method="remoteMethodUnidadesSalidasControles"
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
                @click="readReporteSalidasControles()"
              >
                <span class="btn-inner--icon"
                  ><i class="el-icon-search"></i
                ></span>
              </base-button>
              <download-excel
                class="btn btn-icon btn-fab btn-success btn-sm"
                title="Excel"
                type="xls"
                v-if="
                  isExportExcel
                    ? mListSalidasFrecuenciasControles.length > 0
                      ? true
                      : false
                    : false
                "
                :header="oHeaderRSalidasFrecuenciasControles"
                :data="mListSalidasFrecuenciasControlesExcel"
                :fields="oJSONFieldsRSalidasFrecuenciasControles"
                :name="oFileNameRSalidasFrecuenciasControles"
              >
                <span class="btn-inner--icon"
                  ><i class="ni ni-collection"></i
                ></span>
              </download-excel>
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
              collapse-tags
              placeholder="Lineas"
              @change="readFrecuenciaRSalidasFrecuenciasControles(mSelectRutaSalidaPanelBusqueda)"
            >
              <el-option
                v-for="item in mListLineasFecuenciasControles"
                :key="item.LetrRuta"
                :label="item.DescRuta"
                :value="item.LetrRuta"
              >
              </el-option>
            </el-select>

            <el-select
              v-model="mSelectFrecuencia"
              collapse-tags
              placeholder="Frecuencias"
            >
              <el-option
                v-for="item in mListaFrecuenciasRuta"
                :key="item.idFrec"
                :label="item.DescFrec"
                :value="item.idFrec"
              >
              </el-option>
            </el-select>
          </div>

          <div
            class="cardTextoRPagosVehiculoProduccionPanelDespachoBusqueda"
          ></div>
        </card>

        <card
          class="no-border-card"
          style="margin-bottom: 0rem"
          body-classes="card-bodyRSalidasControles px-0 pb-1"
          footer-classes="pb-2"
        >
          <embed
            :src="base64PDFSALIDACONTROLES"
            type="application/pdf"
            width="98.7%"
            height="98.7%"
          />

          <div>
            <!--<el-table
              v-loading="loadingTableRSalidasFrecuenciasControles"
              element-loading-text="Cargando Datos..."
              :data="mListSalidasFrecuenciasControles"
              row-key="id"
              class="tablePanelControlProduccion"
              header-row-class-name="thead-dark"
              height="calc(100vh - 13rem)"
            >
              <el-table-column
                v-for="column in tableColumnsUnidadesFlotaVehicular"
                :key="column.label"
                v-bind="column"
              >
              </el-table-column>

              <el-table-column
                label="PEN ($)"
                min-width="170"
                prop="PenaCtrlSali_d"
              >
                <template slot-scope="scope">
                  <strong style="color: black">{{
                    scope.row.PenaCtrlSali_d
                  }}</strong>
                </template>
              </el-table-column>

              <div slot="empty"></div>
            </el-table>-->
          </div>
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
import { getBase64LogoReportes } from "../../util/logoReport";
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
      base64PDFSALIDACONTROLES: "",
      mListaUnidadesSalidasPanelBusqueda: [],
      mListLineasFecuenciasControles: [],
      loadingTableUnidadesSalidasPanelBusquedaloading: false,
      loadingTableRSalidasFrecuenciasControles: false,
      mSelectRutaSalidaPanelBusqueda: null,
      mSelectFrecuencia:null,
      itemUnidadSalidasPanelBusqueda: [],
      token: this.$cookies.get("token"),
      fechaInicialSalidasPanelBusqueda: "",
      fechaFinalSalidasPanelBusqueda: "",
      optionsUnidadesSalidasPanelBusqueda: [],
      tableColumnsUnidadesFlotaVehicular: [
        {
          prop: "CodiVehiSali_m",
          label: "Unidad",
          minWidth: 120,
        },
        {
          prop: "PlacVehi",
          label: "Placa",
          minWidth: 140,
        },
        {
          prop: "idSali_m",
          label: "Salida",
          minWidth: 140,
        },
        {
          prop: "NumeVuelSali_m",
          label: "N° Vuelta",
          minWidth: 140,
        },
        {
          prop: "HoraSaliProgSali_m",
          label: "H. Salida",
          minWidth: 220,
        },
        {
          prop: "HoraLlegProgSali_m",
          label: "H. Llegada",
          minWidth: 140,
        },
        {
          prop: "DescRuta",
          label: "Ruta",
          minWidth: 350,
        },
        {
          prop: "DescFrec",
          label: "Frecuencia",
          minWidth: 350,
        },
        {
          prop: "DescCtrl",
          label: "Control",
          minWidth: 350,
        },
        {
          prop: "HoraProgSali_d",
          label: "H. Programada",
          minWidth: 170,
        },
        {
          prop: "HoraMarcSali_d",
          label: "H. Marcada",
          minWidth: 170,
        },
        {
          prop: "atrasoFaltasTime",
          label: "T. Atrasos",
          minWidth: 170,
        },
        {
          prop: "adelantoFaltasTime",
          label: "T. Adelantos",
          minWidth: 170,
        },
        {
          prop: "atrasos",
          label: "F. Atrasos",
          minWidth: 170,
        },
        {
          prop: "adelantos",
          label: "F. Adelantos",
          minWidth: 170,
        },
      ],
      mListSalidasFrecuenciasControles: [],
      mListaFrecuenciasRuta:[],
      oHeaderRSalidasFrecuenciasControles: [],
      mListSalidasFrecuenciasControlesExcel: [],
      oWorkSheetRSalidasFrecuenciasControles: "",
      oFileNameRSalidasFrecuenciasControles: "",
      oJSONFieldsRSalidasFrecuenciasControles: null,
      mListControlesCabezera: [],
      isExportExcel: false,
    };
  },
  methods: {
    remoteMethodUnidadesSalidasControles(query) {
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
    initFechaActualSalidasControles() {
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
    async readAllUnidadesSalidasControles() {
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
    async readLineasRSalidasFrecuenciasControles() {
      this.mListLineasFecuenciasControles = [];
      var datos = await this.$axios.post(process.env.baseUrl + "/rutes", {
        token: this.token,
        tipo: 3,
      });
      if (datos.data.status_code == 200) {
        this.mListLineasFecuenciasControles.push(...datos.data.data);
      } else {
        console.log(datos.data);
      }
    },
    _getIdRuta(ruta){
      for(var i = 0;i<this.mListLineasFecuenciasControles.length;i++){
        if(this.mListLineasFecuenciasControles[i].LetrRuta == ruta)
        {
          console.log(this.mListLineasFecuenciasControles[i])
          return this.mListLineasFecuenciasControles[i]
        }
      }
      return null
    },
    async readFrecuenciaRSalidasFrecuenciasControles(ruta) {
      this.mSelectFrecuencia = null
      this.mListaFrecuenciasRuta = [];
      var datos = await this.$axios.post(process.env.baseUrl + "/frecuencias_rutas", {
        token: this.token,
        ruta: this._getIdRuta(ruta).idRuta,
      });
      if (datos.data.status_code == 200) {
       
        this.mListaFrecuenciasRuta.push(...datos.data.data);
      } else {
        console.log(datos.data);
      }
    },
    getNombresRutasRSalidasFrecuenciasControles() {
      if (this.mSelectRutaSalidaPanelBusqueda != null) {
        for (var i = 0; i < this.mListLineasFecuenciasControles.length; i++) {
          if (
            this.mSelectRutaSalidaPanelBusqueda ==
            this.mListLineasFecuenciasControles[i].LetrRuta
          ) {
            return this.mListLineasFecuenciasControles[i].DescRuta;
          }
        }
      }

      return "TODAS LAS RUTAS";
    },
    async readReporteSalidasControles() {
      this.oJSONFieldsRSalidasFrecuenciasControles = null;
      this.oFileNameRSalidasFrecuenciasControles =
        "RSFC_4_" + Date.now() + ".xls";

      this.oHeaderRSalidasFrecuenciasControles = [
        "REPORTE DE CUMPLIMIENTO DE SALIDAS, RUTAS Y FRECUENCIAS ",
        "Fechas : " +
          this.fechaInicialSalidasPanelBusqueda +
          " hasta " +
          this.fechaFinalSalidasPanelBusqueda,
        "Unidades : " +
          (this.itemUnidadSalidasPanelBusqueda.length <= 0
            ? "TODAS LAS UNIDADES"
            : this.itemUnidadSalidasPanelBusqueda),
        "Rutas : " +
          (this.mSelectRutaSalidaPanelBusqueda == null
            ? "TODAS LAS RUTAS"
            : this.getNombresRutasRSalidasFrecuenciasControles(
                this.mSelectRutaSalidaPanelBusqueda
              )),
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

      this.loadingTableRSalidasFrecuenciasControles = true;
      this.mListSalidasFrecuenciasControles = [];
      this.mListControlesCabezera = [];

      //this.createPDFSalidasControles();

      if (
        this.mSelectRutaSalidaPanelBusqueda == null ||
        this.mSelectRutaSalidaPanelBusqueda.length <= 0
        || this.mSelectFrecuencia == null ||
        this.mSelectFrecuencia.length <= 0
      ) {
        this.$notify({
          title: "Reporte Salidas Frecuencia Controles",
          message: "PORFAVOR SELECCIONE UNA RUTA Y  FRECUENCIA",
          type: "default",
        });

        this.loadingTableRSalidasFrecuenciasControles = false;
        swal.close();
        return;
      }



      try {
        var datos = await this.$axios.post(
          process.env.baseUrl + "/rSalidasFrecuenciasControles6",
          {
            token: this.token,
            unidades:
              this.itemUnidadSalidasPanelBusqueda.length > 0
                ? this.itemUnidadSalidasPanelBusqueda
                : "*",
            rutas:
              this.mSelectRutaSalidaPanelBusqueda != null
                ? [this.mSelectRutaSalidaPanelBusqueda]
                : "*",
            fechaI: this.fechaInicialSalidasPanelBusqueda,
            fechaF: this.fechaFinalSalidasPanelBusqueda,
            frecuencia: [this.mSelectFrecuencia]
          }
        );

        if (datos.data.status_code == 200) {
          this.mListSalidasFrecuenciasControles.push(...datos.data.datos);
          this.mListControlesCabezera.push(...datos.data.datosC);
          console.log("ACa REporteeeee");
          console.log(datos.data.datos);
          console.log("ACa REporteeeee Controles");
          console.log(datos.data.datosC);

          this.exportExcel(datos.data.datos);

          console.log("-----------------------------------------------------");
          console.log(this.mListSalidasFrecuenciasControles);
          console.log("-----------------------------------------------------");
          /*this.mListSalidasFrecuenciasControlesExcel.push(...datos.data.datos);
          var faltaAtrasos = 0;
          var faltaAdelantos = 0;
          var faltaAtrasosAtrasos = 0;

          for (
            var i = 0;
            i < this.mListSalidasFrecuenciasControlesExcel.length;
            i++
          ) {
            oListSalidasFrecuenciasControlesExcelAux.push(
              this.mListSalidasFrecuenciasControlesExcel[i]
            );

            if (i < this.mListSalidasFrecuenciasControlesExcel.length - 1) {

              if (
                this.mListSalidasFrecuenciasControlesExcel[i].idSali_m ==
                this.mListSalidasFrecuenciasControlesExcel[i + 1].idSali_m
              ) {
                faltaAtrasos =
                  faltaAtrasos +
                  this.mListSalidasFrecuenciasControlesExcel[i].atrasos;
                faltaAdelantos =
                  faltaAdelantos +
                  this.mListSalidasFrecuenciasControlesExcel[i].adelantos;
              } else {
                faltaAtrasos =
                  faltaAtrasos +
                  this.mListSalidasFrecuenciasControlesExcel[i].atrasos;
                faltaAdelantos =
                  faltaAdelantos +
                  this.mListSalidasFrecuenciasControlesExcel[i].adelantos;
                faltaAtrasosAtrasos =
                  faltaAtrasosAtrasos + (faltaAtrasos + faltaAdelantos);
     
                oListSalidasFrecuenciasControlesExcelAux.push({
                  DescRuta: "TOTAL MINUTOS ATRASOS",
                  DescFrec: faltaAtrasos,
                });
                oListSalidasFrecuenciasControlesExcelAux.push({
                  DescRuta: "TOTAL MINUTOS ADELANTOS",
                  DescFrec: faltaAdelantos,
                });

                oListSalidasFrecuenciasControlesExcelAux.push({
                  DescRuta: "TOTAL MINUTOS",
                  DescFrec: faltaAtrasosAtrasos,
                });

                oListSalidasFrecuenciasControlesExcelAux.push({
                  DescRuta: "",
                  DescFrec: "",
                });

                faltaAtrasos = 0;
                faltaAdelantos = 0;
                faltaAtrasosAtrasos = 0;
              }
            } else {
              faltaAtrasos =
                faltaAtrasos +
                this.mListSalidasFrecuenciasControlesExcel[i].atrasos;
              faltaAdelantos =
                faltaAdelantos +
                this.mListSalidasFrecuenciasControlesExcel[i].adelantos;
              faltaAtrasosAtrasos =
                faltaAtrasosAtrasos + (faltaAtrasos + faltaAdelantos);


              oListSalidasFrecuenciasControlesExcelAux.push({
                DescRuta: "TOTAL MINUTOS ATRASOS",
                DescFrec: faltaAtrasos,
              });
              oListSalidasFrecuenciasControlesExcelAux.push({
                DescRuta: "TOTAL MINUTOS ADELANTOS",
                DescFrec: faltaAdelantos,
              });

              oListSalidasFrecuenciasControlesExcelAux.push({
                DescRuta: "TOTAL MINUTOS",
                DescFrec: faltaAtrasosAtrasos,
              });
              oListSalidasFrecuenciasControlesExcelAux.push({
                DescRuta: "",
                DescFrec: "",
              });
            }
          }

          this.mListSalidasFrecuenciasControlesExcel = [];
          this.mListSalidasFrecuenciasControlesExcel.push(
            ...oListSalidasFrecuenciasControlesExcelAux
          );

          this.oHeaderRSalidasFrecuenciasControles = [
            "REPORTE DE CUMPLIMIENTO DE SALIDAS, RUTAS Y FRECUENCIAS ",
            "Fechas : " +
              this.fechaInicialSalidasPanelBusqueda +
              " hasta " +
              this.fechaFinalSalidasPanelBusqueda,
            "Unidades : " +
              (this.itemUnidadSalidasPanelBusqueda.length <= 0
                ? "TODAS LAS UNIDADES"
                : this.itemUnidadSalidasPanelBusqueda),
            "Rutas : " +
              (this.mSelectRutaSalidaPanelBusqueda == null
                ? "TODAS LAS RUTAS"
                : this.getNombresRutasRSalidasFrecuenciasControles(
                    this.mSelectRutaSalidaPanelBusqueda
                  )),
          ];*/
        } else {
          this.$notify({
            title: "Reporte Salidas Frecuencia Controles",
            message: datos.data.msm,
            type: "warning",
          });
        }
      } catch (error) {
        this.$notify({
          title: "Reporte Salidas Frecuencia Controles",
          message: error.toString(),
          type: "danger",
        });
      }
      this.loadingTableRSalidasFrecuenciasControles = false;
      await this.createPDFSalidasControles();
      swal.close();
    },
    async createPDFSalidasControles() {
      var empresa = [
        {
          text: "Empresa : " + this.$cookies.get("nameEmpresa"),
          fontSize: 9,
          alignment: "left",
        },
      ];

      var unidad = [
        {
          text:
            "Unidad : " +
            (this.itemUnidadSalidasPanelBusqueda.length == 0
              ? "TODAS LAS UNIDADES"
              : this.itemUnidadSalidasPanelBusqueda.toString()),
          fontSize: 9,
          alignment: "left",
        },
      ];

      var ruta = [
        {
          text:
            "Ruta : " +
            (this.mSelectRutaSalidaPanelBusqueda == null
              ? "TODAS LAS RUTAS"
              : this.getNombresRutasRSalidasFrecuenciasControles()),
          fontSize: 9,
          alignment: "left",
        },
      ];

      var desde_hasta = [
        {
          text:
            "Fecha Salida : " +
            this.fechaInicialSalidasPanelBusqueda +
            " Hasta " +
            this.fechaFinalSalidasPanelBusqueda,
          fontSize: 9,
          alignment: "left",
        },
      ];

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
            text: "H. SALIDA",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },
        ],
      ];

      let width_table = [40, 45];

      //await this.readControlFrecuenciaCabezera();

      for (var i = 0; i < this.mListControlesCabezera.length; i++) {
        //console.log("Aca algo");
        //console.log(this.mListControlesCabezera[i]);
        resultadoString[0].push({
          text:
            this.mListControlesCabezera.length < 12
              ? this.mListControlesCabezera[i].DescCtrl
              : this.mListControlesCabezera[i].CodiCtrlSecuCtrl,
          fontSize: this.mListControlesCabezera.length < 12 ? 6 : 8,
          bold: true,
          fillColor: "#039BC4",
          color: "white",
          alignment: "center",
        });
        width_table.push("auto");
      }

      resultadoString[0].push({
        text: "T. MINUTOS",
        fontSize: 8.5,
        bold: true,
        fillColor: "#039BC4",
        color: "white",
        alignment: "center",
      });

      width_table.push(45);

      for (var j = 0; j < this.mListSalidasFrecuenciasControles.length; j++) {
        var totMinutos = 0;
        var obj = [
          {
            text: this.mListSalidasFrecuenciasControles[j].CodiVehiSali_m,
            fontSize: 8.5,

            alignment: "center",
          },
          {
            text: this.mListSalidasFrecuenciasControles[j].HoraSaliProgSali_m,
            fontSize: 8.5,
            alignment: "left",
          },
        ];

        for (var k = 0; k < this.mListControlesCabezera.length; k++) 
        {
          var result = this.getItemPdf(
            this.mListControlesCabezera[k].idFrec,
            this.mListControlesCabezera[k].CodiCtrlSecuCtrl,
            this.mListSalidasFrecuenciasControles[j].idFrecSali_m,
            this.mListSalidasFrecuenciasControles[j].controles
          )
          totMinutos = totMinutos + result.valor_minuto
          obj.push(result.obj_pdf);
        }

        obj.push({
            text: totMinutos,
            fontSize: 8.5,
            alignment: "center",
          },);

        resultadoString.push(obj);
      }

      console.log("-------------************************************");

      console.log(resultadoString);

      var docDefinition = {
        pageSize: "A4",
        pageOrientation:
          this.$cookies.get("empresa") == "tumbaco"
            ? this.mSelectRutaSalidaPanelBusqueda == "RM" ||
              this.mSelectRutaSalidaPanelBusqueda == "EQ" ||
              this.mSelectRutaSalidaPanelBusqueda == "QA"
              ? "landscape"
              : "portrait"
            : "portrait",
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
                      text: "REPORTE DE CUMPLIMIENTO DE SALIDAS, RUTAS Y FRECUENCIAS",
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
              widths: [450, 450, 450, 450],
              body: [empresa, unidad, ruta, desde_hasta],
            },
          },
          { text: ".", color: "#FFF" },
          {
            table: {
              headerRows: 1,
              widths: width_table,
              body: resultadoString,
            },
          },
        ],
      };

      const pdfDocGenerator = pdfMake.createPdf(docDefinition);

      pdfDocGenerator.getBlob((blob) => {
        this.base64PDFSALIDACONTROLES = URL.createObjectURL(blob);
        console.log(this.base64PDFSALIDACONTROLES);
      });
    },
    getItemPdf(idFrecuencia, idControl, idFrecuenciaSM, controles) {
      var obj = {
        valor_minuto: 0,
        obj_pdf: { text: "--", fontSize: 8.5, alignment: "center" },
      };

      for (var i = 0; i < controles.length; i++) {
        if (idFrecuencia == idFrecuenciaSM) {
          if (idControl == controles[i].CodiCtrlSali_d) {
            obj = {
              valor_minuto: (controles[i].isCtrlRefeSali_d == 1 ? 0 : controles[i].FaltSali_d > 0 ? controles[i].FaltSali_d : 0),
              obj_pdf: {
                text:
                  controles[i].FaltSali_d == null
                    ? ""
                    : (controles[i].FaltSali_d +
                      (controles[i].isCtrlRefeSali_d == 1 ? " (REF)" : "")),
                bold: true,
                fontSize: 8,
                color:
                  controles[i].FaltSali_d == 0
                    ? "#000"
                    : controles[i].FaltSali_d > 0
                    ? "#FF0000"
                    : "#008000",
                alignment: "center",
              },
            };
            break;
          }
        }
      }

      return obj;
    },
    exportExcel() {
      this.oJSONFieldsRSalidasFrecuenciasControles = {
        Unidad: "CodiVehiSali_m",
        "Detalle Ruta": "DescRuta",
        "Fecha Hora Salida": "HoraSaliProgSali_m",
      };

      this.mListSalidasFrecuenciasControlesExcel = [];

      for (var i = 0; i < this.mListControlesCabezera.length; i++) {
        this.oJSONFieldsRSalidasFrecuenciasControles[
          `${this.mListControlesCabezera[i].DescCtrl}`
        ] = this.mListControlesCabezera[i].CodiCtrlSecuCtrl;
      }

      for (var j = 0; j < this.mListSalidasFrecuenciasControles.length; j++) {
        var obj = {};

        obj.CodiVehiSali_m =
          this.mListSalidasFrecuenciasControles[j].CodiVehiSali_m;
        obj.DescRuta = this.mListSalidasFrecuenciasControles[j].DescRuta;
        obj.HoraSaliProgSali_m =
          this.mListSalidasFrecuenciasControles[j].HoraSaliProgSali_m;

        for (
          var k = 0;
          k < this.mListSalidasFrecuenciasControles[j].controles.length;
          k++
        ) {
          obj[
            this.mListSalidasFrecuenciasControles[j].controles[k].CodiCtrlSali_d
          ] = this.mListSalidasFrecuenciasControles[j].controles[k].FaltSali_d;
        }

        this.mListSalidasFrecuenciasControlesExcel.push(obj);
      }
    },
  },
  mounted() {
    this.initFechaActualSalidasControles();
    this.readAllUnidadesSalidasControles();
    this.readLineasRSalidasFrecuenciasControles();
    //this.readReporteSalidasControles();
    //this.createPDFSalidasControles();

    var permisos = this.$cookies.get("permisos");

    this.isExportExcel =
      permisos != null &&
      permisos.despacho != null &&
      permisos.despacho.active != null &&
      permisos.despacho.active &&
      permisos.despacho.reportes != null &&
      permisos.despacho.reportes.active != null &&
      permisos.despacho.reportes.active &&
      permisos.despacho.reportes.ExportExcelRSFC6 != null &&
      permisos.despacho.reportes.ExportExcelRSFC6
        ? true
        : false;
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
.no-border-card .card-footer {
  border-top: 0;
}

.card-bodyRSalidasControles {
  padding: 0rem !important;
  height: calc(100vh - 13.2rem);
  overflow: none;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card-bodyTopOpcionesRPagosVehiculoPRoduccionPanelDespachoBusqueda {
  padding-top: 0.25rem !important;
}
</style>
