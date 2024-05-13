<template>
  <div class="content">
    <base-header>
      <div class="align-items-center py-3">
        <card class="no-border-card col" style="margin-bottom: 0.5rem"
          body-classes="px-0 pb-1 card-bodyTopOpcionesRPagosVehiculoPRoduccionPanelDespachoBusqueda cardSelectRubrosEstadosPagosVehiculoProduccionContainerPanelDespachoBusqueda"
          footer-classes="pb-2">
          <div class="cardTextoRPagosVehiculoProduccionPanelDespachoBusqueda">
            <el-select v-model="itemUnidadRSemanales" multiple filterable remote placeholder="Unidades"
              prefix-icon="ni ni-bus-front-12" style="margin-right: 0.5rem"
              :remote-method="remoteMethodUnidadesRecibosProduccion" :loading="loadingTableUnidadesSemanales">
              <el-option v-for="item in optionsUnidadesSemanales" :key="item.CodiVehi" :label="item.CodiVehi"
                :value="item.CodiVehi">
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

              <base-button type="danger" size="sm" v-if="mListDatosPenalidades.length > 0 ? true : false"
                @click="exportPdfRPenalidadesSemanales()" title="Exportar PDF">
                <span class="btn-inner--icon"><i class="ni ni-single-copy-04"></i></span>
              </base-button>

            </div>
          </div>
        </card>

        <card class="no-border-card col" style="margin-bottom: 0.5rem"
          body-classes="px-0 pb-1 card-bodyTopOpcionesRPagosVehiculoPRoduccionPanelDespachoBusqueda cardSelectRubrosEstadosPagosVehiculoProduccionContainerPanelDespachoBusqueda"
          footer-classes="pb-2">
          <div class="cardTextoRPagosVehiculoProduccionPanelDespachoBusqueda">
            <el-select style="margin-right: 0.5rem" collapse-tags
              v-if="mListaGruposPenalidadesSemanales.length > 0 ? true : false" v-model="itemGruposPenalidadesSemanales"
              multiple placeholder="Grupos">
              <el-option v-for="item in mListaGruposPenalidadesSemanales" :key="item.id" :label="item.descripcion"
                :value="item.id">
              </el-option>
            </el-select>

            <el-select style="margin-right: 0.5rem" collapse-tags v-model="itemRutasRSalidasSemanales" multiple
              placeholder="Rutas">
              <el-option v-for="item in mListaRutasSalidasSemanales" :key="item.LetrRuta" :label="item.DescRuta"
                :value="item.LetrRuta">
              </el-option>
            </el-select>
          </div>

          <div class="cardSelectRubrosEstadosPagosVehiculoProduccionContainerPanelDespachoBusqueda">
            <div class="buttonCenterEndDerecha"></div>
          </div>
        </card>

        <card class="no-border-card" style="margin-bottom: 0rem" body-classes="card-bodyRPenalidadesSemanales px-0 pb-1"
          footer-classes="pb-2">
          <div>
            <el-table element-loading-text="Cargando Datos..." row-key="id" v-loading="loadingPenalidadesSemanales"
              :data="mListDatosPenalidades" class="tablePanelControlProduccion" header-row-class-name="thead-dark"
              height="calc(100vh - 12.8rem)">

              <el-table-column prop="CodiVehiSali_m" label="Detalle Alerta" width="200">

                <template slot-scope="scope">
                  <base-button size="sm" title="Recorrido" @click="showRecorridoSalidasPanelBusqueda(scope.row)"
                    type="success"><i class="ni ni-world"></i></base-button>
                </template>

              </el-table-column>


              <el-table-column prop="CodiVehiSali_m" label="Unidad" width="150">
              </el-table-column>

              <el-table-column prop="HoraSaliProgSali_mI" label="Fecha Inico" width="300">
              </el-table-column>

              <el-table-column prop="HoraSaliProgSali_mF" label="Fecha Final" width="300">
              </el-table-column>

              <el-table-column prop="DescRutaSali_m" label="Detalle Ruta" width="440">
              </el-table-column>


              <div slot="empty"></div>
            </el-table>
          </div>
        </card>
      </div>
    </base-header>
    <modal :show.sync="modalSalidasPanelDespachoBusqueda" size="xl" body-classes="p-1">
      <ComponenteRecorrido ref="ComponenteRecorrido"></ComponenteRecorrido>
    </modal>


  </div>
</template>
<script>
import moment from "moment";
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
import RecorridoMapa from "../../components/monitoreo/recorridoMapa.vue";

export default {
  mixins: [clientPaginationMixin],
  layout: "DashboardLayoutMovilidad2",
  components: {
    ComponenteRecorrido: RecorridoMapa,
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
      modalSalidasPanelDespachoBusqueda: false,
      tableColumnPenalidades: [],
      mListDatosPenalidades: [],
      loadingPenalidadesSemanales: false,
      mListaUnidadesSemanales: [],
      optionsUnidadesSemanales: [],
      loadingTableUnidadesSemanales: false,
      itemUnidadRSemanales: [],
      mListaRutasSalidasSemanales: [],
      itemRutasRSalidasSemanales: [],
      mListaGruposPenalidadesSemanales: [],
      itemGruposPenalidadesSemanales: [],
      baseURlPDFPenalidadesSemanales: "",
      fechaDia2SalidasPanelBusqueda: "",
    };
  },
  methods: {

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
          process.env.baseUrl + "/readPenalidadesSemanales",
          obj
        );

        console.log(datos.data);
        this.mListDatosPenalidades.push(...datos.data.datos);
      } catch (error) {
        this.$notify({
          title: "Reporte de Unidades",
          message: error.toString(),
          type: "danger",
        });
        console.log(error);
      }
      this.loadingPenalidadesSemanales = false;
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
            this.fechaDia1SalidasPanelBusqueda +
            " hasta " +
            this.fechaDia2SalidasPanelBusqueda,
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
          text: "F. INICIO",
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
          text: "RUTA",
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
              this.mListDatosPenalidades[i].EstadoFaltasSumatoria == ""
                ? "black"
                : "black",
          },
          {
            text: this.mListDatosPenalidades[i].HoraSaliProgSali_mI,
            fontSize: 8.5,
            alignment: "center",
            color:
              this.mListDatosPenalidades[i].EstadoFaltasSumatoria == ""
                ? "black"
                : "black",
          },
          {
            text: this.mListDatosPenalidades[i].HoraSaliProgSali_mF,
            fontSize: 8.5,
            alignment: "center",
            color:
              this.mListDatosPenalidades[i].EstadoFaltasSumatoria == ""
                ? "black"
                : "black",
          },

          {
            text: this.mListDatosPenalidades[i].DescRutaSali_m,
            fontSize: 8.5,
            alignment: "center",
            color:
              this.mListDatosPenalidades[i].EstadoFaltasSumatoria == ""
                ? "black"
                : "black",
          },



        ];
        mList.push(obj);
      }

      var docDefinition = {
        pageSize: "A4",
        pageOrientation: "portrait",
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
                      text: "REPORTE PENALIDADES SEMANALES",
                      alignment: "center",
                      fontSize: 16,
                      bold: true,
                    },
                  ],
                  /*[
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
                  ],*/
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
              widths: [40, 60, 60, 90],
              body: mList,
            },
          },
        ],
      };

      pdfMake.createPdf(docDefinition).download("RA_" + Date.now());
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
    showRecorridoSalidasPanelBusqueda(item) {
      console.log(item);
      this.modalSalidasPanelDespachoBusqueda = true;
      this.$refs.ComponenteRecorrido.readHistorialSalidaPanelBusqueda(item);
    },
    cerrarModal() {
      this.modalSalidasPanelDespachoBusqueda = false;
    }
  },
  mounted() {
    this.readGruposActivosPenalidadesSemanales();
    this.readAllRutasSalidasSEmanales();
    this.readAllUnidadesSalidasSemanales();
    this.initPrimerDiaSemanaActualSalidaBusquedaPanel();
  },
};
</script>
<style>
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
