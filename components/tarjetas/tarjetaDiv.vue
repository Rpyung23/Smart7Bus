<template>
  <iframe :src="baseURlPDFPanelDespachoTarjeta" style="width: 100%; height: 100%"></iframe>
</template>

<style></style>

<script>
import { Table, TableColumn } from "element-ui";

import pdfMake from "pdfmake/build/pdfmake.js";
import pdfFonts from "pdfmake/build/vfs_fonts.js";

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
      console.log("iniciooooo ");
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
        console.log("Aca los datos de api ", this.mListSalidasTarjeta)
      }



      //transformar salida a Map
      const auxSalida = new Map();
      salida.forEach((elemento) => {
        if (!auxSalida.has(elemento.idSali_m)) {
          auxSalida.set(elemento.idSali_m, elemento)
          //console.log(elemento)
        }
      })
      //console.log("Aca agrupado Salida ", auxSalida)


      //arreglar datos (procesar datos)
      const auxListaSalida = new Map();
      this.mListSalidasTarjeta.forEach((elemento) => {
        if (auxListaSalida.has(elemento.idSali_mSali_d)) {
          //CodiVehiSali_m
          const codivehiculo = auxSalida.get(elemento.idSali_mSali_d)?.CodiVehiSali_m || "0"
          const aux = auxListaSalida.get(elemento.idSali_mSali_d)
          //console.log("Aca AUX",aux)
          aux.lista.push(elemento)
          auxListaSalida.set(elemento.idSali_mSali_d, { lista: aux.lista, codivehiculo })
        } else {
          const codivehiculo = auxSalida.get(elemento.idSali_mSali_d)?.CodiVehiSali_m || "0"
          const aux = []
          aux.push(elemento)
          auxListaSalida.set(elemento.idSali_mSali_d, { lista: aux, codivehiculo })
        }
      })
      //console.log("Aca mapa ", auxListaSalida)
      //console.log("Aca array formateado ********");
      const arrayFormato = Array.from(auxListaSalida.values());
      //console.log("Hoaaa", arrayFormato);


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

      const sumTimes = (time1, time2) => {
        // Función para convertir "HH:MM:SS" a segundos
        const timeToSeconds = (time) => {
          const [hours, minutes, seconds] = time.split(':').map(Number);
          return (hours * 3600) + (minutes * 60) + seconds;
        }

        // Función para convertir segundos a "HH:MM:SS"
        const secondsToTime = (seconds) => {
          const hours = Math.floor(seconds / 3600);
          seconds %= 3600;
          const minutes = Math.floor(seconds / 60);
          seconds %= 60;
          return [
            hours.toString().padStart(2, '0'),
            minutes.toString().padStart(2, '0'),
            seconds.toString().padStart(2, '0')
          ].join(':');
        }

        // Convertir ambos tiempos a segundos
        const totalSeconds = timeToSeconds(time1) + timeToSeconds(time2);

        // Convertir el total de segundos a "HH:MM:SS"
        return secondsToTime(totalSeconds);
      }

      function convertMinutesToTime(minutes) {
        const absMinutes = Math.abs(minutes);
        const hours = Math.floor(absMinutes / 60);
        const mins = absMinutes % 60;
        const timeString = [
          hours.toString().padStart(2, '0'),
          mins.toString().padStart(2, '0'),
          '00'
        ].join(':');
        return (minutes < 0 ? '-' : '') + timeString;
      }


      const totalesFalta = (elementos) => {
        let heightAux = 9.7;
        let sumaAtrasos = '00:00:00';
        let sumaAdelantos = '00:00:00';

        for (let i = 0; i < elementos.length; i++) {
          heightAux += 1;

          if (elementos[i].FaltSali_d > 0 && elementos[i].isCtrlRefeSali_d === 0) {
            const atrasoTime = convertMinutesToTime(elementos[i].FaltSali_d);
            sumaAtrasos = sumTimes(sumaAtrasos, atrasoTime);
          }

          if (elementos[i].FaltSali_d < 0 && elementos[i].isCtrlRefeSali_d === 0) {
            const adelantoTime = convertMinutesToTime(elementos[i].FaltSali_d);
            sumaAdelantos = sumTimes(sumaAdelantos, adelantoTime);
          }
        }

        return { sumaAtrasos, sumaAdelantos };
      };


      const crearTicket = (lista) => {
        const contenido = []
        //console.log("aca elemento ticket", lista.length)
        var totalAdelantos = '00:00:00';
        var totalAtrasos = '00:00:00';
        var totalFaltas = 0;
        var totalDinero = 0;
        var add = 0;
        lista.forEach((elemento, index) => {
          var totalAdelantosT = '00:00:00';
          var totalAtrasosT = '00:00:00';


          const nombreEmpresa = {
            text: this.$cookies.get("nameEmpresa").substring(0, 30),
            fontSize: 12,
            bold: true,
            alignment: "center",
          };
          contenido.push(nombreEmpresa)

          const tituloEncabezado =
          {
            bold: true,
            fontSize: 9,
            alignment: "center",
            layout: "noBorders", // optional
            table: {

              headerRows: 0,
              widths: [35, 75, 25, 22],
              body: [["Unidad", "Salida #" + elemento[0].idSali_mSali_d, "Ruta", "Vue"]],
            },
          };
          contenido.push(tituloEncabezado)

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

          const { sumaAtrasos, sumaAdelantos } = totalesFalta(elemento);
          contenido.push({
            text: "Adelanto: " + sumaAdelantos,
            fontSize: 8,
          });
          contenido.push({
            text: "Atrasos: " + sumaAtrasos,
            fontSize: 8,
          });
          totalAdelantos = sumTimes(totalAdelantos, sumaAdelantos || '00:00:00');
          totalAtrasos = sumTimes(totalAtrasos, sumaAtrasos || '00:00:00');
          //footer totales 
          const { penFalt, sumFalt } = totales(elemento)
          totalFaltas = totalFaltas + Number(sumFalt || 0);
          totalDinero = totalDinero + Number(penFalt || 0);
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
                [{ text: '.', bold: false, fontSize: 10 }]
              ],
            },
          };
          contenido.push(footerT)


        })

        //console.log("leng", contenido.length)
        contenido.push({
          text: "\n",
          fontSize: 8,
        })
        contenido.push({
          text: "SUMATORIA TOTAL",
          fontSize: 16,
          alignment: 'center',
          bold: true
        })
        contenido.push({
          text: "Total Adelantos: " + totalAdelantos,
          fontSize: 8,
        })
        contenido.push({
          text: "Total Atrasos: " + totalAtrasos,
          fontSize: 8,
        })
        contenido.push({
          text: "Total Faltas: " + totalFaltas,
          fontSize: 8,
        })
        contenido.push({
          text: "Total Dinero: " + totalDinero,
          fontSize: 8,
        })
        return contenido
      }

      var docDefinition = {
        // 2245 -> alto 800mm
        pageSize: { width: 225, height: 2245 },
        pageMargins: [14, 14, 14, 14],
        //compress: false,
        //header: [empresa],


        content: crearTicket(arrayFormato.sort((a, b) => (Number(a.codivehiculo) - Number(b.codivehiculo))).map((ticket) => (ticket.lista)))
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
