<template>
  <div class="content">
    <base-header>
      <div class="row align-items-center ">
        <div class="col" style="margin-top:1rem;">
          <tabs tabNavClasses="nav-fill flex-column flex-sm-row">
            <tab-pane >
              <div slot="title">
                Rutas
              </div>
              <br />
              <card
                class="cardRutasFrecuencias no-border-card" body-classes="px-0 pb-1 cardBodyFlotavehicular" 
                footer-classes="pb-2">
                <div class="col-12 text-right buttonNuevo">
                    <base-button type="primary" icon size="sm" @click="showModalAgregarRutaRutasFrecuencias()">
                      <span class="btn-inner--icon"><i class="ni ni-fat-add"></i>Agregar Ruta</span>
                    </base-button>
                </div>
                <el-table
                    v-loading="loadingRutaRutasFrecuencias" element-loading-text="Cargando..."
                    element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)"
                    height="calc(100vh - 14.6rem)"
                    :data="tableData"
                    row-key="id"
                    header-row-class-name="thead-dark"
                    @selection-change="SelectionChangeRutas">
                    >
                    <div slot="empty"></div>
                      <el-table-column
                        v-for="column in tableColumns"
                        :key="column.label"
                        v-bind="column"
                      >
                      </el-table-column>

                      <el-table-column
                        label="Estado"
                        min-width="150px"
                        prop="ActiRuta"
                        sortable
                      >
                        <template v-slot="{ row }">
                          <badge class="badge-dot mr-4" type="">
                            <i :class="`bg-${row.statusType}`"></i>
                            <span class="status">{{ row.status }}</span>
                          </badge>
                        </template>
                      </el-table-column>

                      <el-table-column
                        min-width="180px"
                        align="right"
                        label="Actions"
                      >
                        <div slot-scope="{ row }" class="d-flex">
                          <base-button
                            class="edit"
                            type="success"
                            size="sm"
                            icon
                            @click="editRuta(row)"
                          >
                            <i class="text-white ni ni-ruler-pencil"></i>
                          </base-button>
                          <base-button
                            class="remove btn-link"
                            type="danger"
                            size="sm"
                            icon
                            @click="changeEstadoRuta(row)"
                          >
                            <i class="text-white ni ni-fat-remove"></i>
                          </base-button>
                        </div>
                      </el-table-column>
                </el-table>
              </card>
            </tab-pane>

           
            <tab-pane >
              <div slot="title" @click="readAllFrecuenciasByRuta()">
                Frecuencias
              </div>
              <br />
              <card
                class="no-border-card cardRutasFrecuencias no-border-card"
                body-classes="px-0 pb-1 cardBodyFlotavehicular"
                footer-classes="pb-2"
              >
                <div class="col-12 text-right buttonNuevo">
                    <base-button type="primary" icon size="sm" @click="showModalAgregarFrecuenciaRutasFrecuencias()">
                      <span class="btn-inner--icon"><i class="ni ni-fat-add"></i>Agregar Frecuencia</span>
                    </base-button>
                </div>
                <el-table
                    v-loading="loadingFrecuenciaRutasFrecuencias" element-loading-text="Cargando..."
                    element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)"
                      height="calc(100vh - 14.6rem)"
                      :data="mListFrecuenciasByRuta"
                      row-key="id"
                      header-row-class-name="thead-dark"
                      @selection-change="SelectionChangeFrecuencias">
                    >
                    <div slot="empty"></div>
                      <el-table-column
                        v-for="column in tableColumnsFrecuencias"
                        :key="column.label"
                        v-bind="column"
                      >
                      </el-table-column>

                      <el-table-column
                        label="Estado"
                        min-width="150px"
                        prop="ActiRuta"
                        sortable
                      >
                        <template v-slot="{ row }">
                          <badge class="badge-dot mr-4" type="">
                            <i :class="`bg-${row.statusType}`"></i>
                            <span class="status">{{ row.status }}</span>
                          </badge>
                        </template>
                      </el-table-column>

                      <el-table-column
                        min-width="180px"
                        align="right"
                        label="Actions"
                      >
                        <div slot-scope="{ row }" class="d-flex">
                          <base-button
                            class="edit"
                            type="success"
                            size="sm"
                            icon
                            @click="editFrecuencia(row)"
                          >
                            <i class="text-white ni ni-ruler-pencil"></i>
                          </base-button>
                          <base-button
                            class="remove btn-link"
                            :type="row.ActiFrec == 1 ? 'danger' : 'primary'"
                            size="sm"
                            icon
                            @click="changeEstadoFrecuencia(row)"
                          >
                            <i :class="row.ActiFrec == 1 ? 'text-white ni ni-fat-remove' : 'text-white ni ni-check-bold'"></i>
                          </base-button>
                          <base-button
                            class="remove btn-link"
                            type="default"
                            size="sm"
                            icon
                            @click="changeEstadoRuta(row)"
                          >
                            <i class="text-white ni ni-glasses-2"></i>
                          </base-button>
                        </div>
                      </el-table-column>
                </el-table>
              </card>
            </tab-pane>
            <tab-pane >
              <div slot="title" @click="readAllControlesByFrecuencia()">
                Controles
              </div>
              <br />
              <card
                class="no-border-card cardRutasFrecuencias no-border-card"
                body-classes="px-0 pb-1 cardBodyFlotavehicular"
                footer-classes="pb-2"
              >
                <div class="col-12 text-right buttonNuevo">
                    <base-button type="primary" icon size="sm" @click="showModalAgregarFrecuenciaRutasFrecuencias()">
                      <span class="btn-inner--icon"><i class="ni ni-fat-add"></i>Agregar Control</span>
                    </base-button>
                </div>
                <el-table
                    v-loading="loadingControlRutasFrecuencias" element-loading-text="Cargando..."
                    element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)"
                      height="calc(100vh - 14.6rem)"
                      :data="mListControlesByFrecuencia"
                      row-key="id"
                      header-row-class-name="thead-dark"
                    >
                    <div slot="empty"></div>
                      <el-table-column
                        v-for="column in tableColumnsControles"
                        :key="column.label"
                        v-bind="column"
                      >
                      </el-table-column>

                      <el-table-column label="Referencial" min-width="140px" prop="isRefeSecuCtrl">
                      <template v-slot="{ row }">
                        <badge class="badge-dot mr-4" type="">
                          <i :class="`bg-${row.isRefeSecuCtrl == 1 ? 'success' : 'danger'
                          }`"></i>
                          <span class="status">{{
                              row.isRefeSecuCtrl == 1 ? "SI" : "NO"
                          }}</span>
                        </badge>
                      </template>
                    </el-table-column>
                    <el-table-column label="Retorno" min-width="130px" prop="CtrlRetoSecuCtrl">
                      <template v-slot="{ row }">
                        <badge class="badge-dot mr-4" type="">
                          <i :class="`bg-${row.CtrlRetoSecuCtrl == 1 ? 'success' : 'danger'
                          }`"></i>
                          <span class="status">{{
                              row.CtrlRetoSecuCtrl == 1 ? "SI" : "NO"
                          }}</span>
                        </badge>
                      </template>
                    </el-table-column>
                    <el-table-column label="Fin Vuelta" min-width="130px" prop="EsFinVuelSecuCtrl">
                      <template v-slot="{ row }">
                        <badge class="badge-dot mr-4" type="">
                          <i :class="`bg-${row.EsFinVuelSecuCtrl == 1 ? 'success' : 'danger'
                          }`"></i>
                          <span class="status">{{
                              row.EsFinVuelSecuCtrl == 1 ? "SI" : "NO"
                          }}</span>
                        </badge>
                      </template>
                    </el-table-column>
                    <el-table-column label="Tolerancia" min-width="135px" prop="MinuToleSecuCtrl">
                    </el-table-column>
                    <el-table-column label="Penalización" min-width="145px" prop="PenaCtrlSecuCtrl">
                    </el-table-column>

                      <el-table-column
                        min-width="180px"
                        align="right"
                        label="Actions"
                      >
                        <div slot-scope="{ row }" class="d-flex">
                          <base-button
                            class="edit"
                            type="success"
                            size="sm"
                            icon
                            @click="editFrecuencia(row)"
                          >
                            <i class="text-white ni ni-ruler-pencil"></i>
                          </base-button>
                          <base-button
                            class="remove btn-link"
                            :type="row.ActiFrec == 1 ? 'danger' : 'primary'"
                            size="sm"
                            icon
                            @click="changeEstadoFrecuencia(row)"
                          >
                            <i :class="row.ActiFrec == 1 ? 'text-white ni ni-fat-remove' : 'text-white ni ni-check-bold'"></i>
                          </base-button>
                          <base-button
                            class="remove btn-link"
                            type="default"
                            size="sm"
                            icon
                            @click="changeEstadoRuta(row)"
                          >
                            <i class="text-white ni ni-glasses-2"></i>
                          </base-button>
                        </div>
                      </el-table-column>
                </el-table>
              </card>
            </tab-pane>
          </tabs>
        </div>
      </div>
    </base-header>

     <!--Form modal Agregar Ruta-->
     <modal :show.sync="modalAgregarRutaRutasFrecuencias">
      <validation-observer v-slot="{handleSubmit}" ref="formValidator">
      <form class="needs-validation"
            @submit.prevent="handleSubmit(firstFormSubmit)">
        <div class="form-row">
          <div class="col-md-6">
            <base-input
              name="Letra"
              placeholder="Letra"
              prepend-icon="ni ni-caps-small"
              rules="required"
              v-model="letraRuta">
            </base-input>
          </div>
          <div class="col-md-6">
            <base-input
              prepend-icon="ni ni-single-copy-04"
              name="Descripción"
              placeholder="Descripción"
              rules="required"
              v-model="descripcionRuta">
            </base-input>
          </div>
        </div>
        <div class="form-row">
          <div class="col-md-6">
            <el-select  placeholder="Terminales" v-model="mSelectTerminalAdmin" style="width:220px">
              <el-option v-for="item in mListTerminalesAdmin" :key="item.idTerm" :label="item.DescTerm" :value="item">
              </el-option>
            </el-select>
          </div>
          <div class="col-md-6">
            <base-input
            prepend-icon="ni ni-bullet-list-67"
              name="Intervalo"
              type="number"
              placeholder="Intervalo"
              rules="required"
              v-model="intervaloRuta">
            </base-input>
          </div> 
        </div>
        <div class="form-row">
          <div class="col-md-6">
            <base-input
              prepend-icon="ni ni-watch-time"
              type="time"
              name="Salida"
              placeholder="Salida"
              rules="required"
              v-model="salidaRuta">
            </base-input>
          </div>
          <div class="col-md-6">
            <base-input
              prepend-icon="ni ni-watch-time"
              type="time"
              name="Finalización"
              placeholder="Finalización"
              rules="required"
              v-model="finalizacionRuta">
            </base-input>
          </div>
        </div>
        <div class="text-right">
          <base-button type="danger" @click="showModalAgregarRutaRutasFrecuencias()">Cancelar</base-button>
          <base-button v-if="editedIndexRuta == -1" type="primary" @click="registerRuta()" native-type="submit">Agregar</base-button>
          <base-button v-else type="primary" @click="updateRuta()" native-type="submit">Actualizar</base-button>  
        </div>
      </form>
    </validation-observer>
       
    </modal>

     <!--Form modal Agregar Frecuencia-->
     <modal :show.sync="modalAgregarFrecuenciaRutasFrecuencias">
      <validation-observer v-slot="{handleSubmit}" ref="formValidator">
      <form class="needs-validation"
            @submit.prevent="handleSubmit(firstFormSubmit)">
        <div class="form-row">
          <div class="col-md-6">
            <base-input
              name="Letra"
              placeholder="Letra"
              prepend-icon="ni ni-caps-small"
              rules="required"
              v-model="LetrFrec">
            </base-input>
          </div>
          <div class="col-md-6">
            <base-input
              prepend-icon="ni ni-single-copy-04"
              name="Descripción"
              placeholder="Descripción"
              rules="required"
              v-model="DescFrec">
            </base-input>
          </div>
        </div>
        <div class="form-row">
          <div class="col-md-6">
            <base-input
              prepend-icon="ni ni-watch-time"
              type="time"
              name="Salida"
              placeholder="Salida"
              rules="required"
              v-model="HoraInicFrec">
            </base-input>
          </div>
          <div class="col-md-6">
            <base-input
              prepend-icon="ni ni-watch-time"
              type="time"
              name="Finalización"
              placeholder="Finalización"
              rules="required"
              v-model="HoraFina2Frec">
            </base-input>
          </div>
        </div>
        <div class="form-row">
          <div class="col-md-12">
            <el-select  placeholder="Rutas" v-model="mSelectRutaFrecuencia" style="width:450px">
              <el-option v-for="item in mListRutasModalAgregar" :key="item.DescRuta" :label="item.DescRuta" :value="item.idRuta">
              </el-option>
            </el-select>
          </div>
        </div>
        <br>
        <div class="text-right">
          <base-button type="danger" @click="showModalAgregarFrecuenciaRutasFrecuencias()">Cancelar</base-button>
          <base-button v-if="editedIndexFrecuencia == -1" type="primary" @click="registerFrecuencia()" native-type="submit">Agregar</base-button>
          <base-button v-else type="primary" @click="updateFrecuencia()" native-type="submit">Actualizar</base-button>  
        </div>
      </form>
    </validation-observer>
       
    </modal>

  </div>
</template>
<script>
import { Table, TableColumn, Select, Option } from "element-ui";

import RouteBreadCrumb from "@/components/argon-core/Breadcrumb/RouteBreadcrumb";
import { BasePagination } from "@/components/argon-core";
import clientPaginationMixin from "~/components/tables/PaginatedTables/clientPaginationMixin";
import swal from "sweetalert2";
import Tabs from "@/components/argon-core/Tabs/Tabs";
import TabPane from "@/components/argon-core/Tabs/Tab";
import Swal from 'sweetalert2'
export default {
  mixins: [clientPaginationMixin],
  layout: "EditRutasDashboardLayout",
  components: {
    Tabs,
    TabPane,
    BasePagination,
    RouteBreadCrumb,
    [Select.name]: Select,
    [Option.name]: Option,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
  },
  data() {
    return {
      tableColumns: [
        {
          type: "selection",
        },
        {
          prop: "LetrRuta",
          label: "Letra",
          minWidth: 100,
        },
        {
          prop: "DescRuta",
          label: "Descripción",
          minWidth: 200,
        },
        {
          prop: "DescTerm",
          label: "Terminal",
          minWidth: 140,
        },
        {
          prop: "InteSaliProgRuta",
          label: "Intervalo",
          minWidth: 140,
        },
        {
          prop: "HoraInicSaliProgRuta",
          label: "Salida",
          minWidth: 160,
        },
        {
          prop: "HoraFinaSaliProgRuta",
          label: "Finalización",
          minWidth: 160,
        },
      ],
      tableColumnsFrecuencias: [
        {
          type: "selection",
        },
        {
          prop: "DescFrec",
          label: "Descripción",
          minWidth: 250,
        },
        
        {
          prop: "DescRuta",
          label: "Ruta",
          minWidth: 230,
        },
        
        {
          prop: "HoraInicFrec",
          label: "Salida",
          minWidth: 100,
        },
        {
          prop: "HoraFina2Frec",
          label: "Finalización",
          minWidth: 145,
        },
      ],
      tableColumnsControles: [
        {
          prop: "DescFrec",
          label: "Frecuencia",
          minWidth: 250,
        },
        {
          prop: "DescCtrl",
          label: "Control",
          minWidth: 250,
        },
        {
          prop: "CodiCtrlSecuCtrl",
          label: "Código",
          minWidth: 130,
        },
        {
          prop: "InteSecuCtrl",
          label: "Intervalo",
          minWidth: 130,
        }
      ],
      loadingRutaRutasFrecuencias:false,
      loadingFrecuenciaRutasFrecuencias:false,
      loadingControlRutasFrecuencias:false,
      tableData: [],
      selectedRows: [],
      token: this.$cookies.get("token"),
      modalAgregarRutaRutasFrecuencias:false,
      modalAgregarFrecuenciaRutasFrecuencias:false,
      mListTerminalesAdmin: [],
      mSelectTerminalAdmin:'',
      descripcionRuta:'',
      letraRuta:'',
      intervaloRuta:'',
      salidaRuta:'',
      finalizacionRuta:'',
      idRuta:'',
      idFrecuencia:'',
      editedIndexRuta:-1,
      editedIndexFrecuencia:-1,
      mListFrecuenciasByRuta:[],
      mListControlesByFrecuencia:[],
      mListRutasSeleccionadas:[],
      mListFrecuenciasSeleccionadas:[],
      mListRutasModalAgregar:[],
      mListFrecuenciasModalAgregar:[],
      HoraInicFrec:'',
      LetrFrec:'',
      DescFrec:'',
      LuneFrec:'',
      MartFrec:'',
      MierFrec:'',
      JuevFrec:'',
      VierFrec:'',
      SabaFrec:'',
      DomiFrec:'',
      idFrecPatrFrec:'',
      ActiFrec:'',
      HoraInic1Frec:'',
      HoraFina2Frec:'',
      _frecuenciaId:'',
      mSelectRutaFrecuencia:''
    };
  },
  methods: {
    SelectionChangeRutas(val) {
      this.mListRutasSeleccionadas = []
      this.mListRutasModalAgregar = []
      for (var i = 0; i < val.length; i++) {
        this.mListRutasSeleccionadas.push(val[i].idRuta)
      }
      this.mListRutasModalAgregar.push(...val)
    },
    SelectionChangeFrecuencias(val) {
      this.mListFrecuenciasSeleccionadas = []
      this.mListFrecuenciasModalAgregar = []
      for (var i = 0; i < val.length; i++) {
        this.mListFrecuenciasSeleccionadas.push(val[i].idFrec)
      }
      this.mListFrecuenciasModalAgregar.push(...val)
    },
    async readAllRutas() {
      this.tableData = []
      this.loadingRutaRutasFrecuencias = true
      var datos = await this.$axios.post(process.env.baseUrlPanel + "/rutes", {
        token: this.token,
        tipo:3
      });

      if (datos.data.status_code == 200) 
      {
        for (var i = 0; i < datos.data.data.length; i++) {
          datos.data.data[i].statusType = datos.data.data[i].ActiRuta == 1
            ? "success"
            : "danger";
          datos.data.data[i].status = datos.data.data[i].ActiRuta == 1
            ? "Activo"
            : "Inactivo";
        }

        this.tableData.push(...datos.data.data);
      }else if(datos.data.status_code == 400)
      {
        //this.showToast('danger',datos.data.msm)
        this.$notify({
            message: datos.data.msm,
            timeout:3000,
            type: 'danger'
          });
      }else{
         //this.showToast('warning','No existen rutas disponibles')
         this.$notify({
            message: 'No existen rutas disponibles',
            timeout:3000,
            type: 'warning'
          });
      }
      this.loadingRutaRutasFrecuencias = false
    },
    async readAllFrecuenciasByRuta() {
      this.mListFrecuenciasByRuta = []
      this.loadingFrecuenciaRutasFrecuencias = true
      var datos = await this.$axios.post(process.env.baseUrlPanel + "/frecuencias_rutas", {
        token: this.token,
        ruta:this.mListRutasSeleccionadas
      });

      if (datos.data.status_code == 200) 
      {
        for (var i = 0; i < datos.data.data.length; i++) {
          datos.data.data[i].statusType = datos.data.data[i].ActiFrec == 1
            ? "success"
            : "danger";
          datos.data.data[i].status = datos.data.data[i].ActiFrec == 1
            ? "Activo"
            : "Inactivo";
        }

        this.mListFrecuenciasByRuta.push(...datos.data.data);
      }else if(datos.data.status_code == 400)
      {
        //this.showToast('danger',datos.data.msg)
        this.$notify({
            message: datos.data.msg,
            timeout:3000,
            type: 'danger'
          });
        
      }else{
         //this.showToast('warning','No existen frecuencias disponibles')
         this.$notify({
            message: 'No existen frecuencias disponibles',
            timeout:3000,
            type: 'warning'
          });
      }
      this.loadingFrecuenciaRutasFrecuencias = false
    },
    async readAllControlesByFrecuencia() {
      this.mListControlesByFrecuencia = []
      this.loadingControlRutasFrecuencias = true
      var datos = await this.$axios.post(process.env.baseUrlPanel + "/AllControlesPorFrecuencia", {
        token: this.token,
        frecuencias:this.mListFrecuenciasSeleccionadas
      });

      if (datos.data.status_code == 200) 
      {
        this.mListControlesByFrecuencia.push(...datos.data.datos);
      }else if(datos.data.status_code == 400)
      {
        //this.showToast('danger',datos.data.msm)
        this.$notify({
            message: datos.data.msm,
            timeout:3000,
            type: 'danger'
          });
      }else{
         //this.showToast('warning','No existen controles disponibles')
         this.$notify({
            message: 'No existen controles disponibles',
            timeout:3000,
            type: 'warning'
          });
      }
      this.loadingControlRutasFrecuencias = false
    },
    async readTerminales() {
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
    async registerRuta()
    {
      try {
        var objBody= {
            token: this.token,
            datos: {
              _descruta:this.descripcionRuta,
              _letraruta:this.letraRuta,
              _horainicio:this.salidaRuta,
              _intervalo:this.intervaloRuta,
              _horafin:this.finalizacionRuta,
              _idTerm:this.mSelectTerminalAdmin.idTerm,
              _codiTerm:this.mSelectTerminalAdmin.CodiTerm
          }
        }
      var result = await this.$axios.post(process.env.baseUrl + "/register-ruta", objBody)
    if (result.data.status_code == 200) {
      this.readAllRutas()
      this.limpiarRegisterRuta()
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
    async updateRuta(){
      try {
        var objBody= {
            token: this.token,
            datos: {
              _idRuta:this.idRuta,
              _descruta:this.descripcionRuta,
              _letraruta:this.letraRuta,
              _horainicio:this.salidaRuta,
              _intervalo:this.intervaloRuta,
              _horafin:this.finalizacionRuta,
              _idTerm:this.mSelectTerminalAdmin.idTerm,
              _codiTerm:this.mSelectTerminalAdmin.CodiTerm
          }
        }
      var result = await this.$axios.put(process.env.baseUrl + "/update-ruta", objBody)
    if (result.data.status_code == 200) {
      this.readAllRutas()
      this.limpiarRegisterRuta()
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
    async registerFrecuencia()
    {
      try {
        var objBody= {
            token: this.token,
            frequencie: {
              idRutaFrec:this.mSelectRutaFrecuencia,
              HoraInicFrec:this.HoraInicFrec,
              LetrFrec:this.LetrFrec,
              DescFrec:this.DescFrec,
              LuneFrec:0,
              MartFrec:0,
              MierFrec:0,
              JuevFrec:0,
              VierFrec:0,
              SabaFrec:0,
              DomiFrec:0,
              idFrecPatrFrec:0,
              ActiFrec:1,
              HoraInic1Frec:this.HoraInicFrec,
              HoraFina2Frec:this.HoraFina2Frec
          }
        }
        console.log("objBody");
        console.log(objBody)
      var result = await this.$axios.post(process.env.baseUrl + "/create", objBody)
    if (result.data.status_code == 200) {
      this.readAllFrecuenciasByRuta()
      this.limpiarRegisterFrecuencia()
      this.$notify({
          message: result.data.msg,
          timeout: 1500,
          type: 'default'
        });
    } else {
      this.$notify({
          title: 'Error al insertar',
          timeout: 3000,
          message: result.data.msg,
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
    async updateFrecuencia(){
      try {
        var objBody= {
            token: this.token,
            datos: {
              _frecuenciaId:this._frecuenciaId,
              idRutaFrec:this.mSelectRutaFrecuencia,
              HoraInicFrec:this.HoraInicFrec,
              LetrFrec:this.LetrFrec,
              DescFrec:this.DescFrec,
              LuneFrec:0,
              MartFrec:0,
              MierFrec:0,
              JuevFrec:0,
              VierFrec:0,
              SabaFrec:0,
              DomiFrec:0,
              idFrecPatrFrec:0,
              ActiFrec:1,
              HoraInic1Frec:this.HoraInicFrec,
              HoraFina2Frec:this.HoraFina2Frec
          }
        }
      var result = await this.$axios.put(process.env.baseUrl + "/update-frecuencias", objBody)
    if (result.data.status_code == 200) {
      this.readAllFrecuenciasByRuta()
      this.limpiarRegisterFrecuencia()
      this.$notify({
          message: result.data.msg,
          timeout: 1500,
          type: 'default'
        });
    } else {
      this.$notify({
          title: 'Error al actualizar',
          timeout: 3000,
          message: result.data.msg,
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
    limpiarRegisterRuta(){
      this.letraRuta  = ''
      this.descripcionRuta   = ''
      this.salidaRuta  = ''
      this.finalizacionRuta  = ''
      this.intervaloRuta  = ''
      this.mSelectTerminalAdmin = ''
      this.editedIndexRuta = -1
    },
    cancelarRegisterRuta(){
      this.letraRuta  = ''
      this.descripcionRuta   = ''
      this.salidaRuta  = ''
      this.finalizacionRuta  = ''
      this.intervaloRuta  = ''
      this.mSelectTerminalAdmin = ''
      this.editedIndexRuta = -1
      this.modalAgregarRutaRutasFrecuencias = false
    },
    limpiarRegisterFrecuencia(){
      this.mSelectRutaFrecuencia = '',
      this.HoraInicFrec = '',
      this.LetrFrec = '',
      this.DescFrec = '',
      this.LuneFrec = '',
      this.MartFrec = '',
      this.MierFrec = '',
      this.JuevFrec = '',
      this.VierFrec = '',
      this.SabaFrec = '',
      this.DomiFrec = '',
      this.idFrecPatrFrec = '',
      this.ActiFrec = '',
      this.HoraInic1Frec = '',
      this.HoraFina2Frec = '',
      this.editedIndexFrecuencia = -1
    },
    cancelarRegisterFrecuencia(){
      this.mSelectRutaFrecuencia = '',
      this.HoraInicFrec = '',
      this.LetrFrec = '',
      this.DescFrec = '',
      this.LuneFrec = '',
      this.MartFrec = '',
      this.MierFrec = '',
      this.JuevFrec = '',
      this.VierFrec = '',
      this.SabaFrec = '',
      this.DomiFrec = '',
      this.idFrecPatrFrec = '',
      this.ActiFrec = '',
      this.HoraInic1Frec = '',
      this.HoraFina2Frec = '',
      this.editedIndexFrecuencia = -1
      this.modalAgregarFrecuenciaRutasFrecuencias = false
    },
    showModalAgregarRutaRutasFrecuencias(index, row) {
      this.modalAgregarRutaRutasFrecuencias = this.modalAgregarRutaRutasFrecuencias ? false : true
      if (this.modalAgregarRutaRutasFrecuencias == false) {
        this.cancelarRegisterRuta()
      }
    },
    showModalAgregarFrecuenciaRutasFrecuencias(index, row) {
      this.modalAgregarFrecuenciaRutasFrecuencias = this.modalAgregarFrecuenciaRutasFrecuencias ? false : true
      if (this.modalAgregarFrecuenciaRutasFrecuencias == false) {
        this.cancelarRegisterFrecuencia()
      }
    },
    editRuta(row){
      this.idRuta = row.idRuta
      this.letraRuta = row.LetrRuta
      this.descripcionRuta = row.DescRuta
      this.mSelectTerminalAdmin = row.IdTermRuta
      this.intervaloRuta = row.InteSaliProgRuta
      this.salidaRuta = row.HoraInicSaliProgRuta
      this.finalizacionRuta = row.HoraFinaSaliProgRuta
      this.editedIndexRuta = 1
      this.modalAgregarRutaRutasFrecuencias = true
    },
    editFrecuencia(row){
      console.log("row f")
      console.log(row)
      this._frecuenciaId=row.idFrec,
      this.mSelectRutaFrecuencia=row.idRuta,
      this.HoraInicFrec=row.HoraInicFrec,
      this.LetrFrec=row.LetrFrec,
      this.DescFrec=row.DescFrec,
      this.LuneFrec=0,
      this.MartFrecv0,
      this.MierFrec=0,
      this.JuevFrec=0,
      this.VierFrec=0,
      this.SabaFrec=0,
      this.DomiFrec=0,
      this.idFrecPatrFrec=0,
      this.ActiFrec=1,
      this.HoraInic1Frec=row.HoraInicFrec,
      this.HoraFina2Frec=row.HoraFina2Frec
      this.editedIndexFrecuencia = 1
      this.modalAgregarFrecuenciaRutasFrecuencias = true
    },
    async changeEstadoRuta(row){
      var idruta = row.idRuta
      var estado
      if (row.ActiRuta == 1) {
        estado = 0
      }else{
        estado = 1
      }
      try {
        var objBody= {
        token:this.token,
        datos:{
          _rutaId:idruta,
          _estado:estado,
        }
      }
      Swal.fire({
        title: row.ActiRuta == 1 ? 'Desactivar Ruta':'Activar Ruta',
        text: row.DescRuta,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: row.ActiRuta == 1 ? 'Si, desactivar.' : 'Si, activar.'
      }).then(async (result) => {
        if (result.isConfirmed) {
          var result = await this.$axios.put(process.env.baseUrl + "/update-ruta-estado", objBody)
          if (result.data.status_code == 200) {
            this.readAllRutas()
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
    async changeEstadoFrecuencia(row){
      var idfrecuencia = row.idFrec
      var estado
      if (row.ActiFrec == 1) {
        estado = 0
      }else{
        estado = 1
      }
      try {
        var objBody= {
        token:this.token,
        datos:{
          _frecuenciaId:idfrecuencia,
          _estado:estado,
        }
      }
      Swal.fire({
        title: row.ActiFrec == 1 ? 'Desactivar Frecuencia':'Activar Frecuencia',
        text: row.DescFrec,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: row.ActiFrec == 1 ? 'Si, desactivar.' : 'Si, activar.'
      }).then(async (result) => {
        if (result.isConfirmed) {
          var result = await this.$axios.put(process.env.baseUrl + "/update-frecuencias-estado", objBody)
          if (result.data.status_code == 200) {
            this.readAllFrecuenciasByRuta()
            this.$notify({
                message: result.data.msg,
                timeout: 1500,
                type: 'default'
              });
          } else {
            this.$notify({
                title: 'Error al cambiar estado',
                timeout: 3000,
                message: result.data.msg,
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
  },
  mounted() {
    this.readAllRutas();
    this.readTerminales();
  },
};
</script>
<style>

.cardRutasFrecuencias {
  height: calc(100vh - 11rem) !important;
  overflow: auto;
}

.cardBodyRutasFrecuencias {
  padding: 0%;
}

.cardRutasFrecuenciasr::-webkit-scrollbar {
  display: none;
}

.no-border-card .card-footer {
  border-top: 0;
}

body {
  overflow: auto !important;
}

.buttonNuevo{
  padding-right: 25px; 
  padding-bottom: 5px;
}
</style>
