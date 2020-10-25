class Point {
  constructor (x, y) {
    this.x = x
    this.y = y
  }

  rotate (angle) {
    var newx, newy
    newx = Math.cos(angle) * this.x - Math.sin(angle) * this.y
    newy = Math.sin(angle) * this.x + Math.cos(angle) * this.y
    this.x = newx
    this.y = newy
    return this
  }

  scale (sf) {
    this.x = this.x * sf
    this.y = this.y * sf
    return this
  }

  translate (x, y) {
    this.x += x
    this.y += y
    return this
  }

  clone () {
    return new Point(this.x, this.y)
  }

  equals (that) {
    return (this.x === that.x && this.y === that.y)
  }

  moveToward (that, d) {
    // moves [d] in the direction of [that::Point]
    const uvec = Point.unitVector(this, that)
    this.translate(uvec.x * d, uvec.y * d)
    return this
  }

  static fromPolar (r, theta) {
    return new Point(
      Math.cos(theta) * r,
      Math.sin(theta) * r
    )
  }

  static fromPolarDeg (r, theta) {
    theta = theta * Math.PI / 180
    return Point.fromPolar(r, theta)
  }

  static mean (...points) {
    const sumx = points.map(p => p.x).reduce((x, y) => x + y)
    const sumy = points.map(p => p.y).reduce((x, y) => x + y)
    const n = points.length

    return new Point(sumx / n, sumy / n)
  }

  static min (points) {
    const minx = points.reduce((x, p) => Math.min(x, p.x), Infinity)
    const miny = points.reduce((y, p) => Math.min(y, p.y), Infinity)
    return new Point(minx, miny)
  }

  static max (points) {
    const maxx = points.reduce((x, p) => Math.max(x, p.x), -Infinity)
    const maxy = points.reduce((y, p) => Math.max(y, p.y), -Infinity)
    return new Point(maxx, maxy)
  }

  static center (points) {
    const minx = points.reduce((x, p) => Math.min(x, p.x), Infinity)
    const miny = points.reduce((y, p) => Math.min(y, p.y), Infinity)
    const maxx = points.reduce((x, p) => Math.max(x, p.x), -Infinity)
    const maxy = points.reduce((y, p) => Math.max(y, p.y), -Infinity)
    return new Point((maxx + minx) / 2, (maxy + miny) / 2)
  }

  static unitVector (p1, p2) {
    // returns a unit vector in the direction of p1 to p2
    // in the form {x:..., y:...}
    const vecx = p2.x - p1.x
    const vecy = p2.y - p1.y
    const length = Math.hypot(vecx, vecy)
    return { x: vecx / length, y: vecy / length }
  }

  static distance (p1, p2) {
    return Math.hypot(p1.x - p2.x, p1.y - p2.y)
  }

  static repel (p1, p2, trigger, distance) {
    // When p1 and p2 are less than [trigger] apart, they are
    // moved so that they are [distance] apart
    const d = Math.hypot(p1.x - p2.x, p1.y - p2.y)
    if (d >= trigger) return false

    const r = (distance - d) / 2 // distance they need moving
    p1.moveToward(p2, -r)
    p2.moveToward(p1, -r)
    return true
  }
}

document.addEventListener('DOMContentLoaded', generate)
document.getElementById('header').addEventListener('change',generate)
window.addEventListener('resize', generate)

// hacky enabling/disabling of subdivision
document.getElementById('subdivide').addEventListener('change', e=> {
  const checkbox = document.getElementById('subdivide')
  if (subdivide.checked) {
    document.querySelectorAll('.subdiv-label').forEach( elem => {
      elem.classList.remove('disabled')
    })
    document.getElementById('subdividen').disabled = false
    document.getElementById('alternate').disabled = false
  } else {
    document.querySelectorAll('.subdiv-label').forEach( elem => {
      elem.classList.add('disabled')
    })
    document.getElementById('subdividen').disabled = true
    document.getElementById('alternate').disabled = true
  }
})


// a fix for negative mod %
Number.prototype.mod = function(n) {
  return ((this%n)+n)%n;
}

const CANVAS_PADDING = 30

// get canvas
const canvas = document.getElementById("pursuit")
const ctx = canvas.getContext("2d")

function generateWithPoints(points,jumpSize,clockwise) {
  let currentPoints = points
  const n = points.length

  let iterations = 0
  while( Point.distance(currentPoints[0],currentPoints[1]) > 1.1*jumpSize) {
    // set up color:
    const color = 'rgba(15,25,100,0)'

    // draw polygon
    
    /* Works for star polygons, but not for filling
    ctx.beginPath()
    for (let i = 0; i < n; i++) {
      const p = currentPoints[i]
      const next = currentPoints[(i + clockwise).mod(n)]
      ctx.moveTo(p.x, p.y)
      ctx.lineTo(next.x, next.y)
    }
    ctx.fillStyle = color
    ctx.stroke()
    ctx.closePath()
    */
    
    /* Breaks on star polygons but allows filling */
    // 0 -> (n-1) -> ... -> 1 for negative clockwise
    ctx.beginPath()
    ctx.moveTo(currentPoints[0].x,currentPoints[0].y)
    let j = 0
    for (let i = 0; i < n; i++) {
      const p = currentPoints[j]
      const next = currentPoints[(j + clockwise + n)%n]
      ctx.lineTo(next.x, next.y)
      j = (j + clockwise + n)%n
    }
    ctx.fillStyle = color
    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    // update polygon
    // create deep clone of current points - not necessary really - only need first point cloned
    const lastPoints = currentPoints.map(p=>p.clone())
    for (var i = 0; i < currentPoints.length; i++) {
      currentPoints[i].moveToward(lastPoints[(i+clockwise).mod(n)],jumpSize)
    };
    iterations ++
  }
}

function generate() {
  // get options from form
  const n = parseInt(document.getElementById("n").value)
  const jumpSize = parseInt(document.getElementById("jumpsize").value)
  const clockwise = parseInt(document.getElementById("clockwise").value)

  // Width and height are 'internal' for high res
  const availableWidth = window.innerWidth * 2
  const availableHeight = (window.innerHeight - document.getElementById("header").offsetHeight)*2
  const width = Math.min(availableWidth,availableHeight)
  const height = width
  const r = width/2 - CANVAS_PADDING

  // internal width and height (double for high res)
  canvas.width = width
  canvas.height = height

  canvas.style.width = width/2 + "px"
  canvas.style.height = height/2 + "px"

  ctx.clearRect(0,0,canvas.width,canvas.height) // clear canvas


  const subdivide = document.getElementById('subdivide').checked
  
  if (!subdivide) {  // Single polygon
    let startPoints = []
    for (let i = 0; i < n; i++) {
      const pt = Point.fromPolarDeg(r, 360/n*i).translate(width/2,height/2)
      startPoints.push(pt)
    };
    generateWithPoints(startPoints,jumpSize,clockwise)
  }

  else { // Subdivided polygon
    const alternate = document.getElementById('alternate').checked
    let subDivideN = parseInt(document.getElementById('subdividen').value)

    // only allow factors
    while (n % subDivideN !== 0) {
      subDivideN --
    }


    let center = new Point(0,0).translate(width/2,height/2)
    let outerPoints = []
    for (let i = 0; i < n; i++) {
      const pt = Point.fromPolarDeg(r, 360/n*i).translate(width/2,height/2)
      outerPoints.push(pt)
    };

    for (let i = 0; i < n; i+= subDivideN) {
      let startPoints = [center.clone()]
      for (let j = 0; j< subDivideN+1; j++) {
        startPoints.push(outerPoints[(i+j)%n].clone())
      }

      let clockwiseAlternated = clockwise
      if (alternate) {
        clockwiseAlternated = ((i/subDivideN)%2 === 0)? clockwise : -clockwise
      }
      generateWithPoints(startPoints,jumpSize,clockwiseAlternated)
    }
  }

}
