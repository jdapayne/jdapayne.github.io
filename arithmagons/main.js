!function(e){var t={};function n(s){if(t[s])return t[s].exports;var i=t[s]={i:s,l:!1,exports:{}};return e[s].call(i.exports,i,i.exports,n),i.l=!0,i.exports}n.m=e,n.c=t,n.d=function(e,t,s){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:s})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var s=Object.create(null);if(n.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)n.d(s,i,function(t){return e[t]}.bind(null,i));return s},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){"use strict";function s(e,t,n){return n||(n=function(){return function(e){let t=0;for(let n=0;n<e;n++)t+=Math.random();return t/e}(2)}),e+Math.floor(n()*(t-e+1))}function i(e,t,n){for(var s=(t=(t=t.replace(/\[(\w+)\]/g,".$1")).replace(/^\./,"")).split("."),i=0,o=s.length-1;i<o;++i){var a=s[i];if(!(a in e))return;e=e[a]}if(void 0===n)return e[s[o]];e[s[o]]=n}n.r(t);class o{constructor(e,t){this.x=e,this.y=t}rotate(e){var t,n;return t=Math.cos(e)*this.x-Math.sin(e)*this.y,n=Math.sin(e)*this.x+Math.cos(e)*this.y,this.x=t,this.y=n,this}scale(e){return this.x=this.x*e,this.y=this.y*e,this}translate(e,t){return this.x+=e,this.y+=t,this}clone(){return new o(this.x,this.y)}equals(e){return this.x===e.x&&this.y===e.y}moveToward(e,t){const n=o.unitVector(this,e);return this.translate(n.x*t,n.y*t),this}static fromPolar(e,t){return new o(Math.cos(t)*e,Math.sin(t)*e)}static fromPolarDeg(e,t){return t=t*Math.PI/180,o.fromPolar(e,t)}static mean(...e){let t=e.map(e=>e.x).reduce((e,t)=>e+t),n=e.map(e=>e.y).reduce((e,t)=>e+t),s=e.length;return new o(t/s,n/s)}static min(e){let t=e.reduce((e,t)=>Math.min(e,t.x),1/0),n=e.reduce((e,t)=>Math.min(e,t.y),1/0);return new o(t,n)}static max(e){let t=e.reduce((e,t)=>Math.max(e,t.x),-1/0),n=e.reduce((e,t)=>Math.max(e,t.y),-1/0);return new o(t,n)}static center(e){const t=e.reduce((e,t)=>Math.min(e,t.x),1/0),n=e.reduce((e,t)=>Math.min(e,t.y),1/0),s=e.reduce((e,t)=>Math.max(e,t.x),-1/0),i=e.reduce((e,t)=>Math.max(e,t.y),-1/0);return new o((s+t)/2,(i+n)/2)}static unitVector(e,t){const n=t.x-e.x,s=t.y-e.y,i=Math.hypot(n,s);return{x:n/i,y:s/i}}static distance(e,t){return Math.hypot(e.x-t.x,e.y-t.y)}static repel(e,t,n,s){const i=Math.hypot(e.x-t.x,e.y-t.y);if(i>=n)return!1;const o=(s-i)/2;return e.moveToward(t,-o),t.moveToward(e,-o),!0}}class a{constructor(e,t,n,s){this.question=e,this.width=t,this.height=n,this.answered=!1,this.rotation=s,this.success=!0}get allpoints(){return[]}showAnswer(){if(!this.answered)return this.labels.forEach(e=>{e.text=e.texta,e.style=e.stylea}),this.answered=!0}hideAnswer(){if(this.answered)return this.labels.forEach(e=>{e.text=e.textq,e.style=e.styleq}),this.answered=!1}toggleAnswer(){return this.answered?this.hideAnswer():this.showAnswer()}scale(e){this.allpoints.forEach(function(t){t.scale(e)})}rotate(e){return this.allpoints.forEach(function(t){t.rotate(e)}),e}translate(e,t){this.allpoints.forEach(function(n){n.translate(e,t)})}randomRotate(){var e=2*Math.PI*Math.random();return this.rotate(e),e}scaleToFit(e,t,n){let s=o.min(this.allpoints),i=o.max(this.allpoints),a=i.x-s.x,r=i.y-s.y;this.scale(Math.min((e-n)/a,(t-n)/r)),s=o.min(this.allpoints),i=o.max(this.allpoints);const l=o.mean([s,i]);this.translate(e/2-l.x,t/2-l.y)}}a.styles=new Map([["normal",{font:"16px Arial",colour:"Black",align:"center",baseline:"middle"}],["answer",{font:"16px Arial",colour:"Red",align:"center",baseline:"middle"}],["extra-answer",{font:"16px Arial",colour:"Red",align:"left",baseline:"bottom"}],["extra-info",{font:"16px Arial",colour:"Black",align:"left",baseline:"bottom"}]]);function r(){}n.d(t,"default",function(){return r}),window.addEventListener("DOMContentLoaded",function(){r.init()}),r.init=function(){r.settings.toPage(),document.getElementById("generate").addEventListener("click",function(e){e.preventDefault(),r.generateAll()}),document.getElementById("showoptions").addEventListener("click",r.toggleOptions),document.getElementById("display-box").addEventListener("click",function(e){let t=e.target;if(t.classList.contains("refresh")){let e=t.closest(".question-container").dataset.question_index;r.hideAnswer(e),r.generate(e)}else if(t.classList.contains("answer-toggle")){let e=t.closest(".question-container").dataset.question_index;r.toggleAnswer(e,t)}}),document.getElementById("show-answers").addEventListener("click",r.toggleAllAnswers),document.addEventListener("change",function(e){r.settings.fromPage(),"options-type"===e.target.name&&r.toggleHidden(["options-advanced","options-simple"])}),document.getElementById("zoom").addEventListener("click",function(e){const t=e.target;"zoomin"===t.id?r.zoom(1):"zoomout"==t.id&&r.zoom(-1)}),document.body.addEventListener("click",function(e){const t=e.target;t.dataset.modal&&(r.modalOpen(t.dataset.modal),e.preventDefault())}),document.getElementById("modal-overlay").addEventListener("click",function(e){e.target.closest(".modal")||r.modalClose()})},r.toggleOptions=function(e){let t=document.getElementById("showoptions"),n=document.getElementById("options").classList.toggle("hidden");t.innerHTML=n?"Show options":"Hide options",e&&e.preventDefault()},r.toggleAnswer=function(e){let t=r.questions[e].viewobject.toggleAnswer();r.draw(e);let n=r.questions[e].container;n.classList.toggle("answer");let s=n.querySelector(".answer-toggle");s.innerHTML=t?"Hide answer":"Show answer"},r.showAnswer=function(e){r.questions[e].viewobject.showAnswer(),r.draw(e);let t=r.questions[e].container;t.classList.add("answer"),t.querySelector(".answer-toggle").innerHTML="Hide answer"},r.hideAnswer=function(e){r.questions[e].viewobject.hideAnswer(),r.draw(e);let t=r.questions[e].container;t.classList.remove("answer"),t.querySelector(".answer-toggle").innerHTML="Show answer"},r.hideAllAnswers=function(){r.questions.forEach(function(e,t){r.hideAnswer(t)}),document.getElementById("show-answers").innerHTML="Show answers",r.answered=!1},r.showAllAnswers=function(){r.questions.forEach(function(e,t){r.showAnswer(t)}),document.getElementById("show-answers").innerHTML="Hide answers",r.answered=!0},r.toggleAllAnswers=function(e){r.answered?r.hideAllAnswers():r.showAllAnswers(),e&&e.preventDefault()},r.answered=!1,r.chooseQDifficulty=function(e){},r.chooseQRandom=function(){return r.chooseQ()},r.chooseQ=function(e,t,n){return new class{constructor(e){const t=Object.assign({},{min:0,max:20,op:(e,t)=>e+t,opname:"+",n:3,diff:1},e);this.op=t.op,this.opname=t.opname,this.n=t.n,this.vertices=[];for(let e=0;e<this.n;e++)this.vertices[e]={val:s(t.min,t.max,Math.random),hidden:!1};this.sides=[];for(let e=0;e<this.n;e++)this.sides[e]={val:this.op(this.vertices[e].val,this.vertices[(e+1)%this.n].val),hidden:!1};switch(t.diff){case 1:this.sides.forEach(e=>{e.hidden=!0});break;case 2:this.sides.forEach(e=>{e.hidden=!0});const e=s(0,this.n-1,Math.random),n=Math.random()<.5?e:(e+1)%this.n;this.sides[e].hidden=!1,this.vertices[n].hidden=!0;break;case 3:this.vertices.forEach(e=>{e.hidden=!0});break;default:throw new Error("no_difficulty")}console.log(this)}}(r.settings.options)},r.makeView=function(e,t){return new class extends a{constructor(e,t,n,s){super(e,t,n,s);const i=.35*Math.min(t,n),a=this.question.n;this.O=new o(0,0),this.vertices=[];for(let e=0;e<a;e++){const t=e*Math.PI*2/a-Math.PI/2;this.vertices[e]=o.fromPolar(i,t)}this.sides=[];for(let e=0;e<a;e++)this.sides[e]=o.mean(this.vertices[e],this.vertices[(e+1)%a]);const r=o.min(this.allpoints),l=o.max(this.allpoints),c=o.mean(r,l);this.translate(t/2-c.x,n/2-c.y),this.labels=[],this.question.vertices.forEach((e,t)=>{this.labels.push({pos:this.vertices[t],textq:e.hidden?"":e.val.toString(),texta:e.val.toString(),styleq:"normal",stylea:e.hidden?"answer":"normal"})}),this.question.sides.forEach((e,t)=>{this.labels.push({pos:this.sides[t],textq:e.hidden?"":e.val.toString(),texta:e.val.toString(),styleq:"normal",stylea:e.hidden?"answer":"normal"})}),this.labels.push({pos:this.O,textq:this.question.opname,texta:this.question.opname,styleq:"normal",stylea:"normal"}),this.labels.forEach(e=>{e.text=e.textq,e.style=e.styleq})}get allpoints(){return[this.O].concat(this.vertices).concat(this.sides)}drawIn(e){const t=Math.min(.1*Math.min(this.width,this.height),25),n=e.getContext("2d"),s=this.question.n;n.beginPath();for(let e=0;e<s;e++){const t=this.vertices[e],i=this.vertices[(e+1)%s];n.moveTo(t.x,t.y),n.lineTo(i.x,i.y)}n.stroke(),n.closePath();for(let e=0;e<s;e++)n.beginPath(),n.arc(this.vertices[e].x,this.vertices[e].y,t,0,2*Math.PI),n.stroke(),n.fillStyle="white",n.fill(),n.closePath();for(let e=0;e<s;e++)n.beginPath(),n.rect(this.sides[e].x-.7*t,this.sides[e].y-.7*t,1.4*t,1.4*t),n.stroke(),n.fillStyle="white",n.fill(),n.closePath();this.labels.forEach(function(e){n.font=a.styles.get(e.style).font,n.fillStyle=a.styles.get(e.style).colour,n.textAlign=a.styles.get(e.style).align,n.textBaseline=a.styles.get(e.style).baseline,n.fillText(e.text,e.pos.x,e.pos.y)})}}(e,r.settings.canvas_width,r.settings.canvas_height,t)},r.clear=function(){document.getElementById("display-box").innerHTML="",r.questions=[],document.getElementById("show-answers").removeAttribute("disabled"),r.hideAllAnswers()},r.draw=function(e){const t=r.questions[e].viewobject,n=r.questions[e].container.querySelector("canvas");t.drawIn(n)},r.reDraw=function(e){const t="number"==typeof e?r.questions[e]:e,n=t.container.querySelector("canvas");n.width=r.settings.canvas_width,n.height=r.settings.canvas_height;const s=t.viewobject,i=s.question,o=r.makeView(i,s.rotation);t.viewobject=o,o.drawIn(n)},r.drawAll=function(){r.questions.forEach(function(e){const t=e.viewobject,n=e.container.querySelector("canvas");t.drawIn(n)})},r.generate=function(e){let t,n;for(;!n||!n.success;){if("basic"===r.settings.options_mode){let n=r.settings.mindiff+e*(r.settings.maxdiff-r.settings.mindiff+1)/r.settings.n_questions,s=Math.floor(n);console.log("difficulty for "+e+" : "+n+" -> "+s),t=r.chooseQDifficulty(s)}else t=r.chooseQRandom();n=r.makeView(t)}r.questions[e]=Object.assign({},r.questions[e],{viewobject:n,type:t.type,subtype:t.subtype}),r.draw(e)},r.generateAll=function(){r.clear();let e=r.settings.n_questions;for(let t=0;t<e;t++){let e=document.createElement("div");e.className="question-container",e.dataset.question_index=t;let n=document.createElement("canvas");n.width=r.settings.canvas_width,n.height=r.settings.canvas_height,n.className="question-view",e.append(n);let s=document.createElement("img");s.src="refresh.png",s.className="refresh",s.width=15,s.height=15,e.append(s);let i=document.createElement("div");i.innerHTML="Show answer",i.className="answer-toggle",e.append(i),document.getElementById("display-box").append(e),r.questions[t]=Object.assign({},r.questions[t],{container:e}),r.generate(t)}},r.zoom=function(e){r.settings.zoom+=.1*e,r.settings.canvas_width=r.settings.canvas_width_base*r.settings.zoom,r.settings.canvas_height=r.settings.canvas_height_base*r.settings.zoom,r.questions.forEach(function(e){r.reDraw(e)})},r.questions=[],r.settings={canvas_width_base:250,canvas_height_base:250,canvas_width:250,canvas_height:250,zoom:1,mindiff:1,maxdiff:5,options:{min:-20,max:20,n:3,diff:2},n_questions:8},r.settings.fromPage=function(){const e=document.getElementsByClassName("option");for(let t=0,n=e.length;t<n;++t){const n=e[t],s=isNaN(n.value)?n.value:Number(n.value);let o=n.dataset.setting;o.endsWith("[]")?(i(this,o=o.slice(0,-2))||i(this,o,new Set),n.checked?i(this,o).add(s):i(this,o).delete(s)):"checkbox"===n.type?i(this,o,!!n.checked):(n.checked||"radio"!==n.type&&"checkbox"!==n.type)&&i(this,o,s)}console.log("settings updated:"),console.log(this)},r.settings.toPage=function(){const e=document.getElementsByClassName("option");for(let t=0,n=e.length;t<n;++t){const n=e[t],s=n.value;let o=n.dataset.setting;o.endsWith("[]")?i(this,o=o.slice(0,-2)).has(s)?n.checked=!0:n.checked=!1:"radio"===n.type?i(this,o)===s&&(n.checked=!0):"checkbox"===n.type?n.checked=!!i(this,o):n.value=i(this,o)}},r.modalOpen=function(e){const t=document.getElementById(e)||document.getElementById("default-modal");if(t.classList.contains("modal")){const e=document.getElementById("modal-overlay");e.appendChild(t),e.classList.remove("hidden")}},r.modalClose=function(){const e=document.getElementById("modal-overlay"),t=e.getElementsByClassName("modal");for(;t.length>0;)document.body.appendChild(t[0]);e.classList.add("hidden")},r.toggleHidden=function(e){for(let t=0;t<e.length;t++)document.getElementById(e[t]).classList.toggle("hidden")}}]);