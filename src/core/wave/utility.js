const utility = class utility {
    static configToSpec(waveConfig) {
        const result = {};
        result.carrier = waveConfig.carrier;
        result.phaseModulator = waveConfig.phaseModulator;
        result.rangeModulator = waveConfig.rangeModulator;
        result.frequencyModulator = waveConfig.frequencyModulator;
        const ad = findAD(waveConfig);
        result.A = ad.A;
        result.D = ad.D;
        result.B = findB(waveConfig);
        result.C = findC(waveConfig);
        return result;
    }

    static specToFx(waveSpec) {
        const af = x => waveSpec.A * waveSpec.rangeModulator(x);
        const bf = x => waveSpec.B * waveSpec.frequencyModulator(x);
        const cf = x => waveSpec.C + waveSpec.phaseModulator(x);
        const result = x => {
            const A = af(x);
            const B = bf(x);
            const C = cf(x);
            const D = waveSpec.D;
            const carrier = waveSpec.carrier
            const y = A * carrier(B * (x + C)) + D;
            //note the form (b * (x + c)), instead of the expected (b * x + c)
            //Normally c is (-phaseShift * b), but the value for c in this class intentionally leaves out the b.
            //This is because if we wait until this function to finally combine b and c, then they can be
            //changed arbitrarily. So therefore instead of (b * x + c) it became (b * x + b * c),
            //which factors to (b * (x + c)).
        };
        return result;    
    }

    static configToFx(waveConfig) {
        return specToFx(configToSpec(waveConfig));
    }
}

function findB(waveConfig) {
    if(waveConfig.carrierFrequency == 0) {
        return 0;
    }
    return waveConfig.frequency / waveConfig.carrierFrequency;
}

function findC(waveConfig) {
    return -waveConfig.phaseShift;
}

function findAD(waveConfig) {
    const newRangeDifference = waveConfig.rangeMax - rangeMin;
    const oldRangeDifference = waveConfig.carrierRangeMax - waveConfig.carrierRangeMin;
    const A = (oldRangeDifference == 0)
        ? 0
        : newRangeDifference / oldRangeDifference;
    const D = waveConfig.rangeMin - (A * waveConfig.carrierRangeMin);
    return {A:A, D:D};
}

export default utility;