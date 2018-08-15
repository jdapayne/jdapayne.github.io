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
