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
            <base-button icon type="primary" @click="readlPanelTableroProduccion()">
              <span class="btn-inner--icon"><i class="el-icon-search"></i></span>
              <span class="btn-inner--text">Buscar</span>
            </base-button>

            <base-button icon type="default" @click="realizarCobro()"
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
                :height="tableDataPanelControlProduccion.length > 0 ? 455 : 150" style="width: 100%">
                <el-table-column type="selection" minWidth="50">
                </el-table-column>

                <el-table-column prop="Unidad" label="Unidad" minWidth="50">
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
                style="width: 100%;padding:0rem;border-width:0rem;height: calc(100vh - 12.4em);"></iframe>

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
import { PDFDocument, StandardFonts, rgb, degrees, ParseSpeeds } from 'pdf-lib'
import RouteBreadCrumb from "@/components/argon-core/Breadcrumb/RouteBreadcrumb";
import { BasePagination } from "@/components/argon-core";
import clientPaginationMixin from "~/components/tables/PaginatedTables/clientPaginationMixin";
import swal from "sweetalert2";
import Tabs from "@/components/argon-core/Tabs/Tabs";
import TabPane from "@/components/argon-core/Tabs/Tab";
import { convertSecondtoTimeString } from '../../util/fechas'
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
      pngUrl : 'https://res.cloudinary.com/virtualcode7/image/upload/v1659468163/marcoAgua_oibpny.png',
      pngImageBytes : null
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
        for (var i = 0; i < datos.data.datos.length; i++) 
        {
          dinero = dinero + (datos.data.datos[i].DeudaTotal == null ? 0 : parseFloat(datos.data.datos[i].DeudaTotal) )
        }
        console.log("DINERO : "+dinero)
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
          tipo:3
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
    async crearPreviewReciboIngresoPanelCobro(mLista) {
      var dineroCobrado = 0

      const pdfDoc = await PDFDocument.create(ParseSpeeds.Slow)
      const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)
      const TimesRomanBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold)
      let bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

      

      const page = pdfDoc.addPage()
      page.setWidth(230)
      const { width, height } = page.getSize()

      /**********MARCO DE AGUA*********/
      
      if (this.banderaMarcoAguaRecibo) 
      {

        const pngUrl = 'https://res.cloudinary.com/virtualcode7/image/upload/v1659468163/marcoAgua_oibpny.png'
      const pngImageBytes = await fetch(pngUrl).then((res) => res.arrayBuffer())
      const pngImage = await pdfDoc.embedPng(pngImageBytes)
      const pngDims = pngImage.scale(0.20)

        page.drawImage(pngImage, {
        x: 20,
        y: height - 20 * 10,
        width: pngDims.width,
        height: pngDims.height,
        })


        /*page.drawText("RECIBO SOLO DE MUESTRA(SIN PAGAR)", {
          x: 20,
          y: height - 2 * 10,
          size: 13,
          font: bold,
          color: rgb(0.95, 0.1, 0.1),
          rotate: degrees(-45),
        })*/
      }


      /*******************************/
      const fontSize = 10

      page.drawText("     " + this.$cookies.get("nameEmpresa").toUpperCase().substring(0, 28), {
        x: 20,
        y: height - 2 * fontSize,
        size: fontSize,
        font: TimesRomanBold,
        color: rgb(0, 0, 0),
      })

      page.drawText("     COMPROBANTE DE INGRESO", {
        x: 20,
        y: height - 3 * fontSize,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      })


      page.drawText("---------------------------------------------------------", {
        x: 20,
        y: height - 4.6 * fontSize,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      })

      page.drawText("VEHI.       LINEA               FECHA     VALOR", {
        x: 20,
        y: height - 5.6 * fontSize,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      })




      page.drawText("---------------------------------------------------------", {
        x: 20,
        y: height - 6.6 * fontSize,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      })


      var heightAux = 7.6

      var tamanioHoja = 1530

      for (var i = 0; i < mLista.length; i++) {
        heightAux++


        /*page.drawRectangle({
          x: 20,
          y: height - heightAux * 9,
          width: 25,
          height: 10,
          borderColor: rgb(1, 0, 0),
          borderWidth: 1.5,
        })*/

        page.drawText("  " + mLista[i].Unidad, {
          x: 20,
          y: height - heightAux * 9,
          size: 8.5,
          color: rgb(0, 0, 0),
        })


        /*page.drawRectangle({
          x: 55,
          y: height - heightAux * 9,
          width: 60,
          height: 10,
          borderColor: rgb(1, 0, 0),
          borderWidth: 1.5,
        })*/

        page.drawText(mLista[i].DescRuta.substring(0, 11), {
          x: 55,
          y: height - heightAux * 9,
          size: 8.5,
          color: rgb(0, 0, 0),
        })

        /*page.drawRectangle({
          x: 122,
          y: height - heightAux * 9,
          width: 50,
          height: 10,
          borderColor: rgb(1, 0, 0),
          borderWidth: 1.5,
        })*/

        page.drawText(mLista[i].Fecha, {
          x: 122,
          y: height - heightAux * 9,
          size: 8.5,
          color: rgb(0, 0, 0),
        })


        /*page.drawRectangle({
          x: 180,
          y: height - heightAux * 9,
          width: 30,
          height: 10,
          borderColor: rgb(1, 0, 0),
          borderWidth: 1.5,
        })*/


        page.drawText(mLista[i].DeudaTotal, {
          x: 180,
          y: height - heightAux * 9,
          size: 8.5,
          color: rgb(0, 0, 0),
        })

        dineroCobrado = dineroCobrado + parseFloat(mLista[i].DeudaTotal)
      }


      page.drawText("---------------------------------------------------------", {
        x: 20,
        y: height - (heightAux++) * fontSize,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      })


      var atrasos_falta = 0
      var adelantos_falta = 0
      var atrasos_justificaciones = 0
      var adelantos_justificaciones = 0
      var rubros_falta = 0
      var rubros_justificaciones = 0
      var ex_velocidad_falta = 0
      var ex_velocidad_justificaciones = 0
      var tarjeta = 0

      for (var i = 0; i < mLista.length; i++) {
        atrasos_falta = atrasos_falta + mLista[i].AtrasoFTiempo
        adelantos_falta = adelantos_falta + mLista[i].AdelantoFTiempo
        atrasos_justificaciones = atrasos_justificaciones + mLista[i].AtrasoJTiempo
        adelantos_justificaciones = adelantos_justificaciones + mLista[i].AdelantoJTiempo
        rubros_falta = rubros_falta + parseFloat(mLista[i].RubroFalta)
        rubros_justificaciones = rubros_justificaciones + parseFloat(mLista[i].RubroJustificacion)
        ex_velocidad_falta = ex_velocidad_falta + parseFloat(mLista[i].VelocidadFalta)
        ex_velocidad_justificaciones = ex_velocidad_justificaciones + parseFloat(mLista[i].VelocidadJustificacion)
        tarjeta = tarjeta + parseFloat(mLista[i].TarjetaDiaria)
      }

      page.drawText("Atrasos Falta : " + convertSecondtoTimeString(atrasos_falta), {
        x: 20,
        y: height - (heightAux++) * fontSize,
        size: 7.5,
        font: bold,
        color: rgb(0, 0, 0),
      })

      page.drawText("Atrasos Justificados : " + convertSecondtoTimeString(atrasos_justificaciones), {
        x: 20,
        y: height - (heightAux++) * fontSize,
        size: 7.5,
        font: bold,
        color: rgb(0, 0, 0),
      })

      page.drawText("Adelantos Falta : " + convertSecondtoTimeString(adelantos_falta), {
        x: 20,
        y: height - (heightAux++) * fontSize,
        size: 7.5,
        font: bold,
        color: rgb(0, 0, 0),
      })

      page.drawText("Adelantos Justificados : " + convertSecondtoTimeString(adelantos_justificaciones), {
        x: 20,
        y: height - (heightAux++) * fontSize,
        size: 7.5,
        font: bold,
        color: rgb(0, 0, 0),
      })

      page.drawText("Rubros : " + Number(rubros_falta).toFixed(2), {
        x: 20,
        y: height - (heightAux++) * fontSize,
        size: 7.5,
        font: bold,
        color: rgb(0, 0, 0),
      })

      page.drawText("Rubros Justificados : " + Number(rubros_justificaciones).toFixed(2), {
        x: 20,
        y: height - (heightAux++) * fontSize,
        size: 7.5,
        font: bold,
        color: rgb(0, 0, 0),
      })

      page.drawText("Ex. Velocidad : " + Number(ex_velocidad_falta).toFixed(2), {
        x: 20,
        y: height - (heightAux++) * fontSize,
        size: 7.5,
        font: bold,
        color: rgb(0, 0, 0),
      })

      page.drawText("Ex. Velocidad Justificados : " + Number(ex_velocidad_justificaciones).toFixed(2), {
        x: 20,
        y: height - (heightAux++) * fontSize,
        size: 7.5,
        font: bold,
        color: rgb(0, 0, 0),
      })

      page.drawText("Tarjeta : " + Number(tarjeta).toFixed(2), {
        x: 20,
        y: height - (heightAux++) * fontSize,
        size: 7.5,
        font: bold,
        color: rgb(0, 0, 0),
      })

      page.drawText("Operador : " + this.$cookies.get("namesUsuario"), {
        x: 20,
        y: height - (heightAux++) * fontSize,
        size: 7.5,
        color: rgb(0, 0, 0),
      })





      page.drawText("Fecha Pago : " + (this.banderaMarcoAguaRecibo ? 'RECIBO SIN PAGAR' : this.initFechaActualTicket()), {
        x: 20,
        y: height - (heightAux++) * fontSize,
        size: 7.5,
        color: rgb(0, 0, 0),
      })



      page.drawText("Fecha Impresión : " + this.initFechaActualTicket(), {
        x: 20,
        y: height - (heightAux++) * fontSize,
        size: 7.5,
        color: rgb(0, 0, 0),
      })




      page.drawText("TOTAL Dinero  : " + Number(dineroCobrado).toFixed(2), {
        x: 20,
        y: height - (heightAux + 0.5) * fontSize,
        size: 10,
        font: bold,
        color: rgb(1, 0, 0),
      })

      this.baseURlPDFComprobanteIngresoTableroCobro = await pdfDoc.saveAsBase64({ dataUri: true });
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
            this.reloadStoreTableCobros(mListaCobrosAuxiliar)

            //await this.readlPanelTableroProduccion()
            this.notifyVue('default', datos.data.msm + "\n <strong>Listo para imprimir</strong>", 'ni ni-check-bold', 3000)
            this.crearPreviewReciboIngresoPanelCobro(mListaCobrosAuxiliar)
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
      for (var i = 0; i < this.tableDataPanelControlProduccion.length; i++) 
      {
        
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
    async dowloadImage(){
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
  overflow: auto;
}

.card-bodyTopOpcionesRPagosVehiculoPRoduccion {
  padding-top: 0.25rem !important;
}
</style>
