<template>
  <div class="content">
    <base-header class="pb-6">
      <div class="row align-items-center py-4">
        <div class="col">
          <tabs
            tabNavClasses="nav-fill flex-column flex-sm-row"
            :centered="true"
          >
            <tab-pane>
              <div slot="title" @click="initUnidadesFlotaVEhicular()">
                Unidades
              </div>

              <br />
              <card
                class="no-border-card"
                body-classes="px-0 pb-1"
                footer-classes="pb-2"
              >
                <div>
                  <div
                    class="
                      col-12
                      d-flex
                      justify-content-center justify-content-sm-between
                      flex-wrap
                    "
                  >
                    <div>
                      <base-input
                        v-model="searchQuery"
                        prepend-icon="fas fa-search"
                        placeholder="Buscando..."
                      >
                      </base-input>
                    </div>
                  </div>
                  <br>
                  <el-table
                    v-loading="loadingUnidadesFlotaVehicular"
                    element-loading-text="Cargando..."
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(0, 0, 0, 0.8)"
                    class="table-responsive table-flush"
                    :data="mListUnidadesFlotaVehicular"
                    header-row-class-name="thead-dark"
                  >
                    <div slot="empty"></div>
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
                <div class="card-footer py-4 d-flex justify-content-end">
                  <base-pagination
                    v-model="currentPageUnidadesFlotaVehicular"
                    :total="50"
                  ></base-pagination>
                </div>
              </card>
            </tab-pane>
            <tab-pane>
              <div slot="title" @click="initGruposFlotaVehicular()">Grupos</div>
              <br />
              <card
                class="no-border-card"
                body-classes="px-0 pb-1"
                footer-classes="pb-2"
              >
                <div>
                  <div
                    class="
                      col-12
                      d-flex
                      justify-content-center justify-content-sm-between
                      flex-wrap
                    "
                  >
                    <div>
                      <base-input
                        v-model="searchQuery"
                        prepend-icon="fas fa-search"
                        placeholder="Buscando..."
                      >
                      </base-input>
                    </div>
                  </div>
                  <br>
                  <el-table
                    v-loading="loadingGruposFlotaVehicular"
                    element-loading-text="Cargando..."
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(0, 0, 0, 0.8)"
                    :data="mListGruposFlotaVehicular"
                    header-row-class-name="thead-dark"
                  >
                    <div slot="empty"></div>

                    <el-table-column
                      v-for="column in tableColumnsGruposFlotaVehicular"
                      :key="column.label"
                      v-bind="column"
                    >
                    </el-table-column>

                    <el-table-column
                      label="Estado"
                      min-width="150px"
                      prop="activo"
                      sortable
                    >
                      <template v-slot="{ row }">
                        <badge class="badge-dot mr-4" type="">
                          <i
                            :class="`bg-${
                              row.activo == 1 ? 'success' : 'danger'
                            }`"
                          ></i>
                          <span class="status">{{
                            row.activo == 1 ? "ACTIVO" : "INACTIVO"
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
            </tab-pane>
            <tab-pane>
              <div slot="title" @click="initPropietariosFlotaVehicular()">
                Propietarios
              </div>
              <br />
              <card
                class="no-border-card"
                body-classes="px-0 pb-1"
                footer-classes="pb-2"
              >
                <div>
                  <div
                    class="
                      col-12
                      d-flex
                      justify-content-center justify-content-sm-between
                      flex-wrap
                    "
                  >
                    <div>
                      <base-input
                        v-model="searchQuery"
                        prepend-icon="fas fa-search"
                        placeholder="Buscando..."
                      >
                      </base-input>
                    </div>
                  </div>
                  <br>
                  <el-table
                    v-loading="loadingPropietariosFlotaVehicular"
                    element-loading-text="Cargando..."
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(0, 0, 0, 0.8)"
                    :data="mListPropietariosFlotaVehicular"
                    header-row-class-name="thead-dark"
                  >
                    <div slot="empty"></div>
                    <el-table-column
                      v-for="column in tableColumnsPropietariosFlotaVehicular"
                      :key="column.label"
                      v-bind="column"
                    >
                    </el-table-column>
                    <el-table-column
                      label="Estado"
                      min-width="150px"
                      prop="activo"
                      sortable
                    >
                      <template v-slot="{ row }">
                        <badge class="badge-dot mr-4" type="">
                          <i
                            :class="`bg-${
                              row.activo == 1 ? 'success' : 'danger'
                            }`"
                          ></i>
                          <span class="status">{{
                            row.activo == 1 ? "ACTIVO" : "INACTIVO"
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
            </tab-pane>
            <tab-pane>
              <div slot="title" @click="initAdministrativosFlotaVehicular()">
                Usuarios Admin..
              </div>
              <br />
              <card
                class="no-border-card"
                body-classes="px-0 pb-1"
                footer-classes="pb-2"
              >
                <div>
                  <div
                    class="
                      col-12
                      d-flex
                      justify-content-center justify-content-sm-between
                      flex-wrap
                    "
                  >
                    <div>
                      <base-input
                        v-model="searchQuery"
                        prepend-icon="fas fa-search"
                        placeholder="Buscando..."
                      >
                      </base-input>
                    </div>
                  </div>
                  <br>
                  <el-table
                    v-loading="loadingAdministrativosFlotaVehicular"
                    element-loading-text="Cargando..."
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(0, 0, 0, 0.8)"
                    :data="mListAdministrativosFlotaVehicular"
                    header-row-class-name="thead-dark"
                  >
                    <div slot="empty"></div>
                    <el-table-column
                      v-for="column in tableColumnsAdministrativosFlotaVehicular"
                      :key="column.label"
                      v-bind="column"
                    >
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
                        
                        <base-button
                          @click.native="handleDelete($index, row)"
                          class="remove btn-link"
                          type="warning"
                          size="sm"
                          icon
                        >
                          <i class="text-white ni ni-key-25"></i>
                        </base-button>
                      </div>
                    </el-table-column>
                  </el-table>
                </div>
              </card>
            </tab-pane>
            <tab-pane title="Choferes"> </tab-pane>
          </tabs>
        </div>
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
  layout: "DashboardLayout",
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
      currentPageUnidadesFlotaVehicular:1,
      loadingUnidadesFlotaVehicular: false,
      loadingGruposFlotaVehicular: false,
      loadingPropietariosFlotaVehicular: false,
      loadingAdministrativosFlotaVehicular: false,
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
        },
      ],
      tableColumnsGruposFlotaVehicular: [
        {
          prop: "id",
          label: "Código",
          minWidth: 115,
          sortable: true,
        },
        {
          prop: "descripcion",
          label: "Descripción",
          minWidth: 170,
        },
        {
          prop: "color",
          label: "Fondo",
          minWidth: 110,
        },
        {
          prop: "color1",
          label: "Texto",
          minWidth: 160,
        },
        {
          prop: "color2",
          label: "Línea",
          minWidth: 160,
        },
      ],
      tableColumnsPropietariosFlotaVehicular: [
        {
          prop: "CodiObse",
          label: "Código",
          minWidth: 115,
          sortable: true,
        },
        {
          prop: "AliaObse",
          label: "Nombres y Apellidos",
          minWidth: 170,
        },
        {
          prop: "UsuaObse",
          label: "Usuario",
          minWidth: 110,
        },
        {
          prop: "ClavObse",
          label: "Contraseña",
          minWidth: 120,
        },
        {
          prop: "descripcion",
          label: "Descripción",
          minWidth: 200,
        },
      ],
      tableColumnsAdministrativosFlotaVehicular: [
        {
          prop: "CodiUsua",
          label: "Código",
          minWidth: 120,
          sortable: true,
        },
        {
          prop: "NombApellUsua",
          label: "Nombres y Apellidos",
          minWidth: 240,
        },
        {
          prop: "NombUsua",
          label: "Usuario",
          minWidth: 140,
        },
        {
          prop: "ClavUsua",
          label: "Contraseña",
          minWidth: 140,
        },
        {
          prop: "DescTerm",
          label: "Terminal",
          minWidth: 200,
        },
      ],
      mListUnidadesFlotaVehicular: [],
      mListGruposFlotaVehicular: [],
      mListPropietariosFlotaVehicular: [],
      mListAdministrativosFlotaVehicular: [],
      selectedRowsUnidadesFlotaVehicular: [],
    };
  },
  methods: {
    initUnidadesFlotaVEhicular: async function () {
      this.mListUnidadesFlotaVehicular = [];
      this.loadingUnidadesFlotaVehicular = true;
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
      this.loadingUnidadesFlotaVehicular = false;
    },
    initGruposFlotaVehicular: async function () {
      this.mListGruposFlotaVehicular = [];
      this.loadingGruposFlotaVehicular = true;
      try {
        var datos = await this.$axios.post(
          process.env.baseUrlPanel + "/grupos",
          {
            token: this.token,
          }
        );

        if (datos.data.status_code == 200) {
          this.mListGruposFlotaVehicular.push(...datos.data.data);
        } else if (datos.data.status_code == 200) {
          Notification.info({
            title: "Grupos",
            message: "No existen grupos registradas",
          });
        } else {
          Notification.error({
            title: "Error Api Grupos",
            message: datos.data.msm,
          });
        }
      } catch (error) {
        Notification.error({ title: "Error Catch", msm: error.toString() });
      }
      this.loadingGruposFlotaVehicular = false;
    },
    initPropietariosFlotaVehicular: async function () {
      this.mListPropietariosFlotaVehicular = [];
      this.loadingPropietariosFlotaVehicular = true;
      try {
        var datos = await this.$axios.post(
          process.env.baseUrlPanel + "/read-propietarios",
          {
            token: this.token,
          }
        );

        if (datos.data.status_code == 200) {
          this.mListPropietariosFlotaVehicular.push(...datos.data.data);
        } else if (datos.data.status_code == 200) {
          Notification.info({
            title: "Propietarios",
            message: "No existen Propietarios registradas",
          });
        } else {
          Notification.error({
            title: "Error Api Propietarios",
            message: datos.data.msm,
          });
        }
      } catch (error) {
        Notification.error({ title: "Error Catch", msm: error.toString() });
      }
      this.loadingPropietariosFlotaVehicular = false;
    },
    initAdministrativosFlotaVehicular: async function () {
      this.mListAdministrativosFlotaVehicular = [];
      this.loadingAdministrativosFlotaVehicular = true;
      try {
        var datos = await this.$axios.post(
          process.env.baseUrlPanel + "/read-administrativos",
          {
            token: this.token,
          }
        );

        if (datos.data.status_code == 200) {
          this.mListAdministrativosFlotaVehicular.push(...datos.data.data);
        } else if (datos.data.status_code == 200) {
          Notification.info({
            title: "Administrativos",
            message: "No existen Administrativos registradas",
          });
        } else {
          Notification.error({
            title: "Error Api Administrativos",
            message: datos.data.msm,
          });
        }
      } catch (error) {
        Notification.error({ title: "Error Catch", msm: error.toString() });
      }
      this.loadingAdministrativosFlotaVehicular = false;
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
  },
};
</script>
<style>
.no-border-card .card-footer {
  border-top: 0;
}

body {
  overflow: auto !important;
}
</style>
