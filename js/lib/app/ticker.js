(function (exports) {

    function Ticker (interval, callback, ctx) {
        this.interval = this._currentInterval = interval;
        this.callback = callback;
        this.ctx = ctx;
        this.k = 1;
    }

    Ticker.prototype = {
        play: function () {
            if (this.started) {
                return;
            }
            this.started = true;
            this.timer = setInterval($.proxy(function () {
                this.callback.call(this.ctx || null);
            }, this), this._currentInterval);
        },

        pause: function () {
            if (this.started) {
                clearInterval(this.timer);
                this.timer = null;
                this.started = false;
            }
        },

        setK: function (k) {
            this.k = k;
            this._currentInterval = this.interval / this.k;
            if (this.started) {
                this.pause();
                this.play();
            }
        },

        getK: function () {
            return this.k;
        }
    };

    exports.Ticker = Ticker;

})(app.lib);