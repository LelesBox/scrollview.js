/**
 * 面板矩阵变换管理
 * @param {any} { maxX, maxY }
 */
function Matrix3D ({ panelWidth, panelHeight, containerWidth, containerHeight }) {
  this.matrix3d = {
    a: 1, b: 0, c: 0, d: 0, e: 1, f: 0, g: 0, h: 0, i: 1, j: 0, k: 0, l: 0
  }
  this.panelWidth = panelWidth
  this.panelHeight = panelHeight
  this.containerWidth = containerWidth
  this.containerHeight = containerHeight
  this.maxX = panelWidth - containerWidth
  this.maxY = panelHeight - containerHeight
  this.originX = panelWidth / 2
  this.originY = panelHeight / 2
  this.originOffsetX = this.originX
  this.originOffsetY = this.originY
  this.MAX_OFFSETX = ((this.matrix3d.a * this.panelWidth - this.panelWidth) / 2 + this.maxX)
  this.MIN_OFFSETX = -((this.matrix3d.a * this.panelWidth - this.panelWidth) / 2)
  this.MAX_OFFSETY = ((this.matrix3d.e * this.panelHeight - this.panelHeight) / 2 + this.maxY)
  this.MIN_OFFSETY = -((this.matrix3d.e * this.panelHeight - this.panelHeight) / 2)
}
Matrix3D.prototype.translate = function (x, y) {
  this.matrix3d.j = x
  this.matrix3d.k = y
  return this.getMatrix3d()
}
Matrix3D.prototype.translateDelta = function (x, y) {
  this.matrix3d.j += x
  this.matrix3d.k += y
  if (this.matrix3d.j <= -this.MAX_OFFSETX) {
    this.matrix3d.j = -this.MAX_OFFSETX
  } else if (this.matrix3d.j >= -this.MIN_OFFSETX) {
    this.matrix3d.j = -this.MIN_OFFSETX
  }
  if (this.matrix3d.k <= -this.MAX_OFFSETY) {
    this.matrix3d.k = -this.MAX_OFFSETY
  } else if (this.matrix3d.k >= -this.MIN_OFFSETY) {
    this.matrix3d.k = -this.MIN_OFFSETY
  }
  return this.getMatrix3d()
}
Matrix3D.prototype.scale = function (n) {
  this.matrix3d.a = n
  this.matrix3d.e = n
  return this.getMatrix3d()
}
Matrix3D.prototype.addScale = function (n, opt = {}) {
  this.matrix3d.a += n
  this.matrix3d.e += n
  if (opt.min && this.matrix3d.a <= opt.min) {
    this.matrix3d.a = opt.min
    this.matrix3d.e = opt.min
    n = 0
  } else if (opt.max && this.matrix3d.a >= opt.max) {
    this.matrix3d.a = opt.max
    this.matrix3d.e = opt.max
    n = 0
  }
  this.MAX_OFFSETX = ((this.matrix3d.a * this.panelWidth - this.panelWidth) / 2 + this.maxX)
  this.MIN_OFFSETX = -((this.matrix3d.a * this.panelWidth - this.panelWidth) / 2)
  this.MAX_OFFSETY = ((this.matrix3d.e * this.panelHeight - this.panelHeight) / 2 + this.maxY)
  this.MIN_OFFSETY = -((this.matrix3d.e * this.panelHeight - this.panelHeight) / 2)
  this.translateDelta((-n * (this.originOffsetX - this.originX)), (-n * (this.originOffsetY - this.originY)))
  return this.getMatrix3d()
}
Matrix3D.prototype.setOriginOffset = function (x, y) {
  this.originOffsetX = x
  this.originOffsetY = y
}
Matrix3D.prototype.getMatrix3d = function () {
  return `matrix3d(${this.matrix3d.a}, ${this.matrix3d.b}, ${this.matrix3d.c}, 0,
                   ${this.matrix3d.d}, ${this.matrix3d.e}, ${this.matrix3d.f}, 0,
                   ${this.matrix3d.g}, ${this.matrix3d.h}, ${this.matrix3d.i}, 0,
                   ${this.matrix3d.j}, ${this.matrix3d.k}, ${this.matrix3d.l}, 1)`
}
module.exports = Matrix3D
