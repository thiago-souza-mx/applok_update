const DataHora = require(__dirname + '/DataHora');
const fs = require('fs');

const Log = {

  Readlog : path => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) {
        console.error(err)
        return
      }
      return data
    })
  },

  Createlog : path => {
    fs.writeFile(path,
      '',
      erro => { if (erro) throw erro; }
    )
  },

  Writelog : (path, data, msg , subdomain) => {
    if(localStorage.getItem("statusLog") > 0){
      let stream = fs.createWriteStream(path, { flags: 'a' });
      stream.write(`[ ${DataHora()} ] [ ${subdomain} ] ${JSON.stringify(data)}\n`);
      stream.end();
    }

    let res = `
          <div class="event new ${subdomain}"><dd>${subdomain}</dd>${msg}<span>${DataHora()}</span></div>
      `
    if (loadEvents.innerHTML.trim() == "Ainda não houve nenhum evento")
      loadEvents.innerHTML = res
    else
      loadEvents.insertAdjacentHTML("afterbegin", res)

    loadEvents.querySelectorAll(".new").forEach(element => {
      setTimeout(() => {
        element.classList.remove("new");
        element.classList.add("motion");
        setTimeout(() => {
          element.classList.remove("motion");
        }, 3000);
      }, 300);
    });


  }
}

module.exports = Log