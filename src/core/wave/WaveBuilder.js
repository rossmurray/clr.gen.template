import WaveConfig from './WaveConfig.js';
import utility from './utility.js';
import builtins from './builtins.js';

const WaveBuilder = class WaveBuilder {
    constructor(fx) {
        const cfg = new WaveConfig();
        cfg.carrier = fx;
        this._privates = cfg;
    }

    compile() {
        const config = this._privates.copy();
        config.carrier = compileFx(config.carrier);
        config.frequencyModulator = compileFx(config.frequencyModulator);
        config.rangeModulator = compileFx(config.rangeModulator);
        config.phaseModulator = compileFx(config.phaseModulator);
        const result = utility.configToFx(config);
        return result;
    }

    frequency(frequency) {
        const newState = this._privates.copy();
        newState.frequency = frequency;
        return exportAsCallable(this, newState);
    }

    range(min, max) {
        const newState = this._privates.copy();
        newstate.rangeMin = min;
        newstate.rangeMax = max;
        return exportAsCallable(this, newState);
    }

    phaseShift(shiftPeriod) {
        const newState = this._privates.copy();
        newState.phaseShift = shiftPeriod;
        return exportAsCallable(this, newState);
    }

    frequencyModulator(modulator) {
        const newState = this._privates.copy();
        newstate.frequencyModulator = modulator;
        return exportAsCallable(this, newState);
    }
    
    rangeModulator(modulator) {
        const newState = this._privates.copy();
        newState.rangeModulator = modulator;
        return exportAsCallable(this, newState);
    }

    phaseModulator(modulator) {
        const newState = this._privates.copy();
        newState.phaseModulator = modulator;
        return exportAsCallable(this, newState);
    }

    fromFrequency(frequency) {
        const newState = this._privates.copy();
        newState.carrierFrequency = frequency;
        return exportAsCallable(this, newState);
    }

    fromRange(min, max) {
        const newState = this._privates.copy();
        newState.carrierRangeMin = min;
        newState.carrierRangeMax = max;
        return exportAsCallable(this, newState);
    }

    doubleBack() {
        const outer = this;
        const inner = x => builtins.triangle(x);
        const composed = new WaveBuilder(x => this(inner(x)));
        return exportAsCallable(composed);
    }
}

function exportWithChange(original, fnChange) {
    const privateCopy = original._privates.copy();
    const result = exportAsCallable(original, privateCopy);
    result._privates = privateCopy;
    return fnChange.apply(result, arguments);
}

function compileFx(fn) {
    const result = typeof fn.compile === 'function'
        ? fn.compile()
        : fn;
    return result;
}

function exportAsCallable(waveBuilder, newPrivateState) {
    const compiled = compileFx(waveBuilder);
    const result = x => compiled(x);
    result._privates = newPrivateState || waveBuilder._privates;
    result.compileFx = WaveBuilder.prototype.compileFx;
    result.frequency = WaveBuilder.prototype.frequency
    result.range = WaveBuilder.prototype.range;
    result.phaseShift = WaveBuilder.prototype.phaseShift;
    result.frequencyModulator = WaveBuilder.prototype.frequencyModulator;
    result.rangeModulator = WaveBuilder.prototype.rangeModulator;
    result.phaseModulator = WaveBuilder.prototype.phaseModulator;
    result.fromFrequency = WaveBuilder.prototype.fromFrequency;
    result.fromRange = WaveBuilder.prototype.fromRange;
    result.doubleBack = WaveBuilder.prototype.doubleBack;
    return result;
}

function exportCopy(waveBuilder) {
    const compiled = waveBuilder.compile();
    const result = x => compiled(x);
    const privates = waveBuilder._privates;
    result._privates = privates;
}

export default WaveBuilder;