(function (exports) {

    function Mob (params) {
        this.pathCoords = params.pathCoords;

        this.hp = this.currentHp = Math.ceil(params.data.hp * params.hardness);
        this.money = Math.ceil(params.data.money * Math.max(1, params.hardness / 1.5));
        this.damage = params.data.damage;
        this.speed = params.data.speed / app.data.fps;
        this.imgSize = params.data.imgSize;
        this.offset = params.data.offset;

/*
        this.img = new Image();
        this.img.src = params.data.img;
        $(this.img).load($.proxy(function () {
            this.imgLoaded = true;
            this.imgSize = [
                this.img.naturalWidth || this.img.width,
                this.img.naturalHeight || this.img.height
            ];
        }, this));
*/


        this.pathCoords = params.pathCoords;

        this.destroyed = false;
        this.active = false;

        this.pos = this.pathCoords[0];
        this._nextPathIndex = 1;

        this.pane = app.shadowsPane;

        this.lifeStatus = document.createElement('div');
        this.jLifeStatus = $(this.lifeStatus);
        this.jLifeStatus.addClass('mob-life-status');

        this.lifeGreenStatus = document.createElement('div');
        this.jLifeStatusGreen = $(this.lifeGreenStatus);
        this.jLifeStatusGreen.addClass('green');

        this.jLifeStatus.append(this.jLifeStatusGreen);

        this.mobElement = document.createElement('div');
        this.jMobElement = $(this.mobElement);
        this.jMobElement.addClass('mob-element');

        this.jMobPic = $(document.createElement('div'));
        this.jMobPic.addClass('mob-pic ' + params.data.cssClass);
        this.jMobElement.append(this.jMobPic).append(this.jLifeStatus);

        this.jPane = $(this.pane.getElement());
        this.jPane.append(this.jMobElement);
        this.paneListeners = this.pane.events.group().add('viewportchange', this._onViewportChange, this);
        this.toggleFps = 0;
    }

    Mob.prototype = {

        _onViewportChange: function () {
            this.setPosition();
        },

        activate: function (activateFps) {
            this.activateFps = activateFps;
            this._currentFps = 0;
        },

        destroy: function () {
            this.destroyed = true;
            this.hide();
        },

        removeFromDom: function () {
            this.paneListeners.removeAll();
            this.jMobElement.remove();
        },

        show: function () {
            this.jMobElement.show();
        },

        hide: function () {
            this.jMobElement.hide();
        },

        tick: function (home, towers) {
            if (!this.active && ++this._currentFps >= this.activateFps) {
                this.active = true;
                this.show();
            }

//            app.game.finished && console.log('!this.active || this.destroyed', this.active, this.destroyed);

            if (!this.active || this.destroyed) {
                return;
            }

            var nextCoords = this._getNextCoords();

            if (nextCoords) {
                this.pos = nextCoords;

                for (var k in towers) {
                    if (towers.hasOwnProperty(k)) {
                        towers[k].punch(this);
                        if (this.destroyed) {
                            this.renderStats();
                            this.setPosition(nextCoords);
                            return;
                        }
                    }
                }

                this.renderStats();
                this.setPosition(nextCoords);
                home.stab(this);
            } else {
                this.destroy();
            }

            if (this.toggleFps++ > 4) {
                this.jMobPic.toggleClass('second-state');
                this.toggleFps = 0;
            }
        },

        stab: function (damage) {
            if (!this.destroyed) {
                this.currentHp = Math.max(this.currentHp - damage, 0);
//            this.placemark.properties.set('hpcoef', this.currentHp / this.hp);
                if (this.currentHp <= 0) {
                    this.destroy();
                    return true;
                }
            }
        },

        _getNextCoords: function () {
            if (this._pathEnded) {
                return null;
            }
            var tlen = 0,
                coords = this.pathCoords,
                pos = this.pos,
                i = this._nextPathIndex,
                nextCoords,
                prevPos = pos,
                distance;

            while (tlen - this.speed < 0 && (nextCoords = coords[i])) {
                distance = exports.util.distance(nextCoords, pos);
                tlen += distance;
                prevPos = pos;
                pos = nextCoords;
                i++;
            }

            if (nextCoords) {
                var k = (distance - (tlen - this.speed)) / distance,
                    vec = [pos[0] - prevPos[0], pos[1] - prevPos[1]];

                pos = [prevPos[0] + vec[0] * k, prevPos[1] + vec[1] * k];
                this._nextPathIndex = i - 1;
            } else {
                this._pathEnded = true;
                pos = coords[coords.length - 1];
            }

            return pos;
        },

        setPosition: function (geocoords) {
            if (geocoords) {
                this._geoCoords = geocoords;
            }

            if (this._geoCoords) {
                var localCoords = exports.util.toLocalPixels(this._geoCoords);
                this.jMobElement.css({
                    left: localCoords[0] + this.offset[0],
                    top: localCoords[1] + this.offset[1]
                });
            }
        },

        renderStats: function () {
            var percents = Math.round(this.currentHp / this.hp * 100);
            this.jLifeStatusGreen.css('width', percents + '%');
            /*,
                lineLength = 25,
                offset = [Math.round(lineLength / 2), -3 - this.img.size[1] / 2],
                greenCoords = [
                    [
                        this._localPos[0] + offset[0],
                        this._localPos[1] + offset[1]
                    ], [
                        this._localPos[0] + offset[0] + Math.round(lineLength * k),
                        this._localPos[1] + offset[1]
                    ]
                ],
                redCoords = [[
                    greenCoords[1][0],
                    greenCoords[1][1]
                ], [
                    greenCoords[1][0] + Math.round(lineLength * (1 - k)),
                    greenCoords[1][1]
                ]];
            exports.util.renderLine(greenCoords, '#00cc00');
            exports.util.renderLine(redCoords, '#cc0000');*/
        }
    };

    exports.Mob = Mob;

})(app.lib);