<template>
  <div>
    <!-- Header -->
    <div class="header bg-gradient-success py-7 py-lg-8 pt-lg-9">
      <div class="container">
        <div class="header-body text-center mb-7"></div>
      </div>
      <div class="separator separator-bottom separator-skew zindex-100">
        <svg
          x="0"
          y="0"
          viewBox="0 0 2560 100"
          preserveAspectRatio="none"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon
            class="fill-default"
            points="2560 0 2560 100 0 100"
          ></polygon>
        </svg>
      </div>
    </div>
    <!-- Page content -->
    <div class="container mt--16 pb-5">
      <div class="row justify-content-center">
        <div class="col-lg-5 col-md-7">
          <div class="card bg-secondary border-0 mb-0">
            <div class="card-header bg-transparent">
              <div class="text-muted text-center">
                <small
                  ><img src="/img/brand/vigitrackv2.png" class="logo-login"
                /></small>
              </div>
            </div>
            <div class="card-body">
              <div style="margin-bottom: 0.5rem;">
                <div class="text-center">
                  <strong>{{ sub_empresa_texto }}</strong>
                </div>
              </div>
              <validation-observer
                v-slot="{ handleSubmit }"
                ref="formValidator"
              >
                <form role="form" @submit.prevent="handleSubmit(OnLogin)">
                  <base-input
                    alternative
                    class="mb-3"
                    name="User"
                    type="text"
                    :rules="{ required: true, email: false }"
                    prepend-icon="ni ni-single-02"
                    placeholder="Usuario"
                    v-model="model.email"
                  >
                  </base-input>

                  <base-input
                    alternative
                    class="mb-3"
                    name="Password"
                    
                    :rules="{ required: true, min: 4 }"
                    prepend-icon="ni ni-lock-circle-open"
                    type="password"
                    placeholder="Contraseña"
                    v-model="model.password"
                  >
                  </base-input>

                  <base-checkbox v-model="model.rememberMe"
                    >Acuérdate de mí</base-checkbox
                  >
                  <div class="text-center">
                    <base-button
                      type="primary"
                      native-type="submit"
                      class="my-4"
                      >Ingresar al sistema</base-button
                    >
                  </div>
                </form>
              </validation-observer>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
.mt--16 {
  margin-top: -16rem !important;
}

.logo-login {
  height: 4rem !important;
  width: 12rem !important;
}
</style>
<script>
import axios_ from "axios";
import Swal from "sweetalert2";

export default {
  layout: "AuthLayout",
  async asyncData({ params }) {
    let empresa = params.empresa;
    var empresa_name = null;
    let logo_empresa = ""
    let oPermisosWebProduccionJSON = null
    try {
      var datos = await axios_.post(
        process.env.baseUrl +"/" + empresa + "/infoEmpresa"
      );
      
      console.log(datos.data.data)
      oPermisosWebProduccionJSON = datos.data.data.web.produccion
      empresa_name = datos.data.data.name;
      logo_empresa = datos.data.data.logo;

    } catch (error) {
      console.log(error)
      empresa_name = error.toString();
    }
    return { empresa, empresa_name,logo_empresa,oPermisosWebProduccionJSON};
  },
  head() {
    return {
      title: this.empresa + " | Smart7Bus.com",
    };
  },
  data() {
    return {
      user: "",
      pass: "",
      app: this,
      oPermisosWebProduccionJSON:null,
      sub_empresa_texto: this.empresa_name,
      context: this,
      model: {
        email: "",
        password: "",
        rememberMe: false,
      },
    };
  },
  methods: {
    async OnLogin() 
    {
      
      if (this.model.email != "" && this.model.password != "") {

        var api =
          process.env.baseUrl+"/" +this.empresa +"/loginEmpresa";
          try{
            var datos = await axios_.post(api, {
          user: this.model.email,
          password: this.model.password,
        });

        var obj = datos.data

        if (obj.token != "S/N" && obj.names != "S/N") 
        {
          Swal.fire({
            title: "Gestión Inteligente de Transporte Urbano",
            text: "Bienvenido " + obj.names,
            icon: "success",
            allowOutsideClick: false,
            confirmButtonText: "Aceptar",
          }).then((result) => {
            if (result.isConfirmed) 
            {
              this.$cookies.set("empresa",this.empresa)
              this.$cookies.set("nameEmpresa",this.sub_empresa_texto)
              this.$cookies.set("token",obj.token)
              this.$cookies.set("permisos",obj.permisos)
              this.$cookies.set("namesUsuario",obj.names)
              this.$cookies.set("logo",this.logo_empresa)
              this.$cookies.set("WebProduccion",this.oPermisosWebProduccionJSON)
              this.$router.push("/monitoreo");
              
            }
          });
        } else {
          Swal.fire({
            title: "Gestión Inteligente de Transporte Urbano",
            text: "Credenciales no válidas",
            icon: "error",
            confirmButtonText: "Aceptar",
          });
        }
          }catch(e){
            console.log(e)
          }
      } else {
        alert("DATOS VACIOS");
      }
    },
    async ReadInfoNameCompany() {
      var datos = await axios_.post(
        process.env.baseUrl + this.empresa_container + "/info"
      );
      console.log(datos);
      for (var i = 0; i < datos.data.data.length; i++) {
        this.empresas.push(datos.data.data[i]);
      }
    },
  },
  mounted() {
    //console.log(this.empresa_container)
    if (this.sub_empresa_texto != "Sin Empresa") {
      this.sub_empresa_texto = this.empresa_name;
    }
    /*window.addEventListener("keypress", function(e){

         if(e.keyCode == 13 || e.key == "Enter")
         {
             this.app.OnLogin()
         }
     });*/
  },
};
</script>