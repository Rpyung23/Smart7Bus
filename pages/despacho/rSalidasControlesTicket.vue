<template>
  <div class="content">
    <base-header>
      <div class="align-items-center py-3">
        <card class="no-border-card col" style="margin-bottom: 0.5rem"
          body-classes="px-0 pb-1 card-bodyTopOpcionesRPagosVehiculoPRoduccionPanelDespachoBusqueda cardSelectRubrosEstadosPagosVehiculoProduccionContainerPanelDespachoBusqueda"
          footer-classes="pb-2">
          <div class="cardTextoRPagosVehiculoProduccionPanelDespachoBusqueda">
            <el-select v-model="itemUnidadSalidasPanelBusqueda" multiple filterable style="margin-right: 0.5rem" remote
              placeholder="Ingrese unidad" :remote-method="remoteMethodUnidadesSalidasControles"
              :loading="loadingTableUnidadesSalidasPanelBusquedaloading">
              <el-option v-for="item in optionsUnidadesSalidasPanelBusqueda" :key="item.CodiVehi" :label="item.CodiVehi"
                :value="item.CodiVehi">
              </el-option>
            </el-select>
            <base-input addon-left-icon="ni ni-calendar-grid-58" style="margin-right: 0.5rem">
              <flat-picker slot-scope="{ focus, blur }" @on-open="focus" @on-close="blur" :config="{ allowInput: true }"
                class="form-controlPersonal datepicker" v-model="fechaInicialSalidasPanelBusqueda">
              </flat-picker>
            </base-input>
            <base-input addon-left-icon="ni ni-calendar-grid-58">
              <flat-picker slot-scope="{ focus, blur }" @on-open="focus" @on-close="blur" :config="{ allowInput: true }"
                class="form-controlPersonal datepicker" v-model="fechaFinalSalidasPanelBusqueda">
              </flat-picker>
            </base-input>
          </div>
          <div class="cardSelectRubrosEstadosPagosVehiculoProduccionContainerPanelDespachoBusqueda">
            <div class="buttonCenterEndDerecha">
              <base-button icon type="primary" size="sm" @click="readReporteSalidasControles()">
                <span class="btn-inner--icon"><i class="el-icon-search"></i></span>
              </base-button>
              <download-excel class="btn btn-icon btn-fab btn-success btn-sm" title="Excel" v-if="
                mListSalidasFrecuenciasControles.length > 0 ? true : false
              " :header="oHeaderRSalidasFrecuenciasControles" :data="mListSalidasFrecuenciasControlesExcel"
                :fields="oJSONFieldsRSalidasFrecuenciasControles" :worksheet="oWorkSheetRSalidasFrecuenciasControles"
                :name="oFileNameRSalidasFrecuenciasControles">
                <span class="btn-inner--icon"><i class="ni ni-collection"></i></span>
              </download-excel>
            </div>
          </div>
        </card>
        <card class="no-border-card col" style="margin-bottom: 0.5rem"
          body-classes="px-0 pb-1 card-bodyTopOpcionesRPagosVehiculoPRoduccionPanelDespachoBusqueda cardSelectLineaRutaGrupo"
          footer-classes="pb-2">
          <div>
            <el-select v-model="mSelectRutaSalidaPanelBusqueda" placeholder="Rutas" multiple collapse-tags
              :multiple-limit=1 @change="readRutaControles">
              <el-option v-for="item in mListLineasFecuenciasControles" :key="item.LetrRuta" :label="item.DescRuta"
                :value="item.LetrRuta">
              </el-option>
            </el-select>
          </div>
          <div class=" mx-2">
            <el-select v-model="mSelectRutasControles" multiple collapse-tags placeholder="Controles">
              <el-option v-for="item in mListaRutaControles" :key="item.CodiCtrl" :label="item.DescCtrl"
                :value="item.CodiCtrl">
              </el-option>
            </el-select>
          </div>
          <div class="mx-2">
            <el-select style="margin-right: 0.5rem" collapse-tags
              v-if="mListaGruposPenalidadesSemanales.length > 0 ? true : false" v-model="itemGruposPenalidadesSemanales"
              multiple placeholder="Grupos">
              <el-option v-for="item in mListaGruposPenalidadesSemanales" :key="item.id" :label="item.descripcion"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
          <div class="cardTextoRPagosVehiculoProduccionPanelDespachoBusqueda"></div>
        </card>

        <card class="" style="margin-bottom: 0rem" body-classes="card-bodyRSalidasControlesT px-0 pb-1">

          <!-- <embed :src="base64PDFSALIDACONTROLES" type="application/pdf" width="98.7%" height="98.7%" /> -->


          <ComponenteTarjeta ref="ComponenteTarjeta"></ComponenteTarjeta>
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
import tarjeta from "../../components/tarjetas/tarjeta.vue";
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
import { text } from "d3";
import TarjetaDiv from "../../components/tarjetas/tarjetaDiv.vue";
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
    ComponenteTarjeta: TarjetaDiv,
  },
  data() {
    return {
      base64PDFSALIDACONTROLES: "",
      mListaUnidadesSalidasPanelBusqueda: [],
      mListLineasFecuenciasControles: [],
      mListaRutaControles: [],
      loadingTableUnidadesSalidasPanelBusquedaloading: false,
      loadingTableRSalidasFrecuenciasControles: false,
      mSelectRutaSalidaPanelBusqueda: [],
      mSelectRutasControles: [],
      mListaGruposPenalidadesSemanales: [],
      itemGruposPenalidadesSemanales: [],
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
      mListSalidasFrecuenciasControlesExcel: [],
      oHeaderRSalidasFrecuenciasControles: [],
      oWorkSheetRSalidasFrecuenciasControles: "",
      oFileNameRSalidasFrecuenciasControles: "",
      oJSONFieldsRSalidasFrecuenciasControles: {
        //Unidad: "CodiVehiSali_m",
        //Placa: "PlacVehi",
        //Salida: "idSali_m",
        //"N° Vuelta": "NumeVuelSali_m",
        //"Detalle Ruta": "DescRuta",
        //"Detalle Frecuecnia": "DescFrec",
        //"Fecha Hora Salida": "HoraSaliProgSali_m",
        //"Hora Llegada": "HoraLlegProgSali_m",
        " ": "DescCtrl",
        "  ": "HoraProgSali_d",
        "   ": "HoraMarcSali_d",
        //"Tiempo Atrasos": "atrasoFaltasTime",
        //"Tiempo Adelantos": "adelantoFaltasTime",
        "    ": "FaltSali_d",
        "     ": "PenaCtrlSali_d",
      },
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
    async readRutaControles() {
      console.log("INITI TODO LOS CONTROLES ")
      console.log("mSelectRutaSalidaPanelBusqueda ", this.mSelectRutaSalidaPanelBusqueda)
      console.log("mSelectRutasControles ID", this.mSelectRutasControles)
      console.log("mListLineasFecuenciasControles", this.mListLineasFecuenciasControles)
      console.log("mSelectRutaSalidaPanelBusqueda ", this.mSelectRutaSalidaPanelBusqueda)
      console.log("mSelectRutasControles ID", this.mSelectRutasControles)
      console.log("mListLineasFecuenciasControles", this.mListLineasFecuenciasControles)
      this.mListaRutaControles = []

      var datos = await this.$axios.post(process.env.baseUrl + "/AllControlesPorRuta", {
        token: this.token,
        rutas: this.mSelectRutaSalidaPanelBusqueda.length === 0 ? "*" : this.mSelectRutaSalidaPanelBusqueda
      });
      if (datos.data.status_code == 200) {
        for (var i = 0; i < datos.data.data.length; i++) {
          var obj = datos.data.data[i];
          obj.value = obj.CodiVehi;
          this.mListaRutaControles.push(obj);
        }
      }
      // console.log("--------------------------------")
      // console.log(this.mSelectRutasControles)
      // console.log(this.mListaRutaControles)
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
    async readLineasRSalidasFrecuenciasControles() {
      this.mListLineasFecuenciasControles = [];
      this.mListaRutaControles = []
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
    getNombresRutasRSalidasFrecuenciasControles() {
      var mlist = [];
      for (var j = 0; j < this.mSelectRutaSalidaPanelBusqueda.length; j++) {
        for (var i = 0; i < this.mListLineasFecuenciasControles.length; i++) {
          if (
            this.mSelectRutaSalidaPanelBusqueda[j] ==
            this.mListLineasFecuenciasControles[i].LetrRuta
          ) {
            mlist.push(this.mListLineasFecuenciasControles[i].DescRuta);
          }
        }
      }
      return mlist;
    },
    async readReporteSalidasControles() {
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
      this.loadingTableRSalidasFrecuenciasControles = true;
      this.mListSalidasFrecuenciasControles = [];
      var oListSalidasFrecuenciasControlesExcelAux = []
      this.mListSalidasFrecuenciasControlesExcel = []
      this.oWorkSheetRSalidasFrecuenciasControles = "RSFC_W_" + Date.now();
      this.oFileNameRSalidasFrecuenciasControles = "RSFC_" + Date.now() + ".xls";
      //this.createPDFSalidasControles()

      try {
        var datos = await this.$axios.post(
          process.env.baseUrl + "/rSalidasFrecuenciasControles",
          {
            token: this.token,
            unidades:
              this.itemUnidadSalidasPanelBusqueda.length > 0
                ? this.itemUnidadSalidasPanelBusqueda
                : "*",
            rutas:
              this.mSelectRutaSalidaPanelBusqueda.length > 0
                ? this.mSelectRutaSalidaPanelBusqueda
                : "*",
            fechaI: this.fechaInicialSalidasPanelBusqueda,
            fechaF: this.fechaFinalSalidasPanelBusqueda,
            control: this.mSelectRutasControles.length > 0
              ? this.mSelectRutasControles
              : "*",
            grupo: this.itemGruposPenalidadesSemanales.length > 0
              ? this.itemGruposPenalidadesSemanales
              : "*",
            isRef: 1,
          }
        );
        console.log("******************************************************************");
        console.log("Token \n" + this.token);
        console.log("unidad \n" + this.itemUnidadSalidasPanelBusqueda);
        console.log("Ruta \n" + this.mSelectRutaSalidaPanelBusqueda);
        console.log("FechaI \n" + this.fechaInicialSalidasPanelBusqueda);
        console.log("FechaI \n" + this.fechaFinalSalidasPanelBusqueda);
        console.log("Control \n" + this.mSelectRutasControles);
        console.log("Grupo \n" + this.itemGruposPenalidadesSemanales);
        if (datos.data.status_code == 200) {
          //console.log(datos.data.datos);
          this.$refs.ComponenteTarjeta.readDetalleSalidaDPanelBusquedaControles(datos.data.datos, this.mSelectRutasControles);
          //console.log(datos.data.datos);
          this.mListSalidasFrecuenciasControles.push(...datos.data.datos);
          this.mListSalidasFrecuenciasControlesExcel.push(...datos.data.datos);

          let faltaAtrasos = 0;
          let faltaAdelantos = 0;
          let faltaAtrasosAtrasos = 0;
          let oListSalidasFrecuenciasControlesExcelAux = [];
          let currentIdSali = null;

          // Encabezado de detalle en una sola fila
          const encabezadoDetalle = [
            { DescCtrl: "Detalle Control", HoraProgSali_d: "Hora Programada", HoraMarcSali_d: "Hora Marcación", FaltSali_d: "Falta", PenaCtrlSali_d: "PENALIDAD" }
          ];

          // Iterar sobre los datos
          for (let i = 0; i < this.mListSalidasFrecuenciasControlesExcel.length; i++) {

            // Detectar el inicio de una nueva salida
            if (this.mListSalidasFrecuenciasControlesExcel[i].idSali_m !== currentIdSali) {
              // Si ya hemos agregado detalles, añade los totales del grupo anterior
              if (currentIdSali !== null) {
                oListSalidasFrecuenciasControlesExcelAux.push({
                  DescCtrl: "",
                  HoraProgSali_d: ""
                });
                oListSalidasFrecuenciasControlesExcelAux.push({
                  DescCtrl: "CHOFER",
                  HoraProgSali_d: ""
                });
                oListSalidasFrecuenciasControlesExcelAux.push({
                  DescCtrl: "TOTAL MINUTOS ATRASOS",
                  HoraProgSali_d: faltaAtrasos
                });
                oListSalidasFrecuenciasControlesExcelAux.push({
                  DescCtrl: "TOTAL MINUTOS ADELANTOS",
                  HoraProgSali_d: faltaAdelantos
                });
                oListSalidasFrecuenciasControlesExcelAux.push({
                  DescCtrl: "",
                  HoraProgSali_d: ""
                });
              }

              faltaAtrasos = 0;
              faltaAdelantos = 0;
              faltaAtrasosAtrasos = 0;

              // Actualizar el ID de salida actual
              currentIdSali = this.mListSalidasFrecuenciasControlesExcel[i].idSali_m;

              // Obtener la frecuencia, vuelta y fechas para la nueva salida
              let ruta = this.mListSalidasFrecuenciasControlesExcel[i].DescRuta || "Ruta NO DISPONIBLE";
              let frecuencia = this.mListSalidasFrecuenciasControlesExcel[i].DescFrec || "FRECUENCIA NO DISPONIBLE";
              let vuelta = this.mListSalidasFrecuenciasControlesExcel[i].NumeVuelSali_m || "vuelta NO DISPONIBLE";
              let fechaS = this.mListSalidasFrecuenciasControlesExcel[i].HoraSaliProgSali_m || "fecha NO DISPONIBLE";
              let unidad =  this.mListSalidasFrecuenciasControlesExcel[i].CodiVehiSali_m || "Sin unidad";



              // Añadir la frecuencia, vuelta y fechas en una fila
              oListSalidasFrecuenciasControlesExcelAux.push({
                DescCtrl: "RUTA",
                HoraProgSali_d: ruta,
                HoraMarcSali_d: "",
                atrasos: "",
                adelantos: "",
                PenaCtrlSali_d: ""
              });
              oListSalidasFrecuenciasControlesExcelAux.push({
                DescCtrl: "FRECUENCIA",
                HoraProgSali_d: frecuencia,
                HoraMarcSali_d: "",
                atrasos: "",
                adelantos: "",
                PenaCtrlSali_d: ""
              });
              oListSalidasFrecuenciasControlesExcelAux.push({
                DescCtrl: "UNIDAD",
                HoraProgSali_d: unidad,
                HoraMarcSali_d: "",
                atrasos: "",
                adelantos: "",
                PenaCtrlSali_d: ""
              });
              oListSalidasFrecuenciasControlesExcelAux.push({
                DescCtrl: "VUELTA",
                HoraProgSali_d: vuelta,
                HoraMarcSali_d: "",
                atrasos: "",
                adelantos: "",
                PenaCtrlSali_d: ""
              });
              oListSalidasFrecuenciasControlesExcelAux.push({
                DescCtrl: "FECHA SALIDA",
                HoraProgSali_d: fechaS,
                HoraMarcSali_d: "",
                atrasos: "",
                adelantos: "",
                PenaCtrlSali_d: ""
              });
              oListSalidasFrecuenciasControlesExcelAux.push({
                DescCtrl: "",
                HoraProgSali_d: "",
                HoraMarcSali_d: "",
                atrasos: "",
                adelantos: "",
                PenaCtrlSali_d: ""
              });


              // Añadir el encabezado de detalle
              oListSalidasFrecuenciasControlesExcelAux.push(...encabezadoDetalle);
            }

            // Añadir el detalle actual
            oListSalidasFrecuenciasControlesExcelAux.push(this.mListSalidasFrecuenciasControlesExcel[i]);

            // Sumar los atrasos y adelantos
            faltaAtrasos += this.mListSalidasFrecuenciasControlesExcel[i].atrasos;
            faltaAdelantos += this.mListSalidasFrecuenciasControlesExcel[i].adelantos;
            faltaAtrasosAtrasos += this.mListSalidasFrecuenciasControlesExcel[i].atrasos + this.mListSalidasFrecuenciasControlesExcel[i].adelantos;
          }

          // Añadir el total para el último grupo
          if (currentIdSali !== null) {
            oListSalidasFrecuenciasControlesExcelAux.push({
              DescCtrl: "",
              HoraProgSali_d: ""
            });
            oListSalidasFrecuenciasControlesExcelAux.push({
              DescCtrl: "CHOFER",
              HoraProgSali_d: ""
            });

            oListSalidasFrecuenciasControlesExcelAux.push({
              DescCtrl: "TOTAL MINUTOS ATRASOS",
              HoraProgSali_d: faltaAtrasos
            });
            oListSalidasFrecuenciasControlesExcelAux.push({
              DescCtrl: "TOTAL MINUTOS ADELANTOS",
              HoraProgSali_d: faltaAdelantos
            });
            oListSalidasFrecuenciasControlesExcelAux.push({
              DescCtrl: "",
              HoraProgSali_d: ""
            });

          }

          this.mListSalidasFrecuenciasControlesExcel = [];
          this.mListSalidasFrecuenciasControlesExcel.push(...oListSalidasFrecuenciasControlesExcelAux);

        } else {
          this.$notify({
            title: "Reporte Salidas Frecuencia Controles",
            message: datos.data.msm,
            type: "default",
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
      swal.close()
    },

  },
  mounted() {
    this.initFechaActualSalidasControles();
    this.readAllUnidadesSalidasControles();
    this.readLineasRSalidasFrecuenciasControles();
    this.readRutaControles();
    //this.readReporteSalidasControles();
    this.readGruposActivosPenalidadesSemanales();
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

.el-table__body tr.current-row>td.el-table__cell {
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

.cardSelectLineaRutaGrupo {
  display: flex;
  justify-content: baseline;
}

.no-border-card .card-footer {
  border-top: 0;
}

.card-bodyRSalidasControlesT {
  padding: 0.3rem !important;
  height: calc(100vh - 13.2rem);
  overflow: none;
  justify-content: center;
  align-items: center;
}

.card-bodyTopOpcionesRPagosVehiculoPRoduccionPanelDespachoBusqueda {
  padding-top: 0.25rem !important;
}

/*.el-select{
  display: inline !important;
  position: relative !important;
}*/
</style>