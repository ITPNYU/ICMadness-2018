// A2Z F17
// Daniel Shiffman
// http://shiffman.net/a2z
// https://github.com/shiffman/A2Z-F17

let data;
let resourceData;
let resourceElts = [];
let permalink;
let params;
let first = true;

let casino;
let trip_for_two;

// Here is the grammar
function preload() {
  data = loadJSON('data/generator.json');
  resourceData = loadJSON('data/resources.json');
  casino = loadSound('sound/casino.mp3');
  trip_for_two = loadSound('sound/trip-for-two.mp3');
}

let wheel1;
let wheel2;
let wheel3;
let gotResult = false;

function setup() {
  params = getURLParams();

  createCanvas(1300, 500).parent('canvasContainer');

  generate();

  // A button to generate a new sentence
  //let spin_button = select('#spin_button');
  //spin_button.mousePressed(generate);
  document.getElementById("spin_button").addEventListener("click", generate);
}


function draw() {
  background(0);
  textAlign(LEFT, TOP);
  fill(255);
  text("Make a project about", 20, height / 2);
  wheel1.display();
  wheel1.move();
  fill(255);
  text("that", 545, height / 2);
  wheel2.display();
  wheel2.move();
  fill(255);
  text("with", 915, height / 2);
  wheel3.display();
  wheel3.move();

  // TODO: return the final instructions as text
  // and generate resources
  if (wheel1.done && wheel2.done && wheel3.done && !gotResult) {
    newResults([wheel1.result(), wheel2.result(), wheel3.result()]);
  }
}

function newResults(r) {

  // fade out sound
  casino.fade(0, 1);
  setTimeout(function() {
    trip_for_two.play();
  }, 1200);

  console.log("DONE! Results below");
  console.log(r);
  r.forEach(function(r) {
    console.log(r);
    res = resourceData[r];
    if (res != undefined) {
      console.log('found something');
      console.log(res);
      let container = select("#resources");

      let title = createElement("li", "resources");
      container.child(title);
      resourceElts.push(title);

      let list = createElement("ul", "");
      container.child(list);
      resourceElts.push(list);

      let helpers = res["helpers"];
      if (helpers != undefined) {
        let li = createElement("li", "Ask " + helpers.join(" or "));
        list.child(li);
        resourceElts.push(li);
      }
      let links = res["resources"];
      if (links != undefined) {
        let li = createElement("li", "");
        resourceElts.push(li);
        let linktags = [];
        links.forEach(function(link) {
          linktags.push("<a target='_blank' href='" + link.url + "'>" + link.name + "</a>");
        });
        li.html("Check out " + linktags.join(", "));
        list.child(li);
      }
    }
  });
  gotResult = true;
}


function generate() {
  trip_for_two.fade(0, 1);
  casino.play();

  // clear any resources?
  for (let i = 0; i < resourceElts.length; i++) {
    resourceElts[i].remove();
  }

  wheel1 = new Wheel(200, 0, 320, height, data.topic);
  wheel2 = new Wheel(570, 0, 320, height, data.action);
  wheel3 = new Wheel(940, 0, 320, height, data.technology);
  gotResult = false;
  if (first && params.w1) {
    wheel1.target(atob(decodeURIComponent(params.w1)));
    wheel2.target(atob(decodeURIComponent(params.w2)));
    wheel3.target(atob(decodeURIComponent(params.w3)));
  } else {
    wheel1.restart();
    wheel2.restart();
    wheel3.restart();
  }


  if (!permalink) {
    permalink = createA('', 'permalink');
    permalink.parent('#permalink');
  }
  permalink.attribute('href',
    '?w1=' + encodeURIComponent(btoa(wheel1.result())) +
    '&w2=' + encodeURIComponent(btoa(wheel2.result())) +
    '&w3=' + encodeURIComponent(btoa(wheel3.result())));

  first = false;
}
