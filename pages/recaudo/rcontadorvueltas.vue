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
            <!--<el-autocomplete
              class="inline-input"
              v-model="itemUnidadContadorPasajeroVuetas"
              :fetch-suggestions="querySearchUnidadProduccionRPagoVehiculo"
              style="margin-right: 0.5rem"
              placeholder="Unidad"
              prefix-icon="ni ni-bus-front-12"
              :trigger-on-focus="false"
              @select="handleSelectUnidadProduccionRPagoVehiculo"
            ></el-autocomplete>-->

            <el-select
              v-model="itemUnidadContadorPasajeroVuetas"
              multiple
              filterable
              style="margin-right: 0.5rem"
              remote
              placeholder="Ingrese unidad"
              :remote-method="remoteMethodUnidadesContadorPasajeros"
              :loading="loadingUnidadesContadorPasajeros"
            >
              <el-option
                v-for="item in optionsUnidadesSelectContadorPasajero"
                :key="item.CodiVehi"
                :label="item.CodiVehi"
                :value="item.CodiVehi"
              >
              </el-option>
            </el-select>

            <el-date-picker type="date" placeholder="Select date and time" style="margin-right: 0.5rem;"
              v-model="fechaInicialConteoPasajerosVueltas">
            </el-date-picker>

            <el-date-picker type="date" placeholder="Select date and time" style="margin-right: 0.5rem;"
              v-model="fechaFinalConteoPasajerosVueltas">
            </el-date-picker>
          </div>


          <div class="buttonsAdicionalesRContadorVuelta">
            
            
            <base-button icon size="sm" title="Buscar" type="primary" @click="readConteoPasajeros()">
              <span class="btn-inner--icon"
                ><i class="el-icon-search"></i
              ></span>
            </base-button>

            <base-button
              icon
              size="sm"
              v-if="tableDataRecaudoContadorPasajerosVueltas.length > 0 ? true : false"
              title="EXPORTAR A PDF"
              @click="exportConteoPasajerosVueltasPDf()"
              type="danger"
            >
              <span class="btn-inner--icon"
                ><i class="ni ni-single-copy-04"></i
              ></span>
            </base-button>

            <download-excel
             class="btn btn-sm btn-success"
              v-if="tableDataRecaudoContadorPasajerosVueltas.length > 0 ? (permisos != null && permisos.recaudo != null && permisos.recaudo.active != null && permisos.recaudo.active && permisos.recaudo.ExportarExcelVueltas != null && permisos.recaudo.ExportarExcelVueltas) ?  true : false  : false"
              
              :header="oHeaderExcelConteoPasajerosVueltas"
              :worksheet="ConteoPasajerosWorksheetExcelRPagosVehiculoProduccionVueltas"
              :name="ConteoPasajerosFileNameExcelRPagosVehiculoProduccionVueltas"
              :data="tableDataRecaudoContadorPasajerosVueltas"
              :fields="json_fields_excelRPagosVehiculoProduccion"
              title="EXPORTAR A EXCEL"
            >
              <span class="btn-inner--icon"
                ><i class="ni ni-collection"></i
              ></span>
            </download-excel>
            <base-button type="danger" v-if="false" title="EXPORTAR A PDF" size="sm">
              <span class="btn-inner--icon"><i class="ni ni-ungroup"></i></span>
            </base-button>
          </div>

        </card>

        <card
          class="no-border-card col"
          style="margin-bottom: 0.5rem"
          body-classes="px-0 pb-1 card-bodyTopOpcionesRPagosVehiculoPRoduccion cardSelectRubrosEstadosPagosVehiculoProduccionContainer"
          footer-classes="pb-2"
        >
          <div class="cardSelectRubrosEstadosRPagosVehiculoProduccion">
            <el-select
              v-model="mSelectRutaContadorPasajeroVueltas"
              multiple
              collapse-tags
              placeholder="Lineas"
            >
              <el-option
                v-for="item in mListLineasContadorPasajeros"
                :key="item.LetrRuta"
                :label="item.DescRuta"
                :value="item.LetrRuta"
              >
              </el-option>
            </el-select>
          </div>

          <div class="cardTextoRPagosVehiculoProduccion"></div>
        </card>

        <card
          class="no-border-card"
          style="margin-bottom: 0rem"
          body-classes="card-bodyRPagosVehiculoProduccion px-0 pb-1"
          footer-classes="pb-2"
        >
          <div>
            <el-table
              v-loading="loadingUnidadesContadorPasajerosPasajerosVueltas"
              element-loading-text="Cargando Datos..."
              :data="tableDataRecaudoContadorPasajerosVueltas"
              row-key="id"
              height="calc(100vh - 13rem)"
              style="width: 100%"
              class="tablePanelControlProduccion"
              header-row-class-name="thead-dark"
            >

            <el-table-column v-if="permisos && permisos.recaudo && permisos.recaudo.VerConteoModalVuelta"
                label="Acciones"
                :minWidth="'150'"
                >
                <template slot-scope="scope">
                  <base-button size="sm" @click="showVisibleModalCounting(scope.row)" title="Ver Conteo" type="primary">
                    Ver
                  </base-button>
                </template>
              </el-table-column>
              <el-table-column prop="unidad" label="Unidad" minWidth="110">
              </el-table-column>
              
              <el-table-column prop="salida_m_id" label="N° Salida" minWidth="140">
              </el-table-column>

              <el-table-column prop="NumeVuelSali_m" label="N° Vuelta" minWidth="140">
              </el-table-column>

              <el-table-column
                prop="DescRutaSali_m"
                label="Ruta - Linea"
                minWidth="200"
              >
              </el-table-column>

              <el-table-column
                prop="subida1"
                label="Puerta 1 (S)"
                minWidth="160"
              >
              </el-table-column>
              <el-table-column
                prop="subida2"
                label="Puerta 2 (S)"
                minWidth="160"
              >
              </el-table-column>
              <el-table-column
                prop="subida3"
                label="Puerta 3 (S)"
                minWidth="160"
              >
              </el-table-column>
              <!--<el-table-column
                prop="bajada1"
                label="Puerta 1 (B)"
                minWidth="160"
              >
              </el-table-column>
              <el-table-column
                prop="bajada2"
                label="Puerta 2 (B)"
                minWidth="160"
              >
              </el-table-column>
              <el-table-column
                prop="bajada3"
                label="Puerta 3 (B)"
                minWidth="160"
              >
              </el-table-column>-->
              <el-table-column
                prop="totalSubidas"
                label="Total Subidas"
                minWidth="180"
              >
              </el-table-column>

              <!--<el-table-column
                prop="totalBajadas"
                label="Total Bajadas"
                minWidth="180"
              >
              </el-table-column>

              <el-table-column prop="error" label="% Error" minWidth="140">
              </el-table-column>-->

              <el-table-column
                prop="dinero"
                label="D. Recaudado ($)"
                minWidth="180"
              >
              </el-table-column>

              <el-table-column
                prop="valorPonderada"
                label="T. Central ($)"
                minWidth="150"
              >
              </el-table-column>

              <el-table-column
                prop="Odometro"
                label="Km/H"
                minWidth="110"
              >
              </el-table-column>

              <el-table-column prop="ipk" label="IPK" minWidth="90">
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
import flatPicker from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import pdfMake from "pdfmake/build/pdfmake.js";
import pdfFonts from "pdfmake/build/vfs_fonts.js";
import { getBase64LogoReportes } from "../../util/logoReport";
import { getFecha_dd_mm_yyyy, FechaStringToHour } from '../../util/fechas'

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
} from "element-ui";

import RouteBreadCrumb from "@/components/argon-core/Breadcrumb/RouteBreadcrumb";
import { BasePagination } from "@/components/argon-core";
import clientPaginationMixin from "~/components/tables/PaginatedTables/clientPaginationMixin";
import swal from "sweetalert2";
import Tabs from "@/components/argon-core/Tabs/Tabs";
import TabPane from "@/components/argon-core/Tabs/Tab";

export default {
  mixins: [clientPaginationMixin],
  layout: "RecaudoDashboardLayout",
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
  },
  data() {
    return {
      mListaUnidadesContadorPasajeros: [],
      tableDataRecaudoContadorPasajerosVueltas: [],
      mListLineasContadorPasajeros: [],
      loadingUnidadesContadorPasajeros: false,
      loadingUnidadesContadorPasajerosPasajerosVueltas: false,
      mSelectRutaContadorPasajeroVueltas: [],
      itemUnidadContadorPasajeroVuetas: [],
      token: this.$cookies.get("token"),
      fechaInicialConteoPasajerosVueltas: "",
      fechaFinalConteoPasajerosVueltas: "",
      ConteoPasajerosWorksheetExcelRPagosVehiculoProduccionVueltas: [],
      ConteoPasajerosFileNameExcelRPagosVehiculoProduccionVueltas: [],
      oHeaderExcelConteoPasajerosVueltas:[],
      optionsUnidadesSelectContadorPasajero: [],
      json_fields_excelRPagosVehiculoProduccion: {
        Unidad: "unidad",
        "Salida":"salida_m_id",
        "N° Vuelta":"NumeVuelSali_m",
        "Linea - Ruta": "DescRutaSali_m",
        "Subida 1": "subida1",
        "Subida 2": "subida2",
        "Subida 3": "subida3",
        "Total Subidas": "totalSubidas",
        "T Central ($)": "valorPonderada",
        "KM/H Recorridos": "Odometro",
        "IPK": "ipk",
        "Dinero Recaudado": "dinero",
      },
      permisos: null,
      isCardCounting: false,
      contador: {
        nombre: "Contador de Ventas",
        valor: 150,
        progreso: 75, // Porcentaje de progreso
      },
    };
  },
  methods: {
    remoteMethodUnidadesContadorPasajeros(query) {
      if (query !== "") {
        this.loadingUnidadesContadorPasajeros = true;
        setTimeout(() => {
          this.loadingUnidadesContadorPasajeros = false;
          this.optionsUnidadesSelectContadorPasajero =
            this.mListaUnidadesContadorPasajeros.filter((item) => {
              return (
                item.CodiVehi.toLowerCase().indexOf(query.toLowerCase()) > -1
              );
            });
        }, 200);
      } else {
        this.optionsUnidadesSelectContadorPasajero = [];
      }
    },
    getNombresRutasRConteoPasajerosVueltas() {
      var mlist = [];
      for (var j = 0; j < this.mSelectRutaContadorPasajeroVueltas.length; j++) {
        for (var i = 0; i < this.mListLineasContadorPasajeros.length; i++) {
          if (
            this.mSelectRutaContadorPasajeroVueltas[j] ==
            this.mListLineasContadorPasajeros[i].LetrRuta
          ) {
            mlist.push(this.mListLineasContadorPasajeros[i].DescRuta);
          }
        }
      }
      return mlist;
    },
    initFechaActualContadorPasajerosVueltas() {
      var fecha = new Date();
      var mes = fecha.getMonth() + 1;
      var day = fecha.getDate();
      var format =
        fecha.getFullYear() +
        "-" +
        (mes < 10 ? "0" + mes : mes) +
        "-" +
        (day < 10 ? "0" + day : day);

      this.fechaInicialConteoPasajerosVueltas = format + " ";
      this.fechaFinalConteoPasajerosVueltas = format + " ";
    },
    async readAllUnidadesContadorPasajerosVueltas() {
      var datos = await this.$axios.post(process.env.baseUrl + "/unidades", {
        token: this.token,
      });

      if (datos.data.status_code == 200) {
        for (var i = 0; i < datos.data.data.length; i++) {
          var obj = datos.data.data[i];
          obj.value = obj.CodiVehi;
          this.mListaUnidadesContadorPasajeros.push(obj);
        }
      }
    },
    async readAllLineasContadorPasajerosVueltas() {
      var datos = await this.$axios.post(process.env.baseUrl + "/rutes", {
        token: this.token,
        tipo:1
      });
      if (datos.data.status_code == 200) {
        this.mListLineasContadorPasajeros.push(...datos.data.data);
      }
    },
    async readConteoPasajeros() 
    {
      this.ConteoPasajerosWorksheetExcelRPagosVehiculoProduccionVueltas =
        "RCPV_W_" + Date.now();
      this.ConteoPasajerosFileNameExcelRPagosVehiculoProduccionVueltas =
        "RCPV_" + Date.now() + ".xls";


        this.oHeaderExcelConteoPasajerosVueltas = [
            "REPORTE CONTEO DE PASAJEROS POR SALIDA",
            "Fechas : " +
              this.fechaInicialConteoPasajerosVueltas.toString()+
              " hasta " +
              this.fechaFinalConteoPasajerosVueltas.toString(),
            "Unidades : " +
              (this.itemUnidadContadorPasajeroVuetas.length <= 0
                ? "TODAS LAS UNIDADES"
                : this.itemUnidadContadorPasajeroVuetas),
            "Rutas : " +
              (this.mSelectRutaContadorPasajeroVueltas.length <= 0
                ? "TODAS LAS RUTAS"
                : this.getNombresRutasRConteoPasajerosVueltas(
                    this.mSelectRutaContadorPasajeroVueltas
                  )),
          ];  

      if (this.loadingUnidadesContadorPasajerosPasajerosVueltas) {
        Notification.info({
          title: "Conteo de Pasajeros",
          message: "Por favor espere un momento, consulta en proceso.",
        });
      } else {
        this.loadingUnidadesContadorPasajerosPasajerosVueltas = true;
        this.tableDataRecaudoContadorPasajerosVueltas = [];
        try {
          /*console.log(this.itemUnidadContadorPasajeroVuetas)
          console.log(this.mSelectRutaContadorPasajeroVueltas)*/
          var body = {
            token: this.token,
            unidades:
              this.itemUnidadContadorPasajeroVuetas.length == 0
                ? "*"
                : this.itemUnidadContadorPasajeroVuetas,
            rutas:
              this.mSelectRutaContadorPasajeroVueltas.length == 0
                ? "*"
                : this.mSelectRutaContadorPasajeroVueltas,
            fechaI: getFecha_dd_mm_yyyy(this.fechaInicialConteoPasajerosVueltas) + " 01:00:00",
            fechaF: getFecha_dd_mm_yyyy(this.fechaFinalConteoPasajerosVueltas) + " 23:59:59",
          };
          //console.log(body)
          var datos = await this.$axios.post(
            process.env.baseUrl + "/contadorPasajerosFechaVueltas",
            body,
            {
              timeout: 600000,
            }
          );
  
          if (datos.data.status_code == 200) 
          {
            this.tableDataRecaudoContadorPasajerosVueltas.push(...datos.data.datos);
          } else if (datos.data.status_code == 300) {
            Notification.info({
              title: "Conteo de Pasajeros",
              message: "No existen datos disponibles.",
            });
          } else {
            Notification.error({
              title: "Conteo de Pasajeros",
              message: datos.data.msm,
            });
          }
        } catch (error) {
          console.log(error);
          Notification.error({
              title: "TRYCTACH Conteo de Pasajeros",
              message: error.toString(),
            });
        }
        this.loadingUnidadesContadorPasajerosPasajerosVueltas = false;
      }
    },
    async exportConteoPasajerosVueltasPDf() {
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
            (this.itemUnidadContadorPasajeroVuetas.length > 0
              ? this.itemUnidadContadorPasajeroVuetas
              : "Todas las Unidades"),
          fontSize: 9,
          alignment: "left",
        },
      ];
      var ruta = [
        {
          text:
            "Ruta : " +
            (this.mSelectRutaContadorPasajeroVueltas.length > 0
              ? this.getNombresRutasRConteoPasajerosVueltas()
              : "Todas las Lineas"),
          fontSize: 9,
          alignment: "left",
        },
      ];
      var desde_hasta = [
        {
          text:
            "Fecha Salida : " +
            this.fechaInicialConteoPasajerosVueltas +
            " Hasta " +
            this.fechaFinalConteoPasajerosVueltas,
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
            text: "RUTA - LINEA",
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
            text: "PUERTA 1",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },
          {
            text: "PUERTA 2",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },
          {
            text: "PUERTA 3",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },
          {
            text: "TOTAL SUBIDAS",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },
          {
            text: "T. CENTRAL ($)",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },
          {
            text: "KM/H",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },
          {
            text: "IPK",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },
          {
            text: "T. DINERO ($)",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },
        ],
      ];

      var totalSubidas = 0;
      var totalSubidadUnidad = 0
      var totalDineroUnidad = 0
      var totalDinero = 0

      for (var i = 0; i < this.tableDataRecaudoContadorPasajerosVueltas.length; i++) 
      {
        totalSubidas = totalSubidas + 
                              parseFloat(this.tableDataRecaudoContadorPasajerosVueltas[i].totalSubidas)
        totalDinero = totalDinero + 
                              parseFloat(this.tableDataRecaudoContadorPasajerosVueltas[i].dinero)


        /*if(i == this.tableDataRecaudoContadorPasajerosVueltas.length)
        {
          totalDineroUnidad = totalDineroUnidad + 
                              parseFloat(this.tableDataRecaudoContadorPasajerosVueltas[i-1].dinero)
            totalSubidadUnidad = totalSubidadUnidad + 
                              parseFloat(this.tableDataRecaudoContadorPasajerosVueltas[i-1].totalSubidas)

                              console.log(totalSubidadUnidad)
            console.log(totalDineroUnidad)

        }else{
          if(i >= 1)
        {
          if(this.tableDataRecaudoContadorPasajerosVueltas[i].unidad == 
             this.tableDataRecaudoContadorPasajerosVueltas[i-1].unidad)
             {
              
            totalDineroUnidad = totalDineroUnidad + 
                              parseFloat(this.tableDataRecaudoContadorPasajerosVueltas[i-1].dinero)
            totalSubidadUnidad = totalSubidadUnidad + 
                              parseFloat(this.tableDataRecaudoContadorPasajerosVueltas[i-1].totalSubidas)

                              console.log(this.tableDataRecaudoContadorPasajerosVueltas[i].unidad+" : "
                              +parseFloat(this.tableDataRecaudoContadorPasajerosVueltas[i-1].totalSubidas))
          }else{
            totalDineroUnidad = totalDineroUnidad + 
                              parseFloat(this.tableDataRecaudoContadorPasajerosVueltas[i-1].dinero)
            totalSubidadUnidad = totalSubidadUnidad + 
                              parseFloat(this.tableDataRecaudoContadorPasajerosVueltas[i-1].totalSubidas)
            
            

            totalSubidadUnidad = 0
            totalDineroUnidad = 0
            
            
          }
        }
        }
        totalSubidas =
          totalSubidas +
          parseFloat(this.tableDataRecaudoContadorPasajerosVueltas[i].totalSubidas);*/
        var obj = [
          {
            text: this.tableDataRecaudoContadorPasajerosVueltas[i].unidad,
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text: this.tableDataRecaudoContadorPasajerosVueltas[i].DescRutaSali_m,
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text: this.tableDataRecaudoContadorPasajerosVueltas[i].NumeVuelSali_m,
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text: this.tableDataRecaudoContadorPasajerosVueltas[i].subida1,
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text: this.tableDataRecaudoContadorPasajerosVueltas[i].subida2,
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text: this.tableDataRecaudoContadorPasajerosVueltas[i].subida3,
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text: this.tableDataRecaudoContadorPasajerosVueltas[i].totalSubidas,
            fontSize: 8.5,
            alignment: "center",
          },

          {
            text: this.tableDataRecaudoContadorPasajerosVueltas[i].valorPonderada,
            fontSize: 8.5,
            alignment: "center",
          },

          {
            text: this.tableDataRecaudoContadorPasajerosVueltas[i].Odometro,
            fontSize: 8.5,
            alignment: "center",
          },

          {
            text: this.tableDataRecaudoContadorPasajerosVueltas[i].ipk,
            fontSize: 8.5,
            alignment: "center",
          },

          {
            text: this.tableDataRecaudoContadorPasajerosVueltas[i].dinero,
            fontSize: 8.5,
            alignment: "center",
          },
        ];

        resultadoString.push(obj);
      }

      var resultadoStringTotalSubidas = [
        [
          {
            text: "TOTAL PASAJEROS",
            fontSize: 13,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },
          {
            text: "TOTAL DINERO ($)",
            fontSize: 13,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },
        ],
        [
          {
            text: totalSubidas,
            fontSize: 14,
            bold: true,
            alignment: "center",
          },
          {
            text: Number(totalDinero).toFixed(2),
            fontSize: 14,
            bold: true,
            alignment: "center",
          },
        ],
      ];

      var docDefinition = {
        pageOrientation: "landscape",
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
                      text: "REPORTE CONTEO DE PASAJEROS POR SALIDAS",
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
          {
            table: {
              headerRows: 0,
              widths: [40, 130,50, 50, 50, 50, 80, 60, 45, 40, 60],
              body: resultadoString,
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
          {
            table: {
              headerRows: 0,
              widths: [140,140],
              body: resultadoStringTotalSubidas,
            },
          },
        ],
      };

      pdfMake.createPdf(docDefinition).download("RCPV_" + Date.now());
    },
    async showVisibleModalCounting(item) {
      this.isCardCounting = true;
      /*this.isCardCounting == true ? false : true;*/
      if (this.isCardCounting == true) {
        console.log("abrir modal");
      }


    },
    closeModal() {
      this.isCardCounting = false; // Cerrar el modal
    },
    confirmarAccion() {
      // Lógica para confirmar la acción
      console.log("Acción confirmada");
      this.closeModal(); // Cerrar el modal después de confirmar
    },
  },
  mounted() {
    this.permisos = this.$cookies.get("permisos")
    this.readAllUnidadesContadorPasajerosVueltas();
    this.initFechaActualContadorPasajerosVueltas();
    this.readAllLineasContadorPasajerosVueltas();
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
  width: 90%;
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
.card-bodyRPagosVehiculoProduccion {
  padding: 0rem !important;
  height: calc(100vh - 13rem);
  overflow: auto;
}

.card-bodyTopOpcionesRPagosVehiculoPRoduccion {
  padding-top: 0.25rem !important;
}
</style>
