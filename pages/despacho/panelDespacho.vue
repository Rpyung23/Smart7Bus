<template>
  <div class="content">
    <base-header class="pb-6"></base-header>

    <div class="containerTablero">
      <div class="container-rutas">
        <div
          class="itemrutaDespacho"
          v-for="ruta in mListRutasDespacho"
          :id="ruta.LetrRuta"
          :key="ruta.LetrRuta"
          @click="lecturaDespacho(ruta)"
        >
          {{ ruta.DescRuta }}
        </div>
      </div>
      <div class="container-calendario col_personalizado">
        <card
          class="no-border-card card-sinborder"
          body-classes="card-body-sinpadding px-0 pb-1"
          footer-classes="pb-2"
        >
          <div>
            <el-table
              :data="mListUnidadesFlotaVehicular"
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
                sortable
              >
                <template v-slot="{ row }">
                  <badge class="badge-dot mr-4" type="">
                    <i
                      :class="`bg-${
                        row.idEstaVehi == 1 ? 'success' : 'danger'
                      }`"
                    ></i>
                    <span class="status">{{
                      row.idEstaVehi == 1 ? "ACTIVO" : "INACTIVO"
                    }}</span>
                  </badge>
                </template>
              </el-table-column>

              <el-table-column
                label="Informate"
                min-width="170px"
                prop="InfoCtrlVehi"
                sortable
              >
                <template v-slot="{ row }">
                  <badge class="badge-dot mr-4" type="">
                    <i
                      :class="`bg-${
                        row.InfoCtrlVehi == 1 ? 'success' : 'danger'
                      }`"
                    ></i>
                    <span class="status">{{
                      row.InfoCtrlVehi == 1 ? "SI" : "NO"
                    }}</span>
                  </badge>
                </template>
              </el-table-column>

              <el-table-column min-width="180px" align="right" label="Actions">
                <div slot-scope="{ $index, row }" class="d-flex">
                  <base-button
                    @click.native="handleEdit($index, row)"
                    class="edit"
                    type="success"
                    size="sm"
                    icon
                  >
                    <i class="text-white ni ni-ruler-pencil"></i>
                  </base-button>
                  <base-button
                    @click.native="handleDelete($index, row)"
                    class="remove btn-link"
                    type="danger"
                    size="sm"
                    icon
                  >
                    <i class="text-white ni ni-fat-remove"></i>
                  </base-button>
                </div>
              </el-table-column>
            </el-table>
          </div>
        </card>
      </div>
    </div>

    <!--<div class="col ">
          <tabs
            :centered="true"
          >
            <tab-pane  v-for="ruta in mListRutasDespacho" :key="ruta.LetrRuta" :title="ruta.LetrRuta"></tab-pane>

          </tabs>
          <card
            class="no-border-card"
            body-classes="px-0 pb-1"
            footer-classes="pb-2"
          >
            <div>

              <el-table
                :data="[]"
                row-key="id"
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
                  sortable
                >
                  <template v-slot="{ row }">
                    <badge class="badge-dot mr-4" type="">
                      <i
                        :class="`bg-${
                          row.idEstaVehi == 1 ? 'success' : 'danger'
                        }`"
                      ></i>
                      <span class="status">{{
                        row.idEstaVehi == 1 ? "ACTIVO" : "INACTIVO"
                      }}</span>
                    </badge>
                  </template>
                </el-table-column>

                <el-table-column
                  label="Informate"
                  min-width="170px"
                  prop="InfoCtrlVehi"
                  sortable
                >
                  <template v-slot="{ row }">
                    <badge class="badge-dot mr-4" type="">
                      <i
                        :class="`bg-${
                          row.InfoCtrlVehi == 1 ? 'success' : 'danger'
                        }`"
                      ></i>
                      <span class="status">{{
                        row.InfoCtrlVehi == 1 ? "SI" : "NO"
                      }}</span>
                    </badge>
                  </template>
                </el-table-column>

                <el-table-column
                  min-width="180px"
                  align="right"
                  label="Actions"
                >
                  <div slot-scope="{ $index, row }" class="d-flex">
                    <base-button
                      @click.native="handleEdit($index, row)"
                      class="edit"
                      type="success"
                      size="sm"
                      icon
                    >
                      <i class="text-white ni ni-ruler-pencil"></i>
                    </base-button>
                    <base-button
                      @click.native="handleDelete($index, row)"
                      class="remove btn-link"
                      type="danger"
                      size="sm"
                      icon
                    >
                      <i class="text-white ni ni-fat-remove"></i>
                    </base-button>
                  </div>
                </el-table-column>
              </el-table>
            </div>
          </card>
        </div>-->
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
          prop: "CodiVehi",
          label: "Unidad",
          minWidth: 130,
          sortable: true,
        },
        {
          prop: "CodiDispVehi",
          label: "Serie",
          minWidth: 170,
        },
        {
          prop: "PlacVehi",
          label: "Placa",
          minWidth: 110,
        },
        {
          prop: "NumeSIMVehi",
          label: "Número Sim",
          minWidth: 160,
        },      {
          prop: "CodiVehi",
          label: "Unidad",
          minWidth: 130,
          sortable: true,
        },
        {
          prop: "CodiDispVehi",
          label: "Serie",
          minWidth: 170,
        },
        {
          prop: "PlacVehi",
          label: "Placa",
          minWidth: 110,
        },
        {
          prop: "NumeSIMVehi",
          label: "Número Sim",
          minWidth: 160,
        },
      ],
      mListRutasDespacho: [],
      mListUnidadesFlotaVehicular: [],
      selectedRowsUnidadesFlotaVehicular: [],
    };
  },
  methods: {
    activeRutaDespacho(ruta){
       $("#"+ruta.LetrRuta).addClass("activeRutaDespacho")
    },
    removeAllRutaNoSelect()
    {
      for(var i = 0;i<this.mListRutasDespacho.length;i++)
      {
        var ruta = "#"+this.mListRutasDespacho[i].LetrRuta
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
    lecturaDespacho(ruta)
    {
      this.removeAllRutaNoSelect()
      this.activeRutaDespacho(ruta)
    },
    async initUnidadesFlotaVEhicular() {
      try {
        var datos = await this.$axios.post(
          process.env.baseUrlPanel + "/unidades",
          {
            token: this.token,
          }
        );

        if (datos.data.status_code == 200) {
          this.mListUnidadesFlotaVehicular.push(...datos.data.data);
        } else if (datos.data.status_code == 200) {
          Notification.info({
            title: "Flota Vehicular",
            message: "No existen unidades registradas",
          });
        } else {
          Notification.error({
            title: "Error Api Flota Vehicular",
            message: datos.data.msm,
          });
        }
      } catch (error) {
        Notification.error({ title: "Error Catch", msm: error.toString() });
      }
    },

    handleLike(index, row) {},
    handleEdit(index, row) {},
    handleDelete(index, row) {},
    deleteRow(row) {},
    selectionChange(selectedRows) {
      this.selectedRowsUnidadesFlotaVehicular = selectedRows;
    },
  },
  mounted() {
    this.initUnidadesFlotaVEhicular();
    this.initRutasDespacho();
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

.activeRutaDespacho{
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
  height: calc( 100vh - 6rem);
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
</style>