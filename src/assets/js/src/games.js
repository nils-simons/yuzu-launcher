const path = require('path');
const axios = require('axios');
const uuid = require('uuid');


let GAMES = {}

const gamesCont = document.getElementById('games')

async function loadGames(dir) {
    return new Promise(async (resolve) => {
        gamesCont.innerHTML = 'Loading...';
        var files = fs.readdirSync(dir);
        const nspFiles = files.filter(file => path.extname(file) === '.nsp');
    
        let games = [];
    
        gamesCont.innerHTML = ''
        for (let f = 0; f < nspFiles.length; f++) {
            const file = nspFiles[f];
            var gameId = extractGameTitleId(file);
    

            let imgUrl = './assets/img/no-img.png';
            try {
                var resp = await axios.request({
                    method: 'get',
                    maxBodyLength: Infinity,
                    url: `https://tinfoil.media/thi/${gameId}/0/0/`,
                    headers: { }
                })
                if (resp.status == 200) {
                    imgUrl = `https://tinfoil.media/thi/${gameId}/0/0/`;
                }
            } catch (error) {
                imgUrl = './assets/img/no-img.png';
                
            }

            gobj = {
                path: path.join(dir, file),
                titleId: gameId,
                img: imgUrl
            }
            var uid = uuid.v4();
            GAMES[uid] = gobj

            gamesCont.innerHTML += `
            <div class="game" onclick="launch('${uid}')">
                <img id="img" src="${gobj.img}">
            </div>
            `;
            games.push(gobj)
        }
        resolve(games)
    })
    
}

const extractGameTitleId = (input) => {
    const match = input.match(/\[([^\]]+)\]/);
    return match ? match[1] : null;
};


var config = fs.readFileSync('config.json', 'utf8');
var config = JSON.parse(config);
loadGames(config.gameDir)