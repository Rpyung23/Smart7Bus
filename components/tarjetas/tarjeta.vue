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
    async readDetalleSalidaDPanelBusqueda(salida) {
      this.baseURlPDFPanelDespachoTarjeta = "";

      var datos = await this.$axios.post(
        process.env.baseUrl + "/detalleSalida",
        {
          token: this.token,
          idsalida: salida.idSali_m,
        }
      );

      this.mListSalidasTarjeta = [];
      this.mListSalidasTarjeta.push(...datos.data.data);


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
              widths: [45, 33, 33, 19, 17],

              body: resultadoString,
            },
          },

          { text: "---------------------------------------------------------" },
          { text: "Chofer: ", fontSize: 8 },
          { text: "Cobrador: ", fontSize: 8 },
          {
            text: "Adelanto: " + salida.adelantoFaltasTime,
            fontSize: 8,
            fontSize: 8,
          },
          {
            text: "Atrasos: " + salida.atrasoFaltasTime,
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
    },
    async readDetalleSalidaDPanelBusquedaAntActPos(salida) {
      this.baseURlPDFPanelDespachoTarjeta = "";


      var datos = await this.$axios.post(
        process.env.baseUrl + "/detalleSalida",
        {
          token: this.token,
          idsalida: [
            salida[0] == undefined ? 0 : parseInt(salida[0].idSali_m),
            salida[1] == undefined ? 0 : parseInt(salida[1].idSali_m),
            salida[2] == undefined
              ? 0
              : salida[2].idSali_m == ""
                ? 0
                : parseInt(salida[2].idSali_m),
          ],
        }
      );

      this.mListSalidasTarjeta = [];
      this.mListSalidasTarjeta.push(...datos.data.data);

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
          { text: "CTRL", fontSize: 8.5, bold: true, alignment: "center" },
          {
            text: salida[0] == undefined ? "" : salida[0].CodiVehiSali_m,
            fontSize: 8.5,
            bold: true,
            colSpan: 2,
            alignment: "center",
          },
          { text: "", fontSize: 8.5, bold: true, alignment: "center" },
          {
            text: salida[1].CodiVehiSali_m,
            fontSize: 8.5,
            bold: true,
            colSpan: 2,
            alignment: "center",
          },
          { text: "", fontSize: 8.5, bold: true, alignment: "center" },
          {
            text: salida[2] == undefined ? "" : salida[2].CodiVehiSali_m,
            fontSize: 8.5,
            bold: true,
            colSpan: 2,
            alignment: "center",
          },
          { text: "", fontSize: 8.5, bold: true, alignment: "center" },
        ],
      ];
      const datosProcesados = [[], [], []];
      for (var i = 0; i < this.mListSalidasTarjeta.length; i++) {
        if (
          salida[0] !== undefined &&
          Number(salida[0].idSali_m) ===
          this.mListSalidasTarjeta[i].idSali_mSali_d
        ) {
          datosProcesados[0].push(this.mListSalidasTarjeta[i]);
        }
        if (
          Number(salida[1].idSali_m) ===
          this.mListSalidasTarjeta[i].idSali_mSali_d
        ) {
          datosProcesados[1].push(this.mListSalidasTarjeta[i]);
        }
        if (
          salida[2] !== undefined &&
          Number(salida[2].idSali_m) ===
          this.mListSalidasTarjeta[i].idSali_mSali_d
        ) {
          datosProcesados[2].push(this.mListSalidasTarjeta[i]);
        }
      }

      for (var i = 0; i < datosProcesados[1].length; i++) {
        var arrys = [
          //unidad anterior
          {
            text: datosProcesados[1][i].CodiCtrlSali_d,
            fontSize: 8,
          },
          {
            text:
              datosProcesados[0].length > 0
                ? datosProcesados[0][i].isCtrlRefeSali_d === 1
                  ? "R " + datosProcesados[0][i].HoraProgSali_d.substring(0, 5)
                  : datosProcesados[0][i].HoraProgSali_d.substring(0, 5)
                : " ",
            fontSize: 8,
            alignment:
              datosProcesados[0].length > 0
                ? datosProcesados[0][i].isCtrlRefeSali_d === 1
                  ? "left"
                  : "center"
                : "center",
          },
          {
            text:
              datosProcesados[0].length > 0
                ? datosProcesados[0][i].HoraMarcSali_d == "00:00:00"
                  ? ""
                  : datosProcesados[0][i].FaltSali_d
                : " ",
            fontSize: 8,
            alignment: "center",
          },
          //unidad actual
          {
            text:
              datosProcesados[1][i].isCtrlRefeSali_d === 1
                ? "R " + datosProcesados[1][i].HoraProgSali_d.substring(0, 5)
                : datosProcesados[1][i].HoraProgSali_d.substring(0, 5),
            fontSize: 8,
            alignment:
              datosProcesados[1][i].isCtrlRefeSali_d === 1 ? "left" : "center",
          },
          {
            text:
              datosProcesados[1][i].HoraMarcSali_d == "00:00:00"
                ? ""
                : datosProcesados[1][i].FaltSali_d,
            fontSize: 8,
            alignment: "center",
          },
          //unidad posterior
          {
            text:
              datosProcesados[2].length > 0
                ? datosProcesados[2][i].isCtrlRefeSali_d === 1
                  ? "R " + datosProcesados[2][i].HoraProgSali_d.substring(0, 5)
                  : datosProcesados[2][i].HoraProgSali_d.substring(0, 5)
                : " ",
            fontSize: 8,
            alignment:
              datosProcesados[2].length > 0
                ? datosProcesados[2][i].isCtrlRefeSali_d === 1
                  ? "left"
                  : "center"
                : "center",
          },
          {
            text:
              datosProcesados[2].length > 0
                ? datosProcesados[2][i].HoraMarcSali_d == "00:00:00"
                  ? ""
                  : datosProcesados[2][i].FaltSali_d
                : " ",
            fontSize: 8,
            alignment: "center",
          },
        ];
        resultadoString.push(arrys);
      }

      var docDefinition = {
        // a string or { width: 190, height: number }
        pageSize: { width: 240, height: "auto" },
        pageMargins: [5, 10, 5, 10],
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
            fontSize: 10,
            layout: "noBorders", // optional
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              widths: ["*"],
              body: [
                ["RUTA : " + salida[1].DescRutaSali_m],
                [
                  "CHOFER : " +
                  (salida[1].nombres_chofer == null
                    ? "Sin Chofer"
                    : salida[1].nombres_chofer),
                ],
                ["Fecha Salida : " + salida[1].HoraSaliProgSali_mF],
                /*["F. Impresión : " + this.initFechaActualTicket()]*/
              ],
            },
          },

          { text: ".", color: "#FFFFFF" },
          {
            fontSize: 8.5,
            //layout: "noBorders",
            // optional
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              headerRows: 0,
              widths: [25, 30, 12, 30, 12, 30, 12],
              body: resultadoString,
            },
          },

          { text: ".", color: "#FFFFFF" },
          {
            text:
              "Adelanto ANT (" +
              (salida[0] == undefined ? "" : salida[0].CodiVehiSali_m) +
              ") : " +
              (salida[0] == undefined ? "" : salida[0].adelantoFaltasTime),
            fontSize: 9,
          },
          {
            text:
              "Adelanto ACT (" +
              salida[1].CodiVehiSali_m +
              ") : " +
              salida[1].adelantoFaltasTime,
            fontSize: 9,
          },
          {
            text:
              "Adelanto POS (" +
              (salida[2] == undefined ? "" : salida[2].CodiVehiSali_m) +
              ") : " +
              (salida[2] == undefined ? "" : salida[2].adelantoFaltasTime),
            fontSize: 9,
          },
          {
            text:
              "Atrasos ANT (" +
              (salida[0] == undefined ? "" : salida[0].CodiVehiSali_m) +
              ") : " +
              (salida[0] == undefined ? "" : salida[0].atrasoFaltasTime),
            fontSize: 9,
          },

          {
            text:
              "Atrasos ACT (" +
              salida[1].CodiVehiSali_m +
              ") : " +
              salida[1].atrasoFaltasTime,
            fontSize: 9,
          },

          {
            text:
              "Atrasos POS (" +
              (salida[2] == undefined ? "" : salida[2].CodiVehiSali_m) +
              ") : " +
              (salida[2] == undefined ? "" : salida[2].atrasoFaltasTime),
            fontSize: 9,
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
    },

    async readDetalleSalidaDPanelBusquedaAntActPosVertical(salida) {
      this.baseURlPDFPanelDespachoTarjeta = "";

      console.log("DETALLE SALIDA HORIZONTAL");
      //console.log(salida);
      var datos = await this.$axios.post(
        process.env.baseUrl + "/detalleSalida",
        {
          token: this.token,
          idsalida: [
            salida[0] == undefined
              ? 0
              : salida[0].idSali_m == ""
                ? 0
                : parseInt(salida[0].idSali_m),
            salida[1] == undefined ? 0 : parseInt(salida[1].idSali_m),
            salida[2] == undefined
              ? 0
              : salida[2].idSali_m == ""
                ? 0
                : parseInt(salida[2].idSali_m),
          ],
        }
      );
      console.log("DIVIDIDO");
      this.mListSalidasTarjeta = [];
      this.mListSalidasTarjetaAnterior = [];
      this.mListSalidasTarjetaActual = [];
      this.mListSalidasTarjetaPosterior = [];

      this.mListSalidasTarjeta.push(...datos.data.data);

      console.log(this.mListSalidasTarjeta);
      console.log(salida[1]);
      for (var i = 0; i < this.mListSalidasTarjeta.length; i++) {
        var item = this.mListSalidasTarjeta[i];
        //console.log(item);
        if (salida[0] && typeof salida[0].idSali_m !== 'undefined' && salida[0].idSali_m !== null && Number(item.idSali_mSali_d) === Number(salida[0].idSali_m)) {
          this.mListSalidasTarjetaAnterior.push(item);
        } else if (salida[1] && salida[1].idSali_m && Number(item.idSali_mSali_d) === Number(salida[1].idSali_m)) {
          this.mListSalidasTarjetaActual.push(item);
        } else if (salida[2] && salida[2].idSali_m && Number(item.idSali_mSali_d) === Number(salida[2].idSali_m)) {
          this.mListSalidasTarjetaPosterior.push(item);
        }
      }


      console.log(this.mListSalidasTarjetaAnterior);
      console.log(this.mListSalidasTarjetaActual);
      console.log(this.mListSalidasTarjetaPosterior);


      const bodyTable = (lista) => {
        const resultadoString = [[
          { text: "RELOJ", fontSize: 8.5, bold: true, alignment: "center" },
          { text: "PROG", fontSize: 8.5, bold: true, alignment: "center" },
          { text: "MARC", fontSize: 8.5, bold: true, alignment: "center" },
          { text: "FALT", fontSize: 8.5, bold: true, alignment: "center" },
          { text: "PEN", fontSize: 8.5, bold: true, alignment: "center" },
        ],]

        for (var i = 0; i < lista.length; i++) {
          var arrys = [
            {
              text: lista[i].DescCtrlSali_d.substring(0, 7),
              fontSize: 8.5,
            },
            {
              text: lista[i].HoraProgSali_d,
              fontSize: 8.5,
              alignment: "center",
            },
            {
              text:
                lista[i].HoraMarcSali_d == "00:00:00"
                  ? ""
                  : lista[i].HoraMarcSali_d,
              fontSize: 8.5,
              alignment: "center",
            },
            {
              text:
                lista[i].HoraMarcSali_d != "00:00:00"
                  ? lista[i].FaltSali_d
                  : lista[i].FaltSali_d == "0"
                    ? ""
                    : lista[i].FaltSali_d,
              fontSize: 8.5,
              alignment: "center",
            },
            {
              text:
                lista[i].PenaCtrlSali_d == "0.00"
                  ? ""
                  : lista[i].PenaCtrlSali_d,
              fontSize: 8.5,
              alignment: "center",
            },
          ];
          resultadoString.push(arrys);
        }
        return resultadoString;
      }

      const footerTable = (lista) => {
        var heightAux = 9.7;
        var sumFalt = 0;
        var penFalt = 0;

        for (var i = 0; i < lista.length; i++) {
          heightAux = heightAux + 1;
          if (
            lista[i].FaltSali_d > 0 &&
            lista[i].isCtrlRefeSali_d == 0
          ) {
            sumFalt = sumFalt + lista[i].FaltSali_d;
          }

          if (lista[i].isCtrlRefeSali_d == 0) {
            var pen = parseFloat(lista[i].PenaCtrlSali_d);
            penFalt = penFalt + pen;
          }
        }
        return { sumFalt, penFalt }
      }

      const contentPdf = (listaItems, index) => {
        console.log("Aca lista", listaItems.length)
        if (listaItems.length === 0) {
          return []; // Devuelve un array vacío si la lista está vacía
        }
        const { penFalt, sumFalt } = footerTable(listaItems);
        const datos = bodyTable(listaItems)
        return [
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
              body: [[
                {
                  text: this.$cookies.get("nameEmpresa").substring(0, 30),
                  fontSize: 12,
                  bold: true,
                  alignment: "center",
                },
              ]],
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
              body: [["Unidad", "Salida #" + salida[index].idSali_m, "Ruta", "Vue"]],
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
                  salida[index].CodiVehiSali_m,
                  salida[index].HoraSaliProgSali_mF.substring(0, 10),
                  { text: salida[index].LetraRutaSali_m, bold: true },
                  salida[index].NumeVuelSali_m,
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
              body: [["FREC: " + salida[index].DescFrec.substring(0, 25)]],
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

              body: datos,
            },
          },

          { text: "---------------------------------------------------------" },
          { text: "Chofer: ", fontSize: 8 },
          { text: "Cobrador: ", fontSize: 8 },
          {
            text: "Adelanto: " + salida[index].adelantoFaltasTime,
            fontSize: 8,
            fontSize: 8,
          },
          {
            text: "Atrasos: " + salida[index].atrasoFaltasTime,
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

          {
            text: ".",
            fontSize: 8,
          },
        ]


      }

      var docDefinition = {
        // a string or { width: 190, height: number }
        pageSize: { width: 240, height: 'auto' },
        pageMargins: [15, 15, 15, 15],
        compress: true,
        content: [
          contentPdf(this.mListSalidasTarjetaAnterior, 0),
          contentPdf(this.mListSalidasTarjetaActual, 1),
          contentPdf(this.mListSalidasTarjetaPosterior, 2)
        ],
      };

      var pdfDocGenerator = pdfMake.createPdf(docDefinition);

      pdfDocGenerator.getDataUrl((dataUrl) => {
        this.baseURlPDFPanelDespachoTarjeta = dataUrl;
      });
      this.baseURlPDFPanelDespachoTarjeta = await pdfDoc.saveAsBase64({
        dataUri: true,
      });

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
