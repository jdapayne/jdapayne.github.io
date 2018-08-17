import $ from 'jquery';
import {randBetween} from './Utilities.js';
import Aosl from './Aosl.js';
import AoslAlgebraic from './AoslAlgebraic.js';
import drawAosl from './drawAosl.js';
import './style.css';

$(document).ready(function () {
    $("#generate").click(generate);
    $("#showoptions").click(hideOptions);
    $("#generate").attr("disabled",false);
    $(".display-box").on('click','.refresh', function (e) {
        var container = $(e.target).parent().parent();
        container.empty();
        generateInContainer(container);
        e.preventDefault();
    })
});

// these should probably be moved to modules

function generateInContainer(container) {
    let canvas = $('<canvas width=300, height=250 class="triangle-view"/>');

    let subtypes = document.querySelectorAll(".subtype:checked");
    let diceroll = randBetween(0,subtypes.length-1);

    let aosl;
    switch(subtypes[diceroll].id) {
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

    drawAosl(aosl,canvas[0]);
    canvas.appendTo(container);
    var refresh = $('<p><img src="refresh.png" width=15 height=15 class="refresh"/></p>');
    refresh.appendTo(container);
}

function hideOptions(e) {
    $("#showoptions").html("Show options");
    $("#options").slideUp();
    $("#showoptions").unbind('click').click(showOptions);
    if (e !== undefined) e.preventDefault();
}

function showOptions(e) {
    $("#showoptions").html("Hide options");
    $("#showoptions").unbind('click').click(hideOptions);
    $("#options").slideDown();
    if (e !== undefined) e.preventDefault();
}

function generate (e) {
    var n = $("#n-questions").val();
    
    $(".display-box").html("");

    for (var i = 0; i < n; i++) {
        let container = $("<div/>");
        container.addClass("question-container");
        container.attr("id","question-container"+i);

        generateInContainer(container);

        container.appendTo($(".display-box"));
    };

    e.preventDefault();
}

// Thoughts: make this an overall App object, which holds links to all the AoslViews currently on.
// 

function App {}

App.init = function () {
    document.getElementById("generate").addEventListener("click", function(e) {
        App.generate();
        e.preventDefault();
    });

    document.getElementById("showoptions").addEventListener(App.hideOptions);

    document.getElementById("display-box").addEventListener("click", function(e) {
        let elem = e.target;
        if (elem.classList.contains("refresh")) {
            let q_container = elem.closest(".question-container");
            let q_index = q_container.dataset.question_index;
            App.generate(q_index);
        }
    });
}

App.hideOptions = function (e) {
    let showoptions = document.getElementById("showoptions");
    showoptions.innerHTML = "Show options";
    showoptions.removeEventListener("click", App.hideOptions);
    showoptions.addEventListener("click", App.showOptions);
    document.getElementById("options").style.display("none");
    if (e) {e.preventDefault()}
}

App.showOptions = function (e) {
    let showoptions = document.getElementById("showoptions");
    showoptions.innerHTML = "Hide options";
    showoptions.removeEventListener("click", App.showOptions);
    showoptions.addEventListener("click", App.hideOptions);
    document.getElementById("options").style.display("block");
    if (e) {e.preventDefault()}
}

App.draw = function (i) {
    // redraws ith question
    let view = App.questions[i].viewobject;
    let canvas = App.questions[i].container.querySelector("canvas");
    view.drawIn(canvas);
}

App.generate = function (i) {
    // Generates a question and represents it at the given index
    let [question,subtype] = App.chooseQuestion();
    let view = App.makeView(question,subtype,App.defaults.radius);
    App.questions[i].viewobject = view;
    App.questions[i].type = "aosl";
    App.questions[i].subtype = subtype;
    App.draw(i);
}

App.clear = function () {
    document.getElementById("#display-box").innerHTML = "";
    App.questions = []; // cross fingers that no memory leaks occur
}

App.generateAll = function () {
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

        // Make question and question view
        App.generate(i);
    }
}

App.chooseQuestion = function () {
    // need to choose between types at some point
    return App.chooseAosl();
}

App.chooseAosl = function () {
    // choose a type of question and generate it
    // return both the (sub)type and the question
    let selected_subtypes = document.querySelectorAll(".subtype:checked");
    let diceroll = randBetween(0,subtypes.length-1);
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
}

App.makeview = function (aosl,subtype,radius) {
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
            throw new Error "No appropriate subtype of question";
    }
    return view;
}

/* TODO: All of these just make use of the Question.showAnswer() [or Aosl.showAnswer()] methods and similar
 * None of these are implemented, however
 */

App.showAnswer = function (i) {
    App.questions[i].viewobject.showAnswer();
    App.redraw(i);
}

App.hideAnswer = function (i) {
    App.questions[i].viewobject.hideAnswer();
    App.redraw(i);
}

App.hideAnswer = function (i) {
    App.questions[i].viewobject.toggleAnswer();
    App.redraw(i);
}

App.showAllAnswers = function () {
    App.questions.forEach( function(q,idx) {
        q.viewobject.showAnswer();
        App.redraw(i);
    });
}

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
    canvas_width: 300,
    canvas_height: 250,
    radius: 100
}
