(function (exports) {


// Эксцентриситет в квадрате
    var _e2 = 0.00669437999014,
// Точность вычислений
        _epsilon = 1e-10;

    exports.util = {
        distance: function (point1, point2, radius) {
            radius = radius || 6378137;

            var degree2rad = Math.PI/180,
                long1 = point1[0] * degree2rad,
                lat1 = point1[1] * degree2rad,
                long2 = point2[0] * degree2rad,
                lat2 = point2[1] * degree2rad,
                dist = 0;



            if (!(Math.abs(lat2 - lat1) < _epsilon && Math.abs(long1 - long2) < _epsilon)) {
                var s = Math.cos((lat1 + lat2)/2),
                    r = radius * Math.sqrt((1.0 - _e2)/(1 - _e2*s*s));
                dist = r * Math.acos(Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(long2 - long1));
            }
            return dist;
        },

        boundsContain: function (bounds, point) {
            return bounds[0][0] <= point[0] && bounds[0][1] <= point[1] &&
                bounds[1][0] >= point[0] && bounds[1][1] >= point[1];

        },

        circleContain: function (circle, point) {
            var geometry = circle.geometry;
            return this.boundsContain(geometry.getBounds(), point) &&
                this.distance(geometry.getCoordinates(), point) < geometry.getRadius();
        },

        equalCoords: function (arr1, arr2) {
            return arr1[0] == arr2[0] && arr1[1] == arr2[1];
        }
    };

})(app.lib);