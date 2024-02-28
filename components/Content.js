const Process = require(__dirname + '/Process');
const Config = require(__dirname + '/Config');
const Event = require(__dirname + '/Event');
const Message = require(__dirname + '/../hellpers/Messages');
const Req = require(__dirname + '/../hellpers/GET');
const package = require('./../package.json');

const AlertMsg = ()=>{
    if(Req.urlGet('alert') == "true")
      Message(Req.urlGet('msg'), Req.urlGet('type'))    
}

const version  = "ver "+package.version;
const setStatusProcess = ()=>{
  if(!localStorage.getItem("statusProcess"))
  localStorage.setItem("statusProcess","")
}
const setStatusLog = ()=>{
  let chave = document.getElementById("statusLog");

  chave.addEventListener("click" ,function(){
    
    let statusLog = localStorage.getItem("statusLog")

    if(statusLog > 0){
      statusLog = 0
      this.classList.remove("ligado")
      this.classList.add("desligado")
    }else{
      statusLog = 1
      this.classList.add("ligado")
      this.classList.remove("desligado")
    }

    localStorage.setItem("statusLog",statusLog)
  })
}


// CONTENT

const content = props => {

  let prepare = false
  const configs = JSON.parse(localStorage.getItem("config"));
  configs.forEach(config => {  
    if (config.subdomain == "" || config.instance == "" || config.DAO.user == "" || config.DAO.password == "" || config.DAO.database == "")
      prepare = true
  });
  
  if(localStorage.getItem("url") == "configs"){
    prepare = true;
  }

  let html = document.createElement('div');
  html.id = 'content';
  if(!props.content){
    html.style.display = "none";
  }
  html.innerHTML = `
    <header>
        ${ prepare ? props.config : props.event }        
    </header>   
    <main>
      <div id="messages"></div>
      <div class="layer hide">
        <div id="alert">
          <span class="material-icons">report_problem</span>
          <span class="message">É preciso preencher as configurações para iniciar a aplicação</span>
        </div>
      </div>
      <aside id="content-process"></aside>
      <section id="main">      
        <div id="content-config" class="hide ${prepare ? "show" : ""}"></div>
        <div id="content-event" class="hide ${!prepare ? "show" : ""}"></div>
      </section>
    </main>
    <footer>
        <div id="statusConect">Conectando...</div>
        <div id="version_app"><i> ${ version } </i></div>
        <div class="statusLog on-off"> 
          <span>LOG</span>
          <div id="statusLog" class="${localStorage.getItem("statusLog") > 0 ? "ligado" : "desligado"}">
            <div class="chave"></div>
          </div>      
        </div>         
        
    </footer>`;

  document.getElementById("app").appendChild(html);
  setStatusProcess()
  Process();
  Config();
  Event();
  AlertMsg()
  setStatusLog()

  
  
}




module.exports = content;