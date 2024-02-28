const ModelConfig = require(__dirname + '/../model/Config.model');

// user: festah
// senha: Uo8uhoBMWxSCyVzo
const connections = {}
const dao = {
  user : "",
  senha : "",
  host : "localhost",
  porta : "3306",
  banco : ""
}

const conn = async (props ,database) =>{
  if(!props)
    props = ModelConfig.DAO 
  
  dao.user  = ( props.user      != "" ) ? props.user      : dao.user
  dao.senha = ( props.password  != "" ) ? props.password  : dao.senha
  dao.host  = ( props.host      != "" ) ? props.host      : dao.host
  dao.porta = ( props.port      != "" ) ? props.port      : dao.porta
  dao.banco = ( props.database  != "" ) ? props.database  : dao.banco

  
  if( connections && connections[database] && connections[database].state !== 'disconnected')
      return connections[database]
  try{
    const mysql = require("mysql2/promise")
    const connection = await mysql.createConnection(`mysql://${dao.user}:${dao.senha}@${dao.host}:${dao.porta}/${dao.banco}`);
    console.log("Conectou no MySQL!")
    
    connections[database] = connection
    console.log(connections)
    return connection
  }catch(err){
    console.log(err)
    return false
  }
  
}

const MySQL = {
  connect : async (DAO, database) =>{ 
    return await conn(DAO, database)
  },

  select : async (process, _query) =>{    

    const conn = await connections[process.subdomain]
    const [rows] = await conn.query(_query);
    return rows;

  },

  insert : async (process, _query) =>{    

    const conn = await connections[process.subdomain]
    const [rows] = await conn.query(_query);
    return rows;
  },

  update :async (process, _query) =>{    

    const conn = await connections[process.subdomain]
    const [rows] = await conn.query(_query);
    return rows;
  }

}

module.exports = MySQL;