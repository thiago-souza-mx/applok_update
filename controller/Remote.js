
const electron = require('electron');
const ipc = electron.ipcRenderer;

const RemoteControl = {};

RemoteControl.closeWindow = () => {
	let close = false;
	const configs = JSON.parse(localStorage.getItem("config"));
  configs.forEach(config => {  
    if (config.subdomain == "" || config.DAO.user == "" || config.DAO.password == "" || config.DAO.database == "")
      close = true
  });
	
//	if (localStorage.getItem('logon') == null )
	//	ipc.send('close');
	//else
		ipc.send('hide')
}

	

RemoteControl.minWindow = () => {
	ipc.send('minimize');
	document.querySelector("html").classList.remove('maximized')
}

RemoteControl.maxWindow = () => {
	ipc.send('maximize');
	document.querySelector('.unmax').style.display = "flex";
	document.querySelector('.max').style.display = "none";

	document.querySelector("html").classList.add('maximized')
}


RemoteControl.unMaxWindow = () => {
	ipc.send('unmaximize');
	document.querySelector('.max').style.display = "flex";
	document.querySelector('.unmax').style.display = "none";
	document.querySelector("html").classList.remove('maximized')
}


RemoteControl.isMaximized = () => {
	return ipc.send('ismaximized');
}

RemoteControl.relaunch = () => {
	return ipc.send('relaunch');
}

module.exports = RemoteControl; 