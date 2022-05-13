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
              <div class="card-body">
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
    let sub_empresa = params.subempresa;
    var descripcion = null;
    var empresa_name = null;
    try {
      var datos = await axios_.post(
        process.env.baseUrl + empresa + "/" + sub_empresa + "/info"
      );
      //console.log(datos.data.data.descripcion)
      if (datos.data.data.activo == 1) {
        descripcion = datos.data.data.descripcion;
        empresa_name = descripcion;
      } else {
        descripcion = "EMPRESA DESACTIVADA MOMENTANEAMENTE";
        empresa_name = descripcion;
        empresa = null;
        sub_empresa = null;
      }
    } catch (error) {
      empresa_name = error.toString();
    }
    return { empresa, sub_empresa, empresa_name };
  },
  head() {
    return {
      title: this.sub_empresa + " | Smart7Bus.com",
    };
  },
  data() {
    return {
      user: "",
      pass: "",
      app: this,
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
    async OnLogin() {
      if (this.model.email != "" && this.model.password != "") {
        var api =
          process.env.baseUrl +
          this.empresa +
          "/" +
          this.sub_empresa +
          "/login";

        var status = await axios_.post(api, {
          user: this.model.email,
          password: this.model.password,
        });
        var obj = status.data;
        if (obj.status_code == 200) {
          Swal.fire({
            title: "Gestión Inteligente de Transporte Urbano",
            text: "Bienvenido " + this.model.email,
            icon: "success",
            allowOutsideClick: false,
            confirmButtonText: "Aceptar",
          }).then((result) => {
            if (result.isConfirmed) 
            {
              this.$cookies.set("token",obj.data)
              this.$router.push("/monitoreo");
              
            }
          });
        } else if (obj.status_code == 300) {
          Swal.fire({
            title: "Aviso",
            text: obj.msg,
            icon: "warning",
            confirmButtonText: "Intenter nuevamente",
          });
        } else if (obj.status_code == 400) {
          Swal.fire({
            title: "Error 400!",
            text: obj.msg,
            icon: "error",
            confirmButtonText: "Aceptar",
          });
        } else {
          Swal.fire({
            title: obj.status_code,
            text: obj.msg,
            icon: "error",
            confirmButtonText: "Aceptar",
          });
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
      this.sub_empresa_texto = this.empresa_name.substring(0, 18);
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