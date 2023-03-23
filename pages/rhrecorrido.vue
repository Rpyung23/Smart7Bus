<template slot-scope="scope">
  <div>
    <base-header>
      <div class="align-items-center py-3">
        <card class="no-border-card col" style="margin-bottom: 0.5rem"
          body-classes="px-0 pb-1 card-bodyTopOpcionesRPagosVehiculoPRoduccion cardSelectRubrosEstadosPagosVehiculoProduccionContainer"
          footer-classes="pb-2">
          <div class="cardTextoRPagosVehiculoProduccion">
            <el-select style="margin-right: 0.5rem" v-model="unidadselectrhrrecorrido" multiple filterable remote
              reserve-keyword placeholder="Ingrese una unidad" :remote-method="remoteMethodUnidadesSalidasPanelBusqueda"
              :loading="loadingTableUnidadesSalidasPanelBusquedaloading">
              <el-option v-for="item in   optionsUnidadesSalidasPanelBusqueda" :key="item.CodiVehi" :label="item.CodiVehi"
                :value="item.CodiVehi">
              </el-option>
            </el-select>
          </div>

          <div class="cardSelectRubrosEstadosPagosVehiculoProduccionContainer" size="sm">
            <div class="buttonsAdicionalesRContadorVuelta">
              <base-button icon type="primary" size="sm" @click="">
                <span class="btn-inner--icon"><i class="el-icon-search"></i></span>
              </base-button>


            </div>
          </div>
        </card>

        <card class="no-border-card col" style="margin-bottom: 0.5rem"
          body-classes="px-0 pb-1 card-bodyTopOpcionesRPagosVehiculoPRoduccion cardSelectRubrosEstadosPagosVehiculoProduccionContainer"
          footer-classes="pb-2">
          <div class="cardTextoRPagosVehiculoProduccion">
            <el-date-picker v-model="datepickerrhrrecorrido" type="datetimerange" range-separator="Hasta"
              start-placeholder="Fecha Inicial" end-placeholder="Fecha Final">
            </el-date-picker>
          </div>

          <div class="cardTextoRPagosVehiculoProduccion">
            <base-button size="sm" title="PDF" @click="generatePdf()" type="primary"><i
                class="ni ni-single-copy-04"></i></base-button>
          </div>
        </card>
        <card id="cardContenedorPdf" class="no-border-card col"
          style="width: 100%; height: calc(100vh - 13rem); padding: 0%;">
          <embed id="idIframe" src="about:blank" type="application/pdf" width="100%" height="100%" />
        </card>

      </div>
    </base-header>

  </div>
</template>
<script>

import {
  Select,
  Option,
  DatePicker
} from "element-ui";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export default {
  layout: "DashboardLayout",
  components: {
    [Select.name]: Select,
    [Option.name]: Option,
    [DatePicker.name]: DatePicker

  },
  data() {
    return {
      token: this.$cookies.get("token"),
      options: [],
      unidadselectrhrrecorrido: [],
      listunidadesrhrrecorrido: [],
      loadingTableUnidadesSalidasPanelBusquedaloading: false,
      optionsUnidadesSalidasPanelBusqueda: [],
      datepickerrhrrecorrido: "",
    };
  },
  methods: {

    async readAllConductores() {
      var datos = await this.$axios.post(process.env.baseUrl + "/unidades", {
        token: this.token,
        tipo: 3,
      });
      if (datos.data.status_code == 200) {
        this.listunidadesrhrrecorrido.push(...datos.data.data);
        //return console.log(datos.data.data);
      }
    },

    remoteMethodUnidadesSalidasPanelBusqueda(query) {
      if (query !== "") {
        this.loadingTableUnidadesSalidasPanelBusquedaloading = true;
        setTimeout(() => {
          this.loadingTableUnidadesSalidasPanelBusquedaloading = false;
          this.optionsUnidadesSalidasPanelBusqueda =
            this.listunidadesrhrrecorrido.filter((item) => {
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
      var dd = {
        content: [{
          text: 'Mi primer pdf',
        }
        ]
      }
      this.pdfObject = pdfMake.createPdf(dd);
      this.pdfObject.getDataUrl((dataUrl) => {
        const iframe = document.querySelector('#idIframe');
        iframe.src = dataUrl;
      });
    }
  },
  mounted() {
    this.readAllConductores();
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