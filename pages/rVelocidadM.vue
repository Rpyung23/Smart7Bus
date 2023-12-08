<template>
    <div class="content">
        <base-header>
            <div class="align-items-center py-3">
                <card class="no-border-card col" style="margin-bottom: 0.5rem"
                    body-classes="px-0 pb-1 card-bodyTopOpcionesRPagosVehiculoPRoduccion cardSelectRubrosEstadosPagosVehiculoProduccionContainer"
                    footer-classes="pb-2">
                    <div class="cardTextoRPagosVehiculoProduccion">

                        <base-input title="Buscar" addon-left-icon="ni ni-calendar-grid-58" style="margin-right: 0.5rem">
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

                    <div class="buttonsAdicionalesRbuttonsAdicionalesRVelocidadVelocidad">
                        <base-button icon type="primary" size="sm" @click="readRVelocidadesM()">
                            <span class="btn-inner--icon"><i class="el-icon-search"></i></span>
                        </base-button>

                        <base-button size="sm" title="EXPORTAR PDF" v-if="mListaRVelocidades.length > 0 ? true : false"
                            type="danger" @click="generatePdf()">
                            <span class="btn-inner--icon"><i class="ni ni-cloud-download-95"></i></span>
                        </base-button>

                        <download-excel title="EXCEL" v-if="mListaRVelocidades.length > 0
                            ? true
                            : false
                            " class="btn btn-icon btn-fab btn-success btn-sm" :header="ReporteheaderExcelVelocidades"
                            :data="mListaRVelocidades" :fields="json_fields_excelReporteVelocidades"
                            :worksheet="WorksheetExcelReporteVelocidades" :name="FileNameExcelReporteCelocidades">
                            <span class="btn-inner--icon"><i class="ni ni-collection"></i></span>
                        </download-excel>


                    </div>
                </card>

                <card class="no-border-card" style="margin-bottom: 0rem" body-classes="card-bodyRVelocidades px-0 pb-1"
                    footer-classes="pb-2">
                    <div>
                        <el-table v-loading="loadingTableRVelocidadesBusquedaloading"
                            element-loading-text="Cargando Datos..." :data="mListaRVelocidades" row-key="id"
                            class="tablePanelControlProduccion" header-row-class-name="thead-dark"
                            height="calc(100vh - 9.5rem)">

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
    Checkbox,
    CheckboxButton,
    CheckboxGroup,
    Popover,
    Button,
    Loading,
} from "element-ui";

import RouteBreadCrumb from "@/components/argon-core/Breadcrumb/RouteBreadcrumb";
import { BasePagination } from "@/components/argon-core";
import clientPaginationMixin from "~/components/tables/PaginatedTables/clientPaginationMixin";
import { getFecha_dd_mm_yyyy, getformatFechaDateTime } from "../util/fechas";
import swal from "sweetalert2";
import Tabs from "@/components/argon-core/Tabs/Tabs";
import TabPane from "@/components/argon-core/Tabs/Tab";
import { getBase64LogoReportes } from "../util/logoReport";
import pdfMake from "pdfmake/build/pdfmake.js";
import pdfFonts from "pdfmake/build/vfs_fonts.js";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

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
            tableColumnsUnidadesFlotaVehicular: [
                {
                    prop: "fecha",
                    label: "Fecha",
                    minWidth: 120,
                },
                {
                    prop: "unidad",
                    label: "Unidad",
                    minWidth: 140,
                },
                {
                    prop: "RutaDespacho",
                    label: "Ruta",
                    minWidth: 150,
                },
                {
                    prop: "subidas",
                    label: "P. Subidas",
                    minWidth: 150,
                },
                {
                    prop: "valor",
                    label: "Valor ($)",
                    minWidth: 150,
                },
                {
                    prop: "sumaKm",
                    label: "T. Kilómetro",
                    minWidth: 150,
                },

            ],
            mListaRVelocidades: [],
            json_fields_excelReporteVelocidades: {
                "Fecha": "fecha",
                "Unidad": "unidad",
                "RUTA": "RutaDespacho",
                "P.Subidas ": "subidas",
                "Valor ($)": "valor",
                "T. Kilómetro": "sumaKm",
            },
            WorksheetExcelReporteVelocidades: "",
            FileNameExcelReporteCelocidades: "",
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

        async readRVelocidadesM() {
            this.WorksheetExcelReporteVelocidades =
                "RVM" + Date.now();
            this.FileNameExcelReporteCelocidades =
                "RVM_" + Date.now() + ".xls";
            this.mListaRVelocidades = []
            this.loadingTableRVelocidadesBusquedaloading = true
            try {
                var datos = await this.$axios.post(process.env.baseUrl + "/RVelocidadM", {
                    token: this.token,
                    fechaI: this.fechaInicialSalidasPanelBusqueda,
                    fechaF: this.fechaFinalSalidasPanelBusqueda
                }, {
                    timeout: 600000,
                });

                if (datos.data.status_code == 200) {
                    this.ReporteheaderExcelVelocidades = [
                        this.$cookies.get("nameEmpresa"),
                        "Reporte Velocidades M",
                        "Unidades : " + "TODAS LAS UNIDADES",
                        "Fechas : " +
                        this.fechaInicialSalidasPanelBusqueda +
                        " hasta " +
                        this.fechaFinalSalidasPanelBusqueda,

                    ];
                    console.log(datos.data.datos)
                    this.mListaRVelocidades.push(...datos.data.datos)
                } else {
                    Notification.warning({
                        title: "Reporte Velocidad M",
                        message: datos.data.msm,
                    });
                }
            } catch (error) {
                console.log(e)
                Notification.error({
                    title: "Reporte Recorrido",
                    message: e.toString(),
                });
            }
            this.loadingTableRVelocidadesBusquedaloading = false
        },

        generatePdf() {
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
                        "REPORTE DE LA RUTA : TODAS LAS RUTAS",
                    fontSize: 11,
                    alignment: "left",
                    bold: true,
                },
            ];
            var desde_hasta = [
                {
                    text:
                        "Del : " +
                        (this.fechaInicialSalidasPanelBusqueda) +
                        " Hasta " +
                        (this.fechaFinalSalidasPanelBusqueda),
                    fontSize: 11,
                    alignment: "left",
                    bold: true,
                },
            ];
            var unidades = [
                {
                    text:
                        "Unidades : " +
                        "TODAS LAS UNIDADES",
                    fontSize: 11,
                    alignment: "left",
                    bold: true,
                },
            ];
            var resultadoString = [
                [
                    {
                        text: "Fecha",
                        fontSize: 8.5,
                        bold: true,
                        fillColor: "#039BC4",
                        color: "white",
                        alignment: "center",
                    },
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
                        text: "P. Subidos",
                        fontSize: 8.5,
                        bold: true,
                        fillColor: "#039BC4",
                        color: "white",
                        alignment: "center",
                    },
                    {
                        text: "Valor ($)",
                        fontSize: 8.5,
                        bold: true,
                        fillColor: "#039BC4",
                        color: "white",
                        alignment: "center",
                    },
                    {
                        text: "T. Kilómetro",
                        fontSize: 8.5,
                        bold: true,
                        fillColor: "#039BC4",
                        color: "white",
                        alignment: "center",
                    },
                ],
            ];
            for (var i = 0; i < this.mListaRVelocidades.length; i++) {
                var arrys = [
                    {
                        text: this.mListaRVelocidades[i].fecha,
                        fontSize: 8.5,
                        alignment: "center",
                    },
                    {
                        text: this.mListaRVelocidades[i].unidad,
                        fontSize: 8.5,
                        alignment: "center",
                    },
                    {
                        text: this.mListaRVelocidades[i].RutaDespacho,
                        fontSize: 8.5,
                        alignment: "center",
                    },
                    {
                        text: this.mListaRVelocidades[i].subidas,
                        fontSize: 8.5,
                        alignment: "center",
                    },
                    {
                        text: this.mListaRVelocidades[i].valor,
                        fontSize: 8.5,
                        alignment: "center",
                    },
                    {
                        text: this.mListaRVelocidades[i].sumaKm,
                        fontSize: 8.5,
                        alignment: "center",
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
                                    [
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
                            body: [empresa, tipoReporte, desde_hasta, unidades],
                        },
                    },
                    {
                        table: {
                            headerRows: 0,
                            widths: [60, 60, 60, 60, 60, 60],
                            body: resultadoString,
                        },
                    },
                ],
            };
            pdfMake.createPdf(docDefinition).download("RDVM_" + Date.now());
        }


    },
    mounted() {
        this.initFechaActualSalidaBusquedaPanel()
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
    height: calc(100vh - 9.5rem);
    overflow: auto;
}

.card-bodyTopOpcionesRPagosVehiculoPRoduccion {
    padding-top: 0.25rem !important;
}

.buttonsAdicionalesRbuttonsAdicionalesRVelocidadVelocidad {
    display: flex;
    align-items: center;
}
</style>
  