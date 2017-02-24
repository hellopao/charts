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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
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
                var baseline = text.baseline,
                    align = text.align;

                text.baseline && (ctx.textBaseline = text.baseline);
                text.align && (ctx.textAlign = text.align);
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

/***/ })
/******/ ]);
});