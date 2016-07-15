const WaveConfig = class WaveConfig {
    constructor() {
        this.carrier = x => x;
        this.frequency = 1;
        this.frequencyModulator = x => 1;
        this.rangeMin = 0;
        this.rangeMax = 1;
        this.rangeModulator = x => 1;
        this.phaseShift = 0;
        this.phaseModulator = x => 0;
        this.carrierRangeMin = 0;
        this.carrierRangeMax = 1;
        this.carrierFrequency = 1;
    }

    copy() {
        const result = {};
        result.carrier = this.carrier;
        result.frequency = this.frequency;
        result.frequencyModulator = this.frequencyModulator;
        result.rangeMin = this.rangeMin;
        result.rangeMax = this.rangeMax;
        result.rangeModulator = this.rangeModulator;
        result.phaseShift = this.phaseShift;
        result.phaseModulator = this.phaseModulator;
        result.carrierRangeMin = this.carrierRangeMin;
        result.carrierRangeMax = this.carrierRangeMax;
        result.carrierFrequency = this.carrierFrequency;
    }
}

export default WaveConfig;