/*
========================================================
SIR NETWORK SIMULATOR – CONTEXT + DESIGN NOTES
========================================================

OVERVIEW
--------
This is a standalone (no framework) browser-based simulator
for modelling disease spread on a network using an SIR model:

- S = Susceptible
- I = Infected
- R = Recovered

The network consists of nodes connected by edges. Infection
spreads along edges with a given probability.

This version is intentionally written in PURE JS + SVG so that:
- it runs with no build tools
- it works offline
- it is easily deployable (GitHub Pages, local file, etc.)
- it is suitable for classroom tablet use

--------------------------------------------------------

CORE USER WORKFLOW
------------------

1. SET UP NETWORK
   - Drag from a node to connect two nodes
   - Tap a node to toggle S ↔ I
   - Tap an edge to delete it
   - Randomise / increase / decrease connectivity

2. RUN SIMULATION
   - Press "Step"
   - Each step:
       - S becomes I with probability pInfect if connected to I
       - I becomes R with probability pRecover
   - Step counter increments
   - S / I / R counts update

3. LOCK BEHAVIOUR
   IMPORTANT: Once "Step" is pressed:
       -> Editing is disabled
       -> Network becomes read-only

   This is intentional to support:
       - clean experiments
       - reproducibility
       - classroom clarity

   Reset re-enables editing.

--------------------------------------------------------

STATE MODEL (IMPORTANT)
-----------------------

Global state variables:

nodes: Array of objects
  {
    id: number,
    x, y: position,
    state: "S" | "I" | "R"
  }

edges: Array of objects
  {
    a: nodeId,
    b: nodeId
  }

edgeStart:
  stores first node when creating an edge

hasStarted:
  becomes true after first Step
  disables ALL editing

stepCount:
  number of simulation steps taken

hoverEdge:
  currently hovered edge (used for highlighting + deletion)

--------------------------------------------------------

INTERACTION DESIGN (IMPORTANT FOR FUTURE CHANGES)
------------------------------------------------

This app is designed for TOUCH devices:

- SVG is used for all visuals
- Large hitboxes are used for edges (strokeWidth ~14)
- Hover logic is present but should be treated as:
    "pointer proximity hint"

Key design decisions:
- No complex gesture handling (keep simple)
- Click = primary interaction
- Drag = connect nodes only
- No separate move/edit mode

--------------------------------------------------------

EDGE EDITING LOGIC
------------------

Interaction rules:
- Tap a node to toggle its state S ↔ I
- Drag from one node to another to add/remove an edge
- Tap an edge to delete it
- After creation, edgeStart resets

Deleting edges:
- Done by clicking directly on the edge
- Invisible thick line is used as hitbox
- Hovered edge turns red

--------------------------------------------------------

SIMULATION LOGIC
----------------

For each node:

If state == S:
  - check all neighbours (via edges)
  - if ANY neighbour is infected:
        becomes I with probability pInfect

If state == I:
  - becomes R with probability pRecover

R nodes remain R permanently.

IMPORTANT:
- Simulation uses current state (synchronous step)
- Probability inputs are percentages (0–100)

--------------------------------------------------------

KNOWN LIMITATIONS / SIMPLIFICATIONS
----------------------------------

- Network generation is simple random (not guaranteed structure)
- modifyConnections() is deliberately basic (adds/removes edges randomly)
- No guarantee of connectivity
- No graph layout optimisation
- Uses O(n * edges) checks (fine for small graphs)

--------------------------------------------------------

FUTURE EXTENSIONS (GOOD LLM TASKS)
---------------------------------

High-value improvements:

1. Touch improvements
   - better drag detection
   - long-press vs tap distinction

2. Network generation
   - grid with constraints (min/max degree)
   - small-world networks
   - scale-free networks

3. Visuals
   - animate transitions
   - colour gradients
   - edge weights

4. Simulation features
   - autoplay / pause
   - speed control
   - reset to SAME initial state
   - multiple runs comparison

5. Data display
   - chart of S/I/R over time
   - average degree display
   - R₀ estimation

--------------------------------------------------------

IMPORTANT CONSTRAINTS
--------------------

- Do NOT introduce React or frameworks
- Keep everything in vanilla JS
- Maintain single-file portability compatibility
- Keep interactions simple (classroom use > complexity)

--------------------------------------------------------

IF MODIFYING THIS CODE
---------------------

Before changing:
- Preserve the unified interaction model
- Preserve editing lock after Step
- Preserve touch friendliness

When adding features:
- Prefer clarity over cleverness
- Avoid hidden state interactions
- Keep functions short and readable

--------------------------------------------------------

END CONTEXT
========================================================
*/


const svg = document.getElementById("canvas");

const cols = 6;
const rows = 5;
const nodeRadius = 26;
const minDegree = 3;
const maxDegree = 8;
const connectionStep = 5;

let nodes = [];
let edges = [];
let edgeStart = null;
let hoverEdge = null;
let mousePos = null;
let edgeDrag = false;
let suppressClick = false;
let pointerOrigin = null;
let hasStarted = false;
let stepCount = 0;

function edgeKey(a, b) {
  return a < b ? `${a}-${b}` : `${b}-${a}`;
}

function randomInt(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function shuffled(arr) {
  return arr.slice().sort(() => Math.random() - 0.5);
}

function getSvgPoint(clientX, clientY) {
  const rect = svg.getBoundingClientRect();
  return {
    x: clientX - rect.left,
    y: clientY - rect.top,
  };
}

function createNodes() {
  nodes = [];
  edges = [];

  const width = svg.clientWidth || 700;
  const height = svg.clientHeight || 400;
  const margin = 80;
  const xGap = (width - margin * 2) / (cols - 1);
  const yGap = (height - margin * 2) / (rows - 1);

  for (let i = 0; i < cols * rows; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    nodes.push({
      id: i,
      x: margin + col * xGap + (Math.random() - 0.5) * 20,
      y: margin + row * yGap + (Math.random() - 0.5) * 20,
      state: "S",
      vaccinated: false,
    });
  }

  const infectedIndex = Math.floor(Math.random() * nodes.length);
  nodes[infectedIndex].state = "I";
}

function resetControlState() {
  stepCount = 0;
  hasStarted = false;
  edgeStart = null;
  edgeDrag = false;
  pointerOrigin = null;
  hoverEdge = null;
  suppressClick = false;
}

function init() {
  setupSvgEvents();
  randomise();
}

function draw() {
  svg.innerHTML = "";
  svg.style.cursor = (!hasStarted && edgeStart) ? "crosshair" : "default";

  drawEdges();
  drawGuide();
  drawNodes();
  updateStats();
}

function drawEdges() {
  edges.forEach(e => {
    const a = nodes[e.a];
    const b = nodes[e.b];
    const hovered = (e === hoverEdge && !hasStarted && !edgeStart);

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", a.x);
    line.setAttribute("y1", a.y);
    line.setAttribute("x2", b.x);
    line.setAttribute("y2", b.y);
    line.setAttribute("stroke", hovered ? "red" : "#888");
    line.setAttribute("stroke-width", hovered ? 5 : 3);
    line.setAttribute("stroke-linecap", "round");
    svg.appendChild(line);

    if (!hasStarted) {
      const hit = document.createElementNS("http://www.w3.org/2000/svg", "line");
      hit.setAttribute("x1", a.x);
      hit.setAttribute("y1", a.y);
      hit.setAttribute("x2", b.x);
      hit.setAttribute("y2", b.y);
      hit.setAttribute("stroke", "transparent");
      hit.setAttribute("stroke-width", 18);
      hit.setAttribute("pointer-events", "stroke");
      hit.style.cursor = edgeStart ? "crosshair" : "pointer";

      // mark the hit element with the edge index so we can detect it from
      // document.elementFromPoint during pointer move. Also keep enter/leave
      // handlers for compatibility, and add pointerdown so touch presses
      // immediately highlight the edge.
      const idx = edges.indexOf(e);
      hit.setAttribute("data-edge", String(idx));

      hit.onpointerenter = () => {
        hoverEdge = e;
        draw();
      };
      hit.onpointerleave = () => {
        hoverEdge = null;
        draw();
      };
      hit.onpointerdown = (event) => {
        event.stopPropagation();
        hoverEdge = e;
        draw();
      };
      hit.onpointerup = (event) => {
        event.stopPropagation();
        // pointerup on the hit element should act like a click-delete
        removeEdge(e);
      };

      hit.onclick = (event) => {
        event.stopPropagation();
        removeEdge(e);
      };

      svg.appendChild(hit);
    }
  });
}

function drawGuide() {
  if (edgeStart && !hasStarted && mousePos) {
    const guide = document.createElementNS("http://www.w3.org/2000/svg", "line");
    guide.setAttribute("x1", edgeStart.x);
    guide.setAttribute("y1", edgeStart.y);
    guide.setAttribute("x2", mousePos.x);
    guide.setAttribute("y2", mousePos.y);
    guide.setAttribute("stroke", "orange");
    guide.setAttribute("stroke-width", 2);
    guide.setAttribute("stroke-dasharray", "6,6");
    guide.setAttribute("pointer-events", "none");
    svg.appendChild(guide);
  }
}

function drawNodes() {
  nodes.forEach(n => {
    const isSelected = edgeStart === n && !hasStarted;
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", n.x);
    circle.setAttribute("cy", n.y);
    circle.setAttribute("r", nodeRadius);
    // vaccinated susceptibles get a distinct fill and label 'V'
    const fillColor = (n.state === "S" && n.vaccinated) ? "#bfe4a9" :
      (n.state === "S" ? "skyblue" : n.state === "I" ? "red" : "green");
    circle.setAttribute("fill", fillColor);
    circle.setAttribute("stroke", isSelected ? "orange" : "none");
    circle.setAttribute("stroke-width", isSelected ? 5 : 0);
    circle.style.cursor = hasStarted ? "default" : "pointer";

    circle.onpointerdown = (e) => {
      e.stopPropagation();

      if (hasStarted) return;

      pointerOrigin = getSvgPoint(e.clientX, e.clientY);
      e.target.setPointerCapture(e.pointerId);

      if (edgeStart === null) {
        edgeStart = n;
        edgeDrag = false;
        hoverEdge = null;
        draw();
      }
    };

    circle.onpointerup = (e) => {
      e.stopPropagation();
      // Note: allow vaccination toggles even after simulation has started.
      if (e.target.hasPointerCapture && e.target.hasPointerCapture(e.pointerId)) {
        e.target.releasePointerCapture(e.pointerId);
      }

      if (edgeStart && edgeStart !== n && edgeDrag) {
        toggleEdge(edgeStart, n);
        suppressClick = true;
      }

      if (edgeStart === n && edgeDrag) {
        suppressClick = true;
      }

      // If there was no drag, treat this as a click/tap. If vaccination mode
      // is enabled, toggle vaccinated status (allowed even after start). If
      // not, toggle S/I only when simulation hasn't started.
      const vaccEnabled = document.getElementById('enableVaccination') && document.getElementById('enableVaccination').checked;
      if (!edgeDrag) {
        if (vaccEnabled) {
          n.vaccinated = !n.vaccinated;
          suppressClick = true;
        } else if (!hasStarted) {
          n.state = n.state === "I" ? "S" : "I";
          suppressClick = true;
        }
      }

      edgeStart = null;
      edgeDrag = false;
      pointerOrigin = null;
      draw();
    };

    // expose node id for fallback click detection
    circle.setAttribute('data-node', String(n.id));

    circle.onclick = (e) => {
      e.stopPropagation();

      if (suppressClick) {
        suppressClick = false;
        return;
      }

      // fallback click: respect vaccination mode (allow always), otherwise
      // only toggle S/I when simulation hasn't started.
      const vaccEnabled = document.getElementById('enableVaccination') && document.getElementById('enableVaccination').checked;
      if (!edgeDrag) {
        if (vaccEnabled) {
          n.vaccinated = !n.vaccinated;
          draw();
        } else if (!hasStarted) {
          n.state = n.state === "I" ? "S" : "I";
          draw();
        }
      }
    };

    svg.appendChild(circle);

    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.setAttribute("x", n.x);
    label.setAttribute("y", n.y + 7);
    label.setAttribute("text-anchor", "middle");
    label.setAttribute("font-size", "18");
    label.setAttribute("font-weight", "bold");
    label.setAttribute("pointer-events", "none");
    // If node is susceptible but vaccinated, show 'V' and darker label.
    if (n.state === "S" && n.vaccinated) {
      label.setAttribute("fill", "#222");
      label.textContent = "V";
    } else {
      label.setAttribute("fill", n.state === "S" ? "#222" : "#fff");
      label.textContent = n.state;
    }
    svg.appendChild(label);
  });
}

function toggleEdge(a, b) {
  const i = edges.findIndex(e => (e.a === a.id && e.b === b.id) || (e.a === b.id && e.b === a.id));
  if (i >= 0) edges.splice(i, 1);
  else edges.push({ a: a.id, b: b.id });
}

function removeEdge(e) {
  edges = edges.filter(x => x !== e);
  draw();
}

function getNeighbourPairs() {
  const pairs = [];
  for (let i = 0; i < cols * rows; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        const nr = row + dy;
        const nc = col + dx;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
          const j = nr * cols + nc;
          if (i < j) pairs.push([i, j]);
        }
      }
    }
  }
  return pairs;
}

function randomise() {
  if (hasStarted) return;

  createNodes();
  resetControlState();

  const nodeCount = nodes.length;
  const neighbourMap = nodes.map(node => {
    const row = Math.floor(node.id / cols);
    const col = node.id % cols;
    const ids = [];

    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        const nr = row + dy;
        const nc = col + dx;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
          ids.push(nr * cols + nc);
        }
      }
    }

    return ids;
  });

  const targets = neighbourMap.map(ids => randomInt(minDegree, Math.min(maxDegree, ids.length)));
  const allEdges = [];

  neighbourMap.forEach((ids, i) => {
    ids.forEach(j => {
      if (i < j) allEdges.push([i, j]);
    });
  });

  let bestEdges = new Set();

  for (let attempt = 0; attempt < 100; attempt++) {
    const degrees = Array(nodeCount).fill(0);
    const edgeSet = new Set();
    const shuffledEdges = shuffled(allEdges);

    shuffledEdges.forEach(([a, b]) => {
      if (degrees[a] < targets[a] && degrees[b] < targets[b]) {
        degrees[a]++;
        degrees[b]++;
        edgeSet.add(edgeKey(a, b));
      }
    });

    const success = degrees.every((deg, idx) => deg === targets[idx]);
    if (success) {
      bestEdges = edgeSet;
      break;
    }

    if (edgeSet.size > bestEdges.size) bestEdges = edgeSet;
  }

  edges = Array.from(bestEdges).map(key => {
    const [a, b] = key.split("-").map(Number);
    return { a, b };
  });

  draw();
}

function modifyConnections(add) {
  if (hasStarted) return;
  const amount = 5;
  if (add) {
    addRandomEdges(amount);
  } else {
    removeRandomEdges(amount);
  }
  draw();
}

function addRandomEdges(amount) {
  const existing = new Set(edges.map(e => edgeKey(e.a, e.b)));
  const available = getNeighbourPairs().filter(([a, b]) => !existing.has(edgeKey(a, b)));
  shuffled(available).slice(0, amount).forEach(([a, b]) => {
    edges.push({ a, b });
  });
}

function removeRandomEdges(amount) {
  if (edges.length === 0) return;
  const removed = shuffled(edges).slice(0, amount);
  const removeKeys = new Set(removed.map(e => edgeKey(e.a, e.b)));
  edges = edges.filter(e => !removeKeys.has(edgeKey(e.a, e.b)));
}

function step() {
  hasStarted = true;
  stepCount++;

  const pI = document.getElementById("pInfect").value / 100;
  const pR = document.getElementById("pRecover").value / 100;
  const vEff = document.getElementById("vEffect") ? (document.getElementById("vEffect").value / 100) : 0;
  const nextStates = nodes.map(n => n.state);

  nodes.forEach(n => {
    if (n.state === "S") {
      const inf = edges.some(e => {
        const nb = (e.a === n.id ? e.b : e.b === n.id ? e.a : null);
        return nb !== null && nodes[nb].state === "I";
      });
      if (inf) {
        const effectivePI = n.vaccinated ? pI * (1 - vEff) : pI;
        if (Math.random() < effectivePI) nextStates[n.id] = "I";
      }
    } else if (n.state === "I") {
      if (Math.random() < pR) nextStates[n.id] = "R";
    }
  });

  nodes.forEach((n, index) => {
    n.state = nextStates[index];
  });

  draw();
}

function reset() {
  hasStarted = false;
  stepCount = 0;
  nodes.forEach(n => n.state = "S");
  const infectedIndex = Math.floor(Math.random() * nodes.length);
  nodes[infectedIndex].state = "I";
  draw();
}


function updateStats() {
  let S=0,I=0,R=0;
  nodes.forEach(n=>{
    if(n.state==="S") S++;
    if(n.state==="I") I++;
    if(n.state==="R") R++;
  });

  document.getElementById("stepCount").innerText = stepCount;
  document.getElementById("countS").innerText = S;
  document.getElementById("countI").innerText = I;
  document.getElementById("countR").innerText = R;
}

function setupSvgEvents() {
  svg.onpointermove = e => {
    mousePos = getSvgPoint(e.clientX, e.clientY);

    // detect whether pointer is directly over an edge hit element. Use
    // elementFromPoint to avoid relying on enter/leave events which can be
    // unreliable when DOM ordering changes.
    let newHover = null;
    try {
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (el && el.getAttribute) {
        const attr = el.getAttribute('data-edge');
        if (attr !== null) {
          const idx = Number(attr);
          if (!Number.isNaN(idx) && idx >= 0 && idx < edges.length) {
            newHover = edges[idx];
          }
        }
      }
    } catch (err) {
      newHover = null;
    }

    if (newHover !== hoverEdge) {
      hoverEdge = newHover;
      // only redraw when hover changes
      if (!edgeStart && !hasStarted) draw();
    }

    if (edgeStart && pointerOrigin) {
      const dx = mousePos.x - pointerOrigin.x;
      const dy = mousePos.y - pointerOrigin.y;
      if (Math.hypot(dx, dy) > 8) {
        edgeDrag = true;
      }
    }

    if (edgeStart && !hasStarted) draw();
  };

  svg.onpointerleave = () => {
    mousePos = null;
    if (edgeStart && !hasStarted) draw();
  };

  svg.onclick = (e) => {
    // fallback: some mouse clicks may not reach the element-level handlers
    // (depending on z-order). Use elementFromPoint to detect a click on an
    // edge or node and handle it here as a fallback.
    try {
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (el && el.getAttribute) {
        const edgeAttr = el.getAttribute('data-edge');
        if (edgeAttr !== null) {
          const idx = Number(edgeAttr);
          if (!Number.isNaN(idx) && idx >= 0 && idx < edges.length) {
            removeEdge(edges[idx]);
            return;
          }
        }

        const nodeAttr = el.getAttribute('data-node');
        if (nodeAttr !== null) {
          const nid = Number(nodeAttr);
          const node = nodes.find(x => x.id === nid);
          if (node && !hasStarted) {
            node.state = node.state === 'I' ? 'S' : 'I';
            draw();
            return;
          }
        }
      }
    } catch (err) {
      // ignore elementFromPoint failures
    }

    if (!hasStarted && edgeStart !== null && e.target === svg) {
      edgeStart = null;
      edgeDrag = false;
      draw();
    }
  };

  svg.onpointerup = (e) => {
    pointerOrigin = null;
    if (e.target && e.target.hasPointerCapture && e.target.hasPointerCapture(e.pointerId)) {
      e.target.releasePointerCapture(e.pointerId);
    }
  };

  svg.onpointercancel = (e) => {
    edgeDrag = false;
    pointerOrigin = null;
    if (e.target && e.target.hasPointerCapture && e.target.hasPointerCapture(e.pointerId)) {
      e.target.releasePointerCapture(e.pointerId);
    }
  };
}

init();