<template>
  <div>
    <!--Header-->
    <div class="header bg-success pt-5C pb-7C">
      <div class="container">
        <div class="header-body">
          <div class="row align-items-center">
            <div class="col-lg-6">
              <div class="pr-5">
                <a href="https://vigitrackecuador.com/" target="_blank"><h1 class="display-3 text-white font-weight-bold mb-0">VIGITRACKLATAM CIA.LTDA</h1></a>
                
                <p class="text-white mt-4 textoJust">VIGITRACKLATAM se ha caracterizado por investigar y desarrollar nuestros propios productos tecnológicos hemos diseñado y fabricado nuestro propio Hardware (GPS URBANO SMART7BUS) esto ha permitido ofrecer tecnología de calidad a nuestros clientes y proyectarnos en todo el territorio ecuatoriano satisfaciendo las necesidades de nuestros clientes, en el presente ser una de las mejores empresas en innovación.</p>
                <div class="mt-5">
                  <div class="row">
                      <div class="col-md-6">
                        <base-input placeholder="Código Empresa"></base-input>
                      </div>
                      <div class="col-md-6">
                        <base-button type="default">Redireccionar</base-button>
                      </div>
                      
                  </div>
                  
                </div>
              </div>
            </div>
            <div class="col-lg-6">
              <div class="row">
                <div class="col-md-6">
                  <div class="card">
                    <div class="card-body">
                      <div class="icon icon-shape bg-gradient-red text-white rounded-circle shadow mb-4">
                        <i class="ni ni-tv-2"></i>
                      </div>
                      <h5 class="h3">SAE</h5>
                      <p>Sietema de ayuda y explotación..</p>
                    </div>
                  </div>
                  <div class="card">
                    <div class="card-body">
                      <div class="icon icon-shape bg-gradient-info text-white rounded-circle shadow mb-4">
                        <i class="ni ni-mobile-button"></i>
                      </div>
                      <h5 class="h3">SIU EC</h5>
                      <p>Sistema de información al usuario.</p>
                    </div>
                  </div>
                </div>
                <div class="col-md-6 pt-lg-5 pt-4">
                  <div class="card mb-4">
                    <div class="card-body">
                      <div class="icon icon-shape bg-gradient-success text-white rounded-circle shadow mb-4">
                        <i class="ni ni-tablet-button"></i>
                      </div>
                      <h5 class="h3">SIR</h5>
                      <p>Sistema integrado de recaudo.</p>
                    </div>
                  </div>
                  <div class="card mb-4">
                    <div class="card-body">
                      <div class="icon icon-shape bg-gradient-warning text-white rounded-circle shadow mb-4">
                        <i class="ni ni-single-02"></i>
                      </div>
                      <h5 class="h3">RECAUDO</h5>
                      <p>Contador de pasajeros con tecnología 3D.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="separator separator-bottom separator-skew zindex-100">
        <svg x="0" y="0" viewBox="0 0 2560 100" preserveAspectRatio="none" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <polygon class="fill-default" points="2560 0 2560 100 0 100"></polygon>
        </svg>
      </div>
    </div>
  </div>
</template>
<script>
  import { Tooltip } from 'element-ui'
  export default {
    layout: 'AuthLayout',
    name: 'home-page',
    components: {
      [Tooltip.name]: Tooltip
    }
  };
</script>

<style>



.textoJust{
  text-align: justify;
}

.pb-7C {
    padding-bottom: 4rem !important;
}

.pt-5C {
    padding-top: 3rem !important;
}

body{
  overflow: hidden;
}

</style>
