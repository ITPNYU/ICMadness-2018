let data, name, r, n, d ;
let search_button, all_groups, inp;

let group = [];
let groups = [];

let allNames = [];
let allShuffled = [];
// let groupSize = 3;
let seed = 40; //update for new results

let searched = false;

function preload() {
  data = loadTable('data/names.csv', 'csv', 'header');
}

function setup() {

  // dom element for group list
  d = select('#group-lists');
  
  // shuffled names retain sequence based on seed value
  shuffle_names();
  
  // buttons filter/list all groups
  if (searched == false) {
    list_groups();  
  } 

  //get input
  inp = select('#search-text');
  // inp.changed(search); // ?

  //get search button
  search_button = select('#search-button');
  search_button.mousePressed(search);
  
  //get all groups button
  all_groups = select('#all-groups');
  all_groups.mousePressed(list_groups);
}

// add filter with ENTER & RETURN
// & all groups with TAB
function keyPressed() {
  if (keyCode == ENTER || keyCode == RETURN) {
    search();
    return false; // prevent any default behavior
  } else if (keyCode == TAB) {
    list_groups();
  }
}

function shuffle_names(){
  //get all names
  allNames = data.getColumn('Name');

  //shuffle names
  randomSeed(seed);
  for (i = 0; i < data.getRowCount(); i++) {
    n = 0;
    r = floor(random(0, data.getRowCount() - i));
    name = allNames[r];
    allNames.splice(r, 1);
    allShuffled.push(name);
  }
}

function list_groups() {
  searched = false;

  // place shuffled groups/names in dom
  d.html("");

  for (j = 0; j < allShuffled.length; j+=3) {
    if (allShuffled[j+2] == null) {
      n = createP(allShuffled[j] + ",  " + allShuffled[j+1]);
    } else {
      n = createP(allShuffled[j] + ",  " + allShuffled[j+1] + ",  " + allShuffled[j+2]);
    }
    n.parent(d);
  }
}


function search() {
  searched = true;
  
  let regexp = new RegExp(inp.value(), 'i');
  let matches_array, grpstr;
  let return_matches = []; //in case there are multiple matches

  for (j = 0; j < allShuffled.length; j+=3) {
    if (allShuffled[j+2] == null) {
      grpstr = allShuffled[j] + ",  " + allShuffled[j+1];
    } else {
      grpstr = allShuffled[j] + ",  " + allShuffled[j+1] + ",  " + allShuffled[j+2];
    }

    // list all matching groups
    matches_array = grpstr.match(regexp);
    if (matches_array != null) {
      return_matches.push(createP(grpstr));
    }
  }

  //reset html & fill with result
  d.html("");

  for (let p = 0; p < return_matches.length; p++) {
    return_matches[p].parent(d);
  }
}