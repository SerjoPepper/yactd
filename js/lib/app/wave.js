(function (exports) {

    function Wave (params) {
        var mobData = app.data.mobs[params.mobType],
            hardness = params.hardness,
            pathCoords = params.pathCoords;

        this.mobType = params.mobType;
        this.hardness = hardness;
        this.activateFps = mobData.activateTime / 1000 * app.data.fps;
//            mobPathCoords = this.calculateMobPath(params.pathCoords, mobData.speed);
/*
        this.parent = params.parent;
        this.collection = new ymaps.GeoObjectCollection({}, {
            preset: mobData.preset
        });

        this.ticker = new exports.Ticker(1000 * mobData.freq, this.activateMob, this);
        */
        this.mobs = [];
        for (var i = 0; i <= mobData.count; i++) {
            var mob = new exports.Mob({
                data: mobData,
                parent: this.collection,
                pathCoords: pathCoords,
                hardness: hardness
            });
            this.mobs.push(mob);
            mob.activate(i * this.activateFps);
        }
//        this.activeMobsCount = 0;
    }

    Wave.prototype = {

/*        activateMob: function () {
            if (this.activeMobsCount < this.mobs.length) {
                this.mobs[this.activeMobsCount++].activate();
            } else {
                this.ticker.pause();
            }
        },*/

        play: function () {
            this.ticker.play();
        },

        pause: function () {
            this.ticker.pause();
        },

        tick: function (home, towers) {
            if (this.finished) {
                return;
            }

            for (var i = 0, il = this.mobs.length, destroyedMobs = 0; i < il; i++) {
                var mob = this.mobs[i];
//                if (mob.active) {
                mob.tick(home, towers);
                if (home.destroyed) {
                    return;
                }
//                }
                if (mob.destroyed) {
                    destroyedMobs++;
                }
            }

            if (destroyedMobs == i - 1) {
                this.finished = true;
            }
        },
        
        activate: function () {
            
        }

    };

    exports.Wave = Wave;

})(app.lib);