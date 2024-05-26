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

// (async () => {
//   const gameController = new GameController();
//   await gameController.init();


//   let isGuidePressed = false;
//   gameController.on('button', async (btn) => {
//     if (isGuidePressed) { return }
//     isGuidePressed = true;
//     if (btn == '"GUIDE"') { ipcRender.send('isWinOnTop'); }
//     await new Promise(r => setTimeout(r, 100));
//     isGuidePressed = false;
//   })
// })();


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

















const GAMEPAD_MAPPING = [
  'Cross (A)',    // Button 0
  'Circle (B)',   // Button 1
  'Square (X)',   // Button 2
  'Triangle (Y)', // Button 3
  'L1',           // Button 4
  'R1',           // Button 5
  'L2',           // Button 6
  'R2',           // Button 7
  'Share',        // Button 8
  'Options',      // Button 9
  'L3',           // Button 10
  'R3',           // Button 11
  'D-Pad Up',     // Button 12
  'D-Pad Down',   // Button 13
  'D-Pad Left',   // Button 14
  'D-Pad Right',  // Button 15
  'GUIDE',    // Button 16
  'Touchpad'      // Button 17
];







window.addEventListener('gamepadconnected', (event) => {
  const gamepad = event.gamepad;
  console.log('Gamepad connected:', gamepad);

  let previousButtonStates = new Array(gamepad.buttons.length).fill(false);

  function update() {
    const gp = navigator.getGamepads()[gamepad.index];
    if (gp) {
      for (let i = 0; i < gp.buttons.length; i++) {
        const btn = gp.buttons[i];
        const buttonName = GAMEPAD_MAPPING[i] || `Button ${i}`;

        if (btn.pressed && !previousButtonStates[i]) {
          // Button was just pressed
          console.log(`Button pressed: ${buttonName} (Index: ${i})`);
          // console.log(btn);
          // console.log(`Axis 0: ${gp.axes[0]}`);

          if (buttonName == 'GUIDE') {
            console.log('GUIDE');
            // ipcRender.send('showWin', true)
            // ipcRender.send('winOnTop', true)
            
          }
        }

        // Update previous button state
        previousButtonStates[i] = btn.pressed;
      }
    }
    requestAnimationFrame(update);
  }

  update();
});

window.addEventListener('gamepaddisconnected', (event) => {
  const gamepad = event.gamepad;
  console.log('Gamepad disconnected:', gamepad);
});