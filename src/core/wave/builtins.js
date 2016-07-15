const builtins = class builtins {
    static linear(x) {
        return x % 1;
    }

    //todo generate using fft?
    static sawtooth(x) {
        return linear(x);
    }

    static saw(x) {
        return sawtooth(x);
    }

    static sine(x) {
        return Math.sin(x * Math.PI * 2) * 0.5 + 0.5;
    }

    static triangle(x) {
        return Math.abs(((0.5 + x) % 1) - 0.5) * 2;
    }

    static square(x) {
        Math.sign(builtins.sine(x));
    }

    //todo: make this periodic
    static round(x) {
        const rad = Math.PI / 2;
        const down = 3 * rad;
        const turn = x * rad;
        return 1 + Math.sin(down + turn)
    }

    //linear from 1 (exclusive) down to 0 (inclusive)
    static reverse(x) {
        return 1 - Number.EPSILON - x;
    }
} 