document.getElementById("generate").addEventListener("click", function(e) {
    e.preventDefault();
    generateAll();
  });

document.getElementById("show-answers").addEventListener("click", function(e) {
    e.preventDefault();
    toggleAnswers();
  });

document.getElementById("showoptions").addEventListener("click", toggleOptions);

var questions = [];
var answered = false;

function generateAll() {
  document.getElementById("display-box").innerHTML="";
  questions = [];

  var mainq = document.createElement("p");
  mainq.className = "katex mainq";
  mainq.innerHTML = "1. Simplify";
  document.getElementById("display-box").appendChild(mainq);

  var n = parseInt(document.getElementById("n_questions").value);
  var mindiff = parseInt(document.getElementById("min_diff").value);
  var maxdiff = parseInt(document.getElementById("max_diff").value);

  for (let i=0; i<n; i++) {
    // Make DOM elements
    let container = document.createElement("div");
    container.className = "question-container";
    container.dataset.question_index = i;

    document.getElementById("display-box").appendChild(container);

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
  var answerp = document.createElement("p");
  var container = questions[i].container;

  questionp.className = "question";
  answerp.className = "answer";
  answerp.classList.add("hidden");

  var qnum = "\\text{" + String.fromCharCode(65 + (32+i)%58) + ") }";
  katex.render(qnum + question.q, questionp,{displayMode: true});
  katex.render("= " + question.a, answerp,{displayMode: true});

  container.appendChild(questionp);
  container.appendChild(answerp);
}

function quadraticString(a,b,c) {
  if (a===0 && b===0 && c===0) return "0";

  var x2string =
    a===0 ? "" :
    a===1 ? "x^2" :
    a===-1 ? "-x^2" :
    a + "x^2";

  var xsign = 
    b<0 ? "-" :
    (a===0 || b===0) ? "" :
    "+";

  var xstring =
    b===0 ? "" :
    (b===1 || b===-1) ? "x" :
    Math.abs(b) + "x";

  var constsign = 
    c<0 ? "-" :
    ((a===0 && b===0) || c===0) ? "" :
    "+";

  var conststring =
    c===0 ? "" : Math.abs(c);

  return x2string + xsign + xstring + constsign + conststring;
}

function canSimplify(a1,b1,a2,b2) {
    // can (a1x+b1)/(a2x+b2) be simplified?
    //
    // First, take out gcd, and write as c1(a1x+b1) etc

    var c1 = gcd(a1,b1);
    a1 = a1/c1;
    b1 = b1/c1;

    var c2 = gcd(a2,b2);
    a2 = a2/c2;
    b2 = b2/c2;

    var result=false;

    if ( gcd(c1,c2)>1 || (a1===a2 && b1===b2)) {
        result = true;
    }

    return result;
}

function makeQuestion(difficulty) {
  var a, b, c, d, e, f //(ax+b)(ex+f)/(cx+d)(ex+f) = (px^2+qx+r)/(tx^2+ux+v)
  var p, q, r, t, u, v
  var min_coeff, max_coeff, min_const, max_const

  switch (difficulty) {
    case 1: 
      min_coeff = 1, max_coeff=1, min_const=1, max_const=6;
      break;
    case 2:
      min_coeff = 1, max_coeff=1, min_const=-6, max_const=6;
      break;
    case 3:
      min_coeff = 1, max_coeff=3, min_const=-5, max_const=5;
      break;
    case 4:
    default:
      min_coeff = -3, max_coeff=3, min_const=-5, max_const=5;
      break;
  }

  while (
    ((!a && !b) || (!c && !d) || (!e && !f))  //retry if any expression is 0
    ||  canSimplify(a,b,c,d) //retry if there's a common numerical factor
  )
   { 
    a = randBetween(min_coeff,max_coeff);
    c = randBetween(min_coeff,max_coeff);
    e = randBetween(min_coeff,max_coeff);
    b = randBetween(min_const,max_const);
    d = randBetween(min_const,max_const);
    f = randBetween(min_const,max_const);
  }

  // if the denominator is negative for each term, then make the numerator negative instead
  if ( c<=0 && d<=0) {
    c = -c
    d = -d
    a = -a
    b = -b
  }

  p = a*e; q = a*f + b*e; r = b*f;
  t = c*e; u = c*f + d*e; v = d*f;

  var question =
    `\\frac{${quadraticString(p,q,r)}}{${quadraticString(t,u,v)}}`;
  var answer = 
    (c===0 && d===1) ? quadraticString(0,a,b) :
    `\\frac{${quadraticString(0,a,b)}}{${quadraticString(0,c,d)}}`;

  return {q: question, a:answer}
}

function randBetween(n,m,dist) {
  if (!dist) dist = Math.random;
  return n+Math.floor(dist()*(m-n+1));
}

function gcd(a, b) {
  // taken from fraction.js
  if (!a)
    return b;
  if (!b)
    return a;

  while (1) {
    a %= b;
    if (!a)
      return b;
    b %= a;
    if (!b)
      return a;
  }
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
