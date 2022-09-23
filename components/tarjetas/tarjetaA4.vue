<template>
  <card
    type="secondary"
    header-classes="bg-transparent pb-5"
    class="border-0 mb-0"
  >
    <iframe
      :src="baseURlPDFPanelDespachoTarjeta"
      style="width: 100%; height: 33rem"
    ></iframe>
  </card>
</template>

<style></style>

<script>
import { Table, TableColumn } from "element-ui";
import { getBase64LogoReportes } from "../../util/logoReport";
import  pdfMake from 'pdfmake/build/pdfmake.js';
import pdfFonts from 'pdfmake/build/vfs_fonts.js';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

export default {
  components: {
    [TableColumn.name]: TableColumn,
    [Table.name]: Table,
  },
  data() {
    return {
      baseURlPDFPanelDespachoTarjeta: "",
      token: this.$cookies.get("token"),
      mListSalidasTarjeta : []
    };
  },
  methods: {
    async readDetalleSalidaDPanelBusqueda(salida) 
    {
      this.baseURlPDFPanelDespachoTarjeta = ""


      var datos = await this.$axios.post(
        process.env.baseUrl + "/detalleSalida",
        {
          token: this.token,
          idsalida: salida.idSali_m,
        }
      );

      this.mListSalidasTarjeta = [];
      this.mListSalidasTarjeta.push(...datos.data.data);

      //console.log(this.mListSalidasTarjeta)

      /*console.log(salida);

      var empresa = [
        {
          text: this.$cookies.get("nameEmpresa").substring(0, 30),
          fontSize: 12,
          bold: true,
          alignment: "center",
        },
      ];

      var resultadoString = [
        [
          { text: "RELOJ", fontSize: 8.5, bold: true, alignment: "center" },
          { text: "PROG", fontSize: 8.5, bold: true, alignment: "center" },
          { text: "MARC", fontSize: 8.5, bold: true, alignment: "center" },
          { text: "FALT", fontSize: 8.5, bold: true, alignment: "center" },
          { text: "PEN", fontSize: 8.5, bold: true, alignment: "center" },
        ],
      ];

      for (var i = 0; i < this.mListSalidasTarjeta.length; i++) {
        var arrys = [
          {
            text: this.mListSalidasTarjeta[i].DescCtrlSali_d.substring(0, 9),
            fontSize: 8.5,
          },
          {
            text: this.mListSalidasTarjeta[i].HoraProgSali_d.substring(0, 5),
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text:
              this.mListSalidasTarjeta[i].HoraMarcSali_d == "00:00:00"
                ? ""
                : this.mListSalidasTarjeta[i].HoraMarcSali_d,
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text:
              (this.mListSalidasTarjeta[i].HoraMarcSali_d != '00:00:00' ? this.mListSalidasTarjeta[i].FaltSali_d : this.mListSalidasTarjeta[i].FaltSali_d == "0"
                ? ""
                : this.mListSalidasTarjeta[i].FaltSali_d),
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text:
              this.mListSalidasTarjeta[i].PenaCtrlSali_d == "0.00"
                ? ""
                : this.mListSalidasTarjeta[i].PenaCtrlSali_d,
            fontSize: 8.5,
            alignment: "center",
          },
        ];
        resultadoString.push(arrys);
      }

      var heightAux = 9.7;
      var sumFalt = 0;
      var penFalt = 0;
      for (var i = 0; i < datos.data.data.length; i++) {
        heightAux = heightAux + 1;
        if (
          datos.data.data[i].FaltSali_d > 0 &&
          datos.data.data[i].isCtrlRefeSali_d == 0
        ) {
          sumFalt = sumFalt + datos.data.data[i].FaltSali_d;
        }

        if (datos.data.data[i].isCtrlRefeSali_d == 0) {
          var pen = parseFloat(datos.data.data[i].PenaCtrlSali_d);
          penFalt = penFalt + pen;
        }
      }

      var docDefinition = {
        // a string or { width: 190, height: number }
        pageSize: 'A4',
        pageMargins: [15, 15, 15, 15],
        compress: true,
        // header: [empresa],

        content: [
          {
            headerRows: 0,
            fontSize: 12,
            bold: true,
            layout: "noBorders", // optional
            table: {
              widths: ["*"],
              body: [empresa],
            },
          },
          {
            bold: true,
            fontSize: 9,
            alignment: "center",
            layout: "noBorders", // optional
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              headerRows: 0,
              widths: [35, 75, 25, 22],
              body: [["Unidad", "Salida #" + salida.idSali_m, "Ruta", "Vue"]],
            },
          },

          {
            //bold: true,
            fontSize: 9,
            alignment: "center",

            layout: "noBorders", // optional
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              headerRows: 0,
              widths: [35, 75, 25, 22],
              body: [
                [
                  salida.CodiVehiSali_m,
                  salida.HoraSaliProgSali_mF.substring(0, 10),
                  { text: salida.LetraRutaSali_m, bold: true },
                  salida.NumeVuelSali_m,
                ],
              ],
            },
          },

          {
            fontSize: 10,
            layout: "noBorders", // optional
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              widths: ["*"],
              body: [["FREC: " + salida.DescFrec.substring(0, 25)]],
            },
          },

          { text: "---------------------------------------------------------" },
          {
            fontSize: 8.5,
            layout: "noBorders",
            // optional
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              headerRows: 0,
              widths: [180, 23, 33, 19, 17],

              body: resultadoString,
            },
          },

          { text: "---------------------------------------------------------" },
          { text: "Chofer: ", fontSize: 8 },
          { text: "Cobrador: ", fontSize: 8 },
          {
            text:
              "Adelanto: " +
              (salida.adelantoTime == null ? "00:00:00" : salida.adelantoTime),
            fontSize: 8,
            fontSize: 8,
          },
          {
            text:
              "Atrasos: " +
              (salida.atrasoTime == null ? "00:00:00" : salida.atrasoTime),
            fontSize: 8,
          },

          {
            fontSize: 10,
            bold: true,
            layout: "noBorders", // optional
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers

              body: [
                ["TOTAL Faltas : +" + sumFalt],
                ["TOTAL Dinero : " + Number(penFalt).toFixed(2)],
              ],
            },
          },
        ],
      };

      var pdfDocGenerator = pdfMake.createPdf(docDefinition);

      pdfDocGenerator.getDataUrl((dataUrl) => {
        this.baseURlPDFPanelDespachoTarjeta = dataUrl;
      });
      this.baseURlPDFPanelDespachoTarjeta = await pdfDoc.saveAsBase64({
        dataUri: true,
      });*/


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
            "Unidad : " + salida.CodiVehiSali_m,
          fontSize: 9,
          alignment: "left",
        },
      ];
      var ruta = [
        {
          text:
            "Ruta : " + salida.DescRutaSali_m,
          fontSize: 9,
          alignment: "left",
        },
      ];
      var desde_hasta = [
        {
          text:
            "Fecha Salida : " + salida.HoraSaliProgSali_mF +" Hasta " + salida.HoraLlegProgSali_m,
          fontSize: 9,
          alignment: "left",
        },
      ];

      var vueltaSalida = [
        {
          text: 
            "N° Vuelta : " + salida.NumeVuelSali_m,
          fontSize: 9,
          alignment: "left",
        },
      ];

      var FrecuenciaSalida = [
        {
          text:
            "Frecuencia : " + salida.DescFrec,
          fontSize: 9,
          alignment: "left",
        },
      ];

      var resultadoString = [
        [
          {
            text: "Control",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },
          {
            text: "H. PROG",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },
          {
            text: "H. MARC",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },
          {
            text: "Faltas",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },
          {
            text: "V. Max",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },
          {
            text: "PEN ($)",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },
          {
            text: "Sanción",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          }
        ],
      ]

      var resultadoStringTotales = [
      {
            text: "Total Faltas Adelantos",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },
          {
            text: "Total Faltas Atrasos",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },
          {
            text: "Total Multas ($)",
            fontSize: 8.5,
            bold: true,
            fillColor: "#039BC4",
            color: "white",
            alignment: "center",
          },
      ]

      for (var i = 0; i < this.mListSalidasTarjeta.length; i++) 
      {
        var arrys = [
          {
            text: this.mListSalidasTarjeta[i].DescCtrlSali_d,
            fontSize: 8.5,
            alignment: "left",
            color: this.mListSalidasTarjeta[i].isCtrlRefeSali_d == 0 ? '#000000' : '#FF0000'
          },
          {
            text: this.mListSalidasTarjeta[i].HoraProgSali_d,
            fontSize: 8.5,
            alignment: "center",
            color: this.mListSalidasTarjeta[i].isCtrlRefeSali_d == 0 ? '#000000' : '#FF0000'
          },
          {
            text: this.mListSalidasTarjeta[i].HoraMarcSali_d == '00:00:00' ? '' : this.mListSalidasTarjeta[i].HoraMarcSali_d,
            fontSize: 8.5,
            alignment: "center",
            color: this.mListSalidasTarjeta[i].isCtrlRefeSali_d == 0 ? '#000000' : '#FF0000'
          },
          {
            text: this.mListSalidasTarjeta[i].FaltSali_d,
            fontSize: 8.5,
            alignment: "center",
            color: this.mListSalidasTarjeta[i].isCtrlRefeSali_d == 0 ? '#000000' : '#FF0000'
          },
          {
            text: '',
            fontSize: 8.5,
            alignment: "center",
            color: this.mListSalidasTarjeta[i].isCtrlRefeSali_d == 0 ? '#000000' : '#FF0000'
          },
          {
            text: this.mListSalidasTarjeta[i].PenaCtrlSali_d == '0.00' ? '' : this.mListSalidasTarjeta[i].PenaCtrlSali_d,
            fontSize: 8.5,
            alignment: "center",
            color: this.mListSalidasTarjeta[i].isCtrlRefeSali_d == 0 ? '#000000' : '#FF0000'
          },
          {
            text: this.mListSalidasTarjeta[i].isCtrlRefeSali_d == 1 ? 'REFERENCIAL' : 'SANCIONABLE',
            fontSize: 8.5,
            alignment: "center",
            color: this.mListSalidasTarjeta[i].isCtrlRefeSali_d == 1 ?  '#FF0000' : '#008019'
          } ,
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
                      text: "REPORTE SALIDAS DETALLADAS",
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
              /*widths: ['*'],
              body: [empresa]*/
              widths: [450, 450, 450, 450, 450, 450],
              body: [empresa, unidad, ruta, desde_hasta,vueltaSalida,FrecuenciaSalida],
            },
          },
          {
            table: {
              headerRows: 0,
              widths: [170, 35, 40, 35, 35, 40,90],
              body: resultadoString,
              //body: [[]],
            },
          },
          {
            text:'.',
            fontSize:6
          },
          {
            table: {
              headerRows: 0,
              widths: [90, 90, 90],
              body: [resultadoStringTotales,[{
            text: salida.adelantoFaltasTime,
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text: salida.atrasoFaltasTime,
            fontSize: 8.5,
            alignment: "center",
          },
          {
            text: salida.PenaCtrlSali_d,
            fontSize: 8.5,
            alignment: "center",
          }]]
              //body: [[]],
            },
          },
        ],
      };

      //pdfMake.createPdf(docDefinition).download("RSD_" + Date.now());
      var pdfDocGenerator = pdfMake.createPdf(docDefinition);
      pdfDocGenerator.getDataUrl((dataUrl) => {
        this.baseURlPDFPanelDespachoTarjeta = dataUrl;
      })

    },
  },
  mounted() {},
};
</script>
