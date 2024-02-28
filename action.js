const remote = require(__dirname + '/controller/Remote');
const UserAction = require(__dirname + '/controller/User');
const toolbar = require(__dirname + '/components/Toolbar');
const formLogin = require(__dirname + '/components/FormLogin');
const content = require(__dirname + '/components/Content');
const Login = require(__dirname + '/controller/Login');
const fs = require('fs');

const INI = "/applok/config.ini"
const pathSqlConfig = "/applok/sqlConfig.txt"

fs.readFile( pathSqlConfig ,'utf8', function(err,data){
	data = data.trim().split("\r\n");
	let obj = {} 
	data.forEach(item=>{
		item = item.split("=>")
		obj[item[0].trim()] = item[1].trim()
	})
	localStorage.setItem("SqlConfig", JSON.stringify(obj))
});

if( fs.existsSync(INI) ){
	fs.readFile( INI ,'utf8', function(err,data){
		data = data.trim().split("\r\n");
		let obj = {} 
		data.forEach(item=>{
			item = item.split("=")
			obj[item[0].trim()] = item[1].trim()
		})
		localStorage.setItem("INI", JSON.stringify(obj))
	});
}

const header = {
	config: `<span class="material-icons">settings</span> Configurações`,
	event: `<span class="material-icons">reorder</span> Lista de eventos`,
	content: true
}

// Seta preferencia de log

localStorage.setItem("sinc",JSON.stringify({}))

if (!localStorage.getItem('statusSinc'))
	localStorage.setItem("statusSinc",JSON.stringify({}))

if (!localStorage.getItem('statusLog'))
	localStorage.setItem("statusLog",0)


// Seta objeto de configurações

if (!localStorage.getItem('config'))
	localStorage.setItem("config", JSON.stringify([]))


const initControl = () => {
	document.querySelector("html").setAttribute("class", "");
	let ready = () => {
		// FUNCTIONS IPC REMOTE

		if (remote.isMaximized()) {
			document.querySelector('.unmax').style.display = "flex";
			document.querySelector('.max').style.display = "none";
		}
		document.querySelector('.close').addEventListener('click', remote.closeWindow)
		document.querySelector('.min').addEventListener('click', remote.minWindow)
		document.querySelector('.max').addEventListener('click', remote.maxWindow)
		document.querySelector('.unmax').addEventListener('click', remote.unMaxWindow)

		// END FUNCTIONS IPC REMOTE

		//####################################################################################

		// FUNCTIONS USER EXPERIENCE

		let login = document.querySelector("#login .form");
		if (login) {
			let optForm = document.querySelectorAll("#login .form .header div");
			optForm.forEach(item => {
				item.addEventListener('click', function () {
					document.querySelector('.header div.active').classList.remove('active');
					this.classList.add('active');
					let text = this.innerText.toLowerCase();
					document.querySelector('form.active').classList.remove('active')
					document.querySelector('form.' + text).classList.add('active')
				})
			})
		}

		let logout = document.getElementById('logout');
		if (logout) {
			logout.addEventListener('click', function () {
				Login.appLogout();
			})
		}

		let refresh = document.getElementById('refresh');
		if (refresh) {
			refresh.addEventListener('click', remote.relaunch )
		}

		let config = document.getElementById('configs');
		if (config) {
			config.addEventListener('click', function () {
				document.getElementById('content-config').classList.add('show');
				document.getElementById('content-event').classList.remove('show');
				document.querySelector('#content header').innerHTML = header.config
				localStorage.setItem("url","configs")
			})
		}

		let events = document.getElementById('events');
		if (events) {
			events.addEventListener('click', function () {
				document.getElementById('content-event').classList.add('show');
				document.getElementById('content-config').classList.remove('show');
				document.querySelector('#content header').innerHTML = header.event

				localStorage.setItem("url","events")
			})
		}

		// END FUNCTIONS USER EXPERIENCE

		// FUNCIONS LOGIN
		if (login) {
			document.getElementById('btnLogin').addEventListener('click', Login.callToLogin);
			//document.getElementById('btnRegister').addEventListener('click',Login.callToResgister);
		}

		// END FUNCIONS LOGIN

	}
	document.addEventListener("DOMContentLoaded", ready, false);
}



	if (UserAction.getStorage('listRegisters'))
		formLogin('login');
	else
		formLogin('register');

	initControl();
	if (Login.getLogon() == null) {
		toolbar();
	}else{
		toolbar({ state: 'logado' });
		document.querySelector('#animateCss').setAttribute('href', '')
	}

	content(header);

