var app = {
    init: function () {
        this.start();
//        this.findCenter().then($.proxy(this.start, this));
    },
    
    start: function (/*pos*/) {
//        this.pos = pos;
        if (this.data.user) {
            this.renderUser();
            this.pos = this.data.user.mapPos;
        } else {
            this.renderNoLogin();
            this.pos = [ymaps.geolocation.latitude, ymaps.geolocation.longitude];
        }
//        this.pos = this.data.pos;
        this.map = new ymaps.Map("map", {
            behaviors: ['default', 'scrollZoom'],
            center: this.pos,
            zoom: 16,
            type: "yandex#map"
        });


//        this.controls = new this.lib.Controls({ map: this.map });
//        this.controls.addToMap();
//        this.controls.events.group()
//            .add('restart', this.restart, this)
//            .add('changelocation', this.changeLocation, this);
        //this.createGame();
        this.map.controls.add('zoomControl');
    },

    renderUser: function () {

    },

    renderNoLogin: function () {

    },

    createGame: function () {
        this.game = new this.lib.Game({ map: this.map, pos: this.pos });
        this.game.addToMap();
        this.gameEvents = this.game.events.group()
            .add('finish', this.onGameFinish, this)
            .add('finishlevel', this.onGameLevelFinish, this)
            .add('ready', this.onGameReady, this)
            .add('noroutesfound', this.onGameNoRoutes, this);

/*        this.controlGameEvents = this.controls.events.group()
            .add('play', this.game.play, this.game)
            .add('pause', this.game.pause, this.game)
            .add('startbuildtowers', this.game.startBuildTowers, this.game)
            .add('stopbuildtowers', this.game.stopBuildTowers, this.game);*/
    },

    restart: function () {
        this.controls.disableButtons();
        this.game.pause();
        this.game.removeFromMap();
        this.gameEvents.removeAll();
//        this.controlGameEvents.removeAll();
        this.createGame();
    },

    changeLocation: function (e) {
        var pos = e.get('pos');
        this.map.setCenter(pos);
        this.pos = pos;
        this.restart();
    },

    findCenter: function () {
        var promise = new ymaps.util.Promise,
            center = [ymaps.geolocation.latitude, ymaps.geolocation.longitude];

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (pos) {
                promise.resolve([pos.coords.latitude, pos.coords.longitude]);
            }, function () {
                promise.resolve(center);
            });
        }
        else {
            promise.resolve(center);
        }
        return promise;
    },

    onGameFinish: function (e) {
        alert('Игра завершена! Вы рекорд - ' + e.get('score'));
        this.controls.disableButtons();
    },

    onGameReady: function () {
        this.controls.enableButtons();
    },

    onGameNoRoutes: function () {
        alert('Выберите другое место');
        this.controls.disableButtons();
    },

    onGameLevelFinish: function () {
        this.controls.playButton.deselect();
    },

    lib: {},

    data: {}
};

ymaps.ready(function () {
    app.init();
});