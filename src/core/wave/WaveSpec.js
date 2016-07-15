const WaveSpec = class WaveSpec {
    constructor() {
        this.carrier = x => x;
        this.A = 1;
        this.B = 1;
        this.C = 0;
        this.D = 0;
        this.frequencyModulator = x => 1;
        this.rangeModulator = x => 1;
        this.phaseModulator = x => 0;
    }
}

export default WaveSpec;