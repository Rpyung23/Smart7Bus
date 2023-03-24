export function FechaStringToHour(fecha) {
    var fecha_ = new Date(fecha)
    var dia = fecha_.getDay();
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


    return fecha_.getDate() + " DE " + mesTexto + ", " + fecha_.getFullYear()
}

export function getformatFechatoTime(fecha) {
    var fecha_ = new Date(fecha)


    var hora = fecha_.getHours();

    var minutos = fecha_.getMinutes();
    var segundos = fecha_.getSeconds();



    if (hora < 10) {
        hora = "0" + hora;
    }
    if (minutos < 10) {
        minutos = "0" + minutos;
    }
    if (segundos < 10) {
        segundos = "0" + segundos;
    }

    return hora + ":" + minutos + ":" + segundos
}


export function getformatFechaDateTime(fecha) 
{

    var fecha_ = new Date(fecha)


    var dia = fecha_.getDate();

    var mes = fecha_.getMonth();

    mes = mes + 1;

    if (dia < 10) {
        dia = "0" + dia;
    }
    if (mes < 10) {
        mes = "0" + mes;
    }



    var hora = fecha_.getHours();

    var minutos = fecha_.getMinutes();




    if (hora < 10) {
        hora = "0" + hora;
    }
    if (minutos < 10) {
        minutos = "0" + minutos;
    }

    return (fecha_.getFullYear() + "-" + mes + "-" + dia+" "+hora + ":" + minutos + ":00")
}


export function getFecha_dd_mm_yyyy(fecha) {


    var fecha_ = new Date(fecha)


    var dia = fecha_.getDate();

    var mes = fecha_.getMonth();

    mes = mes + 1;

    if (dia < 10) {
        dia = "0" + dia;
    }
    if (mes < 10) {
        mes = "0" + mes;
    }

    return (fecha_.getFullYear() + "-" + mes + "-" + dia)
}

export function getFechatoDDMM(fecha) {


    var fecha_ = new Date(fecha)


    var dia = fecha_.getDate();

    var mes = fecha_.getMonth();

    mes = mes + 1;

    if (dia < 10) {
        dia = "0" + dia;
    }
    
    switch(mes)
    {
        case 1:
            mes = 'ENE'
            break;
        case 2:
            mes = 'FEB'
            break;        
        case 3:
            mes = 'MAR'
            break;
        case 4:
            mes = 'ABR'
            break;
        case 5:
            mes = 'MAY'
            break;
        case 6:
            mes = 'JUN'
            break;
        case 7:
            mes = 'JUL'
            break;
        case 8:
            mes = 'AGO'
            break;
        case 9:
            mes = 'SEP'
            break;
        case 10:
            mes = 'OCT'
            break;
        case 11:
            mes = 'NOV'
            break;
        case 12:
            mes = 'DIC'
            break;
    }



    return dia +" "+mes
}

export function convertSecondtoTimeString(seconds) {
    if (seconds == 0) {
        return '00:00:00'
    } else {
        var hour = Math.floor(seconds / 3600);
        hour = (hour < 10) ? '0' + hour : hour;
        var minute = Math.floor((seconds / 60) % 60);
        minute = (minute < 10) ? '0' + minute : minute;
        var second = seconds % 60;
        second = (second < 10) ? '0' + second : second;
        return hour + ':' + minute + ':' + second;
    }
}


