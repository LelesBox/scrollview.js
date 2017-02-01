/** 惯性滚动函数
 * @param {any} shape 滚动的元素
 * @param {any} viewport 滚动元素所在的视口，包含 maxX,maxY,minX, minY
 * @param {any} realtimePositionFn 实时获取元素位置的函数，返回 {x, y, width, height}
 * @param {any} limit 与边界的保留像素
 */
function InertiaScroll (shape, viewport, realtimePositionFn, limit) {
  this.offsetX = 0
  this.offsetY = 0
  this.startX = 0
  this.startY = 0
  this.insX = 0
  this.insY = 0
  this.interval = null
  this.raf = null
  this.shape = shape
  this.viewport = viewport
  this.realtimePositionFn = realtimePositionFn
  this.limit = limit || 50
}

// 手指刚触碰的时候触发
InertiaScroll.prototype.init = function (startPoint) {
  // 初始化 raf
  this.raf = null
  // 初始化 interval
  clearInterval(this.interval)
  this.interval = null
  this.startX = startPoint.x
  this.startY = startPoint.y
  this.insX = startPoint.x
  this.insY = startPoint.y
  this.offsetX = 0
  this.offsetY = 0
  this.track()
}

// 手移动的时候触发
InertiaScroll.prototype.setDelta = function (delta, cb) {
  // if (!this.interval) this.track()
  this.offsetX += delta.x
  this.offsetY += delta.y
  //   this.boundary && this.boundary()
  cb && cb(this.offsetX, this.offsetY)
  // console.log(delta)
}

// 抬手的时候触发
InertiaScroll.prototype.auto = function (cb) {
  // 停止track
  clearInterval(this.interval)
  var distance = { x: 0, y: 0 }
  // 最后移动的点startX + offsetX 和 上一间隔移动到的点 insX的距离，除以 预定时间
  // 这里取100ms 得到脱手时的速度，这个速度是有方向的
  if (this.offsetX === 0 && this.offsetY === 0) return
  distance.x = (this.startX + this.offsetX) - this.insX
  distance.y = (this.startY + this.offsetY) - this.insY
  var ms = 100
  // move(distance.x, distance.y, shape)
  this.decay(distance, ms, cb)
}

// 定时获取路径移动轨迹和速度
InertiaScroll.prototype.track = function () {
  clearInterval(this.interval)
  var step = 50
  var offset = 3
  var i = 0
  var self = this
  this.interval = setInterval(function () {
    i += step
    if (i < step * offset) return
    self.insX = self.startX + self.offsetX
    self.insY = self.startY + self.offsetY
  }, step)
}

InertiaScroll.prototype.decay = function (distance, ms, callback) {
  var self = this
  if (distance.x === 0 && distance.y === 0) return
  var vx
  var vy
  var k = 0
  if (distance.x === 0) {
    vx = 0
    vy = distance.y / ms
  } else if (distance.y === 0) {
    vy = 0
    vx = distance.x / ms
  } else {
    vx = distance.x / ms
    vy = distance.y / ms
    k = distance.y / distance.x
  }
  animate(vx, vy, k)
  function animate (vx, vy, k) {
    var x = 0
    var y = 0
    k = 1
    var targetX = 0.4 * 1000 * vx
    var targetY = 0.4 * 1000 * vy
    // 边界检查
    var timestant = 325
    var time = Date.now()
    var lx = 0
    var ly = 0
    self.raf = window.requestAnimationFrame(update)
    function update () {
      var elapsed = Date.now() - time
      x = targetX - targetX * Math.exp(-0.8 * elapsed / timestant)
      y = targetY - targetY * Math.exp(-0.8 * elapsed / timestant)
      var dx = x - lx
      var dy = y - ly
      lx = x
      ly = y
      callback(dx, dy)
      if ((Math.abs(x) + 10 < Math.abs(targetX) || Math.abs(y) + 10 < Math.abs(targetY)) && self.raf) {
        window.requestAnimationFrame(update)
      } else {
        self.animateEnd && self.animateEnd()
      }
    }
  }
}

module.exports = InertiaScroll
