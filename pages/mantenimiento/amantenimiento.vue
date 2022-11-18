<template>
    <div class="content">
      <base-header>
        <div class="align-items-center py-3">
          
          <card
            class="no-border-card"
            style="margin-bottom: 0rem"
            body-classes="card-bodyTTiposMantenimiento px-0 pb-1"
            footer-classes="pb-2"
          >
            <div class="row border-0">
                <div class="col-12 text-right buttonNuevo">
                    <base-button @click="showmodalAsignarTipoMantenimiento()" type="primary" icon size="sm">
                        <span class="btn-inner--icon"><i class="ni ni-fat-add"></i>Asignar Mantenimiento</span>
                    </base-button>
                </div>
            </div>
            <div>
              <el-table
                v-loading="loadingTiposMantenimiento"
                element-loading-text="Cargando Datos..."
                :data="tableDataMantenimientoAsignacionesMantenimiento"
                highlight-current-row
                row-key="id"
                height="calc(100vh - 9.1rem)"
                style="width: 100%"
                class="tablePanelTiposProduccion"
                header-row-class-name="thead-dark"
              >
              <el-table-column minWidth="70px" align="right" label="Actions">
                      <div slot-scope="{ row }" class="d-flex">
                        <base-button class="edit" type="success" size="sm" icon @click="editTMAntenimiento(row)">
                          <i class="text-white ni ni-ruler-pencil"></i>
                        </base-button>
                        <!--<base-button class="remove btn-link" :type="row.estado == 1 ? 'danger' : 'primary'" size="sm" icon @click="changeEstadoTMantenimiento(row)">
                          <i :class="row.estado == 1 ? 'text-white ni ni-fat-remove' : 'text-white ni ni-check-bold'"></i>
                        </base-button>-->
                        
                      </div>
                    </el-table-column>

                <el-table-column prop="unidad" label="Unidad" minWidth="80">
                </el-table-column>
  
                <el-table-column
                  prop="idTipoMantenimiento"
                  label="Cod. Mantenimiento"
                  minWidth="130"
                >
                </el-table-column>
  
                <el-table-column prop="detalleMantenimiento" label="Detalle" minWidth="100">
                </el-table-column>
                <el-table-column prop="fechaAsignacion" label="Fecha" minWidth="120">
                </el-table-column>
                <el-table-column prop="km_mantenimiento" label="KM-Mantenimiento" minWidth="130">
                </el-table-column>
                <el-table-column prop="tiempo_mantenimiento" label="Tiempo-Mantenimiento" minWidth="150">
                </el-table-column>
                
                <div slot="empty"></div>
              </el-table>
            </div>
          </card>
        </div>
      </base-header>

       <!--Form modal Agregar Admins-->
    <modal :show.sync="modalAsignarTipoMantenimiento">
      <validation-observer v-slot="{handleSubmit}" ref="formValidator">
      <form class="needs-validation"
            @submit.prevent="handleSubmit(firstFormSubmit)">
        <div class="form-row">
          <div class="col-md-6">
            <el-select
                v-model="mSelectUnidad"
                filterable
                remote
                reserve-keyword
                style="width:100%"
                placeholder="Ingrese unidad"
                :remote-method="remoteMethodUnidades"
                :loading="loading">
                <el-option
                v-for="item in optionsUnidades"
                :key="item.CodiVehi"
                :label="item.CodiVehi"
                :value="item.CodiVehi">
                </el-option>
            </el-select>
          </div>
          <div class="col-md-6">
            <el-select
                v-model="mSelectTipoMantenimiento"
                style="width:100%"
                placeholder="Tipo Mantenimiento">
                <el-option
                v-for="item in mListaTiposMantenimiento"
                :key="item.mantenimiento"
                :label="item.detalle"
                :value="item.mantenimiento">
                </el-option>
            </el-select>
          </div>
        </div>
        <br>
        <div class="form-row">  
          <div class="col-md-6">
            <base-input
              name="KM Mantenimiento"
              type="number"
              step="any"
              placeholder="KM Mantenimiento"
              prepend-icon="ni ni-compass-04"
              rules="required"
              v-model="kmMantenimiento">
            </base-input>
          </div> 
          <div class="col-md-6">
            <base-input
              name="Tiempo Mantenimiento"
              type="number"
              placeholder="Tiempo Mantenimiento"
              prepend-icon="ni ni-watch-time"
              rules="required"
              v-model="tiempoMantenimiento">
            </base-input>
          </div> 
        </div>
        <br>
        <div class="text-right">
          <base-button type="danger" @click="showmodalAsignarTipoMantenimiento()">Cancelar</base-button>
          <base-button type="primary" v-if="editedIndexTMantenimiento == -1" @click="asignarTipoMantenimientoUndiad()" native-type="submit">Agregar</base-button>
          <base-button type="primary" v-else @click="sendUpdateTMantenimiento()" native-type="submit">Actualizar</base-button>
        </div>
      </form>
    </validation-observer>     
    </modal>

    </div>
  </template>
  <script>
  import flatPicker from "vue-flatpickr-component";
  import "flatpickr/dist/flatpickr.css";
  import {
    Table,
    TableColumn,
    Button,
    Select,
    Option,
    Autocomplete,
    DatePicker,
    RadioButton,
    Radio,
    Notification,
  } from "element-ui";
  
  import RouteBreadCrumb from "@/components/argon-core/Breadcrumb/RouteBreadcrumb";
  import { BasePagination } from "@/components/argon-core";
  import clientPaginationMixin from "~/components/tables/PaginatedTables/clientPaginationMixin";
  import Swal from "sweetalert2";
  import Tabs from "@/components/argon-core/Tabs/Tabs";
  import TabPane from "@/components/argon-core/Tabs/Tab";
  import pdfMake from "pdfmake/build/pdfmake.js";
  import pdfFonts from "pdfmake/build/vfs_fonts.js";
  import { getBase64LogoReportes } from "../../util/logoReport";
  
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
  
  export default {
    mixins: [clientPaginationMixin],
    layout: "MantenimientoDashboardLayout",
    components: {
      Tabs,
      TabPane,
      BasePagination,
      flatPicker,
      RouteBreadCrumb,
      [DatePicker.name]: DatePicker,
      [Select.name]: Select,
      [Option.name]: Option,
      [Table.name]: Table,
      [Notification.name]: Notification,
      [Autocomplete.name]: Autocomplete,
      [TableColumn.name]: TableColumn,
      [RadioButton.name]: RadioButton,
      [Radio.name]: Radio,
      [Button.name]: Button,
    },
    data() {
      return {
        tableDataMantenimientoAsignacionesMantenimiento: [],
        loadingTiposMantenimiento: false,
        idTipoMantenimiento:'',
        texto:'',
        detalle:'',
        modalAsignarTipoMantenimiento:false,
        editedIndexTMantenimiento:-1,
        token: this.$cookies.get("token"),
        mListaUnidades:[],
        mSelectUnidad:'',
        mSelectTipoMantenimiento:'',
        loading:false,
        optionsUnidades:[],
        mListaTiposMantenimiento:[],
        permisos: null
      };
    },
    methods: {
        async  readAsignacionesMantenimiento () {
        this.tableDataMantenimientoAsignacionesMantenimiento = [];
        this.loadingTiposMantenimiento = true;
        try {
            var datos = await this.$axios.post(
            process.env.baseUrlPanel + "/readAsignacionMantenimiento",
            {
                token: this.token,
            }
            );

            if (datos.data.status_code == 200) {
            this.tableDataMantenimientoAsignacionesMantenimiento.push(...datos.data.datos);
            } else if (datos.data.status_code == 300) {
            Notification.info({
                title: "Mantenimiento",
                message: "No existen asignaciones mantenimiento registrados",
            });
            } else {
            Notification.error({
                title: "Error Api Mantenimiento",
                message: datos.data.msm,
            });
            }
        } catch (error) {
            Notification.error({ title: "Error Catch", msm: error.toString() });
        }
        this.loadingTiposMantenimiento = false;
        },
        async registerTMantenimiento(){
        try {
            var objBody= {
            token:this.token,
            datos:{
                _idTipoMantenimiento: this.idTipoMantenimiento,
                _texto: this.texto,
                _detalle: this.detalle,
            }
        }
        console.log(objBody)
        var result = await this.$axios.post(process.env.baseUrl + "/register-tmantenimiento", objBody)
        if (result.data.status_code == 200) {
        this.readTiposMantenimiento()
        this.limpiarRegisterTMantenimiento()
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
        showmodalAsignarTipoMantenimiento(index, row) {
            this.modalAsignarTipoMantenimiento = this.modalAsignarTipoMantenimiento ? false : true
            this.limpiarRegisterTMantenimiento()
            if (this.modalAsignarTipoMantenimiento == false) {
                this.cancelarRegisterTMantenimiento()
            }
        },
        limpiarRegisterTMantenimiento(){
            this.idTipoMantenimiento  = ''
            this.texto   = ''
            this.detalle  = ''
            this.editedIndexTMantenimiento = -1
        },
        cancelarRegisterTMantenimiento(){
            this.idTipoMantenimiento  = ''
            this.texto   = ''
            this.detalle  = ''
            this.editedIndexTMantenimiento = -1
            this.modalAsignarTipoMantenimiento = false
        },
        sendRegisterTMantenimiento(){
            /*if (this.validarTMantenimiento()) {
                return;
            }*/
            this.registerTMantenimiento();
        },
        editTMAntenimiento(row){
            this.idTipoMantenimiento = row.mantenimiento
            this.texto = row.texto
            this.detalle = row.detalle
            this.idTipoMantenimientoAux = row.mantenimiento
            this.editedIndexTMantenimiento = 1
            this.modalAsignarTipoMantenimiento = true
        },
        async updateTMantenimiento(){
            try {
                var objBody= {
                token:this.token,
                datos: {
                    _idTipoMantenimiento: this.idTipoMantenimiento,
                    _texto: this.texto,
                    _detalle: this.detalle,
                    _idTipoMantenimientoAux: this.idTipoMantenimientoAux
                }
            }
            var result = await this.$axios.put(process.env.baseUrl + "/update-tmantenimiento", objBody)
            if (result.data.status_code == 200) {
            this.readTiposMantenimiento()
            this.limpiarRegisterTMantenimiento()
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
        sendUpdateTMantenimiento(){
            /*if (this.validarTMantenimiento()) {
                return;
            }*/
            this.updateTMantenimiento();
        },
        async changeEstadoTMantenimiento(row){
            var _estado
            if (row.estado == 1) {
                _estado = 0
            }else{
                _estado = 1
            }
            try {
                var objBody= {
                token:this.token,
                datos:{
                _estado:_estado,
                _idTipoMantenimiento:row.mantenimiento,
                }
            }
            console.log("objBody tmante")
            console.log(objBody)
            Swal.fire({
                title: row.estado == 1 ? 'Desactivar Tipo Mantenimiento':'Activar Tipo Mantenimiento',
                text: row.texto,
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: 'Cancelar',
                confirmButtonText: row.estado == 1 ? 'Si, desactivar.' : 'Si, activar.'
            }).then(async (result) => {
                if (result.isConfirmed) {
                var result = await this.$axios.delete(process.env.baseUrl + "/update-tmantenimiento-estado", {data:objBody})
                if (result.data.status_code == 200) {
                    this.readTiposMantenimiento()
                    this.$notify({
                        message: result.data.msm,
                        timeout: 1500,
                        type: 'default'
                    });
                } else {
                    this.$notify({
                        title: 'Error',
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
        async readAllUnidades() {
            var datos = await this.$axios.post(process.env.baseUrl + "/unidades", {
                token: this.token,
            });
            if (datos.data.status_code == 200) {
                for (var i = 0; i < datos.data.data.length; i++) {
                    var obj = datos.data.data[i];
                    obj.value = obj.CodiVehi;
                    this.mListaUnidades.push(obj);
                }
            }
        },
        remoteMethodUnidades(query) {
            if (query !== "") {
                this.loading= true;
                setTimeout(() => {
                this.loading = false;
                this.optionsUnidades=
                    this.mListaUnidades.filter((item) => {
                    return (
                        item.CodiVehi.toLowerCase().indexOf(query.toLowerCase()) > -1
                    );
                    });
                }, 200);
            } else {
                this.optionsUnidades= [];
            }
        },
        async readTiposMantenimiento () {
        this.mListaTiposMantenimiento = [];
            var datos = await this.$axios.post(
            process.env.baseUrlPanel + "/readTiposMantenimiento",
            {
                token: this.token,
            }
            );
            if (datos.data.status_code == 200) {
            this.mListaTiposMantenimiento.push(...datos.data.datos);
            }    
            console.log("mListaTiposMantenimiento")
            console.log(this.mListaTiposMantenimiento)
        },
        async asignarTipoMantenimientoUndiad(){
      try {      
      var objBody= {
        token:this.token,
            unidad:this.mSelectUnidad,
            idTipoMantenimiento:this.mSelectTipoMantenimiento,
            kmMantenimiento:this.kmMantenimiento,
            tiempoMantenimiento:this.tiempoMantenimiento

      }
      var result = await this.$axios.post(process.env.baseUrl + "/register-tmantenimiento-unidad", objBody)
      if (result.data.status_code == 200) {
        this.readAsignacionesMantenimiento();
        this.$notify({
            timeout: 3000,
            message: result.data.msm,
            type: 'success'
            
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
    },
    mounted() 
    {
        this.permisos = this.$cookies.get("permisos")
        this.readAsignacionesMantenimiento();
        this.readAllUnidades();
        this.readTiposMantenimiento();
    },
  };
  </script>
  <style>
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
  
  .no-border-card .card-footer {
    border-top: 0;
  }
  .card-bodyTTiposMantenimiento {
    padding: 0rem !important;
    height: calc(100vh - 5.8rem);
    overflow: auto;
  }
  
  .card-bodyTopOpcionesTiposMantenimientos {
    padding-top: 0.25rem !important;
  }

.buttonNuevo{
  padding-top: 5px; 
  padding-right: 25px; 
  padding-bottom: 5px;
}
  </style>
  