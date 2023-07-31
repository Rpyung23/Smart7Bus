<template>
    <div class="content">
        <base-header>
            <div class="align-items-center py-3">
                <card class="no-border-card col" style="margin-bottom: 0.5rem"
                    body-classes="px-0 pb-1 card-bodyTopOpcionesRPagosVehiculoPRoduccion cardSelecMinutosTarjetas"
                    footer-classes="pb-2">

                    <div class="cardTextoRPerjudicado">

                        <el-select v-model="itemUnidadPanelProduccion" multiple filterable style="margin-right: 0.5rem"
                            remote placeholder="Ingrese unidad"
                            :remote-method="remoteMethodUnidadesPanelProduccionJustificacion"
                            :loading="loadingTableUnidadesPanelProduccoionLoading">
                            <el-option v-for="item in optionsUnidadesPanelProduccion" :key="item.CodiVehi"
                                :label="item.CodiVehi" :value="item.CodiVehi">
                            </el-option>
                        </el-select>


                        <el-date-picker type="date" placeholder="Select date and time" style="margin-right: 0.5rem;"
                            v-model="fechaInicialReportePerjudicado">
                        </el-date-picker>

                        <el-date-picker type="date" placeholder="Select date and time" style="margin-right: 0.5rem;"
                            v-model="fechaFinalReportePerjudicado">
                        </el-date-picker>

                    </div>

                    <div class="cardSelecMinutosTarjetas">
                        <div class="buttonsAdicionalesRMinutosTarjeta">
                            <base-button icon type="primary" size="sm" @click="readPerjudicado()">
                                <span class="btn-inner--icon"><i class="el-icon-search"></i></span>
                            </base-button>
                        </div>
                    </div>
                </card>

                <card class="no-border-card col" style="margin-bottom: 0.5rem"
                    body-classes="px-0 pb-1 card-bodyTopOpcionesRPagosVehiculoPRoduccion cardSelectRubrosEstadosPagosVehiculoProduccionContainer"
                    footer-classes="pb-2">
                    <div class="cardTextoRPagosVehiculoProduccion">
                        <el-select v-model="modelTiposEvento" multiple collapse-tags style="margin-right: 0.5rem"
                            placeholder="Rutas" :loading="loadingTableUnidadesSalidasPanelBusquedaloading">
                            <el-option v-for="item in mListaRutasSalidasSemanales" :key="item.LetrRuta"
                                :label="item.DescRuta" :value="item.LetrRuta">
                            </el-option>
                        </el-select>

                        <el-select style="margin-right: 0.5rem" collapse-tags
                            v-if="mListaGruposPenalidadesSemanales.length > 0 ? true : false"
                            v-model="itemGruposPenalidadesSemanales" multiple placeholder="Grupos">
                            <el-option v-for="item in mListaGruposPenalidadesSemanales" :key="item.id"
                                :label="item.descripcion" :value="item.id">
                            </el-option>
                        </el-select>

                    </div>
                </card>

                <card class="no-border-card" style="margin-bottom: 0rem" body-classes="card-bodyRVelocidades px-0 pb-1"
                    footer-classes="pb-2">
                    <div>
                        <el-table v-loading="loadingTableRPerjudicadoBusquedaloading"
                            element-loading-text="Cargando Datos..." :data="mListaRPerjudicado" row-key="id"
                            class="tablePanelControlProduccion" header-row-class-name="thead-dark"
                            height="calc(100vh - 13rem)">

                            <el-table-column v-for="column in tableColumnsUnidadesFlotaVehicular" :key="column.label"
                                v-bind="column">
                            </el-table-column>

                            <div slot="empty"></div>
                        </el-table>
                    </div>
                </card>

            </div>

        </base-header>
    </div>
</template>
<script>
import flatPicker from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";

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
    Checkbox
} from "element-ui";

import RouteBreadCrumb from "@/components/argon-core/Breadcrumb/RouteBreadcrumb";
import { BasePagination } from "@/components/argon-core";
import clientPaginationMixin from "~/components/tables/PaginatedTables/clientPaginationMixin";
import swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';
import Tabs from "@/components/argon-core/Tabs/Tabs";
import TabPane from "@/components/argon-core/Tabs/Tab";
import { getBase64LogoReportes } from "../../util/logoReport";
import *  as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { text } from "d3";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export default {
    mixins: [clientPaginationMixin],
    layout: "ProduccionDashboardLayout",
    components: {
        Tabs,
        TabPane,
        [Button.name]: Button,
        flatPicker,
        BasePagination,
        RouteBreadCrumb,
        [Select.name]: Select,
        [Option.name]: Option,
        [Table.name]: Table,
        [TableColumn.name]: TableColumn,
        [DatePicker.name]: DatePicker,
        [Notification.name]: Notification,
        [Autocomplete.name]: Autocomplete,
        [RadioButton.name]: RadioButton,
        [Radio.name]: Radio,
        [Checkbox.name]: Checkbox
    },
    data() {
        return {
            token: this.$cookies.get("token"),
            fechaInicialReportePerjudicado: "",
            fechaFinalReportePerjudicado: "",
            mListaUnidadesPanelProduccion: [],
            optionsUnidadesPanelProduccion: [],
            itemUnidadPanelProduccion: [],
            baseURlPDFPanelProduccionMinutosTarjetas: "",
            loadingTableUnidadesPanelProduccoionLoading: false,
            modelTiposEvento: [],
            loadingTableUnidadesSalidasPanelBusquedaloading: false,
            mListaRutasSalidasSemanales: [],
            mListaUnidadesSalidasPanelBusqueda: [],
            optionsUnidadesSalidasPanelBusqueda: [],
            itemUnidadSalidasPanelBusqueda: [],
            mListaGruposPenalidadesSemanales: [],
            itemGruposPenalidadesSemanales: [],
            loadingTableRPerjudicadoBusquedaloading: false,
            mListaRPerjudicado: [],
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
        initFechaActualProduccionPerjudicado() {
            var fecha = new Date();
            var mes = fecha.getMonth() + 1;
            var day = fecha.getDate();
            var format =
                fecha.getFullYear() +
                "-" +
                (mes < 10 ? "0" + mes : mes) +
                "-" +
                (day < 10 ? "0" + day : day);

            this.fechaInicialReportePerjudicado = format + " ";
            this.fechaFinalReportePerjudicado = format + " "
        },
        async readUnidadesTableroProduccionPerjudicado() {
            this.mListaUnidadesPanelProduccion = []
            try {
                var datos = await this.$axios.post(process.env.baseUrl + "/unidades", {
                    token: this.token
                })

                if (datos.data.status_code == 200) {

                    for (var i = 0; i < datos.data.data.length; i++) {
                        var obj = datos.data.data[i];
                        obj.value = obj.CodiVehi;
                        this.mListaUnidadesPanelProduccion.push(obj);
                    }
                }
            } catch (error) {
                console.log(error)
            }
        },
        async readEventosListaReporte() {
            this.mListaRutasSalidasSemanales = [];
            try {
                var datos = await this.$axios.post(process.env.baseUrl + "/rutes", {
                    token: this.token,
                    tipo: 1,
                });

                if (datos.data.status_code == 200) {
                    console.log(datos.data.data);
                    this.mListaRutasSalidasSemanales.push(...datos.data.data);
                } else {
                    Notification.info({
                        title: "Tipos Eventos Dispositivos",
                        message: datos.data.msm,
                    });
                }
            } catch (error) {
                Notification.error({
                    title: "Tipos Eventos Dispositivos",
                    message: error.toString(),
                });
            }
        },
        async readGruposActivosPenalidadesSemanales() {
            this.mListaGruposPenalidadesSemanales = [];

            var datos = await this.$axios.post(
                process.env.baseUrl + "/gruposActivos",
                {
                    token: this.token,
                }
            );

            if (datos.data.status_code == 200) {
                this.mListaGruposPenalidadesSemanales.push(...datos.data.data);
            }
        },
        async readRPErjudicado() {
            this.mListaRPerjudicado = [];
            this.loadingTableRPerjudicadoBusquedaloading = true;
            try {

            }
            catch (error) {
                Notification.error({
                    title: "Reporte Eventos Dispositivos",
                    message: error.toString(),
                });
                console.log(error);
            }
            this.loadingTableRPerjudicadoBusquedaloading = true;

        },
    },
    mounted() {
        this.readGruposActivosPenalidadesSemanales();
        this.readEventosListaReporte();
        this.readUnidadesTableroProduccionPerjudicado();
        this.initFechaActualProduccionPerjudicado();

    },
};
</script>

<style>
.cardMinutosTarjetas::-webkit-scrollbar {
    display: none;
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



.cardTextoRPerjudicado {
    display: flex;
    align-items: center;
    width: 60%;
}

.cardSelecMinutosTarjetas {
    display: flex;
    justify-content: space-between;
    align-items: center;
}


.no-border-card .card-footer {
    border-top: 0;
}

.card-bodyRPagosVehiculoProduccionPC {
    padding: 0rem !important;
    height: calc(100vh - 9.5rem);
    overflow: auto;
}

.card-bodyTopOpcionesRPagosVehiculoPRoduccion {
    padding-top: 0.25rem !important;
}
</style>