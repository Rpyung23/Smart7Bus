<template slot-scope="scope">
  <div>
    <base-header>
      <div class="align-items-center py-3">
        <card
          class="no-border-card col"
          style="margin-bottom: 0.5rem"
          body-classes="px-0 pb-1 card-bodyTopOpcionesRPagosVehiculoPRoduccion cardSelectRubrosEstadosPagosVehiculoProduccionContainer"
          footer-classes="pb-2"
        >
          <div class="cardTextoRPagosVehiculoProduccion">
            <el-select
              style="margin-right: 0.5rem"
              v-model="itemUnidadSelectRhrrecorrido"
              multiple
              filterable
              remote
              reserve-keyword
              placeholder="Ingrese una unidad"
              :remote-method="remoteMethodUnidadesSalidasPanelBusqueda"
              :loading="loadingTableUnidadesSalidasPanelBusquedaloading"
            >
              <el-option
                v-for="item in optionsUnidadesSalidasPanelBusqueda"
                :key="item.CodiVehi"
                :label="item.CodiVehi"
                :value="item.CodiVehi"
              >
              </el-option>
            </el-select>
          </div>

          <div
            class="cardSelectRubrosEstadosPagosVehiculoProduccionContainer"
            size="sm"
          >
            <div class="buttonsAdicionalesRContadorVuelta">
              <base-button
                icon
                type="primary"
                size="sm"
                @click="readRhrrecorrido"
              >
                <span class="btn-inner--icon"
                  ><i class="el-icon-search" title="Exportar PDF"></i
                ></span>
              </base-button>

              <download-excel
                v-if="mListaUnidadesRhrrecorrido.length > 0"
                class="btn btn-icon btn-fab btn-success btn-sm"
                outline
                :header="oheaderExcelRhrrecorrido"
                title="Exportar a Excel"
                :data="mListaUnidadesRhrrecorrido"
                :fields="json_fields_excelRhrrecorrido"
                :worksheet="WorksheetExcelRhrrecorrido"
                :name="FileNameExcelRhrrecorrido"
              >
                <span class="btn-inner--icon"
                  ><i class="ni ni-collection"></i
                ></span>
              </download-excel>
            </div>
          </div>
        </card>

        <card
          class="no-border-card col"
          style="margin-bottom: 0.5rem"
          body-classes="px-0 pb-1 card-bodyTopOpcionesRPagosVehiculoPRoduccion cardSelectRubrosEstadosPagosVehiculoProduccionContainer"
          footer-classes="pb-2"
        >
          <div class="cardTextoRPagosVehiculoProduccion">
            <el-date-picker
              v-model="datePickerRhrrecorrido"
              type="datetimerange"
              range-separator="Hasta"
              format="yyyy-MM-dd HH:mm:ss"
              start-placeholder="Fecha Inicial"
              end-placeholder="Fecha Final"
            >
            </el-date-picker>
          </div>
        </card>

        <card
          class="no-border-card"
          style="margin-bottom: 0px; width: 100%; height: calc(100vh - 13rem)"
        >
          <embed
            id="iframeContainerRHRecorrido"
            :src="base64PDFRHRECORRIDO"
            type="application/pdf"
            width="100%"
            height="100%"
          />
        </card>
      </div>
    </base-header>
  </div>
</template>
<script>
import { Select, Option, DatePicker, Table } from "element-ui";
import { getFecha_dd_mm_yyyy, getformatFechaDateTime } from "../../util/fechas";
import { getBase64LogoReportes } from "../../util/logoReport";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import Vue from "vue";
import JsonExcel from "vue-json-excel";
Vue.component("downloadExcel", JsonExcel);
import swal from "sweetalert2";
import { timeout } from "q";

export default {
  layout: "DashboardLayoutMovilidad",
  components: {
    [Select.name]: Select,
    [Option.name]: Option,
    [DatePicker.name]: DatePicker,
    JsonExcel,
  },
  data() {
    return {
      token: this.$cookies.get("token"),
      options: [],
      base64PDFRHRECORRIDO: "",
      itemUnidadSelectRhrrecorrido: [],
      listaUnidadesRhrrecorridoPanelBusqueda: [],
      mListaUnidadesRhrrecorrido: [],
      loadingTableUnidadesSalidasPanelBusquedaloading: false,
      optionsUnidadesSalidasPanelBusqueda: [],
      datePickerRhrrecorrido: [],

      json_fields_excelRhrrecorrido: {
        UNIDAD: "CodiVehiHistEven",
        FECHA: "FechHistEven",
        DesRuta: "DescRutaSali_m",
        DesFrec: "DescFrec",
        NunVueltas: "NumeVuelSali_m",
        DesCtrl: "DesCtrSali_d",
        HSalida: "HoraProgSali_d",
        HMarcada: "HoraMarcSali_d",
        Atraso: "atraso",
        Adelanto: "adelanto",
        Latitud: "LatiHistEven",
        Longitud: "LongHistEven",
        Rumbo: "RumbHistEven",
        Velocidad: "Velocidad",
      },
      WorksheetExcelRhrrecorrido: "Hoja_1",
      FileNameExcelRhrrecorrido: "ReporteHistoricoRecorrido",
      oheaderExcelRhrrecorrido: "",
    };
  },
  methods: {
    async readAllVehiculos() {
      try {
        var datos = await this.$axios.post(process.env.baseUrl + "/unidades", {
          token: this.token,
          tipo: 3,
        });
        if (datos.data.status_code == 200) {
          this.listaUnidadesRhrrecorridoPanelBusqueda.push(...datos.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    },

    async readRhrrecorrido() {
    this.mListaUnidadesRhrrecorrido = []

    let iframe = document.getElementById('iframeContainerRHRecorrido');
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

      this.oheaderExcelRhrrecorrido = [
        "REPORTE HISTORIAL DE RECORIDO",
        "Fechas : " +
          this.datePickerRhrrecorrido[0] +
          " hasta " +
          this.datePickerRhrrecorrido[1],
        "Unidades : " +
          (this.itemUnidadSelectRhrrecorrido.length <= 0
            ? "TODAS LAS UNIDADES"
            : this.itemUnidadSelectRhrrecorrido),
      ];

      try {
        var datos = await this.$axios.post(
          process.env.baseUrl + "/Rhrrecorrido",
          {
            token: this.token,
            unidades:
              this.itemUnidadSelectRhrrecorrido.length > 0
                ? this.itemUnidadSelectRhrrecorrido
                : "*",
            fechaI: getformatFechaDateTime(
              this.datePickerRhrrecorrido[0].toString()
            ),
            fechaF: getformatFechaDateTime(
              this.datePickerRhrrecorrido[1].toString()
            ),
            timeout: 9000,
          }
        );

        if (datos.data.status_code == 200) {
          this.mListaUnidadesRhrrecorrido.push(...datos.data.datos);
          this.generatePdf()
        } else if (datos.data.status_code == 300) {
          this.$notify({
            title: "ERROR API REST",
            message: datos.data.msm,
            type: "info",
          });
          this.generatePdfDefault();
        } else {
          this.$notify({
            title: "ERROR API REST",
            message: datos.data.msm,
            type: "error",
          });
          swal.close();
          this.generatePdfDefault();
        }
      } catch (error) {
        this.$notify({
          title: "Error CATCH",
          message: error.toString(),
          type: "error",
        });
        
        this.generatePdfDefault();
      }
      swal.close();
    },

    remoteMethodUnidadesSalidasPanelBusqueda(query) {
      if (query !== "") {
        this.loadingTableUnidadesSalidasPanelBusquedaloading = true;
        setTimeout(() => {
          this.loadingTableUnidadesSalidasPanelBusquedaloading = false;
          this.optionsUnidadesSalidasPanelBusqueda =
            this.listaUnidadesRhrrecorridoPanelBusqueda.filter((item) => {
              return (
                item.CodiVehi.toLowerCase().indexOf(query.toLowerCase()) > -1
              );
            });
        }, 200);
      } else {
        this.optionsUnidadesSalidasPanelBusqueda = [];
      }
    },

    generatePdf() {
      var empresa = [
        {
          text: "Empresa : " + this.$cookies.get("nameEmpresa"),
          fontSize: 9,
          alignment: "left",
        },
      ];
      var unidad = [
        {
          text:
            "Unidad : " +
            (this.itemUnidadSelectRhrrecorrido.length == 0
              ? "TODAS LAS UNIDADES"
              : this.itemUnidadSelectRhrrecorrido.toString()),
          fontSize: 9,
          alignment: "left",
        },
      ];
      var desde_hasta = [
        {
          text:
            "Fecha Salida : " +
            this.datePickerRhrrecorrido[0] +
            " Hasta " +
            this.datePickerRhrrecorrido[1],
          fontSize: 9,
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
            text: "Fecha Evento",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },
          {
            text: "Des. Ruta",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },
          {
            text: "Des. Frec",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },
          {
            text: "Num. Vuelta",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },
          {
            text: "Des. Control",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },
          {
            text: "H. Salida",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },
          {
            text: "H. Marcada",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },
          {
            text: "Adelanto",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },
          {
            text: "Atraso",
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
          {
            text: "Rumbo",
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
        ],
      ];

      for (var i = 0; i < this.mListaUnidadesRhrrecorrido.length; i++) {
        var arrys = [
          {
            text: this.mListaUnidadesRhrrecorrido[i].CodiVehiHistEven,
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text: this.mListaUnidadesRhrrecorrido[i].FechHistEven,
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text: this.mListaUnidadesRhrrecorrido[i].DescRutaSali_m,
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text: this.mListaUnidadesRhrrecorrido[i].DescFrec,
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text: this.mListaUnidadesRhrrecorrido[i].NumeVuelSali_m,
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text: this.mListaUnidadesRhrrecorrido[i].DesCtrSali_d,
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text: this.mListaUnidadesRhrrecorrido[i].HoraProgSali_d,
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text: this.mListaUnidadesRhrrecorrido[i].HoraMarcSali_d,
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text: this.mListaUnidadesRhrrecorrido[i].atraso,
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text: this.mListaUnidadesRhrrecorrido[i].adelanto,
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text: this.mListaUnidadesRhrrecorrido[i].LatiHistEven,
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text: this.mListaUnidadesRhrrecorrido[i].LongHistEven,
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text: this.mListaUnidadesRhrrecorrido[i].RumbHistEven,
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text: this.mListaUnidadesRhrrecorrido[i].Velocidad,
            fontSize: 8.5,
            alignment: "center",
          },
        ];
        resultadoString.push(arrys);
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
                      text: "REPORTE HISTORIAL RECORRIDO",
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
              body: [empresa, unidad, desde_hasta],
            },
          },
          {
            table: {
              headerRows: 0,
              widths: [40, 50, 60, 60, 40, 50, 50, 50, 40, 40, 40, 50, 30, 40],
              body: resultadoString,
            },
          },
        ],
      };

      
      var pdfDocGenerator = pdfMake.createPdf(docDefinition)
      
      pdfDocGenerator.getBlob((blob) => {

        var pdfUrl = URL.createObjectURL(blob)
        let iframe = document.getElementById('iframeContainerRHRecorrido');
        iframe.src = pdfUrl;
        
      });
      /*pdfDocGenerator.getDataUrl((dataUrl) => {
        let iframe = document.getElementById('iframeContainerRHRecorrido');
        iframe.src = dataUrl;
        targetElement.appendChild(iframe);
      });*/

      /*pdfDocGenerator.getBase64((data) => {
        this.base64PDFRHRECORRIDO = data;
      });*/

    },

    generatePdfDefault() {
      var empresa = [
        {
          text: "Empresa : " + this.$cookies.get("nameEmpresa"),
          fontSize: 9,
          alignment: "left",
        },
      ];
      var unidad = [
        {
          text:
            "Unidad : " +
            (this.itemUnidadSelectRhrrecorrido.length == 0
              ? "TODAS LAS UNIDADES"
              : this.itemUnidadSelectRhrrecorrido.toString()),
          fontSize: 9,
          alignment: "left",
        },
      ];
      var desde_hasta = [
        {
          text:
            "Fecha Salida : " +
            this.datePickerRhrrecorrido[0] +
            " Hasta " +
            this.datePickerRhrrecorrido[1],
          fontSize: 9,
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
            text: "Fecha Evento",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },
          {
            text: "Des. Ruta",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },
          {
            text: "Des. Frec",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },
          {
            text: "Num. Vuelta",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },
          {
            text: "Des. Control",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },
          {
            text: "H. Salida",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },
          {
            text: "H. Marcada",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },
          {
            text: "Adelanto",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },
          {
            text: "Atraso",
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
          {
            text: "Rumbo",
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
        ],
      ];

      for (var i = 0; i < 1; i++) {
        var arrys = [
          {
            text: "",
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text: "",
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text: "",
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text: "",
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text: "",
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text: "",
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text: "",
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text: "",
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text: "",
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text: "",
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text: "",
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text: "",
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text: "",
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text: "",
            fontSize: 8.5,
            alignment: "center",
          },
        ];
        resultadoString.push(arrys);
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
                      text: "REPORTE HISTORIAL RECORRIDO",
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
              body: [empresa, unidad, desde_hasta],
            },
          },
          {
            table: {
              headerRows: 0,
              widths: [40, 50, 60, 60, 40, 50, 50, 50, 40, 40, 40, 50, 30, 40],
              body: resultadoString,
            },
          },
        ],
      };

      const pdfDocGenerator = pdfMake.createPdf(docDefinition);
      pdfDocGenerator.getDataUrl((dataUrl) => {
        let iframe = document.getElementById("iframeContainerRHRecorrido");
        iframe.src = dataUrl;
        // targetElement.appendChild(iframe);
      });
    },
  },
  mounted() {
    this.readAllVehiculos();
    this.datePickerRhrrecorrido = [
      getFecha_dd_mm_yyyy(new Date()) + " 05:00:00",
      getFecha_dd_mm_yyyy(new Date()) + " 23:00:00",
    ];
  },
};
</script>
<style>
.el-range-separator {
  width: auto !important;
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
  flex-wrap: wrap;
}

.cardSelectRubrosEstadosPagosVehiculoProduccionContainer {
  display: flex;
  justify-content: space-between;
}

.no-border-card .card-footer {
  border-top: 0;
}

.card-bodyRDistancias {
  padding: 0rem !important;
  height: calc(100vh - 12.9rem);
  overflow: auto;
}

.card-bodyTopOpcionesRPagosVehiculoPRoduccion {
  padding-top: 0.25rem !important;
}
</style>
