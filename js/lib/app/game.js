(function (exports) {

    function Game (params) {
        this.collection = new ymaps.GeoObjectCollection;
        this.points = params.points;
        this.map = params.map;
        this.events = new ymaps.event.Manager({ context: this });
        this.settings = exports.settings.game;

        this.home = new exports.Home({
            parent: this.collection,
            pos: this.points.finish
        });
        this.home.addToParent();

        this.hole = new ymaps.Placemark(this.points.start, {}, {
            preset: app.data.holePreset
        });
        this.hole.setParent(this.collection);

        this.routeCoords = params.route.getPaths().get(0).geometry.getCoordinates();
        this.route = params.route;

        this.routeCoords.unshift(this.points.start);
        this.routeCoords.push(this.points.finish);

        this.routePolyline = new ymaps.Polyline(this.routeCoords, {}, {
            preset: app.data.routePreset
        });

        this.routePolyline.setParent(this.collection);
//        this.routes = [];
/*
        this.readyRoutesCount = 0;
        this.failRoutesCount = 0;
*/
        /*this.route = new exports.Route({
            route: params.route,
            parent: this.collection,
            points: this.points
        });*/

        /*for (var i = 0; i < this.settings.routes.length; i++) {
            var route = new exports.Route(
                $.extend({
                    pos: this.pos,
                    parent: this.collection
                }, this.settings.routes[i])
            );
            route.events.group()
                 .add('ready', this.onRootReady, this)
                 .add('fail', this.onRootFail, this);
        }*/

        this.ticker = new exports.Ticker(1000 / app.data.fps, this.tick, this);

        this.levels = exports.settings.game.levels;
        this.finished = false;

        this.player = new exports.Player({
            parent: this.collection
        });


        this.player.addToParent();

        this.stats = {
            level: $('#stats .level .val')
        };

//        this.levelManager = new exports.levelManager();
    }

    Game.prototype = {

        addToMap: function () {
            this.map.geoObjects.add(this.collection);
            this.events.fire('addtomap');
        },

        removeFromMap: function () {
            this.map.geoObjects.remove(this.collection);
            this.wave.mobs.map(function (mob) {
                mob.destroy();
            });
        },

        finish: function () {
//            this.pause();
            this.player.removeFromParent();
            this.finished = true;
            this.events.fire('finish');
        },

        play: function () {
            if (!this.wave || this.wave.finished) {
                this.wave = this.createWave(this.wave)
            }
//            this.player.startRecharge();
            this.ticker.play();
        },

        start: function () {
            this.map.setBounds(this.route.properties.get('boundedBy'), {
                checkZoomRange: true,
                callback: function () {
                    $.pnotify({ text: 'game start' });
                }
            });
            //this.play()
        },

        pause: function () {
        /*    return;
            this.playing = false;
            if (this.currentWaves) {
                for (var i = 0, il = this.currentWaves.length; i < il; i++) {
                    this.currentWaves[i].pause();
                }
            }
            this.player.stopRecharge();*/
            this.ticker.pause();
        },

        tick: function () {
            this.wave.tick(this.home, this.player.towers);
            this.player.tick();

            if (this.home.destroyed && !this.finished) {
                this.finish();
                return;
            }

            if (this.wave.finished) {
                this.wave = this.createWave(this.wave);
            }

//            this.finished && console.log('tick');
        },

/*        finishLevel: function () {
            this.currentWaves = null;
            this.events.fire('finishlevel');

            for (var i = 0, il = this.routes.length; i < il; i++) {
                this.routes[i].deactivatePath();
            }

            this.currentWaves = this.createCurrentWaves();
            if (!this.currentWaves) {
                this.finish();
            }
        },*/

        createWave: function (prevWave) {
            var mobType = 0,
                hardness = 1,
                wave,
                params = {};

            if (prevWave) {
                if (++prevWave.mobType >= app.data.mobs.length) {
                    mobType = 0;
                    hardness = prevWave.hardness * 3;
                } else {
                    mobType = prevWave.mobType;
                    hardness = prevWave.hardness;
                }
            }

            params.hardness = hardness;
            params.mobType = mobType;
            params.pathCoords = this.routeCoords;

            wave = new exports.Wave(params);

            setTimeout(function () {
                wave.activate()
            }, app.data.waveActivateTime);

            return wave;
        },

        enableForward: function () {
            this.ticker.setK(2);
        },

        disableForward: function () {
            this.ticker.setK(1);
        },
/*        createCurrentWaves: function () {
            var data = this.levels[this.levelIndex++];
            if (!data) {
                return null;
            }

            var waves = [];
            for (var i = 0; i < data.routes; i++) {
                if (this.routes[i]) {
                    waves.push(this.routes[i].createWave(data));
                    this.routes[i].activatePath();
                }
            }

            this.stats.level.text(this.levelIndex);
            return waves;
        },*/

/*
        startBuildTowers: function () {
            this.buildTowerEvents = this.map.events.group()
                .add('click', this.geocodePoint, this);
        },

        stopBuildTowers: function () {
            if (this.buildTowerEvents) {
                this.buildTowerEvents.removeAll();
            }
        },
*/

/*
        geocodePoint: function (e) {
            ymaps.geocode(e.get('coordPosition'), { kind: 'house', results: 1 })
                 .then($.proxy(this.openBuyTowerBalloon, this));
        },
*/

/*        openBuyTowerBalloon: function (res) {
            var point = res.geoObjects.get(0);
            if (point) {
                this.buyingTowerPos = point.geometry.getCoordinates();
                this.map.balloon.open(this.buyingTowerPos, {
                    contentBody: this.getBalloonContentBody()
                });
            }
        },*/

        sellTower: function (k) {
            this.player.sellTower(k);
            this._updateStats();
        },

        getBounds: function () {
            var b1 = this.routes[0].getBounds();
            for (var i = 1, il = this.routes.length; i < il; i++) {
                var b2 = this.routes[i].getBounds();
                b1 = [
                    [Math.min(b1[0][0], b2[0][0]), Math.min(b1[0][1], b2[0][1])],
                    [Math.max(b1[1][0], b2[1][0]), Math.max(b1[1][1], b2[1][1])]
                ];
            }
            return b1;
        },

        onRootReady: function (e) {
            var route = e.get('target');
            this.routes.push(route);
            route.addToParent();
            if (++this.readyRoutesCount + this.failRoutesCount == this.settings.routes.length) {
                this.onReady();
            }
        },
        
        onRootFail: function (e) {
            if (this.readyRoutesCount + ++this.failRoutesCount == this.settings.routes.length) {
                this.onReady();
            }
        },

        onReady: function () {
            if (this.routes.length == 0) {
                this.events.fire('noroutesfound');
                this.finished = true;
            } else {
                this.currentWaves = this.createCurrentWaves();
                this.map.setBounds(this.getBounds());
                this.events.fire('ready');
            }
        },

        canBuy: function (price) {
            return this.player.money >= price;
        },

        upgradeTower: function (towerid) {
            var tower = this.player.towers[towerid];
            if (this.player.money >= tower.upgradePrice) {
                this.player.setMoney(this.player.money - tower.upgradePrice);
                tower.upgrade();
                this._updateStats();
                this.events.fire('showtower', { tower: tower });
            }
        },

        saleTower: function (towerid) {
            var tower = this.player.towers[towerid];
            tower.removeFromParent();
            this.player.setMoney(this.player.money + tower.sellPrice);
            delete this.player.towers[towerid];
            this._updateStats();
            this.events.fire('removetower');
        },

        setCurrentBuyTower: function (currentTower, pos) {
            if (this._currentBuyTower) {
                this._currentBuyTower.removeFromParent();
            }
            this._currentBuyTower = null;
            if (currentTower) {
                this._currentBuyTower = new exports.Tower(currentTower);
                if (pos) {
                    this._currentBuyTower.setPos(pos);
                    this._currentBuyTower.setParent(this.collection);
                }
            }
        },

        removeCurrentBuyTower: function () {
            if (this._currentBuyTower) {
                this._currentBuyTower.removeFromParent();
                this._currentBuyTower = null;
            }
        },

        buyTower: function () {
            if (this.player.buyTower(this._currentBuyTower)) {
                var tower = this._currentBuyTower;
                this._currentBuyTower = null;
                tower.selectableTower();
                this.showTower(tower);
                this._updateStats();
            }
        },

        _updateStats: function () {
            this.events.fire('updatestats');
        },

        showTower: function (tower) {
            this.events.fire('showtower', { tower: tower });
        }
    };
    exports.Game = Game;

})(app.lib);