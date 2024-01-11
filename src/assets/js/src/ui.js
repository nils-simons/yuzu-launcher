const ipcRender = require('electron').ipcRenderer;
const GameController = require('./assets/js/utils/GameController.js');

const settingsDia = document.getElementById('settings-dia');

document.getElementById('settings-btn').addEventListener('click', (e) => {
  settingsDia.show();
  var config = fs.readFileSync('config.json', 'utf8');
  var config = JSON.parse(config);
  document.getElementById('settings-i-path').value = config.gameDir;
})


document.getElementById('settings-close').addEventListener('click', (e) => {
  settingsDia.close();
})



let isFullScreen = true;

if (!isFullScreen) {
    document.getElementById('fullscreen').innerHTML = '<i class="fa-solid fa-expand"></i>';
} else {
    document.getElementById('fullscreen').innerHTML = '<i class="fa-solid fa-compress"></i>';
}

document.getElementById('fullscreen').addEventListener('click', (e) => {
    ipcRender.send('fullscreen', { value: !isFullScreen });
    isFullScreen = !isFullScreen;

    if (!isFullScreen) {
        document.getElementById('fullscreen').innerHTML = '<i class="fa-solid fa-expand"></i>';
    } else {
        document.getElementById('fullscreen').innerHTML = '<i class="fa-solid fa-compress"></i>';
    }
    console.log(isFullScreen)
});

document.getElementById('close').addEventListener('click', (e) => {
    ipcRender.send('close');
});

(async () => {
  const gameController = new GameController();
  await gameController.init();


  let isGuidePressed = false;
  gameController.on('button', async (btn) => {
    if (isGuidePressed) { return }
    isGuidePressed = true;
    if (btn == '"GUIDE"') { ipcRender.send('isWinOnTop'); }
    await new Promise(r => setTimeout(r, 100));
    isGuidePressed = false;
  })
})();


ipcRender.on('respIsWinOnTop', (e, data) => {
  console.log(data.value);
  console.log('setting to: '+!data.value)
  ipcRender.send('winOnTop', { value: !data.value });
  if (!data.value) {
    ipcRender.send('showWin', { value: false });
    ipcRender.send('click');
  } else {
    ipcRender.send('showWin', { value: true });
  }
});