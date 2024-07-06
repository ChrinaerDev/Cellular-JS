


const rules = [
    "conway", "coagulation", "maze", "coral", "serviettes", "replicator",
     "flakes", "longlife", "assimilation", "sac", "seeds", "group", "maze2","born"
]

const priorRules = [
    "conway", "assimilation", "coagulation", "maze", "maze2", "coral", "serviettes", "replicator",
     "flakes", "longlife", , "sac", "seeds", "group", "null"
]
const deadcell = {
    h: 0, s: 0, l: 0
}
const  livecell = {
    h: 1, s: 1, l: 1
}
const  normcell = {
    h: 0, s: 0, l: 3  //hsl(0, 0%, 3%)
}
const constcell = {
    h: 0, s: 0, l: 0
}

const stampcolor = {
    h: 255, s: 255, l: 255
}

const Wrapping = {
    FIX: 0, 
REFLECT: 1,
PORTAL1: 2,
PORTAL2: 3,
PORTAL3: 4,
RESULTANT: 5,

}



const Stamps = [
    [3,"010001111"], //Glider
    [3,"111111111"], //3x3 block
    [10,`1111111111
    1111111111
    1111111111
    1111111111
    1111111111
    1111111111
    1111111111
    1111111111
    1111111111
    1111111111`], //3x3 block
    [2,"1111"]
]  