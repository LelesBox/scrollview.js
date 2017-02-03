import scrollView from '../scrollview'

var container = document.querySelector('#container')
var panel = document.querySelector('#panel')
var scrollBarH = document.querySelector('#scroll-h')
var scrollBarV = document.querySelector('#scroll-v')

/* eslint-disable */
new scrollView(container, panel, scrollBarH, scrollBarV)
