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
          <div class="cardOpcionesRPagosVehiculoProduccion">
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

            <el-date-picker type="date" placeholder="Select date and time" style="margin-right: 0.5rem;"
              v-model="fechaInicialTableroProduccion">
            </el-date-picker>

            <el-date-picker type="date" placeholder="Select date and time" style="margin-right: 0.5rem;"
              v-model="fechaFinalTableroProduccion">
            </el-date-picker>
          </div>

          <div class="cardSelectRubrosEstadosPagosVehiculoProduccionContainer">

            <div class="buttonCenterEndDerecha">
              <base-button
              icon
              type="primary"
              v-if="!loadingRTableroProduccionCobranzas"
              size="sm"
              @click="readPanelCobroTarjeta()"
            >
              <span class="btn-inner--icon"
                ><i class="el-icon-search"></i
              ></span>
            </base-button>

            <base-button
              icon
              type="default"
              size="sm"
              @click="realizarCobro()"
              v-if="multipleSelectionProduccionCobros.length > 0"
            >
              <span class="btn-inner--icon"><i class="ni ni-money-coins"></i></span>
              <span class="btn-inner--text">PAGAR</span>
            </base-button>
            </div>

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
              v-model="mSelectGrupo"
              style="margin-right: 0.5rem"
              multiple
              collapse-tags
              placeholder="GRUPOS"
            >
              <el-option
                v-for="item in mListGrupos"
                :key="item.id"
                :label="item.descripcion"
                :value="item.id"
              >
              </el-option>
            </el-select>

          </div>

          <div class="cardTextoRPagosVehiculoProduccion">
            <strong style="color: dark; margin-right: 0.5rem"
              >Pendiente : {{ mPendienteRPagosVehiculo }} $</strong
            >
            <strong style="color: green"
              >Total a Cobrar:
              {{
                multipleSelectionProduccionCobros.length > 0
                  ? mTotalRPagosVehiculo
                  : "0.00"
              }}
              $</strong
            >
          </div>
        </card>

        <card
          id="cardTableroCobros"
          class="no-border-card"
          style="margin-bottom: 0rem"
          body-classes="cardTableroCobros card-bodyRCobrosVehiculoProduccionPC px-0 pb-1"
          footer-classes="pb-2"
        >
          <div>
            <div class="row row-example">
              <el-table
                v-loading="loadingRTableroProduccionCobranzas"
                ref="multipleTableCobrosPagar"
                @selection-change="handleSelectionChangeTableCobros"
                element-loading-text="Cargando Datos..."
                :data="tableDataPanelControlProduccion"
                row-key="id"
                class="col-12 col-md-8 tablePanelControlProduccion"
                header-row-class-name="thead-dark"
                height="calc(100vh - 13rem)"
                style="width: 100%"
              >
                <el-table-column type="selection" minWidth="50">
                </el-table-column>

                <el-table-column prop="Unidad" label="Unidad" minWidth="70">
                </el-table-column>
                <el-table-column
                  prop="descripcion"
                  label="GRUPO UNIDAD"
                  minWidth="140"
                >
                </el-table-column>

                <el-table-column prop="Fecha" label="Fecha" minWidth="60">
                </el-table-column>

                <el-table-column
                  prop="DeudaTotal"
                  sortable
                  label="Total($)"
                  minWidth="70"
                >
                  <template slot-scope="scope">
                    <strong style="color: black">{{
                      scope.row.DeudaTotal
                    }}</strong>
                  </template>
                </el-table-column>

                <div slot="empty"></div>
              </el-table>

              <iframe
                class="col-6 col-md-4"
                :src="baseURlPDFComprobanteIngresoTableroCobro"
                style="
                  width: 100%;
                  padding: 0rem;
                  border-width: 0rem;
                  height: calc(100vh - 13rem);
                "
              ></iframe>
            </div>
          </div>
        </card>

      </div>
    </base-header>
  </div>
</template>
<script>
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import flatPicker from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import { getFecha_dd_mm_yyyy, FechaStringToHour } from '../../util/fechas'

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
      mListRubrosTableroProduccion: [],
      mSelectRubroValueTablero: [],
      mListGrupos: [],
      mSelectGrupo: [],
      mListaUnidadesPanelProduccion: [],
      loadingTableUnidadesPanelProduccoionLoading: false,
      optionsUnidadesPanelProduccion: [],
      itemUnidadPanelProduccion: [],
      isObservacionesTableroProduccion: false,
      baseURlPDFComprobanteIngresoTableroCobro: "",
      multipleSelectionProduccionCobros: [],
      banderaMarcoAguaRecibo: true,
      codigoEmpresaTableroCobrosProduccion: null,
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
    handleSelectionChangeTableCobros(val) {
      if (val != undefined && val != null) {
        if (this.banderaMarcoAguaRecibo) {
          this.multipleSelectionProduccionCobros = val;
          var dinero = 0;
          for (
            var i = 0;
            i < this.multipleSelectionProduccionCobros.length;
            i++
          ) {
            dinero =
              dinero +
              parseFloat(this.multipleSelectionProduccionCobros[i].DeudaTotal);
          }
          this.mTotalRPagosVehiculo = dinero.toFixed(2);

          this.crearPreviewReciboIngresoPanelCobro(
              this.multipleSelectionProduccionCobros
            );
        }
      }
    },
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

      this.fechaInicialTableroProduccion = format + " ";
      this.fechaFinalTableroProduccion = format + " ";
    },
    initFechaActualTicket() {
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
    async readPanelCobroTarjeta() {
      this.loadingRTableroProduccionCobranzas = true;
      try {
        this.tableDataPanelControlProduccion = [];

      var datos = await this.$axios.post(
        process.env.baseUrl + "/ProduccionPanelCobroTarjeta",
        {
          token: this.token,
          fechaI: getFecha_dd_mm_yyyy(this.fechaInicialTableroProduccion),
          fechaF: getFecha_dd_mm_yyyy(this.fechaFinalTableroProduccion),
          grupos:
            this.mSelectGrupo.length <= 0
              ? "*"
              : this.mSelectGrupo,
          unidades:
            this.itemUnidadPanelProduccion.length <= 0
              ? "*"
              : this.itemUnidadPanelProduccion,
        }
      );

      //console.log(datos.data)

      if (datos.data.status_code == 200) {
        let dinero = 0;
        for (var i = 0; i < datos.data.datos.length; i++) {
          dinero =
            dinero +
            (datos.data.datos[i].DeudaTotal == null
              ? 0
              : parseFloat(datos.data.datos[i].DeudaTotal));
        }
        console.log("DINERO : " + dinero);
        this.mPendienteRPagosVehiculo = dinero;
        this.tableDataPanelControlProduccion.push(...datos.data.datos);
      }
      } catch (error) {
        console.log(error)
      }
      this.loadingRTableroProduccionCobranzas = false;
    },
    async readGrupoTableroCobroTarjeta() {
      this.mListGrupos = [];
      try {
        var datos = await this.$axios.post(process.env.baseUrl + "/grupos", {
          token: this.token,
          tipo: 3,
        });

        if (datos.data.status_code == 200) {
          this.mListGrupos.push(...datos.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    },
    async readUnidadesTableroProduccion() {
      this.mListaUnidadesPanelProduccion = [];
      try {
        var datos = await this.$axios.post(process.env.baseUrl + "/unidades", {
          token: this.token,
        });

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
    showVisibleModalTableroProduccion() {
      this.isObservacionesTableroProduccion =
        this.isObservacionesTableroProduccion == true ? false : true;
    },
    async crearPreviewReciboIngresoPanelCobro(mLista) {
      let dineroCobrado = 0.0;

      var mListaCuerpoRecibo = [];

      for (var i = 0; i < mLista.length; i++) {
        dineroCobrado = dineroCobrado + parseFloat(mLista[i].DeudaTotal);

        var obj = [
          { text: mLista[i].Unidad, alignment: "center" },
          { text: ("PAGO TARJETA "+mLista[i].Fecha), alignment: "left" },
          { text: mLista[i].DeudaTotal, alignment: "center" },
        ];
        mListaCuerpoRecibo.push(obj);
      }

      var empresa = [
        {
          text: this.$cookies.get("nameEmpresa").substring(0, 30),
          fontSize: 12,
          bold: true,
          alignment: "center",
        },
      ]

      console.log(mLista)

            
      var grupo = [
        {
          text: mLista.length > 0 ? mLista[0].descripcion : "",
          fontSize: 12,
          bold: true,
          alignment: "center",
        },
      ];

      var dd = {
        pageSize: { width: 220, height: mLista.length < 4 ? 300 : "auto" },
        watermark: {
          text: this.banderaMarcoAguaRecibo ? "NO PAGADO" : "",
          color: "red",
          opacity: 0.25,
          bold: true,
          fontSize: mLista.length > 50 ? 120 : 27,
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
              body: [empresa,grupo],
            },
          },
          { text: "", alignment: "center", fontSize: 10 },

          { text: "---------------------------------------------------------" },
          {
            fontSize: 8.5,
            layout: "noBorders",
            table: {
              // 19, 65, 44, 27
              headerRows: 0,
              widths: [24, 105, 27],
              body: [
                [
                  { text: "VEHI", alignment: "center", bold: true },
                  { text: "DETALLE", alignment: "center", bold: true },
                  { text: "VALOR", alignment: "center", bold: true },
                ],
              ],
            },
          },

          { text: "---------------------------------------------------------" },

          {
            fontSize: 8.5,
            layout: "noBorders",
            table: {
              headerRows: 0,
              widths: [24, 105, 27],
              body: mLista.length > 0 ? mListaCuerpoRecibo : [[]],
            },
          },

          { text: "---------------------------------------------------------" },
          {
            text: "Operador : " + this.$cookies.get("namesUsuario"),
            pageOrientation: "portrait",
            fontSize: 9,
          },
          {
            text:
              "Fecha de Pago : " +
              (this.banderaMarcoAguaRecibo
                ? "RECIBO SIN PAGAR"
                : this.initFechaActualTicket()),
            pageOrientation: "portrait",
            fontSize: 9,
          },
          {
            text: "Fecha Impresion : " + this.initFechaActualTicket(),
            pageOrientation: "portrait",
            fontSize: 9,
          },
          {
            text: "TOTAL DINERO : " + Number(dineroCobrado).toFixed(2),
            pageOrientation: "portrait",
            fontSize: 11,
            color: "darkgreen",
            bold: true,
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
        this.baseURlPDFComprobanteIngresoTableroCobro = dataUrl;
        this.banderaMarcoAguaRecibo = true;
      });

      this.banderaMarcoAguaRecibo = true;
    },
    async realizarCobro() {
      var mListaCobrosAuxiliar = [];
      mListaCobrosAuxiliar.push(...this.multipleSelectionProduccionCobros);

      var unidades = [];
      var codigos = [];
      var totalC = 0;
      for (var i = 0; i < this.multipleSelectionProduccionCobros.length; i++) {
        console.log(this.multipleSelectionProduccionCobros[i])
        codigos.push(this.multipleSelectionProduccionCobros[i].Codigo);
        totalC =
          totalC +
          parseFloat(this.multipleSelectionProduccionCobros[i].DeudaTotal);
      }

      try {
        var datos = await this.$axios.put(
          process.env.baseUrl + "/InsertProduccionPanelCobroTarjeta",
          {
            token: this.token,
            code_tarjeta: codigos,
          }
        );

        if (datos.data.status_code == 200) 
        {
          this.banderaMarcoAguaRecibo = false;

            this.notifyVue(
              "default",
              datos.data.msm + "\n <strong>Listo para imprimir</strong>",
              "ni ni-check-bold",
              3000
            );

            this.crearPreviewReciboIngresoPanelCobro(
                this.multipleSelectionProduccionCobros
              )

            this.reloadStoreTableCobros(mListaCobrosAuxiliar);
        } else {
          this.notifyVue("danger", datos.data.msm, "ni ni-settings", 4500);
        }
      } catch (error) {
        this.notifyVue(
          "danger",
          error.toString(),
          "ni ni-notification-70",
          4500
        );
      }
    },
    async reloadStoreTableCobros(mListaCobrosAuxiliar) {
      var mListaTablaAuxiliar = [];

      this.banderaMarcoAguaRecibo = false;
      this.multipleSelectionProduccionCobros = [];
      for (
        var contadorListaAux = 0;
        contadorListaAux < mListaCobrosAuxiliar.length;
        contadorListaAux++
      ) {
        for (
          var contadorListaTable = 0;
          contadorListaTable < this.tableDataPanelControlProduccion.length;
          contadorListaTable++
        ) {
          if (
            mListaCobrosAuxiliar[contadorListaAux].Codigo ==
            this.tableDataPanelControlProduccion[contadorListaTable].Codigo
          ) {
            //console.log("DELETE : " + contadorListaTable);
            this.tableDataPanelControlProduccion.splice(contadorListaTable, 1);
          }
        }
      }

      mListaTablaAuxiliar.push(...this.tableDataPanelControlProduccion);
      this.tableDataPanelControlProduccion = [];
      this.tableDataPanelControlProduccion.push(...mListaTablaAuxiliar);

      var dinero = 0;
      for (var i = 0; i < this.tableDataPanelControlProduccion.length; i++) {
        dinero =
          dinero +
          parseFloat(this.tableDataPanelControlProduccion[i].DeudaTotal);
      }
      this.mPendienteRPagosVehiculo = Number(dinero).toFixed(2);
    },
    notifyVue(type, mensaje, icono, tiempo = 4500) {
      this.$notify({
        message: mensaje,
        timeout: tiempo,
        icon: icono,
        type,
      });
    },
    async dowloadImage() {
      this.pngImageBytes = await fetch(this.pngUrl).then((res) =>
        res.arrayBuffer()
      );
    },
  },
  mounted() {
    this.codigoEmpresaTableroCobrosProduccion = this.$cookies.get("empresa");

    this.dowloadImage();
    this.crearPreviewReciboIngresoPanelCobro([]);

    this.readUnidadesTableroProduccion();
    this.readGrupoTableroCobroTarjeta();
    this.initFechaActualProduccionPanelControl();
    this.readPanelCobroTarjeta();
  },
};
</script>
<style>
.cardTableroCobros::-webkit-scrollbar {
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
  flex-wrap: wrap;
}

.cardOpcionesRPagosVehiculoProduccion {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  width: 90%;
}

.cardSelectRubrosEstadosPagosVehiculoProduccionContainer {
  display: flex;
  justify-content: space-between;
}

.no-border-card .card-footer {
  border-top: 0;
}

.card-bodyRCobrosVehiculoProduccionPC {
  padding: 0rem !important;
  height: calc(100vh - 13rem);
  overflow: none;
}

.card-bodyTopOpcionesRPagosVehiculoPRoduccion {
  padding-top: 0.25rem !important;
}
</style>
