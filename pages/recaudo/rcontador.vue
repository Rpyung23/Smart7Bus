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
          <div class="cardTextoRPagosVehiculoProduccion">
            <el-select
              v-model="itemUnidadContadorPasajero"
              multiple
              filterable
              style="margin-right: 0.5rem"
              remote
              placeholder="Ingrese unidad"
              :remote-method="remoteMethodUnidadesContadorPasajeros"
              :loading="loadingUnidadesContadorPasajeros"
            >
              <el-option
                v-for="item in optionsUnidadesSelectContadorPasajero"
                :key="item.CodiVehi"
                :label="item.CodiVehi"
                :value="item.CodiVehi"
              >
              </el-option>
            </el-select>

            <!--<base-input
              type="datetime-local"
              style="margin-right: 0.5rem"
              v-model="fechaInicialConteoPasajeros"
            />

            <base-input
              type="datetime-local"
              style="margin-right: 0.5rem"
              v-model="fechaFinalConteoPasajeros"
            />

            <el-date-picker
              v-model="fechaInicialConteoPasajeros"
              type="datetime"
              placeholder="Select date and time"
            >
            </el-date-picker> -->

            <el-date-picker
              v-model="fechaInicialConteoPasajeros"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="margin-right: 0.5rem"
              placeholder="Fecha/Hora inicial"
            >
            </el-date-picker>

            <el-date-picker
              v-model="fechaFinalConteoPasajeros"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="Fecha/Hora final"
            >
            </el-date-picker>
          </div>

          <div class="buttonsAdicionalesRContador">
            <base-button
              icon
              size="sm"
              type="primary"
              @click="readConteoPasajeros()"
            >
              <span class="btn-inner--icon"
                ><i class="el-icon-search"></i
              ></span>
            </base-button>
            <download-excel
              class="btn btn-sm btn-success"
              outline
              :header="headerExcelRPagosVehiculoProduccion"
              :data="tableDataRecaudoContadorPasajeros"
              :fields="json_fields_excelRPagosVehiculoProduccion"
              :worksheet="ConteoPasajerosWorksheetExcelRPagosVehiculoProduccion"
              :name="ConteoPasajerosFileNameExcelRPagosVehiculoProduccion"
            >
              <span class="btn-inner--icon"
                ><i class="ni ni-collection"></i
              ></span>
            </download-excel>
            <!--<base-button type="danger" size="sm">
              <span class="btn-inner--icon"><i class="ni ni-ungroup"></i></span>
            </base-button>-->
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
              v-model="mSelectRutaContadorPasajero"
              multiple
              collapse-tags
              placeholder="Lineas"
            >
              <el-option
                v-for="item in mListLineasContadorPasajeros"
                :key="item.LetrRuta"
                :label="item.DescRuta"
                :value="item.LetrRuta"
              >
              </el-option>
            </el-select>
          </div>

          <div class="cardTextoRPagosVehiculoProduccion"></div>
        </card>

        <card
          class="no-border-card"
          style="margin-bottom: 0rem"
          body-classes="card-bodyRPagosVehiculoProduccion px-0 pb-1"
          footer-classes="pb-2"
        >
          <div>
            <el-table
              v-loading="loadingUnidadesContadorPasajerosPasajeros"
              element-loading-text="Cargando Datos..."
              :data="tableDataRecaudoContadorPasajeros"
              highlight-current-row
              row-key="id"
              height="calc(100vh - 13rem)"
              style="width: 100%"
              class="tablePanelControlProduccion"
              header-row-class-name="thead-dark"
            >
              <el-table-column prop="unidad" label="Unidad" minWidth="110">
              </el-table-column>

              <el-table-column
                prop="DescRutaSali_m"
                label="Ruta - Linea"
                minWidth="200"
              >
              </el-table-column>

              <el-table-column
                prop="subida1"
                label="Puerta 1"
                minWidth="130"
              >
              </el-table-column>
              <el-table-column
                prop="subida2"
                label="Puerta 2"
                minWidth="130"
              >
              </el-table-column>
              <el-table-column
                prop="subida3"
                label="Puerta 3"
                minWidth="130"
              >
              </el-table-column>
              <!--<el-table-column
                prop="bajada1"
                label="Puerta 1 (B)"
                minWidth="160"
              >
              </el-table-column>
              <el-table-column
                prop="bajada2"
                label="Puerta 2 (B)"
                minWidth="160"
              >
              </el-table-column>
              <el-table-column
                prop="bajada3"
                label="Puerta 3 (B)"
                minWidth="160"
              >
              </el-table-column>-->
              <el-table-column
                prop="totalSubidas"
                label="T. Subidas"
                minWidth="140"
              >
              </el-table-column>

              <el-table-column
                prop="dinero"
                label="T. Dinero"
                minWidth="140"
              >
                <template slot-scope="scope">
                  <strong style="color: black">{{ scope.row.dinero }}</strong>
                </template>
              </el-table-column>


              <el-table-column
                prop="valorPonderada"
                label="T. Central ($)"
                minWidth="150"
              >
              </el-table-column>

              <el-table-column
                prop="Odometro"
                label="Km/H"
                minWidth="110"
              >
              </el-table-column>

              <el-table-column prop="ipk" label="IPK" minWidth="90">
              </el-table-column>



              <div slot="empty"></div>
            </el-table>
          </div>
        </card>
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
  Button,
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
  layout: "RecaudoDashboardLayout",
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
    [Button.name]: Button,
  },
  data() {
    return {
      mListaUnidadesContadorPasajeros: [],
      tableDataRecaudoContadorPasajeros: [],
      mListLineasContadorPasajeros: [],
      loadingUnidadesContadorPasajeros: false,
      loadingUnidadesContadorPasajerosPasajeros: false,
      mSelectRutaContadorPasajero: [],
      itemUnidadContadorPasajero: [],
      token: this.$cookies.get("token"),
      fechaInicialConteoPasajeros: "",
      fechaFinalConteoPasajeros: "",
      ConteoPasajerosWorksheetExcelRPagosVehiculoProduccion: "",
      ConteoPasajerosFileNameExcelRPagosVehiculoProduccion: "",
      headerExcelRPagosVehiculoProduccion: [],
      optionsUnidadesSelectContadorPasajero: [],
      json_fields_excelRPagosVehiculoProduccion: {
        Unidad: "unidad",
        "Linea - Ruta": "DescRutaSali_m",
        "Subida 1": "subida1",
        "Subida 2": "subida2",
        "Subida 3": "subida3",
        "Total Subidas": "totalSubidas",
        "T Central ($)": "valorPonderada",
        "KM/H Recorridos": "Odometro",
        "IPK": "ipk",
        "Dinero Recaudado": "dinero",
      },
    };
  },
  methods: {
    remoteMethodUnidadesContadorPasajeros(query) {
      if (query !== "") {
        this.loadingUnidadesContadorPasajeros = true;
        setTimeout(() => {
          this.loadingUnidadesContadorPasajeros = false;
          this.optionsUnidadesSelectContadorPasajero =
            this.mListaUnidadesContadorPasajeros.filter((item) => {
              return (
                item.CodiVehi.toLowerCase().indexOf(query.toLowerCase()) > -1
              );
            });
        }, 200);
      } else {
        this.optionsUnidadesSelectContadorPasajero = [];
      }
    },

    initFechaActualContadorPasajeros() {
      var fecha = new Date();
      var mes = fecha.getMonth() + 1;
      var day = fecha.getDate();
      var format =
        fecha.getFullYear() +
        "-" +
        (mes < 10 ? "0" + mes : mes) +
        "-" +
        (day < 10 ? "0" + day : day);

      this.fechaInicialConteoPasajeros = format + " 05:00:00";
      this.fechaFinalConteoPasajeros = format + " 23:59:59";
    },
    async readAllUnidadesContadorPasajeros() {
      var datos = await this.$axios.post(process.env.baseUrl + "/unidades", {
        token: this.token,
      });

      if (datos.data.status_code == 200) {
        for (var i = 0; i < datos.data.data.length; i++) {
          var obj = datos.data.data[i];
          obj.value = obj.CodiVehi;
          this.mListaUnidadesContadorPasajeros.push(obj);
        }
      }
    },
    async readAllLineasContadorPasajeros() {
      var datos = await this.$axios.post(process.env.baseUrl + "/rutes", {
        token: this.token,
        tipo: 1,
      });
      if (datos.data.status_code == 200) {
        this.mListLineasContadorPasajeros.push(...datos.data.data);
      }
    },
    async readConteoPasajeros() {
      this.ConteoPasajerosWorksheetExcelRPagosVehiculoProduccion =
        "RCP_W_" + Date.now();
      this.ConteoPasajerosFileNameExcelRPagosVehiculoProduccion =
        "RCP_" + Date.now() + ".xls";

      if (this.loadingUnidadesContadorPasajerosPasajeros) {
        Notification.info({
          title: "Conteo de Pasajeros",
          message: "Por favor espere un momento, consulta en proceso.",
        });
      } else {
        this.loadingUnidadesContadorPasajerosPasajeros = true;
        this.tableDataRecaudoContadorPasajeros = [];
        try {
          /*console.log(this.itemUnidadContadorPasajero)
          console.log(this.mSelectRutaContadorPasajero)*/
          console.log(this.fechaInicialConteoPasajeros.toString());

          var body = {
            token: this.token,
            unidades:
              this.itemUnidadContadorPasajero.length == 0
                ? "*"
                : this.itemUnidadContadorPasajero,
            rutas:
              this.mSelectRutaContadorPasajero.length == 0
                ? "*"
                : this.mSelectRutaContadorPasajero,
            fechaI: this.fechaInicialConteoPasajeros.toString(),
            fechaF: this.fechaFinalConteoPasajeros.toString(),
          };
          //console.log(body)
          var datos = await this.$axios.post(
            process.env.baseUrl + "/contadorPasajerosFecha",
            body,
            {
              timeout: 600000,
            }
          );
          //console.log(datos.data);
          if (datos.data.status_code == 200) {
            this.tableDataRecaudoContadorPasajeros.push(...datos.data.datos);
          } else if (datos.data.status_code == 300) {
            Notification.info({
              title: "Conteo de Pasajeros",
              message: "No existen datos disponibles.",
            });
          } else {
            Notification.error({
              title: "Conteo de Pasajeros",
              message: datos.data.msm,
            });
          }
        } catch (error) {
          console.log(error);
          Notification.error({
            title: "TRYCTACH Conteo de Pasajeros",
            message: error.toString(),
          });
        }
        this.loadingUnidadesContadorPasajerosPasajeros = false;
      }
    },
  },
  mounted() {
    this.readAllUnidadesContadorPasajeros();
    this.initFechaActualContadorPasajeros();
    this.readAllLineasContadorPasajeros();
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

.cardTextoRPagosVehiculoProduccion {
  display: flex;
  align-items: center;
}
.cardSelectRubrosEstadosPagosVehiculoProduccionContainer {
  display: flex;
  justify-content: space-between;
}
.el-table .warning-row-panelControlProduccion {
  background: rgba(252, 143, 143, 0.692) !important;
}

.el-table .success-row-panelControlProduccion {
  background: #8fed8fbb !important;
}

.no-border-card .card-footer {
  border-top: 0;
}
.card-bodyRPagosVehiculoProduccion {
  padding: 0rem !important;
  height: calc(100vh - 13rem);
  overflow: auto;
}

.card-bodyTopOpcionesRPagosVehiculoPRoduccion {
  padding-top: 0.25rem !important;
}
</style>
