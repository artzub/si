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
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
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
        '#99FFEF',
        '#FFB599',
        '#FF99E9',
        '#00ff00',
        '#ff0000',
        '#ffffff'
    ],
    typeShips = {
        SMALL_BOT : {
            type : 0,
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
            ]
        },
        MID_BOT : {
            type : 1,
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
            ]
        },
        BIG_BOT : {
            type : 2,
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
            ]
        },
        SHELL : {
            type : 4,
            size : [1, 2],
            pattern : [
                [1],
                [1]
            ]
        },
        UFO : {
            type : 5,
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
    initialised = false;

function initShips() {
    function drawBot(canvas, params) {
        var ctx = canvas.getContext("2d");
        ctx.globalAlpha = 1;

        canvas.width = params.size[0] * CELL;
        canvas.height = params.size[1] * CELL;

        ctx.save();
        ctx.fillStyle = acolor[params.type];
        params.pattern.forEach(function(r, i) {
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
    })
}

function ship(type, id, x, y) {
    var bot = item(id, x, y);

    bot.type = type;
    bot.size = {
        w : type.size[0] * CELL,
        h : type.size[1] * CELL
    };

    bot.draw = function(canvas) {
        if (!bot.visible)
            return;

        var ctx = canvas.getContext("2d"),
            buf = bot.type.buffer;
        if (buf) {
            ctx.save();
            /*ctx.translate(this.translate());
             ctx.scale(this.scale());*/

            ctx.drawImage(buf,
                bot.x,
                bot.y
            );

            ctx.fillStyle = "#ff0000";
            ctx.fillRect(bot.x, bot.y, 1, 1);

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
    map.h = y + SPACE * 2;
    map.x = 0;
    map.y = 0;
    return map;
}

function randomDisposition(map) {
    map.forEach(function(c) {
        c.visible = true; //(Math.round((Math.random() * 2) % 2) ? true : false);
    });
}

function drawAliens(canvas, map, time) {
    if (!(map instanceof Array))
        return;

    var ctx = canvas.getContext("2d");

    canvas.width = map.w;
    canvas.height = map.h;

    params[0][1].innerText = "map [y]" + map.y;

    ctx.save();
    ctx.translate(0, time);
    map.forEach(function(c) {
        c.draw(canvas);
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
                params[0][0].innerText = "s [x, y]" + [shell.x, shell.y];
                return !shell.deleted
                    && b.visible
                    && b.y + map.y + b.size.h >= shell.y
                    && b.x + map.x < shell.x
                    && b.x + map.x + b.size.w > shell.x
                    && (params[0][2].innerText = "b [x, y, w, h, my]" + [b.x, b.y, b.size.w, b.size.h, map.y])
                    && !(b.visible = false)
                    && (shell.deleted = true);
            }
        })(shell));

        if (shell.deleted)
            killed++;
    }
    return killed;
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
        s.y -= time;
        if (s.y > 0 && !s.deleted) {
            params[0][0].innerText = "shell [x, y]" + [s.x, s.y];
            s.draw(canvas);
            shells.push(s);
        }
    });
    ctx.restore();
}

function addShells(arr, x, y) {
    arr.push(ship(typeShips.SHELL, arr.length, x, y));
}

var params = [];

function main() {
    params = d3.selectAll('.param');
    var div = d3.select("#games"),
        w = div.node().clientWidth,
        h = div.node().clientHeight,
        posChange = true;

    /*prop = w/h;
     h = Math.sqrt(Math.pow(w, 2) + Math.pow(h, 2)) * 2 / 3;
     w = h * prop;*/

    var map = makeMap(w, h),
        bot = ship(typeShips.SHIP, 'mainShip', 0, 0),
        shells = [],
        ufo = ship(typeShips.UFO, 'ufoShip', 0, 0),
        shell_speed = 15;


    bot.x = w/2 - bot.size.w/2;
    bot.y = h - bot.size.h;

    ufo.x = w/2 - ufo.size.w/2;
    ufo.y = 0;

    var canvas = div
            .append("canvas")
            .text("Your browser does not have support for Canvas.")
            .attr("width", w + "px")
            .attr("height", h + "px")
        ,
        bufCanvas = document.createElement("canvas");

    d3.select(document).on("keydown", function() {
        var e = d3.event;
        switch(e.keyCode){
            case 37:
                bot.px = bot.x;
                bot.x -= CELL * 2;
                if (bot.x <= 0)
                    bot.x = 0;
                else
                    posChange = true;
                break;
            case 39:
                bot.px = bot.x;
                bot.x += CELL * 2;
                if (bot.x >= w - bot.size.w)
                    bot.x = w - bot.size.w;
                else
                    posChange = true;
                break;
        }
    });

    d3.select(document).on("keypress", function() {
        var e = d3.event;
        switch(e.keyCode){
            case 32:
                addShells(shells, bot.x + bot.size.w/2, bot.y - 2 * CELL);
                break;
        }
    });

    var mainCtx = canvas.node().getContext("2d");
    canvas.node().focus();

    function newLevel() {
        ufo.visible = true;
        randomDisposition(map);
        shells = [];
        mainCtx.clearRect(0, 0, w, h);
        lastBotPos = bot.x;
        bot.x = w/2 - bot.size.w/2;
        posChange = true;
    }

    initShips();
    newLevel();

    var timeOff = 0,
        timeOutMove = 0,
        coff = 100,
        kd = coff / (h - map.h - 100),
        cklr = shell_speed / (map.length | 1),
        klr = CELL;

    function reinitStage() {
        map.y = 100;
        map.x = w/2 - map.w/2;
        map.dir = 0;
        newLevel();
        coff = 100;
        klr = CELL;
        drawAliens(bufCanvas, map, 0);
    }

    reinitStage();

    (function timer(time) {
        requestAnimationFrame(timer);

        mainCtx.save();
        if (ufo.visible) {
            mainCtx.clearRect(ufo.x, 0, ufo.size.w, ufo.size.h);
            ufo.draw(canvas.node());
        }

        var killed = checkKills(map, shells);
        timeOff--;
        timeOutMove--;
        if (timeOff <= 0 || killed || timeOutMove <= 0) {
            var repaint = false;

            mainCtx.clearRect(map.x, map.y, bufCanvas.width, bufCanvas.height);

            if (h - map.h < map.y || !map.filter(function(d){ return d.visible; }).length) {
                reinitStage();
            }

            if (killed) {
                coff -= (kd * 2) * killed;
                klr += cklr * killed;
                if (klr > shell_speed)
                    klr = shell_speed;
                repaint = true;
            }
            else if (timeOff <= 0) {
                map.y += h * 0.02;
                timeOff = coff;
            }

            if (timeOutMove <= 0) {
                if (map.dir) {
                    map.x += klr;
                    if (map.x + map.w > w) {
                        map.dir = 0;
                        map.x = w - map.w;
                    }
                }
                else {
                    map.x -= klr;
                    if (map.x < 0) {
                        map.dir = 1;
                        map.x = 0;
                    }
                }
                timeOutMove = 20;
            }

            map.y = Math.floor(map.y);
            map.x = Math.floor(map.x);

            if (repaint)
                drawAliens(bufCanvas, map, 0);

            mainCtx.drawImage(bufCanvas, map.x, map.y);
        }

        if (shells.length) {
            drawShells(canvas.node(), shells, shell_speed);
        }

        if (posChange) {
            mainCtx.clearRect(bot.px, bot.y, bot.size.w, bot.size.h);
            bot.draw(canvas.node());
            //lastBotPos = bot.x;
            posChange = false;
        }
        mainCtx.restore();
    })(0);
}
