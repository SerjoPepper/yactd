(function (exports) {


// Эксцентриситет в квадрате
    var _e2 = 0.00669437999014,
// Точность вычислений
        _epsilon = 1e-10;

    exports.util = {
        distance: function (point1, point2) {
            return ymaps.coordSystem.geo.getDistance(point1, point2);
        },

        boundsContain: function (bounds, point) {
            return bounds[0][0] <= point[0] && bounds[0][1] <= point[1] &&
                bounds[1][0] >= point[0] && bounds[1][1] >= point[1];

        },

        toGlobalPixels: function (pos) {
            return app.mapProjection.toGlobalPixels(pos, app.map.getZoom());
        },

        fromGlobalPixels: function (pos) {
            return app.mapProjection.fromGlobalPixels(pos, app.map.getZoom());
        },

        circleContain: function (circle, point) {
            var geometry = circle.geometry;

            return this.boundsContain(geometry.getBounds(), point) &&
                this.distance(geometry.getCoordinates(), point) < geometry.getRadius();
        },

        equalCoords: function (arr1, arr2) {
            return arr1[0] == arr2[0] && arr1[1] == arr2[1];
        },

        intersect: function (imgPos, imgSize, canvasSize) {
            var canvasBounds = [
                    [imgPos[0], imgPos[0] + imgSize[0]],
                    [imgPos[1], imgPos[1] + imgSize[1]]
                ],
                notIntersected = canvasBounds[1][0] <= 0 || canvasBounds[1][1] <= 0 ||
                    canvasBounds[0][0] >= canvasSize[0] || canvasBounds[0][1] >= canvasSize[1];

            if (canvasBounds[0][0] >= 0 && canvasBounds[0][1] >= 0 && canvasBounds[1][0] <= canvasSize[0] && canvasBounds[1][1] <= canvasSize[1]) {
                return [canvasBounds, [[0, 0], canvasSize]];
            }

            if (notIntersected) {
                return null;
            } else {
                var imageBounds = [
                        [0, 0],
                        imgSize
                    ],
                    scale = [
                        imgSize[0] / (canvasBounds[1][0] - canvasBounds[0][0]),
                        imgSize[1] / (canvasBounds[1][1] - canvasBounds[0][1])
                    ],
                    exceeds = [
                        [
                            Math.min(canvasBounds[0][0], 0),
                            Math.min(canvasBounds[0][1], 0)
                        ],
                        [
                            Math.max(canvasBounds[1][0] - canvasSize[0], 0),
                            Math.max(canvasBounds[1][1] - canvasSize[1], 0)
                        ]
                    ];

                canvasBounds[0][0] -= exceeds[0][0];
                imageBounds[0][0] -= Math.round(scale[0] * exceeds[0][0]);
                canvasBounds[0][1] -= exceeds[0][1];
                imageBounds[0][1] -= Math.round(scale[1] * exceeds[0][1]);

                canvasBounds[1][0] -= exceeds[1][0];
                imageBounds[1][0] -= Math.round(scale[0] * exceeds[1][0]);
                canvasBounds[1][1] -= exceeds[1][1];
                imageBounds[1][1] -= Math.round(scale[1] * exceeds[1][1]);

                if (imageBounds[0][0] == imageBounds[1][0] ||
                    imageBounds[0][1] == imageBounds[1][1] ||
                    canvasBounds[0][0] == canvasBounds[1][0] ||
                    canvasBounds[0][1] == canvasBounds[1][1]) {
                    return null;
                }

                return [imageBounds, canvasBounds];
            }
        },

        renderImg: function (img, imgPos, imgSize) {
            var ctx = app.ctx,
                ctxSize = app.ctxSize,
                intersection = this.intersect(imgPos, imgSize, ctxSize);
            if (intersection) {
                var imageBounds = intersection[0],
                    canvasBounds = intersection[1];
                ctx.drawImage(
                    img,
                    Math.round(imageBounds[0][0]),
                    Math.round(imageBounds[0][1]),
                    Math.round(imageBounds[1][0] - imageBounds[0][0]),
                    Math.round(imageBounds[1][1] - imageBounds[0][1]),
                    Math.round(canvasBounds[0][0]),
                    Math.round(canvasBounds[0][1]),
                    Math.round(canvasBounds[1][0] - canvasBounds[0][0]),
                    Math.round(canvasBounds[1][1] - canvasBounds[0][1])
                );
            }
        },

        renderLine: function (coords, style) {
            var ctx = app.ctx,
                ctxSize = app.ctxSize;

            if (coords[0][0] == coords[1][0] || coords[0][1] == coords[1][1] || coords[0][0] < 0
                || coords[0][1] < 0 || coords[1][1] || coords[1][0] >= ctxSize[0] || coords[1][1] >= ctxSize[1]) {
                return;
            }

            ctx.strokeStyle = style;
            ctx.beginPath();
            ctx.moveTo(coords[0]);
            ctx.lineTo(coords[1]);
            ctx.stroke();
            ctx.closePath();
        },

        toLocalPixels: function (geoCoords) {
            return app.shadowsPane.toClientPixels(app.mapProjection.toGlobalPixels(geoCoords, app.map.getZoom()));
        }
    }

})(app.lib);