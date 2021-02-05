
const Config = prepare => {
  const config = JSON.parse(localStorage.getItem("config"))

  let html = document.createElement('div');
  html.id = 'content-config';
  html.setAttribute('class', `hide ${prepare ? "show" : ""}`);
  html.innerHTML = `
    <div class="configs form">
      <form class="config" onsubmit="return false">
        <div class='campo'>
          <label><span class="material-icons">http</span></label>
          <input type="text" name="subdomain" placeholder="Subdomain" value="${config.subdomain}">
        </div>
        <div class='campo'>
          <label><span class="material-icons">home</span></label>
          <input type="text" name="host" placeholder="Host"  value="${config.DAO.host}">
        </div>
        <div class='campo'>
          <label><span class="material-icons">person</span></label>
          <input type="text" name="user" placeholder="User"  value="${config.DAO.user}">
        </div>
        <div class='campo'>
          <label><span class="material-icons">lock</span></label>
          <input type="text" name="password" placeholder="Password"  value="${config.DAO.password}">
        </div>
        <div class='campo'>
          <label><span class="material-icons">view_in_ar</span></label>
          <input type="text" name="database" placeholder="Data Base"  value="${config.DAO.database}">
        </div>
        <button id="btnConfig">SALVAR</button>
      </form>
    </div>`;

  return html
}

module.exports = Config;