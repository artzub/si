/*
    Artzub
    ver: 0.1
 */

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame =
            window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(2, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
})();

function item(id, x, y) {
    var el = {
        id : id,
        visible : true,
        x : x || 0,
        y : y || 0,
        _translate : [0, 0],
        _scale : [1, 1],
        draw : function(canvas) {
            return this;
        },
        translate : function(x, y) {
            if (!arguments.length)
                return el._translate;

            if (arguments.length < 2)
                y = x || 0;

            el._translate = [x || 0, y || 0];
            return el;
        },
        scale : function(zx, zy) {
            if (!arguments.length)
                return el._scale;

            if (arguments.length < 2)
                zy = zx || 1;

            el._scale = [zx || 1, zy || 1];
            return el;
        }
    };
    return el;
}

var CELL = 4,
    SPACE = 4 * CELL,
    acolor = [
        '#33cc99',
        '#33cc99',
        '#33cc99',
        '#33cc99',
        '#ff9600',
        '#ffffff'
    ],
    typeShips = {
        SMALL_BOT : {
            type : 0,
            cost : 40,
            size : [8, 9],
            pattern : [
                [0, 0, 0, 1, 1, 0, 0, 0],
                [0, 0, 1, 1, 1, 1, 0, 0],
                [0, 1, 1, 1, 1, 1, 1, 0],
                [1, 1, 0, 1, 1, 0, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1],
                [0, 0, 1, 0, 0, 1, 0, 0],
                [0, 1, 0, 1, 1, 0, 1, 0],
                [1, 0, 1, 0, 0, 1, 0, 1]
            ],
            blink : [
                [0, 0, 0, 1, 1, 0, 0, 0],
                [0, 0, 1, 1, 1, 1, 0, 0],
                [0, 1, 1, 1, 1, 1, 1, 0],
                [1, 1, 0, 1, 1, 0, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1],
                [0, 1, 0, 1, 1, 0, 1, 0],
                [1, 0, 0, 0, 0, 0, 0, 1],
                [0, 1, 0, 0, 0, 0, 1, 0]
            ],
            crash : [
                [1, 1, 0, 0, 0, 0, 1, 0],
                [1, 1, 0, 0, 0, 1, 0, 0],
                [0, 0, 1, 0, 1, 0, 0, 1],
                [1, 1, 0, 1, 0, 0, 1, 0],
                [0, 0, 1, 0, 0, 1, 0, 0],
                [0, 0, 0, 1, 0, 0, 0, 0],
                [0, 0, 1, 0, 0, 1, 0, 0],
                [1, 1, 0, 0, 0, 0, 1, 0],
                [0, 1, 0, 0, 0, 0, 0, 1]
            ]
        },
        MID_BOT : {
            type : 1,
            cost : 30,
            size : [11, 8],
            pattern : [
                [0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0],
                [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
                [0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0],
                [0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
                [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
                [0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0]
            ],
            blink : [
                [0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0],
                [1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1],
                [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
                [1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0],
                [0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0],
                [0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0]
            ],
            crash : [
                [1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1],
                [0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0],
                [1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 0],
                [0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1],
                [0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0],
                [1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1],
                [0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 0],
                [0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 0]
            ]
        },
        BIG_BOT : {
            type : 2,
            cost : 10,
            size : [12, 8],
            pattern : [
                [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
                [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0],
                [0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0],
                [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1]
            ],
            blink : [
                [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
                [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0],
                [0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0],
                [0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0]
            ],
            crash : [
                [1, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1],
                [0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0],
                [0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0],
                [0, 1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 1],
                [1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0],
                [0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0],
                [0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0],
                [1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1]
            ]
        },
        SHIP : {
            type : 3,
            size : [7, 4],
            pattern : [
                [0, 0, 0, 1, 0, 0, 0],
                [0, 0, 1, 1, 1, 0, 0],
                [0, 1, 1, 1, 1, 1, 0],
                [1, 1, 1, 1, 1, 1, 1]
            ],
            crash : [
                [1, 0, 0, 0, 0, 1, 1],
                [1, 1, 1, 0, 0, 1, 0],
                [0, 1, 1, 0, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 0]
            ]
        },
        SHELL : {
            type : 4,
            buffer : 0,
            size : [3, 2],
            pattern : [
                [0, 1, 0],
                [1, 1, 1]
            ]
        },
        SHELL_ALIEN : {
            type : 5,
            size : [3, 5],
            pattern : [
                [0, 1, 0],
                [1, 0, 0],
                [0, 1, 0],
                [0, 0, 1],
                [0, 1, 0]
            ]
        },
        UFO : {
            type : 5,
            cost : 1000,
            size : [17, 6],
            pattern : [
                [1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1],
                [0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0],
                [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
                [0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
                [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0]
            ]
        }
    },
    __crashLive = 3,
    __score = 0,
    __level = 4;

function initShips() {
    function drawBot(canvas, params, pattern) {
        var ctx = canvas.getContext("2d");
        ctx.globalAlpha = 1;

        canvas.width = params.size[0] * CELL;
        canvas.height = params.size[1] * CELL;

        ctx.save();
        ctx.fillStyle = acolor[params.type];

        if (!pattern)
            pattern = params.pattern;
        pattern.forEach(function(r, i) {
            r.forEach(function(c, j) {
                if (!c)
                    return;
                ctx.fillRect(j * CELL, i * CELL, CELL, CELL);
            });
        });
        ctx.restore();
    }

    d3.keys(typeShips).forEach(function(key) {
        typeShips[key].buffer = document.createElement("canvas");
        drawBot(typeShips[key].buffer, typeShips[key]);
        if (typeShips[key].blink) {
            typeShips[key].needBlink = 1;
            typeShips[key].blinkBuffer = document.createElement("canvas");
            drawBot(typeShips[key].blinkBuffer, typeShips[key], typeShips[key].blink);
        }
        if (typeShips[key].crash) {
            typeShips[key].needCrash = 1;
            typeShips[key].crashBuffer = document.createElement("canvas");
            drawBot(typeShips[key].crashBuffer, typeShips[key], typeShips[key].crash);
        }
    });
}

function ship(type, id, x, y) {
    var bot = item(id, x, y);

    bot.type = type;
    bot.size = {
        w : type.size[0] * CELL,
        h : type.size[1] * CELL
    };

    bot.draw = function(canvas, blink) {
        if (!bot.visible && !bot.crashed)
            return;

        var ctx = canvas.getContext("2d"),
            buf = bot.type.buffer;

        if (blink)
            buf = bot.type.blinkBuffer || buf;

        if (bot.crashed) {
            bot.visible = false;
            buf = bot.type.crashBuffer || buf;
            bot.crashed--;
        }

        if (buf) {
            ctx.save();

            ctx.drawImage(buf,
                bot.x,
                bot.y
            );

            ctx.restore();
        }
    };

    bot.constructor = arguments.callee;
    return bot;
}

function makeMap(w, h) {
    var cSmall = Math.floor(w / ((typeShips.SMALL_BOT.size[0] * CELL) + SPACE)),
        cMid =  Math.floor(w / ((typeShips.MID_BOT.size[0] * CELL) + SPACE)),
        cBig =  Math.floor(w / ((typeShips.BIG_BOT.size[0] * CELL) + SPACE)),
        y = SPACE;

    var map = [];
    map.w = 0;
    for(var i = 0; i < 5; i++) {
        var pr = (i == 0
            ? [ cSmall, typeShips.SMALL_BOT ]
            : i > 0 && i < 3
            ? [ cMid, typeShips.MID_BOT ]
            : [ cBig, typeShips.BIG_BOT ]);

        for (var j = 0; j < pr[0] - 2; j++)
            map.push(ship(pr[1], i + "_" + j, j * ((pr[1].size[0] * CELL) + SPACE), y));
        map.w = Math.max(map.w, j * ((pr[1].size[0] * CELL) + SPACE));
        y += pr[1].size[1] + SPACE * 2;
    }
    map.h = y;
    map.x = 0;
    map.y = 0;
    return map;
}

function calcRectAliens(map) {
    var x = Infinity, w = 0 , h = 0;
    map.forEach(function(a) {
        if (a.visible) {
            x = x > a.x ? a.x : x;
            w = a.x + a.size.w > w ? a.x + a.size.w : w;
            h = h < a.y + a.size.h ? a.y + a.size.h : h;
        }
    });

    map.px = x != Infinity ? x : 0;
    map.w = w;
    map.h = h;
}

function randomDisposition(map) {
    map.forEach(function(c) {
        c.visible = (Math.round((Math.random() * 2) % 2) ? true : false);
        c.crashed = 0;
    });
}

var blinkState = true;
function drawAliens(canvas, map, time) {
    if (!(map instanceof Array))
        return;

    var ctx = canvas.getContext("2d");

    canvas.width = map.w;
    canvas.height = map.h;

    ctx.save();
    ctx.translate(0, time);
    blinkState = !blinkState;
    map.forEach(function(c) {
        c.draw(canvas, blinkState);
    });
    ctx.restore();
}

function checkKills(map, shells) {
    var possible = shells.filter(function(s) {
        return !s.deleted
            && s.y >= map.y && s.y <= map.y + map.h
            && s.x >= map.x && s.x <= map.x + map.w;
    });
    var killed = 0;
    while(possible.length) {
        var shell = possible.pop();

        map.filter((function(shell) {
            return function(b) {
                return !shell.deleted
                    && b.visible
                    && !b.crashed
                    && b.y + map.y + b.size.h >= shell.y
                    && b.x + map.x < shell.x + shell.size.w
                    && b.x + map.x + b.size.w > shell.x
                    && (b.crashed = __crashLive)
                    && (shell.deleted = true)
                    && (__score += b.type.cost);
            }
        })(shell));

        if (shell.deleted)
            killed++;
    }
    return killed;
}

function checkBotKill(bot, shells) {
    var possible = shells.filter(function(s) {
        return !s.deleted
            && s.y >= bot.y && s.y <= bot.y + bot.size.h
            && s.x >= bot.x && s.x <= bot.x + bot.size.w;
    });
    return possible.length;
}

function drawShells(canvas, shells, time) {
    if(!(shells instanceof Array))
        return;

    var ctx = canvas.getContext("2d");
    ctx.save();
    var temp = shells.slice(0);
    shells.splice(0, shells.length);
    temp.forEach(function(s, i) {
        ctx.clearRect(s.x, s.y, s.size.w, s.size.h);
        s.y = Math.floor(s.y - (s.dir || 1) * time);
        if (s.y > 0 && !s.deleted) {
            s.draw(canvas);
            shells.push(s);
        }
    });
    ctx.restore();
}

function addShells(arr, x, y, type) {
    type = type || typeShips.SHELL;
    var i = arr.push(ship(type, arr.length, x, y));
    i && (arr[i - 1].dir = type == typeShips.SHELL ? 1 : -1);
}

var pause = true,
    dirLeft = 0,
    dirRight = 0;

function createGamePlay(selector, _w, _h, _s, refresh, gameOver) {
    //TODO scale

    var __game = this;

    _s = _s || [1, 1];
    _s = [1, 1];//_s && _s instanceof Array ? _s : [parseInt(_s) || 1, parseInt(_s) || 1];

    refresh = refresh || function() {};

    gameOver = gameOver || function() {};

    var div = (selector ? d3.select(selector) : d3.select(document.body).append("div"))
            .style("width", (_w || 500) * _s[0] + "px")
            .style("height", (_h || 500) * _s[1] + "px"),
        w = div.node().clientWidth,
        h = div.node().clientHeight,
        posChange = true,
        stop = false,
        pause = false,
        map = makeMap(w, h),
        bot = ship(typeShips.SHIP, 'mainShip', 0, 0),
        shells = [],
        aShells = [],
        astime = 1,
        ufo = ship(typeShips.UFO, 'ufoShip', 0, 0),
        shell_max_speed = 15,
        alien_shell_speed = 5,
        alien_speed = __level * CELL;

    ufo.x = w/2 - ufo.size.w/2;
    ufo.y = 0;

    var canvas = div
            .append("canvas")
            .text("Your browser does not have support for Canvas.")
            .attr("width", w + "px")
            .attr("height", h + "px")
        ,
        bufCanvas = document.createElement("canvas");

    d3.select(document).on("keydown.game", function() {
        var e = d3.event;
        switch(e.keyCode){
            case 37:
                dirRight = 1;
                break;
            case 39:
                dirLeft = 2;
                break;
        }
    });

    d3.select(document).on("keyup.game", function() {
        var e = d3.event;

        switch(e.keyCode){
            case 32:
                addShells(shells,
                    Math.floor(bot.x + (bot.size.w - (CELL * typeShips.SHELL.size[0])) / 2),
                    Math.floor(bot.y - (CELL * typeShips.SHELL.size[1]))
                );
                break;
            case 37:
                dirRight = 0;
                break;
            case 39:
                dirLeft = 0;
                break;
        }
    });

    var mainCtx = canvas.node().getContext("2d");
    canvas.node().focus();

    function newLevel() {
        ufo.visible = false;
        randomDisposition(map);
        calcRectAliens(map);

        alien_speed = __level * SPACE;
        shells = [];
        aShells = [];
        mainCtx.clearRect(0, 0, w, h);
        bot.x = w/2 - bot.size.w/2;
        bot.visible = true;
        bot.crashed = 0;
        posChange = true;
        refresh(__score, __level);
    }

    initShips();

    if (bot.type.buffer) {
        var shipImg = d3.select("img#shipImg");

        if (!shipImg.empty()){
            bot.size.w = shipImg.node().naturalWidth * 1.2;
            bot.size.h = shipImg.node().naturalHeight * 1.2;

            bot.type.buffer.width = bot.size.w;
            bot.type.buffer.height = bot.size.h;
            var ctxBot = bot.type.buffer.getContext("2d");
            ctxBot.clearRect(0, 0, bot.size.w, bot.size.h);
            ctxBot.scale(1.2, 1.2);
            ctxBot.drawImage(shipImg.node(), 0, 0);
        }
    }

    bot.x = w/2 - bot.size.w/2;
    bot.y = h - bot.size.h;

    newLevel();

    var vlen = map.filter(function(d){ return d.visible; }),
        timeOutMoveDown,
        timeOutMoveLR,
        cklr = shell_max_speed / (vlen.length | 1),
        klr = SPACE;

    function calcTOMLR(len) {
        return len / CELL;
    }

    function reInitStage() {

        newLevel();

        map.y = 0;
        map.x = w/2 - map.w/2;
        map.dir = 0;

        vlen = map.filter(function(d){ return d.visible; });
        timeOutMoveLR = calcTOMLR(vlen.length);
        cklr = shell_max_speed / (vlen.length | 1);
        klr = SPACE;

        drawAliens(bufCanvas, map, 0);
    }

    function timer() {
        if (pause && !bot.moveToCenter)
            return;

        if (!stop || bot.moveToCenter)
            requestAnimationFrame(timer);

        if (dirLeft || dirRight) {
            bot.px = bot.x;
            bot.x += (dirRight == 1 ? -1 : 1) * CELL;
            if (dirRight && bot.x <= 0)
                bot.x = 0;
            else if (dirLeft && bot.x >= w - bot.size.w)
                bot.x = w - bot.size.w;
            bot.moveToCenter = false;
            posChange = true;
        }

        mainCtx.save();
        mainCtx.scale(_s[0], _s[1]);
        if (!bot.moveToCenter) {

            vlen = map.filter(function(d){ return d.visible; });

            if (ufo.visible) {
                mainCtx.clearRect(ufo.x, 0, ufo.size.w, ufo.size.h);
                ufo.draw(canvas.node());
            }

            if (!astime-- && vlen.length) {
                var curAlien = vlen[Math.floor(Math.random() * vlen.length)];
                if (curAlien)
                    addShells(aShells,
                        Math.floor(map.x + curAlien.x + (curAlien.size.w - (CELL * typeShips.SHELL_ALIEN.size[0])) / 2),
                        Math.floor(map.y + curAlien.y + (CELL * typeShips.SHELL_ALIEN.size[1])),
                        typeShips.SHELL_ALIEN
                    );
                astime = 50;
            }

            var killed = checkKills(map, shells);

            timeOutMoveLR--;

            if (aShells.length) {
                drawShells(canvas.node(), aShells, alien_shell_speed);
            }

            var alive = !checkBotKill(bot, aShells);

            if (killed || timeOutMoveLR <= 0 || !alive) {
                var repaint = false;

                if (h - map.h - bot.size.h < map.y || !vlen.length || !alive) {
                    mainCtx.clearRect(bot.px, bot.y, bot.size.w, bot.size.h);
                    bot.draw(canvas.node());
                    if(!alive) {
                        gameOver(__score, __level);
                        __score = 0;
                    }
                    reInitStage();
                    if (!alive)
                        return;
                }

                mainCtx.clearRect(map.x, map.y, bufCanvas.width, bufCanvas.height);

                if (killed) {
                    refresh(__score, __level);
                    klr += cklr * killed;
                    if (klr > shell_max_speed)
                        klr = shell_max_speed;
                    repaint = true;
                }

                if (timeOutMoveLR <= 0) {
                    if (!timeOutMoveDown) {
                        timeOutMoveDown = 1;
                        map.y += alien_speed;
                    }
                    calcRectAliens(map);
                    if (map.dir) {
                        map.x += CELL;
                        if (map.x + map.w > w) {
                            map.dir = 0;
                            map.x = w - map.w;
                            timeOutMoveDown = 0;
                        }
                    }
                    else {
                        map.x -= CELL;
                        if (map.x + map.px < 0) {
                            map.dir = 1;
                            map.x = -map.px;
                            timeOutMoveDown = 0;
                        }
                    }
                    timeOutMoveLR = calcTOMLR(vlen.length);
                }

                map.y = Math.floor(map.y);
                map.x = Math.floor(map.x);

                repaint = true;
                if (repaint)
                    drawAliens(bufCanvas, map, 0);

                mainCtx.drawImage(bufCanvas, map.x, map.y);
            }

            if (shells.length) {
                drawShells(canvas.node(), shells, shell_max_speed);
            }
        }
        else {
            bot.px = bot.x;
            bot.x += bot.dir * bot.slideSpeed;
            var cp = w/2 - bot.size.w/2;
            if (bot.x - bot.slideSpeed == cp || bot.x + bot.slideSpeed == cp
                || (bot.x > cp - bot.slideSpeed
                && bot.x < cp + bot.slideSpeed)) {
                bot.x = w/2 - bot.size.w/2;
                bot.moveToCenter = false;
                if (__game.onFinish)
                    __game.onFinish(__game, {x : bot.x, y : bot.y});
            }
            posChange = true;
        }

        if (posChange) {
            mainCtx.clearRect(bot.px, bot.y, bot.size.w, bot.size.h);
            bot.draw(canvas.node());
            posChange = false;
        }
        mainCtx.restore();
    }


    __game.newGame = function() {
        __score = 0;
        //__level = 0;
        dirLeft = dirRight = 0;
        reInitStage();
        stop = false;
        pause = false;
        canvas.node().focus();
        timer();
    };

    __game.paused = function() {
        return pause;
    };

    function __running() {
        return !pause && !stop;
    }

    __game.runnig = __running;

    __game.stopGame = function() {
        stop = true;
        pause = false;
        dirLeft = dirRight = 0;
    };

    __game.pauseGame = function() {
        pause = true;
        dirLeft = dirRight = 0;
    };

    __game.resumeGame = function() {
        bot.px = bot.x;
        bot.x = bot.lx || bot.x;
        bot.y = bot.ly || bot.y;
        pause = false;
        posChange = true;
        timer();
    };

    __game.shipCoord = function() {
        return {
            x : bot.x,
            y : bot.y
        };
    };

    __game.getPic = function(w) {
        var temp = document.createElement('canvas'),
            cxt = temp.getContext("2d"),
            p = Math.abs(canvas.node().height / (canvas.node().width || 1));

        temp.width = w || 300;
        temp.height = temp.width * p;
        cxt.save();
        p = temp.width / (canvas.node().width || 1);
        cxt.scale(p, p);
        cxt.fillStyle = "#00130c";
        cxt.fillRect(0, 0, canvas.node().width, canvas.node().height);
        cxt.drawImage(canvas.node(), 0, 0);
        cxt.restore();
        return temp.toDataURL();
    };

    __game.moveShipToCenter = function(onFinish, speed) {
        dirLeft = dirRight = 0;
        bot.lx = bot.x;
        bot.ly = bot.y;
        bot.slideSpeed = speed || CELL;
        bot.dir = (bot.x > w/2 - bot.size.w/2 ? -1 : 1);
        bot.moveToCenter = true;
        __game.onFinish = onFinish || 0;
        if (bot.x == w/2 - bot.size.w/2) {
            bot.moveToCenter = false;
            __game.onFinish && __game.onFinish(__game, {x : bot.x, y : bot.y});
        }
    };

    timer();
    stop = true;
    return __game;
}