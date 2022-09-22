<template>
  <div class="content">
    <base-header>
      <div class="align-items-center py-3">
        <card class="no-border-card col" style="margin-bottom: 0.5rem"
          body-classes="px-0 pb-1 card-bodyTopOpcionesRPagosVehiculoPRoduccion cardSelectRubrosEstadosPagosVehiculoProduccionContainer"
          footer-classes="pb-2">
          <div class="cardTextoRPagosVehiculoProduccion">

            <el-select v-model="itemUnidadProduccionResumidoVehiculos" multiple filterable style="margin-right: 0.5rem"
              remote placeholder="Ingrese unidad" :remote-method="remoteMethodUnidadesPanelResumidosVehiculo"
              :loading="loadingTableUnidadesPanelResumidoVehiculosLoading">
              <el-option v-for="item in optionsUnidadesPanelProduccionResumidoVehiculos" :key="item.CodiVehi"
                :label="item.CodiVehi" :value="item.CodiVehi">
              </el-option>
            </el-select>

            <base-input addon-left-icon="ni ni-calendar-grid-58" style="margin-right: 0.5rem">
              <flat-picker slot-scope="{ focus, blur }" @on-open="focus" @on-close="blur" :config="{ allowInput: true }"
                class="form-controlPersonal datepicker" v-model="fechaInicialRPagosVehiculoProduccion">
              </flat-picker>
            </base-input>

            <base-input addon-left-icon="ni ni-calendar-grid-58">
              <flat-picker slot-scope="{ focus, blur }" @on-open="focus" @on-close="blur" :config="{ allowInput: true }"
                class="form-controlPersonal datepicker" v-model="fechaFinalRPagosVehiculoProduccion">
              </flat-picker>
            </base-input>
          </div>

          <div class="cardSelectRubrosEstadosPagosVehiculoProduccionContainer">
            <base-button icon type="primary" @click="readAllRPagosVehiculoProduccion()">
              <span class="btn-inner--icon"><i class="el-icon-search"></i></span>
              <span class="btn-inner--text">Buscar</span>
            </base-button>
            <download-excel class="btn btn-outline-success" outline :header="headerExcelRPagosVehiculoProduccion"
              :data="tableDataResumidoVehiculos" :fields="json_fields_excelRPagosVehiculoProduccion"
              :worksheet="WorksheetExcelRPagosVehiculoProduccion" :name="FileNameExcelRPagosVehiculoProduccion">
              <span class="btn-inner--icon"><i class="ni ni-collection"></i></span>
              <span class="btn-inner--text"> Exportar Excel</span>
            </download-excel>
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
            <!--<el-select
              v-model="mSelectRubroValuePagosVehiculo"
              multiple
              collapse-tags
              placeholder="Rubros"
            >
              <el-option
                v-for="item in mListRubrosRPagosVehiculo"
                :key="item.id"
                :label="item.descripcion"
                :value="item.id"
              >
              </el-option>
            </el-select>-->

            <el-radio v-model="radioEstadoRPagosVehiculo" label="*">TODOS</el-radio>
            <el-radio v-model="radioEstadoRPagosVehiculo" label="2">PAGADOS</el-radio>
            <el-radio v-model="radioEstadoRPagosVehiculo" label="1">PENDIENTES</el-radio>
          </div>

          <div class="cardTextoRPagosVehiculoProduccion">
            <strong style="color: green; margin-right: 0.5rem">Recaudado : {{ mPagadoRPagosVehiculo }} $</strong>
            <strong style="color: blue; margin-right: 0.5rem">Pendiente : {{ mPendienteRPagosVehiculo }} $</strong>
            <strong style="color: drak">Total : {{ mTotalRPagosVehiculo }} $</strong>
          </div>
        </card>

        <card class="no-border-card" style="margin-bottom: 0rem" body-classes="card-bodyResumidoVehiculos px-0 pb-1"
          footer-classes="pb-2">
          <div>
            <el-table v-loading="loadingRPagosVehiculo" element-loading-text="Cargando Datos..."
              :data="tableDataResumidoVehiculos" row-key="id"
              class="tablePanelControlProduccion" header-row-class-name="thead-dark"
              :row-class-name="tableRowClassNameRPagosVehiculoProduccion"
              height="calc(100vh - 12rem)" style="width: 100%">


              <el-table-column label="Acciones" minWidth="140">
                <template slot-scope="scope">
                  <base-button size="sm" type="primary" @click="showModalDetalleResumidoVehiculo(scope.row)">
                    <span class="btn-inner--text">Detalle</span>
                  </base-button>
                </template>
              </el-table-column>

              <el-table-column prop="Unidad" label="Unidad" minWidth="110">
              </el-table-column>

              <!--<el-table-column prop="Fecha" label="F. Creación" minWidth="140">
              </el-table-column>-->

              <el-table-column prop="DeudaTotal" sortable label="Total ($)" minWidth="150">

                <template slot-scope="scope">
                  <strong style="color:black">{{ scope.row.DeudaTotal }}</strong>
                </template>


              </el-table-column>

              <el-table-column prop="fecha_cobro" label="F. Pago" minWidth="180">
              </el-table-column>
              <el-table-column prop="AtrasoFTiempo" label="Atrasos Falta" minWidth="160">
              </el-table-column>
              <el-table-column prop="AtrasoJTiempo" label="Atrasos Just" minWidth="150">
              </el-table-column>

              <el-table-column prop="AtrasoPenalidad" label="Atrasos ($)" minWidth="140">
              </el-table-column>

              <el-table-column prop="AdelantoFTiempo" label="Adelantos Falta" minWidth="170">
              </el-table-column>
              <el-table-column prop="AdelantoJTiempo" label="Adelantos Just" minWidth="160">
              </el-table-column>

              <el-table-column prop="AdelantoPenalidad" label="Adelantos ($)" minWidth="150">
              </el-table-column>

              <el-table-column prop="RubroFalta" label="Rubros Falta" minWidth="150">
              </el-table-column>

              <el-table-column prop="RubroJustificacion" label="Rubros Just" minWidth="140">
              </el-table-column>

              <el-table-column prop="RubroPenalidad" label="Rubros ($)" minWidth="130">
              </el-table-column>

              <el-table-column prop="VelocidadFalta" label="Ex Velo. Falta" minWidth="150">
              </el-table-column>



              <el-table-column prop="VelocidadJustificacion" label="Ex Velo. Just" minWidth="150">
              </el-table-column>


              <el-table-column prop="VelocidadPenalidad" label="Ex Velo. ($)" minWidth="140">
              </el-table-column>

              <el-table-column prop="TarjetaDiaria" label="Tarjeta ($)" minWidth="140">
              </el-table-column>







              <el-table-column prop="estado" label="Estado" minWidth="130" sortable="true">
              </el-table-column>

              <div slot="empty"></div>
            </el-table>
          </div>
        </card>
      </div>
    </base-header>


    <!--Classic modal-->
    <modal :show.sync="isModalDetalleResumidoVehiculo" size="xl">
      <h6 slot="header" class="modal-title">{{titleModalResumidoVehiculos}}</h6>
      <el-table v-loading="loadingDetalleResumidoVehiculos" element-loading-text="Cargando Datos..."
        element-loading-spinner="el-icon-loading" :data="tableDataDetalleResumidoVehiculos" row-key="id"
        header-row-class-name="thead-dark" :height="tableDataDetalleResumidoVehiculos.length > 0 ? 350 : 150"
        style="width: 100%">

        <el-table-column prop="Unidad" label="Unidad" minWidth="110">
        </el-table-column>

        <el-table-column prop="DescripcionControl" label="Descripcion" minWidth="240">
        </el-table-column>

        <el-table-column prop="Programado" label="Prog" minWidth="170">
        </el-table-column>

        <el-table-column prop="Marcado" label="Marc" minWidth="100">
        </el-table-column>
        <el-table-column prop="AdelantoFTiempo" label="Adelanto F." minWidth="120">
        </el-table-column>
        <el-table-column prop="AdelantoJTiempo" label="Adelanto J." minWidth="120">
        </el-table-column>

        <el-table-column prop="AtrasoFTiempo" label="Atraso F." minWidth="100">
        </el-table-column>

        <el-table-column prop="AtrasoJTiempo" label="Atraso J" minWidth="100">
        </el-table-column>
        <el-table-column prop="VelocidadFalta" label="Velo. F" minWidth="80">
        </el-table-column>
        <el-table-column prop="VelocidadJustificacion" label="Velo. J" minWidth="80">
        </el-table-column>

        <el-table-column prop="RubroFalta" label="Rubro F." minWidth="80">
        </el-table-column>

        <el-table-column prop="RubroJustificacion" label="Rubro J." minWidth="80">
        </el-table-column>

        <el-table-column prop="TarjetaTrabajo" label="Tarjeta Trabajo" minWidth="140">
        </el-table-column>

        <el-table-column prop="FechaJustifica" label="Fecha J." minWidth="160">
        </el-table-column>
        <el-table-column prop="NombApellUsua" label="Nombres" minWidth="170">
        </el-table-column>

        <el-table-column prop="Motivo" label="Motivo" minWidth="170">
        </el-table-column>

        <el-table-column prop="Notas" label="Notas" minWidth="170">
        </el-table-column>




        <div slot="empty"></div>
      </el-table>
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
  },
  data() {
    return {
      mListaUnidadesResumidoVehiculos: [],
      tableDataResumidoVehiculos: [],
      tableDataDetalleResumidoVehiculos: [],
      radioEstadoRPagosVehiculo: "*",
      mListRubrosRPagosVehiculo: [],
      mSelectRubroValuePagosVehiculo: [],
      itemUnidadProduccionResumidoVehiculos: "",
      token: this.$cookies.get("token"),
      loadingTableUnidadesPanelResumidoVehiculosLoading: false,
      fechaInicialRPagosVehiculoProduccion: "",
      fechaFinalRPagosVehiculoProduccion: "",
      loadingRPagosVehiculo: false,
      mTotalRPagosVehiculo: "0.00",
      mPagadoRPagosVehiculo: "0.00",
      mPendienteRPagosVehiculo: "0.00",
      WorksheetExcelRPagosVehiculoProduccion: "",
      FileNameExcelRPagosVehiculoProduccion: "",
      optionsUnidadesPanelProduccionResumidoVehiculos: [],
      headerExcelRPagosVehiculoProduccion: [],
      isModalDetalleResumidoVehiculo: false,
      loadingDetalleResumidoVehiculos: false,
      titleModalResumidoVehiculos:'',
      json_fields_excelRPagosVehiculoProduccion: {
        "Unidad": "Unidad",
        "Fecha Creación": "Fecha",
        "Fecha Pago": "fecha_cobro",
        "Atrasos Falta": "AtrasoFTiempo",
        "Atrasos Justificados": "AtrasoJTiempo",
        "Atrasos ($)": "AtrasoPenalidad",
        "Adelantos Falta": "AdelantoFTiempo",
        "Adelantos Justificados": "AdelantoJTiempo",
        "Adelantos ($)": "AdelantoPenalidad",
        "Rubros Falta": "RubroFalta",
        "Rubros Justificados": "RubroJustificacion",
        "Rubros ($)": "RubroPenalidad",
        "Ex Velo. Falta": "VelocidadFalta",
        "Ex Velo. Just": "VelocidadJustificacion",
        "Ex Velo. ($)": "VelocidadPenalidad",
        "Tarjeta ($)": "TarjetaDiaria",
        "Total ($)": "DeudaTotal",
        "Estado": "estado",
      },
    };
  },
  methods: {
    async showModalDetalleResumidoVehiculo(item) {
      this.isModalDetalleResumidoVehiculo = true
      this.tableDataDetalleResumidoVehiculos = []
      this.loadingDetalleResumidoVehiculos = true
      //console.log(item)
      try {
        this.titleModalResumidoVehiculos = "Unidad : "+item.Unidad+" Deuda Total ($) : "+item.DeudaTotal
        var datos = await this.$axios.post(process.env.baseUrl + "/ProduccionDetalleResumidoVehiculos", {
          token: this.token,
          unidad: item.Unidad,
          fechaI: item.fechaIB,
          fechaF: item.fechaFB,
          estadoCobro: item.EstadoCobro
        })

        //console.log(datos.data.datos)

        this.tableDataDetalleResumidoVehiculos.push(...datos.data.datos)

      } catch (error) {
        console.log(error)
      }


      this.loadingDetalleResumidoVehiculos = false
    },
    remoteMethodUnidadesPanelResumidosVehiculo(query) {
      if (query !== "") {
        this.loadingTableUnidadesPanelResumidoVehiculosLoading = true;
        setTimeout(() => {
          this.loadingTableUnidadesPanelResumidoVehiculosLoading = false;
          this.optionsUnidadesPanelProduccionResumidoVehiculos =
            this.mListaUnidadesResumidoVehiculos.filter((item) => {
              return (
                item.CodiVehi.toLowerCase().indexOf(query.toLowerCase()) > -1
              );
            });
        }, 200);
      } else {
        this.optionsUnidadesPanelProduccionResumidoVehiculos = [];
      }
    },
    handleSelectUnidadProduccionRPagoVehiculo(item) {
      console.log(item);
    },
    tableRowClassNameRPagosVehiculoProduccion({ row, rowIndex }) {
      if (row.EstadoCobro == 0) {
        row.estado = "PENDIENTE";
        return "warning-row-panelControlProduccion";
      }else {
        row.estado = "PAGADO";
        return "success-row-panelControlProduccion";
      }
    },
    initFechaActualProduccionRPAgosVehiculo() {
      var fecha = new Date();
      var mes = fecha.getMonth() + 1;
      var day = fecha.getDate();
      var format =
        fecha.getFullYear() +
        "-" +
        (mes < 10 ? "0" + mes : mes) +
        "-" +
        (day < 10 ? "0" + day : day);

      this.fechaInicialRPagosVehiculoProduccion = format;
      this.fechaFinalRPagosVehiculoProduccion = format;
    },
    async readAllUnidadesPagosVehiculoProduccion() {
      var datos = await this.$axios.post(process.env.baseUrl + "/unidades", {
        token: this.token,
      });

      //console.log(datos.data);

      if (datos.data.status_code == 200) {
        for (var i = 0; i < datos.data.data.length; i++) {
          this.mListaUnidadesResumidoVehiculos[i] = datos.data.data[i];
          this.mListaUnidadesResumidoVehiculos[i].value =
            datos.data.data[i].CodiVehi;
        }
      }
    },
    /*async readAllRubrosPagosVehiculoProduccion() {
      var datos = await this.$axios.post(
        process.env.baseUrl + "/rubros-activos",
        {
          token: this.token,
        }
      );

      if (datos.data.status_code == 200) {
        this.mListRubrosRPagosVehiculo.push(...datos.data.datos);
      }
    },*/
    async readAllRPagosVehiculoProduccion() {

      this.mTotalRPagosVehiculo = "0.00"
      this.mPagadoRPagosVehiculo = "0.00"
      this.mPendienteRPagosVehiculo = "0.00"

      this.WorksheetExcelRPagosVehiculoProduccion = "RPV_W_" + this.itemUnidadProduccionResumidoVehiculos + "_" + Date.now()
      this.FileNameExcelRPagosVehiculoProduccion = "RPV_" + this.itemUnidadProduccionResumidoVehiculos + "_" + Date.now() + ".xls"

      if (this.loadingRPagosVehiculo) {
        Notification.warning({
          title: "Reporte Pagos Vehiculo",
          message: "Por favor espere un momento.",
          duration: 3500,
        });
      } else {
        try {
          this.loadingRPagosVehiculo = true;
          this.tableDataResumidoVehiculos = [];
          var body = {
            token: this.token,
            unidades: this.itemUnidadProduccionResumidoVehiculos.length <= 0 ? "*" : this.itemUnidadProduccionResumidoVehiculos,
            fechaI: this.fechaInicialRPagosVehiculoProduccion,
            fechaF: this.fechaFinalRPagosVehiculoProduccion,
            tipo: this.radioEstadoRPagosVehiculo
          };
          //console.log(body);
          var datos = await this.$axios.post(
            process.env.baseUrl + "/ProduccionResumidoVehiculos",
            body
          );

          if (datos.data.status_code == 200) {
            /*Notification.success({
              title: "Reporte Pagos Vehiculo",
              message: "Datos consultados con éxito.",
              duration: 2500,
            });*/
            this.CalcularTotalesResumidoVehiculo(datos.data.datos)
            this.tableDataResumidoVehiculos.push(...datos.data.datos);
            
            

            this.loadingRPagosVehiculo = false;
          } else if (datos.data.status_code == 300) {
            this.loadingRPagosVehiculo = false;
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
        this.loadingRPagosVehiculo = false;
      }
    },
    async CalcularTotalesResumidoVehiculo(datos)
    {
      var total = 0;
      var pendiente = 0;
      var pagado = 0;

      for (var i = 0; i < datos.length; i++) {
              if (datos[i].EstadoCobro == 1) {
                pagado = pagado + parseFloat(datos[i].DeudaTotal);
              } else {
                pendiente = pendiente + parseFloat(datos[i].DeudaTotal)
              }
            }

            this.mPagadoRPagosVehiculo = Number(pagado).toFixed(2);
            this.mPendienteRPagosVehiculo = Number(pendiente).toFixed(2);
            this.mTotalRPagosVehiculo = Math.abs(pendiente + pagado).toFixed(2);
            this.headerExcelRPagosVehiculoProduccion = [
              "Reporte Pagos : " + (this.itemUnidadProduccionResumidoVehiculos.length <= 0 ? "TODAS LAS UNIDADES" :
                this.itemUnidadProduccionResumidoVehiculos),
              "Fechas : " + this.fechaInicialRPagosVehiculoProduccion + " hasta " + this.fechaFinalRPagosVehiculoProduccion,
              "Dinero Recaudado : " + this.mPagadoRPagosVehiculo,
              "Dinero Pendiente : " + this.mPendienteRPagosVehiculo,
              "Total : " + this.mTotalRPagosVehiculo,
            ]
    }
  },
  mounted() {
    this.readAllUnidadesPagosVehiculoProduccion();
    this.initFechaActualProduccionRPAgosVehiculo();
    /*this.readAllRubrosPagosVehiculoProduccion();*/
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
  background: rgba(255, 0, 0, 0.199) !important;
}

.el-table .success-row-panelControlProduccion {
  background: #8fed8fbb !important;
}

.no-border-card .card-footer {
  border-top: 0;
}

.card-bodyResumidoVehiculos {
  padding: 0rem !important;
  height: calc(100vh - 12rem);
  overflow: auto;
}

/*.card-bodyResumidoVehiculos::-webkit-scrollbar {
    display: none;
}*/

.card-bodyTopOpcionesRPagosVehiculoPRoduccion {
  padding-top: 0.25rem !important;
}
</style>
