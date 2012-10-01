ymaps.ready(function () {

    var storage = ymaps.option.presetStorage,
        towerGunOverlayFactory = {
            createOverlay: function (geometry, data, options) {

                function createGeometry (geometry) {
                        var coords = geometry.getCoordinates(),
                            shiftcoords = [[coords[0][0], coords[0][1] - 30], [coords[1][0], coords[1][1] - 30]],
                            vec = [shiftcoords[1][0] - shiftcoords[0][0], shiftcoords[1][1] - shiftcoords[0][1]],
                            edges = 5,
                            edgevec = [vec[0]/5, vec[1]/5],
                            newgeometry = [shiftcoords[0]];

                        for (var i = 1; i <= edges; i++) {
                            newgeometry[i] = [
                                newgeometry[0][0] + edgevec[0] * i + edgevec[0] * (Math.random() - 0.5),
                                newgeometry[0][1] + edgevec[1] * i + edgevec[1] * (Math.random() - 0.5)
                            ];
                        }

                        newgeometry.push(shiftcoords[1]);
                        return new ymaps.geometry.pixel.LineString(newgeometry);
                }

                var overlay = new ymaps.overlay.staticGraphics.Polyline(
                    createGeometry(geometry),
                    data,
                    options
                );

                return {
                    options: overlay.options,
                    events: overlay.events,

                    getData: function () {
                        return overlay.getData();
                    },

                    getGeometry: function () {
                        return overlay.getGeometry();
                    },

                    getMap: function () {
                        return overlay.getMap();
                    },

                    setData: function (d) {
                        overlay.setData(d);
                    },

                    setGeometry: function (g) {
                        overlay.setGeometry(createGeometry(g));
                    },

                    setMap: function (m) {
                        overlay.setMap(m);
                    }
                };
            }
        },

        mobOverlayFactory = {
            createOverlay: function (geometry, data, options) {
                function createGeometry (hpcoef, startpos) {

                    var pixelen = 25;
                    startpos = [startpos[0] - 10, startpos[1] - 45];
                    var greencoords = [[startpos[0], startpos[1]], [startpos[0] + pixelen * hpcoef, startpos[1]]],
                        redcoords = [[greencoords[1][0], greencoords[1][1]], [greencoords[1][0] + pixelen * (1 - hpcoef), greencoords[1][1]]];

                    return {
                        red: new ymaps.geometry.pixel.LineString(redcoords),
                        green: new ymaps.geometry.pixel.LineString(greencoords)
                    };
                }

                var placemarkOverlay = new ymaps.overlay.staticGraphics.Placemark(geometry, data, options),
                    coords = geometry.getCoordinates(),
                    hpcoef = data.properties.get('hpcoef'),
                    linegeometries = createGeometry(hpcoef, coords),
                    greenOverlay = new ymaps.overlay.staticGraphics.Polyline(linegeometries.green, data, $.extend(options, { strokeColor: '00cc00', strokeWidth: 4 })),
                    redOverlay = new ymaps.overlay.staticGraphics.Polyline(linegeometries.red, data, $.extend(options, { strokeColor: 'cc0000', strokeWidth: 4 }));

                return {
                    options: placemarkOverlay.options,
                    events: placemarkOverlay.events,

                    getData: function () {
                        return placemarkOverlay.getData();
                    },

                    getGeometry: function () {
                        return placemarkOverlay.getGeometry();
                    },

                    getMap: function () {
                        return placemarkOverlay.getMap();
                    },

                    setData: function (d) {
                        placemarkOverlay.setData(d);
                    },

                    setGeometry: function (g) {
                        var coords = g.getCoordinates(),
                            hpcoef = this.getData().properties.get('hpcoef');
                        var linegeometries = createGeometry(hpcoef, coords);
                        redOverlay.setGeometry(linegeometries.red);
                        hpcoef ? greenOverlay.setGeometry(linegeometries.green) : greenOverlay.setMap(null);
                        placemarkOverlay.setGeometry(g);
                    },

                    setMap: function (m) {
                        redOverlay.setMap(m);
                        greenOverlay.setMap(m);
                        placemarkOverlay.setMap(m);
                    }
                };
            }
        };

    storage.add('game#home', {
        opacity: 0.6,
        overlayFactory: ymaps.geoObject.overlayFactory.staticGraphics,
        zIndex: 10000,
        iconImageHref: 'sprites/destinations.png',
        iconImageClipRect: [[0, 0], [36, 36]],
        iconImageOffset: [-18, -19],
        iconImageSize: [36, 36],
        projection: ymaps.projection.wgs84Mercator
    });

    storage.add('game#route', {
        strokeWidth: 8,
        preset: 'twirl#campingIcon',
        overlayFactory: ymaps.geoObject.overlayFactory.staticGraphics
//        renderType: '!SVG'
    });

    storage.add('game#mob1', {
        preset: 'twirl#mushroomIcon',
        overlayFactory: mobOverlayFactory,
        zIndex: 2000
    });

    storage.add('game#mob2', {
        preset: 'twirl#theaterIcon',
        overlayFactory: mobOverlayFactory,
        zIndex: 2000
    });

    storage.add('game#mob3', {
        preset: 'twirl#downhillSkiingIcon',
        overlayFactory: mobOverlayFactory,
        zIndex: 2000
    });

    storage.add('game#tower1', {
        preset: 'twirl#dpsIcon',
        fillColor: '25FA7E66'
    });

    storage.add('game#tower2', {
        preset: 'twirl#factoryIcon'
    });

    storage.add('game#tower1gun', {
        strokeColor: 'ff000066',
        strokeWidth: 3,
        overlayFactory: towerGunOverlayFactory,
        zIndex: 1
    });

    storage.add('game#tower2gun', {
        strokeColor: 'ff000066',
        strokeWidth: 3,
        overlayFactory: towerGunOverlayFactory,
        zIndex: 1
    });

});