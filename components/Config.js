
const Config = prepare => {
  const config = JSON.parse(localStorage.getItem("config"))

  let html = document.createElement('div');
  html.id = 'content-config';
  html.setAttribute('class', `hide ${prepare ? "show" : ""}`);
  html.innerHTML = `
    <div class="configs form">
      <form class="config" onsubmit="return false">
        <div class='campo'>
          <div class='input'>
            <label><span class="material-icons">http</span></label>
            <span class="label">subdomínio</span>
            <input type="text" name="subdomain" placeholder="Subdomain" value="${config.subdomain ? config.subdomain : ""}">
          </div>

          <div class='input'>
            <label><span class="material-icons">update</span></label>
            <span class="label">intervalo em segundos</span>
            <input type="text" name="interval" placeholder="60" value="${config.interval}">
          </div>
        </div>
        <div class='campo'>
          <div class='input'>
            <label><span class="material-icons">home</span></label>
            <span class="label">host MySQL</span>
            <input type="text" name="host" placeholder="localhost"  value="${config.DAO.host}">
          </div>

          <div class='input'>
          <label><span class="material-icons">system_update_alt</span></label>
          <span class="label">porta MySQL</span>
          <input type="text" name="port" placeholder="3306" value="${config.DAO.port}">
        </div>
        </div>
        <div class='campo'>
          <div class='input'>
            <label><span class="material-icons">person</span></label>
            <span class="label">user MySQL</span>
            <input type="text" name="user" placeholder="User"  value="${config.DAO.user}">
          </div>
        </div>
        <div class='campo'>
          <div class='input'>
            <label><span class="material-icons">lock</span></label>
            <span class="label">senha MySQL</span>
            <input type="text" name="password" placeholder="Password"  value="${config.DAO.password}">
          </div>
        </div>
        <div class='campo'>
          <div class='input'>
            <label><span class="material-icons">view_in_ar</span></label>
            <span class="label">nome do banco MySQL</span>
            <input type="text" name="database" placeholder="Data Base"  value="${config.DAO.database}">
          </div>
        </div>
        <button id="btnConfig">SALVAR</button>
      </form>
    </div>`;

  return html
}

module.exports = Config;