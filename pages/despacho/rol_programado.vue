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
            <el-table-column label="Actions" :width="280">
              <template slot-scope="scope">
                <base-button
                  icon
                  type="primary"
                  @click="showModalRolProgramadoDetalle(scope.row)"
                  size="sm"
                >
                  <span class="btn-inner--icon"
                    ><i class="ni ni-single-copy-04"></i
                  ></span>
                </base-button>

                <base-button
                  icon
                  type="danger"
                  @click="showModalEliminarDespachoProgramado(scope.row)"
                  size="sm"
                >
                  <span class="btn-inner--icon"
                    ><i class="ni ni-fat-remove"></i
                  ></span>
                </base-button>

                <base-button
                  icon
                  type="success"
                  @click="showModalSendDespachoProgramado(scope.row)"
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
                  :type="scope.row.isLunes == 1 ? 'default' : 'danger'"
                  rounded
                  class="mr-2"
                  >{{ scope.row.isLunes == 1 ? "ACTIVO" : "INACTIVO" }}</badge
                >
              </template>
            </el-table-column>

            <el-table-column label="MARTES" width="150">
              <template slot-scope="scope"
                ><badge
                  :type="scope.row.isMartes == 1 ? 'default' : 'danger'"
                  rounded
                  class="mr-2"
                  >{{ scope.row.isMartes == 1 ? "ACTIVO" : "INACTIVO" }}</badge
                >
              </template>
            </el-table-column>
            <el-table-column label="MIERCOLES" width="150">
              <template slot-scope="scope"
                ><badge
                  :type="scope.row.isMiercoles == 1 ? 'default' : 'danger'"
                  rounded
                  class="mr-2"
                  >{{
                    scope.row.isMiercoles == 1 ? "ACTIVO" : "INACTIVO"
                  }}</badge
                >
              </template>
            </el-table-column>
            <el-table-column label="JUEVES" width="150">
              <template slot-scope="scope"
                ><badge
                  :type="scope.row.isJueves == 1 ? 'default' : 'danger'"
                  rounded
                  class="mr-2"
                  >{{ scope.row.isJueves == 1 ? "ACTIVO" : "INACTIVO" }}</badge
                >
              </template>
            </el-table-column>
            <el-table-column label="VIERNES" width="150">
              <template slot-scope="scope"
                ><badge
                  :type="scope.row.isViernes == 1 ? 'default' : 'danger'"
                  rounded
                  class="mr-2"
                  >{{ scope.row.isViernes == 1 ? "ACTIVO" : "INACTIVO" }}</badge
                >
              </template>
            </el-table-column>
            <el-table-column label="SABADO" width="150">
              <template slot-scope="scope"
                ><badge
                  :type="scope.row.isSabado == 1 ? 'default' : 'danger'"
                  rounded
                  class="mr-2"
                  >{{ scope.row.isSabado == 1 ? "ACTIVO" : "INACTIVO" }}</badge
                >
              </template>
            </el-table-column>
            <el-table-column label="DOMINGO" width="150">
              <template slot-scope="scope"
                ><badge
                  :type="scope.row.isDomingo == 1 ? 'default' : 'danger'"
                  rounded
                  class="mr-2"
                  >{{ scope.row.isDomingo == 1 ? "ACTIVO" : "INACTIVO" }}</badge
                >
              </template>
            </el-table-column>
            <el-table-column label="FERIADO" width="150">
              <template slot-scope="scope"
                ><badge
                  :type="scope.row.isFeriado == 1 ? 'default' : 'danger'"
                  rounded
                  class="mr-2"
                  >{{ scope.row.isFeriado == 1 ? "ACTIVO" : "INACTIVO" }}</badge
                >
              </template>
            </el-table-column>
            <div slot="empty"></div>
          </el-table>

          <div v-if="isVisibleLoadingSendDespachos" class="loadingDespachos">
            <div class="msmSendDespacho">
              <div class="loader"></div>
              <h4 style="color: white; margin-bottom: 0rem">
                ENVIANDO DESPACHOS DE
                {{
                  objRolSelect == null
                    ? ""
                    : objRolSelect.detalle_rol_programado_m +
                      " (" +
                      objRolSelect.DescRuta +
                      ")"
                }}
              </h4>
            </div>
          </div>
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
            <base-button
              icon
              title="NUEVO"
              type="success"
              @click="createNuevoRolD()"
              size="sm"
            >
              <span class="btn-inner--icon"
                ><i class="ni ni-check-bold"></i
              ></span>
            </base-button>

            <div class="container_item_rol">
              <el-select
                v-model="itemUnidadRolProgramado"
                filterable
                style="margin-right: 1rem; width: 10rem"
                remote
                placeholder="Ingrese unidad"
                :clearable="true"
                :remote-method="remoteMethodUnidadRolProgramado"
              >
                <el-option
                  v-for="item in optionsUnidadesSalidasPanelBusqueda"
                  :key="item.CodiVehi"
                  :label="item.CodiVehi"
                  :value="item.CodiVehi"
                >
                </el-option>
              </el-select>
            </div>

            <!---PRIMERO 20 -->

            <div class="container_item_rol">
              <base-input
                type="time"
                placeholder="HORA1"
                v-model="hora1"
              ></base-input>
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
              <base-input
                type="time"
                placeholder="HORA1"
                v-model="hora2"
              ></base-input>
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
              <base-input
                type="time"
                placeholder="HORA1"
                v-model="hora3"
              ></base-input>
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
              <base-input
                type="time"
                placeholder="HORA1"
                v-model="hora4"
              ></base-input>
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
              <base-input
                type="time"
                placeholder="HORA1"
                v-model="hora5"
              ></base-input>
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
              <base-input
                type="time"
                placeholder="HORA1"
                v-model="hora6"
              ></base-input>
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
              <base-input
                type="time"
                placeholder="HORA1"
                v-model="hora7"
              ></base-input>
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
              <base-input
                type="time"
                placeholder="HORA1"
                v-model="hora8"
              ></base-input>
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
              <base-input
                type="time"
                placeholder="HORA1"
                v-model="hora9"
              ></base-input>
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
              <base-input
                type="time"
                placeholder="HORA1"
                v-model="hora10"
              ></base-input>
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
              <base-input
                type="time"
                placeholder="HORA1"
                v-model="hora11"
              ></base-input>
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
              <base-input
                type="time"
                placeholder="HORA1"
                v-model="hora12"
              ></base-input>
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
              <base-input
                type="time"
                placeholder="HORA1"
                v-model="hora13"
              ></base-input>
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
              <base-input
                type="time"
                placeholder="HORA1"
                v-model="hora14"
              ></base-input>
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
              <base-input
                type="time"
                placeholder="HORA1"
                v-model="hora15"
              ></base-input>
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
              <base-input
                type="time"
                placeholder="HORA1"
                v-model="hora16"
              ></base-input>
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
              <base-input
                type="time"
                placeholder="HORA1"
                v-model="hora17"
              ></base-input>
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
              <base-input
                type="time"
                placeholder="HORA1"
                v-model="hora18"
              ></base-input>
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
              <base-input
                type="time"
                placeholder="HORA1"
                v-model="hora19"
              ></base-input>
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
              <base-input
                type="time"
                placeholder="HORA1"
                v-model="hora20"
              ></base-input>
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

            <!--ULTIMONS 20-->

            <div class="container_item_rol">
              <base-input
                type="time"
                placeholder="HORA 21"
                v-model="hora21"
              ></base-input>
              <el-select
                v-model="frecuencia21"
                collapse-tags
                style="margin-right: 0.5rem; width: 10rem; height: 100%"
                placeholder="FRECUENCIA 21"
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
              <base-input
                type="time"
                placeholder="HORA 22"
                v-model="hora22"
              ></base-input>
              <el-select
                v-model="frecuencia22"
                collapse-tags
                style="margin-right: 0.5rem; width: 10rem; height: 100%"
                placeholder="FRECUENCIA 22"
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
              <base-input
                type="time"
                placeholder="HORA 23"
                v-model="hora23"
              ></base-input>
              <el-select
                v-model="frecuencia23"
                collapse-tags
                style="margin-right: 0.5rem; width: 10rem; height: 100%"
                placeholder="FRECUENCIA 23"
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
              <base-input
                type="time"
                placeholder="HORA 24"
                v-model="hora24"
              ></base-input>
              <el-select
                v-model="frecuencia24"
                collapse-tags
                style="margin-right: 0.5rem; width: 10rem; height: 100%"
                placeholder="FRECUENCIA 24"
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
              <base-input
                type="time"
                placeholder="HORA 25"
                v-model="hora25"
              ></base-input>
              <el-select
                v-model="frecuencia25"
                collapse-tags
                style="margin-right: 0.5rem; width: 10rem; height: 100%"
                placeholder="FRECUENCIA 25"
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
              <base-input
                type="time"
                placeholder="HORA 26"
                v-model="hora26"
              ></base-input>
              <el-select
                v-model="frecuencia26"
                collapse-tags
                style="margin-right: 0.5rem; width: 10rem; height: 100%"
                placeholder="FRECUENCIA 26"
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
              <base-input
                type="time"
                placeholder="HORA 27"
                v-model="hora27"
              ></base-input>
              <el-select
                v-model="frecuencia27"
                collapse-tags
                style="margin-right: 0.5rem; width: 10rem; height: 100%"
                placeholder="FRECUENCIA 27"
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
              <base-input
                type="time"
                placeholder="HORA 28"
                v-model="hora28"
              ></base-input>
              <el-select
                v-model="frecuencia28"
                collapse-tags
                style="margin-right: 0.5rem; width: 10rem; height: 100%"
                placeholder="FRECUENCIA 28"
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
              <base-input
                type="time"
                placeholder="HORA 29"
                v-model="hora29"
              ></base-input>
              <el-select
                v-model="frecuencia29"
                collapse-tags
                style="margin-right: 0.5rem; width: 10rem; height: 100%"
                placeholder="FRECUENCIA 29"
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
              <base-input
                type="time"
                placeholder="HORA 30"
                v-model="hora30"
              ></base-input>
              <el-select
                v-model="frecuencia30"
                collapse-tags
                style="margin-right: 0.5rem; width: 10rem; height: 100%"
                placeholder="FRECUENCIA 30"
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
              <base-input
                type="time"
                placeholder="HORA 31"
                v-model="hora31"
              ></base-input>
              <el-select
                v-model="frecuencia31"
                collapse-tags
                style="margin-right: 0.5rem; width: 10rem; height: 100%"
                placeholder="FRECUENCIA 31"
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
              <base-input
                type="time"
                placeholder="HORA 32"
                v-model="hora32"
              ></base-input>
              <el-select
                v-model="frecuencia32"
                collapse-tags
                style="margin-right: 0.5rem; width: 10rem; height: 100%"
                placeholder="FRECUENCIA 32"
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
              <base-input
                type="time"
                placeholder="HORA 33"
                v-model="hora33"
              ></base-input>
              <el-select
                v-model="frecuencia33"
                collapse-tags
                style="margin-right: 0.5rem; width: 10rem; height: 100%"
                placeholder="FRECUENCIA 33"
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
              <base-input
                type="time"
                placeholder="HORA 34"
                v-model="hora34"
              ></base-input>
              <el-select
                v-model="frecuencia34"
                collapse-tags
                style="margin-right: 0.5rem; width: 10rem; height: 100%"
                placeholder="FRECUENCIA 34"
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
              <base-input
                type="time"
                placeholder="HORA 35"
                v-model="hora35"
              ></base-input>
              <el-select
                v-model="frecuencia35"
                collapse-tags
                style="margin-right: 0.5rem; width: 10rem; height: 100%"
                placeholder="FRECUENCIA 35"
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
              <base-input
                type="time"
                placeholder="HORA 36"
                v-model="hora36"
              ></base-input>
              <el-select
                v-model="frecuencia36"
                collapse-tags
                style="margin-right: 0.5rem; width: 10rem; height: 100%"
                placeholder="FRECUENCIA 36"
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
              <base-input
                type="time"
                placeholder="HORA 37"
                v-model="hora37"
              ></base-input>
              <el-select
                v-model="frecuencia37"
                collapse-tags
                style="margin-right: 0.5rem; width: 10rem; height: 100%"
                placeholder="FRECUENCIA 37"
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
              <base-input
                type="time"
                placeholder="HORA 38"
                v-model="hora38"
              ></base-input>
              <el-select
                v-model="frecuencia38"
                collapse-tags
                style="margin-right: 0.5rem; width: 10rem; height: 100%"
                placeholder="FRECUENCIA 38"
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
              <base-input
                type="time"
                placeholder="HORA 39"
                v-model="hora39"
              ></base-input>
              <el-select
                v-model="frecuencia39"
                collapse-tags
                style="margin-right: 0.5rem; width: 10rem; height: 100%"
                placeholder="FRECUENCIA 39"
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
              <base-input
                type="time"
                placeholder="HORA 40"
                v-model="hora40"
              ></base-input>
              <el-select
                v-model="frecuencia40"
                collapse-tags
                style="width: 10rem; height: 100%"
                placeholder="FRECUENCIA 40"
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
            height="calc(100vh - 20rem)"
            style="width: 100%"
          >
            <el-table-column width="140">
              <template slot-scope="scope">
                <base-button
                  icon
                  type="danger"
                  @click="eliminarRolD(scope.row)"
                  size="sm"
                >
                  <span class="btn-inner--icon"
                    ><i class="ni ni-fat-remove"></i
                  ></span>
                </base-button>
                <base-button
                  icon
                  type="default"
                  @click="updateRolD(scope.row)"
                  size="sm"
                >
                  <span class="btn-inner--icon"
                    ><i class="ni ni-ruler-pencil"></i
                  ></span>
                </base-button>
              </template>
            </el-table-column>

            <el-table-column label="UNIDAD" prop="unidad" width="150">
            </el-table-column>
            <el-table-column label="HORA 1" width="90" prop="hora1">
            </el-table-column>
            <el-table-column label="FRECUENCIA 1" width="150" prop="DescFrec1">
            </el-table-column>
            <el-table-column label="HORA 2" width="90" prop="hora2">
            </el-table-column>
            <el-table-column label="FRECUENCIA 2" width="150" prop="DescFrec2">
            </el-table-column>
            <el-table-column label="HORA 3" width="90" prop="hora3">
            </el-table-column>
            <el-table-column label="FRECUENCIA 3" width="150" prop="DescFrec3">
            </el-table-column>
            <el-table-column label="HORA 4" width="90" prop="hora4">
            </el-table-column>
            <el-table-column label="FRECUENCIA 4" width="150" prop="DescFrec4">
            </el-table-column>
            <el-table-column label="HORA 5" width="90" prop="hora5">
            </el-table-column>
            <el-table-column label="FRECUENCIA 5" width="150" prop="DescFrec5">
            </el-table-column>
            <el-table-column label="HORA 6" width="90" prop="hora6">
            </el-table-column>
            <el-table-column label="FRECUENCIA 6" width="150" prop="DescFrec6">
            </el-table-column>
            <el-table-column label="HORA 7" width="90" prop="hora7">
            </el-table-column>
            <el-table-column label="FRECUENCIA 7" width="150" prop="DescFrec7">
            </el-table-column>
            <el-table-column label="HORA 8" width="90" prop="hora8">
            </el-table-column>
            <el-table-column label="FRECUENCIA 8" width="150" prop="DescFrec8">
            </el-table-column>
            <el-table-column label="HORA 9" width="90" prop="hora9">
            </el-table-column>
            <el-table-column label="FRECUENCIA 9" width="150" prop="DescFrec9">
            </el-table-column>
            <el-table-column label="HORA 10" width="90" prop="hora10">
            </el-table-column>
            <el-table-column
              label="FRECUENCIA 10"
              width="150"
              prop="DescFrec10"
            >
            </el-table-column>
            <el-table-column label="HORA 11" width="90" prop="hora11">
            </el-table-column>
            <el-table-column
              label="FRECUENCIA 11"
              width="150"
              prop="DescFrec11"
            >
            </el-table-column>
            <el-table-column label="HORA 12" width="90" prop="hora12">
            </el-table-column>
            <el-table-column
              label="FRECUENCIA 12"
              width="150"
              prop="DescFrec12"
            >
            </el-table-column>
            <el-table-column label="HORA 13" width="90" prop="hora13">
            </el-table-column>
            <el-table-column
              label="FRECUENCIA 13"
              width="150"
              prop="DescFrec13"
            >
            </el-table-column>
            <el-table-column label="HORA 14" width="90" prop="hora14">
            </el-table-column>
            <el-table-column
              label="FRECUENCIA 14"
              width="150"
              prop="DescFrec14"
            >
            </el-table-column>
            <el-table-column label="HORA 15" width="90" prop="hora15">
            </el-table-column>
            <el-table-column
              label="FRECUENCIA 15"
              width="150"
              prop="DescFrec15"
            >
            </el-table-column>
            <el-table-column label="HORA 16" width="90" prop="hora16">
            </el-table-column>
            <el-table-column
              label="FRECUENCIA 16"
              width="150"
              prop="DescFrec16"
            >
            </el-table-column>
            <el-table-column label="HORA 17" width="90" prop="hora17">
            </el-table-column>
            <el-table-column
              label="FRECUENCIA 17"
              width="150"
              prop="DescFrec17"
            >
            </el-table-column>
            <el-table-column label="HORA 18" width="90" prop="hora18">
            </el-table-column>
            <el-table-column
              label="FRECUENCIA 18"
              width="150"
              prop="DescFrec18"
            >
            </el-table-column>
            <el-table-column label="HORA 19" width="90" prop="hora19">
            </el-table-column>
            <el-table-column
              label="FRECUENCIA 19"
              width="150"
              prop="DescFrec19"
            >
            </el-table-column>
            <el-table-column
              label="HORA 20"
              width="90"
              prop="hora20"
            ></el-table-column>
            <el-table-column
              label="FRECUENCIA 20"
              width="150"
              prop="DescFrec20"
            ></el-table-column>

            <el-table-column
              label="HORA 21"
              width="90"
              prop="hora21"
            ></el-table-column>
            <el-table-column
              label="FRECUENCIA 21"
              width="150"
              prop="DescFrec21"
            ></el-table-column>

            <el-table-column
              label="HORA 22"
              width="90"
              prop="hora22"
            ></el-table-column>
            <el-table-column
              label="FRECUENCIA 22"
              width="150"
              prop="DescFrec22"
            ></el-table-column>

            <el-table-column
              label="HORA 23"
              width="90"
              prop="hora23"
            ></el-table-column>
            <el-table-column
              label="FRECUENCIA 23"
              width="150"
              prop="DescFrec23"
            ></el-table-column>

            <el-table-column
              label="HORA 24"
              width="90"
              prop="hora24"
            ></el-table-column>
            <el-table-column
              label="FRECUENCIA 24"
              width="150"
              prop="DescFrec24"
            ></el-table-column>

            <el-table-column
              label="HORA 25"
              width="90"
              prop="hora25"
            ></el-table-column>
            <el-table-column
              label="FRECUENCIA 25"
              width="150"
              prop="DescFrec25"
            ></el-table-column>

            <el-table-column
              label="HORA 26"
              width="90"
              prop="hora26"
            ></el-table-column>
            <el-table-column
              label="FRECUENCIA 26"
              width="150"
              prop="DescFrec26"
            ></el-table-column>

            <el-table-column
              label="HORA 27"
              width="90"
              prop="hora27"
            ></el-table-column>
            <el-table-column
              label="FRECUENCIA 27"
              width="150"
              prop="DescFrec27"
            ></el-table-column>

            <el-table-column
              label="HORA 28"
              width="90"
              prop="hora28"
            ></el-table-column>
            <el-table-column
              label="FRECUENCIA 28"
              width="150"
              prop="DescFrec28"
            ></el-table-column>

            <el-table-column
              label="HORA 29"
              width="90"
              prop="hora29"
            ></el-table-column>
            <el-table-column
              label="FRECUENCIA 29"
              width="150"
              prop="DescFrec29"
            ></el-table-column>

            <el-table-column
              label="HORA 30"
              width="90"
              prop="hora30"
            ></el-table-column>
            <el-table-column
              label="FRECUENCIA 30"
              width="150"
              prop="DescFrec30"
            ></el-table-column>

            <el-table-column
              label="HORA 31"
              width="90"
              prop="hora31"
            ></el-table-column>
            <el-table-column
              label="FRECUENCIA 31"
              width="150"
              prop="DescFrec31"
            ></el-table-column>

            <el-table-column
              label="HORA 32"
              width="90"
              prop="hora32"
            ></el-table-column>
            <el-table-column
              label="FRECUENCIA 32"
              width="150"
              prop="DescFrec32"
            ></el-table-column>

            <el-table-column
              label="HORA 33"
              width="90"
              prop="hora33"
            ></el-table-column>
            <el-table-column
              label="FRECUENCIA 33"
              width="150"
              prop="DescFrec33"
            ></el-table-column>

            <el-table-column
              label="HORA 34"
              width="90"
              prop="hora34"
            ></el-table-column>
            <el-table-column
              label="FRECUENCIA 34"
              width="150"
              prop="DescFrec34"
            ></el-table-column>

            <el-table-column
              label="HORA 35"
              width="90"
              prop="hora35"
            ></el-table-column>
            <el-table-column
              label="FRECUENCIA 35"
              width="150"
              prop="DescFrec35"
            ></el-table-column>

            <el-table-column
              label="HORA 36"
              width="90"
              prop="hora36"
            ></el-table-column>
            <el-table-column
              label="FRECUENCIA 36"
              width="150"
              prop="DescFrec36"
            ></el-table-column>

            <el-table-column
              label="HORA 37"
              width="90"
              prop="hora37"
            ></el-table-column>
            <el-table-column
              label="FRECUENCIA 37"
              width="150"
              prop="DescFrec37"
            ></el-table-column>

            <el-table-column
              label="HORA 38"
              width="90"
              prop="hora38"
            ></el-table-column>
            <el-table-column
              label="FRECUENCIA 38"
              width="150"
              prop="DescFrec38"
            ></el-table-column>

            <el-table-column
              label="HORA 39"
              width="90"
              prop="hora39"
            ></el-table-column>
            <el-table-column
              label="FRECUENCIA 39"
              width="150"
              prop="DescFrec39"
            ></el-table-column>

            <el-table-column
              label="HORA 40"
              width="90"
              prop="hora40"
            ></el-table-column>
            <el-table-column
              label="FRECUENCIA 40"
              width="150"
              prop="DescFrec40"
            ></el-table-column>

            <div slot="empty"></div>
          </el-table>

          <template slot="footer"> </template>
        </modal>
      </div>

      <modal :show.sync="modalEliminarRolProgrmadoM" body-classes="p-0">
        <h6 slot="header" class="modal-title">
          <strong>{{
            objRolSelect == null ? "S/N" : objRolSelect.DescRuta
          }}</strong>
        </h6>
        <div style="margin-left: 1rem; margin-right: 1rem">
          Esta seguro de eliminar el ROL
          <strong>{{
            objRolSelect == null ? "S/N" : objRolSelect.detalle_rol_programado_m
          }}</strong>
        </div>
        <template slot="footer">
          <base-button type="danger" @click="deleteRolProgramadoM()"
            >ELIMINAR</base-button
          >
        </template>
      </modal>

      <modal :show.sync="modalEnviarDespachos" body-classes="p-0">
        <h6 slot="header" class="modal-title">
          <strong>{{
            objRolSelect == null ? "S/N" : objRolSelect.DescRuta
          }}</strong>
        </h6>
        <div style="margin-left: 1rem; margin-right: 1rem">
          Esta seguro de enviar los despachos del ROL
          <strong>{{
            objRolSelect == null ? "S/N" : objRolSelect.detalle_rol_programado_m
          }}</strong>
          para el dia
          <strong>{{
            fechaInicialRol == null ? "S/N" : fechaInicialRol
          }}</strong>
        </div>
        <template slot="footer">
          <base-button type="default" @click="sendDespachoProgramado()"
            >AUTORIZAR</base-button
          >
        </template>
      </modal>
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
      config_flatpicker: {
        allowInput: true,
        locale: Spanish,
        minDate: "2020-01-01",
        maxDate: "2050-01-01",
      },
      isVisibleLoadingSendDespachos: false,
      mListaUnidadesSalidasPanelBusqueda: [],
      mListLineasSalidasPanelBusqueda: [],
      loadingRolProgramadoloading: false,
      loadingRolProgramado: false,
      mSelectRutaSalidaPanelBusqueda: [],
      itemUnidadRolProgramado: null,
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
      objRolSelectD: null,
      fechaInicialRol: null,
      mListFrecuencia: [],
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

      hora21: null,
      hora22: null,
      hora23: null,
      hora24: null,
      hora25: null,
      hora26: null,
      hora27: null,
      hora28: null,
      hora29: null,
      hora30: null,
      hora31: null,
      hora32: null,
      hora33: null,
      hora34: null,
      hora35: null,
      hora36: null,
      hora37: null,
      hora38: null,
      hora39: null,
      hora40: null,

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

      frecuencia21: null,
      frecuencia22: null,
      frecuencia23: null,
      frecuencia24: null,
      frecuencia25: null,
      frecuencia26: null,
      frecuencia27: null,
      frecuencia28: null,
      frecuencia29: null,
      frecuencia30: null,
      frecuencia31: null,
      frecuencia32: null,
      frecuencia33: null,
      frecuencia34: null,
      frecuencia35: null,
      frecuencia36: null,
      frecuencia37: null,
      frecuencia38: null,
      frecuencia39: null,
      frecuencia40: null,

      isUpdate: false,
      modalEnviarDespachos: false,

      columns: [],

      modalEliminarRolProgrmadoM:false
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
      this.config_flatpicker.minDate = this.fechaInicialRol;
    },

    showModalRolProgramadoDetalle(item) {
      this.clearNuevoRolD();
      this.oModalAddRolDetalleD = true;
      this.objRolSelect = item;
      this.readAllLFrecuenciaRutas(item.idRuta);
      this.readRolProgramadoD();
    },

    async deleteRolProgramadoM() {
      try {
        var response = await this.$axios.delete(
          process.env.baseUrl + "/eliminarRolProgramadoM",
          {
            data: {
              token: this.token,
              rol_programado_m: this.objRolSelect.id_rol_programado_m,
            },
          }
        );

        if (response.data.status_code == 200) 
        {
          this.objRolSelect = null
          this.modalEliminarRolProgrmadoM = false
          this.readRolProgramado();
        } else {
          this.$notify({
            title: "ROL PROGRAMADO",
            message: response.data.msm,
            type: "danger",
          });
        }
      } catch (error) {
        this.$notify({
          title: "ROL PROGRAMADO",
          message: error.toString(),
          type: "danger",
        });
      }
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
    remoteMethodUnidadRolProgramado(query) {
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
          //console.log(datos.data)
          this.mListFrecuencia.push({
            idFrec: null,
            DescFrec: "Ninguna",
            idFrec: null,
          });
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
            unidad: "*",
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
            active_dia: this.isRolProgramadoXDia == false ? 0 : 1,
            isLunes: this.isLunes == false ? 0 : 1,
            isMartes: this.isMartes == false ? 0 : 1,
            isMiercoles: this.isMiercoles == false ? 0 : 1,
            isJueves: this.isJueves == false ? 0 : 1,
            isViernes: this.isViernes == false ? 0 : 1,
            isSabado: this.isSabado == false ? 0 : 1,
            isDomingo: this.isDomingo == false ? 0 : 1,
            isFeriado: this.isFeriado == false ? 0 : 1,
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

    showModalEliminarDespachoProgramado(item)
    {
      this.objRolSelect = item
      this.modalEliminarRolProgrmadoM = true
    },

    showModalSendDespachoProgramado(item) {
      this.objRolSelect = item;
      this.modalEnviarDespachos = true;
    },

    async sendDespachoProgramado() {
      this.modalEnviarDespachos = false;
      this.isVisibleLoadingSendDespachos = true;
      try {
        var response = await this.$axios.post(
          process.env.baseUrl + "/generarDespachoRolProgramado",
          {
            token: this.token,
            autodespacho_m: this.objRolSelect.id_rol_programado_m,
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
      this.isVisibleLoadingSendDespachos = false;
      this.objRolSelect = null;
      this.objRolSelectD = null;
    },

    async readRolProgramadoD() {
      this.loadingRolProgramadoD = true;
      this.mListRolProgramadoD = [];

      //await this.readAllLFrecuenciaRutas()

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

    async createNuevoRolD() {
      try {
        if (
          this.hora1 == null &&
          this.hora2 == null &&
          this.hora3 == null &&
          this.hora4 == null &&
          this.hora5 == null &&
          this.hora6 == null &&
          this.hora7 == null &&
          this.hora8 == null &&
          this.hora9 == null &&
          this.hora10 == null &&
          this.hora11 == null &&
          this.hora12 == null &&
          this.hora13 == null &&
          this.hora14 == null &&
          this.hora15 == null &&
          this.hora16 == null &&
          this.hora17 == null &&
          this.hora18 == null &&
          this.hora19 == null &&
          this.hora20 == null &&
          this.hora21 == null &&
          this.hora22 == null &&
          this.hora23 == null &&
          this.hora24 == null &&
          this.hora25 == null &&
          this.hora26 == null &&
          this.hora27 == null &&
          this.hora28 == null &&
          this.hora29 == null &&
          this.hora30 == null &&
          this.hora31 == null &&
          this.hora32 == null &&
          this.hora33 == null &&
          this.hora34 == null &&
          this.hora35 == null &&
          this.hora36 == null &&
          this.hora37 == null &&
          this.hora38 == null &&
          this.hora39 == null &&
          this.hora40 == null &&
          this.frecuencia1 == null &&
          this.frecuencia2 == null &&
          this.frecuencia3 == null &&
          this.frecuencia4 == null &&
          this.frecuencia5 == null &&
          this.frecuencia6 == null &&
          this.frecuencia7 == null &&
          this.frecuencia8 == null &&
          this.frecuencia9 == null &&
          this.frecuencia10 == null &&
          this.frecuencia11 == null &&
          this.frecuencia12 == null &&
          this.frecuencia13 == null &&
          this.frecuencia14 == null &&
          this.frecuencia15 == null &&
          this.frecuencia16 == null &&
          this.frecuencia17 == null &&
          this.frecuencia18 == null &&
          this.frecuencia19 == null &&
          this.frecuencia20 == null &&
          this.frecuencia21 == null &&
          this.frecuencia22 == null &&
          this.frecuencia23 == null &&
          this.frecuencia24 == null &&
          this.frecuencia25 == null &&
          this.frecuencia26 == null &&
          this.frecuencia27 == null &&
          this.frecuencia28 == null &&
          this.frecuencia29 == null &&
          this.frecuencia30 == null &&
          this.frecuencia31 == null &&
          this.frecuencia32 == null &&
          this.frecuencia33 == null &&
          this.frecuencia34 == null &&
          this.frecuencia35 == null &&
          this.frecuencia36 == null &&
          this.frecuencia37 == null &&
          this.frecuencia38 == null &&
          this.frecuencia39 == null &&
          this.frecuencia40 == null
        ) {
          this.$notify({
            title: "ROL PROGRAMADO",
            message: "INGRESE AL MENOS UNA HORA Y FRECUENCIA VALIDA",
            type: "danger",
          });
          return;
        }

        var response = null;
        if (this.isUpdate == false) {
          response = await this.$axios.post(
            process.env.baseUrl + "/createRolProgramadoD",
            {
              token: this.token,
              rol_programado_m: this.objRolSelect.id_rol_programado_m,
              unidad: this.itemUnidadRolProgramado,
              hora1: this.hora1,
              frecuencia1: this.frecuencia1,
              hora2: this.hora2,
              frecuencia2: this.frecuencia2,
              hora3: this.hora3,
              frecuencia3: this.frecuencia3,
              hora4: this.hora4,
              frecuencia4: this.frecuencia4,
              hora5: this.hora5,
              frecuencia5: this.frecuencia5,
              hora6: this.hora6,
              frecuencia6: this.frecuencia6,
              hora7: this.hora7,
              frecuencia7: this.frecuencia7,
              hora8: this.hora8,
              frecuencia8: this.frecuencia8,
              hora9: this.hora9,
              frecuencia9: this.frecuencia9,
              hora10: this.hora10,
              frecuencia10: this.frecuencia10,
              hora11: this.hora11,
              frecuencia11: this.frecuencia11,
              hora12: this.hora12,
              frecuencia12: this.frecuencia12,
              hora13: this.hora13,
              frecuencia13: this.frecuencia13,
              hora14: this.hora14,
              frecuencia14: this.frecuencia14,
              hora15: this.hora15,
              frecuencia15: this.frecuencia15,
              hora16: this.hora16,
              frecuencia16: this.frecuencia16,
              hora17: this.hora17,
              frecuencia17: this.frecuencia17,
              hora18: this.hora18,
              frecuencia18: this.frecuencia18,
              hora19: this.hora19,
              frecuencia19: this.frecuencia19,
              hora20: this.hora20,
              frecuencia20: this.frecuencia20,

              hora21: this.hora21,
              frecuencia21: this.frecuencia21,

              hora22: this.hora22,
              frecuencia22: this.frecuencia22,

              hora23: this.hora23,
              frecuencia23: this.frecuencia23,

              hora24: this.hora24,
              frecuencia24: this.frecuencia24,

              hora25: this.hora25,
              frecuencia25: this.frecuencia25,

              hora26: this.hora26,
              frecuencia26: this.frecuencia26,

              hora27: this.hora27,
              frecuencia27: this.frecuencia27,

              hora28: this.hora28,
              frecuencia28: this.frecuencia28,

              hora29: this.hora29,
              frecuencia29: this.frecuencia29,

              hora30: this.hora30,
              frecuencia30: this.frecuencia30,

              hora31: this.hora31,
              frecuencia31: this.frecuencia31,

              hora32: this.hora32,
              frecuencia32: this.frecuencia32,

              hora33: this.hora33,
              frecuencia33: this.frecuencia33,

              hora34: this.hora34,
              frecuencia34: this.frecuencia34,

              hora35: this.hora35,
              frecuencia35: this.frecuencia35,

              hora36: this.hora36,
              frecuencia36: this.frecuencia36,

              hora37: this.hora37,
              frecuencia37: this.frecuencia37,

              hora38: this.hora38,
              frecuencia38: this.frecuencia38,

              hora39: this.hora39,
              frecuencia39: this.frecuencia39,

              hora40: this.hora40,
              frecuencia40: this.frecuencia40,
            }
          );
        } else {
          response = await this.$axios.put(
            process.env.baseUrl + "/updateRolProgramadoD",
            {
              token: this.token,
              id_rol_d: this.objRolSelectD.id_despacho_programado_d,
              unidad:
                this.itemUnidadRolProgramado == ""
                  ? null
                  : this.itemUnidadRolProgramado,
              hora1: this.hora1,
              frecuencia1: this.frecuencia1,
              hora2: this.hora2,
              frecuencia2: this.frecuencia2,
              hora3: this.hora3,
              frecuencia3: this.frecuencia3,
              hora4: this.hora4,
              frecuencia4: this.frecuencia4,
              hora5: this.hora5,
              frecuencia5: this.frecuencia5,
              hora6: this.hora6,
              frecuencia6: this.frecuencia6,
              hora7: this.hora7,
              frecuencia7: this.frecuencia7,
              hora8: this.hora8,
              frecuencia8: this.frecuencia8,
              hora9: this.hora9,
              frecuencia9: this.frecuencia9,
              hora10: this.hora10,
              frecuencia10: this.frecuencia10,
              hora11: this.hora11,
              frecuencia11: this.frecuencia11,
              hora12: this.hora12,
              frecuencia12: this.frecuencia12,
              hora13: this.hora13,
              frecuencia13: this.frecuencia13,
              hora14: this.hora14,
              frecuencia14: this.frecuencia14,
              hora15: this.hora15,
              frecuencia15: this.frecuencia15,
              hora16: this.hora16,
              frecuencia16: this.frecuencia16,
              hora17: this.hora17,
              frecuencia17: this.frecuencia17,
              hora18: this.hora18,
              frecuencia18: this.frecuencia18,
              hora19: this.hora19,
              frecuencia19: this.frecuencia19,
              hora20: this.hora20,
              frecuencia20: this.frecuencia20,


              hora21: this.hora21,
              frecuencia21: this.frecuencia21,

              hora22: this.hora22,
              frecuencia22: this.frecuencia22,

              hora23: this.hora23,
              frecuencia23: this.frecuencia23,

              hora24: this.hora24,
              frecuencia24: this.frecuencia24,

              hora25: this.hora25,
              frecuencia25: this.frecuencia25,

              hora26: this.hora26,
              frecuencia26: this.frecuencia26,

              hora27: this.hora27,
              frecuencia27: this.frecuencia27,

              hora28: this.hora28,
              frecuencia28: this.frecuencia28,

              hora29: this.hora29,
              frecuencia29: this.frecuencia29,

              hora30: this.hora30,
              frecuencia30: this.frecuencia30,

              hora31: this.hora31,
              frecuencia31: this.frecuencia31,

              hora32: this.hora32,
              frecuencia32: this.frecuencia32,

              hora33: this.hora33,
              frecuencia33: this.frecuencia33,

              hora34: this.hora34,
              frecuencia34: this.frecuencia34,

              hora35: this.hora35,
              frecuencia35: this.frecuencia35,

              hora36: this.hora36,
              frecuencia36: this.frecuencia36,

              hora37: this.hora37,
              frecuencia37: this.frecuencia37,

              hora38: this.hora38,
              frecuencia38: this.frecuencia38,

              hora39: this.hora39,
              frecuencia39: this.frecuencia39,

              hora40: this.hora40,
              frecuencia40: this.frecuencia40,
            }
          );
        }

        if (response.data.status_code == 200) {
          this.clearNuevoRolD();
          this.readRolProgramadoD();
          this.isUpdate = false;
        } else {
          this.$notify({
            title: "ROL PROGRAMADO",
            message: response.data.msm,
            type: "danger",
          });
        }
      } catch (error) {
        this.$notify({
          title: "ROL PROGRAMADO",
          message: error.toString(),
          type: "danger",
        });
      }
    },
    clearNuevoRolD() {
      this.itemUnidadRolProgramado = null;
      this.hora1 = null;
      this.hora2 = null;
      this.hora3 = null;
      this.hora4 = null;
      this.hora5 = null;
      this.hora6 = null;
      this.hora7 = null;
      this.hora8 = null;
      this.hora9 = null;
      this.hora10 = null;
      this.hora11 = null;
      this.hora12 = null;
      this.hora13 = null;
      this.hora14 = null;
      this.hora15 = null;
      this.hora16 = null;
      this.hora17 = null;
      this.hora18 = null;
      this.hora19 = null;
      this.hora20 = null;
      this.frecuencia1 = null;
      this.frecuencia2 = null;
      this.frecuencia3 = null;
      this.frecuencia4 = null;
      this.frecuencia5 = null;
      this.frecuencia6 = null;
      this.frecuencia7 = null;
      this.frecuencia8 = null;
      this.frecuencia9 = null;
      this.frecuencia10 = null;
      this.frecuencia11 = null;
      this.frecuencia12 = null;
      this.frecuencia13 = null;
      this.frecuencia14 = null;
      this.frecuencia15 = null;
      this.frecuencia16 = null;
      this.frecuencia17 = null;
      this.frecuencia18 = null;
      this.frecuencia19 = null;
      this.frecuencia20 = null;
    },
    async eliminarRolD(item) {
      try {
        var response = await this.$axios.delete(
          process.env.baseUrl + "/eliminarRolProgramadoD",
          {
            data: {
              token: this.token,
              rol_programado_d: item.id_despacho_programado_d,
            },
          }
        );

        if (response.data.status_code == 200) {
          this.readRolProgramadoD();
        } else {
          this.$notify({
            title: "ROL PROGRAMADO",
            message: response.data.msm,
            type: "danger",
          });
        }
      } catch (error) {
        this.$notify({
          title: "ROL PROGRAMADO",
          message: error.toString(),
          type: "danger",
        });
      }

      this.clearNuevoRolD();
    },
    async updateRolD(item) {
      this.objRolSelectD = item;

      this.isUpdate = true;
      this.itemUnidadRolProgramado = item.unidad;
      this.hora1 = item.hora1;
      this.hora2 = item.hora2;
      this.hora3 = item.hora3;
      this.hora4 = item.hora4;
      this.hora5 = item.hora5;
      this.hora6 = item.hora6;
      this.hora7 = item.hora7;
      this.hora8 = item.hora8;
      this.hora9 = item.hora9;
      this.hora10 = item.hora10;
      this.hora11 = item.hora11;
      this.hora12 = item.hora12;
      this.hora13 = item.hora13;
      this.hora14 = item.hora14;
      this.hora15 = item.hora15;
      this.hora16 = item.hora16;
      this.hora17 = item.hora17;
      this.hora18 = item.hora18;
      this.hora19 = item.hora19;
      this.hora20 = item.hora20;

      this.hora21 = item.hora21;
      this.hora22 = item.hora22;
      this.hora23 = item.hora23;
      this.hora24 = item.hora24;
      this.hora25 = item.hora25;
      this.hora26 = item.hora26;
      this.hora27 = item.hora27;
      this.hora28 = item.hora28;
      this.hora29 = item.hora29;
      this.hora30 = item.hora30;
      this.hora31 = item.hora31;
      this.hora32 = item.hora32;
      this.hora33 = item.hora33;
      this.hora34 = item.hora34;
      this.hora35 = item.hora35;
      this.hora36 = item.hora36;
      this.hora37 = item.hora37;
      this.hora38 = item.hora38;
      this.hora39 = item.hora39;
      this.hora40 = item.hora40;

      this.frecuencia1 = item.frecuencia1;
      this.frecuencia2 = item.frecuencia2;
      this.frecuencia3 = item.frecuencia3;
      this.frecuencia4 = item.frecuencia4;
      this.frecuencia5 = item.frecuencia5;
      this.frecuencia6 = item.frecuencia6;
      this.frecuencia7 = item.frecuencia7;
      this.frecuencia8 = item.frecuencia8;
      this.frecuencia9 = item.frecuencia9;
      this.frecuencia10 = item.frecuencia10;
      this.frecuencia11 = item.frecuencia11;
      this.frecuencia12 = item.frecuencia12;
      this.frecuencia13 = item.frecuencia13;
      this.frecuencia14 = item.frecuencia14;
      this.frecuencia15 = item.frecuencia15;
      this.frecuencia16 = item.frecuencia16;
      this.frecuencia17 = item.frecuencia17;
      this.frecuencia18 = item.frecuencia18;
      this.frecuencia19 = item.frecuencia19;
      this.frecuencia20 = item.frecuencia20;

      this.frecuencia21 = item.frecuencia21;
      this.frecuencia22 = item.frecuencia22;
      this.frecuencia23 = item.frecuencia23;
      this.frecuencia24 = item.frecuencia24;
      this.frecuencia25 = item.frecuencia25;
      this.frecuencia26 = item.frecuencia26;
      this.frecuencia27 = item.frecuencia27;
      this.frecuencia28 = item.frecuencia28;
      this.frecuencia29 = item.frecuencia29;
      this.frecuencia30 = item.frecuencia30;
      this.frecuencia31 = item.frecuencia31;
      this.frecuencia32 = item.frecuencia32;
      this.frecuencia33 = item.frecuencia33;
      this.frecuencia34 = item.frecuencia34;
      this.frecuencia35 = item.frecuencia35;
      this.frecuencia36 = item.frecuencia36;
      this.frecuencia37 = item.frecuencia37;
      this.frecuencia38 = item.frecuencia38;
      this.frecuencia39 = item.frecuencia39;
      this.frecuencia40 = item.frecuencia40;
    },
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
.msmSendDespacho {
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  align-content: center;
}

.loader {
  border: 8px solid rgb(255, 255, 255);
  border-top: 8px solid #0772b9;
  border-radius: 50%;
  width: 3rem;
  height: 3rem;
  margin-right: 1rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loadingDespachos {
  background-color: rgba(0, 0, 0, 0.705);
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999999999999999999999999999999999999999999999999999;
}

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
