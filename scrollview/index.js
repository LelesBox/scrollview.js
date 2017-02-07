import InertiaScroll from './inertiaScroll'
import Matrix from './matrix'
import ScrollBar from './scrollbar'

function ScrollView (container, opt) {
  this.container = container
  this.panel = container.children[0]
  if (!this.panel) return
  this.opt = opt
  // 修复容器属性
  container.style.overflow = 'hidden'
  container.style.position = 'relative'
  // 获取属性配置
  let { scrollBarH, scrollBarV } = createScrollBar(container)
  var containerClientHeight = container.clientHeight
  var containerClientWidth = container.clientWidth
  var startOffsetX = -(containerClientWidth / 2)
  var startOffsetY = -(containerClientHeight / 2)
  var autoScroll = new InertiaScroll(this.panel)
  this.panelMatrix = new Matrix({
    panelWidth: this.panel.clientWidth,
    panelHeight: this.panel.clientHeight,
    containerWidth: container.clientWidth,
    containerHeight: container.clientHeight,
    maxScale: this.opt.maxScale || 4
  })
  this.panel.style.transformOrigin = 'center center'
  // 把面板中心放到容器中间
  this.panel.style.transform = this.panelMatrix.translate(startOffsetX, startOffsetY)
  this.scrollBar = new ScrollBar(container, this.panel, scrollBarH, scrollBarV)
  // 单指当前点击位置x
  var sx = 0
// 单指当前点击位置y
  var sy = 0
// 单指x轴偏移量
  var dx = 0
// 单指y轴偏移量
  var dy = 0
// 第二个手指的数据,当数值小于0时没有意义
  var sx2 = -1
  var sy2 = -1
// 双指初始长度
  var pinchLenght = 0
  this.panel.addEventListener('touchstart', movestart('touch').bind(this))
  this.panel.addEventListener('touchmove', moving('touch').bind(this))
  this.panel.addEventListener('touchend', moveend('touch').bind(this))
  // 支持鼠标拖动
  var isMouseDown = false
  this.panel.addEventListener('mousedown', movestart('mouse').bind(this))
  this.panel.addEventListener('mousemove', moving('mouse').bind(this))
  this.panel.addEventListener('mouseup', moveend('mouse').bind(this))
  this.panel.addEventListener('mousewheel', (e) => {
    e.preventDefault()
    this.move(-e.deltaX, -e.deltaY)
  })
  function movestart (type) {
    return function (e) {
    // 阻止默认滑动事件
      e.preventDefault()
      var touch, touch2
      if (type === 'touch') {
        touch = e.touches[0]
        touch2 = e.touches[1]
      } else if (type === 'mouse') {
        touch = e
        isMouseDown = true
      }
      if (touch2) {
        sx2 = touch2.clientX
        sy2 = touch2.clientY
        pinchLenght = Math.sqrt(Math.pow(Math.abs(touch.clientX - touch2.clientX), 2) + Math.pow(Math.abs(touch.clientY - touch2.clientY), 2))
        var cx = Math.abs(touch.clientX + touch2.clientX) / 2
        var cy = Math.abs(touch.clientY + touch2.clientY) / 2
        var panelPosition = this.panel.getBoundingClientRect()
        var transformOriginX = cx - panelPosition.left
        var transformOriginY = cy - panelPosition.top
        var OriginOffsetX = (transformOriginX / panelPosition.width) * this.panel.clientWidth
        var OriginOffsetY = (transformOriginY / panelPosition.height) * this.panel.clientHeight
        this.panelMatrix.setOriginOffset(OriginOffsetX, OriginOffsetY)
      }
      if (touch) {
        sx = touch.clientX
        sy = touch.clientY
        autoScroll.init({
          x: sx,
          y: sy
        })
      }
    }
  }

  function moving (type) {
    return function (e) {
      var touch, touch2
      if (type === 'touch') {
        touch = e.touches[0]
        touch2 = e.touches[1]
      } else if (type === 'mouse') {
        touch = e
        if (!isMouseDown) return
      }
      if (touch2 && sx2 >= 0 && sy2 >= 0) {
        var newPinchLenght = Math.sqrt(Math.pow(Math.abs(touch.clientX - touch2.clientX), 2) + Math.pow(Math.abs(touch.clientY - touch2.clientY), 2))
        var deltaPinch = newPinchLenght - pinchLenght
        pinchLenght = newPinchLenght
        this.panel.style.transform = this.panelMatrix.addScale(deltaPinch / 100)
        this.scrollBar.init({
          translatex: -this.panelMatrix.matrix3d.j,
          translatey: -this.panelMatrix.matrix3d.k,
          minx: this.panelMatrix.MIN_OFFSETX,
          maxx: this.panelMatrix.MAX_OFFSETX,
          miny: this.panelMatrix.MIN_OFFSETY,
          maxy: this.panelMatrix.MAX_OFFSETY,
          scale: this.panelMatrix.matrix3d.a
        })
      } else {
        dx = touch.clientX - sx
        dy = touch.clientY - sy
        sx = touch.clientX
        sy = touch.clientY
        autoScroll.setDelta({
          x: dx,
          y: dy
        })
        this.move(dx, dy)
      }
    }
  }

  function moveend (type) {
    return function (e) {
      if (type === 'touch') {
        var restTouch = e.touches[0]
      } else if (type === 'mouse') {
        isMouseDown = false
      }
      if (restTouch) {
        sx2 = sy2 = -1
        sx = restTouch.clientX
        sy = restTouch.clientY
      } else {
        autoScroll.auto(this.move.bind(this))
      }
    }
  }
}

ScrollView.prototype.move = function (deltaX, deltaY) {
  this.panel.style.transform = this.panelMatrix.translateDelta(deltaX, deltaY)
  this.scrollBar.scroll({
    translatex: -this.panelMatrix.matrix3d.j,
    translatey: -this.panelMatrix.matrix3d.k,
    minx: this.panelMatrix.MIN_OFFSETX,
    maxx: this.panelMatrix.MAX_OFFSETX,
    miny: this.panelMatrix.MIN_OFFSETY,
    maxy: this.panelMatrix.MAX_OFFSETY
  })
}

function createScrollBar (container) {
  var h = document.createElement('div')
  var v = document.createElement('div')
  h.style.cssText = `
            position: absolute;
            top:0px;
            right: 1px;
            width: 3px;
            background: rgba(0, 0, 0, .4);
            border-radius: 3px;
            transition: opacity .2s ease;
  `
  v.style.cssText = `
            position: absolute;
            bottom:1px;
            left: 0px;
            background: rgba(0, 0, 0, .4);
            height: 3px;
            border-radius: 3px;
            transition: opacity .2s ease;
  `
  container.appendChild(h)
  container.appendChild(v)
  return {
    scrollBarH: h,
    scrollBarV: v
  }
}
module.exports = ScrollView
