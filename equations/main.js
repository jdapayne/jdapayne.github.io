document.getElementById("generate").addEventListener("click", function(e) {
    e.preventDefault();
    generateAll();
  });

document.getElementById("show-answers").addEventListener("click", function(e) {
    e.preventDefault();
    toggleAnswers();
  });

var questions = [];
var answered = false;

function generateAll() {
  document.getElementById("display-box").innerHTML="";
  questions = [];
  let n = document.getElementById("n_questions").value;
  for (let i=0; i<n; i++) {
    // Make DOM elements
    let container = document.createElement("div");
    container.className = "question-container";
    container.dataset.question_index = i;

    document.getElementById("display-box").append(container);

    questions[i] = Object.assign({},questions[i], {
      container: container
    });

    generate(i);
  }

  document.getElementById("show-answers").disabled = false;
}

function generate(i) {
  var question = makeQuestion(1);
  questions[i].question = question;

  var questionp = document.createElement("p");
  var questionspan = document.createElement("span");
  var answerp = document.createElement("p");
  var container = questions[i].container;

  questionp.className = "question";
  answerp.className = "answer";
  answerp.classList.add("hidden");

  questionp.innerHTML = String.fromCharCode(65 + (32+i)%58) + ")  ";
  katex.render(question.q, questionspan);
  katex.render(question.a, answerp);

  questionp.appendChild(questionspan);
  container.appendChild(questionp);
  container.appendChild(answerp);
}

function makeQuestion(diff) {
  var m, c, x1, y1, x2, y2;
  var minm = 1, maxm = 5;
  var minc = 0, maxc = 10;
  m = randBetween(minm,maxm);
  c = randBetween(minc,maxc);

  x1 = randBetween(0,10);
  y1 = m*x1 + c;

  x2 = randBetween(x1+1,15);
  y2 = m*x2 + c;

  var xstr =
    m===0  ? "" :
    m===1  ? "x" :
    m===-1 ? "-x" :
    (m+"x");
  
  var conststr = // TODO: When m=c=0 
    c===0 ? "" :
    c < 0 ? (" - " + -c) :
    (" + " + c);

  var question = "("+x1+", "+y1+")\\text{ and }("+x2+", "+y2+")";
  var answer = "y = " + xstr + conststr;

  return {q: question, a:answer}
}

function randBetween(n,m,dist) {
  if (!dist) dist = Math.random;
  return n+Math.floor(dist()*(m-n+1));
}

function toggleAnswers(e) {
  var answers = document.getElementsByClassName("answer");
  var n = answers.length;
  debugger;
  if (!answered) {
    for (var i = 0; i<n; i++) {
      answers[i].classList.remove("hidden");
    }
    answered = true;
    e.target
  } else {
    for (var i = 0; i<n; i++) {
      answers[i].classList.add("hidden");
    }
    answered = false;
  }
}

