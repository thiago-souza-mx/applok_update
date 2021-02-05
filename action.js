const remote = require(__dirname + '/controller/Remote');
const UserAction = require(__dirname + '/controller/User');
const toolbar = require(__dirname + '/components/Toolbar');
const formLogin = require(__dirname + '/components/FormLogin');
const content = require(__dirname + '/components/Content');
const Login = require(__dirname + '/controller/Login');
const header ={
    config:`<span class="material-icons">settings</span> Configurações`,
    event:`<span class="material-icons">reorder</span> Lista de eventos`,
}
const config = {
    "subdomain": "",
    "DAO": {
        "host": "",
        "user": "",
        "password": "",
        "database": ""
    }
}
const initConfig = () => {

    if (!localStorage.getItem('config'))
        localStorage.setItem("config", JSON.stringify(config))
}
const initControl = () => {
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

        let config = document.getElementById('configs');
        if (config) {
            config.addEventListener('click', function () {
                document.getElementById('content-config').classList.add('show');
                document.getElementById('content-event').classList.remove('show');
                document.querySelector('#content header').innerHTML = header.config
            })
        }
    
        let events = document.getElementById('events');
        if (events) {
            events.addEventListener('click', function () {
                document.getElementById('content-event').classList.add('show');
                document.getElementById('content-config').classList.remove('show');
                document.querySelector('#content header').innerHTML = header.event
            })
        }

        // END FUNCTIONS USER EXPERIENCE

        // FUNCIONS LOGIN
        if (login) {
            document.getElementById('btnLogin').addEventListener('click', Login.callToLogin);
            //document.getElementById('btnRegister').addEventListener('click',Login.callToResgister);
        }

        let contntConfig = document.querySelector("#content-config .form");
        if (contntConfig) {
            document.getElementById('btnConfig').addEventListener('click', SetConfigs);
            //document.getElementById('btnRegister').addEventListener('click',Login.callToResgister);
        }

        // END FUNCIONS LOGIN

    }
    document.addEventListener("DOMContentLoaded", ready, false);
}

const SetConfigs = function(){
    event.preventDefault();
    let form = this.closest('form');    
    config.subdomain = form.querySelector('[name=subdomain]').value;
    config.DAO.host = form.querySelector('[name=host]').value;
    config.DAO.user = form.querySelector('[name=user]').value;
    config.DAO.password = form.querySelector('[name=password]').value;
    config.DAO.database = form.querySelector('[name=database]').value;
    localStorage.setItem("config", JSON.stringify(config))
    remote.relaunch();
}

if (Login.getLogon() == null) {
    toolbar();
    if (UserAction.getStorage('listRegisters'))
        formLogin('login');
    else
        formLogin('register');

    initControl();    
} else {
    initConfig();
    document.getElementById('login').remove();
    initControl();
    toolbar({ state: 'logado' });
    content(header);
}
