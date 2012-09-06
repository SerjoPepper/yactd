(function (exports) {

    function Ticker (interval, callback, ctx) {
        this.interval = interval;
        this.callback = callback;
        this.ctx = ctx;
    }

    Ticker.prototype = {
        play: function () {
            if (this.started) {
                return;
            }
            this.started = true;
            this.timer = setInterval($.proxy(function () {
                this.callback.call(this.ctx || null);
            }, this), this.interval);
        },

        pause: function () {
            if (this.started) {
                clearInterval(this.timer);
                this.timer = null;
                this.started = false;
            }
        }
    };

    exports.Ticker = Ticker;

})(app.lib);