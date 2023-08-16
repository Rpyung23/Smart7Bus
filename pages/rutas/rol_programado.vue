<template>
  <div class="content">
    <base-header>
      <div class="align-items-center py-3">
        <card
          class="no-border-card col"
          style="margin-bottom: 0.5rem"
          body-classes="px-0 pb-1 card-bodyTopOpcionesRPagosVehiculoPRoduccionPanelDespachoBusqueda cardSelectRubrosEstadosPagosVehiculoProduccionContainerPanelDespachoBusqueda"
          footer-classes="pb-2"
        >
          <div class="cardTextoRPagosVehiculoProduccionPanelDespachoBusqueda">
            <el-select
              v-model="mSelectRutaSalidaPanelBusqueda"
              multiple
              collapse-tags
              placeholder="Lineas"
            >
              <el-option
                v-for="item in mListLineasSalidasPanelBusqueda"
                :key="item.LetrRuta"
                :label="item.DescRuta"
                :value="item.LetrRuta"
              >
              </el-option>
            </el-select>


          </div>

          <div
            class="cardSelectRubrosEstadosPagosVehiculoProduccionContainerPanelDespachoBusqueda"
          >
            <div class="buttonCenterEndDerecha">
              <base-button
                icon
                type="primary"
                size="sm"
                @click="readRolProgramado()"
              >
                <span class="btn-inner--icon"
                  ><i class="el-icon-search"></i
                ></span>
              </base-button>

              <base-button
                type="default"
                size="sm"
                title="AGREGAR ROL PROGRAMADO"
                @click="showModalRolProgramado()"
              >
                <span class="btn-inner--icon"
                  ><i class="ni ni-fat-add"></i
                ></span>
              </base-button>
            </div>
          </div>
        </card>

        <card
          class="no-border-card"
          style="margin-bottom: 0rem"
          body-classes="cardRolProgramado  px-0 pb-1"
          footer-classes="pb-2"
        >
          <el-table
            v-loading="loadingRolProgramado"
            element-loading-text="Cargando Datos..."
            :data="mListRolProgramado"
            row-key="id"
            class="tablePanelControlProduccion"
            header-row-class-name="thead-dark"
            height="calc(100vh - 10rem)"
            style="width: 100%"
          >
            <el-table-column label="Actions" width="130">
              <template slot-scope="scope"> 

              <base-button
                icon
                type="primary"
                size="sm"
              >
                <span class="btn-inner--icon"
                  ><i class="ni ni-ruler-pencil"></i
                ></span>
              </base-button>

              </template>
            </el-table-column>

            <!--<el-table-column prop="idSali_m" label="Salida" width="140">
              </el-table-column>-->

            <el-table-column
              v-for="column in tableColumnsUnidadesFlotaVehicular"
              :key="column.label"
              v-bind="column"
            >
            </el-table-column>

            <el-table-column label="ACTIVO X DIA" width="150">
              <template slot-scope="scope"> <badge :type='scope.row.active_dia == 1 ? "default" : "danger"' rounded class="mr-2">{{scope.row.active_dia == 1 ? "ACTIVO" : "INACTIVO"}}</badge> </template>
            </el-table-column>

            <el-table-column label="LUNES" width="150">
              <template slot-scope="scope"><badge :type='scope.row.active_dia == 1 ? "default" : "danger"' rounded class="mr-2">{{scope.row.active_dia == 1 ? "ACTIVO" : "INACTIVO"}}</badge> </template>
            </el-table-column>

            <el-table-column label="MARTES" width="150">
              <template slot-scope="scope"><badge :type='scope.row.active_dia == 1 ? "default" : "danger"' rounded class="mr-2">{{scope.row.active_dia == 1 ? "ACTIVO" : "INACTIVO"}}</badge> </template>
            </el-table-column>
            <el-table-column label="MIERCOLES" width="150">
              <template slot-scope="scope"><badge :type='scope.row.active_dia == 1 ? "default" : "danger"' rounded class="mr-2">{{scope.row.active_dia == 1 ? "ACTIVO" : "INACTIVO"}}</badge> </template>
            </el-table-column>
            <el-table-column label="JUEVES" width="150">
              <template slot-scope="scope"><badge :type='scope.row.active_dia == 1 ? "default" : "danger"' rounded class="mr-2">{{scope.row.active_dia == 1 ? "ACTIVO" : "INACTIVO"}}</badge> </template>
            </el-table-column>
            <el-table-column label="VIERNES" width="150">
              <template slot-scope="scope"><badge :type='scope.row.active_dia == 1 ? "default" : "danger"' rounded class="mr-2">{{scope.row.active_dia == 1 ? "ACTIVO" : "INACTIVO"}}</badge> </template>
            </el-table-column>
            <el-table-column label="SABADO" width="150">
              <template slot-scope="scope"><badge :type='scope.row.active_dia == 1 ? "default" : "danger"' rounded class="mr-2">{{scope.row.active_dia == 1 ? "ACTIVO" : "INACTIVO"}}</badge> </template>
            </el-table-column>
            <el-table-column label="DOMINGO" width="150">
              <template slot-scope="scope"><badge :type='scope.row.active_dia == 1 ? "default" : "danger"' rounded class="mr-2">{{scope.row.active_dia == 1 ? "ACTIVO" : "INACTIVO"}}</badge> </template>
            </el-table-column>
            <el-table-column label="FERIADO" width="150">
              <template slot-scope="scope"><badge :type='scope.row.active_dia == 1 ? "default" : "danger"' rounded class="mr-2">{{scope.row.active_dia == 1 ? "ACTIVO" : "INACTIVO"}}</badge> </template>
            </el-table-column>
            <div slot="empty"></div>
          </el-table>
        </card>

        <modal :show.sync="oModalAddRol">
          <h6 slot="header" class="modal-title">
            Crear nuevo Rol Programado
          </h6>

          <base-input placeholder="Ingrese el nombre"></base-input>

          <el-select
            v-model="mSelectLineaRolProgrmadoNueva"
            collapse-tags
            style="width: 100%; margin-top: 1rem"
            placeholder="Lineas"
          >
            <el-option
              v-for="item in mListLineasSalidasPanelBusqueda"
              :key="item.LetrRuta"
              :label="item.DescRuta"
              :value="item.LetrRuta"
            >
            </el-option>
          </el-select>

          <base-checkbox name="radio0" v-model="isRolProgramadoXDia" style="width: 100%; margin-top: 1rem">
            ROL PROGRAMADO ESPECIFICO PARA CADA DIA
          </base-checkbox>

          <div class="container-fecha" v-if="isRolProgramadoXDia">
            <base-checkbox v-model="isLunes" style="margin-right: 0.5rem;">
              LUNES
            </base-checkbox>
            <base-checkbox v-model="isMartes" style="margin-right: 0.5rem;">
              MARTES
            </base-checkbox>
            <base-checkbox v-model="isMiercoles" style="margin-right: 0.5rem;">
              MIERCOLES
            </base-checkbox>
            <base-checkbox v-model="isJueves" style="margin-right: 0.5rem;">
              JUEVES
            </base-checkbox>
            <base-checkbox v-model="isViernes">
              VIERNES
            </base-checkbox>
            <base-checkbox v-model="isSabado" style="margin-right: 0.5rem;">
              SABADO
            </base-checkbox>
            <base-checkbox v-model="isDomingo" style="margin-right: 0.5rem;">
              DOMINGO
            </base-checkbox>
            <base-checkbox v-model="isFeriado" style="margin-right: 0.5rem;">
              FERIADO
            </base-checkbox>
          </div>

          <template slot="footer">
            <base-button type="primary">Save changes</base-button>
            <base-button type="link" class="ml-auto">Close </base-button>
          </template>
        </modal>
      </div>
    </base-header>
  </div>
</template>
<script>
import flatPicker from "vue-flatpickr-component";
import { getBase64LogoReportes } from "../../util/logoReport";
import { convertSecondtoTimeString } from "../../util/fechas";
import "flatpickr/dist/flatpickr.css";
import { getFecha_dd_mm_yyyy } from "../../util/fechas";

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
  Switch,
} from "element-ui";

import RouteBreadCrumb from "@/components/argon-core/Breadcrumb/RouteBreadcrumb";
import { BasePagination } from "@/components/argon-core";
import clientPaginationMixin from "~/components/tables/PaginatedTables/clientPaginationMixin";
import swal from "sweetalert2";
import Tabs from "@/components/argon-core/Tabs/Tabs";
import TabPane from "@/components/argon-core/Tabs/Tab";
import { FechaStringToHour } from "../../util/fechas";

export default {
  mixins: [clientPaginationMixin],
  layout: "EditRutasDashboardLayout",
  components: {
    Tabs,
    TabPane,
    BasePagination,
    flatPicker,
    RouteBreadCrumb,
    [Switch.name]: Switch,
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
      loadingRolProgramadoloading: false,
      loadingRolProgramado: false,
      mSelectRutaSalidaPanelBusqueda: [],
      itemUnidadSalidasPanelBusqueda: [],
      token: this.$cookies.get("token"),
      fechaInicialSalidasPanelBusqueda: "",
      tableColumnsUnidadesFlotaVehicular: [
        {
          prop: "detalle_rol_programado_m",
          label: "Detalle",
          minWidth: 270,
        },
        {
          prop: "DescRuta",
          label: "Ruta",
          minWidth: 250,
        }
      ],
      mListRolProgramado: [],
      optionsUnidadesSalidasPanelBusqueda: [],
      oModalAddRol: false,
      mSelectLineaRolProgrmadoNueva: null,
      isRolProgramadoXDia:false,
      isLunes:false,
      isMartes:false,
      isMiercoles:false,
      isJueves:false,
      isViernes:false,
      isSabado:false,
      isDomingo:false,
      isFeriado:false,
    };
  },
  methods: {
    showModalRolProgramado() {
      this.oModalAddRol = true;
    },
    remoteMethodUnidadesSalidasPanelBusqueda(query) {
      if (query !== "") {
        this.loadingRolProgramadoloading = true;
        setTimeout(() => {
          this.loadingRolProgramadoloading = false;
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
      var hora =
        fecha.getHours() < 10 ? "0" + fecha.getHours() : fecha.getHours();
      var minutes =
        fecha.getMinutes() < 10 ? "0" + fecha.getMinutes() : fecha.getMinutes();
      var format =
        fecha.getFullYear() +
        "-" +
        (mes < 10 ? "0" + mes : mes) +
        "-" +
        (day < 10 ? "0" + day : day);
      console.log(format);
      this.fechaInicialSalidasPanelBusqueda =
        format + " " + hora + ":" + minutes + ":00";
      this.fechaFinalSalidasPanelBusqueda =
        format + " " + hora + ":" + minutes + ":00";
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
    async readAllLineasContadorSalidasPanelBusqueda() {
      var datos = await this.$axios.post(process.env.baseUrl + "/rutes", {
        token: this.token,
        tipo: 3,
      });
      if (datos.data.status_code == 200) {
        this.mListLineasSalidasPanelBusqueda.push(...datos.data.data);
      }
    },
    async readRolProgramado() {
      this.loadingRolProgramado = true;
      this.mListRolProgramado = [];

      try {
        var data = await this.$axios.post(
          process.env.baseUrl + "/readRolProgrmado",
          {
            token: this.token,
            ruta:
              this.mSelectRutaSalidaPanelBusqueda.length > 0
                ? this.mSelectRutaSalidaPanelBusqueda
                : "*",
            unidad:
              this.itemUnidadSalidasPanelBusqueda.length > 0
                ? this.itemUnidadSalidasPanelBusqueda
                : "*",
          }
        );

        if (data.data.status_code == 200) {
          this.mListRolProgramado.push(...data.data.datos);
        } else {
          //alert(data.data.status_code);
        }
      } catch (error) {
        console.log(error);
      }

      this.loadingRolProgramado = false;
    },
  },
  mounted() {
    this.initFechaActualSalidaBusquedaPanel();
    this.readAllUnidadesSalidasPanelBusqueda();
    this.readAllLineasContadorSalidasPanelBusqueda();
    this.readRolProgramado();
  },
};
</script>
<style>

.container-fecha{
  margin-top: 1rem;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
.container-add-rubro {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
}

.containerModalRecorridoPanelDespacho {
  display: flex;
}
.cardControlesMarc {
  height: calc(80vh);
  width: 18rem;
}
.current-row {
  background-color: rgba(0, 0, 0, 0.178);
}

.el-table__body tr.current-row > td.el-table__cell {
  background-color: rgba(0, 0, 0, 0.178) !important;
}

.mapa {
  width: 100%;
  height: calc(80vh);
}

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

.el-loading-text {
  color: black !important;
}

.el-icon-loading {
  color: black !important;
}

.cardTextoRPagosVehiculoProduccionPanelDespachoBusqueda {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.cardopcinesRPagosVehiculoProduccionPanelDespachoBusqueda {
  display: flex;
  align-items: center;
}

.cardSelectRubrosEstadosPagosVehiculoProduccionContainerPanelDespachoBusqueda {
  display: flex;
  justify-content: space-between;
}

.el-table .warning-row-panelControlProduccion {
  background: rgba(255, 0, 0, 0.342) !important;
}

.el-table .success-row-panelControlProduccion {
  background: hsla(34, 88%, 61%, 0.384) !important;
}

.el-table .finalizado-row-panelControlProduccion {
  background: rgba(140, 248, 126, 0.384) !important;
}

.el-table .diferido-row-panelControlProduccion {
  background: hsla(226, 88%, 61%, 0.274) !important;
}

.no-border-card .card-footer {
  border-top: 0;
}

.cardRolProgramado  {
  padding: 0rem !important;
  height: calc(100vh - 9.5rem);
  overflow: none;
}

.card-bodyTopOpcionesRPagosVehiculoPRoduccionPanelDespachoBusqueda {
  padding-top: 0.25rem !important;
}
.cardOpcinesRPagosVehiculoProduccionPanelDespachoBusqueda {
  display: flex;
  align-items: center;
}
</style>