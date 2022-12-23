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
            <!--<el-autocomplete class="inline-input" v-model="itemUnidadRDespachosGenerados" []ltiple
              collapse-tags :fetch-suggestions="
                querySearchUnidadProduccionRPagoVehiculoRecibo
              " style="margin-right: 0.5rem" placeholder="Unidad" prefix-icon="ni ni-bus-front-12"
              :trigger-on-focus="false" @select="handleSelectUnidadProduccionRPagoVehiculoRecibo"></el-autocomplete>-->

            <el-select
              v-model="itemUnidadRDespachosGenerados"
              multiple
              filterable
              remote
              placeholder="Unidades"
              prefix-icon="ni ni-bus-front-12"
              style="margin-right: 0.5rem"
              :remote-method="remoteMethodUnidadesRecibosProduccion"
              :loading="loadingTableUnidadesRecibosVehiculoProduccion"
            >
              <el-option
                v-for="item in optionsUnidadesProduccionPagosVehiculo"
                :key="item.CodiVehi"
                :label="item.CodiVehi"
                :value="item.CodiVehi"
              >
              </el-option>
            </el-select>

            <!--<el-select v-model="itemRutasRDespachosGenerados" multiple filterable remote
              placeholder="Operador" prefix-icon="ni ni-bus-front-12" style="margin-right: 0.5rem"
              :remote-method="remoteMethodUnidadesRecibosProduccion"
              :loading="loadingTableUnidadesRecibosVehiculoProduccion">
              <el-option v-for="item in optionsCobradoresProduccionPagosVehiculo" :key="item.CodiVehi"
                :label="item.CodiVehi" :value="item.CodiVehi">
              </el-option>
            </el-select>-->

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
                v-model="fechaInicialRDespachosGenerados"
              >
              </flat-picker>
            </base-input>

            <base-input style="margin-right: 0.5rem" addon-left-icon="ni ni-calendar-grid-58">
              <flat-picker
                slot-scope="{ focus, blur }"
                @on-open="focus"
                @on-close="blur"
                :config="{ allowInput: true }"
                class="form-controlPersonal datepicker"
                v-model="fechaFinalRDespachosGenerados"
              >
              </flat-picker>
            </base-input>

            <!-- DOWNLOAD EXCEL-->

  
          </div>

          <div class="cardSelectRubrosEstadosPagosVehiculoProduccionContainer">
            <div style="height: 100%; display: flex">
              <base-button
                icon
                type="primary"
                size="sm"
                @click="readDespachosGenerados()"
              >
                <span class="btn-inner--icon"
                  ><i class="el-icon-search"></i
                ></span>
              </base-button>

              <download-excel
                v-if="tableDataDespachosGenerados.length > 0 ? true : false"
                class="btn btn-icon btn-fab btn-success btn-sm"
                outline
                :header="RecibosheaderExcelRDespachosGEnerados"
                title="Exportar a Excel"
                :data="tableDataDespachosGenerados"
                :fields="json_fields_excelRDespachosGenerados"
                :worksheet="RecibosWorksheetExcelRDespachosGenerados"
                :name="RecibosFileNameExcelRDespachosGenerados"
              >
                <span class="btn-inner--icon"
                  ><i class="ni ni-collection"></i
                ></span>
              </download-excel>
            </div>

            <!--<base-button outline type="success">
              <span class="btn-inner--icon"
                ><i class="ni ni-collection"></i
              ></span>
              <span class="btn-inner--text"> Exportar Excel</span>
            </base-button>-->
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
              style="margin-right: 0.5rem"
              collapse-tags
              v-model="itemRutasRDespachosGenerados"
              multiple
              placeholder="Rutas"
            >
              <el-option
                v-for="item in mListaRutasIndicadoresCalidad"
                :key="item.LetrRuta"
                :label="item.DescRuta"
                :value="item.LetrRuta"
              >
              </el-option>
            </el-select>
          </div>

          <div class="cardTextoRPagosVehiculoProduccion">
            <el-switch
              v-model="oSwitchOrdenarDespachoGenerados"
              active-text="ORDENAR POR FECHA"
              inactive-text="ORDENAR POR FECHA - UNIDAD"
            >
            </el-switch>
          </div>
        </card>

        <card
          class="no-border-card"
          style="margin-bottom: 0rem"
          body-classes="card-bodyRPagosVehiculoReciboProduccion px-0 pb-1"
          footer-classes="pb-2"
        >
          <div>
            <el-table
              :data="tableDataDespachosGenerados"
              height="calc(100vh - 13rem)"
              style="width: 100%"
              v-loading="loadingDespachosGenerados"
              element-loading-text="Cargando Despachos..."
              element-loading-background="rgba(0, 0, 0, 0.8)"
            >
              <el-table-column prop="Fecha" label="FECHA" width="140">
              </el-table-column>
              <el-table-column prop="LetraRutaSali_m" label="RUTA" width="150">
              </el-table-column>
              <el-table-column prop="Fecha" label="DATE" width="150">
              </el-table-column>
              <el-table-column prop="CodiVehiSali_m" label="UNIDAD" width="150">
              </el-table-column>
              <el-table-column
                prop="DescRutaSali_m"
                label="RUTA DETALLE"
                width="350"
              >
              </el-table-column>
              <el-table-column prop="Turno" label="TURNO" width="150">
              </el-table-column>
              <el-table-column prop="V_PROG" label="Vue. PROG" width="150">
              </el-table-column>
              <el-table-column prop="V_EJEC" label="Vue. EJEC" width="150">
              </el-table-column>
              <el-table-column prop="KMS_RUTA" label="KMS RUTA" width="150">
              </el-table-column>
              <el-table-column prop="KMS_EJEC" label="KMS EJEC" width="150">
              </el-table-column>
              <el-table-column prop="KMSTOTAL" label="KMS TOTAL" width="150">
              </el-table-column>
              <!--<el-table-column prop="KMSREC" label="KMS RECORRIDO" width="180">
              </el-table-column>-->
              <el-table-column prop="PASS_SUB" label="PASS SUB" width="180">
              </el-table-column>
              <!--<el-table-column prop="PASS_BAJ" label="PASS BAJ" width="180">
              </el-table-column>-->
              <el-table-column prop="Coleccion" label="COLECCIÓN" width="180">
              </el-table-column>
              <el-table-column
                prop="DepositoTotal"
                label="DEPÓSITO TOTAL"
                width="180"
              >
              </el-table-column>
              <el-table-column prop="atraso" label="MIN ATRASO" width="180">
              </el-table-column>

              <el-table-column prop="adelanto" label="MIN ADELANTO" width="180">
              </el-table-column>
              <el-table-column
                prop="ConductorManana"
                label="CONDUCTOR MAÑANA"
                width="350"
              >
              </el-table-column>
              <el-table-column
                prop="ConductorTarde"
                label="CONDUCTOR OPCIONAL"
                width="350"
              >
              </el-table-column>
              <el-table-column
                prop="AyudanteManana"
                label="AYUDANTE MAÑANA"
                width="250"
              >
              </el-table-column>
              <el-table-column
                prop="AyudanteTarde"
                label="AYUDANTE OPCIONAL"
                width="250"
              >
              </el-table-column>
              <el-table-column
                prop="CantidadIncidencias"
                label="CANT. INCIDENCIAS"
                width="250"
              >
              </el-table-column>
              <el-table-column
                prop="ExcesoVelocidad"
                label="EXCESO. VELOCIDAD"
                width="250"
              >
              </el-table-column>
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
  Button,
  Switch
} from "element-ui";

import RouteBreadCrumb from "@/components/argon-core/Breadcrumb/RouteBreadcrumb";
import { BasePagination } from "@/components/argon-core";
import clientPaginationMixin from "~/components/tables/PaginatedTables/clientPaginationMixin";
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
    [Button.name]: Button,
    [Switch.name]:Switch
  },
  data() {
    return {
      mListaUnidadesPagosVehiculoProduccionRecibo: [],
      mListaRutasIndicadoresCalidad: [],
      itemUnidadRDespachosGenerados: [],
      itemRutasRDespachosGenerados: [],
      token: this.$cookies.get("token"),
      fechaInicialRDespachosGenerados: "",
      fechaFinalRDespachosGenerados: "",
      oSwitchOrdenarDespachoGenerados:true,
      loadingTableUnidadesRecibosVehiculoProduccion: false,
      tableDataDetalleReciboPAgoVehiculoProduccion: [],
      optionsUnidadesProduccionPagosVehiculo: [],
      optionsCobradoresProduccionPagosVehiculo: [],
      tableDataDespachosGenerados: [],
      loadingDespachosGenerados: false,
      RecibosWorksheetExcelRDespachosGenerados: "",
      RecibosFileNameExcelRDespachosGenerados: "",
      json_fields_excelRDespachosGenerados: {
        FECHA: "Fecha",
        RUTA: "LetraRutaSali_m",
        DATE: "Fecha",
        UNIDAD: "CodiVehiSali_m",
        "RUTA DETALLE": "DescRutaSali_m",
        TURNO: "Turno",
        "VUELTAS PROGAMADA": "V_PROG",
        "VUELTAS EJECUTADAS": "V_EJEC",
        "KMS RUTA": "KMS_RUTA",
        "KMS EJECUTADOS": "KMS_EJEC",
        "KMS TOTALES": "KMSTOTAL",
        "PASAJEROS SUBIDA": "PASS_SUB",
        COLECCIÓN: "Coleccion",
        "DEPÓSITO TOTAL": "DepositoTotal",
        "MINUTOS ATRASO": "atraso",
        "MINUTOS ADELANTO": "adelanto",
        "CONDUCTOR MAÑANA": "ConductorManana",
        "CONDUCTOR OPCIONAL": "ConductorTarde",
        "AYUDANTE MAÑANA": "AyudanteManana",
        "AYUDANTE MAÑANA": "AyudanteTarde",
        "CANTIDAD INCIDENCIAS": "CantidadIncidencias",
        "EXCESO VELOCIDAD": "ExcesoVelocidad",
      },
    };
  },
  methods: {
    remoteMethodUnidadesRecibosProduccion(query) {
      if (query !== "") {
        this.loadingTableUnidadesRecibosVehiculoProduccion = true;
        setTimeout(() => {
          this.loadingTableUnidadesRecibosVehiculoProduccion = false;
          this.optionsUnidadesProduccionPagosVehiculo =
            this.mListaUnidadesPagosVehiculoProduccionRecibo.filter((item) => {
              return (
                item.CodiVehi.toLowerCase().indexOf(query.toLowerCase()) > -1
              );
            });
        }, 200);
      } else {
        this.optionsUnidadesProduccionPagosVehiculo = [];
      }
    },
    initFechaActualProduccionRPAgosVehiculoRecibo() {
      var fecha = new Date();
      var mes = fecha.getMonth() + 1;
      var day = fecha.getDate();
      var format =
        fecha.getFullYear() +
        "-" +
        (mes < 10 ? "0" + mes : mes) +
        "-" +
        (day < 10 ? "0" + day : day);

      this.fechaInicialRDespachosGenerados = format;
      this.fechaFinalRDespachosGenerados = format;
    },
    async readAllUnidadesPagosVehiculoProduccionRecibo() {
      var datos = await this.$axios.post(process.env.baseUrl + "/unidades", {
        token: this.token,
      });

      console.log(datos.data);

      if (datos.data.status_code == 200) {
        for (var i = 0; i < datos.data.data.length; i++) {
          var obj = datos.data.data[i];
          obj.value = obj.CodiVehi;
          this.mListaUnidadesPagosVehiculoProduccionRecibo.push(obj);
        }
      }
    },
    async readAllRutasIndicadoresCalidad() {
      this.mListaRutasIndicadoresCalidad = [];

      var datos = await this.$axios.post(process.env.baseUrl + "/rutes", {
        token: this.token,
        tipo: 1,
      });

      if (datos.data.status_code == 200) {
        this.mListaRutasIndicadoresCalidad.push(...datos.data.data);
      }
    },
    getNombresRutasRDespachosGenerados() {
      var mlist = [];
      for (var j = 0; j < this.itemRutasRDespachosGenerados.length; j++) {
        for (var i = 0; i < this.mListaRutasIndicadoresCalidad.length; i++) {
          if (
            this.itemRutasRDespachosGenerados[j] ==
            this.mListaRutasIndicadoresCalidad[i].LetrRuta
          ) {
            mlist.push(this.mListaRutasIndicadoresCalidad[i].DescRuta);
          }
        }
      }
      return mlist;
    },
    async readDespachosGenerados() {
      this.loadingDespachosGenerados = true;
      this.RecibosWorksheetExcelRDespachosGenerados = "RDG_W_" + Date.now();
      this.RecibosFileNameExcelRDespachosGenerados =
        "RDG_" + Date.now() + ".xls";
      this.tableDataDespachosGenerados = [];
      try {
        var datos = await this.$axios.post(
          process.env.baseUrl + "/rDespachosGenerados",
          {
            token: this.token,
            unidades:
              this.itemUnidadRDespachosGenerados.length <= 0
                ? "*"
                : this.itemUnidadRDespachosGenerados,
            rutas:
              this.itemRutasRDespachosGenerados.length <= 0
                ? "*"
                : this.itemRutasRDespachosGenerados,
            fechaI: this.fechaInicialRDespachosGenerados,
            fechaF: this.fechaFinalRDespachosGenerados,
            orden:this.oSwitchOrdenarDespachoGenerados  ? 1 : 0 
          }
        );
        if (datos.data.status_code == 200) {
          for (var i = 0; i < datos.data.datos.length; i++) {
            datos.data.datos[i].Turno = i + 1;
          }

          this.tableDataDespachosGenerados.push(...datos.data.datos);

          this.RecibosheaderExcelRDespachosGEnerados = [
            "Reporte Despachos Generados",
            "Fechas : " +
              this.fechaInicialRDespachosGenerados +
              " hasta " +
              this.fechaFinalRDespachosGenerados,
            "Unidades : " +
              (this.itemUnidadRDespachosGenerados.length <= 0
                ? "TODAS LAS UNIDADES"
                : this.itemUnidadRDespachosGenerados),
            "Rutas : " +
              (this.itemRutasRDespachosGenerados.length <= 0
                ? "TODAS LAS RUTAS"
                : this.getNombresRutasRDespachosGenerados(
                    this.itemRutasRDespachosGenerados
                  )),
          ];
        } else {
          this.$notify({
            title: "Despachos Generados",
            message: "No existen datos disponibles.",
          });
        }
      } catch (error) {
        console.log(error);
      }
      this.loadingDespachosGenerados = false;
    },
  },
  mounted() {
    this.readAllRutasIndicadoresCalidad();
    this.readAllUnidadesPagosVehiculoProduccionRecibo();
    this.initFechaActualProduccionRPAgosVehiculoRecibo();
  },
};
</script>
<style>
.card-bodyRPagosVehiculoReciboProduccion::-webkit-scrollbar {
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

.cardTextoRPagosVehiculoProduccion {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.cardSelectRubrosEstadosPagosVehiculoProduccionContainer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.no-border-card .card-footer {
  border-top: 0;
}

.card-bodyRPagosVehiculoReciboProduccion {
  padding: 0rem !important;
  height: calc(100vh - 13rem);
  overflow: auto;
}

.card-bodyTopOpcionesRPagosVehiculoPRoduccion {
  padding-top: 0.25rem !important;
  flex-wrap: wrap;
}
</style>
