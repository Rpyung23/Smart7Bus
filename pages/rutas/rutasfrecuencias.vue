<template>
  <div class="content">
    <base-header class="pb-6">
      <div class="row align-items-center py-4">
        <div class="col">
          <tabs tabNavClasses="nav-fill flex-column flex-sm-row">
            <tab-pane title="Rutas">
              <br />
              <card
                class="no-border-card"
                body-classes="px-0 pb-1"
                footer-classes="pb-2"
              >
              <el-table
                    :data="tableData"
                    row-key="id"
                    header-row-class-name="thead-dark"
                  >
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
              </card>
            </tab-pane>
            <tab-pane title="Frecuencias"></tab-pane>
            <tab-pane title="Controles"></tab-pane>
          </tabs>
        </div>
      </div>
    </base-header>
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
          type: "selection",
        },
        {
          prop: "LetrRuta",
          label: "Letra",
          minWidth: 100,
        },
        {
          prop: "DescRuta",
          label: "Descripción",
          minWidth: 200,
        },
        {
          prop: "DescTerm",
          label: "Terminal",
          minWidth: 140,
        },
        {
          prop: "InteSaliProgRuta",
          label: "Intervalo",
          minWidth: 140,
        },
        {
          prop: "HoraInicSaliProgRuta",
          label: "Salida",
          minWidth: 160,
        },
        {
          prop: "HoraFinaSaliProgRuta",
          label: "Finalización",
          minWidth: 160,
        },
      ],
      tableData: [],
      selectedRows: [],
      token: this.$cookies.get("token"),
    };
  },
  methods: {
    handleLike(index, row) {
      swal.fire({
        title: `You liked ${row.name}`,
        buttonsStyling: false,
        type: "success",
        confirmButtonClass: "btn btn-success btn-fill",
      });
    },
    handleEdit(index, row) {
      swal.fire({
        title: `You want to edit ${row.name}`,
        buttonsStyling: false,
        confirmButtonClass: "btn btn-info btn-fill",
      });
    },
    handleDelete(index, row) {
      swal
        .fire({
          title: "Are you sure?",
          text: `You won't be able to revert this!`,
          type: "warning",
          showCancelButton: true,
          confirmButtonClass: "btn btn-success btn-fill",
          cancelButtonClass: "btn btn-danger btn-fill",
          confirmButtonText: "Yes, delete it!",
          buttonsStyling: false,
        })
        .then((result) => {
          if (result.value) {
            this.deleteRow(row);
            swal.fire({
              title: "Deleted!",
              text: `You deleted ${row.name}`,
              type: "success",
              confirmButtonClass: "btn btn-success btn-fill",
              buttonsStyling: false,
            });
          }
        });
    },
    deleteRow(row) {
      let indexToDelete = this.tableData.findIndex(
        (tableRow) => tableRow.id === row.id
      );
      if (indexToDelete >= 0) {
        this.tableData.splice(indexToDelete, 1);
      }
    },
    showToast(type,msm){
      var Toast = swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', swal.stopTimer)
    toast.addEventListener('mouseleave', swal.resumeTimer)
  }
})

Toast.fire({
  icon: type,
  title: msm
})
    },
    selectionChange(selectedRows) {
      this.selectedRows = selectedRows;
    },
    async readAllRutas() {
      var datos = await this.$axios.post(process.env.baseUrlPanel + "/rutes", {
        token: this.token,
      });

      if (datos.data.status_code == 200) 
      {
        for (var i = 0; i < datos.data.data.length; i++) {
          datos.data.data[i].statusType = datos.data.data[i].ActiRuta = 1
            ? "success"
            : "danger";
          datos.data.data[i].status = datos.data.data[i].ActiRuta = 1
            ? "Activo"
            : "Inactivo";
        }

        this.tableData.push(...datos.data.data);
      }else if(datos.data.status_code == 400)
      {
        this.showToast('danger',datos.data.msm)
      }else{
         this.showToast('warning','No existen rutas disponibles')
      }
    },
  },
  mounted() {
    this.readAllRutas();
  },
};
</script>
<style>
.no-border-card .card-footer {
  border-top: 0;
}
</style>
