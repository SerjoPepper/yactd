(function (exports) {

    exports.settings = {

        game: {
            routes: [
                {
                    offset: [0.0075, 0.005],
                    preset: 'game#route'
                }, {
                    offset: [-0.0075, 0.005],
                    preset: 'game#route'
                }/*, {
                 offset: [-0.0075, -0.005],
                 preset: 'game#route'
                 }, {
                 offset: [0.0075, -0.005],
                 preset: 'game#route'
                 }*/
            ],

            levels: [
                {
                    type: 0,
                    count: 10,
                    routes: 1
                }, {
                    type: 0,
                    count: 50,
                    routes: 1
                }, {
                    type: 1,
                    count: 8,
                    routes: 2
                }, {
                    type: 0,
                    count: 50,
                    routes: 2
                }
            ]
        },

        home: {
            hp: 500,
            radius: 100,
            preset: 'game#home',
            liveColor: [0, 255, 0],
            destroyColor: [255, 0, 0],
            opacity: 'aa'
        },

        mobs: [
            {
                speed: 30, // м/с
                hp: 15,
                price: 5,
                damage: 25,
                preset: 'game#mob1',
                freq: 4
            }, {
                speed: 20, // м/с
                hp: 50,
                price: 30,
                damage: 70,
                preset: 'game#mob2',
                freq: 6
            },
            {
                speed: 60, // м/с
                hp: 5,
                price: 1,
                damage: 1,
                preset: 'game#mob3',
                freq: 0.5
            }
        ],

        fps: 10,

        route: {
            opacity: {
                active: 0.8,
                noactive: 0.3
            }
        },

        player: {
            money: 500
        },

        towers: [
            {
                name: 'пост ДПС',
                speed: 3, //выстрелов в секунду
                price: 100,
                preset: 'game#tower1',
                gunPreset: 'game#tower1gun',
                damage: 5,
                radius: 150
            },
            {
                name: 'Мануфактура',
                speed: 2, //выстрелов в секунду
                price: 200,
                preset: 'game#tower2',
                gunPreset: 'game#tower2gun',
                damage: 15,
                radius: 250
            }
        ]
    };

})(app.lib);