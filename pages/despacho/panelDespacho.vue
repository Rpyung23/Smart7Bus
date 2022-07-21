<template>
  <div class="content">

    <base-header class="py-3">
      <card class="no-border-card col" style="margin-bottom: 0.5rem"
        body-classes="px-0 pb-1 card-bodyTopOpcionesRPagosVehiculoPRoduccion cardSelectRubrosEstadosPagosVehiculoProduccionContainer"
        footer-classes="pb-2">

        <div class="cardTextoRPagosVehiculoProduccion">
          <base-button icon type="primary" @click="showReporteLlegadaSAlida()">
            <span class="btn-inner--icon"><i class="ni ni-collection"></i></span>
            <span class="btn-inner--text">Tarjeta</span>
          </base-button>

          <base-button icon type="default">
            <span class="btn-inner--icon"><i class="ni ni-cloud-download-95"></i></span>
            <span class="btn-inner--text">Recalificar</span>
          </base-button>

          <base-button icon type="danger">
            <span class="btn-inner--icon"><i class="ni ni-fat-remove"></i></span>
            <span class="btn-inner--text">Anular</span>
          </base-button>
          <base-button icon type="warning">
            <span class="btn-inner--icon"><i class="ni ni-fat-delete"></i></span>
            <span class="btn-inner--text">Finalizar</span>
          </base-button>
          <base-button icon type="info">
            <span class="btn-inner--icon"><i class="ni ni-single-02"></i></span>
            <span class="btn-inner--text">Chofer</span>
          </base-button>
        </div>

        <div class="containerTiposDespachos">


          <el-radio-group v-model="radioTipoDespacho">

            <div class="table1" style="height: 20px;width: 100%;">
              <el-radio :label="3">Salida Normal.</el-radio>
              <el-radio :label="9">Generar Tarjeta</el-radio>
            </div>
            <div class="table2" style="height: 20px;width: 100%;">
              <el-radio :label="6">Salida Diferida</el-radio>
              <el-radio :label="7">Salida de Apoyo</el-radio>
            </div>



          </el-radio-group>
        </div>



      </card>

      <card class="no-border-card col" style="margin-bottom: 0.5rem"
        body-classes="px-0 pb-1 card-bodyTopOpcionesRPagosVehiculoPRoduccion cardSelectRubrosEstadosPagosVehiculoProduccionContainer"
        footer-classes="pb-2">

        <div class="cardTextoRPagosVehiculoProduccion">
          <el-date-picker type="datetime" placeholder="Select date and time" v-model="fechaActualSalidasPanelDespacho"
            style="margin-right: 0.5rem">
          </el-date-picker>

          <el-select v-model="itemUnidadSalidasPanelBusqueda" filterable style="margin-right: 0.5rem" remote
            placeholder="Ingrese unidad" :remote-method="remoteMethodUnidadesSalidasPanelBusqueda"
            :loading="loadingTableUnidadesSalidasPanelBusquedaloading">
            <el-option v-for="item in optionsUnidadesSalidasPanelSalidas" :key="item.CodiVehi" :label="item.CodiVehi"
              :value="item.CodiVehi">
            </el-option>
          </el-select>

          <el-select v-model="mSelectRutaSalidaPanelDespacho" collapse-tags placeholder="Lineas"
            @change="readFrecuenciasSalidasPanel()" style="margin-right: 0.5rem">
            <el-option v-for="item in mListRutasDespacho" :key="item.idRuta" :label="item.DescRuta"
              :value="item.idRuta">
            </el-option>
          </el-select>

          <el-select v-model="mSelectRutaFrecuenciaPanelDespacho" collapse-tags placeholder="Frecuencias">
            <el-option v-for="item in mListRutasFrecuencias" :key="item.idFrec" :label="item.DescFrec"
              :value="item.idFrec">
            </el-option>
          </el-select>


        </div>

        <div class="cardSelectRubrosEstadosPagosVehiculoProduccionContainer">
          <base-button icon type="success">
            <span class="btn-inner--icon"><i class="ni ni-send"></i></span>
            <span class="btn-inner--text">Despachar</span>
          </base-button>
        </div>
      </card>


      <div class="containerTablero">
        <div class="container-rutas">
          <div class="itemrutaDespacho" v-for="ruta in mListRutasDespacho" :id="ruta.LetrRuta" :key="ruta.LetrRuta"
            @click="lecturaDespacho(ruta)">
            {{ ruta.DescRuta }}
          </div>
        </div>
        <div class="container-calendario col_personalizado">
          <card class="no-border-card card-sinborderPanel" body-classes="card-body-sinpadding px-0 pb-1"
            footer-classes="pb-2">
            <JqxGrid ref="myGridDespachoPanel" @contextmenu="myGridOnContextMenu()" @rowclick="myGridOnRowClick($event)"
              @cellbeginedit="cellBeginEditEvent($event)" :height="'100%'" style="margin-right: 50rem !important;"
              @cellendedit="cellEndEditEvent($event)" :columns="columnsInfo" :source="dataAdapter" :editable="true"
              @rowselect="myGridOnRowSelect($event,)" :selectionmode="'singlerow'" :enabletooltips="true"
              :width="getWidth">
            </JqxGrid>

            <JqxMenu ref="myMenu" @itemclick="myMenuOnItemClick($event)" :width="200" :height="200" :mode="'popup'"
              :autoOpenPopup="false">
              <ul>
                <li>Retirar unidad</li>
                <li>Reemplazar unidad</li>
                <li>Ingresar unidad</li>
                <li>Modificar Intervalos</li>
                <li>Cambiar frecuencia</li>
                <li>Anular Salidas</li>
                <li>Copiar contenido</li>
              </ul>
            </JqxMenu>

            <div style="font-size: 12px; font-family: Verdana; margin-top: 30px; display: none;">
              <div ref="beginEdit"></div>
              <div ref="endEdit" style="margin-top: 10px;"></div>
            </div>
            <div class="loadingRecorridoSalidaBusquedaPanel" v-if="isLoadingDespachoSalidaPanelBusqueda">
              <div class="circleProgress"></div>
            </div>
          </card>
        </div>
      </div>

    </base-header>


    <!--Form modal TICKET LLEGADA-->
    <modal :show.sync="modalSalidasTarjetaPanelDespacho" size="sm" body-classes="p-0">
      <card type="secondary" header-classes="bg-transparent pb-5" class="border-0 mb-0">
        <iframe :src="baseURlPDFPanelDespachoTarjetaSalida" style="width: 100%; height: 33rem"></iframe>
      </card>
    </modal>


  </div>
</template>
<script>
import {
  Table, TableColumn, Select, Option, Notification,
  DatePicker, RadioButton, RadioGroup, Radio, Button, Dropdown
} from "element-ui";
import JqxGrid from "jqwidgets-scripts/jqwidgets-vue/vue_jqxgrid.vue";
import JqxMenu from "jqwidgets-scripts/jqwidgets-vue/vue_jqxmenu.vue";
import RouteBreadCrumb from "@/components/argon-core/Breadcrumb/RouteBreadcrumb";
import { BasePagination } from "@/components/argon-core";
import clientPaginationMixin from "~/components/tables/PaginatedTables/clientPaginationMixin";
import swal from "sweetalert2";
import Tabs from "@/components/argon-core/Tabs/Tabs";
import TabPane from "@/components/argon-core/Tabs/Tab";
import { getFecha_dd_mm_yyyy, FechaStringToHour } from '../../util/fechas'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

export default {
  mixins: [clientPaginationMixin],
  layout: "DespachoDashboardLayout",
  components: {
    Tabs,
    JqxGrid,
    JqxMenu,
    TabPane,
    BasePagination,
    RouteBreadCrumb,
    [Select.name]: Select,
    [Option.name]: Option,
    [Table.name]: Table,
    [Button.name]: Button,
    [RadioButton.name]: RadioButton,
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio,
    [DatePicker.name]: DatePicker,
    [TableColumn.name]: TableColumn,
    [Notification.name]: Notification,
  },
  data() {
    return {
      columnsInfo: [],
      getWidth: "100%",
      dataAdapter: new jqx.dataAdapter([]),
      token: this.$cookies.get("token"),
      mListRutasDespacho: [],
      mListControlesPorRuta: [],
      mListDespachosPanel: [],
      mListDespachosPanelAuxiliar: [],
      rowsToColor: [],
      isLoadingDespachoSalidaPanelBusqueda: true,
      fechaActualSalidasPanelDespacho: '',
      mListaUnidadesSalidasPanelDespacho: [],
      loadingTableUnidadesSalidasPanelBusquedaloading: false,
      optionsUnidadesSalidasPanelSalidas: [],
      itemUnidadSalidasPanelBusqueda: [],
      mListRutasFrecuencias: [],
      mSelectRutaSalidaPanelDespacho: null,
      mSelectRutaFrecuenciaPanelDespacho: null,
      modalSalidasTarjetaPanelDespacho: false,
      baseURlPDFPanelDespachoTarjetaSalida: null,
      selectedRowSalida: null,
      radioTipoDespacho: 3
    };
  },
  methods: {
    myGridOnRowSelect: function (event) {
      this.selectedRowSalida = event.args.row
      this.selectedRowSalida.HoraSaliProgSali_mF = this.getHoraSaliProgSali_mF(this.selectedRowSalida.idSali_m)
    },
    getHoraSaliProgSali_mF(id_salida) {

      for (var i = 0; i < this.mListDespachosPanel.length; i++) {
        if (this.mListDespachosPanel[i].idSali_m == id_salida) {
          return this.mListDespachosPanel[i].HoraSaliProgSali_mF
        }
      }

      return '1998-06-06 11:00:00'
    },
    showReporteLlegadaSAlida() {
      this.readDetalleSalidaDPanelBusqueda(this.selectedRowSalida, 1)
    },
    showReporteLlegadaSAlidaSalida() {
      this.readDetalleSalidaDPanelBusqueda(this.selectedRowSalida, 0)
    },
    async readFrecuenciasSalidasPanel() {
      this.mListRutasFrecuencias = []
      this.mSelectRutaFrecuenciaPanelDespacho = null

      var datos = await this.$axios.post(process.env.baseUrl + "/frecuencias_rutas", {
        token: this.token,
        ruta: this.mSelectRutaSalidaPanelDespacho
      })

      if (datos.data.status_code != 400) {
        this.mListRutasFrecuencias.push(...datos.data.data)
      }

    },
    initFechaActualSalidaDespachoPanel() {
      var fecha = new Date();
      var mes = fecha.getMonth() + 1;
      var day = fecha.getDate();
      var hora = fecha.getHours() < 10 ? '0' + fecha.getHours() : fecha.getHours()
      var minutes = fecha.getMinutes() < 10 ? '0' + fecha.getMinutes() : fecha.getMinutes()

      var format =
        fecha.getFullYear() +
        "-" +
        (mes < 10 ? "0" + mes : mes) +
        "-" +
        (day < 10 ? "0" + day : day);
      console.log(format)
      this.fechaActualSalidasPanelDespacho = format + " " + hora + ":" + minutes + ":00";
    },
    myGridOnContextMenu: function () {
      return false;
    },
    myGridOnRowClick: function (event) {
      if (event.args.rightclick) {
        this.$refs.myGridDespachoPanel.selectrow(event.args.rowindex);
        let scrollTop = window.scrollY;
        let scrollLeft = window.scrollX;
        this.$refs.myMenu.open(parseInt(event.args.originalEvent.clientX) + 5 + scrollLeft, parseInt(event.args.originalEvent.clientY) + 5 + scrollTop);
        return false;
      }
    },
    myMenuOnItemClick: function (event) {
      let args = event.args;
      let rowindex = this.$refs.myGridDespachoPanel.getselectedrowindex();
      if (args.innerHTML == 'Edit Selected Row') {
        this.editrow = rowindex;
        this.$refs.myWindow.position = { x: 60, y: 60 };
        // get the clicked row's data and initialize the input fields.
        let dataRecord = this.$refs.myGridDespachoPanel.getrowdata(this.editrow);
        this.$refs.firstName.value = dataRecord.firstname;
        this.$refs.lastName.value = dataRecord.lastname;
        this.$refs.product.value = dataRecord.productname;
        this.$refs.quantity.decimal = dataRecord.quantity;
        this.$refs.price.decimal = dataRecord.price;
        // show the popup window.
        this.$refs.myWindow.open();
      }
      else {
        let rowid = this.$refs.myGridDespachoPanel.getrowid(rowindex);
        this.$refs.myGridDespachoPanel.deleterow(rowid);
      }
    },
    async createHeaderTable(oRuta) {
      this.isLoadingDespachoSalidaPanelBusqueda = true

      var datos = await this.$axios.post(process.env.baseUrl + "/readSalidasPanelDespacho", {
        token: this.token,
        ruta: oRuta.LetrRuta,
        fecha: getFecha_dd_mm_yyyy(this.fechaActualSalidasPanelDespacho)
      })

      this.mListDespachosPanel.push(...datos.data.datos)
      this.mListDespachosPanelAuxiliar.push(...datos.data.datos)

      this.$refs.myGridDespachoPanel.beginupdate();
      this.columnsInfo = []

      this.columnsInfo[0] = { text: 'Unidad', datafield: 'CodiVehiSali_m', width: 70 }
      this.columnsInfo[1] = { text: 'H.Salida', datafield: 'HoraSaliProgSali_m', width: 90 }
      this.columnsInfo[2] = { text: 'H.Llegada', datafield: 'HoraLlegProgSali_m', width: 90 }
      this.columnsInfo[3] = { text: 'N° Salida', datafield: 'idSali_m', width: 100 }
      this.columnsInfo[4] = { text: 'Estado', datafield: 'EstaSali_m', width: 150 }
      this.columnsInfo[5] = { text: 'Vuelta', datafield: 'NumeVuelSali_m', width: 70 }
      this.columnsInfo[6] = { text: 'Falta', datafield: 'SumaMinuPosiSali_m', width: 50 }
      this.columnsInfo[7] = { text: 'Inte.', datafield: 'Intervalo', width: 40 }
      this.columnsInfo[8] = { text: 'Frecuencia Salida', datafield: 'DescFrec', width: 250 }
      this.columnsInfo[9] = { text: 'Multa', datafield: 'MontInfrUnidSali_m', width: 100 }
      this.columnsInfo[10] = { text: 'KM/H', datafield: 'VeloMaxiSali_m', width: 100 }
      this.columnsInfo[11] = { text: 'Chofer', datafield: 'Country23', width: 150 }


      this.$refs.myGridDespachoPanel.setOptions
        ({
          source: this.createBodyDespacho(this.mListDespachosPanelAuxiliar),
          columns: this.columnsInfo
        });
      this.isLoadingDespachoSalidaPanelBusqueda = false
      this.$refs.myGridDespachoPanel.endupdate();
    },
    cellBeginEditEvent: function (event) {
      let args = event.args;
      this.$refs.beginEdit.innerHTML = 'Event Type: cellbeginedit, Column: ' + args.datafield + ', Row: ' + (1 + args.rowindex) + ', Value: ' + args.value;
    },
    cellEndEditEvent: function (event) {
      let args = event.args;
      this.$refs.endEdit.innerHTML = 'Event Type: cellendedit, Column: ' + args.datafield + ', Row: ' + (1 + args.rowindex) + ', Value: ' + args.value;
    },
    activeRutaDespacho(ruta) {
      console.log(ruta)
      $("#" + ruta.LetrRuta).addClass("activeRutaDespacho")
      this.createHeaderTable(ruta)
    },
    removeAllRutaNoSelect() {
      for (var i = 0; i < this.mListRutasDespacho.length; i++) {
        var ruta = "#" + this.mListRutasDespacho[i].LetrRuta
        console.log(ruta)
        $(ruta).removeClass("activeRutaDespacho")
      }
    },
    async initRutasDespacho() {
      try {
        var datos = await this.$axios.post(
          process.env.baseUrlPanel + "/rutes",
          {
            token: this.token,
          }
        );

        if (datos.data.status_code == 200) {
          this.mListRutasDespacho.push(...datos.data.data);
          this.activeRutaDespacho(this.mListRutasDespacho[0])
        } else if (datos.data.status_code == 300) {
          Notification.info({
            title: "Rutas Despacho",
            message: "No existen Rutas Despacho registradas",
          });
        } else {
          Notification.error({
            title: "Error Api Rutas Despacho",
            message: datos.data.msm,
          });
        }
      } catch (error) {
        Notification.error({ title: "Error Catch", msm: error.toString() });
      }
    },
    createBodyDespacho(despachos) {
      var tiempoString = ''
      var minutosString = ''
      var mListHora = []
      var inter = 0
      for (var hora = 4; hora <= 23; hora++) {
        tiempoString = (hora < 10 ? "0" + hora : hora)
        for (var minuto = 0; minuto <= 59; minuto++) {

          minutosString = (minuto < 10 ? "0" + minuto : minuto)
          var HS = tiempoString + ":" + minutosString + ":00"
          var obj = this.getObjetoSalidaDespacho(HS)
          var objD = (obj == null) ? {
            LetraRutaSali_m: "",
            CodiVehiSali_m: "",
            idSali_m: '',
            HoraSaliProgSali_m: HS,
            HoraLlegProgSali_m: "",
            EstaSali_m: '',
            idFrecSali_m: '',
            DescFrec: "",
            MontInfrUnidSali_m: "",
            VeloMaxiSali_m: '',
            NumeVuelSali_m: '',
            SumaMinuPosiSali_m: '',
            Intervalo: ""
          } : (obj)

          if (obj == null) {
            inter++
          } else {
            objD.Intervalo = inter
            inter = 0
          }


          mListHora.push(objD)

        }
      }
      return {
        localdata: mListHora,
        datatype: 'array',
        datafields: [{ name: 'LetraRutaSali_m', type: 'string' },
        { name: 'CodiVehiSali_m', type: 'string' },
        { name: 'idSali_m', type: 'string' },
        { name: 'HoraSaliProgSali_m', type: 'string' },
        { name: 'HoraLlegProgSali_m', type: 'string' },
        { name: 'EstaSali_m', type: 'string' },
        { name: 'idFrecSali_m', type: 'string' },
        { name: 'Intervalo', type: 'string' },
        { name: 'DescFrec', type: 'string' },
        { name: 'EstaSali_m', type: 'string' },
        { name: 'MontInfrUnidSali_m', type: 'string' },
        { name: 'VeloMaxiSali_m', type: 'string' },
        { name: 'NumeVuelSali_m', type: 'string' },
        { name: 'SumaMinuPosiSali_m', type: 'string' }]
      }
    },
    getObjetoSalidaDespacho(tiempo) {
      if (this.mListDespachosPanelAuxiliar.length > 0) {
        for (var i = 0; i < this.mListDespachosPanelAuxiliar.length; i++) {

          if (tiempo == this.mListDespachosPanelAuxiliar[i].HoraSaliProgSali_m) {
            console.log("ENCONTRADO")
            var obj = this.mListDespachosPanelAuxiliar[i]
            obj.Intervalo = 450
            obj.EstaSali_m = obj.EstaSali_m == 4 ? 'ANULADO' : (obj.EstaSali_m == 1 || obj.EstaSali_m == 0) ? 'DIFERIDO' : obj.EstaSali_m == 2 ? 'EN RUTA' : 'FINALIZADO'
            this.mListDespachosPanelAuxiliar.splice(i, 1)
            return obj
          }
        }
      }
      return null
    },
    lecturaDespacho(ruta) {
      this.removeAllRutaNoSelect()
      this.activeRutaDespacho(ruta)
    },
    handleLike(index, row) { },
    handleEdit(index, row) { },
    handleDelete(index, row) { },
    deleteRow(row) { },
    async readAllUnidadesSalidasPanelBusqueda() {
      var datos = await this.$axios.post(process.env.baseUrl + "/unidades", {
        token: this.token,
      });

      if (datos.data.status_code == 200) {
        for (var i = 0; i < datos.data.data.length; i++) {
          var obj = datos.data.data[i];
          obj.value = obj.CodiVehi;
          this.mListaUnidadesSalidasPanelDespacho.push(obj);
        }
      }
    },
    remoteMethodUnidadesSalidasPanelBusqueda(query) {
      if (query !== "") {
        this.loadingTableUnidadesSalidasPanelBusquedaloading = true;
        setTimeout(() => {
          this.loadingTableUnidadesSalidasPanelBusquedaloading = false;
          this.optionsUnidadesSalidasPanelSalidas =
            this.mListaUnidadesSalidasPanelDespacho.filter((item) => {
              return (
                item.CodiVehi.toLowerCase().indexOf(query.toLowerCase()) > -1
              );
            });
        }, 200);
      } else {
        this.optionsUnidadesSalidasPanelSalidas = [];
      }
    },
    async readDetalleSalidaDPanelBusqueda(salida, bandera) {
      //console.log(salida)

      this.modalSalidasTarjetaPanelDespacho = true

      var datos = await this.$axios.post(process.env.baseUrl + "/detalleSalida", {
        token: this.token,
        idsalida: salida.idSali_m
      })

      const pdfDoc = await PDFDocument.create()
      const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)
      const TimesRomanBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold)

      const page = pdfDoc.addPage()
      page.setWidth(230)
      const { width, height } = page.getSize()
      const fontSize = 10

      page.drawText("     " + this.$cookies.get("nameEmpresa").toUpperCase().substring(0, 28), {
        x: 20,
        y: height - 2 * fontSize,
        size: fontSize,
        font: TimesRomanBold,
        color: rgb(0, 0, 0),
      })

      page.drawText("Unidad       " + "Salida #" + salida.idSali_m + "         Ruta     Vue.", {
        x: 20,
        y: height - 3.5 * fontSize,
        size: fontSize,
        font: TimesRomanBold,
        color: rgb(0, 0, 0),
      })

      page.drawText("    " + salida.CodiVehiSali_m + "          "
        + FechaStringToHour(salida.HoraSaliProgSali_mF) + "         "
        + (salida.LetraRutaSali_m.length > 2 ? salida.LetraRutaSali_m : "  " + salida.LetraRutaSali_m) + "           " + salida.NumeVuelSali_m, {
        x: 20,
        y: height - 4.5 * fontSize,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      })

      page.drawText('FREC : ' + salida.DescFrec.substring(0, 26), {
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

      page.drawText("RELOJ             PROG   MARC  FALT  PEN", {
        x: 20,
        y: height - 7.6 * fontSize,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      })

      page.drawText("---------------------------------------------------------", {
        x: 20,
        y: height - 8.6 * fontSize,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      })
      var heightAux = 9.7
      var sumFalt = 0
      var penFalt = 0
      for (var i = 0; i < datos.data.data.length; i++) {

        heightAux = heightAux + 1
        if (bandera == 1) {
          if (datos.data.data[i].FaltSali_d > 0) {
            sumFalt = sumFalt + datos.data.data[i].FaltSali_d
          }

          if (datos.data.data[i].isCtrlRefeSali_d == 0) {
            var pen = parseFloat(datos.data.data[i].PenaCtrlSali_d)
            penFalt = penFalt + pen
          }
        }

        var space = "                       "
        /**datos.data.data[i].DescCtrlSali_d.substring(0, 9)**/
        var texto = ''
        if (bandera == 1) {
          texto = space + "  " + datos.data.data[i].HoraProgSali_d.substring(0, 5) + "   "
            + (datos.data.data[i].HoraMarcSali_d == '00:00:00' ? '              ' : datos.data.data[i].HoraMarcSali_d) + "    " + (datos.data.data[i].HoraMarcSali_d == '00:00:00' ? '    ' : datos.data.data[i].FaltSali_d) + "        "
            + (datos.data.data[i].isCtrlRefeSali_d == 1 ? "REF" : datos.data.data[i].PenaCtrlSali_d == '0.00' ? '      ' : datos.data.data[i].PenaCtrlSali_d)

        } else {
          texto = space + "  " + datos.data.data[i].HoraProgSali_d.substring(0, 5)
        }

        page.drawText(texto, {
          x: 20,
          y: height - heightAux * 9,
          size: 9,
          color: rgb(0, 0, 0),
        })

        page.drawText(datos.data.data[i].DescCtrlSali_d.substring(0, 8), {
          x: 20,
          y: height - (heightAux) * 9,
          size: 9,
          color: rgb(0, 0, 0),
        })


      }
      heightAux = heightAux - 0.5


      page.drawText("---------------------------------------------------------", {
        x: 20,
        y: height - (heightAux - 0.2) * fontSize,
        size: fontSize,
        color: rgb(0, 0, 0),
      })

      /*page.drawText("Chofer : ", {
        x: 20,
        y: height - (heightAux + 1) * fontSize,
        size: 8.5,
        color: rgb(0, 0, 0),
      })

      page.drawText("Cobrador : ", {
        x: 20,
        y: height - (heightAux + 2) * fontSize,
        size: 8.5,
        color: rgb(0, 0, 0),
      })*/

      /*page.drawText("Adelante : " + salida.adelantoTime, {
        x: 20,
        y: height - (heightAux + 3) * fontSize,
        size: 8.5,
        color: rgb(0, 0, 0),
      })

      page.drawText("Atrasos : " + salida.atrasoTime, {
        x: 20,
        y: height - (heightAux + 4) * fontSize,
        size: 8.5,
        color: rgb(0, 0, 0),
      })*/

      let bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

      page.drawText("TOTAL Faltas  : +" + sumFalt, {
        x: 20,
        y: height - (heightAux + 1) * fontSize,
        size: 10,
        font: bold,
        color: rgb(0, 0, 0),
      })

      page.drawText("TOTAL Dinero  : " + Number(penFalt).toFixed(2), {
        x: 20,
        y: height - (heightAux + 2) * fontSize,
        size: 10,
        font: bold,
        color: rgb(0, 0, 0),
      })

      this.baseURlPDFPanelDespachoTarjetaSalida = await pdfDoc.saveAsBase64({ dataUri: true });
    }
  },
  mounted() {
    this.readAllUnidadesSalidasPanelBusqueda()
    this.initRutasDespacho()
    /*document.addEventListener('contextmenu', event => event.preventDefault());
    document.oncontextmenu = function () { return false }*/
    this.initFechaActualSalidaDespachoPanel()
  },
};
</script>
<style>


.container-rutas::-webkit-scrollbar {
    display: none;
}

.containerTiposDespachos {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.card-bodyTopOpcionesRPagosVehiculoPRoduccion {
  padding-top: 0.25rem !important;
}

.cardSelectRubrosEstadosPagosVehiculoProduccionContainer {
  display: flex;
  justify-content: space-between;
}


.cardTextoRPagosVehiculoProduccion {
  display: flex;
  align-items: center;
}

.en-ruta {
  background-color: hsla(226, 88%, 61%, 0.301);
}

.anulados {
  background-color: rgba(252, 143, 143, 0.692);
}

.diferidas {
  background-color: hsla(115, 100%, 59%, 0.301)
}

.itemrutaDespacho {
  padding: 0.75rem 1rem;
  margin-right: 0.25rem;
  color: #5e72e4;
  font-weight: 500;
  font-size: 0.875rem;
  box-shadow: 0 4px 6px rgb(50 50 93 / 11%), 0 1px 3px rgb(0 0 0 / 8%);
  background-color: #fff;
  transition: all 0.15s ease;
  margin-bottom: 0.5rem;
  cursor: pointer;
  border-radius: 0.375rem;
}

.activeRutaDespacho {
  background-color: #5e72e4;
  color: white;
}

.nav-item-personalizado {
  padding: 0rem 0.25rem 0rem 0.25rem !important;
  margin-bottom: 0.25rem !important;
}

.alineacion-vertical-tabs {
  display: flex;
  flex-direction: column;
}

.card-body-sinpadding {
  padding: 0rem !important;
}

.card-sinborderPanel {
  border: 0rem !important;
  border-radius: 0rem !important;
  height: 100%;
  background-color: transparent;
}

.col_personalizado {
  flex-basis: 0;
  flex-grow: 1;
  max-width: 100%;
  padding: 0rem !important;
}

.card-Calendar {
  height: calc(100vh - 6rem);
  scroll-behavior: auto;
}

.container-rutas {
  height: auto;
  max-width: 8rem;
  min-width: 8rem;
  overflow: auto;
}

.container-calendario {
  height: 100%;
}

.containerTablero {
  background-color: #2dce89;
  height: calc(100vh - 13rem);
  display: flex;
}

.no-border-card .card-footer {
  border-top: 0;
}

.nav-pills .nav-item {
  padding-right: 0.25rem !important;
  padding-left: 0.25rem;
  margin-top: 0.5rem;
}
</style>