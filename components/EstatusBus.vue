<template>
  <div class="row itembus container-estadobus">

    <div class="container-left">
      <img src="img/monitoreo/online.png" />
      <b-form-checkbox :v-model="bus.CodiVehiMoni" :checked="true" style="margin-top: 10px;"></b-form-checkbox>
    </div>

    <div class="container-middle">
           <strong>Unidad : </strong>{{ bus.CodiVehiMoni }} ({{ bus.PlacVehiMoni }})<br>
           <strong>Ruta : </strong>{{bus.DescRuta}}<br>
           <strong>Fecha : </strong>{{bus.UltiFechMoni}}<br>
           <strong>Ubicación: </strong>{{bus.UltiLatiMoni}} , {{bus.UltiLongMoni}}
    </div>
    
    <div class="container-right">
      <img src='img/monitoreo/online.png' class="img-estado-buses" />
      {{bus.enginestatus.text}}
    </div>


  </div>
</template>

<script>




export default {
  props: ['bus'],
  methods:{
    data: function()
    {
    }
  },methods(){

  }
};
</script>
<style>

.img-estado-buses{
  width:30px;
  height:30px;
}
.container-icono-bus{
  text-align: center;
}
.itembus{
  padding: 5px;
  font-size: 12px;
  border-bottom: solid 1px;
  /*margin-bottom: 10px;*/
}
.itembus:hover{
  background-color: #d6d6d6;
}
.engine{
  padding: 0px;
  font-size: 10px;
  overflow: hidden;
}


.container-estadobus
{

  display: flex;
  align-items: center;
  justify-items: center;
  flex-basis: 1;
}
.container-left{
  flex-basis: calc(15%);
  text-align: center;
}

.container-middle{
  padding-left: 0px;
  padding-right: 0px;
  flex-basis: calc(65%);
}

.container-right{
  flex-basis: calc(20%);
}
</style>
