
const Config = require(__dirname + '/Config');

const getProcess = ()=>{
  let listProcess = document.querySelector("#listProcess");
  let listConfig = JSON.parse(localStorage.getItem("config"))
  if(listProcess){
    listProcess = listProcess.querySelectorAll("li.item")
    listProcess.forEach(item => {
      item.addEventListener("click", function(){
        let dataConfigId = this.getAttribute("data-config-id");        
        
        if(document.querySelector("#listProcess").querySelector("li.item.active")){
          document.querySelector("#listProcess").querySelector("li.item.active").classList.remove('active')
        }
        this.classList.add('active')

        document.getElementById('content-config').innerHTML =""
        Config(listConfig[dataConfigId] , parseInt(dataConfigId))
        document.getElementById('content-config').classList.add('show');
				document.getElementById('content-event').classList.remove('show');
				document.querySelector('#content header').innerHTML = `<span class="material-icons">settings</span> Configurações`
				localStorage.setItem("url","configs")
      })
    });
  }
}

const listAllProcess = ()=>{
  let list = '';
  let listConfig = JSON.parse(localStorage.getItem("config"))
  for(let i = 0; i < listConfig.length; i++){
    list += `
      <li id="processo_${i}" class="item" data-config-id="${i}">
        <ul>
          <li> ${listConfig[i].subdomain} </li>
          <li> 
            <div class="statusMysql"><span><i class='circle c-red'></i></span> MySql</div>
            <div class="statusAPI"><span><i class='circle c-red'></i></span> API</div>
            <div class="statusRequest"><span><i class='circle c-red'></i></span> Parado</div>
            
          </li>
        </ul>
        <div   class="d-flex justify-content-between align-items-center">
          <div class="sinc">SINC <b>--</b>
            <span class="material-icons load hidden">
              autorenew
            </span>
          </div>
          <div class="timeRequest">
            Request <b>0s</b>
          </div>
        </div>
      </li>
    `;
  }

  return list
}

const Process = ()=>{

  let listProcess = document.createElement("ul");
  listProcess.id = "listProcess";
  listProcess.innerHTML = listAllProcess()

  document.getElementById('content-process').appendChild(listProcess);

  getProcess()
}

module.exports = Process;