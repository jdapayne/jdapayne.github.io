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
  var n = parseInt(document.getElementById("n_questions").value);
  var mindiff = parseInt(document.getElementById("min_diff").value);
  var maxdiff = parseInt(document.getElementById("max_diff").value);

  for (let i=0; i<n; i++) {
    // Make DOM elements
    let container = document.createElement("div");
    container.className = "question-container";
    container.dataset.question_index = i;

    document.getElementById("display-box").append(container);

    questions[i] = Object.assign({},questions[i], {
      container: container
    });

    var difficulty = mindiff + Math.floor(i*(maxdiff-mindiff+1)/n);
    generate(i,difficulty);
  }

  document.getElementById("show-answers").disabled = false;
}

function generate(i,difficulty) {
  var question = makeQuestion(difficulty);
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

function makeQuestion(difficulty) {
  var m, c, x1, y1, x2, y2;
  var minm, maxm, minc, maxc;

  switch (difficulty) {
    case 1: // m>0, c>=0
    case 2:
    case 3:
      minm = difficulty<3? 1 : -5;
      maxm = 5;
      minc = difficulty<2? 0 : -10;
      maxc = 10;
      m = randBetween(minm,maxm);
      c = randBetween(minc,maxc);
      x1 = difficulty<3? randBetween(0,10) : randBetween(-15,15);
      y1 = m*x1 + c;

      if (difficulty < 3) {
        x2 = randBetween(x1+1,15);
      } else {
        x2 = x1;
        while (x2===x1) {x2 = randBetween(-15,15)};
      }
      y2 = m*x2 + c;
      break;
    case 4: // m fraction, points are integers
    default:
      var md = randBetween(1,5);
      var mn = randBetween(-5,5);
      m = new Fraction(mn,md);
      x1 = new Fraction(randBetween(-10,10));
      y1 = new Fraction(randBetween(-10,10));
      c = new Fraction(y1).sub(m.mul(x1));
      x2 = x1.add(randBetween(1,5)*m.d);
      y2 = m.mul(x2).add(c);
      break;
  }

  var xstr =
    (m===0 || (m.equals && m.equals(0))) ? "" :
    (m===1 || (m.equals && m.equals(1))) ? "x" :
    (m===-1 || (m.equals && m.equals(-1))) ? "-x" :
    (m.toLatex) ? m.toLatex() + "x" :
    (m+"x");
  
  var conststr = // TODO: When m=c=0 
    (c===0 || c.equals && c.equals(0)) ? "" :
    (c < 0) ? (" - " + (c.neg?c.neg().toLatex():-c)) :
    (c.toLatex) ? (" + " + c.toLatex()) :
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
  if (!answered) {
    for (var i = 0; i<n; i++) {
      answers[i].classList.remove("hidden");
    }
    answered = true;
  } else {
    for (var i = 0; i<n; i++) {
      answers[i].classList.add("hidden");
    }
    answered = false;
  }
}

