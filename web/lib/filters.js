/* filters for dev */
app.filter('formatedParams', function() {
      return function(o) {
        var object = angular.copy(o);
        for(var key in object) {
          if (object[key] = "number") object[key] = '';
        }
        return JSON.stringify(object, null, 4);
}});

app.filter('JSON', function() {
      return function(o) {
        return JSON.stringify(o, null, 4);
}});

/* Округление */
function precise_round(num, decimals) { return (+num).toFixed(decimals) }


/* Форматирование размера (Мб, Кб, ..). Вход: байты */
app.filter('byteformat', function() {
  return function(size) {
    var symbol = ['Б', 'кБ', 'МБ', 'ГБ'], base = 1024, rank = 0;
    // size >= 0
    size = (typeof size == 'undefined' || +size<=0 ) ? 0 : size;
    // выяснить наибольший rank размера
    if (size!=0) {for (var i=1; i <= symbol.length - 1; i++) if (size >= base) {size = size / base; rank = i} }
    // округлить размер до первого знака после запятой (с учётом rank'а)
    size = (rank>=1) ? precise_round(size, 1) : precise_round(size, 0);
    // вывести вместе с единицей измерения
    return (size.toString().replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1 ').replace('.', ',') + '\u00A0' + symbol[rank]);
  };
});