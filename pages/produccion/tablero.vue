<template>
  <div class="content">
    <base-header>
      <div class="align-items-center py-3">
        <card
          class="no-border-card col"
          style="margin-bottom: 0.5rem"
          body-classes="px-0 pb-1 card-bodyTopOpcionesRPagosVehiculoPRoduccion cardSelectRubrosEstadosPagosVehiculoProduccionContainer"
          footer-classes="pb-2"
        >
          <div class="cardTextoRPagosVehiculoProduccion">
            <!--<el-autocomplete class="inline-input" v-model="itemUnidadPanelProduccion"
              :fetch-suggestions="querySearchUnidadProduccionRPagoVehiculo" style="margin-right: 0.5rem"
              placeholder="Unidad" prefix-icon="ni ni-bus-front-12" :trigger-on-focus="false"></el-autocomplete>-->

            <el-select
              v-model="itemUnidadPanelProduccion"
              multiple
              filterable
              style="margin-right: 0.5rem"
              remote
              placeholder="Ingrese unidad"
              :remote-method="remoteMethodUnidadesPanelProduccionJustificacion"
              :loading="loadingTableUnidadesPanelProduccoionLoading"
            >
              <el-option
                v-for="item in optionsUnidadesPanelProduccion"
                :key="item.CodiVehi"
                :label="item.CodiVehi"
                :value="item.CodiVehi"
              >
              </el-option>
            </el-select>

            <el-select
              v-model="mSelectLineasValueTablero"
              style="margin-right: 0.5rem"
              multiple
              collapse-tags
              placeholder="Rutas"
            >
              <el-option
                v-for="item in mListLineasTableroProduccion"
                :key="item.LetrRuta"
                :label="item.DescRuta"
                :value="item.idRuta"
              >
              </el-option>
            </el-select>

            <base-input addon-left-icon="ni ni-calendar-grid-58">
              <flat-picker
                slot-scope="{ focus, blur }"
                :max="{ fechaInicialTableroProduccion }"
                @on-open="focus"
                @on-close="blur"
                :config="{ allowInput: true }"
                class="form-controlPersonal datepicker"
                v-model="fechaInicialTableroProduccion"
              >
              </flat-picker>
            </base-input>
          </div>

          <div class="cardSelectRubrosEstadosPagosVehiculoProduccionContainer">
            <div class="buttonCenterEndDerecha">
              <base-button
                icon
                type="primary"
                size="sm"
                @click="readlPanelTableroProduccion()"
              >
                <span class="btn-inner--icon"
                  ><i class="el-icon-search"></i
                ></span>
              </base-button>
            </div>
          </div>
        </card>

        <card
          class="no-border-card col"
          style="margin-bottom: 0.5rem"
          body-classes="px-0 pb-1 card-bodyTopOpcionesRPagosVehiculoPRoduccion cardSelectRubrosEstadosPagosVehiculoProduccionContainer"
          footer-classes="pb-2"
        >
          <div class="cardSelectRubrosEstadosRPagosVehiculoProduccion">
            <!--<el-select v-model="mSelectRubroValueTablero" multiple collapse-tags placeholder="Rubros">
              <el-option v-for="item in mListRubrosTableroProduccion" :key="item.id" :label="item.descripcion"
                :value="item.id">
              </el-option>
            </el-select>-->
          </div>

          <div class="cardTextoRPagosVehiculoProduccion">
            <strong style="color: dark; margin-right: 0.5rem"
              >Recaudado :
              {{
                (
                  parseFloat(mPagadoRPagosVehiculo) +
                  parseFloat(mJustificadoRPagosVehiculo)
                ).toFixed(2)
              }}
              $</strong
            >
            <strong style="color: lightseagreen; margin-right: 0.5rem"
              >Descuentos : {{ mJustificadoRPagosVehiculo }} $</strong
            >
            <strong style="color: green; margin-right: 0.5rem"
              >Total : {{ mPagadoRPagosVehiculo }} $</strong
            >
          </div>
        </card>

        <card
          class="no-border-card"
          style="margin-bottom: 0rem"
          body-classes="card-bodyRPagosVehiculoProduccionPCTablero px-0 pb-1"
          footer-classes="pb-2"
        >
          <div>

            <el-table
              v-loading="loadingRTableroProduccion"
              element-loading-text="Cargando Datos..."
              :data="tableDataPanelControlProduccion"
              row-key="id"
              class="tablePanelControlProduccion"
              header-row-class-name="thead-dark"
              height="calc(100vh - 12rem)"
              style="width: 100%"
            >
              <el-table-column
                label="Acciones"
                :minWidth="'220'"
              >
                <template slot-scope="scope">
                  <base-button
                    size="sm"
                    @click="showVisibleModalTableroProduccion(scope.row)"
                    title="Justificar Unidad"
                    type="primary"
                    ><i class="ni ni-like-2"></i
                  ></base-button>

                  <base-button
                    v-if="isRecorridoPorVueltas ? false : true"
                    size="sm"
                    @click="
                      showVisibleModalRecorridoTableroProduccion(scope.row)
                    "
                    title="Recorrido Salida"
                    type="success"
                    ><i class="ni ni-world"></i>
                  </base-button>

                  <el-popover
                    slot="refPopoverCodigoSalidas"
                    v-if="isRecorridoPorVueltas"
                    title=""
                    @show="oClickDropdownSalidasCodigo(scope.row)"
                    placement="right"
                    trigger="click"
                  >


                  

                  <div v-if="loadingCodigoSalidasFrecuenciasControles" class="circleProgressMini"></div>

                    <a
                      class="dropdown-item"
                      v-for="item in mListCodigoSalidasProduccion"
                      :key="item.idSali_m"
                      href="#"
                      @click.prevent="
                        showVisibleModalRecorridoTableroProduccion(item)
                      "
                      >Unidad : {{ item.CodiVehiSali_m }} Salida :
                      {{ item.idSali_m }} Vuelta : {{ item.NumeVuelSali_m }}</a
                    >

                    <base-button
                      slot="reference"
                      title="RECORRIDO SALIDAS"
                      size="sm"
                      type="success"
                      ><i class="ni ni-world"></i
                    ></base-button>
                  </el-popover>

                  <base-button
                    size="sm"
                    v-if="scope.row.VelocidadPenalidad != '0.00' ? true : false"
                    @click="
                      showVisibleModalExVelocidadTableroProduccion(scope.row)
                    "
                    title="Excesos de Velocidad"
                    type="danger"
                    ><i class="ni ni-delivery-fast"></i>
                  </base-button>
                </template>
              </el-table-column>

              <el-table-column prop="Unidad" label="Unidad" minWidth="110">
              </el-table-column>
              <el-table-column
                prop="DeudaTotal"
                sortable
                label="Total($)"
                minWidth="135"
              >
                <template slot-scope="scope">
                  <strong style="color: black">{{
                    scope.row.DeudaTotal
                  }}</strong>
                </template>
              </el-table-column>
              <el-table-column
                prop="AdelantoTiempo"
                label="Min. Adelantos"
                minWidth="160"
              >
              </el-table-column>
              <el-table-column
                prop="AtrasoTiempo"
                label="Min. Atrasos"
                minWidth="150"
              >
              </el-table-column>
              <el-table-column
                prop="AdelantoPenalidad"
                label="Adelantos ($)"
                minWidth="150"
              >
              </el-table-column>
              <el-table-column
                prop="AtrasoPenalidad"
                label="Atrasos ($)"
                minWidth="140"
              >
              </el-table-column>
              <el-table-column
                prop="TarjetaDiaria"
                label="Tarjeta ($)"
                minWidth="130"
              >
              </el-table-column>
              <el-table-column
                prop="VelocidadPenalidad"
                label="Ex. Velocidad ($)"
                minWidth="170"
              >
              </el-table-column>
              <el-table-column
                prop="RubroPenalidad"
                label="Rubros ($)"
                minWidth="150"
              >
              </el-table-column>

              <div slot="empty"></div>
            </el-table>
          </div>
        </card>

        <!--Classic modal-->
        <modal
          :show.sync="isObservacionesTableroProduccion"
          style="z-index: 3000 !important"
          size="xl"
        >
          <template slot="header" style="background-color: #2dce89"> </template>

          <div class="barraResumen">
            <strong style="color: white; font-size: 1.2rem"
              >UNIDAD N° {{ oUnidadModalTitle }}</strong
            >

            <strong style="color: white; font-size: 1.2rem">{{
              oRutaModalTitle
            }}</strong>

            <strong style="color: white; font-size: 1.7rem"
              >{{ oPriceModalTitle }} $</strong
            >
          </div>

          <div class="topModalJustificaciones">
            <div class="containerLeftTopNavbarModal">
              <div class="navbarModal" style="margin-bottom: 0.5rem">
                <strong style="color: red">{{ oTiempoFalta }}</strong>
                <div
                  class="containerButtonMasMenos bg-gradient-default border-0"
                >
                  <input
                    v-model="oHora"
                    @keypress="menorHoras()"
                    max="24"
                    min="0"
                    type="number"
                    :disabled="oBanderaHora == 1"
                    class="inputTimer"
                    data-index="0"
                    ref="input-0"
                    @input="focusNextOncePopulated($event, 2)"
                  /><strong style="color: white">:</strong>
                  <input
                    v-model="oMinutos"
                    @keypress="menorMinutos()"
                    max="59"
                    min="0"
                    type="number"
                    :disabled="oBanderaMinutos == 1"
                    class="inputTimer"
                    data-index="1"
                    ref="input-1"
                    @input="focusNextOncePopulated($event, 2)"
                  /><strong style="color: white">:</strong>
                  <input
                    v-model="oSegundos"
                    max="59"
                    min="0"
                    type="number"
                    :disabled="oBanderaSegundos == 1"
                    class="inputTimer"
                    data-index="2"
                    ref="input-2"
                    @input="focusNextOncePopulated($event, 2)"
                  />
                </div>
              </div>

              <div class="navbarModal">
                <strong style="color: red">{{ oPriceFalta }} $</strong>
                <div
                  class="containerButtonMasMenos bg-gradient-default border-0"
                >
                  <input
                    v-model="oDolaresPena"
                    @keypress="menorDolares()"
                    :disabled="oBanderaDolares == 1"
                    min="0"
                    type="number"
                    class="inputTimer"
                  />
                  <strong style="color: white">.</strong>
                  <input
                    v-model="oCentavosPena"
                    :disabled="oBanderaCentavos == 1"
                    max="99"
                    min="0"
                    type="number"
                    class="inputTimer"
                  />
                </div>
              </div>
            </div>

            <div class="containerRigthTopNavbarModal">
              <textarea
                class="textAreaCustom"
                v-model="oMotivoString"
              ></textarea>

              <base-button
                title="Enviar Justificación"
                v-if="this.oUsuarioJustificador == null"
                class="btn-sm"
                @click="sendJustify()"
                style="height: fit-content"
                type="primary"
                ><i class="ni ni-check-bold"></i
              ></base-button>
              <base-button
                title="Cancelar Justificación"
                v-else-if="
                  this.oUsuarioJustificador != null &&
                  this.oUsuarioJustificador != ''
                "
                class="btn-sm"
                @click="deleteJustify()"
                style="height: fit-content"
                type="danger"
                ><i class="ni ni-fat-remove"></i
              ></base-button>
            </div>
          </div>
         <!-- Tabla de Anotaciones-->
         <!--<JqxGrid
            v-if="isVisibleTableroAnotaciones"
            ref="myGridDespachoPanelOtros"
            :height="'150px'"
            :columns="columnsInfoOtros"
            :source="dataAdapterOtros"
            :enabletooltips="true"
            :width="getWidth"
          >
          </JqxGrid>-->

          <el-table
              :data="mListOtros"
              row-key="id"
              class="tablePanelControlRubrosProduccion"
              header-row-class-name="thead-dark"
              height="10rem"
              style="width:100%;"
              v-if="isVisibleTableroAnotaciones"
            >
              <el-table-column prop="fecha_creacion" label="Hora" minWidth="200">
              </el-table-column>
             
              <el-table-column
                prop="descripcion"
                label="Rubro"
                minWidth="150"
              >
              </el-table-column>
              <el-table-column
                prop="anotaciones"
                label="Nota"
                minWidth="700"
              >
              </el-table-column>
              <div slot="empty">
                <span>No existe datos</span>
              </div>
            </el-table>

          <br
            v-if="isVisibleTableroAnotaciones"
          />
          
          <!--<JqxGrid
            ref="myGridDespachoPanel"
            :height="(isVisibleTableroAnotaciones ? '225px' : '350px')"
            @rowselect="myGridOnRowSelect($event)"
            :columns="columnsInfo"
            :source="dataAdapter"
            :enabletooltips="true"
            :width="getWidth"
          >
          </JqxGrid>-->

          <el-table
              :data="mList"
              highlight-current-row
              v-loading="loadingTableroJustificacion"
              element-loading-text="Cargando Datos..."
              ref="singleTable"
              row-key="id"
              @current-change="selectionChange"
              :row-class-name="tableRowClassNameJustificado"
              class="tablePanelControlRubrosProduccion"
              :style="isVisibleTableroAnotaciones != true ? 'display:none;' : ''"
              height="14rem"
              style="width:100%;"
            >
        
              <el-table-column prop="Numero" label="Número" minWidth="100">
              </el-table-column>
             
              <el-table-column
                prop="DescripcionControl"
                label="Control"
                minWidth="200"
              >
              </el-table-column>
              <el-table-column
                prop="NumeVuelSali_m"
                label="Vuelta"
                minWidth="100"
              >
              </el-table-column>
              <el-table-column
                prop="Programado"
                label="Prog"
                minWidth="90"
              >
              </el-table-column>
              <el-table-column
                prop="Marcado"
                label="Marc"
                minWidth="90"
              >
              </el-table-column>
              <el-table-column
                prop="AtrasoFTiempo"
                label="Atraso Tiempo"
                minWidth="110"
              >
              </el-table-column>
              <el-table-column
                prop="AdelantoFTiempo"
                label="Adelanto Tiempo"
                minWidth="125"
              >
              </el-table-column>
              <el-table-column
                prop="AtrasoJTiempo"
                label="Atraso Jus."
                minWidth="150"
              >
              </el-table-column>
              <el-table-column
                prop="AdelantoJTiempo"
                label="Adelanto Jus."
                minWidth="150"
              >
              </el-table-column>
              <el-table-column
                prop="RubroFalta"
                label="Rubros"
                minWidth="60"
              >
              </el-table-column>
              <el-table-column
                prop="RubroJustificacion"
                label="Rubros Jus."
                minWidth="100"
              >
              </el-table-column>
              <el-table-column
                prop="VelocidadFalta"
                label="Velo"
                minWidth="70"
              >
              </el-table-column>
              <el-table-column
                prop="VelocidadJustificacion"
                label="Velo Jus."
                minWidth="70"
              >
              </el-table-column>
              <el-table-column
                prop="TarjetaTrabajo"
                label="Tarjeta"
                minWidth="70"
              >
              </el-table-column>
              <el-table-column
                prop="NombApellUsua"
                label="Usuario Justificador"
                minWidth="250"
              >
              </el-table-column>
              <el-table-column
                prop="Motivo"
                label="Motivo"
                minWidth="250"
              >
              </el-table-column>
              <el-table-column
                prop="Notas"
                label="Notas"
                minWidth="260"
              >
              </el-table-column>
              <div slot="empty">
                <span>No existe datos</span>
              </div>
            </el-table>

          <el-table
              :data="mList"
              highlight-current-row
              ref="singleTable"
              v-loading="loadingTableroJustificacion"
              element-loading-text="Cargando Datos..."
              row-key="id"
              @current-change="selectionChange"
              :row-class-name="tableRowClassNameJustificado"
              class="tablePanelControlRubrosProduccion"
              :style="isVisibleTableroAnotaciones == true ? 'display:none;' : ''"
              height="25rem"
              style="width:100%;"
            >
        
              <el-table-column prop="Numero" label="Número" minWidth="100">
              </el-table-column>
             
              <el-table-column
                prop="DescripcionControl"
                label="Control"
                minWidth="200"
              >
              </el-table-column>
              <el-table-column
                prop="NumeVuelSali_m"
                label="Vuelta"
                minWidth="100"
              >
              </el-table-column>
              <el-table-column
                prop="Programado"
                label="Prog"
                minWidth="90"
              >
              </el-table-column>
              <el-table-column
                prop="Marcado"
                label="Marc"
                minWidth="90"
              >
              </el-table-column>
              <el-table-column
                prop="AtrasoFTiempo"
                label="Atraso Tiempo"
                minWidth="110"
              >
              </el-table-column>
              <el-table-column
                prop="AdelantoFTiempo"
                label="Adelanto Tiempo"
                minWidth="125"
              >
              </el-table-column>
              <el-table-column
                prop="AtrasoJTiempo"
                label="Atraso Jus."
                minWidth="150"
              >
              </el-table-column>
              <el-table-column
                prop="AdelantoJTiempo"
                label="Adelanto Jus."
                minWidth="150"
              >
              </el-table-column>
              <el-table-column
                prop="RubroFalta"
                label="Rubros"
                minWidth="60"
              >
              </el-table-column>
              <el-table-column
                prop="RubroJustificacion"
                label="Rubros Jus."
                minWidth="100"
              >
              </el-table-column>
              <el-table-column
                prop="VelocidadFalta"
                label="Velo"
                minWidth="70"
              >
              </el-table-column>
              <el-table-column
                prop="VelocidadJustificacion"
                label="Velo Jus."
                minWidth="70"
              >
              </el-table-column>
              <el-table-column
                prop="TarjetaTrabajo"
                label="Tarjeta"
                minWidth="70"
              >
              </el-table-column>
              <el-table-column
                prop="NombApellUsua"
                label="Usuario Justificador"
                minWidth="250"
              >
              </el-table-column>
              <el-table-column
                prop="Motivo"
                label="Motivo"
                minWidth="250"
              >
              </el-table-column>
              <el-table-column
                prop="Notas"
                label="Notas"
                minWidth="260"
              >
              </el-table-column>
              <div slot="empty">
                <span>No existe datos</span>
              </div>
            </el-table>

          <!--<template slot="footer">
            <base-button type="primary">Guardar Cambios</base-button>
            <base-button type="link" class="ml-auto" @click="modals.classic = false">Cancelar</base-button>
          </template>-->
        </modal>

        <!--Classic modal RECORRIDO-->
        <modal
          :show.sync="isRecorridoTableroProduccion"
          size="xl"
          body-classes="p-1"
          :banderaCloseMouseClickAfuera="false"
        >
          <div
            class="buttonCircleModalClose"
            @click="isRecorridoTableroProduccion = false"
          >
            X
          </div>
          <ComponenteRecorrido ref="ComponenteRecorrido"></ComponenteRecorrido>
        </modal>

        <!--Classic modal EX VELOCIDAD-->
        <modal :show.sync="isExVelocidadTableroProduccion" size="xl" body-classes="p-1">
          <template slot="header" style="background-color: #2dce89"> </template>

          <GmapMap
            map-type-id="roadmap"
            class="mapa"
            :center="oCenterTableroExVelocidad"
            :zoom="oZoomTableroExVelocidad"
            :options="{
              zoomControl: false,
              scaleControl: false,
              mapTypeControl: false,
              streetViewControl: false,
              rotateControl: false,
              fullscreenControl: false,
              disableDefaultUi: true,
            }"
          >
            <GmapPolygon
              :key="index"
              v-for="(item, index) in mListaTrazadoAllTramsExVelocidad"
              :options="{
                strokeColor: '#000000',
                fillColor: '#00000040',
                strokeOpacity: 1.0,
                strokeWeight: 2,
              }"
              :editable="false"
              :strokeOpacity="0.5"
              :strokeWeight="1"
              :paths="item.posiciones"
            />

            <GmapMarker
              v-for="marker in oHistorialExVelocidad"
              :key="marker.idHistEve"
              :position="{
                lat: parseFloat(marker.LatHistTrama),
                lng: parseFloat(marker.LongHistTrama),
              }"
              :icon="marker.icono"
              :clickable="false"
              :draggable="false"
              :optimized="true"
            />

            <!--MARCADORES CON MARCACION-->
            <GmapMarker
              v-for="(marker, index) in oHistorialExVelocidad"
              :key="index"
              :position="{
                lat: parseFloat(marker.LatHistTrama),
                lng: parseFloat(marker.LongHistTrama),
              }"
              icon="../static/img/control/control.png"
              :clickable="false"
              :draggable="false"
              :optimized="true"
              :options="{
                label: {
                  text:
                    'UNIDAD : ' +
                    marker.CodiVehiHistTrama +
                    '... VEL : ' +
                    marker.VeloHistTrama +
                    ' ... FECHA : ' +
                    marker.FechaHistTrama,
                  color: '#c70808',
                  className: 'paddingLabelTramaExVelocidad',
                },
              }"
            />
          </GmapMap>

          <!--<div class="loadingRecorridoSalidaBusquedaPanel" v-if="isLoadingRecorridoSalidaPanelBusqueda">
            <div class="circleProgress"></div>
          </div>-->

          <!--<template slot="footer">
            <base-button type="primary">Guardar Cambios</base-button>
            <base-button type="link" class="ml-auto" @click="modals.classic = false">Cancelar</base-button>
          </template>-->
        </modal>
      </div>
    </base-header>
  </div>
</template>
<script>
import recorrido from "../../components/monitoreo/recorrido.vue";
import flatPicker from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import JqxGrid from "jqwidgets-scripts/jqwidgets-vue/vue_jqxgrid.vue";
import JqxSlider from "jqwidgets-scripts/jqwidgets-vue/vue_jqxslider.vue";
import JqxDateTimeInput from "jqwidgets-scripts/jqwidgets-vue/vue_jqxdatetimeinput.vue";

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
  Button,
  DropdownMenu,
  DropdownItem,
  Dropdown,
} from "element-ui";

import RouteBreadCrumb from "@/components/argon-core/Breadcrumb/RouteBreadcrumb";
import { BasePagination } from "@/components/argon-core";
import clientPaginationMixin from "~/components/tables/PaginatedTables/clientPaginationMixin";
import swal from "sweetalert2";
import Tabs from "@/components/argon-core/Tabs/Tabs";
import TabPane from "@/components/argon-core/Tabs/Tab";

export default {
  mixins: [clientPaginationMixin],
  layout: "ProduccionDashboardLayout",
  components: {
    ComponenteRecorrido: recorrido,
    Tabs,
    TabPane,
    [Button.name]: Button,
    flatPicker,
    BasePagination,
    RouteBreadCrumb,
    JqxGrid,
    JqxSlider,
    JqxDateTimeInput,
    [Select.name]: Select,
    [Option.name]: Option,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [DatePicker.name]: DatePicker,
    [Notification.name]: Notification,
    [Autocomplete.name]: Autocomplete,
    [RadioButton.name]: RadioButton,
    [Radio.name]: Radio,
    [Dropdown.name]: Dropdown,
    [DropdownItem.name]: DropdownItem,
    [DropdownMenu.name]: DropdownMenu,
  },
  data() {
    return {
      tableDataPanelControlProduccion: [],
      selectedRows: [],
      mListPosicionesHistorialSalidasPanelBusqueda: [],
      mListPosicionesHistorialMarcSalidasPanelBusqueda: [],
      isLoadingRecorridoSalidaPanelBusqueda: false,
      mListaTrazadoAllTramsExVelocidad: [],
      token: this.$cookies.get("token"),
      fechaInicialTableroProduccion: "",
      mPagadoRPagosVehiculo: "0.00",
      mJustificadoRPagosVehiculo: "0.00",
      loadingRTableroProduccion: false,
      mListRubrosTableroProduccion: [],
      mSelectRubroValueTablero: [],
      mListLineasTableroProduccion: [],
      mSelectLineasValueTablero: [],
      mListaUnidadesPanelProduccion: [],
      loadingTableUnidadesPanelProduccoionLoading: false,
      optionsUnidadesPanelProduccion: [],
      itemUnidadPanelProduccion: [],
      isObservacionesTableroProduccion: false,
      isRecorridoTableroProduccion: false,
      isExVelocidadTableroProduccion: false,
      dataAdapter: new jqx.dataAdapter([]),
      dataAdapterOtros: new jqx.dataAdapter([]),
      getWidth: "100%",
      loadingTableroJustificacion:false,

      valida: 0,
      columnsInfo: [
        {
          text: "Numero",
          datafield: "Numero",
          width: 100,
          cellclassname: this.cellclassname,
        },
        {
          text: "Control",
          datafield: "DescripcionControl",
          width: 200,
          cellclassname: this.cellclassname,
        },
        {
          text: "Vuelta",
          datafield: "NumeVuelSali_m",
          width: 100,
          cellclassname: this.cellclassname,
        },
        {
          text: "PROG",
          datafield: "Programado",
          width: 90,
          cellclassname: this.cellclassname,
        },
        {
          text: "MARC",
          datafield: "Marcado",
          width: 90,
          cellclassname: this.cellclassname,
        },
        {
          text: "Atraso Tiempo",
          datafield: "AtrasoFTiempo",
          width: 110,
          cellclassname: this.cellclassname,
        },
        {
          text: "Adelanto Tiempo",
          datafield: "AdelantoFTiempo",
          width: 120,
          cellclassname: this.cellclassname,
        },
        {
          text: "Atraso Jus.",
          datafield: "AtrasoJTiempo",
          width: 150,
          cellclassname: this.cellclassname,
        },
        {
          text: "Adelanto Jus.",
          datafield: "AdelantoJTiempo",
          width: 150,
          cellclassname: this.cellclassname,
        },
        {
          text: "Rubros",
          datafield: "RubroFalta",
          width: 60,
          cellclassname: this.cellclassname,
        },
        {
          text: "Rubros Jus.",
          datafield: "RubroJustificacion",
          width: 100,
          cellclassname: this.cellclassname,
        },
        {
          text: "Velo",
          datafield: "VelocidadFalta",
          width: 70,
          cellclassname: this.cellclassname,
        },
        {
          text: "Velo Jus.",
          datafield: "VelocidadJustificacion",
          width: 70,
          cellclassname: this.cellclassname,
        },
        {
          text: "Tarjeta",
          datafield: "TarjetaTrabajo",
          width: 70,
          cellclassname: this.cellclassname,
        },
        {
          text: "Usuario Justificador",
          datafield: "NombApellUsua",
          width: 250,
          cellclassname: this.cellclassname,
        },
        {
          text: "Motivo",
          datafield: "Motivo",
          width: 250,
          cellclassname: this.cellclassname,
        },
        {
          text: "Notas",
          datafield: "Notas",
          width: 250,
          cellclassname: this.cellclassname,
        },
      ],
      columnsInfoOtros: [
        {
          text: "Hora",
          datafield: "fecha_creacion",
          width: 200,
          cellclassname: this.cellclassname,
        },
        {
          text: "Rubro",
          datafield: "descripcion",
          width: 150,
          cellclassname: this.cellclassname,
        },
        {
          text: "Nota",
          datafield: "anotaciones",
          width: 850,
          cellclassname: this.cellclassname,
        },
      ],
      oTiempoFalta: "00:00:00",
      oPriceFalta: "0.00",
      oHora: "00",
      oMinutos: "00",
      oSegundos: "00",
      oDolaresPena: "0",
      oCentavosPena: "00",
      oBanderaHora: 1,
      oBanderaMinutos: 1,
      oBanderaSegundos: 1,
      oBanderaDolares: 1,
      oBanderaCentavos: 1,
      oUnidadModalTitle: "",
      oRutaModalTitle: "",
      oPriceModalTitle: "0.00",
      oMotivoString: "",
      objSeleccionado: [],
      oCenterTableroExVelocidad: { lat: -1.249546, lng: -78.585376 },
      oZoomTableroExVelocidad: 7,
      oHistorialExVelocidad: [],
      oUsuarioJustificador: "",
      mListControlesSalidaPanelBusquedaDespacho: [],
      oEmpresa: null,
      mListCodigoSalidasProduccion: [],
      loadingCodigoSalidasFrecuenciasControles:false,
      isVisibleTableroAnotaciones : true,
      isRecorridoPorVueltas:true,
      mListOtros:[],
      mList:[]
    };
  },
  methods: {
    remoteMethodUnidadesPanelProduccionJustificacion(query) {
      if (query !== "") {
        this.loadingTableUnidadesPanelProduccoionLoading = true;
        setTimeout(() => {
          this.loadingTableUnidadesPanelProduccoionLoading = false;
          this.optionsUnidadesPanelProduccion =
            this.mListaUnidadesPanelProduccion.filter((item) => {
              return (
                item.CodiVehi.toLowerCase().indexOf(query.toLowerCase()) > -1
              );
            });
        }, 200);
      } else {
        this.optionsUnidadesPanelProduccion = [];
      }
    },

    tableRowClassNamePanelControlProduccion({ row, rowIndex }) {
      if (row.item_id == 32) {
        return "warning-row-panelControlProduccion";
      } else if (row.item_id == 64) {
        return "success-row-panelControlProduccion";
      }
      return "";
    },
    initFechaActualProduccionPanelControl() {
      const today = new Date();
      const fecha = new Date(today);
      fecha.setDate(fecha.getDate() - 1);
      var mes = fecha.getMonth() + 1;
      var day = fecha.getDate();
      var format =
        fecha.getFullYear() +
        "-" +
        (mes < 10 ? "0" + mes : mes) +
        "-" +
        (day < 10 ? "0" + day : day);

      this.fechaInicialTableroProduccion = format;
    },
    selectionChange(selectedRows) {
      var obj = selectedRows;
      this.objSeleccionado = obj;
      console.log("objSeleccionado");
      console.log(this.objSeleccionado);
      if (obj != null && obj != undefined) {
        if (parseInt(obj.Tipo) <= 2) {
          this.oMotivoString = obj.Motivo;
          this.oPriceFalta = "00.00";
          this.oDolaresPena = "00";
          this.oCentavosPena = "00";
          this.oUsuarioJustificador = obj.NombApellUsua;
          this.oTiempoFalta =
            obj.AtrasoFTiempo == "00:00:00"
              ? obj.AdelantoFTiempo
              : obj.AtrasoFTiempo;

          var tiempo = this.oTiempoFalta.split(":");

          this.oHora = tiempo[0];
          this.oMinutos = tiempo[1];
          this.oSegundos = tiempo[2];

          this.oBanderaHora = tiempo[0] == "00" ? 1 : 0;
          this.oBanderaMinutos = tiempo[1] == "00" ? 1 : 0;
          this.oBanderaSegundos = 0;
          this.oBanderaDolares = 1;
          this.oBanderaCentavos = 1;
        } else {
          this.oUsuarioJustificador = obj.NombApellUsua;
          this.oMotivoString = obj.Motivo;

          if (obj.RubroFalta == "0.00") {
            if (obj.TarjetaTrabajo == "0.00") {
              if (obj.VelocidadFalta == "0.00") {
                this.oPriceFalta = "0.00";
              } else {
                this.oPriceFalta = obj.VelocidadFalta;
                var dinero = this.oPriceFalta.split(".");
                if (dinero[0].length == 1) {
                  this.oDolaresPena = 0 + dinero[0];
                } else if (this.oDolaresPena > dinero[0]) {
                  this.oDolaresPena = dinero[0];
                }
                if (dinero[1].length == 1) {
                  this.oCentavosPena = 0 + dinero[1];
                } else if (this.oCentavosPena > dinero[1]) {
                  this.oCentavosPena = dinero[1];
                }
              }
            } else {
              this.oPriceFalta = obj.TarjetaTrabajo;
              var dinero = this.oPriceFalta.split(".");
              if (dinero[0].length == 1) {
                this.oDolaresPena = 0 + dinero[0];
              } else if (this.oDolaresPena > dinero[0]) {
                this.oDolaresPena = dinero[0];
              }
              if (dinero[1].length == 1) {
                this.oCentavosPena = 0 + dinero[1];
              } else if (this.oCentavosPena > dinero[1]) {
                this.oCentavosPena = dinero[1];
              }
            }
          } else {
            this.oPriceFalta = obj.RubroFalta;
            var dinero = this.oPriceFalta.split(".");
            if (dinero[0].length == 1) {
              this.oDolaresPena = 0 + dinero[0];
            } else if (this.oDolaresPena > dinero[0]) {
              this.oDolaresPena = dinero[0];
            } else {
              this.oDolaresPena = dinero[0];
            }
            if (dinero[1].length == 1) {
              this.oCentavosPena = 0 + dinero[1];
            } else if (this.oCentavosPena > dinero[1]) {
              this.oCentavosPena = dinero[1];
            }
          }
          if (this.oPriceFalta > 0) {
            this.oTiempoFalta = "00:00:00";
            var tiempo = this.oTiempoFalta.split(":");
            this.oHora = tiempo[0];
            this.oMinutos = tiempo[1];
            this.oSegundos = tiempo[2];
            this.oBanderaHora = 1;
            this.oBanderaMinutos = 1;
            this.oBanderaSegundos = 1;
          }
          this.oBanderaDolares = this.oDolaresPena == "00" ? 1 : 0;
          this.oBanderaCentavos = 0;
        }
      }
    },
    async readlPanelTableroProduccion() {
      this.mPagadoRPagosVehiculo = "0.00";
      this.mJustificadoRPagosVehiculo = "0.00";

      this.loadingRTableroProduccion = true;
      this.tableDataPanelControlProduccion = [];
      try {
        var datos = await this.$axios.post(
          process.env.baseUrl + "/ProduccionPanelControl",
          {
            token: this.token,
            fecha: this.fechaInicialTableroProduccion,
            rutas:
              this.mSelectLineasValueTablero.length <= 0
                ? "*"
                : this.mSelectLineasValueTablero,
            unidades:
              this.itemUnidadPanelProduccion.length <= 0
                ? "*"
                : this.itemUnidadPanelProduccion,
          }
        );

        //console.log(datos.data)

        if (datos.data.status_code == 200) {
          this.CalcularTotales(datos.data.datos)
          this.tableDataPanelControlProduccion.push(...datos.data.datos)
        } else {
          this.$notify({
            message: datos.data.msm,
            timeout: 3000,
            icon:
              datos.data.status_code == 300
                ? "ni ni-fat-delete"
                : "ni ni-fat-remove",
            type: datos.data.status_code == 300 ? "default" : "danger",
          });
        }
      } catch (error) {
        console.log(error);
        this.$notify({
          message: error.toString(),
          timeout: 3000,
          icon: "ni ni-fat-remove",
          type: "danger",
        });
      }

      this.loadingRTableroProduccion = false;
    },
    async CalcularTotales(datos) {
      var total = 0;
      var descuentos = 0;
      for (var i = 0; i < datos.length; i++) {
        total = total + parseFloat(datos[i].DeudaTotal);
        descuentos =
          descuentos +
          (parseFloat(datos[i].AdelantoJPenalidad) +
            parseFloat(datos[i].AtrasoJPenalidad) +
            parseFloat(datos[i].VelocidadJustificacion) +
            parseFloat(datos[i].RubroJustificacion));
      }
      this.mPagadoRPagosVehiculo = total.toFixed(2);
      this.mJustificadoRPagosVehiculo = descuentos.toFixed(2);
    },
    async readRubrosTableroProduccion() {
      this.mListRubrosTableroProduccion = [];
      try {
        var datos = await this.$axios.post(
          process.env.baseUrl + "/rubros-activos",
          {
            token: this.token,
          }
        );

        if (datos.data.status_code == 200) {
          this.mListRubrosTableroProduccion.push(...datos.data.datos);
        }
      } catch (error) {
        console.log(error);
      }
    },
    async readLineasTableroProduccion() {
      this.mListLineasTableroProduccion = [];
      try {
        var datos = await this.$axios.post(process.env.baseUrl + "/rutes", {
          token: this.token,
          tipo: 3,
        });

        if (datos.data.status_code == 200) {
          this.mListLineasTableroProduccion.push(...datos.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    },
    async readUnidadesTableroProduccion() {
      this.mListaUnidadesPanelProduccion = [];
      try {
        var datos = await this.$axios.post(process.env.baseUrl + "/unidades", {
          token: this.token,
        });

        if (datos.data.status_code == 200) {
          for (var i = 0; i < datos.data.data.length; i++) {
            var obj = datos.data.data[i];
            obj.value = obj.CodiVehi;
            this.mListaUnidadesPanelProduccion.push(obj);
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    async showVisibleModalTableroProduccion(item) {
      this.isObservacionesTableroProduccion =
        this.isObservacionesTableroProduccion == true ? false : true;
      if (this.isObservacionesTableroProduccion == true) {
        this.limpiarDatosJustificacion();
      }
      this.readDetalleTableroProduccionAnotaciones(item);
      await this.readDetalleTableroProduccion(item);
    },
    async showVisibleModalExVelocidadTableroProduccion(item) {
      this.isExVelocidadTableroProduccion =
        this.isExVelocidadTableroProduccion == true ? false : true;
      this.readHISTORIALTrazadoAllTramosTableroProduccion(item);
    },
    async showVisibleModalRecorridoTableroProduccion(item) {
      console.log(item);
      this.isRecorridoTableroProduccion =
        this.isRecorridoTableroProduccion == true ? false : true;
      this.$refs.ComponenteRecorrido.readHistorialSalidaPanelBusqueda(item);
    },
    async readDetalleTableroProduccion(item) {
      this.mList = [];
      this.loadingTableroJustificacion = true
      try {
        var datos = await this.$axios.post(
          process.env.baseUrl + "/ProduccionDetallePanelControl",
          {
            token: this.token,
            codigoPanel: item.Codigo,
          }
        );

        if (datos.data.datos.length > 0) {
          this.oUnidadModalTitle = datos.data.datos[0].Unidad;
          this.oRutaModalTitle = datos.data.datos[0].DescRuta;
          this.oPriceModalTitle = datos.data.datos[0].DeudaTotal;
        }
        this.mList.push(...datos.data.datos);
      } catch (error) {
        this.mList = [];
      }

      this.loadingTableroJustificacion = false

      //this.$refs.myGridDespachoPanel.clearselection();
      /*var obj = {
        localdata: mList,
        datatype: "array",
        datafields: [
          { name: "DescripcionControl", type: "string" },
          { name: "NumeVuelSali_m", type: "string" },
          { name: "Programado", type: "string" },
          { name: "Marcado", type: "string" },
          { name: "AtrasoFTiempo", type: "datetime" },
          { name: "AdelantoFTiempo", type: "datetime" },
          { name: "AtrasoJTiempo", type: "datetime" },
          { name: "AdelantoJTiempo", type: "datetime" },
          { name: "RubroFalta", type: "string" },
          { name: "RubroJustificacion", type: "string" },
          { name: "VelocidadFalta", type: "string" },
          { name: "VelocidadJustificacion", type: "string" },
          { name: "TarjetaTrabajo", type: "string" },
          { name: "NombApellUsua", type: "string" },
          { name: "Motivo", type: "string" },
          { name: "Notas", type: "string" },
          { name: "Tipo", type: "string" },
          { name: "Codigo", type: "string" },
          { name: "Numero", type: "string" },
        ],
      };*/

    },
    async readDetalleTableroProduccionAnotaciones(item) {
     // this.$refs.myGridDespachoPanelOtros.clearselection();
      this.mListOtros = [];
      try {
        var datos = await this.$axios.post(
          process.env.baseUrl + "/ProduccionPanelControlAnotaciones",
          {
            token: this.token,
            unidad: item.Unidad,
            fecha: this.fechaInicialTableroProduccion,
          }
        );
        

        this.mListOtros.push(...datos.data.datos);
      } catch (error) {
        console.log(error)
        this.mListOtros = [];
      }
    },
    sendJustify() {
      if (this.validarJustificacion()) {
        return;
      }
      this.registerJustificacionProduccion();
    },
    deleteJustify() {
      this.deleteJustificacionProduccion();
    },
    async registerJustificacionProduccion() {
      var dinero =
        this.objSeleccionado.Tipo == 3 || this.objSeleccionado.Tipo == 4
          ? this.oDolaresPena + "." + this.oCentavosPena
          : "0.00";
      var tiempo =
        this.objSeleccionado.Tipo == 1 || this.objSeleccionado.Tipo == 2
          ? this.oHora + ":" + this.oMinutos + ":" + this.oSegundos
          : "00:00:00";

      var objBody = {
        token: this.token,
        numero: this.objSeleccionado.Numero,
        codigo: this.objSeleccionado.Codigo,
        tipo: this.objSeleccionado.Tipo,
        minutos: tiempo,
        dinero: parseFloat(dinero),
        motivo: this.oMotivoString,
      };

      try {
        var datos = await this.$axios.post(
          process.env.baseUrl + "/registroJustificacionProduccion",
          objBody
        );

        if (datos.data.status_code == 200) {
          this.readDetalleTableroProduccion(this.objSeleccionado);
          this.readlPanelTableroProduccion();
          this.limpiarDatosJustificacion();
          /*this.$notify({
            message: datos.data.mensaje,
            timeout: 3000,
            icon: 'ni ni-check-bold',
            type: 'default'
          });*/
        } else if (datos.data.status_code == 300) {
          this.$notify({
            message: datos.data.mensaje,
            timeout: 3000,
            icon: "ni ni-fat-delete",
            type: "warning",
          });
        } else if (datos.data.status_code == 400) {
          this.$notify({
            message: datos.data.mensaje,
            timeout: 3000,
            icon: "ni ni-fat-delete",
            type: "warning",
          });
        } else if (datos.data.status_code == 500) {
          this.$notify({
            message: datos.data.mensaje,
            timeout: 3000,
            icon: "ni ni-fat-remove",
            type: "warning",
          });
        }
      } catch (error) {
        console.log(error);
        this.$notify({
          message: error.toString(),
          timeout: 3000,
          icon: "ni ni-fat-remove",
          type: "danger",
        });
      }
    },
    async deleteJustificacionProduccion() {
      var objBody = {
        token: this.token,
        numero: this.objSeleccionado.Numero,
        codigo: this.objSeleccionado.Codigo,
        tipo: this.objSeleccionado.Tipo,
      };

      try {
        var datos = await this.$axios.delete(
          process.env.baseUrl + "/deleteJustificacionProduccion",
          { data: objBody }
        );

        if (datos.data.status_code == 200) {
          this.readDetalleTableroProduccion(this.objSeleccionado);
          this.readlPanelTableroProduccion();
          this.limpiarDatosJustificacion();

          /*this.$notify({
            message: datos.data.mensaje,
            timeout: 1500,
            icon: 'ni ni-check-bold',
            type: 'default'
          });*/
        } else {
          this.$notify({
            message: datos.data.mensaje,
            timeout: 3000,
            icon: "ni ni-fat-delete",
            type: "warning",
          });
        }
      } catch (error) {
        console.log(error);
        this.$notify({
          message: error.toString(),
          timeout: 3000,
          icon: "ni ni-fat-remove",
          type: "danger",
        });
      }
    },
    focusNextOncePopulated(event, max) {
      if (event.target.value.length === max) {
        const nextElement =
          this.$refs?.[`input-${Number(event.target.dataset.index) + 1}`];
        if (nextElement) nextElement.focus();
      }
    },
    limpiarDatosJustificacion() {
      this.oPriceFalta = "0.00";
      this.oHora = "00";
      this.oMinutos = "00";
      this.oSegundos = "00";
      this.oDolaresPena = "00";
      this.oCentavosPena = "00";
      this.oTiempoFalta = "00:00:00";
      this.oMotivoString = "";
      this.oBanderaHora = 1;
      this.oBanderaMinutos = 1;
      this.oBanderaSegundos = 1;
      this.oBanderaDolares = 1;
      this.oBanderaCentavos = 1;
      this.oUsuarioJustificador = "";
    },
    menorDolares() {
      setTimeout(() => {
        var dinero = this.oPriceFalta.split(".");
        if (this.oDolaresPena.length == 1) {
          if (this.oDolaresPena < 10) {
            return (this.oDolaresPena = 0 + this.oDolaresPena);
          }
        } else if (this.oDolaresPena > dinero[0]) {
          return (this.oDolaresPena = dinero[0]);
        }
        if (this.oDolaresPena < 0) {
          return (this.oDolaresPena = "00");
        }
      }, 1000);
    },
    menorHoras() {
      setTimeout(() => {
        var tiempo = this.oTiempoFalta.split(":");
        if (this.oHora.length == 1) {
          if (this.oHora < 10) {
            return (this.oHora = 0 + this.oHora);
          }
        } else if (this.oHora > tiempo[0]) {
          return (this.oHora = tiempo[0]);
        }
        if (this.oHora < 0) {
          return (this.oHora = "00");
        }
      }, 1000);
    },
    menorMinutos() {
      setTimeout(() => {
        var tiempo = this.oTiempoFalta.split(":");
        if (this.oMinutos.length == 1) {
          if (this.oMinutos < 10) {
            return (this.oMinutos = 0 + this.oMinutos);
          }
        } else if (this.oMinutos > tiempo[1]) {
          return (this.oMinutos = tiempo[1]);
        }
        if (this.oMinutos < 0) {
          return (this.oMinutos = "00");
        }
      }, 1000);
    },
    validarJustificacion() {
      this.valida = 0;
      var tiempoF = this.oTiempoFalta.split(":");
      var dineroP = this.oPriceFalta.split(".");
      var tiempo = this.oHora + ":" + this.oMinutos + ":" + this.oSegundos;
      var dinero = this.oDolaresPena + "." + this.oCentavosPena;
      if (
        tiempo > this.oTiempoFalta ||
        this.oHora > tiempoF[0] ||
        this.oMinutos > tiempoF[1]
      ) {
        this.valida = 1;
        this.$notify({
          message: "El tiempo a justificar es mayor al tiempo de falta",
          timeout: 3000,
          icon: "ni ni-fat-delete",
          type: "danger",
        });
      }
      if (this.oHora < 0 || this.oMinutos < 0 || this.oSegundos < 0) {
        this.valida = 1;
        this.$notify({
          message: "El tiempo a justificar no puede ser negativo",
          timeout: 3000,
          icon: "ni ni-fat-delete",
          type: "danger",
        });
      }
      if (dinero > this.oPriceFalta || this.oDolaresPena > dineroP[0]) {
        this.valida = 1;
        this.$notify({
          message: "El dinero a cobrar no puede ser mayor al de la penalidad",
          timeout: 3000,
          icon: "ni ni-fat-delete",
          type: "danger",
        });
      }
      if (dinero < 0 || this.oDolaresPena < 0 || this.oCentavosPena < 0) {
        this.valida = 1;
        this.$notify({
          message: "El dinero a cobrar no puede ser mayor al de la penalidad",
          timeout: 3000,
          icon: "ni ni-fat-delete",
          type: "danger",
        });
      }
      return this.valida;
    },
    tableRowClassNameJustificado({row}) {
      if (row.NombApellUsua != null) {
        return "estadoJustificado";
      }else{
        return ""
      }
    },
    async oClickDropdownSalidasCodigo(item) 
    {
      this.loadingCodigoSalidasFrecuenciasControles = true
      this.mListCodigoSalidasProduccion = [];
      try {
        var datos = await this.$axios.post(
          process.env.baseUrl + "/CodigoSalidasProduccion",
          {
            token: this.token,
            codigoItem: item.Codigo,
            unidad: item.Unidad,
          }
        );

        if (datos.data.status_code == 200) {
          console.log(datos.data.datos);
          this.mListCodigoSalidasProduccion.push(...datos.data.datos);
        }
      } catch (error) {
        console.log(error);
      }
      this.loadingCodigoSalidasFrecuenciasControles = false
    },

    async readHISTORIALTrazadoAllTramosTableroProduccion(item) {
      this.oCenterTableroExVelocidad = { lat: -1.249546, lng: -78.585376 }
      this.oZoomTableroExVelocidad = 7
      this.oHistorialExVelocidad = []
      try {
        var obj = {
          token: this.token,
          codigoDM: item.Codigo,
          unidad: item.Unidad
        }
        console.log(obj)
        var datos = await this.$axios.post(process.env.baseUrl + "/readTrazadoHistorialExVelocidad", obj)
        if (datos.data.status_code == 200) {
          var mList = []
          for (var i = 0; i < datos.data.datos.length; i++) {
            var obj = datos.data.datos[i]
            obj.icono = {
              path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
              fillColor: "red",
              fillOpacity: 1,
              strokeWeight: 0,
              rotation: obj.RumbHistEven,
              scale: 3,
              anchor: new google.maps.Point(0, 0),
            }
            mList.push(obj)
          }
          if (mList.length > 0) {
            this.oCenterTableroExVelocidad = {
              lat: parseFloat(mList[0].LatHistTrama),
              lng: parseFloat(mList[0].LongHistTrama)
            }
            this.oZoomTableroExVelocidad = 16
          }
          this.oHistorialExVelocidad.push(...mList)
        } else {
        }
      } catch (e) {
        console.log(e)
      }
    },

    async readTrazadoAllTramosTableroProduccion() {
      this.mListaTrazadoAllTramsExVelocidad = []
      try {
        var datos = await this.$axios.post(process.env.baseUrl + "/readAllTrazadoTramosExVelocidad", {
          token: this.token
        })
        if (datos.data.status_code == 200) {
          this.mListaTrazadoAllTramsExVelocidad = datos.data.datos
        }
      } catch (e) {
        console.log(e)
      }
    },
  },
  mounted() {
    this.oEmpresa = this.$cookies.get("empresa");
    if(this.oEmpresa == '28septiembre' || this.oEmpresa == 'smiguel')
    {
      //trabaja por vueltas
      this.isVisibleTableroAnotaciones = true
    }else{
      this.isVisibleTableroAnotaciones = false
    }

    if(this.oEmpresa == '28septiembre' || this.oEmpresa == 'smiguel' 
          || this.oEmpresa == 'tatahualpa' || this.oEmpresa == 'cazul'
          || this.oEmpresa == 'cotopaxi')
    {
      //trabaja por vueltas
      this.isRecorridoPorVueltas = true
    }else{
      this.isRecorridoPorVueltas = false
    }

    this.readTrazadoAllTramosTableroProduccion()
    this.readTrazadoAllTramosTableroProduccion()
    this.readUnidadesTableroProduccion();
    this.readLineasTableroProduccion();
    this.readRubrosTableroProduccion();
    this.initFechaActualProduccionPanelControl();
    this.readlPanelTableroProduccion();
  },
};
</script>
<style>
.buttonCircleModalClose {
  height: 40px;
  width: 40px;
  background-color: #172b4d;
  position: absolute;
  top: -1rem;
  right: -1rem;
  float: left;
  z-index: 99;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  cursor: pointer;
  font-weight: 900;
}

.mapa {
  width: 100%;
  height: calc(80vh);
}

.inputTimer {
  width: 1.8rem !important;
  background-color: white;
  color: black;
  border-width: 0rem;
  padding-right: 5px !important;
  padding-left: 5px !important;
  border-radius: 0.5rem;
}

.barraResumen {
  width: 100%;
  height: 3rem;
  background-color: #2dce89;
  border-radius: 0.5rem;
  border-style: solid;
  border-width: 0rem;
  margin-bottom: 00.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 10px;
  padding-left: 10px;
}

.textAreaCustom {
  resize: none;
  width: 100%;
  margin-right: 00.5rem;
  outline: none;
}

.textWhite {
  color: white;
}

.containerRigthTopNavbarModal {
  display: flex;
  background-color: #2dce89;
  padding: 10px;
  width: 75%;
  align-items: center;
}

.containerLeftTopNavbarModal {
  display: flex;
  flex-direction: column;
  width: 25%;
  margin-right: 2rem;
  justify-content: center;
}

.navbarModal {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
}

.danger {
  background-color: #f5365c !important;
}

.containerButtonMasMenos {
  background-color: #ffffff;
  padding-left: 6px;
  padding-right: 6px;
  padding-top: 4px;
  padding-bottom: 4px;
  border-radius: 0.5rem;
}

.circleButtonMasMenos {
  color: white;
  background-color: #5e72e4;
  height: 1.5rem;
  width: 1.5rem;
  padding-left: 4px;
  border-radius: 100%;
  border-width: 0rem;
  border-style: solid;
}

.topModalJustificaciones {
  display: flex;
  flex-direction: row;
  margin-bottom: 0.5rem;
  max-height: 5rem;
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

.card-bodyRPagosVehiculoProduccionPCTablero {
  padding: 0rem !important;
  height: calc(100vh - 12rem);
  overflow: auto;
}

.el-table__body tr.current-row> td{
  background-color: rgb(220, 220, 220)! important;
  color: #000;
}

.card-bodyTopOpcionesRPagosVehiculoPRoduccion {
  padding-top: 0.25rem !important;
}

.el-table .estadoJustificado {
  background: rgba(140, 248, 126, 0.384) !important;
}

</style>
