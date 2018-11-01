/*TODOs -
 - look for unused vars
 - css
 - sounds (replace/edit the current sound)
 - check possible use of aria-live
 - what do we do with long text values in the wheel?
 - make wheel spin atleast one time if target is too close to current index
 - resources
 - permalink
*/

let spinButton;
let data, resourceData;

let topicSection;

let topicWheel, actionWheel, technologyWheel;

let topics = [];
let actions = [];
let technologies = [];

let currentAction, currentTopic, currentTechnology;

// number of items in slot machine window
// an odd number is recommended so we can have a clear mid point
let itemsInSlotWindow = 5;

// we will be using position of element to move things
let slotWindowStartPos;
let distBetweenItemsInWindow;

let clickSound;

function preload() {
  data = loadJSON('data/generator.json');

  //listed public domain
  clickSound = loadSound('sound/Stapler-SoundBible.com-374581609.mp3');

  // resourceData = loadJSON('data/resources.json');
}

function setup() {
  frameRate(60);

  topicWheel = new Wheel(
    '#topics',
    data.topic,
    itemsInSlotWindow,
    floor(data.topic.length + random(data.topic.length))
  );
  actionWheel = new Wheel(
    '#actions',
    data.action,
    itemsInSlotWindow,
    floor(data.action.length + random(data.action.length))
  );
  technologyWheel = new Wheel(
    '#technologies',
    data.technology,
    itemsInSlotWindow,
    floor(data.technology.length + random(data.technology.length))
  );

  let params = getURLParams();
  console.log(params);
  //startSpin();
  startSpin(
    null,
    (params.topic)?params.topic:floor(random(data.topic.length)),
    (params.action)?params.action:floor(random(data.action.length)),
    (params.tech)?params.tech:floor(random(data.technology.length))
  );

  spinButton = select('button');
  spinButton.mouseClicked(startSpin);
}

function draw() {
  if (topicWheel.spin) {
    topicWheel.move();
  }
  if (actionWheel.spin) {
    actionWheel.move();
  }
  if (technologyWheel.spin) {
    technologyWheel.move();
  }
}

function startSpin(
  clickEvent,
  targetTopic = floor(random(data.topic.length)),
  targetAction = floor(random(data.action.length)),
  targetTechnology = floor(random(data.technology.length))
) {

  // console.log("startSpin", targetTopic, targetAction, targetTechnology);
  // console.log("startSpin", targetTopic, data.topic[targetTopic]);

  topicWheel.target = targetTopic;
  topicWheel.spin = true;
  topicWheel.resetAriaHidden();

  actionWheel.target = targetAction;
  actionWheel.spin = true;
  actionWheel.resetAriaHidden();

  technologyWheel.target = targetTechnology;
  technologyWheel.spin = true;
  technologyWheel.resetAriaHidden();

  // form permalink
  let permalink = `?topic=${targetTopic}&action=${targetAction}&tech=${targetTechnology}`;
  console.log(permalink);

  select('#permalink')
    .show()
    .attribute('href', permalink);

  // ultra magical prediction system.
  print(
    'make a project about ' +
      data.topic[targetTopic] +
      ' that ' +
      data.action[targetAction] +
      ' with ' +
      data.technology[targetTechnology]
  );
}
