<template>
  <div class="content">
    <base-header>
      <div class="row align-items-center ">
        <div class="col">
          <tabs tabNavClasses="nav-fill flex-column flex-sm-row">
            <tab-pane >
              <div slot="title" @click="readAllRutas()">
                Rutas
              </div>
              <br />
              <card
                class="no-border-card cardRutasFrecuencias no-border-card"
                body-classes="px-0 pb-1 cardBodyFlotavehicular"
                footer-classes="pb-2"
              >
                <div class="col-12 text-right buttonNuevo">
                    <base-button type="primary" icon size="sm" @click="showModalAgregarRutaRutasFrecuencias()">
                      <span class="btn-inner--icon"><i class="ni ni-fat-add"></i>Agregar Ruta</span>
                    </base-button>
                </div>
                <el-table
                      height="calc(100vh - 13.7rem)"
                      :data="tableData"
                      row-key="id"
                      header-row-class-name="thead-dark"
                      @selection-change="SelectionChangeRutas">
                    >
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
                      height="calc(100vh - 13.7rem)"
                      :data="mListFrecuenciasByRuta"
                      row-key="id"
                      header-row-class-name="thead-dark"
                    >
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
            <tab-pane title="Controles"></tab-pane>
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
          prop: "LetrFrec",
          label: "Letra",
          minWidth: 95,
        },
        {
          prop: "DescRuta",
          label: "Ruta",
          minWidth: 230,
        },
        {
          prop: "LetrRuta",
          label: "Letra Ruta",
          minWidth: 135,
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
      tableData: [],
      selectedRows: [],
      token: this.$cookies.get("token"),
      modalAgregarRutaRutasFrecuencias:false,
      mListTerminalesAdmin: [],
      mSelectTerminalAdmin:'',
      descripcionRuta:'',
      letraRuta:'',
      intervaloRuta:'',
      salidaRuta:'',
      finalizacionRuta:'',
      idRuta:'',
      editedIndexRuta:-1,
      mListFrecuenciasByRuta:[],
      mListRutasSeleccionadas:[]
    };
  },
  methods: {
    SelectionChangeRutas(val) {
      this.mListRutasSeleccionadas = []
      for (var i = 0; i < val.length; i++) {
        this.mListRutasSeleccionadas.push(val[i].idRuta)
      }
    },
    deleteRow(row) {
      let indexToDelete = this.tableData.findIndex(
        (tableRow) => tableRow.id === row.id
      );
      if (indexToDelete >= 0) {
        this.tableData.splice(indexToDelete, 1);
      }
    },
    showToast(type,msm){
      var Toast = swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', swal.stopTimer)
        toast.addEventListener('mouseleave', swal.resumeTimer)
      }
    })

Toast.fire({
  icon: type,
  title: msm
})
    },
    selectionChange(selectedRows) {
      this.selectedRows = selectedRows;
    },
    async readAllRutas() {
      this.tableData = []
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
        this.showToast('danger',datos.data.msm)
      }else{
         this.showToast('warning','No existen rutas disponibles')
      }
    },
    async readAllFrecuenciasByRuta() {
      this.mListFrecuenciasByRuta = []
      var datos = await this.$axios.post(process.env.baseUrlPanel + "/frecuencias_rutas", {
        token: this.token,
        ruta:this.mListRutasSeleccionadas
      });

      if (datos.data.status_code == 200) 
      {
        console.log(datos.data.data)
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
        this.showToast('danger',datos.data.msm)
      }else{
         this.showToast('warning','No existen frecuencias disponibles')
      }
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
    async updateRuta(){
      console.log(this.mSelectTerminalAdmin)
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
    showModalAgregarRutaRutasFrecuencias(index, row) {
      this.modalAgregarRutaRutasFrecuencias = this.modalAgregarRutaRutasFrecuencias ? false : true
      if (this.modalAgregarRutaRutasFrecuencias == false) {
        this.cancelarRegisterRuta()
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
    async changeEstadoRuta(row){
      console.log("row estado")
      console.log(row)
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
      console.log("row estado")
      console.log(row)
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
  },
  mounted() {
    this.readAllRutas();
    this.readTerminales();
  },
};
</script>
<style>

.cardRutasFrecuencias {
  height: calc(100vh - 10rem) !important;
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
