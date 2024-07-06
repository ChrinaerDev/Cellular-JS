const rules = [
    "conway", "coagulation", "maze", "coral", "serviettes", "replicator",
     "flakes", "longlife", "assimilation", "sac", "seeds", "group", "maze2","born","mannual"
]

const Stamps = [
    [30,
        `000001110000000000000011100000
         111010000000000000000000010111
         000010001000000000000100010000
         000010000100000000001000010000
         000000000010000000010000000000
         000000100000001100000001000000
         000000011011011110110110000000
         000000000001010010100000000000
         000000000000000000000000000000
         000000000000000000000000000000
         000000000000000000000000000000
         000000000001000000100000000000
         000000000010101101010000000000
         000000000011001100110000000000
         000000000000001100000000000000
         000000000000000000000000000000
         000000000000110011000000000000
         000000000000110011000000000000
         000000000000011110000000000000
         000000000000010010000000000000
         000000000000100001000000000000
         000000000000100001000000000000
         000000000000101101000000000000
         000000000000010010000000000000
         000000000000010010000000000000
         000000000000000000000000000000
         000000010000000000000010000000
         000000011000010010000110000000
         000000010000011110000010000000
         000000001100001100001100000000
         000000000100000000001000000000
         000000010100000000001010000000
         000000001111100001111100000000
         000000000010011110010000000000
         000000000100001100001000000000
         000000000000010010000000000000        
         000000000000001100000000000000
         000000000001101101100000000000
         000000000000000000000000000000
         000000000010000000010000000000
         000000000111000000111000000000
         000000000100100001001000000000
         000000001100000000001100000000
         `
    ], //3x3 block
    [3,"010001111"], //Glider
    [3,"111111111"], //3x3 block
    [10,
    `1111111111
    1111111111
    1111111111
    1111111111
    1111111111
    1111111111
    1111111111
    1111111111
    1111111111
    1111111111`
], //3x3 block
    [2,"1111"]
]  

let ps_counter = 0
let allborn = 0

class Conway {

    constructor(screen, dim, pixsize, fps) {
        this.version = "1.0"
        this.mat = dim
        this.Cells = []
        this.Array = []
        this.FArray = []
        screen.className = "screen"
        this.screen = screen
        this.dim = dim
        this.pixelSize = pixsize
        this.active = true;
        this.fps = fps;
        this.GUI = null;
        this.pointerToarray = { x: 0, y: 0 }
        this.neighboursLoc = []
        this.rule = rules[0];
        this.edgeWrapping = Wrapping.PORTAL1
        this.clickmode = "stamp" //others: dot, ...
        this.InitKeypresess()
        this.globalRule = true
        this.Cananimate = true
        this.colorweight = 3

        this.animate = () => {
            
            window.requestAnimationFrame(this.animate)
            if(this.Cananimate){
                if (this.active) {
                    this.UpdateGrid("future")
                }
            }
           
        }


        this.Run = (anim) => {
            this.CreatePixels()
            if(this.GUI instanceof ConwayGUI){
                this.GUI.init()
                this.initStamp()
            }
            if(anim)
            this.animate()
        }

    }

    useGUI(gui) {
        this.GUI = gui
    }
    initStamp() {
        this.GUI.stampIndx = 4
        this.GUI.GUI.patternStamp.style.width = Stamps[this.GUI.stampIndx][0] * this.pixelSize
        this.GUI.GUI.patternStamp.style.height = Stamps[this.GUI.stampIndx][0] * this.pixelSize
    }
    Stamp() {
        var subst = this.GUI.decodeStamp()

        for (let j = subst.length - 1; j >= 0; j--) {

            for (let i = 0; i < subst[j].length; i++) {

                let locY = Number(this.pointerToarray.y) + 1 + j,
                    locX = Number(this.pointerToarray.x) + 1 + i

                this.Array[locY][locX] = subst[j][i];

                if (subst[j][i] == 1) {
                    this.Cells[locY][locX].className = "life_pixel"

                    document.querySelector(`#${this.screen.id} #n_cell_${locX}_${locY}`).className = "life_pixel"

                    this.Cells[locY][locX].setAttribute("h", stampcolor.h)
                    this.Cells[locY][locX].setAttribute("s", stampcolor.s)
                    this.Cells[locY][locX].setAttribute("l", stampcolor.l)
                    this.Cells[locY][locX].setAttribute("rule", this.rule)
                    this.Array[locY][locX] = 1
                    this.Cells[locY][locX].style.backgroundColor = `rgb(${stampcolor.h},${stampcolor.s},${stampcolor.l})`
                    this.Cells[locY][locX].setAttribute("r", stampcolor.h)
                    this.Cells[locY][locX].setAttribute("g", stampcolor.s)
                    this.Cells[locY][locX].setAttribute("b", stampcolor.l)
                } else {
                    this.Cells[locY][locX].setAttribute("rule", this.rule)
                    this.Cells[locY][locX].className = "death_pixel"
                    document.querySelector(`#${this.screen.id} #n_cell_${locX}_${locY}`).className = "death_pixel"
                    this.Cells[locY][locX].style.backgroundColor = `rgb(${deadcell.h},${deadcell.s},${deadcell.l})`
                    this.Cells[locY][locX].setAttribute("r", deadcell.h)
                    this.Cells[locY][locX].setAttribute("g", deadcell.s)
                    this.Cells[locY][locX].setAttribute("b", deadcell.l)
                }


            }
        }

    }
    InitKeypresess() {


    }
    useRule(v) {
        this.rule = rules[v]
    }
    CreatePixels() {
        var c = 0
        for (let j = 0; j < this.dim.y; j++) {

            this.Cells[j] = []
            this.Array[j] = []
            this.FArray[j] = []
            for (let i = 0; i < this.dim.x; i++) {
                c++
                var pixel = document.createElement('div')
                pixel.id = "n_cell_" + i + "_" + j + ""
                pixel.className = "norm_pixel"
                pixel.style.width = "" + this.pixelSize + "px"
                pixel.style.height = "" + this.pixelSize + "px"
                pixel.setAttribute("locationX", `${i}`)
                pixel.setAttribute("locationY", `${j}`)

                pixel.setAttribute("h", 0)
                pixel.setAttribute("s", 0)
                pixel.setAttribute("l", 0)
                pixel.setAttribute("rule", "null")

                pixel.setAttribute("pulses", 0)

                document.getElementById(this.screen.id).appendChild(pixel)

                this.Cells[j][i] = document.querySelector("#" + this.screen.id + " #n_cell_" + i + "_" + j + "")
                this.Array[j][i] = 0
                this.FArray[j][i] = 0
            }
        }

        document.querySelectorAll("#" + this.screen.id + " div").forEach(e => {

            e.addEventListener("click", () => {
                if (
                    Number(e.getAttribute("locationY")) != 0 &&
                    Number(e.getAttribute("locationX")) != 0 &&
                    Number(e.getAttribute("locationX")) != this.dim.x - 1 &&
                    Number(e.getAttribute("locationY")) != this.dim.y - 1
                ) {

                    if (this.clickmode == "dot") {
                        var v = this.Array[e.getAttribute("locationY")][e.getAttribute("locationX")]
                        if (v == 0) {
                            this.Array[e.getAttribute("locationY")][e.getAttribute("locationX")] = 1;
                            e.className = "life_pixel"
                            e.style.backgroundColor = `rgb(${this.ExtractHSL(e).h},${this.ExtractHSL(e).s},${this.ExtractHSL(e).l})`
                            e.setAttribute("r", this.ExtractHSL(e).h)
                            e.setAttribute("g", this.ExtractHSL(e).s)
                            e.setAttribute("b", this.ExtractHSL(e).l)
                        } else {
                            this.Array[e.getAttribute("locationY")][e.getAttribute("locationX")] = 0;
                            e.className = "death_pixel"
                            e.style.backgroundColor = `rgb(${deadcell.h},${deadcell.s},${deadcell.l})`
                            e.setAttribute("r", deadcell.h)
                            e.setAttribute("g", deadcell.s)
                            e.setAttribute("b", deadcell.l)
                        }
                    } else if (this.clickmode == "stamp") {
                        if(this.GUI instanceof ConwayGUI)
                        this.Stamp()
                    }

                }

            })

            e.addEventListener("mouseenter", () => {
                if(this.GUI instanceof ConwayGUI){
                    this.GUI.pstamperOrigin.x = (e.getBoundingClientRect().left - document.getElementById(this.screen.id).getBoundingClientRect().left) + this.pixelSize
                    this.GUI.pstamperOrigin.y = (e.getBoundingClientRect().top - document.getElementById(this.screen.id).getBoundingClientRect().top) + this.pixelSize
                  
                }
                this.pointerToarray.x = e.getAttribute("locationX")
                this.pointerToarray.y = e.getAttribute("locationY")
            })
        })

        this.giveInitial(1)

    }

    AnimatePixel() {
        for (let j = 0; j < this.dim.y; j++) {
            for (let i = 0; i < this.dim.x; i++) {
               
            }
        }
    }

    clear() {
        // document.getElementById(this.screen.id).innerHTML = ""
        // this.CreatePixels()
        for (let j = 0; j < this.dim.y; j++) {
            for (let i = 0; i < this.dim.x; i++) {
                this.Array[j][i] = 0
                this.FArray[j][i] = 0
                this.Cells[j][i].setAttribute("h", 0)
                this.Cells[j][i].setAttribute("s", 0)
                this.Cells[j][i].setAttribute("l", 0)
                this.Cells[j][i].className = "death_pixel"
                this.Cells[j][i].style.backgroundColor = `rgb(${deadcell.h},${deadcell.s},${deadcell.l})`
                this.Cells[j][i].setAttribute("r", deadcell.h)
                this.Cells[j][i].setAttribute("g", deadcell.s)
                this.Cells[j][i].setAttribute("b", deadcell.l)
                this.Cells[j][i].setAttribute("rule", "null")
            }
        }
        //this.UpdateGrid("init")
        //this.AnimatePixel()
    }

    giveInitial(v) {
        for (let j = 20; j < this.dim.y - 1; j++) {
            for (let i = 20; i < this.dim.x - 1; i++) {

            }
        }
        this.UpdateGrid("init")
    }

    UpdateGrid(method) {
        //Apply Conway
        /**
         * @conwayrule
         * (sum == 3 || sum == 2) && me == 1 : survive
         * sum > 3 && me == 1 : die
         * sum < 2 && me == 1 : die
         * sum == 3 && me == 0 : live
         * 
         */

        var gen = this.GenerateColor()

        if (method == "future") {
            for (let j = 0; j < this.dim.y - 0; j++) {

                for (let i = 0; i < this.dim.x - 0; i++) {

                    if (this.active) {

                        var cols = {
                            N: 0,
                            S: 0,
                            NE: 0,
                            NW: 0,
                            SE: 0,
                            SW: 0,
                            E: 0,
                            W: 0
                        }

                        let sum, cN, cNw, cNe, cS, cSw, cSe, cE, cW, me;
                        let U = 1;
                        let north = j - U,
                            south = j + U,
                            east = i + U,
                            west = i - U
                        if (this.edgeWrapping > 0) {

                            if (this.edgeWrapping == Wrapping.PORTAL1) {
                                if (north < 0) {
                                    north = this.dim.y - 1
                                }
                                if (south == this.dim.y) {
                                    south = 0
                                }
                                if (east == this.dim.x) {
                                    east = 0
                                }
                                if (west < 0) {
                                    west = this.dim.x - 1
                                }
                            }
                            if (this.edgeWrapping == Wrapping.RESULTANT) {
                                if (north < 0) {
                                    north = j
                                }
                                if (south == this.dim.y) {
                                    south = j
                                }
                                if (east == this.dim.x) {
                                    east = i
                                }
                                if (west < 0) {
                                    west = i
                                }
                            }

                            cN = this.Array[north][i];
                            this.neighboursLoc[0] = { x: i, y: north }
                            cNw = this.Array[north][west];
                            this.neighboursLoc[2] = { x: west, y: north }
                            cNe = this.Array[north][east];
                            this.neighboursLoc[1] = { x: east, y: north }
                            cS = this.Array[south][i];
                            this.neighboursLoc[3] = { x: i, y: south }
                            cSw = this.Array[south][west];
                            this.neighboursLoc[5] = { x: west, y: south }
                            cSe = this.Array[south][east];
                            this.neighboursLoc[4] = { x: east, y: south }
                            cE = this.Array[j][east];
                            this.neighboursLoc[6] = { x: east, y: j }
                            cW = this.Array[j][west];
                            this.neighboursLoc[7] = { x: west, y: j }

                        } else {
                            cN = north >= 0 ? this.Array[north][i] : 0;
                            cNw = north >= 0 && west >= 0 ? this.Array[north][west] : 0;
                            cNe = north >= 0 && east <= this.dim.x - 1 ? this.Array[north][east] : 0;
                            cS = south <= this.dim.y - 1 ? this.Array[south][i] : 0;
                            cSw = south <= this.dim.y - 1 && west >= 0 ? this.Array[south][west] : 0;
                            cSe = south <= this.dim.y - 1 && east <= this.dim.x - 1 ? this.Array[south][east] : 0;
                            cE = east <= this.dim.x - 1 ? this.Array[j][east] : 0;
                            cW = west >= 0 ? this.Array[j][west] : 0;


                            this.neighboursLoc[0] = north >= 0 ? { x: i, y: north } : { x: i, y: j };
                            this.neighboursLoc[2] = north >= 0 && west >= 0 ? { x: west, y: north } : { x: i, y: j };
                            this.neighboursLoc[1] = north >= 0 && east <= this.dim.x - 1 ? { x: east, y: north } : { x: i, y: j };
                            this.neighboursLoc[3] = south <= this.dim.y - 1 ? { x: i, y: south } : { x: i, y: j };
                            this.neighboursLoc[5] = south <= this.dim.y - 1 && west >= 0 ? { x: west, y: south } : { x: i, y: j };
                            this.neighboursLoc[4] = south <= this.dim.y - 1 && east <= this.dim.x - 1 ? { x: east, y: south } : { x: i, y: j };
                            this.neighboursLoc[6] = east <= this.dim.x - 1 ? { x: east, y: j } : { x: i, y: j };
                            this.neighboursLoc[7] = west >= 0 ? { x: west, y: j } : { x: i, y: j };

                        }


                        if (this.Array[j][i] == 1 && this.globalRule) {
                            for (let n = 0; n < this.neighboursLoc.length; n++) {
                                this.Cells[this.neighboursLoc[n].y][this.neighboursLoc[n].x].setAttribute("rule", this.Cells[j][i].getAttribute("rule"))
                            }
                        }

                        me = this.Array[j][i];
                        sum = cN + cNw + cNe + cS + cSe + cW + cSw + cE;
                        let born = 3,
                            survmax = 3,
                            survmin = 2,
                            diemax = 3,
                            diemin = 2

                        /**
                         * @rules
                         * conway, coagulation, maze, coral, serviettes, replicator,
                         *  flakes, longlife, assimilation, sac, seeds, group, maze2
                         */


                        var gradcol = () => {
                            var colors = [
                                { h: 0, s: 0, l: 0 },
                                { h: 0, s: 0, l: 0 },
                                { h: 0, s: 0, l: 0 },
                            ]
                            var _rules = []
                            var neighs = [cN, cNe, cNw, cS, cSe, cSw, cE, cW]
                            let prev
                            let successColor = 0
                            for (let i = 0; i < neighs.length; i++) {
                                prev = sum
                                sum -= neighs[i]
                                if (prev > sum) {
                                    colors[successColor] = this.ExtractHSL(this.Cells[this.neighboursLoc[i].y][this.neighboursLoc[i].x])
                                    successColor++
                                }
                            }

                            var w = this.colorweight

                            var mixture = {
                                h: (
                                    colors[0].h + colors[1].h + colors[2].h
                                ) / w,
                                s: (
                                    colors[0].s + colors[1].s + colors[2].s
                                ) / w,
                                l: (
                                    colors[0].l + colors[1].l + colors[2].l
                                ) / w,
                            }

                            return mixture
                        }

                        let rule = this.globalRule ? this.rule : this.Cells[j][i].getAttribute("rule");
                        var _born, _survive, _isolated, _crowded;

                        if (rule == "conway") {
                            _born = (sum == born && me == 0),
                                _survive = ((sum == survmax || sum == survmin) && me == 1),
                                _isolated = (sum < diemin && me == 1),
                                _crowded = (sum > diemax && me == 1)
                        } else if (rule == "coagulation") {
                            _born = (sum == 3 || sum == 7 || sum == 8 && me == 0),
                                _survive = ((sum == 2 || sum == 3 || sum == 5 || sum == 6 || sum == 7 || sum == 8) && me == 1),
                                _isolated = (sum < diemin && me == 1),
                                _crowded = (sum > diemax && me == 1)
                        }
                        else if (rule == "maze") {
                            _born = (sum == 3 && me == 0),
                                _survive = ((sum >= 1 && sum <= 5) && me == 1),
                                _isolated = (sum < diemin && me == 1),
                                _crowded = (sum > diemax && me == 1)
                        }
                        else if (rule == "coral") {
                            _born = (sum == 3 && me == 0),
                                _survive = ((sum >= 4 && sum <= 8) && me == 1),
                                _isolated = (sum < diemin && me == 1),
                                _crowded = (sum > diemax && me == 1)

                        }
                        else if (rule == "serviettes") {
                            _born = (sum >= 2 && sum <= 4 && me == 0),
                                _survive = false,
                                _isolated = (sum < diemin && me == 1),
                                _crowded = (sum > diemax && me == 1)
                        }
                        else if (rule == "replicator") {
                            _born = (sum == 1 || sum == 3 || sum == 5 || sum == 7 && me == 0),
                                _survive = ((sum == 1 || sum == 3 || sum == 5 || sum == 7) && me == 1),
                                _isolated = (sum < diemin && me == 1),
                                _crowded = (sum > diemax && me == 1)
                        }
                        else if (rule == "flakes") {
                            _born = (sum == 3 && me == 0),
                                _survive = ((sum >= 0 && sum <= 8) && me == 1),
                                _isolated = (sum < diemin && me == 1),
                                _crowded = (sum > diemax && me == 1)
                        }
                        else if (rule == "longlife") {
                            _born = (sum >= 3 && sum <= 5 && me == 0),
                                _survive = ((sum == 5) && me == 1),
                                _isolated = (sum <= diemin && me == 1),
                                _crowded = (sum >= diemax && me == 1)
                        }
                        else if (rule == "assimilation") {
                            _born = (sum >= 3 && sum <= 5 && me == 0),
                                _survive = ((sum >= 4 && sum <= 7) && me == 1),
                                _isolated = (sum <= diemin && me == 1),
                                _crowded = (sum >= diemax && me == 1)
                        }
                        else if (rule == "sac") {
                            _born = (sum >= 4 && sum <= 8 && me == 0),
                                _survive = ((sum >= 2 && sum <= 5) && me == 1),
                                _isolated = (sum <= diemin && me == 1),
                                _crowded = (sum >= diemax && me == 1)
                        }
                        else if (rule == "seeds") {
                            _born = (sum == 2 && me == 0),
                                _survive = false,
                                _isolated = (sum < diemin && me == 1),
                                _crowded = (sum > diemax && me == 1)
                        }
                        else if (rule == "inflate") {
                            _born = ((sum >= 1 && sum <= 4) || sum == 7 || sum == 8 && me == 0),
                                _survive = ((sum >= 3 && sum <= 4) || (sum >= 6 && sum <= 8) && me == 1)
                            _isolated = (sum < diemin && me == 1),
                                _crowded = (sum > diemax && me == 1)
                        }
                        else if (rule == "maze2") {
                            _born = (sum == 3 && me == 0),
                                _survive = ((sum >= 1 && sum <= 4) && me == 1)
                            _isolated = (sum < diemin && me == 1),
                                _crowded = (sum > diemax && me == 1)
                        }
                        else if (rule == "born") {
                            _born = (sum >= 0 && me == 0),
                                _survive = false
                            _isolated = false,
                                _crowded = false
                        allborn++

                        }
                        else if (rule == "null") {
                            _born = false,
                                _survive = false
                            _isolated = false,
                                _crowded = false
                        }
                        else if (rule == "mannual") {
                            _born = false,
                                _survive = false
                            _isolated = false,
                                _crowded = false
                        }

                     
                        if (_survive) {
                            
                            this.FArray[j][i] = this.Array[j][i];
                           
                           if(allborn < 0 && this.Cells[j][i].getAttribute("class") != 'norm_pixel'){
                             this.Cells[j][i].className = "const_pixel"
                           }
                            

                            var mixture = gradcol()


                            this.Cells[j][i].setAttribute("r", mixture.h)
                            this.Cells[j][i].setAttribute("g", mixture.s)
                            this.Cells[j][i].setAttribute("b", mixture.l)

                            if (mixture.h + mixture.l + mixture.s > 0) {
                                this.Cells[j][i].style.backgroundColor = `rgb(${mixture.h},${mixture.s},${mixture.l})`
                            }


                        } else


                            if (_crowded) {
                                this.FArray[j][i] = 0;
                                if (Number(this.Cells[j][i].getAttribute("pulses")) > 0) {
                                    this.Cells[j][i].className = "death_pixel"
                                    this.Cells[j][i].style.backgroundColor = `rgb(${deadcell.h},${deadcell.s},${deadcell.l})`
                                    this.Cells[j][i].setAttribute("r", deadcell.h)
                                    this.Cells[j][i].setAttribute("g", deadcell.s)
                                    this.Cells[j][i].setAttribute("b", deadcell.l)
                                } else {
                                    this.Cells[j][i].className = "norm_pixel"
                                    this.Cells[j][i].style.backgroundColor = `rgb(${normcell.h},${normcell.s},${normcell.l})`
                                    this.Cells[j][i].setAttribute("r", normcell.h)
                                    this.Cells[j][i].setAttribute("g", normcell.s)
                                    this.Cells[j][i].setAttribute("b", normcell.l)
                                }

                            } else
                                if (_isolated) {
                                    this.FArray[j][i] = 0;
                                    if (Number(this.Cells[j][i].getAttribute("pulses")) > 0) {
                                        this.Cells[j][i].className = "death_pixel"
                                        this.Cells[j][i].style.backgroundColor = `rgb(${deadcell.h},${deadcell.s},${deadcell.l})`
                                        this.Cells[j][i].setAttribute("r", deadcell.h)
                                        this.Cells[j][i].setAttribute("g", deadcell.s)
                                        this.Cells[j][i].setAttribute("b", deadcell.l)
                                    } else {
                                        this.Cells[j][i].className = "norm_pixel"
                                        this.Cells[j][i].style.backgroundColor = `rgb(${normcell.h},${normcell.s},${normcell.l})`
                                        this.Cells[j][i].setAttribute("r", normcell.h)
                                        this.Cells[j][i].setAttribute("g", normcell.s)
                                        this.Cells[j][i].setAttribute("b", normcell.l)
                                    }

                                } else
                                    if (_born) {

                                        this.FArray[j][i] = 1;
                                        let p = Number(this.Cells[j][i].getAttribute("pulses"))
                                        this.Cells[j][i].setAttribute("pulses", p++)
                                        
                                        if(sum > 0){
                                            this.Cells[j][i].className = "life_pixel"
                                        }
                                        

                                        var mixture = gradcol()

                                        if (mixture.h + mixture.l + mixture.s > 0) {
                                            this.Cells[j][i].setAttribute("h", mixture.h)
                                            this.Cells[j][i].setAttribute("s", mixture.s)
                                            this.Cells[j][i].setAttribute("l", mixture.l)
                                        }

                                        this.Cells[j][i].setAttribute("r", mixture.h)
                                        this.Cells[j][i].setAttribute("g", mixture.s)
                                        this.Cells[j][i].setAttribute("b", mixture.l)


                                        if (mixture.h + mixture.l + mixture.s > 0) {
                                            this.Cells[j][i].style.backgroundColor = `rgb(${mixture.h},${mixture.s},${mixture.l})`
                                        }

                                    }

                    }



                }
            }

            //Map
            for (let j = 0; j < this.dim.y; j++) {
                for (let i = 0; i < this.dim.x; i++) {
                    if (this.active)
                        this.Array[j][i] = this.FArray[j][i];
                }
            }



        } else if (method == "init") {
            //Map
            for (let j = 0; j < this.dim.y; j++) {

                for (let i = 0; i < this.dim.x; i++) {

                    if (this.Array[j][i] == 1) {
                        this.Cells[j][i].className = "life_pixel"
                        this.Cells[j][i].style.backgroundColor = `rgb(${this.ExtractHSL(this.Cells[j][i]).h},${this.ExtractHSL(this.Cells[j][i]).s},${this.ExtractHSL(this.Cells[j][i]).l})`
                        this.Cells[j][i].setAttribute("r", this.ExtractHSL(this.Cells[j][i]).h)
                        this.Cells[j][i].setAttribute("g", this.ExtractHSL(this.Cells[j][i]).s)
                        this.Cells[j][i].setAttribute("b", this.ExtractHSL(this.Cells[j][i]).l)
                    }
                    else {
                        this.Cells[j][i].className = "death_pixel"
                        this.Cells[j][i].style.backgroundColor = `rgb(${deadcell.h},${deadcell.s},${deadcell.l})`
                        this.Cells[j][i].setAttribute("r", deadcell.h)
                        this.Cells[j][i].setAttribute("g", deadcell.s)
                        this.Cells[j][i].setAttribute("b", deadcell.l)
                    }

                }

            }
        }

    }
    ExtractHSL(e) {

        var result = {
            h: Number(e.getAttribute("h")),
            s: Number(e.getAttribute("s")),
            l: Number(e.getAttribute("l"))
        }

        //console.log(result)

        return result
    }
    GenerateColor() {

        var angle, sat, light, alpha
        angle = Math.round(Math.random() * 255 + 1)
        sat = Math.round(Math.random() * 255 + 1)
        light = Math.round(Math.random() * 255 + 1)

        return { h: angle, s: sat, l: light }
    }
    MixColors(colors) {
        //console.log(colors)
        function mix(c1, c2, a) {
            const temp = {
                h: 0, s: 0, l: 0
            }
            c1.h * (1 - a);
            c1.s * (1 - a);
            c1.l * (1 - a);
            c2.h * (a);
            c2.s * (a);
            c2.l * (a);

            temp.h = c1.h + c2.h
            temp.s = c1.s + c2.s
            temp.l = c1.l + c2.l
            return temp

        }

        var final
        for (let i = 0; i < colors.length - 1; i++) {
            final = mix(colors[i], colors[i + 1], 0.5)
        }


        return {
            h: Math.round(final.h),
            s: Math.round(final.s),
            l: Math.round(final.l),
        }
    }
    GetGridData() {
        let GridColorData = []

        for (let i = 0; i < this.Array.length; i++) {
            GridColorData[i] = []
            for (let j = 0; j < this.Array[0].length; j++) {
                GridColorData[i][j] = [
                    Number(this.Cells[i][j].getAttribute("r")),
                    Number(this.Cells[i][j].getAttribute("g")),
                    Number(this.Cells[i][j].getAttribute("b")),
                    this.Cells[i][j].className
                ]
            }
        }

        return GridColorData

    }
    SetGridData( GridColorData , k = 1 ){
        
        for (let i = 0; i < this.Array.length; i++) {
 
            for (let j = 0; j < this.Array[0].length; j++) {

                this.Cells[i][j].setAttribute("r", GridColorData[i][j][0] )
                this.Cells[i][j].setAttribute("g", GridColorData[i][j][1] )
                this.Cells[i][j].setAttribute("b", GridColorData[i][j][2] )
                this.Cells[i][j].className = GridColorData[i][j][3]
                let color = {
                    r: GridColorData[i][j][0]*k,
                    g: GridColorData[i][j][1]*k,
                    b: GridColorData[i][j][2]*k,
                }
                this.Cells[i][j].style.backgroundColor = `rgb(${color.r},${color.g},${color.b})`
               
            }
        }

    }
    pause(){
        this.Cananimate = false
    }

}

class ConwayGUI {
    constructor(parent) {

        this.parent = parent;
        this.GUI = {
            fpsslider: null,
            patternStamp: null
        }
        this.mouse = {
            x: 0,
            y: 0,
        }
        this.pstamperOrigin = {
            x: 0,
            y: 0
        }

        this.stampIndx = 0;
        this.stampArr = []

        ps_counter++
    }
    init() {
        this.CreatePatternStamp()
        this.Events()
    }
    declare() {
        console.log("present")
    }
    decodeStamp() {
        var stmpdat = Stamps[this.stampIndx]
        this.stampArr = []
        for (let j = 0; j < stmpdat[0]; j++) {
            this.stampArr[j] = []
            for (let i = 0; i < stmpdat[0]; i++) {
                this.stampArr[j][i] = Number(stmpdat[1][(stmpdat[0] * j) + i])
            }
        }
        return this.stampArr
    }
    Events() {
        document.addEventListener("mousemove", (e) => {
            this.mouse.x = e.clientX
            this.mouse.y = e.clientY

            this.onmousemove()
        })
    }

    onmousemove() {
        this.GUI.patternStamp.style.left = this.pstamperOrigin.x
        this.GUI.patternStamp.style.top = this.pstamperOrigin.y
    }

    CreateFPSSlider() {
        this.GUI.fpsslider = document.createElement('input')
        this.GUI.fpsslider.id = "fpsRange"
        document.getElementById(this.parent.id).appendChild(this.GUI.fpsslider)
    }
    CreatePatternStamp() {
        var elem = document.createElement('div')
        elem.id = "patternStamp" + ps_counter + ""
        elem.className = "patternStamp"
        document.getElementById("" + this.parent.id + "").appendChild(elem)
        this.GUI.patternStamp = document.getElementById(elem.id)
    }


}


function CreateInstance(screenParentId, screenId, dim_, gui, update) {


    var screen = document.createElement('div')
    screen.id = screenId
    document.getElementById(screenParentId).appendChild(screen)

    var pixelSize = dim_.pixel;

    var dim = dim_.dim

    document.getElementById(screenId).style.width = "" + (dim.x * pixelSize) + "px"
    document.getElementById(screenId).style.height = "" + (dim.y * pixelSize) + "px"
    var instance = new Conway(document.getElementById(screenId), dim, pixelSize, 1000)
    if (gui){
        instance.useGUI(new ConwayGUI(document.getElementById(screenId).parentNode))
    }
        
     instance.Run( update )

    return {
        engine: instance
    }

}

class Controller {

    constructor() {

        this.engines = []
        this.apply = null


    }
    add(eng) {
        this.engines.push(eng)
    }
    branch(leaf) {
        if (leaf instanceof Conway) {
            this.apply = leaf
        } else {
            this.apply = this.engines[leaf]
        }

    }
    start() {
        if (this.engines.length == 0) {
            console.error("Controller: No Engine Found ")
            return
        }
        this.branch(0)
        this.role()
    }
    role() {
        console.log(this.apply)
        document.addEventListener('keypress', (e) => {
            if (e.key == " ") {
                this.apply.active = !this.apply.active.valueOf()
            }
            if (e.key == "0") {
                this.apply.clear()
                console.log("cleared " + this.apply + "")
            }
            if (e.key == "c") {
                let rcolor = this.apply.GenerateColor()
                stampcolor.h = rcolor.h
                stampcolor.s = rcolor.s
                stampcolor.l = rcolor.l
            } if (e.key == "1") {
                stampcolor.h = 255
                stampcolor.s = 255
                stampcolor.l = 255
            }
            if (e.key == "2") {
                stampcolor.h = 0
                stampcolor.s = 255
                stampcolor.l = 0
            }
            if (e.key == "3") {
                stampcolor.h = 0
                stampcolor.s = 0
                stampcolor.l = 255
            }
            if (e.key == "4") {

                this.apply.useRule(0)
            }
            if (e.key == "5") {

                this.apply.useRule(1)
            }
            if (e.key == "6") {

                this.apply.useRule(2)
            }
            if (e.key == "7") {

                this.apply.useRule(3)
            }
            if (e.key == "8") {

                this.apply.useRule(4)
            }
            if (e.key == "9") {

                this.apply.useRule(5)
            }
            if (e.key == "+") {
                this.apply.useRule(8)
            }
            if (e.key == "q") {

                this.apply.useRule(9)
            }
            if (e.key == "w") {

                this.apply.useRule(10)
            }
            if (e.key == "e") {
                this.apply.useRule(11)
            }
            if (e.key == "r") {
                this.apply.useRule(12)
            }
            if (e.key == "t") {
                this.apply.useRule(14)
            }
            if (e.key == "*") {
                this.apply.GUI.stampIndx = 0
            }
            if (e.key == "-") {
                this.apply.GUI.stampIndx = 1
            }
            if (e.key == "/") {
                this.apply.useRule(13)
            }
            if (e.key == "g") {
                this.apply.globalRule = !this.apply.globalRule.valueOf()
            }


        })


    }


}
