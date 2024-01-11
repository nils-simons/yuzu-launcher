document.getElementById('refresh').addEventListener('click', async (e) => {
  e.target.innerHTML = '...';
  var config = fs.readFileSync('config.json', 'utf8');
  var config = JSON.parse(config);
  var gameList = await loadGames(config.gameDir)
  console.log(gameList)
  e.target.innerHTML = '<i class="fa-solid fa-arrows-rotate"></i>';
});