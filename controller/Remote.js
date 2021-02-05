
const electron = require('electron');
const ipc = electron.ipcRenderer;

const RemoteControl = {};

RemoteControl.closeWindow = ()=>{ 
    const config = JSON.parse(localStorage.getItem("config"))
    if(localStorage.getItem('logon') == null || config.host == "" || config.DAO.host == "" || config.DAO.user == "" || config.DAO.password == "" || config.DAO.database == "")
        ipc.send('close');
    else
        ipc.send('hide')
}

RemoteControl.minWindow = ()=>{
    ipc.send('minimize');
    document.querySelector('html').removeAttribute('class')
}

RemoteControl.maxWindow = ()=>{
    ipc.send('maximize');
    document.querySelector('.unmax').style.display= "flex";
    document.querySelector('.max').style.display= "none";
    
    document.querySelector('html').setAttribute('class','maximized')
}
    

RemoteControl.unMaxWindow = ()=>{
    ipc.send('unmaximize');
    document.querySelector('.max').style.display= "flex";
    document.querySelector('.unmax').style.display= "none"; 
    document.querySelector('html').removeAttribute('class')
}
    

RemoteControl.isMaximized = ()=>{
    return ipc.send('ismaximized');
}

RemoteControl.relaunch = ()=>{
    return ipc.send('relaunch');
}

module.exports = RemoteControl; 