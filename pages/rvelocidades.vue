<template>
  <div class="content">
    <base-header>
      <div class="align-items-center py-3">
        <card class="no-border-card col" style="margin-bottom: 0.5rem"
          body-classes="px-0 pb-1 card-bodyTopOpcionesRPagosVehiculoPRoduccion cardSelectRubrosEstadosPagosVehiculoProduccionContainer"
          footer-classes="pb-2">
          <div class="cardTextoRPagosVehiculoProduccion">
            <el-select v-model="itemUnidadSalidasPanelBusqueda" multiple filterable style="margin-right: 0.5rem" remote
              placeholder="Ingrese unidad" :remote-method="remoteMethodUnidadesSalidasPanelBusqueda"
              :loading="loadingTableUnidadesSalidasPanelBusquedaloading">
              <el-option v-for="item in optionsUnidadesSalidasPanelBusqueda" :key="item.CodiVehi" :label="item.CodiVehi"
                :value="item.CodiVehi">
              </el-option>
            </el-select>

            <base-input title="Buscar" addon-left-icon="ni ni-calendar-grid-58" style="margin-right: 0.5rem">
              <flat-picker slot-scope="{ focus, blur }" @on-open="focus" @on-close="blur" :config="{ allowInput: true }"
                class="form-controlPersonal datepicker" v-model="fechaInicialSalidasPanelBusqueda">
              </flat-picker>
            </base-input>

            <base-input title="Exportar a PDF" addon-left-icon="ni ni-calendar-grid-58">
              <flat-picker slot-scope="{ focus, blur }" @on-open="focus" @on-close="blur" :config="{ allowInput: true }"
                class="form-controlPersonal datepicker" v-model="fechaFinalSalidasPanelBusqueda">
              </flat-picker>
            </base-input>
          </div>

          <div class="buttonsAdicionalesRVelocidad">
            <base-button icon type="primary" size="sm" @click="readRVelocidades()">
              <span class="btn-inner--icon"><i class="el-icon-search"></i></span>
            </base-button>

            <base-button outline size="sm" type="danger">
              <span class="btn-inner--icon"><i class="ni ni-cloud-download-95"></i></span>
            </base-button>

          </div>
        </card>

        <card class="no-border-card" style="margin-bottom: 0rem" body-classes="card-bodyRVelocidades px-0 pb-1"
          footer-classes="pb-2">
          <div>
            <el-table v-loading="loadingTableRVelocidadesBusquedaloading" element-loading-text="Cargando Datos..."
              :data="mListaRVelocidades" row-key="id"
              class="tablePanelControlProduccion" 
              header-row-class-name="thead-dark" height="calc(100vh - 9.5rem)"
              >

              <el-table-column v-for="column in tableColumnsUnidadesFlotaVehicular" :key="column.label" v-bind="column">
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
  Select,
  Option,
  Autocomplete,
  DatePicker,
  RadioButton,
  Radio,
  Notification,
  Checkbox,
  CheckboxButton,
  CheckboxGroup,
  Popover,
  Button,
  Loading,
} from "element-ui";

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
    [Checkbox.name]: Checkbox,
    [CheckboxButton.name]: CheckboxButton,
    [CheckboxGroup.name]: CheckboxGroup,
    [Popover.name]: Popover,
    [Button.name]: Button,
  },
  data() {
    return {
      mListaUnidadesSalidasPanelBusqueda: [],
      mListLineasSalidasPanelBusqueda: [],
      loadingTableRVelocidadesBusquedaloading: false,
      loadingTableUnidadesSalidasPanelBusquedaloading:false,
      itemUnidadSalidasPanelBusqueda: [],
      token: this.$cookies.get("token"),
      fechaInicialSalidasPanelBusqueda: "",
      fechaFinalSalidasPanelBusqueda: "",
      optionsUnidadesSalidasPanelBusqueda: [],
      tableColumnsUnidadesFlotaVehicular: [
        {
          prop: "CodiVehiHistEven",
          label: "Unidad",
          minWidth: 110,
        },
        {
          prop: "NumeVuelSali_m",
          label: "N° Vuelta",
          minWidth: 140,
        },
        {
          prop: "DescRutaSali_m",
          label: "Ruta",
          minWidth: 200,
        },
        {
          prop: "FechHistEven",
          label: "Fecha",
          minWidth: 130,
        },
        {
          prop: "HoraSaliProgSali_m",
          label: "H. Salida",
          minWidth: 150,
        },
        {
          prop: "HoraLlegProgSali_m",
          label: "H. Llegada",
          minWidth: 150,
        },
        {
          prop: "total_velocidad",
          label: "V. Total(KM/H)",
          minWidth: 200,
          sortable: true,
        },
        {
          prop: "min_velocidad",
          label: "V. Min(KM/H)",
          minWidth: 160,
        },
        {
          prop: "max_velocidad",
          label: "V. Max(KM/H)",
          minWidth: 150,
        },
        {
          prop: "prom_velocidad",
          label: "V. Pro(KM/H)",
          minWidth: 170,
        }
      ],
      mListaRVelocidades: []
    };
  },
  methods: {
    remoteMethodUnidadesSalidasPanelBusqueda(query) {
      if (query !== "") {
        this.loadingTableUnidadesSalidasPanelBusquedaloading = true;
        setTimeout(() => {
          this.loadingTableUnidadesSalidasPanelBusquedaloading = false;
          this.optionsUnidadesSalidasPanelBusqueda =
            this.mListaUnidadesSalidasPanelBusqueda.filter((item) => {
              return (
                item.CodiVehi.toLowerCase().indexOf(query.toLowerCase()) > -1
              );
            });
        }, 200);
      } else {
        this.optionsUnidadesSalidasPanelBusqueda = [];
      }
    },
    initFechaActualSalidaBusquedaPanel() {
      var fecha = new Date();
      var mes = fecha.getMonth() + 1;
      var day = fecha.getDate();
      var format =
        fecha.getFullYear() +
        "-" +
        (mes < 10 ? "0" + mes : mes) +
        "-" +
        (day < 10 ? "0" + day : day);

      this.fechaInicialSalidasPanelBusqueda = format;
      this.fechaFinalSalidasPanelBusqueda = format;
    },
    async readAllUnidadesSalidasPanelBusqueda() {
      var datos = await this.$axios.post(process.env.baseUrl + "/unidades", {
        token: this.token,
      });

      if (datos.data.status_code == 200) {
        for (var i = 0; i < datos.data.data.length; i++) {
          var obj = datos.data.data[i];
          obj.value = obj.CodiVehi;
          this.mListaUnidadesSalidasPanelBusqueda.push(obj);
        }
      }
    },
    async readRVelocidades() 
    {
      this.mListaRVelocidades = []
      this.loadingTableRVelocidadesBusquedaloading = true
      try {
              var datos = await this.$axios.post(process.env.baseUrl + "/Rvelocidades", {
        token: this.token,
        "unidades": this.itemUnidadSalidasPanelBusqueda.length > 0 ? this.itemUnidadSalidasPanelBusqueda : "*",
        fechaI: this.fechaInicialSalidasPanelBusqueda,
        fechaF: this.fechaFinalSalidasPanelBusqueda
      },{
              timeout: 600000,
            });

      if (datos.data.status_code == 200) 
      {
        this.mListaRVelocidades.push(...datos.data.datos)
      }
      } catch (error) {
       console.log(error) 
      }
      this.loadingTableRVelocidadesBusquedaloading = false
    }
  },
  mounted() {
    //this.readHistorialSalidaPanelBusqueda();
    this.initFechaActualSalidaBusquedaPanel()
    this.readAllUnidadesSalidasPanelBusqueda()
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

.no-border-card .card-footer {
  border-top: 0;
}

.card-bodyRVelocidades {
  padding: 0rem !important;
  height: calc(100vh - 9.5rem);
  overflow: auto;
}

.card-bodyTopOpcionesRPagosVehiculoPRoduccion {
  padding-top: 0.25rem !important;
}
</style>
