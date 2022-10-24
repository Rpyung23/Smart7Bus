<template>
  <div class="content">
    <base-header>
      <div class="align-items-center py-3">

        <card class="no-border-card col" style="margin-bottom: 0.5rem"
          body-classes="px-0 pb-1 card-bodyTopOpcionesRPagosVehiculoPRoduccion cardSelecMinutosTarjetas"
          footer-classes="pb-2">
          <div class="cardTextoRPagosMinutosTarjetas">


            <el-select v-model="itemUnidadPanelProduccion" multiple filterable style="margin-right: 0.5rem" remote
              placeholder="Ingrese unidad" :remote-method="remoteMethodUnidadesPanelProduccionJustificacion"
              :loading="loadingTableUnidadesPanelProduccoionLoading">
              <el-option v-for="item in optionsUnidadesPanelProduccion" :key="item.CodiVehi" :label="item.CodiVehi"
                :value="item.CodiVehi">
              </el-option>
            </el-select>

            <el-date-picker type="date" placeholder="Select date and time" style="margin-right: 0.5rem;"
              v-model="fechaInicialReporteMinutosTarjetas">
            </el-date-picker>

            <el-date-picker type="date" placeholder="Select date and time" style="margin-right: 0.5rem;"
              v-model="fechaFinalReporteMinutosTarjetas">
            </el-date-picker>


          </div>

          <div class="cardSelecMinutosTarjetas">
            <div class="buttonsAdicionalesRMinutosTarjeta">
              <base-button icon type="primary" size="sm" @click="createPDFMinutosTarjetas()">
                <span class="btn-inner--icon"><i class="el-icon-search"></i></span>
              </base-button>
            </div>
          </div>
        </card>

        <!--<card class="no-border-card col" style="margin-bottom: 0.5rem"
          body-classes="px-0 pb-1 card-bodyTopOpcionesRPagosVehiculoPRoduccion cardSelecMinutosTarjetas"
          footer-classes="pb-2">
          <div class="cardSelectRubrosEstadosRPagosVehiculoProduccion">
            
          </div>

          <div class="cardTextoRPagosMinutosTarjetas">
            <strong style="color: dark; margin-right: 0.5rem">Recaudados : {{ mPagadoRPagosVehiculo }} $</strong>
            <strong style="color: lightseagreen; margin-right: 0.5rem">Descuentos : {{ mPendienteRPagosVehiculo }}
              $</strong>
            <strong style="color: green">Total : {{ mTotalRPagosVehiculo }} $</strong>
          </div>
        </card>-->

        <card class="no-border-card" style="margin-bottom: 0rem"
          body-classes="cardMinutosTarjetas card-bodyRPagosVehiculoProduccionPC px-0 pb-1" footer-classes="pb-2">
          <div>
            <iframe :src="baseURlPDFPanelProduccionMinutosTarjetas" style="width: 100%; height: 39rem"></iframe>
          </div>
        </card>




      </div>
    </base-header>
  </div>
</template>
<script>

import flatPicker from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import { PDFDocument, StandardFonts, rgb, PageSizes } from 'pdf-lib'
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
  Button
} from "element-ui";

import RouteBreadCrumb from "@/components/argon-core/Breadcrumb/RouteBreadcrumb";
import { BasePagination } from "@/components/argon-core";
import clientPaginationMixin from "~/components/tables/PaginatedTables/clientPaginationMixin";
import swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';
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
      token: this.$cookies.get("token"),
      fechaInicialReporteMinutosTarjetas: "",
      fechaFinalReporteMinutosTarjetas: "",
      mListaUnidadesPanelProduccion: [],
      optionsUnidadesPanelProduccion: [],
      itemUnidadPanelProduccion: [],
      baseURlPDFPanelProduccionMinutosTarjetas: "",
      loadingTableUnidadesPanelProduccoionLoading: false
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

    initFechaActualProduccionMinutosTarjetas() {
      var fecha = new Date();
      var mes = fecha.getMonth() + 1;
      var day = fecha.getDate();
      var format =
        fecha.getFullYear() +
        "-" +
        (mes < 10 ? "0" + mes : mes) +
        "-" +
        (day < 10 ? "0" + day : day);

      this.fechaInicialReporteMinutosTarjetas = format + " ";
      this.fechaFinalReporteMinutosTarjetas = format + " "
    },
    selectionChange(selectedRows) {
      this.selectedRows = selectedRows;
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
    async createPDFMinutosTarjetas() {

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

      var datos = await this.$axios.post(process.env.baseUrl + "/ProduccionMinutosTarjetasVueltas", {
        token: this.token,
        fechaI: getFecha_dd_mm_yyyy(this.fechaInicialReporteMinutosTarjetas),
        fechaF: getFecha_dd_mm_yyyy(this.fechaFinalReporteMinutosTarjetas),
        unidades: this.itemUnidadPanelProduccion.length > 0 ? this.itemUnidadPanelProduccion : '*',
        nameEmpresa: this.$cookies.get('nameEmpresa')
      })

      if (datos.data.status_code == 200) {
        console.log(datos.data.datos)
        this.baseURlPDFPanelProduccionMinutosTarjetas = "data:application/pdf;base64," + datos.data.datos
      } else {

        this.$notify({
        message: datos.data.msm,
        timeout: 3000,
        icon: "ni ni-check-bold",
        type:datos.data.msm,
      });

      }
      
      swal.close()

      /*var pdfDoc = await PDFDocument.create()
      var timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)
      var TimesRomanBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold)

      var page = pdfDoc.addPage(PageSizes.A4)
      
      var { width, height } = page.getSize()
      var fontSize = 10
      var _x = 35

      page.drawText("                                          "+this.$cookies.get("nameEmpresa").toUpperCase().substring(0, 28), {
        x: _x,
        y: height - 4 * fontSize,
        size: 15,
        font: TimesRomanBold,
        color: rgb(0, 0, 0),
      })

      page.drawText("REPORTE DE MINUTOS Y TARJETAS", {
        x: _x,
        y: height - 5.5 * fontSize,
        size: 13,
        font: TimesRomanBold,
        color: rgb(0, 0, 0)
      })
      
      var descuento = 11.4

      for(var i = 0;i<10;i++)
      {
        await this.createHeaderPDFMinutosTarjeta(page, _x, height, pdfDoc)
        var descuentoAux = await this.createBodyPDFMinutosTarjeta(page, _x, height, pdfDoc,descuento)
        descuento = descuentoAux
        if(descuento >= 89.80){
          page = pdfDoc.addPage(PageSizes.A4)
          descuento = 11.4
        }
      }

      console.log("HEIGTH A4 : "+descuentoAux)



      this.baseURlPDFPanelProduccionMinutosTarjetas = await pdfDoc.saveAsBase64({ dataUri: true });*/
    }
  }, mounted() {
    this.readUnidadesTableroProduccion()
    this.initFechaActualProduccionMinutosTarjetas()
  }
};
</script>
<style>

.cardMinutosTarjetas::-webkit-scrollbar{
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



.cardTextoRPagosMinutosTarjetas {
  display: flex;
  align-items: center;
  width: 60%;
}

.cardSelecMinutosTarjetas {
  display: flex;
  justify-content: space-between;
  align-items: center;
}


.no-border-card .card-footer {
  border-top: 0;
}

.card-bodyRPagosVehiculoProduccionPC {
  padding: 0rem !important;
  height: calc(100vh - 9.5rem);
  overflow: auto;
}

.card-bodyTopOpcionesRPagosVehiculoPRoduccion {
  padding-top: 0.25rem !important;
}
</style>