/***************************************************************
 * LOGIN FUNCTIONS
 **************************************************************/
const  UserAction  = require(__dirname+'/User');
const Login = {};

// Valida as informacoes de login

const validLogin = async props=>{
    let user = await UserAction.getUser(props.username);
    if(user){
        console.log(props.username )
        if(user.username !== props.username){
            return {error:"Usuário não encontrado"}; 
        }else if(props.senha == ""){
            return {error:"A senha não deve ser vazia"};       
        }else if(user.senha !== props.senha){
            return {error:"Senha incorreta"};
        }else{                     
            setLogin(user);
            return {success:true};
        }
    }     
    if(props.username == "")
        return {error:"Digite seu username"};
    else
        return {error:"Houve algum problema"};
}

// Aloca um usuario logado por 30 dias

const setLogin = props=>{
    let time = new Date();
    let outraData = new Date();    
    let user = {
        user : props,
        expire: outraData.setDate(time.getDate() + 30)
    }
    localStorage.setItem("logon", JSON.stringify(user));
}

// Dispara mensagens na tela

Login.loginMsg = str=>{
    document.querySelector("#login .msg").innerHTML = str;
}

// Cria um novo registro de usuario

Login.callToRegister = function(){
    event.preventDefault();
    let form = this.closest('form');    
    let nome = form.querySelector('[name=nome]').value;
    let email = form.querySelector('[name=email]').value;
    let username = form.querySelector('[name=username]').value;
    let senha = form.querySelector('[name=senha]').value;
    UserAction.setUser({name:nome,email:email,senha:senha,username:username});
}

// Loga o usuario

Login.callToLogin = async function(){
    event.preventDefault();
    let form = this.closest('form');    
    let username = form.querySelector('[name=username]').value;
    let senha = form.querySelector('[name=senha]').value;
    let logon =  await validLogin({senha:senha,username:username});
    console.log(logon)
    if(logon.success){
        window.location.reload()
    }else{
        Login.loginMsg(logon.error);
    }
}

// Checa se existe um login ativo
 
Login.appLogout = ()=>{
     localStorage.removeItem("logon");
     window.location.reload();
}
 
// Pega os dados do usuario logado

Login.getLogon = function(){
     return localStorage.getItem('logon'); 
}


module.exports = Login;