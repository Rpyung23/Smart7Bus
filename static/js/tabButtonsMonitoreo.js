function deleteItemSelected()
{
    $('div').removeClass('itemOptionMonitoreoActive')
}


var itemMonitoreo = document.getElementById("itemMonitoreo")
var itemControles = document.getElementById("itemControles")
var itemRutas = document.getElementById("itemRutas")
var itemConfig = document.getElementById("itemConfig")

itemMonitoreo.addEventListener('click',function(){
    deleteItemSelected()
    $('#itemMonitoreo').addClass("itemOptionMonitoreoActive")
})

itemControles.addEventListener('click',function(){
    deleteItemSelected()
    $('#itemControles').addClass("itemOptionMonitoreoActive")
})

itemRutas.addEventListener('click',function(){
    deleteItemSelected()
    $('#itemRutas').addClass("itemOptionMonitoreoActive")
})

itemConfig.addEventListener('click',function(){
    deleteItemSelected()
    $('#itemConfig').addClass("itemOptionMonitoreoActive")
})
