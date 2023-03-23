let animation;
let socket = io("/window");

document.addEventListener("DOMContentLoaded", event => { 
    animation = new p5(forest);
});
