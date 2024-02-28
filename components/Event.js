const Mysql = require('../controller/Mysql');
const remote = require(__dirname + '/../controller/Remote');
const Message = require(__dirname + '/../hellpers/Messages');
const Log = require(__dirname + '/../hellpers/LogSystem');
const fs = require('fs');
const zlib = require('zlib');
const request = require('request');
const { getStorage } = require('../controller/User');
const interval = 60
const PATH_LOG = "/applok/logs/log.txt"
const Time_Next_Request = {};
const Relaunch_Time = {
    setup: 3,
    current: 0
}
var STATE_CONECTION = false
var st_selectLegado = false;
;

const App = {}
App.online = false;
App.tables = "";

// INICIA O OBJETO DE PROCESSOS

const Process = JSON.parse(localStorage.getItem("config"))
const INI = JSON.parse(localStorage.getItem("INI"))

const Ucfirst = (string) => {
    return string
        .charAt(0)
        .toUpperCase() + string.slice(1);
}

// UPLOAD DE ARQUIVOS
const UploadFile = async (process, filename) => {

    return new Promise((resolve, reject) => {
        const fileContents = fs.createReadStream(`${process.instance}/${filename}`);
        const writeStream = fs.createWriteStream(`${process.instance}/${filename}.gz`);
        const zip = zlib.createGzip();
        fileContents
            .pipe(zip)
            .pipe(writeStream)
            .on('finish', (err) => {
                if (err)
                    return reject(err);
                else
                    resolve();
            }
            )
    }).then(() => {

        const formData = {
            image: fs.createReadStream(`${process.instance}/${filename}.gz`)
        };
        request.post({
            url: `http://${process
                .subdomain
                .toLowerCase()}.applok.com.br/api/upload`,
            formData: formData
        }, function optionalCallback(err, httpResponse, body) {
            if (err) {
                return console.error('upload failed:', err)
            }
            fs.unlink(`${process.instance}/${filename}.gz`, () => {
                console.log(`Deletado ${process.instance}/${filename}.gz`)
            });
            console.log(JSON.parse(body))
        })
    })

}

const SincronizaAll = async (process, contador, callback) => {
    Mysql
        .select(process, contador)
        .then(res => {
            let status_banco = {
                total: res[0].total,
                sinc: res[0].sincronizado
            }

            let percent = 0;
            if (res[0].total == res[0].sincronizado)
                percent = 100;
            else {
                percent = parseInt((100 / res[0].total) * res[0].sincronizado);
            }
            console.log(process.subdomain, status_banco, { percent: percent })
            document
                .getElementById(process.id)
                .querySelector('.sinc b')
                .innerHTML = percent + "%"
            if (percent >= 100) {
                document
                    .getElementById(process.id)
                    .querySelector('.sinc')
                    .classList
                    .add("ok")

                if (!JSON.parse(localStorage.getItem("sinc"))[process.subdomain] > 0) {
                    let msg = "Banco Sincronizado"
                    setLog({
                        success: msg
                    }, msg, process.subdomain)
                    let type = "success"
                    Message(msg, type)

                    let sinc = JSON.parse(localStorage.getItem("sinc"))
                    sinc[process.subdomain] = 1
                    localStorage.setItem("sinc", JSON.stringify(sinc))
                }

            } else {
                document
                    .getElementById(process.id)
                    .querySelector('.sinc')
                    .classList
                    .remove("ok")

                //if(callback && !st_selectLegado )
                if (callback)
                    callback();
            }

            let config = JSON.parse(localStorage.getItem("config"))
            config[process.key].status_banco = status_banco
            localStorage.setItem("config", JSON.stringify(config))
        })
}
// TESTE DE CONEXAO MYSQL

const CheckMySQLConection = async (DAO, name) => {
    return await Mysql
        .connect(DAO, name)
        .then(res => {
            //testConnect()
            if (!res) {
                let msg = `Conexão com o banco falhou para o processo ${Ucfirst(name)}!<br> Verifique se os dados estão corretos`
                let type = "error"
                Message(msg, type)
                return false
            } else {
                return true
            }
        })
}

// SINALIZA A CONEXAO COM O MYSQL

const testConnectMySQL = (MySQLconnect, id) => {
    if (!MySQLconnect) {
        document
            .getElementById(id)
            .querySelector('.statusMysql')
            .innerHTML = "<span><i class='circle c-red'></i></span> MySql"
    } else {
        document
            .getElementById(id)
            .querySelector('.statusMysql')
            .innerHTML = "<span><i class='circle c-green'></i></span> MySql"
    }
}

// SINALIZA A CONEXAO COM A API

const testConnectAPI = (id) => {
    if (STATE_CONECTION != false && STATE_CONECTION != "false" && App.online) {
        document
            .getElementById(id)
            .querySelector('.statusAPI')
            .innerHTML = "<span><i class='circle c-green'></i></span> API ";
    } else {
        document
            .getElementById(id)
            .querySelector('.statusAPI')
            .innerHTML = "<span><i class='circle c-red'></i></span> API ";
    }
}
// SINALIZA A SE ESTA EM EXECUSSAO

const testConnectRequest = (exec, id, process) => {

    if (exec && JSON.parse(localStorage.getItem('statusProcess'))[process]) {
        document
            .getElementById(id)
            .querySelector('.statusRequest')
            .innerHTML = "<span><i class='circle c-green'></i></span> Executando"
    } else {
        document
            .getElementById(id)
            .querySelector('.statusRequest')
            .innerHTML = "<span><i class='circle c-red'></i></span> Parado"
    }
}


// SINALIZA SE HA CONAXAO DE INTERNET

const checkOnlineStatus = async () => {
    try {
        const online = await fetch("https://cdn-designermx.vercel.app/js/status.js")
        App.online = true;
        return online.status >= 200 && online.status < 300
    } catch (err) {
        App.online = false;
        return false;
    }
}

const checkRelaunch = () => {
    //console.log('checou -> time:'+Relaunch_Time.current)
    if (Relaunch_Time.current >= (3600 * Relaunch_Time.setup)) {
        remote.relaunch();
    } else
        Relaunch_Time.current = Relaunch_Time.current + 5;
}

const online = async () => {
    let on = false;
    checkRelaunch()
    on = await checkOnlineStatus()

    if (on) {
        statusConect.innerHTML = "<span><i class='circle c-green'></i></span><span><i class='circle c-green'></i><" +
            "/span> On-line ";
        return true
    } else {
        statusConect.innerHTML = "<span><i class='circle c-red'></i></span><span><i class='circle c-red'></i></spa" +
            "n> Off-line";
        return false
    }
}

// GRAVA OS LOGS DE REQUISICAO

const setLog = (res, msg, subdomain) => {
    if (!fs.existsSync(PATH_LOG)) { // SE NAO EXISTE CRIA O ARQUIVO DE LOG
        fs.mkdir("/applok/logs/", {
            recursive: true
        }, (err) => {
            if (err)
                return console.error(err);
        }
        )
        Log.Createlog(PATH_LOG)
    }
    Log.Writelog(PATH_LOG, res, msg, subdomain) // ESCREVE NO LOG
}

// REQUEST NA API

const ResquestWS = async (process) => {
    let msg = "";
    testConnectAPI(process.id)
    if (process.App.config) {
        if (App.online !== false) {
            if (JSON.parse(localStorage.getItem("statusSinc"))[process.subdomain] > 0)
                fetchWS(process, null, false)
        } else {
            msg = "Sem Conexão! (Off-line)"
            setLog({
                error: msg
            }, msg, process.subdomain)
            let type = "error"
            Message(msg, type)
        }
    }
}

const TimeRequest = (item) => {
    Time_Next_Request[item.subdomain] = {}
    Time_Next_Request[item.subdomain].interval = item.interval;
    Time_Next_Request[item.subdomain].id = item.id;
}

const UpdateInterval = () => {
    setInterval(() => {
        Object.keys(Time_Next_Request).forEach(item => {
            let request = Time_Next_Request[item];
            let time = 0;
            testConnectRequest(App.online, request.id, item)
            if (Time_Next_Request[item].interval > 0)
                Time_Next_Request[item].interval = request.interval - 1;

            if (JSON.parse(localStorage.getItem('statusProcess'))[item])
                time = Time_Next_Request[item].interval;

            document.getElementById(request.id).querySelector('.timeRequest b').innerHTML = time + "s";
        })

    }, 1000);
}

const selectLegado = (process) => {
    let SqlConfig = JSON.parse(localStorage.getItem("SqlConfig"))
    const body = {
        sincroniza: {
            count: 0,
            data: {}
        }
    }

    let contador = SqlConfig.contador;
    delete SqlConfig.contador
    delete SqlConfig.tables

    let n = 0

    const legado = () => {
        st_selectLegado = true;
        Object.keys(SqlConfig).forEach(key => {
            let sql = SqlConfig[key]
            Mysql.select(process, sql)
                .then(res => {
                    if (res != "") {
                        let sinc = JSON.parse(localStorage.getItem("sinc"))
                        sinc[process.subdomain] = 0
                        localStorage.setItem("sinc", JSON.stringify(sinc))
                        body.sincroniza.count++;
                        body.sincroniza.data[key] = res;
                        console.log(body);
                    }

                    n++;

                    if (Object.keys(SqlConfig).length == n) {
                        if (body.sincroniza.count > 0) {
                            fetchWS(process, body, false, () => {
                                st_selectLegado = false;
                                //console.log("st_selectLegado "+ st_selectLegado)
                                SincronizaAll(process, contador)
                            })
                        }
                    }
                })
        })
    }

    SincronizaAll(process, contador, legado)
}

const ExecMysql = async (process, res, callback) => {

    if (!JSON.parse(localStorage.getItem('statusProcess'))[process.subdomain])
        return;

    if (res.body) {
        let insert = res.body.INSERT
        let update = res.body.UPDATE

        const body = {
            registers_afecteds: {
                count: 0,
                ref: {}
            }
        }
        let n = 0
        let n2 = 0;
        if (insert && insert.count > 0) {
            let tables = insert.tables
            tables.forEach((table) => {
                if (table.count > 0) {
                    let listValues = table.values

                    body.registers_afecteds.ref[table.name] = {
                        collumn: table.ref,
                        values: []
                    }
                    Object.keys(listValues).forEach((key) => {
                        values = listValues[key]
                        let query = `INSERT INTO ${table.name}(${table.collumns}) VALUES (${values});`
                        console.log("query = " + query);
                        Mysql.insert(process, query)
                            .then(result => {
                                console.log("result query = " + result);
                                body.registers_afecteds.ref[table.name].values.push(key);
                                body.registers_afecteds.count++

                                n++;
                                if (insert.count == n)
                                    if (res.header && res.header.connection == "open") {
                                        fetchWS(process, body, false)
                                    }
                            }).catch(err => {
                                console.log("error query = " + err);
                                // body.registers_afecteds.ref[table.name].values.push(key);
                                // body.registers_afecteds.count++
                                // n++;
                                // if (insert.count == n) {
                                //     if (res.header && res.header.connection == "open") {
                                //         fetchWS(process, body, false)
                                //     }
                                // }
                            });

                    })
                }
            })
        }
        //Retorna tudo que foi inserido

        if (update && update.count > 0) {
            let tables2 = update.tables;
            tables2.forEach((table) => {

                if (table.count > 0) {
                    let listValues = table.values

                    body.registers_afecteds.ref[table.name] = {
                        collumn: table.ref,
                        values: []
                    }

                    if (table.name == 'produto') {
                        let ids = "'" + Object.keys(listValues).join("','") + "'"
                        let sql = `SELECT IMAGEM FROM produto WHERE CODIGO IN (${ids})`

                        Mysql.update(process, sql)
                            .then(result => {
                                console.log(result)
                                result.forEach(filename => {
                                    if (filename['IMAGEM'] != "" && filename['IMAGEM'] != null) {
                                        filename = (filename['IMAGEM'].trim()).split('.');
                                        let ext = filename.pop().toLowerCase();
                                        filename = filename.join('.') + "." + ext;

                                        UploadFile(process, filename)
                                    }
                                })
                            })

                    }// endif

                    Object.keys(listValues).forEach((key) => {

                        values = listValues[key]
                        let query = `UPDATE ${table.name} SET ${formatQueryUpdate(table.collumns, values)} WHERE ${table.ref} = '${key}';`
                        //console.log(query)
                        Mysql.update(process, query)
                            .then(result => {
                                console.log(result);
                                if (result.affectedRows > 0) {
                                    body.registers_afecteds.ref[table.name].values.push(key);
                                    body.registers_afecteds.count++
                                }
                                n2++;

                                if (update.count == n2++)
                                    if (callback)
                                        callback();

                                if (res.header && res.header.connection == "open") {
                                    fetchWS(process, body, false)
                                }
                            })

                    })

                } // endif
            })
        }
    }

}

// FORMATOS DE QUERIES

const formatQueryUpdate = (collumns, values) => {

    collumns = collumns.split(",");
    values = values.split(",");
    let concat = ""
    collumns.forEach((collumn, i) => {
        concat += `${collumn}=${values[i].trim()}`

        if (collumns.length > (i + 1))
            concat += ","
    })
    return concat;
}

// FETCH DO REQUEST API

const fetchWS = async (process, body, start, callback) => {
    if (!process.subdomain)
        return

    if (!start && !JSON.parse(localStorage.getItem('statusProcess'))[process.subdomain])
        return;

    let opts
    let headers = {
        key: "applok",
        token: "123456",
        state: STATE_CONECTION,
        tables: App.tables
    }
    if (body != null) {
        opts = {
            headers: headers,
            method: "POST",
            body: JSON.stringify(body)
        }
        console.log(JSON.stringify(body));

    } else {
        opts = {
            headers: headers,
            method: "POST"
        }
    }

    return await fetch(INI["API." + process.subdomain.toLowerCase()], opts)
        .then(res => res.json()
            .then(res => {
                if (res.error) {
                    setLog(res, res.error, process.subdomain)
                    return false
                } else {
                    if (res.state) {
                        STATE_CONECTION = res.state
                        testConnectAPI(process.id)
                    }
                    setLog(res, res.success, process.subdomain)
                    console.log(res)
                    ExecMysql(process, res, callback);
                    return true
                }
            }))
        .catch(function (error) {
            App.online = false;
            return false
        })
}

const Event = () => {
    let html = document.createElement('div');
    html.id = 'event';
    html.innerHTML = `
      <div class="events">
          <section id="loadEvents">
              Ainda não houve nenhum evento
          </section>
      </div>
  `;
    setInterval(online, 5000)
    UpdateInterval();
    document.getElementById('content-event').appendChild(html);

}

online().then(() => {
    Process.forEach((item, i) => {
        item.App = {
            config: false,
            MySQLconnect: false
        }
        item.id = 'processo_' + i
        item.key = i

        CheckMySQLConection(item.DAO, item.subdomain).then(res => {

            item.App.MySQLconnect = res

            if (item.App.MySQLconnect && item.subdomain != "" && config.instance != "" && item.DAO.user != "" && item.DAO.password != "" && item.DAO.database != "")
                item.App.config = true

            testConnectMySQL(item.App.MySQLconnect, item.id)

            let SqlConfig = JSON.parse(localStorage.getItem("SqlConfig"))
            App.tables = SqlConfig.tables;
            SincronizaAll(item, SqlConfig.contador)

            fetchWS(item, null, true).then(res => {
                item.interval = item.interval ? item.interval : interval;
                ResquestWS(item);
                TimeRequest(item);
                if (res)
                    setInterval(() => {
                        ResquestWS(item);
                        TimeRequest(item);
                        selectLegado(item)
                    }, 1000 * (item.interval));
            }
            )

        })
    });
})

module.exports = Event;
