<template>
  <div class="content">
    <base-header class="pb-6">
      <div class="align-items-center py-3">
        <card
          class="no-border-card col"
          style="margin-bottom: 0.5rem"
          body-classes="px-0 pb-1 card-bodyTopOpcionesRPagosVehiculoPRoduccion cardSelectRubrosEstadosPagosVehiculoProduccionContainer"
          footer-classes="pb-2"
        >
          <div class="cardTextoRPagosVehiculoProduccion">
            <!--<el-autocomplete
              class="inline-input"
              v-model="itemUnidadContadorPasajero"
              :fetch-suggestions="querySearchUnidadProduccionRPagoVehiculo"
              style="margin-right: 0.5rem"
              placeholder="Unidad"
              prefix-icon="ni ni-bus-front-12"
              :trigger-on-focus="false"
              @select="handleSelectUnidadProduccionRPagoVehiculo"
            ></el-autocomplete>-->

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

            <base-input
              addon-left-icon="ni ni-calendar-grid-58"
              style="margin-right: 0.5rem"
            >
              <flat-picker
                slot-scope="{ focus, blur }"
                @on-open="focus"
                @on-close="blur"
                :config="{ allowInput: true }"
                class="form-controlPersonal datepicker"
                v-model="fechaInicialConteoPasajeros"
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
                v-model="fechaFinalConteoPasajeros"
              >
              </flat-picker>
            </base-input>
          </div>

          <div class="cardSelectRubrosEstadosPagosVehiculoProduccionContainer">
            <base-button icon type="primary" @click="readConteoPasajeros()">
              <span class="btn-inner--icon"
                ><i class="el-icon-search"></i
              ></span>
              <span class="btn-inner--text">Buscar</span>
            </base-button>
            <download-excel
              class="btn btn-outline-success"
              outline
              :header="headerExcelRPagosVehiculoProduccion"
              :data="tableDataRecaudoContadorPasajeros"
              :fields="json_fields_excelRPagosVehiculoProduccion"
              :worksheet="WorksheetExcelRPagosVehiculoProduccion"
              :name="FileNameExcelRPagosVehiculoProduccion"
            >
              <span class="btn-inner--icon"
                ><i class="ni ni-collection"></i
              ></span>
              <span class="btn-inner--text"> Excel</span>
            </download-excel>
            <base-button outline type="danger">
              <span class="btn-inner--icon"><i class="ni ni-ungroup"></i></span>
              <span class="btn-inner--text"> PDF</span>
            </base-button>
          </div>
        </card>

        <card
          class="no-border-card"
          style="margin-bottom: 0rem"
          body-classes="card-bodyRPagosVehiculoProduccion px-0 pb-1"
          footer-classes="pb-2"
        >
          <div>
            <el-table
              :data="mListaSalidasPanelBusqueda"
              header-row-class-name="thead-dark"
            >
              <el-table-column
                v-for="column in tableColumnsUnidadesFlotaVehicular"
                :key="column.label"
                v-bind="column"
              >
              </el-table-column>

              <el-table-column
                label="Estado"
                min-width="150px"
                prop="idEstaVehi"
              >
                <template v-slot="{ row }">
                  <badge class="badge-dot mr-4" type="">
                    <i
                      :class="`bg-${
                        row.estado == 4
                          ? 'danger'
                          : row.estado == 2
                          ? 'warning'
                          : 'success'
                      }`"
                    ></i>
                    <span class="status"
                      ><strong>{{
                        row.estado == 4
                          ? "ANULADO"
                          : row.estado == 2
                          ? "EN RUTA"
                          : "FINALIZADO"
                      }}</strong></span
                    >
                  </badge>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </card>
      </div>
    </base-header>
  </div>
</template>
<script>
import { Table, TableColumn, Select, Option, Notification } from "element-ui";

import RouteBreadCrumb from "@/components/argon-core/Breadcrumb/RouteBreadcrumb";
import { BasePagination } from "@/components/argon-core";
import clientPaginationMixin from "~/components/tables/PaginatedTables/clientPaginationMixin";
import swal from "sweetalert2";
import Tabs from "@/components/argon-core/Tabs/Tabs";
import TabPane from "@/components/argon-core/Tabs/Tab";

export default {
  mixins: [clientPaginationMixin],
  layout: "DespachoDashboardLayout",
  components: {
    Tabs,
    TabPane,
    BasePagination,
    RouteBreadCrumb,
    [Select.name]: Select,
    [Option.name]: Option,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Notification.name]: Notification,
  },
  data() {
    return {
      token: this.$cookies.get("token"),
      tableColumnsUnidadesFlotaVehicular: [
        {
          prop: "CodiVehiSali_m",
          label: "Unidad",
          minWidth: 130,
          sortable: true,
        },
        {
          prop: "idSali_m",
          label: "Salida",
          minWidth: 140,
        },
        {
          prop: "NumeVuelSali_m",
          label: "N° Vuelta",
          minWidth: 160,
        },
        {
          prop: "HoraSaliProgSali_m",
          label: "Hora Salida",
          minWidth: 150,
        },
        {
          prop: "HoraLlegProgSali_m",
          label: "Hora Llegada",
          minWidth: 160,
        },
        {
          prop: "atrasoTime",
          label: "Min Atraso",
          minWidth: 150,
        },
        {
          prop: "adelantoTime",
          label: "Min Adelantos",
          minWidth: 170,
        },
        {
          prop: "VeloMaxiSali_m",
          label: "Velocidad",
          minWidth: 160,
        },
        {
          prop: "NumeTarjSali_m",
          label: "N° Tarjeta",
          minWidth: 160,
        },
        {
          prop: "DescRutaSali_m",
          label: "Ruta",
          minWidth: 200,
        },
        {
          prop: "DescFrec",
          label: "Frecuencia",
          minWidth: 200,
        },
        {
          prop: "PenaCtrlSali_d",
          label: "PEN ($)",
          minWidth: 160,
        },
      ],
      mListaSalidasPanelBusqueda: [],
    };
  },
  methods: {
    handleLike(index, row) {},
    handleEdit(index, row) {},
    handleDelete(index, row) {},
    deleteRow(row) {},
    selectionChange(selectedRows) {
      this.selectedRowsUnidadesFlotaVehicular = selectedRows;
    },
    async readSalidasPanelBusqueda() {
      try {
        var datos = await this.$axios.post(
          process.env.baseUrl + "/readSalidasPanel",
          {
            token: this.token,
            unidades: "*",
            rutas: "*",
            fechaI: "2022-06-06",
            fechaF: "2022-06-06",
          }
        );

        if (datos.data.status_code == 200) {
          this.mListaSalidasPanelBusqueda.push(...datos.data.datos);
        }
        console.log(datos.data);
      } catch (error) {
        console.log(error);
      }
    },
  },
  mounted() {
    this.readSalidasPanelBusqueda();
  },
};
</script>
<style>
.itemrutaDespacho {
  padding: 0.75rem 1rem;
  margin-right: 0.25rem;
  margin-left: 0.25rem;
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
.card-sinborder {
  border: 0rem !important;
  border-radius: 0rem !important;
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
  overflow: scroll;
}
.containerTablero {
  background-color: #2dce89;
  height: calc(100vh - 9rem);
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

.card-bodyRPagosVehiculoProduccion {
  padding: 0rem !important;
  height: calc(100vh - 13rem);
  overflow: auto;
}


</style>