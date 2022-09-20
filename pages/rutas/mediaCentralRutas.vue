<template>
  <div class="content">
    <base-header>
      <div class="row align-items-center">
        <div class="col" style="margin-top: 1rem">
          <card
            class="cardRutasFrecuencias no-border-card"
            body-classes="px-0 pb-1 cardBodyFlotavehicular"
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
                    @click="editRuta(row)"
                  >
                    <i class="text-white ni ni-ruler-pencil"></i>
                  </base-button>
                  <base-button
                    class="remove btn-link"
                    type="danger"
                    size="sm"
                    icon
                    @click="changeEstadoRuta(row)"
                  >
                    <i class="text-white ni ni-fat-remove"></i>
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
              >
              </base-input>
            </div>
            <div class="col-md-6">
              <base-input
                name="Código"
                placeholder="Valor ($)"
                rules="required"
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
              >
              </base-input>
            </div>
          </div>

          <div class="text-right">
            <base-button type="danger">Cancelar</base-button>
            <base-button type="primary" native-type="submit"
              >Agregar</base-button
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
          minWidth: 160,
        },
        {
          prop: "detallePonderada",
          label: "Anotaciones",
          minWidth: 240,
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
    };
  },
  methods: {
    showRegistroMediaCentrasl() {
      this.modalRegistroMediaCentraslRutas = true;
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
          message: "No existen rutas disponibles",
          timeout: 3000,
          type: "warning",
        });
      }
      this.loadingRutaRutasFrecuencias = false;
    },
  },
  mounted() {
    this.readAllMediaCentral();
  },
};
</script>
<style>
.cardRutasFrecuencias {
  height: calc(100vh - 6.6rem) !important;
  overflow: auto;
}

.cardBodyRutasFrecuencias {
  padding: 0%;
}

.cardRutasFrecuenciasr::-webkit-scrollbar {
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
