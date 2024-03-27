<template>
  <div class="content">
    <base-header>
      <div class="align-items-center py-3">
        <card
          class="no-border-card col"
          style="margin-bottom: 0.5rem"
          body-classes="px-0 pb-1 card-bodyTopOpcionesRPagosVehiculoPRoduccionPanelDespachoBusqueda cardSelectRubrosEstadosPagosVehiculoProduccionContainerPanelDespachoBusqueda"
          footer-classes="pb-2"
        >
          <div class="cardTextoRPagosVehiculoProduccionPanelDespachoBusqueda">
            <el-select
              v-model="itemUnidadCumplimientoSalidas"
              multiple
              filterable
              remote
              placeholder="Unidades"
              prefix-icon="ni ni-bus-front-12"
              style="margin-right: 0.5rem"
              :remote-method="remoteMethodUnidadesRecibosProduccion"
              :loading="loadingTableUnidadesSemanales"
            >
              <el-option
                v-for="item in optionsUnidadesSemanales"
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
                @on-open="focus"
                @on-close="blur"
                :config="{ allowInput: true }"
                format="yyyy/MM/dd"
                class="form-controlPersonal datepicker"
                v-model="fechaDia1CumplimientoSalidas"
              >
              </flat-picker>
            </base-input>

            <base-input
              addon-left-icon="ni ni-calendar-grid-58"
              style="margin-right: 1rem"
              disabled
            >
              <flat-picker
                slot-scope="{ focus, blur }"
                @on-open="focus"
                @on-close="blur"
                :config="{ allowInput: true }"
                format="yyyy/MM/dd"
                class="form-controlPersonal datepicker"
                v-model="fechaDia2CumplimientoSalidas"
              >
              </flat-picker>
            </base-input>

            <el-checkbox v-model="isFinalizadas"  style="margin-bottom: 0 !important;">FINALIZADAS</el-checkbox>


          </div>

          <div
            class="cardSelectRubrosEstadosPagosVehiculoProduccionContainerPanelDespachoBusqueda"
          >
            <div class="buttonCenterEndDerecha">
              <base-button
                icon
                type="primary"
                size="sm"
                @click="readApiCumplimientoSalidas()"
              >
                <span class="btn-inner--icon"
                  ><i class="el-icon-search"></i
                ></span>
              </base-button>

              <base-button
                type="danger"
                size="sm"
                v-if="mListDatosPenalidades.length > 0 ? true : false"
                @click="exportPdfRPenalidadesSemanales()"
                title="Exportar PDF"
              >
                <span class="btn-inner--icon"
                  ><i class="ni ni-single-copy-04"></i
                ></span>
              </base-button>

              <download-excel
                v-if="mListDatosPenalidades.length > 0 ? true : false"
                class="btn btn-icon btn-fab btn-success btn-sm"
                outline
                :header="oheaderExcelRSalidasSemanales"
                title="Exportar a Excel"
                :data="mListDatosPenalidades"
                :fields="json_fields_excelRPenalidadesSemanales"
                :worksheet="WorksheetExcelRSalidasSemanales"
                :name="FileNameExcelRSalidasSemanales"
              >
                <span class="btn-inner--icon"
                  ><i class="ni ni-collection"></i
                ></span>
              </download-excel>
            </div>
          </div>
        </card>

        <card
          class="no-border-card col"
          style="margin-bottom: 0.5rem"
          body-classes="px-0 pb-1 card-bodyTopOpcionesRPagosVehiculoPRoduccionPanelDespachoBusqueda cardSelectRubrosEstadosPagosVehiculoProduccionContainerPanelDespachoBusqueda"
          footer-classes="pb-2"
        >
          <div class="cardTextoRPagosVehiculoProduccionPanelDespachoBusqueda">
            <el-select
              style="margin-right: 0.5rem"
              collapse-tags
              v-if="mListaGruposCumpolientoSalidas.length > 0 ? true : false"
              v-model="itemGruposCumplimientoSalidas"
              multiple
              placeholder="Grupos"
            >
              <el-option
                v-for="item in mListaGruposCumpolientoSalidas"
                :key="item.id"
                :label="item.descripcion"
                :value="item.id"
              >
              </el-option>
            </el-select>

            <el-select
              style="margin-right: 0.5rem"
              collapse-tags
              v-model="itemRutasCumplimientoSalidas"
              multiple
              placeholder="Rutas"
            >
              <el-option
                v-for="item in mListaRutasSalidasSemanales"
                :key="item.LetrRuta"
                :label="item.DescRuta"
                :value="item.LetrRuta"
              >
              </el-option>
            </el-select>

            <el-switch
              v-model="isVueltaCheck"
              inactive-text="DIARIO"
              active-text="SALIDA"
            >
            </el-switch>

            
          </div>

          <div
            class="cardSelectRubrosEstadosPagosVehiculoProduccionContainerPanelDespachoBusqueda"
          >
            <div class="buttonCenterEndDerecha"></div>
          </div>
        </card>

        <card
          class="no-border-card"
          style="margin-bottom: 0rem"
          body-classes="card-bodyRPenalidadesSemanales px-0 pb-1"
          footer-classes="pb-2"
        >
          <div>
            <el-table
              element-loading-text="Cargando Datos..."
              row-key="id"
              v-loading="loadingPenalidadesSemanales"
              :data="mListDatosPenalidades"
              :row-class-name="tableRowClassNameCumplimientoSalidas"
              class="tablePanelControlProduccion"
              header-row-class-name="thead-dark"
              height="calc(100vh - 12.8rem)"
            >
              <el-table-column
                prop="CodiVehiSali_m"
                label="Acciones"
                width="190"
              >
                <template slot-scope="scope">
                  <base-button
                    size="sm"
                    title="TARJETA PEQUEÑA"
                    @click="showTarjetaSalidasCumplimiento(scope.row)"
                    type="primary"
                    ><i class="ni ni-single-copy-04"></i
                  ></base-button>
                  <base-button
                    size="sm"
                    title="TARJETA GRANDE(A4)"
                    @click="showTarjetaSalidasCumplimientoA4(scope.row)"
                    type="danger"
                    ><i class="ni ni-book-bookmark"></i
                  ></base-button>

                  <base-button
                    size="sm"
                    title="Recorrido"
                    @click="showRecorridoSalidasPanelBusqueda(scope.row)"
                    type="success"
                    ><i class="ni ni-world"></i
                  ></base-button>
                </template>
              </el-table-column>

              <el-table-column prop="CodiVehiSali_m" label="Unidad" width="150">
              </el-table-column>

              <el-table-column
                prop="NumeVuelSali_m"
                label="N° Vuelta"
                width="180"
              >
              </el-table-column>

              <el-table-column
                prop="descripcionGrupo"
                label="GRUPO"
                width="150"
              >
              </el-table-column>

              <el-table-column
                prop="DescRutaSali_m"
                label="Detalle Ruta"
                width="230"
              >
              </el-table-column>

              <el-table-column
                prop="HoraSaliProgSali_mF"
                label="F. Salidas Inicial"
                width="190"
              >
              </el-table-column>

              <el-table-column
                prop="HoraLlegProgSali_mF"
                label="F. Salidas Final"
                width="190"
              >
              </el-table-column>

              <el-table-column
                prop="PorcMarcacion"
                label="%. Cumplimiento"
                width="230"
              >
              </el-table-column>

              <el-table-column prop="estado" label="Estado" width="180">
              </el-table-column>

              <div slot="empty"></div>
            </el-table>
          </div>
        </card>
      </div>
    </base-header>

    <!--Form modal TICKET (A4) SALIDA
    <modal
      :show.sync="modalSalidasCumplimoentoSalidas"
      size="xl"
      body-classes="p-1"
    >
      <iframe
        :src="baseUrlPdfCumplimentoSalidas"
        style="width: 100%; height: 33rem"
      ></iframe>
    </modal>-->

    <!--Form modal TICKET SALIDA-->
    <modal
      :show.sync="modalSalidasTarjetaCumplientoSalida"
      size="sm"
      body-classes="p-0"
    >
      <ComponenteTarjeta ref="ComponenteTarjeta"></ComponenteTarjeta>
    </modal>

    <!--Form modal TICKET (A4) SALIDA-->
    <modal
      :show.sync="modalSalidasTarjetaCumplientoSalidaA4"
      size="xl"
      body-classes="p-1"
    >
      <ComponenteTarjetaA4 ref="ComponenteTarjetaA4"></ComponenteTarjetaA4>
    </modal>

    <modal
      :show.sync="modalSalidasRecorridoCumplimiento"
      size="xl"
      body-classes="p-1"
    >
      <ComponenteRecorrido ref="ComponenteRecorrido"></ComponenteRecorrido>
    </modal>
  </div>
</template>
<script>
import { getFechatoDDMM, getFecha_dd_mm_yyyy } from "../../util/fechas";
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
  Switch,
} from "element-ui";
import { getBase64LogoReportes } from "../../util/logoReport";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import recorrido from "../../components/monitoreo/recorrido.vue";
import tarjetaA4 from "../../components/tarjetas/tarjetaA4.vue";
import tarjeta from "../../components/tarjetas/tarjeta.vue";
import RouteBreadCrumb from "@/components/argon-core/Breadcrumb/RouteBreadcrumb";
import { BasePagination } from "@/components/argon-core";
import clientPaginationMixin from "~/components/tables/PaginatedTables/clientPaginationMixin";
import swal from "sweetalert2";
import Tabs from "@/components/argon-core/Tabs/Tabs";
import TabPane from "@/components/argon-core/Tabs/Tab";
import { FechaStringToHour } from "../../util/fechas";

export default {
  mixins: [clientPaginationMixin],
  layout: "DespachoDashboardLayout",
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
    [Switch.name]: Switch,
    ComponenteRecorrido: recorrido,
    ComponenteTarjeta: tarjeta,
    ComponenteTarjetaA4: tarjetaA4,
  },
  data() {
    return {
      modalSalidasRecorridoCumplimiento: false,
      token: this.$cookies.get("token"),
      isVueltaCheck: true,
      isFinalizadas: false,
      fechaDia1CumplimientoSalidas: "",
      fechaDia2CumplimientoSalidas: "",
      modalSalidasTarjetaCumplientoSalida: false,
      tableColumnPenalidades: [],
      mListDatosPenalidades: [],
      loadingPenalidadesSemanales: false,
      mListaUnidadesSemanales: [],
      optionsUnidadesSemanales: [],
      loadingTableUnidadesSemanales: false,
      itemUnidadCumplimientoSalidas: [],
      mListaRutasSalidasSemanales: [],
      mListaGruposCumpolientoSalidas: [],
      itemRutasCumplimientoSalidas: [],
      itemGruposCumplimientoSalidas: [],
      modalSalidasCumplimoentoSalidas: false,
      baseUrlPdfCumplimentoSalidas: "",

      json_fields_excelRPenalidadesSemanales: {
        UNIDAD: "CodiVehiSali_m",
        GRUPO: "descripcionGrupo",
        RUTA: "DescRutaSali_m",
        "FECHA SALIDAS INICIAL": "HoraSaliProgSali_mF",
        "FECHA SALIDAS FINAL": "HoraLlegProgSali_mF",
        "N° VUELTA": "NumeVuelSali_m",
        "% CUMPLIMIENTO": "PorcMarcacion",
        ESTADO: "estado",
      },
      WorksheetExcelRSalidasSemanales: "",
      FileNameExcelRSalidasSemanales: "",
      oheaderExcelRSalidasSemanales: "",
      modalSalidasTarjetaCumplientoSalidaA4: false,
      modalSalidasTarjetaCumplientoSalida: false,
    };
  },
  methods: {
    showRecorridoSalidasPanelBusqueda(item) {
      console.log(item);
      this.modalSalidasRecorridoCumplimiento = true;
      this.$refs.ComponenteRecorrido.readHistorialSalidaPanelBusqueda(item);
    },

    showTarjetaSalidasCumplimiento(salida) {
      this.modalSalidasTarjetaCumplientoSalida = true;
      this.$refs.ComponenteTarjeta.readDetalleSalidaDPanelBusqueda(salida);
    },
    showTarjetaSalidasCumplimientoA4(salida) {
      console.log(salida);
      this.modalSalidasTarjetaCumplientoSalidaA4 = true;
      this.$refs.ComponenteTarjetaA4.readDetalleSalidaDPanelBusqueda(salida);
    },

    showPdfModalDetalleCumpliento(row) {
      console.log(row);

      this.modalSalidasCumplimoentoSalidas = true;
      this.readDetalleCumplientoSalidas(
        row.CodiVehiSali_m,
        row.DescRutaSali_m,
        row.HoraSaliProgSali_mInicio,
        row.HoraSaliProgSali_mFin
      );
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
    async readGruposActivosCumplimientoSalidas() {
      this.mListaGruposCumpolientoSalidas = [];

      var datos = await this.$axios.post(
        process.env.baseUrl + "/gruposActivos",
        {
          token: this.token,
        }
      );

      if (datos.data.status_code == 200) {
        this.mListaGruposCumpolientoSalidas.push(...datos.data.data);
      }
    },
    getNombresRutasRDespachosGenerados() {
      var mlist = [];
      for (var j = 0; j < this.itemRutasCumplimientoSalidas.length; j++) {
        for (var i = 0; i < this.mListaRutasSalidasSemanales.length; i++) {
          if (
            this.itemRutasCumplimientoSalidas[j] ==
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

      this.fechaDia1CumplimientoSalidas = format;
      this.fechaDia2CumplimientoSalidas = format;
    },
    async readApiCumplimientoSalidas() {
      this.mListDatosPenalidades = [];
      this.loadingPenalidadesSemanales = true;

      this.WorksheetExcelRSalidasSemanales = "RC_S_W_" + Date.now();
      this.FileNameExcelRSalidasSemanales = "RC_S_" + Date.now() + ".xls";

      this.oheaderExcelRSalidasSemanales = [
        "REPORTE CUMPLIMENTO DE DESPACHOS",
        "Fechas : " +
          this.fechaDia1CumplimientoSalidas +
          " hasta " +
          this.fechaDia2CumplimientoSalidas,
        "Unidades : " +
          (this.itemUnidadCumplimientoSalidas.length <= 0
            ? "TODAS LAS UNIDADES"
            : this.itemUnidadCumplimientoSalidas),
        "Rutas : " +
          (this.itemRutasCumplimientoSalidas.length <= 0
            ? "TODAS LAS RUTAS"
            : this.getNombresRutasRDespachosGenerados(
                this.itemRutasCumplimientoSalidas
              )),
      ];

      try {
        var obj = {
          token: this.token,
          fechaI: this.fechaDia1CumplimientoSalidas,
          fechaF: this.fechaDia2CumplimientoSalidas,
          unidades:
            this.itemUnidadCumplimientoSalidas.length <= 0
              ? "*"
              : this.itemUnidadCumplimientoSalidas,
          rutas:
            this.itemRutasCumplimientoSalidas.length <= 0
              ? "*"
              : this.itemRutasCumplimientoSalidas,
          grupos:
            this.itemGruposCumplimientoSalidas.length <= 0
              ? "*"
              : this.itemGruposCumplimientoSalidas,
          isVuelta: this.isVueltaCheck,
          isFinalizada: this.isFinalizadas == true ? 1 : 0 
        };
        console.log("*************************** ");
        console.log("Aca el body de salidas  "+JSON.stringify(obj));

        var datos = await this.$axios.post(
          process.env.baseUrl + "/readCumplimientoSalidas",
          obj
        );

        console.log(datos.data);
        this.mListDatosPenalidades.push(...datos.data.datos);
      } catch (error) {
        console.log(error);
      }

      this.loadingPenalidadesSemanales = false;
    },
    tableRowClassNameCumplimientoSalidas({ row, rowIndex }) {
      if (parseFloat(row.PorcMarcacion) < 100) {
        return "warning-row-CumplientoSalidas";
      } else {
        return "";
      }
    },
    exportPdfRPenalidadesSemanales() {
      var empresa = [
        {
          text: "Empresa : " + this.$cookies.get("nameEmpresa"),
          fontSize: 11,
          alignment: "left",
        },
      ];

      var desde_hasta = [
        {
          text:
            "Fecha : " +
            this.fechaDia1CumplimientoSalidas +
            " hasta " +
            this.fechaDia2CumplimientoSalidas,
          fontSize: 11,
          alignment: "left",
        },
      ];

      var mList = [];
      mList.push([
        {
          text: "UNIDAD",
          fontSize: 8.5,
          bold: true,
          fillColor: "#039BC4",
          color: "white",
          alignment: "center",
        },
        {
          text: "GRUPO",
          fontSize: 8.5,
          bold: true,
          fillColor: "#039BC4",
          color: "white",
          alignment: "center",
        },
        {
          text: "RUTA",
          fontSize: 8.5,
          bold: true,
          fillColor: "#039BC4",
          color: "white",
          alignment: "center",
        },
        {
          text: "F. INICIAL",
          fontSize: 8.5,
          bold: true,
          fillColor: "#039BC4",
          color: "white",
          alignment: "center",
        },
        {
          text: "F. FINAL",
          fontSize: 8.5,
          bold: true,
          fillColor: "#039BC4",
          color: "white",
          alignment: "center",
        },
        {
          text: "N° VUELTA",
          fontSize: 8.5,
          bold: true,
          fillColor: "#039BC4",
          color: "white",
          alignment: "center",
        },
        {
          text: "% CUMPLIMIENTO",
          fontSize: 8.5,
          bold: true,
          fillColor: "#039BC4",
          color: "white",
          alignment: "center",
        },
        {
          text: "ESTADO",
          fontSize: 8.5,
          bold: true,
          fillColor: "#039BC4",
          color: "white",
          alignment: "center",
        },
      ]);

      for (var i = 0; i < this.mListDatosPenalidades.length; i++) {
        var obj = [
          {
            text: this.mListDatosPenalidades[i].CodiVehiSali_m,
            fontSize: 8.5,
            alignment: "center",
            color:
              this.mListDatosPenalidades[i].PorcMarcacion < 100
                ? "red"
                : "black",
          },
          {
            text: this.mListDatosPenalidades[i].descripcionGrupo,
            fontSize: 8.5,
            alignment: "center",
            color:
              this.mListDatosPenalidades[i].PorcMarcacion < 100
                ? "red"
                : "black",
          },
          {
            text: this.mListDatosPenalidades[i].DescRutaSali_m,
            fontSize: 8.5,
            alignment: "center",
            color:
              this.mListDatosPenalidades[i].PorcMarcacion < 100
                ? "red"
                : "black",
          },
          {
            text: this.mListDatosPenalidades[i].HoraSaliProgSali_mF,
            fontSize: 8.5,
            alignment: "center",
            color:
              this.mListDatosPenalidades[i].PorcMarcacion < 100
                ? "red"
                : "black",
          },
          {
            text: this.mListDatosPenalidades[i].HoraLlegProgSali_mF,
            fontSize: 8.5,
            alignment: "center",
            color:
              this.mListDatosPenalidades[i].PorcMarcacion < 100
                ? "red"
                : "black",
          },
          {
            text: this.mListDatosPenalidades[i].NumeVuelSali_m,
            fontSize: 8.5,
            alignment: "center",
            color:
              this.mListDatosPenalidades[i].PorcMarcacion < 100
                ? "red"
                : "black",
          },
          {
            text: this.mListDatosPenalidades[i].PorcMarcacion,
            fontSize: 8.5,
            alignment: "center",
            color:
              this.mListDatosPenalidades[i].PorcMarcacion < 100
                ? "red"
                : "black",
          },
          {
            text: this.mListDatosPenalidades[i].estado,
            fontSize: 8.5,
            color:
              this.mListDatosPenalidades[i].PorcMarcacion < 100
                ? "red"
                : "black",
            alignment: "center",
          },
        ];
        mList.push(obj);
      }

      var docDefinition = {
        pageSize: "A4",
        pageOrientation: "landscape",
        pageMargins: [40, 80, 40, 60],
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
                      text: "REPORTE CUMPLIMENTO DE DESPACHOS",
                      alignment: "center",
                      fontSize: 16,
                      bold: true,
                    },
                  ],
                  [
                    {
                      text: "Dir : Av Chasquis y Rio Guayllabamba (Ambato) Email : vigitracklatam@gmail.com",
                      alignment: "center",
                      fontSize: 8,
                    },
                  ],
                  [
                    {
                      text: "Tel : 0995737084 - 032421698 Sitio Web : www.vigitrackecuador.com",
                      alignment: "center",
                      fontSize: 8,
                    },
                  ],
                ],
              },
            },
          ],
        },
        content: [
          {
            layout: "noBorders",
            table: {
              headerRows: 0,
              widths: [450, 450],
              body: [empresa, desde_hasta],
            },
          },
          {
            table: {
              headerRows: 0,
              widths: [40, 70, 175, 60, 70, 50, 72, 70],
              body: mList,
            },
          },
        ],
      };

      pdfMake.createPdf(docDefinition).download("RPS_" + Date.now());
    },
    async readDetalleCumplientoSalidas(unidads, ruta, fechaI, fechaF) {
      try {
        this.baseUrlPdfCumplimentoSalidas = "";
        var datos = [];
        var obj = {
          token: this.token,
          fechaI: fechaI,
          fechaF: fechaF,
          unidad: unidads,
          isFinalizada: this.isFinalizadas == true ? 1 : 0 
        };

        var responde = await this.$axios.post(
          process.env.baseUrl + "/DetalleReadCumplimientoSalidas",
          obj
        );

        datos.push(...responde.data.datos);
        console.log(datos);

        var empresa = [
          {
            text: "Empresa : " + this.$cookies.get("nameEmpresa"),
            fontSize: 9,
            alignment: "left",
          },
        ];
        var unidad = [
          {
            text: "Unidad : " + unidad,
            fontSize: 9,
            alignment: "left",
          },
        ];
        var ruta = [
          {
            text: "Ruta : " + ruta,
            fontSize: 9,
            alignment: "left",
          },
        ];
        var desde_hasta = [
          {
            text: "Fecha Salida : " + fechaI + " Hasta " + fechaF,
            fontSize: 9,
            alignment: "left",
          },
        ];

        var resultadoString = [
          [
            {
              text: "N° Vuelta",
              fontSize: 8.5,
              bold: true,
              fillColor: "#039BC4",
              color: "white",
              alignment: "center",
            },
            {
              text: "Linea (Ruta)",
              fontSize: 8.5,
              bold: true,
              fillColor: "#039BC4",
              color: "white",
              alignment: "center",
            },
            {
              text: "Frecuencia",
              fontSize: 8.5,
              bold: true,
              fillColor: "#039BC4",
              color: "white",
              alignment: "center",
            },
            {
              text: "Control",
              fontSize: 8.5,
              bold: true,
              fillColor: "#039BC4",
              color: "white",
              alignment: "center",
            },
            {
              text: "H. Programación",
              fontSize: 8.5,
              bold: true,
              fillColor: "#039BC4",
              color: "white",
              alignment: "center",
            },
          ],
        ];

        for (var i = 0; i < datos.length; i++) {
          var arrys = [
            {
              text: datos[i].NumeVuelSali_m,
              fontSize: 8.5,
              alignment: "center",
            },
            {
              text: datos[i].DescRutaSali_m,
              fontSize: 8.5,
              alignment: "center",
            },
            {
              text: datos[i].DescFrec,
              fontSize: 8.5,
              alignment: "center",
            },
            {
              text: datos[i].DescCtrl,
              fontSize: 8.5,
              alignment: "center",
            },
            {
              text: datos[i].HoraProgSali_d,
              fontSize: 8.5,
              alignment: "center",
            },
          ];
          resultadoString.push(arrys);
        }

        var docDefinition = {
          pageSize: "A4",
          pageMargins: [40, 80, 40, 60],
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
                        text: "REPORTE DETALLER CUMPLIENTO DE SALIDAS",
                        alignment: "center",
                        fontSize: 16,
                        bold: true,
                      },
                    ],
                    [
                      {
                        text: "Dir : Av Chasquis y Rio Guayllabamba (Ambato) Email : vigitracklatam@gmail.com",
                        alignment: "center",
                        fontSize: 8,
                      },
                    ],
                    [
                      {
                        text: "Tel : 0995737084 - 032421698 Sitio Web : www.vigitrackecuador.com",
                        alignment: "center",
                        fontSize: 8,
                      },
                    ],
                  ],
                },
              },
            ],
          },
          content: [
            {
              layout: "noBorders",
              table: {
                headerRows: 0,
                widths: [450, 450, 450, 450],
                body: [empresa, unidad, ruta, desde_hasta],
              },
            },
            {
              table: {
                headerRows: 0,
                widths: [40, 130, 120, 120, 70],
                body: resultadoString,
                //body: [[]],
              },
            },
          ],
        };

        //pdfMake.createPdf(docDefinition).download("RSD_" + Date.now());
        var pdfDocGenerator = pdfMake.createPdf(docDefinition);
        pdfDocGenerator.getDataUrl((dataUrl) => {
          this.baseUrlPdfCumplimentoSalidas = dataUrl;
        });
      } catch (error) {
        console.log(error);
      }
    },
  },
  mounted() {
    this.readGruposActivosCumplimientoSalidas();
    this.readAllRutasSalidasSEmanales();
    this.readAllUnidadesSalidasSemanales();
    this.initPrimerDiaSemanaActualSalidaBusquedaPanel();
    //this.readApiCumplimientoSalidas();
  },
};
</script>
<style>
.el-table .warning-row-CumplientoSalidas {
  background: rgba(255, 0, 0, 0.281) !important;
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
