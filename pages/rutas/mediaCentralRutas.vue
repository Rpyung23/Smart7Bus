<template>
  <div class="content">
    <base-header>
      <div class="row align-items-center">
        <div class="col" style="margin-top: 1rem">
          <card
            class="cardMediaCentralControles no-border-card"
            body-classes="px-0 pb-1 cardBodyMediaCentral"
            footer-classes="pb-2"
          >
            <div class="col-12 text-right buttonNuevo">
              <base-button
                type="primary"
                icon
                size="sm"
                @click="showRegistroMediaCentrasl()"
              >
                <span class="btn-inner--icon"
                  ><i class="ni ni-fat-add"></i>Agregar Media Central</span
                >
              </base-button>
            </div>
            <el-table
              v-loading="loadingRutaRutasFrecuencias"
              element-loading-text="Cargando..."
              element-loading-background="rgba(0, 0, 0, 0.8)"
              height="calc(100vh - 10.25rem)"
              :data="tableData"
              row-key="id"
              header-row-class-name="thead-dark"
            >
              >
              <div slot="empty"></div>

              <el-table-column min-width="180px" align="right" label="Actions">
                <div slot-scope="{ row }" class="d-flex">
                  <base-button
                    class="edit"
                    type="success"
                    size="sm"
                    icon
                    @click="editMediaCentral(row)"
                  >
                    <i class="text-white ni ni-ruler-pencil"></i>
                  </base-button>
                  <base-button
                    class="remove btn-link"
                    :type="row.estado == 1 ? 'danger': 'primary' "
                    size="sm"
                    icon
                    @click="changeEstadoMediaCentral(row)"
                  >
                    <i :class="row.estado == 1 ? 'text-white ni ni-fat-remove' :'text-white ni ni-check-bold' "></i>
                  </base-button>
                </div>
              </el-table-column>

              <el-table-column
                v-for="column in tableColumns"
                :key="column.label"
                v-bind="column"
              >
              </el-table-column>

              <el-table-column
                label="Estado"
                min-width="150px"
                prop="ActiRuta"
                sortable
              >
                <template v-slot="{ row }">
                  <badge class="badge-dot mr-4" type="">
                    <i :class="`bg-${row.statusType}`"></i>
                    <span class="status">{{ row.status }}</span>
                  </badge>
                </template>
              </el-table-column>
            </el-table>
          </card>
        </div>
      </div>
    </base-header>

    <!--Form modal Agregar Propietario-->
    <modal :show.sync="modalRegistroMediaCentraslRutas">
      <validation-observer v-slot="{ handleSubmit }" ref="formValidator">
        <form
          class="needs-validation"
          @submit.prevent="handleSubmit(firstFormSubmit)"
        >
          <div class="form-row">
            <div class="col-md-6">
              <base-input
                prepend-icon="ni ni-badge"
                name="Nombre"
                placeholder="Nombre Media Central"
                rules="required"
                v-model="descripcionPonderada"
              >
              </base-input>
            </div>
            <div class="col-md-6">
              <base-input
                name="Código"
                placeholder="Valor ($)"
                rules="required"
                v-model="valorPondera"
              >
                <small slot="append" class="font-weight-bold">USD</small>
              </base-input>
            </div>
          </div>
          <div class="form-row">
            <div class="col-md-12">
              <base-input
                prepend-icon="ni ni-single-copy-04"
                name="Descripción Media Central"
                placeholder="Descripción Media Central"
                rules="required"
                v-model="anotacionPonderada"
              >
              </base-input>
            </div>
          </div>

          <div class="text-right">
            <base-button type="danger" @click="cancelarRegisterMediaCentral()">Cancelar</base-button>
            <base-button v-if="editIndexPonderada == -1" type="primary" native-type="submit" @click="insertMediaCentral()"
              >Agregar</base-button
            >
            <base-button v-else type="primary" native-type="submit" @click="updateMediaCentral()"
              >Actualizar</base-button
            >
          </div>
        </form>
      </validation-observer>
    </modal>
  </div>
</template>
<script>
import { Table, TableColumn, Select, Option } from "element-ui";

import RouteBreadCrumb from "@/components/argon-core/Breadcrumb/RouteBreadcrumb";
import { BasePagination } from "@/components/argon-core";
import clientPaginationMixin from "~/components/tables/PaginatedTables/clientPaginationMixin";
import swal from "sweetalert2";
import Tabs from "@/components/argon-core/Tabs/Tabs";
import TabPane from "@/components/argon-core/Tabs/Tab";
import Swal from "sweetalert2";
export default {
  mixins: [clientPaginationMixin],
  layout: "EditRutasDashboardLayout",
  components: {
    Tabs,
    TabPane,
    BasePagination,
    RouteBreadCrumb,
    [Select.name]: Select,
    [Option.name]: Option,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
  },
  data() {
    return {
      tableColumns: [
        {
          prop: "idPRuta",
          label: "Código",
          minWidth: 130,
        },
        {
          prop: "nombrePonderada",
          label: "Descripción",
          minWidth: 230,
        },
        {
          prop: "valorPonderada",
          label: "Valor ($)",
          minWidth: 130,
        },
        {
          prop: "detallePonderada",
          label: "Anotaciones",
          minWidth: 260,
        },
        {
          prop: "fechaRegistro",
          label: "F. Registro",
          minWidth: 180,
        },
      ],
      loadingRutaRutasFrecuencias: false,
      token: this.$cookies.get("token"),
      mListRutasSeleccionadas: [],
      mSelectRutaFrecuencia: "",
      tableData: [],
      modalRegistroMediaCentraslRutas: false,
      descripcionPonderada:'',
      anotacionPonderada:'',
      valorPondera:'',
      editIndexPonderada: -1,
      idPRuta:''
    };
  },
  methods: {
    showRegistroMediaCentrasl() {
      this.limpiarRegisterMediaCentral()
      this.modalRegistroMediaCentraslRutas = true;
      if (this.modalRegistroMediaCentraslRutas == false) {
        this.cancelarRegisterMediaCentral()
      }
    },
    async readAllMediaCentral() {
      this.tableData = [];
      this.loadingRutaRutasFrecuencias = true;
      var datos = await this.$axios.post(
        process.env.baseUrlPanel + "/todasMediasCentrales",
        {
          token: this.token,
          tipo: 3,
        }
      );

      if (datos.data.status_code == 200) {
        for (var i = 0; i < datos.data.datos.length; i++) {
          datos.data.datos[i].statusType =
            datos.data.datos[i].estado == 1 ? "success" : "danger";
          datos.data.datos[i].status =
            datos.data.datos[i].estado == 1 ? "Activo" : "Inactivo";
        }

        this.tableData.push(...datos.data.datos);
      } else if (datos.data.status_code == 400) {
        //this.showToast('danger',datos.data.msm)
        this.$notify({
          message: datos.data.msm,
          timeout: 3000,
          type: "danger",
        });
      } else {
        //this.showToast('warning','No existen rutas disponibles')
        this.$notify({
          message: "No existen TENDENCIAS CENTRALES disponibles",
          timeout: 3000,
          type: "warning",
        });
      }
      this.loadingRutaRutasFrecuencias = false;
    },
    async insertMediaCentral(){
      try {
        var objBody= {
          token: this.token,
          datos: {
            _nomponde : this.descripcionPonderada,
            _detaponde : this.anotacionPonderada,
            _valoponde : this.valorPondera,
            _usuario : this.$cookies.get("namesUsuario")
          }
        }
      var result = await this.$axios.post(process.env.baseUrl + "/register-mediaCentral", objBody)
    if (result.data.status_code == 200) {
      this.readAllMediaCentral()
      this.limpiarRegisterMediaCentral()
      this.$notify({
          message: result.data.msm,
          timeout: 1500,
          type: 'default'
        });
    } else {
      this.$notify({
          title: 'Error al insertar',
          timeout: 3000,
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
    },
    async updateMediaCentral(){
      try {
        var objBody= {
          token: this.token,
          datos: {
            _nomponde : this.descripcionPonderada,
            _detaponde : this.anotacionPonderada,
            _valoponde : this.valorPondera,
            _idpruta: this.idPRuta
          }
        }
      var result = await this.$axios.put(process.env.baseUrl + "/update-mediaCentral", objBody)
    if (result.data.status_code == 200) {
      this.readAllMediaCentral()
      this.limpiarRegisterMediaCentral()
      this.$notify({
          message: result.data.msm,
          timeout: 1500,
          type: 'default'
        });
    } else {
      this.$notify({
          title: 'Error al actualizar',
          timeout: 3000,
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
    },
    limpiarRegisterMediaCentral(){
      this.descripcionPonderada = ''
      this.anotacionPonderada = ''
      this.valorPondera = ''
      this.editIndexPonderada = -1
    },
    cancelarRegisterMediaCentral(){
      this.descripcionPonderada = ''
      this.anotacionPonderada = ''
      this.valorPondera = ''
      this.editIndexPonderada = -1
      this.modalRegistroMediaCentraslRutas = false
    },
    editMediaCentral(row){
      this.descripcionPonderada = row.nombrePonderada
      this.anotacionPonderada = row.detallePonderada
      this.valorPondera = row.valorPonderada
      this.idPRuta = row.idPRuta
      this.editIndexPonderada = 1
      this.modalRegistroMediaCentraslRutas = true
    },
    async changeEstadoMediaCentral(row){
      var _estado
      if (row.estado == 1) {
        _estado = 0
      }else{
        _estado = 1
      }
      try {
        var objBody= {
        token:this.token,
        datos:{
          _estado:_estado,
          _idpruta:row.idPRuta,
          _usuario : this.$cookies.get("namesUsuario")
        }
      }
      Swal.fire({
        title: row.estado == 1 ? 'Desactivar Media Central':'Activar Media Central',
        text: row.nombrePonderada,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: row.estado == 1 ? 'Si, desactivar.' : 'Si, activar.'
      }).then(async (result) => {
        if (result.isConfirmed) {
          var result = await this.$axios.delete(process.env.baseUrl + "/delete-mediaCentral", {data:objBody})
          if (result.data.status_code == 200) {
            this.readAllMediaCentral()
            this.$notify({
                message: result.data.msm,
                timeout: 1500,
                type: 'default'
              });
          } else {
            this.$notify({
                title: 'Error al eliminar',
                timeout: 3000,
                message: result.data.msm,
                type: 'danger'
                
              });
          }  
        }
      })
    } catch (error) {
        this.$notify({
          title: 'Error TRY Permisos',
          message: error.toString(),
          type: 'danger'
        });
      }
    },
  },
  mounted() {
    this.readAllMediaCentral();
  },
};
</script>
<style>
.cardMediaCentralControles {
  height: calc(100vh - 6.7rem) !important;
  overflow: auto;
}

.cardMediaCentralControles::-webkit-scrollbar {
  display: none;
}

.no-border-card .card-footer {
  border-top: 0;
}

body {
  overflow: auto !important;
}

.buttonNuevo {
  padding-right: 25px;
  padding-bottom: 5px;
}
</style>
