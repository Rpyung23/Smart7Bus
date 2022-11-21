<template>
    <div class="content">
    
        <base-header>
    
            <div class="align-items-center py-3">
    
    
    
                <card class="no-border-card" style="margin-bottom: 0rem" body-classes="card-bodyTTiposMantenimiento px-0 pb-1" footer-classes="pb-2">
    
                    <div class="row border-0">
    
                        <div class="col-12 text-right buttonNuevo">
    
                            <base-button @click="showModalAgregarTipoMantenimiento()" type="primary" icon size="sm">
    
                                <span class="btn-inner--icon"><i class="ni ni-fat-add"></i>Agregar Tipo</span>
    
                            </base-button>
    
                        </div>
    
                    </div>
    
                    <div>
    
                        <el-table v-loading="loadingTiposMantenimiento" element-loading-text="Cargando Datos..." :data="tableDataMantenimientoTiposMantenimiento" highlight-current-row height="calc(100vh - 9.1rem)" style="width: 100%" class="tablePanelTiposProduccion" header-row-class-name="thead-dark">
    
                            <el-table-column minWidth="70px" align="right" label="Actions">
    
                                <div slot-scope="{ row }" class="d-flex">
    
                                    <base-button class="edit" type="success" size="sm" icon @click="editTMantenimiento(row)">
    
                                        <i class="text-white ni ni-ruler-pencil"></i>
    
                                    </base-button>
    
                                    <base-button class="remove btn-link" :type="row.estado == 1 ? 'danger' : 'primary'" size="sm" icon @click="changeEstadoTMantenimiento(row)">
    
                                        <i :class="row.estado == 1 ? 'text-white ni ni-fat-remove' : 'text-white ni ni-check-bold'"></i>
    
                                    </base-button>
    
    
    
                                </div>
    
                            </el-table-column>
    
    
    
                            <el-table-column prop="mantenimiento" label="Mantenimiento" minWidth="80">
    
                            </el-table-column>
    
    
    
                            <el-table-column prop="texto" label="Texto" minWidth="110">
    
                            </el-table-column>
    
    
    
                            <el-table-column prop="detalle" label="Detalle" minWidth="110">
    
                            </el-table-column>
    
                            <el-table-column label="Estado" min-width="80px" prop="estado">
    
                                <template v-slot="{ row }">
    
                        <badge class="badge-dot mr-4" type="">
    
                          <i :class="`bg-${row.estado == 0 ? 'danger' : 'success'}`"></i>
    
                          <span class="status">{{
    
                              row.estado == 0 ? "Inactivo" : "Activo"
    
                          }}</span>
    
                        </badge>
</template>
                </el-table-column>
                
                <div slot="empty"></div>
              </el-table>
            </div>
          </card>
        </div>
      </base-header>

       <!--Form modal Agregar Admins-->
    <modal :show.sync="modalAgregarTipoMantenimiento">
      <validation-observer v-slot="{handleSubmit}" ref="formValidator">
      <form class="needs-validation"
            @submit.prevent="handleSubmit(firstFormSubmit)">
        <div class="form-row">
          <div class="col-md-12">
            <base-input
              name="Código"
              placeholder="Código"
              prepend-icon="ni ni-key-25"
              rules="required"
              v-model="idTipoMantenimiento">
            </base-input>
          </div>
          <div class="col-md-12">
            <br>
            <base-input
              prepend-icon="ni ni-single-copy-04"
              name="Texto"
              placeholder="Texto"
              rules="required"
              v-model="texto">
            </base-input>
          </div>
        </div>
        <br>
        <div class="form-row">  
          <div class="col-md-12">
            <base-input
              name="Detalle"
              placeholder="Detalle"
              prepend-icon="ni ni-single-copy-04"
              rules="required"
              v-model="detalle">
            </base-input>
          </div> 
        </div>
        <br>
        <div class="text-right">
          <base-button type="danger" @click="showModalAgregarTipoMantenimiento()">Cancelar</base-button>
          <base-button type="primary" v-if="editedIndexTMantenimiento == -1" @click="sendRegisterTMantenimiento()" native-type="submit">Agregar</base-button>
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
            tableDataMantenimientoTiposMantenimiento: [],
            loadingTiposMantenimiento: false,
            idTipoMantenimiento: '',
            texto: '',
            detalle: '',
            modalAgregarTipoMantenimiento: false,
            editedIndexTMantenimiento: -1,
            token: this.$cookies.get("token"),
            permisos: null
        };
    },
    methods: {
        async readTiposMantenimiento() {
            this.tableDataMantenimientoTiposMantenimiento = [];
            this.loadingTiposMantenimiento = true;
            try {
                var datos = await this.$axios.post(
                    process.env.baseUrlPanel + "/readTiposMantenimiento", {
                        token: this.token,
                    }
                );

                if (datos.data.status_code == 200) {
                    this.tableDataMantenimientoTiposMantenimiento.push(...datos.data.datos);
                } else if (datos.data.status_code == 300) {
                    Notification.info({
                        title: "Mantenimiento",
                        message: "No existen tipos mantenimiento registrados",
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
        async registerTMantenimiento() {
            try {
                var objBody = {
                    token: this.token,
                    datos: {
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
        showModalAgregarTipoMantenimiento(index, row) {
            this.modalAgregarTipoMantenimiento = this.modalAgregarTipoMantenimiento ? false : true
            this.limpiarRegisterTMantenimiento()
            if (this.modalAgregarTipoMantenimiento == false) {
                this.cancelarRegisterTMantenimiento()
            }
        },
        limpiarRegisterTMantenimiento() {
            this.idTipoMantenimiento = ''
            this.texto = ''
            this.detalle = ''
            this.editedIndexTMantenimiento = -1
        },
        cancelarRegisterTMantenimiento() {
            this.idTipoMantenimiento = ''
            this.texto = ''
            this.detalle = ''
            this.editedIndexTMantenimiento = -1
            this.modalAgregarTipoMantenimiento = false
        },
        sendRegisterTMantenimiento() {
            /*if (this.validarTMantenimiento()) {
                return;
            }*/
            this.registerTMantenimiento();
        },
        editTMantenimiento(row) {
            this.idTipoMantenimiento = row.mantenimiento
            this.texto = row.texto
            this.detalle = row.detalle
            this.idTipoMantenimientoAux = row.mantenimiento
            this.editedIndexTMantenimiento = 1
            this.modalAgregarTipoMantenimiento = true
        },
        async updateTMantenimiento() {
            try {
                var objBody = {
                    token: this.token,
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
        sendUpdateTMantenimiento() {
            /*if (this.validarTMantenimiento()) {
                return;
            }*/
            this.updateTMantenimiento();
        },
        async changeEstadoTMantenimiento(row) {
            var _estado
            if (row.estado == 1) {
                _estado = 0
            } else {
                _estado = 1
            }
            try {
                var objBody = {
                    token: this.token,
                    datos: {
                        _estado: _estado,
                        _idTipoMantenimiento: row.mantenimiento,
                    }
                }
                console.log("objBody tmante")
                console.log(objBody)
                Swal.fire({
                    title: row.estado == 1 ? 'Desactivar Tipo Mantenimiento' : 'Activar Tipo Mantenimiento',
                    text: row.texto,
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    cancelButtonText: 'Cancelar',
                    confirmButtonText: row.estado == 1 ? 'Si, desactivar.' : 'Si, activar.'
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        var result = await this.$axios.delete(process.env.baseUrl + "/update-tmantenimiento-estado", { data: objBody })
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
    },
    mounted() {
        this.permisos = this.$cookies.get("permisos")
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

.buttonNuevo {
    padding-top: 5px;
    padding-right: 25px;
    padding-bottom: 5px;
}
</style>
  