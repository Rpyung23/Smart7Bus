<template>
    <div class="content">
        <base-header>
            <div class="align-items-center py-3">
                <card class="no-border-card col" style="margin-bottom: 0.5rem"
                    body-classes="px-0 pb-1 card-bodyTopOpcionesRPagosVehiculoPRoduccion cardSelectRubrosEstadosPagosVehiculoProduccionContainer"
                    footer-classes="pb-2">
                    <div class="cardTextoRPagosVehiculoProduccion">
                        <el-select v-model="itemUnidadSalidasPanelBusqueda" multiple filterable
                            style="margin-right: 0.5rem" remote placeholder="Ingrese unidad"
                            :remote-method="remoteMethodUnidadesSalidasPanelBusqueda"
                            :loading="loadingTableUnidadesSalidasPanelBusquedaloading">
                            <el-option v-for="item in optionsUnidadesSalidasPanelBusqueda" :key="item.CodiVehi"
                                :label="item.CodiVehi" :value="item.CodiVehi">
                            </el-option>
                        </el-select>

                        <base-input title="Buscar" addon-left-icon="ni ni-calendar-grid-58"
                            style="margin-right: 0.5rem">
                            <flat-picker slot-scope="{ focus, blur }" @on-open="focus" @on-close="blur"
                                :config="{ allowInput: true }" class="form-controlPersonal datepicker"
                                v-model="fechaInicialSalidasPanelBusqueda">
                            </flat-picker>
                        </base-input>

                        <base-input title="Exportar a PDF" addon-left-icon="ni ni-calendar-grid-58">
                            <flat-picker slot-scope="{ focus, blur }" @on-open="focus" @on-close="blur"
                                :config="{ allowInput: true }" class="form-controlPersonal datepicker"
                                v-model="fechaFinalSalidasPanelBusqueda">
                            </flat-picker>
                        </base-input>
                    </div>

                    <div class="buttonsAdicionalesRVelocidad">
                        <base-button icon type="primary" size="sm" @click="readRContarExcVelocidades()">
                            <span class="btn-inner--icon"><i class="el-icon-search"></i></span>
                        </base-button>

                        <base-button size="sm" title="EXPORTAR PDF"
                            v-if="mListaREventosDispositivos.length > 0 ? true : false" type="danger"
                            @click="exportPdfRDispositivoEventos()">
                            <span class="btn-inner--icon"><i class="ni ni-cloud-download-95"></i></span>
                        </base-button>
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
                    </div>
                </card>

                <card class="no-border-card" style="margin-bottom: 0rem" body-classes="card-bodyRVelocidades px-0 pb-1"
                    footer-classes="pb-2">
                    <div>
                        <el-table v-loading="loadingTableRVelocidadesBusquedaloading"
                            element-loading-text="Cargando Datos..." :data="mListaREventosDispositivos" row-key="id"
                            class="tablePanelControlProduccion" header-row-class-name="thead-dark"
                            height="calc(100vh - 13rem)">
                            <!-- <el-table-column label="Actions" width="150">
                                <template slot-scope="scope">
                                    <base-button size="sm" title="UBICAR EVENTO EN MAPA"
                                        @click="showMapaFueraRutas(scope.row)" type="success"><i
                                            class="ni ni-world"></i></base-button>
                                </template>
                            </el-table-column> -->

                            <el-table-column v-for="column in tableColumnsUnidadesFlotaVehicular" :key="column.label"
                                v-bind="column">
                            </el-table-column>

                            <!-- <el-table-column prop="tot" label="TOTAL ($)" width="230">
                                <template slot-scope="scope">
                                    <strong style="font-size: 1rem; color: black">{{
                                        scope.row.tot
                                        }}</strong>
                                </template>
                            </el-table-column> -->

                            <div slot="empty"></div>
                        </el-table>
                    </div>
                </card>
            </div>
        </base-header>

    </div>
</template>
<script>
import pdfMake from "pdfmake/build/pdfmake.js";
import pdfFonts from "pdfmake/build/vfs_fonts.js";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import { getBase64LogoReportes } from "../util/logoReport";
import flatPicker from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import {getFecha_dd_mm_yyyy, validaRangoFechaNoMas30Dias } from "../util/fechas";
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
            fechaFinalSalidasPanelBusqueda: "",
            optionsUnidadesSalidasPanelBusqueda: [],
            mListaRutasSalidasSemanales: [],
            tableColumnsUnidadesFlotaVehicular: [
                {
                    prop: "unidad",
                    label: "Unidad",
                    minWidth: 110,
                },
                {
                    prop: "descripcion",
                    label: "Ruta",
                    minWidth: 140,
                },
                {
                    prop: "Fecha",
                    label: "F. Inicial",
                    minWidth: 150,
                },
                {
                    prop: "FechaFin",
                    label: "F. Final",
                    minWidth: 185,
                },
                {
                    prop: "Excesos",
                    label: "T. Eventos Ex Velocidad",
                    minWidth: 200,
                },
            ],
            mListaREventosDispositivos: [],
            mListaTiposEventos: [],
            modelTiposEvento: [],
            mListaHistoryPuertas: [],
            modaMapaHistoryPuertas: false,
            titleModalMapaPuerta: "",
            mTrazadoTramaProhibido: []
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
        initFechaActualSalidaBusquedaPanel() {
            var fecha = new Date();
            var mes = fecha.getMonth() + 1;
            var day = fecha.getDate();
            var format =
                fecha.getFullYear() +
                "-" +
                (mes < 10 ? "0" + mes : mes) +
                "-" +
                (day < 10 ? "0" + day : day);

            this.fechaInicialSalidasPanelBusqueda = format;
            this.fechaFinalSalidasPanelBusqueda = format;
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
        async readRContarExcVelocidades() {

            if (!validaRangoFechaNoMas30Dias(getFecha_dd_mm_yyyy(this.fechaInicialSalidasPanelBusqueda),
                getFecha_dd_mm_yyyy(this.fechaFinalSalidasPanelBusqueda))) {
                Notification.warning({
                    title: "RAGO MAXIMO 31 DIAS",
                    message: 'SOLO SE PERMITE UN MAXIMO DE 31 DIAS',
                    duration: 2000,
                });
                return
            }

            this.mListaREventosDispositivos = [];
            this.loadingTableRVelocidadesBusquedaloading = true;
            try {
                var datos = await this.$axios.post(
                    process.env.baseUrl + "/RContarExcVelocidad",
                    {
                        token: this.token,
                        unidades:
                            this.itemUnidadSalidasPanelBusqueda.length > 0
                                ? this.itemUnidadSalidasPanelBusqueda
                                : "*",
                        fechaI: this.fechaInicialSalidasPanelBusqueda,
                        fechaF: this.fechaFinalSalidasPanelBusqueda,
                        rutas:
                            this.modelTiposEvento.length <= 0 ? "*" : this.modelTiposEvento,
                    },
                    {
                        timeout: 600000,
                    }
                );

                if (datos.data.status_code == 200) {
                    this.mListaREventosDispositivos.push(...datos.data.datos);
                } else {
                    Notification.info({
                        title: "Reporte Excesos de Velocidades",
                        message: datos.data.msm,
                    });
                }
            } catch (error) {
                Notification.error({
                    title: "Reporte Excesos de Velocidades",
                    message: error.toString(),
                });
                console.log(error);
            }
            this.loadingTableRVelocidadesBusquedaloading = false;
        },
        async exportPdfRDispositivoEventos() {
            var empresa = [
                {
                    text: "Empresa : " + this.$cookies.get("nameEmpresa"),
                    fontSize: 11,
                    alignment: "left",
                },
            ];
            var unidad = [
              /*   {
                    text:
                        "Flota Vehicular : " +
                        (this.itemUnidadSalidasPanelBusqueda.length > 0
                            ? this.itemUnidadSalidasPanelBusqueda.toString()
                            : "Toda la flota"),
                    fontSize: 11,
                    alignment: "left",
                }, */
            ];
            var desde_hasta = [
                {
                    text:
                        "Fecha : " +
                        this.fechaInicialSalidasPanelBusqueda +
                        " hasta " +
                        this.fechaFinalSalidasPanelBusqueda,
                    fontSize: 11,
                    alignment: "left",
                },
            ];

            var resultadoString = [
                [
                    
                    {
                        text: "Unidad",
                        fontSize: 8.5,
                        bold: true,
                        fillColor: "#039BC4",
                        color: "white",
                        alignment: "center",
                    },
                    {
                        text: "Ruta",
                        fontSize: 8.5,
                        bold: true,
                        fillColor: "#039BC4",
                        color: "white",
                        alignment: "center",
                    },
                    {
                        text: "Fecha Inicial",
                        fontSize: 8.5,
                        bold: true,
                        fillColor: "#039BC4",
                        color: "white",
                        alignment: "center",
                    },
                    {
                        text: "Fecha Final",
                        fontSize: 8.5,
                        bold: true,
                        fillColor: "#039BC4",
                        color: "white",
                        alignment: "center",
                    },
                    {
                        text: "Eventos Exceso de Velocidad",
                        fontSize: 8.5,
                        bold: true,
                        fillColor: "#039BC4",
                        color: "white",
                        alignment: "center",
                    },
                ],
            ];


            for (var i = 0; i < this.mListaREventosDispositivos.length; i++) {
                var arrys = [
                    {
                        text: this.mListaREventosDispositivos[i].unidad,
                        alignment: "center",
                        fontSize: 8.5,
                    },
                    {
                        text: this.mListaREventosDispositivos[i].descripcion,
                        fontSize: 8.5,
                        alignment: "center",
                    },
                    {
                        text: this.mListaREventosDispositivos[i].Fecha,
                        fontSize: 8.5,
                        alignment: "center",
                    },
                    {
                        text: this.mListaREventosDispositivos[i].FechaFin,
                        fontSize: 8.5,
                        alignment: "center",
                    },
                    {
                        text: this.mListaREventosDispositivos[i].Excesos,
                        fontSize: 8.5,
                        alignment: "center",
                    },

                ];
                resultadoString.push(arrys);
            }

            var docDefinition = {
                pageSize: "A4",
                pageMargins: [40, 80, 40, 60],
                header: {
                    margin: 15,
                    columns: [
                        {
                            image: getBase64LogoReportes(this.$cookies.get("empresa")),
                            width: 100,
                            height: 50,
                            margin: [30, 0, 0, 0],
                        },
                        {
                            layout: "noBorders",
                            table: {
                                widths: ["*"],
                                body: [
                                    [
                                        {
                                            text: "REPORTE EVENTOS DE EXCESO DE VELOCIDAD",
                                            alignment: "center",
                                            fontSize: 16,
                                            bold: true,
                                        },
                                    ],

                                ],
                            },
                        },
                    ],
                },
                content: [
                    {
                        layout: "noBorders",
                        table: {
                            headerRows: 0,
                            widths: [450, 450, 450],
                            body: [empresa, desde_hasta],
                        },
                    },
                    {
                        table: {
                            // headers are automatically repeated if the table spans over multiple pages
                            // you can declare how many rows should be treated as headers
                            headerRows: 0,
                            widths: [40, 120, 80, 80, 90],
                            body: resultadoString,
                        },
                    },
                ],
            };
            pdfMake.createPdf(docDefinition).download("REEV_" + Date.now());
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
    },
    mounted() {
        this.readEventosListaReporte();
        this.initFechaActualSalidaBusquedaPanel();
        this.readAllUnidadesSalidasPanelBusqueda();
    },
};
</script>

<style>
.ContainerLeyendaPuert {
    position: absolute;
    z-index: 9;
    height: 10rem;
    width: 10rem;
    background: "#FFFF";
    margin-right: 1rem;
}

.containerTitleModalMapaPuerta {
    position: absolute;
    width: 100%;
    z-index: 9;
    background: #2dce89;
    color: white;
    font-weight: bold;
}


.paddingLabel {
    margin-bottom: 2.9rem;
    font-weight: bold;
}

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

.card-bodyRVelocidades {
    padding: 0rem !important;
    height: calc(100vh - 12.95rem);
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

.paddingLabelHistoryPuertas {
    margin-bottom: 2.9rem;
    font-weight: bold;
}
</style>