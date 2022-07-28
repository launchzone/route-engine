'use strict'

const {BigNumber} = require('@ethersproject/bignumber')
const {Heximal} = require('./heximal')

/**
 *
 * @param {Heximal} value
 * @return {BigNumber}
 * @throws {TypeError}
 */
BigNumber.fromHeximal = function(value) {
    let e1 = Heximal.validate(value)
    if (e1) {
        throw new TypeError(e1)
    }
    return BigNumber.from(value)
}

module.exports = {
    BigNumber
}
