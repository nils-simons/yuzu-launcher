const fs = require('fs');

if (!fs.existsSync("config.json")) {
    console.log('creating config.json')
    fs.writeFileSync("config.json", JSON.stringify({}))
}

document.getElementById('settings-b-save').addEventListener('click', (e) => {
    fs.writeFileSync("config.json", JSON.stringify({
        gameDir: document.getElementById('settings-i-path').value
    }))
    settingsDia.close();
    loadGames(document.getElementById('settings-i-path').value);
})