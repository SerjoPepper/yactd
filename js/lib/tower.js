(function (exports) {

    function  Tower (params) {
        this.radius = params.radius;
        this.speed = params.speed;
        this.damage = params.damage;
        this.sellPrice = Math.round(params.price * 0.9);
        this.parent = params.parent;
        this.owner = params.owner;
        this.pos = params.pos;

        this.placemark = new ymaps.Placemark(this.pos, {
            balloonContentBody: this.getBalloonContentBody()
        });
        this.circle = new ymaps.Circle([this.pos, this.radius], {}, {
            interactivityModel: 'default#transparent'
        });
        this.shootLine = new ymaps.Polyline([this.pos, this.pos], {}, {
            visible: false,
            preset: params.gunPreset
        });

        this.ticker = new exports.Ticker(1000/this.speed, this.recharge, this);
        this.collection = new ymaps.GeoObjectCollection({}, { preset: params.preset });
        this.collection
            .add(this.placemark)
            .add(this.circle)
            .add(this.shootLine);

        this.punched = false;
    }

    Tower.prototype = {

        addToParent: function () {
            this.parent.add(this.collection);
        },

        removeFromParent: function () {
            this.parent.remove(this.collection);
        },

        startRecharge: function () {
            this.ticker.play();
        },

        stopRecharge: function () {
            this.ticker.pause();
        },

        recharge: function () {
            this.punched = false;
        },

        getBalloonContentBody: function () {
            return '<button onclick="app.game.sellTower(\'' + this.pos.join(',') + '\')">' +
                'Продать за ' + this.sellPrice + '</button>';
        },

        tick: function () {
            if (this.shot === false) {
                this.shootLine.options.set('visible', true);
                this.shot = true;
            } else {
                this.shootLine.options.set('visible', false);
            }
        },

        punch: function (mob) {
            if (this.punched) {
                return;
            }

            if (exports.util.circleContain(this.circle, mob.pos)) {
                var killmob = mob.stab(this.damage);
                if (killmob) {
                    this.owner.kill(mob);
                }
                this.punched = true;
                this.shot = false;
                this.shootLine.geometry.setCoordinates([this.pos, mob.pos]);
            }
        }

    };

    exports.Tower = Tower;

})(app.lib);