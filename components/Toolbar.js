
const APP = require(__dirname+'/../hellpers/GET');
// TOLLBAR

const toolbar = props =>{
    let div = document.createElement('div');
    div.id = "toolbar";
    div.innerHTML = `
    <div class="toollbar">
        <div class="icon"><img src="./assets/icons/win/android-chrome-192x192.ico" alt=""></div>
        ${props && props.state == "logado"?`
            <div class="menu">
                <ul>
                    <li id="logout">logout</li>
                    <li id="configs">configs</li>
                    <li id="events">events</li>
                </ul>
            </div>
        `: '' }
        <div class="apptitle">${APP('name')}</div>
        <div class="buttons">
            <ul>
                <li class="min">–</li>
                <li class="max">◻</li>
                <li class="unmax">🗖</li>
                <li class="close">✕</li>
            </ul>
        </div>
    </div>
    `;
    document.getElementById("app").appendChild(div);
}

module.exports = toolbar;
