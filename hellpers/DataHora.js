const DataHora = () => {
  // Obtém a data/hora atual
  var data = new Date();

  // Guarda cada pedaço em uma variável
  var dia = data.getDate();           // 1-31
  var dia_sem = data.getDay();            // 0-6 (zero=domingo)
  var mes = data.getMonth();          // 0-11 (zero=janeiro)
  var ano2 = data.getYear();           // 2 dígitos
  var ano4 = data.getFullYear();       // 4 dígitos
  var hora = data.getHours();          // 0-23
  var min = data.getMinutes();        // 0-59
  var seg = data.getSeconds();        // 0-59
  var mseg = data.getMilliseconds();   // 0-999
  var tz = data.getTimezoneOffset(); // em minutos

  function format(num) {
    return (num < 10 ? "0" + num : num)
  }
  // Formata a data e a hora (note o mês + 1)
  var str_data = format(dia) + '/' + format((mes + 1)) + '/' + format(ano4);
  var str_hora = format(hora) + ':' + format(min) + ':' + format(seg);

  // Mostra o resultado
  return `${str_data} às ${str_hora}`;
}

module.exports = DataHora;