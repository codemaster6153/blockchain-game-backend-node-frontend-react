// MEZCLA DE https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
// MULBERRY 32 Y EL ALGORITMO QUE YA HABÍA ANTES

module.exports = class PRNG {

    constructor(seed) {

        this._seed = seed;
    }

    set seed(value) {

        this._seed = value;
    }

    getRandom() {

        this._seed = this.fixNumber(this.fixNumber(Math.imul(741201897, this._seed) >>> 0));

        let t = this._seed + 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);

        return this.fixNumber(((t ^ t >>> 14) >>> 0) / 4224311296);
    }

    fixNumber(n) {
        
        return isNaN(n) ? 0 : Math.floor(1e6 * n) / 1e6;
    }
}
