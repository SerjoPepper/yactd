(function (exports) {
    
    function  Controls (params) {
        this.map = params.map;
        this.group = new ymaps.control.Group();
        this.events = new ymaps.event.Manager({ context: this });

        this.playButton = new ymaps.control.Button({ data: { content: 'play' }});
        this.towerButton = new ymaps.control.Button({ data: { content: 'build tower' }});
        this.restartButton = new ymaps.control.Button({ data: { content: 'restart' }});
        this.changeLocationButton = new ymaps.control.Button({ data: { content: 'change location' }});

        this.disableButtons();

        this.group
            .add(this.playButton)
            .add(this.towerButton)
            .add(this.restartButton)
            .add(this.changeLocationButton);
    }
    
    Controls.prototype = {
        
        addToMap: function () {
            this.bindEvents();
            this.map.controls.add(this.group);
        },
        
        removeFromMap: function () {
            this.unbindEvents();
            this.map.controls.remove(this.group);
        },

        bindEvents: function () {
            this.eventHandlers = {

                playButton: this.playButton.events.group()
                    .add('select', this.playButtonSelect, this)
                    .add('deselect', this.playButtonDeselect, this),

                towerButton: this.towerButton.events.group()
                    .add('select', this.towerButtonSelect, this)
                    .add('deselect', this.towerButtonDeselect, this),

                restartButton: this.restartButton.events.group()
                    .add('click', this.restartButtonClick, this),

                changeLocationButton: this.changeLocationButton.events.group()
                    .add('click', this.changeLocationButtonClick, this)
            }
        },

        unbindEvents: function () {
            for (var k in this.eventHandlers) {
                this.eventHandlers[k].removeAll();
            }
        },

        playButtonSelect: function () {
            this.events.fire('play');
        },

        playButtonDeselect: function () {
            this.events.fire('pause');
        },

        towerButtonSelect: function () {
            this.events.fire('startbuildtowers');
        },

        towerButtonDeselect: function () {
            this.events.fire('stopbuildtowers');
        },

        restartButtonClick: function () {
            this.restartButton.deselect();
            this.events.fire('restart');
        },


        changeLocationButtonClick: function () {
            this.changeLocationButton.deselect();
            var request = prompt('Введите новое местоположение');
            if (request) {
                ymaps.geocode(request, { results: 1 }).then($.proxy(function (res) {
                    if (res.geoObjects.getLength()) {
                        var pos = res.geoObjects.get(0).geometry.getCoordinates();
                        this.events.fire('changelocation', {
                            pos: pos
                        });
                    }
                }, this));
            }
        },

        enableButtons: function () {
            this.playButton.enable();
            this.towerButton.enable();
        },

        disableButtons: function () {
            this.deselectButtons();
            this.playButton.disable();
            this.towerButton.disable();
        },

        deselectButtons: function () {
            this.playButton.deselect();
            this.towerButton.deselect();
        }
    };
    
    exports.Controls = Controls;
    
})(app.lib);