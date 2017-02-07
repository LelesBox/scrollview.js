(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["ScrollView"] = factory();
	else
		root["ScrollView"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _inertiaScroll = __webpack_require__(1);
	
	var _inertiaScroll2 = _interopRequireDefault(_inertiaScroll);
	
	var _matrix = __webpack_require__(2);
	
	var _matrix2 = _interopRequireDefault(_matrix);
	
	var _scrollbar = __webpack_require__(3);
	
	var _scrollbar2 = _interopRequireDefault(_scrollbar);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function ScrollView(container, opt) {
	  var _this = this;
	
	  this.container = container;
	  this.panel = container.children[0];
	  if (!this.panel) return;
	  this.opt = opt;
	
	  container.style.overflow = 'hidden';
	  container.style.position = 'relative';
	
	  var _createScrollBar = createScrollBar(container),
	      scrollBarH = _createScrollBar.scrollBarH,
	      scrollBarV = _createScrollBar.scrollBarV;
	
	  var containerClientHeight = container.clientHeight;
	  var containerClientWidth = container.clientWidth;
	  var startOffsetX = -(containerClientWidth / 2);
	  var startOffsetY = -(containerClientHeight / 2);
	  var autoScroll = new _inertiaScroll2.default(this.panel);
	  this.panelMatrix = new _matrix2.default({
	    panelWidth: this.panel.clientWidth,
	    panelHeight: this.panel.clientHeight,
	    containerWidth: container.clientWidth,
	    containerHeight: container.clientHeight,
	    maxScale: this.opt.maxScale || 4
	  });
	  this.panel.style.transformOrigin = 'center center';
	
	  this.panel.style.transform = this.panelMatrix.translate(startOffsetX, startOffsetY);
	  this.scrollBar = new _scrollbar2.default(container, this.panel, scrollBarH, scrollBarV);
	
	  var sx = 0;
	
	  var sy = 0;
	
	  var dx = 0;
	
	  var dy = 0;
	
	  var sx2 = -1;
	  var sy2 = -1;
	
	  var pinchLenght = 0;
	  this.panel.addEventListener('touchstart', movestart('touch').bind(this));
	  this.panel.addEventListener('touchmove', moving('touch').bind(this));
	  this.panel.addEventListener('touchend', moveend('touch').bind(this));
	
	  var isMouseDown = false;
	  this.panel.addEventListener('mousedown', movestart('mouse').bind(this));
	  this.panel.addEventListener('mousemove', moving('mouse').bind(this));
	  this.panel.addEventListener('mouseup', moveend('mouse').bind(this));
	  this.panel.addEventListener('mousewheel', function (e) {
	    e.preventDefault();
	    _this.move(-e.deltaX, -e.deltaY);
	  });
	  function movestart(type) {
	    return function (e) {
	      e.preventDefault();
	      var touch, touch2;
	      if (type === 'touch') {
	        touch = e.touches[0];
	        touch2 = e.touches[1];
	      } else if (type === 'mouse') {
	        touch = e;
	        isMouseDown = true;
	      }
	      if (touch2) {
	        sx2 = touch2.clientX;
	        sy2 = touch2.clientY;
	        pinchLenght = Math.sqrt(Math.pow(Math.abs(touch.clientX - touch2.clientX), 2) + Math.pow(Math.abs(touch.clientY - touch2.clientY), 2));
	        var cx = Math.abs(touch.clientX + touch2.clientX) / 2;
	        var cy = Math.abs(touch.clientY + touch2.clientY) / 2;
	        var panelPosition = this.panel.getBoundingClientRect();
	        var transformOriginX = cx - panelPosition.left;
	        var transformOriginY = cy - panelPosition.top;
	        var OriginOffsetX = transformOriginX / panelPosition.width * this.panel.clientWidth;
	        var OriginOffsetY = transformOriginY / panelPosition.height * this.panel.clientHeight;
	        this.panelMatrix.setOriginOffset(OriginOffsetX, OriginOffsetY);
	      }
	      if (touch) {
	        sx = touch.clientX;
	        sy = touch.clientY;
	        autoScroll.init({
	          x: sx,
	          y: sy
	        });
	      }
	    };
	  }
	
	  function moving(type) {
	    return function (e) {
	      var touch, touch2;
	      if (type === 'touch') {
	        touch = e.touches[0];
	        touch2 = e.touches[1];
	      } else if (type === 'mouse') {
	        touch = e;
	        if (!isMouseDown) return;
	      }
	      if (touch2 && sx2 >= 0 && sy2 >= 0) {
	        var newPinchLenght = Math.sqrt(Math.pow(Math.abs(touch.clientX - touch2.clientX), 2) + Math.pow(Math.abs(touch.clientY - touch2.clientY), 2));
	        var deltaPinch = newPinchLenght - pinchLenght;
	        pinchLenght = newPinchLenght;
	        this.panel.style.transform = this.panelMatrix.addScale(deltaPinch / 100);
	        this.scrollBar.init({
	          translatex: -this.panelMatrix.matrix3d.j,
	          translatey: -this.panelMatrix.matrix3d.k,
	          minx: this.panelMatrix.MIN_OFFSETX,
	          maxx: this.panelMatrix.MAX_OFFSETX,
	          miny: this.panelMatrix.MIN_OFFSETY,
	          maxy: this.panelMatrix.MAX_OFFSETY,
	          scale: this.panelMatrix.matrix3d.a
	        });
	      } else {
	        dx = touch.clientX - sx;
	        dy = touch.clientY - sy;
	        sx = touch.clientX;
	        sy = touch.clientY;
	        autoScroll.setDelta({
	          x: dx,
	          y: dy
	        });
	        this.move(dx, dy);
	      }
	    };
	  }
	
	  function moveend(type) {
	    return function (e) {
	      if (type === 'touch') {
	        var restTouch = e.touches[0];
	      } else if (type === 'mouse') {
	        isMouseDown = false;
	      }
	      if (restTouch) {
	        sx2 = sy2 = -1;
	        sx = restTouch.clientX;
	        sy = restTouch.clientY;
	      } else {
	        autoScroll.auto(this.move.bind(this));
	      }
	    };
	  }
	}
	
	ScrollView.prototype.move = function (deltaX, deltaY) {
	  this.panel.style.transform = this.panelMatrix.translateDelta(deltaX, deltaY);
	  this.scrollBar.scroll({
	    translatex: -this.panelMatrix.matrix3d.j,
	    translatey: -this.panelMatrix.matrix3d.k,
	    minx: this.panelMatrix.MIN_OFFSETX,
	    maxx: this.panelMatrix.MAX_OFFSETX,
	    miny: this.panelMatrix.MIN_OFFSETY,
	    maxy: this.panelMatrix.MAX_OFFSETY
	  });
	};
	
	function createScrollBar(container) {
	  var h = document.createElement('div');
	  var v = document.createElement('div');
	  h.style.cssText = '\n            position: absolute;\n            top:0px;\n            right: 1px;\n            width: 3px;\n            background: rgba(0, 0, 0, .4);\n            border-radius: 3px;\n            transition: opacity .2s ease;\n  ';
	  v.style.cssText = '\n            position: absolute;\n            bottom:1px;\n            left: 0px;\n            background: rgba(0, 0, 0, .4);\n            height: 3px;\n            border-radius: 3px;\n            transition: opacity .2s ease;\n  ';
	  container.appendChild(h);
	  container.appendChild(v);
	  return {
	    scrollBarH: h,
	    scrollBarV: v
	  };
	}
	module.exports = ScrollView;

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";
	
	function InertiaScroll(shape, viewport, realtimePositionFn, limit) {
	  this.offsetX = 0;
	  this.offsetY = 0;
	  this.startX = 0;
	  this.startY = 0;
	  this.insX = 0;
	  this.insY = 0;
	  this.interval = null;
	  this.raf = null;
	  this.shape = shape;
	  this.viewport = viewport;
	  this.realtimePositionFn = realtimePositionFn;
	  this.limit = limit || 50;
	}
	
	InertiaScroll.prototype.init = function (startPoint) {
	  this.raf = null;
	
	  clearInterval(this.interval);
	  this.interval = null;
	  this.startX = startPoint.x;
	  this.startY = startPoint.y;
	  this.insX = startPoint.x;
	  this.insY = startPoint.y;
	  this.offsetX = 0;
	  this.offsetY = 0;
	  this.track();
	};
	
	InertiaScroll.prototype.setDelta = function (delta, cb) {
	  this.offsetX += delta.x;
	  this.offsetY += delta.y;
	
	  cb && cb(this.offsetX, this.offsetY);
	};
	
	InertiaScroll.prototype.auto = function (cb) {
	  clearInterval(this.interval);
	  var distance = { x: 0, y: 0 };
	
	  if (this.offsetX === 0 && this.offsetY === 0) return;
	  distance.x = this.startX + this.offsetX - this.insX;
	  distance.y = this.startY + this.offsetY - this.insY;
	  var ms = 100;
	
	  this.decay(distance, ms, cb);
	};
	
	InertiaScroll.prototype.track = function () {
	  clearInterval(this.interval);
	  var step = 50;
	  var offset = 3;
	  var i = 0;
	  var self = this;
	  this.interval = setInterval(function () {
	    i += step;
	    if (i < step * offset) return;
	    self.insX = self.startX + self.offsetX;
	    self.insY = self.startY + self.offsetY;
	  }, step);
	};
	
	InertiaScroll.prototype.decay = function (distance, ms, callback) {
	  var self = this;
	  if (distance.x === 0 && distance.y === 0) return;
	  var vx;
	  var vy;
	  var k = 0;
	  if (distance.x === 0) {
	    vx = 0;
	    vy = distance.y / ms;
	  } else if (distance.y === 0) {
	    vy = 0;
	    vx = distance.x / ms;
	  } else {
	    vx = distance.x / ms;
	    vy = distance.y / ms;
	    k = distance.y / distance.x;
	  }
	  animate(vx, vy, k);
	  function animate(vx, vy, k) {
	    var x = 0;
	    var y = 0;
	    k = 1;
	    var targetX = 0.4 * 1000 * vx;
	    var targetY = 0.4 * 1000 * vy;
	
	    var timestant = 325;
	    var time = Date.now();
	    var lx = 0;
	    var ly = 0;
	    self.raf = window.requestAnimationFrame(update);
	    function update() {
	      var elapsed = Date.now() - time;
	      x = targetX - targetX * Math.exp(-0.8 * elapsed / timestant);
	      y = targetY - targetY * Math.exp(-0.8 * elapsed / timestant);
	      var dx = x - lx;
	      var dy = y - ly;
	      lx = x;
	      ly = y;
	      callback(dx, dy);
	      if ((Math.abs(x) + 10 < Math.abs(targetX) || Math.abs(y) + 10 < Math.abs(targetY)) && self.raf) {
	        window.requestAnimationFrame(update);
	      } else {
	        self.animateEnd && self.animateEnd();
	      }
	    }
	  }
	};
	
	module.exports = InertiaScroll;

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	
	function Matrix3D(_ref) {
	  var panelWidth = _ref.panelWidth,
	      panelHeight = _ref.panelHeight,
	      containerWidth = _ref.containerWidth,
	      containerHeight = _ref.containerHeight,
	      maxScale = _ref.maxScale;
	
	  this.matrix3d = {
	    a: 1, b: 0, c: 0, d: 0, e: 1, f: 0, g: 0, h: 0, i: 1, j: 0, k: 0, l: 0
	  };
	  this.option = {
	    maxScale: maxScale || 1
	  };
	  this.panelWidth = panelWidth;
	  this.panelHeight = panelHeight;
	  this.containerWidth = containerWidth;
	  this.containerHeight = containerHeight;
	  this.originX = this.panelWidth / 2;
	  this.originY = this.panelHeight / 2;
	  this.originOffsetX = this.originX;
	  this.originOffsetY = this.originY;
	  this.setBoundary();
	}
	Matrix3D.prototype.setBoundary = function (panelHeight, panelWidth) {
	  if (panelHeight) {
	    this.panelHeight = panelHeight;
	    this.originY = this.panelHeight / 2;
	  }
	  if (panelWidth) {
	    this.panelWidth = panelWidth;
	    this.originX = this.panelWidth / 2;
	  }
	  var maxX = this.panelWidth - this.containerWidth;
	  var maxY = this.panelHeight - this.containerHeight;
	  this.MAX_OFFSETX = (this.matrix3d.a * this.panelWidth - this.panelWidth) / 2 + maxX;
	  this.MIN_OFFSETX = -((this.matrix3d.a * this.panelWidth - this.panelWidth) / 2);
	  this.MAX_OFFSETY = (this.matrix3d.e * this.panelHeight - this.panelHeight) / 2 + maxY;
	  this.MIN_OFFSETY = -((this.matrix3d.e * this.panelHeight - this.panelHeight) / 2);
	};
	Matrix3D.prototype.translate = function (x, y) {
	  this.matrix3d.j = x;
	  this.matrix3d.k = y;
	  return this.getMatrix3d();
	};
	Matrix3D.prototype.translateDelta = function (x, y) {
	  this.matrix3d.j += x;
	  this.matrix3d.k += y;
	  if (this.matrix3d.j <= -this.MAX_OFFSETX) {
	    this.matrix3d.j = -this.MAX_OFFSETX;
	  } else if (this.matrix3d.j >= -this.MIN_OFFSETX) {
	    this.matrix3d.j = -this.MIN_OFFSETX;
	  }
	  if (this.matrix3d.k <= -this.MAX_OFFSETY) {
	    this.matrix3d.k = -this.MAX_OFFSETY;
	  } else if (this.matrix3d.k >= -this.MIN_OFFSETY) {
	    this.matrix3d.k = -this.MIN_OFFSETY;
	  }
	  return this.getMatrix3d();
	};
	Matrix3D.prototype.scale = function (n) {
	  this.matrix3d.a = n;
	  this.matrix3d.e = n;
	  return this.getMatrix3d();
	};
	Matrix3D.prototype.addScale = function (n) {
	  this.matrix3d.a += n;
	  this.matrix3d.e += n;
	  if (this.matrix3d.a <= 1) {
	    this.matrix3d.a = 1;
	    this.matrix3d.e = 1;
	    n = 0;
	  } else if (this.option.maxScale && this.matrix3d.a >= this.option.maxScale) {
	    this.matrix3d.a = this.option.maxScale;
	    this.matrix3d.e = this.option.maxScale;
	    n = 0;
	  }
	  this.setBoundary();
	  this.translateDelta(-n * (this.originOffsetX - this.originX), -n * (this.originOffsetY - this.originY));
	  return this.getMatrix3d();
	};
	Matrix3D.prototype.setOriginOffset = function (x, y) {
	  this.originOffsetX = x;
	  this.originOffsetY = y;
	};
	Matrix3D.prototype.getMatrix3d = function () {
	  return "matrix3d(" + this.matrix3d.a + ", " + this.matrix3d.b + ", " + this.matrix3d.c + ", 0,\n                   " + this.matrix3d.d + ", " + this.matrix3d.e + ", " + this.matrix3d.f + ", 0,\n                   " + this.matrix3d.g + ", " + this.matrix3d.h + ", " + this.matrix3d.i + ", 0,\n                   " + this.matrix3d.j + ", " + this.matrix3d.k + ", " + this.matrix3d.l + ", 1)";
	};
	module.exports = Matrix3D;

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';
	
	function ScrollBar(container, panel, h, v) {
	  this.h = h;
	  this.v = v;
	  this.panelHeight = panel.clientHeight;
	  this.panelWidth = panel.clientWidth;
	  this.containerHeight = container.clientHeight;
	  this.containerWidth = container.clientWidth;
	  this.init({
	    translatex: (this.panelWidth - this.containerWidth) / 2,
	    translatey: (this.panelHeight - this.containerHeight) / 2,
	    minx: 0,
	    maxx: this.panelWidth - this.containerWidth,
	    miny: 0,
	    maxy: this.panelHeight - this.containerHeight,
	    scale: 1
	  });
	  this.h.style.opacity = 1;
	  this.v.style.opacity = 1;
	}
	ScrollBar.prototype.init = function (_ref) {
	  var translatex = _ref.translatex,
	      translatey = _ref.translatey,
	      minx = _ref.minx,
	      maxx = _ref.maxx,
	      miny = _ref.miny,
	      maxy = _ref.maxy,
	      scale = _ref.scale;
	
	  this.ratioH = this.containerHeight / (this.panelHeight * scale);
	  this.ratioV = this.containerWidth / (this.panelWidth * scale);
	  this.scrollbarHeight = this.ratioH * this.containerHeight;
	  this.scrollbarWidth = this.ratioV * this.containerWidth;
	  this.h.style.height = this.scrollbarHeight + 'px';
	  this.v.style.width = this.scrollbarWidth + 'px';
	  this.scroll({ translatex: translatex, translatey: translatey, minx: minx, maxx: maxx, miny: miny, maxy: maxy });
	};
	ScrollBar.prototype.scroll = function (_ref2) {
	  var translatex = _ref2.translatex,
	      translatey = _ref2.translatey,
	      minx = _ref2.minx,
	      maxx = _ref2.maxx,
	      miny = _ref2.miny,
	      maxy = _ref2.maxy;
	
	  var left = (translatex - minx) / (maxx - minx);
	  var top = (translatey - miny) / (maxy - miny);
	  this.left = (this.containerWidth - this.scrollbarWidth) * left;
	  this.top = (this.containerHeight - this.scrollbarHeight) * top;
	  this.h.style.transform = 'translate3d(0, ' + this.top + 'px, 0)';
	  this.v.style.transform = 'translate3d(' + this.left + 'px, 0, 0)';
	};
	
	module.exports = ScrollBar;

/***/ }
/******/ ])
});
;
//# sourceMappingURL=scrollview.js.map