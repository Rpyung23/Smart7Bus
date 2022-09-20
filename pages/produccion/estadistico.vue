<template>
    <div class="content">
      <base-header>
        <div class="align-items-center py-3" >
          <card
          class="no-border-card col"
          style="margin-bottom: 0.5rem"
          body-classes="px-0 pb-1 card-bodyTopOpcionesEstadisticoPRoduccion cardSelectEstadisticoProduccionContainer"
          footer-classes="pb-2"
        >
          <div class="cardTextoEstadisticoProduccion">
            <!--<el-autocomplete class="inline-input" v-model="itemUnidadPanelProduccion"
              :fetch-suggestions="querySearchUnidadProduccionRPagoVehiculo" style="margin-right: 0.5rem"
              placeholder="Unidad" prefix-icon="ni ni-bus-front-12" :trigger-on-focus="false"></el-autocomplete>-->

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

          <div class="cardSelectEstadisticoProduccionContainer">
            <div class="buttonCenterEndDerecha">
              <base-button
                icon
                type="primary"
                size="sm"
                @click="readlPanelTableroEstadistico()"
              >
                <span class="btn-inner--icon"
                  ><i class="el-icon-search"></i
                ></span>
              </base-button>
            </div>
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
                  height="calc(100vh - 9.5rem)"
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
                  height="calc(100vh - 9.5rem)"
                  style="width: 100%"
                >
  
                  <el-table-column prop="Unidad" label="Unidad" minWidth="70">
                  </el-table-column>
  
                  <el-table-column prop="NombreRuta" label="Ruta" minWidth="70">
                  </el-table-column>

                  <el-table-column prop="SumaFalta" label="Faltas" minWidth="65">
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
                  height="calc(100vh - 9.5rem)"
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
  
  
  .el-loading-text {
    color: black !important;
  }
  
  .el-icon-loading {
    color: black !important;
  }
  
  .cardTextoEstadisticoProduccion {
    display: flex;
    align-items: center;
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
    height: calc(100vh - 9.5em);
    overflow: none;
  }
  
  .card-bodyTopOpcionesEstadisticoPRoduccion {
    padding-top: 0.25rem !important;
  }
  </style>
  