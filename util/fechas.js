export function FechaStringToHour(fecha)
{
    var fecha_ = new Date(fecha)
    var dia = fecha_.getDay() ;
    var mes = fecha_.getMonth();
    mes = mes + 1;
    var diaTexto = "DOMINGO"
    var mesTexto = "ENERO"



    switch (mes) {
        case 1:
            mesTexto = "ENE"
            break;
        case 2:
            mesTexto = "FEB"
            break;
        case 3:
            mesTexto = "MAR"
            break;
        case 4:
            mesTexto = "ABR"
            break;
        case 5:
            mesTexto = "MAY"
            break;
        case 6:
            mesTexto = "JUN"
            break;
        case 7:
            mesTexto = "JUL"
            break;
        case 8:
            mesTexto = "AGO"
            break;
        case 9:
            mesTexto = "SEP"
            break;
        case 10:
            mesTexto = "OCT"
            break;
        case 11:
            mesTexto = "NOV"
            break;
        case 12:
            mesTexto = "DIC"
            break;
    }


    return fecha_.getDate()+" DE "+mesTexto+", "+fecha_.getFullYear()
}



export function getFecha_dd_mm_yyyy(fecha)
{


    var fecha_ = new Date(fecha)


    var dia = fecha_.getDate();

    var mes = fecha_.getMonth();

    mes =mes +1;

    if(dia<10)
    {
        dia = "0"+dia;
    }
    if(mes<10)
    {
        mes = "0"+mes;
    }

    return (fecha_.getFullYear()+"-"+mes+"-"+dia)
}

export function convertSecondtoTimeString(seconds)
{
    var hour = Math.floor(seconds / 3600);
    hour = (hour < 10) ? '0' + hour : hour;
    var minute = Math.floor((seconds / 60) % 60);
    minute = (minute < 10) ? '0' + minute : minute;
    var second = seconds % 60;
    second = (second < 10) ? '0' + second : second;
    return hour + ':' + minute + ':' + second;
}