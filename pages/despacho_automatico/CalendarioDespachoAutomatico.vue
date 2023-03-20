<template>
  <div class="content">
    <base-header class="py-3">
      <card
        class="no-border-card col"
        style="margin-bottom: 0.5rem"
        body-classes="px-0 pb-1 card-bodyTopOpcionesRPagosVehiculoPRoduccion cardSelectRubrosEstadosPagosVehiculoProduccionContainer"
        footer-classes="pb-2"
      >
        <el-calendar v-model="value">
          <template slot="dateCell" slot-scope="{ date, data }">
            <p @click="showDetalleCalendario(data)" >
              <strong>{{ data.day.split("-").slice(1).join("-") }}</strong><br>

              <el-tag
                effect="dark"
                :type="
                  obtenerFechaActualCalendarApi(data).isFeriado == null ? 'info' :
                  obtenerFechaActualCalendarApi(data).isFeriado
                    ? 'danger'
                    : obtenerFechaActualCalendarApi(data).isFinSemana
                    ? ''
                    : 'success'
                "
                size="mini"
                >{{
                  obtenerFechaActualCalendarApi(data).descripcion.toUpperCase()
                }}</el-tag
              >
              
              <!--{{ data.isSelected ? "✔️" : "" }}-->
            </p>
          </template>
        </el-calendar>
      </card>
    </base-header>
  </div>
</template>
<script>
import {
  Table,
  TableColumn,
  Select,
  Option,
  Notification,
  DatePicker,
  RadioButton,
  RadioGroup,
  Radio,
  Button,
  Dropdown,
  Checkbox,
  Tag,
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
  },
  data() {
    return {
      value: new Date(),
      listCalendarioAutodespacho: [],
      token: this.$cookies.get("token"),
    };
  },
  methods: {
    async readCalendarioAutoDespacho() {
      this.listCalendarioAutodespacho = [];

      try {
        var data = await this.$axios.post(
          process.env.baseUrlPanel + "/calendarioDespachoAutomativo",
          {
            token: this.token,
          }
        );

        //console.log(data.data.datos)

        this.listCalendarioAutodespacho.push(...data.data.datos);
      } catch (error) {
        console.log(error);
      }
    },
    obtenerFechaActualCalendarApi(data) {
      console.log(data);
      if(this.listCalendarioAutodespacho.length == 0){
        return {
        id_despacho_automatico_m: null,
        descripcion: "CARGANDO.....",
        fecha: null,
        isFinSemana: null,
        isLunesViernes: null,
        isFeriado: null,
      };
      }else{
        for (var i = 0; i < this.listCalendarioAutodespacho.length; i++) {
        if (data.day == this.listCalendarioAutodespacho[i].fecha) {
          return this.listCalendarioAutodespacho[i];
        }
      }

      return {
        id_despacho_automatico_m: null,
        descripcion: "SIN AUTODESPACHOS",
        fecha: null,
        isFinSemana: null,
        isLunesViernes: null,
        isFeriado: null,
      };
      }
    },
    showDetalleCalendario(data){
      //console.log(this.value)
      //alert(data.day)
      this.$cookies.set("detalleCalendario",window.btoa(data.day))
      this.$router.push("./detalleCalendario");
    }
  },
  mounted() {
    this.readCalendarioAutoDespacho();
  },
};
</script>

<style>
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
