<template>
  <div class="content">
    <base-header class="pb-6">
      <div class="row align-items-center py-4">
        <div class="col">
          <tabs tabNavClasses="nav-fill flex-column flex-sm-row">
            <tab-pane title="Rutas">
              <br>
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
                    <el-select
                      class="select-primary pagination-select"
                      v-model="pagination.perPage"
                      placeholder="Per page"
                    >
                      <el-option
                        class="select-primary"
                        v-for="item in pagination.perPageOptions"
                        :key="item"
                        :label="item"
                        :value="item"
                      >
                      </el-option>
                    </el-select>

                    <div>
                      <base-input
                        v-model="searchQuery"
                        prepend-icon="fas fa-search"
                        placeholder="Buscando..."
                      >
                      </base-input>
                    </div>
                  </div>
                  <el-table
                    :data="queriedData"
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
                      prop="status"
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
                      label="Informate"
                      min-width="150px"
                      prop="status"
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
                </div>
                <div
                  slot="footer"
                  class="
                    col-12
                    d-flex
                    justify-content-center justify-content-sm-between
                    flex-wrap
                  "
                >
                  <div class="">
                    <p class="card-category">
                      Showing {{ from + 1 }} to {{ to }} of {{ total }} entries

                      <span v-if="selectedRows.length">
                        &nbsp; &nbsp; {{ selectedRows.length }} rows selected
                      </span>
                    </p>
                  </div>
                  <base-pagination
                    class="pagination-no-border"
                    v-model="pagination.currentPage"
                    :per-page="pagination.perPage"
                    :total="total"
                  >
                  </base-pagination>
                </div>
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
import users from "~/components/tables/users2";
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
          prop: "name",
          label: "Unidad",
          minWidth: 115,
          sortable: true,
        },
        {
          prop: "nickname",
          label: "Serie",
          minWidth: 170,
          sortable: true,
        },
        {
          prop: "email",
          label: "Placa",
          minWidth: 110,
          sortable: true,
        },
        {
          prop: "salary",
          label: "Número Sim",
          minWidth: 160,
          sortable: true,
        },
      ],
      tableData: users,
      selectedRows: [],
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
    selectionChange(selectedRows) {
      this.selectedRows = selectedRows;
    },
  },
};
</script>
<style>
.no-border-card .card-footer {
  border-top: 0;
}
</style>
