<template>
  <div class="content">
    <base-header>
      <div class="align-items-center py-3">
        <card class="no-border-card col" style="margin-bottom: 0.5rem"
          body-classes="px-0 pb-1 card-bodyTopOpcionesRPagosVehiculoPRoduccionPanelDespachoBusqueda cardSelectRubrosEstadosPagosVehiculoProduccionContainerPanelDespachoBusqueda"
          footer-classes="pb-2">
          <div class="cardTextoRPagosVehiculoProduccionPanelDespachoBusqueda">
            <!--el-select v-model="itemUnidadRSemanales" multiple filterable remote placeholder="Unidades"
              prefix-icon="ni ni-bus-front-12" style="margin-right: 0.5rem"
              :remote-method="remoteMethodUnidadesRecibosProduccion" :loading="loadingTableUnidadesSemanales">
              <el-option v-for="item in optionsUnidadesSemanales" :key="item.CodiVehi" :label="item.CodiVehi"
                :value="item.CodiVehi">
              </el-option>
            </el-select!-->

            <el-select style="margin-right: 0.5rem" collapse-tags v-model="itemRutasRSalidasSemanales" multiple
              placeholder="Rutas">
              <el-option v-for="item in mListaRutasSalidasSemanales" :key="item.LetrRuta" :label="item.DescRuta"
                :value="item.LetrRuta">
              </el-option>
            </el-select>

            <base-input addon-left-icon="ni ni-calendar-grid-58" style="margin-right: 0.5rem">
              <flat-picker slot-scope="{ focus, blur }" @on-open="focus" @on-close="blur" :config="{ allowInput: true }"
                format="yyyy/MM/dd" class="form-controlPersonal datepicker" v-model="fechaDia1SalidasPanelBusqueda">
              </flat-picker>
            </base-input>

            <base-input addon-left-icon="ni ni-calendar-grid-58" style="margin-right: 0.5rem" disabled>
              <flat-picker slot-scope="{ focus, blur }" @on-open="focus" @on-close="blur" :config="{ allowInput: true }"
                format="yyyy/MM/dd" class="form-controlPersonal datepicker" v-model="fechaDia2SalidasPanelBusqueda">
              </flat-picker>
            </base-input>
          </div>

          <div class="cardSelectRubrosEstadosPagosVehiculoProduccionContainerPanelDespachoBusqueda">
            <div class="buttonCenterEndDerecha">
              <base-button icon type="primary" size="sm" @click="readApiPenalidades()">
                <span class="btn-inner--icon"><i class="el-icon-search"></i></span>
              </base-button>

              <!--  <base-button type="danger" size="sm" v-if="mListDatosPenalidades.length > 0 ? true : false"
                @click="exportPdfRPenalidadesSemanales()" title="Exportar PDF">
                <span class="btn-inner--icon"><i class="ni ni-single-copy-04"></i></span>
              </base-button-->

              <download-excel v-if="mListDatosPenalidades.length > 0 ? true : false"
                class="btn btn-icon btn-fab btn-success btn-sm" outline :header="oheaderExcelRSalidasSemanales"
                title="Exportar a Excel" :data="mListDatosPenalidades" :fields="json_fields_excelRPenalidadesSemanales"
                :worksheet="WorksheetExcelRSalidasSemanales" :name="FileNameExcelRSalidasSemanales">
                <span class="btn-inner--icon"><i class="ni ni-collection"></i></span>
              </download-excel>
            </div>
          </div>
        </card>

        <card v-if="mListaGruposPenalidadesSemanales.length > 0" class="no-border-card col"
          style="margin-bottom: 0.5rem"
          body-classes="px-0 pb-1 card-bodyTopOpcionesRPagosVehiculoPRoduccionPanelDespachoBusqueda cardSelectRubrosEstadosPagosVehiculoProduccionContainerPanelDespachoBusqueda"
          footer-classes="pb-2">
          <div class="cardTextoRPagosVehiculoProduccionPanelDespachoBusqueda">
            <el-select style="margin-right: 0.5rem" collapse-tags v-model="itemGruposPenalidadesSemanales" multiple
              placeholder="Grupos">
              <el-option v-for="item in mListaGruposPenalidadesSemanales" :key="item.id" :label="item.descripcion"
                :value="item.id">
              </el-option>
            </el-select>
          </div>

          <div class="cardSelectRubrosEstadosPagosVehiculoProduccionContainerPanelDespachoBusqueda">
            <div class="buttonCenterEndDerecha"></div>
          </div>
        </card>


        <card class="no-border-card" body-classes="card_body_tO"
          style="height: calc(100vh - 9.5rem);margin-bottom: 0rem;">
          <embed id="iframeContainerTablaOperacional" :src="oBase64IndicadoresCalidad" type="application/pdf"
            width="100%" height="100%" />
        </card>

      </div>
    </base-header>

  </div>
</template>
<script>
import { validaRangoFechaNoMas30Dias, getFecha_dd_mm_yyyy } from "../../util/fechas";
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
  Checkbox,
  CheckboxButton,
  CheckboxGroup,
  Popover,
  Button,
  Loading,
} from "element-ui";
import { getBase64LogoReportes } from "../../util/logoReport";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import RouteBreadCrumb from "@/components/argon-core/Breadcrumb/RouteBreadcrumb";
import { BasePagination } from "@/components/argon-core";
import clientPaginationMixin from "~/components/tables/PaginatedTables/clientPaginationMixin";
import swal from "sweetalert2";
import Tabs from "@/components/argon-core/Tabs/Tabs";
import TabPane from "@/components/argon-core/Tabs/Tab";
import { FechaStringToHour } from "../../util/fechas";

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
    [Checkbox.name]: Checkbox,
    [CheckboxButton.name]: CheckboxButton,
    [CheckboxGroup.name]: CheckboxGroup,
    [Popover.name]: Popover,
    [Button.name]: Button,
  },
  data() {
    return {
      token: this.$cookies.get("token"),
      fechaDia1SalidasPanelBusqueda: "",
      modalSalidasPenalidadesSemanales: false,
      tableColumnPenalidades: [],
      mListDatosPenalidades: [],
      modalSalidasPenalidadesSemanales: false,
      loadingPenalidadesSemanales: false,
      mListaUnidadesSemanales: [],
      optionsUnidadesSemanales: [],
      loadingTableUnidadesSemanales: false,
      itemUnidadRSemanales: [],
      mListaRutasSalidasSemanales: [],
      itemRutasRSalidasSemanales: [],
      mListaGruposPenalidadesSemanales: [],
      itemGruposPenalidadesSemanales: [],
      fechaDia2SalidasPanelBusqueda: "",
      json_fields_excelRPenalidadesSemanales: {
        " ":"No",
        "  ": "P",
        "   ": "CodiVehiSali_m",
        "    ": "codigo_chofer",
        "     ": "HoraSaliProgSali_m",
        "      ": "HoraLlegProgSali_m",
        "       ": "TiempoVuelta",
        "        ": "Intervalo",
        "         ": "TDespacho",
      },
      WorksheetExcelRSalidasSemanales: "",
      FileNameExcelRSalidasSemanales: "",
      oheaderExcelRSalidasSemanales: "",
    };
  },
  methods: {
    showModalPenalidadesSemanales(row) {
      console.log(row);
      this.modalSalidasPenalidadesSemanales = true;
      this.readDetallePenalidadesSemanales(row)
    },
    async readAllRutasSalidasSEmanales() {
      this.mListaRutasSalidasSemanales = [];

      var datos = await this.$axios.post(process.env.baseUrl + "/rutes", {
        token: this.token,
        tipo: 1,
      });

      if (datos.data.status_code == 200) {
        this.mListaRutasSalidasSemanales.push(...datos.data.data);
      }
    },
    getNombresRutasRDespachosGenerados() {
      var mlist = [];
      for (var j = 0; j < this.itemRutasRSalidasSemanales.length; j++) {
        for (var i = 0; i < this.mListaRutasSalidasSemanales.length; i++) {
          if (
            this.itemRutasRSalidasSemanales[j] ==
            this.mListaRutasSalidasSemanales[i].LetrRuta
          ) {
            mlist.push(this.mListaRutasSalidasSemanales[i].DescRuta);
          }
        }
      }
      return mlist;
    },

    remoteMethodUnidadesRecibosProduccion(query) {
      if (query !== "") {
        this.loadingTableUnidadesSemanales = true;
        setTimeout(() => {
          this.loadingTableUnidadesSemanales = false;
          this.optionsUnidadesSemanales = this.mListaUnidadesSemanales.filter(
            (item) => {
              return (
                item.CodiVehi.toLowerCase().indexOf(query.toLowerCase()) > -1
              );
            }
          );
        }, 200);
      } else {
        this.optionsUnidadesSemanales = [];
      }
    },
    async readAllUnidadesSalidasSemanales() {
      var datos = await this.$axios.post(process.env.baseUrl + "/unidades", {
        token: this.token,
      });

      console.log(datos.data);

      if (datos.data.status_code == 200) {
        for (var i = 0; i < datos.data.data.length; i++) {
          var obj = datos.data.data[i];
          obj.value = obj.CodiVehi;
          this.mListaUnidadesSemanales.push(obj);
        }
      }
    },
    initPrimerDiaSemanaActualSalidaBusquedaPanel() {
      var fecha = new Date();
      var mes = fecha.getMonth() + 1;
      var day = fecha.getDate();
      var format =
        fecha.getFullYear() +
        "-" +
        (mes < 10 ? "0" + mes : mes) +
        "-" +
        (day < 10 ? "0" + day : day);

      this.fechaDia1SalidasPanelBusqueda = format;
      this.fechaDia2SalidasPanelBusqueda = format;
    },
    async readApiPenalidades() {
      this.mListDatosPenalidades = [];
      this.loadingPenalidadesSemanales = true;

      if (!validaRangoFechaNoMas30Dias(getFecha_dd_mm_yyyy(this.fechaDia1SalidasPanelBusqueda),
        getFecha_dd_mm_yyyy(this.fechaDia2SalidasPanelBusqueda))) {
        Notification.warning({
          title: "RAGO MAXIMO 31 DIAS",
          message: 'SOLO SE PERMITE UN MAXIMO DE 31 DIAS',
          duration: 2000,
        });
        return
      }

      let iframe = document.getElementById("iframeContainerTablaOperacional");
      iframe.src = "";
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
                  `,
      });

      this.oBase64IndicadoresCalidad = "";

      try {
        var obj = {
          token: this.token,
          fechaI: this.fechaDia1SalidasPanelBusqueda,
          fechaF: this.fechaDia2SalidasPanelBusqueda,
          unidades:
            this.itemUnidadRSemanales.length <= 0
              ? "*"
              : this.itemUnidadRSemanales,
          rutas:
            this.itemRutasRSalidasSemanales.length <= 0
              ? "*"
              : this.itemRutasRSalidasSemanales,
        };

        console.log(obj);

        var datos = await this.$axios.post(
          process.env.baseUrl + "/tablaOperacional",
          obj
        );

        console.log(datos.data);
        if (datos.data.status_code == 200) {
          this.mListDatosPenalidades.push(...datos.data.datos);
          this.exportPdfRPenalidadesSemanales();
          this.exportExcel();
        } else {
          Notification.warning({
            title: "Reporte de Tabla Operacional",
            message: datos.data.msm,
          });
        }

      } catch (error) {
        Notification.error({
          title: "Reporte de Tabla Operacional",
          message: error.toString(),
        });
        console.log(error);
      }
      swal.close();
      this.loadingPenalidadesSemanales = false;
    },

    exportPdfRPenalidadesSemanales() {
      // Define los encabezados estáticos
      var empresa = [
        {
          text: "Operadora : " + this.$cookies.get("nameEmpresa"),
          fontSize: 11,
          alignment: "left",
        },
      ];

      var ruta = [
        {
          text:
            "Rutas : " +
            (this.itemRutasRSalidasSemanales.length <= 0
              ? "TODAS LAS RUTAS"
              : this.getNombresRutasRDespachosGenerados(
                this.itemRutasRSalidasSemanales
              )),
          fontSize: 11,
          alignment: "left",
        },
      ];

      var desde_hasta = [
        {
          text:
            "Fecha : " +
            this.fechaDia1SalidasPanelBusqueda +
            " hasta " +
            this.fechaDia2SalidasPanelBusqueda,
          fontSize: 11,
          alignment: "left",
        },
      ];

      // Agrupa los datos por fecha
      var datosPorFecha = this.mListDatosPenalidades.reduce((acc, item) => {
        let fecha = item.HoraSaliProgSali_mDate; // Suponiendo que tienes la fecha en el formato YYYY-MM-DD
        if (!acc[fecha]) acc[fecha] = [];
        acc[fecha].push(item);
        return acc;
      }, {});

      // Define el contenido del PDF
      var content = [
        {
          layout: "noBorders",
          table: {
            headerRows: 0,
            widths: [450, 450, 450],
            body: [empresa, desde_hasta, ruta],
          },
        },
      ];

      // Itera sobre las fechas agrupadas
      Object.keys(datosPorFecha).forEach(fecha => {
        var rutaDatos = datosPorFecha[fecha];
        var rutas = [...new Set(rutaDatos.map(item => item.LetraRutaSali_m))]; // Obtener rutas únicas para ese día

        // Agrega la fecha como título en el PDF
        content.push([
          { text: "Fecha: " + fecha, fontSize: 12, bold: true, fillColor: "#039BC4", color: "white", alignment: "center", colSpan: 9 },
          {}, {}, {}, {}, {}, {}, {}, {}
        ]);

        // Itera sobre cada ruta del día
        rutas.forEach(ruta => {
          var rutaDatosPorRuta = rutaDatos.filter(item => item.LetraRutaSali_m === ruta);
          var rutaDescripcion = rutaDatosPorRuta.length > 0 ? rutaDatosPorRuta[0].DescRutaSali_m : "Descripción no disponible";

          var mList = [];
          mList.push([
            {
              text: "Tipo de Día: " + (
                rutaDatosPorRuta[0].tipo_dia === "t" ? "Típico" :
                  rutaDatosPorRuta[0].tipo_dia === "s" ? "Sábado" :
                    rutaDatosPorRuta[0].tipo_dia === "d" ? "Domingo" : ""
              ),
              fontSize: 12,
              bold: true,
              fillColor: "#039BC4",
              color: "white",
              alignment: "center",
              colSpan: 9,
            },
            {}, {}, {}, {}, {}, {}, {}, {}
          ]);

          mList.push([
            {
              text: "Día: " + fecha,
              fontSize: 12,
              bold: true,
              fillColor: "#039BC4",
              color: "white",
              alignment: "center",
              colSpan: 9,
            },
            {}, {}, {}, {}, {}, {}, {}, {}
          ]);

          mList.push([
            {
              text: "Ruta: " + rutaDescripcion,
              fontSize: 12,
              bold: true,
              fillColor: "#039BC4",
              color: "white",
              alignment: "center",
              colSpan: 9,
            },
            {}, {}, {}, {}, {}, {}, {}, {}
          ]);

          mList.push([
            { text: "No", fontSize: 8.5, bold: true, fillColor: "#039BC4", color: "white", alignment: "center" },
            { text: "Tipo", fontSize: 8.5, bold: true, fillColor: "#039BC4", color: "white", alignment: "center" },
            { text: "No Habilitación", fontSize: 8.5, bold: true, fillColor: "#039BC4", color: "white", alignment: "center" },
            { text: "Código de Conductor", fontSize: 8.5, bold: true, fillColor: "#039BC4", color: "white", alignment: "center" },
            { text: "F. Inicial", fontSize: 8.5, bold: true, fillColor: "#039BC4", color: "white", alignment: "center" },
            { text: "F. Final", fontSize: 8.5, bold: true, fillColor: "#039BC4", color: "white", alignment: "center" },
            { text: "C. Viaje", fontSize: 8.5, bold: true, fillColor: "#039BC4", color: "white", alignment: "center" },
            { text: "Intervalo", fontSize: 8.5, bold: true, fillColor: "#039BC4", color: "white", alignment: "center" },
            { text: "T. Despacho", fontSize: 8.5, bold: true, fillColor: "#039BC4", color: "white", alignment: "center" },
          ]);

          rutaDatosPorRuta.forEach((item, i) => {
            var horaSali = item.HoraSaliProgSali_m.split(' ')[1]; // 'HH:mm:ss'
            var obj = [
              { text: i + 1, fontSize: 8.5, alignment: "center" },
              { text: "P", fontSize: 8.5, alignment: "center" },
              { text: item.CodiVehiSali_m, fontSize: 8.5, alignment: "center" },
              { text: item.codigo_chofer, fontSize: 8.5, alignment: "center" },
              { text: horaSali, fontSize: 8.5, alignment: "center" },
              { text: item.HoraLlegProgSali_m, fontSize: 8.5, alignment: "center" },
              { text: item.TiempoVuelta, fontSize: 8.5, alignment: "center" },
              { text: item.Intervalo, fontSize: 8.5, alignment: "center" },
              { text: item.TDespacho, fontSize: 8.5, alignment: "center" },
            ];
            mList.push(obj);
          });

          content.push({
            table: {
              headerRows: 0,
              widths: [35, 35, 50, 85, 50, 50, 50, 48, 45],
              body: mList,
            },
          });

          content.push({ text: "", margin: [0, 10] }); // Salto de línea para separar tablas
        });
      });

      var docDefinition = {
        pageSize: "A4",
        //pageOrientation: "landscape",
        pageMargins: [35, 80, 40, 60],
        header: {
          margin: 15,
          columns: [
            {
              image: getBase64LogoReportes(this.$cookies.get("empresa")),
              width: 100,
              height: 50,
              margin: [30, 0, 0, 0],
            },
            {
              layout: "noBorders",
              table: {
                widths: ["*"],
                body: [
                  [
                    {
                      text: "TABLA OPERACIONAL",
                      alignment: "center",
                      fontSize: 16,
                      bold: true,
                    },
                  ],
                ],
              },
            },
          ],
        },
        content: content,
      };

      var pdfDocGenerator = pdfMake.createPdf(docDefinition);
      pdfDocGenerator.getBlob((blob) => {
        var pdfUrl = URL.createObjectURL(blob);
        let iframe = document.getElementById("iframeContainerTablaOperacional");
        iframe.src = pdfUrl;
      });
    },

    exportExcel() {
      this.WorksheetExcelRSalidasSemanales = "RTO_" + Date.now();
      this.FileNameExcelRSalidasSemanales = "TablaOperacional_" + Date.now() + ".xls";

      this.oheaderExcelRSalidasSemanales = [
        "TABLA OPERACIONAL",
        "Operadora: "+ this.$cookies.get("nameEmpresa"),
        "Fechas : " + this.fechaDia1SalidasPanelBusqueda + " hasta " + this.fechaDia2SalidasPanelBusqueda,
        "Unidades : " + (this.itemUnidadRSemanales.length <= 0 ? "TODAS LAS UNIDADES" : this.itemUnidadRSemanales),
        "Rutas : " + (this.itemRutasRSalidasSemanales.length <= 0 ? "TODAS LAS RUTAS" : this.getNombresRutasRDespachosGenerados(this.itemRutasRSalidasSemanales)),
      ];

      let newExcelData = [];

      // Agrupa los datos por fecha
      let datosPorFecha = this.mListDatosPenalidades.reduce((acc, item) => {
        let fecha = item.HoraSaliProgSali_m.split(" ")[0]; // Suponiendo que la fecha está en formato 'YYYY-MM-DD HH:mm:ss'
        if (!acc[fecha]) acc[fecha] = [];
        acc[fecha].push(item);
        return acc;
      }, {});

      // Procesar los datos agrupados por fecha
      Object.keys(datosPorFecha).forEach(fecha => {
        let rutaDatos = datosPorFecha[fecha];
        let rutas = [...new Set(rutaDatos.map(item => item.LetraRutaSali_m))]; // Obtener rutas únicas

        // Obtener el tipo de día basado en el primer registro de la fecha
        let tipoDiaTexto = "";
        if (rutaDatos.length > 0) {
          const tipoDia = rutaDatos[0].tipo_dia;
          tipoDiaTexto = tipoDia === "t" ? "Típico" : tipoDia === "s" ? "Sábado" : tipoDia === "d" ? "Domingo" : "Desconocido";
        }


        // Procesar cada ruta dentro de la fecha
        rutas.forEach(ruta => {
          let rutaDatosPorRuta = rutaDatos.filter(item => item.LetraRutaSali_m === ruta);
          let rutaDescripcion = rutaDatosPorRuta.length > 0 ? rutaDatosPorRuta[0].DescRutaSali_m : "Descripción no disponible";
          // Agregar un título para el tipo de día
          newExcelData.push({
            "":"No",
            "P": "",
            "CodiVehiSali_m": "Tipo de Día:",
            "codigo_chofer": tipoDiaTexto,
            "HoraSaliProgSali_m": "",
            "HoraLlegProgSali_m": "",
            "TiempoVuelta": "",
            "Intervalo": "",
            "TDespacho": ""
          });

          // Agregar un título para la fecha
          newExcelData.push({
            "":"No",
            "P": "",
            "CodiVehiSali_m": "Día: ",
            "codigo_chofer": fecha,
            "HoraSaliProgSali_m": "",
            "HoraLlegProgSali_m": "",
            "TiempoVuelta": "",
            "Intervalo": "",
            "TDespacho": ""
          });

          // Agregar un título para la ruta
          newExcelData.push({
            "No":"",
            "P": "",
            "CodiVehiSali_m": "Ruta:",
            "codigo_chofer": rutaDescripcion,
            "HoraSaliProgSali_m": "",
            "HoraLlegProgSali_m": "",
            "TiempoVuelta": "",
            "Intervalo": "",
            "TDespacho": ""
          });

          newExcelData.push({
            "No":"No",
            "P": "Tipo",
            "CodiVehiSali_m": "No Habilitación",
            "codigo_chofer": "Código de Conductor",
            "HoraSaliProgSali_m": "F. Inicial ",
            "HoraLlegProgSali_m": "F. Final",
            "TiempoVuelta": "C. Viaje ",
            "Intervalo": "Intervalo",
            "TDespacho": "T. Despacho"
          });


          // Agregar los datos de cada ruta
          rutaDatosPorRuta.forEach((item, i) => {
            const horaSali = item.HoraSaliProgSali_m.split(" ")[1];
            newExcelData.push({
              "No":i+1,
              "P": "P",
              "CodiVehiSali_m": item.CodiVehiSali_m,
              "codigo_chofer": item.codigo_chofer,
              "HoraSaliProgSali_m": horaSali,
              "HoraLlegProgSali_m": item.HoraLlegProgSali_m,
              "TiempoVuelta": item.TiempoVuelta,
              "Intervalo": item.Intervalo,
              "TDespacho": item.TDespacho,
            });
          });

          // Agregar una fila vacía después de los datos de la ruta
          newExcelData.push({
            "No":"",
            "P": "",
            "CodiVehiSali_m": "",
            "codigo_chofer": "",
            "HoraSaliProgSali_m": "",
            "HoraLlegProgSali_m": "",
            "TiempoVuelta": "",
            "Intervalo": "",
            "TDespacho": ""
          });
        });
      });

      console.log("Datos listos para exportar: ", newExcelData);

      // Asignar los datos procesados para exportar a Excel
      this.mListDatosPenalidades = newExcelData;
    },




    async readGruposActivosPenalidadesSemanales() {
      this.mListaGruposPenalidadesSemanales = [];

      var datos = await this.$axios.post(
        process.env.baseUrl + "/gruposActivos",
        {
          token: this.token,
        }
      );

      if (datos.data.status_code == 200) {
        this.mListaGruposPenalidadesSemanales.push(...datos.data.data);
      }
    },
  },
  mounted() {
    this.readGruposActivosPenalidadesSemanales();
    this.readAllRutasSalidasSEmanales();
    this.readAllUnidadesSalidasSemanales();
    this.initPrimerDiaSemanaActualSalidaBusquedaPanel();
    //this.readApiPenalidades();
  },
};
</script>
<style>
.card_body_tO {
  padding: 0.5rem;
}

.containerModalRecorridoPanelDespacho {
  display: flex;
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

.cardTextoRPagosVehiculoProduccionPanelDespachoBusqueda {
  display: flex;
  align-items: center;
}

.cardSelectRubrosEstadosPagosVehiculoProduccionContainerPanelDespachoBusqueda {
  display: flex;
  justify-content: space-between;
}

.no-border-card .card-footer {
  border-top: 0;
}

.card-bodyRPenalidadesSemanales {
  padding: 0rem !important;
  height: calc(100vh - 13rem);
  overflow: none;
}

.card-bodyTopOpcionesRPagosVehiculoPRoduccionPanelDespachoBusqueda {
  padding-top: 0.25rem !important;
}
</style>