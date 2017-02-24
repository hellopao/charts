(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("chart", [], factory);
	else if(typeof exports === 'object')
		exports["chart"] = factory();
	else
		root["chart"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });

var Canvas = function () {
    function Canvas(options) {
        _classCallCheck(this, Canvas);

        this.initialize(options);
    }

    _createClass(Canvas, [{
        key: "initialize",
        value: function initialize(options) {
            var _options$width = options.width,
                width = _options$width === undefined ? 300 : _options$width,
                _options$height = options.height,
                height = _options$height === undefined ? 150 : _options$height,
                _options$styles = options.styles,
                styles = _options$styles === undefined ? {} : _options$styles,
                container = options.container;

            this.wechat = this.isWechatEnv();
            if (!this.wechat) {
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');
                canvas.width = width;
                canvas.style.width = width + "px";
                canvas.height = height;
                canvas.style.height = height + "px";
                Object.keys(styles).forEach(function (item) {
                    if (item === "font") {
                        ctx.font = styles[item];
                    } else {
                        canvas.style[item] = styles[item];
                    }
                });
                if (typeof container === "string") {
                    document.body.querySelector(container).appendChild(canvas);
                } else {
                    container.appendChild(canvas);
                }
                this.ctx = ctx;
            } else {
                this.ctx = wx.createCanvasContext(container);
            }
        }
    }, {
        key: "isWechatEnv",
        value: function isWechatEnv() {
            try {
                return wx !== undefined && typeof wx.createCanvasContext === "function";
            } catch (err) {
                return false;
            }
        }
        /**
         * 实线
         */

    }, {
        key: "drawLine",
        value: function drawLine(line) {
            var ctx = this.ctx;

            ctx.save();
            if (this.wechat) {
                line.color && ctx.setStrokeStyle(line.color);
                line.width && ctx.setLineWidth(line.width);
            } else {
                line.color && (ctx.strokeStyle = line.color);
                line.width && (ctx.lineWidth = line.width);
            }
            ctx.beginPath();
            ctx.moveTo(line.points[0].x, line.points[0].y);
            for (var i = 1, len = line.points.length; i < len; i++) {
                var point = line.points[i];
                ctx.lineTo(point.x, point.y);
            }
            ctx.stroke();
            this.wechat && ctx.draw(true);
            ctx.restore();
        }
        /**
         * 虚线
         */

    }, {
        key: "drawDashLine",
        value: function drawDashLine(line) {
            var ctx = this.ctx;

            ctx.save();
            if (this.wechat) {
                var distanceX = line.end.x - line.start.x;
                var distanceY = line.end.y - line.start.y;
                var distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
                var repeatTimes = Math.floor(distance / line.segments.reduce(function (prev, cur) {
                    return cur + prev;
                }));
                var steps = [];
                for (var i = 0; i < repeatTimes; i++) {
                    steps.push.apply(steps, _toConsumableArray(line.segments));
                }
                var leftSteps = distance - steps.reduce(function (prev, cur) {
                    return cur + prev;
                });
                for (var _i = 0; _i < line.segments.length; _i++) {
                    var step = line.segments[_i];
                    if (leftSteps <= step) {
                        steps.push(leftSteps);
                        break;
                    } else {
                        steps.push(step);
                        leftSteps = step - leftSteps;
                    }
                }
                ctx.beginPath();
                steps.reduce(function (prev, step, index) {
                    var offsetX = distanceX * step / distance;
                    var offsetY = distanceY * step / distance;
                    // 偶数，画线
                    if (index % 2 === 1) {
                        ctx.moveTo(prev.x, prev.y);
                        ctx.lineTo(prev.x + offsetX, prev.y + offsetY);
                    }
                    return {
                        x: prev.x + offsetX,
                        y: prev.y + offsetY
                    };
                }, line.start);
                line.width && ctx.setLineWidth(line.width);
                line.color && ctx.setStrokeStyle(line.color);
                ctx.stroke();
                ctx.draw(true);
            } else {
                ctx.setLineDash(line.segments);
                ctx.beginPath();
                ctx.moveTo(line.start.x, line.start.y);
                ctx.lineTo(line.end.x, line.end.y);
                line.width && (ctx.lineWidth = line.width);
                line.color && (ctx.strokeStyle = line.color);
                ctx.stroke();
            }
            ctx.restore();
        }
        /**
         * 文字
         */

    }, {
        key: "drawText",
        value: function drawText(text, point) {
            var ctx = this.ctx;

            ctx.save();
            if (this.wechat) {
                text.color && ctx.setFillStyle(text.color);
                // text.baseline && (ctx.textBaseline = text.baseline);
                // text.align && (ctx.textAlign = text.align);
                text.size && ctx.setFontSize(text.size);
            } else {
                text.color && (ctx.fillStyle = text.color);
                text.baseline && (ctx.textBaseline = text.baseline);
                text.align && (ctx.textAlign = text.align);
                if (text.size) {
                    ctx.font = ctx.font.replace(/(\d+\.?\d*)(px|rpx|em|rem|pt)/, function (str, size, unit) {
                        return text.size + unit;
                    });
                }
            }
            ctx.fillText(text.content, point.x, point.y);
            this.wechat && ctx.draw(true);
            ctx.restore();
        }
        /**
         * 圆
         */

    }, {
        key: "drawDot",
        value: function drawDot(dot, point) {
            var ctx = this.ctx;

            ctx.save();
            ctx.beginPath();
            ctx.arc(point.x, point.y, dot.radius, 0, 2 * Math.PI);
            if (this.wechat) {
                ctx.setFillStyle(dot.color);
            } else {
                ctx.fillStyle = dot.color;
            }
            ctx.fill();
            this.wechat && ctx.draw(true);
            ctx.restore();
        }
        /**
         * 圈/圆环
         */

    }, {
        key: "drawCircle",
        value: function drawCircle(circle, point) {
            var ctx = this.ctx;

            ctx.save();
            ctx.beginPath();
            ctx.arc(point.x, point.y, circle.radius, 0, 2 * Math.PI);
            if (this.wechat) {
                ctx.setLineWidth(circle.border);
                ctx.setStrokeStyle(circle.color);
            } else {
                ctx.lineWidth = circle.border;
                ctx.strokeStyle = circle.color;
            }
            ctx.stroke();
            this.wechat && ctx.draw(true);
            ctx.restore();
        }
        /**
         * 网格
         */

    }, {
        key: "drawGrid",
        value: function drawGrid(grid) {
            var ctx = this.ctx;
            var _grid$lineWidth = grid.lineWidth,
                lineWidth = _grid$lineWidth === undefined ? 1 : _grid$lineWidth;

            var deltaX = (grid.width - lineWidth) / grid.column;
            var deltaY = (grid.height - lineWidth) / grid.row;
            //水平线
            for (var i = 0; i <= grid.row; i++) {
                this.drawLine({
                    color: grid.lineColor,
                    width: grid.lineWidth,
                    points: [{
                        x: grid.origin.x,
                        y: grid.origin.y + lineWidth / 2 + deltaY * i
                    }, {
                        x: grid.origin.x + grid.width,
                        y: grid.origin.y + lineWidth / 2 + deltaY * i
                    }]
                });
            }
            //垂直线
            for (var _i2 = 0; _i2 <= grid.column; _i2++) {
                this.drawLine({
                    color: grid.lineColor,
                    width: grid.lineWidth,
                    points: [{
                        x: grid.origin.x + lineWidth / 2 + deltaX * _i2,
                        y: grid.origin.y
                    }, {
                        x: grid.origin.x + lineWidth / 2 + deltaX * _i2,
                        y: grid.origin.y + grid.height
                    }]
                });
            }
        }
        /**
         * 形状
         * 由至少两条线构成，第一条线的起点到最后一条线的终点，连成一个形状
         */

    }, {
        key: "drawShape",
        value: function drawShape(shape) {
            var ctx = this.ctx;
            var lines = shape.lines,
                fillStyle = shape.fillStyle;

            if (lines.length < 2) {
                throw new Error("a shape contains at least two lines");
            }
            ;
            var origin = lines[0].points[0];
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(origin.x, origin.y);
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = lines[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var line = _step.value;

                    line.points.forEach(function (point, index) {
                        ctx.lineTo(point.x, point.y);
                    });
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            ctx.lineTo(origin.x, origin.y);
            if (this.wechat) {
                ctx.setFillStyle(fillStyle);
            } else {
                ctx.fillStyle = fillStyle;
            }
            ctx.fill();
            this.wechat && ctx.draw(true);
            ctx.restore();
        }
    }]);

    return Canvas;
}();

exports.Canvas = Canvas;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var canvas_1 = __webpack_require__(0);
var StockChart;
(function (StockChart) {
    var Base = function () {
        function Base(options) {
            _classCallCheck(this, Base);

            this.options = options;
            var width = options.width,
                height = options.height,
                container = options.container,
                styles = options.styles;

            this.options.global = this.options.global || {};
            this.chart = new canvas_1.Canvas({
                width: width, height: height, container: container, styles: styles
            });
        }

        _createClass(Base, [{
            key: "drawGrid",
            value: function drawGrid(grid) {
                var _options$global = this.options.global,
                    _options$global$gridL = _options$global.gridLineWidth,
                    gridLineWidth = _options$global$gridL === undefined ? Base.GRID_LINE_WIDTH : _options$global$gridL,
                    _options$global$gridL2 = _options$global.gridLineColor,
                    gridLineColor = _options$global$gridL2 === undefined ? Base.GRID_LINE_COLOR : _options$global$gridL2;
                var width = grid.width,
                    height = grid.height,
                    origin = grid.origin,
                    _grid$column = grid.column,
                    column = _grid$column === undefined ? 2 : _grid$column,
                    _grid$row = grid.row,
                    row = _grid$row === undefined ? 2 : _grid$row;

                this.chart.drawGrid({
                    origin: origin, width: width, height: height, column: column, row: row,
                    lineColor: gridLineColor,
                    lineWidth: gridLineWidth
                });
            }
        }, {
            key: "getLineColor",
            value: function getLineColor(price, base) {
                var _options$global2 = this.options.global,
                    _options$global2$rise = _options$global2.riseColor,
                    riseColor = _options$global2$rise === undefined ? Base.RISE_COLOR : _options$global2$rise,
                    _options$global2$fall = _options$global2.fallColor,
                    fallColor = _options$global2$fall === undefined ? Base.FALL_COLOR : _options$global2$fall,
                    _options$global2$flat = _options$global2.flatColor,
                    flatColor = _options$global2$flat === undefined ? Base.FLAT_COLOR : _options$global2$flat;

                if (+price - base == 0) return flatColor;
                return +price > +base ? riseColor : fallColor;
            }
        }, {
            key: "getOffsetX",
            value: function getOffsetX(index, total, width, lineWidth, offset) {
                var _options$global$gridL3 = this.options.global.gridLineWidth,
                    gridLineWidth = _options$global$gridL3 === undefined ? Base.GRID_LINE_WIDTH : _options$global$gridL3;

                var itemWidth = (width - gridLineWidth * 2 - lineWidth) / (total - 1);
                return offset + itemWidth * index + gridLineWidth + lineWidth * .5;
            }
        }, {
            key: "getOffsetY",
            value: function getOffsetY(cur, highest, lowest, height, offset) {
                var _options$global$gridL4 = this.options.global.gridLineWidth,
                    gridLineWidth = _options$global$gridL4 === undefined ? Base.GRID_LINE_WIDTH : _options$global$gridL4;

                return offset + (height - gridLineWidth * 2) * (1 - (cur - lowest) / (highest - lowest)) + gridLineWidth;
            }
        }]);

        return Base;
    }();

    Base.RISE_COLOR = "red";
    Base.FALL_COLOR = "green";
    Base.FLAT_COLOR = "black";
    Base.GRID_LINE_COLOR = "#dddddd";
    Base.VOLUME_COLOR = "#2f84cc";
    Base.GRID_LINE_WIDTH = 1;
    Base.TEXT_COLOR = "#888888";
    Base.AXIS_X = 0;
    StockChart.Base = Base;
})(StockChart || (StockChart = {}));
exports.default = StockChart;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Object.defineProperty(exports, "__esModule", { value: true });
var base_1 = __webpack_require__(1);

var KLine = function (_base_1$default$Base) {
    _inherits(KLine, _base_1$default$Base);

    function KLine(options) {
        _classCallCheck(this, KLine);

        var _this = _possibleConstructorReturn(this, (KLine.__proto__ || Object.getPrototypeOf(KLine)).call(this, options));

        _this.options = options;
        _this.draw();
        return _this;
    }

    _createClass(KLine, [{
        key: "draw",
        value: function draw() {
            this.drawPriceGrid();
            this.drawVolumeGrid();
            this.drawPriceLines();
            this.drawVolumeLines();
            this.drawPriceText();
        }
    }, {
        key: "drawPriceGrid",
        value: function drawPriceGrid() {
            var priceGrid = this.options.priceGrid;

            this.drawGrid(Object.assign({}, priceGrid, {
                row: 4,
                column: 4
            }));
        }
    }, {
        key: "drawVolumeGrid",
        value: function drawVolumeGrid() {
            var volumeGrid = this.options.volumeGrid;

            this.drawGrid(Object.assign({}, volumeGrid, {
                row: 2,
                column: 4
            }));
        }
    }, {
        key: "drawPriceLines",
        value: function drawPriceLines() {
            var priceGrid = this.options.priceGrid;
            var ohlcPrices = this.options.dataSet.ohlcPrices;
            var _options$global$candl = this.options.global.candleStickWidth,
                candleStickWidth = _options$global$candl === undefined ? KLine.CANDLE_STICK_WIDTH : _options$global$candl;

            var _getEndsPrice = this.getEndsPrice(),
                highest = _getEndsPrice.highest,
                lowest = _getEndsPrice.lowest;
            // 蜡烛图


            for (var i = 0, len = ohlcPrices.length; i < len; i++) {
                var price = ohlcPrices[i];
                var x = this.getOffsetX(i, len, priceGrid.width, candleStickWidth, priceGrid.origin.x);
                // 开盘、收盘
                this.chart.drawLine({
                    points: [{
                        x: x, y: this.getOffsetY(price.o, highest, lowest, priceGrid.height, priceGrid.origin.y)
                    }, {
                        x: x, y: this.getOffsetY(price.c, highest, lowest, priceGrid.height, priceGrid.origin.y)
                    }],
                    width: candleStickWidth,
                    color: this.getLineColor(price.c, price.o)
                });
                // 最高、最低
                this.chart.drawLine({
                    points: [{
                        x: x, y: this.getOffsetY(price.h, highest, lowest, priceGrid.height, priceGrid.origin.y)
                    }, {
                        x: x, y: this.getOffsetY(price.l, highest, lowest, priceGrid.height, priceGrid.origin.y)
                    }],
                    color: this.getLineColor(price.c, price.o),
                    width: 1
                });
            }
            this.drawMALines();
            this.drawMALengend();
        }
    }, {
        key: "drawPriceText",
        value: function drawPriceText() {
            this.drawAxisXText();
            this.drawAxisYText();
        }
    }, {
        key: "getEndsPrice",
        value: function getEndsPrice() {
            var ohlcPrices = this.options.dataSet.ohlcPrices;

            var hPrices = ohlcPrices.map(function (price) {
                return price.h;
            });
            var lPrices = ohlcPrices.map(function (price) {
                return price.l;
            });
            var highestPrice = Math.max.apply(Math, _toConsumableArray(hPrices));
            var lowestPrice = Math.min.apply(Math, _toConsumableArray(lPrices));
            return {
                highest: Math.max.apply(Math, _toConsumableArray(hPrices)),
                lowest: Math.min.apply(Math, _toConsumableArray(lPrices))
            };
        }
    }, {
        key: "drawMALines",
        value: function drawMALines() {
            var _this2 = this;

            var _options$dataSet = this.options.dataSet,
                _options$dataSet$maPr = _options$dataSet.maPrices,
                maPrices = _options$dataSet$maPr === undefined ? {} : _options$dataSet$maPr,
                _options$dataSet$maCo = _options$dataSet.maColors,
                maColors = _options$dataSet$maCo === undefined ? KLine.MA_COLORS : _options$dataSet$maCo;
            var priceGrid = this.options.priceGrid;

            var _getEndsPrice2 = this.getEndsPrice(),
                highest = _getEndsPrice2.highest,
                lowest = _getEndsPrice2.lowest;

            Object.keys(maPrices).forEach(function (item) {
                var prices = maPrices[item];
                var color = maColors[item];
                _this2.chart.drawLine({
                    points: prices.map(function (price, index) {
                        return {
                            x: _this2.getOffsetX(index, prices.length, priceGrid.width, 1, priceGrid.origin.x),
                            y: _this2.getOffsetY(price, highest, lowest, priceGrid.height, priceGrid.origin.y)
                        };
                    }),
                    color: color
                });
            });
        }
    }, {
        key: "drawMALengend",
        value: function drawMALengend() {
            var _this3 = this;

            var _options$global$textC = this.options.global.textColor,
                textColor = _options$global$textC === undefined ? KLine.TEXT_COLOR : _options$global$textC;
            var priceGrid = this.options.priceGrid;
            var _options$dataSet2 = this.options.dataSet,
                _options$dataSet2$maP = _options$dataSet2.maPrices,
                maPrices = _options$dataSet2$maP === undefined ? {} : _options$dataSet2$maP,
                _options$dataSet2$maC = _options$dataSet2.maColors,
                maColors = _options$dataSet2$maC === undefined ? KLine.MA_COLORS : _options$dataSet2$maC;
            var _options$legend = this.options.legend,
                legend = _options$legend === undefined ? { x: 0, y: 0 } : _options$legend;

            var radius = 4;
            var keys = Object.keys(maPrices);
            var deltaX = priceGrid.width / keys.length;
            keys.forEach(function (item, index) {
                var prices = maPrices[item];
                // 圆
                _this3.chart.drawDot({
                    radius: radius,
                    color: maColors[item]
                }, {
                    x: index * deltaX + legend.x + radius, y: legend.y + 15 - radius
                });
                // 文字
                _this3.chart.drawText({
                    content: item.toUpperCase() + " " + prices[prices.length - 1],
                    color: textColor
                }, {
                    x: index * deltaX + legend.x + radius + 10, y: legend.y + 15
                });
            });
        }
    }, {
        key: "drawAxisYText",
        value: function drawAxisYText() {
            var _options$global$textC2 = this.options.global.textColor,
                textColor = _options$global$textC2 === undefined ? KLine.TEXT_COLOR : _options$global$textC2;
            var _options = this.options,
                priceGrid = _options.priceGrid,
                volumeGrid = _options.volumeGrid,
                _options$priceTextOff = _options.priceTextOffsetX,
                priceTextOffsetX = _options$priceTextOff === undefined ? KLine.AXIS_X : _options$priceTextOff;
            var _options$dataSet3 = this.options.dataSet,
                ohlcPrices = _options$dataSet3.ohlcPrices,
                volumes = _options$dataSet3.volumes;

            var _getEndsPrice3 = this.getEndsPrice(),
                highest = _getEndsPrice3.highest,
                lowest = _getEndsPrice3.lowest;

            var row = priceGrid.row || 4;
            for (var i = 0; i <= row; i++) {
                var price = highest - (highest - lowest) * i / row;
                this.chart.drawText({
                    content: price.toFixed(2),
                    baseline: i === 0 ? "top" : i === row ? "bottom" : "middle",
                    color: textColor
                }, {
                    x: priceTextOffsetX,
                    y: this.getOffsetY(price, highest, lowest, priceGrid.height, priceGrid.origin.y)
                });
            }
            var maxVolume = Math.max.apply(Math, _toConsumableArray(volumes));
            this.chart.drawText({
                content: maxVolume.toString(),
                baseline: "top",
                color: textColor
            }, {
                x: priceTextOffsetX,
                y: volumeGrid.origin.y
            });
        }
    }, {
        key: "drawAxisXText",
        value: function drawAxisXText() {}
    }, {
        key: "drawVolumeLines",
        value: function drawVolumeLines() {
            var _this4 = this;

            var _options$dataSet4 = this.options.dataSet,
                volumes = _options$dataSet4.volumes,
                ohlcPrices = _options$dataSet4.ohlcPrices;
            var volumeGrid = this.options.volumeGrid;
            var _options$global$candl2 = this.options.global.candleStickWidth,
                candleStickWidth = _options$global$candl2 === undefined ? KLine.CANDLE_STICK_WIDTH : _options$global$candl2;

            var maxVolume = Math.max.apply(Math, _toConsumableArray(volumes));
            var volumeCount = volumes.length;
            volumes.forEach(function (volume, index) {
                var x = _this4.getOffsetX(index, volumeCount, volumeGrid.width, 1, volumeGrid.origin.x);
                var price = ohlcPrices[index];
                _this4.chart.drawLine({
                    points: [{
                        x: x, y: _this4.getOffsetY(volume, maxVolume, 0, volumeGrid.height, volumeGrid.origin.y)
                    }, {
                        x: x, y: _this4.getOffsetY(0, maxVolume, 0, volumeGrid.height, volumeGrid.origin.y)
                    }],
                    width: candleStickWidth,
                    color: _this4.getLineColor(price.c, price.o)
                });
            });
        }
    }]);

    return KLine;
}(base_1.default.Base);

KLine.CANDLE_STICK_WIDTH = 4;
KLine.MA_COLORS = {
    ma5: 'rgb(254,227,55)',
    ma10: 'rgb(68,200,171)',
    ma20: 'rgb(146,79,216)',
    ma30: 'rgb(45, 111, 177)'
};
exports.KLine = KLine;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Object.defineProperty(exports, "__esModule", { value: true });
var base_1 = __webpack_require__(1);

var TimeLine = function (_base_1$default$Base) {
    _inherits(TimeLine, _base_1$default$Base);

    function TimeLine(options) {
        _classCallCheck(this, TimeLine);

        var _this = _possibleConstructorReturn(this, (TimeLine.__proto__ || Object.getPrototypeOf(TimeLine)).call(this, options));

        _this.options = options;
        _this.timePercent = _this.getTimePercent();
        _this.draw();
        return _this;
    }

    _createClass(TimeLine, [{
        key: "draw",
        value: function draw() {
            this.drawPriceGrid();
            this.drawVolumeGrid();
            this.drawPriceLines();
            this.drawVolumeLines();
            this.drawPriceText();
        }
    }, {
        key: "getTimePercent",
        value: function getTimePercent() {
            var _options = this.options,
                _options$timeInterval = _options.timeInterval,
                timeInterval = _options$timeInterval === undefined ? TimeLine.TIME_INTERVAL : _options$timeInterval,
                _options$tradeHours = _options.tradeHours,
                tradeHours = _options$tradeHours === undefined ? TimeLine.TRADE_HOURS : _options$tradeHours,
                _options$days = _options.days,
                days = _options$days === undefined ? TimeLine.DAYS : _options$days;
            var prices = this.options.dataSet.prices;

            return prices.length / days / (2 + tradeHours * 60 / timeInterval);
        }
    }, {
        key: "drawPriceText",
        value: function drawPriceText() {
            this.drawAxisXText();
            this.drawAxisYText();
        }
    }, {
        key: "drawPriceGrid",
        value: function drawPriceGrid() {
            var priceGrid = this.options.priceGrid;

            this.drawGrid(Object.assign({}, priceGrid, {
                row: 4,
                column: 4
            }));
        }
    }, {
        key: "drawVolumeGrid",
        value: function drawVolumeGrid() {
            var volumeGrid = this.options.volumeGrid;

            this.drawGrid(Object.assign({}, volumeGrid, {
                row: 2,
                column: 4
            }));
        }
    }, {
        key: "drawPriceLines",
        value: function drawPriceLines() {
            var _this2 = this;

            var _options2 = this.options,
                priceGrid = _options2.priceGrid,
                dataSet = _options2.dataSet,
                _options2$days = _options2.days,
                days = _options2$days === undefined ? TimeLine.DAYS : _options2$days;
            var _options$global = this.options.global,
                _options$global$price = _options$global.priceLineColor,
                priceLineColor = _options$global$price === undefined ? TimeLine.PRICE_LINE_COLOR : _options$global$price,
                _options$global$avgPr = _options$global.avgPriceLineColor,
                avgPriceLineColor = _options$global$avgPr === undefined ? TimeLine.AVG_PRICE_LINE_COLOR : _options$global$avgPr;

            var priceCount = dataSet.prices.length;

            var _getEndsPrices = this.getEndsPrices(),
                highest = _getEndsPrices.highest,
                lowest = _getEndsPrices.lowest;

            var timeLinePoints = dataSet.prices.map(function (price, index) {
                return {
                    x: _this2.getOffsetX(index, priceCount, priceGrid.width * _this2.timePercent, 1, priceGrid.origin.x),
                    y: _this2.getOffsetY(price, highest, lowest, priceGrid.height, priceGrid.origin.y)
                };
            });
            // 分时线
            this.chart.drawLine({
                points: timeLinePoints,
                color: priceLineColor
            });
            var endY = this.getOffsetY(lowest, highest, lowest, priceGrid.height, priceGrid.origin.y);
            // 分时线下面的填充
            this.chart.drawShape({
                lines: [{
                    points: timeLinePoints
                }, {
                    points: [{
                        x: timeLinePoints[priceCount - 1].x, y: timeLinePoints[priceCount - 1].y
                    }, {
                        x: timeLinePoints[priceCount - 1].x, y: endY
                    }]
                }, {
                    points: [{
                        x: timeLinePoints[priceCount - 1].x, y: endY
                    }, {
                        x: timeLinePoints[0].x, y: endY
                    }]
                }],
                fillStyle: "#d5e6f5"
            });
            // 均价线
            this.chart.drawLine({
                points: dataSet.avgPrices.map(function (price, index) {
                    return {
                        x: _this2.getOffsetX(index, priceCount, priceGrid.width * _this2.timePercent, 1, priceGrid.origin.x),
                        y: _this2.getOffsetY(price, highest, lowest, priceGrid.height, priceGrid.origin.y)
                    };
                }),
                color: avgPriceLineColor
            });
            // 中价线
            if (days === 1) {
                var center = (highest + lowest) / 2;
                this.chart.drawDashLine({
                    start: {
                        x: priceGrid.origin.x,
                        y: this.getOffsetY(center, highest, lowest, priceGrid.height, priceGrid.origin.y)
                    },
                    end: {
                        x: priceGrid.origin.x + priceGrid.width,
                        y: this.getOffsetY(center, highest, lowest, priceGrid.height, priceGrid.origin.y)
                    },
                    segments: [4, 2],
                    color: "#a7d2e9"
                });
            }
        }
    }, {
        key: "getEndsPrices",
        value: function getEndsPrices() {
            var _options$dataSet = this.options.dataSet,
                prices = _options$dataSet.prices,
                volumes = _options$dataSet.volumes,
                lastClosePrice = _options$dataSet.lastClosePrice;
            var _options$days2 = this.options.days,
                days = _options$days2 === undefined ? TimeLine.DAYS : _options$days2;

            var highest = Math.max.apply(Math, _toConsumableArray(prices));
            var lowest = Math.min.apply(Math, _toConsumableArray(prices));
            if (days === 1) {
                if (Math.abs(highest - lastClosePrice) > Math.abs(lowest - lastClosePrice)) {
                    lowest = lastClosePrice - Math.abs(highest - lastClosePrice);
                } else {
                    highest = +lastClosePrice + Math.abs(lastClosePrice - lowest);
                }
            }
            return { highest: highest, lowest: lowest };
        }
    }, {
        key: "drawAxisYText",
        value: function drawAxisYText() {
            var _options$global$textC = this.options.global.textColor,
                textColor = _options$global$textC === undefined ? TimeLine.TEXT_COLOR : _options$global$textC;
            var _options3 = this.options,
                priceGrid = _options3.priceGrid,
                volumeGrid = _options3.volumeGrid,
                _options3$priceTextOf = _options3.priceTextOffsetX,
                priceTextOffsetX = _options3$priceTextOf === undefined ? TimeLine.AXIS_X : _options3$priceTextOf,
                _options3$volumeTextO = _options3.volumeTextOffsetX,
                volumeTextOffsetX = _options3$volumeTextO === undefined ? TimeLine.VOLUME_TEXT_OFFSETX : _options3$volumeTextO;
            var _options$dataSet2 = this.options.dataSet,
                prices = _options$dataSet2.prices,
                volumes = _options$dataSet2.volumes,
                lastClosePrice = _options$dataSet2.lastClosePrice;

            var _getEndsPrices2 = this.getEndsPrices(),
                highest = _getEndsPrices2.highest,
                lowest = _getEndsPrices2.lowest;

            var center = (highest + lowest) / 2;
            var row = priceGrid.row || 4;
            for (var i = 0; i <= row; i++) {
                var price = highest - (highest - lowest) * i / row;
                var increase = (100 * (price - center) / center).toFixed(2) + "%";
                // 价格
                this.chart.drawText({
                    content: price.toFixed(2),
                    baseline: i === 0 ? "top" : i === row ? "bottom" : "middle",
                    color: this.getLineColor(price, center)
                }, {
                    x: priceTextOffsetX,
                    y: this.getOffsetY(price, highest, lowest, priceGrid.height, priceGrid.origin.y)
                });
                // 涨幅
                this.chart.drawText({
                    content: increase,
                    baseline: i === 0 ? "top" : i === row ? "bottom" : "middle",
                    color: this.getLineColor(price, center)
                }, {
                    x: volumeTextOffsetX,
                    y: this.getOffsetY(price, highest, lowest, priceGrid.height, priceGrid.origin.y)
                });
            }
            var maxVolume = Math.max.apply(Math, _toConsumableArray(volumes));
            this.chart.drawText({
                content: maxVolume.toString(),
                baseline: "top",
                color: textColor
            }, {
                x: priceTextOffsetX,
                y: volumeGrid.origin.y
            });
        }
    }, {
        key: "drawAxisXText",
        value: function drawAxisXText() {
            var _options4 = this.options,
                priceGrid = _options4.priceGrid,
                _options4$days = _options4.days,
                days = _options4$days === undefined ? TimeLine.DAYS : _options4$days;

            var times = this.getTimes();
            for (var i = 0, len = times.length; i < len; i++) {
                var deltaX = priceGrid.width / (len - 1);
                this.chart.drawText({
                    content: times[i],
                    baseline: "top",
                    align: i === 0 ? "start" : i === len - 1 ? "end" : "center"
                }, {
                    x: i * deltaX + priceGrid.origin.x,
                    y: priceGrid.origin.y + priceGrid.height
                });
            }
        }
    }, {
        key: "getTimes",
        value: function getTimes() {
            var _options$dataSet$time = this.options.dataSet.times,
                times = _options$dataSet$time === undefined ? [] : _options$dataSet$time;
            var _options5 = this.options,
                _options5$days = _options5.days,
                days = _options5$days === undefined ? TimeLine.DAYS : _options5$days,
                _options5$tradeHours = _options5.tradeHours,
                tradeHours = _options5$tradeHours === undefined ? TimeLine.TRADE_HOURS : _options5$tradeHours;

            if (days === 1) {
                if (tradeHours === 5.5) {
                    return ["9:30", "11:00", "12:00/13:00", "14:00", "16:00"];
                } else if (tradeHours === 4) {
                    return ["9:30", "10:30", "11:30/13:00", "14:00", "15:00"];
                }
            } else {
                var timeSet = {};
                times.forEach(function (time) {
                    var date = new Date(time);
                    var dateStr = date.getMonth() + 1 + "-" + date.getDate();
                    timeSet[dateStr] = 1;
                });
                return Object.keys(timeSet);
            }
            return times;
        }
    }, {
        key: "getVolumeColor",
        value: function getVolumeColor(volume) {
            var _options$global$volum = this.options.global.volumeColor,
                volumeColor = _options$global$volum === undefined ? TimeLine.VOLUME_COLOR : _options$global$volum;

            return volumeColor;
        }
    }, {
        key: "drawVolumeLines",
        value: function drawVolumeLines() {
            var _this3 = this;

            var _options$dataSet3 = this.options.dataSet,
                volumes = _options$dataSet3.volumes,
                prices = _options$dataSet3.prices,
                lastClosePrice = _options$dataSet3.lastClosePrice;
            var volumeGrid = this.options.volumeGrid;

            var maxVolume = Math.max.apply(Math, _toConsumableArray(volumes));
            var volumeCount = volumes.length;
            volumes.forEach(function (volume, index) {
                var x = _this3.getOffsetX(index, volumeCount, volumeGrid.width * _this3.timePercent, 1, volumeGrid.origin.x);
                var price = prices[index];
                _this3.chart.drawLine({
                    points: [{
                        x: x, y: _this3.getOffsetY(volume, maxVolume, 0, volumeGrid.height, volumeGrid.origin.y)
                    }, {
                        x: x, y: _this3.getOffsetY(0, maxVolume, 0, volumeGrid.height, volumeGrid.origin.y)
                    }],
                    width: 1,
                    color: _this3.getVolumeColor(volume)
                });
            });
        }
    }]);

    return TimeLine;
}(base_1.default.Base);

TimeLine.PRICE_LINE_COLOR = "rgb(92, 157, 214)";
TimeLine.AVG_PRICE_LINE_COLOR = "rgb(230, 160, 81)";
TimeLine.TIME_INTERVAL = 1;
TimeLine.TRADE_HOURS = 4;
TimeLine.DAYS = 1;
TimeLine.VOLUME_TEXT_OFFSETX = 0;
exports.TimeLine = TimeLine;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
var kline_1 = __webpack_require__(2);
exports.KLine = kline_1.KLine;
var timeline_1 = __webpack_require__(3);
exports.TimeLine = timeline_1.TimeLine;

/***/ })
/******/ ]);
});