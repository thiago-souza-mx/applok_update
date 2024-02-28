// C:\Users\sdkca\Desktop\electron-workspace\build.js
var electronInstaller = require('electron-winstaller');

// In this case, we can use relative paths
var settings = {
    // Specify the folder where the built app is located
    appDirectory: './release-builds/applok_update-win32-ia32',
    // Specify the existing folder where 
    outputDirectory: './installer',
    // The name of the Author of the app (the name of your company)
    authors: 'DesignerMX',
    // The name of the executable of your built
    exe: './applok_update.exe',

    iconUrl:'c:/www/applok_update/assets/icons/win/android-chrome-192x192.ico',

    setupIcon: './assets/icons/win/android-chrome-192x192.ico',

    loadingGif: './assets/icons/win/splash.gif',

    setupExe:'Applock_installer.exe',

    noMsi:true
};

resultPromise = electronInstaller.createWindowsInstaller(settings);
 
resultPromise.then(() => {
    console.log("The installers of your application were succesfully created !");
}, (e) => {
    console.log(`Well, sometimes you are not so lucky: ${e.message}`)
});
