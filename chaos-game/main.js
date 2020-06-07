// Config globals
PADDING = 10
FG = 'white'
BG = 'black'
ZOOM = 1

// Global state
let requestID;
let state = 0; // 0 - blank polygon, 1 - started and running, 2 - stopped with fractal visible
let vertices;

// Other 'globals' stored in DOM elements:
// m = document.getElementById("m").value
// n = document.getElementById("n").value = vertices.length
// consecutive = document.getElementById("consecutive").checked


window.addEventListener("DOMContentLoaded", init)

function init() {
  // event listeners
  document.getElementById("generate").addEventListener("click", startbutton)
  document.getElementById("display-box").addEventListener("click", startbutton)
  document.getElementById("showoptions").addEventListener("click", toggleOptions);
  document.getElementById("n").addEventListener("change", function(e) {
    if (state ===0 || state === 2) {
      makePolygon()
    }
  });
  window.addEventListener("resize", function(e) {
    if (state ===0 || state === 2) {
      makePolygon()
    }
  });

  // set up the polygon
  makePolygon()
  
}

function makePolygon() {
  // Get parameters from DOM
  const n = parseInt(document.getElementById("n").value);

  // Set parameters based on space remaining
  const width = window.innerWidth
  const height = window.innerHeight - document.getElementById("header").offsetHeight
  const r = Math.min(width,height)/2 - PADDING

  // Get and resize the canvas
  const canvas = document.getElementById("display-canvas")
  canvas.width = width
  canvas.height = height

  // Make list of vertices
  const center = [width/2,height/2]
  vertices = []
  for (var i = 0; i < n; i++) {
    let x = ZOOM*r*Math.cos(i*2*Math.PI/n) + center[0]
    let y = ZOOM*r*Math.sin(i*2*Math.PI/n) + center[1]
    vertices.push([x,y])
  };

  // Draw the polygon
  ctx = canvas.getContext("2d");
  ctx.fillStyle = BG;
  ctx.strokeStyle = FG;

  ctx.fillRect(0,0,width,height);
  ctx.beginPath();
  ctx.moveTo(...vertices[0]);
  for (var i = 1; i < vertices.length; i++) {
    ctx.lineTo(...vertices[i])
  }
  ctx.closePath();
  ctx.stroke();
}

function startbutton(e) { // event listener for start/stop
  e.preventDefault();
  switch(state) {
    case 0:
      generate();
      state = 1;
      document.getElementById("generate").innerHTML = "Stop"
      break;

    case 1:
      window.cancelAnimationFrame(requestID);
      state = 2;
      document.getElementById("generate").innerHTML = "Start"
      break;

    case 2:
      makePolygon()
      state = 1;
      generate();
      document.getElementById("generate").innerHTML = "Stop"
      break;
    
    default:
      throw 'Undefined state!'
  }
}

function generate() {
  // get the canvas context
  ctx = document.getElementById("display-canvas").getContext("2d")

  // get parameters from DOM
  m = parseInt(document.getElementById("m").value)
  consecutive = document.getElementById("consecutive").checked
  speed = document.getElementById("speed").value
  dotSize = parseInt(document.getElementById("dot-size").value)

  // speed parameters
  let ips, fps, accelerate, fpsInterval
  switch(speed) {
    case 'slow':
      ips = 5;
      accelerate = false;
      break;
    case 'fast':
      ips = 60;
      accelerate = false;
      break;
    case 'fastest':
      ips = Infinity;
      accelerate = false;
      break;
    case 'accelerate':
    default:
      ips = 2;
      accelerate = true;
      break;
  }

  fps = Math.min(ips,30)
  fpsInterval = 1000/fps

  ctx.fillStyle = FG;
  let point = centroid(vertices) //TODO: choose at random
  let i = 0;

  // control fps and iterations per second. Seems off from measurement, but good enough for controlling speed
  let lastdraw, startofframe, elapsed
  starttime = lastdraw = performance.now()

  // request next frame
  requestID = window.requestAnimationFrame(animateFractal)

  function animateFractal(){
    startofframe = performance.now()
    elapsed = startofframe - lastdraw
    
    // Change ips if we are accelerating
    if (accelerate) {
      ips = Math.max(2,i-5)
      fps = Math.min(ips,30)
      fpsInterval = 1000/fps
    }

    let itersPerFrame = Math.floor(ips/fps) //number of iterations per frame - only going to be approx
    // request another frame
    requestID = window.requestAnimationFrame(animateFractal)

    // calculate elapsed time

    // If enough time has passed, then generate itersPerFrame iterations or as many as we can
    if (elapsed > fpsInterval) {
      lastdraw = startofframe
      let j=0
      while (performance.now()-startofframe < fpsInterval && j<itersPerFrame) { 
        point_int = [Math.round(point[0]),Math.round(point[1])]
        //console.log(`point: (${point_int[0]},${point_int[1]})`)
        ctx.fillRect(point[0],point[1],dotSize,dotSize)
        point = chooseNext(point,vertices,m,consecutive)
        i++
        j++
      }
      counter.innerText=i
    }
  }

}

function chooseNext (point,vertices,m,consecutive) {
  // starting fairly static here - choose random polygon
  
  let polygon = [];
  if (!consecutive) {
    polygon = getRandomSubarray(vertices,m);
  } else {
    let n = vertices.length
    let p = Math.floor(Math.random()*n)
    for (var i = 0; i < m; i++) {
      polygon.push(vertices[(p+i)%n])
    };
  }

  polygon.push(point);
  return centroid(polygon)
}

function centroid(polygon) {
  const len = polygon.length
  let sumx = 0
  let sumy = 0
  for (var i = 0; i < len; i++) {
    sumx += polygon[i][0];
    sumy += polygon[i][1];
  };
  return [sumx/len,sumy/len];
}

function getRandomSubarray(arr, size) {
    var shuffled = arr.slice(0), i = arr.length, temp, index;
    while (i--) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(0, size);
}

function toggleOptions (e) {
  var showoptions = document.getElementById("showoptions");
  var is_hidden = document.getElementById("options").classList.toggle("hidden");

  if (is_hidden) {
    showoptions.innerHTML = "Show options";
  } else {
    showoptions.innerHTML = "Hide options";
  }

  if (e) {e.preventDefault();}
};
