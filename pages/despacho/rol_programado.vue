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
              style="margin-right: 0.5rem"
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

            <base-input
              addon-left-icon="ni ni-calendar-grid-58"
              style="margin-right: 0.5rem"
            >
              <flat-picker
                slot-scope="{ focus, blur }"
                :min="{ fechaInicialRol }"
                @on-open="focus"
                @on-close="blur"
                :config="config_flatpicker"
                class="form-controlPersonal datepicker"
                v-model="fechaInicialRol"
              >
              </flat-picker>
            </base-input>
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
            <el-table-column label="Actions" width="210">
              <template slot-scope="scope">
                <base-button
                  icon
                  type="primary"
                  @click="showModalRolProgramadoDetalle(scope.row)"
                  size="sm"
                >
                  <span class="btn-inner--icon"
                    ><i class="ni ni-ruler-pencil"></i
                  ></span>
                </base-button>

                <base-button
                  icon
                  type="success"
                  @click="sendDespachoProgramado(scope.row)"
                  size="sm"
                >
                  <span class="btn-inner--icon"
                    ><i class="ni ni-send"> AUTORIZAR</i></span
                  >
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
              <template slot-scope="scope">
                <badge
                  :type="scope.row.active_dia == 1 ? 'default' : 'danger'"
                  rounded
                  class="mr-2"
                  >{{
                    scope.row.active_dia == 1 ? "ACTIVO" : "INACTIVO"
                  }}</badge
                >
              </template>
            </el-table-column>

            <el-table-column label="LUNES" width="150">
              <template slot-scope="scope"
                ><badge
                  :type="scope.row.active_dia == 1 ? 'default' : 'danger'"
                  rounded
                  class="mr-2"
                  >{{
                    scope.row.active_dia == 1 ? "ACTIVO" : "INACTIVO"
                  }}</badge
                >
              </template>
            </el-table-column>

            <el-table-column label="MARTES" width="150">
              <template slot-scope="scope"
                ><badge
                  :type="scope.row.active_dia == 1 ? 'default' : 'danger'"
                  rounded
                  class="mr-2"
                  >{{
                    scope.row.active_dia == 1 ? "ACTIVO" : "INACTIVO"
                  }}</badge
                >
              </template>
            </el-table-column>
            <el-table-column label="MIERCOLES" width="150">
              <template slot-scope="scope"
                ><badge
                  :type="scope.row.active_dia == 1 ? 'default' : 'danger'"
                  rounded
                  class="mr-2"
                  >{{
                    scope.row.active_dia == 1 ? "ACTIVO" : "INACTIVO"
                  }}</badge
                >
              </template>
            </el-table-column>
            <el-table-column label="JUEVES" width="150">
              <template slot-scope="scope"
                ><badge
                  :type="scope.row.active_dia == 1 ? 'default' : 'danger'"
                  rounded
                  class="mr-2"
                  >{{
                    scope.row.active_dia == 1 ? "ACTIVO" : "INACTIVO"
                  }}</badge
                >
              </template>
            </el-table-column>
            <el-table-column label="VIERNES" width="150">
              <template slot-scope="scope"
                ><badge
                  :type="scope.row.active_dia == 1 ? 'default' : 'danger'"
                  rounded
                  class="mr-2"
                  >{{
                    scope.row.active_dia == 1 ? "ACTIVO" : "INACTIVO"
                  }}</badge
                >
              </template>
            </el-table-column>
            <el-table-column label="SABADO" width="150">
              <template slot-scope="scope"
                ><badge
                  :type="scope.row.active_dia == 1 ? 'default' : 'danger'"
                  rounded
                  class="mr-2"
                  >{{
                    scope.row.active_dia == 1 ? "ACTIVO" : "INACTIVO"
                  }}</badge
                >
              </template>
            </el-table-column>
            <el-table-column label="DOMINGO" width="150">
              <template slot-scope="scope"
                ><badge
                  :type="scope.row.active_dia == 1 ? 'default' : 'danger'"
                  rounded
                  class="mr-2"
                  >{{
                    scope.row.active_dia == 1 ? "ACTIVO" : "INACTIVO"
                  }}</badge
                >
              </template>
            </el-table-column>
            <el-table-column label="FERIADO" width="150">
              <template slot-scope="scope"
                ><badge
                  :type="scope.row.active_dia == 1 ? 'default' : 'danger'"
                  rounded
                  class="mr-2"
                  >{{
                    scope.row.active_dia == 1 ? "ACTIVO" : "INACTIVO"
                  }}</badge
                >
              </template>
            </el-table-column>
            <div slot="empty"></div>
          </el-table>
        </card>

        <modal :show.sync="oModalAddRol">
          <h6 slot="header" class="modal-title">Crear nuevo Rol Programado</h6>

          <base-input
            placeholder="Ingrese el nombre"
            v-model="nombreRolProgramadoM"
          ></base-input>

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

          <base-checkbox
            name="radio0"
            v-model="isRolProgramadoXDia"
            style="width: 100%; margin-top: 1rem"
          >
            ROL PROGRAMADO ESPECIFICO PARA CADA DIA
          </base-checkbox>

          <div class="container-fecha" v-if="isRolProgramadoXDia">
            <base-checkbox v-model="isLunes" style="margin-right: 0.5rem">
              LUNES
            </base-checkbox>
            <base-checkbox v-model="isMartes" style="margin-right: 0.5rem">
              MARTES
            </base-checkbox>
            <base-checkbox v-model="isMiercoles" style="margin-right: 0.5rem">
              MIERCOLES
            </base-checkbox>
            <base-checkbox v-model="isJueves" style="margin-right: 0.5rem">
              JUEVES
            </base-checkbox>
            <base-checkbox v-model="isViernes"> VIERNES </base-checkbox>
            <base-checkbox v-model="isSabado" style="margin-right: 0.5rem">
              SABADO
            </base-checkbox>
            <base-checkbox v-model="isDomingo" style="margin-right: 0.5rem">
              DOMINGO
            </base-checkbox>
            <base-checkbox v-model="isFeriado" style="margin-right: 0.5rem">
              FERIADO
            </base-checkbox>
          </div>

          <template slot="footer">
            <base-button type="primary" @click="createRolProgramado()"
              >Guardar</base-button
            >
            <base-button
              type="link"
              @click="closeModalRolProgramado()"
              class="ml-auto"
              >Cancelar</base-button
            >
          </template>
        </modal>
        <modal
          modal-classes="modal-dialog-centered modal-xl"
          :show.sync="oModalAddRolDetalleD"
        >
          <h6 slot="header" class="modal-title">
            {{
              objRolSelect == null
                ? ""
                : objRolSelect.detalle_rol_programado_m +
                  " (" +
                  objRolSelect.DescRuta +
                  ")"
            }}
          </h6>

          <div class="create_rol">
            <div class="container_item_rol">
              <base-input type="time" placeholder="HORA1" v-model="hora1"></base-input>
              <el-select
                v-model="frecuencia1"
                collapse-tags
                style="margin-right: 0.5rem; width: 10rem; height: 100%"
                placeholder="FRECUENCIA 1"
              >
                <el-option
                  v-for="item in mListFrecuencia"
                  :key="item.idFrec"
                  :label="item.DescFrec"
                  :value="item.idFrec"
                >
                </el-option>
              </el-select>
            </div>
            <div class="container_item_rol">
              <base-input type="time" placeholder="HORA1" v-model="hora2"></base-input>
              <el-select
                v-model="frecuencia2"
                collapse-tags
                style="margin-right: 0.5rem; width: 10rem; height: 100%"
                placeholder="FRECUENCIA 2"
              >
                <el-option
                  v-for="item in mListFrecuencia"
                  :key="item.idFrec"
                  :label="item.DescFrec"
                  :value="item.idFrec"
                >
                </el-option>
              </el-select>
            </div>
            <div class="container_item_rol">
              <base-input type="time" placeholder="HORA1" v-model="hora3"></base-input>
              <el-select
                v-model="frecuencia3"
                collapse-tags
                style="margin-right: 0.5rem; width: 10rem; height: 100%"
                placeholder="FRECUENCIA 3"
              >
                <el-option
                  v-for="item in mListFrecuencia"
                  :key="item.idFrec"
                  :label="item.DescFrec"
                  :value="item.idFrec"
                >
                </el-option>
              </el-select>
            </div>
            <div class="container_item_rol">
              <base-input type="time" placeholder="HORA1" v-model="hora4"></base-input>
              <el-select
                v-model="frecuencia4"
                collapse-tags
                style="margin-right: 0.5rem; width: 10rem; height: 100%"
                placeholder="FRECUENCIA 4"
              >
                <el-option
                  v-for="item in mListFrecuencia"
                  :key="item.idFrec"
                  :label="item.DescFrec"
                  :value="item.idFrec"
                >
                </el-option>
              </el-select>
            </div>
            <div class="container_item_rol">
              <base-input type="time" placeholder="HORA1" v-model="hora5"></base-input>
              <el-select
                v-model="frecuencia5"
                collapse-tags
                style="margin-right: 0.5rem; width: 10rem; height: 100%"
                placeholder="FRECUENCIA 5"
              >
                <el-option
                  v-for="item in mListFrecuencia"
                  :key="item.idFrec"
                  :label="item.DescFrec"
                  :value="item.idFrec"
                >
                </el-option>
              </el-select>
            </div>
            <div class="container_item_rol">
              <base-input type="time" placeholder="HORA1" v-model="hora6"></base-input>
              <el-select
                v-model="frecuencia6"
                collapse-tags
                style="margin-right: 0.5rem; width: 10rem; height: 100%"
                placeholder="FRECUENCIA 6"
              >
                <el-option
                  v-for="item in mListFrecuencia"
                  :key="item.idFrec"
                  :label="item.DescFrec"
                  :value="item.idFrec"
                >
                </el-option>
              </el-select>
            </div>
            <div class="container_item_rol">
              <base-input type="time" placeholder="HORA1" v-model="hora7"></base-input>
              <el-select
                v-model="frecuencia7"
                collapse-tags
                style="margin-right: 0.5rem; width: 10rem; height: 100%"
                placeholder="FRECUENCIA 7"
              >
                <el-option
                  v-for="item in mListFrecuencia"
                  :key="item.idFrec"
                  :label="item.DescFrec"
                  :value="item.idFrec"
                >
                </el-option>
              </el-select>
            </div>
            <div class="container_item_rol">
              <base-input type="time" placeholder="HORA1" v-model="hora8"></base-input>
              <el-select
                v-model="frecuencia8"
                collapse-tags
                style="margin-right: 0.5rem; width: 10rem; height: 100%"
                placeholder="FRECUENCIA 8"
              >
                <el-option
                  v-for="item in mListFrecuencia"
                  :key="item.idFrec"
                  :label="item.DescFrec"
                  :value="item.idFrec"
                >
                </el-option>
              </el-select>
            </div>
            <div class="container_item_rol">
              <base-input type="time" placeholder="HORA1" v-model="hora9"></base-input>
              <el-select
                v-model="frecuencia9"
                collapse-tags
                style="margin-right: 0.5rem; width: 10rem; height: 100%"
                placeholder="FRECUENCIA 9"
              >
                <el-option
                  v-for="item in mListFrecuencia"
                  :key="item.idFrec"
                  :label="item.DescFrec"
                  :value="item.idFrec"
                >
                </el-option>
              </el-select>
            </div>
            <div class="container_item_rol">
              <base-input type="time" placeholder="HORA1" v-model="hora10"></base-input>
              <el-select
                v-model="frecuencia10"
                collapse-tags
                style="margin-right: 0.5rem; width: 10rem; height: 100%"
                placeholder="FRECUENCIA 10"
              >
                <el-option
                  v-for="item in mListFrecuencia"
                  :key="item.idFrec"
                  :label="item.DescFrec"
                  :value="item.idFrec"
                >
                </el-option>
              </el-select>
            </div>
            <div class="container_item_rol">
              <base-input type="time" placeholder="HORA1" v-model="hora11"></base-input>
              <el-select
                v-model="frecuencia11"
                collapse-tags
                style="margin-right: 0.5rem; width: 10rem; height: 100%"
                placeholder="FRECUENCIA 11"
              >
                <el-option
                  v-for="item in mListFrecuencia"
                  :key="item.idFrec"
                  :label="item.DescFrec"
                  :value="item.idFrec"
                >
                </el-option>
              </el-select>
            </div>
            <div class="container_item_rol">
              <base-input type="time" placeholder="HORA1" v-model="hora12"></base-input>
              <el-select
                v-model="frecuencia12"
                collapse-tags
                style="margin-right: 0.5rem; width: 10rem; height: 100%"
                placeholder="FRECUENCIA 12"
              >
                <el-option
                  v-for="item in mListFrecuencia"
                  :key="item.idFrec"
                  :label="item.DescFrec"
                  :value="item.idFrec"
                >
                </el-option>
              </el-select>
            </div>
            <div class="container_item_rol">
              <base-input type="time" placeholder="HORA1" v-model="hora13"></base-input>
              <el-select
                v-model="frecuencia13"
                collapse-tags
                style="margin-right: 0.5rem; width: 10rem; height: 100%"
                placeholder="FRECUENCIA 13"
              >
                <el-option
                  v-for="item in mListFrecuencia"
                  :key="item.idFrec"
                  :label="item.DescFrec"
                  :value="item.idFrec"
                >
                </el-option>
              </el-select>
            </div>
            <div class="container_item_rol">
              <base-input type="time" placeholder="HORA1" v-model="hora14"></base-input>
              <el-select
                v-model="frecuencia14"
                collapse-tags
                style="margin-right: 0.5rem; width: 10rem; height: 100%"
                placeholder="FRECUENCIA 14"
              >
                <el-option
                  v-for="item in mListFrecuencia"
                  :key="item.idFrec"
                  :label="item.DescFrec"
                  :value="item.idFrec"
                >
                </el-option>
              </el-select>
            </div>
            <div class="container_item_rol">
              <base-input type="time" placeholder="HORA1" v-model="hora15"></base-input>
              <el-select
                v-model="frecuencia15"
                collapse-tags
                style="margin-right: 0.5rem; width: 10rem; height: 100%"
                placeholder="FRECUENCIA 15"
              >
                <el-option
                  v-for="item in mListFrecuencia"
                  :key="item.idFrec"
                  :label="item.DescFrec"
                  :value="item.idFrec"
                >
                </el-option>
              </el-select>
            </div>
            <div class="container_item_rol">
              <base-input type="time" placeholder="HORA1" v-model="hora16"></base-input>
              <el-select
                v-model="frecuencia16"
                collapse-tags
                style="margin-right: 0.5rem; width: 10rem; height: 100%"
                placeholder="FRECUENCIA 16"
              >
                <el-option
                  v-for="item in mListFrecuencia"
                  :key="item.idFrec"
                  :label="item.DescFrec"
                  :value="item.idFrec"
                >
                </el-option>
              </el-select>
            </div>
            <div class="container_item_rol">
              <base-input type="time" placeholder="HORA1" v-model="hora17"></base-input>
              <el-select
                v-model="frecuencia17"
                collapse-tags
                style="margin-right: 0.5rem; width: 10rem; height: 100%"
                placeholder="FRECUENCIA 17"
              >
                <el-option
                  v-for="item in mListFrecuencia"
                  :key="item.idFrec"
                  :label="item.DescFrec"
                  :value="item.idFrec"
                >
                </el-option>
              </el-select>
            </div>
            <div class="container_item_rol">
              <base-input type="time" placeholder="HORA1" v-model="hora18"></base-input>
              <el-select
                v-model="frecuencia18"
                collapse-tags
                style="margin-right: 0.5rem; width: 10rem; height: 100%"
                placeholder="FRECUENCIA 18"
              >
                <el-option
                  v-for="item in mListFrecuencia"
                  :key="item.idFrec"
                  :label="item.DescFrec"
                  :value="item.idFrec"
                >
                </el-option>
              </el-select>
            </div>
            <div class="container_item_rol">
              <base-input type="time" placeholder="HORA1" v-model="hora19"></base-input>
              <el-select
                v-model="frecuencia19"
                collapse-tags
                style="margin-right: 0.5rem; width: 10rem; height: 100%"
                placeholder="FRECUENCIA 19"
              >
                <el-option
                  v-for="item in mListFrecuencia"
                  :key="item.idFrec"
                  :label="item.DescFrec"
                  :value="item.idFrec"
                >
                </el-option>
              </el-select>
            </div>
            <div class="container_item_rol">
              <base-input type="time" placeholder="HORA1" v-model="hora20"></base-input>
              <el-select
                v-model="frecuencia20"
                collapse-tags
                style="margin-right: 0.5rem; width: 10rem; height: 100%"
                placeholder="FRECUENCIA 20"
              >
                <el-option
                  v-for="item in mListFrecuencia"
                  :key="item.idFrec"
                  :label="item.DescFrec"
                  :value="item.idFrec"
                >
                </el-option>
              </el-select>
            </div>
          </div>

          <el-table
            v-loading="loadingRolProgramadoD"
            element-loading-text="Cargando Datos..."
            :data="mListRolProgramadoD"
            row-key="id"
            class="tablePanelControlProduccion"
            header-row-class-name="thead-dark"
            highlight-current-row
            @current-change="handleCurrentChangeRolDetalle"
            height="calc(100vh - 20rem)"
            style="width: 100%"
          >
            <el-table-column label="UNIDAD" prop="unidad" width="150">
            </el-table-column>
            <el-table-column label="HORA 1" width="90" prop="hora1">
            </el-table-column>
            <el-table-column
              label="FRECUENCIA 1"
              width="150"
              prop="AutoDespachoDifeFrec1"
            >
            </el-table-column>
            <el-table-column label="HORA 2" width="90" prop="hora2">
            </el-table-column>
            <el-table-column
              label="FRECUENCIA 2"
              width="150"
              prop="AutoDespachoDifeFrec2"
            >
            </el-table-column>
            <el-table-column label="HORA 3" width="90" prop="hora3">
            </el-table-column>
            <el-table-column
              label="FRECUENCIA 3"
              width="150"
              prop="AutoDespachoDifeFrec3"
            >
            </el-table-column>
            <el-table-column label="HORA 4" width="90" prop="hora4">
            </el-table-column>
            <el-table-column
              label="FRECUENCIA 4"
              width="150"
              prop="AutoDespachoDifeFrec4"
            >
            </el-table-column>
            <el-table-column label="HORA 5" width="90" prop="hora5">
            </el-table-column>
            <el-table-column
              label="FRECUENCIA 5"
              width="150"
              prop="AutoDespachoDifeFrec5"
            >
            </el-table-column>
            <el-table-column label="HORA 6" width="90" prop="hora6">
            </el-table-column>
            <el-table-column
              label="FRECUENCIA 6"
              width="150"
              prop="AutoDespachoDifeFrec6"
            >
            </el-table-column>
            <el-table-column label="HORA 7" width="90" prop="hora7">
            </el-table-column>
            <el-table-column
              label="FRECUENCIA 7"
              width="150"
              prop="AutoDespachoDifeFrec7"
            >
            </el-table-column>
            <el-table-column label="HORA 8" width="90" prop="hora8">
            </el-table-column>
            <el-table-column
              label="FRECUENCIA 8"
              width="150"
              prop="AutoDespachoDifeFrec8"
            >
            </el-table-column>
            <el-table-column label="HORA 9" width="90" prop="hora9">
            </el-table-column>
            <el-table-column
              label="FRECUENCIA 9"
              width="150"
              prop="AutoDespachoDifeFrec9"
            >
            </el-table-column>
            <el-table-column label="HORA 10" width="90" prop="hora10">
            </el-table-column>
            <el-table-column
              label="FRECUENCIA 10"
              width="150"
              prop="AutoDespachoDifeFrec10"
            >
            </el-table-column>
            <el-table-column label="HORA 11" width="90" prop="hora11">
            </el-table-column>
            <el-table-column
              label="FRECUENCIA 11"
              width="150"
              prop="AutoDespachoDifeFrec11"
            >
            </el-table-column>
            <el-table-column label="HORA 12" width="90" prop="hora12">
            </el-table-column>
            <el-table-column
              label="FRECUENCIA 12"
              width="150"
              prop="AutoDespachoDifeFrec12"
            >
            </el-table-column>
            <el-table-column label="HORA 13" width="90" prop="hora13">
            </el-table-column>
            <el-table-column
              label="FRECUENCIA 13"
              width="150"
              prop="AutoDespachoDifeFrec13"
            >
            </el-table-column>
            <el-table-column label="HORA 14" width="90" prop="hora14">
            </el-table-column>
            <el-table-column
              label="FRECUENCIA 14"
              width="150"
              prop="AutoDespachoDifeFrec14"
            >
            </el-table-column>
            <el-table-column label="HORA 15" width="90" prop="hora15">
            </el-table-column>
            <el-table-column
              label="FRECUENCIA 15"
              width="150"
              prop="AutoDespachoDifeFrec15"
            >
            </el-table-column>
            <el-table-column label="HORA 16" width="90" prop="hora16">
            </el-table-column>
            <el-table-column
              label="FRECUENCIA 16"
              width="150"
              prop="AutoDespachoDifeFrec16"
            >
            </el-table-column>
            <el-table-column label="HORA 17" width="90" prop="hora17">
            </el-table-column>
            <el-table-column
              label="FRECUENCIA 17"
              width="150"
              prop="AutoDespachoDifeFrec17"
            >
            </el-table-column>
            <el-table-column label="HORA 18" width="90" prop="hora18">
            </el-table-column>
            <el-table-column
              label="FRECUENCIA 18"
              width="150"
              prop="AutoDespachoDifeFrec18"
            >
            </el-table-column>
            <el-table-column label="HORA 19" width="90" prop="hora19">
            </el-table-column>
            <el-table-column
              label="FRECUENCIA 19"
              width="150"
              prop="AutoDespachoDifeFrec19"
            >
            </el-table-column>
            <el-table-column label="HORA 20" width="90" prop="hora20">
            </el-table-column>
            <el-table-column
              label="FRECUENCIA 20"
              width="150"
              prop="AutoDespachoDifeFrec20"
            >
            </el-table-column>

            <div slot="empty"></div>
          </el-table>

          <template slot="footer">
          </template>
        </modal>
      </div>
    </base-header>
  </div>
</template>
<script>
import { getBase64LogoReportes } from "../../util/logoReport";
import { convertSecondtoTimeString } from "../../util/fechas";
import flatPicker from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import { Spanish } from "flatpickr/dist/l10n/es.js";
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
  layout: "DespachoDashboardLayout",
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
        },
      ],
      mListRolProgramado: [],
      loadingRolProgramadoD: false,
      mListRolProgramadoD: [],
      optionsUnidadesSalidasPanelBusqueda: [],
      oModalAddRol: false,
      mSelectLineaRolProgrmadoNueva: null,
      nombreRolProgramadoM: null,
      isRolProgramadoXDia: false,
      isLunes: false,
      isMartes: false,
      isMiercoles: false,
      isJueves: false,
      isViernes: false,
      isSabado: false,
      isDomingo: false,
      isFeriado: false,
      oModalAddRolDetalleD: false,
      objRolSelect: null,
      fechaInicialRol: null,
      mListFrecuencia: [],
      mSelectFrecuencia: null,
      hora1: null,
      hora2: null,
      hora3: null,
      hora4: null,
      hora5: null,
      hora6: null,
      hora7: null,
      hora8: null,
      hora9: null,
      hora10: null,
      hora11: null,
      hora12: null,
      hora13: null,
      hora14: null,
      hora15: null,
      hora16: null,
      hora17: null,
      hora18: null,
      hora19: null,
      hora20: null,
      frecuencia1: null,
      frecuencia2: null,
      frecuencia3: null,
      frecuencia4: null,
      frecuencia5: null,
      frecuencia6: null,
      frecuencia7: null,
      frecuencia8: null,
      frecuencia9: null,
      frecuencia10: null,
      frecuencia11: null,
      frecuencia12: null,
      frecuencia13: null,
      frecuencia14: null,
      frecuencia15: null,
      frecuencia16: null,
      frecuencia17: null,
      frecuencia18: null,
      frecuencia19: null,
      frecuencia20: null,
    };
  },
  methods: {
    initFechaActual() {
      const today = new Date();
      const fecha = new Date(today);
      fecha.setDate(fecha.getDate());
      var mes = fecha.getMonth() + 1;
      var day = fecha.getDate();
      var format =
        fecha.getFullYear() +
        "-" +
        (mes < 10 ? "0" + mes : mes) +
        "-" +
        (day < 10 ? "0" + day : day);

      this.fechaInicialRol = format;
    },

    showModalRolProgramadoDetalle(item) {
      this.oModalAddRolDetalleD = true;
      this.objRolSelect = item;
      this.readAllLFrecuenciaRutas(item.idRuta);
      this.readRolProgramadoD();
    },

    showModalRolProgramado() {
      this.oModalAddRol = true;
    },
    closeModalRolProgramado() {
      this.oModalAddRol = false;
      this.mSelectLineaRolProgrmadoNueva = null;
      this.nombreRolProgramadoM = null;
      this.isRolProgramadoXDia = null;
      this.isLunes = 0;
      this.isMartes = 0;
      this.isMiercoles = 0;
      this.isJueves = 0;
      this.isViernes = 0;
      this.isSabado = 0;
      this.isDomingo = 0;
      this.isFeriado = 0;
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
    async readAllLFrecuenciaRutas(ruta) {
      this.mListFrecuencia = [];

      try {
        var datos = await this.$axios.post(
          process.env.baseUrl + "/frecuencias_rutas",
          {
            token: this.token,
            ruta: [ruta],
          }
        );
        if (datos.data.status_code == 200) {
          this.mListFrecuencia.push(...datos.data.data);
        }
      } catch (error) {
        console.log(error);
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
    async createRolProgramado() {
      try {
        console.log(this.nombreRolProgramadoM);
        console.log(this.isRolProgramadoXDia);
        console.log(this.isLunes);
        console.log(this.isMartes);
        console.log(this.isMiercoles);
        console.log(this.isJueves);
        console.log(this.isViernes);
        console.log(this.isSabado);
        console.log(this.isDomingo);
        console.log(this.isFeriado);

        if (
          this.nombreRolProgramadoM == null ||
          this.nombreRolProgramadoM == ""
        ) {
          Notification.error({
            title: "ROL PROGRAMADO",
            message: "PORFAVOR INGRESE UN NOMBRE VALIDO",
          });
          return;
        }

        if (this.mSelectLineaRolProgrmadoNueva == null) {
          Notification.error({
            title: "ROL PROGRAMADO",
            message: "PORFAVOR SELECCIONE UNA RUTA",
          });

          return;
        }

        var response = await this.$axios.post(
          process.env.baseUrl + "/createRolProgramadoM",
          {
            token: this.token,
            detalle_rol_programado_m: this.nombreRolProgramadoM,
            letrRuta: this.mSelectLineaRolProgrmadoNueva,
            active_dia: this.isRolProgramadoXDia,
            isLunes: this.isLunes,
            isMartes: this.isMartes,
            isMiercoles: this.isMiercoles,
            isJueves: this.isJueves,
            isViernes: this.isViernes,
            isSabado: this.isSabado,
            isDomingo: this.isDomingo,
            isFeriado: this.isFeriado,
          }
        );

        if (response.data.status_code != 200) {
          Notification.error({
            title: "ROL PROGRMADO",
            message: response.data.msm,
          });
        } else {
          this.readRolProgramado();
          this.closeModalRolProgramado();
        }
      } catch (error) {
        Notification.error({
          title: "ROL PROGRMADO",
          message: error.toString(),
        });
      }
    },

    async sendDespachoProgramado(item) {
      try {
        var response = await this.$axios.post(
          process.env.baseUrl + "/generarDespachoRolProgramado",
          {
            token: this.token,
            autodespacho_m: item.id_rol_programado_m,
            fecha: this.fechaInicialRol,
          }
        );

        if (response.data.status_code == 200) {
          Notification.success({
            title: "ROL PROGRAMADO",
            message: "DESPACHOS ENVIADOS CON EXITO",
          });
        } else {
          Notification.error({
            title: "ROL PROGRAMADO",
            message: response.data.msm,
          });
        }
      } catch (error) {
        console.log(error);
        Notification.error({
          title: "TRY ROL PROGRAMADO",
          message: error.toString(),
        });
      }
    },

    async readRolProgramadoD() {
      this.loadingRolProgramadoD = true;
      this.mListRolProgramadoD = [];

      try {
        var data = await this.$axios.post(
          process.env.baseUrl + "/readRolProgrmadoDetalle",
          {
            token: this.token,
            autodespacho_m: this.objRolSelect.id_rol_programado_m,
          }
        );

        if (data.data.status_code == 200) {
          this.mListRolProgramadoD.push(...data.data.datos);
        } else {
          //alert(data.data.status_code);
        }
      } catch (error) {
        console.log(error);
      }

      this.loadingRolProgramadoD = false;
    },
    handleCurrentChangeRolDetalle(item){
      console.log(item)
    }
  },
  mounted() {
    this.initFechaActual();
    this.readAllUnidadesSalidasPanelBusqueda();
    this.readAllLineasContadorSalidasPanelBusqueda();
    this.readRolProgramado();
  },
};
</script>
<style>
.container_item_rol {
  width: 25rem;
  display: flex;
}
.create_rol {
  display: flex;
  width: 100%;
  overflow: auto;
  padding: 0.5rem;
  margin-bottom: 1rem;
}
.container-fecha {
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

.cardRolProgramado {
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
