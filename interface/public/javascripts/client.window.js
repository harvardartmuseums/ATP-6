let animation;
let spacetime;
let spaceTimeContainer;
let socket = io("/window");

document.addEventListener("DOMContentLoaded", event => { 
    animation = new p5(forest);

    spaceTimeContainer = document.getElementById("spacetime");    
    spacetime = new SpaceTime(spaceTimeContainer);
    
    timer = window.setInterval(() => {spacetime.populate();spacetime._eraseColors();},30000);
});


// Helper classes
class SpaceTime {
    constructor(containerElement) {
        this.id = (Math.floor(new Date() / 1000)).toString(36);

        this.parentElement = containerElement;
        this.container;
        this.width = window.outerWidth;
        this.height = window.outerHeight;
        
        this.origin = {x: 0, y: 0};
        this.counter = 0;
        this.threshold = 3;
        this.multiplier = 3;
        this.speed = 1;
        this.ringScaleFactor = 100;
        this.planetScaleFactor = 25;        

        this._createElements();
        this._updateOrigin();
    }

    _updateOrigin() {
        this.origin = {
            x: this.width/2,
            y: this.height/2
        };    
    }

    _createElements() {
        this.container = d3.select(this.parentElement)
                            .append('svg')
                                .attr('id', `${this.id}_universe`)
                                .attr('width', this.width)
                                .attr('height', this.height)
                                // .style('visibility', 'hidden')
                                .style('position', 'absolute');        
    }
    
    _calculateRadius(d) {
        return d.percent*(this.multiplier*this.ringScaleFactor);
    }
    
    _calculatePlanetRadius(d) {
        return d.percent*(this.multiplier*this.planetScaleFactor);
    }
    
    _getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
    } 
    
    _generateRandomTranslation() {
        var x = this._getRandomInt(0, this.width);
        // var y = this._getRandomInt(0, this.height);
        var y = -500;
        
        return "translate(" + x + ", " + y + ")";
    }

    _eraseColors() {
        let deadAge = this.counter - this.threshold;
        d3.selectAll("g[data-age='" + deadAge + "']")
            .transition()
                .style("opacity", "0")
                .duration(1000)
                .each("end", function() {d3.select(this).remove();});
    }

    async populate() {
        let apiParameters = new URLSearchParams({
                                    sort: "random",
                                    color: "any",
                                    classification: "Paintings",
                                    q: 'totalpageviews:>75',
                                    fields: "objectid,title,url,colors,gallery,totalpageviews",
                                    size: 1
                                });

        let query = `/data/object?${apiParameters.toString()}`;

        const data = await d3.json(query);
        if (data) {
            // scrub and adjust the incoming data as needed
            // start building the visualization
            let system = this.container.selectAll(".systems")
                            .data(data.records)
                            .enter()
                            .append("g")
                            .attr("data-age", this.counter)
                            .attr("data-source", data.records[0].source)
                            .attr("class", "system")
                            .attr("transform", d => `translate(${this.origin.x}, ${this.origin.y+250})`);

            let entity = system.selectAll("g")
                            .data(data.records[0].colors)
                            .enter()
                                .append("g")
                                .attr("class", "entity");

            entity.append("circle")
                .attr("class", "orbit")
                .attr("r", this._calculateRadius.bind(this))
                .attr("cx", 0)
                .attr("cy", 0)
                .style("fill", d => d.color)
                .style("fill-opacity", 1.0)
                .style("stroke", d => d.color);

            system.transition()
                .duration(d => (100/this.speed)*d.totalpageviews)
                .attr("transform", this._generateRandomTranslation.bind(this))
                .delay(400);
            
            // socket.emit("new sun", {
            //     "url": artwork.records[0].url,
            //     "title": artwork.records[0].title,
            //     "objectid": artwork.records[0].objectid,
            //     "colors": artwork.records[0].colors
            // });         

            this.counter++;
        }          
    }
}