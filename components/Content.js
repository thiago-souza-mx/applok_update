const Config = require(__dirname + '/Config');
const Event = require(__dirname + '/Event');

// CONTENT

const content = props => {

  let prepare = false
  const config = JSON.parse(localStorage.getItem("config"))
  if (config.subdomain == "" || config.DAO.user == "" || config.DAO.password == "" || config.DAO.database == "")
    prepare = true

  let html = document.createElement('div');
  html.id = 'content';
  html.innerHTML = `
        <div class="layer hide">
            <div id="alert">
                <span class="material-icons">report_problem</span>
                <span class="message">É preciso preencher as configurações para iniciar a aplicação</span>
            </div>
        </div>
        <header>
            ${ prepare ? props.config : props.event }
        </header>
        <section id="main">
        </section>
        <footer>
            <div id="statusConect">Conectando...</div>
            <div id="statusMysql"><span>🔴</span> MySql</div>
            <div id="statusAPI"><span>🔴</span> API</div>
            <div id="statusRequest"><span>🔴</span> Parado</div>
        </footer>`
  document.getElementById("app").appendChild(html);


  html = Config(prepare);
  main.appendChild(html);

  html = Event(prepare);
  main.appendChild(html);

}




module.exports = content;