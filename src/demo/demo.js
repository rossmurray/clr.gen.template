import * as mainLoop from "mainloop.js";
import * as husl from "husl";
import "../core/utility.js";
import FunctionBuilder from '../core/functionBuilder';

var totalTimeMs = 0;
var carrierFrequency = 1;
var carrier = configFunction(Math.sin, 1, 0, 0, 1);

var sawtooth = x => x - Math.floor(x);
var context;
var canvas;
var graph = {};

const timeUnit = periodMs => getTimeFromPeriod(periodMs);
const timeOscillator = x => triangle(timeUnit(x));
const triangle = x => Math.abs(((0.5 + x) % 1) - 0.5) * 2;
const sine01 = x => { const result = Math.sin(x * Math.PI * 2) * 0.5 + 0.5; return result > 1 ? 1 : result; }
const timeSine = x => sine01(timeUnit(x));
const testf = x => sine01(x * timeUnit(x) + 2000);

export function start() {
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    canvas.width = window.innerWidth - 10;
    canvas.height = window.innerHeight - 10;
    var xRange = getMinMaxForScreenPercent(0.9, canvas.width);
    var yRange = getMinMaxForScreenPercent(0.9, canvas.height);
    graph.xmin = xRange.min;
    graph.xmax = xRange.max;
    graph.ymin = yRange.min;
    graph.ymax = yRange.max;
    graph.xrange = graph.xmax - graph.xmin;
    graph.yrange = graph.ymax - graph.ymin;

    mainLoop.setUpdate(mainUpdate);
    mainLoop.setDraw(mainDraw);
    mainLoop.setEnd(mainEnd);
    //mainLoop.setMaxAllowedFPS(60);
    mainLoop.start();
}

function mainUpdate(deltaMs) {
    totalTimeMs += deltaMs;
    var zoom = 1;
    const modulator = new FunctionBuilder(x => x * sine01(x))
        .setPeriod(3100)
        .setRange(0.7, 0.9)
        .getFx();
    const sine1 = new FunctionBuilder(x => x * timeSine(33011))
        .setPeriod(2377)
        .setRange(0.4, 0.6)
        .setFrequencyModulation(modulator)
        //.setPhaseShift(timeSine(40000))
        .getFx();
    const sine2 = new FunctionBuilder(x => x * sine01(x))
        .setPeriod(2000)
        .setFrequencyModulation(sine1)
        //.setPhaseShift(timeSine(89600))
        .getFx();
    graph.points = graphFunc(x => sine2(x), zoom);
}

function mainDraw(interpolationPercentage) {
    context.fillStyle = "#222222";
    context.fillRect(0, 0, canvas.width, canvas.height);
    if(graph.points) {
        graphPoints(graph.points, "red");
    }
}

function mainEnd(fps, panic) {
    if(panic) {
        var discardedTime = Math.round(mainLoop.resetFrameDelta());
        console.warn('Main loop panicked, probably because the browser tab was put in the background. Discarding ' + discardedTime + 'ms');
    }
}

//gets 'x' for time-related functions based on the clock and a desired frequency (times-per-second)
//e.g. if the total clock is at 400ms, and we want x for a frequency of 2, this would return 0.8 
function getTimeFromFrequency(frequencyHz) {
    var periodMs = 1000 / frequencyHz;
    return (totalTimeMs % periodMs) / periodMs;
}

//gets 'x' for time-related functions based on the clock and a desired period (ms-per-cycle)
//e.g. if the total clock is at 1500ms, and we want x for a period of 1000, this would return 0.5
function getTimeFromPeriod(periodMs) {
    return (totalTimeMs % periodMs) / periodMs;
}

function sine(x, frequency, phaseShift, rangeMin, rangeMax) {
    var func = makeSineFunc(frequency, phaseShift, rangeMin, rangeMax);
    return func(x);
}

function makeSineFunc(frequencyHz, phaseShift, rangeMin, rangeMax) {
    return configFunction(Math.sin, frequencyHz, phaseShift, rangeMin, rangeMax);
}

function configFunction(func, frequencyHz, phaseShift, rangeMin, rangeMax) {
    var rangeDifference = rangeMax - rangeMin;
    if(rangeDifference <= 0 || frequencyHz == 0) {
        return x => rangeMin;
    }
    var A = rangeDifference / 2;
    var B = Math.PI * 2 * frequencyHz;
    var C = -(phaseShift * B);
    var D = rangeMin;
    var result = x => A * func(B * x + C) + 0.5 + D;
    return result;
}

function fmodulate(f, g) {
    if(typeof g === "function") {
        return x => f(g(x) * x);
    }
    return x => f(g * x);
}

function graphFunc(func, zoomFactor, resolution = 500) {
    //var zoom = -1 * zoomFactor;
    //resolution = Math.floor(new FunctionBuilder(x => timeSine(24701)).setRange(15, 40).getFx()(0));
    var points = [];
    for(var i = 0; i < resolution; i++) {
        var x = i / resolution;
        if(i == resolution - 1) {
            x = 1;
        }
        var y = func(x);
        var point = {x, y};
        points.push(point);
    }
    var result = points.map(p => {
        var x = p.x * graph.xrange + graph.xmin;
        var y = canvas.height - (p.y * graph.yrange + graph.ymin);
        return {x, y};
    });
    return result;
}

function graphPoints(points, color) {
    var lineWidth = 3;
    var fillStyle = color;
    var strokeStyle = color;
    context.beginPath();
    context.linecap = 'butt';
    context.lineJoin = 'bevel';
    context.moveTo(points[0].x, points[0].y);
    for(var i = 1; i < points.length; i++) {
        var p = points[i];
        context.lineTo(p.x, p.y);
    }
    context.lineWidth = lineWidth;
    context.strokeStyle = strokeStyle;
    context.stroke();
}

function getMinMaxForScreenPercent(percent, dimension) {
    var delta = dimension * percent;
    var min = (dimension - delta) / 2;
    var max = min + delta;
    return { min, max };
}