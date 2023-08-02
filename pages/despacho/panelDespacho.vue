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
          <base-button
            icon
            type="danger"
            title="Ver Salidas Anuladas"
            size="sm"
            @click="showModalDespachoSalidasAnuladas()"
          >
            <span class="btn-inner--icon"
              ><i class="ni ni-fat-remove"></i
            ></span>
          </base-button>

          <el-date-picker
            type="date"
            placeholder="Select date and time"
            style="margin-right: 0.5rem"
            v-model="fechaActualSalidasPanelDespacho"
          >
          </el-date-picker>

          <el-select
            v-model="mSelectRutaSalidaPanelDespacho"
            collapse-tags
            placeholder="Lineas"
            style="margin-right: 0.5rem"
          >
            <el-option
              v-for="item in mListRutasDespacho"
              :key="item.idRuta"
              :label="item.DescRuta"
              :value="item.idRuta"
            >
            </el-option>
          </el-select>

          <base-button
            icon
            type="primary"
            size="sm"
            @click="createHeaderTable()"
            title="Buscar"
          >
            <span class="btn-inner--icon"><i class="el-icon-search"></i></span>
          </base-button>
        </div>

        <div class="buttonsAdicionalesDespacho">
          <base-button
            icon
            type="info"
            @click="showModalDespachoRecalificarSalida()"
            v-show="
              this.selectRowId != null &&
              this.selectRowId != '' &&
              this.selectRowEstado != '' &&
              this.selectRowEstado != 'DIFERIDO'
            "
            size="sm"
            title="Recalificar Salida"
          >
            <span class="btn-inner--icon"
              ><i class="ni ni-watch-time"></i
            ></span>
          </base-button>

          <base-button
            icon
            type="danger"
            @click="showModalAnularFinalizarDespacho(4)"
            v-show="
              this.selectRowId != null &&
              this.selectRowId != '' &&
              this.selectRowEstado != '' &&
              this.selectRowEstado != 'FINALIZADO'
            "
            size="sm"
            title="Anular Salida"
          >
            <span class="btn-inner--icon"><i class="ni ni-scissors"></i></span>
          </base-button>

          <base-button
            icon
            type="warning"
            @click="showModalAnularFinalizarDespacho(3)"
            v-show="
              this.selectRowId != null &&
              this.selectRowId != '' &&
              this.selectRowEstado != '' &&
              this.selectRowEstado != 'FINALIZADO' &&
              this.selectRowEstado != 'DIFERIDO'
            "
            size="sm"
            title="Finalizar Salida"
          >
            <span class="btn-inner--icon"
              ><i class="ni ni-fat-delete"></i
            ></span>
          </base-button>

          <base-button
            icon
            type="default"
            @click="showRecorridoSalidaPanelDespacho()"
            v-show="
              this.selectRowId != null &&
              this.selectRowId != '' &&
              this.selectRowEstado != '' &&
              this.selectRowEstado != 'DIFERIDO'
            "
            size="sm"
            title="Recorrido"
          >
            <span class="btn-inner--icon"><i class="ni ni-world"></i></span>
          </base-button>

          <base-button
            icon
            type="primary"
            v-show="
              this.selectRowId != null &&
              this.selectRowId != '' &&
              this.selectRowEstado != ''
            "
            @click="showReporteLlegadaSAlida()"
            size="sm"
            title="Ver Tarjeta"
          >
            <span class="btn-inner--icon"
              ><i class="ni ni-collection"></i
            ></span>
          </base-button>

          <base-button
            icon
            type="success"
            title="Despachar"
            size="sm"
            @click="showEnviarDespachoPanel()"
          >
            <span class="btn-inner--icon"><i class="ni ni-send"></i></span>
          </base-button>
        </div>
      </card>

      <div class="containerTablero">
        <!--<div class="container-rutas">
          <div :class="index == 0 ? 'itemrutaDespacho activeRutaDespacho' : 'itemrutaDespacho'"
            v-for="(ruta, index) in mListRutasDespacho" :id="ruta.LetrRuta" :key="ruta.LetrRuta"
            @click="lecturaDespacho(ruta)">
            {{ ruta.DescRuta }}
          </div>
        </div>-->
        <div class="container-calendario col_personalizado">
          <JqxGrid
            ref="myGridDespachoPanel"
            @contextmenu="myGridOnContextMenu()"
            @rowclick="myGridOnRowClick($event)"
            @cellbeginedit="cellBeginEditEvent($event)"
            :height="'100%'"
            style="margin-right: 50rem !important"
            @cellendedit="cellEndEditEvent($event)"
            :columns="columnsInfo"
            :source="dataAdapter"
            @rowselect="myGridOnRowSelect($event)"
            :selectionmode="'singlerow'"
            :enabletooltips="true"
            :width="getWidth"
          >
          </JqxGrid>

          <JqxMenu
            ref="myMenu"
            @itemclick="myMenuOnItemClick($event)"
            :width="200"
            :height="200"
            :mode="'popup'"
            :autoOpenPopup="false"
          >
            <ul>
              <li>Retirar unidad</li>
              <li>Reemplazar unidad</li>
              <li>Ingresar unidad</li>
              <li>Modificar Intervalos</li>
              <li>Cambiar frecuencia</li>
              <li>Anular Salidas</li>
              <li>Copiar contenido</li>
            </ul>
          </JqxMenu>

          <div
            style="
              font-size: 12px;
              font-family: Verdana;
              margin-top: 30px;
              display: none;
            "
          >
            <div ref="beginEdit"></div>
            <div ref="endEdit" style="margin-top: 10px"></div>
          </div>
          <div
            class="loadingRecorridoSalidaBusquedaPanel"
            v-if="isLoadingDespachoSalidaPanelBusqueda"
          >
            <div class="circleProgress"></div>
          </div>
        </div>
      </div>
    </base-header>

    <!--Form modal TICKET LLEGADA-->
    <modal
      :show.sync="modalSalidasTarjetaPanelDespacho"
      size="sm"
      body-classes="p-0"
    >
      <ComponenteTarjeta ref="ComponenteTarjeta"></ComponenteTarjeta>
    </modal>

    <!--Form modal Despacho Salidas Anuladas-->
    <modal
      :show.sync="modalDespachoSalidasAnuladas"
      size="xl"
      body-classes="p-0"
    >
      <h6 slot="header" class="modal-title">Despacho Salidas Anuladas</h6>
      <card
        class="no-border-card"
        style="margin-bottom: 0rem"
        body-classes="card-bodyDSalidasAnuladas p-0"
      >
        <div>
          <el-table
            v-loading="isLoadingDespachoSalidaPanelBusqueda"
            element-loading-text="Cargando Datos..."
            :data="mListDespachosSalidasAnuladas"
            row-key="id"
            height="calc(100vh - 9rem)"
            style="width: 100%"
            header-row-class-name="thead-dark"
            :default-sort="{ prop: 'HoraSaliProgSali_m', order: 'ascending' }"
            :row-class-name="tableRowClassNameDSalidasAnuladas"
          >
            <el-table-column
              prop="CodiVehiSali_m"
              label="Unidad"
              min-width="110px"
            >
            </el-table-column>

            <el-table-column
              prop="HoraSaliProgSali_m"
              label="H.Salida"
              min-width="120px"
            >
            </el-table-column>
            <el-table-column
              prop="HoraLlegProgSali_m"
              label="H.LLegada"
              min-width="130px"
            >
            </el-table-column>
            <el-table-column
              prop="idSali_m"
              label="N° Salida"
              min-width="130px"
            >
            </el-table-column>

            <el-table-column prop="EstaSali_m" label="Estado" min-width="130px">
              <template v-slot="{ row }">
                <span>{{ row.EstaSali_m == 4 ? "ANULADO" : "" }}</span>
              </template>
            </el-table-column>

            <el-table-column
              prop="NumeVuelSali_m"
              label="Vuelta"
              min-width="110px"
            >
            </el-table-column>
            <el-table-column
              prop="SumaMinuPosiSali_m"
              label="Falta"
              min-width="150px"
            >
            </el-table-column>

            <el-table-column prop="Intervalo" label="Inte." min-width="100px">
              <template v-slot="{ row }">
                <span>{{ (row.Intervalo = 0) }}</span>
              </template>
            </el-table-column>

            <el-table-column
              prop="DescFrec"
              label="Frecuencia Salida"
              min-width="270px"
            >
            </el-table-column>

            <el-table-column
              prop="MontInfrUnidSali_m"
              label="Multa"
              min-width="100px"
            >
            </el-table-column>

            <el-table-column
              prop="VeloMaxiSali_m"
              label="KM/H"
              min-width="100px"
            >
            </el-table-column>

            <el-table-column prop="Country23" label="Chofer" min-width="250px">
            </el-table-column>

            <div slot="empty">
              <span>No existen Salidas Anuladas</span>
            </div>
          </el-table>
        </div>
      </card>
    </modal>

    <!--DESPACHAR modal-->
    <modal :show.sync="modalEnviarDespachoPanel">
      <base-alert
        v-if="
          responseApiDespachoWeb != null &&
          responseApiDespachoWeb.data.status_code == 200
        "
        type="default"
      >
        SALIDA
        <strong>{{ responseApiDespachoWeb.data.salida_id }}</strong> GENERADA
        CON EXITO
      </base-alert>

      <base-alert
        v-if="
          responseApiDespachoWeb != null &&
          responseApiDespachoWeb.data.status_code == 400
        "
        type="danger"
      >
        {{ responseApiDespachoWeb.data.msm }}
      </base-alert>

      <div class="row" style="margin-bottom: 1rem">
        <div class="col-md-12">
          <el-radio-group
            v-model="radioTipoDespacho"
            style="display: flex; justify-content: center"
          >
            <el-radio :label="1">Salida Normal.</el-radio>
            <el-radio :label="3">Generar Tarjeta</el-radio>
            <el-radio :label="2">Salida Diferida</el-radio>
          </el-radio-group>
        </div>
      </div>

      <div class="row" style="margin-bottom: 0.3rem">
        <div class="col-md-6">
          <el-date-picker
            type="datetime"
            placeholder="Fecha Despacho"
            style="width: 100%"
            v-model="fechaActualSalidasPanelDespachoDespachador"
            format="yyyy-MM-dd HH:mm:00"
          >
          </el-date-picker>
        </div>

        <div class="col-md-6">
          <el-select
            v-model="itemUnidadSalidasPanelDespacho"
            filterable
            remote
            placeholder="Ingrese unidad"
            style="width: 100%; margin-bottom: 0.5rem"
            :remote-method="remoteMethodUnidadesSalidasPanelBusqueda"
            :loading="loadingTableUnidadesSalidasPanelBusquedaloading"
          >
            <el-option
              v-for="item in optionsUnidadesSalidasPanelSalidas"
              :key="item.CodiVehi"
              :label="item.CodiVehi"
              :value="item"
            >
            </el-option>
          </el-select>
        </div>
      </div>

      <div class="row" style="margin-bottom: 0.5rem">
        <div class="col-md-12">
          <el-select
            v-model="mSelectRutaSalidaDespachar"
            @change="readFrecuenciasSalidasPanel()"
            collapse-tags
            placeholder="Lineas"
            style="width: 100%"
          >
            <el-option
              v-for="item in mListRutasDespacho"
              :key="item.idRuta"
              :label="item.DescRuta"
              :value="item.idRuta"
            >
            </el-option>
          </el-select>
        </div>
      </div>

      <div class="row">
        <div class="col-md-12">
          <el-select
            v-model="mSelectRutaFrecuenciaPanelDespacho"
            style="width: 100%"
            collapse-tags
            placeholder="Frecuencias"
          >
            <el-option
              v-for="item in mListRutasFrecuencias"
              :key="item.idFrec"
              :label="item.DescFrec"
              :value="item.idFrec"
            >
            </el-option>
          </el-select>
        </div>
      </div>

      <template slot="footer">
        <base-button type="link" @click="modalEnviarDespachoPanel = false"
          >Cancelar</base-button
        >
        <base-button
          type="primary"
          class="ml-auto"
          @click="EnviarDespachoUnidad()"
          >ENVIAR DESPACHO</base-button
        >
      </template>
    </modal>

    <!--RECORRIDO modal-->
    <modal
      :show.sync="modalRecorridoPanelDespachoControl"
      size="xl"
      body-classes="p-1"
    >
      <ComponenteRecorrido ref="ComponenteRecorrido"></ComponenteRecorrido>
    </modal>

    <!--Form modal Despacho Recalificar Salida-->
    <modal :show.sync="modalDespachoRecalificarSalida" body-classes="p-0">
      <h6 slot="header" class="modal-title">Recalificar Salida</h6>
    </modal>

    <!--Form modal Despacho Anular Salida-->
    <modal :show.sync="modalDespachoAnularSalida" body-classes="p-0">
      <base-alert
        v-if="
          reponseAnularFinalizar != null &&
          reponseAnularFinalizar.status_code != 200
        "
        type="danger"
        class="container_body_modal_despacho"
      >
        {{
          reponseAnularFinalizar == null
            ? "ERROR INDEFINIDO"
            : reponseAnularFinalizar.msm
        }}
      </base-alert>
      <h6 slot="header" class="modal-title">
        Anular Salida N°
        {{
          this.selectedRowSalida == null ? "" : this.selectedRowSalida.idSali_m
        }}
      </h6>
      <div class="container_body_modal_despacho">
        <strong>Unidad : </strong>
        {{
          this.selectedRowSalida == null
            ? ""
            : this.selectedRowSalida.CodiVehiSali_m
        }}
        <strong>Ruta : </strong>
        {{
          this.selectedRowSalida == null
            ? ""
            : this.selectedRowSalida.DescRutaSali_m
        }}
        <strong>Hora : </strong>
        {{
          this.selectedRowSalida == null
            ? ""
            : this.selectedRowSalida.HoraSaliProgSali_m
        }}
      </div>
      <template slot="footer">
        <base-button
          type="danger"
          @click="consumirApiAnularFinalizarDespacho(4)"
          >Anular Salida</base-button
        >
      </template>
    </modal>

    <!--Form modal Despacho Finalizar Salida-->
    <modal :show.sync="modalDespachoFinalizarSalida" body-classes="p-0">
      <base-alert
        v-if="
          reponseAnularFinalizar != null &&
          reponseAnularFinalizar.status_code != 200
        "
        type="danger"
        class="container_body_modal_despacho"
      >
        {{
          reponseAnularFinalizar == null
            ? "ERROR INDEFINIDO"
            : reponseAnularFinalizar.msm
        }}
      </base-alert>

      <h6 slot="header" class="modal-title">
        Finalizar Salida N°
        {{
          this.selectedRowSalida == null ? "" : this.selectedRowSalida.idSali_m
        }}
      </h6>
      <div class="container_body_modal_despacho">
        <strong>Unidad : </strong>
        {{
          this.selectedRowSalida == null
            ? ""
            : this.selectedRowSalida.CodiVehiSali_m
        }}
        <strong>Ruta : </strong>
        {{
          this.selectedRowSalida == null
            ? ""
            : this.selectedRowSalida.DescRutaSali_m
        }}
        <strong>Hora : </strong>
        {{
          this.selectedRowSalida == null
            ? ""
            : this.selectedRowSalida.HoraSaliProgSali_m
        }}
      </div>
      <template slot="footer">
        <base-button
          type="warning"
          @click="consumirApiAnularFinalizarDespacho(3)"
          >Finalizar Salida</base-button
        >
      </template>
    </modal>
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
} from "element-ui";
import JqxGrid from "jqwidgets-scripts/jqwidgets-vue/vue_jqxgrid.vue";
import JqxMenu from "jqwidgets-scripts/jqwidgets-vue/vue_jqxmenu.vue";
import RouteBreadCrumb from "@/components/argon-core/Breadcrumb/RouteBreadcrumb";
import { BasePagination } from "@/components/argon-core";
import clientPaginationMixin from "~/components/tables/PaginatedTables/clientPaginationMixin";
import swal from "sweetalert2";
import Tabs from "@/components/argon-core/Tabs/Tabs";
import TabPane from "@/components/argon-core/Tabs/Tab";
import { getFecha_dd_mm_yyyy, FechaStringToHour } from "../../util/fechas";

export default {
  mixins: [clientPaginationMixin],
  layout: "DespachoDashboardLayout",
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
    ComponenteRecorrido: recorrido,
    ComponenteTarjeta: tarjeta,
  },
  data() {
    return {
      reponseAnularFinalizar: null,
      minutosSalidaDiferida: 0,
      columnsInfo: [],
      imagenBaseUrl: "",
      getWidth: "100%",
      dataAdapter: new jqx.dataAdapter([]),
      token: this.$cookies.get("token"),
      mListRutasDespacho: [],
      mListControlesPorRuta: [],
      mListDespachosPanel: [],
      mListDespachosPanelAuxiliar: [],
      mListDespachosSalidasAnuladas: [],
      rowsToColor: [],
      isLoadingDespachoSalidaPanelBusqueda: true,
      fechaActualSalidasPanelDespacho: "",
      fechaActualSalidasPanelDespachoDespachador: "",
      mListaUnidadesSalidasPanelDespacho: [],
      loadingTableUnidadesSalidasPanelBusquedaloading: false,
      optionsUnidadesSalidasPanelSalidas: [],
      itemUnidadSalidasPanelDespacho: [],
      mListRutasFrecuencias: [],
      mSelectRutaSalidaPanelDespacho: null,
      mSelectRutaSalidaDespachar: null,
      mSelectRutaFrecuenciaPanelDespacho: null,
      modalSalidasTarjetaPanelDespacho: false,
      modalEnviarDespachoPanel: false,
      modalDespachoRecalificarSalida: false,
      modalDespachoAnularSalida: false,
      modalDespachoFinalizarSalida: false,
      baseURlPDFPanelDespachoTarjetaSalida: null,
      selectedRowSalida: null,
      selectRowId: null,
      selectRowEstado: null,
      radioTipoDespacho: 1,
      checkboxOrdenamientoDespacho: false,
      checkboxOSalidasAnuladasDespacho: false,
      modalDespachoSalidasAnuladas: false,
      mListSalidasTarjeta: [],
      titleModalTipoSalidaPanelDespacho: "",
      modalRecorridoPanelDespachoControl: false,
      oCenterPanelDespachoControl: { lat: -1.249546, lng: -78.585376 },
      oZoomPanelDespachoControl: 7,
      responseApiDespachoWeb: null,
      ArrowGridSelect: null,
    };
  },
  methods: {
    myGridOnRowSelect: function (event) {
      this.ArrowGridSelect = event.args.rowindex;
      this.selectedRowSalida = event.args.row;
      this.selectedRowSalida.HoraSaliProgSali_mF = this.getHoraSaliProgSali_mF(
        this.selectedRowSalida.idSali_m
      );
      this.selectedRowSalida.HoraLlegProgSali_mF = this.getHoraLlegProgSali_mF(
        this.selectedRowSalida.idSali_m
      );
      this.selectedRowSalida.idSali_m = this.selectedRowSalida.idSali_m;
      this.selectRowId = this.selectedRowSalida.idSali_m;
      this.selectRowEstado = this.selectedRowSalida.EstaSali_m;
      console.log("EstaSali_m");
      console.log(this.selectRowEstado);
    },
    getHoraSaliProgSali_mF(id_salida) {
      for (var i = 0; i < this.mListDespachosPanel.length; i++) {
        if (this.mListDespachosPanel[i].idSali_m == id_salida) {
          return this.mListDespachosPanel[i].HoraSaliProgSali_mF;
        }
      }
      return "1998-06-06 11:00:00";
    },
    getHoraLlegProgSali_mF(id_salida) {
      for (var i = 0; i < this.mListDespachosPanel.length; i++) {
        if (this.mListDespachosPanel[i].idSali_m == id_salida) {
          return this.mListDespachosPanel[i].HoraLlegProgSali_mF;
        }
      }
      return "1998-06-06 11:00:00";
    },
    showReporteLlegadaSAlida() {
      this.modalSalidasTarjetaPanelDespacho = true;
      console.log(this.selectedRowSalida);
      //idSali_m
      this.$refs.ComponenteTarjeta.readDetalleSalidaDPanelBusqueda(
        this.selectedRowSalida
      );
    },
    showRecorridoSalidaPanelDespacho() {
      console.log("******************************************************");
      console.log(this.selectedRowSalida);
      console.log("******************************************************");
      this.modalRecorridoPanelDespachoControl = true;
      this.$refs.ComponenteRecorrido.readHistorialSalidaPanelBusqueda(
        this.selectedRowSalida
      );
    },
    showEnviarDespachoPanel() {
      this.initFechaActualSalidaDespachoPanel();
      this.responseApiDespachoWeb = null;
      this.itemUnidadSalidasPanelDespacho = null;
      this.mSelectRutaFrecuenciaPanelDespacho = null;
      this.modalEnviarDespachoPanel
        ? (this.modalEnviarDespachoPanel = false)
        : (this.modalEnviarDespachoPanel = true);
    },
    getObjetoFrecuencia(idFreceucnia) {
      for (var i = 0; this.mListRutasFrecuencias.length; i++) {
        if (idFreceucnia == this.mListRutasFrecuencias[i].idFrec) {
          return this.mListRutasFrecuencias[i];
        }
      }

      return null;
    },
    showModalDespacho() {
      this.modalEnviarDespachoPanel
        ? (this.modalEnviarDespachoPanel = false)
        : (this.modalEnviarDespachoPanel = true);
    },
    showModalDespachoRecalificarSalida() {
      this.modalDespachoRecalificarSalida
        ? (this.modalDespachoRecalificarSalida = false)
        : (this.modalDespachoRecalificarSalida = true);
    },
    showModalDespachoFinalizarSalida() {
      this.AnularFinalizarDespacho(this.selectedRowSalida, 3);
      /*this.modalDespachoFinalizarSalida
        ? (this.modalDespachoFinalizarSalida = false)
        : (this.modalDespachoFinalizarSalida = true);*/
    },
    async readFrecuenciasSalidasPanel() {
      this.mListRutasFrecuencias = [];
      this.mSelectRutaFrecuenciaPanelDespacho = null;
      var datos = await this.$axios.post(
        process.env.baseUrl + "/frecuencias_rutas",
        {
          token: this.token,
          ruta: this.mSelectRutaSalidaDespachar,
        }
      );

      console.log(datos.data);
      if (datos.data.status_code != 400) {
        this.mListRutasFrecuencias.push(...datos.data.data);
      }
    },
    initFechaActualSalidaDespachoPanel() {
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
      this.fechaActualSalidasPanelDespacho =
        format + " " + hora + ":" + minutes + ":00";
      this.fechaActualSalidasPanelDespachoDespachador =
        format + " " + hora + ":" + minutes + ":00";
    },
    myGridOnContextMenu: function () {
      return false;
    },
    myGridOnRowClick: function (event) {
      if (event.args.rightclick) {
        this.$refs.myGridDespachoPanel.selectrow(event.args.rowindex);
        let scrollTop = window.scrollY;
        let scrollLeft = window.scrollX;
        this.$refs.myMenu.open(
          parseInt(event.args.originalEvent.clientX) + 5 + scrollLeft,
          parseInt(event.args.originalEvent.clientY) + 5 + scrollTop
        );
        return false;
      }
    },
    myMenuOnItemClick: function (event) {
      let args = event.args;
      let rowindex = this.$refs.myGridDespachoPanel.getselectedrowindex();
      if (args.innerHTML == "Edit Selected Row") {
        this.editrow = rowindex;
        this.$refs.myWindow.position = { x: 60, y: 60 };
        // get the clicked row's data and initialize the input fields.
        let dataRecord = this.$refs.myGridDespachoPanel.getrowdata(
          this.editrow
        );
        this.$refs.firstName.value = dataRecord.firstname;
        this.$refs.lastName.value = dataRecord.lastname;
        this.$refs.product.value = dataRecord.productname;
        this.$refs.quantity.decimal = dataRecord.quantity;
        this.$refs.price.decimal = dataRecord.price;
        // show the popup window.
        this.$refs.myWindow.open();
      } else {
        let rowid = this.$refs.myGridDespachoPanel.getrowid(rowindex);
        this.$refs.myGridDespachoPanel.deleterow(rowid);
      }
    },
    getRutaPorID(idRuta) {
      for (var i = 0; this.mListRutasDespacho.length; i++) {
        if (this.mListRutasDespacho[i].idRuta == idRuta) {
          return this.mListRutasDespacho[i];
        }
      }
    },
    async createHeaderTable() {
      //this.selectedRowSalida = null;
      this.selectRowId  = null
      //this.$refs.myGridDespachoPanel.clearSelection();
      if (this.ArrowGridSelect != null) {
        this.$refs.myGridDespachoPanel.unselectrow(this.ArrowGridSelect);
      }

      var oRuta = this.getRutaPorID(this.mSelectRutaSalidaPanelDespacho);
      this.readDespachoSalidasAnuladas();

      try {
        this.mListDespachosPanel = [];
        this.mListDespachosPanelAuxiliar = [];
        this.isLoadingDespachoSalidaPanelBusqueda = true;
        var datos = await this.$axios.post(
          process.env.baseUrl + "/readSalidasPanel",
          {
            token: this.token,
            unidades: "*",
            rutas: [oRuta.LetrRuta],
            fechaI: getFecha_dd_mm_yyyy(this.fechaActualSalidasPanelDespacho),
            fechaF: getFecha_dd_mm_yyyy(this.fechaActualSalidasPanelDespacho),
            tipo: "*",
          }
        );
        this.mListDespachosPanel.push(...datos.data.datos);
        this.mListDespachosPanelAuxiliar = this.mListDespachosPanel
        this.$refs.myGridDespachoPanel.beginupdate();
        this.columnsInfo = [];
        this.columnsInfo[0] = {
          text: "Unidad",
          datafield: "CodiVehiSali_m",
          width: 70,
          cellclassname: this.cellclassname,
          cellbeginedit: this.cellbeginedit,
        };
        this.columnsInfo[1] = {
          text: "H.Salida",
          datafield: "HoraSaliProgSali_m",
          width: 130,
          cellclassname: this.cellclassname,
          cellbeginedit: this.cellbeginedit,
        };
        this.columnsInfo[2] = {
          text: "H.Llegada",
          datafield: "HoraLlegProgSali_m",
          width: 90,
          cellclassname: this.cellclassname,
          cellbeginedit: this.cellbeginedit,
        };
        this.columnsInfo[3] = {
          text: "N° Salida",
          datafield: "idSali_m",
          width: 100,
          cellclassname: this.cellclassname,
          cellbeginedit: this.cellbeginedit,
        };
        this.columnsInfo[4] = {
          text: "Estado",
          datafield: "EstaSali_m",
          width: 150,
          cellclassname: this.cellclassname,
          cellbeginedit: this.cellbeginedit,
        };
        this.columnsInfo[5] = {
          text: "Vuelta",
          datafield: "NumeVuelSali_m",
          width: 70,
          cellclassname: this.cellclassname,
          cellbeginedit: this.cellbeginedit,
        };
        this.columnsInfo[6] = {
          text: "F. Atraso",
          datafield: "atrasoFaltasTime",
          width: 100,
          cellclassname: this.cellclassname,
          cellbeginedit: this.cellbeginedit,
        };

        this.columnsInfo[7] = {
          text: "F. Adelanto",
          datafield: "adelantoFaltasTime",
          width: 100,
          cellclassname: this.cellclassname,
          cellbeginedit: this.cellbeginedit,
        };

        this.columnsInfo[8] = {
          text: "Inte.",
          datafield: "Intervalo",
          width: 50,
          cellclassname: this.cellclassname,
          cellbeginedit: this.cellbeginedit,
        };

        this.columnsInfo[9] = {
          text: "Linea - Ruta",
          datafield: "DescRutaSali_m",
          width: 220,
          cellclassname: this.cellclassname,
          cellbeginedit: this.cellbeginedit,
        };

        this.columnsInfo[10] = {
          text: "Frecuencia Salida",
          datafield: "DescFrec",
          width: 250,
          cellclassname: this.cellclassname,
          cellbeginedit: this.cellbeginedit,
        };
        this.columnsInfo[11] = {
          text: "Multa",
          datafield: "PenaCtrlSali_d",
          width: 100,
          cellclassname: this.cellclassname,
          cellbeginedit: this.cellbeginedit,
        };
        this.columnsInfo[12] = {
          text: "KM/H",
          datafield: "VeloMaxiSali_m",
          width: 100,
          cellclassname: this.cellclassname,
          cellbeginedit: this.cellbeginedit,
        };
        this.columnsInfo[13] = {
          text: "Chofer",
          datafield: "Country23",
          width: 150,
          cellsalign: "left",
          cellclassname: this.cellclassname,
          cellbeginedit: this.cellbeginedit,
        };

        this.$refs.myGridDespachoPanel.setOptions({
          source: this.createBodyDespacho(this.mListDespachosPanelAuxiliar),
          columns: this.columnsInfo,
        });
        this.isLoadingDespachoSalidaPanelBusqueda = false;
        this.$refs.myGridDespachoPanel.endupdate();
      } catch (error) {
        console.log(error);
      }
    },
    cellBeginEditEvent: function (event) {
      let args = event.args;
      this.$refs.beginEdit.innerHTML =
        "Event Type: cellbeginedit, Column: " +
        args.datafield +
        ", Row: " +
        (1 + args.rowindex) +
        ", Value: " +
        args.value;
    },
    cellEndEditEvent: function (event) {
      let args = event.args;
      this.$refs.endEdit.innerHTML =
        "Event Type: cellendedit, Column: " +
        args.datafield +
        ", Row: " +
        (1 + args.rowindex) +
        ", Value: " +
        args.value;
    },
    async initRutasDespacho() {
      try {
        var datos = await this.$axios.post(
          process.env.baseUrlPanel + "/rutes",
          {
            token: this.token,
            tipo: 1,
          }
        );
        if (datos.data.status_code == 200) {
          this.mListRutasDespacho.push(...datos.data.data);
          this.mSelectRutaSalidaPanelDespacho = datos.data.data[0].idRuta;
          this.mSelectRutaSalidaDespachar = datos.data.data[0].idRuta;
          this.initFechaActualSalidaDespachoPanel();

          this.createHeaderTable();

          this.readFrecuenciasSalidasPanel();

          //this.activeRutaDespacho(datos.data.data[0])
        } else if (datos.data.status_code == 300) {
          Notification.info({
            title: "Rutas Despacho",
            message: "No existen Rutas Despacho registradas",
          });
        } else {
          Notification.error({
            title: "Error Api Rutas Despacho",
            message: datos.data.msm,
          });
        }
      } catch (error) {
        Notification.error({ title: "Error Catch", msm: error.toString() });
      }
    },
    createBodyDespacho(despachos) {
      var tiempoString = "";
      var minutosString = "";
      var secondString = "00";
      var ListaLlena = [];
      var ListaVacia = [];
      var ListaCompleta = [];
      var inter = 0;
      for (var hora = 3; hora <= 23; hora++) {
        tiempoString = hora < 10 ? "0" + hora : hora;
        for (var minuto = 0; minuto <= 59; minuto++) 
        {
          minutosString = minuto < 10 ? "0" + minuto : minuto
            var HS = tiempoString + ":" + minutosString + ":"+secondString
            var HSa_ = tiempoString + ":" + minutosString + ":"+secondString+ " (A)"
            var obj = this.getObjetoSalidaDespacho(HS, HSa_)
            var objD =
              obj == null
                ? {
                    LetraRutaSali_m: "",
                    CodiVehiSali_m: "",
                    idSali_m: "",
                    HoraSaliProgSali_m: HS,
                    HoraLlegProgSali_m: "",
                    EstaSali_m: "",
                    idFrecSali_m: "",
                    DescFrec: "",
                    PenaCtrlSali_d: "",
                    VeloMaxiSali_m: "",
                    NumeVuelSali_m: "",
                    atrasoFaltasTime: "",
                    adelantoFaltasTime: "",
                    Country23: "",
                    Intervalo: "",
                    DescRutaSali_m: "",
                  }
                : obj;
            if (obj == null) {
              ListaVacia.push(objD);
              inter++;
            } else {
              var estado = obj.EstaSali_mCode == 4 ? HSa_ : HS;
              obj.HoraSaliProgSali_m = estado;
              obj.Intervalo = inter;
              inter = 0;

              ListaLlena.push(obj);
            }
        }
      }
      ListaCompleta = ListaLlena.concat(ListaVacia);
      console.log("LISTA CCCCCCC");
      console.log(ListaCompleta);
      return {
        localdata: ListaCompleta,
        datatype: "array",
        datafields: [
          { name: "LetraRutaSali_m", type: "string" },
          { name: "CodiVehiSali_m", type: "string" },
          { name: "idSali_m", type: "string" },
          { name: "HoraSaliProgSali_m", type: "string" },
          { name: "HoraLlegProgSali_m", type: "string" },
          { name: "EstaSali_m", type: "string" },
          { name: "idFrecSali_m", type: "string" },
          { name: "Intervalo", type: "string" },
          { name: "DescFrec", type: "string" },
          { name: "PenaCtrlSali_d", type: "string" },
          { name: "VeloMaxiSali_m", type: "string" },
          { name: "NumeVuelSali_m", type: "string" },
          { name: "atrasoFaltasTime", type: "string" },
          { name: "adelantoFaltasTime", type: "string" },
          { name: "DescRutaSali_m", type: "string" },
          { name: "Country23", type: "string" },
        ],
      };
    },
    getObjetoSalidaDespacho(tiempo, tiempoA) {
      console.log("TAMANIO : "+this.mListDespachosPanelAuxiliar.length )
      if (this.mListDespachosPanelAuxiliar.length > 0) {
        for (var i = 0; i < this.mListDespachosPanelAuxiliar.length; i++) 
        {
          console.log(tiempo +" == "+ this.mListDespachosPanelAuxiliar[i].HoraSaliProgSali_m)
          if (
            tiempo == this.mListDespachosPanelAuxiliar[i].HoraSaliProgSali_m
          ) {
            var obj = this.mListDespachosPanelAuxiliar[i];
            obj.Intervalo = 0;
            obj.EstaSali_mCode = obj.EstaSali_m;
            obj.EstaSali_m =
              obj.EstaSali_m == 4
                ? "ANULADO"
                : obj.EstaSali_m == 1 || obj.EstaSali_m == 0
                ? "DIFERIDO"
                : obj.EstaSali_m == 2
                ? "EN RUTA"
                : "FINALIZADO";
            this.mListDespachosPanelAuxiliar.splice(i, 1);
            return obj;
          }
        }
      }
      return null;
    },
    lecturaDespacho(ruta) {
      this.removeAllRutaNoSelect();
      this.activeRutaDespacho(ruta);
    },
    handleLike(index, row) {},
    handleEdit(index, row) {},
    handleDelete(index, row) {},
    deleteRow(row) {},
    async readAllUnidadesSalidasPanelBusqueda() {
      var datos = await this.$axios.post(
        process.env.baseUrl + "/unidadesDespacho",
        {
          token: this.token,
        }
      );
      if (datos.data.status_code == 200) {
        for (var i = 0; i < datos.data.data.length; i++) {
          var obj = datos.data.data[i];
          obj.value = obj.CodiVehi;
          console.log(obj);
          this.mListaUnidadesSalidasPanelDespacho.push(obj);
        }
      }
    },
    remoteMethodUnidadesSalidasPanelBusqueda(query) {
      if (query !== "") {
        this.loadingTableUnidadesSalidasPanelBusquedaloading = true;
        setTimeout(() => {
          this.loadingTableUnidadesSalidasPanelBusquedaloading = false;
          this.optionsUnidadesSalidasPanelSalidas =
            this.mListaUnidadesSalidasPanelDespacho.filter((item) => {
              return (
                item.CodiVehi.toLowerCase().indexOf(query.toLowerCase()) > -1
              );
            });
        }, 200);
      } else {
        this.optionsUnidadesSalidasPanelSalidas = [];
      }
    },
    cellclassname(row, column, value, data) {
      if (data.EstaSali_m == "DIFERIDO") {
        return "estadodiferidoDespacho";
      } else if (data.EstaSali_m == "EN RUTA") {
        return "estadoenrutaDespacho";
      } else if (data.EstaSali_m == "FINALIZADO") {
        return "estadofinalizadoDespacho";
      } else {
        return "estadofinalizadoDespacho";
      }
    },
    showModalDespachoSalidasAnuladas() {
      this.modalDespachoSalidasAnuladas = true;
    },
    async readDespachoSalidasAnuladas() {
      var ruta = this.getRutaPorID(this.mSelectRutaSalidaPanelDespacho);
      try {
        this.isLoadingDespachoSalidaPanelBusqueda = true;
        this.mListDespachosSalidasAnuladas = [];
        var datos = await this.$axios.post(
          process.env.baseUrl + "/readSalidasPanelDespacho",
          {
            token: this.token,
            ruta: ruta.LetrRuta,
            fecha: getFecha_dd_mm_yyyy(this.fechaActualSalidasPanelDespacho),
            anuladas: 1,
          }
        );
        if (datos.data.status_code == 200) {
          this.mListDespachosSalidasAnuladas.push(...datos.data.datos);
          this.isLoadingDespachoSalidaPanelBusqueda = false;
        } else if (datos.data.status_code == 300) {
          this.isLoadingDespachoSalidaPanelBusqueda = false;
          Notification.info({
            title: "Despacho Salidas Anuladas",
            message: "No existen datos disponibles",
            duration: 2500,
          });
        } else {
          Notification.error({
            title: "API ERROR",
            message: datos.data.msm,
            duration: 2500,
          });
        }
      } catch (error) {
        Notification.error({
          title: "ERROR CATCH",
          message: error.toString(),
          duration: 2500,
        });
      }
      this.loadingRPagosVehiculo = false;
    },
    tableRowClassNameDSalidasAnuladas({ row }) {
      if (row.EstaSali_m == 4) {
        return "estadoanuladoDespacho";
      }
    },
    cellbeginedit: function (row, column, value, data) {
      if (data == "") {
        console.log(column);
        var rowNoEdit = row;
        if (row == rowNoEdit) {
          if (
            column == "idSali_m" ||
            column == "EstaSali_m" ||
            column == "NumeVuelSali_m" ||
            column == "SumaMinuPosiSali_m" ||
            column == "Intervalo" ||
            column == "MontInfrUnidSali_m" ||
            column == "VeloMaxiSali_m"
          ) {
            return false;
          }
        }
      } else {
        return false;
      }
    },
    async EnviarDespachoUnidad() {
      try {
        var objFrecuencia = this.getObjetoFrecuencia(
          this.mSelectRutaFrecuenciaPanelDespacho
        );
        console.log(objFrecuencia);
        this.responseApiDespachoWeb = null;
        console.log(this.radioTipoDespacho);
        console.log(this.itemUnidadSalidasPanelDespacho);
        console.log("ENVIANDO DESPACHO ............");
        console.log(`UNIDAD : ${this.itemUnidadSalidasPanelDespacho.CodiVehi}`);
        console.log(
          `API : ${this.itemUnidadSalidasPanelDespacho.api_despacho}`
        );
        console.log(this.fechaActualSalidasPanelDespachoDespachador);
        console.log(`FRECUENCIA : ${this.mSelectRutaFrecuenciaPanelDespacho}`);
        console.log(objFrecuencia);
        console.log(`RUTA ${this.mSelectRutaSalidaDespachar}`);

        this.responseApiDespachoWeb = await this.$axios.post(
          process.env.baseUrl + "/generarDespacho",
          {
            token: this.token,
            unidad: this.itemUnidadSalidasPanelDespacho.CodiVehi,
            empresa_codigo: this.itemUnidadSalidasPanelDespacho.CodiClie,
            dispositivo_imei: this.itemUnidadSalidasPanelDespacho.CodiDispVehi,
            channel_port: this.itemUnidadSalidasPanelDespacho.PuerCHNClie,
            dispositivo_tipo:
              this.itemUnidadSalidasPanelDespacho.idTipoDispVehi,
            ruta: this.mSelectRutaSalidaDespachar,
            frecuencia: objFrecuencia.idFrec,
            fecha_hora: this.fechaActualSalidasPanelDespachoDespachador,
            salida_diferida:
              this.radioTipoDespacho == 1 || this.radioTipoDespacho == 3
                ? 0
                : 1,
            minutos_antes:
              this.radioTipoDespacho == 2
                ? objFrecuencia.AutoDespachoDifeFrec
                : 0,
          }
        );

        console.log(this.responseApiDespachoWeb.data);
      } catch (error) {
        console.log(error);
      }
      this.createHeaderTable();
    },
    async showModalAnularFinalizarDespacho(estado) {
      //console.log(this.selectRowEstado)
      this.reponseAnularFinalizar = null;
      if (estado == 3) {
        this.modalDespachoFinalizarSalida = true;
      } else if (estado == 4) {
        this.modalDespachoAnularSalida = true;
      }
    },
    async consumirApiAnularFinalizarDespacho(estado) {
      try {
        var unidad = this.getObjUnidad(this.selectedRowSalida.CodiVehiSali_m);
        console.log(this.getObjUnidad(this.selectedRowSalida.CodiVehiSali_m));

        var response = await this.$axios.post(
          process.env.baseUrl + "/anularFinalizarDespacho",
          {
            token: this.token,
            salida_id: this.selectedRowSalida.idSali_m,
            estado: estado,
            empresa_codigo: unidad.CodiClie,
            unidad: unidad.CodiVehi,
            dispositivo_imei: unidad.CodiDispVehi,
            dispositivo_tipo: unidad.idTipoDispVehi,
            channel_port: unidad.PuerCHNClie,
          }
        );

        console.log(response.data);
        this.reponseAnularFinalizar = response.data
        this.modalDespachoAnularSalida = false
        this.modalDespachoFinalizarSalida = false
      } catch (e) {
        alert("ERROR TRYCATCH");
        console.log(e);
      }
      this.createHeaderTable();
    },
    getObjUnidad(unidad) {
      var objUnidad = null;

      for (var i = 0; i < this.mListaUnidadesSalidasPanelDespacho.length; i++) {
        if (this.mListaUnidadesSalidasPanelDespacho[i].CodiVehi == unidad) {
          return this.mListaUnidadesSalidasPanelDespacho[i];
        }
      }

      return objUnidad;
    },
  },
  mounted() {
    this.initFechaActualSalidaDespachoPanel();
    this.readAllUnidadesSalidasPanelBusqueda();
    this.initRutasDespacho();

    /*document.addEventListener('contextmenu', event => event.preventDefault());
    document.oncontextmenu = function () { return false }*/

    this.imagenBaseUrl = this.$cookies.get("logo");

    $(document).on("click", ".idShowTarjeta", function () {
      this.showReporteLlegadaSAlida();
    });
  },
};
</script>

<style>
.container_body_modal_despacho {
  margin-right: 1.25rem;
  margin-left: 1.25rem;
}
.buttonsAdicionalesDespacho {
  margin: auto;
  display: flex;
  justify-content: flex-end;
  width: 40%;
}

.container-rutas::-webkit-scrollbar {
  display: none;
}

.containerTiposDespachos {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.card-bodyTopOpcionesRPagosVehiculoPRoduccion {
  padding-top: 0.25rem !important;
  flex-wrap: wrap;
}

.cardSelectRubrosEstadosPagosVehiculoProduccionContainer {
  display: flex;
  justify-content: space-between;
}

.cardTextoRPagosVehiculoProduccion {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.cardTiposDespachosPanelDespacho {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  width: 60%;
  justify-content: flex-start;
}

.en-ruta {
  background-color: hsla(226, 88%, 61%, 0.301);
}

.anulados {
  background-color: rgba(252, 143, 143, 0.692);
}

.diferidas {
  background-color: hsla(115, 100%, 59%, 0.301);
}

.itemrutaDespacho {
  padding: 0.75rem 1rem;
  margin-right: 0.25rem;
  color: #5e72e4;
  font-weight: 500;
  font-size: 0.875rem;
  box-shadow: 0 4px 6px rgb(50 50 93 / 11%), 0 1px 3px rgb(0 0 0 / 8%);
  background-color: #fff;
  transition: all 0.15s ease;
  margin-bottom: 0.5rem;
  cursor: pointer;
  border-radius: 0.375rem;
}

.activeRutaDespacho {
  background-color: #5e72e4;
  color: white;
}

.nav-item-personalizado {
  padding: 0rem 0.25rem 0rem 0.25rem !important;
  margin-bottom: 0.25rem !important;
}

.alineacion-vertical-tabs {
  display: flex;
  flex-direction: column;
}

.card-body-sinpadding {
  padding: 0rem !important;
}

.card-sinborderPanel {
  border: 0rem !important;
  border-radius: 0rem !important;
  height: 100%;
  background-color: transparent;
}

.col_personalizado {
  flex-basis: 0;
  flex-grow: 1;
  max-width: 100%;
  padding: 0rem !important;
}

.card-Calendar {
  height: calc(100vh - 7rem);
  scroll-behavior: auto;
}

.container-rutas {
  height: auto;
  max-width: 8rem;
  min-width: 8rem;
  overflow: auto;
}

.container-calendario {
  height: 100%;
}

.containerTablero {
  height: calc(100vh - 9.5rem);
  display: flex;
}

.no-border-card .card-footer {
  border-top: 0;
}

.nav-pills .nav-item {
  padding-right: 0.25rem !important;
  padding-left: 0.25rem;
  margin-top: 0.5rem;
}

.estadofinalizadoDespacho {
  background-color: rgb(220, 220, 220);
  color: black;
}

.estadofinalizadoDespacho:not(.jqx-grid-cell-hover):not(.jqx-grid-cell-selected),
.jqx-widget
  .estadofinalizadoDespacho:not(.jqx-grid-cell-hover):not(.jqx-grid-cell-selected) {
  background-color: #ffffff;
  color: black;
}

.estadoenrutaDespacho {
  background-color: rgb(220, 220, 220);
  color: black;
}

.estadoenrutaDespacho:not(.jqx-grid-cell-hover):not(.jqx-grid-cell-selected),
.jqx-widget
  .estadoenrutaDespacho:not(.jqx-grid-cell-hover):not(.jqx-grid-cell-selected) {
  background-color: hsla(226, 88%, 61%, 0.315);
  color: black;
}

.estadoanuladoDespacho {
  background-color: rgba(255, 0, 0, 0.315) !important;
  color: black;
}

.estadodiferidoDespacho {
  background-color: rgb(220, 220, 220);
  color: black;
}

.estadodiferidoDespacho:not(.jqx-grid-cell-hover):not(.jqx-grid-cell-selected),
.jqx-widget
  .estadodiferidoDespacho:not(.jqx-grid-cell-hover):not(.jqx-grid-cell-selected) {
  background-color: rgba(140, 248, 126, 0.315);
  color: black;
}

.card-bodyDSalidasAnuladas {
  height: calc(100vh - 9rem);
  overflow: none;
}
</style>
