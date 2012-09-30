(function (exports) {

    function Shoot (params, startPos, damage, mob, freeze) {
        this.size = params.size;
        this.img = params.img;
        this.speed = params.speed / app.data.fps;
        this.class = params.class;
        this.freeze = freeze;

        var gpos = exports.util.toGlobalPixels(startPos);
        this.pos = exports.util.fromGlobalPixels([gpos[0], gpos[1] + params.offsetX]);

        this.damage = damage;
        this.mob = mob;

        this.jElement = $(document.createElement('div')).addClass(params.cssClass + ' tower-shoot');
        $(app.shadowsPane.getElement()).append(this.jElement);
        this.setPos(this.pos);
        this.paneListeners = app.shadowsPane.events.group().add('viewportchange', this._onViewportChange, this);
    }

    Shoot.prototype = {
        tick: function () {
            if (this._nextTickEnd) {
                this.end();
            } else {
                this.pos = this.calculateNextPos();
                this.setPos(this.pos);
            }
        },

        calculateNextPos: function () {
            var endPos = this.mob.pos,
                pos,
                distance = exports.util.distance(endPos, this.pos);

            if (this.speed > distance) {
                this._nextTickEnd = true;
                pos = endPos;
                if (this.mob.stab(this.damage, this.freeze)) {
                    app.game.player.kill(this.mob);
                }
            } else {
                var k = this.speed / distance;
                pos = [this.pos[0] + k * [endPos[0] - this.pos[0]], this.pos[1] + k * [endPos[1] - this.pos[1]]];
            }
            return pos;
        },

        setPos: function (pos) {
            var localPos = exports.util.toLocalPixels(pos);
            this.jElement.css({
                left: localPos[0],
                top: localPos[1]
            });
        },

        end: function () {
            this.jElement.remove();
            this.paneListeners.removeAll();
            this.ended = true;
        },

        _onViewportChange: function () {
            this.setPos(this.pos);
        }
    };

    exports.Shoot = Shoot;

})(app.lib);