<template>
    <div class="content">
        <base-header>
            <div class="align-items-center py-3">
                <card class="no-border-card col" style="margin-bottom: 0.5rem"
                    body-classes="px-0 pb-1 card-bodyTopOpcionesRPagosVehiculoPRoduccionPanelDespachoBusqueda cardSelectRubrosEstadosPagosVehiculoProduccionContainerPanelDespachoBusqueda"
                    footer-classes="pb-2">
                    <div class="cardTextoRPagosVehiculoProduccionPanelDespachoBusqueda">
                        <el-select v-model="itemUnidadRSemanales" multiple filterable remote placeholder="Unidades"
                            prefix-icon="ni ni-bus-front-12" style="margin-right: 0.5rem"
                            :remote-method="remoteMethodUnidadesRecibosProduccion"
                            :loading="loadingTableUnidadesSemanales">
                            <el-option v-for="item in optionsUnidadesSemanales" :key="item.CodiVehi"
                                :label="item.CodiVehi" :value="item.CodiVehi">
                            </el-option>
                        </el-select>

                        <base-input addon-left-icon="ni ni-calendar-grid-58" style="margin-right: 0.5rem">
                            <flat-picker slot-scope="{ focus, blur }" @on-open="focus" @on-close="blur"
                                :config="{ allowInput: true }" format="yyyy/MM/dd"
                                class="form-controlPersonal datepicker" v-model="fechaDia1SalidasPanelBusqueda">
                            </flat-picker>
                        </base-input>

                        <base-input addon-left-icon="ni ni-calendar-grid-58" style="margin-right: 0.5rem" disabled>
                            <flat-picker slot-scope="{ focus, blur }" @on-open="focus" @on-close="blur"
                                :config="{ allowInput: true }" format="yyyy/MM/dd"
                                class="form-controlPersonal datepicker" v-model="fechaDia2SalidasPanelBusqueda">
                            </flat-picker>
                        </base-input>
                    </div>

                    <div class="cardSelectRubrosEstadosPagosVehiculoProduccionContainerPanelDespachoBusqueda">
                        <div class="buttonCenterEndDerecha">
                            <base-button icon type="primary" size="sm" @click="readApiProgramacionOperativa()">
                                <span class="btn-inner--icon"><i class="el-icon-search"></i></span>
                            </base-button>

                            <!--  <base-button type="danger" size="sm" v-if="mListDatosPenalidades.length > 0 ? true : false"
                  @click="exportPdfRPenalidadesSemanales()" title="Exportar PDF">
                  <span class="btn-inner--icon"><i class="ni ni-single-copy-04"></i></span>
                </base-button>
  
                <download-excel v-if="mListDatosPenalidades.length > 0 ? true : false"
                  class="btn btn-icon btn-fab btn-success btn-sm" outline :header="oheaderExcelRSalidasSemanales"
                  title="Exportar a Excel" :data="mListDatosPenalidades" :fields="json_fields_excelRPenalidadesSemanales"
                  :worksheet="WorksheetExcelRSalidasSemanales" :name="FileNameExcelRSalidasSemanales">
                  <span class="btn-inner--icon"><i class="ni ni-collection"></i></span>
                </download-excel> -->
                        </div>
                    </div>
                </card>

                <card class="no-border-card col" style="margin-bottom: 0.5rem"
                    body-classes="px-0 pb-1 card-bodyTopOpcionesRPagosVehiculoPRoduccionPanelDespachoBusqueda cardSelectRubrosEstadosPagosVehiculoProduccionContainerPanelDespachoBusqueda"
                    footer-classes="pb-2">
                    <div class="cardTextoRPagosVehiculoProduccionPanelDespachoBusqueda">
                        <el-select style="margin-right: 0.5rem" collapse-tags
                            v-if="mListaGruposPenalidadesSemanales.length > 0 ? true : false"
                            v-model="itemGruposPenalidadesSemanales" multiple placeholder="Grupos">
                            <el-option v-for="item in mListaGruposPenalidadesSemanales" :key="item.id"
                                :label="item.descripcion" :value="item.id">
                            </el-option>
                        </el-select>

                        <el-select style="margin-right: 0.5rem" collapse-tags v-model="itemRutasRSalidasSemanales"
                            multiple placeholder="Rutas">
                            <el-option v-for="item in mListaRutasSalidasSemanales" :key="item.LetrRuta"
                                :label="item.DescRuta" :value="item.LetrRuta">
                            </el-option>
                        </el-select>
                    </div>

                    <div class="cardSelectRubrosEstadosPagosVehiculoProduccionContainerPanelDespachoBusqueda">
                        <div class="buttonCenterEndDerecha"></div>
                    </div>
                </card>

                <card class="no-border-card" body-classes="card_body_0_01rem"
                    style="margin-bottom: 0px; width: 100%; height: calc(100vh - 13rem)">
                    <embed id="iframeContainerprogramcionOperativa" :src="oBase64IndicadoresCalidad"
                        type="application/pdf" width="100%" height="100%" />
                </card>
            </div>
        </base-header>

    </div>
</template>
<script>
import { validaRangoFechaNoMas30Dias, getFecha_dd_mm_yyyy } from "../../util/fechas";
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
import { getBase64LogoReportes } from "../../util/logoReport";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import RouteBreadCrumb from "@/components/argon-core/Breadcrumb/RouteBreadcrumb";
import { BasePagination } from "@/components/argon-core";
import clientPaginationMixin from "~/components/tables/PaginatedTables/clientPaginationMixin";
import swal from "sweetalert2";
import Tabs from "@/components/argon-core/Tabs/Tabs";
import TabPane from "@/components/argon-core/Tabs/Tab";
import { FechaStringToHour } from "../../util/fechas";

export default {
    mixins: [clientPaginationMixin],
    layout: "DashboardLayoutMovilidad",
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
            token: this.$cookies.get("token"),
            fechaDia1SalidasPanelBusqueda: "",
            modalSalidasPenalidadesSemanales: false,
            tableColumnPenalidades: [],
            mListDatosPenalidades: [],
            modalSalidasPenalidadesSemanales: false,
            loadingPenalidadesSemanales: false,
            mListaUnidadesSemanales: [],
            optionsUnidadesSemanales: [],
            loadingTableUnidadesSemanales: false,
            itemUnidadRSemanales: [],
            mListaRutasSalidasSemanales: [],
            itemRutasRSalidasSemanales: [],
            mListaGruposPenalidadesSemanales: [],
            itemGruposPenalidadesSemanales: [],
            fechaDia2SalidasPanelBusqueda: "",
            json_fields_excelRPenalidadesSemanales: {
                UNIDAD: "CodiVehiSali_m",
                "N° Vuelta": "NumeVuelSali_m",
                RUTA: "DescRutaSali_m",
                "FECHA INICIAL": "HoraSaliProgSali_m",
                "FECHA FINAL": "HoraLlegProgSali_m",
                "CICLO VIAJE": "TiempoVuelta",
                "INTERVALO": "Intervalo",
                "TIEMPO ATRASOS": "atrasosTime",
                "TIEMPO ADELANTO": "adelantosTime"
            },
            WorksheetExcelRSalidasSemanales: "",
            FileNameExcelRSalidasSemanales: "",
            oheaderExcelRSalidasSemanales: "",
        };
    },
    methods: {
        showModalPenalidadesSemanales(row) {
            console.log(row);
            this.modalSalidasPenalidadesSemanales = true;
            this.readDetallePenalidadesSemanales(row)
        },
        async readAllRutasSalidasSEmanales() {
            this.mListaRutasSalidasSemanales = [];

            var datos = await this.$axios.post(process.env.baseUrl + "/rutes", {
                token: this.token,
                tipo: 1,
            });

            if (datos.data.status_code == 200) {
                this.mListaRutasSalidasSemanales.push(...datos.data.data);
            }
        },
        getNombresRutasRDespachosGenerados() {
            var mlist = [];
            for (var j = 0; j < this.itemRutasRSalidasSemanales.length; j++) {
                for (var i = 0; i < this.mListaRutasSalidasSemanales.length; i++) {
                    if (
                        this.itemRutasRSalidasSemanales[j] ==
                        this.mListaRutasSalidasSemanales[i].LetrRuta
                    ) {
                        mlist.push(this.mListaRutasSalidasSemanales[i].DescRuta);
                    }
                }
            }
            return mlist;
        },

        remoteMethodUnidadesRecibosProduccion(query) {
            if (query !== "") {
                this.loadingTableUnidadesSemanales = true;
                setTimeout(() => {
                    this.loadingTableUnidadesSemanales = false;
                    this.optionsUnidadesSemanales = this.mListaUnidadesSemanales.filter(
                        (item) => {
                            return (
                                item.CodiVehi.toLowerCase().indexOf(query.toLowerCase()) > -1
                            );
                        }
                    );
                }, 200);
            } else {
                this.optionsUnidadesSemanales = [];
            }
        },
        async readAllUnidadesSalidasSemanales() {
            var datos = await this.$axios.post(process.env.baseUrl + "/unidades", {
                token: this.token,
            });

            console.log(datos.data);

            if (datos.data.status_code == 200) {
                for (var i = 0; i < datos.data.data.length; i++) {
                    var obj = datos.data.data[i];
                    obj.value = obj.CodiVehi;
                    this.mListaUnidadesSemanales.push(obj);
                }
            }
        },
        initPrimerDiaSemanaActualSalidaBusquedaPanel() {
            var fecha = new Date();
            var mes = fecha.getMonth() + 1;
            var day = fecha.getDate();
            var format =
                fecha.getFullYear() +
                "-" +
                (mes < 10 ? "0" + mes : mes) +
                "-" +
                (day < 10 ? "0" + day : day);

            this.fechaDia1SalidasPanelBusqueda = format;
            this.fechaDia2SalidasPanelBusqueda = format;
        },
        async readApiProgramacionOperativa() {
            this.mListDatosPenalidades = [];
            this.loadingPenalidadesSemanales = true;

            if (!validaRangoFechaNoMas30Dias(getFecha_dd_mm_yyyy(this.fechaDia1SalidasPanelBusqueda),
                getFecha_dd_mm_yyyy(this.fechaDia2SalidasPanelBusqueda))) {
                Notification.warning({
                    title: "RAGO MAXIMO 31 DIAS",
                    message: 'SOLO SE PERMITE UN MAXIMO DE 31 DIAS',
                    duration: 2000,
                });
                return
            }

            this.WorksheetExcelRSalidasSemanales = "RS_S_W_" + Date.now();
            this.FileNameExcelRSalidasSemanales = "RS_S_" + Date.now() + ".xls";

            this.oheaderExcelRSalidasSemanales = [
                "TABLA PROGRAMACIÓN OPERATIVA",
                "Fechas : " +
                this.fechaDia1SalidasPanelBusqueda +
                " hasta " +
                this.fechaDia2SalidasPanelBusqueda,
                "Unidades : " +
                (this.itemUnidadRSemanales.length <= 0
                    ? "TODAS LAS UNIDADES"
                    : this.itemUnidadRSemanales),
                "Rutas : " +
                (this.itemRutasRSalidasSemanales.length <= 0
                    ? "TODAS LAS RUTAS"
                    : this.getNombresRutasRDespachosGenerados(
                        this.itemRutasRSalidasSemanales
                    )),
            ];
            let iframe = document.getElementById("iframeContainerprogramcionOperativa");
            iframe.src = "";
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

            this.oBase64IndicadoresCalidad = "";

            try {
                var obj = {
                    token: this.token,
                    fechaI: this.fechaDia1SalidasPanelBusqueda,
                    fechaF: this.fechaDia2SalidasPanelBusqueda,
                    unidades:
                        this.itemUnidadRSemanales.length <= 0
                            ? "*"
                            : this.itemUnidadRSemanales,
                    rutas:
                        this.itemRutasRSalidasSemanales.length <= 0
                            ? "*"
                            : this.itemRutasRSalidasSemanales,
                };

                console.log(obj);

                var datos = await this.$axios.post(
                    process.env.baseUrl + "/programacionOperativa",
                    obj
                );

                console.log(datos.data);
                if (datos.data.status_code == 200) {
                    this.mListDatosPenalidades.push(...datos.data.datos);
                    this.genratePdf();
                } else {
                    Notification.warning({
                        title: "Reporte de Programación Operativa",
                        message: datos.data.msm,
                    });
                }

            } catch (error) {
                Notification.error({
                    title: "Reporte de Programación Operativa",
                    message: error.toString(),
                });
                console.log(error);
            }
            swal.close();
            this.loadingPenalidadesSemanales = false;
        },
        genratePdf() {
            const componenteHeader = () => {

                var empresa = {
                    text: [
                        { text: "OPERADORA : ", fontSize: 12, bold: true },
                        { text: this.$cookies.get("nameEmpresa"), fontSize: 12, bold: true }
                    ],
                    colSpan: 2,
                };
                var ruta = {
                    text: [
                        { text: "RUTA : ", fontSize: 12, bold: true },
                        {
                            text:
                                (this.itemRutasRSalidasSemanales.length === 0
                                    ? "TODAS LAS RUTAS"
                                    : this.getNombresRutasRDespachosGenerados(
                                        this.itemRutasRSalidasSemanales)),
                            fontSize: 11,
                            alignment: "left",
                            bold: true,
                        },
                    ],
                    colSpan: 3,
                };
                var periodo = {
                    text: [
                        { text: "FECHA : ", fontSize: 12, bold: true },
                        "Desde ",
                        this.fechaDia1SalidasPanelBusqueda +
                        " Hasta ",
                        this.fechaDia2SalidasPanelBusqueda,
                    ],
                    colSpan: 2,
                };
                return {
                    headerRows: 0,
                    widths: ["*", "*", "*", "*"],
                    body: [

                        [empresa, {}, "", ""],
                        [periodo, {}, {}, {}],
                        [ruta, {}, {}, ""],
                    ],
                    //body: [[ 'First', 'Second', 'Third', 'The last one' ]],
                };

            };
            const componenteHeaderTable = (arrayTitulos) => {
                return arrayTitulos.map((titulo) => ({
                    text: titulo,
                    fontSize: 9.5,
                    bold: true,
                    fillColor: "#039BC4",
                    color: "white",
                    alignment: "center",
                }));
            };
            const componneteParametros = () => {

                return [
                    // Fila "Parámetros Operativos"
                    [
                        {
                            text: "Parámetros Operativos",
                            colSpan: 9,
                            alignment: "center",
                            fontSize: 11,
                            bold: true,
                            fillColor: "#039BC4",
                            color: "white",
                        },
                        {}, {}, {}, {}, {}, {}, {}, {}
                    ],
                    // Fila "Flota de Autobuses"
                    [
                        {
                            text: "Flota de Autobuses",
                            colSpan: 9,
                            alignment: "center",
                            fontSize: 11,
                            bold: true,
                            fillColor: "#039BC4",
                            color: "white",
                        },
                        {}, {}, {}, {}, {}, {}, {}, {}
                    ],
                    [
                        {
                            text: "Flota disponible",
                            alignment: "center",
                            fontSize: 11,

                            //fillColor: "#039BC4",
                            //color: "white",
                        },
                        {
                            text: this.$cookies.get("nameEmpresa"),
                            colSpan: 8,
                            alignment: "center",
                            fontSize: 11,
                            //fillColor: "#039BC4",
                            //color: "white",
                        },
                        {}, {}, {}, {}, {}, {}, {} // Espacios vacíos para las columnas que abarca el colSpan
                    ],
                ]
            };
            const componneteAsignacion = () => {
                return [
                    // Fila "Parámetros Operativos"
                    [
                        {
                            text: "Asignación Operativa",
                            colSpan: 9,
                            alignment: "center",
                            fontSize: 11,
                            bold: true,
                            fillColor: "#039BC4",
                            color: "white",
                        },
                        {}, {}, {}, {}, {}, {}, {}, {}
                    ],
                    // Fila "Flota de Autobuses"
                    [
                        {
                            text: "Programación de días de trabajo",
                            colSpan: 9,
                            alignment: "center",
                            fontSize: 11,
                            bold: true,
                            fillColor: "#039BC4",
                            color: "white",
                        },
                        {}, {}, {}, {}, {}, {}, {}, {}
                    ],
                ]
            };
            //funcion referencia
            const componenteTituloTabla = (titulo) => {
                return [
                    // Fila "Parámetros Operativos"
                    [
                        {
                            text: titulo,
                            colSpan: 9,
                            alignment: "center",
                            fontSize: 11,
                            bold: true,
                            fillColor: "#039BC4",
                            color: "white",
                        },
                        {}, {}, {}, {}, {}, {}, {}, {}
                    ],
                    // Fila "Flota de Autobuses"
                    [
                        {
                            text: "Programación de días de trabajo",
                            colSpan: 9,
                            alignment: "center",
                            fontSize: 11,
                            bold: true,
                            fillColor: "#039BC4",
                            color: "white",
                        },
                        {}, {}, {}, {}, {}, {}, {}, {}
                    ],
                ]
            };

            const componnetePeriodo = () => {
                return [
                    [
                        {
                            text: "Periodo de Equilibrio de Producción",
                            colSpan: 9,
                            alignment: "center",
                            fontSize: 11,
                            bold: true,
                            fillColor: "#039BC4",
                            color: "white",
                        },
                        {}, {}, {}, {}, {}, {}, {}, {}
                    ],
                ]
            }
            const componneteDias = () => {
                return [
                    [
                        {
                            text: "Días a trabajar por Autobús",
                            colSpan: 9,
                            alignment: "center",
                            fontSize: 11,
                            bold: true,
                            fillColor: "#039BC4",
                            color: "white",
                        },
                        {}, {}, {}, {}, {}, {}, {}, {}
                    ],
                ]
            }
            const componneteKmu = () => {
                return [
                    [
                        {
                            text: "Kilómetros útiles por Autobús",
                            colSpan: 9,
                            alignment: "center",
                            fontSize: 11,
                            bold: true,
                            fillColor: "#039BC4",
                            color: "white",
                        },
                        {}, {}, {}, {}, {}, {}, {}, {}
                    ],
                ]
            }
            const componneteKmnu = () => {
                return [
                    [
                        {
                            text: "Kilómetros no útiles por Autobús",
                            colSpan: 9,
                            alignment: "center",
                            fontSize: 11,
                            bold: true,
                            fillColor: "#039BC4",
                            color: "white",
                        },
                        {}, {}, {}, {}, {}, {}, {}, {}
                    ],
                ]
            }

            // Variables para almacenar los datos divididos
            const datosTipico = [];
            const datosSabado = [];
            const datosDomingo = [];

            // Dividir los datos según el tipo de día
            this.mListDatosPenalidades.forEach((dato) => {
                if (dato.tipo_dia === "t") {
                    datosTipico.push(dato);
                } else if (dato.tipo_dia === "s") {
                    datosSabado.push(dato);
                } else if (dato.tipo_dia === "d") {
                    datosDomingo.push(dato);
                }
            });
            console.log("datosTipico");
            console.log(datosTipico);
            console.log(datosSabado);
            //console.log(datosTipico[0].odometrodiff);


            // tabla Dia tipico
            var resultadoString = [];
            for (var i = 0; i < datosTipico.length; i++) {
                var arrys = [
                    {
                        text: datosTipico[i].DescRuta,
                        fontSize: 9,
                        alignment: "center",
                    },
                    {
                        text: "0",
                        fontSize: 9,
                        alignment: "center",
                    },
                    {
                        text: datosTipico[i].minutes_diff,
                        fontSize: 9,
                        alignment: "center",
                    },
                    {
                        text: datosTipico[i].distancia,
                        fontSize: 9,
                        alignment: "center",
                    },
                    {
                        text: datosTipico[i].VeloMaxiSali_m,
                        fontSize: 10,
                        alignment: "center",

                    },
                    {
                        text: datosTipico[i].intervalo_pico,
                        fontSize: 9,
                        alignment: "center",
                    },
                    {
                        text: datosTipico[i].intervalo_valle,
                        fontSize: 9,
                        alignment: "center",
                    },
                    {
                        text: "8",
                        fontSize: 9,
                        alignment: "center",
                    },
                    {
                        text: datosTipico[i].odometrodiff,
                        fontSize: 9,
                        alignment: "center",

                    },
                ];
                resultadoString.push(arrys);
            }

            // tabla Dia Sabado
            var resultadoStringSabado = [];
            for (var i = 0; i < datosSabado.length; i++) {
                var arrys = [
                    {
                        text: datosSabado[i].DescRuta,
                        fontSize: 9,
                        alignment: "center",
                    },
                    {
                        text: "0",
                        fontSize: 9,
                        alignment: "center",
                    },
                    {
                        text: datosSabado[i].minutes_diff,
                        fontSize: 9,
                        alignment: "center",
                    },
                    {
                        text: datosSabado[i].distancia,
                        fontSize: 9,
                        alignment: "center",
                    },
                    {
                        text: datosSabado[i].VeloMaxiSali_m,
                        fontSize: 10,
                        alignment: "center",

                    },
                    {
                        text: datosSabado[i].intervalo_pico,
                        fontSize: 9,
                        alignment: "center",
                    },
                    {
                        text: datosSabado[i].intervalo_valle,
                        fontSize: 9,
                        alignment: "center",
                    },
                    {
                        text: "8",
                        fontSize: 9,
                        alignment: "center",
                    },
                    {
                        text: datosSabado[i].odometrodiff,
                        fontSize: 9,
                        alignment: "center",

                    },
                ];
                resultadoStringSabado.push(arrys);
            }

            // tabla Dia Domingo
            var resultadoStringDomingo = [];
            for (var i = 0; i < datosDomingo.length; i++) {
                var arrys = [
                    {
                        text: datosDomingo[i].DescRuta,
                        fontSize: 9,
                        alignment: "center",
                    },
                    {
                        text: "0",
                        fontSize: 9,
                        alignment: "center",
                    },
                    {
                        text: datosDomingo[i].minutes_diff,
                        fontSize: 9,
                        alignment: "center",
                    },
                    {
                        text: datosDomingo[i].distancia,
                        fontSize: 9,
                        alignment: "center",
                    },
                    {
                        text: datosDomingo[i].VeloMaxiSali_m,
                        fontSize: 10,
                        alignment: "center",

                    },
                    {
                        text: datosDomingo[i].intervalo_pico,
                        fontSize: 9,
                        alignment: "center",
                    },
                    {
                        text: datosDomingo[i].intervalo_valle,
                        fontSize: 9,
                        alignment: "center",
                    },
                    {
                        text: "8",
                        fontSize: 9,
                        alignment: "center",
                    },
                    {
                        text: datosDomingo[i].odometrodiff,
                        fontSize: 9,
                        alignment: "center",

                    },
                ];
                resultadoStringDomingo.push(arrys);
            }

            // tabla Asignación Operativa
            var resultadoStringAsignacionT = [];
            for (var i = 0; i < 1; i++) {
                var arrys = [
                    {
                        text: "Tipico",
                        fontSize: 9,
                        alignment: "center",
                    },
                    {
                        text: "20",
                        fontSize: 9,
                        alignment: "center",
                        colSpan: 8
                    },
                    {
                        text: "",
                        fontSize: 9,
                        alignment: "center",
                    },
                    {
                        text: "",
                        fontSize: 9,
                        alignment: "center",
                    },
                    {
                        text: "",
                        fontSize: 10,
                        alignment: "center",

                    },
                    {
                        text: "",
                        fontSize: 9,
                        alignment: "center",
                    },
                    {
                        text: "",
                        fontSize: 9,
                        alignment: "center",
                    },
                    {
                        text: "",
                        fontSize: 9,
                        alignment: "center",
                    },
                    {
                        text: "",
                        fontSize: 10,
                        alignment: "center",

                    },
                ];
                resultadoStringAsignacionT.push(arrys);
            }
            var resultadoStringAsignacionS = [];
            for (var i = 0; i < 1; i++) {
                var arrys = [
                    {
                        text: "Sábado",
                        fontSize: 9,
                        alignment: "center",
                    },
                    {
                        text: "4",
                        fontSize: 9,
                        alignment: "center",
                        colSpan: 8
                    },
                    {
                        text: "",
                        fontSize: 9,
                        alignment: "center",
                    },
                    {
                        text: "",
                        fontSize: 9,
                        alignment: "center",
                    },
                    {
                        text: "",
                        fontSize: 10,
                        alignment: "center",

                    },
                    {
                        text: "",
                        fontSize: 9,
                        alignment: "center",
                    },
                    {
                        text: "",
                        fontSize: 9,
                        alignment: "center",
                    },
                    {
                        text: "",
                        fontSize: 9,
                        alignment: "center",
                    },
                    {
                        text: "",
                        fontSize: 10,
                        alignment: "center",

                    },
                ];
                resultadoStringAsignacionS.push(arrys);
            }
            var resultadoStringAsignacionD = [];
            for (var i = 0; i < 1; i++) {
                var arrys = [
                    {
                        text: "Domingo",
                        fontSize: 9,
                        alignment: "center",
                    },
                    {
                        text: "6",
                        fontSize: 9,
                        alignment: "center",
                        colSpan: 8
                    },
                    {
                        text: "",
                        fontSize: 9,
                        alignment: "center",
                    },
                    {
                        text: "",
                        fontSize: 9,
                        alignment: "center",
                    },
                    {
                        text: "",
                        fontSize: 10,
                        alignment: "center",

                    },
                    {
                        text: "",
                        fontSize: 9,
                        alignment: "center",
                    },
                    {
                        text: "",
                        fontSize: 9,
                        alignment: "center",
                    },
                    {
                        text: "",
                        fontSize: 9,
                        alignment: "center",
                    },
                    {
                        text: "",
                        fontSize: 10,
                        alignment: "center",

                    },
                ];
                resultadoStringAsignacionD.push(arrys);
            }

            // tabla Periodo
            var resultadoStringPeriodo = [];
            for (var i = 0; i < 1; i++) {
                var arrys = [
                    {
                        text: "Periodo(meses)",
                        fontSize: 9,
                        alignment: "center",
                    },
                    {
                        text: "1",
                        fontSize: 9,
                        alignment: "center",
                        colSpan: 8
                    },
                    {
                        text: "",
                        fontSize: 9,
                        alignment: "center",
                    },
                    {
                        text: "",
                        fontSize: 9,
                        alignment: "center",
                    },
                    {
                        text: "",
                        fontSize: 10,
                        alignment: "center",

                    },
                    {
                        text: "",
                        fontSize: 9,
                        alignment: "center",
                    },
                    {
                        text: "",
                        fontSize: 9,
                        alignment: "center",
                    },
                    {
                        text: "",
                        fontSize: 9,
                        alignment: "center",
                    },
                    {
                        text: "",
                        fontSize: 10,
                        alignment: "center",

                    },
                ];
                resultadoStringPeriodo.push(arrys);
            }

            // tabla Dias
            function generarFila(texto, valor, colSpan = 8) {
                return [
                    {
                        text: texto,
                        fontSize: 9,
                        alignment: "center",
                    },
                    {
                        text: valor,
                        fontSize: 9,
                        alignment: "center",
                        colSpan: colSpan
                    },
                    ...Array(colSpan - 1).fill({
                        text: "",
                        fontSize: 9,
                        alignment: "center",
                    }),
                    // Completar con celdas vacías si colSpan es menor que el total de columnas
                    ...Array(9 - (colSpan + 1)).fill({
                        text: "",
                        fontSize: 9,
                        alignment: "center",
                    })
                ];
            }

            function generarResultado(texto, valor) {
                return [generarFila(texto, valor)];
            }

            //condicion 
            var bodyContent = [];
            bodyContent.push(...componneteParametros());
            // Condiciona la inclusión de la tabla del Día Típico
            if (resultadoString.length > 0) {
                bodyContent.push(
                    componenteHeaderTable([
                        "Día Típico",
                        "Flota (Buses)",
                        "Ciclo (min)",
                        "Distancia (km)",
                        "Velocidad (km/h)",
                        "Intervalo Hora Pico (min)",
                        "Intervalo Hora Valle (min)",
                        "# Vueltas por autobús",
                        "Kilómetros por autobús",
                    ]),
                    ...resultadoString
                );
            }

            // Condiciona la inclusión de la tabla del Día Sábado
            if (resultadoStringSabado.length > 0) {
                bodyContent.push(
                    componenteHeaderTable([
                        "Día Sábado",
                        "Flota (Buses)",
                        "Ciclo (min)",
                        "Distancia (km)",
                        "Velocidad (km/h)",
                        "Intervalo Hora Pico (min)",
                        "Intervalo Hora Valle (min)",
                        "# Vueltas por autobús",
                        "Kilómetros por autobús",
                    ]),
                    ...resultadoStringSabado
                );
            }

            // Condiciona la inclusión de la tabla del Día Domingo
            if (resultadoStringDomingo.length > 0) {
                bodyContent.push(
                    componenteHeaderTable([
                        "Día Domingo",
                        "Flota (Buses)",
                        "Ciclo (min)",
                        "Distancia (km)",
                        "Velocidad (km/h)",
                        "Intervalo Hora Pico (min)",
                        "Intervalo Hora Valle (min)",
                        "# Vueltas por autobús",
                        "Kilómetros por autobús",
                    ]),
                    ...resultadoStringDomingo
                );
            }



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
                            table: {
                                widths: ["*"],
                                body: [
                                    [
                                        {
                                            text: "PROGRAMACIÓN OPERATIVA",
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
                                    ],
                                    [
                                        {
                                            text: "USUARIO : Administrador",
                                            alignment: "center",
                                            fontSize: 8,
                                            bold: true,
                                        },
                                    ], */
                                ],
                            },
                        },
                    ],
                },
                content: [
                    //Tabla 
                    {
                        layout: "noBorders",
                        table: componenteHeader(),
                        margin: [0, 20, 0, 0],
                    },
                    {
                        table: {
                            headerRows: 0,
                            widths: [190, 50, 40, 60, 60, 80, 80, 60, 80],
                            body: 
                               
                                /*[componenteHeaderTable([
                                    "Dia Tipico",
                                    "Flota (Buses)",
                                    "Ciclo (min)",
                                    "Distancia (km)",
                                    "Velocidad (km/h)",
                                    "Intervalo Hora Pico (min)",
                                    "Intervalo Hora Valle (min)",
                                    "# Vueltas por autobús",
                                    "Kilómetros por autobús",
                                ]),
                                ...resultadoString,

                                componenteHeaderTable([
                                    "Día Sábado",
                                    "Flota (Buses)",
                                    "Ciclo (min)",
                                    "Distancia (km)",
                                    "Velocidad (km/h)",
                                    "Intervalo Hora Pico (min)",
                                    "Intervalo Hora Valle (min)",
                                    "# Vueltas por autobús",
                                    "Kilómetros por autobús",
                                ]),
                                ...resultadoStringSabado,

                                componenteHeaderTable([
                                    "Día Domingo",
                                    "Flota (Buses)",
                                    "Ciclo (min)",
                                    "Distancia (km)",
                                    "Velocidad (km/h)",
                                    "Intervalo Hora Pico (min)",
                                    "Intervalo Hora Valle (min)",
                                    "# Vueltas por autobús",
                                    "Kilómetros por autobús",
                                ]),
                                ...resultadoStringDomingo, */
                                bodyContent.length > 0 ? bodyContent : [
                                    componenteHeaderTable(["No hay datos disponibles para los días seleccionados"]),
                                ],
                        },
                        margin: [0, 10, 0, 10],
                    },
                    {
                        table: {
                            headerRows: 0,
                            widths: [100, 50, 40, 60, 60, 80, 80, 60, 80],
                            body: [
                                ...componenteTituloTabla("Asignacion Operativa"),
                                ...resultadoStringAsignacionT,
                                ...resultadoStringAsignacionS,
                                ...resultadoStringAsignacionD,
                                ...componnetePeriodo(),
                                ...resultadoStringPeriodo,
                                ...componneteDias(),
                                ...generarResultado("Maximo", "22.0"),
                                ...generarResultado("Minimo", "15.0"),
                                ...generarResultado("Rango", "8"),
                                ...generarResultado("Cuenta", "12.0"),
                                ...generarResultado("Mediana", "12.0"),
                                ...generarResultado("Moda", "9.0"),
                                ...generarResultado("Promedio", "9.0"),
                                ...generarResultado("Desviancion Estandar", "1.67"),
                                ...componneteKmu(),
                                ...generarResultado("Maximo", "22.0"),
                                ...generarResultado("Minimo", "15.0"),
                                ...generarResultado("Rango", "8"),
                                ...generarResultado("Cuenta", "12.0"),
                                ...generarResultado("Mediana", "12.0"),
                                ...generarResultado("Moda", "9.0"),
                                ...generarResultado("Promedio", "9.0"),
                                ...generarResultado("Desviancion Estandar", "1.67"),
                                ...componneteKmnu(),
                                ...generarResultado("Maximo", "22.0"),
                                ...generarResultado("Minimo", "15.0"),
                                ...generarResultado("Rango", "8"),
                                ...generarResultado("Cuenta", "12.0"),
                                ...generarResultado("Mediana", "12.0"),
                                ...generarResultado("Moda", "9.0"),
                                ...generarResultado("Promedio", "9.0"),
                                ...generarResultado("Desviancion Estandar", "1.67"),
                            ],
                        },
                        margin: [0, 20, 0, 20],
                    },
                ],
                /* background: {
                    // Agregar la marca de agua al fondo del documento
                    image: marcaDeAgua.image,
                    absolutePosition: marcaDeAgua.absolutePosition,
                    opacity: marcaDeAgua.opacity,
                    fit: [400, 500],
                    alignment: "",
                }, */
            };

            var pdfDocGenerator = pdfMake.createPdf(docDefinition);
            pdfDocGenerator.getBlob((blob) => {
                var pdfUrl = URL.createObjectURL(blob);
                let iframe = document.getElementById(
                    "iframeContainerprogramcionOperativa"
                );
                iframe.src = pdfUrl;
            });
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
        this.readGruposActivosPenalidadesSemanales();
        this.readAllRutasSalidasSEmanales();
        this.readAllUnidadesSalidasSemanales();
        this.initPrimerDiaSemanaActualSalidaBusquedaPanel();
        //this.readApiPenalidades();
    },
};
</script>
<style>
.containerModalRecorridoPanelDespacho {
    display: flex;
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

.el-loading-text {
    color: black !important;
}

.el-icon-loading {
    color: black !important;
}

.cardTextoRPagosVehiculoProduccionPanelDespachoBusqueda {
    display: flex;
    align-items: center;
}

.cardSelectRubrosEstadosPagosVehiculoProduccionContainerPanelDespachoBusqueda {
    display: flex;
    justify-content: space-between;
}

.no-border-card .card-footer {
    border-top: 0;
}

.card-bodyRPenalidadesSemanales {
    padding: 0rem !important;
    height: calc(100vh - 13rem);
    overflow: none;
}

.card-bodyTopOpcionesRPagosVehiculoPRoduccionPanelDespachoBusqueda {
    padding-top: 0.25rem !important;
}
</style>