<template>
    <div class="content">
        <base-header>
            <div class="align-items-center py-3">
                <card class="no-border-card col" style="margin-bottom: 0.5rem"
                    body-classes="px-0 pb-1 card-bodyTopOpcionesRPagosVehiculoPRoduccion cardSelectRubrosEstadosPagosVehiculoProduccionContainer"
                    footer-classes="pb-2">
                    <div class="cardTextoRPagosVehiculoProduccion">


                        <el-form>
                            <el-form-item label="Ingrese solo números">
                                <el-input v-model="numericInput" placeholder="Solo números" @input="validateNumber" />
                            </el-form-item>
                        </el-form>

                    </div>


                    <div class="cardSelectRubrosEstadosPagosVehiculoProduccionContainer">
                        <div class="buttonCenterEndDerecha">
                            <base-button icon type="primary" size="sm" @click="generatePdf()">
                                <span class="btn-inner--icon"><i class="el-icon-search"></i></span>
                            </base-button>
                        </div>

                        <div class="buttonCenterEndDerecha">
                            <base-button icon type="danger" size="sm" style="margin-left: 8px;" @click="anularpago()">
                                <span class="btn-inner--icon"><i class="ni ni-fat-remove"></i></span>
                            </base-button>
                        </div>
                    </div>

                </card>

                <card class="no-border-card" style="margin-bottom: 0rem; height: calc(100vh - 20.2vh)"
                    body-classes="body0 px-0 pb-1" footer-classes="pb-2">
                    <embed id="iframeContainerrMinutosTarjetas" type="application/pdf" width="100%" height="100%" />
                </card>
                
            </div>
        </base-header>

        <!--Form modal-->
        <modal :show.sync="modalsReciboProduccion" size="sm" body-classes="p-0">
            <card type="secondary" header-classes="bg-transparent pb-5" class="border-0 mb-0">
                <iframe :src="baseURlPDFPanelDetalleRecibo" style="width: 100%; height: 33rem"></iframe>
            </card>
        </modal>
        <!--Form modal Despacho Anular Pago-->
        <modal :show.sync="modalDespachoAnularPago" body-classes="p-0">
            <base-alert v-if="
                reponseAnularFinalizar != null &&
                reponseAnularFinalizar.status_code != 200" type="danger" class="container_body_modal_despacho">
                {{
                    reponseAnularFinalizar == null
                        ? "ERROR INDEFINIDO"
                        : reponseAnularFinalizar.msm
                }}
            </base-alert>
            <h6 slot="header" class="modal-title">
                Anular Pago N°
                {{
                    this.selectedRowSalida == null ? "" : this.selectedRowSalida.idSali_m
                }}
            </h6>
            <div class="container_body_modal_despacho">
                <!-- strong>Unidad : </strong>
                    {{
                    this.selectedRowSalida == null
                    ? ""
                    : this.selectedRowSalida.CodiVehiSali_m
                    }}
                    <strong>Ruta : </strong>
                    {{
                    this.selectedRowSalida == null
                    ? ""
                    : this.selectedRowSalida.DescRutaSali_m
                    }}
                    <strong>Hora : </strong>
                    {{
                    this.selectedRowSalida == null
                    ? ""
                    : this.selectedRowSalida.HoraSaliProgSali_m
                    }} -->
                    <strong>¿Desea anular el pago?</strong>
            </div>
            <template slot="footer">
                <base-button type="danger">Anular Pago</base-button>
            </template>
        </modal>
    </div>
</template>
<script>
import pdfMake from "pdfmake/build/pdfmake.js";
import pdfFonts from "pdfmake/build/vfs_fonts.js";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import flatPicker from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";

import {
    Table,
    TableColumn,
    Select,
    Option,
    Autocomplete,
    Switch,
    DatePicker,
    RadioButton,
    Radio,
    Notification,
    Button,
    Checkbox,
} from "element-ui";

import RouteBreadCrumb from "@/components/argon-core/Breadcrumb/RouteBreadcrumb";
import { BasePagination } from "@/components/argon-core";
import clientPaginationMixin from "~/components/tables/PaginatedTables/clientPaginationMixin";
import swal from "sweetalert2";
import Tabs from "@/components/argon-core/Tabs/Tabs";
import TabPane from "@/components/argon-core/Tabs/Tab";
import { getBase64LogoReportes } from "../../util/logoReport";

export default {
    mixins: [clientPaginationMixin],
    layout: "ProduccionDashboardLayout",
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
        [Switch.name]: Switch,
        [Checkbox.name]: Checkbox,
    },
    data() {
        return {
            token: this.$cookies.get("token"),
            loadingRPagosVehiculoRecibo: false,
            Base64PdfRECIBOPDFPRODUCCION: "",
            modalsReciboProduccion: false,
            modalDespachoAnularPago: false,
            oSwitchOrdenarCobrosRubrosFechas: true,
            loadingTableUnidadesRecibosVehiculoProduccion: false,
            loadingTableCobradoresRecibosVehiculoProduccion: false,
            baseURlPDFPanelDetalleRecibo: "",
            RecibosWorksheetExcelRPagosVehiculoProduccion: "",
            RecibosFileNameExcelRPagosVehiculoProduccion: "",
            nameUsuario: "S/N",
            numericInput: '',
            reponseAnularFinalizar: null,
        };
    },
    methods: {
        validateNumber(event) {
            // Elimina cualquier carácter que no sea un número
            this.numericInput = this.numericInput.replace(/[^0-9]/g, '');
        },




        async generatePdf() {

            if (this.numericInput === '' || this.numericInput == null) {
                Notification.warning({
                    title: "INGRES EL RECIBO",
                    message: 'POR FAVOR INGRESE EL NUMERO DEL RECIBO',
                    duration: 2000,
                });

                return
            }

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
                    `,
            });

            var DatoApi = [];
            var oMultas = "0.00";
            var oTarjeta = "0.00";
            var oSuspension = "0.00";
            var oTotal = "0.00";

            document.getElementById("iframeContainerrMinutosTarjetas").src = "";
            try {
                var response = await this.$axios.post(
                    process.env.baseUrl + "/MinutoSancionConsorcioGeneral",
                    {
                        token: this.token,
                        fechaI: this.fechaInicialRPagosVehiculoProduccionRecibo,
                        fechaF: this.fechaFinalRPagosVehiculoProduccionRecibo,
                        isFecha: this.isFecha
                    }
                );

                DatoApi.push(...response.data.datos);
                console.log(response.data.datos)

                for (var i = 0; i < DatoApi.length; i++) {
                    console.log(DatoApi[i].AtrasoPenalidad)
                    oMultas =
                        parseFloat(DatoApi[i].AtrasoPenalidad) + parseFloat(oMultas);
                    oTarjeta =
                        parseFloat(DatoApi[i].TarjetaDiaria) + parseFloat(oTarjeta);
                    oSuspension =
                        parseFloat(DatoApi[i].RubroPenalidad) + parseFloat(oSuspension);
                    oTotal = oSuspension + oTarjeta + oMultas;
                }
            } catch (error) {
                console.log(error);
            }

            const componenteTabla = (titulo, id_) => {
                const table = {
                    headerRows: 0,
                    widths: ["auto", "auto", "auto", "auto"],
                    body: [
                        [{ text: titulo, colSpan: 4, alignment: "center" }, {}, {}, {}],
                        [
                            { text: "Unidad", bold: true },
                            { text: "Multas", alignment: "center", bold: true },
                            { text: "Tarjetas", alignment: "center", bold: true },
                            { text: "Suspensión", alignment: "center", bold: true },
                        ],
                    ],
                };

                for (let index = 0; index < DatoApi.length; index++) {
                    if (id_ == DatoApi[index].id_descripcion) {
                        table.body.push([
                            { text: DatoApi[index].CodiVehiSali_m },
                            { text: DatoApi[index].AtrasoPenalidad, alignment: "center" },
                            { text: DatoApi[index].TarjetaDiaria, alignment: "center" },
                            { text: DatoApi[index].RubroPenalidad, alignment: "center" },
                        ]);
                    }
                }
                //table.body.push([{ text: '', border: [false, true, false, true] }, { text: '10', border: [false, true, false, true] }, { text: '60', border: [false, true, false, true] }, { text: '50', border: [false, true, false, true] },])
                return {
                    table,
                };
            };

            const componenteTotal = () => {
                const table = {
                    headerRows: 0,
                    widths: [80, 100],

                    body: [
                        [
                            {
                                text: "Multas",
                                border: [false, false, false, false],
                                margin: [0, 20, 0, 0],
                            },
                            {
                                text: Number(oMultas).toFixed(2),
                                border: [false, false, false, false],
                                margin: [0, 20, 0, 0],
                            },
                        ],
                        [
                            { text: "Tarjetas", border: [false, false, false, false] },
                            {
                                text: Number(oTarjeta).toFixed(2),
                                border: [false, false, false, false],
                            },
                        ],
                        [
                            { text: "Suspensión", border: [false, false, false, false] },
                            {
                                text: Number(oSuspension).toFixed(2),
                                border: [false, false, false, true],
                            },
                        ],
                        [
                            { text: "Total", border: [false, false, false, false] },
                            {
                                text: Number(oTotal).toFixed(2),
                                bold: true,
                                border: [false, false, false, false],
                            },
                        ],
                    ],
                };
                return { table };
            };

            const componentePdf = (datos) => {
                const contenido = [];
                const columns = [];

                columns.push(componenteTabla("Expreso Milagro", 3));
                columns.push(componenteTabla("Ruta Milagreña", 1));
                columns.push(componenteTabla("Ejecutivo Express", 2));
                contenido.push({ columns });
                contenido.push(componenteTotal());
                return contenido;
            };

            var docDefinition = {
                pageSize: "A4",
                pageOrientation: "landscape",
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
                            margin: [120, 0, 0, 0],
                            table: {
                                widths: ["400"],
                                body: [
                                    [
                                        {
                                            text: "REPORTE MINUTOS SANCION CONSORCIO",
                                            alignment: "center",
                                            fontSize: 16,
                                            bold: true,
                                        },
                                    ],
                                    [
                                        {
                                            text: this.$cookies.get("nameEmpresa"),
                                            alignment: "center",
                                            fontSize: 16,
                                            bold: true,
                                        },
                                    ],
                                    [
                                        {
                                            text: this.isFecha ?
                                                "Detalles cobrados del dia " +
                                                this.fechaInicialRPagosVehiculoProduccionRecibo +
                                                " hasta " +
                                                this.fechaFinalRPagosVehiculoProduccionRecibo : "TODOS LOS REGISTROS",
                                            alignment: "center",
                                            fontSize: 12,
                                        },
                                    ]
                                ],
                            },
                        },
                    ],
                },
                content: componentePdf([]),
            };

            var pdfDocGenerator = pdfMake.createPdf(docDefinition);
            pdfDocGenerator.getBlob((blob) => {
                var pdfUrl = URL.createObjectURL(blob);
                let iframe = document.getElementById("iframeContainerrMinutosTarjetas");
                iframe.src = pdfUrl;
            });

            swal.close();
        },

        async anularpago() {
            this.reponseAnularFinalizar = null;
            this.modalDespachoAnularPago = true;

        }


    },
    mounted() {
        this.nameUsuario = this.$cookies.get("namesUsuario")
    },
};
</script>
<style>
.form-group {
    margin-bottom: 0rem;
}

.body0 {
    padding-right: 0.2rem;
    padding-left: 0.2rem;
    padding-top: 0.2rem;
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

.el-loading-text {
    color: black !important;
}

.el-icon-loading {
    color: black !important;
}

.cardTextoRPagosVehiculoProduccion {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
}

.cardSelectRubrosEstadosPagosVehiculoProduccionContainer {
    display: flex;
    justify-content: space-between;
}

.el-table .warning-row-panelControlProduccion {
    background: rgba(252, 143, 143, 0.692) !important;
}

.el-table .success-row-panelControlProduccion {
    background: #8fed8fbb !important;
}

.no-border-card .card-footer {
    border-top: 0;
}

.card-bodyRPagosVehiculoReciboProduccion {
    padding: 0rem !important;
    height: calc(100vh - 13rem);
    overflow: auto;
}

.card-bodyTopOpcionesRPagosVehiculoPRoduccion {
    padding-top: 0.25rem !important;
}

.label-gray {
    color: #8898aa;
    /* Puedes ajustar el color aquí */
}

.container_body_modal_despacho {
    margin-right: 1.25rem;
    margin-left: 1.25rem;
}
</style>