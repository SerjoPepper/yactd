var app = {
    init: function () {
        this._ratings = this.getStorageRatings();

        var form = $('#left-panel form.start-game'),
            game = $('#left-panel .game'),
            controls = game.find('.controls');
        this.elements = {
            places: $('#left-panel .places'),
            form: form,
            addressInput: form.find('input.address'),
            playerNameInput: $('#left-panel input.username'),
            userMenu: $('#left-panel .user-menu'),
            game: game,
            towersList: game.find('.towers-list'),
            towerView: game.find('.tower-view'),
            mobInfo: game.find('.mob-info'),
            stats: game.find('.stats'),
            veil: game.find('.veil'),
            buttons: {
                play: controls.find('button.play'),
                forward: controls.find('button.forward'),
                home: controls.find('button.home'),
                buy: controls.find('button.buy'),
                backButton: game.find('button.back-to-menu'),
                restartButton: game.find('button.restart')
            },
            ratings: $('#left-panel .ratings')
        };

        this.pos = [ymaps.geolocation.latitude, ymaps.geolocation.longitude];
        this.map = new ymaps.Map("map", {
            behaviors: ['default', 'scrollZoom'],
            center: this.pos,
            zoom: 16,
            type: "yandex#map"
        });
        this.map.controls.add('typeSelector')
                    .add('zoomControl');
        this.shadowsPane = app.map.panes.get('shadows');
        this.mapProjection = this.map.options.get('projection');
        $.Mustache.addFromDom();
        this.elements.places.mustache('places', { places: this.data.places });
        this._bindEvents();
        this.renderRatings();
    },
    
    route: function (points) {
        ymaps.route([points.start, points.finish], {
            mapStateAutoApply: true
        }).then($.proxy(function (route) {
            this._gameParams = {
                route: route,
                points: points,
                map: this.map
            };
//            console.log('route length', route.getLength());
            this.elements.form.blur();
            this.createGame();
        }, this), $.proxy(function () {
            $.pnotify({ text: 'Выберите другой адреc.', type: 'error' });
        }));
    },

    createGame: function () {
/*      this.controlGameEvents = this.controls.events.group()
            .add('play', this.game.play, this.game)
            .add('pause', this.game.pause, this.game)
            .add('startbuildtowers', this.game.startBuildTowers, this.game)
            .add('stopbuildtowers', this.game.stopBuildTowers, this.game); */
        this.game = new this.lib.Game(this._gameParams);
        this.gameEvents = this.game.events.group()
            .add('finish', this.onGameFinish, this)
            .add('finishlevel', this.onGameLevelFinish, this)
            .add('addtomap', this.onGameAddToMap, this)
            .add('showtower', this._onShowTower, this)
            .add('removetower', this._onRemoveTower, this)
            .add('updatestats', this.renderStats, this);
        this._currentPlayerTower = null;
        this._currentBuyTower = null;
        this._gameFinished = false;
        this._playing = false;
        this._state = null;
        this.game.addToMap();
        this.elements.veil.hide();
    },

    _onShowTower: function (e) {
        var tower = e.get('tower');
        this.setHomeState(tower);
    },

    _onRemoveTower: function () {
        this._currentPlayerTower = null;
        this.setHomeState();
    },

    onGameAddToMap: function () {
        this.elements.userMenu.hide();
        this.elements.game.show();
        this.setHomeState();
        this.game.start();
        this.renderStats();
        this._onPlayClick();
    },

    restart: function () {
        this.destroyGame();
        this.createGame();
    },

    destroyGame: function () {
        if (this.game) {
            this.game.player.removeFromParent();
            this.game.pause();
            this.game.removeFromMap();
            this.gameEvents.removeAll();
            this.elements.buttons.forward.removeClass('active');
        }
    },

    onGameFinish: function (e) {
        this.elements.buttons.play.removeClass('active');
        this.elements.veil.show();
        this._gameFinished = true;
        this._removeMapEvents();
        this.updateRatings();
        $.pnotify({ text: 'Игра закончена. Ваш рекорд ' + this.game.player.score });
    },

    onGameLevelFinish: function () {

    },

    showUserMenu: function () {

    },

    showGame: function () {

    },

    _bindEvents: function () {
        this.elements.places.on('click', '.place', $.proxy(this._onPlaceChoose, this));
        this.elements.form.submit($.proxy(this._onFormSubmit, this));
        this.elements.buttons.play.click($.proxy(this._onPlayClick, this));
        this.elements.buttons.forward.click($.proxy(this._onForwardClick, this));
        this.elements.buttons.home.click($.proxy(this._onHomeClick, this));
        this.elements.buttons.buy.click($.proxy(this._onBuyClick, this));
        this.elements.buttons.backButton.click($.proxy(this._onBackButtonClick, this));
        this.elements.buttons.restartButton.click($.proxy(this.restart, this));
        this.elements.towersList.on('click', '.buy-tower-state', $.proxy(this._onBuyClick, this));
        this.elements.towersList.on('click', '.buy-towers .tower', $.proxy(this._onTowerClickInBuyList, this));
        this.elements.towersList.on('click', '.player-towers .tower', $.proxy(this._onTowerClickInPlayerList, this));
        this.elements.towerView.on('click', 'button.buy', $.proxy(this._onBuyTowerButtonClick, this));
        this.elements.towerView.on('click', 'button.cancel', $.proxy(this._onCancelBuyTowerButtonClick, this));
        this.elements.towerView.on('click', 'button.upgrade', $.proxy(this._onUpgradeTowerButtonClick, this));
        this.elements.towerView.on('click', 'button.sale', $.proxy(this._onSaleTowerButtonClick, this));
    },

    _onCancelBuyTowerButtonClick: function () {
        this.setBuyState();
    },

    _onBuyTowerButtonClick: function (e) {
        if (this._buyingTowerPos) {
            var btn = $(e.currentTarget),
                index = btn.attr('towerindex');

            this.game.buyTower(index);
        } else {
            $.pnotify({ text: 'Выберите место для постройки.' });
        }
    },

    _onUpgradeTowerButtonClick: function (e) {
        var btn = $(e.currentTarget),
            towerid = btn.attr('towerid');

        this.game.upgradeTower(towerid);
    },

    _onSaleTowerButtonClick: function (e) {
        var btn = $(e.currentTarget),
            towerid = btn.attr('towerid');

        this.game.saleTower(towerid);
    },

    _onTowerClickInBuyList: function (e) {
        if (this._prevSelectedTowerNode == e.currentTarget) {
            return;
        }
        this._prevSelectedTowerNode && $(this._prevSelectedTowerNode).removeClass('selected');
        this._prevSelectedTowerNode = e.currentTarget;

        var towerNode = $(e.currentTarget),
            index = towerNode.index();
        towerNode.addClass('selected');
        this._currentBuyTower = this.data.towers[index];
        this._currentBuyTower.towerindex = index;
        this._currentBuyTower.canBuy = this.game.canBuy(this._currentBuyTower.price);
        this.renderBuyTower();
    },

    _onTowerClickInPlayerList: function (e) {
        if (this._prevSelectedTowerNode == e.currentTarget) {
            return;
        }

        this._currentPlayerTower && this._currentPlayerTower.deselect();
        this._prevSelectedTowerNode && $(this._prevSelectedTowerNode).removeClass('selected');
        this._prevSelectedTowerNode = e.currentTarget;

        var towerNode = $(e.currentTarget);
        towerNode.addClass('selected');

        this._currentPlayerTower = this.game.player.towers[towerNode.attr('towerid')];
        this.renderPlayerTower();
        this.map.panTo(this._currentPlayerTower.pos, { delay: 0 });
        this._currentPlayerTower.select();
    },

    _onPlayClick: function () {
        if (!this._gameFinished) {
            if (this._playing) {
                this.elements.buttons.play.addClass('pause');
                this._playing = false;
                this.game.pause();
            } else {
                this.elements.buttons.play.removeClass('pause');
                this._playing = true;
                this.game.play();
            }
        }
    },

    _onForwardClick: function () {
        if (this._gameFinished) {
            return;
        }
        if (!this._forwarding) {
            this.elements.buttons.forward.addClass('active');
            this.game.enableForward();
            this._forwarding = true;
        } else {
            this.elements.buttons.forward.removeClass('active');
            this.game.disableForward();
            this._forwarding = false;
        }
    },

    _onHomeClick: function () {
        if (this._state != 'home') {
            this.setHomeState();
        }
    },

    _onBuyClick: function () {
        if (this._state != 'buy') {
            this.setBuyState();
        }
    },

    _onBackButtonClick: function () {
        if (this._gameFinished || window.confirm('Завершить игру?')) {
            this.destroyGame();
            this.elements.game.hide();
            this.elements.userMenu.show();
            this.elements.veil.hide();
            this.updateRatings();
            this.game = null;
        }
    },

    _onFormSubmit: function (e) {
        if (this.game) {
            return false;
        }
        var playerName = this.elements.playerNameInput.val(),
            addressValue = this.elements.addressInput.val();
        if (playerName && this._ratings[playerName]) {
            $.pnotify({ text: 'Введите другое имя, это уже занято!', type: 'error' });
        } else if (playerName) {
            this.playerName = playerName;
            if (addressValue) {
                ymaps.geocode(addressValue, { results: 1, kind: 'house' }).then($.proxy(function (res) {
                    if (res.geoObjects && res.geoObjects.getLength()) {
                        var obj = res.geoObjects.get(0),
                            coords = obj.geometry.getCoordinates(),
                            points = {
                                start: [coords[0] + 0.0075, coords[1] - 0.005],
                                finish: coords
                            };
                        this.route(points);
                    } else {
                        $.pnotify({ text: 'Введите другой адреc.', type: 'error' });
                    }
                }, this), function () {
                    $.pnotify({ text: 'Введите другой адреc.', type: 'error' });
                });
            } else if (this._currentPlace) {
                this.route(this.data.places[$(this._currentPlace).index()].points);
            } else {
                $.pnotify({ text: 'Выберите уровень!', type: 'error' });
            }
        } else {
            $.pnotify({ text: 'Введите свое имя!', type: 'error' });
        }

        return false;
    },

    setHomeState: function (playerTower) {
        this._removeMapEvents();
        this._removeCurrentBuyTower();
        
        this.elements.buttons.home.addClass('active');
        this.elements.buttons.buy.removeClass('active');

        this._currentPlayerTower && this._currentPlayerTower.deselect();
        this._currentPlayerTower = playerTower || this._currentPlayerTower || null;
        this.renderPlayerTower();
        this.elements.towersList.empty().mustache('towers-list', {
            towers: this._getPlayerTowersListData(),
            addingClass: 'player-towers'
        });
        if (this._currentPlayerTower) {
            var node = this.elements.towersList.find('.tower[towerid="'+ this._currentPlayerTower.id +'"]');
//            console.log('node', node);
            if (node) {
                node.addClass('selected');
                this._prevSelectedTowerNode = node[0];
            }
            this._currentPlayerTower.select();
        }
        this._state = 'home';
    },

    setBuyState: function () {
        this.elements.buttons.buy.addClass('active');
        this.elements.buttons.home.removeClass('active');

        this._currentPlayerTower && this._currentPlayerTower.deselect();
        this._currentBuyTower = null;
        this._buyingTowerPos = null;
        this.renderBuyTower();
        this.elements.towersList.empty().mustache('towers-list', { towers: this._getBuyTowersListData(), addingClass: 'buy-towers' });
        this._addMapEvents();
        $.pnotify({ text: 'Выберите башню.' });
        this._state = 'buy';
    },

    _addMapEvents: function () {
        this._mapEvents = this.map.events.group().add('click', this._onMapClick, this);
        this._arrowCursor = this.map.cursors.push('arrow');
    },

    _removeMapEvents: function () {
        if (this._mapEvents) {
            this._mapEvents.removeAll();
            this._mapEvents = null;
        }
        if (this._arrowCursor) {
            this._arrowCursor.remove();
            this._arrowCursor = null;
        }
    },

    _onMapClick: function (e) {
        if (this._currentBuyTower) {
            ymaps.geocode(e.get('coordPosition'), { kind: 'house', results: 1 })
                .then($.proxy(this._onPointGeocode, this), function () {
                    $.pnotify({ text: 'Попробуйте еще раз', type: 'error' });
                });
        } else {
            $.pnotify({ text: 'Выберите башню!', type: 'error' });
        }
    },

    _onPointGeocode: function (res) {
        var point = res.geoObjects.get(0),
            coords = point && point.geometry.getCoordinates();
        if (coords && !this.game.player.towers[coords.join(',')]) {
            this._buyingTowerPos = coords;
            this.renderBuyTower();
        } else {
            $.pnotify({ text: 'Выберите другое место', type: 'error' });
        }
    },

    renderPlayerTower: function () {
        if (this._currentPlayerTower) {
            this.elements.towerView.empty().mustache('tower', this._getCurrentPlayerTowerData());
        } else {
            this.elements.towerView.empty().mustache('empty-tower'/*, { img: this.data.defaultTower.img }*/);
        }
    },

    renderBuyTower: function () {
        if (this._currentBuyTower) {
            this.elements.towerView.empty().mustache('tower', this._getCurrentBuyTowerData(this._currentBuyTower));
        } else {
            this.elements.towerView.empty().mustache('empty-tower'/*, { img: this.data.defaultTower.img }*/);
        }
        this.game.setCurrentBuyTower(this._currentBuyTower, this._buyingTowerPos);
    },

    renderStats: function () {
        var ta = $('#tower-action'),
            prevCanBuy;
        if (ta[0]) {
            if (this._state == 'buy') {
                prevCanBuy = this._currentBuyTower.canBuy;
                this._currentBuyTower.canBuy = this.game.player.money >= this._currentBuyTower.price;
                if (this._currentBuyTower.canBuy != prevCanBuy) {
                    ta.empty().mustache('buy-action', this._currentBuyTower);
                }
            } else {
                prevCanBuy = this._currentPlayerTower.canBuy;
                this._currentPlayerTower.canBuy = this.game.player.money >= this._currentPlayerTower.upgradePrice;
                if (this._currentPlayerTower.canBuy != prevCanBuy) {
                    ta.empty().mustache('upgrade-sale-action', this._currentPlayerTower);
                }
            }
        }
        this.elements.stats.empty().mustache('stats', this._getStats());
    },

    _getStats: function () {
        return {
            money: this.game.player.money,
            score: this.game.player.score,
            health: this.game.home.hp
        };
    },

    _getPlayerTowersListData: function () {
        var playerTowers = this.game.player.towers,
            towersList = [];
        for (var k in playerTowers) {
            playerTowers[k].addсlass = '';
            if (playerTowers[k] == this._currentPlayerTower) {
                playerTowers[k].addсlass = 'selected';
            }
            towersList.push(playerTowers[k]);
        }
        towersList.sort(function (a, b) {
            return b.index - a.index;
        });
//        console.log(towersList);
        return towersList;
    },

    _getCurrentPlayerTowerData: function () {
        this._currentPlayerTower.canBuy = this._currentPlayerTower.upgradePrice <= this.game.player.money;
        this._currentPlayerTower.action = $.Mustache.render('upgrade-sale-action', this._currentPlayerTower);
        return this._currentPlayerTower;
    },

    _getBuyTowersListData: function () {
        if (!this._towersListIndexed) {
            this.data.towers.map(function (tower, i) {
                tower.index = i;
            });
            this._towersListIndexed = true;
        }
        return this.data.towers;

    },

    _getCurrentBuyTowerData: function (tower) {
        tower.action = $.Mustache.render('buy-action', tower);
        return tower;
    },

    _removeCurrentBuyTower: function () {
        this.game.removeCurrentBuyTower();
        this._currentBuyTower = null;
    },
    
    _onPlaceChoose: function (e) {
        this._currentPlace && $(this._currentPlace).removeClass('btn-success');
//        this.elements.addressInput.attr('disabled', 'disabled');
        if (this._currentPlace != e.currentTarget) {
            this._currentPlace = e.currentTarget;
            $(this._currentPlace).addClass('btn-success');
        } else {
            this._currentPlace = null;
//            this.elements.addressInput.removeAttr('disabled');
        }
    },

    updateRatings: function () {
        var playerScore = this._ratings[this.playerName],
            score = this.game.player.score;

        if (!playerScore || playerScore < score) {
            this._ratings[this.playerName] = score;
            window.localStorage.setItem('ratings', JSON.stringify(this._ratings));
        }

        this.renderRatings();
    },

    renderRatings: function () {
        if (!this._ratings) {
            this._ratings = this.getStorageRatings();
        }

        var arr = [];
        for (var k in this._ratings) {
            arr.push({ playerName: k, score: this._ratings[k] });
        }
        arr = arr.sort(function (a, b) {
            return b.score - a.score;
        }).slice(0, 10);
        this.elements.ratings.empty().mustache('ratings', { scores: arr });
    },

    getStorageRatings: function () {
        var strRatings = window.localStorage.getItem('ratings'),
            ratings = strRatings && JSON.parse(strRatings) || {};

        return ratings;
    },

    lib: {},

    data: {}
};

ymaps.ready(function () {
    if (window.location.hash == '#clear') {
        window.localStorage.removeItem('ratings');
    }
    app.init();
});

$.pnotify.defaults.styling = "bootstrap";
$.pnotify.defaults.history = false;
$.pnotify.defaults.icon = false;
$.pnotify.defaults.mouse_reset = false;
$.pnotify.defaults.delay = 1000;
$.pnotify.defaults.addclass = 'pnotify-position';
$.pnotify.defaults.animation = 'fade';
$.pnotify.defaults.animation_speed = 300;

/*function(status, callback, pnotify) {
    var cur_angle = 180,
        cur_opacity_scale = 0;
    if (status == 'out') cur_opacity_scale = 1;
    var timer = setInterval(function() {
        cur_angle += 10;
        if (cur_angle == 360) {
            cur_angle = 0;
            cur_opacity_scale = 1;
            if (status == 'out') cur_opacity_scale = 0;
            clearInterval(timer);
        } else {
            cur_opacity_scale = cur_angle / 360;
            if (status == 'out') cur_opacity_scale = 1 - cur_opacity_scale;
        }
        pnotify.css({
            '-moz-transform': ('rotate(' + cur_angle + 'deg) scale(' + cur_opacity_scale + ')'),
            '-webkit-transform': ('rotate(' + cur_angle + 'deg) scale(' + cur_opacity_scale + ')'),
            '-o-transform': ('rotate(' + cur_angle + 'deg) scale(' + cur_opacity_scale + ')'),
            '-ms-transform': ('rotate(' + cur_angle + 'deg) scale(' + cur_opacity_scale + ')'),
            'filter': ('progid:DXImageTransform.Microsoft.BasicImage(rotation=' + (cur_angle / 360 * 4) + ')')
        }).fadeTo(0, cur_opacity_scale);
        if (cur_angle == 0) {
            if (status == 'out') pnotify.hide();
            callback();
        }
    }, 20);*//*
};*/
