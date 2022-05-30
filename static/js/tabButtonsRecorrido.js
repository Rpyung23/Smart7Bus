function deleteItemSelected()
{
    $('div').removeClass('itemOptionRecorridoActive')
}

function closeAllPanel()
{
    $("#PanelFRutaRecorrido").css("display","none")
    $("#PanelExVelocidad").css("display","none")
    $("#PanelControlesRecorrido").css("display","none")
}

function showPanel(idPanel)
{
    $(idPanel).css("display","flex")
}

var itemSearchRecorrido = document.getElementById("itemSearchRecorrido")
var itemControlesRecorrido = document.getElementById("itemControlesRecorrido")
var itemExVelocidadRecorrido = document.getElementById("itemExVelocidadRecorrido")
var itemFueraRutaRecorrido = document.getElementById("itemFueraRutaRecorrido")

itemSearchRecorrido.addEventListener('click',function()
{
    deleteItemSelected()
    $('#itemSearchRecorrido').addClass("itemOptionRecorridoActive")
    closeAllPanel()
})

itemControlesRecorrido.addEventListener('click',function(){
    deleteItemSelected()
    $('#itemControlesRecorrido').addClass("itemOptionRecorridoActive")
    closeAllPanel()
    showPanel("#PanelControlesRecorrido")
})

itemExVelocidadRecorrido.addEventListener('click',function(){
    deleteItemSelected()
    $('#itemExVelocidadRecorrido').addClass("itemOptionRecorridoActive")
    closeAllPanel()
    showPanel("#PanelExVelocidad")
})

itemFueraRutaRecorrido.addEventListener('click',function(){
    deleteItemSelected()
    $('#itemFueraRutaRecorrido').addClass("itemOptionRecorridoActive")
    closeAllPanel()
    showPanel("#PanelFRutaRecorrido")
})

closeAllPanel()



