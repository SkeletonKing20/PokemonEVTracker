var request = new XMLHttpRequest();
request.open("GET", "pokedex.json", false);
request.send(null)
var obj = JSON.parse(request.responseText);

var select = document.getElementById('pokemon-list');
for (let i = 0; i < obj.pokemon.length; i++) {
    var opt = document.createElement('option');
    opt.value = i;
    opt.innerHTML = obj.pokemon[i].Name;
    select.appendChild(opt);
}

function selectPokemon(index) {
    let pok = obj.pokemon[index];
    let baseStats = document.getElementById('base-stats');
    baseStats.children[1].innerHTML = pok.BaseHP;
    baseStats.children[2].innerHTML = pok.BaseATK;
    baseStats.children[3].innerHTML = pok.BaseDEF;
    baseStats.children[4].innerHTML = pok.BaseSP_ATK;
    baseStats.children[5].innerHTML = pok.BaseSP_DEF;
    baseStats.children[6].innerHTML = pok.BaseSPEED;
}