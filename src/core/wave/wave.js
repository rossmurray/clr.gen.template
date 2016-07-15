import WaveConfig from './WaveConfig.js';
import utility from './utility.js';
import WaveBuilder from './WaveBuilder.js';

function configure(config) {
    const validated = validateConfig(config);
    const result = utility.configToFx(validated);
    return result;
}

function validateConfig(config) {
    const identity = new WaveConfig();
    if(!config) {
        return identity;
    }
    const validated = {
        carrier: config.carrier || identity.carrier,
        frequency: config.frequency || identity.frequency,
        frequencyModula: config.frequencyModula || identity.frequencyModula,
        rangeMin: config.rangeMin || identity.rangeMin,
        rangeMax: config.rangeMax || identity.rangeMax,
        rangeModulator: config.rangeModulator || identity.rangeModulator,
        phaseShift: config.phaseShift || identity.phaseShift,
        phaseModulator: config.phaseModulator || identity.phaseModulator,
        carrierRangeMin: config.carrierRangeMin || identity.carrierRangeMin,
        carrierRangeMax: config.carrierRangeMax || identity.carrierRangeMax,
        carrierFrequency: config.carrierFrequency || identity.carrierFrequency
    };
    return validated;
}

const wave = fx => new WaveBuilder(fx);
wave.configure = configure;

export default wave;