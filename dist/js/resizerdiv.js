resizerXY("resizerXY", function (e) {
    resizeX(e.pageX + 10);
});
function resizeX(x) {
    var element2 = document.getElementById("element2");

    var anchodiv = parseFloat(element2.style.width.replace("px", ""));

    element2.style.width =
        element2.parentElement.clientWidth +
        document.getElementById("rezizeArea").offsetLeft -
        50 -
        x +
        "px";
}