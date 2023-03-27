function deleteItemSelected()
{
    $('div').removeClass('itemOptionMonitoreoActive')
}

function closeAllPanel()
{
    $("#element2").css("display","none")
    $("#PanelRutas").css("display","none")
    $("#PanelControles").css("display","none")
    $("#PanelConfigMapaMonitoreo").css("display","none")
    /*$("#").css("display","none")*/
}

function showPanel(idPanel)
{
    $(idPanel).css("display","flex")
}

var itemMonitoreo = document.getElementById("itemMonitoreo")
var itemControles = document.getElementById("itemControles")
var itemRutas = document.getElementById("itemRutas")
var itemConfig = document.getElementById("itemConfig")
var findClass = 'itemOptionMonitoreoActive'

itemMonitoreo.addEventListener('click',function()
{
    if( $('#itemMonitoreo').hasClass(findClass) ){
        deleteItemSelected()
        closeAllPanel()
    }
    else{
        deleteItemSelected()
        $('#itemMonitoreo').addClass("itemOptionMonitoreoActive")
        closeAllPanel()
        showPanel("#element2")
    }
})

itemControles.addEventListener('click',function(){
    if( $('#itemControles').hasClass(findClass) ){
        deleteItemSelected()
        closeAllPanel()
    }
    else{
        deleteItemSelected()
        $('#itemControles').addClass("itemOptionMonitoreoActive")
        closeAllPanel()
        showPanel("#PanelControles")
    }
})

itemRutas.addEventListener('click',function(){
    if( $('#itemRutas').hasClass(findClass) ){
        deleteItemSelected()
        closeAllPanel()
    }
    else{
        deleteItemSelected()
        $('#itemRutas').addClass("itemOptionMonitoreoActive")
        closeAllPanel()
        showPanel("#PanelRutas")
    }
})

itemConfig.addEventListener('click',function(){
    if( $('#itemConfig').hasClass(findClass) ){
        deleteItemSelected()
        closeAllPanel()
    }
    else{
        deleteItemSelected()
        $('#itemConfig').addClass("itemOptionMonitoreoActive")
        closeAllPanel()
        showPanel("#PanelConfigMapaMonitoreo")
    }
    
})

closeAllPanel()
showPanel("#element2")


