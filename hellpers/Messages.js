const Message = (msg, type)=>{
  const idMsg = new Date().getTime();
  let html = `
    <div id=${idMsg} class='msg ${type}'>
      <span>${msg}</span>
    </div>
    `
    document.getElementById("messages").insertAdjacentHTML("afterbegin", html);

    setTimeout(()=> {
      if(document.getElementById(idMsg))
        document.getElementById(idMsg).remove() 
    } ,10000)
}

module.exports = Message