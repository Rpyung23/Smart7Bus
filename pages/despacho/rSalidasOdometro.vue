<template>
    <div class="content">
      <base-header>
        <div class="align-items-center py-3">
          <card class="no-border-card col" style="margin-bottom: 0.5rem"
            body-classes="px-0 pb-1 card-bodyTopOpcionesRPagosVehiculoPRoduccion cardSelectRubrosEstadosPagosVehiculoProduccionContainer"
            footer-classes="pb-2">
            <div class="cardTextoRPagosVehiculoProduccion">
              <el-select v-model="itemUnidadSalidasPanelBusqueda" multiple filterable style="margin-right: 0.5rem" remote
                placeholder="Ingrese unidad" :remote-method="remoteMethodUnidadesSalidasPanelBusqueda"
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
  
            <div class="cardSelectRubrosEstadosPagosVehiculoProduccionContainer" size="sm">
              <div class="buttonsAdicionalesRContadorVuelta">
                <base-button icon type="primary" size="sm" @click="readRDistancias()">
                  <span class="btn-inner--icon"><i class="el-icon-search"></i></span>
                </base-button>

              <!--download-excel
                class="btn btn-icon btn-fab btn-success btn-sm"
                v-if="mListaRVelocidades.length > 0"
                :header="headerExcelRPagosVehiculoResumidoProduccion"
                :data="mListaRVelocidades"
                :fields="json_fields_ExcelRPagosVehiculoResumidoProduccion"
                :worksheet="WorksheetExcelRPagosVehiculoResumidoProduccion"
                :name="FileNameExcelRPagosVehiculoResumidoProduccion"
                title="EXPORTAR A EXCEL"
              >
                <span class="btn-inner--icon"
                  ><i class="ni ni-collection"></i
                ></span>
              </download-excel-->

            <base-button size="sm" title="EXPORTAR PDF" v-if="mListaRVelocidades.length > 0 ? true : false"
                type="danger" @click="generatePdf()">
                <span class="btn-inner--icon"><i class="ni ni-cloud-download-95"></i></span>
            </base-button>

            </div>
            </div>
          </card>
          <card class="no-border-card col" style="margin-bottom: 0.5rem"
                    body-classes="px-0 pb-1 card-bodyTopOpcionesRPagosVehiculoPRoduccion cardSelectRubrosEstadosPagosVehiculoProduccionContainer"
                    footer-classes="pb-2">
                    <div class="cardTextoRPagosVehiculoProduccion">

                        <el-select v-model="modelTiposEvento" multiple collapse-tags style="margin-right: 0.5rem"
                            placeholder="Rutas" :loading="loadingTableUnidadesSalidasPanelBusquedaloading">
                            <el-option v-for="item in mListaRutasSalidasSemanales" :key="item.LetrRuta"
                                :label="item.DescRuta" :value="item.LetrRuta">
                            </el-option>
                        </el-select>
                    </div>
                </card>

          <card class="no-border-card" style="margin-bottom: 0rem" body-classes="card-bodyRDistancias px-0 pb-1"
            footer-classes="pb-2">
            <div>
              <el-table v-loading="loadingTableRVelocidadesBusquedaloading" 
                element-loading-text="Cargando Datos..."
                :data="mListaRVelocidades" row-key="id"
                class="tablePanelRDistancia" header-row-class-name="thead-dark"
                height="calc(100vh - 10rem)" highlight-current-row>
  
                <el-table-column v-for="column in tableColumnsUnidadesFlotaVehicular" :key="column.label" v-bind="column">
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
  
  import pdfMake from "pdfmake/build/pdfmake.js";
  import pdfFonts from "pdfmake/build/vfs_fonts.js";
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
  import RouteBreadCrumb from "@/components/argon-core/Breadcrumb/RouteBreadcrumb";
  import { BasePagination } from "@/components/argon-core";
  import clientPaginationMixin from "~/components/tables/PaginatedTables/clientPaginationMixin";
  import { getBase64LogoReportes } from "../../util/logoReport";
  
  import swal from "sweetalert2";
  import Tabs from "@/components/argon-core/Tabs/Tabs";
  import TabPane from "@/components/argon-core/Tabs/Tab";
  
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
        mListaUnidadesSalidasPanelBusqueda: [],
        loadingTableRVelocidadesBusquedaloading: false,
        itemUnidadSalidasPanelBusqueda: [],
        token: this.$cookies.get("token"),
        fechaInicialSalidasPanelBusqueda: "",
        fechaFinalSalidasPanelBusqueda: "",
        optionsUnidadesSalidasPanelBusqueda: [],
        modelTiposEvento: [],
        mListaRutasSalidasSemanales: [],
        tableColumnsUnidadesFlotaVehicular: [
        
          {
            prop: "Salida",
            label: "Salida",
            minWidth: 100,
          },
          {
            prop: "Unidad",
            label: "Unidad",
            sortable: true,
            minWidth: 100,
          },
          {
            prop: "Ruta",
            label: "Ruta",
            minWidth: 200,
          },
          {
            prop: "Frecuencia",
            label: "Frecuencia",
            minWidth: 200,
          },
          {
            prop: "Vuelta",
            label: "N Vuelta",
            minWidth: 100,
            
          },
          {
            prop: "minimo",
            label: "I.Odómetro",
            minWidth: 120,
          },
          {
            prop: "maximo",
            label: "F.Odómetro",
            minWidth: 120,
          },
          {
            prop: "Recorrido",
            label: "KM TOTAL.",
            minWidth: 120,
          }
        ],
        mListaRVelocidades: [],
        mListLineasSalidasPanelBusqueda: [],
        mSelectRutaSalidaPanelBusqueda: [],
        loadingTableUnidadesSalidasPanelBusquedaloading:false,
        WorksheetExcelRPagosVehiculoResumidoProduccion:"",
        FileNameExcelRPagosVehiculoResumidoProduccion:"",
        headerExcelRPagosVehiculoResumidoProduccion:[],
        json_fields_ExcelRPagosVehiculoResumidoProduccion: {
          "Salida": "Salida",
          "Unidad": "Unidad",
          "Ruta": "Ruta",
          "Frecuencia": "Frecuencia",
          "Vuelta": "Vuelta",
          "I.Odómetro": "minimo",
          "F.Odometro": "maximo",
          "Recorrido": "Recorrido"
        },
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
      async readRDistancias() {
        this.mListaRVelocidades = []
        this.WorksheetExcelRPagosVehiculoResumidoProduccion = "RPV_W_RD_"+this.itemUnidadSalidasPanelBusqueda+"_"+Date.now()
        this.FileNameExcelRPagosVehiculoResumidoProduccion = "RPV_RD_"+this.itemUnidadSalidasPanelBusqueda+"_"+Date.now()+".xls"
  
        this.headerExcelRPagosVehiculoResumidoProduccion = [
                "Reporte Kilometros Recorridos: "+(this.itemUnidadSalidasPanelBusqueda.length == 0  ? "TODAS LAS UNIDADES" : 
                this.itemUnidadSalidasPanelBusqueda),
                "Fechas : "+this.fechaInicialSalidasPanelBusqueda +" hasta "+this.fechaFinalSalidasPanelBusqueda
              ]
  
        
        try 
        {
            this.loadingTableRVelocidadesBusquedaloading = true
            var datos = await this.$axios.post(process.env.baseUrl + "/ROdometro", {
            token: this.token,
            "unidades": this.itemUnidadSalidasPanelBusqueda.length > 0 ? this.itemUnidadSalidasPanelBusqueda : "*",
            fechaI: this.fechaInicialSalidasPanelBusqueda,
            fechaF: this.fechaFinalSalidasPanelBusqueda,
            rutas: this.modelTiposEvento.length <= 0 ? "*" : this.modelTiposEvento,
            },  {
            timeout: 600000,
          });
  
          if (datos.data.status_code == 200) {
            this.mListaRVelocidades.push(...datos.data.datos)
            //this.generatePdf()
          } else {
            Notification.warning({
              title: "Reporte Recorrido",
              message: datos.data.msm,
            });
          }
        } catch (e) {
          console.log(e)
          Notification.error({
            title: "Reporte Recorrido",
            message: e.toString(),
          });
        }
        this.loadingTableRVelocidadesBusquedaloading = false
      },
      async generatePdf() {
            var empresa = [
                {
                    text: "Empresa : " + this.$cookies.get("nameEmpresa"),
                    fontSize: 12,
                    alignment: "left",
                    bold: true,
                },
            ];
            var tipoReporte = [
                {
                    text:
                        "REPORTE DE LA RUTA : " +
                        (this.modelTiposEvento.length === 0
                            ? "TODAS LAS RUTAS"
                            : this.modelTiposEvento.toString()),
                    fontSize: 11,
                    alignment: "left",
                    bold: true,
                },
            ];
            var desde_hasta = [
                {
                    text:
                        "Del : " +
                        (this.fechaInicialSalidasPanelBusqueda) +
                        " Hasta " +
                        (this.fechaFinalSalidasPanelBusqueda),
                    fontSize: 11,
                    alignment: "left",
                    bold: true,
                },
            ];
            var unidades = [
                {
                    text:
                        "Unidades : " +
                        (this.itemUnidadSalidasPanelBusqueda.length === 0
                            ? "TODAS LAS UNIDADES"
                            : this.itemUnidadSalidasPanelBusqueda.toString()),
                    fontSize: 11,
                    alignment: "left",
                    bold: true,
                },
            ];
            var resultadoString = [
                [
                    {
                        text: "Salida",
                        fontSize: 8.5,
                        bold: true,
                        fillColor: "#039BC4",
                        color: "white",
                        alignment: "center",
                    },
                    {
                        text: "Unidad",
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
                        text: "Frecuencia",
                        fontSize: 8.5,
                        bold: true,
                        fillColor: "#039BC4",
                        color: "white",
                        alignment: "center",
                    },
                    {
                        text: "N-Vuelta",
                        fontSize: 8.5,
                        bold: true,
                        fillColor: "#039BC4",
                        color: "white",
                        alignment: "center",
                    },
                    {
                        text: "I.Odometro(Km)",
                        fontSize: 8.5,
                        bold: true,
                        fillColor: "#039BC4",
                        color: "white",
                        alignment: "center",
                    },
                    {
                        text: "F.Odometro(Km)",
                        fontSize: 8.5,
                        bold: true,
                        fillColor: "#039BC4",
                        color: "white",
                        alignment: "center",
                    },
                    {
                        text: "Recorrido(Km)",
                        fontSize: 8.5,
                        bold: true,
                        fillColor: "#039BC4",
                        color: "white",
                        alignment: "center",
                    },
                ],
            ];
            for (var i = 0; i < this.mListaRVelocidades.length; i++) {
                var arrys = [
                    {
                        text: this.mListaRVelocidades[i].Salida,
                        fontSize: 8.5,
                        alignment: "center",
                    },
                    {
                        text: this.mListaRVelocidades[i].Unidad,
                        fontSize: 8.5,
                        alignment: "center",

                    },
                    {
                        text: this.mListaRVelocidades[i].Ruta,
                        fontSize: 8.5,
                        alignment: "center",

                    },
                    {
                        text: this.mListaRVelocidades[i].Frecuencia,
                        fontSize: 8.5,
                        alignment: "center",

                    },
                    {
                        text: this.mListaRVelocidades[i].Vuelta,
                        fontSize: 8.5,
                        alignment: "center",

                    },
                    {
                        text: this.mListaRVelocidades[i].minimo,
                        fontSize: 8.5,
                        alignment: "center",
 
                    },
                    {
                        text: this.mListaRVelocidades[i].maximo,
                        fontSize: 8.5,
                        alignment: "center",

                    },
                    {
                        text: this.mListaRVelocidades[i].Recorrido,
                        fontSize: 8.5,
                        alignment: "center",

                    },

                ];
                resultadoString.push(arrys);
            }
            var docDefinition = {
                pageSize: "A4",
                pageOrientation: "portrait",
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
                                            text: "REPORTE RECORIDO",
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
                            body: [empresa, tipoReporte, desde_hasta, unidades],
                        },
                    },
                    {
                        table: {
                            headerRows: 0,
                            widths: [30,30, 90, 90, 30, 70, 70, 70],
                            body: resultadoString,
                        },
                    },
                ],
            };
            pdfMake.createPdf(docDefinition).download("RRO_" + Date.now());
            /*var pdfDocGenerator = pdfMake.createPdf(docDefinition)
            pdfDocGenerator.getBlob((blob) => {
                var pdfUrl = URL.createObjectURL(blob)
                let iframe = document.getElementById('iframeContainerrMinutosTarjetasV');
                iframe.src = pdfUrl;
            });*/
        }

      
    },
    mounted() {
      this.initFechaActualSalidaBusquedaPanel()
      this.readAllUnidadesSalidasPanelBusqueda()
      this.readEventosListaReporte();
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
  
  .cardTextoRPagosVehiculoProduccion {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
  
  .cardSelectRubrosEstadosPagosVehiculoProduccionContainer {
    display: flex;
    justify-content: space-between;
  }
  
  .no-border-card .card-footer {
    border-top: 0;
  }
  
  .card-bodyRDistancias {
    padding: 0rem !important;
    height: calc(100vh - 9.5rem);
    overflow: auto;
  }
  
  
  .card-bodyTopOpcionesRPagosVehiculoPRoduccion {
    padding-top: 0.25rem !important;
  }
  </style>
  