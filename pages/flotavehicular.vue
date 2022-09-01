<template>
  <div class="content">
    <base-header>
      <div class="row align-items-center">
        <div class="col" style="margin-top:1rem;">
          <tabs tabNavClasses="nav-fill flex-column flex-sm-row" :centered="true">
            <tab-pane>
              <div slot="title" @click="initUnidadesFlotaVEhicular()">
                Unidades
              </div>

              <br />
              <card class="cardFlotavehicular no-border-card" body-classes="px-0 pb-1 cardBodyFlotavehicular"
                footer-classes="pb-2">
                <div class="row border-0">
                    <div class="col-12 text-right buttonNuevo">
                      <el-tooltip content="Agregar" placement="top">
                        <base-button type="primary" icon size="sm">
                          <span class="btn-inner--icon"><i class="ni ni-fat-add"></i></span>
                        </base-button>
                      </el-tooltip>
                    </div>
                    </div>
                  <div>
                  <el-table v-loading="loadingUnidadesFlotaVehicular" element-loading-text="Cargando..."
                    element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)"
                    class="table-responsive table-flush" :data="mListUnidadesFlotaVehicular"
                    header-row-class-name="thead-dark" height="calc(100vh - 11rem)">
                    <div slot="empty"></div>
                    <el-table-column v-for="column in tableColumnsUnidadesFlotaVehicular" :key="column.label"
                      v-bind="column">
                    </el-table-column>

                    <el-table-column label="Estado" min-width="150px" prop="idEstaVehi" sortable>
                      <template v-slot="{ row }">
                        <badge class="badge-dot mr-4" type="">
                          <i :class="`bg-${row.idEstaVehi == 1 ? 'success' : 'danger'
                          }`"></i>
                          <span class="status">{{
                              row.idEstaVehi == 1 ? "ACTIVO" : "INACTIVO"
                          }}</span>
                        </badge>
                      </template>
                    </el-table-column>

                    <el-table-column label="Informate" min-width="160px" prop="InfoCtrlVehi" sortable>
                      <template v-slot="{ row }">
                        <badge class="badge-dot mr-4" type="">
                          <i :class="`bg-${row.InfoCtrlVehi == 1 ? 'success' : 'danger'
                          }`"></i>
                          <span class="status">{{
                              row.InfoCtrlVehi == 1 ? "SI" : "NO"
                          }}</span>
                        </badge>
                      </template>
                    </el-table-column>

                    <el-table-column min-width="180px" align="right" label="Actions">
                      <div slot-scope="{ $index, row }" class="d-flex">
                        <base-button class="edit" type="success" size="sm" icon>
                          <i class="text-white ni ni-ruler-pencil"></i>
                        </base-button>
                        <base-button class="remove btn-link" type="danger" size="sm" icon>
                          <i class="text-white ni ni-fat-remove"></i>
                        </base-button>
                      </div>
                    </el-table-column>
                  </el-table>
                </div>
              </card>
            </tab-pane>
            <tab-pane>
              <div slot="title" @click="initGruposFlotaVehicular()">Grupos</div>
              <br />
              <card class="cardFlotavehicular no-border-card" body-classes="px-0 pb-1 cardBodyFlotavehicular"
                footer-classes="pb-2">
                <div class="row border-0">
                  <div class="col-12 text-right buttonNuevo">
                    <el-tooltip content="Agregar" placement="top">
                      <base-button type="primary" icon size="sm">
                        <span class="btn-inner--icon"><i class="ni ni-fat-add"></i></span>
                      </base-button>
                    </el-tooltip>
                  </div>
                </div>
                <div>
                  <el-table v-loading="loadingGruposFlotaVehicular" element-loading-text="Cargando..."
                    element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)"
                    :data="mListGruposFlotaVehicular" height="calc(100vh - 11rem)"
                    header-row-class-name="thead-dark">
                    
                    <div slot="empty"></div>
                      
                    <el-table-column v-for="column in tableColumnsGruposFlotaVehicular" :key="column.label"
                      v-bind="column">
                    </el-table-column>

                    <el-table-column label="Estado" min-width="150px" prop="activo" sortable>
                      <template v-slot="{ row }">
                        <badge class="badge-dot mr-4" type="">
                          <i :class="`bg-${row.activo == 1 ? 'success' : 'danger'
                          }`"></i>
                          <span class="status">{{
                              row.activo == 1 ? "ACTIVO" : "INACTIVO"
                          }}</span>
                        </badge>
                      </template>
                    </el-table-column>

                    <el-table-column min-width="180px" align="right" label="Actions">
                      <div slot-scope="{ $index, row }" class="d-flex">
                        <base-button class="edit" type="success" size="sm" icon>
                          <i class="text-white ni ni-ruler-pencil"></i>
                        </base-button>
                        <base-button class="remove btn-link" type="danger" size="sm" icon>
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
              <card class="cardFlotavehicular no-border-card" body-classes="px-0 pb-1 cardBodyFlotavehicular"
                footer-classes="pb-2">
                <div class="row border-0">
                  <div class="col-12 text-right buttonNuevo">
                    <el-tooltip content="Agregar" placement="top">
                      <base-button type="primary" icon size="sm">
                        <span class="btn-inner--icon"><i class="ni ni-fat-add"></i></span>
                      </base-button>
                    </el-tooltip>
                  </div>
                </div>
                <div>

                  <el-table v-loading="loadingPropietariosFlotaVehicular" element-loading-text="Cargando..."
                    element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)"
                    :data="mListPropietariosFlotaVehicular"
                    height="calc(100vh - 11rem)" header-row-class-name="thead-dark">
                    
                    <div slot="empty"></div>
                    <el-table-column v-for="column in tableColumnsPropietariosFlotaVehicular" :key="column.label"
                      v-bind="column">
                    </el-table-column>
                    <el-table-column label="Estado" min-width="140px" prop="activo" sortable>
                      <template v-slot="{ row }">
                        <badge class="badge-dot mr-4" type="">
                          <i :class="`bg-${row.activo == 1 ? 'success' : 'danger'
                          }`"></i>
                          <span class="status">{{
                              row.activo == 1 ? "ACTIVO" : "INACTIVO"
                          }}</span>
                        </badge>
                      </template>
                    </el-table-column>

                    <el-table-column min-width="180px" align="right" label="Actions">
                      <div slot-scope="{ $index, row }" class="d-flex">
                        <base-button class="edit" type="success" size="sm" icon>
                          <i class="text-white ni ni-ruler-pencil"></i>
                        </base-button>
                        <base-button class="remove btn-link" type="danger" size="sm" icon>
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
              <card class="cardFlotavehicular no-border-card" body-classes="px-0 pb-1 cardBodyFlotavehicular"
                footer-classes="pb-2">
                <div>
                  <el-table v-loading="loadingAdministrativosFlotaVehicular" element-loading-text="Cargando..."
                    element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)"
                    :data="mListAdministrativosFlotaVehicular"
                    height="calc(100vh - 11rem)"
                    header-row-class-name="thead-dark">
                    <div slot="empty"></div>
                    <el-table-column v-for="column in tableColumnsAdministrativosFlotaVehicular" :key="column.label"
                      v-bind="column">
                    </el-table-column>

                    <el-table-column min-width="180px" align="right" label="Actions">
                      <div slot-scope="{ $index, row }" class="d-flex">
                        <base-button class="edit" type="success" size="sm" icon>
                          <i class="text-white ni ni-ruler-pencil"></i>
                        </base-button>
                        <base-button class="remove btn-link" type="danger" size="sm" icon>
                          <i class="text-white ni ni-fat-remove"></i>
                        </base-button>

                        <base-button @click.native="showModalPermisosFlotaVehicular($index, row)"
                          class="remove btn-link" type="warning" size="sm" icon>
                          <i class="text-white ni ni-key-25"></i>
                        </base-button>
                      </div>
                    </el-table-column>
                  </el-table>
                </div>
              </card>
            </tab-pane>

            <tab-pane title="Choferes">
              <div slot="title" @click="initChoferesFlotaVehicular()">
                Choferes
              </div>
              <br />
              <card class="cardFlotavehicular no-border-card" body-classes="px-0 pb-1 cardBodyFlotavehicular"
                footer-classes="pb-2">
                <div class="row border-0">
                  <div class="col-12 text-right buttonNuevo">
                    <el-tooltip content="Agregar" placement="top">
                      <base-button type="primary" icon size="sm">
                        <span class="btn-inner--icon"><i class="ni ni-fat-add"></i></span>
                      </base-button>
                    </el-tooltip>
                  </div>
                </div>
                <div>
                  <el-table v-loading="loadingChoferesFlotaVehicular" element-loading-text="Cargando..."
                    element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)"
                    :data="mListChoferesFlotaVehicular" height="calc(100vh - 11rem)"
                    header-row-class-name="thead-dark">
                    <div slot="empty"></div>
                    <el-table-column v-for="column in tableColumnsChoferesFlotaVehicular" :key="column.label"
                      v-bind="column">
                    </el-table-column>

                    <el-table-column min-width="180px" align="right" label="Actions">
                      <div slot-scope="{ $index, row }" class="d-flex">
                        <base-button class="edit" type="success" size="sm" icon>
                          <i class="text-white ni ni-ruler-pencil"></i>
                        </base-button>
                        <base-button class="remove btn-link" type="danger" size="sm" icon>
                          <i class="text-white ni ni-fat-remove"></i>
                        </base-button>

                        <base-button @click.native="initChoferesUnidadSinAsignacionFlotaVehicular($index, row)"
                          class="remove btn-link" type="default" size="sm" icon>
                          <i class="text-white ni ni-bus-front-12"></i>
                        </base-button>
                      </div>
                    </el-table-column>
                  </el-table>
                </div>
              </card>
            </tab-pane>
          </tabs>
        </div>
      </div>
    </base-header>


    <!--Classic modal-->
    <modal :show.sync="modalPermisosUsuariosAdminFlotaVehicular">


      <template slot="header">
        <span>{{ otitleModalUsuarioAdmin }}</span>
      </template>

      <v-jsoneditor v-model="jsonPermisosUsuario" :plus="false" height="20rem" @error="onError"></v-jsoneditor>


      <template slot="footer">
        <base-button type="primary" @click="updatePermisosJSONAdministrativos()">Guardar Cambios</base-button>
        <base-button type="link" class="ml-auto" @click="modalPermisosUsuariosAdminFlotaVehicular = false">Cancelar
        </base-button>
      </template>

    </modal>


    <!--Form modal-->
    <modal :show.sync="modalChoferesFlotaVehicular" size="sm" body-classes="p-0">
      <card type="secondary" header-classes="bg-transparent pb-5" body-classes="px-lg-5 py-lg-5" class="border-0 mb-0">
        <template slot="header">
          <div class="text-muted text-center mt-2 mb-3">
            <el-select  placeholder="Unidades sin chofer">
              <el-option v-for="item in mListChoferesUnidadesSinAsignacion" :key="item.CodiVehi" :label="item.nombres" :value="item.CodiVehi">
                <span style="float: left">{{ item.CodiVehi }}</span>
                <span :style="item.nombres == null ? 'float: right; color: green; font-size: 13px' : 'float: right; color: red; font-size: 13px'">{{ item.nombres == null ? 'Libre' : item.nombres }}</span>
              </el-option>
            </el-select>
          </div>

        </template>
      </card>

    </modal>










  </div>
</template>
<script>
import { Table, TableColumn, Select, Option, Notification } from "element-ui";

import RouteBreadCrumb from "@/components/argon-core/Breadcrumb/RouteBreadcrumb";
import { Modal, BasePagination } from "@/components/argon-core";
import clientPaginationMixin from "~/components/tables/PaginatedTables/clientPaginationMixin";
import swal from "sweetalert2";
import Tabs from "@/components/argon-core/Tabs/Tabs";
import TabPane from "@/components/argon-core/Tabs/Tab";
import VJsoneditor from 'v-jsoneditor'

export default {
  mixins: [clientPaginationMixin],
  layout: "DashboardLayout",
  components: {
    Tabs,
    Modal,
    TabPane,
    BasePagination,
    RouteBreadCrumb,
    VJsoneditor,
    [Select.name]: Select,
    [Option.name]: Option,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Notification.name]: Notification,
  },
  data() {
    return {
      token: this.$cookies.get("token"),
      currentPageUnidadesFlotaVehicular: 1,
      loadingUnidadesFlotaVehicular: false,
      loadingGruposFlotaVehicular: false,
      loadingPropietariosFlotaVehicular: false,
      loadingAdministrativosFlotaVehicular: false,
      loadingChoferesFlotaVehicular: false,
      modalPermisosUsuariosAdminFlotaVehicular: false,
      modalChoferesFlotaVehicular: false,
      tableColumnsUnidadesFlotaVehicular: [
        {
          prop: "CodiVehi",
          label: "Unidad",
          minWidth: 145,
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
          minWidth: 130,
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
          minWidth: 120,
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
          minWidth: 125,
          sortable: true,
        },
        {
          prop: "AliaObse",
          label: "Nombres y Apellidos",
          minWidth: 190,
        },
        {
          prop: "UsuaObse",
          label: "Usuario",
          minWidth: 110,
        },
        {
          prop: "ClavObse",
          label: "Contraseña",
          minWidth: 140,
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
      tableColumnsChoferesFlotaVehicular: [
        {
          prop: "usuario",
          label: "Usuario",
          minWidth: 150,
          sortable: true,
        },
        {
          prop: "constrasenia",
          label: "Contraseña",
          minWidth: 150,
        },
        {
          prop: "nombres",
          label: "Nombres y Apellidos",
          minWidth: 200,
        },
        {
          prop: "email",
          label: "Email",
          minWidth: 200,
        },
        {
          prop: "telefono",
          label: "Teléfono",
          minWidth: 150,
        },
        {
          prop: "CodiVehi",
          label: "Unidad",
          minWidth: 120,
        },
      ],
      mListUnidadesFlotaVehicular: [],
      mListGruposFlotaVehicular: [],
      mListPropietariosFlotaVehicular: [],
      mListAdministrativosFlotaVehicular: [],
      mListChoferesFlotaVehicular: [],
      selectedRowsUnidadesFlotaVehicular: [],
      jsonPermisosUsuario: null,
      oItemAdministrativoFlotaVehicular: null,
      otitleModalUsuarioAdmin: '',
      mListChoferesUnidadesSinAsignacion : []
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
    initChoferesFlotaVehicular: async function () {
      this.loadingChoferesFlotaVehicular = true
      this.mListChoferesFlotaVehicular = []
      try {
        var datos = await this.$axios.post(
          process.env.baseUrlPanel + "/read_choferes",
          {
            token: this.token,
          }
        );

        if (datos.data.status_code == 200) {
          this.mListChoferesFlotaVehicular.push(...datos.data.data);
        } else if (datos.data.status_code == 200) {
          Notification.info({
            title: "Choferes",
            message: "No existen Choferes registradas",
          });
        } else {
          Notification.error({
            title: "Error Api Choferes",
            message: datos.data.msm,
          });
        }
      } catch (error) {
        Notification.error({ title: "Error Catch", msm: error.toString() });
      }
      this.loadingChoferesFlotaVehicular = false;
    },
    initChoferesUnidadSinAsignacionFlotaVehicular: async function (index,row) 
    {
      this.showModalUnidadesChoferFlotavehicular(index,row)
    
      this.mListChoferesUnidadesSinAsignacion = [];

      try {
        var datos = await this.$axios.post(
          process.env.baseUrlPanel + "/read_unidades_choferes",
          {
            token: this.token,
            usuario:row.usuario
          }
        );

        if (datos.data.status_code == 200) {
          this.mListChoferesUnidadesSinAsignacion.push(...datos.data.data);
        } else {
          Notification.error({
            title: "Error Api Choferes",
            message: datos.data.msm,
          });
        }
      } catch (error) {
        Notification.error({ title: "Error Catch", msm: error.toString() });
      }
     
    },
    showModalPermisosFlotaVehicular(index, row) {
      this.modalPermisosUsuariosAdminFlotaVehicular = this.modalPermisosUsuariosAdminFlotaVehicular ? false : true
      this.oItemAdministrativoFlotaVehicular = row
      this.otitleModalUsuarioAdmin = row.NombApellUsua
      this.jsonPermisosUsuario = JSON.parse(row.permisosJSON)
    },
    showModalUnidadesChoferFlotavehicular(index, row) {
      this.modalChoferesFlotaVehicular = this.modalChoferesFlotaVehicular ? false : true
    },
    onError() {
      console.log('error')
    },
    async updatePermisosJSONAdministrativos() {
      try {
        var item = this.oItemAdministrativoFlotaVehicular
        var obj = {
          token: this.token,
          usuario: item.CodiUsua,
          permisosJson: this.jsonPermisosUsuario
        }
        console.log(obj)
        var result = await this.$axios.put(process.env.baseUrl + "/updatePermisosAdministratios", obj)
        if (result.data.status_code == 200) {
          this.$notify({
            title: 'Update Permisos',
            message: result.data.msm,
            type: 'success'
          });

        } else {

          this.$notify({
            title: 'Error Update Permisos',
            message: result.data.msm,
            type: 'danger'
          });

        }
      } catch (error) {
        this.$notify({
          title: 'Error TRY Permisos',
          message: error.toString(),
          type: 'danger'
        });
      }
    }
  },
  mounted() {
    this.initUnidadesFlotaVEhicular();
  },
};
</script>
<style>
.cardFlotavehicular {
  height: calc(100vh - 11rem) !important;
  overflow: auto;
}

.cardBodyFlotavehicular {
  padding: 0%;
}

.cardFlotavehicular::-webkit-scrollbar {
  display: none;
}

.no-border-card .card-footer {
  border-top: 0;
}

body {
  overflow: auto !important;
}

.buttonNuevo{
  padding-top: 5px; 
  padding-right: 25px; 
  padding-bottom: 5px;
}

</style>
