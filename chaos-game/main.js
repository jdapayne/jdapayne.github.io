// Config globals
PADDING = 10
FG = '#FFFFFF' // must be hex colours - for now
BG = '#000000'
ZOOM = 1

// Global state
let requestID;
let state = 0; // 0 - blank polygon, 1 - started and running, 2 - stopped with fractal visible
let vertices, center, r;

// Other 'globals' stored in DOM elements:
// m = document.getElementById("m").value
// n = document.getElementById("n").value = vertices.length
// consecutive = document.getElementById("consecutive").checked


window.addEventListener("DOMContentLoaded", init)

function init() {
  // event listeners
  document.getElementById("generate").addEventListener("click", startbutton)
  document.getElementById("display-box").addEventListener("click", startbutton)
  document.getElementById("n").addEventListener("change", function(e) {
    if (state ===0 || state === 2) {
      makePolygon()
      state = 0
    }
  });
  window.addEventListener("resize", function(e) {
    switch(state) {
      case 0:
        resizeCanvas(false)
        makePolygon()
        break;
      case 1:
        break;
      case 2:
        resizeCanvas(false)
        makePolygon()
        break;
      default:
        // code
    }
  });

  document.getElementById("accelerate").addEventListener("change", function(e) {
    if (e.target.checked) {
      document.getElementById("speed").disabled = true
    } else {
      document.getElementById("speed").disabled = false
    }
  })

  document.getElementById("show-polygon").addEventListener("change", function(e) {
    if (state ===0 || state===2) {
      resizeCanvas(false)
      makePolygon()
      state = 0
    }
  });

  // set up the polygon
  resizeCanvas(false)
  makePolygon()
  
}

function makePolygon() {
  // Get parameters from DOM
  const n = parseInt(document.getElementById("n").value);
  const canvas = document.getElementById("display-canvas")
  const width = canvas.width
  const height = canvas.height

  r = Math.min(width,height)/2 - PADDING

  // Make list of vertices
  center = [width/2,height/2]
  vertices = []
  for (var i = 0; i < n; i++) {
    let x = ZOOM*r*Math.cos(i*2*Math.PI/n) + center[0]
    let y = ZOOM*r*Math.sin(i*2*Math.PI/n) + center[1]
    vertices.push([x,y])
  };

  // Draw the polygon
  if (document.getElementById("show-polygon").checked) {
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
}

function resizeCanvas(reDraw) {
  // resize canvas. If reDraw is true, copy contents and re-draw it
  
  // Set parameters based on space remaining
  const optionsWidth = document.getElementById("options").offsetWidth;
  const vpWidth = window.innerWidth  
  const vpHeight = window.innerHeight  
  const narrowViewPort = (optionsWidth*2 > vpWidth) // Options take up half width (phones)

  let width, height
  if (narrowViewPort) {
    width = height = vpWidth
  } else {
    width = vpWidth - optionsWidth
    height = vpHeight
  }
  // Get and resize the canvas
  const canvas = document.getElementById("display-canvas")

  // copy contents if reDrawing
  let copyCanvas
  if (reDraw) {
    copyCanvas = document.createElement("canvas")
    copyCanvas.width = canvas.width
    copyCanvas.height = canvas.height
    copyCanvas.getContext("2d").drawImage(canvas,0,0)
  }

  canvas.width = width;
  canvas.height = height;
  // position below if narrowViewPort, to right if not
  if (narrowViewPort) {
    canvas.style.position = "static"
  } else {
    canvas.style.position = "absolute"
    canvas.style.top = "0px"
    canvas.style.left = document.getElementById("options").offsetWidth + "px"
  }

  // copy contents back
  if (reDraw) {
    canvas.getContext("2d").drawImage(copyCanvas,0,0,canvas.width,canvas.height)
  }

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
  // Three canvases:
  //  displayCanvas: in the DOM, everything written to that
  //  fractalCanvas: updated with dots from fractal
  //  overlayCanvas: overlay of what's going on

  const displayCanvas = document.getElementById("display-canvas")
  const displayctx = displayCanvas.getContext("2d")

  const fractalCanvas = document.createElement("canvas")
  fractalCanvas.width = displayCanvas.width
  fractalCanvas.height = displayCanvas.height
  const fractalctx = fractalCanvas.getContext("2d")
  fractalctx.drawImage(displayCanvas,0,0)

  const overlayCanvas = document.createElement("canvas")
  overlayCanvas.width = displayCanvas.width
  overlayCanvas.height = displayCanvas.height
  const overlayctx = overlayCanvas.getContext("2d")

  // get parameters from DOM
  m = parseInt(document.getElementById("m").value)
  consecutive = document.getElementById("consecutive").checked
  speedSlider = document.getElementById("speed")
  speed = parseInt(speedSlider.value)
  dotSize = parseInt(document.getElementById("dot-size").value)
  accelerate = document.getElementById("accelerate").checked
  showConstruction = document.getElementById("show-construction").checked

  centerType = document.getElementById("center-type").value
  let centerFunction;
  if (centerType === "centroid") {
    centerFunction = centroid
  } else if (centerType === "incenter") {
    centerFunction = incenter
  }

  transparency = 255 - parseInt(document.getElementById("transparency").value)
  let transparencyHex = (transparency < 0x10)? "0"+transparency.toString(16) : transparency.toString(16)
  let fgHexa = FG + transparencyHex

  // compute ips/fps etc
  ips = (speed === 50) ? Infinity : 2*Math.exp(speed/5) // log scale on slider
  fps = Math.min(ips,30)
  fpsInterval = 1000/fps

  fractalctx.fillStyle = fgHexa;

  // Choose random point
  let randangle = Math.random()*2*Math.PI
  let randr = Math.random()*r

  let point = [center[0]+randr*Math.cos(randangle),center[1]+randr*Math.sin(randangle)]

  let lastpoint, chosenVertices;
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
    if (accelerate) { // ramp up if accelerating
      ips = Math.max(2,i-5)
      fps = Math.min(ips,30)
      fpsInterval = 1000/fps
      speedSlider.value = 5*Math.log(ips/2)
    } else if (ips < Infinity) { //don't waste cycles going to DOM if on max speed
      speed = parseInt(speedSlider.value)
      ips = 2*Math.exp(speed/5) // log scale on slider
      fps = Math.min(ips,30)
      fpsInterval = 1000/fps
    }

    let itersPerFrame = Math.floor(ips/fps) //number of iterations per frame - only going to be approx
    // request another frame
    requestID = window.requestAnimationFrame(animateFractal)

    // calculate elapsed time

    // If enough time has passed, then generate itersPerFrame iterations or as many as we can. Put on fractalcanvas
    if (elapsed > fpsInterval) {
      lastdraw = startofframe
      let j=0
      while (performance.now()-startofframe < fpsInterval && j<itersPerFrame) { 
        point_int = [Math.round(point[0]),Math.round(point[1])]
        //console.log(`point: (${point_int[0]},${point_int[1]})`)
        fractalctx.fillRect(point[0],point[1],dotSize,dotSize)
        lastpoint = point
        let chosenNext = chooseNext(point,vertices,m,consecutive,centerFunction)
        point = chosenNext[0]
        chosenVertices = chosenNext[1]
        i++
        j++
      }

      // draw overlay
      if (showConstruction) {
        overlayctx.clearRect(0,0,overlayCanvas.width,overlayCanvas.height)
        overlayctx.strokeStyle = "yellow"
        overlayctx.beginPath();
        overlayctx.moveTo(...lastpoint);
        for (var v = 0; v < chosenVertices.length; v++) {
          overlayctx.lineTo(...chosenVertices[v])
        };
        overlayctx.closePath()
        overlayctx.stroke()

        overlayctx.fillStyle = "blue"
        overlayctx.beginPath()
        overlayctx.arc(lastpoint[0],lastpoint[1],dotSize*2,0,2*Math.PI)
        overlayctx.fill()

        overlayctx.fillStyle = "red"
        overlayctx.beginPath()
        overlayctx.arc(point[0],point[1],dotSize*2,0,2*Math.PI)
        overlayctx.fill()
      }

      // Update counter
      counter.innerText=i

      // Push both onto display
      displayctx.clearRect(0,0,displayCanvas.width,displayCanvas.height)
      displayctx.drawImage(fractalCanvas,0,0)
      if (showConstruction) {displayctx.drawImage(overlayCanvas,0,0)}

    }
  }

}

function chooseNext (point,vertices,m,consecutive,centerFunction) {
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
  let returnval = [centerFunction(polygon),polygon.slice(0,-1)]
  return returnval
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

function incenter(triangle) {
  // If triangle=[A,B,C], lengths = [a,b,c] where a is opposite A etc.
  // Sort of seeing if it kinda generalises to other polygons

  let n = triangle.length;
  let perimeter = 0;
  let sumx = 0;
  let sumy = 0;

  for (var i = 0; i < n; i++) {
    var B = triangle[(i+1)%n]
    var C = triangle[(i+2)%n]
    a = Math.sqrt((B[0]-C[0])**2 + (B[1]-C[1])**2)

    sumx += triangle[i][0]*a
    sumy += triangle[i][1]*a
    perimeter += a
  };

  return [sumx/perimeter, sumy/perimeter]
    
  };

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
