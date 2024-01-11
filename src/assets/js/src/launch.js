const { exec, spawn } = require('child_process');

async function launch(uid) {
    killYuzuProcess();
    ipcRender.send('winOnTop', { value: true });
    await new Promise(r => setTimeout(r, 500));
    console.log(GAMES[uid]);
    exec(`yuzu -f -g "${GAMES[uid].path}"`);
    await new Promise(r => setTimeout(r, 3000));
    ipcRender.send('winOnTop', { value: false });
}

async function checkYuzuRunning() {
    return new Promise(r => {
        let isRunning = false;
        exec('tasklist', (error, stdout, stderr) => {
            if (stdout.includes('yuzu.exe')) {
                isRunning = true;
            }
            r(isRunning);
        })
    });
}

function killYuzuProcess() {
    exec(`taskkill /F /IM yuzu.exe`);
}

// setInterval(async () => {
//     var isRun = await checkYuzuRunning();
//     if (!isRun) {
//         ipcRender.send('winOnTop', { value: true });   
//     } else {
//         ipcRender.send('winOnTop', { value: false });   
//     }
// }, 3000);