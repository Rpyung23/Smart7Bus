<template>
  <div class="content">
    <base-header class="py-3">
      <card
        class="no-border-card col"
        style="margin-bottom: 0.5rem"
        body-classes="CardContainerPanelDespacho"
        footer-classes="pb-2"
      >
        <div class="ContainerLeftPanelDespacho">
          <base-button icon type="danger" title="SALIDAS ANULADAS" size="sm">
            <span class="btn-inner--icon"
              ><i class="ni ni-single-copy-04"></i
            ></span>
          </base-button>

          <el-date-picker
            type="date"
            placeholder="Select date and time"
            style="margin-right: 0.5rem; width: 10rem"
          >
          </el-date-picker>

          <base-button icon type="primary" size="sm" title="Buscar">
            <span class="btn-inner--icon"><i class="el-icon-search"></i></span>
          </base-button>
        </div>

        <div class="ContainerRigthPanelDespacho">
          <base-button icon type="danger" size="sm">
            <span class="btn-inner--icon"
              ><i class="ni ni-scissors"></i> ANULA TODO</span
            >
          </base-button>

          <base-button icon type="warning" size="sm">
            <span class="btn-inner--icon"
              ><i class="ni ni-fat-delete"></i> FINALIZA TODO</span
            >
          </base-button>

          <base-button icon type="info" size="sm">
            <span class="btn-inner--icon"
              ><i class="ni ni-watch-time"></i> RECALIFICA TODO</span
            >
          </base-button>
        </div>
      </card>

      <card
        class="no-border-card col"
        style="margin-bottom: 0.5rem"
        body-classes="CardContainerPanelDespacho"
        footer-classes="pb-2"
      >
        <div class="ContainerLeftPanelDespacho">
          <el-checkbox-group v-model="mCheckBoxFiltroDespacho">
            <el-checkbox
              label="0,1"
              style="
                background-color: rgba(140, 248, 126, 0.384);
                margin-right: 0.5rem;
              "
              >DIFERIDA
            </el-checkbox>
            <el-checkbox
              label="2"
              style="
                background-color: hsla(226, 88%, 61%, 0.274);
                margin-right: 0.5rem;
              "
              >EN RUTA</el-checkbox
            >
            <el-checkbox label="3" style="margin-right: 0rem"
              >FINALIZADO</el-checkbox
            >
          </el-checkbox-group>
        </div>

        <div class="ContainerRigthPanelDespacho">



        </div>
      </card>
    </base-header>
  </div>
</template>
<script>
import recorrido from "../../components/monitoreo/recorrido.vue";
import tarjeta from "../../components/tarjetas/tarjeta.vue";

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
  CheckboxGroup,
  MessageBox,
} from "element-ui";
import JqxGrid from "jqwidgets-scripts/jqwidgets-vue/vue_jqxgrid.vue";
import JqxMenu from "jqwidgets-scripts/jqwidgets-vue/vue_jqxmenu.vue";
import clientPaginationMixin from "~/components/tables/PaginatedTables/clientPaginationMixin";
import RouteBreadCrumb from "@/components/argon-core/Breadcrumb/RouteBreadcrumb";
import swal from "sweetalert2";
import Tabs from "@/components/argon-core/Tabs/Tabs";
import TabPane from "@/components/argon-core/Tabs/Tab";
import { getFecha_dd_mm_yyyy, FechaStringToHour } from "../../util/fechas";
import flatPicker from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import { Spanish } from "flatpickr/dist/l10n/es.js";

export default {
  mixins: [clientPaginationMixin],
  layout: "DespachoDashboardLayout",
  components: {
    Tabs,
    JqxGrid,
    JqxMenu,
    flatPicker,
    TabPane,
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
    [CheckboxGroup.name]: CheckboxGroup,
    [MessageBox.name]: MessageBox,
    [Notification.name]: Notification,
    ComponenteRecorrido: recorrido,
    ComponenteTarjeta: tarjeta,
  },
  data() {
    return {
      config_flatpicker: {
        allowInput: true,
        locale: Spanish,
        minDate: "2020-01-01",
        maxDate: "2050-01-01",
      },
      mCheckBoxFiltroDespacho:[]
    };
  },
  methods: {},
  mounted() {},
};
</script>

<style>
.CardContainerPanelDespacho {
  display: flex;
  justify-content: space-between;
  padding: 0rem;
  margin-bottom: 0rem;
}

.ContainerLeftPanelDespacho {
  margin-top:00.25rem;
  margin-bottom:00.25rem;
}

.ContainerRigthPanelDespacho {
  display:flex;
  justify-content:center;
  align-items:center;
}
</style>
