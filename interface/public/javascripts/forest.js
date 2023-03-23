const forest = (sketch) => {

    let canvas;
    let snapshotFilename = 'forest-snapshot';
    const trees = [];

    sketch.preload = () => {
    }

    sketch.setup = () => {
        socket.on("cast", sketch.createTree);
        socket.on("clear", sketch.clearForest);
        socket.on("snapshot", sketch.saveSnapshot);

        sketch.textSize(20);

        canvas = sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
    }

    sketch.windowResized = () => {
        sketch.resizeCanvas(sketch.windowWidth, sketch.windowHeight);
    }

    sketch.draw = () => {
        sketch.clear();

        for (let tree of trees) {
            tree.update();
            if (tree.isAlive) {
                tree.render();
            }
        }
    }

    sketch.drawTree = (data) => {
        xPos = sketch.random(0,sketch.windowWidth);
        yPos = sketch.random(sketch.windowHeight/2, sketch.windowHeight);
        trees.push(new Tree(sketch, xPos, yPos, sketch.random(100, sketch.windowHeight/2.10), data));
    }

    sketch.createTree = (data) => {
        // incoming data looks like
        //   {leaf: "IMAGE_URL", branch: "IMAGE_URL", objectID: 000000}
        sketch.drawTree({leaf: data.annotations[0].imageUrl, branch: data.annotations[1].imageUrl, objectID: data.objectID});
    }

    sketch.clearForest = () => {
        trees.length = 0;
    }

    sketch.saveSnapshot = () => {
        sketch.saveCanvas(canvas, snapshotFilename, 'png');
    }

    sketch.keyTyped = () => {
        if (sketch.key === 's') {
        }
        // prevent any default browser behavior
        return false;
    }
};