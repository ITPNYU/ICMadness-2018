class Wheel {
  constructor(x, y, w, h, d) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.data = d.concat(d.concat(d).concat(d));
    //this.data = d;

    this.boxHeight = this.h / 6;
    this.positions = [];
    this.colors = [];
    for (let i = 0; i < this.data.length; i++) {
      this.positions.push((this.x + 4 * this.boxHeight) - (i * this.boxHeight));
      this.colors.push(color(random(0, 255), random(0, 255), random(0, 255)));
    }
    console.log(this.positions);
    this.speed = 0;
    this.on = false;
    this.minSpeed = 1;
    this.acceleration = 0.99;
    this.done = false;
    this.selected = -1;
    this.frameColor = color(random(0, 255), random(0, 255), random(0, 255));
  }
  display() {
    noStroke();
    //fill(this.frameColor);
    fill(0);
    rect(this.x, this.y, this.w, this.h);
    for (let i = 10; i < 50; i++) {
      let o = map(i, 10, 50 - 1, 0, 255);
      fill(255, 255, 255, o);
      rect(this.x + i, this.y + i, this.w - 2 * i, this.h - 2 * i, 20);
    }


    if (this.done) {
      stroke(random(0, 255), random(0, 255), random(0, 255));
      strokeWeight(5);
      line(this.x + 50, this.y + this.h / 2 + 20, this.x + this.w - 50, this.y + this.h / 2 + 20);
    }
    noStroke();

    for (let i = 0; i < this.data.length; i++) {
      if (this.positions[i] > this.y && this.positions[i] < this.y + this.h - this.boxHeight) {
        //rect(this.x, this.positions[i], this.w, this.boxHeight);
        textAlign(CENTER, TOP);
        textSize(16);
        noStroke();
        fill(this.colors[i]);
        text(this.data[i], this.x + this.w / 2, this.positions[i] + this.boxHeight / 2);
      }
    }


  }
  move() {
    if (this.on) {
      for (let i = 0; i < this.data.length; i++) {
        this.positions[i] += this.speed;
        if (this.positions[i] > this.y + this.h) {
          this.positions[i] -= this.data.length * this.boxHeight;
        }
      }
      if (this.speed > this.minSpeed) {
        this.speed *= this.acceleration;
      } else {
        this.speed = this.minSpeed;
        for (let i = 0; i < this.data.length; i++) {
          if (abs((this.positions[i] + this.boxHeight / 2) - (this.y + this.h / 2)) <= 3) {
            this.selected = i;
            this.done = true;
            this.speed = 0;
          }
        }
      }
    }
  }

  restart(speed) {
    this.on = true;
    this.done = false;
    // Bad hack to get selected before running
    speed = speed || random(10, 40);
    this.speed = speed;
    let pos_cache = this.positions.slice();
    this.selected = -1;
    while(this.selected === -1) {
      this.move();
    }

    this.on = true;
    this.done = false;
    this.positions = pos_cache;
    this.speed = speed;
  }

  result() {
    return this.data[this.selected];
  }

  target(str) {
    let ids = [];
    for(let id = this.data.indexOf(str); id !== -1; id = this.data.indexOf(str, id + 1)) {
      ids.push(id);
    }
    let speed = null;
    if(ids) {
      let tempSpeed = this.minSpeed;
      let positions = ids.map(id => this.positions[id]);
      while(!speed) {
        tempSpeed /= this.acceleration;
        for(let i = 0; i < positions.length; i++) {
          positions[i] += tempSpeed;
          if (positions[i] > this.y + this.h) {
            positions[i] -= this.data.length * this.boxHeight;
          }
          if(tempSpeed > 20 && abs((positions[i] + this.boxHeight / 2) - (this.y + this.h / 2)) <= this.boxHeight / 2) {
            speed = tempSpeed;
          }
        }
        if(tempSpeed > 100) break;
      }
    }
    this.restart(speed);
  }
}
