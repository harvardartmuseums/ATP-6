const forest = (sketch) => {

    let canvas;
    let snapshotFilename = 'forest-snapshot';
    const trees = [];

    let backgroundColor1 = sketch.color('#111111');
    let backgroundColor2 = sketch.color('#323232');

    sketch.preload = () => {
    }

    sketch.setup = () => {
        socket.on("cast", sketch.createTree);
        socket.on("clear", sketch.clearForest);
        socket.on("snapshot", sketch.saveSnapshot);
        socket.on("toggle-info", sketch.toggleInfo);

        sketch.textSize(20);

        canvas = sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
    }

    sketch.windowResized = () => {
        sketch.resizeCanvas(sketch.windowWidth, sketch.windowHeight);
    }

    sketch.draw = () => {
        sketch.clear();

        // sketch.drawGround(0, sketch.windowHeight/2, sketch.windowWidth, sketch.windowHeight/2, backgroundColor1, backgroundColor2);

        for (let tree of trees) {
            tree.update();
            if (tree.isAlive) {
                tree.render();
            }
        }
    }

    sketch.drawGround = (x, y, w, h, c1, c2) => {
        sketch.noFill();

        // Top to bottom gradient
        for (let i = y; i <= y + h; i++) {
            let inter = sketch.map(i, y, y + h, 0, 1);
            let c = sketch.lerpColor(c1, c2, inter);
            sketch.stroke(c);
            sketch.line(x, i, x + w, i);
        }
    }
      

    sketch.drawTree = (data) => {
        xPos = sketch.random(0,sketch.windowWidth);
        yPos = sketch.random(sketch.windowHeight/2, sketch.windowHeight);
        trees.push(new Tree(sketch, xPos, yPos, sketch.random(100, sketch.windowHeight/2.10), data));
        
        // sort the trees back to front
        trees.sort((a, b) => a.position.y - b.position.y);
    }

    sketch.createTree = (data) => {
        // incoming data looks like
        //   {leaf: "IMAGE_URL", branch: "IMAGE_URL", objectID: 000000}
        sketch.drawTree({leaf: data.annotations[0].imageUrl, branch: data.annotations[1].imageUrl, objectID: data.objectID});
    }

    sketch.toggleInfo = () => {
        for (let tree of trees) {
            tree.toggleInfo();
        }
    }

    sketch.setTimeOfDay = (hour) => {
        // change the ground color
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