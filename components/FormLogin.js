const  Login  = require(__dirname+'/../controller/Login');

// FORM LOGIN
 
const formLogin = (method)=>{
    let html;
    html=`
    <div class="msg login"></div>
    <div class="form">
        <div class="header">
            <!--div class="${method=="register"?"active":""}"><h2>CADASTRO</h2></div-->
            <div><h2>LOGIN</h2></div>
        </div>
        <!--form class="cadastro ${method=="register"?"active":""}" onsubmit="return false">
            <div class='campo'>
                <label><span class="material-icons">person_outline</span></label>
                <input type="user" name="username" placeholder="Username">
            </div>
            <div class='campo'>
                <label><span class="material-icons">person</span></label>
                <input type="text" name="nome" placeholder="Nome">
            </div>
            <div class='campo'>
                <label><span class="material-icons">email</span></label>
                <input type="mail" name="email" placeholder="E-mail">
            </div>
            <div class='campo'>
                <label><span class="material-icons">lock</span></label>
                <input type="password" name="senha" placeholder="Senha">
            </div>
            <button id="btnRegister">CADASTRAR</button>
        </form-->

        <form class="login active" onsubmit="return false">
            <div class='campo'>
                <label><span class="material-icons">person_outline</span></label>
                <input type="user" name="username" placeholder="Username">
            </div>
            <div class='campo'>
                <label><span class="material-icons">lock</span></label>
                <input type="password" name="senha" placeholder="Senha">
            </div>
            <button id="btnLogin">LOGAR</button>
        </form>
    </div>
    <div class="credits"><i>powered by</i> Designer MX</div>
    `;
    document.getElementById("login").innerHTML = html;
}

module.exports = formLogin;