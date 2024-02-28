const ModelConfig = require(__dirname + '/../model/Config.model');
const remote = require(__dirname + '/../controller/Remote');
const Mysql = require(__dirname + '/../controller/Mysql');
const Message = require(__dirname + '/../hellpers/Messages');


const CheckMySQLConection = async (DAO, name ) =>{
  return await Mysql.connect(DAO, name).then(res => {
    //testConnect()
    if (!res) {      
      let msg = `Conexão com o banco falhou para o processo ${Ucfirst(name)}!<br> Verifique se os dados estão corretos`
      let type = "error"
      Message(msg , type)
      return false
    }else{
      return true
    }
  })
}

const SincronizeAll = async (process, contador)=>{

  document.getElementById(process.id).querySelector(".sinc .load").classList.add("hidden")
  Mysql.select(process, contador).then(res =>{
    let status_banco = {
      total : res[0].total,
      sinc :res[0].sincronizado
    }
    let percent = parseInt((100 / res[0].total) * res[0].sincronizado)

    document.getElementById(process.id).querySelector('.sinc b').innerHTML = percent+"%"
    if(percent >= 100){
      document.getElementById(process.id).querySelector('.sinc').classList.add("ok")
    }else{
      document.getElementById(process.id).querySelector('.sinc').classList.remove("ok")
    }

    let config = JSON.parse(localStorage.getItem("config"))
    config[process.key].status_banco = status_banco
    localStorage.setItem("config", JSON.stringify(config))    
  })
}

const SetConfigs = function () {
  const _Process = require(__dirname + '/Process');
	event.preventDefault();
	let modelo = ModelConfig
	let form = this.closest('form');
	let id = form.querySelector('[name=id]').value;
	modelo.subdomain = form.querySelector('[name=subdomain]').value;
	modelo.interval = form.querySelector('[name=interval]').value;
	modelo.instance = form.querySelector('[name=instance]').value;
	modelo.DAO.host = form.querySelector('[name=host]').value;
	modelo.DAO.port = form.querySelector('[name=port]').value;
	modelo.DAO.user = form.querySelector('[name=user]').value;
	modelo.DAO.password = form.querySelector('[name=password]').value;
	modelo.DAO.database = form.querySelector('[name=database]').value;

	let object_config = JSON.parse(localStorage.getItem("config"));
  let msg = "Novo processo criado com sucesso";
  
	if(id !== 'default'){

		object_config[id] = modelo;
    msg = "Configurações editadas com sucesso"
  
  }else{
		object_config.push(modelo);
  }
    
  if( modelo.subdomain && modelo.DAO.user && modelo.DAO.password && modelo.DAO.database){
    console.log(object_config);
    localStorage.setItem("config", JSON.stringify(object_config));    
    //location.href = `?alert=true&msg=${msg}&type=success`;
    remote.relaunch();
  }
}

const DeleteConfig = id =>{
  let object_config = JSON.parse(localStorage.getItem("config"));
  object_config.splice(parseInt(id), 1);
  localStorage.setItem("config", JSON.stringify(object_config));
  // location.href = '?alert=true&msg=Deletado com sucesso&type=success';

  remote.relaunch();
}

const setStatusSinc = ()=>{
  let chave = document.getElementById("statusSinc");
  if(chave)
  chave.addEventListener("click" ,function(){
    
    subdomain = this.getAttribute("data-sub")
    let statusSinc = JSON.parse(localStorage.getItem("statusSinc"))
    
    if(statusSinc[subdomain] > 0){
      statusSinc[subdomain] = 0
      this.classList.remove("ligado")
      this.classList.add("desligado")
    }else{
      statusSinc[subdomain] = 1
      this.classList.add("ligado")
      this.classList.remove("desligado")
    }

    if(statusSinc[subdomain] == null)
      statusSinc[subdomain] = 1

    localStorage.setItem("statusSinc",JSON.stringify(statusSinc))
  })
}

const setStatusProcess = ()=>{
  let chave = document.getElementById("statusProcess");
  if(chave)
  chave.addEventListener("click" ,function(){
    subdomain = this.getAttribute("data-sub")
    let statusProcess;
    if(localStorage.getItem("statusProcess") != ''){
      statusProcess = JSON.parse(localStorage.getItem("statusProcess"));
    }else{
      statusProcess = {};
    }
    
    if(statusProcess[subdomain]!== false){
      if(statusProcess[subdomain] > 0){
        statusProcess[subdomain] = 0
        this.classList.remove("ligado")
        this.classList.add("desligado")
      }else{
        statusProcess[subdomain] = 1
        this.classList.add("ligado")
        this.classList.remove("desligado")
      }
    }else{
      statusProcess[subdomain] = 0
      this.classList.remove("ligado")
      this.classList.add("desligado")
    }  

    localStorage.setItem("statusProcess",JSON.stringify(statusProcess))
  })
}


const  Config = (config , id) => {

  if(typeof id !== "number")
    id = "default"
  if(!config)
    config = ModelConfig

  let html = document.createElement('div');
  html.id = 'config';
  html.innerHTML = `
    <div class="configs form">
      <form class="config" onsubmit="return false">
        <div class='campo'>
          <div class='input'>
            <label><span class="material-icons">http</span></label>
            <span class="label">subdomínio</span>
            <input type="text" name="subdomain" placeholder="Subdomain" value="${ config.subdomain ? config.subdomain : "" }">
          </div>

          <div class='input'>
            <label><span class="material-icons">update</span></label>
            <span class="label">intervalo em segundos</span>
            <input type="text" name="interval" placeholder="60" value="${config.interval ? config.interval : "" }">
          </div>
        </div>
        <div class='campo'>
          <div class='input'>
            <label><span class="material-icons">home</span></label>
            <span class="label">host MySQL</span>
            <input type="text" name="host" placeholder="localhost"  value="${config.DAO.host ? config.DAO.host : "" }">
          </div>

          <div class='input'>
          <label><span class="material-icons">system_update_alt</span></label>
          <span class="label">porta MySQL</span>
          <input type="text" name="port" placeholder="3306" value="${config.DAO.port ? config.DAO.port : "" }">
        </div>
        </div>
        <div class='campo'>
          <div class='input'>
            <label><span class="material-icons">person</span></label>
            <span class="label">user MySQL</span>
            <input type="text" name="user" placeholder="User"  value="${config.DAO.user ? config.DAO.user : "" }">
          </div>

          <div class='input'>
            <label><span class="material-icons">lock</span></label>
            <span class="label">senha MySQL</span>
            <input type="text" name="password" placeholder="Password"  value="${config.DAO.password ? config.DAO.password : "" }">
          </div>
        </div>
        <div class='campo'>
          <div class='input'>
            <label><span class="material-icons">view_in_ar</span></label>
            <span class="label">nome do banco MySQL</span>
            <input type="text" name="database" placeholder="Data Base"  value="${config.DAO.database ? config.DAO.database : "" }">
          </div>

          <div class='input'>
            <label><span class="material-icons">folder</span></label>
            <span class="label">instancia do sistema</span>
            <input type="text" name="instance" placeholder="ex:c:\\path"  value="${config.instance ? config.instance : "" }">
          </div>
        </div>
        <input type="hidden" name="id" value="${id}">
        <button id="btnConfig">SALVAR</button>
      </form>
    </div>`;

    if(id !== "default"){
      let proc =  ( localStorage.getItem("statusProcess") && JSON.parse(localStorage.getItem("statusProcess"))[config.subdomain] === 0) ? "desligado" : "ligado";
      let sinc =  JSON.parse(localStorage.getItem("statusSinc"))[config.subdomain] > 0 ? "ligado" : "desligado";
      html.innerHTML+=`
        <div id="actions">
          <button id="delete-config">Excluir</button>
          
          <div>
            <div class="statusSinc on-off"> 
              <span>SINC</span>
              <div id="statusSinc" style=" background:#2b2b2b;" class="${ sinc }" data-sub="${ config.subdomain }">
                <div class="chave"></div>
              </div>      
            </div>  
            
            <div class="on-off">
              <span>POCESS</span>
              <div id="statusProcess" style=" background:#2b2b2b;" class="${ proc }" data-sub="${ config.subdomain }">
                <div class="chave"></div>
              </div>
            </div>
          </div> 
          
          <button id="update-local" data-process="${id}">
            <span class="material-icons">
              autorenew
            </span>
          </button>

 

          <button id="add-config">Novo</button>
        </div>
      `
    }
    
    document.getElementById('content-config').appendChild( html );

    setStatusSinc() 
    setStatusProcess() 

    let contntConfig = document.querySelector("#content-config .form");
		if (contntConfig) {
			document.getElementById('btnConfig').addEventListener('click', SetConfigs);
    }
		

    let _deleteConfig = document.querySelector("#delete-config");
		if (_deleteConfig) {
			_deleteConfig.addEventListener('click',()=>{
        DeleteConfig(id)
      });
		}

    let _addConfig = document.querySelector("#add-config");
		if (_addConfig) {
			_addConfig.addEventListener('click',()=>{
        //localStorage.setItem("url","configs")
        //location.href = '?'
        remote.relaunch();
      });
		}

    
    let _updateLocal = document.querySelector("#update-local");
		if (_updateLocal ) {
			_updateLocal.addEventListener('click',function(){
        let id = this.getAttribute('data-process')
        let process = JSON.parse(localStorage.getItem("config"))[id]
        process.id = 'processo_'+id
        process.key = id
        
        CheckMySQLConection(process.DAO, process.subdomain)
        .then(res=>{
          if(res){
            document.getElementById('processo_'+id).querySelector(".sinc .load").classList.remove("hidden")

            let sqls = []
            let SqlConfig = JSON.parse(localStorage.getItem("SqlConfig"))
            let contador = SqlConfig.contador;
            let proc = process;
            delete SqlConfig.contador
            delete SqlConfig.tables
            let n= 0

            Object.keys(SqlConfig).forEach(key=>{
              sqls.push("UPDATE "+key+" SET `SINCRONIZA` = '1' WHERE `SINCRONIZA` <> '1';")
            })         

            sqls.forEach(sql=>
              Mysql.select(process, sql).then(resp=>{
                n++
                if(sqls.length == n){
                  SincronizeAll(proc, contador)
                }                                
              })
            )
          }

        })

        
      });
		}
    

}

module.exports = Config;