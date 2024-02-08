var obj;

window.addEventListener('load', function() {
    var request = new XMLHttpRequest();
    request.open("GET", "pokedex.json", false);
    request.send(null)
    obj = JSON.parse(request.responseText);

    var select = document.getElementById('pokemon-list');
    for (let i = 0; i < obj.pokemon.length; i++) {
        var opt = document.createElement('option');
        opt.value = i;
        opt.innerHTML = obj.pokemon[i].Name;
        select.appendChild(opt);
    }

    select.selectedIndex = -1;

    let nodes = document.querySelectorAll('input[type="number"]')
    nodes.forEach((el) => {
        el.addEventListener("change", enforceInputMinMax(el));
        console.log("hi");
    });
})


function selectPokemon(index) {
    let pok = obj.pokemon[index];
    let baseStats = document.getElementById('base-stats');
    let ivStats = document.getElementById('iv-stats');
    let evStats = document.getElementById('ev-stats');
    let finalStats = document.getElementById('final-stats');
    let level = document.getElementById('level').children[1].children[0].value;
    baseStats.children[1].children[0].value = pok.BaseHP;
    baseStats.children[2].children[0].value = pok.BaseATK;
    baseStats.children[3].children[0].value = pok.BaseDEF;
    baseStats.children[4].children[0].value = pok.BaseSP_ATK;
    baseStats.children[5].children[0].value = pok.BaseSP_DEF;
    baseStats.children[6].children[0].value = pok.BaseSPEED;

    for (let i = 1; i < ivStats.children.length; i++) {
        ivStats.children[i].children[0].value = 0;
    }

    for (let i = 1; i < evStats.children.length; i++) {
        evStats.children[i].children[0].value = 0;
    }

    finalStats.children[1].children[0].value = calcHP(pok.BaseHP, 0, 0, level);
    finalStats.children[2].children[0].value = calcOtherStat(pok.BaseATK, 0, 0, level);
    finalStats.children[3].children[0].value = calcOtherStat(pok.BaseDEF, 0, 0, level);
    finalStats.children[4].children[0].value = calcOtherStat(pok.BaseSP_ATK, 0, 0, level);
    finalStats.children[5].children[0].value = calcOtherStat(pok.BaseSP_DEF, 0, 0, level);
    finalStats.children[6].children[0].value = calcOtherStat(pok.BaseSPEED, 0, 0, level);
}

function enforceInputMinMax(el) {
    if (el.value < el.min) {
        el.value = el.min;
    }
    if (el.value > el.max) {
        el.value = el.max;
    }
}

function calcHP(base, iv, ev, level) {
    return parseInt((((2 * base + iv + (ev / 4)) * level) / 100) + parseInt(level) + 10);
}

function calcOtherStat(base, iv, ev, level) {
    return parseInt((((2 * base + iv + (ev / 4)) * level) / 100) + 5);
}