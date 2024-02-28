
const urlGet = (key)=>{
  let query = location.search.slice(1);
  let partes = query.split('&');
  let data = {};
  partes.forEach(function (parte) {
      let chaveValor = parte.split('=');
      let chave = chaveValor[0];
      let valor = chaveValor[1];
      data[chave] = valor;
  })

  return  decodeURI(data[key]);
}

const SET = ()=>{
  let query = location.search.slice(1);
  let partes = query.split('&');
  let data = {};
  partes.forEach(function (parte) {
      let chaveValor = parte.split('=');
      let chave = chaveValor[0];
      let valor = chaveValor[1];
      data[chave] = valor;
  })
  //console.log(data)
  if(data['App'])
    localStorage.setItem("App",decodeURI(data['App']));
}

const GET = (key)=>{
  SET();
  let get = localStorage.getItem("App")
  if(get){
    get = JSON.parse(get)
    return get[key]
  }

}

module.exports =  {
  urlGet : urlGet,
  GET : GET
};