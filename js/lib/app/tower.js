(function (exports) {

    function Tower (tower) {
        if (!tower) {
            tower = app.data.defaultTower;
            this._isDefault = true;
            this.radius = tower.radius;
        } else {
            for (var k in tower) {
                this[k] = tower[k];
            }
            this.sellPrice = Math.round(tower.price * 0.9);
            this.upgradePrice = Math.round(tower.price * 1.1);
            this.rechargeFps = app.data.fps / this.speed;
        }

        this.placemark = new ymaps.Placemark(null, {}, {
            hasBalloon: false,
            iconImageHref: tower.img,
            zIndex: 2000,
            zIndexHover: 5000,
            preset: tower.preset
        });

        this.circle = new ymaps.Circle([null, this.radius], {}, {
            preset: tower.preset,
            overlayFactory: ymaps.geoObject.overlayFactory.staticGraphics
        });
        /*this.shootLine = new ymaps.Polyline([this.pos, this.pos], {}, {
            visible: false,
            preset: params.gunPreset
        });
*/

        this.collection = new ymaps.GeoObjectCollection({}, { preset: app.data.playerTowerPreset });
        this.collection
            .add(this.placemark)
            .add(this.circle)/*
            .add(this.shootLine)*/;

        this.shoots = [];
        this.shootIndexes = [];
        this.punched = false;
        this.rechargeCounter = 0;
    }

    Tower.prototype = {

        isDefault: function () {
            return this._isDefault;
        },

        setPos: function (pos) {
            this.pos = pos;
            this.circle.geometry.setCoordinates(pos);
            this.placemark.geometry.setCoordinates(pos);
            this.id = pos.join(',');
        },

        setParent: function (parent) {
            this.parent = parent;
            this.parent.add(this.collection);
        },

        removeFromParent: function () {
            if (this.parent) {
                this.parent.remove(this.collection);
                this.parent = null;
            }
            this._placemarkEvents && this._placemarkEvents.removeAll();
            for (var i = 0, il = this.shoots.length; i < il; i++) {
                if (this.shoots[i]) {
                    this.shoots[i].end();
                    this.shoots[i] = null;
                }
            }
            this.shoots = [];
            this.shootIndexes = [];
        },

        startRecharge: function () {
            this.ticker.play();
        },

        stopRecharge: function () {
            this.ticker.pause();
        },

/*
        recharge: function () {
            this.punched = false;
        },
*/

        tick: function () {
            if (this.punched && this.rechargeCounter++ > this.rechargeFps) {
                this.rechargeCounter = 0;
                this.punched = false;
            }

            for (var i = 0, il = this.shoots.length; i < il; i++) {
                var shoot = this.shoots[i];
                if (shoot) {
                    shoot.tick();
                    if (shoot.ended) {
                        this.shoots[i] = null;
                        this.shootIndexes.push(i);
                    }
                }
            }
/*            if (this.shot === false) {
//                this.shootLine.options.set('visible', true);
                this.shot = true;
            } else {
//                this.shootLine.options.set('visible', false);
            }*/
        },

        punch: function (mob) {
            if (this.punched) {
                return;
            }

            if (exports.util.circleContain(this.circle, mob.pos)) {
                var i = this.shootIndexes.pop() || this.shoots.length;
                this.shoots[i] = new exports.Shoot(this.shooting, this.pos, this.damage, mob, this.freeze);
                this.punched = true;
                /*    killmob = mob.stab(this.damage);
                if (killmob) {
                    this.player.kill(mob);
                }
                this.punched = true;*/
//                this.shot = false;
//                this.shootLine.geometry.setCoordinates([this.pos, mob.pos]);
            }
        },

        select: function () {
            this.collection.options.set({
                strokeWidth: 4,
                zIndex: 2000
            });
        },

        deselect: function () {
            this.collection.options.unset('strokeWidth');
            this.collection.options.unset('zIndex');
        },

        selectableTower: function () {
            this.placemark.options.set({
//                overlayFactory: ymaps.geoObject.overlayFactory.interactiveGraphics,
                zIndex: 5000
            });

            this._placemarkEvents = this.placemark.events.group().add('click', function () {
                app.setHomeState(this);
            }, this);
        },

        upgrade: function () {
            this.price = this.upgradePrice;
            this.sellPrice = Math.round(this.price * 0.9);
            this.upgradePrice = Math.round(this.price * 1.1);
            this.radius = Math.round(this.radius * 1.1);
            this.damage = Math.ceil(this.damage * 1.5);
            this.circle.geometry.setRadius(this.radius);
        }
    };

    exports.Tower = Tower;

})(app.lib);