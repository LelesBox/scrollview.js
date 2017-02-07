import scrollView from '../scrollview'

var container = document.querySelector('#container')

/* eslint-disable */
var scrollview = new scrollView(container, {
  maxScale: 5
})

window.scrollview = scrollview
window.expand = expand
function expand (x, y) {
  var panelHW = elmHW(scrollview.panel)
  scrollview.panel.style.height = panelHW.height + y + 'px'
  scrollview.panel.style.width = panelHW.width + x + 'px'
  scrollview.panelMatrix.setBoundary(panelHW.height + y, panelHW.width + x)
  // 修复偏移，保持视窗口
  scrollview.panel.style.transform = scrollview.panelMatrix.translateDelta(-x / 2, -y / 2)
  scrollview.scrollBar.init({
    translatex: -scrollview.panelMatrix.matrix3d.j,
    translatey: -scrollview.panelMatrix.matrix3d.k,
    minx: scrollview.panelMatrix.MIN_OFFSETX,
    maxx: scrollview.panelMatrix.MAX_OFFSETX,
    miny: scrollview.panelMatrix.MIN_OFFSETY,
    maxy: scrollview.panelMatrix.MAX_OFFSETY,
    scale: scrollview.panelMatrix.matrix3d.a
  })
}

function elmHW (el) {
  return {
    height: Number(window.getComputedStyle(el).height.replace('px', '')),
    width: Number(window.getComputedStyle(el).width.replace('px', ''))
  }
}