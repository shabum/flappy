 var canvas,
    ctx,
    width,
    height,
    frames = 0,
    score = 0,
    best = 0,
    fgpos = 0,

    currentState,
    states = {
        Splash: 0,
        Game: 1,
        Score: 2
    },
    /**
     * [bird description]
     * @type {Object}
     */
    bird = {
        x: 80,
        y: 0,
        frame: 0,
        velocity: 0,
        animation: [0, 1, 2, 1],
        rotation: 0,
        radius: 12,
        gravity: 0.25,
        _jump: 4.6,
        jump: function() {
            this.velocity = -this._jump;
        },
        update: function() {
            var n = currentState === states.Splash ? 10 : 5;
            this.frame += frames % n === 0 ? 1 : 0;
            this.frame %= this.animation.length;
            if (currentState === states.Splash) {
                this.y = height - 280 + 5 * Math.cos(frames / 10);
                this.rotation = 0;
            } else {
                this.velocity += this.gravity;
                this.y += this.velocity;

                if (this.y >= height - s_fg.height - 10) {
                    this.y = height - s_fg.height - 10;
                    if (currentState === states.Game) {
                        currentState = states.Score;
                    }

                    this.velocity = this._jump;
                }

                if (this.velocity >= this._jump) {
                    this.frame = 1;
                    this.rotation = Math.min(Math.PI / 2, this.rotation + 0.3);
                } else {
                    this.rotation = -0.3;
                }
            }
        },
        draw: function(ctx) {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            var n = this.animation[this.frame]
            s_bird[n].draw(ctx, -s_bird[n].width / 2, -s_bird[n].height / 2)

            ctx.restore();


        }
    },
    /**
     * [pipes description]
     * @type {Object}
     */
    pipes = {
        _pipes: [],
        reset: function() {


        },
        update: function() {
            if (frames % 100 === 0) {
                var _y = height - (s_pipeSouth.height + s_fg.height + 120 + 200 * Math.random());
                this._pipes.push({
                    x: 500,
                    y: _y,
                    width: s_pipeSouth.width,
                    height: s_pipeSouth.height
                });
            }

            for (var i = 0, len = this._pipes.length; i < len; i++) {
                var p = this._pipes[i];
                if (i === 0) {
                    score += p.x + p.width === bird.x ? 1 : 0;
                    console.log('score ', score);
                    var cx = Math.min(Math.max(bird.x, p.x), p.x + p.width);
                    var cy1 = Math.min(Math.max(bird.y, p.y), p.y + p.height);
                    var cy2 = Math.min(Math.max(bird.y, p.y + p.height + 80), p.y + 2 * p.height + 80);

                    var dx = bird.x - cx;
                    var dy1 = bird.y - cy1;
                    var dy2 = bird.y - cy2;

                    var d1 = dx * dx + dy1 * dy1;
                    var d2 = dx * dx + dy2 * dy2;
                    var r = bird.radius * bird.radius;

                    if (r > d1 || r > d2) {
                        currentState = states.Score;

                    }

                }


                p.x -= 2;
                if (p.x < -50) {
                    this._pipes.splice(i, 1);
                    i--;
                    len--;
                }

            }
        },

        draw: function(ctx) {
            for (var i = 0, len = this._pipes.length; i < len; i++) {
                var p = this._pipes[i];
                s_pipeSouth.draw(ctx, p.x, p.y);
                s_pipeNorth.draw(ctx, p.x, p.y + 80 + p.height);
            }
        }
    };



 function onpress(e) {
    switch (currentState) {
        case states.Splash:
            currentState = states.Game;
            bird.jump();
            break;

        case states.Game:
            bird.jump();
            break;

        case states.Score:
            break;

    }

 }

 /**
  * [main description]
  * @return {[type]} [description]
  */
 function main() {
    canvas = document.createElement("canvas");
    width = window.innerWidth;
    height = window.innerheight;
    
    var evt = "touchstart"
    if (width >= 500) {
        width = 320;
        height = 480;
        canvas.style.border = "1px solid #000";
        evt = "mousedown"
    }
    document.addEventListener(evt, onpress)

    canvas.width = width;
    canvas.height = height;
    ctx = canvas.getContext("2d");

    currentState = states.Splash;

    document.body.appendChild(canvas);

    var img = new Image();
    img.onload = function() {
        initSprites(this);
        ctx.fillStyle = s_bg.color;
        run();

    }
    img.src = "res/sheet.png"
 }

 function run(f) {
    var loop = function() {
        update();
        render();
        window.requestAnimationFrame(loop, canvas);
    }
    window.requestAnimationFrame(loop, canvas);
 }


 function update() {
    frames++;
            document.title = score;
    if (currentState != states.Score) {
        fgpos = (fgpos - 2) % 14;
    }
    if (currentState === states.Game) {
        pipes.update();
    }

    bird.update();

 }

 function render() {
    ctx.fillRect(0, 0, width, height);
    s_bg.draw(ctx, 0, height - s_bg.height);
    s_bg.draw(ctx, s_bg.width, height - s_bg.height);

    bird.draw(ctx)
    pipes.draw(ctx);

    s_fg.draw(ctx, fgpos, height - s_fg.height);
    s_fg.draw(ctx, fgpos + s_fg.width, height - s_fg.height);

    var width2 = width / 2;
    if (currentState === states.Splash) {
        s_splash.draw(ctx, width2 - s_splash.width / 2, height - 300);
        s_text.GetReady.draw(ctx, width2 - s_text.GetReady.width / 2, height - 300)
    }

 }
 main();
