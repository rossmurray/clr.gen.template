import * as mainLoop from "mainloop.js";
import * as husl from "husl";

function start() {
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    canvas.width = window.innerWidth - 10;
    canvas.height = window.innerHeight - 10;

    mainLoop.setUpdate(mainUpdate);
    mainLoop.setDraw(mainDraw);
    mainLoop.setEnd(mainEnd);
    mainLoop.setMaxAllowedFPS(60);
    mainLoop.start();
}

function mainUpdate(deltaMs) {

}

function mainDraw(interpolationPercentage) {

}

function mainEnd(fps, panic) {
    if(panic) {
        var discardedTime = Math.round(MainLoop.resetFrameDelta());
        console.warn('Main loop panicked, probably because the browser tab was put in the background. Discarding ' + discardedTime + 'ms');
    }
}

export { start };