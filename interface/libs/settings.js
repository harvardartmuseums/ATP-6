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
    sunCount: 0,
    snapshotCount: 0,
    trees: [],
    suns: [],
    snapshots: [],

    addController: function(id) {this.controllerCount +=1},    
    removeController: function (id) {this.controllerCount -=1;},
    
    addWindow: function(id) {this.windowCount +=1},    
    removeWindow: function (id) {this.windowCount -=1;},

    addTree: function(data) {this.trees.push(data); this.treeCount = this.trees.length},
    addSun: function(data) {this.suns.push(data); this.sunCount = this.suns.length},
    addSnapshot: function(data) {this.snapshots.push(data); this.snapshotCount = this.snapshots.length}
};
