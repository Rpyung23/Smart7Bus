export function FechaStringToHour(fechaString)
{
    var HoraConvert = new Date(fechaString)
    var HoraActualInicial = (HoraConvert.getHours() < 9 ? "0"+HoraConvert.getHours() : HoraConvert.getHours())
                            +":"+(HoraConvert.getMinutes() < 9 ? "0"+HoraConvert.getMinutes() : +HoraConvert.getMinutes())
                            +":"+(HoraConvert.getSeconds() < 9 ? "0"+HoraConvert.getSeconds() : HoraConvert.getSeconds())
    return HoraActualInicial
}