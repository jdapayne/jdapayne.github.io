import {randBetween} from './Utilities.js';
import Aosl from './Aosl.js';
import AoslView from './AoslView.js';
import AoslAlgebraic from './AoslAlgebraic.js';
import AoslViewAlgebraic from './AoslViewAlgebraic.js';
import './style.css';

window.addEventListener("DOMContentLoaded", function () {
        App.init();
});

export default function App () {}

App.init = function () {
    document.getElementById("generate").addEventListener("click", function(e) {
        App.generateAll();
        e.preventDefault();
    });

    document.getElementById("showoptions").addEventListener("click",App.toggleOptions);

    document.getElementById("display-box").addEventListener("click", function(e) {
        let elem = e.target;
        if (elem.classList.contains("refresh")) {
            let q_container = elem.closest(".question-container");
            let q_index = q_container.dataset.question_index;
            App.generate(q_index);
        }
    });
};

App.toggleOptions = function (e) {
    let showoptions = document.getElementById("showoptions");
    let is_hidden = document.getElementById("options").classList.toggle("hidden");

    if (is_hidden) {
        showoptions.innerHTML = "Show options";
    } else {
        showoptions.innerHTML = "Hide options";
    }

    if (e) {e.preventDefault()}
}

App.draw = function (i) {
    // redraws ith question
    let view = App.questions[i].viewobject;
    let canvas = App.questions[i].container.querySelector("canvas");
    view.drawIn(canvas);
};

App.generate = function (i) {
    // Generates a question and represents it at the given index
    let [question,subtype] = App.chooseQuestion();
    let view = App.makeView(question,subtype,App.defaults.radius);
    
    App.questions[i] = Object.assign({},App.questions[i], {
        viewobject: view,
        type: "aosl",
        subtype: subtype
    });

    App.draw(i);
};

App.clear = function () {
    document.getElementById("display-box").innerHTML = "";
    App.questions = []; // cross fingers that no memory leaks occur
};

App.generateAll = function () {
    App.clear();
    // Create containers for questions and generate a question in each container
    let n = document.getElementById("n-questions").value;
    for (let i=0; i<n; i++) {
        // Make DOM elements
        let container = document.createElement("div");
        container.className = "question-container";
        container.dataset.question_index = i;

        let canvas = document.createElement("canvas");
        canvas.width = App.defaults.canvas_width;
        canvas.height = App.defaults.canvas_height;
        canvas.className = "question-view";
        container.append(canvas);

        let refresh = document.createElement("img");
        refresh.src = "refresh.png"; // might be better to do something clever with webpack
        refresh.className = "refresh";
        refresh.width = 15;
        refresh.height = 15;
        container.append(refresh);

        document.getElementById("display-box").append(container);

        App.questions[i] = Object.assign({},App.questions[i], {
            container: container
        });

        // Make question and question view
        App.generate(i);
    }
};

App.chooseQuestion = function () {
    // need to choose between types at some point
    return App.chooseAosl();
};

App.chooseAosl = function () {
    // choose a type of question and generate it
    // return both the (sub)type and the question
    let selected_subtypes = document.querySelectorAll(".subtype:checked");
    let diceroll = randBetween(0,selected_subtypes.length-1);
    let subtype = selected_subtypes[diceroll].id;
    let aosl;
    switch(subtype) {
        case "simple":{
            let n = randBetween(2,4);
            aosl = Aosl.random(n);
            break;
        }
        case "repeated":{
            if (Math.random() < 0.15) {
                let n = randBetween(2,5);
                aosl = Aosl.randomrep(n,n);
            } else {
                let n = randBetween(3,4);
                let m = randBetween(2,n-1);
                aosl = Aosl.randomrep(n,m);
            }
            break;
        }
        case "algebra":{
            let n = randBetween(2,4);
            aosl = AoslAlgebraic.random(n);
            break;
        }
        default:{
            throw new Error("This shouldn't happen!!")
        }
    }
    return [aosl,subtype]
};

App.makeView = function (aosl,subtype,radius) {
    // at some point, this needs to branch with different types as well
    let view;
    switch (subtype) {
        case "simple":
        case "repeated":
            view = new AoslView(aosl,radius);
            break;
        case "algebra":
            view = new AoslViewAlgebraic(aosl,radius);
            break;
        default:
            throw new Error("No appropriate subtype of question");
    }
    return view;
};

/* TODO: All of these just make use of the Question.showAnswer() [or Aosl.showAnswer()] methods and similar
 * None of these are implemented, however
 */

App.showAnswer = function (i) {
    App.questions[i].viewobject.showAnswer();
    App.redraw(i);
};

App.hideAnswer = function (i) {
    App.questions[i].viewobject.hideAnswer();
    App.redraw(i);
};

App.hideAnswer = function (i) {
    App.questions[i].viewobject.toggleAnswer();
    App.redraw(i);
};

App.showAllAnswers = function () {
    App.questions.forEach( function(q,idx) {
        q.viewobject.showAnswer();
        App.redraw(i);
    });
};

App.questions = []; // An array of Aoslviews? Or maybe a bit more.
/********************************************************************************************************
 * Example:
 * App.questions =
 *  [
 *      {type: "aosl", subtype: "simple", viewobject: [AoslView object], container: [Node]},
 *      {type: "aosl", subtype: "algebra", viewobject: [AoslViewAlgebraic object], container: [Node]}
 *  ]
 *
 ********************************************************************************************************/

App.defaults = {
    canvas_width: 250,
    canvas_height: 250,
    radius: 100
};
