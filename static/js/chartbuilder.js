// Chartbuilder canvas drawing routines

function roundEven (real) {
  'use strict'
  var intver = Math.round(real)
  if (intver % 2 === 1) {
    var a = (intver + 1) - real
    var b = real - (intver - 1)
    if (a < b) {
      return intver + 1
    } else {
      return intver - 1
    }
  } else {
    return intver
  }
}

function Rect (xoffset, yoffset, width, height) {
  'use strict'
  var rect = {
    xoffset: xoffset,
    yoffset: yoffset,
    width: width,
    height: height,
    widthmm: width / 168,
    heightmm: height / 168
  }
  return rect
}

function Sensor (rect, widthmm, heightmm) {
  'use strict'
  var sensor = {
    xoffset: rect.xoffset,
    yoffset: rect.yoffset,
    width: rect.width,
    height: rect.height,
    widthmm: widthmm,
    heightmm: heightmm
  }
  return sensor
}

function Framing (name, encRect, aspect, scale, pixAspect, overscan) {
  'use strict'
  var testW1 = encRect.height * aspect * scale * 1 / pixAspect
  var testH1 = testW1 / (aspect / pixAspect)
  var testH2 = encRect.width / aspect * scale * pixAspect
  var testW2 = testH2 * aspect / pixAspect
  var test1Good = false
  var test2Good = false
  var width = 0
  var height = 0
  var widthmm = 0
  var heightmm = 0
  var xoffset = 0
  var yoffset = 0
  var extScale = 0

  var shrink = 1.0 / overscan
  if (testW1 <= encRect.width && testH1 <= encRect.height) {
    test1Good = true
  }
  if (testW2 <= encRect.width && testH2 <= encRect.height) {
    test2Good = true
  }
  if (test1Good) {
    if (test2Good) {
      if (testW1 > testW2) {
        width = testW1 * shrink
        height = testH1 * shrink
      } else {
        width = testW2 * shrink
        height = testH2 * shrink
      }
    } else {
      width = testW1 * shrink
      height = testH1 * shrink
    }
  } else {
    width = testW2 * shrink
    height = testH2 * shrink
  }
  widthmm = width / encRect.width * encRect.widthmm
  heightmm = height / encRect.height * encRect.heightmm

  xoffset = encRect.xoffset + (encRect.width - width) / 2.0
  yoffset = encRect.yoffset + (encRect.height - height) / 2.0

  var framing = {
    name: name,
    xoffset: xoffset,
    yoffset: yoffset,
    width: width,
    height: height,
    widthmm: widthmm,
    heightmm: heightmm,
    aspect: aspect,
    extScale: extScale,
    pixAspect: pixAspect
  }
  return framing
}

function makeFocus (canvas, sizex, sizey, points, x, y, style) {
  'use strict'
  var p = 360.0 / points
  var pointArray = Array.apply(null, { length: Math.round(points / 2) }).map(Number.call, Number)
  var context = canvas.getContext('2d')

  pointArray.forEach(function (arrayElement) {
    var point = (2 * arrayElement)
    var a1 = point * p
    var a2 = (point + 1) * p
    var r1 = a1 * Math.PI / 180
    var r2 = a2 * Math.PI / 180
    var x1 = (Math.cos(r1) * sizex) + x
    var y1 = (Math.sin(r1) * sizey) + y
    var x2 = (Math.cos(r2) * sizex) + x
    var y2 = (Math.sin(r2) * sizey) + y

    context.beginPath()
    context.moveTo(x, y)
    context.lineTo(x1, y1)
    context.lineTo(x2, y2)
    context.closePath()
    if (style === 0) {
      context.fillStyle = 'white'
    } else {
      context.fillStyle = 'black'
    }
    context.fill()
  })
}

function makeArrow (canvas, size, azimuth, x, y, style) {
  'use strict'
  var context = canvas.getContext('2d')
  context.beginPath()
  context.moveTo(x, y)
  if (azimuth === 0) {
    context.lineTo(x - size / 4, y - size)
    context.lineTo(x + size / 4, y - size)
  } else if (azimuth === 1) {
    context.lineTo(x + size, y - size / 4)
    context.lineTo(x + size, y + size / 4)
  } else if (azimuth === 2) {
    context.lineTo(x + size / 4, y + size)
    context.lineTo(x - size / 4, y + size)
  } else {
    context.lineTo(x - size, y + size / 4)
    context.lineTo(x - size, y - size / 4)
  }
  context.closePath()
  if (style === 0) {
    context.fillStyle = '#950000'
  } else {
    context.fillStyle = '#000000'
  }
  context.fill()
}

function drawText (context, tstr, left, bottom, color, fontsize, font, align, vertical) {
  if (vertical === true) {
    context.save()
  }
  context.font = fontsize + 'px ' + font
  context.fillStyle = color
  if (vertical === true) {
    context.rotate(270 * Math.PI / 180)
  }
  context.textAlign = align
  context.fillText(tstr, left, bottom)
  if (vertical === true) {
    context.restore()
  }
}
function drawRect (context, xoff, yoff, width, height, color, solid) {
  context.fillStyle = color
  if (solid === true) {
    context.fillRect(xoff, yoff, width, height)
    context.fill()
  } else {
    context.strokeStyle = color
    context.strokeRect(xoff, yoff, width, height)
  }
}
function drawGrid (context, canvas, drawingScale) {
  // draw sensor grid
  var centerx = canvas.width / 2
  var centery = canvas.height / 2
  context.fillStyle = '#222222'
  context.lineWidth = 0.5

  var offsetLimit = 4096
  var offsetDiv = 1024
  var offsetLength = Math.round((offsetLimit * 2) / offsetDiv)
  var offsetArray = Array.apply(null, { length: offsetLength }).map(Number.call, Number)

  offsetArray.forEach(function (arrayElement) {
    var off = ((offsetDiv * arrayElement) - offsetLimit) * drawingScale
    context.beginPath()
    context.moveTo(centerx + off, 0)
    context.lineTo(centerx + off, canvas.height)
    context.closePath()
    context.stroke()
    context.beginPath()
    context.moveTo(0, centery + off)
    context.lineTo(canvas.width, centery + off)
    context.closePath()
    context.stroke()
  })
}
function framingLabelString (aspect, name, width, height, widthmm, heightmm) {
  return aspect.toFixed(3) + ' ' + name + ' (' + roundEven(width) +
            'x' + roundEven(height) + ') [' + widthmm.toFixed(1) + 'mm x' +
            heightmm.toFixed(1) + 'mm]'
}
function computeRects (params) {
  'use strict'
  var width = roundEven(params.widthpx * params.scale * 1 / params.chart_pixel_aspect)
  var height = roundEven(params.heightpx * params.scale)
  var sensorPixRect = new Rect(0, 0, width, height)

  var sensor = new Sensor(sensorPixRect, params.widthmm, params.heightmm)
  var vendorDel = new Framing('Vendor Delivery', sensor, params.vendor_aspect, 1,
    params.lens_pixel_aspect * params.chart_pixel_aspect, params.sensor_overscan)
  var imax = new Framing(params.secondary_name, vendorDel, params.secondary_aspect,
    1 / params.overscan, params.lens_pixel_aspect * params.chart_pixel_aspect, 1.0)
  var hero = new Framing('Hero', imax, params.primary_aspect, 1,
    params.lens_pixel_aspect * params.chart_pixel_aspect, 1.0)

  var rects = {
    sensor: sensor,
    vendorDel: vendorDel,
    imax: imax,
    hero: hero
  }
  return rects
}

function drawImage (canvas, params) {
  'use strict'
  var width = roundEven(params.widthpx * params.scale * 1 / params.chart_pixel_aspect)
  var height = roundEven(params.heightpx * params.scale)
  var sensorPixRect = new Rect(0, 0, width, height)

  var sensor = new Sensor(sensorPixRect, params.widthmm, params.heightmm)
  var vendorDel = new Framing('Vendor Delivery', sensor, params.vendor_aspect, 1,
    params.lens_pixel_aspect * params.chart_pixel_aspect, params.sensor_overscan)
  var imax = new Framing(params.secondary_name, vendorDel, params.secondary_aspect,
    1 / params.overscan, params.lens_pixel_aspect * params.chart_pixel_aspect, 1.0)

  var hero = new Framing('Hero', imax, params.primary_aspect, 1,
    params.lens_pixel_aspect * params.chart_pixel_aspect, 1.0)

  // var fontsize = params.fontsize * hero.width/6048.0;
  var context = canvas.getContext('2d')
  var drawingScale = parseFloat(canvas.width) / parseFloat(sensor.width)
  canvas.height = parseInt(Math.round(sensor.height * drawingScale))

  if (params.style === 0) {
    // draw sensor rect
    drawRect(context, 0, 0, canvas.width, canvas.height, '#888888', true)

    // draw vendor rect
    drawRect(context, vendorDel.xoffset * drawingScale, vendorDel.yoffset * drawingScale,
      vendorDel.width * drawingScale, vendorDel.height * drawingScale, '#666666', true)

    // draw sensor grid
    drawGrid(context, canvas, drawingScale)

    // draw imax rect
    drawRect(context, imax.xoffset * drawingScale, imax.yoffset * drawingScale,
      imax.width * drawingScale, imax.height * drawingScale, '#950000', true)

    // draw hero rect
    drawRect(context, hero.xoffset * drawingScale, hero.yoffset * drawingScale,
      hero.width * drawingScale, hero.height * drawingScale, '#FF0000', true)
  } else if (params.style === 1) {
    // white background for drawing style
    drawRect(context, 0, 0, canvas.width, canvas.height, '#FFFFFF', true)

    // full sensor outline
    drawRect(context, 0, 0, canvas.width, canvas.height, '#000000', false)

    // draw imax rect
    drawRect(context, imax.xoffset * drawingScale, imax.yoffset * drawingScale,
      imax.width * drawingScale, imax.height * drawingScale, '#000000', false)

    // draw hero rect
    drawRect(context, hero.xoffset * drawingScale, hero.yoffset * drawingScale,
      hero.width * drawingScale, hero.height * drawingScale, '#000000', false)
  } else {
    // black background for overlay style
    drawRect(context, 0, 0, canvas.width, canvas.height, '#000000', true)

    // draw green vendor delivery rect
    drawRect(context, vendorDel.xoffset * drawingScale, vendorDel.yoffset * drawingScale,
      vendorDel.width * drawingScale, vendorDel.height * drawingScale, '#00FF00', false)

    // draw imax rect
    drawRect(context, imax.xoffset * drawingScale, imax.yoffset * drawingScale,
      imax.width * drawingScale, imax.height * drawingScale, '#FFFFFF', false)

    // draw hero rect
    drawRect(context, hero.xoffset * drawingScale, hero.yoffset * drawingScale,
      hero.width * drawingScale, hero.height * drawingScale, '#FFFFFF', false)
  }
  // left edge arrows
  makeArrow(canvas, canvas.width / 48, 1, hero.xoffset * drawingScale,
    hero.yoffset * drawingScale + hero.height * drawingScale / 4, params.style)
  makeArrow(canvas, canvas.width / 48, 1, hero.xoffset * drawingScale,
    hero.yoffset * drawingScale + hero.height * drawingScale / 4 * 3, params.style)

  // right edge arrows
  makeArrow(canvas, canvas.width / 48, 3, hero.xoffset * drawingScale + hero.width * drawingScale,
    hero.yoffset * drawingScale + hero.height * drawingScale / 4, params.style)
  makeArrow(canvas, canvas.width / 48, 3, hero.xoffset * drawingScale + hero.width * drawingScale,
    hero.yoffset * drawingScale + hero.height * drawingScale / 4 * 3, params.style)

  // top arrows
  makeArrow(canvas, canvas.width / 48, 2, hero.xoffset * drawingScale + hero.width * drawingScale / 6,
    hero.yoffset * drawingScale, params.style)
  makeArrow(canvas, canvas.width / 48, 2, hero.xoffset * drawingScale + hero.width * drawingScale / 6 * 5,
    hero.yoffset * drawingScale, params.style)

  // bottom arrow
  makeArrow(canvas, canvas.width / 48, 0, hero.xoffset * drawingScale + hero.width * drawingScale / 6 * 5,
    hero.yoffset * drawingScale + hero.height * drawingScale, params.style)

  // focus dots
  if (params.style < 2) {
    // two big dots
    var dotxscale = hero.height * 0.25 * drawingScale * 1 / params.chart_pixel_aspect * 1 / params.lens_pixel_aspect * params.dotsize
    var dotyscale = hero.height * 0.25 * drawingScale * params.dotsize
    var horiz1 = hero.xoffset * drawingScale + hero.width * drawingScale * 0.25
    var horiz2 = (hero.xoffset * drawingScale + hero.width * drawingScale) - (hero.width * drawingScale * 0.25)
    var verti1 = hero.yoffset * drawingScale + hero.height * drawingScale / 2
    makeFocus(canvas, dotxscale, dotyscale, 44, horiz1, verti1, params.style)
    makeFocus(canvas, dotxscale, dotyscale, 44, horiz2, verti1, params.style)

    // create 4 baby dots
    dotxscale = (hero.height * 0.075 * drawingScale * 1 / params.chart_pixel_aspect * 1 / params.lens_pixel_aspect * params.dotsize)
    dotyscale = (hero.height * 0.075 * drawingScale * params.dotsize)
    horiz1 = (hero.xoffset * drawingScale + hero.width * drawingScale * 0.0825)
    horiz2 = (hero.xoffset * drawingScale + hero.width * drawingScale) - (hero.width * drawingScale * 0.0825)
    verti1 = (hero.yoffset * drawingScale + hero.height * drawingScale * 0.2)
    var verti2 = (hero.yoffset * drawingScale + hero.height * drawingScale) - (hero.height * drawingScale * 0.2)
    makeFocus(canvas, dotxscale, dotyscale, 44, horiz1, verti1, params.style)
    makeFocus(canvas, dotxscale, dotyscale, 44, horiz2, verti1, params.style)
    makeFocus(canvas, dotxscale, dotyscale, 44, horiz1, verti2, params.style)
    makeFocus(canvas, dotxscale, dotyscale, 44, horiz2, verti2, params.style)
  }

  // font sizes
  var f12 = (params.fontsize / 8) | 0
  var f14 = (params.fontsize / 7) | 0
  var f16 = (params.fontsize / 6) | 0
  var f21 = (params.fontsize / 5) | 0
  var f24 = (params.fontsize / 4) | 0

  // temp until
  var label = ''

  if (params.style === 0) {
    // vendor delivery label
    drawText(context, framingLabelString(vendorDel.aspect, vendorDel.name, vendorDel.width,
      vendorDel.height, vendorDel.widthmm, vendorDel.heightmm),
    -vendorDel.yoffset * drawingScale - vendorDel.height * drawingScale + 10,
    vendorDel.xoffset * drawingScale + 16, '#000000', f12, 'DroidSans', 'left', true)
  }
  if (params.style < 2) {
    // imax text. don't bother with secondary text, just check to see if there's a
    // taller imax aspect
    if (imax.height > hero.height) {
      drawText(context, framingLabelString(imax.aspect, imax.name, imax.width,
        imax.height, imax.widthmm, imax.heightmm), imax.xoffset * drawingScale + 16,
      imax.yoffset * drawingScale + imax.height * drawingScale - 5, '#000000', f14, 'DroidSans', 'left', false)
    } else if (imax.width > hero.width) {
      drawText(context, framingLabelString(imax.aspect, imax.name, imax.width,
        imax.height, imax.widthmm, imax.heightmm), -imax.yoffset * drawingScale -imax.height * drawingScale + 16,
      imax.xoffset * drawingScale + 16, '#000000', f14, 'DroidSans', 'left', true)
    } else {
        // do nothing if exact same size
    }
    // hero text
    drawText(context, framingLabelString(hero.aspect, hero.name, hero.width,
      hero.height, hero.widthmm, hero.heightmm), hero.xoffset * drawingScale + 16,
    hero.yoffset * drawingScale + hero.height * drawingScale - 5, '#000000', f16, 'DroidSans', 'left', false)

    // show name
    if (params.show !== 'None') {
      var color = '#950000'
      if (params.style === 1) {
        color = '#000000'
      }
      drawText(context, params.show, canvas.width / 2,
        hero.yoffset * drawingScale + hero.height * drawingScale * 0.18, color, f24,
        'DroidSans', 'center', false)
    }
    // long name of camera process
    drawText(context, params.process_name.value, canvas.width / 2,
      hero.yoffset * drawingScale + hero.height * drawingScale * 0.25, '#000000', f21,
      'DroidSans', 'center', false)

    // sensor width and height
    label = roundEven(sensor.width) + ' x ' + roundEven(sensor.height)
    drawText(context, label, canvas.width / 2, hero.yoffset * drawingScale + hero.height * drawingScale * 0.32,
      '#000000', f16, 'DroidSans', 'center', false)

    // sensor size in mm
    label = sensor.widthmm.toFixed(1) + 'mm x ' + sensor.heightmm.toFixed(1) + 'mm'
    drawText(context, label, canvas.width / 2, hero.yoffset * drawingScale + hero.height * drawingScale * 0.36,
      '#000000', f16, 'DroidSans', 'center', false)
  } else {
    // taller imax aspect
    if (imax.height > hero.height) {
      drawText(context, framingLabelString(imax.aspect, imax.name, imax.width,
        imax.height, imax.widthmm, imax.heightmm), imax.xoffset * drawingScale + 16,
      imax.yoffset * drawingScale + imax.height * drawingScale - 5, '#FFFFFF', f14, 'DroidSans', 'left', false)
    } else if (imax.width > hero.width) {
      drawText(context, framingLabelString(imax.aspect, imax.name, imax.width,
        imax.height, imax.widthmm, imax.heightmm), -imax.yoffset * drawingScale -imax.height * drawingScale + 16,
      imax.xoffset * drawingScale + 16, '#FFFFFF', f14, 'DroidSans', 'left', true)
    } else {
        // no label if hero == imax
    }
    // hero text
    drawText(context, framingLabelString(hero.aspect, hero.name, hero.width,
      hero.height, hero.widthmm, hero.heightmm), hero.xoffset * drawingScale + 16,
    hero.yoffset * drawingScale + hero.height * drawingScale - 5, '#FFFFFF', f16, 'DroidSans', 'left', false)
  }
}
