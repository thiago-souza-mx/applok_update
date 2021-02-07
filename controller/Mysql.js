// user: festah
// senha: Uo8uhoBMWxSCyVzo
const user = "festah"
const senha = "Uo8uhoBMWxSCyVzo"
const host = "localhost"
const porta = "3306"
const banco = "festahbrasilia"


const connect = async props =>{
  const dao = {}
  dao.user  = ( props.user  != "" ) ? props.user  : user
  dao.senha = ( props.password != "" ) ? props.password : senha
  dao.host  = ( props.host  != "" ) ? props.host  : host
  dao.porta = ( props.port != "" ) ? props.port : porta
  dao.banco = ( props.database != "" ) ? props.database : banco
  
  if(global.connection && global.connection.state !== 'disconnected')
      return global.connection
  try{
    const mysql = require("mysql2/promise")
    const connection = await mysql.createConnection(`mysql://${dao.user}:${dao.senha}@${dao.host}:${dao.porta}/${dao.banco}`);
    console.log("Conectou no MySQL!")
  
    global.connection = connection
    return connection
  }catch(err){
    console.log(err)
    return false
  }
}

module.exports = connect;