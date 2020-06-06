PADDING = 10
FG = 'white'
BG = 'black'
ZOOM = 1
STEP = 300

let requestID;
let state = 0; // 0 - not started yet, 1 - started and running, 2 - paused

document.getElementById("generate").addEventListener("click", function(e) {
  e.preventDefault();
  if (state === 0) {
    generate();
    state = 1;
    document.getElementById("generate").innerHTML = "Stop"
  } else if (state === 1) {
    window.cancelAnimationFrame(requestID);
    state = 0;
    document.getElementById("generate").innerHTML = "Start"
  }
});

document.getElementById("showoptions").addEventListener("click", toggleOptions);

function generate() {
  // clear everything
  document.getElementById("display-box").innerHTML = ""

  // Get parameters from options
  const n = parseInt(document.getElementById("n").value);
  const m = parseInt(document.getElementById("m").value);
  const consecutive = document.getElementById("consecutive").checked;

  // Set parameters based on space remaining
  const width = window.innerWidth
  const height = window.innerHeight - document.getElementById("header").offsetHeight


  const r = Math.min(width,height)/2 - PADDING

  // Construct the canvas
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  canvas.style.margin = "auto"
  canvas.style.display = "block"
  document.getElementById("display-box").appendChild(canvas)

  // Make a counter in bottom left
  const counter = document.createElement("div")
  counter.style.position="absolute"
  counter.style.left = PADDING + "px"
  counter.style.bottom = PADDING + "px"
  counter.style.color = FG
  document.getElementById("display-box").appendChild(counter)

  // Make list of vertices
  const center = [width/2,height/2]
  let vertices = []
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

  ctx.fillStyle = FG;
  let point = center;
  i = 0;

  function animateFractal(timestamp){
    while (performance.now()-timestamp < 33) { // Should keep it 30fps?
      //console.log(i+ ": " + "(" + point[0] + "," + point[1] + ")")
      ctx.fillRect(point[0],point[1],1,1)
      point = chooseNext(point,vertices,m,consecutive)
      i++
    }

    counter.innerText=i
    requestID = window.requestAnimationFrame(animateFractal)
  }
  requestID = window.requestAnimationFrame(animateFractal)
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
      polygon.push(vertices[(p+1)%n])
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
