import InertiaScroll from './inertiaScroll'
import Matrix from './matrix'
import ScrollBar from './scrollbar'

function ScrollView (container, panel, scrollBarH, scrollBarV) {
  var containerClientHeight = container.clientHeight
  var containerClientWidth = container.clientWidth
  var startOffsetX = -(containerClientWidth / 2)
  var startOffsetY = -(containerClientHeight / 2)
  var autoScroll = new InertiaScroll(panel)
  var panelMatrix = new Matrix({
    panelWidth: panel.clientWidth,
    panelHeight: panel.clientHeight,
    containerWidth: container.clientWidth,
    containerHeight: container.clientHeight
  })
  panel.style.transformOrigin = 'center center'
  // 把面板中心放到容器中间
  panel.style.transform = panelMatrix.translate(startOffsetX, startOffsetY)
  var scrollBarContext = new ScrollBar(container, panel, scrollBarH, scrollBarV)
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
  panel.addEventListener('touchstart', function (e) {
  // 阻止默认滑动事件
    e.preventDefault()
    var touch = e.touches[0]
    var touch2 = e.touches[1]
    if (touch2) {
      sx2 = touch2.clientX
      sy2 = touch2.clientY
      pinchLenght = Math.sqrt(Math.pow(Math.abs(touch.clientX - touch2.clientX), 2) + Math.pow(Math.abs(touch.clientY - touch2.clientY), 2))
      var cx = Math.abs(touch.clientX + touch2.clientX) / 2
      var cy = Math.abs(touch.clientY + touch2.clientY) / 2
      var panelPosition = panel.getBoundingClientRect()
      var transformOriginX = cx - panelPosition.left
      var transformOriginY = cy - panelPosition.top
      var OriginOffsetX = (transformOriginX / panelPosition.width) * panel.clientWidth
      var OriginOffsetY = (transformOriginY / panelPosition.height) * panel.clientHeight
      panelMatrix.setOriginOffset(OriginOffsetX, OriginOffsetY)
    }
    sx = touch.clientX
    sy = touch.clientY
    autoScroll.init({
      x: sx,
      y: sy
    })
  })

  panel.addEventListener('touchmove', function (e) {
    var touch = e.touches[0]
    var touch2 = e.touches[1]
    if (touch2 && sx2 >= 0 && sy2 >= 0) {
      var newPinchLenght = Math.sqrt(Math.pow(Math.abs(touch.clientX - touch2.clientX), 2) + Math.pow(Math.abs(touch.clientY - touch2.clientY), 2))
      var deltaPinch = newPinchLenght - pinchLenght
      pinchLenght = newPinchLenght
      panel.style.transform = panelMatrix.addScale(deltaPinch / 100, {
        max: 4,
        min: 1
      })
      scrollBarContext.init({
        translatex: -panelMatrix.matrix3d.j,
        translatey: -panelMatrix.matrix3d.k,
        minx: panelMatrix.MIN_OFFSETX,
        maxx: panelMatrix.MAX_OFFSETX,
        miny: panelMatrix.MIN_OFFSETY,
        maxy: panelMatrix.MAX_OFFSETY,
        scale: panelMatrix.matrix3d.a
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
      move(dx, dy)
    }
  })

  panel.addEventListener('touchend', function (e) {
    var restTouch = e.touches[0]
    if (restTouch) {
      sx2 = sy2 = -1
      sx = restTouch.clientX
      sy = restTouch.clientY
    } else {
      autoScroll.auto(move)
    }
  })

  function move (deltaX, deltaY) {
    panel.style.transform = panelMatrix.translateDelta(deltaX, deltaY)
    scrollBarContext.scroll({
      translatex: -panelMatrix.matrix3d.j,
      translatey: -panelMatrix.matrix3d.k,
      minx: panelMatrix.MIN_OFFSETX,
      maxx: panelMatrix.MAX_OFFSETX,
      miny: panelMatrix.MIN_OFFSETY,
      maxy: panelMatrix.MAX_OFFSETY
    })
  }
}
module.exports = ScrollView
