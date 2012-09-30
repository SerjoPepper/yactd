ymaps.ready(function () {

app.data = {
    places: [
        {
            title: 'Москва',
//            polylines: [[], []],
            points: {
                start: [55.759153, 37.622011],
                finish: [55.753902, 37.635573]
            }
        }, {
            title: 'Санкт-Петербург',
//            polylines: [],
            points: {
                start: [],
                finish: []
            }
        }, {
            title: 'Уфа',
//            polylines: [],
            points: {
                start: [],
                finish: []
            }
        }
    ],

    mobs: [{
        cssClass: 'mob1',
        speed: 43,
        count: 10,
        activateTime: 3800,

        hp: 17,
        money: 10,
        offset: [-15, -19]
    }, {
        cssClass: 'mob2',
        speed: 60,
        count: 20,
        activateTime: 1500,

        hp: 15,
        money: 6,
        offset: [-15, -19]
    }, {
        cssClass: 'mob3',
        speed: 50,
        count: 13,
        activateTime: 3000,

        hp: 36,
        money: 11,
        offset: [-15, -19]
    }, {
        cssClass: 'mob4',
        speed: 27,
        count: 15,
        activateTime: 7000,

        hp: 89,
        money: 19,
        offset: [-15, -19]
    }, {
        cssClass: 'mob5',
        speed: 45,
        count: 12,
        activateTime: 3000,

        hp: 51,
        money: 14,
        offset: [-15, -19]
    }, {
        cssClass: 'mob6',
        speed: 68,
        count: 25,
        activateTime: 1300,

        hp: 33,
        money: 9,
        offset: [-15, -19]
    }, {
        cssClass: 'mob7',
        speed: 55,
        count: 15,
        activateTime: 2500,

        hp: 95,
        money: 13,
        offset: [-15, -19]
    }, {
        cssClass: 'mob8',
        speed: 20,
        count: 3,
        activateTime: 15000,

        hp: 400,
        money: 50,
        offset: [-15, -19]
    }],

    towers: [{
        title: 'Tower1',
        cssClass: 'tower1',
        damage: 4,
        speed: 1,
        radius: 100,
        price: 100,
        preset: {
            iconImageClipRect: [[0, 0], [40, 45]],
            iconImageOffset: [-19, -35],
            fillColor: '33DE3944',
            strokeColor: '33DE39aa'
        },
        shooting: {
            img: '',
            speed: 200,
            cssClass: 'tower1',
            offsetX: -10
        }
    }, {
        title: 'Tower2',
        cssClass: 'tower2',
        damage: 1,
        speed: 6,
        radius: 100,
        price: 200,
        preset: {
            iconImageClipRect: [[40, 0], [80, 45]],
            iconImageOffset: [-19, -35],
            fillColor: 'BF7C0044',
            strokeColor: 'BF7C00aa'
        },
        shooting: {
            img: '',
            speed: 200,
            cssClass: 'tower2',
            offsetX: -10
        },
        freeze: {
            time: 200,
            value: 0.5
        }
    }, {
        title: 'Tower3',
        cssClass: 'tower3',
        damage: 6,
        speed: 2,
        radius: 100,
        price: 300,
        preset: {
            iconImageClipRect: [[80, 0], [120, 45]],
            iconImageOffset: [-19, -35],
            fillColor: 'E01B6A66',
            strokeColor: 'E01B6Add'
        },
        shooting: {
            img: '',
            speed: 200,
            cssClass: 'tower3',
            offsetX: -10
        }
    }, {
        title: 'Tower4',
        cssClass: 'tower4',
        damage: 2,
        speed: 10,
        radius: 100,
        price: 400,
        preset: {
            iconImageClipRect: [[120, 0], [160, 45]],
            iconImageOffset: [-19, -35],
            fillColor: 'BF1BE066',
            strokeColor: 'BF1BE0dd'
        },
        shooting: {
            img: '',
            speed: 160,
            cssClass: 'tower4',
            offsetX: -10
        },
        freeze: {
            time: 200,
            value: 0.5
        }
    }, {
        title: 'Tower5',
        cssClass: 'tower5',
        damage: 6,
        speed: 6,
        radius: 100,
        price: 500,
        preset: {
            iconImageClipRect: [[160, 0], [200, 45]],
            iconImageOffset: [-19, -35],
            fillColor: '39EDBA66',
            strokeColor: '39EDBAdd'
        },
        shooting: {
            img: '',
            speed: 160,
            cssClass: 'tower5',
            offsetX: -10
        }
    }/*, {
        title: 'Tower6',
        cssClass: 'tower6',
        damage: 5,
        speed: 2,
        radius: 110,
        price: 200,
        preset: {
            iconImageClipRect: [[200, 0], [240, 45]],
            iconImageOffset: [-19, -35],
            fillColor: '83E80066',
            strokeColor: '83E800dd'
        },
        shooting: {
            img: '',
            speed: 80,
            cssClass: 'tower6',
            offsetX: -10
        },
        freeze: {
            time: 200,
            value: 0.5
        }
    }, {
        title: 'Tower7',
        cssClass: 'tower7',
        damage: 5,
        speed: 5,
        radius: 120,
        price: 300,
        preset: {
            iconImageClipRect: [[240, 0], [280, 45]],
            iconImageOffset: [-19, -35],
            fillColor: 'ED398D66',
            strokeColor: 'ED398Ddd'
        },
        shooting: {
            img: '',
            speed: 80,
            cssClass: 'tower7',
            offsetX: -10
        }
    }, {
        title: 'Tower8',
        cssClass: 'tower8',
        damage: 5,
        speed: 5,
        radius: 130,
        price: 400,
        preset: {
            iconImageClipRect: [[280, 0], [320, 45]],
            iconImageOffset: [-19, -35],
            fillColor: 'E62C2C66',
            strokeColor: 'E62C2Cdd'
        },
        shooting: {
            img: '',
            speed: 80,
            cssClass: 'tower8',
            offsetX: -10
        },
        freeze: {
            time: 200,
            value: 0.5
        }
    }*/],

    player: {
        money: 199
    },

    /*defaultTower: {
        img: '/img/blankIcon/pm2grl.png',
        radius: 50,
        preset: {
            strokeColor: 'efefef',
            fillColor: 'fefefe',
            strokeWidth: 3
        }
    },*/

    buyingTowerPreset: {
        overlayFactory: ymaps.geoObject.overlayFactory.staticGraphics
    },

    playerTowerPreset: {
//        overlayFactory: ymaps.geoObject.overlayFactory.interactiveGraphics,
        iconImageHref: 'sprites/yac-td-sprites-towers.png',
        iconImageSize: [40, 45]
    },

    waveActivateTime: 300,

    routePreset: {
        overlayFactory: ymaps.geoObject.overlayFactory.staticGraphics,
        strokeWidth: 7,
        projection: ymaps.projection.wgs84Mercator,
        opacity: 0.7,
        strokeColor: '0000bb55'
    },

    holePreset: {
        overlayFactory: ymaps.geoObject.overlayFactory.staticGraphics,
        iconImageHref: 'img/poiIcon/dps.png',
        projection: ymaps.projection.wgs84Mercator,
        preset: 'twirl#blueIcon',
        zIndex: 3000
    },

    fps: 30
};


});
