const width = document.documentElement.clientWidth
const height = document.documentElement.clientHeight
let DELTA = Math.PI/15
let SPLIT = Math.floor(width/40)

let x = [width/2]
let y = [height/2] 
let dir = [Math.PI/2] //up
let colour: [number,number,number][]= [[255,255,255]]
let steps = 0;
let requestId: number;

let leftSplit = DELTA
let rightSplit = DELTA

const canvas = document.getElementById("cvs") as HTMLCanvasElement
const ctx = canvas.getContext("2d")
const counter = document.getElementById("counter")

document.getElementById("randomSplit").addEventListener("click", () => {
  reset()
  randomSplit()
}) 

document.getElementById("nonRandomTree").addEventListener("click", () => {
  reset()
  leftSplit = DELTA
  rightSplit = DELTA
  SPLIT = Math.floor(width/70)
  ctx.fillStyle = 'rgba(255,255,255,0.2)'
  dir = [-Math.PI/2]
  y = [0.9*canvas.height]
  nonRandomTree()
}) 

document.getElementById("randomishTree").addEventListener("click", () => {
  reset()
  leftSplit = Math.random()*Math.PI/3
  rightSplit = Math.random()*Math.PI/3
  SPLIT = 20
  ctx.fillStyle = 'rgba(255,255,255,0.3)'
  dir = [Math.random()*Math.PI*2]
  nonRandomTree()
}) 

canvas.width = width
canvas.height = height

function nonRandomTree() {
  const n = x.length
  for (let i = 0; i < n; i++) {
    ctx.fillRect(x[i],y[i],1,1);
    [x[i],y[i]] = move(x[i],y[i],dir[i],2) // Method 1
  }
  if (steps % SPLIT === 0) {
    for (let i = 0; i < n; i++) {
      x.push(x[i])
      y.push(y[i])
      dir.push(dir[i] - leftSplit)
      dir[i] += rightSplit
    }
  }
  counter.innerHTML=`frames: ${steps}<br>Paths: ${n}`
  steps++
  requestId = requestAnimationFrame(nonRandomTree)
}

function reset() {
  if (requestId) cancelAnimationFrame(requestId)
  ctx.clearRect(0,0,canvas.width,canvas.height)
  x = [width/2]
  y = [height/2] 
  dir = [Math.PI/2] //up
  colour = [[255,255,255]]
  steps = 0;
}

function randomSplit() {
  //move/draw each point
  const n = x.length
  for (let i = 0; i < n; i++) {
    ctx.fillStyle = `rgb(${colour[i][0]},${colour[i][1]},${colour[i][2]})`
    ctx.fillRect(x[i],y[i],1,1);
    [x[i],y[i]] = move(x[i],y[i],dir[i])
    dir[i]+= coinToss() ? DELTA : -DELTA
    if (steps%60 === 0 && Math.random() < 1/(i+1)) {
      x.push(x[i])
      y.push(y[i])
      dir.push(dir[i])
      colour.push(nudgeColour(colour[i]))
    }
  }

  //split
  counter.innerHTML=steps.toString()

  steps++
  requestId =  requestAnimationFrame(randomSplit)
}

function move(x: number,y:number,dir:number,dist?:number) : [number, number]{
  dist = dist ?? 1
  x += dist*Math.cos(dir)
  y += dist*Math.sin(dir)
  return [x,y]
}

function coinToss() : boolean {
  return (Math.random()<0.5)
}

function nudgeColour(rgb: [number,number,number], d?: number) : [number,number,number] {
  d = d ?? 30
  const index = Math.floor(Math.random() * 3)
  const change = rgb[index] === 255 ? -d :
                   rgb[index] === 0 ? +d :
                         coinToss() ? +d : -d
  let newRgb: [number,number,number] = [...rgb]
  newRgb[index]+=change
  return newRgb
}
