<template>
  <card type="secondary" header-classes="bg-transparent pb-5" class="border-0 mb-0">
    <iframe :src="baseURlPDFPanelDespachoTarjeta" style="width: 100%; height: 33rem"></iframe>
  </card>
</template>

<style></style>

<script>
import { Table, TableColumn } from "element-ui";

import pdfMake from "pdfmake/build/pdfmake.js";
import pdfFonts from "pdfmake/build/vfs_fonts.js";

import { getBase64LogoReportes } from "../../util/logoReport";

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
      fecha_impresion: "YYYY-mm-dd 00:00:00",
    };
  },
  methods: {

    async readDetalleSalidaDPanelBusquedaControles(salida) {
      console.log("iniciooooo");
      console.log(salida);
      this.baseURlPDFPanelDespachoTarjeta = "";
      const idSalidasUnicas = new Set();
      salida.forEach(obj => {
        idSalidasUnicas.add(obj.idSali_m);
      });

      const idSalidasUnicasArray = Array.from(idSalidasUnicas);
      console.log("Array de idSalidas únicas:");
      console.log(idSalidasUnicasArray);
      var datos = await this.$axios.post(
        process.env.baseUrl + "/detalleSalida",
        {
          token: this.token,
          idsalida: idSalidasUnicasArray,
        }
      );
      
      this.mListSalidasTarjeta = [];
      this.mListSalidasTarjeta.push(...datos.data.data);
      console.log("Aca los datos de api ",this.mListSalidasTarjeta)


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
            text: this.mListSalidasTarjeta[i].DescCtrlSali_d.substring(0, 7),
            fontSize: 8.5,
          },
          {
            text: this.mListSalidasTarjeta[i].HoraProgSali_d,
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
              this.mListSalidasTarjeta[i].HoraMarcSali_d != "00:00:00"
                ? this.mListSalidasTarjeta[i].FaltSali_d
                : this.mListSalidasTarjeta[i].FaltSali_d == "0"
                  ? ""
                  : this.mListSalidasTarjeta[i].FaltSali_d,
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
        pageSize: { width: 220, height: "auto" },
        pageMargins: [15, 15, 15, 15],
        compress: true,
        // header: [empresa],

        content: [
          this.$cookies.get("empresa") == "tjerpazol"
            ? {
              layout: "noBorders",
              alignment: "center",
              table: {
                headerRows: 0,
                widths: ["*"],

                body: [
                  [
                    {
                      image: getBase64LogoReportes(
                        this.$cookies.get("empresa")
                      ),
                      fit: [60, 60],
                    },
                  ],
                ],
              },
            }
            : {},
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
                  //salida.CodiVehiSali_m,
                  //salida.HoraSaliProgSali_m.substring(0, 10),
                  //{ text: salida.LetraRutaSali_m, bold: true },
                  //salida.NumeVuelSali_m,
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
              body: [["FREC: "  /* + salida.DescFrec.substring(0, 25)*/]],
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
              widths: [45, 33, 33, 19, 17],

              body: resultadoString,
            },
          },

          { text: "---------------------------------------------------------" },
          { text: "Chofer: ", fontSize: 8 },
          { text: "Cobrador: ", fontSize: 8 },
          {
            text: "Adelanto: " //+ salida.adelantoFaltasTime,
            ,fontSize: 8,
          },
          {
            text: "Atrasos: " //+ salida.atrasoFaltasTime,
            ,fontSize: 8,
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

          {
            fontSize: 6,
            layout: "noBorders", // optional
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers

              body: [["."]],
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
      }); 
      //localStorage.setItem('baseURlPDFPanelDespachoTarjeta', baseURlPDFPanelDespachoTarjeta);

    },

    initFechaActualTicket() {
      const today = new Date();
      const fecha = new Date(today);
      fecha.setDate(fecha.getDate());
      var mes = fecha.getMonth() + 1;
      var day = fecha.getDate();
      var hora = fecha.getHours();
      var minuto = fecha.getMinutes();
      var segundo = fecha.getSeconds();
      var format =
        fecha.getFullYear() +
        "-" +
        (mes < 10 ? "0" + mes : mes) +
        "-" +
        (day < 10 ? "0" + day : day);

      var formatHora =
        (hora < 10 ? "0" + hora : hora) +
        ":" +
        (minuto < 10 ? "0" + minuto : minuto) +
        ":" +
        (segundo < 10 ? "0" + segundo : segundo);

      return format + " " + formatHora;
    },
  },
  mounted() { },
};
</script>
