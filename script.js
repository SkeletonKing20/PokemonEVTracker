var obj;
var baseStats = document.getElementById('base-stats');
var ivStats = document.getElementById('iv-stats');
var evStats = document.getElementById('ev-stats');
var finalStats = document.getElementById('final-stats');
var natureObj = document.getElementById('nature');

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

    resetStats();

    addPokemon();
})

function resetStats(){
    for (let i = 1; i < 7; i++) {
        baseStats.children[i].children[0].value = 0;        
        ivStats.children[i].children[0].value = 0;
        evStats.children[i].children[0].value = 0;
        finalStats.children[i].children[0].value = 0;
    }
}

function selectPokemon(index) {
    resetStats();

    if(index === "-1"){
        return;
    }

    let pok = obj.pokemon[index];
    baseStats.children[1].children[0].value = pok.BaseHP;
    baseStats.children[2].children[0].value = pok.BaseATK;
    baseStats.children[3].children[0].value = pok.BaseDEF;
    baseStats.children[4].children[0].value = pok.BaseSP_ATK;
    baseStats.children[5].children[0].value = pok.BaseSP_DEF;
    baseStats.children[6].children[0].value = pok.BaseSPEED;

    calcFinalStats();
}

function enforceInputMinMax(el) {
    if (el.value < el.min) {
        el.value = el.min;
    }
    if (el.value > el.max) {
        el.value = el.max;
    }
}

function calcHPStat(base, iv, ev, level) {
    
    return base <= 1 ? 1 : Math.floor(((parseInt(iv) + 2 * parseInt(base) + (parseInt(ev)/4) ) * parseInt(level)/100 ) + 10 + parseInt(level));
}

function calcOtherStat(base, iv, ev, level, natureMod) {
    return Math.floor((((parseInt(iv) + 2 * parseInt(base) + (parseInt(ev)/4) ) * parseInt(level)/100 ) + 5) * natureMod);
}

function calcFinalStats(){
    let level = document.getElementById('level').children[1].children[0].value;

    let mod = getNatureMod(natureObj.value);

    finalStats.children[1].children[0].value = calcHPStat(baseStats.children[1].children[0].value,
                                                    ivStats.children[1].children[0].value,
                                                    evStats.children[1].children[0].value,
                                                    level);

    finalStats.children[2].children[0].value = calcOtherStat(baseStats.children[2].children[0].value,
                                                    ivStats.children[2].children[0].value,
                                                    evStats.children[2].children[0].value,
                                                    level,
                                                    mod[0]);

    finalStats.children[3].children[0].value = calcOtherStat(baseStats.children[3].children[0].value,
                                                    ivStats.children[3].children[0].value,
                                                    evStats.children[3].children[0].value,
                                                    level,
                                                    mod[1]);

    finalStats.children[4].children[0].value = calcOtherStat(baseStats.children[4].children[0].value,
                                                    ivStats.children[4].children[0].value,
                                                    evStats.children[4].children[0].value,
                                                    level,
                                                    mod[2]);
                                                                        
    finalStats.children[5].children[0].value = calcOtherStat(baseStats.children[5].children[0].value,
                                                    ivStats.children[5].children[0].value,
                                                    evStats.children[5].children[0].value,
                                                    level,
                                                    mod[3]);
                                                                            
    finalStats.children[6].children[0].value = calcOtherStat(baseStats.children[6].children[0].value,
                                                    ivStats.children[6].children[0].value,
                                                    evStats.children[6].children[0].value,
                                                    level,
                                                    mod[4]);
}

function getNatureMod(nature){
    switch(nature){
        //increase Attack
        case "lonely":
            return new Array(1.1, 0.9, 1, 1, 1);
        case "adamant":
            return new Array(1.1, 1, 0.9, 1, 1);
        case "Naughty":
            return new Array(1.1, 1, 1, 0.9, 1);
        case "brave":
            return new Array(1.1, 1, 1, 1, 0.9);
        //increase Defense
        case "bold":
            return new Array(0.9, 1.1, 1, 1, 1);
        case "impish":
            return new Array(1, 1.1, 0.9, 1, 1);
        case "lax":
            return new Array(1, 1.1, 1, 0.9, 1);
        case "relaxed":
            return new Array(1, 1.1, 1, 1, 0.9);
        //increase Special Attack  
        case "modest":
            return new Array(0.9, 1, 1.1, 1, 1);
        case "mild":
            return new Array(1, 0.9, 1.1, 1, 1);
        case "rash":
            return new Array(1, 1, 1.1, 0.9, 1);
        case "quiet":
            return new Array(1, 1, 1.1, 1, 0.9);
        //increase Special Defense
        case "calm":
            return new Array(0.9, 1, 1, 1.1, 1);
        case "gentle":
            return new Array(1, 0.9, 1, 1.1, 1);
        case "careful":
            return new Array(1, 1, 0.9, 1.1, 1);
        case "sassy":
            return new Array(1, 1, 1, 1.1, 0.9);
        //increase Speed
        case "timid":
            return new Array(0.9, 1, 1, 1, 1.1);
        case "hasty":
            return new Array(1, 0.9, 1, 1, 1.1);
        case "jolly":
            return new Array(1, 1, 0.9, 1, 1.1);
        case "naive":
            return new Array(1, 1, 1, 0.9, 1.1);
        //neutral
        default:
            return new Array(1, 1, 1, 1, 1);
    }
}

function calcHPIV(base, final, ev, level){ 
    let x = Math.max(Math.min(Math.floor((((parseInt(final) - (parseInt(level) + 10)) * 100) / parseInt(level)) - (2 * parseInt(base) + (parseInt(ev) / 4))), 31),0);
    final = parseInt(final) + 1;
    let y = Math.max(Math.min(Math.floor((((parseInt(final)  - (parseInt(level) + 10)) * 100) / parseInt(level)) - (2 * parseInt(base) + (parseInt(ev) / 4))) - 1, 31),0);
    return x === y ? x : x + " - " + y;
}

function calcHPEV(base, final, iv, level){
    let x = Math.max(Math.min(4 * Math.floor((((parseInt(final) - (parseInt(level) + 10)) * 100) / parseInt(level)) - (2 * parseInt(base) + parseInt(iv))), 255),0);
    final = parseInt(final) + 1;
    let y = Math.max(Math.min(4 * Math.floor((((parseInt(final) - (parseInt(level) + 10)) * 100) / parseInt(level)) - (2 * parseInt(base) + parseInt(iv))) - 1, 255),0);
    return x === y ? x : x + " - " + y;
}

function calcOtherIV(base, final, ev, level, natureMod){
    let x = Math.max(Math.min(Math.floor(((((parseInt(final)/natureMod) - 5) * 100) / parseInt(level)) - (2 * parseInt(base) + (parseInt(ev) / 4))), 31),0);
    final = parseInt(final) + 1;
    let y = Math.max(Math.min(Math.floor((((((parseInt(final))/natureMod) - 5) * 100) / parseInt(level)) - (2 * parseInt(base) + (parseInt(ev) / 4))) - 1, 31),0);
    return x === y ? x : x + " - " + y;
}

function calcOtherEV(base, final, iv, level, natureMod){
    let x = Math.max(Math.min(4 * Math.floor(((((parseInt(final)/natureMod) - 5) * 100) / parseInt(level)) - (2 * parseInt(base) + parseInt(iv))), 255),0);
    final = parseInt(final) + 1;
    let y = Math.max(Math.min(4 * Math.floor((((((parseInt(final))/natureMod) - 5) * 100) / parseInt(level)) - (2 * parseInt(base) + parseInt(iv))) - 1, 255),0);
    return x === y ? x : x + " - " + y;
}

function calcIVStats(){
    let level = document.getElementById('level').children[1].children[0].value;

    let mod = getNatureMod(natureObj.value);

    ivStats.children[1].children[0].value = calcHPIV(baseStats.children[1].children[0].value,
                                                    finalStats.children[1].children[0].value,
                                                    evStats.children[1].children[0].value,
                                                    level);

    ivStats.children[2].children[0].value = calcOtherIV(baseStats.children[2].children[0].value,
                                                    finalStats.children[2].children[0].value,
                                                    evStats.children[2].children[0].value,
                                                    level,
                                                    mod[0]);

    ivStats.children[3].children[0].value = calcOtherIV(baseStats.children[3].children[0].value,
                                                    finalStats.children[3].children[0].value,
                                                    evStats.children[3].children[0].value,
                                                    level,
                                                    mod[1]);

    ivStats.children[4].children[0].value = calcOtherIV(baseStats.children[4].children[0].value,
                                                    finalStats.children[4].children[0].value,
                                                    evStats.children[4].children[0].value,
                                                    level,
                                                    mod[2]);
                                                                        
    ivStats.children[5].children[0].value = calcOtherIV(baseStats.children[5].children[0].value,
                                                    finalStats.children[5].children[0].value,
                                                    evStats.children[5].children[0].value,
                                                    level,
                                                    mod[3]);
                                                                            
    ivStats.children[6].children[0].value = calcOtherIV(baseStats.children[6].children[0].value,
                                                    finalStats.children[6].children[0].value,
                                                    evStats.children[6].children[0].value,
                                                    level,
                                                    mod[4]);
}

function calcEVStats(){
    let level = document.getElementById('level').children[1].children[0].value;

    let mod = getNatureMod(natureObj.value);

    evStats.children[1].children[0].value = calcHPEV(baseStats.children[1].children[0].value,
                                                    finalStats.children[1].children[0].value,
                                                    ivStats.children[1].children[0].value,
                                                    level);

    evStats.children[2].children[0].value = calcOtherEV(baseStats.children[2].children[0].value,
                                                    finalStats.children[2].children[0].value,
                                                    ivStats.children[2].children[0].value,
                                                    level,
                                                    mod[0]);

    evStats.children[3].children[0].value = calcOtherEV(baseStats.children[3].children[0].value,
                                                    finalStats.children[3].children[0].value,
                                                    ivStats.children[3].children[0].value,
                                                    level,
                                                    mod[1]);

    evStats.children[4].children[0].value = calcOtherEV(baseStats.children[4].children[0].value,
                                                    finalStats.children[4].children[0].value,
                                                    ivStats.children[4].children[0].value,
                                                    level,
                                                    mod[2]);
                                                                        
    evStats.children[5].children[0].value = calcOtherEV(baseStats.children[5].children[0].value,
                                                    finalStats.children[5].children[0].value,
                                                    ivStats.children[5].children[0].value,
                                                    level,
                                                    mod[3]);
                                                                            
    evStats.children[6].children[0].value = calcOtherEV(baseStats.children[6].children[0].value,
                                                    finalStats.children[6].children[0].value,
                                                    ivStats.children[6].children[0].value,
                                                    level,
                                                    mod[4]);
}

function trackEV(evs){       
    let evCount = 0;
    for(let x = 1; x < 7; x++){
        evCount = parseInt(evCount) + parseInt(evStats.children[x].children[0].value);
    }

    let incr = 0;
    while(arrayMax(evs) > 0 && (evCount + incr) < 512){
        for(let z = 1; z < 7; z++){
            if(evs[z - 1] === 0){
                continue;
            }
            evStats.children[z].children[0].value = Math.min(parseInt(evStats.children[z].children[0].value) + 1,255);
            evs[z - 1]--;
            incr++;

            if((evCount + incr) === 512){
                return;
            }
        }
    }
    
    calcFinalStats();
}

function addPokemon(){
    let track = document.getElementById('pokemon-tracker');
    for (let i = 0; i < obj.pokemon.length; i++) {
        var trackPok = document.createElement('img');
        trackPok.alt = obj.pokemon[i].Name;

        trackPok.src = "https://img.pokemondb.net/sprites/home/normal/2x/" + getName(obj.pokemon[i].Name) + ".jpg";
        trackPok.onclick = "trackEV()";
        track.appendChild(trackPok);
    }
}

function arrayMax(arr) {
    var len = arr.length, max = -Infinity;
    while (len--) {
      if (arr[len] > max) {
        max = arr[len];
      }
    }
    return max;
  };

  function getName(name){
    let add;
    name = name.toLowerCase();
    if(name.includes("standard") || name.includes("normal") || name.includes("hero of many battles")){
        return name.split('(')[0];
    }
    name = name.replaceAll(" forme", "");
    name = name.replaceAll(" form", "");
    name = name.replaceAll(" mask", "");
    name = name.replaceAll(" teal", "");
    name = name.replaceAll(" mode", "");
    name = name.replaceAll(" style", "");
    name = name.replaceAll(" breed", "");
    name = name.replaceAll(" cloak", "");
    name = name.replaceAll(" plumage", "");
    name = name.replaceAll(" face", "");
    name = name.replaceAll(" sword", "");
    name = name.replaceAll(" shield", "");
    name = name.replaceAll(" size", "");
    name = name.replaceAll("combat", "paldean");
    name = name.replaceAll("%", "");
    name = name.replaceAll("é", "e");
    name = name.replaceAll(".", "");
    name = name.replaceAll("'", "");
    name = name.replaceAll(":", "");
    name = name.replaceAll("♀", "-f");
    name = name.replaceAll("♂", "-m");
    
    name = name.replaceAll(" ", "-");
    if(name.includes("(")){

        add = name.split('(')[1];
        name = name.split('(')[0];
        add = add.replace(")", "");
        add = add.replaceAll("-" + name, "");
        add = add.replaceAll(name, "");

        name = name + "-" + add;
    }

    
    
    
    name = name.replaceAll("--", "-");
    name = name.replaceAll("eevee-partner", "eevee");
    name = name.replaceAll("partner", "partner-cap");
    name = name.replaceAll("family-of-three", "family3");
    name = name.replaceAll("family-of-four", "family4");
    return name;
  }