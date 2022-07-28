'use strict'

const {BigNumber} = require('./bignumber')
const {Buffer} = require('./buffer')

/**
 * @private
 */
class BigFractionNumber {
    /**
     *
     * @param {number | string | BigNumber | Buffer} dividend
     * @param {number | string | BigNumber | Buffer} divisor
     */
    constructor(dividend, divisor) {
        this._divisor = BigFractionNumber._toBigNumber(divisor)
        if (this._divisor.isZero()) {
            throw Error('Divisor is zero')
        }
        this._dividend = BigFractionNumber._toBigNumber(dividend)
    }

    /**
     * @type {BigNumber}
     */
    get dividend() {
        return this._dividend
    }

    /**
     * @type {BigNumber}
     */
    get divisor() {
        return this._divisor
    }

    /**
     *
     * @param {BigNumber | BigFractionNumber} otherValue
     * @return {boolean}
     * `true` - This number is less than otherValue.
     * `false` - This number is greater than or equal otherValue.
     */
    lt(otherValue) {
        let n = BigFractionNumber._toBigFractionNumber(otherValue)
        let ad = this._dividend.mul(n._divisor)
        let bc = this._divisor.mul(n._dividend)
        return ad.sub(bc).lt(0)
    }

    /**
     *
     * @param {BigNumber | BigFractionNumber} otherValue
     * @return {boolean}
     * `true` - This number is greater than otherValue.
     * `false` - This number is less than or equal otherValue.
     */
    gt(otherValue) {
        let n = BigFractionNumber._toBigFractionNumber(otherValue)
        let ad = this._dividend.mul(n._divisor)
        let bc = this._divisor.mul(n._dividend)
        return ad.sub(bc).gt(0)
    }

    /**
     *
     * @param {BigNumber | BigFractionNumber} otherValue
     * @return {BigFractionNumber}
     */
    eq(otherValue) {
        let n = BigFractionNumber._toBigFractionNumber(otherValue)
        let ad = this._dividend.mul(n._divisor)
        let bc = this._divisor.mul(n._dividend)
        return ad.sub(bc).isZero()
    }

    /**
     *
     * @param {BigNumber | BigFractionNumber} otherValue
     * @return {BigFractionNumber}
     */
    sub(otherValue) {
        let n = BigFractionNumber._toBigFractionNumber(otherValue)
        let ad = this._dividend.mul(n._divisor)
        let bc = this._divisor.mul(n._dividend)
        let bd = this._divisor.mul(n._divisor)
        return new BigFractionNumber(ad.sub(bc), bd)
    }

    /**
     *
     * @param {BigNumber | BigFractionNumber} otherValue
     * @return {BigFractionNumber}
     */
    mul(otherValue) {
        let n = BigFractionNumber._toBigFractionNumber(otherValue)
        let dividend = this._dividend.mul(n._dividend)
        let divisor = this._divisor.mul(n._divisor)
        if (dividend.isZero()) {
            divisor = BigNumber.from(1)
        }
        return new BigFractionNumber(dividend, divisor)
    }

    /**
     *
     * @param {BigNumber | BigFractionNumber} otherValue
     * @return {BigFractionNumber}
     * @throws {Error}
     */
    div(otherValue) {
        let n = BigFractionNumber._toBigFractionNumber(otherValue)
        if (n.eq(0)) {
            throw new Error('Divide by zero')
        }
        let dividend = this._dividend.mul(n._divisor)
        let divisor = this._divisor.mul(n._dividend)
        return new BigFractionNumber(dividend, divisor)
    }

    /**
     * @return {BigFractionNumber} A new instance, reversed of this number.
     */
    reverse() {
        return new BigFractionNumber(this._divisor, this._dividend)
    }

    /**
     * @return {BigFractionNumber} Absolute value of this number.
     */
    abs() {
        return new BigFractionNumber(
            this._dividend.abs(),
            this._divisor.abs()
        )
    }

    /**
     * Convert this number to a Javascript number.
     *
     * @return {number}
     */
    toNumber() {
        let s = this.format(20, 0)
        return Number.parseFloat(s)
    }

    /**
     * @return {BigNumber}
     */
    toBigNumber() {
        return this._dividend.div(this._divisor)
    }

    /**
     * Make a new instance that have the same value.
     *
     * @return {BigFractionNumber}
     */
    clone() {
        return new BigFractionNumber(this._dividend, this._divisor)
    }

    /**
     *
     * @param {...BigFractionNumber} numbers
     * @return {BigFractionNumber}
     */
    static min(...numbers) {
        let smallest = numbers[0]
        for (let number of numbers) {
            if (number.lt(smallest)) {
                smallest = number
            }
        }
        return smallest
    }

    /**
     *
     * @param {...BigFractionNumber} numbers
     * @return {BigFractionNumber}
     */
    static max(...numbers) {
        let greatest = numbers[0]
        for (let number of numbers) {
            if (number.gt(greatest)) {
                greatest = number
            }
        }
        return greatest
    }

    /**
     *
     * @param {string | number | BigNumber | Buffer} numeral
     * @return {BigNumber}
     * @throws {TypeError}
     */
    static _toBigNumber(numeral) {
        try {
            return BigNumber.from(numeral)
        }
        catch (error) {
            throw new TypeError('Invalid numeral')
        }
    }

    /**
     *
     * @param {number | BigNumber | BigFractionNumber} n
     * @return {BigFractionNumber}
     * @throws {TypeError}
     */
    static _toBigFractionNumber(n) {
        if (n instanceof BigNumber || (typeof n) === 'number') {
            return new BigFractionNumber(n, BigNumber.from(1))
        }
        if (n instanceof BigFractionNumber) {
            return n
        }
        throw new TypeError('Not a big number')
    }

    static _TEN = BigNumber.from(10)

    static _removeLastZeroDigits(string) {
        for (let i = string.length - 1; i >= 0; --i) {
            if (string[i] !== '0') {
                return string.slice(0, i + 1)
            }
        }
        return '0'
    }
}

module.exports = {
    BigFractionNumber
}
