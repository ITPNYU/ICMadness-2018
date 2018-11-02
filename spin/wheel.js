class Wheel {
    constructor(parentID, data, count = 5, startIndex = 0) {
        this.count = count;
        this.data = data;
        this.numOfCycles = floor(random(2,5));
        this.startIndex = startIndex;
        this.currentIndex = this.startIndex - this.data.length*this.numOfCycles;
        this.parentID = parentID;
        this.elements = [];
        this.position = [];
        this.target = startIndex;
        this.speed = 5;
        this.difference = 0;

        for (let i = 0; i < this.count; i++) {
            this.elements[i] = createP(this.data[(this.startIndex + i - floor(this.count / 2)) % this.data.length]);
            this.elements[i].parent(this.parentID);
            this.elements[i].attribute('aria-hidden', true);
            this.elements[i].style('color', rgbToHex(int(random(120)), int(random(120)), int(random(120))));
            this.position[i] = this.elements[i].position();
            if (i == floor(this.count / 2)) {
                this.elements[i].attribute('aria-hidden', false);
            } else {
                this.elements[i].style('visibility', 'hidden');
            }
        }

        // this feels hacky?
        this.startTop = this.position[0].y;
        this.currTop = parseInt(this.elements[0].style('top'));
        this.distanceBetweenElements = this.position[1].y - this.position[0].y;

        this.spin = false;
    }

    resetAriaHidden() {
        for (let i = 0; i < this.count; i++) {
            this.elements[i].attribute('aria-hidden', true);
            this.elements[i].style('visibility', 'visible');
        }
    }
    move() {
        this.currTop -= this.speed;

        this.difference = int(this.target) - int(this.currentIndex);
        this.speed = 40 * abs((this.difference) % (this.data.length*this.numOfCycles*2)) / (this.data.length*this.numOfCycles*2);

        // console.log(this.data[this.target],this.target, this.currentIndex, this.difference, (this.data.length*this.numOfCycles), this.speed);
        if (this.currTop < -this.distanceBetweenElements / 2) {
            clickSound.play();
            this.currentIndex++;
            this.startIndex = this.currentIndex + this.data.length*this.numOfCycles;
            this.startIndex %= this.data.length;
            this.elements[0].remove();
            this.currTop = 0;
            this.elements.splice(0, 1);
            this.elements.push(createP(this.data[(this.data.length + this.startIndex + floor(this.count / 2)) % this.data.length]));
            this.elements[this.elements.length - 1].parent(this.parentID);
            this.elements[this.elements.length - 1].attribute('aria-hidden', true);
            this.elements[this.elements.length - 1].style('color', rgbToHex(int(random(120)), int(random(120)), int(random(120))));
        }
        for (let i = 0; i < this.elements.length; i++) {
            this.elements[i].style('top', this.currTop + 'px');
        }
          if (this.difference == 0) {
            this.spin = false;
            this.numOfCycles = floor(random(2,5));
            this.currentIndex = this.startIndex - this.data.length*this.numOfCycles;
            for (let i = 0; i < this.elements.length; i++) {
                if (i == floor(this.elements.length / 2)) {
                    this.elements[i].attribute('aria-hidden', false);
                    this.elements[i].addClass('wrap');
                } else {
                    this.elements[i].style('visibility', 'hidden');
                }
            }
        }
    }
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
