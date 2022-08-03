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

            <!--<el-select v-model="itemCobradoresProduccionRPagoVehiculorecibo" multiple filterable remote
              placeholder="Operador" prefix-icon="ni ni-bus-front-12" style="margin-right: 0.5rem"
              :remote-method="remoteMethodUnidadesRecibosProduccion"
              :loading="loadingTableUnidadesRecibosVehiculoProduccion">
              <el-option v-for="item in optionsCobradoresProduccionPagosVehiculo" :key="item.CodiVehi"
                :label="item.CodiVehi" :value="item.CodiVehi">
              </el-option>
            </el-select>-->

            <el-select style="margin-right: 0.5rem;" v-model="itemCobradoresProduccionRPagoVehiculorecibo" multiple placeholder="Operador">
              <el-option v-for="item in mListaCobradoresPagosVehiculoProduccionRecibo" :key="item.CodiUsua"
                :label="item.NombApellUsua" :value="item.CodiUsua">
              </el-option>
            </el-select>


            <base-input addon-left-icon="ni ni-calendar-grid-58" style="margin-right: 0.5rem">
              <flat-picker slot-scope="{ focus, blur }" @on-open="focus" @on-close="blur" :config="{ allowInput: true }"
                class="form-controlPersonal datepicker" v-model="fechaInicialRPagosVehiculoProduccionRecibo">
              </flat-picker>
            </base-input>

            <base-input addon-left-icon="ni ni-calendar-grid-58">
              <flat-picker slot-scope="{ focus, blur }" @on-open="focus" @on-close="blur" :config="{ allowInput: true }"
                class="form-controlPersonal datepicker" v-model="fechaFinalRPagosVehiculoProduccionRecibo">
              </flat-picker>
            </base-input>
          </div>

          <div class="cardSelectRubrosEstadosPagosVehiculoProduccionContainer">
            <base-button icon type="primary" @click="readAllRPagosVehiculoProduccionRecibos()">
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
          </div>

          <div class="cardTextoRPagosVehiculoProduccion">
            <strong style="color: green; margin-right: 0.5rem">Dinero Recaudado : {{ mPagadoRPagosVehiculoRecibo }}
              $</strong>
            <!--<strong style="color: red; margin-right: 0.5rem"
              >Dinero Anulado : {{ mAnuladoRPagosVehiculoRecibo }} $</strong
            >-->
          </div>
        </card>

        <card class="no-border-card" style="margin-bottom: 0rem"
          body-classes="card-bodyRPagosVehiculoReciboProduccion px-0 pb-1" footer-classes="pb-2">
          <div>
            <el-table v-loading="loadingRPagosVehiculoRecibo" element-loading-text="Cargando Datos..."
              element-loading-spinner="el-icon-loading" :data="tableDataRPagosVEhiculoProduccionRecibo" row-key="id"
              :height="tableDataRPagosVEhiculoProduccionRecibo.length > 0 ? 455 : 150" style="width: 100%"
              :default-sort="{ prop: 'estado', order: 'descending' }" class="tablePanelControlProduccion"
              header-row-class-name="thead-dark" :row-class-name="tableRowClassNameRPagosVehiculoProduccionRecibo">
              <el-table-column prop="numero_cobro" label="N° Recibo" minWidth="100">
              </el-table-column>

              <el-table-column prop="fecha_cobro" label="Fecha de Cobro" minWidth="170">
              </el-table-column>

              <el-table-column prop="Unidad" label="Unidad" minWidth="100">
              </el-table-column>
              <el-table-column prop="NombApellUsua" label="Atención" minWidth="200">
              </el-table-column>

              <el-table-column prop="DeudaTotal" label="Total ($)" minWidth="100">
              </el-table-column>

              <!--<el-table-column
                prop="estado"
                label="Estado"
                minWidth="120"
                sortable
              >
              <template slot-scope="scope">
                {{scope.row.estado == 1 ? "PAGADO" : "ANULADO"}}
              </template>
              </el-table-column>-->

              <el-table-column label="Acciones" width="140">
                <template slot-scope="scope">
                  <el-button type="primary" @click="
                    readAllDetalleReciboPagosVehiculoProduccion(
                      scope.$index,
                      scope.row
                    )
                  " size="small">
                    Ver Detalle
                  </el-button>
                </template>
              </el-table-column>

              <div slot="empty"></div>
            </el-table>
          </div>
        </card>
      </div>
    </base-header>

    <!--Form modal-->
    <modal :show.sync="modalsReciboProduccion" size="sm" body-classes="p-0">
      <card type="secondary" header-classes="bg-transparent pb-5" class="border-0 mb-0">
        <iframe :src="baseURlPDFPanelDetalleRecibo" style="width: 100%; height: 33rem"></iframe>
      </card>
    </modal>


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
  layout: "ProduccionDashboardLayout",
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
      mListaCobradoresPagosVehiculoProduccionRecibo: [],
      tableDataRPagosVEhiculoProduccionRecibo: [],
      radioEstadoRPagosVehiculoRecibo: "*",
      itemUnidadProduccionRPagoVehiculorecibo: [],
      itemCobradoresProduccionRPagoVehiculorecibo: [],
      token: this.$cookies.get("token"),
      fechaInicialRPagosVehiculoProduccionRecibo: "",
      fechaFinalRPagosVehiculoProduccionRecibo: "",
      loadingRPagosVehiculoRecibo: false,
      Base64PdfRECIBOPDFPRODUCCION: "",
      mPagadoRPagosVehiculoRecibo: "0.00",
      mAnuladoRPagosVehiculoRecibo: "0.00",
      modalsReciboProduccion: false,
      tableDataDetalleReciboPAgoVehiculoProduccion: [],
      itemModalIdReciboPagoVehiculoProduccion: "",
      itemModalUnidadReciboPagoVehiculoProduccion: "",
      itemModalTotalReciboPagoVehiculoProduccion: "",
      optionsUnidadesProduccionPagosVehiculo: [],
      optionsCobradoresProduccionPagosVehiculo: [],
      loadingTableUnidadesRecibosVehiculoProduccion: false,
      loadingTableCobradoresRecibosVehiculoProduccion: false,
      baseURlPDFPanelDetalleRecibo: '',
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
    tableRowClassNameRPagosVehiculoProduccionRecibo({ row, rowIndex }) {
      if (row.estado == 0) {
        //row.estado = "ANULADO";
        return "warning-row-panelControlProduccion";
      } else if (row.estado == 1) {
        //row.estado = "PAGADO";
        return "success-row-panelControlProduccion";
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

      this.fechaInicialRPagosVehiculoProduccionRecibo = format;
      this.fechaFinalRPagosVehiculoProduccionRecibo = format;
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
    async readAllCobradoresPagosVehiculoProduccionRecibo() 
    {
      this.mListaCobradoresPagosVehiculoProduccionRecibo = []

      var datos = await this.$axios.post(process.env.baseUrl + "/readallCobradores", {
        token: this.token,
      });

      if (datos.data.status_code == 200) 
      {
        this.mListaCobradoresPagosVehiculoProduccionRecibo.push(...datos.data.data)
      }
    },
    async readAllRPagosVehiculoProduccionRecibos() {
      this.mPagadoRPagosVehiculoRecibo = "0.00"
      this.mAnuladoRPagosVehiculoRecibo = "0.00"

      if (this.loadingRPagosVehiculoRecibo) {
        Notification.warning({
          title: "Reporte Pagos Vehiculo",
          message: "Por favor espere un momento.",
          duration: 3500,
        });
      } else {
        try {
          this.loadingRPagosVehiculoRecibo = true;
          this.tableDataRPagosVEhiculoProduccionRecibo = [];
          var body = {
            token: this.token,
            unidades: this.itemUnidadProduccionRPagoVehiculorecibo.length <= 0 ? "*" : this.itemUnidadProduccionRPagoVehiculorecibo,
            fechaI: this.fechaInicialRPagosVehiculoProduccionRecibo,
            fechaF: this.fechaFinalRPagosVehiculoProduccionRecibo,
            operadores: this.itemCobradoresProduccionRPagoVehiculorecibo.length <= 0 ? "*" : this.itemCobradoresProduccionRPagoVehiculorecibo 
          };
          console.log(body);
          var datos = await this.$axios.post(
            process.env.baseUrl + "/ProduccionRecibosPagosVehiculo",
            body
          );

          if (datos.data.status_code == 200) {
            Notification.success({
              title: "Reporte Pagos Vehiculo",
              message: "Datos consultados con éxito.",
              duration: 2500,
            });
            var anulado = 0;
            var pagado = 0;

            this.tableDataRPagosVEhiculoProduccionRecibo.push(
              ...datos.data.datos
            );
            for (var i = 0; i < datos.data.datos.length; i++) {
              pagado = pagado + parseFloat(datos.data.datos[i].DeudaTotal)
            }

            this.mPagadoRPagosVehiculoRecibo = Number(pagado).toFixed(2)
            this.mAnuladoRPagosVehiculoRecibo = Number(anulado).toFixed(2)

            this.loadingRPagosVehiculoRecibo = false;
          } else if (datos.data.status_code == 300) {
            this.loadingRPagosVehiculoRecibo = false;
            Notification.info({
              title: "Reporte Pagos Vehiculo",
              message: "No existen datos disponibles",
              duration: 2500,
            });
          } else {
            Notification.error({
              title: "API ERROR Reporte Pagos Vehiculo",
              message: datos.data.msm,
              duration: 2500,
            });
          }
        } catch (error) {
          Notification.error({
            title: "ERROR CATCH Reporte Pagos Vehiculo",
            message: error.toString(),
            duration: 2500,
          });
        }
        this.loadingRPagosVehiculoRecibo = false;
      }
    },
    async readAllDetalleReciboPagosVehiculoProduccion(index, item) {
      this.modalsReciboProduccion = true;
      try {
        var datos = await this.$axios.post(
          process.env.baseUrl + "/ProduccionDetalleRecibosPagosVehiculo",
          {
            token: this.token,
            recibo: item.numero_cobro,
            nameEmpresa: this.$cookies.get('nameEmpresa'),
            unidad: item.Unidad,
            fechaPago: item.fecha_cobro,
          }
        );

        this.baseURlPDFPanelDetalleRecibo = "data:application/pdf;base64," + datos.data.datos
      } catch (error) {
        Notification.error({
          title: "ERROR CATCH Reporte Pagos Vehiculo",
          message: error.toString(),
          duration: 2500,
        });
      }
    },
  },
  mounted() {
    this.readAllCobradoresPagosVehiculoProduccionRecibo()
    this.readAllUnidadesPagosVehiculoProduccionRecibo();
    this.initFechaActualProduccionRPAgosVehiculoRecibo();
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
  height: calc(100vh - 12rem);
  overflow: auto;
}

.card-bodyTopOpcionesRPagosVehiculoPRoduccion {
  padding-top: 0.25rem !important;
}
</style>
