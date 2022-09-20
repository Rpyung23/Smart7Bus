<template>
    <div class="content">
      <base-header class="py-3">
        <div class="align-items-center py-3" >
          <card class="no-border-card col" style="margin-bottom: 0.5rem"
        body-classes="px-0 pb-1 card-bodyTopOpcionesRPagosVehiculoPRoduccion cardSelectRubrosEstadosPagosVehiculoProduccionContainer"
        footer-classes="pb-2">


        <div class="cardHeaderPanelEstadistico">

          <el-select
                v-model="mSelectLineasValueTableroEstadistico"
                style="margin-right: 0.5rem"
                multiple
                collapse-tags
                placeholder="Rutas"
                @change="readlPanelTableroEstadistico()"
              >
                <el-option
                  v-for="item in mListLineasEstadisticoProduccion"
                  :key="item.LetrRuta"
                  :label="item.DescRuta"
                  :value="item.idRuta"
                >
                </el-option>
              </el-select>

              <base-input
                addon-left-icon="ni ni-calendar-grid-58"
                style="margin-right: 0.5rem"
              >
                <flat-picker
                  slot-scope="{ focus, blur }"
                  :max="{ fechaInicialEstadisticoProduccion }"
                  @on-open="focus"
                  @on-close="blur"
                  :config="{ allowInput: true }"
                  class="form-controlPersonal datepicker"
                  v-model="fechaInicialEstadisticoProduccion"
                >
                </flat-picker>
              </base-input>

              <base-input
                addon-left-icon="ni ni-calendar-grid-58"
                style="margin-right: 0.5rem"
              >
                <flat-picker
                  slot-scope="{ focus, blur }"
                  :max="{ fechaFinalEstadisticoProduccion }"
                  @on-open="focus"
                  @on-close="blur"
                  :config="{ allowInput: true }"
                  class="form-controlPersonal datepicker"
                  v-model="fechaFinalEstadisticoProduccion"
                >
                </flat-picker>
              </base-input>
        </div>


        <div class="buttonsAdicionalesDespacho">

          <base-button icon type="info" @click="showModalDespachoRecalificarSalida()" v-show="this.selectRowId != null && this.selectRowId != '' && this.selectRowEstado != '' && this.selectRowEstado != 'DIFERIDO'" size="sm" title="Recalificar Salida">
            <span class="btn-inner--icon"><i class="ni ni-watch-time"></i></span>
          </base-button>

          <base-button icon type="danger" @click="showModalDespachoAnularSalida()" v-show="this.selectRowId != null && this.selectRowId != '' && this.selectRowEstado != '' && this.selectRowEstado != 'FINALIZADO'" size="sm" title="Anular Salida">
            <span class="btn-inner--icon"><i class="ni ni-scissors"></i></span>
          </base-button>

          <base-button icon type="warning" @click="showModalDespachoFinalizarSalida()" v-show="this.selectRowId != null && this.selectRowId != '' && this.selectRowEstado != '' && this.selectRowEstado != 'FINALIZADO' && this.selectRowEstado != 'DIFERIDO'" size="sm" title="Finalizar Salida">
            <span class="btn-inner--icon"><i class="ni ni-fat-delete"></i></span>
          </base-button>

          <base-button icon type="default"  @click="showRecorridoSalidaPanelDespacho()" v-show="this.selectRowId != null && this.selectRowId != '' && this.selectRowEstado != '' && this.selectRowEstado != 'DIFERIDO'" size="sm" title="Recorrido">
            <span class="btn-inner--icon"><i class="ni ni-world"></i></span>
          </base-button>

          <base-button icon type="primary" v-show="this.selectRowId != null && this.selectRowId != '' && this.selectRowEstado != ''" @click="showReporteLlegadaSAlida()" size="sm" title="Ver Tarjeta">
            <span class="btn-inner--icon"><i class="ni ni-collection"></i></span>
          </base-button>


          <base-button icon type="primary" title="Buscar" size="sm" @click="readlPanelTableroEstadistico()">
            <span class="btn-inner--icon"><i class="el-icon-search"></i></span>
          </base-button>

        </div>

      </card>
  
  
          <card
            id="cardTableroEstadistico"
            class="no-border-card"
            style="margin-bottom: 0rem"
            body-classes="cardTableroEstadistico card-bodyEstadisticoProduccionPC px-0 pb-1"
            footer-classes="pb-2"
          >
            <div>
              <div class="row">
                <div class="col-sm-4">
                    <el-table
                  v-loading="loadingEstadisticoDesviacionControl"
                  element-loading-text="Cargando Datos..."
                  :data="tableDataDesviacionControl"
                  row-key="id"
                  header-row-class-name="thead-dark"
                  height="calc(100vh - 11.5rem)"
                  style="width: 100%"
                  @selection-change="SelectionChangeControl"
                >
                <el-table-column type="selection"
                       align="left"
                       min-width="120px">
                </el-table-column>
                  <el-table-column prop="Control" label="Control" minWidth="115">
                  </el-table-column>
                  <el-table-column
                    prop="Minimo"
                    label="Minimo"
                    minWidth="110"
                  >
                  </el-table-column>
  
                  <el-table-column prop="Media" label="Media" minWidth="100">
                  </el-table-column>
  
                  <el-table-column
                    prop="Maximo"
                    label="Maximo"
                    minWidth="135"
                  >
                  </el-table-column>

                  <el-table-column prop="Desviacion" label="Desviacion" minWidth="140">
                  </el-table-column>

                  <div slot="empty"></div>
                </el-table>
                </div>
                <div class="col-sm-4">
                    <el-table
                  v-loading="loadingEstadisticoFaltasUnidad"
                  ref="multipleTableCobrosPagar"
                  element-loading-text="Cargando Datos..."
                  :data="tableDataFaltasUnidad"
                  row-key="id"
                  header-row-class-name="thead-dark"
                  height="calc(100vh - 11.5rem)"
                  style="width: 100%"
                >
  
                  <el-table-column prop="Unidad" label="Unidad" minWidth="60">
                  </el-table-column>
  
                  <el-table-column prop="NombreRuta" label="Ruta" minWidth="70">
                  </el-table-column>

                  <el-table-column prop="SumaFalta" label="Faltas" minWidth="60">
                  </el-table-column>

                  <div slot="empty"></div>
                </el-table>
                </div>
                <div class="col-sm-4">
                    <el-table
                  v-loading="loadingEstadisticoFaltasControl"
                  element-loading-text="Cargando Datos..."
                  :data="tableDataFaltasControl"
                  row-key="id"
                  header-row-class-name="thead-dark"
                  height="calc(100vh - 11.5rem)"
                >
  
                  <el-table-column prop="Control" label="Control" minWidth="145">
                  </el-table-column>
  
                  <el-table-column prop="Unidad" label="Unidad" minWidth="110">
                  </el-table-column>
  
                  <el-table-column prop="Programada" label="Programada" minWidth="145">
                  </el-table-column>

                  <el-table-column prop="Marcada" label="Marcada" minWidth="130">
                  </el-table-column>

                  <el-table-column prop="Falta" label="Falta" minWidth="100">
                  </el-table-column>

                  <div slot="empty"></div>
                </el-table>
                </div>
  
              </div>
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
    Button,
  } from "element-ui";
  import RouteBreadCrumb from "@/components/argon-core/Breadcrumb/RouteBreadcrumb";
  import { BasePagination } from "@/components/argon-core";
  import clientPaginationMixin from "~/components/tables/PaginatedTables/clientPaginationMixin";
  import Tabs from "@/components/argon-core/Tabs/Tabs";
  import TabPane from "@/components/argon-core/Tabs/Tab";
  
  export default {
    mixins: [clientPaginationMixin],
    layout: "ProduccionDashboardLayout",
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
    },
    data() {
      return {
        tableDataDesviacionControl: [],
        tableDataFaltasUnidad: [],
        tableDataFaltasControl: [],
        mListControlesSeleccionados:[],
        token: this.$cookies.get("token"),
        fechaInicialEstadisticoProduccion: "",
        fechaFinalEstadisticoProduccion:"",
        loadingEstadisticoDesviacionControl: false,
        loadingEstadisticoFaltasControl: false,
        loadingEstadisticoFaltasUnidad: false,
        mListEstadisticasProduccion: [],
        mListLineasEstadisticoProduccion: [],
        mSelectLineasValueTableroEstadistico:[]
      };
    },
    methods: {
      initFechaActualProduccionPanelControl() {
        const today = new Date();
        const fecha = new Date(today);
        fecha.setDate(fecha.getDate() - 1);
        var mes = fecha.getMonth() + 1;
        var day = fecha.getDate();
        var format =
          fecha.getFullYear() +
          "-" +
          (mes < 10 ? "0" + mes : mes) +
          "-" +
          (day < 10 ? "0" + day : day);
  
        this.fechaInicialEstadisticoProduccion = format;
        this.fechaFinalEstadisticoProduccion = format;
      },
      async readlPanelTableroEstadisticoDesviacionControl() {
        this.loadingEstadisticoDesviacionControl = true;
        this.tableDataDesviacionControl = [];
  
        var datos = await this.$axios.post(
          process.env.baseUrl + "/ProduccionDesviacionControlEstadisticas",
          {
            token: this.token,
            fechaI: this.fechaInicialEstadisticoProduccion,
            fechaF: this.fechaFinalEstadisticoProduccion,
            idRuta:this.mSelectLineasValueTableroEstadistico
          }
        );
  
        //console.log(datos.data)
  
        if (datos.data.status_code == 200) {
          this.tableDataDesviacionControl.push(...datos.data.datos);
        }
  
        this.loadingEstadisticoDesviacionControl = false;
      },
      async readlPanelTableroEstadisticoFaltasControl() {
        this.loadingEstadisticoFaltasControl = true;
        this.tableDataFaltasControl = [];
  
        var datos = await this.$axios.post(
          process.env.baseUrl + "/ProduccionFaltasControlEstadisticas",
          {
            token: this.token,
            fechaI: this.fechaInicialEstadisticoProduccion,
            fechaF: this.fechaFinalEstadisticoProduccion,
            ruta:this.mListControlesSeleccionados,
            idRuta:this.mSelectLineasValueTableroEstadistico
          }
        );
  
        //console.log(datos.data)
  
        if (datos.data.status_code == 200) {
          this.tableDataFaltasControl.push(...datos.data.datos);
        }
  
        this.loadingEstadisticoFaltasControl = false;
      },
      async readlPanelTableroEstadisticoFaltasUnidad() {
        this.loadingEstadisticoFaltasUnidad = true;
        this.tableDataFaltasUnidad = [];
  
        var datos = await this.$axios.post(
          process.env.baseUrl + "/ProduccionFaltasUnidadesEstadisticas",
          {
            token: this.token,
            fechaI: this.fechaInicialEstadisticoProduccion,
            fechaF: this.fechaFinalEstadisticoProduccion,
            ruta:this.mSelectLineasValueTableroEstadistico
          }
        );
  
        //console.log(datos.data)
  
        if (datos.data.status_code == 200) {
          this.tableDataFaltasUnidad.push(...datos.data.datos);
        }
  
        this.loadingEstadisticoFaltasUnidad = false;
      },
      readlPanelTableroEstadistico(){
        this.readlPanelTableroEstadisticoDesviacionControl()
        this.readlPanelTableroEstadisticoFaltasControl()
        this.readlPanelTableroEstadisticoFaltasUnidad()
      },
      async readLineasTableroProduccion() {
        this.mListLineasEstadisticoProduccion = [];
        try {
          var datos = await this.$axios.post(process.env.baseUrl + "/rutes", {
            token: this.token,
            tipo: 3,
          });
  
          if (datos.data.status_code == 200) {
            this.mListLineasEstadisticoProduccion.push(...datos.data.data);
          }
        } catch (error) {
          console.log(error);
        }
      },
      notifyVue(type, mensaje, icono, tiempo = 4500) {
        this.$notify({
          message: mensaje,
          timeout: tiempo,
          icon: icono,
          type,
        });
      },
      SelectionChangeControl(val) {
        this.mListControlesSeleccionados = []
            for (var i = 0; i < val.length; i++) {
                this.mListControlesSeleccionados.push(val[i].CodiControl)
            }
            this.readlPanelTableroEstadisticoFaltasControl()
        },
    },
    mounted() {
      this.codigoEmpresaTableroCobrosProduccion = this.$cookies.get("empresa");
      this.initFechaActualProduccionPanelControl();
      this.readLineasTableroProduccion();
    },
  };
  </script>
  <style>
  .cardTableroEstadistico::-webkit-scrollbar {
    display: none;
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
  
  .cardHeaderPanelEstadistico {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    width: 60%;
    justify-content: flex-start;
  }
  
  .cardSelectEstadisticoProduccionContainer {
    display: flex;
    justify-content: space-between;
  }
  
  .no-border-card .card-footer {
    border-top: 0;
  }
  
  .card-bodyEstadisticoProduccionPC {
    padding: 0rem !important;
    height: calc(100vh - 11.5em);
    overflow: none;
  }
  
  .card-bodyTopOpcionesEstadisticoPRoduccion {
    padding-top: 0.25rem !important;
  }
  </style>
  