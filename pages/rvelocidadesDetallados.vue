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

                        <base-input addon-left-icon="ni ni-calendar-grid-58" style="margin-right: 0.5rem">
                            <flat-picker slot-scope="{ focus, blur }" @on-open="focus" @on-close="blur"
                                :config="{ allowInput: true }" class="form-controlPersonal datepicker"
                                v-model="fechaInicialSalidasPanelBusqueda">
                            </flat-picker>
                        </base-input>

                        <div>
                            <el-form-item label="Horas">
                                <el-time-picker is-range range-separator="Hasta" v-model="RangeHorasRecorrido"
                                    start-placeholder="Hora Inicial" end-placeholder=" Hora Final"
                                    :config="{ allowInput: true }">
                                </el-time-picker>
                            </el-form-item>
                        </div>

                    </div>


                    <div class="buttonsAdicionalesRVelocidad">
                        <base-button icon type="primary" size="sm" @click="readRVelocidadesDetallados()">
                            <span class="btn-inner--icon"><i class="el-icon-search"></i></span>
                        </base-button>
                    </div>
                </card>

                <card class="no-border-card col" style="margin-bottom: 0.5rem"
                    body-classes="px-0 pb-1 card-bodyTopOpcionesRPagosVehiculoPRoduccion cardSelectRubrosEstadosPagosVehiculoProduccionContainer"
                    footer-classes="pb-2">
                    <div class="cardTextoRPagosVehiculoProduccion">
                        <el-select style="margin-right: 0.5rem" collapse-tags
                            v-if="mListaGruposPenalidadesSemanales.length > 0" v-model="itemGruposPenalidadesSemanales"
                            multiple placeholder="Grupos">
                            <el-option v-for="item in mListaGruposPenalidadesSemanales" :key="item.id"
                                :label="item.descripcion" :value="item.id">
                            </el-option>
                        </el-select>

                        <el-select v-model="modelTiposEvento" multiple collapse-tags style="margin-right: 0.5rem"
                            placeholder="Rutas" :loading="loadingTableUnidadesSalidasPanelBusquedaloading"
                            @change="updateSelectedRouteDescriptions">
                            <el-option v-for="item in mListaRutasSalidasSemanales" :key="item.LetrRuta"
                                :label="item.DescRuta" :value="item.LetrRuta">
                            </el-option>
                        </el-select>


                    </div>
                </card>

                <card class="no-border-card" style="margin-bottom: 0rem;height:calc(100vh - 13rem)"
                    body-classes="cardMinutosTarjetas card-bodyRPagosVehiculoProduccionPC px-0 pb-1"
                    footer-classes="pb-2">
                    <embed id="iframeContainerrMinutosTarjetasV" :src="oBase64IndicadoresCalidad" type="application/pdf"
                        width="100%" height="100%" />
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
    TimePicker,
} from "element-ui";
import { getformatFechatoTime } from "../util/fechas";
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
        [TimePicker.name]: TimePicker,
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
            selectedRouteDescriptions: [],
            mListLineasSalidasPanelBusqueda: [],
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
            modalUbicacionEventoDispositivo: false,
            mListaTiposEventos: [],
            modelTiposEvento: [],
            datePickerRhrrecorrido: [],
            mListaRVelocidadesDettallados: [],
            RangeHorasRecorrido: [
                new Date(2016, 9, 10, 9, 0),
                new Date(2016, 9, 23, 59, 59),
            ],
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
        async readRVelocidadesDetallados() {
            let iframe = document.getElementById('iframeContainerrMinutosTarjetasV');
            iframe.src = "";
            this.mListaRVelocidadesDettallados = [];
            swal.fire({
                title: "Generando Reporte ...",
                width: 600,
                padding: "3em",
                background: "#fff",
                showCancelButton: false,
                showConfirmButton: false,
                allowEscapeKey: false,
                allowEnterKey: false,
                allowOutsideClick: false,
                backdrop: `
                    rgba(0, 0, 0, 0.5)
                    left top
                    no-repeat
                  `
            });

            this.oBase64IndicadoresCalidad = ""
            try {
                var datos = await this.$axios.post(
                    process.env.baseUrl + "/RVelocidadesDetallados",
                    {
                        token: this.token,
                        unidades:
                            this.itemUnidadSalidasPanelBusqueda.length > 0
                                ? this.itemUnidadSalidasPanelBusqueda
                                : "*",
                        /*fechaI: getformatFechaDateTime(this.datePickerRhrrecorrido[0]),
                        fechaF: getformatFechaDateTime(this.datePickerRhrrecorrido[1]),*/
                        fechaI: this.fechaInicialSalidasPanelBusqueda + " " + getformatFechatoTime(this.RangeHorasRecorrido[0]),
                        fechaF: this.fechaInicialSalidasPanelBusqueda + " " + getformatFechatoTime(this.RangeHorasRecorrido[1]),
                        grupos:
                            this.itemGruposPenalidadesSemanales.length <= 0
                                ? "*"
                                : this.itemGruposPenalidadesSemanales,
                        rutas:
                            this.modelTiposEvento.length <= 0 ? "*" : this.modelTiposEvento,

                    },
                    {
                        timeout: 600000,
                    },
                    {
                        'Content-Type': 'application/json'
                    });

                console.log("Aca datos todos ......", datos.data.datos);
                console.log(
                    "Aca datos Unidades ......",
                    this.itemUnidadSalidasPanelBusqueda
                );
                console.log(
                    "Aca datos Fechas ......",
                    this.fechaInicialSalidasPanelBusqueda, "--", this.fechaInicialSalidasPanelBusqueda
                );
                console.log(
                    "Aca datos HORAS ......",
                    getformatFechatoTime(this.RangeHorasRecorrido[0]), "--", getformatFechatoTime(this.RangeHorasRecorrido[1])
                );
                console.log("Aca datos Rutasssss ......", this.modelTiposEvento);
                console.log(
                    "Aca datos Grupossss ......",
                    this.itemGruposPenalidadesSemanales
                );

                if (datos.data.status_code == 200) {
                    this.mListaRVelocidadesDettallados.push(...datos.data.datos);
                    this.generatePdf()
                } else {
                    Notification.info({
                        title: "Reporte Velocidades Detallados",
                        message: datos.data.msm,
                    });
                }
            } catch (error) {
                Notification.error({
                    title: "Reporte Perjudicados Devueltos",
                    message: error.toString(),
                });
                console.log(error);
            }
            swal.close()
        },

        updateSelectedRouteDescriptions(selectedRoutes) {
            console.log("Rutas seleccionadas:", selectedRoutes);
            this.selectedRouteDescriptions = selectedRoutes.map((id) => {
                const route = this.mListaRutasSalidasSemanales.find(
                    (route) => route.LetrRuta === id
                );
                return route ? route.DescRuta : "";
            });
            //console.log("Descripciones de rutas seleccionadas:", this.selectedRouteDescriptions);
        },



        async generatePdf() {
            try {
                var empresa = [
                    {
                        text: "Empresa : " + this.$cookies.get("nameEmpresa"),
                        fontSize: 12,
                        alignment: "left",
                        bold: true,
                    },
                ];
                var tipoReporte = [
                    {
                        text:
                            "REPORTE DE LA RUTA : " +
                            (this.modelTiposEvento.length === 0
                                ? "TODAS LAS RUTAS"
                                : this.selectedRouteDescriptions.toString()),
                        fontSize: 11,
                        alignment: "left",
                        bold: true,
                    },
                ];
                var desde_hasta = [
                    {
                        text:
                            "Del : " +
                            this.fechaInicialSalidasPanelBusqueda + " " +
                            getformatFechatoTime(this.RangeHorasRecorrido[0]) +
                            " Hasta " +
                            this.fechaInicialSalidasPanelBusqueda + " " +
                            getformatFechatoTime(this.RangeHorasRecorrido[1]),
                        fontSize: 11,
                        alignment: "left",
                        bold: true,
                    }
                ];
                var unidades = [
                    {
                        text:
                            "Unidades : " +
                            (this.itemUnidadSalidasPanelBusqueda.length === 0
                                ? "TODAS LAS UNIDADES"
                                : this.itemUnidadSalidasPanelBusqueda.toString()),
                        fontSize: 11,
                        alignment: "left",
                        bold: true,
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
                            text: "Hora",
                            fontSize: 8.5,
                            bold: true,
                            fillColor: "#039BC4",
                            color: "white",
                            alignment: "center",
                        },
                        {
                            text: "N-Vuelta",
                            fontSize: 8.5,
                            bold: true,
                            fillColor: "#039BC4",
                            color: "white",
                            alignment: "center",
                        },
                        {
                            text: "Grupo",
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
                            text: "Velocidad",
                            fontSize: 8.5,
                            bold: true,
                            fillColor: "#039BC4",
                            color: "white",
                            alignment: "center",
                        },
                        {
                            text: "Latitud",
                            fontSize: 8.5,
                            bold: true,
                            fillColor: "#039BC4",
                            color: "white",
                            alignment: "center",
                        },
                        {
                            text: "Longitud",
                            fontSize: 8.5,
                            bold: true,
                            fillColor: "#039BC4",
                            color: "white",
                            alignment: "center",
                        },
                    ],
                ];
                for (var i = 0; i < this.mListaRVelocidadesDettallados.length; i++) {
                    var arrys = [
                        {
                            text: this.mListaRVelocidadesDettallados[i].CodiVehiHistEven,
                            fontSize: 8.5,
                            alignment: "center",
                            color: this.mListaRVelocidadesDettallados[i].EvenExceVeloHistEven === 1 ? "red" : "black",
                        },
                        {
                            text: this.mListaRVelocidadesDettallados[i].FechHistEven,
                            fontSize: 8.5,
                            alignment: "center",
                            color: this.mListaRVelocidadesDettallados[i].EvenExceVeloHistEven === 1 ? "red" : "black",
                        },
                        {
                            text: this.mListaRVelocidadesDettallados[i].NumeVuelSali_m,
                            fontSize: 8.5,
                            alignment: "center",
                            color: this.mListaRVelocidadesDettallados[i].EvenExceVeloHistEven === 1 ? "red" : "black",
                        },
                        {
                            text: this.mListaRVelocidadesDettallados[i].descripcion,
                            fontSize: 8.5,
                            alignment: "center",
                            color: this.mListaRVelocidadesDettallados[i].EvenExceVeloHistEven === 1 ? "red" : "black",
                        },
                        {
                            text: this.mListaRVelocidadesDettallados[i].DescRuta,
                            fontSize: 8.5,
                            alignment: "center",
                            color: this.mListaRVelocidadesDettallados[i].EvenExceVeloHistEven === 1 ? "red" : "black",
                        },
                        {
                            text: this.mListaRVelocidadesDettallados[i].VeloHistEven,
                            fontSize: 8.5,
                            alignment: "center",
                            color: this.mListaRVelocidadesDettallados[i].EvenExceVeloHistEven === 1 ? "red" : "black",
                        },
                        {
                            text: this.mListaRVelocidadesDettallados[i].LatiHistEven,
                            fontSize: 8.5,
                            alignment: "center",
                            color: this.mListaRVelocidadesDettallados[i].EvenExceVeloHistEven === 1 ? "red" : "black",
                        },
                        {
                            text: this.mListaRVelocidadesDettallados[i].LongHistEven,
                            fontSize: 8.5,
                            alignment: "center",
                            color: this.mListaRVelocidadesDettallados[i].EvenExceVeloHistEven === 1 ? "red" : "black",
                        },

                    ];
                    resultadoString.push(arrys);
                }
                var docDefinition = {
                    pageSize: "A4",
                    pageOrientation: "portrait",
                    pageMargins: [30, 80, 40, 30],
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
                                                text: "REPORTE VELOCIDADES DETALLADOS",
                                                alignment: "center",
                                                fontSize: 16,
                                                bold: true,
                                            },
                                        ],
                                        /*[
                                            {
                                                text: "Dir : Av Chasquis y Rio Guayllabamba (Ambato) Email : vigitracklatam@gmail.com",
                                                alignment: "center",
                                                fontSize: 8,
                                            },
                                        ],
                                        [
                                            {
                                                text: "Tel : 0995737084 - 032421698 Sitio Web : www.vigitrackecuador.com",
                                                alignment: "center",
                                                fontSize: 8,
                                            },
                                        ],*/
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
                                body: [empresa, tipoReporte, desde_hasta, unidades],
                            },
                        },
                        {
                            table: {
                                headerRows: 0,
                                widths: [30, 40, 60, 80, 60, 40, 80, 80],
                                body: resultadoString,
                            },
                        },
                    ],
                };
                //pdfMake.createPdf(docDefinition).download("RVD_" + Date.now());
                var pdfDocGenerator = pdfMake.createPdf(docDefinition)
                pdfDocGenerator.getBlob((blob) => {
                    var pdfUrl = URL.createObjectURL(blob)
                    let iframe = document.getElementById('iframeContainerrMinutosTarjetasV');
                    iframe.src = pdfUrl;
                });
            } catch (error) {
                console.log(error)
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

    },
    mounted() {
        this.initFechaActualSalidaBusquedaPanel();
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

.text-normal {
    color: #525f7f !important;
    margin: 0 !important;
    font-size: 0.8125rem !important;
    font-weight: 400 !important;
}

.text-red {
    color: red !important;
    margin: 0 !important;
    font-size: 0.8125rem !important;
    font-weight: 400 !important;
}
</style>