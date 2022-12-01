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
              v-model="itemUnidadRSemanales"
              multiple
              filterable
              remote
              placeholder="Unidades"
              prefix-icon="ni ni-bus-front-12"
              style="margin-right: 0.5rem"
              :remote-method="remoteMethodUnidadesRecibosProduccion"
              :loading="loadingTableUnidadesSemanales"
            >
              <el-option
                v-for="item in optionsUnidadesSemanales"
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
                @on-change="updateCalendarFechas()"
                @on-open="focus"
                @on-close="blur"
                :config="{ allowInput: true }"
                format="yyyy/MM/dd"
                class="form-controlPersonal datepicker"
                v-model="fechaDia1SalidasPanelBusqueda"
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
                @click="readApiPenalidades()"
              >
                <span class="btn-inner--icon"
                  ><i class="el-icon-search"></i
                ></span>
              </base-button>

              <base-button
                type="danger"
                size="sm"
                v-if="mListDatosPenalidades.length > 0 ? true : false"
                @click="exportPdfRPenalidadesSemanales()"
                title="Exportar PDF"
              >
                <span class="btn-inner--icon"
                  ><i class="ni ni-single-copy-04"></i
                ></span>
              </base-button>

              <download-excel
                v-if="mListDatosPenalidades.length > 0 ? true : false"
                class="btn btn-icon btn-fab btn-success btn-sm"
                outline
                :header="oheaderExcelRSalidasSemanales"
                title="Exportar a Excel"
                :data="mListDatosPenalidades"
                :fields="json_fields_excelRPenalidadesSemanales"
                :worksheet="WorksheetExcelRSalidasSemanales"
                :name="FileNameExcelRSalidasSemanales"
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
          <div class="cardTextoRPagosVehiculoProduccionPanelDespachoBusqueda">
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
              style="margin-right: 0.5rem"
              collapse-tags
              v-model="itemRutasRSalidasSemanales"
              multiple
              placeholder="Rutas"
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

          <div
            class="cardSelectRubrosEstadosPagosVehiculoProduccionContainerPanelDespachoBusqueda"
          >
            <div class="buttonCenterEndDerecha"></div>
          </div>
        </card>

        <card
          class="no-border-card"
          style="margin-bottom: 0rem"
          body-classes="card-bodyRPenalidadesSemanales px-0 pb-1"
          footer-classes="pb-2"
        >
          <div>
            <el-table
              element-loading-text="Cargando Datos..."
              row-key="id"
              v-loading="loadingPenalidadesSemanales"
              :data="mListDatosPenalidades"
              class="tablePanelControlProduccion"
              header-row-class-name="thead-dark"
              height="calc(100vh - 13.2rem)"
            >
            <el-table-column prop="CodiVehi" label="Unidad" width="150">
              </el-table-column>

              <el-table-column
                prop="Dia1"
                :label=this.dia1
                width="135"
              >
              </el-table-column>

              <el-table-column
                prop="Dia2"
                :label=this.dia2
                width="135"
              >
              </el-table-column>

              <el-table-column prop="Dia3" :label=this.dia3 width="135">
              </el-table-column>

              <el-table-column prop="Dia4" :label=this.dia4 width="135">
              </el-table-column>

              <el-table-column prop="Dia5" :label=this.dia5 width="135">
              </el-table-column>

              <el-table-column prop="Dia6" :label=this.dia6 width="135">
              </el-table-column>

              <el-table-column prop="Dia7" :label=this.dia7 width="135">
              </el-table-column>

              <el-table-column prop="Total" label="Total" width="150">
              </el-table-column>
              <div slot="empty"></div>
            </el-table>
          </div>
        </card>
      </div>
    </base-header>
  </div>
</template>
<script>
import moment from "moment";
import { getFechatoDDMM, getFecha_dd_mm_yyyy } from "../../util/fechas";
import flatPicker from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import { Spanish } from "flatpickr/dist/l10n/es.js";

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
import { getBase64LogoReportes } from "../../util/logoReport";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

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
      token: this.$cookies.get("token"),
      fechaDia1SalidasPanelBusqueda: "",
      fechaDia2SalidasPanelBusqueda: "",
      modalSalidasTarjetaPanelDespachoBusqueda: false,
      tableColumnPenalidades: [],
      mListDatosPenalidades: [],
      fecha1:'',
      fecha2:'',
      fecha3:'',
      fecha4:'',
      fecha5:'',
      fecha6:'',
      dia1:'',
      dia2:'',
      dia3:'',
      dia4:'',
      dia5:'',
      dia6:'',
      dia7:'',
      loadingPenalidadesSemanales: false,
      mListaUnidadesSemanales: [],
      optionsUnidadesSemanales: [],
      loadingTableUnidadesSemanales: false,
      itemUnidadRSemanales: [],
      mListaRutasSalidasSemanales: [],
      itemRutasRSalidasSemanales: [],
      mListaGruposPenalidadesSemanales: [],
      itemGruposPenalidadesSemanales: [],
      json_fields_excelRPenalidadesSemanales: {},
      WorksheetExcelRSalidasSemanales: "",
      FileNameExcelRSalidasSemanales: "",
      oheaderExcelRSalidasSemanales: "",
    };
  },
  methods: {
    updateCalendarFechas() {
      this.mListDatosPenalidades = []

      var opciones = {month:"short",day:"numeric"}

      var d1 = new Date(this.sumarDias(this.fechaDia1SalidasPanelBusqueda+" 05:00:00",1))
      var d2 = new Date(this.sumarDias(this.fechaDia1SalidasPanelBusqueda+" 05:00:00",2))
      var d3 = new Date(this.sumarDias(this.fechaDia1SalidasPanelBusqueda+" 05:00:00",3))
      var d4 = new Date(this.sumarDias(this.fechaDia1SalidasPanelBusqueda+" 05:00:00",4))
      var d5 = new Date(this.sumarDias(this.fechaDia1SalidasPanelBusqueda+" 05:00:00",5))
      var d6 = new Date(this.sumarDias(this.fechaDia1SalidasPanelBusqueda+" 05:00:00",6))
      var d7 = new Date(this.sumarDias(this.fechaDia1SalidasPanelBusqueda+" 05:00:00",7))

      this.fecha1 = this.sumarDias(this.fechaDia1SalidasPanelBusqueda+" 05:00:00",1)
      this.fecha2 = this.sumarDias(this.fechaDia1SalidasPanelBusqueda+" 05:00:00",2)
      this.fecha3 = this.sumarDias(this.fechaDia1SalidasPanelBusqueda+" 05:00:00",3)
      this.fecha4 = this.sumarDias(this.fechaDia1SalidasPanelBusqueda+" 05:00:00",4)
      this.fecha5 = this.sumarDias(this.fechaDia1SalidasPanelBusqueda+" 05:00:00",5)
      this.fecha6 = this.sumarDias(this.fechaDia1SalidasPanelBusqueda+" 05:00:00",6)
      
      this.dia1 = d1.toLocaleDateString('es-ES', opciones)
      this.dia2 = d2.toLocaleDateString('es-ES', opciones)
      this.dia3 = d3.toLocaleDateString('es-ES', opciones)
      this.dia4 = d4.toLocaleDateString('es-ES', opciones)
      this.dia5 = d5.toLocaleDateString('es-ES', opciones)
      this.dia6 = d6.toLocaleDateString('es-ES', opciones)
      this.dia7 = d7.toLocaleDateString('es-ES', opciones) 

      this.json_fields_excelRPenalidadesSemanales = {}

      var total = "TOTAL PENALIDADES"
      var unidad = "UNIDAD"

      this.json_fields_excelRPenalidadesSemanales[unidad] = "CodiVehi";  
      this.json_fields_excelRPenalidadesSemanales[this.dia1] = "Dia1";  
      this.json_fields_excelRPenalidadesSemanales[this.dia2] = "Dia2";  
      this.json_fields_excelRPenalidadesSemanales[this.dia3] = "Dia3";  
      this.json_fields_excelRPenalidadesSemanales[this.dia4] = "Dia4";  
      this.json_fields_excelRPenalidadesSemanales[this.dia5] = "Dia5";  
      this.json_fields_excelRPenalidadesSemanales[this.dia6] = "Dia6";  
      this.json_fields_excelRPenalidadesSemanales[this.dia7] = "Dia7";  
      this.json_fields_excelRPenalidadesSemanales[total] = "Total";  
     
      this.fechaDia2SalidasPanelBusqueda = this.sumarDias(this.fechaDia1SalidasPanelBusqueda+" 05:00:00",6)
    },
    sumarDias(fechas,dia) {
      var fecha = new Date(fechas)
      fecha.setDate(fecha.getDate() + dia);

      var mes = fecha.getMonth() + 1;
      var day = fecha.getDate();
      var format =
        fecha.getFullYear() +
        "-" +
        (mes < 10 ? "0" + mes : mes) +
        "-" +
        (day < 10 ? "0" + day : day);


      return format
    },
    async readAllRutasSalidasSEmanales() {
      this.mListaRutasSalidasSemanales = [];

      var datos = await this.$axios.post(process.env.baseUrl + "/rutes", {
        token: this.token,
        tipo: 1,
      });

      if (datos.data.status_code == 200) {
        this.mListaRutasSalidasSemanales.push(...datos.data.data);
      }
    },
    getNombresRutasRDespachosGenerados() {
      var mlist = [];
      for (var j = 0; j < this.itemRutasRSalidasSemanales.length; j++) {
        for (var i = 0; i < this.mListaRutasSalidasSemanales.length; i++) {
          if (
            this.itemRutasRSalidasSemanales[j] ==
            this.mListaRutasSalidasSemanales[i].LetrRuta
          ) {
            mlist.push(this.mListaRutasSalidasSemanales[i].DescRuta);
          }
        }
      }
      return mlist;
    },
    remoteMethodUnidadesRecibosProduccion(query) {
      if (query !== "") {
        this.loadingTableUnidadesSemanales = true;
        setTimeout(() => {
          this.loadingTableUnidadesSemanales = false;
          this.optionsUnidadesSemanales = this.mListaUnidadesSemanales.filter(
            (item) => {
              return (
                item.CodiVehi.toLowerCase().indexOf(query.toLowerCase()) > -1
              );
            }
          );
        }, 200);
      } else {
        this.optionsUnidadesSemanales = [];
      }
    },
    async readAllUnidadesSalidasSemanales() {
      var datos = await this.$axios.post(process.env.baseUrl + "/unidades", {
        token: this.token,
      });

      console.log(datos.data);

      if (datos.data.status_code == 200) {
        for (var i = 0; i < datos.data.data.length; i++) {
          var obj = datos.data.data[i];
          obj.value = obj.CodiVehi;
          this.mListaUnidadesSemanales.push(obj);
        }
      }
    },
    initPrimerDiaSemanaActualSalidaBusquedaPanel() {
      var fecha = new Date();
      var mes = fecha.getMonth() + 1;
      var day = fecha.getDate();
      var format =
        fecha.getFullYear() +
        "-" +
        (mes < 10 ? "0" + mes : mes) +
        "-" +
        (day < 10 ? "0" + day : day);

      this.fechaDia1SalidasPanelBusqueda = format;
    },
    async readApiPenalidades() {
      this.mListDatosPenalidades = [];
      this.loadingPenalidadesSemanales = true;

      this.WorksheetExcelRSalidasSemanales = "RS_S_W_" + Date.now();
      this.FileNameExcelRSalidasSemanales = "RS_S_" + Date.now() + ".xls";

      this.oheaderExcelRSalidasSemanales = [
        "Reporte Despachos Semanales Resumido",
        "Fechas : " +
          this.fechaDia1SalidasPanelBusqueda +
          " hasta " +
          this.fechaDia2SalidasPanelBusqueda,
        "Unidades : " +
          (this.itemUnidadRSemanales.length <= 0
            ? "TODAS LAS UNIDADES"
            : this.itemUnidadRSemanales),
        "Rutas : " +
          (this.itemRutasRSalidasSemanales.length <= 0
            ? "TODAS LAS RUTAS"
            : this.getNombresRutasRDespachosGenerados(
                this.itemRutasRSalidasSemanales
              )),
      ];

      try {
        var obj = {
          token: this.token,
          fecha1: this.fechaDia1SalidasPanelBusqueda,
          fecha2: this.fecha1,
          fecha3: this.fecha2,
          fecha4: this.fecha3,
          fecha5: this.fecha4,
          fecha6: this.fecha5,
          fecha7: this.fecha6,
          unidades:
            this.itemUnidadRSemanales.length <= 0
              ? "*"
              : this.itemUnidadRSemanales,
          rutas:
            this.itemRutasRSalidasSemanales.length <= 0
              ? "*"
              : this.itemRutasRSalidasSemanales,
        };

        console.log(obj);

        var datos = await this.$axios.post(
          process.env.baseUrl + "/readPenalidadesSemanalesResumido",
          obj
        );

        console.log(datos.data);
        this.mListDatosPenalidades.push(...datos.data.datos);
      } catch (error) {
        console.log(error);
      }

      this.loadingPenalidadesSemanales = false;
    },
    exportPdfRPenalidadesSemanales() {
      var empresa = [
        {
          text: "Empresa : " + this.$cookies.get("nameEmpresa"),
          fontSize: 11,
          alignment: "left",
        },
      ];

      var desde_hasta = [
        {
          text:
            "Fecha : " +
            this.fechaDia1SalidasPanelBusqueda +
            " hasta " +
            this.fechaDia2SalidasPanelBusqueda,
          fontSize: 11,
          alignment: "left",
        },
      ];

      var mList = [];
      mList.push([
        {
          text: "UNIDAD",
          fontSize: 8.5,
          bold: true,
          fillColor: "#039BC4",
          color: "white",
          alignment: "center",
        },
        {
          text: this.dia1,
          fontSize: 8.5,
          bold: true,
          fillColor: "#039BC4",
          color: "white",
          alignment: "center",
        },
        {
          text: this.dia2,
          fontSize: 8.5,
          bold: true,
          fillColor: "#039BC4",
          color: "white",
          alignment: "center",
        },
        {
          text: this.dia3,
          fontSize: 8.5,
          bold: true,
          fillColor: "#039BC4",
          color: "white",
          alignment: "center",
        },
        {
          text: this.dia4,
          fontSize: 8.5,
          bold: true,
          fillColor: "#039BC4",
          color: "white",
          alignment: "center",
        },
        {
          text: this.dia5,
          fontSize: 8.5,
          bold: true,
          fillColor: "#039BC4",
          color: "white",
          alignment: "center",
        },
        {
          text: this.dia6,
          fontSize: 8.5,
          bold: true,
          fillColor: "#039BC4",
          color: "white",
          alignment: "center",
        },
        {
          text: this.dia7,
          fontSize: 8.5,
          bold: true,
          fillColor: "#039BC4",
          color: "white",
          alignment: "center",
        },
        {
          text: "TOTAL PENALIDADES",
          fontSize: 8.5,
          bold: true,
          fillColor: "#039BC4",
          color: "white",
          alignment: "center",
        },
      ]);

      for (var i = 0; i < this.mListDatosPenalidades.length; i++) {
        var obj = [
          {
            text: this.mListDatosPenalidades[i].CodiVehi,
            fontSize: 8.5,
            alignment: "center",
            color:"black"
          },
          {
            text: this.mListDatosPenalidades[i].Dia1,
            fontSize: 8.5,
            alignment: "center",
            color:"black"
          },
          {
            text: this.mListDatosPenalidades[i].Dia2,
            fontSize: 8.5,
            alignment: "center",
            color:"black"
          },
          {
            text: this.mListDatosPenalidades[i].Dia3,
            fontSize: 8.5,
            alignment: "center",
            color:"black",
          },
          
          {
            text: this.mListDatosPenalidades[i].Dia4,
            fontSize: 8.5,
            alignment: "center",
            color:"black",
          },
          {
            text: this.mListDatosPenalidades[i].Dia5,
            fontSize: 8.5,
            alignment: "center",
            color:"black",
          },
          {
            text: this.mListDatosPenalidades[i].Dia6,
            fontSize: 8.5,
            alignment: "center",
            color:"black",
          },
          {
            text: this.mListDatosPenalidades[i].Dia7,
            fontSize: 8.5,
            alignment: "center",
            color:"black",
          },
          {
            text: this.mListDatosPenalidades[i].Total,
            fontSize: 8.5,
            alignment: "center",
          },
        ];
        mList.push(obj);
      }

      var docDefinition = {
        pageSize: "A4",
        pageOrientation: "landscape",
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
                      text: "REPORTE PENALIDADES SEMANALES RESUMIDO",
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
              widths: [450, 450],
              body: [empresa, desde_hasta],
            },
          },
          {
            table: {
              headerRows: 0,
              widths: [60, 80, 80, 75, 75, 72, 68, 82, 82, 70],
              body: mList,
            },
          },
        ],
      };

      pdfMake.createPdf(docDefinition).download("RPS_" + Date.now());
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
    this.readGruposActivosPenalidadesSemanales();
    this.readAllRutasSalidasSEmanales();
    this.readAllUnidadesSalidasSemanales();
    this.initPrimerDiaSemanaActualSalidaBusquedaPanel();
    this.updateCalendarFechas()
    //this.readApiPenalidades();
  },
};
</script>
<style>
.containerModalRecorridoPanelDespacho {
  display: flex;
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

.card-bodyRPenalidadesSemanales {
  padding: 0rem !important;
  height: calc(100vh - 13.2rem);
  overflow: none;
}

.card-bodyTopOpcionesRPagosVehiculoPRoduccionPanelDespachoBusqueda {
  padding-top: 0.25rem !important;
}
</style>
