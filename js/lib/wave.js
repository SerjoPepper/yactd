(function (exports) {

    function Wave (params) {
        var mobData = exports.settings.mobs[params.type],
            mobCount = params.count,
            mobPathCoords = this.calculateMobPath(params.pathCoords, mobData.speed);

        this.parent = params.parent;
        this.collection = new ymaps.GeoObjectCollection({}, {
            preset: mobData.preset
        });

        this.ticker = new exports.Ticker(1000 * mobData.freq, this.activateMob, this);
        this.mobs = [];
        for (var i = 0; i < mobCount; i++) {
            var mob = new exports.Mob({
                data: mobData,
                parent: this.collection,
                pathCoords: mobPathCoords
            });
            this.mobs.push(mob);
            mob.addToParent();
        }
        this.activeMobsCount = 0;
    }

    Wave.prototype = {

        addToParent: function () {
            this.parent.add(this.collection);
        },

        removeFromParent: function () {
            this.parent.remove(this.collection);
        },

        activateMob: function () {
            if (this.activeMobsCount < this.mobs.length) {
                this.mobs[this.activeMobsCount++].activate();
            } else {
                this.ticker.pause();
            }
        },

        play: function () {
            this.ticker.play();
        },

        pause: function () {
            this.ticker.pause();
        },

        calculateMobPath: function (coords, speed) {
            var mobPath = [],
                tlen = 0;

            speed = speed/exports.settings.fps;

            for (var i = 0, il = coords.length - 1; i < il; i++) {
                var k,
                    vec = [coords[i + 1][0] - coords[i][0], coords[i + 1][1] - coords[i][1]],
                    len = exports.util.distance(coords[i], coords[i + 1]);

                tlen += len;

                while(tlen > 0) {
                    k = 1 - tlen/len;
                    mobPath.push([coords[i][0] + vec[0] * k, coords[i][1] + vec[1] * k]);
                    tlen -= speed;
                }
            }

            mobPath.push(coords[il]);
            return mobPath;
        },

        tick: function (home, towers) {
            if (this.finished) {
                return;
            }

            for (var i = 0, il = this.mobs.length, destroyedMobs = 0; i < il; i++) {
                var mob = this.mobs[i];
                if (mob.active) {
                    mob.tick(home, towers);
                    if (home.destroyed) {
                        return;
                    }
                }
                if (mob.destroyed) {
                    destroyedMobs++;
                }
            }
            if (destroyedMobs == i) {
                this.finished = true;
            }
        }

    };

    exports.Wave = Wave;

})(app.lib);