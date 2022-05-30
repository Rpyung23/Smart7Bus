<template>
  <div class="content">
    <base-header class="pb-6">
      <div class="row align-items-center py-4">
        <div class="col">
          <card
            class="no-border-card"
            body-classes="card-bodyPanelCOntrolProduccion px-0 pb-1"
            footer-classes="pb-2"
          >
            <div>
              <el-table
                :data="tableDataPanelControlProduccion"
                row-key="id"
                class="tablePanelControlProduccion"
                header-row-class-name="thead-dark"
                :row-class-name="tableRowClassNamePanelControlProduccion"
              >
                  

          <el-table-column
          prop= "id"
          label= "ID"
          minWidth= 120>
        </el-table-column>
        <el-table-column
          prop= "salida_id"
          label= "Salida"
          minWidth= 130
          sortable= true
        >
        </el-table-column>
        <el-table-column
          prop= "vehiculo_codigo"
          label= "Unidad"
          minWidth= 140
        >
        </el-table-column>
        <el-table-column
          prop= "DescRutaSali_m"
          label= "Ruta - Linea"
          minWidth= 200
        >
        </el-table-column>
        <el-table-column
          prop= "fecha_creacion"
          label= "F. Creación"
          minWidth= 180
          sortable= true
        >
        </el-table-column>
        <el-table-column
          prop= "FaltMinuDia"
          label= "Minutos"
          minWidth= 150
        >
        </el-table-column>
        <el-table-column
          prop= "FaltMinuDiaDsct"
          label= "Minutos Desc"
          minWidth= 150
        >
        </el-table-column>
        <el-table-column
          prop= "item_descripcion"
          label= "C. Rubro"
          minWidth= 200
        >
        </el-table-column>
        <el-table-column
          prop= "anotaciones"
          label= "Anotaciones Tablero"
          minWidth= 200
        >
        </el-table-column>
        <el-table-column
          prop= "anotacion_descuento"
          label= "Anotaciones Desc"
          minWidth= 200
        >
        </el-table-column>
        <el-table-column
          prop= "monto"
          label= "Total"
          minWidth= 120
        >
        </el-table-column>
        <el-table-column
          prop= "monto_descuento"
          label= "T. Desc"
          minWidth= 120
        >
        </el-table-column>
        <el-table-column
          prop= "monto_abonado"
          label= "T. Abonado"
          minWidth= 140
        >
        </el-table-column>
        <el-table-column
          prop= "pendiente"
          label= "T. Pendiente"
          minWidth= 140
        >
        </el-table-column>

              </el-table>
            </div>
          </card>
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
import { ro } from 'date-fns/locale';

export default {
  mixins: [clientPaginationMixin],
  layout: "ProduccionDashboardLayout",
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
      tableDataPanelControlProduccion: [],
      selectedRows: [],
      token:this.$cookies.get("token"),
      fechaInicialTableroProduccion:"",
      fechaFinalTableroProduccion:""
    };
  },
  methods: {
  tableRowClassNamePanelControlProduccion({row, rowIndex}) 
  {
        if (row.item_id == 32) {
          return 'warning-row-panelControlProduccion';
        } else if (row.item_id == 64) {
          return 'success-row-panelControlProduccion';
        }
        return '';
      },
  initFechaActualProduccionPanelControl() {
      var fecha = new Date();
      var mes = fecha.getMonth() + 1;
      var day = fecha.getDate();
      var format =
        fecha.getFullYear() +
        "-" +
        (mes < 10 ? "0" + mes : mes) +
        "-" +
        (day < 10 ? "0" + day : day);

      this.fechaInicialTableroProduccion = format;
      this.fechaFinalTableroProduccion = format;
    },
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
    async readlPanelTableroProduccion(){
      var datos = await this.$axios.post(process.env.baseUrl+"/ProduccionpanelControl",{
        token:this.token,
        fechaI: this.fechaInicialTableroProduccion,
        fechaF: this.fechaFinalTableroProduccion
      })

      console.log(datos.data)

      if(datos.data.status_code == 200)
      {
        this.tableDataPanelControlProduccion.push(...datos.data.datos)
      }

    }
  },mounted(){
    this.initFechaActualProduccionPanelControl()
    this.readlPanelTableroProduccion()
  }
};
</script>
<style>

  .el-table .warning-row-panelControlProduccion {
    background: rgba(252, 143, 143, 0.692) !important;
  }

  .el-table .success-row-panelControlProduccion {
    background: #8fed8fbb !important;
  }

.no-border-card .card-footer {
  border-top: 0;
}
.card-bodyPanelCOntrolProduccion{
  padding: 0rem !important;
}
</style>
