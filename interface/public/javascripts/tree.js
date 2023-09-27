class Tree {
    // X, Y => Position
    // Size => maximum height
    // Data => object ID, leaf and branch images
    constructor(sketch, x, y, size, data) {
        this._sketch = sketch;

        this.ready = false;

        this.position = sketch.createVector(x, y);
        this.currentSize = 0;
        this.maxSize = size;
        this.thickness = size/10;
        this.leafImageURL = data.leaf;
        this.branchImageURL = data.branch;
        this.maxLean = sketch.random(1.0, 6.0);
        this.currentLean = this.maxLean;
        this.leanDirection = sketch.random([-1, 1]);
        this.wind = 0.0;    // In radians
        this.windFactor = 0.0;
        this.theta = 0.0;   // In radians
        this.angleOfMovement = 0.0;
        this.growthRate = 0.85; // Or rate of aging
        this.currentAge = 0;
        this.maximumAge = 0;
        this.isAlive = true;
        this.showInfo = true;
        this.data;
       
        sketch.loadImage(this.leafImageURL, img => {
            this.leaf = img;

            sketch.loadImage(this.branchImageURL, img => {
                this.branch = img;

                sketch.loadJSON('/data/object/' + data.objectID, (objectData) => {
                    this.data = objectData;
                    if (objectData.totalpageviews < 250) {
                        this.maximumAge = objectData.totalpageviews*50;
                    } else if (objectData.totalpageviews < 500) {
                        this.maximumAge = objectData.totalpageviews*20;
                    } else if (objectData.totalpageviews < 1000) {
                        this.maximumAge = objectData.totalpageviews*10;
                    } else {
                        this.maximumAge = objectData.totalpageviews;
                    }
                    this.ready = true;
                });

            });
        });
    }

    _createBranch(h, t) {
        // Each branch will be 2/3rds the size of the previous one
        h *= 0.66;  // Height
        t *= 0.66;  // Thickness
        
        // All recursive functions must have an exit condition!!!!
        // Here, ours is when the length of the branch is 10 pixels or less
        if (h > 10) {
          this._sketch.push();    // Save the current state of transformation (i.e. where are we now)
          this._sketch.rotate(this.theta+this.wind);   // Rotate by theta      
          this._sketch.image(this.branch, 0, 0, t, -h);
          this._sketch.translate(0, -h); // Move to the end of the branch
          this._createBranch(h, t);       // Ok, now call myself to draw two new branches!!
          this._sketch.pop();     // Whenever we get back here, we "pop" in order to restore the previous matrix state
          
          if (h < (this.currentSize*0.66)*0.66) {
            this._sketch.push();
            this._sketch.rotate(this.theta+this.wind);
            this._sketch.translate(0, -h);
            this._sketch.image(this.leaf, 0, 0, 2*this.thickness, 2*this.thickness);
            this._sketch.pop();
          }          
          
          // Repeat the same thing, only branch off to the "left" this time!
          this._sketch.push();
          this._sketch.rotate(-(this.theta-this.wind)/this.currentLean);
          this._sketch.image(this.branch, 0, 0, t, -h);
          this._sketch.translate(0, -h);
          this._createBranch(h, t);
          this._sketch.pop();      
          
          if (h < (this.currentSize*0.66)*0.66) {
            this._sketch.push();
            this._sketch.rotate(-(this.theta-this.wind)/this.currentLean);
            this._sketch.translate(0, -h);
            this._sketch.image(this.leaf, 0, 0, 1.25*this.thickness, 1.25*this.thickness);
            this._sketch.pop();
          }
        }
    }  

    update() {
        if (this.ready) {
            if (this.isAlive) {
                // this.currentAge +=0.5;
                this.currentAge +=this.growthRate;

                // Let's pick an angle 0 to 90 degrees based on the mouse position
                // let a = (map(mouseX,0,width,500.0,600.0) / width) * 90.0;
                // This controls the pace of spread
                this.angleOfMovement = (this._sketch.map(this.currentAge,0,this._sketch.windowWidth,400.0,600.0) / this._sketch.windowWidth) * 90.0;
                this.angleOfMovement *= this.leanDirection;

                // Convert it to radians
                this.theta = this._sketch.radians(this.angleOfMovement);    

                if (this.wind != 0) {
                    if (this._sketch.frameCount % 30 == 0) {
                        this.windFactor = this._sketch.radians(this._sketch.random(-1, 1))/30;
                    }
                    this.wind += this.windFactor;
                } 

                if (this.currentAge > this.maximumAge) {
                    this.currentSize -=this.growthRate;
                    this.thickness = this.currentSize/10;
                } else {
                    if (this.currentSize < this.maxSize) {
                        this.currentSize +=this.growthRate;
                        this.thickness = this.currentSize/10;
                    }
                }
        
                this.isAlive = (this.currentSize >= this.growthRate);
            
            } else {
                this.thickness = this.maxSize/10;
            }
        }
    }

    render() {
        if (this.ready) {
            if (this.isAlive) {
                this._sketch.resetMatrix();    
                this._sketch.translate(this.position.x,this.position.y);
                
                // Draw a line 120 pixels
                this._sketch.image(this.branch, 0, 0, this.thickness, -this.currentSize);
                // Move to the end of that line
                this._sketch.translate(0,-this.currentSize);
                // Start the recursive branching!
                this._createBranch(this.currentSize, this.thickness);

            } else {                
                // The tree is dead so draw a stump
                this._sketch.resetMatrix();    
                this._sketch.translate(this.position.x,this.position.y);
                this._sketch.image(this.branch, 0, 0, this.thickness, -75);
            }

            if (this.showInfo) {
                this._drawInfoBox();
            }
        }
    }

    toggleInfo() {
        this.showInfo = !this.showInfo;
    }

    setWind(d) {
        this.wind = this._sketch.radians(d);
    }

    _drawInfoBox() {
        const buffer = 10;
        this._sketch.fill(122);
        this._sketch.resetMatrix(); 
        this._sketch.translate(this.position.x,this.position.y);
        this._sketch.text("Predicted Max Age: " + this.maximumAge, this.thickness + buffer, -buffer*3);
        this._sketch.text("Actual Age: " + this._sketch.round(this.currentAge, 2), this.thickness + buffer, -buffer);
    }

}