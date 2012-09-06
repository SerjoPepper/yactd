(function (exports) {

    function Player (params) {
        this.parent = params.parent;
        this.money = exports.settings.player.money;
        this.kills = 0;
        this.towers = {};
        this.collection = new ymaps.GeoObjectCollection;

        this.stats = {
            money: $('#stats .money .val'),
            kills: $('#stats .score .val')
        }

        this.updateStats();
    }

    Player.prototype = {

        addToParent: function () {
            this.parent.add(this.collection);
        },

        removeFromParent: function () {
            this.parent.remove(this.collection);
        },

        buyTower: function (type, pos) {
            var data = exports.settings.towers[type],
                k = pos.join(',');
            if (this.money >= data.price && !this.towers[k]) {
                var tower = new exports.Tower($.extend({
                    pos: pos,
                    parent: this.collection,
                    owner: this
                }, data));
                this.towers[k] = tower;
                tower.addToParent();
                this.money -= data.price;
                this.updateStats();
                return this.towers[k];
            }
        },

        sellTower: function (k) {
            var tower = this.towers[k];
            tower.removeFromParent();
            delete this.towers[k];
            this.money += tower.sellPrice;
            this.updateStats();
        },

        tick: function () {
            for (var k in this.towers) {
                this.towers[k].tick();
            }
        },

        startRecharge: function () {
            for (var k in this.towers) {
                this.towers[k].startRecharge();
            }
        },

        stopRecharge: function () {
            for (var k in this.towers) {
                this.towers[k].startRecharge();
            }
        },

        updateStats: function () {
            this.stats.money.text(this.money);
            this.stats.kills.text(this.kills);
        },

        kill: function (mob) {
            this.kills += 1;
            this.money += mob.price;
            this.updateStats();
        }
    };

    exports.Player = Player;

})(app.lib);