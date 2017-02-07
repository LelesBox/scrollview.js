function ScrollBar (container, panel, h, v) {
  this.h = h
  this.v = v
  this.panelHeight = panel.clientHeight
  this.panelWidth = panel.clientWidth
  this.containerHeight = container.clientHeight
  this.containerWidth = container.clientWidth
  this.init({
    translatex: (this.panelWidth - this.containerWidth) / 2,
    translatey: (this.panelHeight - this.containerHeight) / 2,
    minx: 0,
    maxx: this.panelWidth - this.containerWidth,
    miny: 0,
    maxy: this.panelHeight - this.containerHeight,
    scale: 1
  })
  this.h.style.opacity = 1
  this.v.style.opacity = 1
}
ScrollBar.prototype.init = function ({ translatex, translatey, minx, maxx, miny, maxy, scale }) {
  this.ratioH = this.containerHeight / (this.panelHeight * scale)
  this.ratioV = this.containerWidth / (this.panelWidth * scale)
  this.scrollbarHeight = this.ratioH * this.containerHeight
  this.scrollbarWidth = this.ratioV * this.containerWidth
  this.h.style.height = this.scrollbarHeight + 'px'
  this.v.style.width = this.scrollbarWidth + 'px'
  this.scroll({ translatex, translatey, minx, maxx, miny, maxy })
}
ScrollBar.prototype.scroll = function ({ translatex, translatey, minx, maxx, miny, maxy }) {
  var left = (translatex - minx) / (maxx - minx)
  var top = (translatey - miny) / (maxy - miny)
  this.left = (this.containerWidth - this.scrollbarWidth) * left
  this.top = (this.containerHeight - this.scrollbarHeight) * top
  this.h.style.transform = `translate3d(0, ${this.top}px, 0)`
  this.v.style.transform = `translate3d(${this.left}px, 0, 0)`
}

module.exports = ScrollBar
