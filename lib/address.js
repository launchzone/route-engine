'use strict'

const {validateInstance} = require('./validator')
const {Heximal} = require('./heximal')
const {Buffer} = require('./buffer')

/**
 * @private
 */
class Address {
    /**
     * @type {Buffer}
     */
    get value() {
        return this._value
    }

    /**
     *
     * @param {Buffer} value
     */
    constructor(value) {
        this._value = value
    }

    /**
     *
     * @param {Heximal} value
     * @return {Address}
     * @throws {TypeError}
     */
    static fromHeximal(value) {
        let e1 = Address.validateHeximal(value)
        if (e1) {
            throw new TypeError(e1)
        }
        let heximal = value.slice(2)
        let buffer = Buffer.from(heximal, 'hex')
        return new Address(buffer)
    }

    /**
     *
     * @param {Buffer} value
     * @return {Address}
     * @throws {TypeError}
     */
    static fromBuffer(value) {
        if (
            ((value instanceof Buffer) !== true) ||
            (value.length !== 20)
        ) {
            throw new TypeError('expect type Buffer 20 bytes')
        }
        return new Address(value)
    }

    /**
     *
     * @param {any} value
     * @return {undefined | string}
     */
    static validateHeximal(value) {
        let pattern = /^0x[a-fA-F0-9]{40}$/
        return (pattern.test(value) === true)
            ? undefined
            : 'expect type Heximal 20 bytes'
    }

    /**
     * @return {Heximal}
     */
    toHeximal() {
        return '0x' + this._value.toString('hex')
    }

    /**
     *
     * @param {Address} target
     * @return {boolean}
     * @throws {TypeError}
     */
    eq(target) {
        let e1 = validateInstance(target, Address)
        if (e1) {
            throw new TypeError(e1)
        }
        return (this._value.compare(target._value) === 0)
    }

    /**
     *
     * @param {Address} target
     * @return {boolean}
     * @throws {TypeError}
     */
    lt(target) {
        let e1 = validateInstance(target, Address)
        if (e1) {
            throw new TypeError(e1)
        }
        return (this._value.compare(target._value) === -1)
    }
}

module.exports = {
    Address
}
