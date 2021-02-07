const APP = require(__dirname + '/../hellpers/GET');
const req = require(__dirname + '/../controller/Requests');
const Mysql = require(__dirname + '/../controller/Mysql');
const fs = require('fs');
const HOST = APP("local")

const interval = JSON.parse(localStorage.getItem("config")).interval
const timeRequest = interval ? parseInt(interval) : 60
const path = "/applok/logs/log.txt"

const App = {
  config: false,
  on: false,
  connect: false
}

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

const Readlog = path => {
  fs.readFile(path, 'utf8', (err, data) => {
    if (err) {
      console.error(err)
      return
    }
    return data
  })
}

const Createlog = path => {
  fs.writeFile(path,
    '',
    erro => { if (erro) throw erro; }
  )
}

const Writelog = (path, data, msg) => {
  var stream = fs.createWriteStream(path, { flags: 'a' });
  stream.write(`[ ${DataHora()} ] ${JSON.stringify(data)}\n`);
  stream.end();

  let res = `
        <div class="event new">${msg}<span>${DataHora()}</span></div>
    `
  if (loadEvents.innerHTML.trim() == "Ainda não houve nenhum evento")
    loadEvents.innerHTML = res
  else
    loadEvents.insertAdjacentHTML("afterbegin", res)

  loadEvents.querySelectorAll(".new").forEach(element => {
    setTimeout(() => {
      element.classList.remove("new");
      element.classList.add("motion");
      setTimeout(() => {
        element.classList.remove("motion");
      }, 3000);
    }, 300);
  });


}

const testConnect = () => {
  if (!App.connect) {
    statusMysql.innerHTML = "<span>🔴</span> MySql"
  } else {
    statusMysql.innerHTML = "<span>🟢</span> MySql"
  }
}

const ResquestWS = async () => {
  const config = JSON.parse(localStorage.getItem("config"))
  if (App.connect != false && config.subdomain != "" && config.DAO.user != "" && config.DAO.password != "" && config.DAO.database != "")
    App.config = true
  else
    App.config = false

  if (App.config) {
    if (App.on !== false) {
      try {
        let resp = await fetch(`https://${HOST}.applok.com.br/`,
          {
            method: "POST",
          }).then(res => {
            res.json().then(res => {

              if (!fs.existsSync(path)) {
                fs.mkdir("/applok/logs/", { recursive: true }, (err) => {
                  if (err) {
                    return console.error(err);
                  }

                });
                Createlog(path)

              } else {
                let msg
                if (res.error)
                  msg = res.error
                else
                  msg = res.success
                Writelog(path, res, msg)
              }

            })
          })
      } catch (err) {
        App.on = false;
      }

    } else {
      if (!fs.existsSync(path)) {
        Createlog(path)
      } else {
        $msg = "Sem Conexão!"
        Writelog(path, { error: $msg }, $msg)
      }
    }
    statusRequest.innerHTML = "<span>🔴</span><span>🟢</span> Executando"
  } else {
    statusRequest.innerHTML = "<span>🔴</span> Parado"
  }

  testConnect();

}

const checkOnlineStatus = async () => {
  try {
    const online = await fetch("https://applok.com.br/")
    App.on = true;
    return online.status >= 200 && online.status < 300
  } catch (err) {
    App.on = false;
    return false;
  }
}

const online = async () => {
  let on = false;
  on = await checkOnlineStatus()

  if (on) {
    statusConect.innerHTML = "<span>🟢</span> On-line ";
    return true
  } else {

    statusConect.innerHTML = "<span>🔴</span> Off-line";
    return false
  }
}

const Event = prepare => {

  App.config = !prepare ? true : false
  let html = document.createElement('div');
  html.id = 'content-event';
  html.setAttribute('class', `hide ${!prepare ? "show" : ""}`);
  html.innerHTML = `

      <div class="events">
          <section id="loadEvents">
              Ainda não houve nenhum evento
          </section>
      </div>
  `;

  let events = document.getElementById('events');
  if (events) {
    events.addEventListener('click', function () {
      if (!App.config || !App.connect)
        document.querySelector('.layer').classList.add('show')
    })
  }

  let config = document.getElementById('configs');
  if (config) {
    config.addEventListener('click', function () {
      if (!App.config || !App.connect)
        document.querySelector('.layer').classList.remove('show')
    })
  }

  Mysql(JSON.parse(localStorage.getItem("config")).DAO).then(res => {
    App.connect = res
    testConnect()
    if (!App.connect) {
      document.querySelector('.layer').classList.add('show')
      document.querySelector('.layer #alert .message').innerHTML = "Conexão com o banco falhou!<br> Verifique se os dados estão corretos"
    }

    setTimeout(() => {
      setInterval(online, 1000)
      setInterval(ResquestWS, 1000 * timeRequest)
      online().then(() => ResquestWS())

    }, 1000)
  })


  return html
}

module.exports = Event;

