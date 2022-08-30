<template>
  <div class="content">
    <base-header>
      <div class="align-items-center py-3">
        <card class="no-border-card col" style="margin-bottom: 0.5rem"
          body-classes="px-0 pb-1 card-bodyTopOpcionesRPagosVehiculoPRoduccion cardSelectRubrosEstadosPagosVehiculoProduccionContainer"
          footer-classes="pb-2">
          <div class="cardTextoRPagosVehiculoProduccion">


            <!--<el-autocomplete class="inline-input" v-model="itemUnidadProduccionRPagoVehiculorecibo" []ltiple
              collapse-tags :fetch-suggestions="
                querySearchUnidadProduccionRPagoVehiculoRecibo
              " style="margin-right: 0.5rem" placeholder="Unidad" prefix-icon="ni ni-bus-front-12"
              :trigger-on-focus="false" @select="handleSelectUnidadProduccionRPagoVehiculoRecibo"></el-autocomplete>-->

            <el-select v-model="itemUnidadProduccionRPagoVehiculorecibo" multiple filterable remote
              placeholder="Unidades" prefix-icon="ni ni-bus-front-12" style="margin-right: 0.5rem"
              :remote-method="remoteMethodUnidadesRecibosProduccion"
              :loading="loadingTableUnidadesRecibosVehiculoProduccion">
              <el-option v-for="item in optionsUnidadesProduccionPagosVehiculo" :key="item.CodiVehi"
                :label="item.CodiVehi" :value="item.CodiVehi">
              </el-option>
            </el-select>

            <!--<el-select v-model="itemRutasIndicadoresCalidad" multiple filterable remote
              placeholder="Operador" prefix-icon="ni ni-bus-front-12" style="margin-right: 0.5rem"
              :remote-method="remoteMethodUnidadesRecibosProduccion"
              :loading="loadingTableUnidadesRecibosVehiculoProduccion">
              <el-option v-for="item in optionsCobradoresProduccionPagosVehiculo" :key="item.CodiVehi"
                :label="item.CodiVehi" :value="item.CodiVehi">
              </el-option>
            </el-select>-->




            <base-input addon-left-icon="ni ni-calendar-grid-58" style="margin-right: 0.5rem">
              <flat-picker slot-scope="{ focus, blur }" @on-open="focus" @on-close="blur" :config="{ allowInput: true }"
                class="form-controlPersonal datepicker" v-model="fechaInicialIndicadorCalidad">
              </flat-picker>
            </base-input>

            <base-input addon-left-icon="ni ni-calendar-grid-58">
              <flat-picker slot-scope="{ focus, blur }" @on-open="focus" @on-close="blur" :config="{ allowInput: true }"
                class="form-controlPersonal datepicker" v-model="fechaFinalIndicadorCalidad">
              </flat-picker>
            </base-input>

            <!-- DOWNLOAD EXCEL-->



          </div>

          <div class="cardSelectRubrosEstadosPagosVehiculoProduccionContainer">
            <base-button icon type="primary" @click="readAllIndicadoresCalidad()">
              <span class="btn-inner--icon"><i class="el-icon-search"></i></span>
              <span class="btn-inner--text">Buscar</span>
            </base-button>

            <!--<base-button outline type="success">
              <span class="btn-inner--icon"
                ><i class="ni ni-collection"></i
              ></span>
              <span class="btn-inner--text"> Exportar Excel</span>
            </base-button>-->
          </div>
        </card>

        <card class="no-border-card col" style="margin-bottom: 0.5rem"
          body-classes="px-0 pb-1 card-bodyTopOpcionesRPagosVehiculoPRoduccion cardSelectRubrosEstadosPagosVehiculoProduccionContainer"
          footer-classes="pb-2">
          <div class="cardSelectRubrosEstadosRPagosVehiculoProduccion">
            <!--<el-radio v-model="radioEstadoRPagosVehiculoRecibo" label="*"
              >TODOS</el-radio
            >
            <el-radio v-model="radioEstadoRPagosVehiculoRecibo" label="2"
              >PAGADOS</el-radio
            >
            <el-radio v-model="radioEstadoRPagosVehiculoRecibo" label="1"
              >ANULADOS</el-radio
            >-->

            <el-select style="margin-right: 0.5rem;" collapse-tags v-model="itemRutasIndicadoresCalidad" multiple
              placeholder="Rutas">
              <el-option v-for="item in mListaRutasIndicadoresCalidad" :key="item.LetrRuta" :label="item.DescRuta"
                :value="item.idRuta">
              </el-option>
            </el-select>

          </div>

          <div class="cardTextoRPagosVehiculoProduccion">

          </div>
        </card>


        <card class="no-border-card" style="margin-bottom: 0rem"
          body-classes="card-bodyRPagosVehiculoReciboProduccion px-0 pb-1" footer-classes="pb-2">
          <div>
            <iframe :src="oBase64IndicadoresCalidad" style="width: 100%; height: 35.5rem"></iframe>
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
import swal from "sweetalert2";
import Tabs from "@/components/argon-core/Tabs/Tabs";
import TabPane from "@/components/argon-core/Tabs/Tab";

export default {
  mixins: [clientPaginationMixin],
  layout: "DashboardLayoutMovilidad",
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
  },
  data() {
    return {
      mListaUnidadesPagosVehiculoProduccionRecibo: [],
      mListaRutasIndicadoresCalidad: [],
      tableDataRPagosVEhiculoProduccionRecibo: [],
      itemUnidadProduccionRPagoVehiculorecibo: [],
      itemRutasIndicadoresCalidad: [],
      token: this.$cookies.get("token"),
      fechaInicialIndicadorCalidad: "",
      fechaFinalIndicadorCalidad: "",
      loadingRPagosVehiculoRecibo: false,
      Base64PdfRECIBOPDFPRODUCCION: "",
      tableDataDetalleReciboPAgoVehiculoProduccion: [],
      optionsUnidadesProduccionPagosVehiculo: [],
      optionsCobradoresProduccionPagosVehiculo: [],
      loadingTableUnidadesRecibosVehiculoProduccion: false,
      loadingTableCobradoresRecibosVehiculoProduccion: false,
      baseURlPDFPanelDetalleRecibo: '',
      oBase64IndicadoresCalidad: ""
    }
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

      this.fechaInicialIndicadorCalidad = format;
      this.fechaFinalIndicadorCalidad = format;
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
      this.mListaRutasIndicadoresCalidad = []

      var datos = await this.$axios.post(process.env.baseUrl + "/rutes", {
        token: this.token,
        tipo: 1
      });

      if (datos.data.status_code == 200) {
        this.mListaRutasIndicadoresCalidad.push(...datos.data.data)
      }
    },
    async readAllIndicadoresCalidad() {

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

      this.oBase64IndicadoresCalidad = ""

      try {
        var rutasString = []
        if (this.itemRutasIndicadoresCalidad.length <= 0) {
          rutasString.push("Todas las rutas")
        } else {
          for (var j = 0; j < this.itemRutasIndicadoresCalidad.length; j++) {
            for (var i = 0; i < this.mListaRutasIndicadoresCalidad.length; i++) {
              if (this.mListaRutasIndicadoresCalidad[i].idRuta == this.itemRutasIndicadoresCalidad[j]) {
                rutasString.push(this.mListaRutasIndicadoresCalidad[i].DescRuta)
              }
            }
          }
        }



        var datos = await this.$axios.post(process.env.baseUrl + "/IndicadoresCalidad", {
          token: this.token,
          unidades: this.itemUnidadProduccionRPagoVehiculorecibo.length <= 0 ? "*" : this.itemUnidadProduccionRPagoVehiculorecibo,
          rutas: this.itemRutasIndicadoresCalidad.length <= 0 ? "*" : this.itemRutasIndicadoresCalidad,
          fechaI: this.fechaInicialIndicadorCalidad,
          fechaF: this.fechaFinalIndicadorCalidad,
          rutasString: rutasString,
          nameEmpresa: this.$cookies.get("nameEmpresa"),
          usuarioName: this.$cookies.get("namesUsuario")
        },{
          'Content-Type': 'application/json'
        })

        //console.log(datos)

        if (datos.data.status_code == 200) {
          this.oBase64IndicadoresCalidad = "data:application/pdf;base64," + datos.data.datos
        }
      } catch (error) {
        console.log(error)
        Notification.error({
          title: "ERROR",
          message: error.toString(),
          duration: 2500,
        });
      }

      swal.close()

    },

  },
  mounted() {
    this.readAllRutasIndicadoresCalidad()
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
  align-items: center;
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

.card-bodyRPagosVehiculoReciboProduccion {
  padding: 0rem !important;
  height: calc(100vh - 13rem);
  overflow: auto;
}

.card-bodyTopOpcionesRPagosVehiculoPRoduccion {
  padding-top: 0.25rem !important;
}
</style>
