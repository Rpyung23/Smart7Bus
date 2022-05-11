<template>
  <div>
    <!-- Header -->
    <div class="header bg-gradient-success py-7 py-lg-8 pt-lg-9">
      <div class="container">
        <div class="header-body text-center mb-7">
        </div>
      </div>
      <div class="separator separator-bottom separator-skew zindex-100">
        <svg x="0" y="0" viewBox="0 0 2560 100" preserveAspectRatio="none" version="1.1"
             xmlns="http://www.w3.org/2000/svg">
          <polygon class="fill-default" points="2560 0 2560 100 0 100"></polygon>
        </svg>
      </div>
    </div>
    <!-- Page content -->
    <div class="container mt--16 pb-5">
      <div class="row justify-content-center">
        <div class="col-lg-5 col-md-7">
          <div class="card bg-secondary border-0 mb-0">
            <div class="card-header bg-transparent">
              <div class="text-muted text-center"><small><img src="/img/brand/vigitrackv2.png" class="logo-login"></small></div>
            </div>
            <div class="card-body px-lg-5 py-lg-5">
              <validation-observer v-slot="{handleSubmit}" ref="formValidator">
                <form role="form" @submit.prevent="handleSubmit(onSubmit)">
                  <base-input alternative
                              class="mb-3"
                              name="User"
                              type="text"
                              :rules="{required: true, email: false}"
                              prepend-icon="ni ni-single-02"
                              placeholder="Usuario"
                              v-model="model.email">
                  </base-input>

                  <base-input alternative
                              class="mb-3"
                              name="Password"
                              :rules="{required: true, min: 4}"
                              prepend-icon="ni ni-lock-circle-open"
                              type="password"
                              placeholder="Contraseña"
                              v-model="model.password">
                  </base-input>

                  <base-checkbox v-model="model.rememberMe">Acuérdate de mí</base-checkbox>
                  <div class="text-center">
                    <base-button type="primary" native-type="submit" class="my-4">Ingresar al sistema</base-button>
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
.mt--16
{
  margin-top: -16rem !important;
}

.logo-login{
  height: 4rem !important;
  width: 12rem !important;
}
</style>
<script>
  export default {
    layout: 'AuthLayout',
    data() {
      return {
        model: {
          email: '',
          password: '',
          rememberMe: false
        }
      };
    },
    methods: {
      onSubmit() {
        // this will be called only after form is valid. You can do api call here to login
        location.href = "./rastreo"
      }
    }
  };
</script>
