/**
 * User: ArtZub
 * Date: 05.12.12
 * Time: 11:28
 */

function init() {
    var score = d3.select("#score");

    window.game = createGamePlay("#games", 850, 850, 2, function(scr, lvl) {
        score.text(scr);
        d3.selectAll(".titledata").attr("content", "apus agency. My score " + score.text());
        d3.selectAll(".descdata").attr("content", "My score " + score.text());
        d3.selectAll(".title").text("apus agency. My score " + score.text());
    }, facebookShare);

    var backGame = d3.selectAll(".backtogame")
            .style("display", "none")
            .on("click", function() {
                helpGame
                    .transition()
                    .duration(1000)
                    .style("opacity", 0)
                    .each("end", function() {
                        d3.select(this)
                            .style("display", "none");
                    });
                if (game.paused())
                    play(d3.select(this));
                else
                    backGame.style("display", "none");
            }),
        startGame = d3.select("#start_game").on("click", function() {
            play(d3.select(this));
        }),
        helpGame = d3.select("#help"),
        htp = d3.select("#howtoplay").on("click", function() {
            d3.event.preventDefault();
            if (game.runnig())
                pauseGame();
            else
                backGame.style("display", null);

            helpGame
                .style("opacity", 0)
                .style("display", null)
                .transition()
                .duration(1000)
                .style("opacity", 1);
        })
        ;

    function posGames() {
        var al = 45,
            li = d3.select("#logoimg"),
            g = d3.select("#games"),

            wg = parseInt(g.property("clientWidth")),
            hg = parseInt(g.property("clientHeight")),

            w = parseInt(li.property("naturalWidth")),
            h = parseInt(li.property("naturalHeight")),

            wli = parseInt(li.property("width")),
            hli = parseInt(li.property("height")),

            nwg = 2 * (Math.sqrt(Math.pow(hg, 2) + Math.pow(wg, 2)) / 2) * Math.sin(Math.atan(hg/wg) + al),
            nhg = 2 * (Math.sqrt(Math.pow(hg, 2) + Math.pow(wg, 2)) / 2) * Math.sin(Math.atan(wg/hg) + al),

            dx = (nwg - wg) / 2 * 1.43,
            dy = (nhg - hg) / 2 * 1.26,

            cw = (w / wli),
            ch = (h / hli),

            l = wli * .77 + li.property("offsetLeft"),
            b = hli * .52 + 28 / ch - ch * 2,

            coord = game.shipCoord();

        coord.x -= wg/2 - 16.5;

        coord.x /= 2;

        coord.x = coord.x * Math.sin(al);
        coord.y = -coord.x;

        g.style("left", l - dx + "px")
                .style("bottom", b - dy + "px");

        d3.select("#start_game").style("left", l + coord.x * (coord.x > 0 ? 1.18 : 1.17 ) + "px")
                .style("bottom", b + coord.y * (coord.y > 0 ? 1.17 : 1.18 )  + "px");
    }

    d3.select(window)
            .on("resize", posGames);

    function makeScreen() {
        d3.selectAll(".imgdata")
            .attr("content", game.getPic());
        d3.select("#echo").attr("src", game.getPic());
    }

    posGames();

    function pauseGame() {
        if (!game.runnig())
            return;

        makeScreen();

        game.pauseGame();

        game.moveShipToCenter(function() {
            d3.selectAll(".games").classed("run", false);
            d3.selectAll("li.run").classed("run", false);

            d3.selectAll(".game_mode, .game_mode_gr")
                    .transition()
                    .duration(200)
                    .style("opacity", 0)
                    .each("end", function () {
                        d3.select(this)
                                .style("display", "none");
                    });

            d3.select("#logoimg")
                    .transition()
                    .duration(500)
                    .style("opacity", 1);

            backGame.style("display", null);

            posGames();

            slide("100%");
            startGame.classed("hide", false);
        });
    }

    function play(item) {
        startGame.classed("hide", true);
        slide(0);

        backGame.style("display", "none");

        if (item.node() == startGame.node()) {
            game.newGame();
        }
        else {
            game.resumeGame();
        }

        d3.selectAll(".games").classed("run", true);
        d3.selectAll(".likes>ul li:first-child").classed("run", true);

        d3.selectAll(".game_mode, .game_mode_gr")
                .style("display", "block")
                .transition()
                .duration(500)
                .style("opacity", 1);

        d3.select("#logoimg")
                .transition()
                .duration(500)
                .style("opacity", .3);

        d3.select(document).on("keyup.play", function () {
            if (d3.event.keyCode == 27 || d3.event.keyCode == 80) {
                pauseGame();
            }
        });
        makeScreen();
    }

    function stopGame() {
        pauseGame();

        game.stopGame();

        backGame.style("display", "none");
    }

    function slide(max, del) {
        startGame
                .transition()
                .delay(del || 1)
                .duration(2000)
                .style('max-width', max);
    }

    slide("100%", 1000);

    d3.selectAll("a.lang_ru").on("click", function() {
        d3.event.preventDefault();

        var item = d3.select(this);
        item.classed("hide", true);
        d3.selectAll("span.lang_eng, a.lang_ru").style("display", "none");
        d3.selectAll("a.lang_eng, span.lang_ru").style("display", null);
        d3.selectAll("a.lang_eng").classed("hide", false);

        d3.selectAll(".eng")
                .transition()
                .duration(1000)
                .style("opacity", 0)
                .each("end", function(item) {
                    d3.select(this).style("display", "none");

                    d3.selectAll(".ru")
                            .style("opacity", 0)
                            .style("display", null)
                            .style("width", null)
                            .transition()
                            .duration(1000)
                            .style("opacity", 1);
                })
        ;
    });

    d3.selectAll("a.lang_eng").on("click", function() {
        d3.event.preventDefault();

        var item = d3.select(this);
        item.classed("hide", true);
        d3.selectAll("span.lang_ru, a.lang_eng").style("display", "none");
        d3.selectAll("a.lang_ru, span.lang_eng").style("display", null);
        d3.selectAll("a.lang_ru").classed("hide", false);

        d3.selectAll(".ru")
                .transition()
                .duration(1000)
                .style("opacity", 0)
                .each("end", function(item) {
                    d3.select(this).style("display", "none");

                    d3.selectAll(".eng")
                            .style("opacity", 0)
                            .style("display", null)
                            .style("width", null)
                            .transition()
                            .duration(1000)
                            .style("opacity", 1);
                })
                ;
    });
    game.stopGame();

    d3.select("#share_button")
        .on("click", function() {
            d3.event.preventDefault();
            writeShare();
            hideShare();
        });

    d3.select("#cancel_button").on("click",function() {
        d3.event.preventDefault();
        hideShare();
    });

    function hideShare() {
        backGame.style("display", "none");
        d3.select("#finishedForm")
            .transition()
            .duration(1000)
            .style("opacity", 0)
            .each("end", function() {
                d3.select(this).style("display", "none");
            });
    }

    function writeShare() {
        game.imgData && $.ajax({
            url: 'http://api.imgur.com/2/upload.json',
            type: 'POST',
            data: {
                type: 'base64',
                key: 'cd059636b01061d16eb49f72107c2cf6',
                name: 'screen',
                title: 'screen si',
                caption: 'screen si',
                image: game.imgData.split(',')[1]
            },
            dataType: 'json',
            success: function(data) {
                return open(data.upload && data.upload.links && data.upload.links.original ? data.upload.links.original : 0);
            },
            error: function(rsp) {
                open();
                return console.log(rsp);
            }
        }) || open();
        function open(imgurl) {
            window.open('https://www.facebook.com/dialog/feed?' +
                'app_id=141151189369644&' +
                'link=' + encodeURIComponent(document.location) + '&' +
                'picture=' + (imgurl || 'http://artzub.com/works/si/game.png') + '&' +
                'name=' + encodeURIComponent(d3.select("title").text()) + '&' +
                'caption=Apus%20Agency&' +
                'description=' + encodeURIComponent(
                'Creative agency «Apus» appeared in 2008, and today, ' +
                    'we - a team of specialists, successfully meet ' +
                    'the challenges in the field of visual and digital communications.'
            ) + '&' +
                'redirect_uri=https://www.facebook.com/Apus.agency', "Share",
                "width=200" + window.outerWidth * .6 + ", height=" + window.outerHeight * .7 +
                ", left=" + window.outerWidth * .4 + ", top=" + window.outerHeight * .35
            );
        }
    }

    function facebookShare(s, l) {
        game.imgData = game.getPic();
        stopGame();
        d3.select("#result").text(s);
        d3.select("#finishedForm")
            .style("opacity", 0)
            .transition()
            .duration(1000)
            .style("opacity", 1)
            .each("end", function() {
                d3.select(this).style("display", "block");
                writeShare();
            });
    }
}