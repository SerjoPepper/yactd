(function (exports) {

    function Player (params) {
        this.parent = params.parent;
        this.money = app.data.player.money;
        this.kills = 0;
        this.towers = {};
        this.collection = new ymaps.GeoObjectCollection;

        this.stats = {
            money: $('#stats .money .val'),
            kills: $('#stats .score .val')
        };

    }

    Player.prototype = {

        addToParent: function () {
            this.parent.add(this.collection);
        },

        removeFromParent: function () {
            this.parent.remove(this.collection);
        },

        buyTower: function (tower) {
            if (this.money >= tower.price) {
                this.towers[tower.id] = tower;
                tower.player = this;
                this.money -= tower.price;
                return tower;
            }
        },

        sellTower: function (k) {
            var tower = this.towers[k];
            tower.removeFromParent();
            delete this.towers[k];
            this.money += tower.sellPrice;
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
        },/*,

        updateStats: function () {
            this.stats.money.text(this.money);
            this.stats.kills.text(this.kills);
        },
*/
        kill: function (mob) {
            this.kills += 1;
            this.money += mob.money;
            app.renderStats();
        },

        setMoney: function (money) {
            this.money = money;
        },

        tick: function () {
            for (var k in this.towers) {
                this.towers[k].tick();
            }
        }
    };

    exports.Player = Player;

})(app.lib);