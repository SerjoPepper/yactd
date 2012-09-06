(function (exports) {

    function Mob (params) {
        this.pathCoords = params.pathCoords;
        this.parent = params.parent;

        this.hp = this.currentHp = params.data.hp;
        this.price = params.data.price;
        this.damage = params.data.damage;

        this.destroyed = false;
        this.active = false;

        this.pos = this.pathCoords[0];
        this.pathIndex = 0;

        this.placemark = new ymaps.Placemark(this.pos, { hpcoef: 1 }, { visible: false });
    }

    Mob.prototype = {

        activate: function () {
            this.active = true;
            this.show();
        },

        destroy: function () {
            this.destroyed = true;
            this.hide();
        },

        show: function () {
            this.placemark.options.set('visible', true);
        },

        hide: function () {
            this.placemark.options.set('visible', false);
        },

        addToParent: function () {
            this.parent.add(this.placemark);
        },

        removeFromParent: function () {
            this.parent.remove(this.placemark);
        },

        tick: function (home, towers) {
            if (this.destroyed) {
                return;
            }

            var nextCoordinates = this.pathCoords[this.pathIndex++];
            if (nextCoordinates) {
                this.pos = nextCoordinates;

                for (var k in towers) {
                    towers[k].punch(this);
                    if (this.destroyed) {
                        return;
                    }
                }
                this.placemark.geometry.setCoordinates(nextCoordinates);

                home.stab(this);
            } else {
                this.destroy();
            }
        },

        stab: function (damage) {
            this.currentHp = Math.max(this.currentHp - damage, 0);
            this.placemark.properties.set('hpcoef', this.currentHp / this.hp);
            if (this.currentHp == 0) {
                this.destroy();
                return true;
            }
        }

    };

    exports.Mob = Mob;

})(app.lib);