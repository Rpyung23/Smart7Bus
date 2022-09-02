<template>
  <div class="content">
    <base-header>
      <div class="align-items-center py-3">

        <card class="no-border-card col" style="margin-bottom: 0.5rem"
          body-classes="px-0 pb-1 card-bodyTopOpcionesRPagosVehiculoPRoduccion cardSelectRubrosEstadosPagosVehiculoProduccionContainer"
          footer-classes="pb-2">
          <div class="cardTextoRPagosVehiculoProduccion">

            <!--<el-autocomplete class="inline-input" v-model="itemUnidadPanelProduccion"
              :fetch-suggestions="querySearchUnidadProduccionRPagoVehiculo" style="margin-right: 0.5rem"
              placeholder="Unidad" prefix-icon="ni ni-bus-front-12" :trigger-on-focus="false"></el-autocomplete>-->

            <el-select v-model="itemUnidadPanelProduccion" multiple filterable style="margin-right: 0.5rem" remote
              placeholder="Ingrese unidad" :remote-method="remoteMethodUnidadesPanelProduccionJustificacion"
              :loading="loadingTableUnidadesPanelProduccoionLoading">
              <el-option v-for="item in optionsUnidadesPanelProduccion" :key="item.CodiVehi" :label="item.CodiVehi"
                :value="item.CodiVehi">
              </el-option>
            </el-select>


            <base-input addon-left-icon="ni ni-calendar-grid-58" style="margin-right: 0.5rem;">
              <flat-picker slot-scope="{ focus, blur }" :max="{ fechaInicialTableroProduccion }" @on-open="focus"
                @on-close="blur" :config="{ allowInput: true }" class="form-controlPersonal datepicker"
                v-model="fechaInicialTableroProduccion">
              </flat-picker>
            </base-input>

            <base-input addon-left-icon="ni ni-calendar-grid-58">
              <flat-picker slot-scope="{ focus, blur }" @on-open="focus" @on-close="blur" :config="{ allowInput: true }"
                class="form-controlPersonal datepicker" v-model="fechaFinalTableroProduccion">
              </flat-picker>
            </base-input>

          </div>

          <div class="cardSelectRubrosEstadosPagosVehiculoProduccionContainer">
            <base-button icon type="primary"  @click="readlPanelTableroProduccion()">
              <span class="btn-inner--icon"><i class="el-icon-search"></i></span>
              <span class="btn-inner--text">Buscar</span>
            </base-button>

            <base-button icon type="default" sm @click="realizarCobro()"
              v-if="multipleSelectionProduccionCobros.length > 0">
              <span class="btn-inner--icon"><i class="el-icon-money"></i></span>
              <span class="btn-inner--text">Pagar</span>
            </base-button>

          </div>
        </card>

        <card class="no-border-card col" style="margin-bottom: 0.5rem"
          body-classes="px-0 pb-1 card-bodyTopOpcionesRPagosVehiculoPRoduccion cardSelectRubrosEstadosPagosVehiculoProduccionContainer"
          footer-classes="pb-2">
          <div class="cardSelectRubrosEstadosRPagosVehiculoProduccion">
            <!--<el-select v-model="mSelectRubroValueTablero" multiple collapse-tags placeholder="Rubros">
              <el-option v-for="item in mListRubrosTableroProduccion" :key="item.id" :label="item.descripcion"
                :value="item.id">
              </el-option>
            </el-select>-->
            <el-select v-model="mSelectLineasValueTablero" style="margin-right: 0.5rem" multiple collapse-tags
              placeholder="Rutas">
              <el-option v-for="item in mListLineasTableroProduccion" :key="item.LetrRuta" :label="item.DescRuta"
                :value="item.idRuta">
              </el-option>
            </el-select>

          </div>

          <div class="cardTextoRPagosVehiculoProduccion">
            <strong style="color: dark; margin-right: 0.5rem">Pendiente : {{ mPendienteRPagosVehiculo }} $</strong>
            <strong style="color: green">Total a Cobrar: {{ multipleSelectionProduccionCobros.length > 0 ?
                mTotalRPagosVehiculo : '0.00'
            }} $</strong>
          </div>
        </card>

        <card id="cardTableroCobros" class="no-border-card" style="margin-bottom: 0rem"
          body-classes="cardTableroCobros card-bodyRCobrosVehiculoProduccionPC px-0 pb-1" footer-classes="pb-2">
          <div>

            <div class="row row-example">


              <el-table v-loading="loadingRTableroProduccionCobranzas" ref="multipleTableCobrosPagar"
                @selection-change="handleSelectionChangeTableCobros" element-loading-text="Cargando Datos..."
                element-loading-spinner="el-icon-loading" :data="tableDataPanelControlProduccion" row-key="id"
                class="col-12 col-md-8 tablePanelControlProduccion" header-row-class-name="thead-dark"
                height="calc(100vh - 13rem)" style="width: 100%">
                <el-table-column type="selection" minWidth="50">
                </el-table-column>

                <el-table-column prop="Unidad" label="Unidad" minWidth="70">
                </el-table-column>
                <el-table-column prop="DescRuta" label="Ruta - Linea" minWidth="140">
                </el-table-column>

                <el-table-column prop="Fecha" label="Fecha" minWidth="60">
                </el-table-column>

                <el-table-column prop="DeudaTotal" sortable label="Total($)" minWidth="70">
                  <template slot-scope="scope">
                    <strong style="color:black;">{{ scope.row.DeudaTotal }}</strong>
                  </template>
                </el-table-column>

                <div slot="empty"></div>
              </el-table>

              <iframe class="col-6 col-md-4" :src="baseURlPDFComprobanteIngresoTableroCobro"
                style="width: 100%;padding:0rem;border-width:0rem;height: calc(100vh - 13em);"></iframe>

            </div>
          </div>
        </card>



        <!--Classic modal-->
        <modal :show.sync="isObservacionesTableroProduccion" size="xl">
          <h6 slot="header" class="modal-title">Type your modal title</h6>

          <p>Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the
            blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language
            ocean.</p>
          <p>A small river named Duden flows by their place and supplies it with the necessary regelialia. It is a
            paradisematic country, in which roasted parts of sentences fly into your mouth.</p>


          <template slot="footer">
            <base-button type="primary">Save changes</base-button>
            <base-button type="link" class="ml-auto" @click="modals.classic = false">Close</base-button>
          </template>

        </modal>



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
  Button
} from "element-ui";
import RouteBreadCrumb from "@/components/argon-core/Breadcrumb/RouteBreadcrumb";
import { BasePagination } from "@/components/argon-core";
import clientPaginationMixin from "~/components/tables/PaginatedTables/clientPaginationMixin";
import swal from "sweetalert2";
import Tabs from "@/components/argon-core/Tabs/Tabs";
import TabPane from "@/components/argon-core/Tabs/Tab";
import { convertSecondtoTimeString } from '../../util/fechas'
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

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
      mListLineasTableroProduccion: [],
      mSelectLineasValueTablero: [],
      mListaUnidadesPanelProduccion: [],
      loadingTableUnidadesPanelProduccoionLoading: false,
      optionsUnidadesPanelProduccion: [],
      itemUnidadPanelProduccion: [],
      isObservacionesTableroProduccion: false,
      baseURlPDFComprobanteIngresoTableroCobro: "",
      multipleSelectionProduccionCobros: [],
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
    handleSelectionChangeTableCobros(val) 
    {
      

      if (val != undefined && val != null) {
        if (this.banderaMarcoAguaRecibo) 
        {
          
          this.multipleSelectionProduccionCobros = val
          var dinero = 0
          for (var i = 0; i < this.multipleSelectionProduccionCobros.length; i++) {
            dinero = dinero + parseFloat(this.multipleSelectionProduccionCobros[i].DeudaTotal)
          }
          this.mTotalRPagosVehiculo = (dinero).toFixed(2)
          this.crearPreviewReciboIngresoPanelCobro(this.multipleSelectionProduccionCobros)
        }
      }
    },
    initFechaActualProduccionPanelControl() {
      const today = new Date()
      const fecha = new Date(today)
      fecha.setDate(fecha.getDate() - 1)
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
    initFechaActualTicket() {
      const today = new Date()
      const fecha = new Date(today)
      fecha.setDate(fecha.getDate() - 1)
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
        (hora < 10 ? "0" + hora : hora) + ":" + (minuto < 10 ? "0" + minuto : minuto) + ":" +
        (segundo < 10 ? "0" + segundo : segundo);

      return format + " " + formatHora;
    },
    async readlPanelTableroProduccion() {

      this.loadingRTableroProduccionCobranzas = true
      this.tableDataPanelControlProduccion = []

      var datos = await this.$axios.post(process.env.baseUrl + "/ProduccionPanelProduccionCobranza", {
        token: this.token,
        fechaI: this.fechaInicialTableroProduccion,
        fechaF: this.fechaFinalTableroProduccion,
        rutas: this.mSelectLineasValueTablero.length <= 0 ? '*' : this.mSelectLineasValueTablero,
        unidades: this.itemUnidadPanelProduccion.length <= 0 ? '*' : this.itemUnidadPanelProduccion
      })

      //console.log(datos.data)

      if (datos.data.status_code == 200) {
        let dinero = 0
        for (var i = 0; i < datos.data.datos.length; i++) {
          dinero = dinero + (datos.data.datos[i].DeudaTotal == null ? 0 : parseFloat(datos.data.datos[i].DeudaTotal))
        }
        console.log("DINERO : " + dinero)
        this.mPendienteRPagosVehiculo = dinero
        this.tableDataPanelControlProduccion.push(...datos.data.datos)
      }

      this.loadingRTableroProduccionCobranzas = false
    },
    async readLineasTableroProduccion() {
      this.mListLineasTableroProduccion = []
      try {
        var datos = await this.$axios.post(process.env.baseUrl + "/rutes", {
          token: this.token,
          tipo: 3
        })

        if (datos.data.status_code == 200) {
          this.mListLineasTableroProduccion.push(...datos.data.data)
        }
      } catch (error) {
        console.log(error)
      }
    },
    async readUnidadesTableroProduccion() {
      this.mListaUnidadesPanelProduccion = []
      try {
        var datos = await this.$axios.post(process.env.baseUrl + "/unidades", {
          token: this.token
        })

        if (datos.data.status_code == 200) {

          for (var i = 0; i < datos.data.data.length; i++) {
            var obj = datos.data.data[i];
            obj.value = obj.CodiVehi;
            this.mListaUnidadesPanelProduccion.push(obj);
          }
        }
      } catch (error) {
        console.log(error)
      }
    },
    showVisibleModalTableroProduccion() {
      this.isObservacionesTableroProduccion = this.isObservacionesTableroProduccion == true ? false : true
    },
    async crearPreviewReciboIngresoPanelCobro(mLista) 
    {

      let dineroCobrado = 0.0
      let atrasos_falta = 0.0
      let adelantos_falta = 0.0
      let atrasos_justificaciones = 0.0
      let adelantos_justificaciones = 0.0
      let rubros_falta = 0.0
      let rubros_justificaciones = 0.0
      let ex_velocidad_falta = 0.0
      let ex_velocidad_justificaciones = 0.0
      let tarjeta = 0.0

      var mListaCuerpoRecibo = []

      

      for (var i = 0; i < mLista.length; i++) {

          /*atrasos_falta = atrasos_falta + (mLista[i].AtrasoFTiempo)
          adelantos_falta = adelantos_falta + (mLista[i].AdelantoFTiempo)
          atrasos_justificaciones = atrasos_justificaciones + (mLista[i].AtrasoJTiempo)
          adelantos_justificaciones = adelantos_justificaciones + (mLista[i].AdelantoJTiempo)
          rubros_falta = rubros_falta + parseFloat(mLista[i].RubroFalta)
          rubros_justificaciones = rubros_justificaciones + parseFloat(mLista[i].RubroJustificacion)
          ex_velocidad_falta = ex_velocidad_falta + parseFloat(mLista[i].VelocidadFalta)
          ex_velocidad_justificaciones = ex_velocidad_justificaciones + parseFloat(mLista[i].VelocidadJustificacion)
          tarjeta = tarjeta + parseFloat(mLista[i].TarjetaDiaria)*/

          dineroCobrado = dineroCobrado + parseFloat(mLista[i].DeudaTotal)

          var obj = [{ text: mLista[i].Unidad, alignment: "center" },
          { text: mLista[i].DescRuta, alignment: "center" },
          { text: mLista[i].Fecha, alignment: "center" },
          { text: mLista[i].DeudaTotal, alignment: "center" }]
          mListaCuerpoRecibo.push(obj)
        }



      var empresa = [{ text: this.$cookies.get('nameEmpresa').substring(0, 30), fontSize: 12, bold: true, alignment: "center" }]

      var docDefinition = {

        // a string or { width: 190, height: number }
        watermark: { text: this.banderaMarcoAguaRecibo ? 'NO PAGADO' : '', color: 'red', opacity: 0.25, bold: true,fontSize: (mLista.length > 50 ? 150 : 27) },
        pageSize: { width: 220, height: 'auto' },
        pageMargins: [15, 15, 15, 15],
        // header: [empresa],


        content: [
          {
            headerRows: 0,
            fontSize: 12,
            bold: true,
            layout: 'noBorders', // optional
            table: {
              widths: ['*'],
              body: [empresa]
            }
          },
          { text: 'COMPROBANTE DE INGRESO', alignment: "center", fontSize: 10 },

          { text: '---------------------------------------------------------' },

          {
            fontSize: 8.5,
            layout: 'noBorders',
            // optional
            table: {


              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              headerRows: 0,
              widths: [19, 65, 44, 27],
              body: [
                [{ text: 'VEHI', alignment: "center", bold: true },
                { text: 'LINEA', alignment: "center", bold: true },
                { text: 'FECHA', alignment: "center", bold: true },
                { text: 'VALOR', alignment: "center", bold: true }],
              ]

            }
          },

          { text: '---------------------------------------------------------' },



          {
            fontSize: 8.5,
            layout: 'noBorders',
            // optional
            table: {


              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              headerRows: 0,
              widths: [19, 65, 43, 27],
              body: mLista.length > 0 ?  mListaCuerpoRecibo : [[]],
            }
          },


          { text: '---------------------------------------------------------' },
          { text: 'Operador : ' + this.$cookies.get("namesUsuario"), fontSize: 9 },
          { text: 'Fecha de Pago : ' + (this.banderaMarcoAguaRecibo ? 'RECIBO SIN PAGAR' : this.initFechaActualTicket()), fontSize: 9 },
          { text: 'Fecha Impresion : ' + this.initFechaActualTicket(), fontSize: 9 },
          { text: 'TOTAL DINERO : ' + Number(dineroCobrado).toFixed(2), fontSize: 11, color: 'darkgreen',bold:true },
        ]
      }



      var pdfDocGenerator = pdfMake.createPdf(docDefinition);

      pdfDocGenerator.getDataUrl((dataUrl) => {
        this.baseURlPDFComprobanteIngresoTableroCobro = dataUrl
        this.banderaMarcoAguaRecibo = true
      });


   
      this.banderaMarcoAguaRecibo = true
    },
    async realizarCobro() {
      var mListaCobrosAuxiliar = []
      mListaCobrosAuxiliar.push(... this.multipleSelectionProduccionCobros)

      var unidades = []
      var codigos = []
      var totalC = 0
      for (var i = 0; i < this.multipleSelectionProduccionCobros.length; i++) {
        unidades.push(this.multipleSelectionProduccionCobros[i].Unidad)
        codigos.push(this.multipleSelectionProduccionCobros[i].Codigo)
        totalC = totalC + parseFloat(this.multipleSelectionProduccionCobros[i].DeudaTotal)
      }


      try {
        var datos = await this.$axios.post(process.env.baseUrl + "/RegistrarProduccionPagos", {
          token: this.token,
          unidades: unidades,
          total: totalC,
          codigos: codigos
        })

        if (datos.data.status_code == 200) {
          if (datos.data.code == 200) {
            this.banderaMarcoAguaRecibo = false

            


            this.notifyVue('default', datos.data.msm + "\n <strong>Listo para imprimir</strong>", 'ni ni-check-bold', 3000)
            
            this.crearPreviewReciboIngresoPanelCobro(mListaCobrosAuxiliar)
            this.reloadStoreTableCobros(mListaCobrosAuxiliar)
          } else {
            this.notifyVue('warning', datos.data.msm, 'ni ni-fat-remove', 4500)
          }
        } else {
          this.notifyVue('danger', datos.data.msm, 'ni ni-settings', 4500)
        }

      } catch (error) {
        this.notifyVue('danger', error.toString(), 'ni ni-notification-70', 4500)
      }
    },
    async reloadStoreTableCobros(mListaCobrosAuxiliar) {
      var mListaTablaAuxiliar = []

      this.banderaMarcoAguaRecibo = false
      this.multipleSelectionProduccionCobros = []
      for (var contadorListaAux = 0; contadorListaAux < mListaCobrosAuxiliar.length; contadorListaAux++) {
        for (var contadorListaTable = 0; contadorListaTable < this.tableDataPanelControlProduccion.length; contadorListaTable++) {
          if (mListaCobrosAuxiliar[contadorListaAux].Codigo == this.tableDataPanelControlProduccion[contadorListaTable].Codigo) {
            console.log("DELETE : " + contadorListaTable)
            this.tableDataPanelControlProduccion.splice(contadorListaTable, 1)
          }
        }
      }

      mListaTablaAuxiliar.push(...this.tableDataPanelControlProduccion)
      this.tableDataPanelControlProduccion = []
      this.tableDataPanelControlProduccion.push(...mListaTablaAuxiliar)

      var dinero = 0
      for (var i = 0; i < this.tableDataPanelControlProduccion.length; i++) {

        dinero = dinero + parseFloat(this.tableDataPanelControlProduccion[i].DeudaTotal)
      }
      this.mPendienteRPagosVehiculo = dinero.toFixed(2)

    },
    notifyVue(type, mensaje, icono, tiempo = 4500) {
      this.$notify({
        message:
          mensaje,
        timeout: tiempo,
        icon: icono,
        type
      });
    },
    async dowloadImage() {
      this.pngImageBytes = await fetch(this.pngUrl).then((res) => res.arrayBuffer())
    }
  }, mounted() {
    this.dowloadImage()
    this.crearPreviewReciboIngresoPanelCobro([])
    this.readUnidadesTableroProduccion()
    this.readLineasTableroProduccion()
    this.initFechaActualProduccionPanelControl()
    this.readlPanelTableroProduccion()
  }
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
  height: calc(100vh - 13em);
  overflow: none;
}

.card-bodyTopOpcionesRPagosVehiculoPRoduccion {
  padding-top: 0.25rem !important;
}
</style>
