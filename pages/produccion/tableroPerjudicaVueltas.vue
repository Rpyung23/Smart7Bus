<template>
  <div class="content">
    <base-header>
      <div class="align-items-center py-3">
        <card
          class="no-border-card col"
          style="margin-bottom: 0.5rem"
          body-classes="px-0 pb-1 card-bodyTopOpcionesRPagosVehiculoPRoduccion cardSelectTableroPerjudicadoVuelta"
          footer-classes="pb-2"
        >
          <div class="cardTextoRPagosTableroPerjudicado">
            <!--<el-autocomplete class="inline-input" v-model="itemUnidadPanelProduccion"
              :fetch-suggestions="querySearchUnidadProduccionRPagoVehiculo" style="margin-right: 0.5rem"
              placeholder="Unidad" prefix-icon="ni ni-bus-front-12" :trigger-on-focus="false"></el-autocomplete>-->

            <el-select
              v-model="itemUnidadPanelProduccion"
              multiple
              filterable
              style="margin-right: 0.5rem"
              remote
              placeholder="Ingrese unidad"
              :remote-method="remoteMethodUnidadesPanelProduccionJustificacion"
              :loading="loadingTableUnidadesPanelProduccoionLoading"
            >
              <el-option
                v-for="item in optionsUnidadesPanelProduccion"
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
                :max="{ fechaInicialTableroProduccion }"
                @on-open="focus"
                @on-close="blur"
                :config="{ allowInput: true }"
                class="form-controlPersonal datepicker"
                v-model="fechaInicialTableroProduccion"
              >
              </flat-picker>
            </base-input>

            <base-input addon-left-icon="ni ni-calendar-grid-58">
              <flat-picker
                slot-scope="{ focus, blur }"
                @on-open="focus"
                @on-close="blur"
                :config="{ allowInput: true }"
                class="form-controlPersonal datepicker"
                v-model="fechaFinalTableroProduccion"
              >
              </flat-picker>
            </base-input>
          </div>

          <div class="cardSelectTableroPerjudicadoVuelta">
            <div class="buttonCenterEndDerecha">
              <base-button
                icon
                type="primary"
                size="sm"
                v-if="!loadingRTableroProduccionCobranzas"
                @click="readlPanelTableroPerjudicaVuelta()"
              >
                <span class="btn-inner--icon"
                  ><i class="el-icon-search"></i
                ></span>
              </base-button>
            </div>
          </div>
        </card>

        <card
          class="no-border-card col"
          style="margin-bottom: 0.5rem"
          body-classes="px-0 pb-1 card-bodyTopOpcionesRPagosVehiculoPRoduccion cardSelectTableroPerjudicadoVuelta"
          footer-classes="pb-2"
        >
          <div class="cardSelectRubrosEstadosRPagosVehiculoProduccion">
            <!--<el-select v-model="mSelectRubroValueTablero" multiple collapse-tags placeholder="Rubros">
              <el-option v-for="item in mListRubrosTableroProduccion" :key="item.id" :label="item.descripcion"
                :value="item.id">
              </el-option>
            </el-select>-->
            <el-select
              v-model="mSelectLineasValueTablero"
              style="margin-right: 0.5rem"
              multiple
              collapse-tags
              placeholder="Rutas"
            >
              <el-option
                v-for="item in mListLineasTableroProduccion"
                :key="item.LetrRuta"
                :label="item.DescRuta"
                :value="item.idRuta"
              >
              </el-option>
            </el-select>
          </div>

          <div class="cardTextoRPagosTableroPerjudicado">
            <strong style="color: dark; margin-right: 0.5rem"
              >Pendiente : {{ mPendienteRPagosVehiculo }} $</strong
            >
            <strong style="color: green"
              >Total Cobrado:
              {{ mTotalRPagosVehiculo }}
              $</strong
            >
          </div>
        </card>

        <card
          class="no-border-card"
          style="margin-bottom: 0rem"
          body-classes="card-bodyRPagosVehiculoProduccion px-0 pb-1"
          footer-classes="pb-2"
        >
          <el-table
            header-row-class-name="thead-dark"
            v-loading="loadingRTableroProduccionCobranzas"
            element-loading-text="Cargando Datos..."
            :data="tableDataPanelControlProduccion"
            row-key="id"
            class="tablePanelControlProduccion"
            height="calc(100vh - 13.5rem)"
            style="width: 100%"
            @row-click="filaClickeada"
          >
            <el-table-column prop="Estado" label="Estado" minWidth="75">
              <template slot-scope="scope">
                <badge type="default" class="mr-2" v-if="scope.row.Estado == 2"
                  >Pagado</badge
                >
                <badge type="danger" class="mr-2" v-if="scope.row.Estado == 0"
                  >Pendiente</badge
                >
              </template>
            </el-table-column>

            <el-table-column prop="CodiVehiSali_m" label="Unidad" minWidth="80">
            </el-table-column>

            <el-table-column prop="CodiVehi_p" label="Unidad P." minWidth="90">
            </el-table-column>

            <el-table-column prop="NumeVuelSali_m" label="Vuelta" minWidth="80">
            </el-table-column>

            <el-table-column
              prop="DescRuta"
              label="Ruta - Linea"
              minWidth="110"
            >
            </el-table-column>

            <el-table-column
              prop="HoraSaliProgSali_m"
              label="Fecha"
              minWidth="80"
            >
            </el-table-column>

            <el-table-column prop="HoraProgSali_d" label="PROG" minWidth="80">
            </el-table-column>

            <el-table-column prop="HoraMarcSali_d" label="MARC" minWidth="80">
            </el-table-column>

            <el-table-column prop="AtrasoTiempo" label="TIEMPO" minWidth="80">
            </el-table-column>

            <el-table-column
              prop="AtrasoPenalidad"
              label="Total($)"
              minWidth="85"
            >
              <template slot-scope="scope">
                <strong style="color: black">{{
                  scope.row.AtrasoPenalidad
                }}</strong>
              </template>
            </el-table-column>

            <div slot="empty"></div>
          </el-table>
        </card>
      </div>
    </base-header>

    <!--Classic modal-->
    <modal
      :show.sync="isModalDetallePerjuicio"
      :size="datamodal.Estado != 2 ? 'lg' : 'sm'"
    >
      <template slot="header">
        <div>
          <div style="display: flex; align-items: center">
            <span class="cabeceraModal"> Unidad: </span>
            <span style="color: black"> {{ datamodal.CodiVehiSali_m }}</span>
            <span class="cabeceraModal"> Ruta: </span>
            <span style="color: black"> {{ datamodal.DescRuta }}</span>
          </div>

          <div style="display: flex; align-items: center">
            <span class="cabeceraModal"> Fecha: </span>
            <span style="color: black">
              {{ datamodal.HoraSaliProgSali_m, }}
            </span>
            <span style="padding-right: 5px"></span>
            <span style="color: black"> {{ datamodal.HoraProgSali_d }}</span>
          </div>
        </div>
      </template>

      <div class="container-model">
        <div class="container-datos">
          <div v-if="datamodal.Estado != 2">
            <p class="tituloModal">INFORMACIÓN GENERAL</p>
            <span
              title="Unidad"
              class="subtituloModal"
              style="padding-right: 14px"
              >Unidad:
            </span>
            <span style="color: black">
              {{ datamodal.CodiVehiSali_m }} <br
            /></span>
            <span
              title="Falta"
              class="subtituloModal"
              style="padding-right: 28px"
              >Falta:
            </span>
            <span style="color: black">
              {{ datamodal.AtrasoNumero }} <br
            /></span>
            <span
              title="Tiempo"
              class="subtituloModal"
              style="padding-right: 10px"
              >Tiempo:
            </span>
            <span style="color: black">
              {{ datamodal.AtrasoTiempo }}<br
            /></span>
            <span
              title="Valor"
              class="subtituloModal"
              style="padding-right: 25px"
              >Valor:
            </span>
            <span style="color: black">
              {{ datamodal.AtrasoPenalidad }} <br
            /></span>
            <p class="tituloModal">PERJUDICADO<br /></p>
            <div style="display: flex; align-items: center">
              <el-select
                v-model="inputUnidad"
                filterable
                style="width: 100%; margin-right: 0.5rem"
                remote
                @change="crearPreviewReciboPerjudicado()"
                placeholder="Ingrese unidad"
                :remote-method="
                  remoteMethodUnidadesPanelProduccionJustificacion
                "
                :loading="loadingTableUnidadesPanelProduccoionLoading"
              >
                <el-option
                  v-for="item in optionsUnidadesPanelProduccion"
                  :key="item.CodiVehi"
                  :label="item.CodiVehi"
                  :value="item.CodiVehi"
                >
                </el-option>
              </el-select>
            </div>

            <p class="tituloModal">MOTIVO<br /></p>
            <textarea
              type="text"
              style="width: 100%"
              rows="2"
              cols="45"
              v-model="inputMotivo"
            ></textarea>
          </div>

          <div v-if="datamodal.Estado === 2">
            <p class="tituloModal">PERJUDICADO<br /></p>
            <div style="display: flex; align-items: center">
              <span class="subtituloModal" style="padding-right: 12px">
                Unidad:
              </span>
              <span style="color: black"> {{ datamodal.CodiVehi_p }}</span>
            </div>
            <p class="tituloModal">INFORMACIÓN GENERAL</p>
            <span
              title="Unidad"
              class="subtituloModal"
              style="padding-right: 14px"
              >Unidad:
            </span>
            <span style="color: black">
              {{ datamodal.CodiVehiSali_m }} <br
            /></span>
            <span
              title="Falta"
              class="subtituloModal"
              style="padding-right: 28px"
              >Falta:
            </span>
            <span style="color: black">
              {{ datamodal.AtrasoNumero }} <br
            /></span>
            <span
              title="Tiempo"
              class="subtituloModal"
              style="padding-right: 10px"
              >Tiempo:
            </span>
            <span style="color: black">
              {{ datamodal.AtrasoTiempo }}<br
            /></span>
            <span
              title="Valor"
              class="subtituloModal"
              style="padding-right: 25px"
              >Valor:
            </span>
            <span style="color: black">
              {{ datamodal.AtrasoPenalidad }} <br
            /></span>
          </div>
        </div>

        <div class="container-ticket" v-if="datamodal.Estado != 2">
          <iframe
            :src="baseURlPDFComprobantePerjudicado"
            style="
              width: 100%;
              padding: 0rem;
              border-width: 0rem;
              height: calc(50vh);
            "
          ></iframe>
        </div>
      </div>

      <template slot="footer">
        <div class="centerButton">
          <base-button
            size="sm"
            title="JUSTIFICAR"
            type="primary"
            v-show="datamodal.Estado == 0"
            @click="enviarJustificacion()"
            ><i class="ni ni-check-bold"></i>JUSTIFICAR</base-button
          >
          <base-button
            size="sm"
            title="PAGAR"
            type="default"
            v-show="datamodal.Estado != 2"
            @click="enviarPago()"
            ><i class="ni ni-money-coins">PAGAR</i></base-button
          >
          <base-button
            size="sm"
            title="DEVOLVER"
            type="danger"
            v-show="datamodal.Estado == 2"
            @click="enviarDevolucion()"
            >DEVOLVER<i class="ni ni-fat-delete"></i
          ></base-button>
        </div>
      </template>
    </modal>

    <!-- Modal ComprobantePago -->
    <!--modal :show.sync="isModalDetallePago" size="sm">
      <template slot="header">
        <div style="width: 100%;">
          <div style="display: flex; align-items: center; justify-content: center;">
            <p class="cabeceraModal" style="margin-bottom: 0px;">
              Comprobante de Pago
            </p>
          </div>
        </div>
      </template>

      <template class="modal-body">
        <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 5px;">
          <span class="cabeceraModal">
            Empresa:
          </span>
          <span style="color: black"> {{ this.$cookies.get("nameEmpresa") }}</span>
        </div>

        <div style="display: flex; align-items: center">
          <span class="cabeceraModal">
            N.Comprobante:
          </span>
          <span style="color: black"> {{ "00001" }}</span>
        </div>

        <div style="display: flex; align-items: center">
          <span class="cabeceraModal">
            Unidad:
          </span>
          <span style="color: black"> {{ datamodal.CodiVehiSali_m }}</span>
        </div>

        <div style="display: flex; align-items: center">
          <span class="cabeceraModal">
            Perjudicado:
          </span>
          <span style="color: black"> {{ this.inputUnidad }}</span>
        </div>

        <div style="display: flex; align-items: center">
          <span class="cabeceraModal">
            Valor : $
          </span>
          <span style="color: black"> {{ datamodal.AtrasoPenalidad }}</span>
        </div>

        <div style=" flex-direction: row ;align-items: center">
          <span class="cabeceraModal">
            F.Creacion:
          </span>
          <span style="color: black"> {{ datamodal.HoraSaliProgSali_m, }} </span>
          <span style="padding-right: 5px"></span>
          <span style="color: black"> {{ datamodal.HoraProgSali_d }}</span>
        </div>

        <div style="display: flex; align-items: center">
          <span class="cabeceraModal">
            F.Pago :
          </span>
          <span style="color: black"> {{ "2023-08-04 14:05:00" }}</span>
        </div>

        <div style="display: flex; align-items: center">
          <span class="cabeceraModal">
            Usuario :
          </span>
          <span style="color: black"> {{ "Administrador" }}</span>
        </div>
      </template>


      <template slot="footer">
        <div class="centerButton">
          <base-button size="sm" title="CERRAR" type="danger" @click="cerrarModal()">Cerrar<i
              class="ni ni-fat-delete"></i></base-button>
        </div>
      </template>

    </modal-->
    <!-- Modal ComprobanteDevuelto -->
    <!--modal :show.sync="isModalDetalleDevuelto" size="sm">
      <template slot="header">
        <div style="width: 100%;">
          <div style="display: flex; align-items: center; justify-content: center;">
            <p class="cabeceraModal" style="margin-bottom: 0px;">
              Comprobante de Devolucion
            </p>
          </div>
        </div>

      </template>

      <template class="modal-body">
        <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 5px;">
          <span class="cabeceraModal">
            Empresa:
          </span>
          <span style="color: black"> {{ this.$cookies.get("nameEmpresa") }}</span>
        </div>

        <div style="display: flex; align-items: center">
          <span class="cabeceraModal">
            N.Devolucion:
          </span>
          <span style="color: black"> {{ 54796314 }}</span>
        </div>

        <div style="display: flex; align-items: center">
          <span class="cabeceraModal">
            Unidad:
          </span>
          <span style="color: black"> {{ 1254 }}</span>
        </div>

        <div style="display: flex; align-items: center">
          <span class="cabeceraModal">
            Perjudicado:
          </span>
          <span style="color: black"> {{ 1254 }}</span>
        </div>

        <div style="display: flex; align-items: center">
          <span class="cabeceraModal">
            Valor : $
          </span>
          <span style="color: black"> {{ 20 }}</span>
        </div>

        <div style=" flex-direction: row ;align-items: center">
          <span class="cabeceraModal">
            F.Creacion:
          </span>
          <span style="color: black"> {{ "2023-08-01 10:05:25" }}</span>
        </div>

        <div style="display: flex; align-items: center">
          <span class="cabeceraModal">
            F.Pago :
          </span>
          <span style="color: black"> {{ "2023-08-04 14:05:00" }}</span>
        </div>

        <div style="display: flex; align-items: center">
          <span class="cabeceraModal">
            Usuario :
          </span>
          <span style="color: black"> {{ "Administrador" }}</span>
        </div>

        <div style="display: flex; align-items: center; justify-content: center; margin-top: 40px">
          <p style="color: black; margin-bottom: 0px;">
            ...................................................
          </p>
        </div>

      </template>

      <template slot="footer">
        <div class="centerButton">
          <base-button size="sm" title="CERRAR" type="danger" @click="cerrarModal()">Cerrar<i
              class="ni ni-fat-delete"></i></base-button>
        </div>
      </template>


    </modal-->
  </div>
</template>
<script>
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
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
import { convertSecondtoTimeString } from "../../util/fechas";

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
      tableDataPanelControlProduccion: [],
      token: this.$cookies.get("token"),
      fechaInicialTableroProduccion: "",
      fechaFinalTableroProduccion: "",
      mTotalRPagosVehiculo: "0.00",
      mPendienteRPagosVehiculo: "0.00",
      loadingRTableroProduccionCobranzas: false,
      mListLineasTableroProduccion: [],
      mSelectLineasValueTablero: [],
      mListaUnidadesPanelProduccion: [],
      loadingTableUnidadesPanelProduccoionLoading: false,
      optionsUnidadesPanelProduccion: [],
      itemUnidadPanelProduccion: [],
      isModalDetallePerjuicio: false,
      datamodal: [],
      datos: [],
      inputUnidad: null,
      inputMotivo: "",
      isSendPago: false,
      isSendDevolucion: false,
      baseURlPDFComprobantePerjudicado: "",
      banderaMarcoAguaRecibo: true,
    };
  },
  methods: {
    remoteMethodUnidadesPanelProduccionJustificacion(query) {
      if (query !== "") {
        this.loadingTableUnidadesPanelProduccoionLoading = true;
        setTimeout(() => {
          this.loadingTableUnidadesPanelProduccoionLoading = false;
          this.optionsUnidadesPanelProduccion =
            this.mListaUnidadesPanelProduccion.filter((item) => {
              return (
                item.CodiVehi.toLowerCase().indexOf(query.toLowerCase()) > -1
              );
            });
        }, 200);
      } else {
        this.optionsUnidadesPanelProduccion = [];
      }
    },
    initFechaActualPerjudicaVueltas() {
      const today = new Date();
      const fecha = new Date(today);
      //fecha.setDate(fecha.getDate() - 1);
      var mes = fecha.getMonth() + 1;
      var day = fecha.getDate();
      var format =
        fecha.getFullYear() +
        "-" +
        (mes < 10 ? "0" + mes : mes) +
        "-" +
        (day < 10 ? "0" + day : day);

      this.fechaInicialTableroProduccion = format;
      this.fechaFinalTableroProduccion = format;
    },
    initFechaActualTicketPerjudica() {
      const today = new Date();
      const fecha = new Date(today);
      fecha.setDate(fecha.getDate());
      var mes = fecha.getMonth() + 1;
      var day = fecha.getDate();
      var hora = fecha.getHours();
      var minuto = fecha.getMinutes();
      var segundo = fecha.getSeconds();
      var format =
        fecha.getFullYear() +
        "-" +
        (mes < 10 ? "0" + mes : mes) +
        "-" +
        (day < 10 ? "0" + day : day);

      var formatHora =
        (hora < 10 ? "0" + hora : hora) +
        ":" +
        (minuto < 10 ? "0" + minuto : minuto) +
        ":" +
        (segundo < 10 ? "0" + segundo : segundo);

      return format + " " + formatHora;
    },
    async readlPanelTableroPerjudicaVuelta() {
      this.mPendienteRPagosVehiculo = "0.00";
      this.mTotalRPagosVehiculo = "0.00";
      this.loadingRTableroProduccionCobranzas = true;
      this.tableDataPanelControlProduccion = [];

      try {
        var datos = await this.$axios.post(
          process.env.baseUrl + "/ProduccionPerjudicadoVuelta",
          {
            token: this.token,
            fechaI: this.fechaInicialTableroProduccion,
            fechaF: this.fechaFinalTableroProduccion,
            ruta:
              this.mSelectLineasValueTablero.length <= 0
                ? "*"
                : this.mSelectLineasValueTablero,
            unidad:
              this.itemUnidadPanelProduccion.length <= 0
                ? "*"
                : this.itemUnidadPanelProduccion,
          }
        );

        console.log("Aca datos de la consulta general >>>>>", datos.data);

        if (datos.data.status_code == 200) {
          let dinero = 0;
          let pagados = 0;
          for (var i = 0; i < datos.data.datos.length; i++) {
            if (datos.data.datos[i].Estado != 2) {
              dinero =
                dinero +
                (datos.data.datos[i].AtrasoPenalidad == null
                  ? 0
                  : parseFloat(datos.data.datos[i].AtrasoPenalidad));
            }
            if (datos.data.datos[i].Estado === 2) {
              pagados =
                pagados +
                (datos.data.datos[i].AtrasoPenalidad == null
                  ? 0
                  : parseFloat(datos.data.datos[i].AtrasoPenalidad));
            }
          }
          console.log("DINERO : " + dinero);
          this.mPendienteRPagosVehiculo = dinero;
          console.log("PAGADOS : " + pagados);
          this.mTotalRPagosVehiculo = pagados;
          this.tableDataPanelControlProduccion.push(...datos.data.datos);
          console.log(
            "Aca datos de la consulta general >>>>>",
            datos.data.datos[0].Estado
          );
        }
      } catch (e) {
        console.log(e);
      }

      this.loadingRTableroProduccionCobranzas = false;
    },
    async readLineasTableroPerjudicaVueltas() {
      this.mListLineasTableroProduccion = [];
      try {
        var datos = await this.$axios.post(process.env.baseUrl + "/rutes", {
          token: this.token,
          tipo: 3,
        });

        if (datos.data.status_code == 200) {
          this.mListLineasTableroProduccion.push(...datos.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    },
    async readUnidadesTableroPerjudicaVueltas() {
      this.mListaUnidadesPanelProduccion = [];
      try {
        var datos = await this.$axios.post(process.env.baseUrl + "/unidades", {
          token: this.token,
        });

        console.log(datos.data);

        if (datos.data.status_code == 200) {
          for (var i = 0; i < datos.data.data.length; i++) {
            var obj = datos.data.data[i];
            obj.value = obj.CodiVehi;
            this.mListaUnidadesPanelProduccion.push(obj);
          }
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
    filaClickeada(row) {
      this.inputMotivo = null;
      this.inputUnidad = null;

      console.log("Fila clickeada: >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<", row);
      console.log(
        "Fila clickeada: >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<",
        row.CodiVehiSali_m
      );
      this.isModalDetallePerjuicio = true;
      this.datamodal = null;
      this.datamodal = row;
      this.crearPreviewReciboPerjudicado();
    },
    async enviarJustificacion() {
      if (this.inputMotivo === "" || this.inputMotivo === null) {
        this.notifyVue(
          "warning",
          "El campo de Motivo esta vacio. Por favor, ingresa información.",
          "ni ni-notification-70",
          4500
        );
        return;
      } else {
        let datos = await this.$axios.post(
          process.env.baseUrl + "/ProduccionPerjudicadoVueltaJustificado",
          {
            token: this.token,
            idSali_d: this.datamodal.idSali_d,
            fechaJus: this.initFechaActualTicketPerjudica(),
            motivo: this.inputMotivo,
          }
        );
        if (datos.data.status_code == 200) {
          this.inputMotivo = null;
          this.inputUnidad = null;
          this.readlPanelTableroPerjudicaVuelta();

          this.notifyVue(
            "default",
            "Justificación enviada.",
            "ni ni-check-bold",
            4500
          );
        }

        this.isModalDetallePerjuicio = false;
      }
    },
    async enviarPago() {
      try {
        if (this.inputUnidad == null || this.inputUnidad == "") {
          this.notifyVue(
            "danger",
            "El campo de la unidad esta vacio. Por favor, ingresa información.",
            "ni ni-notification-70",
            4500
          );
          return;
        } else {
          let datos = await this.$axios.post(
            process.env.baseUrl + "/ProduccionPerjudicadoVueltaPagado",
            {
              token: this.token,
              idSali_d: this.datamodal.idSali_d,
              fechaPaga: this.initFechaActualTicketPerjudica(),
              unidadP: this.inputUnidad,
            }
          );
          if (datos.data.status_code == 200) {
            this.banderaMarcoAguaRecibo = false;
            this.crearPreviewReciboPerjudicado();

            this.isSendPago = true;
            this.notifyVue(
              "default",
              "Pago enviada.",
              "ni ni-check-bold",
              4500
            );

            this.inputMotivo = null;
            this.inputUnidad = "";
          }
          //this.isModalDetallePerjuicio = false;
          this.readlPanelTableroPerjudicaVuelta();
        }
      } catch (error) {
        this.notifyVue("default", error.toString(), "ni ni-check-bold", 4500);
      }
    },
    async enviarDevolucion() {
      let datos = await this.$axios.post(
        process.env.baseUrl + "/ProduccionPerjudicadoVueltaDevuelto",
        {
          token: this.token,
          idSali_d: this.datamodal.idSali_d,
          fechaDev: this.initFechaActualTicketPerjudica(),
        }
      );
      console.log(`Aca api de devolver ${datos.data}`);
      if (datos.data.status_code == 200) {
        this.notifyVue("default", "Pago Devuelto", "ni ni-check-bold", 4500);
        this.isModalDetallePerjuicio = false;
        this.readlPanelTableroPerjudicaVuelta();
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
    async crearPreviewReciboPerjudicado() {
      var empresa = [
        {
          text: this.$cookies.get("nameEmpresa").substring(0, 30),
          fontSize: 12,
          bold: true,
          alignment: "center",
        },
      ];

      var dd = {
        pageSize: { width: 220, height: 300 },
        watermark: {
          text: this.banderaMarcoAguaRecibo ? "NO PAGADO" : "",
          color: "red",
          opacity: 0.25,
          bold: true,
          fontSize: 27,
        },
        pageMargins: [15, 15, 15, 15],
        compress: true,
        content: [
          {
            headerRows: 0,
            fontSize: 12,
            bold: true,
            layout: "noBorders",
            table: {
              widths: ["*"],
              body: [empresa],
            },
          },
          {
            text: this.datamodal == null ? "S/N" : this.datamodal.descripcion,
            bold: true,
            alignment: "center",
            fontSize: 10,
          },
          {
            text: "---------------------------------------------------------",
            color: "#FFFFFF",
          },
          /*{
            layout:'noBorders',
            table:{
              widths: [ 50, '*'],
              body:[[{ text: "RECIBO : "},{ text: "SIN PAGAR" ,bold:true},]]
            }
          },
          { text: "---------------------------------------------------------" },*/
          {
            layout: "noBorders",
            table: {
              widths: [100, 55],
              body: [
                [
                  { text: "U. INFRACTORIA" },
                  {
                    text:
                      this.datamodal == null
                        ? "S/N"
                        : this.datamodal.CodiVehiSali_m,
                    bold: true,
                  },
                ],
              ],
            },
          },

          {
            layout: "noBorders",
            table: {
              widths: [100, 55],
              body: [
                [
                  { text: "U. AFECTADA" },
                  {
                    text: this.inputUnidad == null ? "S/N" : this.inputUnidad,
                    bold: true,
                  },
                ],
              ],
            },
          },
          {text:"*",fontSize:5,color:"#FFFFFF"},
          { text: "Nota : Abono de sanción correspondiente al control Gruta La Virgen.",fontSize:10,bold:true },
          { text: "---------------------------------------------------------" },
          {
            text:
              "Fecha Evento : " +
              (this.datamodal.HoraSaliProgSali_m == null
                ? ""
                : this.datamodal.HoraSaliProgSali_m) +
              " " +
              (this.datamodal.HoraProgSali_d == null
                ? ""
                : this.datamodal.HoraProgSali_d),
            pageOrientation: "portrait",
            fontSize: 9,
          },
          {
            text:
              "Fecha de Pago : " +
              (this.banderaMarcoAguaRecibo
                ? "RECIBO SIN PAGAR"
                : this.initFechaActualTicketPerjudica()),
            pageOrientation: "portrait",
            fontSize: 9,
          },/*
          {
            text: "Fecha Impresion : " + this.initFechaActualTicketPerjudica(),
            pageOrientation: "portrait",
            fontSize: 9,
          },*/
          {
            text: "Operador : " + this.$cookies.get("namesUsuario"),
            pageOrientation: "portrait",
            fontSize: 9,
          },
          {
            text:
              "TOTAL DINERO : " +
              (this.datamodal == null
                ? "0.00"
                : this.datamodal.AtrasoPenalidad),
            pageOrientation: "portrait",
            fontSize: 11,
            color: "darkgreen",
            bold: true,
          },
          {
            text: ".",
            pageOrientation: "portrait",
            color:"#FFFFFF",
            fontSize: 45,
            margin: [0, 5, 0, 0],
          },

          {
            layout: "noBorders",
            table: {
              widths: [90, 90],
              body: [
                [
                  { text: "_______________" },
                  { text: "_______________" },
                ],
                [{ text: "U. INFRACTORIA",alignment: "center",
            fontSize: 8, }, { text: "U. AFECTADA" ,alignment: "center",
            fontSize: 8,}],
              ],
            },
          },

          {
            text: ".",
            pageOrientation: "portrait",
            fontSize: 6,
            margin: [0, 5, 0, 0],
          },
        ],
      };

      var pdfDocGenerator = pdfMake.createPdf(dd);

      pdfDocGenerator.getDataUrl((dataUrl) => {
        this.baseURlPDFComprobantePerjudicado = dataUrl;
        this.banderaMarcoAguaRecibo = true;
      });

      this.banderaMarcoAguaRecibo = true;
    },
  },
  mounted() {
    this.readUnidadesTableroPerjudicaVueltas();
    this.readLineasTableroPerjudicaVueltas();
    this.initFechaActualPerjudicaVueltas();
    this.readlPanelTableroPerjudicaVuelta();
    this.crearPreviewReciboPerjudicado();
  },
};
</script>
<style>


.cardTextoRPagosTableroPerjudicado{
  display: flex;
}
.container-model {
  display: flex;
}

.container-ticket {
  margin-left: 1rem;
  height: 10rem;
  width: 50%;
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

.no-border-card .card-footer {
  border-top: 0;
}

.card-bodyTopOpcionesRPagosVehiculoPRoduccion {
  padding-top: 0.25rem !important;
}

.tituloModal {
  background: green;
  color: white;
  font-family: arial;
  padding-right: 10px;
  padding-left: 12px;
  margin-top: 8px;
  margin-bottom: 8px;
}

.subtituloModal {
  color: black;
  margin-right: 5px;
  font-weight: bold;
  font-family: arial;
  align-items: center;
}

.centerButton {
  display: flex;
  justify-content: center;
}

.modal-body {
  padding: 0px 1.5rem 0px 1.5rem !important;
}

.modal-header {
  padding: 1.5rem 1.5rem 0px 1.5rem !important;
}

.no-border-card .card-footer {
  border-top: 0;
}

.card-bodyRPagosVehiculoProduccion {
  padding: 0rem !important;
  height: calc(100vh - 13.2rem);
}

.cabeceraModal {
  padding-right: 5px;
  padding-left: 12px;
  color: black;
  font-weight: bold;
}

.cardSelectTableroPerjudicadoVuelta{
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/*
.badge-success {
  background-color: #2dce89;
  color: white;
}*/
</style>
