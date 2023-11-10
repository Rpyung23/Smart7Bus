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
            title="SALIDAS ANULADAS"
            size="sm"
            @click="showModalDespachoSalidasAnuladas()"
          >
            <span class="btn-inner--icon"
              ><i class="ni ni-single-copy-04"></i
            ></span>
          </base-button>

          <el-date-picker
            type="date"
            placeholder="Select date and time"
            style="margin-right: 0.5rem; width: 10rem"
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
            type="danger"
            size="sm"
            @click="showModalAnularTodo()"
          >
            <span class="btn-inner--icon"
              ><i class="ni ni-scissors"></i> ANULA TODO</span
            >
          </base-button>

          <base-button
            icon
            type="warning"
            size="sm"
            @click="showModalFinalizarTodo()"
          >
            <span class="btn-inner--icon"
              ><i class="ni ni-fat-delete"></i> FINALIZA TODO</span
            >
          </base-button>

          <base-button
            icon
            type="info"
            size="sm"
            @click="showModalDespachoRecalificarTodoSalida()"
          >
            <span class="btn-inner--icon"
              ><i class="ni ni-watch-time"></i> RECALIFICA TODO</span
            >
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

          <!--<base-button
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

          -->
        </div>
      </card>

      <card
        class="no-border-card col"
        style="margin-bottom: 0.5rem"
        body-classes="px-0 pb-1 card-bodyTopOpcionesRPagosVehiculoPRoduccion cardSelectRubrosEstadosPagosVehiculoProduccionContainer"
        footer-classes="pb-2"
      >
        <div class="cardTiposDespachosPanelDespacho2">
          <el-checkbox-group v-model="radioEstadoRSalidasPanelDespacho">
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

          <base-button icon type="link" size="sm" disabled>
            <span class="btn-inner--icon"
              ><i
                class="ni ni-collection"
                style="color: white; cursor: none"
              ></i
            ></span>
          </base-button>
        </div>

        <div class="buttonsAdicionalesDespacho2">
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
              this.selectRowEstado != '' "
              
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
              this.selectRowEstado != '' &&
              this.isTarjetaAntActPos == false
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
            type="primary"
            v-show="
              this.selectRowId != null &&
              this.selectRowId != '' &&
              this.selectRowEstado != '' &&
              this.isTarjetaAntActPos
            "
            @click="showReporteLlegadaSAlida()"
            size="sm"
            title="VER TARJETAS"
          >
            <span class="btn-inner--icon"
              ><i class="ni ni-collection"></i
            ></span>
          </base-button>

          <!--<base-button
            icon
            type="default"
            title="Reemplazo"
            v-show="
              this.selectRowId != null &&
              this.selectRowId != '' &&
              this.selectRowEstado != '' &&
              this.selectRowEstado == 'DIFERIDO'
            "
            size="sm"
            @click=""
          >
            <span class="btn-inner--icon"><i class="ni ni-bus-front-12"></i></span>
          </base-button>-->
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

          <!--<JqxMenu
            ref="myMenu"
            @itemclick="myMenuOnItemClick($event)"
            :width="200"
            :height="150"
            :mode="'popup'"
            :autoOpenPopup="false"
          >
            <ul>
              <li>Retirar unidad</li>
              <li>Reemplazar unidad</li>
              <li>Ingresar unidad</li>
              <li>Modificar Intervalos</li>
              <li>Cambiar frecuencia</li>
            </ul>
          </JqxMenu>-->

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
      <div class="row" style="margin-bottom: 1rem">
        <div class="col-md-12">
          <el-radio-group
            v-model="radioTipoDespacho"
            style="display: flex; justify-content: center"
          >
            <el-radio :label="2">Salida Diferida</el-radio>
            <el-radio :label="1">Salida Normal.</el-radio>
            <el-radio :label="3">Generar Tarjeta</el-radio>
          </el-radio-group>
        </div>
      </div>

      <div class="row" style="margin-bottom: 0.5rem">
        <div class="col-md-12">
          <base-input
            class="inputDatimeDespachoPanel2"
            type="datetime-local"
            v-model="fechaActualSalidasPanelDespachoDespachador"
            format="yyyy-MM-dd HH:mm:00"
          ></base-input>
          <!--<el-date-picker
            type="datetime"
            class="dateTimeDespacho"
            placeholder="Fecha Despacho"
            style="width: 100%;"
            v-model="fechaActualSalidasPanelDespachoDespachador"
            format="yyyy-MM-dd HH:mm:00"
          >
          </el-date-picker>-->
        </div>
      </div>

      <div class="row" style="margin-bottom: 0.3rem">
        <div class="col-md-12">
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
      <h6 slot="header" class="modal-title">
        Recalificar Salida
        {{
          selectedRowSalida == null
            ? ""
            : selectedRowSalida.HoraLlegProgSali_mF +
              " (" +
              selectedRowSalida.CodiVehiSali_m +
              ")"
        }}
      </h6>

      <div class="container-modal-recalifica">
        <div class="container-div-check-recalifica">
          <el-checkbox
            style="width: auto"
            label="USAR POSICIONES"
            v-model="RecaTarjUsaPosi"
            border
          ></el-checkbox>
          <el-checkbox
            style="width: auto"
            v-model="RecaSobrCtrlMarcClie"
            label="REESCRIBE CONTROL (MRC)"
            border
          ></el-checkbox>
        </div>

        <div class="container-div-range-minutos">
          <base-input
            type="number"
            v-model="RecaTarjRangInic"
            label="Min. Antes"
          ></base-input>
          <base-input
            type="number"
            v-model="RecaTarjRangFin"
            label="Min. Despues"
          ></base-input>
          <div class="btn-update-tiempo-a-d">
            <base-button
              icon
              type="default"
              title="GUARDAR CAMBIOS"
              size="sm"
              @click="updateTiempoRecalTarjeta()"
            >
              <span class="btn-inner--icon"
                ><i class="ni ni-check-bold"></i
              ></span>
            </base-button>
          </div>
        </div>
      </div>

      <template slot="footer">
        <base-button type="info" @click="RecaTarjeta()"
          >RECALIFICAR</base-button
        >
      </template>
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

    <!-- MODAL ANULAR DESPACHO TODO -->

    <!--Form modal Despacho Anular Salida-->
    <modal :show.sync="modalDespachoAnularSalidaTodo" body-classes="p-0">
      <h6 slot="header" class="modal-title">ANULAR TODAS LAS SALIDAS</h6>

      <div class="row" style="margin-right: 1rem; margin-left: 1rem">
        <div class="col-md-6">
          <el-select
            v-model="itemUnidadSalidaAnularFinalizar"
            multiple
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
              :value="item.CodiVehi"
            >
            </el-option>
          </el-select>
        </div>

        <div class="col-md-6">
          <base-input
            addon-left-icon="ni ni-calendar-grid-58"
            style="margin-right: 0.5rem"
            class="input_date_anular_despacho_todo"
          >
            <flat-picker
              slot-scope="{ focus, blur }"
              :min="{ fechaActualAnularFinalizarTodo }"
              @on-open="focus"
              @on-close="blur"
              :config="config_flatpicker"
              class="form-controlPersonal datepicker"
              v-model="fechaActualAnularFinalizarTodo"
            >
            </flat-picker>
          </base-input>
        </div>
      </div>

      <div
        class="row"
        style="margin-bottom: 1.5rem; margin-right: 1rem; margin-left: 1rem"
      >
        <div class="col-md-12">
          <el-select
            v-model="mSelectRutaAnularFinalizarTodo"
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

      <div
        class="row"
        style="margin-bottom: 0.5rem; justify-content: center; width: 100%"
      >
        <base-checkbox
          class="col-md-3"
          v-model="mCheckDiferidaFinalizarAnulado"
          style="margin-right: 0.5rem"
        >
          DIFERIDAS
        </base-checkbox>
        <base-checkbox
          class="col-md-3"
          v-model="mCheckEnRutaFinalizarAnulado"
          style="margin-right: 0.5rem"
        >
          EN RUTA
        </base-checkbox>
        <base-checkbox
          class="col-md-3"
          v-model="mCheckFinalizadaFinalizarAnulado"
        >
          FINALIZADAS
        </base-checkbox>
      </div>

      <template slot="footer">
        <base-button
          type="danger"
          @click="sendFinalizarAnularAllSalidas(4, 'CANCELAR')"
          >ANULAR SALIDAS</base-button
        >
      </template>
    </modal>

    <!--Form modal Despacho FINALIZAR TODO Salida-->
    <modal :show.sync="modalDespachoFinalizarSalidaTodo" body-classes="p-0">
      <h6 slot="header" class="modal-title">FINALIZAR TODAS LAS SALIDAS</h6>

      <div class="row" style="margin-right: 1rem; margin-left: 1rem">
        <div class="col-md-6">
          <el-select
            v-model="itemUnidadSalidaAnularFinalizar"
            multiple
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
              :value="item.CodiVehi"
            >
            </el-option>
          </el-select>
        </div>

        <div class="col-md-6">
          <base-input
            addon-left-icon="ni ni-calendar-grid-58"
            style="margin-right: 0.5rem"
            class="input_date_anular_despacho_todo"
          >
            <flat-picker
              slot-scope="{ focus, blur }"
              :min="{ fechaActualAnularFinalizarTodo }"
              @on-open="focus"
              @on-close="blur"
              :config="config_flatpicker"
              class="form-controlPersonal datepicker"
              v-model="fechaActualAnularFinalizarTodo"
            >
            </flat-picker>
          </base-input>
        </div>
      </div>

      <div
        class="row"
        style="margin-bottom: 1.5rem; margin-right: 1rem; margin-left: 1rem"
      >
        <div class="col-md-12">
          <el-select
            v-model="mSelectRutaAnularFinalizarTodo"
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

      <div
        class="row"
        style="margin-bottom: 0.5rem; justify-content: center; width: 100%"
      >
        <base-checkbox
          class="col-md-3"
          v-model="mCheckDiferidaFinalizarAnulado"
          style="margin-right: 0.5rem"
        >
          DIFERIDAS
        </base-checkbox>
        <base-checkbox
          class="col-md-3"
          v-model="mCheckEnRutaFinalizarAnulado"
          style="margin-right: 0.5rem"
        >
          EN RUTA
        </base-checkbox>
        <base-checkbox
          class="col-md-3"
          v-model="mCheckFinalizadaFinalizarAnulado"
        >
          FINALIZADAS
        </base-checkbox>
      </div>

      <template slot="footer">
        <base-button
          type="warning"
          @click="sendFinalizarAnularAllSalidas(3, 'FINALIZAR')"
          >FINALIZAR SALIDAS</base-button
        >
      </template>
    </modal>

    <!--Form modal Despacho RECALIFICAR TODO Salida-->
    <modal :show.sync="modalDespachoRecalificarTodoSalida" body-classes="p-0">
      <h6 slot="header" class="modal-title">RECALIFICAR TODO</h6>

      <div class="container-modal-recalifica">
        <div class="container-div-check-recalifica">
          <el-checkbox
            style="width: auto"
            label="USAR POSICIONES"
            v-model="RecaTarjUsaPosi"
            border
          ></el-checkbox>
          <el-checkbox
            style="width: auto"
            v-model="RecaSobrCtrlMarcClie"
            label="REESCRIBE CONTROL (MRC)"
            border
          ></el-checkbox>
        </div>

        <div class="container-div-range-minutos">
          <base-input
            type="number"
            v-model="RecaTarjRangInic"
            label="Min. Antes"
          ></base-input>
          <base-input
            type="number"
            v-model="RecaTarjRangFin"
            label="Min. Despues"
          ></base-input>
          <div class="btn-update-tiempo-a-d">
            <base-button
              icon
              type="default"
              title="GUARDAR CAMBIOS"
              size="sm"
              @click="updateTiempoRecalTarjeta()"
            >
              <span class="btn-inner--icon"
                ><i class="ni ni-check-bold"></i
              ></span>
            </base-button>
          </div>
        </div>

        <!--<div class="container-div-check-recalifica">
          <el-checkbox
            style="width: 100%"
            label="EN RUTA"
            v-model="EnRutaRecalificaTodo"
            border
          ></el-checkbox>
          <el-checkbox
            style="width: 100%"
            v-model="FinalizadaRecalificaTodo"
            label="FINALIZADAS"
            border
          ></el-checkbox>
        </div>-->

        <div class="row">
          <div class="col-md-6">
            <el-select
              v-model="itemUnidadSalidaRecalificarTodo"
              multiple
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
                :value="item.CodiVehi"
              >
              </el-option>
            </el-select>
          </div>

          <div class="col-md-6">
            <base-input
              addon-left-icon="ni ni-calendar-grid-58"
              style="margin-right: 0.5rem"
              class="input_date_anular_despacho_todo"
            >
              <flat-picker
                slot-scope="{ focus, blur }"
                @on-open="focus"
                @on-close="blur"
                :config="config_flatpicker"
                class="form-controlPersonal datepicker"
                v-model="fechaActualAnularFinalizarTodo"
              >
              </flat-picker>
            </base-input>
          </div>
        </div>

        <div class="row" style="margin-bottom: 1.5rem">
          <div class="col-md-12">
            <el-select
              v-model="mSelectRutaRecalificarTodo"
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
      </div>

      <template slot="footer">
        <base-button type="info" @click="RecaTarjetaTodo()"
          >RECALIFICAR</base-button
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
  CheckboxGroup,
  MessageBox,
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
      reponseAnularFinalizar: null,
      minutosSalidaDiferida: 0,
      columnsInfo: [],
      imagenBaseUrl: "",
      getWidth: "100%",
      dataAdapter: new jqx.dataAdapter([]),
      token: this.$cookies.get("token"),
      mListRutasDespacho: [],
      mListControlesPorRuta: [],
      mListDespachosPanelDespacho: [],
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
      radioTipoDespacho: 2,
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

      modalDespachoAnularSalidaTodo: false,
      modalDespachoFinalizarSalidaTodo: false,

      fechaActualAnularFinalizarTodo: null,
      itemUnidadSalidaAnularFinalizar: null,
      mSelectRutaAnularFinalizarTodo: null,
      mCheckDiferidaFinalizarAnulado: false,
      mCheckEnRutaFinalizarAnulado: false,
      mCheckFinalizadaFinalizarAnulado: false,
      radioEstadoRSalidasPanelDespacho: [],

      objConfigRecalificar: null,
      RecaTarjRangInic: 0,
      RecaTarjRangFin: 0,

      RecaTarjUsaPosi: false,
      RecaSobrCtrlMarcClie: false,

      modalDespachoRecalificarTodoSalida: false,

      isBtnTodo: false,

      itemUnidadSalidaRecalificarTodo: null,
      mSelectRutaRecalificarTodo: null,

      isTarjetaAntActPos: false, 
    };
  },
  methods: {
    myGridOnRowSelect: function (event) {
      this.ArrowGridSelect = event.args.rowindex;
      this.selectedRowSalida = event.args.row;

      this.selectedRowSalida.idSali_m = this.selectedRowSalida.idSali_m;
      this.selectRowId = this.selectedRowSalida.idSali_m;
      this.selectRowEstado = this.selectedRowSalida.EstaSali_m;
      /*console.log("EstaSali_m");
      console.log(this.selectRowEstado);*/
    },
    showReporteLlegadaSAlida() {
      this.modalSalidasTarjetaPanelDespacho = true;

      var idSalidaAnt =
        this.$refs.myGridDespachoPanel.source.localdata[
          this.ArrowGridSelect - 1
        ];

      var idSalidaPost =
        this.$refs.myGridDespachoPanel.source.localdata[
          this.ArrowGridSelect + 1
        ]

      if (this.isTarjetaAntActPos) {
        this.$refs.ComponenteTarjeta.readDetalleSalidaDPanelBusquedaAntActPos([
          idSalidaAnt,
          this.selectedRowSalida,
          idSalidaPost,
        ]);
      } else {
        this.$refs.ComponenteTarjeta.readDetalleSalidaDPanelBusqueda(
          this.selectedRowSalida
        );
      }
    },
    showRecorridoSalidaPanelDespacho() {
      /*console.log("******************************************************");
      console.log(this.selectedRowSalida);
      console.log("******************************************************");*/
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
      try {
        for (var i = 0; this.mListRutasFrecuencias.length; i++) {
          if (idFreceucnia == this.mListRutasFrecuencias[i].idFrec) {
            return this.mListRutasFrecuencias[i];
          }
        }
      } catch (e) {
        console.log(e);
      }
      return null;
    },
    showModalDespacho() 
    {
      this.mSelectRutaSalidaDespachar = null
      this.mSelectRutaFrecuenciaPanelDespacho = null

      this.modalEnviarDespachoPanel
        ? (this.modalEnviarDespachoPanel = false)
        : (this.modalEnviarDespachoPanel = true);
    },
    async showModalDespachoRecalificarSalida() {
      

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

      //console.log(datos.data);
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
      //console.log(format);
      this.fechaActualSalidasPanelDespacho =
        format + " " + hora + ":" + minutes + ":00";
      this.fechaActualSalidasPanelDespachoDespachador =
        format + " " + hora + ":" + minutes + ":00";
      this.fechaActualAnularFinalizarTodo =
        format + " " + hora + ":" + minutes + ":00";
      //this.config_flatpicker.minDate = this.fechaActualAnularFinalizarTodo;
    },
    myGridOnContextMenu: function () {
      return false;
    },
    myGridOnRowClick: function (event) {
      /*if (event.args.rightclick) {
        this.$refs.myGridDespachoPanel.selectrow(event.args.rowindex);
        let scrollTop = window.scrollY;
        let scrollLeft = window.scrollX;
        this.$refs.myMenu.open(
          parseInt(event.args.originalEvent.clientX) + 5 + scrollLeft,
          parseInt(event.args.originalEvent.clientY) + 5 + scrollTop
        );
        return false;
      }*/
    },
    myMenuOnItemClick: function (event) {
      console.log("myMenuOnItemClick");
      try {
        let args = event.args;
        let rowindex = this.$refs.myGridDespachoPanel.getselectedrowindex();
        let dataRecord = this.$refs.myGridDespachoPanel.getrowdata(rowindex);

        if (args.innerHTML == "Reemplazar unidad") {
          alert("REEMPLAZADO UNIDAD");
        } else {
          alert("OPCION AUN EN DESARROLLO.....");
        }

        console.log(dataRecord);
      } catch (error) {
        console.log(error);
      }
    },
    getRutaPorID(idRuta) {
      for (var i = 0; this.mListRutasDespacho.length; i++) {
        if (this.mListRutasDespacho[i].idRuta == idRuta) {
          return this.mListRutasDespacho[i];
        }
      }

      return null
    },
    getStringUnidad(unidades) {
      var string_unidad = "";
      for (var i = 0; i < unidades.length; i++) {
        // console.log("i = " + i);
        for (
          var j = 0;
          j < this.mListaUnidadesSalidasPanelDespacho.length;
          j++
        ) {
          //console.log("j = " + j);
          /**console.log(
            unidades[i].CodiVehi +
              " == " +
              this.mListaUnidadesSalidasPanelDespacho[j].CodiVehi
          );*/
          if (
            unidades[i].CodiVehi ==
            this.mListaUnidadesSalidasPanelDespacho[j].CodiVehi
          ) {
            string_unidad = string_unidad + unidades[i].CodiVehi + " , ";
          }
        }
      }

      return string_unidad;
    },
    async createHeaderTable() {
      this.isBtnTodo = false;
      //this.selectedRowSalida = null;
      this.selectRowId = null;
      //this.$refs.myGridDespachoPanel.clearSelection();
      if (this.ArrowGridSelect != null) {
        this.$refs.myGridDespachoPanel.unselectrow(this.ArrowGridSelect);
      }

      var oRuta = this.getRutaPorID(this.mSelectRutaSalidaPanelDespacho);
      this.readDespachoSalidasAnuladas();
      /*console.log("*****************************************")
      console.log(this.radioEstadoRSalidasPanelDespacho)*/

      try {
        this.mListDespachosPanelDespacho = [];
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
            tipo:
              this.radioEstadoRSalidasPanelDespacho.length <= 0
                ? "*"
                : this.radioEstadoRSalidasPanelDespacho,
          }
        )
        console.log("------------------------------")
        console.log(datos.data.datos)
        this.mListDespachosPanelDespacho = datos.data.datos
        this.mListDespachosPanelAuxiliar = this.mListDespachosPanelDespacho
        if (this.mListDespachosPanelDespacho.length > 0) {
          this.isBtnTodo = true;
        }
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
          datafield: "nombres_chofer",
          width: 250,
          cellsalign: "left",
          cellclassname: this.cellclassname,
          cellbeginedit: this.cellbeginedit,
        };

        this.$refs.myGridDespachoPanel.setOptions({
          source: this.createBodyDespacho(this.mListDespachosPanelAuxiliar),
          columns: this.columnsInfo,
        });
        this.isLoadingDespachoSalidaPanelBusqueda = false;
        this.$refs.myGridDespachoPanel.endupdate()
      } catch (error) {
        console.log("*********************************** ERROR TRY");
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
          //this.mSelectRutaSalidaDespachar = datos.data.data[0].idRuta;
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
        for (var minuto = 0; minuto <= 59; minuto++) {
          minutosString = minuto < 10 ? "0" + minuto : minuto;
          var HS = tiempoString + ":" + minutosString + ":" + secondString;
          var HSa_ =
            tiempoString + ":" + minutosString + ":" + secondString + " (A)";
          var obj = this.getObjetoSalidaDespacho(HS, HSa_);
          var objD =
            obj == null
              ? {
                  LetraRutaSali_m: "",
                  CodiVehiSali_m: "",
                  idSali_m: "",
                  HoraSaliProgSali_m: HS,
                  HoraLlegProgSali_m: "",
                  HoraSaliProgSali_mF: "",
                  HoraLlegProgSali_mF: "",
                  EstaSali_m: "",
                  idFrecSali_m: "",
                  DescFrec: "",
                  PenaCtrlSali_d: "",
                  VeloMaxiSali_m: "",
                  NumeVuelSali_m: "",
                  atrasoFaltasTime: "",
                  adelantoFaltasTime: "",
                  nombres_chofer: "",
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
      /*console.log("LISTA CCCCCCC");
      console.log(ListaCompleta);*/
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
          { name: "nombres_chofer", type: "string" },
          { name: "HoraSaliProgSali_mF", type: "string" },
          { name: "HoraLlegProgSali_mF", type: "string" },
        ],
      };
    },
    getObjetoSalidaDespacho(tiempo, tiempoA) {
      //console.log("TAMANIO : "+this.mListDespachosPanelAuxiliar.length )
      if (this.mListDespachosPanelAuxiliar.length > 0) {
        for (var i = 0; i < this.mListDespachosPanelAuxiliar.length; i++) {
          //console.log(tiempo +" == "+ this.mListDespachosPanelAuxiliar[i].HoraSaliProgSali_m)
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
          //console.log(obj);
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
        //console.log(column);
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
    clearModalDespacho() {
      this.itemUnidadSalidasPanelDespacho = null;
      /*this.mSelectRutaSalidaDespachar = null;
      this.mSelectRutaFrecuenciaPanelDespacho = null;*/
    },
    async EnviarDespachoUnidad() {
      try {
        var objFrecuencia = this.getObjetoFrecuencia(
          this.mSelectRutaFrecuenciaPanelDespacho
        )

        if (
          this.itemUnidadSalidasPanelDespacho == null ||
          this.mSelectRutaSalidaDespachar == null ||
          this.mSelectRutaFrecuenciaPanelDespacho == null
        ) {
          Notification.warning({
            title: "PANEL DESPACHO",
            message: "PORFAVOR LLENAR LOS DATOS VACIOS",
            duration: 1500,
          });
          return;
        }

        var objDespacho = null

        if(this.radioTipoDespacho==3)
        {
          objDespacho = {
            token: this.token,
            unidad: this.itemUnidadSalidasPanelDespacho.CodiVehi,
            empresa_codigo: this.itemUnidadSalidasPanelDespacho.CodiClie,
            dispositivo_imei: this.itemUnidadSalidasPanelDespacho.CodiDispVehi,
            channel_port: this.itemUnidadSalidasPanelDespacho.PuerCHNClie,
            ruta_letra: this.getRutaPorID(this.mSelectRutaSalidaDespachar).LetrRuta,
            dispositivo_tipo:
              this.itemUnidadSalidasPanelDespacho.idTipoDispVehi,
            ruta: this.mSelectRutaSalidaDespachar,
            frecuencia: objFrecuencia.idFrec,
            fecha_hora: this.fechaActualSalidasPanelDespachoDespachador,
            recalificar_usar_posiciones: this.RecaTarjUsaPosi,
            recalifica_minutos_antes: this.RecaTarjRangInic,
            recalifica_minutos_despues: this.RecaTarjRangFin,
            recalifica_sobreescribir_si_tiene_marcacion: this.RecaSobrCtrlMarcClie,
          }
        }else{
          objDespacho = {
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
        }

        this.responseApiDespachoWeb = await this.$axios.post(
          process.env.baseUrl + (this.radioTipoDespacho == 3 ? "/GeneraTarjeta" : "/generarDespacho"),
          objDespacho
        )

        if (this.responseApiDespachoWeb.data.status_code == 200) {
          this.clearModalDespacho();

          Notification.success({
            title: "SALIDA GENERADA CON EXITO",
            message: (this.radioTipoDespacho == 3 ? "TARJETA GENERADA CON EXITO" : ("CODIGO SALIDA : " + this.responseApiDespachoWeb.data.salida_id)),
            duration: 1500,
          })
        } else {
          Notification.error({
            title: "ERROR DESPACHO API",
            message: this.responseApiDespachoWeb.data.msm,
            duration: 1500,
          });
        }

        //console.log(this.responseApiDespachoWeb.data);
      } catch (error) {
        console.log(error);
        Notification.error({
          title: "ERROR DESPACHO TRY",
          message: error.toString(),
          duration: 1500,
        });
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
        /*console.log(this.getObjUnidad(this.selectedRowSalida.CodiVehiSali_m));*/

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

        /*console.log(response.data);*/
        this.reponseAnularFinalizar = response.data;
        this.modalDespachoAnularSalida = false;
        this.modalDespachoFinalizarSalida = false;
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
    showModalAnularTodo() {
      this.clearModalFinalizarAnularToda();
      this.modalDespachoAnularSalidaTodo = true;
    },
    showModalFinalizarTodo() {
      this.clearModalFinalizarAnularToda();
      this.modalDespachoFinalizarSalidaTodo = true;
    },
    clearModalFinalizarAnularToda() {
      this.mSelectRutaAnularFinalizarTodo = null;
      this.itemUnidadSalidaAnularFinalizar = null;
      this.mCheckDiferidaFinalizarAnulado = false;
      this.mCheckEnRutaFinalizarAnulado = false;
      this.mCheckFinalizadaFinalizarAnulado = false;
    },
    sendFinalizarAnularAllSalidas(estado_, title) {
      if (this.mSelectRutaAnularFinalizarTodo == null) {
        Notification.warning({
          title: "PANEL DESPACHO",
          message: "PORFAVOR SELECCIONE UNA RUTA",
          duration: 2000,
        });

        return;
      }

      MessageBox.confirm(
        "Esta seguro que desea " +
          title +
          " LAS SALIDAS para las unidades : " +
          (this.itemUnidadSalidaAnularFinalizar == null ||
          this.itemUnidadSalidaAnularFinalizar.length <= 0
            ? "TODAS LAS UNIDADES"
            : this.itemUnidadSalidaAnularFinalizar.toString()) +
          " en la RUTA : " +
          (this.mSelectRutaAnularFinalizarTodo == null ||
          this.mSelectRutaAnularFinalizarTodo.length <= 0
            ? "TODAS LAS RUTAS"
            : this.getRutaPorID(this.mSelectRutaAnularFinalizarTodo).DescRuta) +
          " para la FECHA " +
          this.fechaActualAnularFinalizarTodo +
          " (" +
          (this.mCheckDiferidaFinalizarAnulado == false &&
          this.mCheckEnRutaFinalizarAnulado == false &&
          this.mCheckFinalizadaFinalizarAnulado == false
            ? " DIFERIDA,EN RUTA,FINALIZADA"
            : (this.mCheckDiferidaFinalizarAnulado == true ? "DIFERIDA," : "") +
              (this.mCheckFinalizadaFinalizarAnulado == true
                ? "FINALIZADAS,"
                : "") +
              (this.mCheckEnRutaFinalizarAnulado == true ? "EN RUTA" : "")) +
          ") ",
        "Advertencia",
        {
          confirmButtonText: "Confirmar",
          cancelButtonText: "Cancelar",
          type: "warning",
        }
      )
        .then(() => {
          this.apiAnularFinalizarAllSalida(estado_);
        })
        .catch((error) => {
          this.createHeaderTable();
          console.log(error);
        });
    },
    async apiAnularFinalizarAllSalida(estado_) {
      try {
        var data = await this.$axios.post(
          process.env.baseUrl + "/AnularFinalizarAllDespacho",
          {
            token: this.token,
            fecha: this.fechaActualAnularFinalizarTodo,
            ruta: this.mSelectRutaAnularFinalizarTodo,
            unidades:
              this.itemUnidadSalidaAnularFinalizar == null ||
              this.itemUnidadSalidaAnularFinalizar.length <= 0
                ? "*"
                : this.itemUnidadSalidaAnularFinalizar,
            isFinalizada: this.mCheckFinalizadaFinalizarAnulado == true ? 1 : 0,
            isRuta: this.mCheckEnRutaFinalizarAnulado == true ? 1 : 0,
            isDiferida: this.mCheckDiferidaFinalizarAnulado == true ? 1 : 0,
            estado: estado_,
          }
        );

        if (data.data.status_code == 200) {
          this.clearModalFinalizarAnularToda();
          Notification.success({
            title: "PANEL DESPACHO",
            message:
              "DESPACHOS " +
              (estado_ == 3 ? "FINALIZADOS" : "ANULADOS") +
              " CON EXITO",
            duration: 1500,
          });
        } else {
          Notification.error({
            title: "PANEL DESPACHO",
            message: data.data.msm,
            duration: 2000,
          });
        }
      } catch (error) {
        Notification.error({
          title: "PANEL DESPACHO TRY CATCH",
          message: error.toString(),
          duration: 2000,
        });
      }
      this.createHeaderTable();
    },
    async readConfigRecalTarjeta() {
      this.objConfigRecalificar = null;

      try {
        var response = await this.$axios.post(
          process.env.baseUrl + "/ReadConfigRecalificaSalida",
          {
            token: this.token,
          }
        );

        if (response.data.status_code == 200) {
          this.objConfigRecalificar = response.data.datos;
          console.log("------------------------------------------");
          console.log(this.objConfigRecalificar);
          console.log("------------------------------------------");

          if (this.objConfigRecalificar != null) 
          {
            this.RecaTarjRangInic = this.objConfigRecalificar.RecaTarjRangInic;
            this.RecaTarjRangFin = this.objConfigRecalificar.RecaTarjRang;
            
            this.RecaTarjUsaPosi = this.objConfigRecalificar.RecaTarjUsaPosi == 1 ? true : false
            this.RecaSobrCtrlMarcClie = this.objConfigRecalificar.RecaSobrCtrlMarcClie == 1 ? true : false

          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    async updateTiempoRecalTarjeta() {
      try {
        var response = await this.$axios.put(
          process.env.baseUrl + "/UpdateTiempoRecalificaSalida",
          {
            token: this.token,
            inicio: this.RecaTarjRangInic == null ? 0 : this.RecaTarjRangInic,
            fin: this.RecaTarjRangFin == null ? 0 : this.RecaTarjRangFin,
            RecaSobrCtrlMarcClie: this.RecaSobrCtrlMarcClie,
            RecaTarjUsaPosi: this.RecaTarjUsaPosi
          }
        );

        if (response.data.status_code == 200) {
          Notification.success({
            title: "PANEL DESPACHO",
            message: "Tiempos actualizados con éxito",
            duration: 2000,
          });
          this.readConfigRecalTarjeta();
        } else {
          Notification.error({
            title: "PANEL DESPACHO",
            message: data.data.msm,
            duration: 2000,
          });
        }
      } catch (error) {
        Notification.error({
          title: "PANEL DESPACHO",
          message: error.toString(),
          duration: 2000,
        });
      }
    },
    async RecaTarjeta() {
      try {
        if (this.objConfigRecalificar == null) {
          Notification.error({
            title: "PANEL DESPACHO",
            message: "CONFIGURACION DE RECALIFICAR VACIO",
            duration: 2000,
          });
          return;
        }

        if (this.selectedRowSalida == null) {
          Notification.error({
            title: "PANEL DESPACHO",
            message: "SELECCIONE UNA SALIDA",
            duration: 2000,
          });
          return;
        }

        var response = await this.$axios.put(
          process.env.baseUrl + "/RecalificarTarjeta",
          {
            token: this.token,
            salida_id: this.selectedRowSalida.idSali_m,
            fecha_tarjeta: this.selectedRowSalida.HoraSaliProgSali_mF,
            unidad_tarjeta: this.selectedRowSalida.CodiVehiSali_m,
            PosiUse: this.RecaTarjUsaPosi,
            CtrlMarcUse: this.RecaSobrCtrlMarcClie, //this.objConfigRecalificar.RecaTarjTodoCtrl == 1 ? true : false,
            MarcSobr: true,
            RecaMinuAnteRang: this.RecaTarjRangInic,
            RecaMinuDespRang: this.RecaTarjRangFin,
            ToleCaliClie: this.objConfigRecalificar.ToleCaliClie,
          }
        );

        if (response.data.status_code == 200) {
          this.modalDespachoRecalificarSalida = false;
          this.readConfigRecalTarjeta();
          this.createHeaderTable();
          this.showReporteLlegadaSAlida();
          Notification.success({
            title: "PANEL DESPACHO",
            message: "TARJETA RECALIFICADA CON EXITO",
            duration: 2000,
          });
        } else {
          Notification.error({
            title: "PANEL DESPACHO",
            message: response.data.msm,
            duration: 2000,
          });
        }
      } catch (error) {
        Notification.error({
          title: "PANEL DESPACHO",
          message: error.toString(),
          duration: 2000,
        });
      }
    },
    async showModalDespachoRecalificarTodoSalida() {
      //this.clearModalRecalificaTodo();

      //this.RecaSobrCtrlMarcClie = false;

      await this.readConfigRecalTarjeta();

      this.modalDespachoRecalificarTodoSalida
        ? (this.modalDespachoRecalificarTodoSalida = false)
        : (this.modalDespachoRecalificarTodoSalida = true);
    },
    async RecaTarjetaTodo() {
      try {
        if (this.mSelectRutaRecalificarTodo == null) {
          Notification.warning({
            title: "PANEL DESPACHO",
            message: "PORFAVOR SELECCIONE UNA RUTA",
            duration: 2000,
          });

          return;
        }

        var response = await this.$axios.put(
          process.env.baseUrl + "/RecalificarTodoTarjeta",
          {
            token: this.token,
            fecha: (this.fechaActualAnularFinalizarTodo),
            ruta: this.mSelectRutaRecalificarTodo,
            unidad:
              this.itemUnidadSalidaRecalificarTodo == null ||
              this.itemUnidadSalidaRecalificarTodo.length <= 0
                ? "*"
                : this.itemUnidadSalidaRecalificarTodo,
            PosiUse: this.RecaTarjUsaPosi, //priorizar el local
            CtrlMarcUse: this.RecaSobrCtrlMarcClie,
            MarcSobr: true,
            RecaMinuAnteRang: this.RecaTarjRangInic,
            RecaMinuDespRang: this.RecaTarjRangFin,
            ToleCaliClie: this.objConfigRecalificar.ToleCaliClie,
            isFin: 1,
            isRuta: 0,
          }
        );

        if (response.data.status_code == 200) {
          //this.modalDespachoRecalificarTodoSalida = false;
          this.clearModalRecalificaTodo();
          this.createHeaderTable();

          Notification.success({
            title: "PANEL DESPACHO",
            message: "TARJETA RECALIFICADA CON EXITO",
            duration: 2000,
          });
        } else {
          Notification.error({
            title: "PANEL DESPACHO",
            message: response.data.msm,
            duration: 2000,
          });
        }
      } catch (error) {
        Notification.error({
          title: "PANEL DESPACHO",
          message: error.toString(),
          duration: 2000,
        });
      }
    },
    clearModalRecalificaTodo() {
      //this.RecaSobrCtrlMarcTodoClie = false;
      //this.RecaTarjUsaPosiLocal = false;

      this.EnRutaRecalificaTodo = false;
      this.FinalizadaRecalificaTodo = false;
      this.itemUnidadSalidaRecalificarTodo = null;
      this.mSelectRutaRecalificarTodo = null;
    },
  },
  mounted() {
    this.isTarjetaAntActPos =
      this.$cookies.get("empresa") == "glimitada" ? true : false;
    this.readConfigRecalTarjeta();
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
.container-modal-recalifica {
  margin-right: 1.5rem;
  margin-left: 1.5rem;
}

.container-div-range-minutos {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  margin-bottom:1rem;
}

.container-div-check-recalifica {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
}
.inputDatimeDespachoPanel2 .form-group .form-control {
  margin-bottom: 0rem;
  font-size: 2rem;
  color: black;
}
.dateTimeDespacho .el-input__inner {
  font-size: 2.5rem;
  height: 3rem;
}

.input_date_anular_despacho_todo .form-group {
  margin-bottom: 0rem;
}
.container_body_modal_despacho {
  margin-right: 1.25rem;
  margin-left: 1.25rem;
}
.buttonsAdicionalesDespacho {
  margin: auto;
  display: flex;
  justify-content: flex-end;
  width: 50%;
}

.buttonsAdicionalesDespacho2 {
  margin: auto;
  display: flex;
  justify-content: flex-end;
  width: 30%;
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
  width: 50%;
  justify-content: flex-start;
}

.cardTiposDespachosPanelDespacho2 {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  width: 70%;
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
  height: calc(100vh - 12rem);
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


