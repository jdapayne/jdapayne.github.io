//Loads the question (as latex) into a div
//Note: On a preview page, this loads the first question only
var questiondata = JSON.parse($("[data-question]").attr("data-question"));
var thequestion = $("<div/>", {html: questiondata.latex});

// For testing purposes: strip out the body and insert the question
$("body").html("");
$("body").removeClass();
$("body").append(thequestion)

// Typeset
MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
