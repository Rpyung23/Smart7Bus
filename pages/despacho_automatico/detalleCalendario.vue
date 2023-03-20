<template>
  <div class="content">
    <base-header class="py-3">
      <card
        class="no-border-card col"
        style="margin-bottom: 0.5rem"
        body-classes="px-0 pb-1 card-bodyTopOpcionesRPagosVehiculoPRoduccion cardSelectRubrosEstadosPagosVehiculoProduccionContainer"
        footer-classes="pb-2"
      >
        <div class="cardTiposDespachosPanelDespacho">
          <el-tag type="" effect="dark" style="margin-right: 0.5rem">{{
            this.tableDetalleCalentario.length > 0
              ? this.tableDetalleCalentario[0].fecha
              : "S/N"
          }}</el-tag>

          <el-tag type="success" effect="dark">
            {{
              this.tableDetalleCalentario.length > 0
                ? this.tableDetalleCalentario[0].descripcionCuadro
                : "S/N"
            }}
          </el-tag>
        </div>

        <div class="buttonsAdicionalesDespacho">
          <base-button icon type="danger" title="ELIMINAR" size="sm" @click="">
            <span class="btn-inner--icon"><i class="ni ni-scissors"></i></span>
          </base-button>

          <base-button
            icon
            type="default"
            title="CAMBIAR"
            @click="modaslCambioDespachoAutomatico = true"
            size="sm"
          >
            <span class="btn-inner--icon"><i class="ni ni-settings"></i></span>
          </base-button>
        </div>
      </card>
      <card
        class="no-border-card col"
        style="margin-bottom: 0.5rem"
        body-classes="card-bodydetalleCalendario px-0 pb-1"
        footer-classes="pb-2"
        v-loading="loadingTableDetalleCalendario"
        element-loading-text="Cargando Datos..."
      >
        <el-table
          :data="tableDetalleCalentario"
          height="calc(100vh - 9.5rem)"
          style="width: 100%"
        >
          <el-table-column prop="fecha" label="Fecha" width="180">
          </el-table-column>
          <el-table-column prop="descripcion" label="Nombre" width="400">
          </el-table-column>

          <el-table-column
            prop="isLunesViernes"
            label="Lunes - Viernes"
            width="200"
          >
            <template slot-scope="scope">
              <badge
                type="primary"
                v-if="scope.row.isLunesViernes == 1"
                rounded
                class="mr-2"
                >ACTIVO</badge
              >
              <badge
                type="danger"
                v-if="scope.row.isLunesViernes == 0"
                rounded
                class="mr-2"
                >INACTIVO</badge
              >
            </template>
          </el-table-column>

          <el-table-column prop="isFinSemana" label="Fin Semana" width="140">
            <template slot-scope="scope">
              <badge
                type="primary"
                v-if="scope.row.isFinSemana == 1"
                rounded
                class="mr-2"
                >ACTIVO</badge
              >
              <badge
                type="danger"
                v-if="scope.row.isFinSemana == 0"
                rounded
                class="mr-2"
                >INACTIVO</badge
              >
            </template>
          </el-table-column>

          <el-table-column prop="isFeriado" label="Feriado" width="140">
            <template slot-scope="scope">
              <badge
                type="primary"
                v-if="scope.row.isFeriado == 1"
                rounded
                class="mr-2"
                >ACTIVO</badge
              >
              <badge
                type="danger"
                v-if="scope.row.isFeriado == 0"
                rounded
                class="mr-2"
                >INACTIVO</badge
              >
            </template>
          </el-table-column>

          <el-table-column prop="" label="Acciones" width="150">
            <template slot-scope="scope">
              <base-button
                size="sm"
                title="VER DETALLE"
                @click="modalDetalleCalendario = true"
                type="primary"
                >
              <span class="btn-inner--icon"
                  ><i class="ni ni-single-copy-04"></i
                ></span>
            
            </base-button>

              <base-button
                icon
                type="default"
                title="CAMBIAR"
                @click="readAutoDespachoM(scope.row)"
                size="sm"
              >
                <span class="btn-inner--icon"
                  ><i class="ni ni-settings"></i
                ></span>
              </base-button>
            </template>
          </el-table-column>

          <div slot="empty"></div>
        </el-table>
      </card>
    </base-header>

    <modal
      :show.sync="modaslCambioDespachoAutomatico"
      body-classes="p-0"
      modal-classes="modal-dialog-centered modal-sm"
    >
      <card
        type="secondary"
        header-classes="bg-transparent pb-5"
        class="border-0 mb-0"
      >
        <div class="containerUpdate">
          <el-select
            v-model="optionAutodespachoM"
            placeholder="Despacho Automatico"
          >
            <el-option
              v-for="item in optionsAutoDespachoM"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            >
            </el-option>
          </el-select>

          <base-button type="primary" size="sm">
            <span class="btn-inner--icon"
              ><i class="ni ni-check-bold"></i
            ></span>
          </base-button>
        </div>
      </card>
    </modal>


    <modal :show.sync="modalDetalleCalendario"
       modal-classes="modal-dialog-centered modal-xl">

   <h5 slot="header" class="modal-title" id="modal-title-default">Modal title</h5>

   Society has put up so many boundaries, so many limitations on what’s right and wrong
   that it’s almost impossible to get a pure thought out. It’s like a little kid, a little boy, looking
   at colors, and no one told him what colors are good, before somebody tells you you shouldn’t like pink
   because that’s for girls, or you’d instantly become a gay two-year-old. Why would anyone
   pick blue over pink? Pink is obviously a better color. Everyone’s born confident, and everything’s taken away
   from you
   <br>
   <br>

   As we live, our hearts turn colder. Cause pain is what we go through as
   we become older. We get insulted by others, lose trust for those others.
   We get back stabbed by friends. It becomes harder for us to give others a hand.
   We get our heart broken by people we love, even that we give them all we have.
   Then we lose family over time. What else could rust the heart more over time?
   Blackgold.

   <template slot="footer">
     <base-button type="secondary" class="ml-auto" @click="modals.modal7 = false">Close
     </base-button>
     <base-button type="primary">Save changes</base-button>
   </template>
 </modal>


  </div>
</template>
<script>
import {
  Table,
  TableColumn,
  Notification,
  DatePicker,
  RadioButton,
  RadioGroup,
  Radio,
  Button,
  Dropdown,
  Checkbox,
  Tag,
  Breadcrumb,
  BreadcrumbItem,
  Select,
  Option,
} from "element-ui";

import locale from "element-ui/lib/locale/lang/es";

import JqxGrid from "jqwidgets-scripts/jqwidgets-vue/vue_jqxgrid.vue";
import JqxMenu from "jqwidgets-scripts/jqwidgets-vue/vue_jqxmenu.vue";
import RouteBreadCrumb from "@/components/argon-core/Breadcrumb/RouteBreadcrumb";
import { BasePagination } from "@/components/argon-core";
import clientPaginationMixin from "~/components/tables/PaginatedTables/clientPaginationMixin";
import swal from "sweetalert2";
import Tabs from "@/components/argon-core/Tabs/Tabs";
import TabPane from "@/components/argon-core/Tabs/Tab";

export default {
  mixins: [clientPaginationMixin],
  layout: "RolProgramadoLayout",
  components: {
    Tabs,
    JqxGrid,
    JqxMenu,
    TabPane,
    BasePagination,
    RouteBreadCrumb,
    [Select.name]: Select,
    [Option.name]: Option,
    [Table.name]: Table,
    [Button.name]: Button,
    [RadioButton.name]: RadioButton,
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio,
    [Checkbox.name]: Checkbox,
    [DatePicker.name]: DatePicker,
    [TableColumn.name]: TableColumn,
    [Notification.name]: Notification,
    [Tag.name]: Tag,
    [Breadcrumb.name]: Breadcrumb,
    [BreadcrumbItem.name]: BreadcrumbItem,
  },
  data() {
    return {
      value: new Date(),
      token: this.$cookies.get("token"),
      tableDetalleCalentario: [],
      loadingTableDetalleCalendario: false,
      modaslCambioDespachoAutomatico: false,
      modalDetalleCalendario:false,
      optionsAutoDespachoM: [],
      optionAutodespachoM: "",
    };
  },
  methods: {
    async readDetalleCalendarioAutoDespacho() {
      this.tableDetalleCalentario = [];
      this.loadingTableDetalleCalendario = true;

      try {
        var data = await this.$axios.post(
          process.env.baseUrlPanel + "/DetalleCalendarioDespachoAutomativo",
          {
            token: this.token,
            fecha: window.atob(this.$cookies.get("detalleCalendario")),
          }
        );

        //console.log(data.data.datos)

        this.tableDetalleCalentario.push(...data.data.datos);
      } catch (error) {
        console.log(error);
      }

      this.loadingTableDetalleCalendario = false;
    },
    async readAutoDespachoM(celda) {

      this.modaslCambioDespachoAutomatico = true

      this.optionsAutoDespachoM = [];
      this.optionAutodespachoM = ""

      try {
        var data = await this.$axios.post(
          process.env.baseUrlPanel + "/DespachoAutomativoM",
          {
            token: this.token,
            tipo: 1,
          }
        );

        console.log(celda)

        for(var i = 0;i<data.data.datos.length;i++)
        {
          

          var obj = {
          value: data.data.datos[i].id_despacho_automatico_m,
          label: data.data.datos[i].descripcion,
          disabled: (data.data.datos[i].id_despacho_automatico_m == celda.idDespachoAutomaticoM ? true : false),
        }
          this.optionsAutoDespachoM.push(obj)
        }


      } catch (error) {
        console.log(error);
      }

      this.loadingTableDetalleCalendario = false;
    },
  },
  mounted() {
    this.readDetalleCalendarioAutoDespacho();
  },
};
</script>

<style>
.containerUpdate {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.card-bodydetalleCalendario {
  padding: 0rem !important;
  height: calc(100vh - 9.3rem);
  overflow: none;
}

.buttonsAdicionalesDespacho {
  margin: auto;
  display: flex;
  justify-content: flex-end;
  width: 40%;
}

.cardTiposDespachosPanelDespacho {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  width: 60%;
  justify-content: flex-start;
}

.card-bodyTopOpcionesRPagosVehiculoPRoduccion {
  padding-top: 0.25rem !important;
  flex-wrap: wrap;
}

.cardSelectRubrosEstadosPagosVehiculoProduccionContainer {
  display: flex;
  justify-content: space-between;
}

.el-tag--dark.el-tag--danger {
  background-color: #e52f2f;
  border-color: #e52f2f;
}

.el-tag--dark.el-tag--success {
  background-color: #42a710;
  border-color: #42a710;
}

.el-tag--dark.el-tag--success {
  background-color: #42a710;
  border-color: #42a710;
}

.el-tag--dark {
  background-color: #1171d5;
  border-color: #1171d5;
}
</style>
