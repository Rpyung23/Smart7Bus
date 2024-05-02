<template>
  <card type="secondary" header-classes="bg-transparent pb-5" class="border-0 mb-0">
    <iframe :src="baseURlPDFPanelDespachoTarjeta" style="width: 100%; height: 30rem"></iframe>
  </card>
</template>

<style></style>

<script>
import { Table, TableColumn } from "element-ui";

import pdfMake from "pdfmake/build/pdfmake.js";
import pdfFonts from "pdfmake/build/vfs_fonts.js";

import { getBase64LogoReportes } from "../../util/logoReport";
import { map } from "jquery";

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

    async readDetalleSalidaDPanelBusquedaControles(salida, controles) {
      this.baseURlPDFPanelDespachoTarjeta = "";
      console.log("iniciooooo");
      //console.log(salida);

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
      if (controles.length > 0) {
        const datosfiltrados = datos.data.data.filter((elemento) => {
          return controles.includes(elemento.CodiCtrlSali_d)
        })
        this.mListSalidasTarjeta = [];
        this.mListSalidasTarjeta.push(...datosfiltrados);
      } else {
        this.mListSalidasTarjeta = [];
        this.mListSalidasTarjeta.push(...datos.data.data);
        //console.log("Aca los datos de api ", this.mListSalidasTarjeta)

      }



      //transformar salida a Map
      const auxSalida = new Map();
      salida.forEach((elemento) => {
        if (!auxSalida.has(elemento.idSali_m)) {
          auxSalida.set(elemento.idSali_m, elemento)
        }
      })
      //console.log("Aca agrupado Salida ", auxSalida)


      //arreglar datos (procesar datos)
      const auxListaSalida = new Map();
      this.mListSalidasTarjeta.forEach((elemento) => {
        if (auxListaSalida.has(elemento.idSali_mSali_d)) {
          const aux = auxListaSalida.get(elemento.idSali_mSali_d)
          aux.push(elemento)
          auxListaSalida.set(elemento.idSali_mSali_d, aux)
        } else {
          const aux = []
          aux.push(elemento)
          auxListaSalida.set(elemento.idSali_mSali_d, aux)
        }
      })
      //console.log("Aca mapa ", auxListaSalida)
      const arrayFormato = Array.from(auxListaSalida.values());
      //console.log("Aca array formateado ********");
      //console.log(arrayFormato);



      var empresa = [
        {
          text: this.$cookies.get("nameEmpresa").substring(0, 30),
          fontSize: 12,
          bold: true,
          alignment: "center",
        },
      ];

      const tablaContenido = (elementos) => {
        const aux = []
        aux.push([
          { text: "RELOJ", fontSize: 8.5, bold: true, alignment: "center" },
          { text: "PROG", fontSize: 8.5, bold: true, alignment: "center" },
          { text: "MARC", fontSize: 8.5, bold: true, alignment: "center" },
          { text: "FALT", fontSize: 8.5, bold: true, alignment: "center" },
          { text: "PEN", fontSize: 8.5, bold: true, alignment: "center" },
        ])

        for (var i = 0; i < elementos.length; i++) {
          var arrys = [
            {
              text: elementos[i].DescCtrlSali_d.substring(0, 7),
              fontSize: 8.5,
            },
            {
              text: elementos[i].HoraProgSali_d,
              fontSize: 8.5,
              alignment: "center",
            },
            {
              text:
                elementos[i].HoraMarcSali_d == "00:00:00"
                  ? ""
                  : elementos[i].HoraMarcSali_d,
              fontSize: 8.5,
              alignment: "center",
            },
            {
              text:
                elementos[i].HoraMarcSali_d != "00:00:00"
                  ? elementos[i].FaltSali_d
                  : elementos[i].FaltSali_d == "0"
                    ? ""
                    : elementos[i].FaltSali_d,
              fontSize: 8.5,
              alignment: "center",
            },
            {
              text:
                elementos[i].PenaCtrlSali_d == "0.00"
                  ? ""
                  : elementos[i].PenaCtrlSali_d,
              fontSize: 8.5,
              alignment: "center",
            },
          ];
          aux.push(arrys);
        }

        return aux;

      }

      const totales = (elementos) => {
        let heightAux = 9.7;
        let sumFalt = 0;
        let penFalt = 0;
        for (let i = 0; i < elementos.length; i++) {
          heightAux = heightAux + 1;
          if (
            elementos[i].FaltSali_d > 0 &&
            elementos[i].isCtrlRefeSali_d == 0
          ) {
            sumFalt = sumFalt + elementos[i].FaltSali_d;
          }

          if (elementos[i].isCtrlRefeSali_d == 0) {
            const pen = parseFloat(elementos[i].PenaCtrlSali_d);
            penFalt = penFalt + pen;
          }
        }
        return { sumFalt, penFalt }
      }

      const crearTicket = (lista) => {
        const contenido = []
        //console.log("aca elemento ticket", lista.length)
        lista.forEach((elemento, index) => {
          //Logo de la empresa 
          /*  const logoEmpresa =
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
               : {};
           contenido.push(logoEmpresa) */
          //nombre d ela empresa
          const nombreEmpresa = {
            text: this.$cookies.get("nameEmpresa").substring(0, 30),
            fontSize: 12,
            bold: true,
            alignment: "center",
          };
          contenido.push(nombreEmpresa)
          //titulo del encabezado 
          const tituloEncabezado =
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
              body: [["Unidad", "Salida #" + elemento[0].idSali_mSali_d, "Ruta", "Vue"]],
            },
          };
          contenido.push(tituloEncabezado)
          //valores del encabezado
          const informacionSalida = auxSalida.get(elemento[0].idSali_mSali_d);
          const valoresEncabezado =
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

                  informacionSalida?.CodiVehiSali_m || "NULL",//HoraSaliProgSali_m
                  informacionSalida?.HoraSaliProgSali_m?.substring(0, 10) || "NULL",
                  { text: elemento[0].LetraRutaSali_m, bold: true },
                  informacionSalida?.NumeVuelSali_m || "NULL",
                ],
              ],
            },
          };
          contenido.push(valoresEncabezado)
          //frecuencia
          const frecuencia = {
            fontSize: 10,
            layout: "noBorders", // optional
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              widths: ["*"],
              body: [["FREC: " + informacionSalida?.DescFrec?.substring(0, 25) || "NULL"]],
            },
          };
          contenido.push(frecuencia)
          //separador
          const separador = { text: "---------------------------------------------------------" };
          contenido.push(separador)
          //titulo de la tabla completa dle  resutado
          const tabla =
          {
            fontSize: 8.5,
            layout: "noBorders",
            // optional
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              headerRows: 0,
              widths: [45, 33, 33, 19, 17],

              body: tablaContenido(elemento),
            },

          };
          contenido.push(tabla)
          //seprador 2
          const separador2 = { text: "---------------------------------------------------------" };
          contenido.push(separador2)
          //footer
          contenido.push({ text: "Chofer: ", fontSize: 8 })
          contenido.push({ text: "Cobrador: ", fontSize: 8 })
          contenido.push({
            text: "Adelanto: " + informacionSalida?.adelantoFaltasTime || "Null",
            fontSize: 8,
          })
          contenido.push({
            text: "Atrasos: " + informacionSalida?.atrasoFaltasTime || "Null",
            fontSize: 8,
          })
          //footer totales 
          const { penFalt, sumFalt } = totales(elemento)
          const footerT = {
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
          };
          contenido.push(footerT)
          //salto de hoja del ticket
          if (index < lista.length - 1) {
            // Agregar el salto de página solo si no es el último elemento
            const saltoDePagina = { text: '\n\n'/*, pageBreak: 'after'*/ };
            contenido.push(saltoDePagina);
          }

        })
        console.log("leng", contenido.length)
        return contenido
      }

      var docDefinition = {
        // a string or { width: 190, height: number }
        pageSize: { width: 225, height: 400 },
        pageMargins: [14, 14, 14, 14],
        //compress: false,
        //header: [empresa],


        content: crearTicket(arrayFormato)
      };

      var pdfDocGenerator = pdfMake.createPdf(docDefinition);
      pdfDocGenerator.getDataUrl((dataUrl) => {
        this.baseURlPDFPanelDespachoTarjeta = dataUrl;
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
