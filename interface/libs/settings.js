module.exports = {
    collections: [
        {name: 'ATP-6', url:'https://harvardartmuseums.org/profile/jeff_steward@harvard.edu/mycollections/7649/atp-6-2/iiif/top'},
        {name: 'Butterflies', url: 'https://harvardartmuseums.org/profile/jeff_steward@harvard.edu/mycollections/3841/butterfly/iiif/top'}
    ],
    currentCollection: {},
    controllerCount: 0,
    windowCount: 0,
    timeOfDay: 0,
    treeDensity: 25,
    treeCount: 0,
    trees: [],
    suns: [],

    addController: function(id) {this.controllerCount +=1},    
    removeController: function (id) {this.controllerCount -=1;},
    
    addWindow: function(id) {this.windowCount +=1},    
    removeWindow: function (id) {this.windowCount -=1;},

    addTree: function(data) {this.trees.push(data); this.treeCount = this.trees.length}
};
