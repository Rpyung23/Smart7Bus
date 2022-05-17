function deleteItemSelected()
{
    $('div').removeClass('itemOptionMonitoreoActive')
}

function closeAllPanel()
{
    $("#element2").css("display","none")
    $("#PanelRutas").css("display","none")
    $("#PanelControles").css("display","none")
    /*$("#").css("display","none")
    $("#").css("display","none")*/
}

function showPanel(idPanel)
{
    $(idPanel).css("display","flex")
}

var itemMonitoreo = document.getElementById("itemMonitoreo")
var itemControles = document.getElementById("itemControles")
var itemRutas = document.getElementById("itemRutas")
var itemConfig = document.getElementById("itemConfig")

itemMonitoreo.addEventListener('click',function()
{
    deleteItemSelected()
    $('#itemMonitoreo').addClass("itemOptionMonitoreoActive")
    closeAllPanel()
    showPanel("#element2")
})

itemControles.addEventListener('click',function(){
    deleteItemSelected()
    $('#itemControles').addClass("itemOptionMonitoreoActive")
    closeAllPanel()
    showPanel("#PanelControles")
})

itemRutas.addEventListener('click',function(){
    deleteItemSelected()
    $('#itemRutas').addClass("itemOptionMonitoreoActive")
    closeAllPanel()
    showPanel("#PanelRutas")
})

itemConfig.addEventListener('click',function(){
    deleteItemSelected()
    $('#itemConfig').addClass("itemOptionMonitoreoActive")
    closeAllPanel()
})

closeAllPanel()
showPanel("#element2")


