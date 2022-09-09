<template>
  <div class="content">
    <base-header>
      <div class="row align-items-center">
        <div class="col" style="margin-top:1rem;">
          <tabs tabNavClasses="nav-fill flex-column flex-sm-row" :centered="true">
            <tab-pane>
              <div slot="title" @click="initUnidadesFlotaVEhicular()">
                Unidades
              </div>

              <br />
              <card class="cardFlotavehicular no-border-card" body-classes="px-0 pb-1 cardBodyFlotavehicular"
                footer-classes="pb-2">
                <div class="row border-0">
                    <div class="col-12 text-right buttonNuevo">
                        <base-button @click="showModalAgregarUnidadFlotavehicular()" type="primary" icon size="sm">
                          <span class="btn-inner--icon"><i class="ni ni-fat-add"></i>Agregar Unidad</span>
                        </base-button>
                    </div>
                    
                    </div>
                  <div>
                  <el-table v-loading="loadingUnidadesFlotaVehicular" element-loading-text="Cargando..."
                    element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)"
                    class="table-responsive table-flush" :data="mListUnidadesFlotaVehicular"
                    header-row-class-name="thead-dark" height="calc(100vh - 13.4rem)">
                    <div slot="empty"></div>
                    <el-table-column v-for="column in tableColumnsUnidadesFlotaVehicular" :key="column.label"
                      v-bind="column">
                    </el-table-column>

                    <el-table-column label="Estado" min-width="150px" prop="idEstaVehi" sortable>
                      <template v-slot="{ row }">
                        <badge class="badge-dot mr-4" type="">
                          <i :class="`bg-${row.idEstaVehi == 1 ? 'success' : 'danger'
                          }`"></i>
                          <span class="status">{{
                              row.idEstaVehi == 1 ? "ACTIVO" : "INACTIVO"
                          }}</span>
                        </badge>
                      </template>
                    </el-table-column>

                    <el-table-column label="Informate" min-width="160px" prop="InfoCtrlVehi" sortable>
                      <template v-slot="{ row }">
                        <badge class="badge-dot mr-4" type="">
                          <i :class="`bg-${row.InfoCtrlVehi == 1 ? 'success' : 'danger'
                          }`"></i>
                          <span class="status">{{
                              row.InfoCtrlVehi == 1 ? "SI" : "NO"
                          }}</span>
                        </badge>
                      </template>
                    </el-table-column>

                    <el-table-column min-width="180px" align="right" label="Actions">
                      <div slot-scope="{ row }" class="d-flex">
                        <base-button class="edit" type="success" size="sm" icon @click="editUnidad(row)">
                          <i class="text-white ni ni-ruler-pencil"></i>
                        </base-button>
                        <base-button class="remove btn-link" :type="row.idEstaVehi == 1 ? 'danger' : 'primary'" size="sm" icon @click="sendChangeEstadoUnidad(row)">
                          <i :class="row.idEstaVehi == 1 ? 'text-white ni ni-fat-remove' : 'text-white ni ni-check-bold'"></i>
                        </base-button>
                        
                      </div>
                    </el-table-column>
                  </el-table>
                </div>
              </card>
            </tab-pane>
            <tab-pane>
              <div slot="title" @click="initGruposFlotaVehicular()">Grupos</div>
              <br />
              <card class="cardFlotavehicular no-border-card" body-classes="px-0 pb-1 cardBodyFlotavehicular"
                footer-classes="pb-2">
                <div class="row border-0">
                  <div class="col-12 text-right buttonNuevo">
                      <base-button type="primary" icon size="sm" @click="showModalAgregarGrupoFlotavehicular()">
                        <span class="btn-inner--icon"><i class="ni ni-fat-add"></i>Agregar Grupo</span>
                      </base-button>
                  </div>
                </div>
                <div>
                  <el-table v-loading="loadingGruposFlotaVehicular" element-loading-text="Cargando..."
                    element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)"
                    :data="mListGruposFlotaVehicular" height="calc(100vh - 13.4rem)"
                    header-row-class-name="thead-dark">
                    
                    <div slot="empty"></div>
                      
                    <el-table-column v-for="column in tableColumnsGruposFlotaVehicular" :key="column.label"
                      v-bind="column">
                    </el-table-column>

                    <el-table-column label="Estado" min-width="150px" prop="activo" sortable>
                      <template v-slot="{ row }">
                        <badge class="badge-dot mr-4" type="">
                          <i :class="`bg-${row.activo == 1 ? 'success' : 'danger'
                          }`"></i>
                          <span class="status">{{
                              row.activo == 1 ? "ACTIVO" : "INACTIVO"
                          }}</span>
                        </badge>
                      </template>
                    </el-table-column>

                    <el-table-column min-width="180px" align="right" label="Actions">
                      <div slot-scope="{ row }" class="d-flex">
                        <base-button class="edit" type="success" size="sm" icon @click="editGrupo(row)">
                          <i class="text-white ni ni-ruler-pencil"></i>
                        </base-button>
                        <base-button class="remove btn-link" :type="row.activo == 1 ? 'danger' : 'primary'" size="sm" icon @click="sendChangeEstadoGrupo(row)">
                          <i :class="row.activo == 1 ? 'text-white ni ni-fat-remove' : 'text-white ni ni-check-bold'"></i>
                        </base-button>
                      </div>
                    </el-table-column>
                  </el-table>
                </div>
              </card>
            </tab-pane>
            <tab-pane>
              <div slot="title" @click="initPropietariosFlotaVehicular()">
                Propietarios
              </div>
              <br />
              <card class="cardFlotavehicular no-border-card" body-classes="px-0 pb-1 cardBodyFlotavehicular"
                footer-classes="pb-2">
                <div class="row border-0">
                  <div class="col-12 text-right buttonNuevo">
                      <base-button type="primary" icon size="sm" @click="showModalAgregarPropietarioFlotavehicular()">
                        <span class="btn-inner--icon"><i class="ni ni-fat-add"></i>Agregar Propietario</span>
                      </base-button>
                  </div>
                </div>
                <div>

                  <el-table v-loading="loadingPropietariosFlotaVehicular" element-loading-text="Cargando..."
                    element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)"
                    :data="mListPropietariosFlotaVehicular"
                    height="calc(100vh - 13.4rem)" header-row-class-name="thead-dark">
                    
                    <div slot="empty"></div>
                    <el-table-column v-for="column in tableColumnsPropietariosFlotaVehicular" :key="column.label"
                      v-bind="column">
                    </el-table-column>
                    <el-table-column label="Estado" min-width="140px" prop="activo" sortable>
                      <template v-slot="{ row }">
                        <badge class="badge-dot mr-4" type="">
                          <i :class="`bg-${row.activo == 1 ? 'success' : 'danger'
                          }`"></i>
                          <span class="status">{{
                              row.activo == 1 ? "ACTIVO" : "INACTIVO"
                          }}</span>
                        </badge>
                      </template>
                    </el-table-column>

                    <el-table-column min-width="180px" align="right" label="Actions">
                      <div slot-scope="{ $index, row }" class="d-flex">
                        <base-button class="edit" type="success" size="sm" icon @click="editPropietario(row)">
                          <i class="text-white ni ni-ruler-pencil"></i>
                        </base-button>
                        <base-button :type="row.activo == 1 ? 'danger' : 'primary'" size="sm" icon @click="sendChangeEstadoPropietario(row)">
                          <i :class="row.activo == 1 ? 'text-white ni ni-fat-remove' : 'text-white ni ni-check-bold'"></i>
                        </base-button>
                        <base-button @click.native="initPropietariosUnidadSinAsignacionFlotaVehicular($index, row)"
                          class="remove btn-link" type="default" size="sm" icon>
                          <i class="text-white ni ni-bus-front-12"></i>
                        </base-button>
                      </div>
                    </el-table-column>
                  </el-table>
                </div>
              </card>
            </tab-pane>
            <tab-pane>
              <div slot="title" @click="initAdministrativosFlotaVehicular()">
                Usuarios Admin..
              </div>
              <br />
              <card class="cardFlotavehicular no-border-card" body-classes="px-0 pb-1 cardBodyFlotavehicular"
                footer-classes="pb-2">
                <div class="row border-0">
                  <div class="col-12 text-right buttonNuevo">
                      <base-button type="primary" icon size="sm" @click="showModalAgregarAdministradorFlotavehicular()">
                        <span class="btn-inner--icon"><i class="ni ni-fat-add"></i>Agregar Administrador</span>
                      </base-button>
                  </div>
                </div>
                <div>
                  <el-table v-loading="loadingAdministrativosFlotaVehicular" element-loading-text="Cargando..."
                    element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)"
                    :data="mListAdministrativosFlotaVehicular"
                    height="calc(100vh - 13.4rem)"
                    header-row-class-name="thead-dark">
                    <div slot="empty"></div>
                    <el-table-column v-for="column in tableColumnsAdministrativosFlotaVehicular" :key="column.label"
                      v-bind="column">
                    </el-table-column>
                    
                    <el-table-column label="Estado" min-width="150px" prop="activo" sortable>
                      <template v-slot="{ row }">
                        <badge class="badge-dot mr-4" type="">
                          <i :class="`bg-${row.activo == 1 ? 'success' : 'danger'
                          }`"></i>
                          <span class="status">{{
                              row.activo == 1 ? "ACTIVO" : "INACTIVO"
                          }}</span>
                        </badge>
                      </template>
                    </el-table-column>

                    <el-table-column min-width="180px" align="right" label="Actions">
                      <div slot-scope="{ $index, row }" class="d-flex">
                        <base-button class="edit" type="success" size="sm" icon @click="editAdministrador(row)">
                          <i class="text-white ni ni-ruler-pencil"></i>
                        </base-button>
                        <base-button class="remove btn-link" :type="row.activo == 1 ? 'danger' : 'primary'" size="sm" icon @click="sendChangeEstadoAdministrador(row)">
                          <i :class="row.activo == 1 ? 'text-white ni ni-fat-remove' : 'text-white ni ni-check-bold'"></i>
                        </base-button>

                        <base-button @click.native="showModalPermisosFlotaVehicular($index, row)"
                          class="remove btn-link" type="warning" size="sm" icon>
                          <i class="text-white ni ni-key-25"></i>
                        </base-button>
                      </div>
                    </el-table-column>
                  </el-table>
                </div>
              </card>
            </tab-pane>

            <tab-pane title="Choferes">
              <div slot="title" @click="initChoferesFlotaVehicular()">
                Choferes
              </div>
              <br />
              <card class="cardFlotavehicular no-border-card" body-classes="px-0 pb-1 cardBodyFlotavehicular"
                footer-classes="pb-2">
                <div class="row border-0">
                  <div class="col-12 text-right buttonNuevo">
                      <base-button type="primary" icon size="sm" @click="showModalAgregarChoferFlotavehicular()">
                        <span class="btn-inner--icon"><i class="ni ni-fat-add"></i>Agregar Chofer</span>
                      </base-button>
                  </div>
                </div>
                <div>
                  <el-table v-loading="loadingChoferesFlotaVehicular" element-loading-text="Cargando..."
                    element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)"
                    :data="mListChoferesFlotaVehicular" height="calc(100vh - 13.4rem)"
                    header-row-class-name="thead-dark">
                    <div slot="empty"></div>
                    <el-table-column v-for="column in tableColumnsChoferesFlotaVehicular" :key="column.label"
                      v-bind="column">
                    </el-table-column>

                    <el-table-column min-width="180px" align="right" label="Actions">
                      <div slot-scope="{ $index, row }" class="d-flex">
                        <base-button class="edit" type="success" size="sm" icon @click="editChofer(row)">
                          <i class="text-white ni ni-ruler-pencil"></i>
                        </base-button>
                        <base-button class="remove btn-link" type="danger" size="sm" icon @click="sendDeleteChofer(row)">
                          <i class="text-white ni ni-fat-remove"></i>
                        </base-button>

                        <base-button @click.native="initChoferesUnidadSinAsignacionFlotaVehicular($index, row)"
                          class="remove btn-link" type="default" size="sm" icon>
                          <i class="text-white ni ni-bus-front-12"></i>
                        </base-button>
                      </div>
                    </el-table-column>
                  </el-table>
                </div>
              </card>
            </tab-pane>
          </tabs>
        </div>
      </div>
    </base-header>


    <!--Classic modal-->
    <modal :show.sync="modalPermisosUsuariosAdminFlotaVehicular">


      <template slot="header">
        <span>{{ otitleModalUsuarioAdmin }}</span>
      </template>

      <v-jsoneditor v-model="jsonPermisosUsuario" :plus="false" height="20rem" @error="onError"></v-jsoneditor>


      <template slot="footer">
        <base-button type="primary" @click="updatePermisosJSONAdministrativos()">Guardar Cambios</base-button>
        <base-button type="link" class="ml-auto" @click="modalPermisosUsuariosAdminFlotaVehicular = false">Cancelar
        </base-button>
      </template>

    </modal>


    <!--Form modal Choferes Asignar Unidad-->
    <modal :show.sync="modalChoferesFlotaVehicular" size="sm" body-classes="p-0" gradient="default"
               modal-classes="modal-danger modal-dialog-centered">
      <h6 slot="header" class="modal-title">{{ this.modalTitleAsignarChofer }}</h6>
      <card type="secondary" header-classes="bg-transparent pb-5" body-classes="px-lg-5 py-lg-5" class="border-0 mb-0">
         <div class="text-muted text-center  mb-3">
            <el-select  placeholder="Unidades sin chofer" v-model="mSelectUnidadChofer">
              <el-option v-for="item in mListChoferesUnidadesSinAsignacion" :key="item.CodiVehi" :label="item.nombres" :value="item.CodiVehi">
                <span style="float: left">{{ item.CodiVehi }}</span>
                <span :style="item.nombres == null ? 'float: right; color: green; font-size: 13px' : 'float: right; color: red; font-size: 13px'">{{ item.nombres == null ? 'Libre' : item.nombres }}</span>
              </el-option>
            </el-select>
          </div>
          <div class="text-center">
          <base-button type="primary" @click="sendAsignarChoferUnidad()" native-type="submit">Asignar</base-button>
        </div>

        
      </card>

    </modal>

     <!--Form modal Agregar Chofer-->
     <modal :show.sync="modalAgregarChoferFlotaVehicular">
      <validation-observer v-slot="{handleSubmit}" ref="formValidator">
      <form class="needs-validation"
            @submit.prevent="handleSubmit(firstFormSubmit)">
        <div class="form-row">
          <div class="col-md-6">
            <base-input
            :disabled="editedIndexChofer == 1"
              name="Usuario"
              placeholder="Usuario"
              prepend-icon="ni ni-circle-08"
              rules="required"
              v-model="usuarioChofer">
            </base-input>
          </div>
          <div class="col-md-6">
            <base-input
              prepend-icon="ni ni-mobile-button"
              name="Teléfono"
              type="number"
              placeholder="Teléfono"
              rules="required"
              v-model="telefonoChofer">
            </base-input>
          </div>
        </div>
        <div class="form-row">
          <div class="col-md-6">
            <base-input
              prepend-icon="ni ni-badge"
              name="Nombre"
              placeholder="Nombre Completo"
              rules="required"
              v-model="nombreChofer">
            </base-input>
          </div>
          <div class="col-md-6">
            <base-input
            prepend-icon="ni ni-key-25"
              name="Contraseña"
              placeholder="Contraseña"
              rules="required"
              v-model="passwordChofer">
            </base-input>
          </div> 
        </div>
        <div class="form-row">
          <div class="col-md-12">
            <base-input
              prepend-icon="ni ni-email-83"
              type="email"
              name="Email"
              placeholder="Email"
              rules="required"
              v-model="emailChofer">
            </base-input>
          </div>
        </div>
        <div class="text-right">
          <base-button type="danger" @click="showModalAgregarChoferFlotavehicular()">Cancelar</base-button>
          <base-button v-if="editedIndexChofer == -1" type="primary" @click="sendRegisterChofer()" native-type="submit">Agregar</base-button>
          <base-button v-else type="primary" @click="sendUpdateChofer()" native-type="submit">Actualizar</base-button>
        </div>
      </form>
    </validation-observer>
       
    </modal>

    <!--Form modal Agregar Propietario-->
    <modal :show.sync="modalAgregarPropietarioFlotaVehicular" >
      <validation-observer v-slot="{handleSubmit}" ref="formValidator">
      <form class="needs-validation"
            @submit.prevent="handleSubmit(firstFormSubmit)">
        <div class="form-row">
          <div class="col-md-6">
            <base-input
              :disabled="editedIndexPropietario == 1"
              name="Código"
              placeholder="Código"
              prepend-icon="ni ni-circle-08"
              rules="required"
              v-model="codigoPropietario">
            </base-input>
          </div>
          <div class="col-md-6">
            <base-input
              prepend-icon="ni ni-badge"
              name="Nombre"
              placeholder="Nombre Completo"
              rules="required"
              v-model="nombrePropietario">
            </base-input>
          </div>
        </div>
        <div class="form-row">  
          <div class="col-md-6">
            <base-input
              name="Usuario"
              placeholder="Usuario"
              prepend-icon="ni ni-circle-08"
              rules="required"
              v-model="usuarioPropietario">
            </base-input>
          </div>
            <div class="col-md-6">
              <base-input
              prepend-icon="ni ni-key-25"
                name="Contraseña"
                placeholder="Contraseña"
                rules="required"
                v-model="passwordPropietario">
              </base-input>
            </div> 
          </div>
        
        <div class="text-right">
          <base-button type="danger" @click="showModalAgregarPropietarioFlotavehicular()">Cancelar</base-button>
          <base-button type="primary" v-if="editedIndexPropietario == -1" @click="sendRegisterPropietario()" native-type="submit">Agregar</base-button>
          <base-button type="primary" v-else @click="sendUpdatePropietario()" native-type="submit">Actualizar</base-button>
        </div>
      </form>
    </validation-observer>
       
    </modal>

     <!--Form modal Propietario Vincular Unidad-->
     <modal :show.sync="modalPropietariosFlotaVehicular" size="lg" body-classes="p-0" gradient="default"
               modal-classes="modal-danger modal-dialog-centered">
      <h6 slot="header" class="modal-title">{{ this.modalTitleVincularPropietario }}</h6>
      <card type="secondary" header-classes="bg-transparent pb-5" class="border-0 mb-0">
        <div style="text-align: center">
            <el-transfer
              style="text-align: left; display: inline-block"
              v-model="mListUnidadesVinculadasPropietario"
              filter-placeholder="Unidades"
              filterable
              :titles="['Unidades', 'Unidades Propietario']"
              :button-texts="['Desvincular', 'Vincular']"
              @change="handleChange"
              :data="mListPropietariosUnidadesSinAsignacion">
            </el-transfer>
        </div>
      </card>
    </modal>

     <!--Form modal Agregar Unidad-->
     <modal :show.sync="modalAgregarUnidadFlotaVehicular" >
      <validation-observer v-slot="{handleSubmit}" ref="formValidator">
      <form class="needs-validation"
            @submit.prevent="handleSubmit(firstFormSubmit)">
        <div class="form-row">
          <div class="col-md-6">
            <base-input
              :disabled="editedIndexUnidad == 1"
              name="Unidad"
              placeholder="Unidad"
              prepend-icon="ni ni-bus-front-12"
              rules="required"
              v-model="unidadVehiculo">
            </base-input>
          </div>
          <div class="col-md-6">
            <base-input
              prepend-icon="ni ni-single-copy-04"
              name="Serie"
              placeholder="Serie"
              rules="required"
              v-model="serieVehiculo">
            </base-input>
          </div>
        </div>
        <div class="form-row">  
          <div class="col-md-6">
            <base-input
              name="Placa"
              placeholder="Placa"
              prepend-icon="ni ni-paper-diploma"
              rules="required"
              v-model="placaVehiculo">
            </base-input>
          </div>
            <div class="col-md-6">
              <base-input
                prepend-icon="ni ni-mobile-button"
                name="Número Sim"
                placeholder="Número Sim"
                v-model="numsimVehiculo">
              </base-input>
            </div> 
          </div>
        
        <div class="text-right">
          <base-button type="danger" @click="showModalAgregarUnidadFlotavehicular()">Cancelar</base-button>
          <base-button type="primary" v-if="editedIndexUnidad == -1" @click="sendRegisterUnidad()" native-type="submit">Agregar</base-button>
          <base-button type="primary" v-else @click="sendUpdateUnidad()" native-type="submit">Actualizar</base-button>
        </div>
      </form>
    </validation-observer>
       
    </modal>

    <!--Form modal Agregar Grupo-->
    <modal :show.sync="modalAgregarGrupoFlotaVehicular" >
      <validation-observer v-slot="{handleSubmit}" ref="formValidator">
      <form class="needs-validation"
            @submit.prevent="handleSubmit(firstFormSubmit)">
        <div class="form-row">
          <div class="col-md-6">
            <base-input
              name="Descripción"
              placeholder="Descripción"
              prepend-icon="ni ni-single-copy-04"
              rules="required"
              v-model="descripcionGrupo">
            </base-input>
          </div>
          <div class="col-md-6">
            <base-input
              prepend-icon="ni ni-single-copy-04"
              name="Fondo"
              placeholder="Fondo"
              rules="required"
              v-model="fondoGrupo">
            </base-input>
          </div>
        </div>
        <div class="form-row">  
          <div class="col-md-6">
            <base-input
              name="Texto"
              placeholder="Texto"
              prepend-icon="ni ni-single-copy-04"
              rules="required"
              v-model="textoGrupo">
            </base-input>
          </div>
            <div class="col-md-6">
              <base-input
                prepend-icon="ni ni-mobile-button"
                name="Línea"
                placeholder="Línea"
                v-model="lineaGrupo">
              </base-input>
            </div> 
          </div>
        
        <div class="text-right">
          <base-button type="danger" @click="showModalAgregarGrupoFlotavehicular()">Cancelar</base-button>
          <base-button type="primary" v-if="editedIndexGrupo == -1" @click="sendRegisterGrupo()" native-type="submit">Agregar</base-button>
          <base-button type="primary" v-else @click="sendUpdateGrupo()" native-type="submit">Actualizar</base-button>
        </div>
      </form>
    </validation-observer>
       
    </modal>

    <!--Form modal Agregar Admins-->
    <modal :show.sync="modalAgregarAdministradorFlotaVehicular">
      <validation-observer v-slot="{handleSubmit}" ref="formValidator">
      <form class="needs-validation"
            @submit.prevent="handleSubmit(firstFormSubmit)">
        <div class="form-row">
          <div class="col-md-6">
            <base-input
              :disabled="editedIndexAdministrador == 1"
              name="Código"
              placeholder="Código"
              prepend-icon="ni ni-circle-08"
              rules="required"
              v-model="codigoAdmin">
            </base-input>
          </div>
          <div class="col-md-6">
            <base-input
              prepend-icon="ni ni-circle-08"
              name="Usuario"
              placeholder="Usuario"
              rules="required"
              v-model="usuarioAdmin">
            </base-input>
          </div>
        </div>
        <div class="form-row">  
          <div class="col-md-6">
            <base-input
              name="Nombre Completo"
              placeholder="Nombre Completo"
              prepend-icon="ni ni-badge"
              rules="required"
              v-model="nombreAdmin">
            </base-input>
          </div> 
          <div class="col-md-6">
            <base-input
              name="Contraseña"
              placeholder="Contraseña"
              prepend-icon="ni ni-key-25"
              rules="required"
              v-model="passAdmin">
            </base-input>
          </div> 
        </div>
        <div class="form-row">  
          <div class="col-md-12">
            <el-select  placeholder="Terminales" v-model="mSelectTerminalAdmin" style="width:450px">
              <el-option v-for="item in mListTerminalesAdmin" :key="item.CodiTerm" :label="item.DescTerm" :value="item.CodiTerm">
              </el-option>
            </el-select>
          </div>
        </div>
        <br>
        <div class="text-right">
          <base-button type="danger" @click="showModalAgregarAdministradorFlotavehicular()">Cancelar</base-button>
          <base-button type="primary" v-if="editedIndexAdministrador == -1" @click="sendRegisterAdministrador()" native-type="submit">Agregar</base-button>
          <base-button type="primary" v-else @click="sendUpdateAdministrador()" native-type="submit">Actualizar</base-button>
        </div>
      </form>
    </validation-observer>
       
    </modal>

  </div>
</template>

<script>
  
import { Table, TableColumn, Select, Option, Notification, Transfer } from "element-ui";

import RouteBreadCrumb from "@/components/argon-core/Breadcrumb/RouteBreadcrumb";
import { Modal, BasePagination } from "@/components/argon-core";
import clientPaginationMixin from "~/components/tables/PaginatedTables/clientPaginationMixin";
import swal from "sweetalert2";
import Tabs from "@/components/argon-core/Tabs/Tabs";
import TabPane from "@/components/argon-core/Tabs/Tab";
import VJsoneditor from 'v-jsoneditor'
import Swal from 'sweetalert2'
export default {
  
  mixins: [clientPaginationMixin],
  layout: "DashboardLayout",
  components: {
    Tabs,
    Modal,
    TabPane,
    BasePagination,
    RouteBreadCrumb,
    VJsoneditor,
    [Select.name]: Select,
    [Option.name]: Option,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Notification.name]: Notification,
    [Transfer.name]: Transfer
  },
  data() {
    return {
      token: this.$cookies.get("token"),
      usuarioChofer:'',
      telefonoChofer:'',
      nombreChofer:'',
      passwordChofer:'',
      emailChofer:'',
      modalTitleAsignarChofer:'',
      usuarioChoferUnidad:'',
      validaChofer:0,
      validaPropietario:0,
      validaUnidad:0,
      validaGrupo:0,
      validaAdministrador:0,
      mSelectUnidadChofer:null,
      rowSeleccionadoChofer:[],
      indexSeleccionadoChofer:'',
      mListUnidadesVinculadasPropietario:[],
      mSelectUnidadPropietarioVD:[],
      rowSeleccionadoPropietario:[],
      indexSeleccionadoPropietario:'',
      modalTitleVincularPropietario:'',
      usuarioPropietarioUnidad:'',
      codigoPropietario:'',
      usuarioPropietario:'',
      nombrePropietario:'',
      passwordPropietario:'',
      editedIndexPropietario:-1,
      editedIndexUnidad:-1,
      editedIndexGrupo:-1,
      editedIndexChofer:-1,
      editedIndexAdministrador:-1,
      unidadVehiculo:'',
      serieVehiculo:'',
      placaVehiculo:'',
      numsimVehiculo:'',
      descripcionGrupo:'',
      fondoGrupo:'',
      textoGrupo:'',
      lineaGrupo:'',
      grupoId:'',
      codigoAdmin:'',
      usuarioAdmin:'',
      nombreAdmin:'',
      passAdmin:'',
      mSelectTerminalAdmin:'',
      mListTerminalesAdmin:[],
      currentPageUnidadesFlotaVehicular: 1,
      loadingUnidadesFlotaVehicular: false,
      loadingGruposFlotaVehicular: false,
      loadingPropietariosFlotaVehicular: false,
      loadingAdministrativosFlotaVehicular: false,
      loadingChoferesFlotaVehicular: false,
      modalPermisosUsuariosAdminFlotaVehicular: false,
      modalChoferesFlotaVehicular: false,
      modalPropietariosFlotaVehicular:false,
      modalAgregarChoferFlotaVehicular:false,
      modalAgregarPropietarioFlotaVehicular:false,
      modalAgregarUnidadFlotaVehicular:false,
      modalAgregarGrupoFlotaVehicular:false,
      modalAgregarAdministradorFlotaVehicular:false,
      tableColumnsUnidadesFlotaVehicular: [
        {
          prop: "CodiVehi",
          label: "Unidad",
          minWidth: 145,
          sortable: true,
        },
        {
          prop: "CodiDispVehi",
          label: "Serie",
          minWidth: 170,
        },
        {
          prop: "PlacVehi",
          label: "Placa",
          minWidth: 130,
        },
        {
          prop: "NumeSIMVehi",
          label: "Número Sim",
          minWidth: 160,
        },
      ],
      tableColumnsGruposFlotaVehicular: [
        {
          prop: "id",
          label: "Código",
          minWidth: 120,
          sortable: true,
        },
        {
          prop: "descripcion",
          label: "Descripción",
          minWidth: 170,
        },
        {
          prop: "color",
          label: "Fondo",
          minWidth: 110,
        },
        {
          prop: "color1",
          label: "Texto",
          minWidth: 160,
        },
        {
          prop: "color2",
          label: "Línea",
          minWidth: 160,
        },
      ],
      tableColumnsPropietariosFlotaVehicular: [
        {
          prop: "CodiObse",
          label: "Código",
          minWidth: 140,
          sortable: true,
        },
        {
          prop: "AliaObse",
          label: "Nombres y Apellidos",
          minWidth: 220,
        },
        {
          prop: "UsuaObse",
          label: "Usuario",
          minWidth: 140,
        },
        {
          prop: "ClavObse",
          label: "Contraseña",
          minWidth: 140,
        },
        {
          prop: "descripcion",
          label: "Descripción",
          minWidth: 220,
        },
      ],
      tableColumnsAdministrativosFlotaVehicular: [
        {
          prop: "CodiUsua",
          label: "Código",
          minWidth: 130,
          sortable: true,
        },
        {
          prop: "NombApellUsua",
          label: "Nombres y Apellidos",
          minWidth: 250,
        },
        {
          prop: "NombUsua",
          label: "Usuario",
          minWidth: 140,
        },
        {
          prop: "ClavUsua",
          label: "Contraseña",
          minWidth: 140,
        },
        {
          prop: "DescTerm",
          label: "Terminal",
          minWidth: 160,
        },
      ],
      tableColumnsChoferesFlotaVehicular: [
        {
          prop: "usuario",
          label: "Usuario",
          minWidth: 150,
          sortable: true,
        },
        {
          prop: "constrasenia",
          label: "Contraseña",
          minWidth: 150,
        },
        {
          prop: "nombres",
          label: "Nombres y Apellidos",
          minWidth: 200,
        },
        {
          prop: "email",
          label: "Email",
          minWidth: 200,
        },
        {
          prop: "telefono",
          label: "Teléfono",
          minWidth: 150,
        },
        {
          prop: "CodiVehi",
          label: "Unidad",
          minWidth: 120,
        },
      ],
      mListUnidadesFlotaVehicular: [],
      mListGruposFlotaVehicular: [],
      mListPropietariosFlotaVehicular: [],
      mListAdministrativosFlotaVehicular: [],
      mListChoferesFlotaVehicular: [],
      selectedRowsUnidadesFlotaVehicular: [],
      jsonPermisosUsuario: null,
      oItemAdministrativoFlotaVehicular: null,
      otitleModalUsuarioAdmin: '',
      mListChoferesUnidadesSinAsignacion : [],
      mListPropietariosUnidadesSinAsignacion: []
    };
    
  },
  methods: {
    handleChange(value, direction, movedKeys) {
        if(direction == "right"){
          this.mSelectUnidadPropietarioVD = []
          this.mSelectUnidadPropietarioVD.push(...movedKeys)
          this.sendvincularUnidadPropietario()
        }else{
          this.mSelectUnidadPropietarioVD = []
          this.mSelectUnidadPropietarioVD.push(...movedKeys)
          this.desvincularUnidadPropietario()
        }
        
    },
    initUnidadesFlotaVEhicular: async function () {
      this.mListUnidadesFlotaVehicular = [];
      this.loadingUnidadesFlotaVehicular = true;
      try {
        var datos = await this.$axios.post(
          process.env.baseUrlPanel + "/unidades",
          {
            token: this.token,
          }
        );

        if (datos.data.status_code == 200) {
          this.mListUnidadesFlotaVehicular.push(...datos.data.data);
        } else if (datos.data.status_code == 300) {
          Notification.info({
            title: "Flota Vehicular",
            message: "No existen unidades registradas",
          });
        } else {
          Notification.error({
            title: "Error Api Flota Vehicular",
            message: datos.data.msm,
          });
        }
      } catch (error) {
        Notification.error({ title: "Error Catch", msm: error.toString() });
      }
      this.loadingUnidadesFlotaVehicular = false;
    },
    initGruposFlotaVehicular: async function () {
      this.mListGruposFlotaVehicular = [];
      this.loadingGruposFlotaVehicular = true;
      try {
        var datos = await this.$axios.post(
          process.env.baseUrlPanel + "/grupos",
          {
            token: this.token,
          }
        );

        if (datos.data.status_code == 200) {
          this.mListGruposFlotaVehicular.push(...datos.data.data);
        } else if (datos.data.status_code == 300) {
          Notification.info({
            title: "Grupos",
            message: "No existen grupos registradas",
          });
        } else {
          Notification.error({
            title: "Error Api Grupos",
            message: datos.data.msm,
          });
        }
      } catch (error) {
        Notification.error({ title: "Error Catch", msm: error.toString() });
      }
      this.loadingGruposFlotaVehicular = false;
    },
    initPropietariosFlotaVehicular: async function () {
      this.mListPropietariosFlotaVehicular = [];
      this.loadingPropietariosFlotaVehicular = true;
      try {
        var datos = await this.$axios.post(
          process.env.baseUrlPanel + "/read-propietarios",
          {
            token: this.token,
          }
        );

        if (datos.data.status_code == 200) {
          this.mListPropietariosFlotaVehicular.push(...datos.data.data);
        } else if (datos.data.status_code == 300) {
          Notification.info({
            title: "Propietarios",
            message: "No existen Propietarios registradas",
          });
        } else {
          Notification.error({
            title: "Error Api Propietarios",
            message: datos.data.msm,
          });
        }
      } catch (error) {
        Notification.error({ title: "Error Catch", msm: error.toString() });
      }
      this.loadingPropietariosFlotaVehicular = false;
    },
    initAdministrativosFlotaVehicular: async function () {
      this.initTerminalesFlotaVehicular();
      this.mListAdministrativosFlotaVehicular = [];
      this.loadingAdministrativosFlotaVehicular = true;
      try {
        var datos = await this.$axios.post(
          process.env.baseUrlPanel + "/read-administrativos",
          {
            token: this.token,
          }
        );

        if (datos.data.status_code == 200) {
          this.mListAdministrativosFlotaVehicular.push(...datos.data.data);
        } else if (datos.data.status_code == 300) {
          Notification.info({
            title: "Administrativos",
            message: "No existen Administrativos registradas",
          });
        } else {
          Notification.error({
            title: "Error Api Administrativos",
            message: datos.data.msm,
          });
        }
      } catch (error) {
        Notification.error({ title: "Error Catch", msm: error.toString() });
      }
      this.loadingAdministrativosFlotaVehicular = false;
    },
    initTerminalesFlotaVehicular: async function () {
      this.mListTerminalesAdmin = [];
      try {
        var datos = await this.$axios.post(
          process.env.baseUrlPanel + "/read-terminales",
          {
            token: this.token,
          }
        );

        if (datos.data.status_code == 200) {
          this.mListTerminalesAdmin.push(...datos.data.data);
        } else if (datos.data.status_code == 300) {
          Notification.info({
            title: "Terminales",
            message: "No existen terminales registradas",
          });
        } else {
          Notification.error({
            title: "Error Api Terminales",
            message: datos.data.msm,
          });
        }
      } catch (error) {
        Notification.error({ title: "Error Catch", msm: error.toString() });
      }
    },
    initChoferesFlotaVehicular: async function () {
      this.loadingChoferesFlotaVehicular = true
      this.mListChoferesFlotaVehicular = []
      try {
        var datos = await this.$axios.post(
          process.env.baseUrlPanel + "/read_choferes",
          {
            token: this.token,
          }
        );

        if (datos.data.status_code == 200) {
          this.mListChoferesFlotaVehicular.push(...datos.data.data);
        } else if (datos.data.status_code == 300) {
          Notification.info({
            title: "Choferes",
            message: "No existen Choferes registradas",
          });
        } else {
          Notification.error({
            title: "Error Api Choferes",
            message: datos.data.msm,
          });
        }
      } catch (error) {
        Notification.error({ title: "Error Catch", msm: error.toString() });
      }
      this.loadingChoferesFlotaVehicular = false;
    },
    initChoferesUnidadSinAsignacionFlotaVehicular: async function (index,row) 
    {
      this.showModalUnidadesChoferFlotavehicular(index,row)
      this.rowSeleccionadoChofer = row
      this.indexSeleccionadoChofer = index
      this.modalTitleAsignarChofer = row.nombres
      this.usuarioChoferUnidad = row.usuario
      this.mListChoferesUnidadesSinAsignacion = [];

      try {
        var datos = await this.$axios.post(
          process.env.baseUrlPanel + "/read_unidades_choferes",
          {
            token: this.token,
            usuario:row.usuario
          }
        );

        if (datos.data.status_code == 200) {
          this.mListChoferesUnidadesSinAsignacion.push(...datos.data.data);
        } else {
          Notification.error({
            title: "Error Api Choferes",
            message: datos.data.msm,
          });
        }
      } catch (error) {
        Notification.error({ title: "Error Catch", msm: error.toString() });
      }
     
    },
    initPropietariosUnidadSinAsignacionFlotaVehicular: async function (index,row) 
    {
      this.showModalUnidadesPropietarioFlotavehicular(index,row)
      this.rowSeleccionadoPropietario = row
      this.indexSeleccionadoPropietario = index
      this.modalTitleVincularPropietario = row.AliaObse
      this.usuarioPropietarioUnidad = row.CodiObse
      

      this.mListPropietariosUnidadesSinAsignacion = [];
      try {
        var datos = await this.$axios.post(
          process.env.baseUrlPanel + "/read-novinculadas-unidades-propietario",
          {
            token: this.token
          }
        );

        if (datos.data.status_code == 200) {
          for (var i = 0; i < datos.data.data.length; i++) {
            this.mListPropietariosUnidadesSinAsignacion.push({
            key: datos.data.data[i]['CodiVehi'],
            label: `${ datos.data.data[i]['CodiVehi'] }`
          });
          }
          this.mListPropietariosUnidadesSinAsignacion.push();
        } else if (datos.data.status_code == 300) {
          Notification.info({
            title: "Unidades Propietarios",
            message: "No existen Unidades Propietarios registradas",
          });
        } else {
          Notification.error({
            title: "Error Api Unidades Propietarios",
            message: datos.data.msm,
          });
        }
      } catch (error) {
        Notification.error({ title: "Error Catch", msm: error.toString() });
      }
      this.initPropietariosUnidadesAsignadasFlotaVehicular(index,row)
    },
    initPropietariosUnidadesAsignadasFlotaVehicular: async function (index,row) 
    {
      this.mListUnidadesVinculadasPropietario = [];
      try {
        var datos = await this.$axios.post(
          process.env.baseUrlPanel + "/read-vinculadas-unidades-propietario",
          {
            token: this.token,
            propietario:this.usuarioPropietarioUnidad
          }
        );

        if (datos.data.status_code == 200) {
          for (var i = 0; i < datos.data.data.length; i++) {
            for (var j = 0; j < this.mListPropietariosUnidadesSinAsignacion.length; j++) {
              if(datos.data.data[i]['CodiVehi'] == this.mListPropietariosUnidadesSinAsignacion[j]['label']){
                this.mListUnidadesVinculadasPropietario.push(this.mListPropietariosUnidadesSinAsignacion[j]['key'])
              }
            }
          }

        } else if (datos.data.status_code == 300) {
          Notification.info({
            title: "Unidades Propietarios",
            message: "No existen Unidades Propietarios registradas",
          });
        } else {
          Notification.error({
            title: "Error Api Unidades Propietarios",
            message: datos.data.msm,
          });
        }
      } catch (error) {
        Notification.error({ title: "Error Catch", msm: error.toString() });
      }
     
    },
    showModalPermisosFlotaVehicular(index, row) {
      this.modalPermisosUsuariosAdminFlotaVehicular = this.modalPermisosUsuariosAdminFlotaVehicular ? false : true
      this.oItemAdministrativoFlotaVehicular = row
      this.otitleModalUsuarioAdmin = row.NombApellUsua
      this.jsonPermisosUsuario = JSON.parse(row.permisosJSON)
    },
    showModalUnidadesChoferFlotavehicular(index, row) {
      this.modalChoferesFlotaVehicular = true
    },
    showModalUnidadesPropietarioFlotavehicular(index, row) {
      this.modalPropietariosFlotaVehicular = true
    },
    showModalAgregarChoferFlotavehicular(index, row) {
      this.modalAgregarChoferFlotaVehicular = this.modalAgregarChoferFlotaVehicular ? false : true
      if (this.modalAgregarChoferFlotaVehicular == false) {
        this.cancelarRegisterChofer()
      }
    },
    showModalAgregarPropietarioFlotavehicular(index, row) {
      this.modalAgregarPropietarioFlotaVehicular = this.modalAgregarPropietarioFlotaVehicular ? false : true
      if (this.modalAgregarPropietarioFlotaVehicular == false) {
        this.cancelarRegisterPropietario()
      }
    },
    showModalAgregarUnidadFlotavehicular(index, row) {
      this.modalAgregarUnidadFlotaVehicular = this.modalAgregarUnidadFlotaVehicular ? false : true
      if (this.modalAgregarUnidadFlotaVehicular == false) {
        this.cancelarRegisterUnidad()
      }
    },
    showModalAgregarGrupoFlotavehicular(index, row) {
      this.modalAgregarGrupoFlotaVehicular = this.modalAgregarGrupoFlotaVehicular ? false : true
      if (this.modalAgregarGrupoFlotaVehicular == false) {
        this.cancelarRegisterGrupo()
      }
    },
    showModalAgregarAdministradorFlotavehicular(index, row) {
      this.modalAgregarAdministradorFlotaVehicular = this.modalAgregarAdministradorFlotaVehicular ? false : true
      if (this.modalAgregarAdministradorFlotaVehicular == false) {
        this.cancelarRegisterAdministrador()
      }
    },
    onError() {
      console.log('error')
    },
    async updatePermisosJSONAdministrativos() {
      try {
        var item = this.oItemAdministrativoFlotaVehicular
        var obj = {
          token: this.token,
          usuario: item.CodiUsua,
          permisosJson: this.jsonPermisosUsuario
        }
        console.log(obj)
        var result = await this.$axios.put(process.env.baseUrl + "/updatePermisosAdministratios", obj)
        if (result.data.status_code == 200) {
          this.$notify({
            title: 'Update Permisos',
            message: result.data.msm,
            type: 'success'
          });

        } else {

          this.$notify({
            title: 'Error Update Permisos',
            message: result.data.msm,
            type: 'danger'
          });

        }
      } catch (error) {
        this.$notify({
          title: 'Error TRY Permisos',
          message: error.toString(),
          type: 'danger'
        });
      }
    },
    async registerChofer(){
      try {
        var objBody= {
        token:this.token,
        datos:{
          usuario: this.usuarioChofer,
          constrasenia: this.passwordChofer,
          nombres: this.nombreChofer,
          email: this.emailChofer,
          telefono: this.telefonoChofer
        }
      }
      var result = await this.$axios.post(process.env.baseUrl + "/register_choferes", objBody)
    if (result.data.status_code == 200) {
      this.initChoferesFlotaVehicular()
      this.limpiarRegisterChofer()
      this.$notify({
          message: result.data.msm,
          timeout: 1500,
          type: 'default'
        });
    } else {
      this.$notify({
          title: 'Error al insertar',
          timeout: 3000,
          message: result.data.msm,
          type: 'danger'
          
        });
    }  
    } catch (error) {
        this.$notify({
          title: 'Error TRY Permisos',
          message: error.toString(),
          type: 'danger'
        });
      }
    },
    async registerPropietario(){
      try {
        var objBody= {
        token:this.token,
        datos:{
          _codiobse:this.codigoPropietario,
          _aliaobse:this.nombrePropietario,
          _usuaobse:this.usuarioPropietario,
          _clavobse:this.passwordPropietario,
          _activo:1,
          _oObservadorNivel:2
        }
      }
      var result = await this.$axios.post(process.env.baseUrl + "/register-propietario", objBody)
    if (result.data.status_code == 200) {
      this.initPropietariosFlotaVehicular()
      this.limpiarRegisterPropietario()
      this.$notify({
          message: result.data.msm,
          timeout: 1500,
          type: 'default'
        });
    } else {
      this.$notify({
          title: 'Error al insertar',
          timeout: 3000,
          message: result.data.msm,
          type: 'danger'
          
        });
    }  
    } catch (error) {
        this.$notify({
          title: 'Error TRY Permisos',
          message: error.toString(),
          type: 'danger'
        });
      }
    },
    async registerUnidad(){
      try {
        var objBody= {
            token: this.token,
            datos: {
                _codivehiculo: this.unidadVehiculo,
                _idtipodispositivo:null,
                _autodespvehi: 1,
                _anotacionesvehi: null,
                _infoctrlvehi: 1,
                _codidispvehi: this.serieVehiculo,
                _placavehi: this.placaVehiculo,
                _numsim: this.numsimVehiculo,
                _idestavehi: null,
                _grupoid: null,
                _badge_estado: null,
                _badge_inform: null,
                _label_estado: null,
                _label_inform: null,
                _oGrupo: {
                    _grupoid: 1,
                    _descripcion: null,
                    _activo: null,
                    _color: null,
                    _color1: null,
                    _color2: null,
                    _activolabel: "Activo",
                    _badge_estado: ""
                },
                _oEstadoVehi: {
                    _idestado: 1,
                    _descripcion: null
                },
                _oTipoDispo: {
                    _iddisptipo: 3,
                    _descripcion: null
                }
            }
        }
      var result = await this.$axios.post(process.env.baseUrl + "/register-unidad", objBody)
    if (result.data.status_code == 200) {
      this.initUnidadesFlotaVEhicular()
      this.limpiarRegisterUnidad()
      this.$notify({
          message: result.data.msm,
          timeout: 1500,
          type: 'default'
        });
    } else {
      this.$notify({
          title: 'Error al insertar',
          timeout: 3000,
          message: result.data.msm,
          type: 'danger'
          
        });
    }  
    } catch (error) {
        this.$notify({
          title: 'Error TRY Permisos',
          message: error.toString(),
          type: 'danger'
        });
      }
    },
    async registerGrupo(){
      try {
        var objBody= {
            token: this.token,
            datos: {
         _descripcion : this.descripcionGrupo,
         _activo : 1,
         _color : this.fondoGrupo,
         _color1 : this.textoGrupo,
         _color2 : this.lineaGrupo
    }
        }
      var result = await this.$axios.post(process.env.baseUrl + "/register-grupo", objBody)
    if (result.data.status_code == 200) {
      this.initGruposFlotaVehicular()
      this.limpiarRegisterGrupo()
      this.$notify({
          message: result.data.msm,
          timeout: 1500,
          type: 'default'
        });
    } else {
      this.$notify({
          title: 'Error al insertar',
          timeout: 3000,
          message: result.data.msm,
          type: 'danger'
          
        });
    }  
    } catch (error) {
        this.$notify({
          title: 'Error TRY Permisos',
          message: error.toString(),
          type: 'danger'
        });
      }
    },
    async registerAdministrador(){
      try {
        var objBody= {
          token: this.token,
          datos: {
            _codiusua : this.codigoAdmin,
            _nombapellusua : this.nombreAdmin,
            _clavusua : this.passAdmin,
            _nombusua : this.usuarioAdmin,
            _oPermiso:{
              _info_unidades:0,
              _generar_calificar_tarjetas_despues_del_recorrido:0,
              _info_usuarios:0,
              _opciones_sistema:0,
              _simulacion_dispositivo_urbano:0,
              _envio_comandos:0,
              _deperacion_sistema:0,
              _anular_tarjeta:0,
              _finalizar_vuelta:0,
              _simulacion_dispositivo_urbano:0,
              _alarmar_geocercas:0,
              _visualizar_rutas_otras_terminales:0,
              _admin_rutas_frecuencias:0
            },
            _oTerminal:{
              _codigoterminal:this.mSelectTerminalAdmin,
            }
          }
        }
      var result = await this.$axios.post(process.env.baseUrl + "/register-administrador", objBody)
    if (result.data.status_code == 200) {
      this.initAdministrativosFlotaVehicular()
      this.limpiarRegisterAdministrador()
      this.$notify({
          message: result.data.msm,
          timeout: 1500,
          type: 'default'
        });
    } else {
      this.$notify({
          title: 'Error al insertar',
          timeout: 3000,
          message: result.data.msm,
          type: 'danger'
          
        });
    }  
    } catch (error) {
        this.$notify({
          title: 'Error TRY Permisos',
          message: error.toString(),
          type: 'danger'
        });
      }
    },
    async updatePropietario(){
      try {
        var objBody= {
        token:this.token,
        datos:{
          _codiobse:this.codigoPropietario,
          _aliaobse:this.nombrePropietario,
          _usuaobse:this.usuarioPropietario,
          _clavobse:this.passwordPropietario,
          _activo:1,
          _oObservadorNivel:2
        }
      }
      console.log("update propietario")
      console.log(objBody)
      var result = await this.$axios.put(process.env.baseUrl + "/update-propietario", objBody)
    if (result.data.status_code == 200) {
      this.initPropietariosFlotaVehicular()
      this.limpiarRegisterPropietario()
      this.$notify({
          message: result.data.msm,
          timeout: 1500,
          type: 'default'
        });
    } else {
      this.$notify({
          title: 'Error al insertar',
          timeout: 3000,
          message: result.data.msm,
          type: 'danger'
          
        });
    }  
    } catch (error) {
        this.$notify({
          title: 'Error TRY Permisos',
          message: error.toString(),
          type: 'danger'
        });
      }
    },
    async updateUnidad(){
      try {
        var objBody= {
        token:this.token,
        datos: {
          _codivehiculo: this.unidadVehiculo,
          _codidispvehi: this.serieVehiculo,
          _placavehi: this.placaVehiculo,
          _numsim: this.numsimVehiculo,
        }
      }
      var result = await this.$axios.put(process.env.baseUrl + "/update-unidad", objBody)
    if (result.data.status_code == 200) {
      this.initUnidadesFlotaVEhicular()
      this.limpiarRegisterUnidad()
      this.$notify({
          message: result.data.msm,
          timeout: 1500,
          type: 'default'
        });
    } else {
      this.$notify({
          title: 'Error al actualizar',
          timeout: 3000,
          message: result.data.msm,
          type: 'danger'
          
        });
    }  
    } catch (error) {
        this.$notify({
          title: 'Error TRY Permisos',
          message: error.toString(),
          type: 'danger'
        });
      }
    },
    async updateGrupo(){
      try {
        var objBody= {
        token:this.token,
        datos: {
          _grupoid : this.grupoId,
          _descripcion : this.descripcionGrupo,
          _activo : 1,
          _color : this.fondoGrupo,
          _color1 : this.textoGrupo,
          _color2 : this.lineaGrupo
        }
      }
      var result = await this.$axios.put(process.env.baseUrl + "/update-grupo", objBody)
    if (result.data.status_code == 200) {
      this.initGruposFlotaVehicular()
      this.limpiarRegisterGrupo()
      this.$notify({
          message: result.data.msm,
          timeout: 1500,
          type: 'default'
        });
    } else {
      this.$notify({
          title: 'Error al actualizar',
          timeout: 3000,
          message: result.data.msm,
          type: 'danger'
          
        });
    }  
    } catch (error) {
        this.$notify({
          title: 'Error TRY Permisos',
          message: error.toString(),
          type: 'danger'
        });
      }
    },
    async updateChofer(){
      try {
        var objBody= {
        token:this.token,
        datos: {
          usuario: this.usuarioChofer,
          constrasenia: this.passwordChofer,
          nombres: this.nombreChofer,
          email: this.emailChofer,
          telefono: this.telefonoChofer
        }
      }
      var result = await this.$axios.put(process.env.baseUrl + "/update_chofer", objBody)
    if (result.data.status_code == 200) {
      this.initChoferesFlotaVehicular()
      this.limpiarRegisterChofer()
      this.$notify({
          message: result.data.msm,
          timeout: 1500,
          type: 'default'
        });
    } else {
      this.$notify({
          title: 'Error al actualizar',
          timeout: 3000,
          message: result.data.msm,
          type: 'danger'
          
        });
    }  
    } catch (error) {
        this.$notify({
          title: 'Error TRY Permisos',
          message: error.toString(),
          type: 'danger'
        });
      }
    },
    async updateAdministrador(){
      try {
        var objBody= {
          token: this.token,
          datos: {
            _codiusua : this.codigoAdmin,
            _nombapellusua : this.nombreAdmin,
            _clavusua : this.passAdmin,
            _nombusua : this.usuarioAdmin,
            _oTerminal:{
              _codigoterminal:this.mSelectTerminalAdmin,
            }
          }
        }
      var result = await this.$axios.put(process.env.baseUrl + "/update-administrador", objBody)
    if (result.data.status_code == 200) {
      this.initAdministrativosFlotaVehicular()
      this.limpiarRegisterAdministrador()
      this.$notify({
          message: result.data.msm,
          timeout: 1500,
          type: 'default'
        });
    } else {
      this.$notify({
          title: 'Error al actualizar',
          timeout: 3000,
          message: result.data.msm,
          type: 'danger'
          
        });
    }  
    } catch (error) {
        this.$notify({
          title: 'Error TRY Permisos',
          message: error.toString(),
          type: 'danger'
        });
      }
    },
    async deleteChofer(row){
      try {
        var usuarioDelete
        usuarioDelete = row.usuario
        var objBody= {
        token:this.token,
        usuario: usuarioDelete,  
      }
      //var result = await this.$axios.delete(process.env.baseUrl + "/delete_chofer", {data:objBody})
    if (result.data.status_code == 200) {
      this.initChoferesFlotaVehicular()
      this.$notify({
          message: result.data.msm,
          timeout: 1500,
          type: 'default'
        });
    } else {
      this.$notify({
          title: 'Error al eliminar',
          timeout: 3000,
          message: result.data.msm,
          type: 'danger'
          
        });
    }  
    } catch (error) {
        this.$notify({
          title: 'Error TRY Permisos',
          message: error.toString(),
          type: 'danger'
        });
      }
    },
    async changeEstadoPropietario(row){
      var estado
      if (row.activo == 1) {
        estado = 0
      }else{
        estado = 1
      }
      try {
        var objBody= {
        token:this.token,
        datos:{
          _estado:estado,
          _codiobse:row.CodiObse
        }
      }
      Swal.fire({
        title: row.activo == 1 ? 'Desactivar Propietario':'Activar Propietario',
        text: row.AliaObse,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: row.activo == 1 ? 'Si, desactivar.' : 'Si, activar.'
      }).then(async (result) => {
        if (result.isConfirmed) {
          var result = await this.$axios.put(process.env.baseUrl + "/update-propietario-estado", objBody)
          if (result.data.status_code == 200) {
            this.initPropietariosFlotaVehicular()
            this.$notify({
                message: result.data.msm,
                timeout: 1500,
                type: 'default'
              });
          } else {
            this.$notify({
                title: 'Error al insertar',
                timeout: 3000,
                message: result.data.msm,
                type: 'danger'
                
              });
          }  
        }
      })
    } catch (error) {
        this.$notify({
          title: 'Error TRY Permisos',
          message: error.toString(),
          type: 'danger'
        });
      }
    },
    async changeEstadoUnidad(row){
      var codivehiculo = row.CodiVehi
      var estado
      if (row.idEstaVehi == 1) {
        estado = 2
      }else{
        estado = 1
      }
      try {
        var objBody= {
        token:this.token,
        datos:{
          _codivehiculo:codivehiculo,
          _estado:estado,
        }
      }
      Swal.fire({
        title: row.idEstaVehi == 1 ? 'Desactivar Unidad':'Activar Unidad',
        text: row.CodiVehi,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: row.idEstaVehi == 1 ? 'Si, desactivar.' : 'Si, activar.'
      }).then(async (result) => {
        if (result.isConfirmed) {
          var result = await this.$axios.put(process.env.baseUrl + "/update-unidad-estado", objBody)
          if (result.data.status_code == 200) {
            this.initUnidadesFlotaVEhicular()
            this.$notify({
                message: result.data.msm,
                timeout: 1500,
                type: 'default'
              });
          } else {
            this.$notify({
                title: 'Error al insertar',
                timeout: 3000,
                message: result.data.msm,
                type: 'danger'
                
              });
          }  
        }
      })
      
    } catch (error) {
        this.$notify({
          title: 'Error TRY Permisos',
          message: error.toString(),
          type: 'danger'
        });
      }
    },
    async changeEstadoGrupo(row){
      var idgrupo = row.id
      var estado
      if (row.activo == 1) {
        estado = 0
      }else{
        estado = 1
      }
      try {
        var objBody= {
        token:this.token,
        datos:{
          _grupoid:idgrupo,
          _activo:estado,
        }
      }
      Swal.fire({
        title: row.activo == 1 ? 'Desactivar Grupo':'Activar Grupo',
        text: row.descripcion,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: row.activo == 1 ? 'Si, desactivar.' : 'Si, activar.'
      }).then(async (result) => {
        if (result.isConfirmed) {
          var result = await this.$axios.put(process.env.baseUrl + "/update-grupo-estado", objBody)
          if (result.data.status_code == 200) {
            this.initGruposFlotaVehicular()
            this.$notify({
                message: result.data.msm,
                timeout: 1500,
                type: 'default'
              });
          } else {
            this.$notify({
                title: 'Error al cambiar estado',
                timeout: 3000,
                message: result.data.msm,
                type: 'danger'
                
              });
          }  
        }
      })
    } catch (error) {
        this.$notify({
          title: 'Error TRY Permisos',
          message: error.toString(),
          type: 'danger'
        });
      }
    },
    async changeEstadoAdministrador(row){
      var estado
      if (row.activo == 1) {
        
        estado = 0
      }else{
        estado = 1
      }
      try {
        var objBody= {
        token:this.token,
        datos:{
          _estado:estado,
          _codiusua:row.CodiUsua
        }
      }
      Swal.fire({
        title: row.activo == 1 ? 'Desactivar Administrador':'Activar Administrador',
        text: row.NombApellUsua,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: row.activo == 1 ? 'Si, desactivar.' : 'Si, activar.'
      }).then(async (result) => {
        if (result.isConfirmed) {
          var result = await this.$axios.put(process.env.baseUrl + "/update-administrador-estado", objBody)
          if (result.data.status_code == 200) {
            this.initAdministrativosFlotaVehicular()
            this.$notify({
                message: result.data.msm,
                timeout: 1500,
                type: 'default'
              });
          } else {
            this.$notify({
                title: 'Error al cambiar estado',
                timeout: 3000,
                message: result.data.msm,
                type: 'danger'
                
              });
          }  
        }
      })
    
    } catch (error) {
        this.$notify({
          title: 'Error TRY Permisos',
          message: error.toString(),
          type: 'danger'
        });
      }
    },
    async asignarChoferUnidad(){
      try {
        var objBody= {
        token:this.token,
        datos:{
          usuario: this.usuarioChoferUnidad,
          vehiculo: this.mSelectUnidadChofer,
        }
      }
      var result = await this.$axios.post(process.env.baseUrl + "/asignar_chofer_vehiculo", objBody)
      if (result.data.status_code == 200) {
        this.initChoferesFlotaVehicular()
        this.initChoferesUnidadSinAsignacionFlotaVehicular(this.indexSeleccionadoChofer,this.rowSeleccionadoChofer)
        this.mSelectUnidadChofer = null
        this.$notify({
            message: result.data.msm,
            timeout: 1500,
            type: 'default'
          });
      } else {
        this.$notify({
            timeout: 3000,
            message: result.data.msm,
            type: 'danger'
            
          });
      }
    } catch (error) {
        this.$notify({
          title: 'Error TRY Permisos',
          message: error.toString(),
          type: 'danger'
        });
      }
    },
    async vincularUnidadPropietario(){
      try {      
      var objBody= {
        token:this.token,
        datos:{
          propietario: this.usuarioPropietarioUnidad,
          unidad: this.mSelectUnidadPropietarioVD,
        }
      }
      var result = await this.$axios.post(process.env.baseUrl + "/vincular-unidad-propietario", objBody)
      if (result.data.status_code == 200) {
        //this.initPropietariosUnidadSinAsignacionFlotaVehicular(this.indexSeleccionadoPropietario,this.rowSeleccionadoPropietario)
      } else {
        this.$notify({
            timeout: 3000,
            message: result.data.msm,
            type: 'danger'
            
          });
      }
    } catch (error) {
        this.$notify({
          title: 'Error TRY Permisos',
          message: error.toString(),
          type: 'danger'
        });
      }
    },
    async desvincularUnidadPropietario(){
      try {      
        var objBody= {
          token:this.token,
          datos:{
            propietario: this.usuarioPropietarioUnidad,
            codivehiculo: this.mSelectUnidadPropietarioVD,
          }
        }
        console.log("objBody")
        console.log(objBody) 
      var result = await this.$axios.delete(process.env.baseUrl + "/delete-unidad-propietario", {data:objBody})
      
      if (result.data.status_code == 200) {
        //this.initPropietariosUnidadSinAsignacionFlotaVehicular(this.indexSeleccionadoPropietario,this.rowSeleccionadoPropietario)
        //this.mListUnidadesVinculadasPropietario = []
        this.$notify({
            message: result.data.msm,
            timeout: 1500,
            type: 'default'
          });
      } else {
        this.$notify({
            timeout: 3000,
            message: result.data.msm,
            type: 'danger'
            
          });
      }
    } catch (error) {
        this.$notify({
          title: 'Error TRY Permisos',
          message: error.toString(),
          type: 'danger'
        });
      }
    },
    sendAsignarChoferUnidad(){
      this.asignarChoferUnidad();
    },
    sendvincularUnidadPropietario(){
      this.vincularUnidadPropietario()
    },
    senddesvincularUnidadPropietario(){
      this.desvincularUnidadPropietario()
    },
    sendRegisterChofer(){
      if (this.validarChofer()) {
        return;
      }
      this.registerChofer();
    },
    sendRegisterPropietario(){
      if (this.validarPropietario()) {
        return;
      }
      this.registerPropietario();
    },
    sendRegisterUnidad(){
      if (this.validarUnidad()) {
        return;
      }
      this.registerUnidad();
    },
    sendRegisterGrupo(){
      if (this.validarGrupo()) {
        return;
      }
      this.registerGrupo();
    },
    sendRegisterAdministrador(){
      if (this.validarAdministrador()) {
        return;
      }
      this.registerAdministrador();
    },
    sendUpdatePropietario(){
      if (this.validarPropietario()) {
        return;
      }
      this.updatePropietario();
    },
    sendUpdateUnidad(){
      if (this.validarUnidad()) {
        return;
      }
      this.updateUnidad();
    },
    sendUpdateGrupo(){
      if (this.validarGrupo()) {
        return;
      }
      this.updateGrupo();
    },
    sendUpdateChofer(){
      if (this.validarChofer()) {
        return;
      }
      this.updateChofer();
    },
    sendUpdateAdministrador(){
      if (this.validarAdministrador()) {
        return;
      }
      this.updateAdministrador();
    },
    sendChangeEstadoPropietario(row){
      this.changeEstadoPropietario(row);
    },
    sendChangeEstadoUnidad(row){
      this.changeEstadoUnidad(row);
    },
    sendChangeEstadoGrupo(row){
      this.changeEstadoGrupo(row);
    },
    sendChangeEstadoAdministrador(row){
      this.changeEstadoAdministrador(row);
    },
    sendDeleteChofer(row){
      this.deleteChofer(row);
    },
    editPropietario(row){
      this.nombrePropietario = row.AliaObse
      this.usuarioPropietario = row.UsuaObse
      this.passwordPropietario = row.ClavObse
      this.codigoPropietario = row.CodiObse
      this.editedIndexPropietario = 1
      this.modalAgregarPropietarioFlotaVehicular = true
    },
    editUnidad(row){
      this.unidadVehiculo = row.CodiVehi
      this.serieVehiculo = row.CodiDispVehi
      this.placaVehiculo = row.PlacVehi
      this.numsimVehiculo = row.NumeSIMVehi
      this.editedIndexUnidad = 1
      this.modalAgregarUnidadFlotaVehicular = true
    },
    editGrupo(row){
      this.descripcionGrupo = row.descripcion
      this.fondoGrupo = row.color
      this.textoGrupo = row.color1
      this.lineaGrupo = row.color2
      this.grupoId = row.id
      this.editedIndexGrupo = 1
      this.modalAgregarGrupoFlotaVehicular = true
    },
    editChofer(row){
      this.usuarioChofer = row.usuario
      this.telefonoChofer = row.telefono
      this.nombreChofer = row.nombres
      this.passwordChofer = row.constrasenia
      this.emailChofer = row.email
      this.editedIndexChofer = 1
      this.modalAgregarChoferFlotaVehicular = true
    },
    editAdministrador(row){
      this.codigoAdmin = row.CodiUsua
      this.usuarioAdmin = row.NombApellUsua
      this.nombreAdmin = row.NombUsua
      this.passAdmin = row.ClavUsua
      this.mSelectTerminalAdmin = row.CodiTermUsua
      this.editedIndexAdministrador = 1
      this.modalAgregarAdministradorFlotaVehicular = true
    },
    limpiarRegisterChofer(){
      this.nombreChofer  = ''
      this.usuarioChofer   = ''
      this.emailChofer  = ''
      this.passwordChofer  = ''
      this.telefonoChofer  = ''
      this.editedIndexChofer = -1
    },
    cancelarRegisterChofer(){
      this.nombreChofer = ''
      this.usuarioChofer = ''
      this.emailChofer = ''
      this.passwordChofer = ''
      this.telefonoChofer = ''
      this.editedIndexChofer = -1
      this.modalAgregarChoferFlotaVehicular = false
    },
    validarChofer(){
      this.validaChofer = 0
      if (this.usuarioChofer == '') {
        this.validaChofer = 1
      }
      if (this.nombreChofer == '') {
        this.validaChofer = 1
      }
      if (this.emailChofer == '') {
        this.validaChofer = 1
      }
      if (this.passwordChofer == '') {
        this.validaChofer = 1
      }
      if (this.telefonoChofer == '') {
        this.validaChofer = 1
      }
      return this.validaChofer
    },
    limpiarRegisterPropietario(){
      this.nombrePropietario = ''
      this.usuarioPropietario = ''
      this.passwordPropietario = ''
      this.codigoPropietario = ''
      this.editedIndexPropietario = -1
    },
    cancelarRegisterPropietario(){
      this.nombrePropietario = ''
      this.usuarioPropietario = ''
      this.passwordPropietario = ''
      this.codigoPropietario = ''
      this.editedIndexPropietario = -1
      this.modalAgregarPropietarioFlotaVehicular = false
    },
    validarPropietario(){
      this.validaPropietario = 0
      if (this.usuarioPropietario == '') {
        this.validaPropietario = 1
      }
      if (this.nombrePropietario == '') {
        this.validaPropietario = 1
      }
      if (this.passwordPropietario == '') {
        this.validaPropietario = 1
      }
      return this.validaPropietario
    },
    limpiarRegisterUnidad(){
      this.unidadVehiculo = ''
      this.placaVehiculo = ''
      this.numsimVehiculo = ''
      this.serieVehiculo = ''
      this.editedIndexUnidad = -1
    },
    cancelarRegisterUnidad(){
      this.unidadVehiculo = ''
      this.placaVehiculo = ''
      this.numsimVehiculo = ''
      this.serieVehiculo = ''
      this.editedIndexUnidad = -1
      this.modalAgregarUnidadFlotaVehicular = false
    },
    validarUnidad(){
      this.validaUnidad = 0
      if (this.placaVehiculo == '') {
        this.validaUnidad = 1
      }
      if (this.serieVehiculo == '') {
        this.validaUnidad = 1
      }
      if (this.unidadVehiculo == '') {
        this.validaUnidad = 1
      }
      return this.validaUnidad
    },
    limpiarRegisterGrupo(){
      this.descripcionGrupo = ''
      this.fondoGrupo = ''
      this.textoGrupo = ''
      this.lineaGrupo = ''
      this.editedIndexGrupo = -1
    },
    cancelarRegisterGrupo(){
      this.descripcionGrupo = ''
      this.fondoGrupo = ''
      this.textoGrupo = ''
      this.lineaGrupo = ''
      this.editedIndexGrupo = -1
      this.modalAgregarGrupoFlotaVehicular = false
    },
    validarGrupo(){
      this.validaGrupo = 0
      if (this.descripcionGrupo == '') {
        this.validaGrupo = 1
      }
      if (this.fondoGrupo == '') {
        this.validaGrupo = 1
      }
      if (this.lineaGrupo == '') {
        this.validaGrupo = 1
      }
      if (this.textoGrupo == '') {
        this.validaGrupo = 1
      }
      return this.validaGrupo
    },
    limpiarRegisterAdministrador(){
      this.codigoAdmin = ''
      this.usuarioAdmin = ''
      this.nombreAdmin = ''
      this.passAdmin = ''
      this.mSelectTerminalAdmin = ''
      this.editedIndexAdministrador = -1
    },
    cancelarRegisterAdministrador(){
      this.codigoAdmin = ''
      this.usuarioAdmin = ''
      this.nombreAdmin = ''
      this.passAdmin = ''
      this.mSelectTerminalAdmin = ''
      this.editedIndexAdministrador = -1
      this.modalAgregarAdministradorFlotaVehicular = false
    },
    validarAdministrador(){
      this.validaAdministrador = 0
      if (this.codigoAdmin == '') {
        this.validaAdministrador = 1
      }
      if (this.usuarioAdmin == '') {
        this.validaAdministrador = 1
      }
      if (this.nombreAdmin == '') {
        this.validaAdministrador = 1
      }
      if (this.passAdmin == '') {
        this.validaAdministrador = 1
      }
      if (this.mListTerminalesAdmin == '') {
        this.validaAdministrador = 1
      }
      return this.validaAdministrador
    },
  },
  mounted() {
    this.initUnidadesFlotaVEhicular();
  },
};
</script>
<style>
.cardFlotavehicular {
  height: calc(100vh - 11rem) !important;
  overflow: auto;
}

.cardBodyFlotavehicular {
  padding: 0%;
}

.cardFlotavehicular::-webkit-scrollbar {
  display: none;
}

.no-border-card .card-footer {
  border-top: 0;
}

body {
  overflow: auto !important;
}

.buttonNuevo{
  padding-top: 5px; 
  padding-right: 25px; 
  padding-bottom: 5px;
}

</style>