<template>
    <div class="content">
        <base-header>
            <div class="align-items-center py-3">
                <card class="no-border-card col" style="margin-bottom: 0.5rem"
                    body-classes="px-0 pb-1 card-bodyTopOpcionesRPagosVehiculoPRoduccion cardSelectRubrosEstadosPagosVehiculoProduccionContainer"
                    footer-classes="pb-2">
                    <div class="cardTextoRPagosVehiculoProduccion">
                        <el-select v-model="itemUnidadSalidasPanelBusqueda" multiple filterable style="margin-right: 0.5rem"
                            remote placeholder="Ingrese unidad" :remote-method="remoteMethodUnidadesSalidasPanelBusqueda"
                            :loading="loadingTableUnidadesSalidasPanelBusquedaloading">
                            <el-option v-for="item in optionsUnidadesSalidasPanelBusqueda" :key="item.CodiVehi"
                                :label="item.CodiVehi" :value="item.CodiVehi">
                            </el-option>
                        </el-select>


                        <div class="el-range-separator">
                            <el-date-picker v-model="datePickerRhrrecorrido" type="datetimerange" range-separator=" Hasta "
                                format="yyyy-MM-dd HH:mm:ss" start-placeholder="Fecha Inicial"
                                end-placeholder="Fecha Final">
                            </el-date-picker>
                        </div>



                    </div>

                    <div class="buttonsAdicionalesRVelocidad">
                        <base-button icon type="primary" size="sm" @click="readRDispositivoEventos()">
                            <span class="btn-inner--icon"><i class="el-icon-search"></i></span>
                        </base-button>


                    </div>
                </card>

                <card class="no-border-card col" style="margin-bottom: 0.5rem"
                    body-classes="px-0 pb-1 card-bodyTopOpcionesRPagosVehiculoPRoduccion cardSelectRubrosEstadosPagosVehiculoProduccionContainer"
                    footer-classes="pb-2">
                    <div class="cardTextoRPagosVehiculoProduccion">
                        <el-select style="margin-right: 0.5rem" collapse-tags
                            v-if="mListaGruposPenalidadesSemanales.length > 0 ? true : false"
                            v-model="itemGruposPenalidadesSemanales" multiple placeholder="Grupos">
                            <el-option v-for="item in mListaGruposPenalidadesSemanales" :key="item.id"
                                :label="item.descripcion" :value="item.id">
                            </el-option>
                        </el-select>

                        <el-select v-model="modelTiposEvento" multiple collapse-tags style="margin-right: 0.5rem"
                            placeholder="Rutas" :loading="loadingTableUnidadesSalidasPanelBusquedaloading">
                            <el-option v-for="item in mListaRutasSalidasSemanales" :key="item.LetrRuta"
                                :label="item.DescRuta" :value="item.LetrRuta">
                            </el-option>
                        </el-select>
                    </div>
                </card>

                <card class="no-border-card" style="margin-bottom: 0rem" body-classes="card-bodyRFueraRuta px-0 pb-1"
                    footer-classes="pb-2">
                    <div>
                        <div>
                            <el-table v-loading="loadingTableRVelocidadesBusquedaloading"
                                element-loading-text="Cargando Datos..." :data="mListaREventosDispositivos" row-key="id"
                                class="tablePanelControlProduccion" header-row-class-name="thead-dark"
                                height="calc(100vh - 13.5rem)">

                                <el-table-column prop="" label="Unidad" minWidth="110">
                                </el-table-column>

                                <el-table-column prop="" label="N-vuelta" minWidth="180">
                                </el-table-column>

                                <el-table-column prop="" label="Grupo" minWidth="140">
                                </el-table-column>

                                <el-table-column prop="" label="Ruta" minWidth="140">
                                </el-table-column>

                                <el-table-column prop="" label="Velocidad" minWidth="140">
                                </el-table-column>

                                <el-table-column prop="" label="Latitud" minWidth="110">
                                </el-table-column>

                                <el-table-column prop="" label="Longitud" minWidth="180">
                                </el-table-column>

                                <div slot="empty"></div>
                            </el-table>
                        </div>

                        <div slot="empty"></div>

                    </div>
                </card>
            </div>
        </base-header>


    </div>
</template>
<script>

import flatpickr from "vue-flatpickr-component";
import pdfMake from "pdfmake/build/pdfmake.js";
import pdfFonts from "pdfmake/build/vfs_fonts.js";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { getFecha_dd_mm_yyyy, getformatFechaDateTime } from "../util/fechas";
import { getBase64LogoReportes } from "../util/logoReport";
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

export default {
    mixins: [clientPaginationMixin],
    layout: "DashboardLayout",
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
        [Checkbox.name]: Checkbox,
        [CheckboxButton.name]: CheckboxButton,
        [CheckboxGroup.name]: CheckboxGroup,
        [Popover.name]: Popover,
        [Button.name]: Button,
        [Switch.name]: Switch,
        flatpickr,
    },
    data() {
        return {
            mListaUnidadesSalidasPanelBusqueda: [],
            mListLineasSalidasPanelBusqueda: [],
            loadingTableRVelocidadesBusquedaloading: false,
            loadingTableUnidadesSalidasPanelBusquedaloading: false,
            itemUnidadSalidasPanelBusqueda: [],
            token: this.$cookies.get("token"),
            fechaInicialSalidasPanelBusqueda: "",
            mListaGruposPenalidadesSemanales: [],
            itemGruposPenalidadesSemanales: [],
            fechaFinalSalidasPanelBusqueda: "",
            optionsUnidadesSalidasPanelBusqueda: [],
            mListaRutasSalidasSemanales: [],
            tableColumnsUnidadesFlotaVehicular: [],
            mListaPosicionesFueraRuta: [],
            mListaREventosDispositivos: [],
            modalUbicacionEventoDispositivo: false,
            mListaTiposEventos: [],
            modelTiposEvento: [],
            datePickerRhrrecorrido: [],
        };
    },

    methods: {
        remoteMethodUnidadesSalidasPanelBusqueda(query) {
            if (query !== "") {
                this.loadingTableUnidadesSalidasPanelBusquedaloading = true;
                setTimeout(() => {
                    this.loadingTableUnidadesSalidasPanelBusquedaloading = false;
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


    },
    mounted() {
        this.datePickerRhrrecorrido = [
            getFecha_dd_mm_yyyy(new Date()) + " 05:00:00",
            getFecha_dd_mm_yyyy(new Date()) + " 23:00:00",
        ];
        this.readGruposActivosPenalidadesSemanales();
        this.readEventosListaReporte();
        this.readAllUnidadesSalidasPanelBusqueda();
    },
};
</script>
<style>
.switch_RutaActiveFueraRuta {
    position: absolute;
    z-index: 100000000;
    background-color: whitesmoke;
    padding: 0.5rem;
    border-radius: 0.5rem;
    right: 0;
    margin-right: 00.5rem;
    margin-top: 00.5rem;
}

.mapaEventosDispositivos {
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

.card-bodyRFueraRuta {
    padding: 0rem !important;
    height: calc(100vh - 13.2rem);
    overflow: auto;
}

.card-bodyTopOpcionesRPagosVehiculoPRoduccion {
    padding-top: 0.25rem !important;
}

.buttonsAdicionalesRVelocidad {
    display: flex;
    justify-content: center;
    align-items: center;
}

.el-range-separator {
    width: fit-content !important;
}
</style>
  