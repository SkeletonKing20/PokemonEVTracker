function incrStat(stat, incr) {
    switch (stat) {
        case "hp":
            document.getElementById("currentHPEVs").innerText += incr;
            break;
        case "atk":
            document.getElementById("currentATKEVs").innerText += incr;
            break;
        case "def":
            document.getElementById("currentDEFEVs").innerText += incr;
            break;
        case "spAtk":
            document.getElementById("currentSPATKEVs").innerText += incr;
            break;
        case "spDef":
            document.getElementById("currentSPDEFEVs").innerText += incr;
            break;
        case "speed":
            document.getElementById("currentSPEEDEVs").innerText += incr;
            break;
    }
}